import { useState, useEffect } from 'react';
import type { Course, CourseProgress } from '../../types/course';
import { courseApi } from '../../services/courseApi';

export function useCourse(courseId: string) {
  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Validate courseId before making requests
        if (!courseId || courseId === 'NaN' || isNaN(Number(courseId))) {
          throw new Error('Invalid course ID');
        }
        
        const [courseData, progressData] = await Promise.all([
          courseApi.getCourse(courseId),
          courseApi.getCourseProgress(courseId, 'current-user')
        ]);
        
        setCourse(courseData);
        setProgress(progressData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    if (courseId && courseId !== 'NaN') {
      loadCourse();
    } else {
      setLoading(false);
      setError('Invalid course ID');
    }
  }, [courseId]);

  const markLessonComplete = async (lessonId: string) => {
    try {
      await courseApi.updateLessonProgress(lessonId, true);
      
      if (progress) {
        const updatedProgress = {
          ...progress,
          completedLessons: [...progress.completedLessons, lessonId]
        };
        setProgress(updatedProgress);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update progress');
    }
  };

  return {
    course,
    progress,
    loading,
    error,
    markLessonComplete
  };
}
