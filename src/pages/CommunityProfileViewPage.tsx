import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { communityService, type CommunityContactProfile } from "@/services/communityService";

function roleLabel(role?: string) {
  const value = String(role || "").toLowerCase();
  if (value === "instructor" || value === "lecturer" || value === "teacher") return "Lecturer";
  if (!value) return "User";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function CommunityProfileViewPage() {
  const { userId } = useParams();
  const { accessToken } = useAuth();
  const location = useLocation();
  const [profile, setProfile] = useState<CommunityContactProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isStudentBoard = location.pathname.startsWith("/student/");

  useEffect(() => {
    async function loadProfile() {
      if (!accessToken || !userId) return;
      setLoading(true);
      try {
        const parsed = Number(userId);
        if (!parsed) throw new Error("Invalid profile id.");
        const data = isStudentBoard
          ? await communityService.getStudentCommunityProfile(accessToken, parsed)
          : await communityService.getCommunityProfile(accessToken, parsed);
        setProfile(data);
        setError("");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    }
    void loadProfile();
  }, [accessToken, userId, isStudentBoard]);

  const initials = useMemo(() => {
    const source = profile?.name || "U";
    return source
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [profile?.name]);

  const courseBasePath = isStudentBoard ? "/student/courses" : "/courses";

  return (
    <main className={isStudentBoard ? "min-h-screen bg-slate-900" : "min-h-screen bg-slate-50"}>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? <p className={isStudentBoard ? "text-slate-300" : "text-slate-600"}>Loading profile...</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {!loading && !error && profile ? (
          <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
            <aside className={`rounded-2xl border p-6 ${isStudentBoard ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"}`}>
              <div className="flex flex-col items-center text-center">
                {profile.photo_url ? (
                  <img src={profile.photo_url} alt={profile.name} className="h-28 w-28 rounded-full object-cover" />
                ) : (
                  <div className={`flex h-28 w-28 items-center justify-center rounded-full text-3xl font-semibold ${isStudentBoard ? "bg-slate-700 text-slate-100" : "bg-slate-100 text-slate-700"}`}>
                    {initials}
                  </div>
                )}
                <p className={`mt-4 text-xl font-semibold ${isStudentBoard ? "text-slate-100" : "text-slate-800"}`}>{profile.name}</p>
                <p className={`text-xs uppercase tracking-wide ${isStudentBoard ? "text-slate-400" : "text-slate-500"}`}>{roleLabel(profile.role)}</p>
                <p className={`mt-1 text-xs ${isStudentBoard ? "text-slate-400" : "text-slate-500"}`}>Status: {profile.status || "active"}</p>
              </div>
              <div className="mt-5 space-y-2 text-sm">
                {profile.email ? <p className={isStudentBoard ? "text-slate-300" : "text-slate-700"}>{profile.email}</p> : null}
                {profile.phone ? <p className={isStudentBoard ? "text-slate-300" : "text-slate-700"}>{profile.phone}</p> : null}
                {(profile.city || profile.state || profile.country) ? (
                  <p className={isStudentBoard ? "text-slate-300" : "text-slate-700"}>
                    {[profile.city, profile.state, profile.country].filter(Boolean).join(", ")}
                  </p>
                ) : null}
              </div>
            </aside>

            <section className={`rounded-2xl border p-6 ${isStudentBoard ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"}`}>
              <h1 className={`text-2xl font-semibold ${isStudentBoard ? "text-slate-100" : "text-slate-800"}`}>Full Profile</h1>
              <p className={`mt-1 text-sm ${isStudentBoard ? "text-slate-400" : "text-slate-500"}`}>
                Courses are shown automatically from enrollments.
              </p>

              <div className="mt-5">
                <h2 className={`text-base font-semibold ${isStudentBoard ? "text-slate-100" : "text-slate-800"}`}>Bio</h2>
                <p className={`mt-1 whitespace-pre-wrap text-sm ${isStudentBoard ? "text-slate-300" : "text-slate-700"}`}>
                  {profile.bio || "No bio available yet."}
                </p>
              </div>

              <div className="mt-6">
                <h2 className={`text-base font-semibold ${isStudentBoard ? "text-slate-100" : "text-slate-800"}`}>Enrolled Courses</h2>
                {!profile.enrolled_courses?.length ? (
                  <p className={`mt-2 text-sm ${isStudentBoard ? "text-slate-400" : "text-slate-500"}`}>No enrollments found.</p>
                ) : (
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {profile.enrolled_courses.map((course) => (
                      <Link
                        key={course.id}
                        to={`${courseBasePath}/${course.id}/overview`}
                        className={`rounded-xl border p-3 transition hover:border-sky-500 ${
                          isStudentBoard ? "border-slate-700 bg-slate-900 text-slate-100" : "border-slate-200 bg-slate-50 text-slate-800"
                        }`}
                      >
                        <p className="text-sm font-semibold">{course.title}</p>
                        <p className={isStudentBoard ? "mt-1 text-xs text-slate-400" : "mt-1 text-xs text-slate-500"}>
                          Enrolled: {course.enrolled_at ? new Date(course.enrolled_at).toLocaleDateString() : "N/A"}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        ) : null}
      </div>
    </main>
  );
}
