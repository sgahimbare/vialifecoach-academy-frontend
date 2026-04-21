import { useState } from "react";
import { motion } from "framer-motion";

// Video Card component
const VideoCard = ({ resource }: { resource: any }) => {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="flex flex-col h-full rounded-xl shadow-lg overflow-hidden bg-gray-900 bg-opacity-80 hover:shadow-2xl transition-shadow duration-300">
      {/* Video Thumbnail or Embedded Video */}
      <div className="relative aspect-video">
        {!showVideo ? (
          <div
            className="w-full h-full cursor-pointer relative"
            onClick={() => setShowVideo(true)}
          >
            <img
              src={resource.thumbnail}
              alt={resource.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 brightness-90"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
              <div className="bg-red-600 rounded-full p-3 hover:bg-red-700 transition-colors">
                <span className="text-white font-bold text-lg">▶</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full">
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition"
            >
              ✕
            </button>
            <iframe
              src={`${resource.embed}?autoplay=1`}
              title={resource.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}
      </div>

      {/* Video Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
            {resource.title}
          </h3>
          <p className="text-gray-300 text-sm line-clamp-4">
            {resource.description}
          </p>
        </div>
      </div>
    </div>
  );
};

// Resources Page
const ResourcesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const resources = [
    {
      id: 1,
      title: "Mel Robbins: How to Stop Screwing Yourself Over",
      description:
        "Mel Robbins delivers strategies to break procrastination and self-sabotage.",
      thumbnail: "https://img.youtube.com/vi/Lp7E973zozc/hqdefault.jpg",
      embed: "https://www.youtube.com/embed/Lp7E973zozc",
      category: "tutor-videos",
    },
    {
      id: 2,
      title: "Simon Sinek: How to Discover Your Why",
      description:
        "Simon Sinek guides you to discover your purpose — the foundation of a meaningful life.",
      thumbnail: "https://img.youtube.com/vi/u4ZoJKF_VuA/hqdefault.jpg",
      embed: "https://www.youtube.com/embed/u4ZoJKF_VuA",
      category: "tutor-videos",
    },
    {
      id: 3,
      title: "Brené Brown on Vulnerability",
      description:
        "Brené Brown explains the power of vulnerability and how it affects personal growth.",
      thumbnail: "https://img.youtube.com/vi/iCvmsMzlF7o/hqdefault.jpg",
      embed: "https://www.youtube.com/embed/iCvmsMzlF7o",
      category: "tutor-videos",
    },
    {
      id: 4,
      title: "Mental Health Awareness: Understanding Anxiety",
      description:
        "Learn about anxiety, coping strategies, and mental well-being tips.",
      thumbnail: "https://img.youtube.com/vi/rkZl2gsLUp4/hqdefault.jpg",
      embed: "https://www.youtube.com/embed/rkZl2gsLUp4",
      category: "mental-health",
    },
  ];

  const categories = ["all", "tutor-videos", "mental-health"];

  const filteredResources =
    selectedCategory === "all"
      ? resources
      : resources.filter((res) => res.category === selectedCategory);

  return (
    <div className="min-h-screen py-12"
      style={{
        background: "linear-gradient(135deg, #1f2937 0%, #4b5563 50%, #111827 100%)"
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Resources</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Learn from expert coaches and mental health specialists. Click on a
            video to watch it directly inside the card.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex rounded-lg bg-gray-800 bg-opacity-70 p-1 shadow-sm">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-red-600 text-white shadow"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`}
              >
                {category === "all"
                  ? "All"
                  : category === "tutor-videos"
                  ? "Tutor Videos"
                  : "Mental Health"}
              </button>
            ))}
          </div>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res, index) => (
            <motion.div
              key={res.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full"
            >
              <VideoCard resource={res} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;