import { apiRequest } from "@/lib/api";

export type StudentGradeItem = {
  course_id: number;
  course_title: string;
  total_lessons: number;
  completed_lessons: number;
  progress_percent: number;
  quiz_attempts: number;
  avg_quiz_score_percent: number;
};

export type StudentGradesResponse = {
  overall_average: number;
  cumulative_gpa?: number;
  items: StudentGradeItem[];
};

export type StudentGradeDetailCourse = {
  course_id: number;
  course_title: string;
  quiz_attempts: number;
  discussion_posts: number;
  discussion_replies: number;
  assignment_attempts: number;
  exam_attempts: number;
  average_percent: number;
  gpa: number;
};

export type StudentGradesDetailResponse = {
  cumulative_percent: number;
  cumulative_gpa: number;
  courses: StudentGradeDetailCourse[];
};

export type StudentCourseAttempt = {
  result_id: number;
  quiz_id: number;
  title: string;
  category: "quiz" | "assignment" | "exam";
  score: number;
  total_marks: number;
  percent: number;
  passed: boolean;
  submitted_at: string;
};

export type StudentCourseGradesDetailResponse = {
  course: {
    id: number;
    title: string;
    average_percent: number;
    gpa: number;
  };
  quizzes: StudentCourseAttempt[];
  assignments: StudentCourseAttempt[];
  exams: StudentCourseAttempt[];
  discussions: {
    posts: Array<{ id: number; content: string; created_at: string }>;
    replies: Array<{ id: number; post_id: number; content: string; created_at: string }>;
  };
};

export type StudentCatalogCourse = {
  id: number;
  title: string;
  short_description?: string | null;
  thumbnail_url?: string | null;
  level?: string | null;
  price?: number | null;
  discount?: number | null;
  rating?: number | null;
  status?: string | null;
  duration_weeks?: number | null;
  category_name?: string | null;
  enrolled: boolean;
  total_lessons: number;
  completed_lessons: number;
  progress_percent: number;
};

export type StudentTicket = {
  id: number;
  subject: string;
  message: string;
  status: string;
  priority: string;
  channel: string;
  created_at: string;
  updated_at: string;
};

export type StudentTicketReply = {
  id: number;
  ticket_id: number;
  user_id: number;
  message: string;
  created_at: string;
  author_name?: string;
  author_role?: string;
};

export type StudentTicketDetail = StudentTicket & {
  replies: StudentTicketReply[];
};

export const studentService = {
  async getGrades(token: string) {
    const payload = await apiRequest<{ success?: boolean; data?: StudentGradesResponse }>("/student/grades", { token });
    return payload?.data || { overall_average: 0, cumulative_gpa: 0, items: [] };
  },

  async getGradesDetails(token: string) {
    const payload = await apiRequest<{ success?: boolean; data?: StudentGradesDetailResponse }>("/student-portal/grades/details", { token });
    return payload?.data || { cumulative_percent: 0, cumulative_gpa: 0, courses: [] };
  },

  async getCourseGradesDetails(token: string, courseId: number) {
    const payload = await apiRequest<{ success?: boolean; data?: StudentCourseGradesDetailResponse }>(
      `/student-portal/grades/courses/${courseId}`,
      { token }
    );
    return payload?.data || null;
  },

  async getCatalog(token: string) {
    const payload = await apiRequest<{ success?: boolean; data?: StudentCatalogCourse[] }>("/student-portal/catalog", { token });
    return payload?.data || [];
  },

  async submitTicket(
    token: string,
    body: { name: string; email: string; subject: string; message: string; topic?: string; phone?: string }
  ) {
    return apiRequest<{ message?: string; warning?: string | null }>("/student-portal/support/ticket", {
      method: "POST",
      token,
      body: JSON.stringify(body),
    });
  },

  async listTickets(token: string) {
    const payload = await apiRequest<{ success?: boolean; data?: StudentTicket[] }>("/student-portal/support/tickets", { token });
    return payload?.data || [];
  },

  async getTicket(token: string, ticketId: number) {
    const payload = await apiRequest<{ success?: boolean; data?: StudentTicketDetail }>(`/student-portal/support/tickets/${ticketId}`, { token });
    return payload?.data || null;
  },

  async replyToTicket(token: string, ticketId: number, message: string) {
    return apiRequest<{ success?: boolean; data?: StudentTicketReply }>(`/student-portal/support/tickets/${ticketId}/replies`, {
      method: "POST",
      token,
      body: JSON.stringify({ message }),
    });
  },
};
