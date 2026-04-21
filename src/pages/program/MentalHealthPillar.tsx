import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Brain, Shield, Users, Clock, BookOpen, CheckCircle, Play, ArrowLeft } from "lucide-react";
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

export default function MentalHealthPillar() {
  const navigate = useNavigate();
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  const pillarInfo = {
    title: "Mental Health Coaching",
    subtitle: "Building Emotional Resilience and Wellness",
    description: "This foundational pillar helps you heal from trauma, build emotional strength, and develop the mental wellness foundation needed for success in all areas of life.",
    color: "#4A90E2",
    duration: "1-3 months",
    totalModules: 6,
    icon: <Heart className="h-8 w-8" />
  };

  const mentalHealthModules: Module[] = [
    {
      id: 'trauma-healing',
      title: 'Trauma Healing and Recovery',
      description: 'Understanding and processing past traumas in a safe, supportive environment',
      duration: '2-3 weeks',
      lessons: 8,
      completed: false,
      topics: [
        'Understanding trauma responses',
        'Safe healing techniques',
        'Processing difficult memories',
        'Building emotional safety'
      ]
    },
    {
      id: 'emotional-resilience',
      title: 'Building Emotional Resilience',
      description: 'Develop the strength to bounce back from life\'s challenges',
      duration: '2-3 weeks',
      lessons: 7,
      completed: false,
      topics: [
        'Resilience mindset',
        'Coping strategies',
        'Emotional regulation',
        'Stress management'
      ]
    },
    {
      id: 'self-care-practices',
      title: 'Self-Care and Wellness Habits',
      description: 'Establish daily practices that support your mental and emotional wellbeing',
      duration: '2-3 weeks',
      lessons: 6,
      completed: false,
      topics: [
        'Daily self-care routines',
        'Physical wellness',
        'Mindfulness practices',
        'Healthy boundaries'
      ]
    },
    {
      id: 'support-networks',
      title: 'Building Support Networks',
      description: 'Create meaningful connections and build your community of support',
      duration: '2-3 weeks',
      lessons: 5,
      completed: false,
      topics: [
        'Healthy relationships',
        'Community building',
        'Peer support',
        'Professional help access'
      ]
    },
    {
      id: 'confidence-building',
      title: 'Confidence and Self-Worth',
      description: 'Rebuild your self-esteem and recognize your inherent value',
      duration: '2-3 weeks',
      lessons: 6,
      completed: false,
      topics: [
        'Self-worth foundation',
        'Positive self-talk',
        'Achievement recognition',
        'Future visioning'
      ]
    },
    {
      id: 'future-readiness',
      title: 'Future Readiness and Goal Setting',
      description: 'Prepare mentally and emotionally for the next pillars of your journey',
      duration: '1-2 weeks',
      lessons: 4,
      completed: false,
      topics: [
        'Goal setting skills',
        'Future planning',
        'Motivation maintenance',
        'Success mindset'
      ]
    }
  ];

  useEffect(() => {
    // Simulate loading modules and user progress
    setTimeout(() => {
      setModules(mentalHealthModules);
      setUserProgress({
        currentModule: 0,
        completedModules: [],
        totalProgress: 0
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleModuleClick = (moduleId: string) => {
    navigate(`/program/mental-health/module/${moduleId}`);
  };

  const handleStartPillar = () => {
    navigate(`/program/mental-health/module/${modules[0]?.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white mb-8">
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
                  <span>200+ Women Enrolled</span>
                </div>
              </div>

              <button
                onClick={handleStartPillar}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                Start First Module
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <Brain className="h-8 w-8 mb-2" />
                <h3 className="font-semibold mb-1">Trauma-Informed</h3>
                <p className="text-sm opacity-90">Safe, evidence-based healing approaches</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <Shield className="h-8 w-8 mb-2" />
                <h3 className="font-semibold mb-1">Confidential Support</h3>
                <p className="text-sm opacity-90">Private, respectful environment</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <Heart className="h-8 w-8 mb-2" />
                <h3 className="font-semibold mb-1">Community Focus</h3>
                <p className="text-sm opacity-90">Connect with other refugee women</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <Users className="h-8 w-8 mb-2" />
                <h3 className="font-semibold mb-1">Expert Guidance</h3>
                <p className="text-sm opacity-90">Professional counselors and mentors</p>
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
              <span className="font-bold text-blue-600">{userProgress.totalProgress}%</span>
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
                    backgroundColor: module.completed ? '#F0FDF4' : '#F8FAFC',
                    borderColor: module.completed ? '#10B981' : '#E5E7EB',
                    borderWidth: '1px'
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: module.completed ? '#10B981' : pillarInfo.color
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
                      <span className="text-sm text-green-600 font-medium">Completed</span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">Key Topics:</div>
                    <div className="flex flex-wrap gap-1">
                      {module.topics.slice(0, 3).map((topic, topicIndex) => (
                        <span
                          key={topicIndex}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
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

        {/* Support Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Support & Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Peer Support Groups</h3>
              <p className="text-sm text-gray-600">Connect with other women on similar journeys</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Personal Counseling</h3>
              <p className="text-sm text-gray-600">One-on-one sessions with trained counselors</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Wellness Resources</h3>
              <p className="text-sm text-gray-600">Access to meditation apps and wellness tools</p>
            </div>
          </div>
        </div>
      </div>
    </ProgramLayout>
  );
}
