import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../lib/api';

interface Lesson {
  id: string;
  title: string;
  description?: string;
  lesson_type: 'video' | 'reading' | 'exercise';
  video_url?: string;
  content?: string;
  image_urls?: string[];
  published: boolean;
  order_index: number;
  sub_lessons?: Array<{
    id: number;
    title: string;
    body?: string;
    order_index: number;
  }>;
}

interface Module {
  id: string;
  title: string;
  description?: string;
  published: boolean;
  order_index: number;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  description?: string;
}

interface CompletedLesson {
  lessonId: string;
  moduleId: string;
  completedAt: string;
}

export default function CourseLearningPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<CompletedLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');
  const [showAllModules, setShowAllModules] = useState(false);
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'video' | 'reading' | 'practice'>('reading');
  const [subLessonState, setSubLessonState] = useState<Record<string, { completed: number[]; activeIndex: number }>>({});
  const [celebrationSoundOn, setCelebrationSoundOn] = useState(true);
  const [slideView, setSlideView] = useState(false);
  const [readingPageIndex, setReadingPageIndex] = useState<Record<string, number>>({});
  const [practicePageIndex, setPracticePageIndex] = useState<Record<string, number>>({});

  useEffect(() => {
    const loadCourseData = async () => {
      if (!id) return;
      
      try {
        const courseData = await apiRequest<Course>(`/courses/${id}`);
        setCourse(courseData);
        
        try {
          const modulesData = await apiRequest<any>(`/courses/${id}/modules`);
          console.log('Modules data received:', modulesData);
          
          let modulesArray: Module[] = [];
          if (Array.isArray(modulesData)) {
            modulesArray = modulesData;
          } else if (modulesData?.data && Array.isArray(modulesData.data)) {
            modulesArray = modulesData.data;
          } else if (modulesData?.modules && Array.isArray(modulesData.modules)) {
            modulesArray = modulesData.modules;
          }
          
          setModules(modulesArray);
          
          if (modulesArray.length > 0) {
            const sortedModules = [...modulesArray].sort(
              (a, b) => (a.order_index ?? 0) - (b.order_index ?? 0)
            );
            setModules(sortedModules);
            setSelectedModule(sortedModules[0]);
            if (sortedModules[0].lessons && sortedModules[0].lessons.length > 0) {
              setSelectedLesson(sortedModules[0].lessons[0]);
            }
          } else {
            setModules([]);
          }
        } catch (modulesError) {
          console.warn("Modules endpoint unavailable:", modulesError);
          setModules([]);
        }
      } catch (error) {
        console.error("Failed to load course:", error);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    loadCourseData();
  }, [id]);

  const handleModuleSelect = (module: Module) => {
    setSelectedModule(module);
    if (module.lessons && module.lessons.length > 0) {
      setSelectedLesson(module.lessons[0]);
    } else {
      setSelectedLesson(null);
    }
  };

  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setActiveTab('reading');
    setSubLessonState((prev) => {
      if (prev[lesson.id]) return prev;
      return { ...prev, [lesson.id]: { completed: [], activeIndex: 0 } };
    });
    setReadingPageIndex((prev) => {
      if (prev[lesson.id] !== undefined) return prev;
      return { ...prev, [lesson.id]: 0 };
    });
    setPracticePageIndex((prev) => {
      if (prev[lesson.id] !== undefined) return prev;
      return { ...prev, [lesson.id]: 0 };
    });
  };

  const handleMarkAsDone = async (lesson: Lesson) => {
    if (!selectedModule) return;

    // Show celebration
    const messages = [
      "Congratulations! 🎉",
      "Awesome! Great job! ⭐",
      "Excellent work! 🌟",
      "You're doing amazing! 🎯",
      "Fantastic progress! 🚀"
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setCelebrationMessage(randomMessage);
    setShowCelebration(true);
    
    // Play celebration sound (simulated)
    if (celebrationSoundOn) {
      playCelebrationSound();
    }
    
    // Hide celebration after 3 seconds
    setTimeout(() => {
      setShowCelebration(false);
    }, 3000);

    const subLessons = (lesson.sub_lessons || []).sort((a, b) => a.order_index - b.order_index);
    if (subLessons.length > 0) {
      const state = subLessonState[lesson.id] || { completed: [], activeIndex: 0 };
      const currentSub = subLessons[state.activeIndex];
      if (!currentSub) return;

      const alreadyDone = state.completed.includes(currentSub.id);
      const completed = alreadyDone ? state.completed : [...state.completed, currentSub.id];
      const allDone = completed.length === subLessons.length;
      const nextIndex = Math.min(state.activeIndex + 1, subLessons.length - 1);

      setSubLessonState((prev) => ({
        ...prev,
        [lesson.id]: {
          completed,
          activeIndex: nextIndex
        }
      }));

      if (allDone) {
        const completedLesson: CompletedLesson = {
          lessonId: lesson.id,
          moduleId: selectedModule.id,
          completedAt: new Date().toISOString()
        };
        setCompletedLessons((prev) =>
          prev.some((cl) => cl.lessonId === lesson.id) ? prev : [...prev, completedLesson]
        );

        const currentLessonIndex = selectedModule.lessons.findIndex((l) => l.id === lesson.id);
        if (currentLessonIndex < selectedModule.lessons.length - 1) {
          setSelectedLesson(selectedModule.lessons[currentLessonIndex + 1]);
        }
      }

      return;
    }

    const completedLesson: CompletedLesson = {
      lessonId: lesson.id,
      moduleId: selectedModule.id,
      completedAt: new Date().toISOString()
    };

    setCompletedLessons((prev) => [...prev, completedLesson]);

    const currentLessonIndex = selectedModule.lessons.findIndex((l) => l.id === lesson.id);
    if (currentLessonIndex < selectedModule.lessons.length - 1) {
      setSelectedLesson(selectedModule.lessons[currentLessonIndex + 1]);
    }
  };

  const playCelebrationSound = () => {
    // Create a simple celebration sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const isLessonCompleted = (lesson: Lesson) => {
    const subCount = lesson.sub_lessons?.length || 0;
    if (subCount > 0) {
      const state = subLessonState[lesson.id];
      return state?.completed?.length === subCount;
    }
    return completedLessons.some(cl => cl.lessonId === lesson.id);
  };

  const isLessonUnlocked = (lessonIndex: number, lessons: Lesson[]) => {
    if (lessonIndex === 0) return true;
    const prevLesson = lessons[lessonIndex - 1];
    return isLessonCompleted(prevLesson);
  };

  const toggleShowAllModules = () => {
    setShowAllModules(!showAllModules);
  };

  const handleModuleFilterChange = (filter: string) => {
    setSelectedModuleFilter(filter);
    if (filter !== 'all') {
      const moduleIndex = parseInt(filter) - 1;
      if (moduleIndex >= 0 && moduleIndex < modules.length) {
        setSelectedModule(modules[moduleIndex]);
      }
    }
  };

  const displayedModules = showAllModules ? modules : modules.slice(0, 3);
  const hasMoreModules = modules.length > 3;

  const hasHtmlContent = (value?: string) => {
    if (!value) return false;
    return /<[^>]+>/.test(value);
  };

  const getLessonBlocks = (content?: string) => {
    if (!content) return [];
    if (hasHtmlContent(content)) return [content];
    return content.split(/\n{2,}/).filter(Boolean);
  };

  const extractPracticeBlocks = (content?: string) => {
    const blocks = getLessonBlocks(content);
    if (blocks.length === 0) return [];
    if (hasHtmlContent(content)) {
      return blocks;
    }
    const practiceSections = [
      "Practice Steps:",
      "Reflection Questions:",
      "Weekly Challenge Checklist:",
      "Common Mistakes:",
      "Weekly Challenge",
      "Coaching Questions",
      "Application Prompt"
    ];
    return blocks.filter((block) =>
      practiceSections.some((title) => block.startsWith(title))
    );
  };

  const PRACTICE_SECTION_TITLES = [
    "Practice Steps:",
    "Reflection Questions:",
    "Weekly Challenge Checklist:",
    "Common Mistakes:",
    "Weekly Challenge",
    "Coaching Questions",
    "Application Prompt"
  ];

  const stripPracticeBlocks = (content?: string) => {
    if (!content) return "";
    if (hasHtmlContent(content)) return content;
    const blocks = getLessonBlocks(content);
    const filtered = blocks.filter(
      (block) => !PRACTICE_SECTION_TITLES.some((title) => block.startsWith(title))
    );
    return filtered.join("\n\n");
  };

  const splitPracticePages = (content?: string) => {
    const blocks = extractPracticeBlocks(content);
    if (!content) return [];
    if (hasHtmlContent(content)) {
      return blocks.map((block) => ({
        title: "Practice",
        body: block
      }));
    }
    return blocks.map((block) => {
      const lines = block.split("\n").filter(Boolean);
      const firstLine = (lines[0] || "").trim().replace(/:$/, "");
      const body = lines.slice(1).join("\n");
      return {
        title: firstLine || "Practice",
        body
      };
    });
  };

  const renderLessonContent = (content?: string) => {
    if (!content) return null;
    if (hasHtmlContent(content)) {
      return (
        <div
          className="prose max-w-none text-[#4B5C75]"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }
    const blocks = getLessonBlocks(content);

    return (
      <div className="space-y-6 text-[#243247] leading-7">
        {blocks.map((block, index) => {
          const lines = block.split('\n').filter(Boolean);
          const firstLine = lines[0] || '';
          const restLines = lines.slice(1);

          const isSectionHeading = /^(Lesson Overview|How It Works|Deepening the Idea|Common Obstacles|Real Life Example|Practice Plan|Reflection and Faith|Commitment|Coaching Questions|Weekly Challenge|Scripture Focus|Practice Steps:|Reflection Questions:|Weekly Challenge Checklist:|Common Mistakes:|Application Prompt)$/i.test(firstLine.trim());

          if (isSectionHeading) {
            const listItems = restLines.filter((line) => line.trim().startsWith('- '));
            const paragraphLines = restLines.filter((line) => !line.trim().startsWith('- '));
            const paragraphText = paragraphLines.join(' ');
            const hasHtml = /<[^>]+>/.test(paragraphText);

            return (
              <section key={index} className="space-y-3">
                <h4 className="text-lg font-semibold text-[#102347] tracking-tight">
                  {firstLine.replace(':', '')}
                </h4>
                {paragraphLines.length > 0 && (
                  hasHtml ? (
                    <div
                      className="prose max-w-none text-[#4B5C75]"
                      dangerouslySetInnerHTML={{ __html: paragraphText }}
                    />
                  ) : (
                    <p className="text-[#4B5C75]">{paragraphText}</p>
                  )
                )}
                {listItems.length > 0 && (
                  <ul className="space-y-2 pl-5 list-disc text-[#4B5C75]">
                    {listItems.map((item, idx) => (
                      <li key={idx}>{item.replace(/^- /, '')}</li>
                    ))}
                  </ul>
                )}
              </section>
            );
          }

          const hasHtml = /<[^>]+>/.test(block);
          return hasHtml ? (
            <div
              key={index}
              className="prose max-w-none text-[#4B5C75]"
              dangerouslySetInnerHTML={{ __html: block }}
            />
          ) : (
            <p key={index} className="text-[#4B5C75]">
              {block}
            </p>
          );
        })}
      </div>
    );
  };

  const renderPracticeContent = (content?: string) => {
    if (!content) return null;
    if (hasHtmlContent(content)) {
      return (
        <div
          className="prose max-w-none text-[#4B5C75]"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }
    const blocks = getLessonBlocks(content);

    return (
      <div className="space-y-6 text-[#243247] leading-7">
        {blocks.map((block, index) => {
          const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
          if (!lines.length) return null;
          const firstLine = lines[0];
          const rest = lines.slice(1);

          const numberedListMatch = rest.every((line) => /^\d+\.\s+/.test(line));
          const bulletListMatch = rest.every((line) => /^-\s+/.test(line));
          const hasList = rest.length >= 2 && (numberedListMatch || bulletListMatch);

          if (hasList) {
            const listItems = rest.map((line) => line.replace(/^\d+\.\s+|^-+\s+/g, ""));
            const useLetters = firstLine.toLowerCase().includes("coaching questions");
            return (
              <section key={index} className="space-y-3">
                <h4 className="text-base font-semibold text-[#102347]">{firstLine.replace(/:$/, "")}</h4>
                {useLetters ? (
                  <ol className="space-y-2 pl-5 list-[lower-alpha] text-[#4B5C75]">
                    {listItems.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ol>
                ) : (
                  <ul className="space-y-2 pl-5 list-disc text-[#4B5C75]">
                    {listItems.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            );
          }

          const allLines = [firstLine, ...rest].map((line) => line.replace(/^-+\s+/, "").trim()).filter(Boolean);
          if (allLines.length >= 2) {
            const useLetters = firstLine.toLowerCase().includes("coaching questions");
            return (
              <section key={index} className="space-y-3">
                {useLetters ? (
                  <ol className="space-y-2 pl-5 list-[lower-alpha] text-[#4B5C75]">
                    {allLines.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ol>
                ) : (
                  <ul className="space-y-2 pl-5 list-disc text-[#4B5C75]">
                    {allLines.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            );
          }

          const restText = rest.join(" ");
          const hasHtml = /<[^>]+>/.test(restText);
          return (
            <section key={index} className="space-y-2">
              <h4 className="text-base font-semibold text-[#102347]">{firstLine.replace(/:$/, "")}</h4>
              {hasHtml ? (
                <div
                  className="prose max-w-none text-[#4B5C75]"
                  dangerouslySetInnerHTML={{ __html: restText }}
                />
              ) : (
                <p className="text-[#4B5C75]">{restText}</p>
              )}
            </section>
          );
        })}
      </div>
    );
  };

  const SECTION_ORDER = [
    "Lesson Overview",
    "Lesson Outcomes",
    "Definition",
    "How It Works",
    "Deepening the Idea",
    "Common Obstacles",
    "Real Life Example",
    "Practice Plan",
    "Reflection and Faith",
    "Commitment",
    "Coaching Questions",
    "Weekly Challenge",
    "Common Mistakes and Fixes",
    "Application Prompt",
    "Practice Steps",
    "Reflection Questions",
    "Weekly Challenge Checklist",
    "Common Mistakes",
    "Scripture Focus",
    "Affirmation"
  ];

  const splitReadingPages = (content?: string) => {
    if (!content) return [];
    if (hasHtmlContent(content)) {
      return [{ title: "Reading Notes", body: content }];
    }
    const blocks = String(content).split(/\n{2,}/).filter(Boolean);
    const pages: Array<{ title: string; body: string }> = [];

    for (const block of blocks) {
      const lines = block.split("\n").filter(Boolean);
      const firstLine = (lines[0] || "").trim().replace(/:$/, "");
      const isHeading = SECTION_ORDER.includes(firstLine);
      if (isHeading) {
        const body = lines.slice(1).join("\n");
        pages.push({ title: firstLine, body });
      } else {
        const last = pages[pages.length - 1];
        if (last) {
          last.body = `${last.body}\n\n${block}`.trim();
        } else {
          pages.push({ title: "Reading Notes", body: block });
        }
      }
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#EEF4FF] via-[#F7FAFF] to-[#F5F7FB] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1F4E8C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#5D6B82]">Loading course content...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#EEF4FF] via-[#F7FAFF] to-[#F5F7FB] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#102347] mb-4">Course not found</h2>
          <Link to="/courses" className="text-[#1F4E8C] hover:underline">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F7FB]">
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-6xl font-bold text-[#1F4E8C] animate-bounce mb-4">
              {celebrationMessage}
            </div>
            {/* Animated Flowers */}
            <div className="relative h-32">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-pulse"
                  style={{
                    left: `${20 + i * 10}%`,
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '2s'
                  }}
                >
                  🌸
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className={`mx-auto ${slideView ? 'max-w-full px-6 py-6' : 'max-w-7xl px-6 py-8'}`}>
        {/* Header */}
        <div className="mb-8">
          <Link 
            to={`/courses/${id}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#E1E6EF] rounded-md text-[#5D6B82] hover:text-[#1F4E8C] hover:border-[#1F4E8C] transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Course
          </Link>
          
          <div className="mt-6">
            <h1 className="text-3xl font-semibold text-[#102347] mb-2">{course.title}</h1>
            <p className="text-base text-[#5D6B82]">Learning Journey</p>
          </div>
        </div>

        <div className={`grid gap-8 h-full ${slideView ? 'lg:grid-cols-1' : 'lg:grid-cols-4'}`}>
          {/* Left Sidebar - Modules List */}
          {!slideView && (
          <div className="lg:col-span-1 h-full">
            <div className="bg-white rounded-xl border border-[#E1E6EF] p-5 h-full flex flex-col">
              {/* Module Selector Card */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#102347] mb-2">Select Module</label>
                <select
                  value={selectedModuleFilter}
                  onChange={(e) => handleModuleFilterChange(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E1E6EF] rounded-md bg-white text-[#102347] focus:outline-none focus:ring-2 focus:ring-[#1F4E8C] focus:border-transparent transition-all duration-200"
                >
                  <option value="all">All Modules</option>
                  {modules.map((module, index) => (
                    <option key={module.id} value={String(index + 1)}>
                      Module {index + 1}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Modules List */}
              <div className="flex-1 overflow-y-auto">
                <h2 className="text-sm font-semibold text-[#102347] mb-3 tracking-wide uppercase">Modules</h2>
                <div className="space-y-3">
                {displayedModules.map((module, index) => (
                  <button
                    key={module.id}
                    onClick={() => handleModuleSelect(module)}
                    className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                      selectedModule?.id === module.id
                        ? 'border-[#1F4E8C] bg-[#F1F5FF]'
                        : 'border-[#EEF2F7] hover:border-[#1F4E8C] hover:bg-[#F8FAFD]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                        selectedModule?.id === module.id
                          ? 'bg-[#1F4E8C] text-white'
                          : 'bg-[#EEF2F7] text-[#5D6B82]'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-[#102347] truncate">
                          {module.title}
                        </h3>
                        <p className="text-xs text-[#5D6B82]">
                          {module.lessons?.length || 0} lessons
                        </p>
                      </div>
                      {module.lessons && module.lessons.some(lesson => isLessonCompleted(lesson.id)) && (
                        <div className="text-green-500">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Show More/Less Button */}
              {hasMoreModules && (
                <button
                  onClick={toggleShowAllModules}
                  className="w-full mt-4 p-2 rounded-lg border border-[#EEF2F7] bg-white hover:border-[#1F4E8C] transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium text-[#5D6B82] hover:text-[#1F4E8C]"
                >
                  <span>{showAllModules ? 'Show Less' : 'Show More'}</span>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-300 ${showAllModules ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
            </div>
            </div>
          </div>
          )}

          {/* Right Content - Lesson Display */}
          <div className={slideView ? 'flex-1' : 'lg:col-span-3 flex-1'}>
            {selectedModule ? (
              <div className="bg-white rounded-xl border border-[#E1E6EF] p-8 h-full">
                {/* Module Header */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-[#102347] mb-1">
                    {selectedModule.title}
                  </h2>
                  {selectedModule.description && (
                    <p className="text-sm text-[#5D6B82]">{selectedModule.description}</p>
                  )}
                </div>

                {/* Lessons */}
                {selectedModule.lessons && selectedModule.lessons.length > 0 ? (
                  <div className="space-y-6">
                    {selectedModule.lessons
                      .sort((a, b) => a.order_index - b.order_index)
                      .filter((lesson) => lesson.id === selectedLesson?.id)
                      .map((lesson) => {
                        const lessonIndex = selectedModule.lessons.findIndex((l) => l.id === lesson.id);
                        const isActive = true;
                        const isUnlocked = isLessonUnlocked(lessonIndex, selectedModule.lessons);
                        const subLessons = (lesson.sub_lessons || []).sort((a, b) => a.order_index - b.order_index);
                        const subState = subLessonState[lesson.id] || { completed: [], activeIndex: 0 };
                        const currentSub = subLessons[subState.activeIndex];
                        const isCurrentSubDone = currentSub ? subState.completed.includes(currentSub.id) : true;
                        const isLessonDone = isLessonCompleted(lesson);
                        const rawReadingContent = subLessons.length > 0
                          ? subLessons[subState.activeIndex]?.body
                          : lesson.content;
                        const readingContent = stripPracticeBlocks(rawReadingContent);
                        const readingPages = splitReadingPages(readingContent);
                        const practicePages = splitPracticePages(rawReadingContent);
                        const currentReadingIndex = readingPageIndex[lesson.id] ?? 0;
                        const currentPracticeIndex = practicePageIndex[lesson.id] ?? 0;
                        const canGoPrev = activeTab === 'reading'
                          ? currentReadingIndex > 0
                          : activeTab === 'practice'
                            ? currentPracticeIndex > 0
                            : subLessons.length > 0
                              ? subState.activeIndex > 0
                              : lessonIndex > 0;
                        const canGoNextSub = subLessons.length > 0 && subState.activeIndex < subLessons.length - 1 && isCurrentSubDone;
                        const canGoNextLesson = subLessons.length === 0
                          ? isLessonDone && lessonIndex < selectedModule.lessons.length - 1
                          : isLessonDone && lessonIndex < selectedModule.lessons.length - 1;
                        const canGoNextReading = activeTab === 'reading' && currentReadingIndex < readingPages.length - 1;
                        const canGoNextPractice = activeTab === 'practice' && currentPracticeIndex < practicePages.length - 1;
                        const showReadingPaginator = activeTab === 'reading' && readingPages.length > 1;
                        const showPracticePaginator = activeTab === 'practice' && practicePages.length > 1;
                        return (
                      <div
                        key={lesson.id}
                        className="rounded-lg border border-[#EEF2F7] p-6"
                      >
                        {isActive && (
                          <div className="mb-6 border-b border-[#E7ECF3] pb-4">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                              <div>
                                <p className="text-xs text-[#6B7A93]">Module: {selectedModule.title}</p>
                                <h3 className="text-2xl font-semibold text-[#102347]">
                                  {lesson.title}
                                </h3>
                              </div>
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => setCelebrationSoundOn((prev) => !prev)}
                                  className="px-3 py-1.5 rounded-md border border-[#D5DDEA] text-[#1F4E8C] bg-white text-sm font-medium"
                                >
                                  Celebration Sound {celebrationSoundOn ? 'On' : 'Off'}
                                </button>
                                <button
                                  onClick={() => setSlideView((prev) => !prev)}
                                  className="px-3 py-1.5 rounded-md border border-[#D5DDEA] text-[#1F4E8C] bg-white text-sm font-medium"
                                >
                                  {slideView ? 'Exit Full Screen' : 'Slide View'}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="flex items-start">
                          <div className="flex-1">
                            
                            {/* Description hidden to avoid duplicate intro text before tabs */}

                            {/* Lesson Navigation Tabs */}
                            {isActive && (
                              <div className="mb-6 border-b border-[#E7ECF3]">
                                <div className="flex items-center gap-6 px-1">
                                  <button
                                    onClick={() => setActiveTab('video')}
                                    className={`pb-3 text-sm font-semibold transition-all ${
                                      activeTab === 'video'
                                        ? 'text-[#102347] border-b-2 border-[#1F4E8C]'
                                        : 'text-[#5D6B82] hover:text-[#102347]'
                                    }`}
                                  >
                                    Video
                                  </button>
                                  <button
                                    onClick={() => setActiveTab('reading')}
                                    className={`pb-3 text-sm font-semibold transition-all ${
                                      activeTab === 'reading'
                                        ? 'text-[#102347] border-b-2 border-[#1F4E8C]'
                                        : 'text-[#5D6B82] hover:text-[#102347]'
                                    }`}
                                  >
                                    Reading Notes
                                  </button>
                                  <button
                                    onClick={() => setActiveTab('practice')}
                                    className={`pb-3 text-sm font-semibold transition-all ${
                                      activeTab === 'practice'
                                        ? 'text-[#102347] border-b-2 border-[#1F4E8C]'
                                        : 'text-[#5D6B82] hover:text-[#102347]'
                                    }`}
                                  >
                                    Practice / Exercises
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Lesson Content Based on Tab */}
                            {isActive && (
                            <div className="mb-4">
                              {activeTab === 'video' && lesson.lesson_type === 'video' && lesson.video_url && (
                                <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
                                  <video
                                    className="w-full h-full rounded-lg"
                                    controls
                                    src={lesson.video_url}
                                  >
                                    Your browser does not support the video tag.
                                  </video>
                                </div>
                              )}

                              {activeTab === 'reading' && lesson.content && (
                                <div className="bg-white">
                                  {subLessons.length > 0 ? (
                                    <div>
                                      <div className="mb-4">
                                        <p className="text-xs text-[#6B7A93]">Step {subState.activeIndex + 1} of {subLessons.length}</p>
                                        <h5 className="text-lg font-semibold text-[#102347]">
                                          {subLessons[subState.activeIndex]?.title}
                                        </h5>
                                      </div>
                                      <div className="mb-6">
                                        {showReadingPaginator ? (
                                          <div>
                                            <div className="mb-3">
                                              <p className="text-xs text-[#6B7A93]">
                                                Page {currentReadingIndex + 1} of {readingPages.length}
                                              </p>
                                              <h5 className="text-lg font-semibold text-[#102347]">
                                                {readingPages[currentReadingIndex]?.title}
                                              </h5>
                                            </div>
                                            {renderLessonContent(readingPages[currentReadingIndex]?.body)}
                                          </div>
                                        ) : (
                                          renderLessonContent(subLessons[subState.activeIndex]?.body)
                                        )}
                                      </div>
                                    </div>
                                  ) : (
                                    showReadingPaginator ? (
                                      <div>
                                        <div className="mb-3">
                                          <p className="text-xs text-[#6B7A93]">
                                            Page {currentReadingIndex + 1} of {readingPages.length}
                                          </p>
                                          <h5 className="text-lg font-semibold text-[#102347]">
                                            {readingPages[currentReadingIndex]?.title}
                                          </h5>
                                        </div>
                                        {renderLessonContent(readingPages[currentReadingIndex]?.body)}
                                      </div>
                                    ) : (
                                      renderLessonContent(readingContent)
                                    )
                                  )}
                                </div>
                              )}

                              {activeTab === 'practice' && (
                                <div className="bg-white">
                                  <h4 className="text-base font-semibold text-[#102347] mb-3">Practice / Exercises</h4>
                                  {practicePages.length > 0 ? (
                                    showPracticePaginator ? (
                                      <div>
                                        <div className="mb-3">
                                          <p className="text-xs text-[#6B7A93]">
                                            Page {currentPracticeIndex + 1} of {practicePages.length}
                                          </p>
                                          <h5 className="text-lg font-semibold text-[#102347]">
                                            {practicePages[currentPracticeIndex]?.title}
                                          </h5>
                                        </div>
                                        {renderPracticeContent(practicePages[currentPracticeIndex]?.body)}
                                      </div>
                                    ) : (
                                      renderPracticeContent(practicePages[0]?.body)
                                    )
                                  ) : (
                                    <p className="text-[#5D6B82]">Practice content will appear here.</p>
                                  )}
                                </div>
                              )}
                            </div>
                            )}

                            {/* Action Buttons */}
                            {isActive && (
                              <div className="flex items-center gap-4">
                                {isLessonDone ? (
                                  <div className="flex items-center gap-2 text-green-600 font-medium">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Completed
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => handleMarkAsDone(lesson)}
                                    className="px-5 py-2 bg-[#1F4E8C] text-white rounded-md hover:bg-[#173b69] transition-all duration-200 font-medium"
                                  >
                                    Mark as Done
                                  </button>
                                )}
                                {selectedModule && (
                                  <div className="flex items-center gap-2 ml-auto">
                                    <button
                                      className={`px-4 py-2 rounded-md border transition-all ${
                                        canGoPrev
                                          ? 'border-[#D5DDEA] text-[#5D6B82] hover:text-[#1F4E8C] hover:border-[#1F4E8C]'
                                          : 'border-[#EEF2F7] text-[#A8B3C5] cursor-not-allowed'
                                      }`}
                                      onClick={() => {
                                        if (!canGoPrev) return;
                                        if (activeTab === 'reading') {
                                          setReadingPageIndex((prev) => ({
                                            ...prev,
                                            [lesson.id]: Math.max((prev[lesson.id] ?? 0) - 1, 0)
                                          }));
                                          return;
                                        }
                                        if (activeTab === 'practice') {
                                          setPracticePageIndex((prev) => ({
                                            ...prev,
                                            [lesson.id]: Math.max((prev[lesson.id] ?? 0) - 1, 0)
                                          }));
                                          return;
                                        }
                                        if (subLessons.length > 0 && subState.activeIndex > 0) {
                                          setSubLessonState((prev) => ({
                                            ...prev,
                                            [lesson.id]: {
                                              ...subState,
                                              activeIndex: subState.activeIndex - 1
                                            }
                                          }));
                                          return;
                                        }

                                        const currentLessonIndex = selectedModule.lessons.findIndex((l) => l.id === lesson.id);
                                        if (currentLessonIndex > 0) {
                                          setSelectedLesson(selectedModule.lessons[currentLessonIndex - 1]);
                                        }
                                      }}
                                    >
                                      Previous
                                    </button>
                                    <button
                                      className={`px-4 py-2 rounded-md transition-all ${
                                        canGoNextReading || canGoNextPractice || canGoNextSub || canGoNextLesson
                                          ? 'bg-[#1F4E8C] text-white hover:bg-[#173b69]'
                                          : 'bg-[#E1E6EF] text-[#A8B3C5] cursor-not-allowed'
                                      }`}
                                      onClick={() => {
                                        if (activeTab === 'reading') {
                                          if (!canGoNextReading) return;
                                          setReadingPageIndex((prev) => ({
                                            ...prev,
                                            [lesson.id]: Math.min((prev[lesson.id] ?? 0) + 1, readingPages.length - 1)
                                          }));
                                          return;
                                        }
                                        if (activeTab === 'practice') {
                                          if (!canGoNextPractice) return;
                                          setPracticePageIndex((prev) => ({
                                            ...prev,
                                            [lesson.id]: Math.min((prev[lesson.id] ?? 0) + 1, practicePages.length - 1)
                                          }));
                                          return;
                                        }
                                        if (subLessons.length > 0) {
                                          if (!canGoNextSub && !canGoNextLesson) return;
                                          if (canGoNextSub) {
                                            setSubLessonState((prev) => ({
                                              ...prev,
                                              [lesson.id]: {
                                                ...subState,
                                                activeIndex: subState.activeIndex + 1
                                              }
                                            }));
                                            return;
                                          }
                                        }

                                        if (!canGoNextLesson) return;
                                        const currentLessonIndex = selectedModule.lessons.findIndex((l) => l.id === lesson.id);
                                        if (currentLessonIndex < selectedModule.lessons.length - 1) {
                                          setSelectedLesson(selectedModule.lessons[currentLessonIndex + 1]);
                                        }
                                      }}
                                    >
                                      Next Lesson
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )})}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-[#E6ECF5] rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-[#5D6B82]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-[#102347] mb-2">No Lessons Yet</h3>
                    <p className="text-[#5D6B82]">This module doesn't have any lessons yet.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#D8E4FB] shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-[#E6ECF5] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#5D6B82]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-[#102347] mb-2">Select a Module</h3>
                <p className="text-[#5D6B82]">Choose a module from the left to start learning.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
