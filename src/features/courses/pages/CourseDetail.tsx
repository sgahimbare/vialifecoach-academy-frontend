import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { CourseHeader } from '../../courses/components/CourseHeader';
import { CourseSidebar } from '../../courses/components/CourseSidebar';
import { LessonContent } from '../../courses/components/LessonContent';
import { useCourse } from '../../hooks/useCourse';
import type { Lesson } from '../../../types/course';

interface CourseDetailProps {
  courseId: string;
  onBack?: () => void;
}

export function CourseDetail({ courseId, onBack }: CourseDetailProps) {
  const { course, progress, loading, error, markLessonComplete } = useCourse(courseId);
  const [currentLessonId, setCurrentLessonId] = useState<string>('');

  // Set initial lesson when course loads
  useEffect(() => {
    if (course && progress && !currentLessonId) {
      setCurrentLessonId(progress.currentLesson);
    }
  }, [course, progress, currentLessonId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading course...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !course || !progress) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="mb-4">Failed to Load Course</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </motion.div>
      </div>
    );
  }

  const getCurrentLesson = (): Lesson | null => {
    for (const module of course.modules) {
      const lesson = module.lessons.find(l => l.id === currentLessonId);
      if (lesson) return lesson;
    }
    return null;
  };

  const getNextLesson = (): Lesson | null => {
    let foundCurrent = false;
    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        if (foundCurrent && !lesson.locked) {
          return lesson;
        }
        if (lesson.id === currentLessonId) {
          foundCurrent = true;
        }
      }
    }
    return null;
  };

  const handleNextLesson = () => {
    const nextLesson = getNextLesson();
    if (nextLesson) {
      setCurrentLessonId(nextLesson.id);
    }
  };

  const handleMarkComplete = async () => {
    const currentLesson = getCurrentLesson();
    if (currentLesson) {
      await markLessonComplete(currentLesson.id);
    }
  };

  const currentLesson = getCurrentLesson();
  const nextLesson = getNextLesson();
  const isCompleted = currentLesson ? progress.completedLessons.includes(currentLesson.id) : false;

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Back Button */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Course Header */}
      <CourseHeader course={course} progress={progress} />

      {/* Main Content Area */}
      <div className="flex h-[calc(100vh-320px)]">
        {/* Course Sidebar */}
        <CourseSidebar
          course={course}
          progress={progress}
          currentLessonId={currentLessonId}
          onLessonSelect={setCurrentLessonId}
        />

        {/* Lesson Content */}
        {currentLesson ? (
          <LessonContent
            lesson={currentLesson}
            course={course}
            isCompleted={isCompleted}
            onMarkComplete={handleMarkComplete}
            onNextLesson={handleNextLesson}
            hasNextLesson={!!nextLesson}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h3 className="mb-2">Welcome to {course.title}</h3>
              <p className="text-muted-foreground mb-6">
                Select a lesson from the sidebar to get started with your learning journey.
              </p>
              <Button
                onClick={() => setCurrentLessonId(progress.currentLesson)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Continue Learning
              </Button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}