import { useState, useEffect } from 'react';

interface LessonProgress {
  lessonId: string;
  completed: boolean;
  timeSpent: number;
}

interface ModuleProgress {
  moduleId: string;
  lessons: LessonProgress[];
  completedLessons: number;
  totalLessons: number;
  percentage: number;
  isCompleted: boolean;
}

const useModuleProgress = (courseId: string, moduleId: string) => {
  const [progress, setProgress] = useState<ModuleProgress>({
    moduleId,
    lessons: [],
    completedLessons: 0,
    totalLessons: 6, // Module 1 has 6 lessons (intro + outcomes + 4 lessons + summary)
    percentage: 0,
    isCompleted: false
  });

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem(`course_${courseId}_module_${moduleId}_progress`);
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, [courseId, moduleId]);

  // Listen for storage changes to force re-render
  useEffect(() => {
    const storageKey = `course_${courseId}_module_${moduleId}_progress`;
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === storageKey && e.newValue) {
        try {
          setProgress(JSON.parse(e.newValue) as ModuleProgress);
        } catch {
          // Ignore malformed storage values.
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [courseId, moduleId]);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`course_${courseId}_module_${moduleId}_progress`, JSON.stringify(progress));
  }, [progress, courseId, moduleId]);

  const markLessonCompleted = (lessonId: string) => {
    setProgress(prev => {
      const updatedLessons = prev.lessons.map(lesson => 
        lesson.lessonId === lessonId 
          ? { ...lesson, completed: true }
          : lesson
      );

      // If lesson doesn't exist, add it
      if (!updatedLessons.find(l => l.lessonId === lessonId)) {
        updatedLessons.push({
          lessonId,
          completed: true,
          timeSpent: 0
        });
      }

      const completedCount = updatedLessons.filter(l => l.completed).length;
      const percentage = Math.round((completedCount / prev.totalLessons) * 100);
      const isCompleted = completedCount === prev.totalLessons;

      const newProgress = {
        ...prev,
        lessons: updatedLessons,
        completedLessons: completedCount,
        percentage,
        isCompleted
      };

      // Force a storage event to notify other components
      window.dispatchEvent(new StorageEvent('storage', {
        key: `course_${courseId}_module_${moduleId}_progress`,
        newValue: JSON.stringify(newProgress)
      }));

      return newProgress;
    });
  };

  const isLessonCompleted = (lessonId: string) => {
    return progress.lessons.some(lesson => lesson.lessonId === lessonId && lesson.completed);
  };

  const resetProgress = () => {
    setProgress({
      moduleId,
      lessons: [],
      completedLessons: 0,
      totalLessons: 6,
      percentage: 0,
      isCompleted: false
    });
  };

  return {
    progress,
    markLessonCompleted,
    isLessonCompleted,
    resetProgress
  };
};

export default useModuleProgress;
