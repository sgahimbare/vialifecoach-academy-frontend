import { useEffect, useState } from "react";
import { courseService, type CourseItem } from "@/services/courseService";
import { ApiCourseCard } from "@/components/common/ApiCourseCard";

export default function CoursesListPage() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCourses = async () => {
    try {
      console.log('DEBUG: CoursesListPage - Loading courses...');
      setIsLoading(true);
      const data = await courseService.getCourses();
      console.log('DEBUG: CoursesListPage - Data received:', data);
      setCourses(data);
    } catch {
      setError("No data found.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  // Listen for course updates
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'coursesListUpdated') {
        console.log('DEBUG: Courses list updated, refreshing...');
        loadCourses();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Also check for updates every 30 seconds as a fallback
  useEffect(() => {
    const interval = setInterval(() => {
      loadCourses();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-[#F5F7FB]">
      <div className="mx-auto max-w-7xl px-6 py-8">
      <h1 className="text-3xl font-semibold text-[#102347]">Explore Courses</h1>
      <p className="mt-1 text-sm text-[#5D6B82]">Choose a course and start learning.</p>
      
      {/* EMBEDDED COURSEBOX COURSE */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-[#102347] mb-4">Featured Interactive Course</h2>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <article className="overflow-hidden rounded-2xl transition-all duration-200 hover:-translate-y-1 border border-[#E6ECF5] bg-white shadow-[0_8px_24px_rgba(17,34,68,0.08)] hover:shadow-[0_14px_32px_rgba(17,34,68,0.12)]">
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
              <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-purple-100 text-purple-800">
                Interactive Course
              </span>
              <h2 className="mt-3 line-clamp-2 text-lg font-semibold text-[#102347]">The Confidence Code: Building Unstoppable Self-Belief</h2>
              <p className="mt-2 line-clamp-2 text-sm text-[#5D6B82]">
                Access our premium interactive course content with advanced features and certification.
              </p>
              <div className="mt-4 flex items-center justify-between text-xs text-[#5D6B82]">
                <span>Self-paced</span>
                <span>Certificate</span>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => window.open('https://my.coursebox.ai/courses/216034/about', '_blank')}
                  className="flex-1 inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white bg-[#1F4E8C] hover:bg-[#173C6C] transition-colors"
                >
                  View Course
                </button>
                <button
                  onClick={() => window.open('https://my.coursebox.ai/courses/216034/about', '_blank')}
                  className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 transition-colors"
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
          <article className="overflow-hidden rounded-2xl transition-all duration-200 hover:-translate-y-1 border border-[#E6ECF5] bg-white shadow-[0_8px_24px_rgba(17,34,68,0.08)] hover:shadow-[0_14px_32px_rgba(17,34,68,0.12)]">
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
              <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800">
                Embedded Course
              </span>
              <h2 className="mt-3 line-clamp-2 text-lg font-semibold text-[#102347]">Recognizing and Overcoming Manipulative Relationships</h2>
              <p className="mt-2 line-clamp-2 text-sm text-[#5D6B82]">
                Learn to identify and navigate complex relationship dynamics with confidence and clarity.
              </p>
              <div className="mt-4 flex items-center justify-between text-xs text-[#5D6B82]">
                <span>Self-paced</span>
                <span>Certificate</span>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => window.open('https://my.coursebox.ai/courses/216047/about', '_blank')}
                  className="flex-1 inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  View Course
                </button>
                <button
                  onClick={() => window.open('https://my.coursebox.ai/courses/216047/about', '_blank')}
                  className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
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
      
      {/* REGULAR COURSES SECTION */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-[#102347] mb-4">All Courses</h2>
        {isLoading ? <p className="mt-6">Loading...</p> : null}
        {error ? <p className="mt-6 text-red-600">{error}</p> : null}
        {!isLoading && !error && courses.length === 0 ? (
          <p className="mt-6 text-[#5D6B82]">No courses available right now.</p>
        ) : null}
        <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {courses.map((course) => (
            <ApiCourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              description={course.short_description || course.description}
              category={course.category}
              durationWeeks={course.duration_weeks}
              hasCertificate={course.has_certificate}
              thumbnail_url={course.thumbnail_url}
              to={`/courses/${course.id}/overview`}
            />
          ))}
        </div>
      </div>
      </div>
    </main>
  );
}
