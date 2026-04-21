import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { courseService } from "@/services/courseService";
import { courseProgressService, type CourseProgress } from "@/services/courseProgressService";

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
  description?: string;
  short_description?: string;
  long_description?: string;
  category?: string;
  duration_weeks?: number;
  delivery_mode?: string;
  has_certificate?: boolean;
  modules: ModuleItem[];
};

function cleanCourseTitle(title: string) {
  return title.replace(/^L\d-[A-Z0-9-]+:\s*/i, "").trim();
}

export default function StudentCourseOverviewPage() {
  const { id } = useParams();
  const [progress, setProgress] = useState<CourseProgress | null>(null);

  // Static course data with rich content structure
  const overview: CourseOverview = {
    id: Number(id),
    title: "Overcoming Negative Thinking: Rewiring Your Brain for Positivity",
    description: "Negative thinking is not destiny. It is a learned mental program that can be unlearned through neuroplasticity, awareness, and disciplined cognitive practice. This course teaches learners to identify destructive thought patterns, challenge distortions, and build emotional clarity, optimism, and resilience.",
    long_description: "This comprehensive course combines cutting-edge neuroscience with practical coaching techniques to help you rewire your brain for positivity. You'll learn to identify negative thought patterns, understand the biological mechanisms behind them, and develop effective strategies for lasting change.",
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

  useEffect(() => {
    let isMounted = true;
    async function loadProgress() {
      if (!id) return;
      try {
        const progressData = await courseProgressService.getCourseProgress(Number(id));
        if (isMounted) setProgress(progressData);
      } catch {
        if (isMounted) setProgress(null);
      }
    }
    void loadProgress();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const modules = [...(overview.modules || [])].sort((a, b) => a.order_index - b.order_index);
  const totalLessons = modules.reduce((sum, m) => sum + (m.lessons?.length || 0), 0);
  const aboutText =
    overview.long_description?.trim() ||
    overview.description?.trim() ||
    overview.short_description?.trim() ||
    "Course overview will be available soon.";
  const aboutParagraphs = aboutText.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const completedLessons = progress?.overall_progress?.completed_lessons || 0;
  const percent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#EEF4FF] via-[#F7FAFF] to-[#F5F7FB]">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <section className="rounded-3xl border border-[#D8E4FB] bg-white p-7 shadow-[0_12px_40px_rgba(31,78,140,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#1F4E8C]">Course Overview</p>
          <h1 className="mt-2 text-3xl font-semibold text-[#102347]">{cleanCourseTitle(overview.title)}</h1>
          <p className="mt-2 text-sm text-[#5D6B82]">{overview.category || "Course"}</p>

          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-[#E6ECF5] px-3 py-1 font-medium text-[#102347]">
              {overview.duration_weeks ? `${overview.duration_weeks} weeks` : "Self-paced"}
            </span>
            <span className="rounded-full bg-[#E6ECF5] px-3 py-1 font-medium text-[#102347]">
              {overview.delivery_mode || "self-paced"}
            </span>
            <span className="rounded-full bg-[#E6ECF5] px-3 py-1 font-medium text-[#102347]">
              {overview.has_certificate ? "Certificate available" : "No certificate"}
            </span>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-[#E6ECF5] bg-[#FAFBFE] p-4">
              <p className="text-xs uppercase tracking-wide text-[#5D6B82]">Modules</p>
              <p className="mt-1 text-2xl font-semibold text-[#102347]">{modules.length}</p>
            </div>
            <div className="rounded-xl border border-[#E6ECF5] bg-[#FAFBFE] p-4">
              <p className="text-xs uppercase tracking-wide text-[#5D6B82]">Lessons</p>
              <p className="mt-1 text-2xl font-semibold text-[#102347]">{totalLessons}</p>
            </div>
            <div className="rounded-xl border border-[#E6ECF5] bg-[#FAFBFE] p-4">
              <p className="text-xs uppercase tracking-wide text-[#5D6B82]">Progress</p>
              <p className="mt-1 text-2xl font-semibold text-[#102347]">{percent}%</p>
            </div>
          </div>

          <div className="mt-5 h-2 w-full rounded-full bg-[#E6ECF5]">
            <div className="h-2 rounded-full bg-[#1F4E8C]" style={{ width: `${percent}%` }} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="inline-flex rounded-lg bg-[#1F4E8C] px-4 py-2 text-sm font-medium text-white hover:bg-[#173C6C]" to={`/courses/${id}/modules`}>
              View Modules
            </Link>
            <Link className="inline-flex rounded-lg border border-[#1F4E8C] px-4 py-2 text-sm font-medium text-[#1F4E8C] hover:bg-[#ECF3FF]" to={`/courses/${id}/player`}>
              Open Course Player
            </Link>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-[#E6ECF5] bg-white p-8">
          <h2 className="mb-6 text-2xl font-bold text-[#102347]">About the Program</h2>
          {aboutParagraphs.map((paragraph, idx) => (
            <p key={idx} className="mb-4 text-base leading-7 text-[#3F4F66]">
              {paragraph}
            </p>
          ))}
        </section>

        <section className="mt-6 rounded-2xl border border-[#E6ECF5] bg-white p-6">
          <h3 className="text-lg font-semibold text-[#102347]">Curriculum Snapshot</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {modules.slice(0, 6).map((module, index) => (
              <div key={module.id} className="rounded-xl border border-[#E6ECF5] bg-[#FAFBFE] p-4">
                <p className="text-sm font-semibold text-[#102347]">Module {index + 1}: {module.title}</p>
                <p className="mt-1 text-xs text-[#5D6B82]">{module.lessons?.length || 0} lessons</p>
              </div>
            ))}
            {modules.length === 0 ? (
              <div className="rounded-xl border border-[#E6ECF5] bg-[#FAFBFE] p-4 text-sm text-[#5D6B82]">
                No modules available yet.
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
