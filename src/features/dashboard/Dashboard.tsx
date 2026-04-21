import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { ImageWithFallback } from '../courses/components/ImageWithFallback';
import { Clock, Users, Star, BookOpen, ArrowRight, Search } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { courseApi } from '../../services/courseApi';
import type { Course } from '../../types/course';

interface CourseDashboardProps {
  onSelectCourse: (courseId: string) => void;
  onEnrollInCourses: () => void;
}

export function CourseDashboard({ onSelectCourse, onEnrollInCourses }: CourseDashboardProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const allCourses = await courseApi.getAllCourses();
        setCourses(allCourses);
      } catch (error) {
        console.error('Failed to load courses:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading courses...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white">
        <div className="container mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="mb-4">DicetheLifeCoach Academy</h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Transform lives through expert coaching programs. Choose from our comprehensive
              curriculum designed for personal and professional development.
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button
                onClick={onEnrollInCourses}
                size="lg"
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Enroll in Courses
              </Button>
            </div>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search courses, skills, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-blue-200"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="mb-2">My Enrolled Courses</h2>
          <p className="text-muted-foreground">
            {filteredCourses.filter(course => course.progress > 0).length} enrolled course{filteredCourses.filter(course => course.progress > 0).length !== 1 ? 's' : ''}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.filter(course => course.progress > 0).map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <ImageWithFallback
                    src={course.coverImage}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={getLevelColor(course.level)}>
                      {course.level}
                    </Badge>
                  </div>
                  {course.progress > 0 && (
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-black/60 rounded-md p-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-white text-sm">Progress</span>
                          <span className="text-white text-sm">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-1" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-4">
                    <Badge variant="outline" className="mb-2">
                      {getCategoryFromTitle(course.title)}
                    </Badge>
                    <h3 className="mb-2 line-clamp-2">{course.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-3">
                      {course.description}
                    </p>
                    <p className="text-sm font-medium text-blue-600 mb-3">
                      by {course.instructor}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {course.skills.slice(0, 3).map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {course.skills.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{course.skills.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {course.duration}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {course.enrolledStudents.toLocaleString()}
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                      {course.rating}
                    </div>
                  </div>

                  <div className="mt-auto">
                    <Button
                      onClick={() => onSelectCourse(course.id)}
                      className="w-full group"
                    >
                      {course.progress > 0 ? 'Continue' : 'Start'} Course
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredCourses.filter(course => course.progress > 0).length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="mb-2">No enrolled courses yet</h3>
            <p className="text-muted-foreground mb-6">
              Start your learning journey by enrolling in courses that match your goals.
            </p>
            <Button onClick={onEnrollInCourses} size="lg">
              <BookOpen className="w-5 h-5 mr-2" />
              Browse & Enroll in Courses
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}