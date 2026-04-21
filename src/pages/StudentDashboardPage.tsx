import { useAuth } from "@/context/AuthContext";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { courseService, type CourseItem, type EnrollmentItem } from "@/services/courseService";
import { extractApiErrorMessage } from "@/lib/apiError";
import { studentService } from "@/services/studentService";
import { communityService } from "@/services/communityService";

export default function StudentDashboardPage() {
  const { user, accessToken, logout } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [enrollments, setEnrollments] = useState<EnrollmentItem[]>([]);
  const [coursesError, setCoursesError] = useState("");
  const [enrollError, setEnrollError] = useState("");
  const [cumulativeGpa, setCumulativeGpa] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setCoursesError("");
      setEnrollError("");
      try {
        const all = await courseService.getCourses();
        if (mounted) setCourses(all);
      } catch (error) {
        if (mounted) {
          setCourses([]);
          setCoursesError(extractApiErrorMessage(error, "Unable to load courses right now."));
        }
      }
      if (!user?.id) return;
      try {
        const enrolled = await courseService.getUserEnrollments(user.id);
        if (mounted) setEnrollments(enrolled);
      } catch (error) {
        if (mounted) {
          setEnrollments([]);
          setEnrollError(extractApiErrorMessage(error, "Unable to load your enrollments right now."));
        }
      }
      if (!accessToken) return;
      try {
        const grades = await studentService.getGrades(accessToken);
        if (mounted) setCumulativeGpa(Number(grades.cumulative_gpa || 0));
      } catch {
        if (mounted) setCumulativeGpa(0);
      }
      try {
        const contacts = await communityService.getStudentChatContacts(accessToken);
        const unreadTotal = contacts.reduce((sum, item) => sum + Number(item.unread_count || 0), 0);
        if (mounted) setUnreadMessages(unreadTotal);
      } catch {
        if (mounted) setUnreadMessages(0);
      }
    }
    void load();
    return () => {
      mounted = false;
    };
  }, [user?.id, accessToken]);

  const enrolledIds = useMemo(() => new Set(enrollments.map((e) => Number(e.course_id))), [enrollments]);
  const enrolledCourses = useMemo(
    () => courses.filter((course) => enrolledIds.has(Number(course.id))),
    [courses, enrolledIds]
  );
  const availableCount = Math.max(courses.length - enrolledCourses.length, 0);

  const featureItems = [
    {
      title: "Course Catalog",
      description: "Browse all published courses from backend catalog.",
      href: "/student/catalog",
      status: courses.length ? "Active" : "Empty",
    },
    {
      title: "My Enrollments",
      description: "Tracks course access using enrollment records.",
      href: "/student/courses",
      status: enrolledCourses.length ? "Active" : "No Enrollment",
    },
    {
      title: "Quiz Center",
      description: "Quiz rules acknowledgment and quiz start flow.",
      href: "/student/quiz-center",
      status: enrolledCourses.length ? "Ready" : "Locked",
    },
    {
      title: "Profile",
      description: "Account details and user profile management.",
      href: "/student/profile",
      status: "Active",
    },
    {
      title: "Community",
      description: "Student-only discussion groups and live messaging.",
      href: "/student/community",
      status: unreadMessages > 0 ? `${unreadMessages} New` : "Active",
    },
    {
      title: "Support",
      description: "Raise and track tickets inside your student board.",
      href: "/student/support",
      status: "Active",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-2xl bg-gradient-to-r from-[#102347] via-[#173C6C] to-[#1F4E8C] p-6 text-white shadow-lg">
          <h1 className="text-3xl font-semibold">Student Dashboard</h1>
          <p className="mt-2 text-sm text-[#D9E6FF]">
            Welcome, {user?.name}. Your backend-connected student portal is ready.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-white/20 bg-white/10 p-3">Enrolled Courses: {enrolledCourses.length}</div>
            <div className="rounded-lg border border-white/20 bg-white/10 p-3">Available Courses: {availableCount}</div>
            <button
              type="button"
              onClick={() => navigate("/student/grades")}
              className="rounded-lg border border-white/20 bg-white/10 p-3 text-left hover:bg-white/20"
            >
              Cumulative GPA: {cumulativeGpa.toFixed(2)}
            </button>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900" to="/student/courses">
              Browse Courses
            </Link>
            <Link className="rounded-lg border border-white/40 px-4 py-2 text-sm" to="/student/quiz-center">
              Go To Quiz Center
            </Link>
            <button type="button" onClick={() => navigate("/")} className="rounded-lg border border-white/40 px-4 py-2 text-sm">
              Go Home
            </button>
            <button type="button" onClick={() => navigate(-1)} className="rounded-lg border border-white/40 px-4 py-2 text-sm">
              Go Back
            </button>
            <button
              type="button"
              onClick={() => {
                void logout();
                navigate("/login", { replace: true });
              }}
              className="rounded-lg border border-[#FFD3D3] bg-[#7A1D1D] px-4 py-2 text-sm text-white"
            >
              Logout
            </button>
          </div>
        </div>

        {(coursesError || enrollError) ? (
          <section className="mt-4 rounded-xl border border-rose-800 bg-rose-950/60 p-4 text-sm text-rose-200">
            {coursesError ? <p>{coursesError}</p> : null}
            {enrollError ? <p>{enrollError}</p> : null}
          </section>
        ) : null}

        <section className="mt-6">
          <h2 className="text-xl font-semibold text-slate-100">Portal Features</h2>
          <p className="mt-1 text-sm text-slate-400">
            These are the core student features currently available from your frontend and backend integration.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featureItems.map((feature) => (
              <Link
                key={feature.title}
                to={feature.href}
                className="rounded-xl border border-slate-700 bg-slate-800 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-semibold text-slate-100">{feature.title}</h3>
                  <span className="rounded-full bg-blue-900 px-2 py-1 text-xs font-medium text-blue-200">{feature.status}</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">{feature.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-xl border border-slate-700 bg-slate-800 p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-100">My Enrolled Courses</h2>
          {!enrolledCourses.length ? (
            <p className="mt-2 text-sm text-slate-400">No enrollments yet. Open Courses and enroll in one.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {enrolledCourses.map((course) => (
                <li key={course.id} className="flex items-center justify-between rounded-lg border border-slate-700 p-3">
                  <span className="text-sm text-slate-200">{course.title}</span>
                  <Link className="text-sm font-medium text-blue-300 underline" to={`/student/courses/${course.id}/overview`}>
                    Continue
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
