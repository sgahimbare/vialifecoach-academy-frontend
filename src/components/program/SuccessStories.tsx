import { useState } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

interface SuccessStory {
  id: number;
  name: string;
  country: string;
  beforeStory: string;
  afterStory: string;
  achievement: string;
  currentStatus: string;
  image: string;
  completedPillars: string[];
  rating: number;
}

export function SuccessStories() {
  const [currentStory, setCurrentStory] = useState(0);

  const stories: SuccessStory[] = [
    {
      id: 1,
      name: "Amina K.",
      country: "Somalia → Canada",
      beforeStory: "When I arrived, I was struggling with trauma and couldn't see a future for myself. I had lost everything and felt hopeless.",
      afterStory: "The mental health pillar helped me heal. I learned to process my trauma and build resilience. I feel like myself again.",
      achievement: "Started a successful catering business serving her community",
      currentStatus: "Business owner, employing 3 other refugee women",
      image: "amina",
      completedPillars: ["mental-health", "entrepreneurship", "virtual-assistant"],
      rating: 5
    },
    {
      id: 2,
      name: "Maria G.",
      country: "Venezuela → USA",
      beforeStory: "I had skills but no confidence. In my home country, I was a teacher, but here I felt like I had nothing to offer.",
      afterStory: "The entrepreneurship pillar gave me the tools to start small. I learned about local markets and built my confidence step by step.",
      achievement: "Launched an online tutoring business helping other refugees learn English",
      currentStatus: "Educator and community leader",
      image: "maria",
      completedPillars: ["mental-health", "entrepreneurship"],
      rating: 5
    },
    {
      id: 3,
      name: "Fatima A.",
      country: "Syria → Germany",
      beforeStory: "I was a doctor in Syria, but my credentials weren't recognized. I felt worthless and depressed.",
      afterStory: "The virtual assistant program taught me modern office skills. I discovered I could use my medical background in new ways.",
      achievement: "Works as a medical virtual assistant for a telehealth company",
      currentStatus: "Healthcare professional, earning 3x previous income",
      image: "fatima",
      completedPillars: ["mental-health", "virtual-assistant"],
      rating: 5
    }
  ];

  const nextStory = () => {
    setCurrentStory((prev) => (prev + 1) % stories.length);
  };

  const prevStory = () => {
    setCurrentStory((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const story = stories[currentStory];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Success Stories
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Real women. Real transformations. See how the Women Refugee Rise Program has changed lives.
        </p>
      </div>

      {/* Story Carousel */}
      <div className="relative max-w-4xl mx-auto">
        {/* Navigation Buttons */}
        <button
          onClick={prevStory}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
        >
          <ChevronLeft className="h-6 w-6 text-gray-600" />
        </button>
        <button
          onClick={nextStory}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
        >
          <ChevronRight className="h-6 w-6 text-gray-600" />
        </button>

        {/* Story Content */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left - Story Text */}
            <div>
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {story.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{story.name}</h3>
                  <p className="text-gray-600">{story.country}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {renderStars(story.rating)}
                  </div>
                </div>
              </div>

              {/* Story */}
              <div className="space-y-6">
                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 h-8 w-8 text-blue-200" />
                  <div className="bg-white rounded-xl p-6 border border-blue-100">
                    <h4 className="font-semibold text-gray-900 mb-3">Before the Program</h4>
                    <p className="text-gray-600 italic">"{story.beforeStory}"</p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <ChevronRight className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-white rounded-xl p-6 border border-green-100">
                    <h4 className="font-semibold text-gray-900 mb-3">After the Program</h4>
                    <p className="text-gray-600 italic">"{story.afterStory}"</p>
                  </div>
                </div>

                {/* Achievement */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                  <h4 className="font-semibold text-gray-900 mb-2">🏆 Achievement</h4>
                  <p className="text-gray-700">{story.achievement}</p>
                </div>

                {/* Current Status */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <h4 className="font-semibold text-gray-900 mb-2">✨ Current Status</h4>
                  <p className="text-gray-700">{story.currentStatus}</p>
                </div>
              </div>
            </div>

            {/* Right - Visual */}
            <div className="text-center">
              {/* Pillar Progress */}
              <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-4">Completed Pillars</h4>
                <div className="space-y-3">
                  {['Mental Health', 'Entrepreneurship', 'Virtual Assistant'].map((pillar, index) => (
                    <div key={pillar} className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full ${
                          story.completedPillars.includes(
                            ['mental-health', 'entrepreneurship', 'virtual-assistant'][index]
                          )
                            ? 'bg-green-500'
                            : 'bg-gray-300'
                        }`}
                      ></div>
                      <span className="text-sm text-gray-700">{pillar}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Success Metrics */}
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white">
                <h4 className="font-bold mb-4">Impact Metrics</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Income Growth</span>
                    <span className="font-bold">+300%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Confidence Level</span>
                    <span className="font-bold">95%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Community Impact</span>
                    <span className="font-bold">High</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {stories.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStory(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentStory
                  ? 'w-8 bg-blue-600'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Ready to Write Your Own Success Story?
        </h3>
        <p className="text-gray-600 mb-6">
          Join hundreds of women who have transformed their lives through this program
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Start Your Journey
          </button>
          <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
            Read More Stories
          </button>
        </div>
      </div>
    </div>
  );
}
