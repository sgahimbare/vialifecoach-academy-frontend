import { Lock, Clock, CheckCircle, BookOpen, Users, ChevronRight } from "lucide-react";

interface ProgramPillar {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  duration: string;
  status: 'locked' | 'available' | 'completed';
  modules: number;
  keyTopics: string[];
}

interface PillarCardProps {
  pillar: ProgramPillar;
  index: number;
  userProgress: any;
  onClick: () => void;
}

export function PillarCard({ pillar, index, userProgress, onClick }: PillarCardProps) {
  const isLocked = pillar.status === 'locked';
  const isCompleted = pillar.status === 'completed';
  const isAvailable = pillar.status === 'available';

  const getButtonContent = () => {
    if (isLocked) {
      return (
        <>
          <Lock className="h-4 w-4 mr-2" />
          {index === 0 ? 'Begin Here' : 'Locked'}
        </>
      );
    }
    if (isCompleted) {
      return (
        <>
          <CheckCircle className="h-4 w-4 mr-2" />
          Completed
        </>
      );
    }
    return (
      <>
        {index === 0 ? 'Start Now' : 'Explore This Path'}
        <ChevronRight className="h-4 w-4 ml-2" />
      </>
    );
  };

  const getButtonClass = () => {
    const baseClass = "w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center";
    
    if (isLocked) {
      return `${baseClass} bg-gray-200 text-gray-500 cursor-not-allowed`;
    }
    if (isCompleted) {
      return `${baseClass} bg-green-100 text-green-700 hover:bg-green-200`;
    }
    return `${baseClass} text-white hover:shadow-lg transform hover:scale-105`;
  };

  const getProgressIndicator = () => {
    if (isCompleted) {
      return (
        <div className="absolute top-4 right-4">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-white" />
          </div>
        </div>
      );
    }
    if (isAvailable) {
      return (
        <div className="absolute top-4 right-4">
          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center animate-pulse">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div 
      className={`
        relative bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300
        ${isLocked ? 'opacity-75' : 'hover:shadow-2xl hover:-translate-y-1'}
        ${isAvailable ? 'ring-2 ring-offset-2' : ''}
      `}
      style={isAvailable ? { borderColor: pillar.color, borderWidth: '2px' } : {}}
    >
      {getProgressIndicator()}
      
      {/* Header */}
      <div 
        className="p-6 text-white"
        style={{ backgroundColor: isLocked ? '#9CA3AF' : pillar.color }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            {pillar.icon}
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90">Pillar {index + 1}</div>
            <div className="text-xs opacity-75">Step {index + 1} of 3</div>
          </div>
        </div>
        
        <h3 className="text-2xl font-bold mb-2">{pillar.title}</h3>
        <p className="text-sm opacity-90 leading-relaxed">{pillar.description}</p>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Duration and Modules */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            <span className="text-sm">{pillar.duration}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <BookOpen className="h-4 w-4 mr-2" />
            <span className="text-sm">{pillar.modules} Modules</span>
          </div>
        </div>

        {/* Key Topics */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">What You'll Learn:</h4>
          <div className="space-y-2">
            {pillar.keyTopics.slice(0, 3).map((topic, topicIndex) => (
              <div key={topicIndex} className="flex items-center text-sm text-gray-600">
                <div 
                  className="w-2 h-2 rounded-full mr-3"
                  style={{ backgroundColor: isLocked ? '#9CA3AF' : pillar.color }}
                ></div>
                {topic}
              </div>
            ))}
            {pillar.keyTopics.length > 3 && (
              <div className="text-sm text-gray-500 italic">
                +{pillar.keyTopics.length - 3} more topics
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar (if available) */}
        {isAvailable && !isCompleted && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Your Progress</span>
              <span>0%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: '0%',
                  backgroundColor: pillar.color 
                }}
              ></div>
            </div>
          </div>
        )}

        {/* Community Size */}
        <div className="flex items-center justify-center text-sm text-gray-500 mb-6">
          <Users className="h-4 w-4 mr-2" />
          <span>{Math.floor(Math.random() * 200 + 100)} women enrolled</span>
        </div>

        {/* Action Button */}
        <button
          onClick={onClick}
          disabled={isLocked}
          className={getButtonClass()}
          style={isAvailable && !isCompleted ? { backgroundColor: pillar.color } : {}}
        >
          {getButtonContent()}
        </button>

        {/* Lock Overlay */}
        {isLocked && (
          <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
            <div className="text-center text-gray-600">
              <Lock className="h-8 w-8 mx-auto mb-2" />
              <div className="text-sm font-medium">Complete Previous Pillar</div>
              <div className="text-xs">to unlock this path</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
