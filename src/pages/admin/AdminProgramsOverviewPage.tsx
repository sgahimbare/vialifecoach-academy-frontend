import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  Users, 
  Edit, 
  Eye, 
  Plus, 
  Search,
  Filter,
  Settings,
  Target,
  Award,
  TrendingUp,
  Clock,
  BarChart3
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { apiRequest } from "@/lib/api";

interface Program {
  id: string;
  name: string;
  description: string;
  type: string;
  enrolledCount?: number;
  completionRate?: number;
  status?: 'active' | 'draft' | 'archived';
}

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  category_id?: number;
  thumbnail_url: string;
  published: boolean;
  instructor_id?: number;
  created_at?: string;
  updated_at?: string;
  modules_count?: number;
  lessons_count?: number;
  total_students?: number;
  average_progress?: number;
}

export default function AdminProgramsOverviewPage() {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<'programs' | 'courses'>('programs');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      
      // Load programs (public endpoint - no auth required)
      const programsResponse = await apiRequest('/programs', {}) as any;
      if (programsResponse?.success) {
        setPrograms(programsResponse.data || []);
      }

      // Load courses (public endpoint - no auth required)
      const coursesResponse = await apiRequest('/courses', {}) as any;
      if (coursesResponse?.success) {
        setCourses(coursesResponse.data || []);
      }
      
      setError("");
    } catch (err) {
      console.error('Error loading data:', err);
      setError("Failed to load programs and courses");
    } finally {
      setLoading(false);
    }
  }

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = searchTerm === '' || 
      program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || program.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const filteredCourses = courses.filter(course => {
    const matchesSearch = searchTerm === '' || 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'published' && course.published) ||
      (filterStatus === 'draft' && !course.published);
    
    return matchesSearch && matchesStatus;
  });

  const handleEditProgram = (programId: string) => {
    // Navigate to program editing page or open modal
    navigate(`/admin/programs/${programId}/edit`);
  };

  const handleEditCourse = (courseId: number) => {
    // Navigate to existing course management page
    navigate(`/admin/courses/${courseId}`);
  };

  const handleViewCourse = (courseId: number) => {
    // Navigate to course preview
    navigate(`/courses/${courseId}`);
  };

  const getProgramIcon = (type: string) => {
    switch (type) {
      case 'scholarship': return <Award className="w-5 h-5" />;
      case 'therapeutic': return <Target className="w-5 h-5" />;
      case 'leadership': return <TrendingUp className="w-5 h-5" />;
      case 'business': return <BarChart3 className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  const getProgramColor = (type: string) => {
    switch (type) {
      case 'scholarship': return 'bg-purple-100 text-purple-800';
      case 'therapeutic': return 'bg-green-100 text-green-800';
      case 'leadership': return 'bg-blue-100 text-blue-800';
      case 'business': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Programs & Courses Overview">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Programs & Courses Overview">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Programs & Courses Overview</h1>
          <p className="text-gray-600">View and manage all programs and courses without authentication restrictions</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search programs and courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {activeTab === 'programs' && (
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="scholarship">Scholarship</option>
                <option value="therapeutic">Therapeutic</option>
                <option value="leadership">Leadership</option>
                <option value="business">Business</option>
              </select>
            )}
            
            {activeTab === 'courses' && (
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('programs')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'programs'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Programs ({programs.length})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('courses')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'courses'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Courses ({courses.length})
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Programs Tab */}
        {activeTab === 'programs' && (
          <div className="space-y-4">
            {filteredPrograms.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No programs found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredPrograms.map((program) => (
                <div key={program.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg ${getProgramColor(program.type)}`}>
                          {getProgramIcon(program.type)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{program.name}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getProgramColor(program.type)}`}>
                            {program.type}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">{program.description}</p>
                      
                      {program.enrolledCount !== undefined && (
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {program.enrolledCount} enrolled
                          </div>
                          {program.completionRate !== undefined && (
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-4 h-4" />
                              {program.completionRate}% completion
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleEditProgram(program.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Program"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="space-y-4">
            {filteredCourses.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredCourses.map((course) => (
                <div key={course.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {course.thumbnail_url && (
                          <img 
                            src={course.thumbnail_url} 
                            alt={course.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              course.published 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {course.published ? 'Published' : 'Draft'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mb-2">{course.category}</p>
                          <p className="text-gray-600">{course.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {course.modules_count || 0} modules
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {course.total_students || 0} students
                        </div>
                        {course.average_progress !== undefined && (
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            {Math.round(course.average_progress)}% avg progress
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Created: {course.created_at ? new Date(course.created_at).toLocaleDateString() : 'Unknown'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleViewCourse(course.id)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="View Course"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEditCourse(course.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Course"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="text-red-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
