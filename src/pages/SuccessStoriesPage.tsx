import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { communityService, type CommunitySuccessStory } from "@/services/communityService";

export default function SuccessStoriesPage() {
  const { accessToken } = useAuth();
  const [stories, setStories] = useState<CommunitySuccessStory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      setIsLoading(true);
      setError("");
      try {
        const data = await communityService.getSuccessStories(accessToken);
        if (mounted) setStories(data);
      } catch (e) {
        if (mounted) setError(e instanceof Error ? e.message : "Failed to load stories.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    void load();
    return () => {
      mounted = false;
    };
  }, [accessToken]);

  const featuredVideo = stories.find((item) => item.video_url)?.video_url || "https://www.youtube.com/embed/2Lz0VOltZKA";

  return (
    <main className="bg-gradient-to-br from-emerald-50 via-white to-cyan-50 py-12">
      <section className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-10">
        <header className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-600 to-cyan-600 p-8 text-white shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/80">Community Impact</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Success Stories</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/90">
            Real voices from learners and mentors who used Vialifecoach Academy to improve mindset, leadership,
            and personal growth outcomes.
          </p>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Featured Story Video</h2>
            <p className="mt-2 text-sm leading-7 text-slate-700">
              A short 2-3 minute story highlighting practical transformation from our programs.
            </p>
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
              <iframe
                className="aspect-video w-full"
                src={featuredVideo}
                title="Featured success story video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Learner Testimonials</h2>
            <div className="mt-4 space-y-4">
              {isLoading ? <p className="text-sm text-slate-500">Loading stories...</p> : null}
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              {!isLoading && !error && stories.length === 0 ? (
                <p className="text-sm text-slate-500">No stories published yet.</p>
              ) : null}
              {stories.map((story) => (
                <blockquote key={story.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  {story.image_url ? (
                    <img
                      src={story.image_url}
                      alt={story.name}
                      className="mb-3 h-16 w-16 rounded-full border border-emerald-200 object-cover"
                    />
                  ) : null}
                  <p className="text-sm leading-7 text-slate-700">“{story.story}”</p>
                  <footer className="mt-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">
                    {story.name} • {story.role_label || "Community Member"}
                  </footer>
                </blockquote>
              ))}
            </div>
            <Link
              to="/community"
              className="mt-5 inline-flex items-center rounded-md border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
            >
              Explore Community Stories
            </Link>
          </article>
        </div>
      </section>
    </main>
  );
}
