import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, ChevronRight, MessageCircle, Layers, ClipboardCheck, BookOpen } from "lucide-react";

type TrackId = "fundamentals" | "projects" | "community";
type ResourceTab = "resource" | "module" | "materials";
type TutorialTab = "healing" | "methodology" | "digital" | "results";
type TaskTab = "methods" | "results" | "submission";

const trackTabs: { id: TrackId; label: string }[] = [
  { id: "fundamentals", label: "Fundamental Classes" },
  { id: "projects", label: "Project Classes" },
  { id: "community", label: "Community" }
];

const tutorialTabs: { id: TutorialTab; label: string }[] = [
  { id: "healing", label: "Healing Foundation" },
  { id: "methodology", label: "Care Methodology" },
  { id: "digital", label: "Digital Support" },
  { id: "results", label: "Result" }
];

const taskTabs: { id: TaskTab; label: string }[] = [
  { id: "methods", label: "Materials & Methods" },
  { id: "results", label: "Results" },
  { id: "submission", label: "Submission" }
];

const moduleNumbers = Array.from({ length: 10 }, (_, index) => index + 1);

const resourcesByTrack: Record<TrackId, { title: string; description: string; tag: string }[]> = {
  fundamentals: [
    {
      tag: "Subject 1",
      title: "Trauma-Informed Foundations",
      description: "Core principles of survivor-centered care, dignity, and psychological safety."
    },
    {
      tag: "Module 1",
      title: "Understanding GBV and Power Dynamics",
      description: "Learn the forms of GBV, risk factors, and culturally sensitive response strategies."
    }
  ],
  projects: [
    {
      tag: "Project 1",
      title: "Community Safety Mapping",
      description: "Design a local safety map that identifies risk zones and support partners."
    },
    {
      tag: "Module 2",
      title: "Case Management Workflow",
      description: "Build a clear referral pathway with confidentiality and data protection."
    }
  ],
  community: [
    {
      tag: "Circle 1",
      title: "Peer Support Facilitation",
      description: "Practice group facilitation skills and trauma-sensitive communication."
    },
    {
      tag: "Module 3",
      title: "Community Healing Dialogues",
      description: "Plan dialogues that promote healing, accountability, and reintegration."
    }
  ]
};

const tasksByTrack: Record<TrackId, { title: string; body: string }[]> = {
  fundamentals: [
    {
      title: "Safety Planning Checklist",
      body: "Create a personalized safety plan template that can be adapted for different contexts."
    },
    {
      title: "Reflective Practice Log",
      body: "Document three survivor-centered practices you will commit to using in your work."
    }
  ],
  projects: [
    {
      title: "Service Mapping Report",
      body: "Compile a directory of local services, including response times and referral notes."
    },
    {
      title: "Program Impact Outline",
      body: "Draft a one-page impact outline for your GBV healing initiative."
    }
  ],
  community: [
    {
      title: "Community Outreach Plan",
      body: "Design a communication plan that reaches survivors, allies, and trusted leaders."
    },
    {
      title: "Healing Circle Agenda",
      body: "Create a 60-minute session agenda with grounding, sharing, and closure."
    }
  ]
};

const tutorialGuides: Record<TutorialTab, string[]> = {
  healing: [
    "Understand trauma responses and survivor autonomy.",
    "Use grounding techniques that restore emotional safety.",
    "Apply survivor-centered language consistently."
  ],
  methodology: [
    "Document case notes with confidentiality in mind.",
    "Use consent-led intake procedures and referrals.",
    "Identify red flags that require urgent intervention."
  ],
  digital: [
    "Explore safe digital reporting channels.",
    "Maintain secure data handling practices.",
    "Use tech tools for follow-up and reminders."
  ],
  results: [
    "Track healing progress with qualitative markers.",
    "Summarize outcomes and lessons learned.",
    "Prepare your impact story for stakeholders."
  ]
};

export default function GvbHealingProgram() {
  const navigate = useNavigate();
  const [activeTrack, setActiveTrack] = useState<TrackId>("fundamentals");
  const [activeModule, setActiveModule] = useState<number>(1);
  const [activeResourceTab, setActiveResourceTab] = useState<ResourceTab>("resource");
  const [activeTutorialTab, setActiveTutorialTab] = useState<TutorialTab>("healing");
  const [activeTaskTab, setActiveTaskTab] = useState<TaskTab>("methods");

  const resources = useMemo(() => resourcesByTrack[activeTrack], [activeTrack]);
  const tasks = useMemo(() => tasksByTrack[activeTrack], [activeTrack]);
  const guide = useMemo(() => tutorialGuides[activeTutorialTab], [activeTutorialTab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">GVB Healing Program</p>
            <h1 className="text-2xl font-bold text-slate-900">Healing, Safety, and Survivor Empowerment</h1>
            <p className="mt-1 text-sm text-slate-500">
              A structured learning portal for trauma-informed practice, community support, and tech-enabled healing.
            </p>
          </div>
          <button
            onClick={() => navigate("/application-portal")}
            className="hidden items-center gap-2 rounded-full border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 md:flex"
          >
            Apply to Program
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-6">
        <section className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white/70 p-2 shadow-sm">
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
            <BookOpen className="h-4 w-4 text-emerald-500" />
            Healing Track
          </div>
        </section>

        <section className="mt-4 flex flex-wrap gap-2">
          {moduleNumbers.map((number) => (
            <button
              key={number}
              onClick={() => setActiveModule(number)}
              className={`h-9 w-12 rounded-md text-sm font-semibold transition ${
                activeModule === number
                  ? "bg-slate-900 text-white ring-2 ring-emerald-200"
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
                          ? "bg-emerald-600 text-white"
                          : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      }`}
                    >
                      {tab === "resource" ? "Resource" : tab === "module" ? "Module" : "Materials"}
                    </button>
                  ))}
                </div>
                <Layers className="h-4 w-4 text-emerald-600" />
              </div>

              <div className="space-y-4 pt-4">
                {resources.map((item) => (
                  <div key={item.title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase text-emerald-700">{item.tag}</p>
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
                  <Play className="h-4 w-4 text-emerald-600" />
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
                <div className="relative h-64 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-200 via-white to-emerald-100">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="flex h-14 w-14 items-center justify-center rounded-full bg-white/80 shadow-lg">
                      <Play className="h-6 w-6 text-emerald-600" />
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <h4 className="text-sm font-semibold text-slate-900">Session Focus</h4>
                  <ul className="mt-3 space-y-2 text-xs text-slate-600">
                    {guide.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
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
                  <ClipboardCheck className="h-4 w-4 text-emerald-600" />
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
                <button className="w-full rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800">
                  Submit Work
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex-row">
          <p className="text-xs text-slate-600">
            Need real-time support? Connect with peers and facilitators for instant guidance.
          </p>
          <a href="https://chat.whatsapp.com/GTAUpzWN1h43AaPFlJGFpp?mode=gi_t" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700">
            <MessageCircle className="h-4 w-4" />
            Live chat whatsapp
          </a>
        </section>
      </main>
    </div>
  );
}



