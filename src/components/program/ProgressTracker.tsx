import { CheckCircle, Circle, ChevronRight } from "lucide-react";

interface ProgressTrackerProps {
  currentPillar: number;
  completedPillars: string[];
  pillars: Array<{
    id: string;
    title: string;
    color: string;
  }>;
}

export function ProgressTracker({ currentPillar, completedPillars, pillars }: ProgressTrackerProps) {
  const getStepStatus = (index: number) => {
    if (completedPillars.includes(pillars[index]?.id)) {
      return 'completed';
    }
    if (index === currentPillar) {
      return 'current';
    }
    return 'upcoming';
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-white" />;
      case 'current':
        return <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pillars[currentPillar]?.color }}></div>
        </div>;
      default:
        return <Circle className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStepColor = (status: string, pillarColor: string) => {
    switch (status) {
      case 'completed':
        return '#10B981'; // green-500
      case 'current':
        return pillarColor;
      default:
        return '#E5E7EB'; // gray-200
    }
  };

  return (
    <div className="bg-white shadow-sm border border-gray-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {pillars.map((pillar, index) => {
            const status = getStepStatus(index);
            const isLast = index === pillars.length - 1;
            
            return (
              <div key={pillar.id} className="flex items-center flex-1">
                {/* Step Circle */}
                <div className="relative">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{ backgroundColor: getStepColor(status, pillar.color) }}
                  >
                    {getStepIcon(status)}
                  </div>
                  
                  {/* Step Label */}
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <div className="text-xs font-medium text-gray-600 text-center">
                      {pillar.title.split(' ')[0]}
                    </div>
                    <div className="text-xs text-gray-500 text-center">
                      Step {index + 1}
                    </div>
                  </div>
                </div>

                {/* Connector Line */}
                {!isLast && (
                  <div className="flex-1 mx-4 relative">
                    <div className="h-1 bg-gray-200 rounded-full">
                      <div
                        className="h-1 rounded-full transition-all duration-500"
                        style={{
                          backgroundColor: getStepColor(status, pillar.color),
                          width: status === 'completed' ? '100%' : '0%'
                        }}
                      ></div>
                    </div>
                    
                    {/* Progress Arrow */}
                    {status === 'current' && (
                      <div className="absolute -top-1/2 transform -translate-y-1/2 left-1/2">
                        <ChevronRight 
                          className="h-4 w-4 text-white"
                          style={{ color: pillar.color }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Summary */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Your Progress
              </h3>
              <p className="text-sm text-gray-600">
                {completedPillars.length} of {pillars.length} pillars completed
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold" style={{ color: pillars[currentPillar]?.color }}>
                {Math.round((completedPillars.length / pillars.length) * 100)}%
              </div>
              <div className="text-sm text-gray-600">
                Complete
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${(completedPillars.length / pillars.length) * 100}%`,
                  backgroundColor: pillars[currentPillar]?.color
                }}
              ></div>
            </div>
          </div>

          {/* Current Step Info */}
          {currentPillar < pillars.length && (
            <div className="mt-6 p-4 rounded-lg bg-blue-50">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: pillars[currentPillar]?.color }}
                >
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    Currently Working On: {pillars[currentPillar].title}
                  </div>
                  <div className="text-sm text-gray-600">
                    Keep going! You're making great progress.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Completion Message */}
          {completedPillars.length === pillars.length && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <div className="font-medium text-green-900">
                    Congratulations! Program Complete
                  </div>
                  <div className="text-sm text-green-700">
                    You've successfully completed all three pillars of the Women Refugee Rise Program!
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
