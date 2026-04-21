import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Progress } from '../../../components/ui/progress';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { DashboardNavbar } from '../../dashboard/DashboardNavbar';
import { 
  ArrowLeft,
  Clock,
  Users,
  Star,
  BookOpen,
  CheckCircle,
  Circle,
  Award,
  Target,
  User
} from 'lucide-react';
import { courseApi } from '../../../services/courseApi';
import type { Course } from '../../../types/course';

interface SimplifiedCourseDetailProps {
  courseId: string;
  onBack?: () => void;
  onLogout?: () => void;
}

export function SimplifiedCourseDetail({ courseId, onBack, onLogout }: SimplifiedCourseDetailProps) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState<string>('');

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const courseData = await courseApi.getCourseById(courseId);
        setCourse(courseData);
        if (courseData.modules.length > 0) {
          setSelectedModule(courseData.modules[0].id);
        }
      } catch (error) {
        console.error('Failed to load course:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [courseId]);

  const getCategoryFromTitle = (title: string) => {
    if (title.includes('Personal Development') || title.includes('Life Coaching')) {
      return 'Personal Development';
    }
    if (title.includes('Leadership') || title.includes('Success')) {
      return 'Leadership & Success';
    }
    if (title.includes('Motivational') || title.includes('Speaking')) {
      return 'Public Speaking';
    }
    if (title.includes('Corporate') || title.includes('Wellness')) {
      return 'Corporate Wellness';
    }
    if (title.includes('Youth') || title.includes('Student')) {
      return 'Youth Development';
    }
    return 'General';
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLessonComplete = (moduleId: string, lessonId: string) => {
    // In a real app, this would update the backend
    console.log(`Completed lesson ${lessonId} in module ${moduleId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading course content...</p>
        </motion.div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4">Course not found</h2>
          <Button onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const selectedModuleData = course.modules.find(m => m.id === selectedModule);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      {/* <DashboardNavbar 
        onLogout={onLogout}
        userName="Student" 
        userEmail="student@academy.com"
        notifications={3}
      /> */}
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white">
        <div className="container mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="text-white hover:bg-white/10 mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Button>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Badge variant="outline" className="mb-4 bg-white/10 text-white border-white/20">
                  {getCategoryFromTitle(course.title)}
                </Badge>
                <h1 className="mb-4">{course.title}</h1>
                <p className="text-xl text-blue-100 mb-6">{course.description}</p>
                
                <div className="flex items-center mb-6">
                  <User className="w-5 h-5 mr-2" />
                  <span className="font-medium">Instructor: {course.instructor}</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <Clock className="w-6 h-6 mx-auto mb-2" />
                    <div className="font-medium">{course.duration}</div>
                    <div className="text-sm text-blue-200">Duration</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <Badge className={`${getLevelColor(course.level)} mb-2`}>
                      {course.level}
                    </Badge>
                    <div className="text-sm text-blue-200">Level</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <Users className="w-6 h-6 mx-auto mb-2" />
                    <div className="font-medium">{course.enrolledStudents.toLocaleString()}</div>
                    <div className="text-sm text-blue-200">Students</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <Star className="w-6 h-6 mx-auto mb-2 fill-yellow-400 text-yellow-400" />
                    <div className="font-medium">{course.rating}</div>
                    <div className="text-sm text-blue-200">Rating</div>
                  </div>
                </div>

                {course.progress > 0 && (
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Your Progress</span>
                      <span className="font-medium">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                )}
              </div>

              <div className="lg:col-span-1">
                <Card className="bg-white/10 border-white/20">
                  <div className="p-6">
                    <ImageWithFallback
                      src={course.coverImage}
                      alt={course.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  </div>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Module Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <div className="p-6">
                <h3 className="mb-4">Course Modules</h3>
                <div className="space-y-2">
                  {course.modules.map((module, index) => (
                    <Button
                      key={module.id}
                      variant={selectedModule === module.id ? "default" : "ghost"}
                      className="w-full justify-start text-left"
                      onClick={() => setSelectedModule(module.id)}
                    >
                      <span className="mr-3 bg-primary/10 text-primary rounded-full w-6 h-6 text-xs flex items-center justify-center">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <div className="font-medium line-clamp-1">{module.title}</div>
                        <div className="text-xs text-muted-foreground">{module.duration}</div>
                      </div>
                      {module.completed && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Skills & Prerequisites */}
            <Card className="mt-6">
              <div className="p-6">
                <h4 className="mb-4">What You'll Learn</h4>
                <div className="space-y-2">
                  {course.skills.map((skill, index) => (
                    <div key={index} className="flex items-center">
                      <Target className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-sm">{skill}</span>
                    </div>
                  ))}
                </div>

                {course.prerequisites.length > 0 && (
                  <div className="mt-6">
                    <h4 className="mb-4">Prerequisites</h4>
                    <div className="space-y-2">
                      {course.prerequisites.map((prereq, index) => (
                        <Badge key={index} variant="outline" className="text-xs mr-1 mb-1">
                          {prereq}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedModuleData && (
              <motion.div
                key={selectedModule}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card>
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="mb-2">{selectedModuleData.title}</h2>
                        <p className="text-muted-foreground">{selectedModuleData.description}</p>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{selectedModuleData.duration}</span>
                      </div>
                    </div>

                    {/* Lessons */}
                    <div className="space-y-4">
                      <h3 className="mb-4">Lessons</h3>
                      {selectedModuleData.lessons.map((lesson, index) => (
                        <Card key={lesson.id} className="p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center flex-1">
                              <div className="mr-4">
                                {lesson.completed ? (
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : (
                                  <Circle className="w-5 h-5 text-muted-foreground" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="mb-1">{lesson.title}</h4>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <BookOpen className="w-4 h-4 mr-1" />
                                  <span className="capitalize">{lesson.type}</span>
                                  <span className="mx-2">•</span>
                                  <Clock className="w-4 h-4 mr-1" />
                                  <span>{lesson.duration}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center">
                              {lesson.locked ? (
                                <Badge variant="outline" className="text-xs">
                                  Locked
                                </Badge>
                              ) : (
                                <Button
                                  size="sm"
                                  variant={lesson.completed ? "outline" : "default"}
                                  onClick={() => handleLessonComplete(selectedModuleData.id, lesson.id)}
                                >
                                  {lesson.completed ? 'Review' : 'Start'}
                                </Button>
                              )}
                            </div>
                          </div>
                          
                          {lesson.content && (
                            <div className="mt-4 pl-9">
                              <div className="prose text-sm text-muted-foreground">
                                {lesson.content}
                              </div>
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>

                    {/* Module Completion */}
                    {selectedModuleData.completed && (
                      <Card className="mt-6 bg-green-50 border-green-200">
                        <div className="p-4 flex items-center">
                          <Award className="w-5 h-5 text-green-600 mr-3" />
                          <div>
                            <h4 className="text-green-800">Module Completed!</h4>
                            <p className="text-sm text-green-600">
                              Congratulations on completing this module. Move on to the next one!
                            </p>
                          </div>
                        </div>
                      </Card>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}