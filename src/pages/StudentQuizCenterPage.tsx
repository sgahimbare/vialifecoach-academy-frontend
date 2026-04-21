import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { courseService, type CourseItem, type EnrollmentItem } from "@/services/courseService";

export default function StudentQuizCenterPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [enrollments, setEnrollments] = useState<EnrollmentItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const [data, enrolled] = await Promise.all([
          courseService.getCourses(),
          user?.id ? courseService.getUserEnrollments(user.id) : Promise.resolve([]),
        ]);
        if (isMounted) setCourses(data);
        if (isMounted) setEnrollments(enrolled);
      } catch {
        if (isMounted) setCourses([]);
      }
    }
    void load();
    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const enrolledIds = new Set(enrollments.map((item) => Number(item.course_id)));
  const enrolledCourses = courses.filter((course) => enrolledIds.has(Number(course.id)));

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-semibold">Quiz Center</h1>
      <p className="mt-1 text-sm text-gray-600">Pick a course and complete quiz rules first.</p>
      <ul className="mt-4 space-y-3">
        {enrolledCourses.map((course) => (
          <li className="rounded border p-3" key={course.id}>
            <div className="flex items-center justify-between">
              <span>{course.title}</span>
              <Link className="text-sm underline" to={`/student/quiz/${course.id}/rules`}>
                Open rules
              </Link>
            </div>
          </li>
        ))}
      </ul>
      {!enrolledCourses.length ? (
        <p className="mt-3 text-sm text-gray-600">No enrolled courses yet. Enroll from Student Courses first.</p>
      ) : null}
    </main>
  );
}
