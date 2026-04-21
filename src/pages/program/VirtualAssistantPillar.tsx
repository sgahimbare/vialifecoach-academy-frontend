import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Monitor, Briefcase, Users, Clock, BookOpen, CheckCircle, Play, ArrowLeft, Award } from "lucide-react";
import { ProgramLayout } from "@/components/program/ProgramLayout";

interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  lessons: number;
  completed: boolean;
  topics: string[];
}

interface UserProgress {
  currentModule: number;
  completedModules: string[];
  totalProgress: number;
}

export default function VirtualAssistantPillar() {
  const navigate = useNavigate();
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  const pillarInfo = {
    title: "Virtual Assistant Program",
    subtitle: "Career Development and Office Skills Training",
    description: "Launch your career with in-demand virtual assistant and office skills, preparing you for remote work opportunities and professional success.",
    color: "#9013FE",
    duration: "1-3 months",
    totalModules: 7,
    icon: <Monitor className="h-8 w-8" />
  };

  const virtualAssistantModules: Module[] = [
    {
      id: 'office-software',
      title: 'Office Software Mastery',
      description: 'Master essential office software including Microsoft Office and Google Workspace',
      duration: '2-3 weeks',
      lessons: 8,
      completed: false,
      topics: [
        'Microsoft Word advanced features',
        'Excel formulas and data analysis',
        'PowerPoint presentations',
        'Google Workspace collaboration'
      ]
    },
    {
      id: 'communication-skills',
      title: 'Professional Communication',
      description: 'Develop excellent written and verbal communication skills for the workplace',
      duration: '2-3 weeks',
      lessons: 7,
      completed: false,
      topics: [
        'Business email etiquette',
        'Professional phone skills',
        'Report writing',
        'Presentation skills'
      ]
    },
    {
      id: 'time-management',
      title: 'Time Management and Organization',
      description: 'Learn to manage multiple tasks, deadlines, and priorities effectively',
      duration: '2-3 weeks',
      lessons: 6,
      completed: false,
      topics: [
        'Prioritization techniques',
        'Calendar management',
        'Task tracking systems',
        'Work-life balance'
      ]
    },
    {
      id: 'project-management',
      title: 'Project Management Basics',
      description: 'Understand project management principles and tools for efficient workflow',
      duration: '2-3 weeks',
      lessons: 5,
      completed: false,
      topics: [
        'Project planning',
        'Task delegation',
        'Progress tracking',
        'Team coordination'
      ]
    },
    {
      id: 'client-relations',
      title: 'Client Relations and Customer Service',
      description: 'Build strong client relationships and provide excellent customer service',
      duration: '2-3 weeks',
      lessons: 6,
      completed: false,
      topics: [
        'Client onboarding',
        'Communication protocols',
        'Problem resolution',
        'Relationship building'
      ]
    },
    {
      id: 'remote-work',
      title: 'Remote Work Excellence',
      description: 'Master the skills needed for successful remote work and virtual collaboration',
      duration: '2-3 weeks',
      lessons: 7,
      completed: false,
      topics: [
        'Home office setup',
        'Virtual meeting etiquette',
        'Self-discipline',
        'Digital security'
      ]
    },
    {
      id: 'job-placement',
      title: 'Job Placement and Career Development',
      description: 'Prepare for job searches, interviews, and long-term career growth',
      duration: '1-2 weeks',
      lessons: 4,
      completed: false,
      topics: [
        'Resume building',
        'Interview preparation',
        'Portfolio creation',
        'Career planning'
      ]
    }
  ];

  useEffect(() => {
    // Simulate loading modules and user progress
    setTimeout(() => {
      setModules(virtualAssistantModules);
      setUserProgress({
        currentModule: 0,
        completedModules: [],
        totalProgress: 0
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleModuleClick = (moduleId: string) => {
    navigate(`/program/virtual-assistant/module/${moduleId}`);
  };

  const handleStartPillar = () => {
    navigate(`/program/virtual-assistant/module/${modules[0]?.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <ProgramLayout
      title={pillarInfo.title}
      subtitle={pillarInfo.subtitle}
      color={pillarInfo.color}
      icon={pillarInfo.icon}
    >
      <div className="max-w-4xl mx-auto">
        {/* Back Navigation */}
        <button
          onClick={() => navigate('/program/women-refugee-rise')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Program Overview
        </button>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-8 text-white mb-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl font-bold mb-4">{pillarInfo.title}</h1>
              <p className="text-lg mb-6 opacity-90">{pillarInfo.description}</p>
              
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{pillarInfo.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  <span>{pillarInfo.totalModules} Modules</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>180+ Women Enrolled</span>
                </div>
              </div>

              <button
                onClick={handleStartPillar}
                className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                Start First Module
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <Monitor className="h-8 w-8 mb-2" />
                <h3 className="font-semibold mb-1">Remote Ready</h3>
                <p className="text-sm opacity-90">Prepared for virtual work environments</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <Briefcase className="h-8 w-8 mb-2" />
                <h3 className="font-semibold mb-1">Professional Skills</h3>
                <p className="text-sm opacity-90">In-demand office and admin skills</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <Users className="h-8 w-8 mb-2" />
                <h3 className="font-semibold mb-1">Job Placement</h3>
                <p className="text-sm opacity-90">Direct employment opportunities</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <Award className="h-8 w-8 mb-2" />
                <h3 className="font-semibold mb-1">Certified Training</h3>
                <p className="text-sm opacity-90">Industry-recognized certification</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        {userProgress && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Progress</h2>
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600">
                {userProgress.completedModules.length} of {modules.length} modules completed
              </span>
              <span className="font-bold text-purple-600">{userProgress.totalProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="h-3 rounded-full transition-all duration-300"
                style={{
                  width: `${userProgress.totalProgress}%`,
                  backgroundColor: pillarInfo.color
                }}
              ></div>
            </div>
          </div>
        )}

        {/* Modules Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Modules</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {modules.map((module, index) => (
              <div
                key={module.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleModuleClick(module.id)}
              >
                <div
                  className="p-6"
                  style={{
                    backgroundColor: module.completed ? '#F3E8FF' : '#FAF5FF',
                    borderColor: module.completed ? '#9333EA' : '#E9D5FF',
                    borderWidth: '1px'
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: module.completed ? '#9333EA' : pillarInfo.color
                        }}
                      >
                        {module.completed ? (
                          <CheckCircle className="h-5 w-5 text-white" />
                        ) : (
                          <span className="text-white font-bold">{index + 1}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{module.title}</h3>
                        <p className="text-sm text-gray-600">{module.duration}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{module.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-600">{module.lessons} lessons</span>
                    {module.completed && (
                      <span className="text-sm text-purple-600 font-medium">Completed</span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">Key Topics:</div>
                    <div className="flex flex-wrap gap-1">
                      {module.topics.slice(0, 3).map((topic, topicIndex) => (
                        <span
                          key={topicIndex}
                          className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded"
                        >
                          {topic}
                        </span>
                      ))}
                      {module.topics.length > 3 && (
                        <span className="text-xs text-gray-500 italic">
                          +{module.topics.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Career Opportunities Section */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Career Opportunities & Support</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Job Placement</h3>
              <p className="text-sm text-gray-600">Direct connections to employers seeking virtual assistants</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Professional Certification</h3>
              <p className="text-sm text-gray-600">Industry-recognized VA certification upon completion</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Alumni Network</h3>
              <p className="text-sm text-gray-600">Ongoing support and networking opportunities</p>
            </div>
          </div>
        </div>

        {/* Success Metrics */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Program Success Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">85%</div>
              <div className="text-sm text-gray-600">Job Placement Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">$25/hr</div>
              <div className="text-sm text-gray-600">Average Starting Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">4.8/5</div>
              <div className="text-sm text-gray-600">Employer Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">3 months</div>
              <div className="text-sm text-gray-600">Average Job Search Time</div>
            </div>
          </div>
        </div>
      </div>
    </ProgramLayout>
  );
}
