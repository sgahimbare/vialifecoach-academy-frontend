import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { communityService, type CommunityDiscussionPost } from "@/services/communityService";

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

export function CourseDiscussions({ studentMode = false }: { studentMode?: boolean }) {
  const { accessToken } = useAuth();
  const [posts, setPosts] = useState<CommunityDiscussionPost[]>([]);
  const [newPost, setNewPost] = useState("");
  const [replyByPostId, setReplyByPostId] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    if (!accessToken) return;
    setLoading(true);
    setError("");
    try {
      const data = studentMode
        ? await communityService.getStudentDiscussions(accessToken)
        : await communityService.getDiscussions(accessToken);
      setPosts(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load discussions.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [accessToken]);

  async function createPost() {
    if (!accessToken || !newPost.trim()) return;
    if (studentMode) {
      await communityService.createStudentDiscussionPost(accessToken, newPost.trim());
    } else {
      await communityService.createDiscussionPost(accessToken, newPost.trim());
    }
    setNewPost("");
    await load();
  }

  async function sendReply(postId: number) {
    if (!accessToken) return;
    const content = (replyByPostId[postId] || "").trim();
    if (!content) return;
    if (studentMode) {
      await communityService.createStudentDiscussionReply(accessToken, postId, content);
    } else {
      await communityService.createDiscussionReply(accessToken, postId, content);
    }
    setReplyByPostId((prev) => ({ ...prev, [postId]: "" }));
    await load();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-xl font-bold ${studentMode ? "text-slate-100" : "text-slate-800"}`}>Course Discussions</h2>
        <p className={`mt-1 text-sm ${studentMode ? "text-slate-400" : "text-slate-500"}`}>Real posts and replies from your learners and instructors</p>
      </div>

      <div className={`${studentMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"} rounded-xl border p-4`}>
        <textarea
          rows={3}
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Share a question, insight, or reflection..."
          className={`w-full text-sm rounded-lg border px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none ${
            studentMode ? "border-slate-600 bg-slate-700 text-slate-100" : "border-slate-200 bg-slate-50"
          }`}
        />
        <div className="flex justify-end mt-2">
          <button
            disabled={!newPost.trim() || !accessToken}
            onClick={() => void createPost()}
            className="inline-flex items-center gap-2 bg-sky-700 hover:bg-sky-800 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
          >
            <Send className="h-4 w-4" /> Post
          </button>
        </div>
      </div>

      {loading ? <p className={`text-sm ${studentMode ? "text-slate-400" : "text-slate-500"}`}>Loading discussions...</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="space-y-4">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className={`${studentMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"} rounded-xl border p-5`}>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold ${studentMode ? "text-slate-100" : "text-slate-800"}`}>{post.author_name}</span>
                <span className={`text-xs rounded-full px-2 py-0.5 ${studentMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>{post.author_role}</span>
                <span className={`text-xs ${studentMode ? "text-slate-500" : "text-slate-400"}`}>{formatDate(post.created_at)}</span>
            </div>
            <p className={`mt-2 text-sm ${studentMode ? "text-slate-300" : "text-slate-700"}`}>{post.content}</p>

            <div className={`mt-3 space-y-2 border-l-2 pl-3 ${studentMode ? "border-slate-700" : "border-slate-100"}`}>
              {post.replies.map((reply) => (
                <div key={reply.id} className={`rounded p-2 ${studentMode ? "bg-slate-700" : "bg-slate-50"}`}>
                  <p className={`text-xs font-medium ${studentMode ? "text-slate-200" : "text-slate-700"}`}>{reply.author_name} ({reply.author_role})</p>
                  <p className={`mt-1 text-xs ${studentMode ? "text-slate-300" : "text-slate-600"}`}>{reply.content}</p>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center gap-2">
              <input
                type="text"
                value={replyByPostId[post.id] || ""}
                onChange={(e) => setReplyByPostId((prev) => ({ ...prev, [post.id]: e.target.value }))}
                placeholder="Write a reply..."
                className={`flex-1 text-sm rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400 ${
                  studentMode ? "border-slate-600 bg-slate-700 text-slate-100" : "border-slate-200 bg-slate-50"
                }`}
              />
              <button
                type="button"
                onClick={() => void sendReply(post.id)}
                disabled={!((replyByPostId[post.id] || "").trim()) || !accessToken}
                className="rounded-lg bg-sky-700 px-3 py-2 text-white disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))
        ) : (
          <div className={`text-center py-8 ${studentMode ? "text-slate-400" : "text-slate-500"}`}>
            <p>No discussions yet. Be the first to start a conversation!</p>
          </div>
        )}
      </div>
    </div>
  );
}
