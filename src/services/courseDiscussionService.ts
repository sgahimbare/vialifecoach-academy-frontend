import { apiRequest } from "@/lib/api";

export type CourseDiscussion = {
  id: number;
  course_id: number;
  instructor_id: number;
  instructor_name: string;
  instructor_email: string;
  title: string;
  content: string;
  type: 'general' | 'assignment' | 'announcement';
  created_at: string;
  updated_at: string;
  comments?: DiscussionComment[];
};

export type DiscussionComment = {
  id: number;
  discussion_id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  user_role: string;
  content: string;
  created_at: string;
};

export type DiscussionGrade = {
  id: number;
  discussion_id: number;
  student_id: number;
  student_name: string;
  student_email: string;
  grade: number;
  feedback?: string;
  graded_at: string;
};

export type StudentParticipation = {
  id: number;
  title: string;
  type: string;
  participated: boolean;
  grade?: number;
  feedback?: string;
  graded_at?: string;
};

export const courseDiscussionService = {
  // Create a new discussion (instructor only)
  async createDiscussion(courseId: number, title: string, content: string, type: 'general' | 'assignment' | 'announcement' = 'general') {
    return await apiRequest<CourseDiscussion>(`/courses/${courseId}/discussions`, {
      method: 'POST',
      body: JSON.stringify({ title, content, type }),
    });
  },

  // Get all discussions for a course
  async getCourseDiscussions(courseId: number) {
    return await apiRequest<CourseDiscussion[]>(`/courses/${courseId}/discussions`);
  },

  // Get a specific discussion with comments
  async getDiscussionById(discussionId: number) {
    return await apiRequest<CourseDiscussion>(`/discussions/${discussionId}`);
  },

  // Add a comment to a discussion
  async addComment(discussionId: number, content: string) {
    return await apiRequest<DiscussionComment>(`/discussions/${discussionId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  // Grade a student's participation (instructor only)
  async gradeStudent(discussionId: number, studentId: number, grade: number, feedback?: string) {
    return await apiRequest<DiscussionGrade>(`/discussions/${discussionId}/grade`, {
      method: 'POST',
      body: JSON.stringify({ studentId, grade, feedback }),
    });
  },

  // Get all grades for a discussion (instructor only)
  async getDiscussionGrades(discussionId: number) {
    return await apiRequest<DiscussionGrade[]>(`/discussions/${discussionId}/grades`);
  },

  // Get student's participation status in a course
  async getStudentParticipation(courseId: number) {
    return await apiRequest<StudentParticipation[]>(`/courses/${courseId}/discussions/my-participation`);
  },
};
