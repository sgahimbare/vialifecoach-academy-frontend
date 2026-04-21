import { useEffect, useState } from "react";
import { Star, MessageCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { communityService, type CommunityMentor } from "@/services/communityService";

export function CommunityMentorship({ studentMode = false }: { studentMode?: boolean }) {
  const { accessToken } = useAuth();
  const [mentors, setMentors] = useState<CommunityMentor[]>([]);
  const [error, setError] = useState("");

  async function load() {
    if (!accessToken) return;
    try {
      const data = await communityService.getMentors(accessToken);
      setMentors(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load mentors");
    }
  }

  useEffect(() => {
    void load();
  }, [accessToken]);

  async function requestMentor(mentorId: number) {
    if (!accessToken) return;
    await communityService.requestMentor(accessToken, mentorId);
    await load();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-xl font-bold ${studentMode ? "text-slate-100" : "text-slate-800"}`}>Mentorship Matching</h2>
        <p className={`mt-1 text-sm ${studentMode ? "text-slate-400" : "text-slate-500"}`}>Real mentor records and request workflow</p>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {!mentors.length ? <p className={`text-sm ${studentMode ? "text-slate-400" : "text-slate-500"}`}>No mentors available yet.</p> : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {mentors.map((mentor) => (
          <div
            key={mentor.id}
            className={`rounded-2xl border shadow-sm p-6 flex flex-col gap-4 ${
              studentMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-sky-700 flex items-center justify-center text-white text-sm font-semibold">
                {mentor.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className={`font-semibold ${studentMode ? "text-slate-100" : "text-slate-800"}`}>{mentor.name}</p>
                <div className={`flex items-center gap-1 text-xs ${studentMode ? "text-slate-400" : "text-slate-500"}`}>
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {mentor.rating} · {mentor.sessions} sessions
                </div>
              </div>
            </div>
            <p className={`text-sm ${studentMode ? "text-slate-300" : "text-slate-600"}`}>{mentor.bio || "No bio provided."}</p>
            <div className="flex flex-wrap gap-1.5">
              {(mentor.expertise || []).map((tag) => (
                <span
                  key={tag}
                  className={`text-xs rounded-full px-2 py-1 ${
                    studentMode ? "bg-slate-700 text-blue-300" : "bg-sky-50 text-sky-700"
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
            <button
              onClick={() => void requestMentor(mentor.id)}
              disabled={!mentor.available || mentor.requested}
              className="mt-auto flex items-center justify-center gap-1.5 rounded-xl bg-sky-700 px-4 py-2 text-xs font-medium text-white disabled:opacity-50"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              {mentor.requested ? "Request Sent" : mentor.available ? "Request Session" : "Unavailable"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
