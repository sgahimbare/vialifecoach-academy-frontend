import { ArrowRight, Play, Users } from "lucide-react";

interface ProgramHeroProps {
  title: string;
  tagline: string;
  stats: {
    womenTransformed: number;
    pillars: number;
    communitySize: number;
  };
  onEnroll: () => void;
}

export function ProgramHero({ title, tagline, stats, onEnroll }: ProgramHeroProps) {
  return (
    <div className="relative bg-gradient-to-br from-blue-600 to-purple-700 text-white">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="h-full w-full bg-repeat opacity-10" 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`
             }}>
        </div>
      </div>

      <div className="relative container mx-auto px-4 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Users className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">
                {stats.communitySize} Active Community
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              {title}
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
              {tagline}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                onClick={onEnroll}
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg inline-flex items-center justify-center gap-2"
              >
                Begin Your Journey
                <ArrowRight className="h-5 w-5" />
              </button>
              
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all inline-flex items-center justify-center gap-2">
                <Play className="h-5 w-5" />
                Watch Overview
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold mb-1">
                  {stats.womenTransformed}+
                </div>
                <div className="text-sm opacity-80">
                  Women Transformed
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">
                  {stats.pillars}
                </div>
                <div className="text-sm opacity-80">
                  Pillars
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">
                  {stats.pillars * 3}
                </div>
                <div className="text-sm opacity-80">
                  Months Support
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Visual */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {/* Pillar Cards */}
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-transform">
                <div className="w-12 h-12 bg-white/30 rounded-lg flex items-center justify-center mb-4">
                  <div className="w-6 h-6 bg-green-400 rounded-full"></div>
                </div>
                <h3 className="font-semibold mb-2">Mental Health</h3>
                <p className="text-sm opacity-80">Foundation & Wellness</p>
              </div>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-transform">
                <div className="w-12 h-12 bg-white/30 rounded-lg flex items-center justify-center mb-4">
                  <div className="w-6 h-6 bg-orange-400 rounded-full"></div>
                </div>
                <h3 className="font-semibold mb-2">Entrepreneurship</h3>
                <p className="text-sm opacity-80">Business & Skills</p>
              </div>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-transform">
                <div className="w-12 h-12 bg-white/30 rounded-lg flex items-center justify-center mb-4">
                  <div className="w-6 h-6 bg-purple-400 rounded-full"></div>
                </div>
                <h3 className="font-semibold mb-2">Virtual Assistant</h3>
                <p className="text-sm opacity-80">Career & Growth</p>
              </div>
              
              <div className="bg-white/30 backdrop-blur-sm rounded-xl p-6 border-2 border-white/50 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">3-9</div>
                  <div className="text-sm">Months</div>
                  <div className="text-xs opacity-80">Complete Journey</div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full opacity-20 blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-pink-400 rounded-full opacity-20 blur-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
