import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  studentService,
  type StudentCourseGradesDetailResponse,
  type StudentGradeDetailCourse,
} from "@/services/studentService";

function fmtDate(value: string) {
  return new Date(value).toLocaleString();
}

export default function StudentGradesPage() {
  const { accessToken } = useAuth();
  const [courses, setCourses] = useState<StudentGradeDetailCourse[]>([]);
  const [cumulativeGpa, setCumulativeGpa] = useState(0);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<StudentCourseGradesDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingCourse, setLoadingCourse] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      if (!accessToken) return;
      setLoading(true);
      try {
        const data = await studentService.getGradesDetails(accessToken);
        setCourses(data.courses || []);
        setCumulativeGpa(Number(data.cumulative_gpa || 0));
        setError("");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load grades.");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [accessToken]);

  async function openCourse(courseId: number) {
    if (!accessToken) return;
    setSelectedCourseId(courseId);
    setLoadingCourse(true);
    try {
      const detail = await studentService.getCourseGradesDetails(accessToken, courseId);
      setSelectedDetail(detail);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load course details.");
    } finally {
      setLoadingCourse(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <section className="rounded-2xl bg-gradient-to-r from-slate-800 via-slate-700 to-blue-800 p-6 text-white shadow-lg">
          <h1 className="text-3xl font-semibold">My Grades</h1>
          <p className="mt-2 text-sm text-slate-200">Cumulative GPA</p>
          <p className="mt-1 text-4xl font-bold">{cumulativeGpa.toFixed(2)}</p>
        </section>

        {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}
        {loading ? <p className="mt-4 text-sm text-slate-300">Loading grades...</p> : null}

        {!loading ? (
          <section className="mt-6 grid gap-6 lg:grid-cols-[360px,1fr]">
            <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
              <h2 className="text-lg font-semibold text-slate-100">Courses</h2>
              {!courses.length ? <p className="mt-2 text-sm text-slate-400">No enrolled courses found.</p> : null}
              <div className="mt-3 space-y-2">
                {courses.map((course) => (
                  <button
                    key={course.course_id}
                    type="button"
                    onClick={() => void openCourse(course.course_id)}
                    className={`w-full rounded-lg border p-3 text-left transition ${
                      selectedCourseId === course.course_id
                        ? "border-sky-500 bg-slate-700"
                        : "border-slate-700 bg-slate-900 hover:border-slate-600"
                    }`}
                  >
                    <p className="text-sm font-semibold text-slate-100">{course.course_title}</p>
                    <p className="mt-1 text-xs text-slate-400">GPA: {Number(course.gpa || 0).toFixed(2)}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
              {!selectedCourseId ? <p className="text-sm text-slate-400">Select a course to view quizzes, discussions, assignments, and exams.</p> : null}
              {loadingCourse ? <p className="text-sm text-slate-300">Loading course details...</p> : null}
              {selectedDetail ? (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-100">{selectedDetail.course.title}</h2>
                    <p className="text-sm text-slate-400">Course GPA: {Number(selectedDetail.course.gpa || 0).toFixed(2)}</p>
                  </div>

                  <section>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Quizzes</h3>
                    {!selectedDetail.quizzes.length ? <p className="mt-2 text-sm text-slate-400">No quiz attempts.</p> : null}
                    <div className="mt-2 space-y-2">
                      {selectedDetail.quizzes.map((item) => (
                        <div key={item.result_id} className="rounded border border-slate-700 bg-slate-900 p-3 text-sm text-slate-200">
                          <p className="font-medium">{item.title}</p>
                          <p className="text-xs text-slate-400">Score: {item.score}/{item.total_marks} ({item.percent.toFixed(2)}%)</p>
                          <p className="text-xs text-slate-500">{fmtDate(item.submitted_at)}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Assignments</h3>
                    {!selectedDetail.assignments.length ? <p className="mt-2 text-sm text-slate-400">No assignment records.</p> : null}
                    <div className="mt-2 space-y-2">
                      {selectedDetail.assignments.map((item) => (
                        <div key={item.result_id} className="rounded border border-slate-700 bg-slate-900 p-3 text-sm text-slate-200">
                          <p className="font-medium">{item.title}</p>
                          <p className="text-xs text-slate-400">Score: {item.score}/{item.total_marks} ({item.percent.toFixed(2)}%)</p>
                          <p className="text-xs text-slate-500">{fmtDate(item.submitted_at)}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Exams</h3>
                    {!selectedDetail.exams.length ? <p className="mt-2 text-sm text-slate-400">No exam records.</p> : null}
                    <div className="mt-2 space-y-2">
                      {selectedDetail.exams.map((item) => (
                        <div key={item.result_id} className="rounded border border-slate-700 bg-slate-900 p-3 text-sm text-slate-200">
                          <p className="font-medium">{item.title}</p>
                          <p className="text-xs text-slate-400">Score: {item.score}/{item.total_marks} ({item.percent.toFixed(2)}%)</p>
                          <p className="text-xs text-slate-500">{fmtDate(item.submitted_at)}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Discussions</h3>
                    {!selectedDetail.discussions.posts.length && !selectedDetail.discussions.replies.length ? (
                      <p className="mt-2 text-sm text-slate-400">No discussion activity.</p>
                    ) : null}
                    <div className="mt-2 space-y-2">
                      {selectedDetail.discussions.posts.map((post) => (
                        <div key={`p-${post.id}`} className="rounded border border-slate-700 bg-slate-900 p-3 text-sm text-slate-200">
                          <p className="font-medium">Post</p>
                          <p className="mt-1">{post.content}</p>
                          <p className="text-xs text-slate-500">{fmtDate(post.created_at)}</p>
                        </div>
                      ))}
                      {selectedDetail.discussions.replies.map((reply) => (
                        <div key={`r-${reply.id}`} className="rounded border border-slate-700 bg-slate-900 p-3 text-sm text-slate-200">
                          <p className="font-medium">Reply</p>
                          <p className="mt-1">{reply.content}</p>
                          <p className="text-xs text-slate-500">{fmtDate(reply.created_at)}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              ) : null}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}

