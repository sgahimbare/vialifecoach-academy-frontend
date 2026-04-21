import { apiRequest } from "@/lib/api";

export type CourseItem = {
  id: number;
  title: string;
  description: string;
  short_description?: string;
  long_description?: string;
  duration_weeks?: number;
  has_certificate?: boolean;
  category?: string;
  instructor_id?: number;
  thumbnail_url?: string;
  owner_id?: number;
  instructor?: {
    id?: number;
    name?: string;
  };
};

export type CreateCoursePayload = {
  title: string;
  description: string;
  instructor_id?: number;
};

export type EnrollmentItem = {
  id: number;
  user_id: number;
  course_id: number;
  enrolled_at?: string;
};

export const courseService = {
  async getCourses(): Promise<CourseItem[]> {
    try {
      console.log('DEBUG: Fetching courses from API...');
      // Add cache busting timestamp to prevent caching
      const timestamp = Date.now();
      const courses = await apiRequest<CourseItem[]>(`/courses?t=${timestamp}`);
      console.log('DEBUG: Courses received:', courses);
      return courses;
    } catch (error) {
      console.error("Error fetching courses:", error);
      return [];
    }
  },

  getCourseById(courseId: number) {
    return apiRequest<CourseItem>(`/courses/${courseId}`);
  },

  getCourseOverview(courseId: number) {
    return apiRequest<Record<string, unknown>>(`/courses/${courseId}/overview`);
  },

  createCourse(payload: CreateCoursePayload, token: string) {
    return apiRequest<CourseItem>("/courses", {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    });
  },

  enrollCourse(userId: number, courseId: number) {
    return apiRequest<{ message?: string; enrollementId?: number }>("/enroll", {
      method: "POST",
      body: JSON.stringify({ userId, courseId }),
    });
  },

  async getUserEnrollments(userId: number) {
    const payload = await apiRequest<unknown>(`/enroll/user/${userId}`);
    if (Array.isArray(payload)) return payload as EnrollmentItem[];
    if (payload && typeof payload === "object") {
      const o = payload as Record<string, unknown>;
      if (Array.isArray(o.data)) return o.data as EnrollmentItem[];
    }
    return [];
  },
};
