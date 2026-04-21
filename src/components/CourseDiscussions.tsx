import { useState, useEffect } from "react";
import { MessageSquare, Plus, Users, Award, BookOpen, Edit3, Trash2, CheckCircle, Clock } from "lucide-react";
import { courseDiscussionService, type CourseDiscussion, type DiscussionComment, type DiscussionGrade } from "@/services/courseDiscussionService";
import { useAuth } from "@/context/AuthContext";
import { extractApiErrorMessage } from "@/lib/apiError";

interface CourseDiscussionsProps {
  courseId: number;
  isInstructor?: boolean;
}

export function CourseDiscussions({ courseId, isInstructor = false }: CourseDiscussionsProps) {
  const { accessToken, user } = useAuth();
  const [discussions, setDiscussions] = useState<CourseDiscussion[]>([]);
  const [selectedDiscussion, setSelectedDiscussion] = useState<CourseDiscussion | null>(null);
  const [newDiscussion, setNewDiscussion] = useState({ title: "", content: "", type: "general" as "general" | "assignment" | "announcement" });
  const [newComment, setNewComment] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadDiscussions();
  }, [courseId]);

  async function loadDiscussions() {
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

  async function handleCreateDiscussion(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken || !newDiscussion.title.trim() || !newDiscussion.content.trim()) return;

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
      loadDiscussions();
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
      // Reload the discussion to show the new comment
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-2 text-gray-600">Loading discussions...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          Course Discussions
        </h3>
        {isInstructor && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Discussion
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      {/* Create Discussion Form */}
      {showCreateForm && isInstructor && (
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Create New Discussion</h4>
          <form onSubmit={handleCreateDiscussion} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={newDiscussion.title}
                onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter discussion title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={newDiscussion.type}
                onChange={(e) => setNewDiscussion({ ...newDiscussion, type: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="general">General Discussion</option>
                <option value="assignment">Assignment Discussion</option>
                <option value="announcement">Announcement</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea
                value={newDiscussion.content}
                onChange={(e) => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Write your discussion content..."
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
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
            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-8 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No discussions yet</h4>
              <p className="text-gray-600">
                {isInstructor ? "Create the first discussion to get started." : "Wait for your instructor to create discussions."}
              </p>
            </div>
          ) : (
            discussions.map((discussion) => (
              <div
                key={discussion.id}
                onClick={() => handleSelectDiscussion(discussion)}
                className={`bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4 cursor-pointer transition-all duration-200 hover:shadow-xl ${
                  selectedDiscussion?.id === discussion.id ? 'ring-2 ring-purple-500' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{discussion.title}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">{discussion.content}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <BookOpen className="h-3 w-3 mr-1" />
                      <span className="capitalize">{discussion.type}</span>
                      <span className="mx-2">•</span>
                      <span>{formatDate(discussion.created_at)}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-xs text-gray-500 text-right">
                      <div>{discussion.instructor_name}</div>
                      <div>Instructor</div>
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
            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20">
              <div className="p-6 border-b border-gray-200/50">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{selectedDiscussion.title}</h4>
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <span className="capitalize bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs mr-2">
                    {selectedDiscussion.type}
                  </span>
                  <span>by {selectedDiscussion.instructor_name}</span>
                  <span className="mx-2">•</span>
                  <span>{formatDate(selectedDiscussion.created_at)}</span>
                </div>
                <div className="text-gray-700 whitespace-pre-wrap">{selectedDiscussion.content}</div>
              </div>

              {/* Comments Section */}
              <div className="p-6">
                <h5 className="font-medium text-gray-900 mb-4">Comments ({selectedDiscussion.comments?.length || 0})</h5>
                
                {/* Add Comment Form */}
                <form onSubmit={handleAddComment} className="mb-6">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Add a comment..."
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="mt-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                  >
                    Post Comment
                  </button>
                </form>

                {/* Comments List */}
                <div className="space-y-4">
                  {selectedDiscussion.comments?.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <span className="text-purple-600 text-sm font-medium">
                            {comment.user_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center text-sm">
                          <span className="font-medium text-gray-900">{comment.user_name}</span>
                          <span className="ml-2 text-gray-500 capitalize">{comment.user_role}</span>
                          <span className="ml-2 text-gray-400">{formatDate(comment.created_at)}</span>
                        </div>
                        <p className="text-gray-700 mt-1">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-8 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Select a Discussion</h4>
              <p className="text-gray-600">Choose a discussion from the list to view details and participate.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
