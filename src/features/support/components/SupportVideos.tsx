import { useState } from "react";
import { Play, ExternalLink } from "lucide-react";
import { videos } from "../data/supportData";

function VideoCard({ video }: { video: (typeof videos)[0] }) {
  const [playing, setPlaying] = useState(false);
  const thumb = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
      <div
        className="relative bg-slate-900 cursor-pointer"
        style={{ aspectRatio: "16/9" }}
        onClick={() => setPlaying(true)}
      >
        {playing ? (
          <iframe
            className="w-full h-full absolute inset-0"
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <img src={thumb} alt={video.title} className="w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 bg-sky-700 rounded-full flex items-center justify-center shadow-lg hover:bg-sky-800 transition-colors">
                <Play className="h-6 w-6 text-white ml-1" />
              </div>
            </div>
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
              {video.duration}
            </div>
          </>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-slate-800 mb-1">{video.title}</h3>
        <p className="text-sm text-slate-500 mb-3">{video.author}</p>
        <p className="text-sm text-slate-600 leading-relaxed flex-1">{video.description}</p>
        <a
          href={`https://www.youtube.com/watch?v=${video.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1 text-sm text-sky-700 hover:text-sky-800 font-medium"
        >
          Watch on YouTube <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}

export function SupportVideos({ searchQuery = "" }: { searchQuery?: string }) {
  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const googleSearchUrl = searchQuery 
    ? `https://www.google.com/search?q=${encodeURIComponent(`ViaLife Coach ${searchQuery} tutorial video help`)}`
    : '';

  return (
    <section id="tutorials">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Video Tutorials</h2>
        <p className="text-slate-500 mt-1">
          Curated talks and guides to accelerate your personal growth journey.
        </p>
      </div>
      {searchQuery && (
        <p className="text-slate-600 mb-4">
          Found {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''} matching "{searchQuery}"
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredVideos.length > 0 ? (
          filteredVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))
        ) : searchQuery ? (
          <div className="col-span-full text-center py-8">
            <p className="text-slate-500 mb-4">No videos found matching your search.</p>
            <p className="text-slate-400 text-sm mb-6">Try searching Google for more video tutorials:</p>
            <a
              href={googleSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Search YouTube for "{searchQuery}"
            </a>
            <p className="text-slate-400 text-xs mt-4">
              Or try different keywords like "coaching", "course help", "tutorial"
            </p>
          </div>
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-slate-500">No videos available.</p>
            <p className="text-slate-400 text-sm mt-2">Check back later for new tutorials.</p>
          </div>
        )}
      </div>
    </section>
  );
}
