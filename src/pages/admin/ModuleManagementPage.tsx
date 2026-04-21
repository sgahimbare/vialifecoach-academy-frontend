import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Layers, 
  Plus, 
  Edit, 
  Trash2, 
  Video, 
  BookOpen, 
  Dumbbell,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Save,
  X,
  Image as ImageIcon,
  FileText,
  Play
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AdminLayout } from "@/components/admin/AdminLayout";

interface Module {
  id: number;
  title: string;
  description?: string;
  order: number;
  published: boolean;
  lessons_count: number;
  quiz_required?: boolean;
  min_pass_percentage?: number;
}

interface Lesson {
  id: number;
  title: string;
  content: string;
  lesson_type: 'video' | 'reading' | 'exercise';
  order: number;
  published: boolean;
  media_urls?: string[];
}

interface LessonContent {
  id: number;
  lesson_id: number;
  content_type: 'text' | 'image' | 'video' | 'exercise';
  content_data: any;
  order: number;
}

export default function ModuleManagementPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();
  
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set());
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contentType, setContentType] = useState<'video' | 'reading' | 'exercise'>('video');

  const isAdmin = user?.role === 'admin';
  const canDelete = isAdmin;

  useEffect(() => {
    if (courseId && accessToken) {
      loadModules();
      loadLessons();
    }
  }, [courseId, accessToken]);

  async function loadModules() {
    try {
      const apiUrl = window.location.origin.includes('localhost') 
        ? `http://localhost:5000/api/v1/admin/courses/${courseId}/modules`
        : `${window.location.origin}/api/v1/admin/courses/${courseId}/modules`;
        
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error(`Failed to load modules: ${response.status}`);
      
      const data = await response.json();
      if (data.success) {
        setModules(data.data || []);
      }
    } catch (err) {
      console.error('Error loading modules:', err);
      setError(err instanceof Error ? err.message : 'Failed to load modules');
    } finally {
      setLoading(false);
    }
  }

  async function loadLessons() {
    try {
      const apiUrl = window.location.origin.includes('localhost') 
        ? `http://localhost:5000/api/v1/admin/courses/${courseId}/lessons`
        : `${window.location.origin}/api/v1/admin/courses/${courseId}/lessons`;
        
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setLessons(data.data || []);
        }
      }
    } catch (err) {
      console.error('Error loading lessons:', err);
    }
  }

  function toggleModuleExpansion(moduleId: number) {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  }

  function getLessonsForModule(moduleId: number): Lesson[] {
    return lessons.filter(lesson => {
      // This would need module_id in lesson data, for now using order as proxy
      return lessons.indexOf(lesson) < modules.findIndex(m => m.id === moduleId) + 10;
    });
  }

  async function saveModule(module: Module) {
    try {
      const apiUrl = window.location.origin.includes('localhost') 
        ? `http://localhost:5000/api/v1/admin/modules/${module.id}`
        : `${window.location.origin}/api/v1/admin/modules/${module.id}`;
        
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(module)
      });

      if (!response.ok) throw new Error(`Failed to save module: ${response.status}`);
      
      const data = await response.json();
      if (data.success) {
        setModules(modules.map(m => m.id === module.id ? data.data : m));
        setEditingModule(null);
      }
    } catch (err) {
      console.error('Error saving module:', err);
      alert(err instanceof Error ? err.message : 'Failed to save module');
    }
  }

  async function deleteModule(moduleId: number) {
    if (!canDelete) {
      alert('Only admins can delete modules');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this module? This will also delete all lessons in it.')) {
      return;
    }

    try {
      const apiUrl = window.location.origin.includes('localhost') 
        ? `http://localhost:5000/api/v1/admin/modules/${moduleId}`
        : `${window.location.origin}/api/v1/admin/modules/${moduleId}`;
        
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error(`Failed to delete module: ${response.status}`);
      
      setModules(modules.filter(m => m.id !== moduleId));
      setLessons(lessons.filter(l => !getLessonsForModule(moduleId).includes(l)));
    } catch (err) {
      console.error('Error deleting module:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete module');
    }
  }

  async function createNewModule() {
    const newModule: Module = {
      id: 0, // Will be set by server
      title: `Module ${modules.length + 1}`,
      description: '',
      order: modules.length + 1,
      published: false,
      lessons_count: 0,
      quiz_required: false,
      min_pass_percentage: 80
    };

    try {
      const apiUrl = window.location.origin.includes('localhost') 
        ? `http://localhost:5000/api/v1/admin/courses/${courseId}/modules`
        : `${window.location.origin}/api/v1/admin/courses/${courseId}/modules`;
        
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newModule)
      });

      if (!response.ok) throw new Error(`Failed to create module: ${response.status}`);
      
      const data = await response.json();
      if (data.success) {
        setModules([...modules, data.data]);
      }
    } catch (err) {
      console.error('Error creating module:', err);
      alert(err instanceof Error ? err.message : 'Failed to create module');
    }
  }

  function getLessonIcon(type: string) {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'reading': return <BookOpen className="h-4 w-4" />;
      case 'exercise': return <Dumbbell className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  }

  function getLessonColor(type: string) {
    switch (type) {
      case 'video': return 'bg-red-100 text-red-600';
      case 'reading': return 'bg-blue-100 text-blue-600';
      case 'exercise': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Module Management" subtitle="Loading modules...">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Module Management" 
      subtitle={`Course: ${courseId}`}
      actions={
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/admin/courses/${courseId}`)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back to Course
          </button>
          
          <button
            onClick={createNewModule}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Module
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Content Type Selector */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Content Type:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setContentType('video')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  contentType === 'video' 
                    ? 'bg-red-100 text-red-700 border-2 border-red-300' 
                    : 'bg-gray-100 text-gray-700 border-2 border-transparent'
                }`}
              >
                <Video className="h-4 w-4" />
                Videos
              </button>
              <button
                onClick={() => setContentType('reading')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  contentType === 'reading' 
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-300' 
                    : 'bg-gray-100 text-gray-700 border-2 border-transparent'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                Reading
              </button>
              <button
                onClick={() => setContentType('exercise')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  contentType === 'exercise' 
                    ? 'bg-green-100 text-green-700 border-2 border-green-300' 
                    : 'bg-gray-100 text-gray-700 border-2 border-transparent'
                }`}
              >
                <Dumbbell className="h-4 w-4" />
                Exercises
              </button>
            </div>
          </div>
        </div>

        {/* Modules List */}
        <div className="space-y-4">
          {modules.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Layers className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Modules Yet</h3>
              <p className="text-gray-600 mb-6">Start building your course by creating your first module.</p>
              <button
                onClick={createNewModule}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create First Module
              </button>
            </div>
          ) : (
            modules.map((module, moduleIndex) => {
              const moduleLessons = getLessonsForModule(module.id);
              const isExpanded = expandedModules.has(module.id);
              const isEditing = editingModule?.id === module.id;

              return (
                <div key={module.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  {/* Module Header */}
                  <div className="p-6 border-b border-gray-200">
                    {isEditing ? (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={editingModule.title}
                          onChange={(e) => setEditingModule({...editingModule, title: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Module title"
                        />
                        <textarea
                          value={editingModule.description || ''}
                          onChange={(e) => setEditingModule({...editingModule, description: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={3}
                          placeholder="Module description (optional)"
                        />
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={editingModule.published}
                              onChange={(e) => setEditingModule({...editingModule, published: e.target.checked})}
                              className="rounded border-gray-300"
                            />
                            <span className="text-sm text-gray-700">Published</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={editingModule.quiz_required || false}
                              onChange={(e) => setEditingModule({...editingModule, quiz_required: e.target.checked})}
                              className="rounded border-gray-300"
                            />
                            <span className="text-sm text-gray-700">Quiz Required</span>
                          </label>
                          {editingModule.quiz_required && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-700">Min Pass:</span>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={editingModule.min_pass_percentage || 80}
                                onChange={(e) => setEditingModule({...editingModule, min_pass_percentage: parseInt(e.target.value)})}
                                className="w-16 px-2 py-1 border border-gray-300 rounded"
                              />
                              <span className="text-sm text-gray-700">%</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => saveModule(editingModule)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                          >
                            <Save className="h-4 w-4" />
                            Save
                          </button>
                          <button
                            onClick={() => setEditingModule(null)}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                          >
                            <X className="h-4 w-4" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 font-bold">{module.order}</span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                            <p className="text-sm text-gray-600">{moduleLessons.length} lessons</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 text-xs rounded-full ${
                            module.published 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {module.published ? 'Published' : 'Draft'}
                          </span>
                          {module.quiz_required && (
                            <span className="px-3 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                              Quiz {module.min_pass_percentage || 80}%
                            </span>
                          )}
                          <button
                            onClick={() => setEditingModule(module)}
                            className="p-2 text-gray-400 hover:text-gray-600"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          {canDelete && (
                            <button
                              onClick={() => deleteModule(module.id)}
                              className="p-2 text-red-400 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => toggleModuleExpansion(module.id)}
                            className="p-2 text-gray-400 hover:text-gray-600"
                          >
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Module Content (Lessons) */}
                  {isExpanded && (
                    <div className="p-6">
                      {moduleLessons.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <FileText className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                          <p>No lessons in this module yet</p>
                          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Add First Lesson
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {moduleLessons.map((lesson, lessonIndex) => (
                            <div key={lesson.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                              <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getLessonColor(lesson.lesson_type)}`}>
                                  {getLessonIcon(lesson.lesson_type)}
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900">
                                    Lesson {module.order}.{lessonIndex + 1}: {lesson.title}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {lesson.lesson_type === 'video' && 'Video content'}
                                    {lesson.lesson_type === 'reading' && 'Reading materials'}
                                    {lesson.lesson_type === 'exercise' && 'Practice exercises'}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  lesson.published 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {lesson.published ? 'Published' : 'Draft'}
                                </span>
                                <button className="p-2 text-gray-400 hover:text-gray-600">
                                  <Edit className="h-4 w-4" />
                                </button>
                                {canDelete && (
                                  <button className="p-2 text-red-400 hover:text-red-600">
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                          
                          {/* Add Lesson Button */}
                          <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800">
                            <Plus className="h-4 w-4" />
                            Add Lesson
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Show More/Less for many modules */}
        {modules.length > 3 && (
          <div className="text-center">
            <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
              {expandedModules.size === modules.length ? 'Show Less' : 'Show More'}
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
