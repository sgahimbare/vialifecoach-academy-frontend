export interface CourseModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  completed: boolean;
  locked: boolean;
  lessons: Lesson[];
}

export interface Lesson{
  id: string;
  title: string;
  type: 'video' | 'reading' | 'quiz' | 'assignment';
  duration: string;
  completed: boolean;
  locked: boolean;
  content?: string;
}

export interface Course {
  id: string;
  course_code: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  progress: number;
  enrolledStudents: number;
  rating: number;
  coverImage: string;
  modules: CourseModule[];
  skills: string[];
  prerequisites: string[];
}

export interface CourseProgress {
  courseId: string;
  userId: string;
  completedLessons: string[];
  currentModule: string;
  currentLesson: string;
  progressPercentage: number;
  timeSpent: number;
  lastAccessed: Date;
}
export interface LessonProgress {
  lessonId: string;
  userId: string;
  completed: boolean;
  timeSpent: number;
  lastAccessed: Date;
}
export interface Exams{
    id: string;
    
}
