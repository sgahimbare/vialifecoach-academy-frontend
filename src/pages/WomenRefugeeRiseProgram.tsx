import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Play,
  ChevronRight,
  MessageCircle,
  Layers,
  ClipboardCheck,
  BookOpen,
  Heart,
  Lightbulb,
  Monitor,
  Users,
  Award,
  ArrowRight
} from "lucide-react";
import { ProgressTracker } from "@/components/program/ProgressTracker";
import { SuccessStories } from "@/components/program/SuccessStories";
import { ProgramFAQ } from "@/components/program/ProgramFAQ";

type TrackId = "mental-health" | "entrepreneurship" | "virtual-assistant";
type ResourceTab = "resource" | "module" | "materials";
type TutorialTab = "overview" | "topics" | "outcomes";
type TaskTab = "pillars" | "benefits" | "actions";

interface ProgramPillar {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  duration: string;
  status: "locked" | "available" | "completed";
  modules: number;
  keyTopics: string[];
}

interface UserProgress {
  currentPillar: number;
  completedPillars: string[];
  enrolledDate: string;
  estimatedCompletion: string;
}

interface InfoCard {
  tag: string;
  title: string;
  description: string;
}

interface TaskItem {
  title: string;
  body: string;
}

const programTitle = "Women Refugee Rise Program";
const programTagline = "From Healing to thriving: Your journey of empowerment in three transformative steps";
const programStats = {
  womenTransformed: 500,
  pillars: 3,
  communitySize: 1
};

const heroHighlights = [
  { title: "Mental Health", subtitle: "Foundation & Wellness", accent: "bg-green-400" },
  { title: "Entrepreneurship", subtitle: "Business & Skills", accent: "bg-orange-400" },
  { title: "Virtual Assistant", subtitle: "Career & Growth", accent: "bg-purple-400" },
  { title: "3-9", subtitle: "Months", caption: "Complete Journey", accent: "bg-white/30", isDuration: true }
];

const basePillars: Omit<ProgramPillar, "status">[] = [
  {
    id: "mental-health",
    title: "Mental Health Coaching",
    description: "Build emotional resilience and mental wellness as your foundation for growth",
    icon: <Heart className="h-8 w-8" />,
    color: "#4A90E2",
    duration: "1-3 months",
    modules: 6,
    keyTopics: ["Trauma Healing", "Emotional Resilience", "Stress Management", "Self-Care", "Support Networks", "Wellness Habits"]
  },
  {
    id: "entrepreneurship",
    title: "Entrepreneurship Skills",
    description: "Transform your ideas into sustainable businesses with practical skills",
    icon: <Lightbulb className="h-8 w-8" />,
    color: "#F5A623",
    duration: "1-3 months",
    modules: 8,
    keyTopics: ["Business Planning", "Marketing", "Finance", "Operations", "Leadership", "Networking", "Digital Skills", "Growth Strategy"]
  },
  {
    id: "virtual-assistant",
    title: "Virtual Assistant Program",
    description: "Launch your career with in-demand virtual assistant and office skills",
    icon: <Monitor className="h-8 w-8" />,
    color: "#9013FE",
    duration: "1-3 months",
    modules: 7,
    keyTopics: ["Office Software", "Communication", "Time Management", "Project Management", "Client Relations", "Remote Work", "Job Placement"]
  }
];

const benefits: TaskItem[] = [
  {
    title: "Emotional Wellness",
    body: "Build resilience and mental strength for life's challenges"
  },
  {
    title: "Business Success",
    body: "Create sustainable income through entrepreneurship"
  },
  {
    title: "Career Growth",
    body: "Develop in-demand skills for the modern workplace"
  }
];

const tutorialTabs: { id: TutorialTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "topics", label: "Key Topics" },
  { id: "outcomes", label: "Outcomes" }
];

const taskTabs: { id: TaskTab; label: string }[] = [
  { id: "pillars", label: "Pillars" },
  { id: "benefits", label: "Benefits" },
  { id: "actions", label: "Actions" }
];

export default function WomenRefugeeRiseProgram() {
  const navigate = useNavigate();
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTrack, setActiveTrack] = useState<TrackId>("mental-health");
  const [activeModule, setActiveModule] = useState<number>(1);
  const [activeResourceTab, setActiveResourceTab] = useState<ResourceTab>("resource");
  const [activeTutorialTab, setActiveTutorialTab] = useState<TutorialTab>("overview");
  const [activeTaskTab, setActiveTaskTab] = useState<TaskTab>("pillars");

  useEffect(() => {
    setTimeout(() => {
      setUserProgress({
        currentPillar: 0,
        completedPillars: [],
        enrolledDate: new Date().toISOString(),
        estimatedCompletion: "3-9 months"
      });
      setLoading(false);
    }, 1000);
  }, []);

  const pillars = useMemo(() => {
    return basePillars.map((pillar, index) => {
      const isCompleted = userProgress?.completedPillars.includes(pillar.id) ?? false;
      const isUnlocked =
        index === 0 || (userProgress?.completedPillars.includes(basePillars[index - 1]?.id) ?? false);
      const status: ProgramPillar["status"] = isCompleted ? "completed" : isUnlocked ? "available" : "locked";
      return { ...pillar, status };
    });
  }, [userProgress]);

  const trackTabs = useMemo(
    () => pillars.map((pillar) => ({ id: pillar.id as TrackId, label: pillar.title })),
    [pillars]
  );

  const activePillar = useMemo(
    () => pillars.find((pillar) => pillar.id === activeTrack) ?? pillars[0],
    [pillars, activeTrack]
  );

  useEffect(() => {
    setActiveModule(1);
  }, [activeTrack]);

  const moduleNumbers = useMemo(() => {
    const count = activePillar?.modules ?? 0;
    return Array.from({ length: count }, (_, index) => index + 1);
  }, [activePillar]);

  const resourceSets = useMemo(() => {
    if (!activePillar) {
      return { resource: [] as InfoCard[], module: [] as InfoCard[], materials: [] as InfoCard[] };
    }

    return {
      resource: [
        { tag: "Pillar", title: activePillar.title, description: activePillar.description },
        { tag: "Duration", title: activePillar.duration, description: `${activePillar.modules} modules` },
        {
          tag: "Status",
          title:
            activePillar.status === "completed"
              ? "Completed"
              : activePillar.status === "available"
              ? "Available"
              : "Locked",
          description: ""
        }
      ],
      module: activePillar.keyTopics.map((topic, index) => ({
        tag: `Topic ${index + 1}`,
        title: topic,
        description: ""
      })),
      materials: benefits.map((benefit, index) => ({
        tag: `Outcome ${index + 1}`,
        title: benefit.title,
        description: benefit.body
      }))
    };
  }, [activePillar]);

  const resources = resourceSets[activeResourceTab];

  const tutorialGuide = useMemo(() => {
    if (!activePillar) return [];
    if (activeTutorialTab === "overview") {
      return [
        activePillar.title,
        activePillar.description,
        `Duration: ${activePillar.duration}`,
        `Modules: ${activePillar.modules}`
      ];
    }
    if (activeTutorialTab === "topics") {
      return activePillar.keyTopics;
    }
    return benefits.map((benefit) => `${benefit.title}: ${benefit.body}`);
  }, [activePillar, activeTutorialTab]);

  const taskSets = useMemo(() => {
    return {
      pillars: pillars.map((pillar) => ({ title: pillar.title, body: pillar.description })),
      benefits,
      actions: [
        { title: "Begin Your Journey", body: programTagline },
        { title: "Apply for Scholarship", body: programTitle }
      ]
    };
  }, [pillars]);

  const tasks = taskSets[activeTaskTab];

  const handleEnrollInProgram = () => {
    navigate("/program/mental-health");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                <Users className="h-4 w-4 text-blue-500" />
                {programStats.communitySize} Active Community
              </div>
              <h1 className="mt-4 text-3xl font-bold text-slate-900">{programTitle}</h1>
              <p className="mt-2 text-sm text-slate-600">{programTagline}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={handleEnrollInProgram}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                >
                  Begin Your Journey
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                  Watch Overview
                  <Play className="h-4 w-4" />
                </button>
                <button
                  onClick={() => navigate("/program/application")}
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-600 bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                >
                  Apply for Scholarship
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <div className="text-2xl font-bold text-slate-900">{programStats.womenTransformed}+</div>
                  <div className="text-xs text-slate-500">Women Transformed</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <div className="text-2xl font-bold text-slate-900">{programStats.pillars}</div>
                  <div className="text-xs text-slate-500">Pillars</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <div className="text-2xl font-bold text-slate-900">{programStats.pillars * 3}</div>
                  <div className="text-xs text-slate-500">Months Support</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {heroHighlights.map((highlight) => (
                <div
                  key={highlight.title}
                  className={`rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm ${
                    highlight.isDuration ? "flex items-center justify-center" : ""
                  }`}
                >
                  {highlight.isDuration ? (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-900">{highlight.title}</div>
                      <div className="text-sm font-semibold text-slate-700">{highlight.subtitle}</div>
                      <div className="text-xs text-slate-500">{highlight.caption}</div>
                    </div>
                  ) : (
                    <div>
                      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${highlight.accent}`}>
                        <div className="h-4 w-4 rounded-full bg-white" />
                      </div>
                      <h3 className="text-sm font-semibold text-slate-900">{highlight.title}</h3>
                      <p className="text-xs text-slate-500">{highlight.subtitle}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-6">
        {userProgress && (
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-sm">
            <ProgressTracker
              currentPillar={userProgress.currentPillar}
              completedPillars={userProgress.completedPillars}
              pillars={pillars}
            />
          </section>
        )}

        <section className="mt-6">
          <div className="text-center mb-4">
            <h2 className="text-3xl font-bold text-slate-900">Your Three-Step Journey to Empowerment</h2>
            <p className="mt-2 text-sm text-slate-600">
              Each pillar builds upon the previous one, creating a comprehensive foundation for your success
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white/70 p-2 shadow-sm">
            {trackTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTrack(tab.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeTrack === tab.id
                    ? "bg-slate-900 text-white shadow"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
            <div className="ml-auto hidden items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 md:flex">
              <BookOpen className="h-4 w-4 text-blue-500" />
              Three-Step Journey
            </div>
          </div>
        </section>

        <section className="mt-4 flex flex-wrap gap-2">
          {moduleNumbers.map((number) => (
            <button
              key={number}
              onClick={() => setActiveModule(number)}
              className={`h-9 w-12 rounded-md text-sm font-semibold transition ${
                activeModule === number
                  ? "bg-slate-900 text-white ring-2 ring-blue-200"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              {number}
            </button>
          ))}
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white/90 shadow-sm">
          <div className="grid lg:grid-cols-[1fr_1.4fr_1fr] divide-y divide-slate-200 lg:divide-y-0 lg:divide-x">
            <div className="px-4 py-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex gap-2">
                  {(["resource", "module", "materials"] as ResourceTab[]).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveResourceTab(tab)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                        activeResourceTab === tab
                          ? "bg-blue-600 text-white"
                          : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                      }`}
                    >
                      {tab === "resource" ? "Pillar" : tab === "module" ? "Key Topics" : "Outcomes"}
                    </button>
                  ))}
                </div>
                <Layers className="h-4 w-4 text-blue-600" />
              </div>

              <div className="space-y-4 pt-4">
                {resources.map((item) => (
                  <div key={`${item.tag}-${item.title}`} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase text-blue-700">{item.tag}</p>
                    <h3 className="mt-2 text-sm font-bold text-slate-900">{item.title}</h3>
                    <p className="mt-2 text-xs text-slate-600">{item.description}</p>
                  </div>
                ))}
                <button className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100">
                  View All Materials
                </button>
              </div>
            </div>

            <div className="px-4 py-4">
              <div className="flex flex-col gap-3 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <Play className="h-4 w-4 text-blue-600" />
                  Tutorials
                </div>
                <div className="flex flex-wrap gap-2">
                  {tutorialTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTutorialTab(tab.id)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                        activeTutorialTab === tab.id
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <div className="relative h-64 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-200 via-white to-blue-100">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="flex h-14 w-14 items-center justify-center rounded-full bg-white/80 shadow-lg">
                      <Play className="h-6 w-6 text-blue-600" />
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <h4 className="text-sm font-semibold text-slate-900">Session Focus</h4>
                  <ul className="mt-3 space-y-2 text-xs text-slate-600">
                    {tutorialGuide.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="px-4 py-4">
              <div className="flex flex-col gap-3 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <ClipboardCheck className="h-4 w-4 text-blue-600" />
                  Tasks
                </div>
                <div className="flex flex-wrap gap-2">
                  {taskTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTaskTab(tab.id)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                        activeTaskTab === tab.id
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4">
                {tasks.map((task) => (
                  <div key={task.title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <h4 className="text-sm font-semibold text-slate-900">{task.title}</h4>
                    <p className="mt-2 text-xs text-slate-600">{task.body}</p>
                  </div>
                ))}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <button
                    onClick={handleEnrollInProgram}
                    className="w-full rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                  >
                    Begin Your Journey
                  </button>
                  <button
                    onClick={() => navigate("/program/application")}
                    className="w-full rounded-lg border border-emerald-600 bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
                  >
                    Apply for Scholarship
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">What You'll Achieve</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Emotional Wellness</h4>
              <p className="text-slate-600">Build resilience and mental strength for life's challenges</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Business Success</h4>
              <p className="text-slate-600">Create sustainable income through entrepreneurship</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Career Growth</h4>
              <p className="text-slate-600">Develop in-demand skills for the modern workplace</p>
            </div>
          </div>
        </section>

        <div className="mt-10">
          <SuccessStories />
        </div>

        <div className="mt-10">
          <ProgramFAQ />
        </div>

        <section className="mt-6 flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex-row">
          <p className="text-xs text-slate-600">
            Need real-time support? Connect with peers and facilitators for instant guidance.
          </p>
          <a
            href="https://chat.whatsapp.com/GTAUpzWN1h43AaPFlJGFpp?mode=gi_t"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            <MessageCircle className="h-4 w-4" />
            Live chat whatsapp
          </a>
        </section>
      </main>
    </div>
  );
}
