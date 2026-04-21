import { motion } from 'motion/react';
import { CheckCircle, Circle, Lock, Play, FileText, HelpCircle, PenTool } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Progress } from '../../../components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../../components/ui/collapsible';
import { useState } from 'react';
import type { Course, CourseProgress, Lesson } from '../../../types/course';

interface CourseSidebarProps {
  course: Course;
  progress: CourseProgress;
  currentLessonId: string;
  onLessonSelect: (lessonId: string) => void;
}

export function CourseSidebar({ course, progress, currentLessonId, onLessonSelect }: CourseSidebarProps) {
  const [openModules, setOpenModules] = useState<string[]>([progress.currentModule]);

  const toggleModule = (moduleId: string) => {
    setOpenModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const getLessonIcon = (lesson: Lesson) => {
    if (lesson.locked) return <Lock className="w-4 h-4 text-gray-400" />;
    
    switch (lesson.type) {
      case 'video':
        return <Play className="w-4 h-4 text-blue-600" />;
      case 'reading':
        return <FileText className="w-4 h-4 text-green-600" />;
      case 'quiz':
        return <HelpCircle className="w-4 h-4 text-purple-600" />;
      case 'assignment':
        return <PenTool className="w-4 h-4 text-orange-600" />;
      default:
        return <Circle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getModuleProgress = (moduleId: string) => {
    const module = course.modules.find(m => m.id === moduleId);
    if (!module) return 0;
    
    const completedLessons = module.lessons.filter(lesson => 
      progress.completedLessons.includes(lesson.id)
    ).length;
    
    return Math.round((completedLessons / module.lessons.length) * 100);
  };

  return (
    <div className="w-80 bg-card border-r border-border h-full overflow-y-auto">
      <div className="p-6 border-b border-border">
        <h3 className="mb-2">Course Content</h3>
        <div className="text-sm text-muted-foreground mb-3">
          {course.modules.length} modules • {course.modules.reduce((acc, module) => acc + module.lessons.length, 0)} lessons
        </div>
        <Progress value={progress.progressPercentage} className="h-2" />
        <div className="text-xs text-muted-foreground mt-1">
          {progress.progressPercentage}% complete
        </div>
      </div>

      <div className="p-4 space-y-2">
        {course.modules.map((module: Course["modules"][number], moduleIndex: number) => {
          const moduleProgress = getModuleProgress(module.id);
          const isOpen = openModules.includes(module.id);
          
          return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: moduleIndex * 0.1 }}
            >
              <Collapsible open={isOpen} onOpenChange={() => toggleModule(module.id)}>
                <CollapsibleTrigger className="w-full">
                  <div className={`flex items-center justify-between p-3 rounded-lg border transition-colors hover:bg-accent ${
                    module.locked ? 'opacity-60' : ''
                  }`}>
                    <div className="flex items-center gap-3 flex-1 text-left">
                      <div className="flex-shrink-0">
                        {module.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-600 fill-current" />
                        ) : module.locked ? (
                          <Lock className="w-5 h-5 text-gray-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{module.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {module.duration} • {module.lessons.length} lessons
                        </div>
                        {!module.locked && (
                          <Progress value={moduleProgress} className="h-1 mt-2" />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {module.completed && (
                        <Badge variant="secondary" className="text-xs">
                          Complete
                        </Badge>
                      )}
                    </div>
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="ml-6 mt-2 space-y-1">
                    {module.lessons.map((lesson, lessonIndex) => {
                      const isCompleted = progress.completedLessons.includes(lesson.id);
                      const isCurrent = currentLessonId === lesson.id;
                      
                      return (
                        <motion.button
                          key={lesson.id}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: lessonIndex * 0.05 }}
                          onClick={() => !lesson.locked && onLessonSelect(lesson.id)}
                          disabled={lesson.locked}
                          className={`w-full flex items-center gap-3 p-2 rounded text-left transition-colors ${
                            isCurrent 
                              ? 'bg-blue-50 border border-blue-200 text-blue-900' 
                              : lesson.locked 
                                ? 'opacity-50 cursor-not-allowed' 
                                : 'hover:bg-accent'
                          }`}
                        >
                          <div className="flex-shrink-0">
                            {isCompleted ? (
                              <CheckCircle className="w-4 h-4 text-green-600 fill-current" />
                            ) : (
                              getLessonIcon(lesson)
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{lesson.title}</div>
                            <div className="text-xs text-muted-foreground">{lesson.duration}</div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}