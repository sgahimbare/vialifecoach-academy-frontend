import { Link, useParams, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function CourseStartPage() {
  const { id } = useParams();
  const { accessToken } = useAuth();
  const nextPath = `/student/courses/${id}/overview`;
  const playerPath = `/courses/${id}/player`;

  // If logged in, redirect directly to the premium course landing
  if (accessToken) {
    return <Navigate to={`/courses/${id}/overview`} replace />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#EEF4FF] via-[#F7FAFF] to-[#F5F7FB]">
      <div className="mx-auto max-w-7xl px-6 py-8">
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
            <h1 className="text-4xl font-bold text-[#102347] mb-3">Start Your Course</h1>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#1F4E8C] rounded-full"></div>
              <p className="text-xl text-[#5D6B82]">Begin Your Learning Journey</p>
              <div className="w-2 h-2 bg-[#1F4E8C] rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 h-full">
          {/* Left Content */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[#D8E4FB] shadow-lg p-8 h-full flex flex-col justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#EEF4FF] to-[#D8E4FB] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-[#1F4E8C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-[#102347] mb-4">Course Access</h2>
                <p className="text-lg text-[#5D6B82] mb-6 leading-relaxed">
                  You can explore all courses freely. To begin this course and track progress, continue with an account.
                </p>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[#D8E4FB] shadow-lg p-8 h-full flex flex-col justify-center">
              <div className="text-center">
                {!accessToken ? (
                  <div className="space-y-4">
                    <Link
                      className="w-full px-6 py-4 bg-gradient-to-r from-[#1F4E8C] to-[#2B5CAA] text-white font-semibold rounded-xl hover:from-[#1a3d73] hover:to-[#244a8a] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      to={`/signup?next=${encodeURIComponent(nextPath)}`}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0 0h3m-3 0h-6m2 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Create Account
                      </span>
                    </Link>
                    
                    <Link
                      className="w-full px-6 py-4 bg-white border-2 border-[#D8E4FB] text-[#102347] font-semibold rounded-xl hover:border-[#1F4E8C] hover:bg-[#EEF4FF] transition-all duration-300 shadow-md hover:shadow-lg"
                      to={`/login?next=${encodeURIComponent(nextPath)}`}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m4 4V8m0 0v8m-4-4h.01M9 16l.01-4" />
                        </svg>
                        Login to Continue
                      </span>
                    </Link>
                  </div>
                ) : (
                  <Link
                    className="w-full px-6 py-4 bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white font-semibold rounded-xl hover:from-[#1FA848] hover:to-[#15803D] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    to={nextPath}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Continue to Course Overview
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
