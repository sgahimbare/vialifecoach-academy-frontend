import { useEffect, useState } from "react";
import { courseService, type CourseItem } from "@/services/courseService";
import { ApiCourseCard } from "@/components/common/ApiCourseCard";
import { useAuth } from "@/context/AuthContext";
import { extractApiErrorMessage } from "@/lib/apiError";
import { studentService } from "@/services/studentService";

export default function StudentCoursesPage() {
  const { user, accessToken } = useAuth();
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<Set<number>>(new Set());
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        if (accessToken) {
          const data = await studentService.getCatalog(accessToken);
          if (isMounted) {
            setCourses(
              data.map((item) => ({
                id: item.id,
                title: item.title,
                description: item.short_description || "",
                short_description: item.short_description || undefined,
                duration_weeks: item.duration_weeks || undefined,
                category: item.category_name || undefined,
              }))
            );
            setEnrolledIds(new Set(data.filter((item) => item.enrolled).map((item) => Number(item.id))));
          }
          return;
        }

        const [data, enrollments] = await Promise.all([
          courseService.getCourses(),
          user?.id ? courseService.getUserEnrollments(user.id) : Promise.resolve([]),
        ]);
        if (isMounted) {
          setCourses(data);
          setEnrolledIds(new Set(enrollments.map((item) => Number(item.course_id))));
        }
      } catch {
        if (isMounted) setCourses([]);
      }
    }
    void load();
    return () => {
      isMounted = false;
    };
  }, [user?.id, accessToken]);

  async function enroll(courseId: number) {
    if (!user?.id) return;
    setFeedback("");
    try {
      await courseService.enrollCourse(user.id, courseId);
      setEnrolledIds((prev) => new Set([...prev, courseId]));
      setFeedback("Enrollment successful.");
    } catch (error) {
      setFeedback(extractApiErrorMessage(error, "Enrollment failed."));
    }
  }

  return (
    <main className="min-h-screen bg-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-8">
      <h1 className="text-3xl font-semibold text-slate-100">My Courses</h1>
      <p className="mt-1 text-sm text-slate-400">Continue learning from your enrolled courses.</p>
      {feedback ? <p className="mt-2 text-sm text-emerald-400">{feedback}</p> : null}
      
      {/* EMBEDDED COURSEBOX COURSE */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-slate-100 mb-4">Featured Interactive Course</h2>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <article className="overflow-hidden rounded-2xl transition-all duration-200 hover:-translate-y-1 border border-slate-700 bg-slate-800 shadow-[0_8px_24px_rgba(0,0,0,0.28)] hover:shadow-[0_14px_32px_rgba(0,0,0,0.38)]">
            {/* Course Thumbnail - Professional Image */}
            <div 
              className="h-44 w-full relative cursor-pointer group"
              onClick={() => window.open('https://my.coursebox.ai/courses/216034/about', '_blank')}
            >
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"
                alt="Premium Coursebox Course"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Overlay with play button */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/90 rounded-full p-3 shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300">
                    <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white text-sm font-semibold">Click to open course</p>
                </div>
              </div>
              {/* Course badge overlay */}
              <div className="absolute top-3 left-3">
                <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-purple-600 text-white shadow-lg">
                  Interactive Course
                </span>
              </div>
            </div>
            
            <div className="p-5">
              <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-purple-900 text-purple-300">
                Interactive Course
              </span>
              <h2 className="mt-3 line-clamp-2 text-lg font-semibold text-slate-100">The Confidence Code: Building Unstoppable Self-Belief</h2>
              <p className="mt-2 line-clamp-2 text-sm text-slate-300">
                Access our premium interactive course content with advanced features and certification.
              </p>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <span>Self-paced</span>
                <span>Certificate</span>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => window.open('https://my.coursebox.ai/courses/216034/about', '_blank')}
                  className="flex-1 inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white bg-blue-700 hover:bg-blue-600 transition-colors"
                >
                  View Course
                </button>
                <button
                  onClick={() => window.open('https://my.coursebox.ai/courses/216034/about', '_blank')}
                  className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-purple-400 bg-purple-900/50 hover:bg-purple-900 transition-colors"
                  title="Open in new tab"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </button>
              </div>
            </div>
          </article>

          {/* SECOND COURSE - EMBEDDED IFRAME */}
          <article className="overflow-hidden rounded-2xl transition-all duration-200 hover:-translate-y-1 border border-slate-700 bg-slate-800 shadow-[0_8px_24px_rgba(0,0,0,0.28)] hover:shadow-[0_14px_32px_rgba(0,0,0,0.38)]">
            {/* Course Thumbnail - Professional Image */}
            <div 
              className="h-44 w-full relative cursor-pointer group"
              onClick={() => window.open('https://my.coursebox.ai/courses/216047/about', '_blank')}
            >
              <img
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80"
                alt="Recognizing and Overcoming Manipulative Relationships"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Overlay with play button */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/90 rounded-full p-3 shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300">
                    <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white text-sm font-semibold">Click to open course</p>
                </div>
              </div>
              {/* Course badge overlay */}
              <div className="absolute top-3 left-3">
                <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-blue-600 text-white shadow-lg">
                  Relationship Course
                </span>
              </div>
            </div>
            
            <div className="p-5">
              <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-blue-900 text-blue-300">
                Relationship Course
              </span>
              <h2 className="mt-3 line-clamp-2 text-lg font-semibold text-slate-100">Recognizing and Overcoming Manipulative Relationships</h2>
              <p className="mt-2 line-clamp-2 text-sm text-slate-300">
                Learn to identify and navigate complex relationship dynamics with confidence and clarity.
              </p>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <span>Self-paced</span>
                <span>Certificate</span>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => window.open('https://my.coursebox.ai/courses/216047/about', '_blank')}
                  className="flex-1 inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 transition-colors"
                >
                  View Course
                </button>
                <button
                  onClick={() => window.open('https://my.coursebox.ai/courses/216047/about', '_blank')}
                  className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-blue-400 bg-blue-900/50 hover:bg-blue-900 transition-colors"
                  title="Open in new tab"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
      
      {/* ENROLLED COURSES SECTION */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-slate-100 mb-4">Enrolled Courses</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {courses.map((course) => (
            <div key={course.id} className="space-y-2">
              <ApiCourseCard
                id={course.id}
                title={course.title}
                description={course.short_description || course.description}
                category={course.category}
                durationWeeks={course.duration_weeks}
                hasCertificate={course.has_certificate}
                to={`/student/courses/${course.id}/overview`}
                darkMode
              />
              {!enrolledIds.has(Number(course.id)) ? (
                <button
                  type="button"
                  onClick={() => void enroll(Number(course.id))}
                  className="w-full rounded-lg border border-blue-500 bg-slate-800 px-4 py-2 text-sm font-medium text-blue-300 hover:bg-slate-700"
                >
                  Enroll Now
                </button>
              ) : (
                <p className="text-center text-xs font-medium text-emerald-400">Enrolled</p>
              )}
            </div>
          ))}
        </div>
      </div>
      </div>
    </main>
  );
}
