import type { Course, CourseProgress } from '../types/course';

const API_BASE_URL = 'http://localhost:5000/api/v1';

// Real backend API implementation
export const courseApi = {
  getCourse: async (courseId: string): Promise<Course> => {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const courseData = await response.json();
      // Transform backend data to match frontend Course interface
      return {
        id: courseData.id.toString(),
        course_code: courseData.id.toString(),
        title: courseData.title,
        description: courseData.description || '',
        instructor: 'ViaLife Coach Academy',
        duration: courseData.duration_weeks ? `${courseData.duration_weeks} weeks` : '6 weeks',
        level: (courseData.level as 'Beginner' | 'Intermediate' | 'Advanced') || 'Beginner',
        progress: 0,
        enrolledStudents: courseData.enrollment_count || 0,
        rating: courseData.rating || 0,
        coverImage: courseData.thumbnail_url || '',
        modules: [],
        skills: [],
        prerequisites: []
      };
    } catch (error) {
      console.error('Error fetching course:', error);
      throw new Error(`Failed to fetch course: ${error}`);
    }
  },

  getCourseProgress: async (courseId: string, userId: string): Promise<CourseProgress> => {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}/progress`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching course progress:', error);
      // Return default progress structure
      return {
        courseId,
        userId,
        completedLessons: [],
        currentModule: 'module-1',
        currentLesson: 'lesson-1-1',
        progressPercentage: 0,
        timeSpent: 0,
        lastAccessed: new Date()
      };
    }
  },

  updateLessonProgress: async (lessonId: string, completed: boolean): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/lessons/${lessonId}/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ completed })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating lesson progress:', error);
      console.log(`Lesson ${lessonId} marked as ${completed ? 'completed' : 'incomplete'}`);
    }
  },

  getAllCourses: async (): Promise<Course[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/courses`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const coursesData = await response.json();
      // Transform backend data to match frontend Course interface
      return coursesData.map((course: any) => ({
        id: course.id.toString(),
        course_code: course.id.toString(),
        title: course.title,
        description: course.description || '',
        instructor: 'ViaLife Coach Academy',
        duration: course.duration_weeks ? `${course.duration_weeks} weeks` : '6 weeks',
        level: (course.level as 'Beginner' | 'Intermediate' | 'Advanced') || 'Beginner',
        progress: 0,
        enrolledStudents: course.enrollment_count || 0,
        rating: course.rating || 0,
        coverImage: course.thumbnail_url || '',
        modules: [],
        skills: [],
        prerequisites: []
      }));
    } catch (error) {
      console.error('Error fetching all courses:', error);
      throw new Error(`Failed to fetch courses: ${error}`);
    }
  },

  getCourseById: async (courseId: string): Promise<Course> => {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const courseData = await response.json();
      // Transform backend data to match frontend Course interface
      return {
        id: courseData.id.toString(),
        course_code: courseData.id.toString(),
        title: courseData.title,
        description: courseData.description || '',
        instructor: 'ViaLife Coach Academy',
        duration: courseData.duration_weeks ? `${courseData.duration_weeks} weeks` : '6 weeks',
        level: (courseData.level as 'Beginner' | 'Intermediate' | 'Advanced') || 'Beginner',
        progress: 0,
        enrolledStudents: courseData.enrollment_count || 0,
        rating: courseData.rating || 0,
        coverImage: courseData.thumbnail_url || '',
        modules: [],
        skills: [],
        prerequisites: []
      };
    } catch (error) {
      console.error('Error fetching course by ID:', error);
      throw new Error(`Failed to fetch course: ${error}`);
    }
  }
};
