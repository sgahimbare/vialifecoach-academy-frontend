import { motion } from 'motion/react';
import { Badge } from '../../../components/ui/badge';
import { Progress } from '../../../components/ui/progress';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { Clock, Users, Star, Award } from 'lucide-react';
import type { Course, CourseProgress } from '../../../types/course';

interface CourseHeaderProps {
  course: Course;
  progress: CourseProgress;
}

export function CourseHeader({ course, progress }: CourseHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white"
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Course Image */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative rounded-xl overflow-hidden shadow-2xl"
            >
              <ImageWithFallback
                src={course.coverImage}
                alt={course.title}
                className="w-full h-48 lg:h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
            </motion.div>
          </div>

          {/* Course Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex items-center gap-3 mb-3"
              >
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {course.level}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <Award className="w-3 h-3 mr-1" />
                  Certificate
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-4"
              >
                {course.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-blue-100 leading-relaxed mb-6"
              >
                {course.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm"
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-300" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-300" />
                  <span>{course.enrolledStudents.toLocaleString()} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{course.rating} rating</span>
                </div>
                <div className="text-blue-300">
                  Instructor: {course.instructor}
                </div>
              </motion.div>
            </div>

            {/* Progress Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-blue-100">Course Progress</span>
                <span className="text-sm font-medium">{progress.progressPercentage}% Complete</span>
              </div>
              <Progress 
                value={progress.progressPercentage} 
                className="h-2 bg-white/20"
              />
              <div className="mt-2 text-xs text-blue-200">
                {progress.completedLessons.length} lessons completed • 
                {Math.round(progress.timeSpent / 60)} hours studied
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}