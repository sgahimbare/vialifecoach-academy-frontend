import { apiRequest, buildApiUrl } from "@/lib/api";

export type AdminDashboardStats = {
  total_users: number;
  total_students: number;
  total_lecturers: number;
  total_courses: number;
  total_enrollments: number;
};

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: "student" | "lecturer" | "instructor" | "admin" | "owner" | "manager" | "content_editor" | "support";
  verified: boolean;
};

export type AdminCourse = {
  id: number;
  title: string;
  description?: string | null;
  published?: boolean;
  [key: string]: unknown;
};

export type AdminModule = {
  id: number;
  courseId?: number;
  title: string;
  order?: number;
  [key: string]: unknown;
};

export type AdminLesson = {
  id: number;
  moduleId?: number;
  title: string;
  order?: number;
  [key: string]: unknown;
};

export type AdminContent = {
  id: number;
  lessonId?: number;
  type?: string;
  [key: string]: unknown;
};

export type AdminCategory = {
  id: number;
  name: string;
  [key: string]: unknown;
};

export type AdminKpiPayload = {
  range: { from: string; to: string };
  kpis: Record<string, number | string>;
  previous: Record<string, number | string>;
};

export type ScriptGenerationJob = {
  id: number;
  status: string;
  provider: string;
  output_slides?: unknown[];
  output_ppt_url?: string | null;
  output_video_url?: string | null;
  [key: string]: unknown;
};

export type QuizPolicy = {
  require_acknowledgement: boolean;
  block_copy_paste: boolean;
  block_right_click: boolean;
  full_screen_required: boolean;
  tab_switch_limit: number;
  auto_submit_on_violation: boolean;
  camera_required: boolean;
  intro?: string;
  conditions?: string[];
  process?: string[];
  [key: string]: unknown;
};

export type AdminSuccessStory = {
  id: number;
  display_name: string;
  image_url?: string | null;
  video_url?: string | null;
  story: string;
  course?: string | null;
  role_label?: string | null;
  rating?: number;
  is_approved?: boolean;
};

export type AdminTodayControls = {
  student_live_messages_enabled: boolean;
  student_profile_view_enabled: boolean;
  student_grades_detail_enabled: boolean;
};

export type AdminCommunityMessage = {
  id: number;
  sender_id: number;
  sender_name?: string;
  recipient_id: number;
  recipient_name?: string;
  content: string;
  created_at: string;
  is_read?: boolean;
  edited_at?: string | null;
  is_deleted?: boolean;
  deleted_at?: string | null;
};

function toList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object") {
    const objectPayload = payload as Record<string, unknown>;
    if (Array.isArray(objectPayload.data)) return objectPayload.data as T[];
    if (Array.isArray(objectPayload.items)) return objectPayload.items as T[];
    if (Array.isArray(objectPayload.results)) return objectPayload.results as T[];
    if (objectPayload.data && typeof objectPayload.data === "object") {
      const nested = objectPayload.data as Record<string, unknown>;
      if (Array.isArray(nested.items)) return nested.items as T[];
      if (Array.isArray(nested.results)) return nested.results as T[];
    }
  }
  return [];
}

function toObject<T>(payload: unknown): T {
  if (payload && typeof payload === "object") {
    const objectPayload = payload as Record<string, unknown>;
    if (objectPayload.data && typeof objectPayload.data === "object") {
      return objectPayload.data as T;
    }
  }
  return payload as T;
}

export const adminService = {
  async getDashboard(token: string) {
    const payload = await apiRequest<unknown>("/admin/dashboard", { token });
    return toObject<AdminDashboardStats>(payload);
  },

  async getUsers(token: string) {
    const payload = await apiRequest<unknown>("/admin/users", { token });
    return toList<AdminUser>(payload);
  },

  async updateUserRole(userId: number, role: AdminUser["role"], token: string) {
    const payload = await apiRequest<unknown>(`/admin/users/${userId}/role`, {
      method: "PATCH",
      token,
      body: JSON.stringify({ role }),
    });
    return toObject<AdminUser>(payload);
  },

  deleteUser(userId: number, token: string) {
    return apiRequest<void>(`/admin/users/${userId}`, {
      method: "DELETE",
      token,
    });
  },

  async getCourses(token: string) {
    // Add cache busting timestamp to prevent caching
    const timestamp = Date.now();
    const payload = await apiRequest<unknown>(`/admin/courses?t=${timestamp}`, { token });
    return toList<AdminCourse>(payload);
  },

  async getCourseTemplate(token: string) {
    const payload = await apiRequest<unknown>("/admin/courses/template", { token });
    return toObject<Record<string, unknown>>(payload);
  },

  async getCourse(courseId: number, token: string) {
    const payload = await apiRequest<unknown>(`/admin/courses/${courseId}`, { token });
    return toObject<AdminCourse>(payload);
  },

  async createCourse(payload: Record<string, unknown>, token: string) {
    const response = await apiRequest<unknown>("/admin/courses", {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    });
    return toObject<AdminCourse>(response);
  },

  async updateCourse(courseId: number, payload: Record<string, unknown>, token: string) {
    const response = await apiRequest<unknown>(`/admin/courses/${courseId}`, {
      method: "PATCH",
      token,
      body: JSON.stringify(payload),
    });
    return toObject<AdminCourse>(response);
  },

  deleteCourse(courseId: number, token: string) {
    return apiRequest<void>(`/admin/courses/${courseId}`, {
      method: "DELETE",
      token,
    });
  },

  async publishCourse(courseId: number, token: string) {
    const payload = await apiRequest<unknown>(`/admin/courses/${courseId}/publish`, {
      method: "POST",
      token,
    });
    return toObject<AdminCourse>(payload);
  },

  async unpublishCourse(courseId: number, token: string) {
    const payload = await apiRequest<unknown>(`/admin/courses/${courseId}/unpublish`, {
      method: "POST",
      token,
    });
    return toObject<AdminCourse>(payload);
  },

  async duplicateCourse(courseId: number, token: string) {
    const payload = await apiRequest<unknown>(`/admin/courses/${courseId}/duplicate`, {
      method: "POST",
      token,
    });
    return toObject<AdminCourse>(payload);
  },

  async getModules(courseId: number, token: string) {
    const payload = await apiRequest<unknown>(`/admin/courses/${courseId}/modules`, { token });
    return toList<AdminModule>(payload);
  },

  async createModule(courseId: number, payload: Record<string, unknown>, token: string) {
    const response = await apiRequest<unknown>(`/admin/courses/${courseId}/modules`, {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    });
    return toObject<AdminModule>(response);
  },

  async updateModule(moduleId: number, payload: Record<string, unknown>, token: string) {
    const response = await apiRequest<unknown>(`/admin/modules/${moduleId}`, {
      method: "PATCH",
      token,
      body: JSON.stringify(payload),
    });
    return toObject<AdminModule>(response);
  },

  deleteModule(moduleId: number, token: string) {
    return apiRequest<void>(`/admin/modules/${moduleId}`, {
      method: "DELETE",
      token,
    });
  },

  reorderModules(moduleIds: number[], token: string) {
    return apiRequest<void>("/admin/modules/reorder", {
      method: "POST",
      token,
      body: JSON.stringify({
        moduleIds,
        module_ids: moduleIds,
        items: moduleIds.map((id, index) => ({ id, order_index: index + 1 })),
      }),
    });
  },

  async getLessons(moduleId: number, token: string) {
    const payload = await apiRequest<unknown>(`/admin/modules/${moduleId}/lessons`, { token });
    return toList<AdminLesson>(payload);
  },

  async getLesson(lessonId: number, token: string) {
    const payload = await apiRequest<unknown>(`/admin/lessons/${lessonId}`, { token });
    return toObject<AdminLesson>(payload);
  },

  async createLesson(moduleId: number, payload: Record<string, unknown>, token: string) {
    const response = await apiRequest<unknown>(`/admin/modules/${moduleId}/lessons`, {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    });
    return toObject<AdminLesson>(response);
  },

  async updateLesson(lessonId: number, payload: Record<string, unknown>, token: string) {
    const response = await apiRequest<unknown>(`/admin/lessons/${lessonId}`, {
      method: "PATCH",
      token,
      body: JSON.stringify(payload),
    });
    return toObject<AdminLesson>(response);
  },

  deleteLesson(lessonId: number, token: string) {
    return apiRequest<void>(`/admin/lessons/${lessonId}`, {
      method: "DELETE",
      token,
    });
  },

  reorderLessons(lessonIds: number[], token: string) {
    return apiRequest<void>("/admin/lessons/reorder", {
      method: "POST",
      token,
      body: JSON.stringify({
        lessonIds,
        lesson_ids: lessonIds,
        items: lessonIds.map((id, index) => ({ id, order_index: index + 1 })),
      }),
    });
  },

  async createLessonContent(lessonId: number, payload: Record<string, unknown>, token: string) {
    const response = await apiRequest<unknown>(`/admin/lessons/${lessonId}/content`, {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    });
    return toObject<AdminContent>(response);
  },

  async updateContent(contentId: number, payload: Record<string, unknown>, token: string) {
    const response = await apiRequest<unknown>(`/admin/content/${contentId}`, {
      method: "PATCH",
      token,
      body: JSON.stringify(payload),
    });
    return toObject<AdminContent>(response);
  },

  deleteContent(contentId: number, token: string) {
    return apiRequest<void>(`/admin/content/${contentId}`, {
      method: "DELETE",
      token,
    });
  },

  async getCategories(token: string) {
    const payload = await apiRequest<unknown>("/admin/categories", { token });
    return toList<AdminCategory>(payload);
  },

  async createCategory(payload: Record<string, unknown>, token: string) {
    const response = await apiRequest<unknown>("/admin/categories", {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    });
    return toObject<AdminCategory>(response);
  },

  async getKpis(token: string, from?: string, to?: string) {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    const query = params.toString();
    const payload = await apiRequest<unknown>(`/admin/analytics/kpis${query ? `?${query}` : ""}`, { token });
    return toObject<AdminKpiPayload>(payload);
  },

  async suspendUser(userId: number, reason: string, token: string) {
    return apiRequest<unknown>(`/admin/users/${userId}/suspend`, {
      method: "PATCH",
      token,
      body: JSON.stringify({ reason }),
    });
  },

  async reactivateUser(userId: number, token: string) {
    return apiRequest<unknown>(`/admin/users/${userId}/reactivate`, {
      method: "PATCH",
      token,
    });
  },

  async forcePasswordReset(userId: number, token: string) {
    return apiRequest<unknown>(`/admin/users/${userId}/force-password-reset`, {
      method: "POST",
      token,
    });
  },

  async resendVerification(userId: number, token: string) {
    return apiRequest<unknown>(`/admin/users/${userId}/resend-verification`, {
      method: "POST",
      token,
    });
  },

  async toggle2fa(userId: number, enabled: boolean, token: string) {
    return apiRequest<unknown>(`/admin/users/${userId}/2fa`, {
      method: "PATCH",
      token,
      body: JSON.stringify({ enabled }),
    });
  },

  async getCourseChecklist(courseId: number, token: string) {
    const payload = await apiRequest<unknown>(`/admin/courses/${courseId}/checklist`, { token });
    return toObject<Record<string, unknown>>(payload);
  },

  async createCourseSnapshot(courseId: number, notes: string, token: string) {
    const payload = await apiRequest<unknown>(`/admin/courses/${courseId}/version-snapshot`, {
      method: "POST",
      token,
      body: JSON.stringify({ notes }),
    });
    return toObject<Record<string, unknown>>(payload);
  },

  async listCourseVersions(courseId: number, token: string) {
    const payload = await apiRequest<unknown>(`/admin/courses/${courseId}/versions`, { token });
    return toList<Record<string, unknown>>(payload);
  },

  async rollbackCourseVersion(courseId: number, versionId: number, token: string) {
    return apiRequest<unknown>(`/admin/courses/${courseId}/rollback/${versionId}`, {
      method: "POST",
      token,
    });
  },

  async bulkCourseAction(ids: number[], action: "publish" | "unpublish" | "archive" | "unarchive" | "delete", token: string) {
    return apiRequest<unknown>("/admin/courses/bulk-action", {
      method: "POST",
      token,
      body: JSON.stringify({ ids, action }),
    });
  },

  async getContentQuality(courseId: number, token: string) {
    const payload = await apiRequest<unknown>(`/admin/content/quality/${courseId}`, { token });
    return toObject<Record<string, unknown>>(payload);
  },

  async createUploadIntent(payload: Record<string, unknown>, token: string) {
    return apiRequest<unknown>("/admin/media/upload-intent", {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    });
  },

  async registerMediaAsset(payload: Record<string, unknown>, token: string) {
    return apiRequest<unknown>("/admin/media/assets", {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    });
  },

  async listMediaAssets(token: string) {
    const payload = await apiRequest<unknown>("/admin/media/assets", { token });
    return toList<Record<string, unknown>>(payload);
  },

  async createScriptToPptVideo(script_text: string, token: string, extra: Record<string, unknown> = {}) {
    const payload = await apiRequest<unknown>("/admin/generation/script-to-ppt-video", {
      method: "POST",
      token,
      body: JSON.stringify({ script_text, ...extra }),
    });
    return toObject<ScriptGenerationJob>(payload);
  },

  async listGenerationJobs(token: string) {
    const payload = await apiRequest<unknown>("/admin/generation/jobs", { token });
    return toList<ScriptGenerationJob>(payload);
  },

  async retryGenerationJob(jobId: number, token: string) {
    const payload = await apiRequest<unknown>(`/admin/generation/jobs/${jobId}/retry`, {
      method: "POST",
      token,
    });
    return toObject<ScriptGenerationJob>(payload);
  },

  async getRevenueReport(token: string) {
    const payload = await apiRequest<unknown>("/admin/reports/revenue", { token });
    return toList<Record<string, unknown>>(payload);
  },

  async getCouponReport(token: string) {
    const payload = await apiRequest<unknown>("/admin/reports/coupons", { token });
    return toList<Record<string, unknown>>(payload);
  },

  async getRefundReport(token: string) {
    const payload = await apiRequest<unknown>("/admin/reports/refunds", { token });
    return toList<Record<string, unknown>>(payload);
  },

  async exportReportCsv(type: "revenue" | "refunds" | "coupons", token: string) {
    const apiResponse = await fetch(buildApiUrl(`/admin/reports/export?type=${type}`), {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    if (!apiResponse.ok) throw new Error(`Export failed: ${apiResponse.status}`);
    return apiResponse.text();
  },

  async listSupportTickets(token: string) {
    console.log('🔍 ADMIN SERVICE: listSupportTickets called with token:', token ? 'present' : 'missing');
    try {
      const payload = await apiRequest<unknown>("/admin/support/tickets", { token });
      console.log('🔍 ADMIN SERVICE: API response received:', payload);
      const result = toList<Record<string, unknown>>(payload);
      console.log('🔍 ADMIN SERVICE: Processed result:', result);
      return result;
    } catch (error) {
      console.error('❌ ADMIN SERVICE: listSupportTickets failed:', error);
      throw error;
    }
  },

  async updateSupportTicket(ticketId: number, update: Record<string, unknown>, token: string) {
    const payload = await apiRequest<unknown>(`/admin/support/tickets/${ticketId}`, {
      method: "PATCH",
      token,
      body: JSON.stringify(update),
    });
    return toObject<Record<string, unknown>>(payload);
  },

  async deleteSupportTicket(ticketId: number, token: string) {
  console.log('🗑️ Attempting to delete ticket:', ticketId);
  console.log('🔑 Using token:', token ? 'present' : 'missing');
  
  try {
    const payload = await apiRequest<unknown>(`/admin/support/tickets/${ticketId}`, {
      method: "DELETE",
      token,
    });
    console.log('✅ Delete successful:', payload);
    return payload;
  } catch (error) {
    console.error('❌ Delete failed with error:', error);
    console.error('❌ Error details:', error instanceof Error ? error.message : String(error));
    throw error; // Re-throw to see the actual error
  }
},

  async deleteAuditLog(logId: number, token: string) {
    try {
      const payload = await apiRequest<unknown>(`/admin/audit-logs/${logId}`, {
        method: "DELETE",
        token,
      });
      return payload;
    } catch (error) {
      // Fallback: Try to mark as deleted instead
      console.warn("Delete endpoint not available, trying to mark as deleted:", error);
      return await apiRequest<unknown>(`/admin/audit-logs/${logId}`, {
        method: "PATCH",
        token,
        body: JSON.stringify({ status: "deleted", deleted_at: new Date().toISOString() }),
      });
    }
  },

  async getIncidents(token: string) {
    const payload = await apiRequest<unknown>("/admin/incidents/latest", { token });
    return toList<Record<string, unknown>>(payload);
  },

  async getAuditLogs(token: string) {
    const payload = await apiRequest<unknown>("/admin/audit-logs", { token });
    return toList<Record<string, unknown>>(payload);
  },

  async getRoles(token: string) {
    const payload = await apiRequest<unknown>("/admin/rbac/roles", { token });
    return toList<string>(payload);
  },

  async getSetting(key: string, token: string) {
    const payload = await apiRequest<unknown>(`/admin/settings/${encodeURIComponent(key)}`, { token });
    return toObject<Record<string, unknown>>(payload);
  },

  async updateSetting(key: string, value: unknown, token: string) {
    const payload = await apiRequest<unknown>(`/admin/settings/${encodeURIComponent(key)}`, {
      method: "PUT",
      token,
      body: JSON.stringify({ value }),
    });
    return toObject<Record<string, unknown>>(payload);
  },

  async getFeatureFlag(key: string, token: string) {
    const payload = await apiRequest<unknown>(`/admin/feature-flags/${encodeURIComponent(key)}`, { token });
    return toObject<Record<string, unknown>>(payload);
  },

  async updateFeatureFlag(key: string, enabled: boolean, config: Record<string, unknown>, token: string) {
    const payload = await apiRequest<unknown>(`/admin/feature-flags/${encodeURIComponent(key)}`, {
      method: "PUT",
      token,
      body: JSON.stringify({ enabled, config }),
    });
    return toObject<Record<string, unknown>>(payload);
  },

  async getTodayControls(token: string) {
    const payload = await apiRequest<unknown>("/admin/control-center/today", { token });
    const data = toObject<Record<string, unknown>>(payload);
    return {
      student_live_messages_enabled: Boolean(data.student_live_messages_enabled ?? true),
      student_profile_view_enabled: Boolean(data.student_profile_view_enabled ?? true),
      student_grades_detail_enabled: Boolean(data.student_grades_detail_enabled ?? true),
    } as AdminTodayControls;
  },

  async updateTodayControls(token: string, controls: Partial<AdminTodayControls>) {
    const payload = await apiRequest<unknown>("/admin/control-center/today", {
      method: "PUT",
      token,
      body: JSON.stringify({ controls }),
    });
    const data = toObject<Record<string, unknown>>(payload);
    return {
      student_live_messages_enabled: Boolean(data.student_live_messages_enabled ?? true),
      student_profile_view_enabled: Boolean(data.student_profile_view_enabled ?? true),
      student_grades_detail_enabled: Boolean(data.student_grades_detail_enabled ?? true),
    } as AdminTodayControls;
  },

  async listCommunityMessages(token: string, q = "", limit = 80) {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    params.set("limit", String(limit));
    const payload = await apiRequest<unknown>(`/admin/community/messages?${params.toString()}`, { token });
    return toList<AdminCommunityMessage>(payload);
  },

  async moderateCommunityMessage(
    token: string,
    id: number,
    action: "delete" | "restore" | "edit" | "mark_read",
    content?: string
  ) {
    const payload = await apiRequest<unknown>(`/admin/community/messages/${id}/moderate`, {
      method: "PATCH",
      token,
      body: JSON.stringify({ action, ...(content ? { content } : {}) }),
    });
    return toObject<AdminCommunityMessage>(payload);
  },

  async getQuizPolicy(token: string) {
    const payload = await apiRequest<unknown>("/admin/quiz-policy", { token });
    return toObject<QuizPolicy>(payload);
  },

  async updateQuizPolicy(policy: Partial<QuizPolicy>, token: string) {
    const payload = await apiRequest<unknown>("/admin/quiz-policy", {
      method: "PUT",
      token,
      body: JSON.stringify(policy),
    });
    return toObject<QuizPolicy>(payload);
  },

  async getQuizPolicyCompliance(token: string) {
    const payload = await apiRequest<unknown>("/admin/quiz-policy/compliance", { token });
    return toObject<Record<string, unknown>>(payload);
  },

  async listSuccessStories(token: string) {
    const payload = await apiRequest<unknown>("/admin/success-stories", { token });
    return toList<AdminSuccessStory>(payload);
  },

  async createSuccessStory(payload: Record<string, unknown>, token: string) {
    const response = await apiRequest<unknown>("/admin/success-stories", {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    });
    return toObject<AdminSuccessStory>(response);
  },

  async updateSuccessStory(id: number, payload: Record<string, unknown>, token: string) {
    const response = await apiRequest<unknown>(`/admin/success-stories/${id}`, {
      method: "PATCH",
      token,
      body: JSON.stringify(payload),
    });
    return toObject<AdminSuccessStory>(response);
  },

  deleteSuccessStory(id: number, token: string) {
    return apiRequest<void>(`/admin/success-stories/${id}`, { method: "DELETE", token });
  },
};
