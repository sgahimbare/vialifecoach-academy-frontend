import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/api";

interface Lesson {
  id: string;
  title: string;
  description?: string;
  lesson_type?: string;
  video_url?: string;
  image_urls?: string[];
  published: boolean;
  order_index: number;
  content_type?: string;
}

interface Module {
  id: string;
  title: string;
  description?: string;
  published: boolean;
  quiz_required?: boolean;
  min_pass_percentage?: number;
  order_index: number;
  lessons?: Lesson[];
}

interface Course {
  id: string;
  title: string;
  category?: string;
  description?: string;
}

export default function CourseModulesPage() {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourseData = async () => {
      if (!id) return;

      try {
        // Load course details
        const courseData = await apiRequest(`/courses/${id}`);
        setCourse(courseData as Course);

        // Load modules with lessons
        try {
          const modulesData = await apiRequest(`/courses/${id}/modules`);
          console.log('Modules data received:', modulesData);
          
          let modulesArray: Module[] = [];
          if (Array.isArray(modulesData)) {
            modulesArray = modulesData;
          } else if ((modulesData as any)?.data && Array.isArray((modulesData as any).data)) {
            modulesArray = (modulesData as any).data;
          } else if ((modulesData as any)?.modules && Array.isArray((modulesData as any).modules)) {
            modulesArray = (modulesData as any).modules;
          }
          
          setModules(modulesArray);
        } catch (modulesError) {
          console.warn("Modules endpoint unavailable:", modulesError);
          setModules([]);
        }
      } catch (error) {
        console.error("Failed to load course:", error);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    loadCourseData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course modules...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <p className="text-gray-600 mb-6">The course you're looking for doesn't exist.</p>
          <Link to="/courses" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const sortedModules = [...modules].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#EEF4FF] via-[#F7FAFF] to-[#F5F7FB]">
      <div className="mx-auto max-w-6xl px-6 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <Link 
            to={`/courses/${id}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-[#D8E4FB] rounded-lg text-[#5D6B82] hover:text-[#1F4E8C] hover:border-[#1F4E8C] hover:shadow-md transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Course
          </Link>
          
          <div className="mt-6">
            <h1 className="text-4xl font-bold text-[#102347] mb-3">{course.title}</h1>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#1F4E8C] rounded-full"></div>
              <p className="text-xl text-[#5D6B82]">Course Modules & Lessons</p>
              <div className="w-2 h-2 bg-[#1F4E8C] rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        {sortedModules.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-[#E6ECF5] to-[#D8E4FB] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-[#5D6B82]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#102347] mb-3">No Modules Yet</h3>
            <p className="text-[#5D6B82] max-w-md mx-auto">This course doesn't have any modules yet. Check back soon as new content may be added!</p>
          </div>
        ) : (
          <div className="space-y-10">
            {sortedModules.map((module, moduleIndex) => (
              <div key={module.id} className="border-t border-[#D8E4FB] pt-8">
                <div className="flex items-start gap-6">
                  <div className="min-w-[72px]">
                    <div className="text-3xl font-bold text-[#1F4E8C]">{module.order_index ?? moduleIndex}</div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-2xl font-semibold text-[#102347]">{module.title}</h3>
                      <span className="text-sm text-[#5D6B82]">
                        {(module.lessons?.length || 0)} lessons
                      </span>
                    </div>
                    {module.description && (
                      <p className="mt-2 text-sm text-[#5D6B82] leading-relaxed">
                        {module.description}
                      </p>
                    )}

                    <div className="mt-5">
                      {module.lessons && module.lessons.length > 0 ? (
                        <div className="space-y-3">
                          {module.lessons
                            .sort((a, b) => a.order_index - b.order_index)
                            .map((lesson, lessonIndex) => (
                              <Link
                                key={lesson.id}
                                to={`/courses/${id}/modules/${module.id}/lessons/${lesson.id}`}
                                className="flex items-center justify-between gap-4 border-b border-[#E6ECF5] pb-3 text-sm text-[#102347] hover:text-[#1F4E8C] transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-[#1F4E8C] font-semibold">{lessonIndex + 1}.</span>
                                  <span className="font-medium">{lesson.title}</span>
                                </div>
                              </Link>
                            ))}
                        </div>
                      ) : (
                        <p className="text-sm text-[#5D6B82]">No lessons in this module yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
