import { useState, useEffect } from "react";
import { 
  X, 
  BookOpen, 
  Users, 
  Clock, 
  CheckCircle, 
  Circle,
  Target,
  Award,
  TrendingUp,
  BarChart3,
  Edit,
  Play,
  FileText
} from "lucide-react";

interface Program {
  id: string;
  name: string;
  description: string;
  type: 'scholarship' | 'therapeutic' | 'leadership' | 'business';
}

interface ProgramModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  lessons: number;
  completed: boolean;
  topics: string[];
  order: number;
  isLocked?: boolean;
  isComingSoon?: boolean;
}

interface ProgramPreviewProps {
  program: Program;
  onClose: () => void;
  onEdit: () => void;
}

export default function ProgramPreview({ program, onClose, onEdit }: ProgramPreviewProps) {
  const [modules, setModules] = useState<ProgramModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState<string | null>(null);

  useEffect(() => {
    loadProgramContent();
  }, [program.id]);

  async function loadProgramContent() {
    try {
      setLoading(true);
      
      // For WRRP, load actual curriculum data
      if (program.id === 'wrrp') {
        // Mock WRRP curriculum data - in real app, this would come from backend
        const wrrpModules: ProgramModule[] = [
          {
            id: 'module1',
            title: 'Module 1: Personal Development Foundation',
            description: 'Build self-awareness, confidence, and personal growth skills essential for refugee women.',
            duration: '4 weeks',
            lessons: 12,
            completed: false,
            topics: ['Self-Discovery', 'Goal Setting', 'Confidence Building', 'Time Management'],
            order: 1,
            isLocked: false
          },
          {
            id: 'module2',
            title: 'Module 2: Professional Skills Development',
            description: 'Develop job-ready skills including communication, teamwork, and professional etiquette.',
            duration: '6 weeks',
            lessons: 18,
            completed: false,
            topics: ['Resume Building', 'Interview Skills', 'Workplace Communication', 'Digital Literacy'],
            order: 2,
            isLocked: false
          },
          {
            id: 'module3',
            title: 'Module 3: Entrepreneurship & Business Skills',
            description: 'Learn business fundamentals, financial literacy, and entrepreneurial thinking.',
            duration: '8 weeks',
            lessons: 24,
            completed: false,
            topics: ['Business Planning', 'Marketing Basics', 'Financial Management', 'Customer Service'],
            order: 3,
            isLocked: false
          },
          {
            id: 'module4',
            title: 'Module 4: Leadership & Community Impact',
            description: 'Develop leadership skills and learn how to create positive community change.',
            duration: '6 weeks',
            lessons: 16,
            completed: false,
            topics: ['Leadership Styles', 'Team Building', 'Project Management', 'Community Engagement'],
            order: 4,
            isLocked: false
          },
          {
            id: 'module5',
            title: 'Module 5: Health & Wellness Integration',
            description: 'Focus on physical and mental health, work-life balance, and stress management.',
            duration: '4 weeks',
            lessons: 12,
            completed: false,
            topics: ['Mental Health', 'Physical Wellness', 'Stress Management', 'Work-Life Balance'],
            order: 5,
            isLocked: false
          },
          {
            id: 'module6',
            title: 'Module 6: Capstone Project & Graduation',
            description: 'Complete a final project integrating all learned skills and prepare for graduation.',
            duration: '6 weeks',
            lessons: 8,
            completed: false,
            topics: ['Project Planning', 'Skill Integration', 'Final Presentation', 'Career Planning'],
            order: 6,
            isLocked: false
          }
        ];
        setModules(wrrpModules);
      } else {
        // For other programs, show "development in progress" modules
        const developmentModules: ProgramModule[] = [
          {
            id: 'dev1',
            title: 'Curriculum Under Development',
            description: 'This program is currently being developed. Content will be available soon.',
            duration: 'TBD',
            lessons: 0,
            completed: false,
            topics: ['Curriculum Design', 'Content Creation', 'Assessment Development'],
            order: 1,
            isLocked: true,
            isComingSoon: true
          }
        ];
        setModules(developmentModules);
      }
    } catch (error) {
      console.error('Error loading program content:', error);
    } finally {
      setLoading(false);
    }
  }

  function toggleModule(moduleId: string) {
    setActiveModule(activeModule === moduleId ? null : moduleId);
  }

  const getProgramIcon = (type: string) => {
    switch (type) {
      case 'scholarship': return <Award className="w-6 h-6" />;
      case 'therapeutic': return <Target className="w-6 h-6" />;
      case 'leadership': return <TrendingUp className="w-6 h-6" />;
      case 'business': return <BarChart3 className="w-6 h-6" />;
      default: return <BookOpen className="w-6 h-6" />;
    }
  };

  const getProgramColor = (type: string) => {
    switch (type) {
      case 'scholarship': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'therapeutic': return 'bg-green-100 text-green-800 border-green-200';
      case 'leadership': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'business': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl mx-4">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">Loading program content...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg ${getProgramColor(program.type)}`}>
              {getProgramIcon(program.type)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{program.name}</h2>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getProgramColor(program.type)}`}>
                {program.type}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Program Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Program Overview</h3>
              <p className="text-gray-600 leading-relaxed">{program.description}</p>
              
              <div className="flex items-center gap-6 mt-4">
                <button
                  onClick={onEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit Program
                </button>
                
                {program.id === 'wrrp' && (
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <Play className="w-4 h-4" />
                    Start Program
                  </button>
                )}
              </div>
            </div>

            {/* Modules */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Curriculum</h3>
              
              {modules.map((module) => (
                <div key={module.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        module.isComingSoon 
                          ? 'bg-gray-100 text-gray-500' 
                          : module.isLocked 
                            ? 'bg-yellow-100 text-yellow-600' 
                            : module.completed 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-blue-100 text-blue-600'
                      }`}>
                        {module.isComingSoon ? (
                          <Clock className="w-4 h-4" />
                        ) : module.isLocked ? (
                          <X className="w-4 h-4" />
                        ) : module.completed ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{module.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                        
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="text-gray-500">
                            {module.lessons} lessons • {module.duration}
                          </span>
                          
                          {module.isComingSoon && (
                            <span className="text-orange-600 font-medium">Coming Soon</span>
                          )}
                          
                          {module.isLocked && !module.isComingSoon && (
                            <span className="text-yellow-600 font-medium">Locked</span>
                          )}
                          
                          {module.completed && (
                            <span className="text-green-600 font-medium">Completed</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      {activeModule === module.id ? (
                        <div className="w-6 h-6 text-gray-400">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-6 h-6 text-gray-400">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                  
                  {/* Expanded Content */}
                  {activeModule === module.id && (
                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                      <div className="space-y-3">
                        <h5 className="font-medium text-gray-900 mb-2">Module Topics</h5>
                        <div className="flex flex-wrap gap-2">
                          {module.topics.map((topic, index) => (
                            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              {topic}
                            </span>
                          ))}
                        </div>
                        
                        {program.id === 'wrrp' && (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                              <div className="space-y-2">
                                <h6 className="font-medium text-gray-900">Learning Objectives</h6>
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                  <li>Develop self-awareness and personal growth mindset</li>
                                  <li>Build professional and entrepreneurial skills</li>
                                  <li>Create effective time management strategies</li>
                                  <li>Establish healthy work-life balance practices</li>
                                </ul>
                              </div>
                              
                              <div className="space-y-2">
                                <h6 className="font-medium text-gray-900">Key Activities</h6>
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                  <li>Weekly reflection journals</li>
                                  <li>Peer mentoring sessions</li>
                                  <li>Skills development workshops</li>
                                  <li>Community impact projects</li>
                                </ul>
                              </div>
                            </div>
                            
                            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                              <h6 className="font-medium text-blue-900 mb-2">Assessment & Progress</h6>
                              <div className="space-y-2 text-sm text-blue-800">
                                <p>• Weekly progress reviews with program coordinator</p>
                                <p>• Skill assessment quizzes and practical assignments</p>
                                <p>• Final capstone project presentation</p>
                                <p>• Peer feedback and collaborative evaluation</p>
                              </div>
                            </div>
                          </>
                        )}
                        
                        {module.isComingSoon && (
                          <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                            <h6 className="font-medium text-orange-900 mb-2">Development Status</h6>
                            <div className="space-y-2 text-sm text-orange-800">
                              <p>• Curriculum framework is being designed</p>
                              <p>• Content creation in progress</p>
                              <p>• Expert review and validation scheduled</p>
                              <p>• Expected completion: Q2 2026</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
