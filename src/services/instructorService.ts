import { apiRequest } from "@/lib/api";

export type InstructorStats = {
  totalCourses: number;
  totalStudents: number;
  avgCompletionRate: number;
  avgRating: number;
};

export type InstructorCourse = {
  id: number;
  title: string;
  description: string;
  price: string;
  thumbnail_url: string;
  category_id: number | null;
  created_at: string;
  updated_at: string;
  enrollment_count?: number;
  rating?: number;
};

export type RecentActivity = {
  type: 'enrollment' | 'completion' | 'rating';
  course_title: string;
  student_name?: string;
  action: string;
  timestamp: string;
};

export type InstructorDashboard = {
  stats: InstructorStats;
  courses: InstructorCourse[];
  recentActivity: RecentActivity[];
};

export const instructorService = {
  async getDashboard(): Promise<InstructorDashboard> {
    try {
      // Get instructor's courses
      const courses = await apiRequest<InstructorCourse[]>("/courses");
      
      // Calculate stats from courses
      const stats: InstructorStats = {
        totalCourses: courses.length,
        totalStudents: courses.reduce((sum, course) => sum + (course.enrollment_count || 0), 0),
        avgCompletionRate: 0, // TODO: Get from progress data
        avgRating: courses.length > 0 
          ? courses.reduce((sum, course) => sum + (course.rating || 0), 0) / courses.length 
          : 0,
      };

      // Mock recent activity for now (can be enhanced with real data)
      const recentActivity: RecentActivity[] = courses.slice(0, 3).map((course, index) => ({
        type: 'enrollment' as const,
        course_title: course.title,
        action: `${Math.floor(Math.random() * 10) + 1} new students enrolled`,
        timestamp: `${index + 1} hour${index > 0 ? 's' : ''} ago`,
      }));

      return {
        stats,
        courses,
        recentActivity,
      };
    } catch (error) {
      console.error("Error fetching instructor dashboard:", error);
      // Return default data
      return {
        stats: {
          totalCourses: 0,
          totalStudents: 0,
          avgCompletionRate: 0,
          avgRating: 0,
        },
        courses: [],
        recentActivity: [],
      };
    }
  },

  async getCourses(): Promise<InstructorCourse[]> {
    try {
      return await apiRequest<InstructorCourse[]>("/courses");
    } catch (error) {
      console.error("Error fetching instructor courses:", error);
      return [];
    }
  },

  async createCourse(courseData: {
    title: string;
    description: string;
    price?: number;
    thumbnail_url?: string;
    category_id?: number;
  }): Promise<InstructorCourse> {
    try {
      return await apiRequest<InstructorCourse>("/courses", {
        method: "POST",
        body: JSON.stringify(courseData),
      });
    } catch (error) {
      console.error("Error creating course:", error);
      throw error;
    }
  },

  async updateCourse(
    id: number,
    courseData: {
      title?: string;
      description?: string;
      price?: number;
      thumbnail_url?: string;
      category_id?: number;
    }
  ): Promise<InstructorCourse> {
    try {
      return await apiRequest<InstructorCourse>(`/courses/${id}`, {
        method: "PUT",
        body: JSON.stringify(courseData),
      });
    } catch (error) {
      console.error("Error updating course:", error);
      throw error;
    }
  },

  async deleteCourse(id: number): Promise<void> {
    try {
      await apiRequest<void>(`/courses/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error deleting course:", error);
      throw error;
    }
  },
};
