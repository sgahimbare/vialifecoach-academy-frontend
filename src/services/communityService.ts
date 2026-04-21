import { apiRequest } from "@/lib/api";

export type CommunityDiscussionReply = {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  created_at: string;
  author_name: string;
  author_role: string;
};

export type CommunityDiscussionPost = {
  id: number;
  course_id: number | null;
  user_id: number;
  content: string;
  created_at: string;
  author_name: string;
  author_role: string;
  replies: CommunityDiscussionReply[];
};

export type CommunityContact = {
  id: number;
  name: string;
  role: string;
  status: string;
  last_message?: string | null;
  last_message_at?: string | null;
  unread_count?: number;
};

export type CommunityMessage = {
  id: number;
  sender_id: number;
  recipient_id: number;
  content: string;
  created_at: string;
  is_read?: boolean;
  read_at?: string | null;
  edited_at?: string | null;
  is_deleted?: boolean;
  deleted_at?: string | null;
};

export type CommunityEnrolledCourse = {
  id: number;
  title: string;
  slug?: string | null;
  thumbnail_url?: string | null;
  enrolled_at?: string;
  completed_at?: string | null;
};

export type CommunityContactProfile = {
  id: number;
  name: string;
  email?: string | null;
  role: string;
  status: string;
  photo_url?: string | null;
  bio?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  phone?: string | null;
  last_active_at?: string | null;
  created_at?: string | null;
  enrolled_courses?: CommunityEnrolledCourse[];
};

export type CommunityEvent = {
  id: number;
  title: string;
  description?: string;
  event_type: string;
  start_at: string;
  max_spots: number | null;
  host_name: string | null;
  registered_count: number;
  is_registered: boolean;
};

export type CommunityChallenge = {
  id: number;
  title: string;
  description?: string;
  duration_days: number;
  badge?: string;
  participants: number;
  progress: number | null;
  joined: boolean;
};

export type CommunitySuccessStory = {
  id: number;
  name: string;
  display_name?: string;
  image_url?: string;
  video_url?: string;
  story: string;
  course?: string;
  role_label?: string;
  rating: number;
  created_at: string;
};

export type CommunityMentor = {
  id: number;
  name: string;
  expertise: string[];
  bio?: string;
  sessions: number;
  rating: number;
  available: boolean;
  requested: boolean;
};

export type CommunityDiscussionGroup = {
  course_id: number;
  group_name: string;
  short_description?: string | null;
  posts_count: number;
  last_post_at?: string | null;
};

export type CommunityLiveMessage = {
  id: number;
  contact_id: number;
  contact_name: string;
  contact_role: string;
  sender_id: number;
  recipient_id: number;
  content: string;
  created_at: string;
};

function getDataArray<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object") {
    const o = payload as Record<string, unknown>;
    if (Array.isArray(o.data)) return o.data as T[];
  }
  return [];
}

export const communityService = {
  async getDiscussions(token: string, courseId?: number) {
    const path = courseId ? `/community/discussions?courseId=${courseId}` : "/community/discussions";
    return getDataArray<CommunityDiscussionPost>(await apiRequest<unknown>(path, { token }));
  },
  createDiscussionPost(token: string, content: string, courseId?: number | null) {
    return apiRequest("/community/discussions", {
      method: "POST",
      token,
      body: JSON.stringify({ content, courseId: courseId ?? null }),
    });
  },
  createDiscussionReply(token: string, postId: number, content: string) {
    return apiRequest(`/community/discussions/${postId}/replies`, {
      method: "POST",
      token,
      body: JSON.stringify({ content }),
    });
  },
  async getChatContacts(token: string, activeOnly = false) {
    const path = activeOnly ? "/community/chat/contacts?activeOnly=true" : "/community/chat/contacts";
    return getDataArray<CommunityContact>(await apiRequest<unknown>(path, { token }));
  },
  async getChatContactProfile(token: string, contactId: number) {
    const payload = await apiRequest<{ data?: CommunityContactProfile }>(`/community/chat/contacts/${contactId}/profile`, { token });
    return payload?.data || null;
  },
  async getMessages(token: string, contactId: number) {
    return getDataArray<CommunityMessage>(await apiRequest<unknown>(`/community/chat/messages/${contactId}`, { token }));
  },
  sendMessage(token: string, contactId: number, content: string) {
    return apiRequest(`/community/chat/messages/${contactId}`, {
      method: "POST",
      token,
      body: JSON.stringify({ content }),
      // Add error handling for network issues
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
  editMessage(token: string, messageId: number, content: string) {
    return apiRequest<{ data?: CommunityMessage }>(`/community/chat/messages/${messageId}`, {
      method: "PATCH",
      token,
      body: JSON.stringify({ content }),
    });
  },
  deleteMessage(token: string, messageId: number) {
    return apiRequest(`/community/chat/messages/${messageId}`, {
      method: "DELETE",
      token,
    });
  },
  markMessageRead(token: string, messageId: number) {
    return apiRequest<{ data?: CommunityMessage }>(`/community/chat/messages/${messageId}/read`, {
      method: "POST",
      token,
    });
  },
  async getCommunityProfile(token: string, userId: number) {
    const payload = await apiRequest<{ data?: CommunityContactProfile }>(`/community/profiles/${userId}`, { token });
    return payload?.data || null;
  },
  async getEvents(token?: string | null) {
    return getDataArray<CommunityEvent>(await apiRequest<unknown>("/community/events", { token: token || undefined }));
  },
  registerEvent(eventId: number, options?: { token?: string | null; name?: string; email?: string }) {
    const token = options?.token || undefined;
    const body = token
      ? undefined
      : JSON.stringify({ name: options?.name || "", email: options?.email || "" });
    return apiRequest(`/community/events/${eventId}/register`, {
      method: "POST",
      token,
      ...(body ? { body } : {}),
    });
  },
  async getChallenges(token?: string | null) {
    return getDataArray<CommunityChallenge>(await apiRequest<unknown>("/community/challenges", { token: token || undefined }));
  },
  joinChallenge(challengeId: number, options?: { token?: string | null; name?: string; email?: string }) {
    const token = options?.token || undefined;
    const body = token
      ? undefined
      : JSON.stringify({ name: options?.name || "", email: options?.email || "" });
    return apiRequest(`/community/challenges/${challengeId}/join`, {
      method: "POST",
      token,
      ...(body ? { body } : {}),
    });
  },
  async getSuccessStories(token?: string | null) {
    return getDataArray<CommunitySuccessStory>(await apiRequest<unknown>("/community/success-stories", { token: token || undefined }));
  },
  createSuccessStory(token: string, payload: { story: string; course?: string; roleLabel?: string; rating?: number }) {
    return apiRequest("/community/success-stories", {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    });
  },
  async getSuccessStoryCanPost(token: string) {
    const payload = await apiRequest<{ success?: boolean; data?: { can_post?: boolean } }>("/community/success-stories/can-post", { token });
    return Boolean(payload?.data?.can_post);
  },
  async getMentors(token: string) {
    return getDataArray<CommunityMentor>(await apiRequest<unknown>("/community/mentors", { token }));
  },
  requestMentor(token: string, mentorId: number, message?: string) {
    return apiRequest(`/community/mentors/${mentorId}/request`, {
      method: "POST",
      token,
      body: JSON.stringify({ message }),
    });
  },

  async getStudentDiscussionGroups(token: string) {
    return getDataArray<CommunityDiscussionGroup>(
      await apiRequest<unknown>("/student-portal/community/discussion-groups", { token })
    );
  },

  async getStudentRecentLiveMessages(token: string) {
    return getDataArray<CommunityLiveMessage>(
      await apiRequest<unknown>("/student-portal/community/live/messages", { token })
    );
  },

  async getStudentDiscussions(token: string, courseId?: number) {
    const path = courseId
      ? `/student-portal/community/discussions?courseId=${courseId}`
      : "/student-portal/community/discussions";
    return getDataArray<CommunityDiscussionPost>(await apiRequest<unknown>(path, { token }));
  },

  createStudentDiscussionPost(token: string, content: string, courseId?: number | null) {
    return apiRequest("/student-portal/community/discussions", {
      method: "POST",
      token,
      body: JSON.stringify({ content, courseId: courseId ?? null }),
    });
  },

  createStudentDiscussionReply(token: string, postId: number, content: string) {
    return apiRequest(`/student-portal/community/discussions/${postId}/replies`, {
      method: "POST",
      token,
      body: JSON.stringify({ content }),
    });
  },

  async getStudentChatContacts(token: string, activeOnly = false) {
    const path = activeOnly
      ? "/student-portal/community/chat/contacts?activeOnly=true"
      : "/student-portal/community/chat/contacts";
    return getDataArray<CommunityContact>(await apiRequest<unknown>(path, { token }));
  },

  async getStudentChatContactProfile(token: string, contactId: number) {
    const payload = await apiRequest<{ data?: CommunityContactProfile }>(
      `/student-portal/community/chat/contacts/${contactId}/profile`,
      { token }
    );
    return payload?.data || null;
  },

  async getStudentMessages(token: string, contactId: number) {
    return getDataArray<CommunityMessage>(
      await apiRequest<unknown>(`/student-portal/community/chat/messages/${contactId}`, { token })
    );
  },

  sendStudentMessage(token: string, contactId: number, content: string) {
    return apiRequest(`/student-portal/community/chat/messages/${contactId}`, {
      method: "POST",
      token,
      body: JSON.stringify({ content }),
    });
  },
  editStudentMessage(token: string, messageId: number, content: string) {
    return apiRequest<{ data?: CommunityMessage }>(`/student-portal/community/chat/messages/${messageId}`, {
      method: "PATCH",
      token,
      body: JSON.stringify({ content }),
    });
  },
  deleteStudentMessage(token: string, messageId: number) {
    return apiRequest(`/student-portal/community/chat/messages/${messageId}`, {
      method: "DELETE",
      token,
    });
  },
  markStudentMessageRead(token: string, messageId: number) {
    return apiRequest<{ data?: CommunityMessage }>(`/student-portal/community/chat/messages/${messageId}/read`, {
      method: "POST",
      token,
    });
  },
  async getStudentCommunityProfile(token: string, userId: number) {
    const payload = await apiRequest<{ data?: CommunityContactProfile }>(`/student-portal/community/profiles/${userId}`, { token });
    return payload?.data || null;
  },

  async deleteStudentConversation(token: string, contactId: number) {
    return apiRequest(`/student-portal/community/chat/conversations/${contactId}`, {
      method: "DELETE",
      token,
    });
  },

  async deleteConversation(token: string, contactId: number) {
    return apiRequest(`/community/chat/conversations/${contactId}`, {
      method: "DELETE",
      token,
    });
  },

  async getDeletedConversations(token: string) {
    try {
      console.log('🔄 Fetching deleted conversations from:', 'http://localhost:5000/api/v1/admin/community/deleted-conversations');
      
      const response = await fetch('http://localhost:5000/api/v1/admin/community/deleted-conversations', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      console.log('📊 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error fetching deleted conversations:', errorText);
        
        if (response.status === 404) {
          throw new Error('Route not found. Please check if the backend route is properly defined.');
        } else if (response.status === 401) {
          throw new Error('Authentication required. Please log in again.');
        } else {
          throw new Error(`Failed to fetch deleted conversations: ${response.status} - ${errorText}`);
        }
      }

      const data = await response.json();
      console.log('✅ Successfully fetched messages:', data.data?.length || 0);
      return data.data || [];
    } catch (err) {
      console.error('💥 communityService.getDeletedConversations error:', err);
      throw err;
    }
  },

  async restoreConversations(token: string, messageIds: number[]) {
    try {
      console.log('🔄 Restoring conversations:', messageIds);
      
      const response = await fetch('http://localhost:5000/api/v1/admin/community/restore-conversations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageIds }),
        credentials: 'include',
      });

      console.log('📊 Restore response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error restoring conversations:', errorText);
        
        if (response.status === 404) {
          throw new Error('Restore route not found. Please check if the backend route is properly defined.');
        } else if (response.status === 401) {
          throw new Error('Authentication required. Please log in again.');
        } else {
          throw new Error(`Failed to restore conversations: ${response.status} - ${errorText}`);
        }
      }

      const data = await response.json();
      console.log('✅ Successfully restored conversations:', data);
      return data;
    } catch (err) {
      console.error('💥 communityService.restoreConversations error:', err);
      throw err;
    }
  },
};
