import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { courseService } from "@/services/courseService";
import { courseProgressService, type CourseProgress, type ModuleProgress } from "@/services/courseProgressService";
import { ChevronDown, ChevronRight, Lock, Unlock, CheckCircle, Play, BookOpen, FileText, X, Menu, MoreVertical } from "lucide-react";

type LessonItem = {
  id: number;
  title: string;
  content_type?: string;
  order_index: number;
  content?: {
    id: number;
    content_type?: string;
    title?: string;
    body?: string;
    image_url?: string;
    video_url?: string;
    external_url?: string;
    file_url?: string;
  }[];
};

type ModuleItem = {
  id: number;
  title: string;
  order_index: number;
  lessons: LessonItem[];
};

type CourseOverview = {
  id: number;
  title: string;
  short_description?: string;
  long_description?: string;
  category?: string;
  duration_weeks?: number;
  delivery_mode?: string;
  has_certificate?: boolean;
  modules: ModuleItem[];
};

type LessonPage = {
  title: string;
  body: string;
};

type CelebrationType = "lesson" | "module" | "course";

type CelebrationParticle = {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
};

function renderRichText(body: string) {
  const lines = body.split(/\r?\n/);
  const nodes: JSX.Element[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const raw = lines[i].trim();
    if (!raw) {
      i += 1;
      continue;
    }

    const headingMatch = raw.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const headingClass =
        level === 1
          ? "text-xl font-bold text-[#102347] mt-4"
          : level === 2
            ? "text-lg font-semibold text-[#102347] mt-4"
            : level === 3
              ? "text-base font-semibold text-[#102347] mt-4"
              : "text-sm font-semibold text-[#102347] mt-3";

      if (level === 1) {
        nodes.push(
          <h2 key={`h2-${key++}`} className={headingClass}>
            {text}
          </h2>
        );
      } else if (level === 2) {
        nodes.push(
          <h3 key={`h3-${key++}`} className={headingClass}>
            {text}
          </h3>
        );
      } else {
        nodes.push(
          <h4 key={`h4-${key++}`} className={headingClass}>
            {text}
          </h4>
        );
      }
      i += 1;
      continue;
    }

    if (/^[-*]\s+/.test(raw)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ""));
        i += 1;
      }
      nodes.push(
        <ul key={`ul-${key++}`} className="list-disc list-inside space-y-1 text-[#3F4F66] leading-relaxed">
          {items.map((item, itemIndex) => (
            <li key={`li-${key}-${itemIndex}`}>{item}</li>
          ))}
        </ul>
      );
      continue;
    }

    if (/^\d+\.\s+/.test(raw)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
        i += 1;
      }
      nodes.push(
        <ol key={`ol-${key++}`} className="list-decimal list-inside space-y-1 text-[#3F4F66] leading-relaxed">
          {items.map((item, itemIndex) => (
            <li key={`oli-${key}-${itemIndex}`}>{item}</li>
          ))}
        </ol>
      );
      continue;
    }

    const paragraph: string[] = [raw];
    i += 1;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,6}\s+|[-*]\s+|\d+\.\s+)/.test(lines[i].trim())
    ) {
      paragraph.push(lines[i].trim());
      i += 1;
    }

    nodes.push(
      <p key={`p-${key++}`} className="text-[#3F4F66] leading-relaxed">
        {paragraph.join(" ")}
      </p>
    );
  }

  return <div className="space-y-3">{nodes}</div>;
}

function splitBodyIntoPages(body: string): LessonPage[] {
  const lines = body.split(/\r?\n/);
  const h2Indices: number[] = [];
  for (let i = 0; i < lines.length; i += 1) {
    if (/^##\s+/.test(lines[i].trim())) {
      h2Indices.push(i);
    }
  }

  if (h2Indices.length === 0) {
    return [{ title: "Content", body }];
  }

  const pages: LessonPage[] = [];
  const introLines = lines.slice(0, h2Indices[0]).join("\n").trim();
  if (introLines) {
    pages.push({ title: "Introduction", body: introLines });
  }

  for (let i = 0; i < h2Indices.length; i += 1) {
    const start = h2Indices[i];
    const end = i < h2Indices.length - 1 ? h2Indices[i + 1] : lines.length;
    const heading = lines[start].trim().replace(/^##\s+/, "");
    const chunk = lines.slice(start + 1, end).join("\n").trim();
    pages.push({
      title: heading || `Section ${i + 1}`,
      body: chunk || "No content available for this section.",
    });
  }

  return pages;
}

function buildExerciseFallback(lessonTitle: string, moduleTitle?: string) {
  return [
    `### Practice Objective`,
    `Apply the key idea from "${lessonTitle}" to a real situation and convert insight into measurable action.`,
    ``,
    `### Practice Steps`,
    `1. Write one challenge you are currently facing that this lesson can improve.`,
    `2. Summarize the lesson principle in one sentence using your own words.`,
    `3. Define one concrete action you will complete in the next 24 hours.`,
    `4. Set a start time and duration for that action.`,
    `5. Record your result and one adjustment for your next attempt.`,
    ``,
    `### Reflection Questions`,
    `- What changed in your thinking after applying this lesson?`,
    `- What resistance showed up, and how did you respond?`,
    `- What will you repeat or improve in your next practice cycle?`,
    ``,
    `### Submission`,
    `Share your action result and reflection notes in your learning journal${moduleTitle ? ` for "${moduleTitle}"` : ""}.`,
  ].join("\n");
}

function buildGuestProgress(courseData: CourseOverview): CourseProgress {
  const modules: ModuleProgress[] = [...courseData.modules]
    .sort((a, b) => a.order_index - b.order_index)
    .map((module, index) => ({
      id: module.id,
      module_title: module.title,
      module_order: module.order_index,
      isUnlocked: index === 0,
      isCompleted: false,
      completedLessons: 0,
      totalLessons: module.lessons.length,
      lessons: module.lessons.map((lesson) => ({
        lesson_id: lesson.id,
        lesson_title: lesson.title,
        lesson_order: lesson.order_index,
        completed: false,
      })),
    }));

  const totalLessons = modules.reduce((sum, module) => sum + module.totalLessons, 0);

  return {
    course_id: courseData.id,
    modules,
    overall_progress: {
      completed_modules: 0,
      total_modules: modules.length,
      completed_lessons: 0,
      total_lessons: totalLessons,
    },
  };
}

export default function LinearCoursePlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseOverview | null>(null);
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set());
  const [selectedLesson, setSelectedLesson] = useState<LessonItem | null>(null);
  const [selectedModule, setSelectedModule] = useState<ModuleItem | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [activeContentTab, setActiveContentTab] = useState<"video" | "reading" | "exercise">("reading");
  const [readingPageByContentId, setReadingPageByContentId] = useState<Record<number, number>>({});
  const [selectedModuleFilterId, setSelectedModuleFilterId] = useState<number | "all" | null>(null);
  const [showAllModules, setShowAllModules] = useState(false);
  const [presentationMode, setPresentationMode] = useState(false);
  const [celebration, setCelebration] = useState<{
    type: CelebrationType;
    message: string;
    particles: CelebrationParticle[];
  } | null>(null);
  const [celebrationSoundEnabled, setCelebrationSoundEnabled] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  useEffect(() => {
    setReadingPageByContentId({});
  }, [selectedLesson?.id, activeContentTab]);

  useEffect(() => {
    if (!selectedLesson) return;
    const hasVideo = (selectedLesson.content || []).some((c) => Boolean(c.video_url));
    setActiveContentTab(hasVideo ? "video" : "reading");
  }, [selectedLesson?.id]);

  useEffect(() => {
    if (!course) return;
    const sorted = [...course.modules].sort((a, b) => a.order_index - b.order_index);
    const currentId =
      selectedModule?.id ||
      progress?.modules.find((m) => m.isUnlocked && !m.isCompleted)?.id ||
      progress?.modules.find((m) => m.isUnlocked)?.id ||
      sorted[0]?.id ||
      null;

    if (selectedModuleFilterId === null && currentId !== null) {
      setSelectedModuleFilterId(currentId);
    }
  }, [course, progress, selectedModule?.id, selectedModuleFilterId]);

  useEffect(() => {
    if (presentationMode) {
      setSidebarVisible(false);
    }
  }, [presentationMode]);

  const speakCelebration = (type: CelebrationType) => {
    if (!celebrationSoundEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const utterance = new SpeechSynthesisUtterance(
      type === "course"
        ? "Congratulations you've make it"
        : type === "module"
          ? "Excellent work. Mission completed."
          : "Great job. Mission completed."
    );
    utterance.rate = 1;
    utterance.pitch = type === "course" ? 1.1 : type === "module" ? 1.08 : 1.02;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice =
      voices.find((v) => /microsoft zira desktop/i.test(v.name)) ||
      voices.find((v) => /microsoft hazel desktop/i.test(v.name)) ||
      voices.find((v) => /female|woman|zira|susan|aria|samantha|google us english/i.test(v.name)) ||
      voices.find((v) => /en/i.test(v.lang)) ||
      null;
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const playClapPattern = (type: CelebrationType) => {
    if (!celebrationSoundEnabled || typeof window === "undefined") return;
    const AudioCtx = (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }).AudioContext
      || (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const hits = type === "course" ? 12 : type === "module" ? 8 : 4;

    for (let i = 0; i < hits; i += 1) {
      const time = ctx.currentTime + 0.07 * i;
      const noise = ctx.createBufferSource();
      const buffer = ctx.createBuffer(1, 2048, ctx.sampleRate);
      const channel = buffer.getChannelData(0);
      for (let j = 0; j < channel.length; j += 1) {
        channel[j] = (Math.random() * 2 - 1) * (1 - j / channel.length);
      }
      noise.buffer = buffer;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(type === "course" ? 0.42 : type === "module" ? 0.35 : 0.22, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

      noise.connect(gain);
      gain.connect(ctx.destination);
      noise.start(time);
      noise.stop(time + 0.12);
    }

    window.setTimeout(() => ctx.close(), 1500);
  };

  const triggerCelebration = (type: CelebrationType) => {
    const count = type === "course" ? 72 : type === "module" ? 56 : 34;
    const particles: CelebrationParticle[] = Array.from({ length: count }).map((_, idx) => ({
      id: idx + 1,
      left: Math.random() * 100,
      delay: Math.random() * 0.9,
      duration: type === "course" ? 3.4 + Math.random() * 1.9 : type === "module" ? 2.9 + Math.random() * 1.8 : 2.1 + Math.random() * 1.2,
      size: type === "course" ? 18 + Math.random() * 16 : type === "module" ? 16 + Math.random() * 14 : 12 + Math.random() * 10,
      rotation: (Math.random() - 0.5) * 180,
    }));

    setCelebration({
      type,
      message:
        type === "course"
          ? "Congratulations you've make it"
          : type === "module"
            ? "Module Complete"
            : "Lesson Complete",
      particles,
    });

    playClapPattern(type);
    speakCelebration(type);

    window.setTimeout(() => {
      setCelebration(null);
    }, type === "module" ? 4300 : 3000);
  };

  const loadData = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      
      // Static course data with 5 modules
      const courseData: CourseOverview = {
        id: Number(id),
        title: "Overcoming Negative Thinking: Rewiring Your Brain for Positivity",
        short_description: "Master the neuroscience of positive thinking",
        long_description: "This comprehensive course combines cutting-edge neuroscience with practical coaching techniques to help you rewire your brain for positivity.",
        category: "Personal Development",
        duration_weeks: 6,
        delivery_mode: "self-paced",
        has_certificate: true,
        modules: [
          {
            id: 1,
            title: "The Neuroscience of Awareness",
            order_index: 0,
            lessons: [
              { id: 1, title: "Introduction: Understanding Negative Thought Patterns", order_index: 0, content_type: "video" },
              { id: 2, title: "Learning Outcomes & Objectives", order_index: 1, content_type: "reading" },
              { id: 3, title: "The Brain as a Prediction Engine", order_index: 2, content_type: "video" },
              { id: 4, title: "Module Summary & Key Takeaways", order_index: 3, content_type: "reading" }
            ]
          },
          {
            id: 2,
            title: "The Nature of Negative Thinking",
            order_index: 1,
            lessons: [
              { id: 1, title: "Introduction", order_index: 0, content_type: "video" },
              { id: 2, title: "Learning Outcomes", order_index: 1, content_type: "reading" },
              { id: 3, title: "Lesson 2.1: Core Beliefs and Internal Scripts", order_index: 2, content_type: "video" },
              { id: 4, title: "Lesson 2.2: Beliefs vs. Events", order_index: 3, content_type: "video" },
              { id: 5, title: "Lesson 2.3: Case Study — The Architecture of Negative Thinking", order_index: 4, content_type: "video" },
              { id: 6, title: "Lesson 2.4: Practice Lab — Structured Cognitive Observation", order_index: 5, content_type: "video" },
              { id: 7, title: "Reflection and Quiz — Checkpoint 2", order_index: 6, content_type: "reading" }
            ]
          },
          {
            id: 3,
            title: "Advanced Cognitive Restructuring",
            order_index: 2,
            lessons: [
              { id: 1, title: "Introduction to Cognitive Restructuring", order_index: 0, content_type: "video" },
              { id: 2, title: "Learning Outcomes", order_index: 1, content_type: "reading" },
              { id: 3, title: "Practical Restructuring Techniques", order_index: 2, content_type: "video" },
              { id: 4, title: "Module Summary & Practice", order_index: 3, content_type: "reading" }
            ]
          },
          {
            id: 4,
            title: "Somatic Regulation & Integration",
            order_index: 3,
            lessons: [
              { id: 1, title: "Introduction to Somatic Regulation", order_index: 0, content_type: "video" },
              { id: 2, title: "Learning Outcomes", order_index: 1, content_type: "reading" },
              { id: 3, title: "Body-Based Techniques for Emotional Regulation", order_index: 2, content_type: "video" },
              { id: 4, title: "Module Summary & Integration", order_index: 3, content_type: "reading" }
            ]
          },
          {
            id: 5,
            title: "Building New Neural Pathways",
            order_index: 4,
            lessons: [
              { id: 1, title: "Introduction to Neural Pathway Development", order_index: 0, content_type: "video" },
              { id: 2, title: "Learning Outcomes & Course Integration", order_index: 1, content_type: "reading" },
              { id: 3, title: "Long-term Success Strategies", order_index: 2, content_type: "video" },
              { id: 4, title: "Course Completion & Next Steps", order_index: 3, content_type: "reading" }
            ]
          }
        ]
      };
      
      setCourse(courseData);

      let progressData: CourseProgress;
      try {
        progressData = await courseProgressService.getCourseProgress(Number(id));
      } catch {
        progressData = buildGuestProgress(courseData);
      }
      setProgress(progressData);
      
      // Auto-expand first unlocked module
      if (progressData.modules.length > 0) {
        const firstUnlocked = progressData.modules.find(m => m.isUnlocked);
        if (firstUnlocked) {
          setExpandedModules(new Set([firstUnlocked.id]));
        }
      }
      
      // Auto-scroll to first uncompleted lesson
      const firstUncompletedLesson = findFirstUncompletedLesson(courseData, progressData);
      if (firstUncompletedLesson) {
        // Auto-select first lesson
        const module = courseData.modules.find((m: ModuleItem) => 
          m.lessons.some((l: LessonItem) => l.id === firstUncompletedLesson.id)
        );
        if (module) {
          setSelectedModule(module);
          setSelectedLesson(firstUncompletedLesson);
        }
      }
    } catch (err) {
      setError("Failed to load course");
    } finally {
      setLoading(false);
    }
  };

  const findFirstUncompletedLesson = (course: CourseOverview, progress: CourseProgress): LessonItem | null => {
    for (const module of course.modules) {
      const moduleProgress = progress.modules.find(m => m.id === module.id);
      if (moduleProgress?.isUnlocked) {
        for (const lesson of module.lessons) {
          const lessonProgress = moduleProgress.lessons.find(l => l.lesson_id === lesson.id);
          if (!lessonProgress?.completed) {
            return lesson;
          }
        }
      }
    }
    return null;
  };

  const getModuleStatus = (moduleId: number): {
    isUnlocked: boolean;
    isCompleted: boolean;
    completedLessons: number;
    totalLessons: number;
    progressPercent: number;
  } => {
    if (!progress) {
      return { isUnlocked: false, isCompleted: false, completedLessons: 0, totalLessons: 0, progressPercent: 0 };
    }

    const moduleProgress = progress.modules.find(m => m.id === moduleId);
    if (!moduleProgress) {
      return { isUnlocked: false, isCompleted: false, completedLessons: 0, totalLessons: 0, progressPercent: 0 };
    }

    const progressPercent = moduleProgress.totalLessons > 0 
      ? (moduleProgress.completedLessons / moduleProgress.totalLessons) * 100 
      : 0;

    return {
      isUnlocked: moduleProgress.isUnlocked,
      isCompleted: moduleProgress.isCompleted,
      completedLessons: moduleProgress.completedLessons,
      totalLessons: moduleProgress.totalLessons,
      progressPercent
    };
  };

  const toggleModule = (moduleId: number) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const selectLesson = (module: ModuleItem, lesson: LessonItem) => {
    const status = getModuleStatus(module.id);
    if (!status.isUnlocked) return; // Can't select lessons in locked modules
    
    setSelectedModule(module);
    setSelectedLesson(lesson);
    setSidebarVisible(false); // Enter focus mode
  };

  const markLessonComplete = async () => {
    if (!selectedLesson || !selectedModule || !course) return;

    const advanceToNextLesson = () => {
      if (!selectedModule) return;
      const currentModuleLessons = selectedModule.lessons.sort((a, b) => a.order_index - b.order_index);
      const currentIndex = currentModuleLessons.findIndex(l => l.id === selectedLesson.id);

      if (currentIndex < currentModuleLessons.length - 1) {
        setSelectedLesson(currentModuleLessons[currentIndex + 1]);
      } else {
        const currentModuleIndex = course.modules.findIndex(m => m.id === selectedModule.id);
        if (currentModuleIndex >= 0 && currentModuleIndex < course.modules.length - 1) {
          const nextModule = course.modules[currentModuleIndex + 1];
          if (nextModule.lessons.length > 0) {
            setSelectedModule(nextModule);
            setSelectedLesson(nextModule.lessons.sort((a, b) => a.order_index - b.order_index)[0]);
            setExpandedModules((prev) => new Set([...prev, nextModule.id]));
          }
        }
      }
    };

    const applyLocalCompletionFallback = () => {
      let moduleJustCompleted = false;
      let courseJustCompleted = false;
      setProgress((prev) => {
        if (!prev) return prev;

        const modules = prev.modules.map((module) => {
          if (module.id !== selectedModule.id) return module;

          const lessons = module.lessons.map((lesson) =>
            lesson.lesson_id === selectedLesson.id ? { ...lesson, completed: true } : lesson
          );
          const completedLessons = lessons.filter((lesson) => lesson.completed).length;
          const isCompleted = module.totalLessons > 0 && completedLessons === module.totalLessons;
          moduleJustCompleted = isCompleted;
          return {
            ...module,
            lessons,
            completedLessons,
            isCompleted,
          };
        });

        const sortedModules = [...modules].sort((a, b) => a.module_order - b.module_order);
        for (let i = 0; i < sortedModules.length; i += 1) {
          if (i === 0) {
            sortedModules[i].isUnlocked = true;
          } else {
            const prevModule = sortedModules[i - 1];
            sortedModules[i].isUnlocked = prevModule.isCompleted;
          }
        }

        const completedModules = sortedModules.filter((m) => m.isCompleted).length;
        const completedLessons = sortedModules.reduce((sum, m) => sum + m.completedLessons, 0);
        const totalLessons = sortedModules.reduce((sum, m) => sum + m.totalLessons, 0);
        courseJustCompleted = sortedModules.length > 0 && completedModules === sortedModules.length;

        return {
          ...prev,
          modules: sortedModules,
          overall_progress: {
            completed_modules: completedModules,
            total_modules: sortedModules.length,
            completed_lessons: completedLessons,
            total_lessons: totalLessons,
          },
        };
      });
      advanceToNextLesson();
      triggerCelebration(courseJustCompleted ? "course" : moduleJustCompleted ? "module" : "lesson");
    };

    try {
      const completion = await courseProgressService.markLessonComplete(
        Number(course.id),
        selectedModule.id,
        selectedLesson.id
      );
      
      // Refresh progress data
      const newProgress = await courseProgressService.getCourseProgress(Number(course.id));
      setProgress(newProgress);
      advanceToNextLesson();
      const courseJustCompleted =
        Boolean(newProgress?.overall_progress?.total_modules) &&
        newProgress.overall_progress.completed_modules === newProgress.overall_progress.total_modules;
      triggerCelebration(courseJustCompleted ? "course" : completion?.data?.module_completed ? "module" : "lesson");
    } catch (err) {
      console.error("Failed to mark lesson complete on server, applying local fallback:", err);
      applyLocalCompletionFallback();
    }
  };

  const getOverallProgress = () => {
    if (!progress) return { completed: 0, total: 0, percent: 0 };
    
    const completed = progress.overall_progress.completed_modules;
    const total = progress.overall_progress.total_modules;
    const percent = total > 0 ? (completed / total) * 100 : 0;
    
    return { completed, total, percent };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#DCE5F2] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F4E8C] mx-auto mb-4"></div>
          <p className="text-[#5D6B82]">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-[#DCE5F2] flex items-center justify-center">
        <div className="text-center text-red-600">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error || "Course not found"}</p>
        </div>
      </div>
    );
  }

  const overallProgress = getOverallProgress();
  const sortedModules = [...course.modules].sort((a, b) => a.order_index - b.order_index);
  const currentLearningModuleId =
    selectedModule?.id ||
    progress?.modules.find((m) => m.isUnlocked && !m.isCompleted)?.id ||
    progress?.modules.find((m) => m.isUnlocked)?.id ||
    sortedModules[0]?.id;
  const effectiveSelectedModuleId =
    selectedModuleFilterId === null ? currentLearningModuleId ?? null : selectedModuleFilterId;
  const filteredModules =
    effectiveSelectedModuleId === "all"
      ? sortedModules
      : effectiveSelectedModuleId
        ? sortedModules.filter((m) => m.id === effectiveSelectedModuleId)
        : sortedModules.slice(0, 1);
  const visibleModules = showAllModules ? filteredModules : filteredModules.slice(0, 3);
  const hasHiddenModules = filteredModules.length > 3;

  return (
    <div className="min-h-screen bg-[#DCE5F2] flex">
      {/* Sidebar */}
      <div className={`${sidebarVisible ? 'w-96' : 'w-0'} transition-all duration-300 bg-[#E6EDF8] border-r border-[#B7C6DE] overflow-hidden`}>
        <div className="p-6 h-full overflow-y-auto">
          {/* Course Header */}
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-[#102347] mb-2">{course.title}</h1>
            <p className="text-sm text-[#5D6B82]">{course.category || "Course"}</p>
          </div>

          {/* Overall Progress */}
          <div className="mb-6 p-4 bg-[#D8E3F4] rounded-lg border border-[#B7C6DE]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#102347]">Overall Progress</span>
              <span className="text-sm text-[#5D6B82]">{overallProgress.completed}/{overallProgress.total} Modules</span>
            </div>
            <div className="w-full bg-[#E6ECF5] rounded-full h-2">
              <div 
                className="bg-[#1F4E8C] h-2 rounded-full transition-all duration-300"
                style={{ width: `${overallProgress.percent}%` }}
              />
            </div>
          </div>

          {/* Modules - Accordion Style */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold tracking-wide text-[#445C7A] uppercase">Modules:</span>
              <select
                value={effectiveSelectedModuleId ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedModuleFilterId(value === "all" ? "all" : Number(value));
                  setShowAllModules(false);
                }}
                className="rounded-md border border-[#9FB3D3] bg-[#E6EDF8] px-2 py-1 text-xs font-medium text-[#102347]"
                title="Choose module to view"
              >
                <option value="all">All</option>
                {sortedModules.map((m, idx) => (
                  <option key={m.id} value={m.id}>
                    {`Module ${idx + 1}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-3">
            {visibleModules.map((module, index) => {
              const realIndex = sortedModules.findIndex((m) => m.id === module.id);
              const status = getModuleStatus(module.id);
              const isExpanded = expandedModules.has(module.id);
              const isLocked = !status.isUnlocked;
              
              return (
                <div key={module.id} className="border border-[#B7C6DE] rounded-lg overflow-hidden">
                  {/* Module Header */}
                  <button
                    onClick={() => toggleModule(module.id)}
                    className={`w-full p-4 text-left transition-colors ${
                      isLocked 
                        ? 'bg-[#D0DAEB] cursor-pointer' 
                        : 'bg-[#E6EDF8] hover:bg-[#D8E3F4] cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          {isLocked ? (
                            <Lock className="w-4 h-4 text-[#6C757D]" />
                          ) : status.isCompleted ? (
                            <CheckCircle className="w-4 h-4 text-[#27AE60]" />
                          ) : (
                            <Unlock className="w-4 h-4 text-[#1F4E8C]" />
                          )}
                          <ChevronRight 
                            className={`w-4 h-4 text-[#5D6B82] transition-transform ${
                              isExpanded ? 'rotate-90' : ''
                            }`} 
                          />
                        </div>
                        <div>
                          <h3 className={`font-medium ${
                            isLocked ? 'text-[#6C757D]' : 'text-[#102347]'
                          }`}>
                            Module {realIndex + 1}: {module.title}
                          </h3>
                          <p className="text-sm text-[#5D6B82]">
                            {status.completedLessons}/{status.totalLessons} lessons
                          </p>
                        </div>
                      </div>
                      
                      {/* Progress Indicator */}
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-[#E6ECF5] rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              status.isCompleted ? 'bg-[#27AE60]' : 'bg-[#1F4E8C]'
                            }`}
                            style={{ width: `${status.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Module Content - Accordion */}
                  {isExpanded && (
                    <div className="border-t border-[#B7C6DE] bg-[#D8E3F4]">
                      {isLocked && (
                        <div className="px-4 py-3 text-xs text-[#4C5F7B] border-b border-[#B7C6DE] bg-[#CFD9EA]">
                          This module is locked. Complete earlier modules to unlock lesson access.
                        </div>
                      )}
                      {module.lessons.sort((a, b) => a.order_index - b.order_index).map((lesson) => {
                        const lessonProgress = progress?.modules
                          .find(m => m.id === module.id)
                          ?.lessons.find(l => l.lesson_id === lesson.id);
                        const isLessonCompleted = lessonProgress?.completed || false;
                        
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => selectLesson(module, lesson)}
                            disabled={isLocked}
                            className={`w-full p-3 text-left border-b border-[#B7C6DE] last:border-b-0 transition-colors ${
                              selectedLesson?.id === lesson.id
                                ? 'bg-[#E6ECF5] border-l-4 border-l-[#1F4E8C]'
                                : isLocked
                                  ? 'bg-[#D8E3F4] opacity-75 cursor-not-allowed'
                                  : 'hover:bg-[#E6EDF8]'
                            } ${isLocked ? 'cursor-not-allowed' : ''}`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                {isLessonCompleted ? (
                                  <CheckCircle className="w-4 h-4 text-[#27AE60]" />
                                ) : (
                                  <Play className="w-4 h-4 text-[#5D6B82]" />
                                )}
                                <div>
                                  <p className="text-sm font-medium text-[#102347]">{lesson.title}</p>
                                  <p className="text-xs text-[#5D6B82]">{lesson.content_type || "lesson"}</p>
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {hasHiddenModules && (
              <div className="flex items-center justify-center pt-2">
                <button
                  onClick={() => setShowAllModules((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-md border border-[#9FB3D3] bg-[#D8E3F4] px-3 py-2 text-xs font-medium text-[#102347] hover:bg-[#C9D8EE] transition-colors"
                  aria-label={showAllModules ? "Show fewer modules" : "Show more modules"}
                  title={showAllModules ? "Show fewer modules" : "Show more modules"}
                >
                  <MoreVertical className="h-4 w-4" />
                  <span>{showAllModules ? "Show Less" : "Show More"}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-[#D8E3F4] border-b border-[#B7C6DE] px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarVisible(!sidebarVisible)}
            className="p-2 hover:bg-[#C9D8EE] rounded-lg transition-colors"
          >
            {sidebarVisible ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          {selectedLesson && selectedModule && (
            <div className="text-center">
              <h2 className="text-lg font-semibold text-[#102347]">{selectedLesson.title}</h2>
              <p className="text-sm text-[#5D6B82]">Module {selectedModule.order_index + 1}: {selectedModule.title}</p>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCelebrationSoundEnabled((prev) => !prev)}
              className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                celebrationSoundEnabled
                  ? "border-[#0F3B66] bg-[#D8E3F4] text-[#102347] hover:bg-[#C9D8EE]"
                  : "border-[#9FB3D3] bg-[#E6EDF8] text-[#4C5F7B] hover:bg-[#D8E3F4]"
              }`}
            >
              {celebrationSoundEnabled ? "Celebration Sound On" : "Celebration Sound Off"}
            </button>
            <button
              onClick={() => setPresentationMode((prev) => !prev)}
              className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                presentationMode
                  ? "border-[#0F3B66] bg-[#0F3B66] text-white"
                  : "border-[#9FB3D3] bg-[#E6EDF8] text-[#102347] hover:bg-[#D8E3F4]"
              }`}
            >
              {presentationMode ? "Exit Slide View" : "Slide View"}
            </button>
          </div>
        </div>

        {/* Lesson Content */}
        <div className="flex-1 overflow-y-auto">
          {selectedLesson ? (
            <div className={`${presentationMode ? "max-w-5xl" : "max-w-4xl"} mx-auto p-6`}>
              {/* Lesson Header */}
              <div className={`mb-6 ${presentationMode ? "text-center" : ""}`}>
                <div className="flex items-center space-x-2 mb-4">
                  <span className="px-3 py-1 bg-[#E6ECF5] text-[#102347] text-sm rounded-full">
                    {selectedLesson.content_type || "Lesson"}
                  </span>
                  <span className="text-sm text-[#5D6B82]">
                    Lesson {selectedLesson.order_index + 1}
                  </span>
                </div>
                <h1 className={`${presentationMode ? "text-3xl" : "text-2xl"} font-bold text-[#102347] mb-4`}>
                  {selectedLesson.title}
                </h1>
              </div>

              {/* Content Tabs */}
              {selectedLesson.content && selectedLesson.content.length > 0 && (
                <div className="bg-[#E6EDF8] rounded-lg border border-[#B7C6DE] overflow-hidden">
                  {/* Tab Headers */}
                  <div className="flex border-b border-[#B7C6DE]">
                    {selectedLesson.content?.some(c => c.video_url) && (
                      <button
                        onClick={() => setActiveContentTab("video")}
                        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center ${
                          activeContentTab === "video"
                            ? 'bg-[#C9D8EE] text-[#173C6C] border-b-2 border-[#173C6C]'
                            : 'text-[#4C5F7B] hover:bg-[#D8E3F4]'
                        }`}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Video Lesson
                      </button>
                    )}
                    <button
                      onClick={() => setActiveContentTab("reading")}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center ${
                        activeContentTab === "reading"
                          ? 'bg-[#C9D8EE] text-[#173C6C] border-b-2 border-[#173C6C]'
                          : 'text-[#4C5F7B] hover:bg-[#D8E3F4]'
                      }`}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Reading Material
                    </button>
                    <button
                      onClick={() => setActiveContentTab("exercise")}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center ${
                        activeContentTab === "exercise"
                          ? 'bg-[#C9D8EE] text-[#173C6C] border-b-2 border-[#173C6C]'
                          : 'text-[#4C5F7B] hover:bg-[#D8E3F4]'
                      }`}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Practice Exercise
                    </button>
                  </div>

                  {/* Tab Content */}
                  <div className={`${presentationMode ? "p-8" : "p-6"}`}>
                    {activeContentTab === "video" ? (
                      <div className="space-y-4">
                        {(() => {
                          const selectedVideo = selectedLesson.content?.find((c) => c.video_url);
                          const videoUrl = selectedVideo?.video_url || "";
                          const isDirectVideoFile = /\.(mp4|webm|ogg)(\?.*)?$/i.test(videoUrl);

                          return (
                            <>
                              <div className="bg-black rounded-lg aspect-video flex items-center justify-center overflow-hidden">
                                {videoUrl ? (
                                  isDirectVideoFile ? (
                                    <video
                                      className="w-full h-full rounded-lg"
                                      controls
                                      poster="https://via.placeholder.com/800x450/1F4E8C/FFFFFF?text=Video+Lesson"
                                    >
                                      <source src={videoUrl} type="video/mp4" />
                                      Your browser does not support the video tag.
                                    </video>
                                  ) : (
                                    <iframe
                                      src={videoUrl}
                                      className="w-full h-full border-0"
                                      title={selectedVideo?.title || "Embedded lesson video"}
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                      allowFullScreen
                                    />
                                  )
                                ) : (
                                  <div className="text-white text-center">
                                    <Play className="w-12 h-12 mx-auto mb-2" />
                                    <p>Video content will appear here</p>
                                  </div>
                                )}
                              </div>
                              {!!videoUrl && !isDirectVideoFile && (
                                <a
                                  href={videoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-[#1F4E8C] hover:text-[#173C6C] underline text-sm"
                                >
                                  Open video in new tab
                                </a>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    ) : activeContentTab === "reading" ? (
                      <div className="space-y-4">
                        {selectedLesson.content
                          .filter(c => c.content_type !== "exercise" && c.content_type !== "video")
                          .filter(c => c.body || c.title || c.image_url || c.external_url || c.file_url)
                          .map((content) => (
                            <div key={content.id} className="space-y-3">
                              {content.title && (
                                <h4 className="font-semibold text-[#102347]">{content.title}</h4>
                              )}
                              {content.body && (
                                <div className="space-y-4">
                                  {(() => {
                                    const pages = splitBodyIntoPages(content.body);
                                    const currentPage = Math.min(
                                      readingPageByContentId[content.id] ?? 0,
                                      Math.max(0, pages.length - 1)
                                    );
                                    const page = pages[currentPage];

                                    return (
                                      <div className={`rounded-lg border border-[#B7C6DE] bg-[#DCE5F2] ${presentationMode ? "p-8 min-h-[62vh]" : "p-4"}`}>
                                        {pages.length > 1 && (
                                          <div className="mb-3 flex items-center justify-between">
                                            <h5 className="text-sm font-semibold text-[#102347]">
                                              {page.title}
                                            </h5>
                                            <span className="text-xs text-[#5D6B82]">
                                              Page {currentPage + 1} of {pages.length}
                                            </span>
                                          </div>
                                        )}
                                        <div className={presentationMode ? "text-lg leading-8" : ""}>{renderRichText(page.body)}</div>
                                        {pages.length > 1 && (
                                          <div className="mt-4 flex items-center justify-between">
                                            <button
                                              onClick={() =>
                                                setReadingPageByContentId((prev) => ({
                                                  ...prev,
                                                  [content.id]: Math.max(0, currentPage - 1),
                                                }))
                                              }
                                              disabled={currentPage === 0}
                                              className="px-3 py-1.5 text-xs rounded-md border border-[#9FB3D3] text-[#102347] bg-[#E6EDF8] disabled:opacity-40 disabled:cursor-not-allowed"
                                            >
                                              Previous
                                            </button>
                                            <button
                                              onClick={() =>
                                                setReadingPageByContentId((prev) => ({
                                                  ...prev,
                                                  [content.id]: Math.min(pages.length - 1, currentPage + 1),
                                                }))
                                              }
                                              disabled={currentPage >= pages.length - 1}
                                              className="px-3 py-1.5 text-xs rounded-md bg-[#0F3B66] text-white disabled:opacity-40 disabled:cursor-not-allowed"
                                            >
                                              Next
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })()}
                                </div>
                              )}
                              {content.image_url && (
                                <div className="mt-3">
                                  <img 
                                    src={content.image_url} 
                                    alt={content.title || "Lesson image"}
                                    className="rounded-lg max-w-full h-auto"
                                  />
                                </div>
                              )}
                              {content.external_url && (
                                <a 
                                  href={content.external_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-[#1F4E8C] hover:text-[#173C6C] underline"
                                >
                                  <BookOpen className="w-4 h-4 mr-1" />
                                  Open External Resource
                                </a>
                              )}
                              {content.file_url && (
                                <a 
                                  href={content.file_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-[#1F4E8C] hover:text-[#173C6C] underline"
                                >
                                  <FileText className="w-4 h-4 mr-1" />
                                  Download File
                                </a>
                              )}
                            </div>
                          ))}
                        {selectedLesson.content
                          .filter(c => c.content_type !== "exercise" && c.content_type !== "video")
                          .filter(c => c.body || c.title || c.image_url || c.external_url || c.file_url)
                          .length === 0 && (
                          <div className="text-center py-8 text-[#5D6B82]">
                            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>Reading material will be added shortly for this lesson.</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {selectedLesson.content
                          .filter(c => c.content_type === "exercise")
                          .map((content) => (
                            <div key={content.id} className="space-y-3">
                              {content.title && (
                                <h4 className="font-semibold text-[#102347]">{content.title}</h4>
                              )}
                              {content.body && (
                                <div>{renderRichText(content.body)}</div>
                              )}
                            </div>
                          ))}
                        {selectedLesson.content?.filter(c => c.content_type === "exercise").length === 0 && (
                          <div className="bg-[#DCE5F2] border border-[#B7C6DE] rounded-lg p-4">
                            <h4 className="font-semibold text-[#102347] mb-3">Practice Exercise</h4>
                            {renderRichText(buildExerciseFallback(selectedLesson.title, selectedModule?.title))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Mark Complete Button */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={markLessonComplete}
                  className="px-6 py-3 bg-[#0F3B66] text-white rounded-lg hover:bg-[#0A2C4C] transition-colors flex items-center space-x-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Mark Lesson Complete</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="bg-[#E6EDF8] rounded-lg border border-[#B7C6DE] p-8 max-w-md">
                  <Play className="w-12 h-12 text-[#5D6B82] mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-[#102347] mb-2">Select a Lesson</h3>
                  <p className="text-[#5D6B82]">Choose a lesson from the curriculum to start learning</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {celebration && (
        <div className="pointer-events-none fixed inset-0 z-[120] overflow-hidden">
          <div className="absolute inset-0">
            {celebration.particles.map((p) => (
              <span
                key={p.id}
                className="absolute top-[-8vh] select-none"
                style={{
                  left: `${p.left}%`,
                  fontSize: `${p.size}px`,
                  transform: `rotate(${p.rotation}deg)`,
                  animation: `flowerFall ${p.duration}s linear ${p.delay}s forwards`,
                }}
              >
                {celebration.type === "module" ? "🌸" : "🌼"}
              </span>
            ))}
          </div>
          <div
            className="absolute left-1/2 top-10 -translate-x-1/2 rounded-xl border border-[#9FB3D3] bg-[#E6EDF8]/95 px-6 py-3 text-sm font-semibold text-[#102347]"
            style={{ animation: "celebrationPop 1.6s ease-out forwards" }}
          >
            {celebration.message}
          </div>
          <style>
            {`
              @keyframes flowerFall {
                0% { transform: translate3d(0, -10vh, 0) rotate(0deg); opacity: 0; }
                10% { opacity: 1; }
                100% { transform: translate3d(0, 115vh, 0) rotate(260deg); opacity: 0.2; }
              }
              @keyframes celebrationPop {
                0% { opacity: 0; transform: translate(-50%, -8px) scale(0.92); }
                12% { opacity: 1; transform: translate(-50%, 0px) scale(1); }
                85% { opacity: 1; transform: translate(-50%, 0px) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -4px) scale(0.98); }
              }
            `}
          </style>
        </div>
      )}
    </div>
  );
}

