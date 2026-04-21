import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  Layers, 
  PlayCircle, 
  Clock, 
  Target, 
  TrendingUp,
  ArrowLeft,
  Edit,
  Trash2,
  Plus,
  Users,
  Calendar
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminLayout as LecturerLayout } from "@/components/admin/AdminLayout";

interface CourseOverview {
  id: number;
  title: string;
  description: string;
  category: string;
  thumbnail_url?: string;
  video_url?: string;
  modules_count: number;
  lessons_count: number;
  total_students?: number;
  average_progress?: number;
  created_at: string;
  updated_at: string;
  published: boolean;
}

interface Module {
  id: number;
  title: string;
  description?: string;
  lessons_count: number;
  order: number;
  published: boolean;
}

interface Lesson {
  id: number;
  title: string;
  content: string;
  lesson_type: 'video' | 'reading' | 'exercise';
  order: number;
  published: boolean;
}

export default function CourseOverviewPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<CourseOverview | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeView, setActiveView] = useState<'overview' | 'modules'>('overview');

  const isAdmin = user?.role === 'admin';
  const isLecturer = user?.role === 'lecturer' || user?.role === 'instructor';
  const Layout = isAdmin ? AdminLayout : (isLecturer ? LecturerLayout : AdminLayout);

  useEffect(() => {
    if (courseId && accessToken) {
      loadCourseOverview();
      loadModules();
    }
  }, [courseId, accessToken]);

  async function loadCourseOverview() {
    try {
      setLoading(true);
      const apiUrl = window.location.origin.includes('localhost') 
        ? `http://localhost:5000/api/v1/admin/courses/${courseId}`
        : `${window.location.origin}/api/v1/admin/courses/${courseId}`;
        
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error(`Failed to load course: ${response.status}`);
      
      const data = await response.json();
      if (data.success && data.data.course) {
        // Transform the course data to match our interface
        const courseData = data.data.course;
        const transformedCourse = {
          id: courseData.id,
          title: courseData.title,
          description: courseData.long_description || courseData.short_description || '',
          category: courseData.category || 'Uncategorized',
          thumbnail_url: courseData.thumbnail_url,
          video_url: courseData.intro_video_url,
          modules_count: data.data.moduleLessonRows?.length || 0,
          lessons_count: data.data.lessonContentRows?.length || 0,
          total_students: courseData.enrollment_count,
          average_progress: 0, // Would need to be calculated from student data
          created_at: courseData.created_at,
          updated_at: courseData.created_at,
          published: courseData.status === 'published'
        };
        setCourse(transformedCourse);
      } else {
        throw new Error(data.message || 'Failed to load course');
      }
    } catch (err) {
      console.error('Error loading course overview:', err);
      setError(err instanceof Error ? err.message : 'Failed to load course');
    } finally {
      setLoading(false);
    }
  }


  async function loadModules() {
    try {
      // Load modules first
      const modulesApiUrl = window.location.origin.includes('localhost') 
        ? `http://localhost:5000/api/v1/admin/courses/${courseId}/modules`
        : `${window.location.origin}/api/v1/admin/courses/${courseId}/modules`;
        
      const modulesResponse = await fetch(modulesApiUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!modulesResponse.ok) throw new Error(`Failed to load modules: ${modulesResponse.status}`);
      
      const modulesData = await modulesResponse.json();
      if (modulesData.success) {
        setModules(modulesData.data || []);
      }
    } catch (err) {
      console.error('Error loading modules:', err);
      // Don't throw error, just set empty modules
      setModules([]);
    }
  }

  async function deleteCourse() {
    if (!course || !isAdmin) return;
    
    if (!window.confirm(`Are you sure you want to delete "${course.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const apiUrl = window.location.origin.includes('localhost') 
        ? `http://localhost:5000/api/v1/admin/courses/${courseId}`
        : `${window.location.origin}/api/v1/admin/courses/${courseId}`;
        
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete course: ${response.status}`);
      }

      // Navigate back to courses list
      navigate('/admin/courses');
    } catch (err) {
      console.error('Error deleting course:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete course');
    }
  }

  function handleViewModules() {
    setActiveView('modules');
  }

  function handleOpenCoursePlayer() {
    // Navigate to course player (student view)
    navigate(`/courses/${courseId}/player`);
  }

  function handleEditCourse() {
    navigate(`/admin/courses/${courseId}/edit`);
  }

  if (loading) {
    return (
      <Layout title="Course Overview" subtitle="Loading course details...">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (error || !course) {
    return (
      <Layout title="Course Overview" subtitle="Error loading course">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-red-800 font-medium mb-2">Error Loading Course</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Go Back
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      title="Course Overview" 
      subtitle={course.title}
      actions={
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          
          {isLecturer && (
            <button
              onClick={handleEditCourse}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Edit className="h-4 w-4" />
              Edit Course
            </button>
          )}
          
          {isAdmin && (
            <>
              <button
                onClick={handleEditCourse}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Edit className="h-4 w-4" />
                Edit Course
              </button>
              
              <button
                onClick={deleteCourse}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4" />
                Delete Course
              </button>
            </>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        {/* Course Header Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Course Image/Thumbnail */}
            <div className="md:w-1/3 h-48 md:h-auto bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              {course.thumbnail_url ? (
                <img 
                  src={course.thumbnail_url} 
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <BookOpen className="h-16 w-16 text-white" />
              )}
            </div>
            
            {/* Course Info */}
            <div className="flex-1 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {course.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full ${
                      course.published 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {course.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Course Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-2 mx-auto">
                    <Layers className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{course.modules_count}</div>
                  <div className="text-sm text-gray-600">Modules</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-2 mx-auto">
                    <BookOpen className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{course.lessons_count}</div>
                  <div className="text-sm text-gray-600">Lessons</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-2 mx-auto">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{course.total_students || 0}</div>
                  <div className="text-sm text-gray-600">Students</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-2 mx-auto">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{course.average_progress || 0}%</div>
                  <div className="text-sm text-gray-600">Avg Progress</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleViewModules}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Layers className="h-5 w-5" />
                  View Modules
                </button>
                
                <button
                  onClick={handleOpenCoursePlayer}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <PlayCircle className="h-5 w-5" />
                  Open Course Player
                </button>
                
                {(isAdmin || isLecturer) && (
                  <button
                    onClick={() => navigate(`/admin/courses/${courseId}/modules/new`)}
                    className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                    Add Module
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Timeline */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Progress Timeline</h2>
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-200"></div>
            <div className="absolute left-0 top-0 w-1 bg-blue-600" style={{height: `${course.average_progress || 0}%`}}></div>
            <div className="space-y-4">
              {modules.slice(0, 3).map((module, index) => (
                <div key={module.id} className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full z-10 ${
                    index === 0 ? 'bg-blue-600' : 'bg-gray-300'
                  }`}></div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{module.title}</div>
                    <div className="text-sm text-gray-600">{module.lessons_count} lessons</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Course Description */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">About the Course</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">
              {course.description || 'No description available for this course.'}
            </p>
          </div>
        </div>

        {/* Curriculum Snapshot */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Curriculum Snapshot</h2>
          <div className="space-y-3">
            {modules.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Layers className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>No modules created yet</p>
                {(isAdmin || isLecturer) && (
                  <button
                    onClick={() => navigate(`/admin/courses/${courseId}/modules/new`)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Create First Module
                  </button>
                )}
              </div>
            ) : (
              modules.map((module) => (
                <div key={module.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">{module.order}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{module.title}</h3>
                      <p className="text-sm text-gray-600">{module.lessons_count} lessons</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      module.published 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {module.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
