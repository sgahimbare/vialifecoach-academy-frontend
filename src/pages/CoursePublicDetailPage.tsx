import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/api";

interface Lesson {
  id: string;
  title: string;
}

interface Module {
  id: string;
  title: string;
  order_index?: number;
  published?: boolean;
  lessons?: Lesson[];
}

interface Course {
  id: string;
  title: string;
  category?: string;
  duration_weeks?: number;
  has_certificate?: boolean;
  description?: string;
}

interface ModulesResponse {
  data?: Module[];
  modules?: Module[];
}

export default function CoursePublicDetailPage() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModulesDetail, setShowModulesDetail] = useState(false);

  useEffect(() => {

    const loadCourseData = async () => {

      if (!id) return;

      try {

        const courseData = await apiRequest<Course>(`/courses/${id}`);
        setCourse(courseData);

        try {

          const modulesData = await apiRequest<ModulesResponse | Module[]>(`/courses/${id}/modules`);

          let modulesArray: Module[] = [];

          if (Array.isArray(modulesData)) {
            modulesArray = modulesData;

          } else if (modulesData?.data && Array.isArray(modulesData.data)) {
            modulesArray = modulesData.data;

          } else if (modulesData?.modules && Array.isArray(modulesData.modules)) {
            modulesArray = modulesData.modules;

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

  const sortedModules = [...modules].sort(
    (a, b) => (a.order_index ?? 0) - (b.order_index ?? 0)
  );

  const totalLessons = sortedModules.reduce(
    (sum, m) => sum + (m.lessons?.length || 0),
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Course Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The course you're looking for doesn't exist.
          </p>

          <Link
            to="/courses"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const startCourse = () => {

    if (sortedModules.length === 0) {
      alert("This course has no lessons yet.");
      return;
    }

    const firstModule = sortedModules[0];

    if (firstModule.lessons && firstModule.lessons.length > 0) {

      navigate(
        `/courses/${id}/modules/${firstModule.id}/lessons/${firstModule.lessons[0].id}`
      );

    } else {

      navigate(`/courses/${id}/modules/${firstModule.id}`);

    }

  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#EEF4FF] via-[#F7FAFF] to-[#F5F7FB]">

      <div className="mx-auto max-w-6xl px-6 py-8">

        {/* Course Overview */}

        <section className="rounded-2xl border border-[#D8E4FB] bg-white p-8 shadow-lg mb-8">

          <div className="flex flex-col lg:flex-row gap-8">

            <div className="flex-1">

              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-[#1F4E8C] rounded-full"></div>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#1F4E8C]">
                  Course Overview
                </p>
              </div>

              <h1 className="text-4xl font-bold text-[#102347] mb-4 leading-tight">
                {course.title}
              </h1>

              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#EEF4FF] text-[#1F4E8C] border border-[#D8E4FB]">
                  {course.category || "Personal Development"}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-[#5D6B82]">
                  {course.duration_weeks
                    ? `${course.duration_weeks} weeks program`
                    : "Self-paced learning"}
                </span>
              </div>

              {/* Course Description */}
              <div className="bg-gradient-to-r from-[#FAFBFE] to-[#F5F7FB] rounded-xl p-6 border border-[#E6ECF5] mb-6">
                <h3 className="text-lg font-semibold text-[#102347] mb-3">About this course</h3>
                <p className="text-[#5D6B82] leading-relaxed">
                  {course.description || "This course was designed to help learners unlock their inner strength and understand that confidence is a skill, and not a gift. It is designed for anyone who desires to develop self-trust, think positively, and act boldly even in uncertain situations.\n\nEach chapter builds practical understanding through reflection and action. Read it not just to know, but to grow, and to transform your thoughts into courage and your courage into consistent confidence."}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-[#E6ECF5]">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-[#5D6B82]">
                    {course.duration_weeks
                      ? `${course.duration_weeks} weeks`
                      : "Self-paced"}
                  </span>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-[#E6ECF5]">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-[#5D6B82]">
                    Flexible learning
                  </span>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-[#E6ECF5]">
                  <div className={`w-2 h-2 rounded-full ${
                    course.has_certificate ? "bg-green-500" : "bg-gray-400"
                  }`}></div>
                  <span className="text-sm font-medium text-[#5D6B82]">
                    {course.has_certificate
                      ? "Certificate included"
                      : "No certificate"}
                  </span>
                </div>
              </div>

            </div>

            {/* Stats & Actions */}

            <div className="lg:w-96">

              <div className="bg-gradient-to-br from-[#FAFBFE] to-[#F5F7FB] rounded-2xl p-6 border border-[#E6ECF5] mb-6">
                
                <h3 className="text-sm font-semibold text-[#1F4E8C] uppercase tracking-[0.12em] mb-4">Course Stats</h3>

                <div className="grid grid-cols-3 gap-4">

                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#102347] mb-1">
                      {sortedModules.length}
                    </div>
                    <div className="text-xs font-semibold text-[#1F4E8C] uppercase">
                      Modules
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#102347] mb-1">
                      {totalLessons}
                    </div>
                    <div className="text-xs font-semibold text-[#1F4E8C] uppercase">
                      Lessons
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#102347] mb-1">
                      {course.duration_weeks ?? "∞"}
                    </div>
                    <div className="text-xs font-semibold text-[#1F4E8C] uppercase">
                      Duration
                    </div>
                  </div>

                </div>

              </div>

              {/* Action Buttons */}

              <div className="space-y-4">

                <button
                  onClick={() => navigate(`/courses/${id}/modules`)}
                  className="w-full px-6 py-4 bg-gradient-to-r from-[#1F4E8C] to-[#2B5CAA] text-white font-semibold rounded-xl hover:from-[#1A3D7A] hover:to-[#244A90] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    View Course Modules
                  </span>
                </button>

                <button
                  onClick={() => navigate(`/courses/3/learn`)}
                  className="w-full px-6 py-4 bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white font-semibold rounded-xl hover:from-[#1FA848] hover:to-[#15803D] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Start Learning Now
                  </span>
                </button>

              </div>

            </div>

          </div>

        </section>

        {/* Modules List */}

        {sortedModules.length > 0 && !showModulesDetail && (

          <section>

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[#102347]">
                Course Modules
              </h2>
              <div className="text-sm text-[#5D6B82]">
                {sortedModules.length} modules
              </div>
            </div>

            <div className="divide-y divide-[#D8E4FB] border-t border-b border-[#D8E4FB]">
              {sortedModules.map((module, index) => (
                <div key={module.id} className="py-5">
                  <div className="flex items-start gap-6">
                    <div className="w-12">
                      <div className="text-2xl font-bold text-[#1F4E8C]">
                        {module.order_index ?? index}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#102347]">
                        {module.title}
                      </h3>
                      <p className="text-sm text-[#5D6B82] mt-1">
                        {(module.lessons?.length || 0)} lessons
                      </p>
                    </div>
                    <div className="text-sm text-[#1F4E8C] font-medium">
                      View
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </section>

        )}

      </div>

    </main>
  );
}

function Stat({ number, label }: any) {

  return (

    <div className="rounded-xl border border-[#E6ECF5] bg-[#FAFBFE] p-4 text-center">

      <div className="text-2xl font-bold text-[#102347]">
        {number}
      </div>

      <div className="text-xs font-semibold text-[#1F4E8C] uppercase">
        {label}
      </div>

    </div>

  );
}
