import { apiRequest } from "@/lib/api";

export type ModuleProgress = {
  id: number;
  module_title: string;
  module_order: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  completedLessons: number;
  totalLessons: number;
  lessons: Array<{
    lesson_id: number;
    lesson_title: string;
    lesson_order: number;
    completed: boolean;
    completed_at?: string;
  }>;
};

export type CourseProgress = {
  course_id: number;
  modules: ModuleProgress[];
  overall_progress: {
    completed_modules: number;
    total_modules: number;
    completed_lessons: number;
    total_lessons: number;
  };
};

function getAuthToken(): string | null {
  return localStorage.getItem("accessToken");
}

export const courseProgressService = {
  async getCourseProgress(courseId: number | string): Promise<CourseProgress> {
    const token = getAuthToken();
    
    // Validate courseId
    if (!courseId || courseId === 'NaN' || isNaN(Number(courseId))) {
      throw new Error('Invalid course ID');
    }

    if (!token) {
      throw new Error("Authentication required for course progress");
    }
    
    const response = await apiRequest<{ data: CourseProgress }>(`/course-progress/courses/${courseId}/progress`, {
      token,
    });
    return response.data;
  },

  async markLessonComplete(courseId: number, moduleId: number, lessonId: number) {
    const token = getAuthToken();
    return apiRequest<{
      success: boolean;
      message: string;
      data: {
        lesson_completed: boolean;
        module_completed: boolean;
        module_progress: {
          completed: number;
          total: number;
        };
      };
    }>(`/course-progress/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/complete`, {
      method: "POST",
      token,
      body: JSON.stringify({ moduleId }),
    });
  },

  async checkModuleAccess(courseId: number, moduleId: number) {
    const token = getAuthToken();
    const response = await apiRequest<{
      success: boolean;
      data: {
        can_access: boolean;
        reason?: string;
        module_order: number;
      };
    }>(`/course-progress/courses/${courseId}/modules/${moduleId}/access`, {
      token,
    });
    return response.data;
  },
};
