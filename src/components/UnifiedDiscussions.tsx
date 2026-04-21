import { useState, useEffect } from "react";
import { MessageSquare, Plus, Users, Award, BookOpen, Send, User, CheckCircle, Clock } from "lucide-react";
import { courseDiscussionService, type CourseDiscussion, type DiscussionComment } from "@/services/courseDiscussionService";
import { useAuth } from "@/context/AuthContext";
import { extractApiErrorMessage } from "@/lib/apiError";

interface UnifiedDiscussionsProps {
  courseId?: number;
  showAllCourses?: boolean;
  userRole?: 'student' | 'instructor' | 'admin';
}

export function UnifiedDiscussions({ courseId, showAllCourses = false, userRole }: UnifiedDiscussionsProps) {
  const { accessToken, user } = useAuth();
  const [discussions, setDiscussions] = useState<CourseDiscussion[]>([]);
  const [selectedDiscussion, setSelectedDiscussion] = useState<CourseDiscussion | null>(null);
  const [newDiscussion, setNewDiscussion] = useState({ title: "", content: "", type: "general" as "general" | "assignment" | "announcement" });
  const [newComment, setNewComment] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isInstructor = user?.role === 'instructor' || user?.role === 'admin';
  const actualUserRole = userRole || user?.role;

  useEffect(() => {
    if (courseId) {
      loadCourseDiscussions(courseId);
    } else if (showAllCourses) {
      loadAllDiscussions();
    }
  }, [courseId, showAllCourses]);

  async function loadCourseDiscussions(courseId: number) {
    if (!accessToken) return;
    setLoading(true);
    setError("");
    try {
      const data = await courseDiscussionService.getCourseDiscussions(courseId);
      setDiscussions(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load discussions.");
    } finally {
      setLoading(false);
    }
  }

  async function loadAllDiscussions() {
    if (!accessToken) return;
    setLoading(true);
    setError("");
    try {
      // For now, load discussions from course 1 (can be enhanced to load from all enrolled courses)
      const data = await courseDiscussionService.getCourseDiscussions(1);
      setDiscussions(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load discussions.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateDiscussion(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken || !newDiscussion.title.trim() || !newDiscussion.content.trim() || !courseId) return;

    try {
      await courseDiscussionService.createDiscussion(
        courseId,
        newDiscussion.title.trim(),
        newDiscussion.content.trim(),
        newDiscussion.type
      );
      setSuccess("Discussion created successfully!");
      setNewDiscussion({ title: "", content: "", type: "general" });
      setShowCreateForm(false);
      loadCourseDiscussions(courseId);
    } catch (e) {
      setError(extractApiErrorMessage(e, "Failed to create discussion."));
    }
  }

  async function handleAddComment(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken || !selectedDiscussion || !newComment.trim()) return;

    try {
      await courseDiscussionService.addComment(selectedDiscussion.id, newComment.trim());
      setSuccess("Comment added successfully!");
      setNewComment("");
      const updatedDiscussion = await courseDiscussionService.getDiscussionById(selectedDiscussion.id);
      setSelectedDiscussion(updatedDiscussion);
    } catch (e) {
      setError(extractApiErrorMessage(e, "Failed to add comment."));
    }
  }

  async function handleSelectDiscussion(discussion: CourseDiscussion) {
    try {
      const fullDiscussion = await courseDiscussionService.getDiscussionById(discussion.id);
      setSelectedDiscussion(fullDiscussion);
    } catch (e) {
      setError("Failed to load discussion details.");
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString();
  }

  function getUserRoleColor(role: string) {
    switch (role) {
      case 'instructor':
        return 'text-cyan-400 bg-cyan-900/20';
      case 'admin':
        return 'text-red-400 bg-red-900/20';
      case 'student':
        return 'text-green-400 bg-green-900/20';
      default:
        return 'text-slate-400 bg-slate-900/20';
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
        <span className="ml-2 text-slate-300">Loading discussions...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          {showAllCourses ? "Platform Discussions" : "Course Discussions"}
        </h3>
        {isInstructor && courseId && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="lecturer-btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Discussion
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-900/50 border border-red-800 rounded-lg">
          <p className="text-sm text-red-200">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-900/50 border border-green-800 rounded-lg">
          <p className="text-sm text-green-200">{success}</p>
        </div>
      )}

      {/* Create Discussion Form */}
      {showCreateForm && isInstructor && (
        <div className="lecturer-card">
          <h4 className="text-md font-semibold text-white mb-4">Create New Discussion</h4>
          <form onSubmit={handleCreateDiscussion} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
              <input
                type="text"
                value={newDiscussion.title}
                onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
                className="lecturer-input w-full"
                placeholder="Enter discussion title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Type</label>
              <select
                value={newDiscussion.type}
                onChange={(e) => setNewDiscussion({ ...newDiscussion, type: e.target.value as any })}
                className="lecturer-input w-full"
              >
                <option value="general">General Discussion</option>
                <option value="assignment">Assignment Discussion</option>
                <option value="announcement">Announcement</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Content</label>
              <textarea
                value={newDiscussion.content}
                onChange={(e) => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
                rows={4}
                className="lecturer-input w-full"
                placeholder="Write your discussion content..."
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="lecturer-btn"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="lecturer-btn-primary"
              >
                Create Discussion
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Discussions List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Discussions List */}
        <div className="space-y-4">
          {discussions.length === 0 ? (
            <div className="lecturer-card text-center py-8">
              <MessageSquare className="h-12 w-12 text-slate-500 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-white mb-2">No discussions yet</h4>
              <p className="text-slate-400">
                {isInstructor ? "Create the first discussion to get started." : "Wait for discussions to be created."}
              </p>
            </div>
          ) : (
            discussions.map((discussion) => (
              <div
                key={discussion.id}
                onClick={() => handleSelectDiscussion(discussion)}
                className={`lecturer-card cursor-pointer transition-all duration-200 hover:bg-slate-800/80 ${
                  selectedDiscussion?.id === discussion.id ? 'ring-2 ring-cyan-500' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-white mb-1">{discussion.title}</h4>
                    <p className="text-sm text-slate-400 line-clamp-2 mb-2">{discussion.content}</p>
                    <div className="flex items-center text-xs text-slate-500">
                      <BookOpen className="h-3 w-3 mr-1" />
                      <span className="capitalize">{discussion.type}</span>
                      <span className="mx-2">•</span>
                      <span>{formatDate(discussion.created_at)}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-xs text-slate-500 text-right">
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {discussion.instructor_name}
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs ${getUserRoleColor('instructor')}`}>
                        Instructor
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Column - Discussion Details */}
        <div>
          {selectedDiscussion ? (
            <div className="lecturer-card">
              <div className="p-6 border-b border-slate-800">
                <h4 className="text-lg font-semibold text-white mb-2">{selectedDiscussion.title}</h4>
                <div className="flex items-center text-sm text-slate-400 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${getUserRoleColor('instructor')}`}>
                    {selectedDiscussion.type}
                  </span>
                  <span>by {selectedDiscussion.instructor_name}</span>
                  <span className="mx-2">•</span>
                  <span>{formatDate(selectedDiscussion.created_at)}</span>
                </div>
                <div className="text-slate-300 whitespace-pre-wrap">{selectedDiscussion.content}</div>
              </div>

              {/* Comments Section */}
              <div className="p-6">
                <h5 className="font-medium text-white mb-4">Comments ({selectedDiscussion.comments?.length || 0})</h5>
                
                {/* Add Comment Form */}
                <form onSubmit={handleAddComment} className="mb-6">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                    className="lecturer-input w-full"
                    placeholder="Add a comment..."
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="mt-2 lecturer-btn-primary disabled:opacity-50"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Post Comment
                  </button>
                </form>

                {/* Comments List */}
                <div className="space-y-4">
                  {selectedDiscussion.comments?.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center">
                          <User className="h-4 w-4 text-slate-300" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center text-sm">
                          <span className="font-medium text-white">{comment.user_name}</span>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getUserRoleColor(comment.user_role)}`}>
                            {comment.user_role}
                          </span>
                          <span className="ml-2 text-slate-500">{formatDate(comment.created_at)}</span>
                        </div>
                        <p className="text-slate-300 mt-1">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="lecturer-card text-center py-8">
              <MessageSquare className="h-12 w-12 text-slate-500 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-white mb-2">Select a Discussion</h4>
              <p className="text-slate-400">Choose a discussion from the list to view details and participate.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
