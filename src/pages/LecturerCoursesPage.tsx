import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { courseService, type CourseItem } from "@/services/courseService";

function isOwnedByLecturer(course: CourseItem, userId: number) {
  const instructorId = course.instructor_id || course.owner_id || course.instructor?.id;
  return instructorId === userId;
}

export default function LecturerCoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const data = await courseService.getCourses();
        if (isMounted && user) {
          setCourses(data.filter((course) => isOwnedByLecturer(course, user.id)));
        }
      } catch {
        if (isMounted) setCourses([]);
      }
    }
    void load();
    return () => {
      isMounted = false;
    };
  }, [user]);

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-semibold">My Courses</h1>
      <p className="mt-1 text-sm text-gray-600">Manage course content and structure.</p>
      {courses.length === 0 ? (
        <p className="mt-6">No courses yet. Start by creating your first course.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {courses.map((course) => (
            <li className="rounded border p-4" key={course.id}>
              <h2 className="font-semibold">{course.title}</h2>
              <p className="mt-1 text-sm text-gray-700">{course.description}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
