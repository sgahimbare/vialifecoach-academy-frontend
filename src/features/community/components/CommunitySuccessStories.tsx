import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { communityService, type CommunitySuccessStory } from "@/services/communityService";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
      ))}
    </div>
  );
}

export function CommunitySuccessStories() {
  const { accessToken } = useAuth();
  const [stories, setStories] = useState<CommunitySuccessStory[]>([]);
  const [canPost, setCanPost] = useState(false);
  const [storyText, setStoryText] = useState("");
  const [course, setCourse] = useState("");
  const [error, setError] = useState("");

  async function load() {
    try {
      const data = await communityService.getSuccessStories(accessToken);
      setStories(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load stories");
    }
  }

  useEffect(() => {
    void load();
  }, [accessToken]);

  useEffect(() => {
    let mounted = true;
    async function loadPermission() {
      if (!accessToken) {
        if (mounted) setCanPost(false);
        return;
      }
      try {
        const allowed = await communityService.getSuccessStoryCanPost(accessToken);
        if (mounted) setCanPost(allowed);
      } catch {
        if (mounted) setCanPost(false);
      }
    }
    void loadPermission();
    return () => {
      mounted = false;
    };
  }, [accessToken]);

  async function submitStory() {
    if (!accessToken || !storyText.trim()) return;
    await communityService.createSuccessStory(accessToken, { story: storyText.trim(), course: course.trim() || undefined });
    setStoryText("");
    setCourse("");
    await load();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Success Stories</h2>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {stories.map((story) => (
          <div
            key={story.id}
            className="relative overflow-hidden rounded-2xl border border-[#274A7A] bg-gradient-to-br from-[#102347] via-[#163C66] to-[#1C4E82] p-6 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <div className="absolute right-4 top-2 text-5xl font-serif leading-none text-white/20">"</div>
            <div className="flex items-center gap-3">
              <img
                src={story.image_url || `https://i.pravatar.cc/120?img=${(story.id % 70) + 1}`}
                alt={story.name}
                className="h-14 w-14 rounded-full border-2 border-white/70 object-cover shadow"
              />
              <div>
                <p className="text-sm font-semibold text-white">{story.name}</p>
                <p className="text-xs text-sky-100">{story.role_label || "Community Member"}</p>
                <p className="text-xs font-medium text-emerald-300">{story.course || "General"}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-100">"{story.story}"</p>
            <div className="mt-4 flex items-center justify-end border-t border-white/20 pt-3">
              <StarRating rating={Number(story.rating || 5)} />
            </div>
          </div>
        ))}
      </div>

      {canPost ? (
        <div className="bg-gradient-to-br from-sky-700 to-sky-900 rounded-2xl p-6 text-white">
          <h3 className="text-lg font-bold mb-2">Share Your Story</h3>
          <div className="grid gap-2 md:grid-cols-[1fr,220px]">
            <textarea
              value={storyText}
              onChange={(e) => setStoryText(e.target.value)}
              rows={3}
              className="rounded-lg border border-white/20 bg-white/10 p-3 text-sm placeholder:text-sky-100"
              placeholder="Write your transformation story..."
            />
            <input
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="rounded-lg border border-white/20 bg-white/10 p-3 text-sm placeholder:text-sky-100"
              placeholder="Course name (optional)"
            />
          </div>
          <button
            onClick={() => void submitStory()}
            disabled={!storyText.trim() || !accessToken}
            className="mt-3 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-sky-700 disabled:opacity-50"
          >
            Submit Story
          </button>
        </div>
      ) : null}
    </div>
  );
}
