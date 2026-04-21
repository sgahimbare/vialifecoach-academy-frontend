import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lightbulb, TrendingUp, DollarSign, Users, Clock, BookOpen, CheckCircle, Play, ArrowLeft } from "lucide-react";
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

export default function EntrepreneurshipPillar() {
  const navigate = useNavigate();
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  const pillarInfo = {
    title: "Entrepreneurship Skills",
    subtitle: "Building Business Success and Practical Skills",
    description: "Transform your ideas into sustainable businesses with practical entrepreneurship training, financial literacy, and hands-on business development support.",
    color: "#F5A623",
    duration: "1-3 months",
    totalModules: 8,
    icon: <Lightbulb className="h-8 w-8" />
  };

  const entrepreneurshipModules: Module[] = [
    {
      id: 'business-foundation',
      title: 'Business Foundation and Planning',
      description: 'Learn the fundamentals of starting and running a successful business',
      duration: '2-3 weeks',
      lessons: 8,
      completed: false,
      topics: [
        'Business idea validation',
        'Market research basics',
        'Business model canvas',
        'Financial planning fundamentals'
      ]
    },
    {
      id: 'marketing-strategies',
      title: 'Marketing and Customer Acquisition',
      description: 'Develop effective marketing strategies to reach and retain customers',
      duration: '2-3 weeks',
      lessons: 7,
      completed: false,
      topics: [
        'Digital marketing basics',
        'Social media marketing',
        'Content creation',
        'Customer relationship management'
      ]
    },
    {
      id: 'financial-management',
      title: 'Financial Management and Funding',
      description: 'Master business finances, budgeting, and funding strategies',
      duration: '2-3 weeks',
      lessons: 6,
      completed: false,
      topics: [
        'Business accounting basics',
        'Budgeting and cash flow',
        'Pricing strategies',
        'Funding options and grants'
      ]
    },
    {
      id: 'operations-management',
      title: 'Operations and Process Management',
      description: 'Build efficient business operations and workflows',
      duration: '2-3 weeks',
      lessons: 5,
      completed: false,
      topics: [
        'Process optimization',
        'Time management',
        'Quality control',
        'Scaling operations'
      ]
    },
    {
      id: 'leadership-skills',
      title: 'Leadership and Team Building',
      description: 'Develop the leadership skills needed to grow your business',
      duration: '2-3 weeks',
      lessons: 6,
      completed: false,
      topics: [
        'Leadership fundamentals',
        'Team building',
        'Communication skills',
        'Conflict resolution'
      ]
    },
    {
      id: 'digital-skills',
      title: 'Digital Skills and Online Business',
      description: 'Master essential digital tools for modern business operations',
      duration: '2-3 weeks',
      lessons: 7,
      completed: false,
      topics: [
        'Website development basics',
        'E-commerce platforms',
        'Online payment systems',
        'Digital security'
      ]
    },
    {
      id: 'networking-growth',
      title: 'Networking and Business Growth',
      description: 'Build professional networks and strategies for business expansion',
      duration: '2-3 weeks',
      lessons: 5,
      completed: false,
      topics: [
        'Professional networking',
        'Partnership development',
        'Growth strategies',
        'Market expansion'
      ]
    },
    {
      id: 'business-launch',
      title: 'Business Launch and Success Planning',
      description: 'Prepare for successful business launch and long-term sustainability',
      duration: '1-2 weeks',
      lessons: 4,
      completed: false,
      topics: [
        'Launch planning',
        'Success metrics',
        'Risk management',
        'Future growth planning'
      ]
    }
  ];

  useEffect(() => {
    // Simulate loading modules and user progress
    setTimeout(() => {
      setModules(entrepreneurshipModules);
      setUserProgress({
        currentModule: 0,
        completedModules: [],
        totalProgress: 0
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleModuleClick = (moduleId: string) => {
    navigate(`/program/entrepreneurship/module/${moduleId}`);
  };

  const handleStartPillar = () => {
    navigate(`/program/entrepreneurship/module/${modules[0]?.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
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
        <div className="bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl p-8 text-white mb-8">
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
                  <span>150+ Women Enrolled</span>
                </div>
              </div>

              <button
                onClick={handleStartPillar}
                className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                Start First Module
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <TrendingUp className="h-8 w-8 mb-2" />
                <h3 className="font-semibold mb-1">Growth Focused</h3>
                <p className="text-sm opacity-90">Strategies for sustainable business growth</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <DollarSign className="h-8 w-8 mb-2" />
                <h3 className="font-semibold mb-1">Financial Literacy</h3>
                <p className="text-sm opacity-90">Master business finances and funding</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <Lightbulb className="h-8 w-8 mb-2" />
                <h3 className="font-semibold mb-1">Innovation Driven</h3>
                <p className="text-sm opacity-90">Creative problem-solving approaches</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <Users className="h-8 w-8 mb-2" />
                <h3 className="font-semibold mb-1">Community Support</h3>
                <p className="text-sm opacity-90">Network of women entrepreneurs</p>
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
              <span className="font-bold text-orange-600">{userProgress.totalProgress}%</span>
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
                    backgroundColor: module.completed ? '#FEF3C7' : '#FFFBEB',
                    borderColor: module.completed ? '#F59E0B' : '#FDE68A',
                    borderWidth: '1px'
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: module.completed ? '#F59E0B' : pillarInfo.color
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
                      <span className="text-sm text-orange-600 font-medium">Completed</span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">Key Topics:</div>
                    <div className="flex flex-wrap gap-1">
                      {module.topics.slice(0, 3).map((topic, topicIndex) => (
                        <span
                          key={topicIndex}
                          className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded"
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

        {/* Business Resources Section */}
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Business Resources & Support</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Micro-Grants</h3>
              <p className="text-sm text-gray-600">Access to startup funding and grants</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Mentor Network</h3>
              <p className="text-sm text-gray-600">Connect with experienced entrepreneurs</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Market Access</h3>
              <p className="text-sm text-gray-600">Opportunities to showcase your products</p>
            </div>
          </div>
        </div>
      </div>
    </ProgramLayout>
  );
}
