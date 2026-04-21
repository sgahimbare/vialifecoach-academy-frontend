import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Edit, Trash2, Save, Eye, EyeOff, Type, Bold, Italic, Underline, List, ListOrdered, Link, Image, Code, Palette, FileText, Video, PlayCircle, Headphones, BookOpen, Clock, Users, BarChart3 } from 'lucide-react';
import LessonEditor from '../components/LessonEditor';

interface Lesson {
  id: string;
  title: string;
  content: string;
  type: 'reading' | 'video' | 'audio' | 'exercise' | 'quiz';
  order: number;
  duration: number;
  wordCount: number;
  readingTime: number;
  status: 'draft' | 'published' | 'archived';
  moduleId: string;
  createdAt: string;
  updatedAt: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

const LessonManagement: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load lessons and modules
  useEffect(() => {
    loadLessonsAndModules();
  }, []);

  const loadLessonsAndModules = async () => {
    setIsLoading(true);
    try {
      // Mock data - replace with actual API calls
      const mockLessons: Lesson[] = [
        {
          id: '1',
          title: 'Introduction to Programming',
          content: '## Welcome to Programming\n\nThis is your first lesson in programming. **Programming** is the art of telling computers what to do.\n\n### What you will learn:\n- Basic programming concepts\n- Variables and data types\n- Control structures\n- Functions and methods',
          type: 'reading',
          order: 1,
          duration: 15,
          wordCount: 45,
          readingTime: 1,
          status: 'published',
          moduleId: 'module1',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        },
        {
          id: '2',
          title: 'Variables and Data Types',
          content: '## Understanding Variables\n\nVariables are containers for storing data values. In programming, we use variables to store information that we want to use later.\n\n### Common Data Types:\n- **Numbers**: 1, 2, 3.5, -10\n- **Strings**: "Hello", "World"\n- **Booleans**: true, false\n- **Arrays**: [1, 2, 3], ["a", "b", "c"]\n- **Objects**: {name: "John", age: 25}',
          type: 'reading',
          order: 2,
          duration: 20,
          wordCount: 67,
          readingTime: 1,
          status: 'published',
          moduleId: 'module1',
          createdAt: '2024-01-02',
          updatedAt: '2024-01-02'
        }
      ];

      const mockModules: Module[] = [
        {
          id: 'module1',
          title: 'Getting Started',
          description: 'Introduction to basic programming concepts',
          order: 1,
          lessons: mockLessons
        }
      ];

      setLessons(mockLessons);
      setModules(mockModules);
    } catch (error) {
      console.error('Error loading lessons:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter lessons based on search and filters
  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || lesson.type === filterType;
    const matchesStatus = filterStatus === 'all' || lesson.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    total: lessons.length,
    published: lessons.filter(l => l.status === 'published').length,
    draft: lessons.filter(l => l.status === 'draft').length,
    totalWords: lessons.reduce((sum, l) => sum + l.wordCount, 0),
    avgReadingTime: lessons.length > 0 ? Math.round(lessons.reduce((sum, l) => sum + l.readingTime, 0) / lessons.length) : 0
  };

  // Get lesson type icon
  const getLessonTypeIcon = (type: string) => {
    switch (type) {
      case 'reading': return <BookOpen className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'audio': return <Headphones className="h-4 w-4" />;
      case 'exercise': return <PlayCircle className="h-4 w-4" />;
      case 'quiz': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Save lesson
  const saveLesson = async (content: string) => {
    if (!selectedLesson) return;

    try {
      const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
      const readingTime = Math.ceil(wordCount / 200);

      const updatedLesson = {
        ...selectedLesson,
        content,
        wordCount,
        readingTime,
        updatedAt: new Date().toISOString()
      };

      setLessons(prev => prev.map(lesson => 
        lesson.id === selectedLesson.id ? updatedLesson : lesson
      ));
      
      setSelectedLesson(updatedLesson);
    } catch (error) {
      console.error('Error saving lesson:', error);
    }
  };

  // Create new lesson
  const createNewLesson = () => {
    const newLesson: Lesson = {
      id: Date.now().toString(),
      title: 'New Lesson',
      content: '',
      type: 'reading',
      order: lessons.length + 1,
      duration: 10,
      wordCount: 0,
      readingTime: 0,
      status: 'draft',
      moduleId: modules[0]?.id || 'module1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setLessons(prev => [...prev, newLesson]);
    setSelectedLesson(newLesson);
    setIsEditing(true);
  };

  // Delete lesson
  const deleteLesson = (lessonId: string) => {
    if (confirm('Are you sure you want to delete this lesson?')) {
      setLessons(prev => prev.filter(lesson => lesson.id !== lessonId));
      if (selectedLesson?.id === lessonId) {
        setSelectedLesson(null);
        setIsEditing(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lesson Management</h1>
          <p className="text-gray-600">Create and manage course lessons with enhanced visibility</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Lessons</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Published</p>
                <p className="text-2xl font-bold text-green-600">{stats.published}</p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Words</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalWords.toLocaleString()}</p>
              </div>
              <Type className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Reading Time</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgReadingTime}m</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search lessons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div className="w-full lg:w-48">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="reading">Reading</option>
                <option value="video">Video</option>
                <option value="audio">Audio</option>
                <option value="exercise">Exercise</option>
                <option value="quiz">Quiz</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="w-full lg:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* New Lesson Button */}
            <button
              onClick={createNewLesson}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Lesson
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lessons List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Lessons</h2>
                <p className="text-sm text-gray-600 mt-1">{filteredLessons.length} lessons found</p>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="p-6 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-2">Loading lessons...</p>
                  </div>
                ) : filteredLessons.length === 0 ? (
                  <div className="p-6 text-center text-gray-600">
                    <FileText className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p>No lessons found</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {filteredLessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className={`p-4 cursor-pointer hover:bg-gray-50 ${
                          selectedLesson?.id === lesson.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                        }`}
                        onClick={() => {
                          setSelectedLesson(lesson);
                          setIsEditing(false);
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {getLessonTypeIcon(lesson.type)}
                              <h3 className="font-medium text-gray-900 truncate">{lesson.title}</h3>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Type className="h-3 w-3" />
                                {lesson.wordCount} words
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {lesson.readingTime}m
                              </span>
                            </div>
                            <div className="mt-2">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lesson.status)}`}>
                                {lesson.status}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 ml-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedLesson(lesson);
                                setIsEditing(true);
                              }}
                              className="p-1 text-gray-400 hover:text-blue-600"
                              title="Edit lesson"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteLesson(lesson.id);
                              }}
                              className="p-1 text-gray-400 hover:text-red-600"
                              title="Delete lesson"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Lesson Editor/Viewer */}
          <div className="lg:col-span-2">
            {selectedLesson ? (
              <div className="space-y-6">
                {/* Lesson Header */}
                <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        {getLessonTypeIcon(selectedLesson.type)}
                        <h2 className="text-xl font-semibold text-gray-900">{selectedLesson.title}</h2>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Type className="h-4 w-4" />
                          {selectedLesson.wordCount} words
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {selectedLesson.readingTime} min read
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {selectedLesson.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!isEditing && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => setShowPreview(!showPreview)}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                          showPreview 
                            ? 'bg-green-600 text-white hover:bg-green-700' 
                            : 'bg-gray-600 text-white hover:bg-gray-700'
                        }`}
                      >
                        {showPreview ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        {showPreview ? 'Preview' : 'Edit'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Lesson Content */}
                {isEditing ? (
                  <LessonEditor
                    initialContent={selectedLesson.content}
                    onSave={saveLesson}
                    readOnly={false}
                    placeholder="Write your lesson content here..."
                  />
                ) : (
                  <div className="bg-white rounded-lg shadow border border-gray-200">
                    <div className="p-6">
                      <div className="prose max-w-none">
                        <div 
                          className="bg-gray-50 border border-gray-200 rounded p-6"
                          dangerouslySetInnerHTML={{ 
                            __html: selectedLesson.content
                              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                              .replace(/\*(.*?)\*/g, '<em>$1</em>')
                              .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
                              .replace(/\n/g, '<br>')
                              .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold mt-6 mb-3">$1</h3>')
                              .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold mt-8 mb-4">$1</h2>')
                              .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-10 mb-5">$1</h1>')
                              .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
                              .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 list-decimal">$1</li>')
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Lesson</h3>
                <p className="text-gray-600">Choose a lesson from the list to view or edit its content</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonManagement;
