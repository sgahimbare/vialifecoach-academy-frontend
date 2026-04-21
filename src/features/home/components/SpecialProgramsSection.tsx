import { useEffect, useState } from "react";
import { Heart, Shield, Sparkles, Users, Target, Lightbulb, Globe, Brain, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";

type ProgramMeta = {
  applicationStatus?: string;
  status?: string;
  openDate?: string | null;
  deadline?: string | null;
  name?: string;
  description?: string;
};

const programs = [
  {
    title: "Women Refugee Rise Program",
    description:
      "A focused growth pathway supporting women refugees with emotional resilience, life coaching, and practical empowerment tools.",
    icon: Globe,
    color: "refugee" as const,
    features: ["Emotional Resilience", "Life Coaching", "Empowerment Tools"],
    badge: "International Focus",
    route: "/program/women-refugee-rise",
    programCode: "wrrp"
  },
  {
    title: "GVB Healing Program", 
    description:
      "A trauma-aware program blending healing support with technology-enabled learning for survivors and support facilitators.",
    icon: Heart,
    color: "gbv" as const,
    features: ["Healing Support", "Tech-Enabled Learning", "Trauma-Aware Care"],
    badge: "Survivor-Centered",
    route: "/program/gvb-healing",
    programCode: "gbv"
  },
  {
    title: "Inner Leadership Program",
    description:
      "A personal leadership track designed to build confidence, purpose clarity, decision-making, and sustainable self-mastery.",
    icon: Crown,
    color: "leadership" as const,
    features: ["Confidence Building", "Purpose Clarity", "Self-Mastery"],
    badge: "Personal Growth",
    route: "/coming-soon",
    programCode: "ilp"
  },
];

const normalizeKey = (value: unknown) => String(value ?? "").trim().toLowerCase();

const normalizeStatus = (value?: string | null) => {
  if (!value) return "coming_soon";
  const raw = String(value).trim().toLowerCase();
  if (["open", "opened", "active"].includes(raw)) return "open";
  if (["closed", "close", "inactive", "ended", "end"].includes(raw)) return "closed";
  if (["coming_soon", "coming-soon", "soon", "draft", "archived"].includes(raw)) return "coming_soon";
  return raw;
};

const getStatusMessage = (status: string) => {
  if (status === "open") return "Applications open";
  if (status === "closed") return "Applications closed";
  return "Coming soon - Applications will open shortly";
};

export function SpecialProgramsSection() {
  const navigate = useNavigate();
  const [programMeta, setProgramMeta] = useState<Record<string, ProgramMeta>>({});

  useEffect(() => {
    let isMounted = true;

    const loadPrograms = async () => {
      try {
        const res = await fetch("/api/v1/programs", { cache: "no-store" });
        if (!res.ok) {
          throw new Error(`Failed to fetch programs (${res.status})`);
        }
        const data = await res.json();
        const rows = Array.isArray(data?.data) ? data.data : [];
        if (!isMounted) return;

        const nextMeta: Record<string, ProgramMeta> = {};
        rows.forEach((row: any) => {
          const meta: ProgramMeta = {
            applicationStatus: row.applicationStatus,
            status: row.status,
            openDate: row.openDate ?? row.open_date ?? null,
            deadline: row.deadline ?? null,
            name: row.name,
            description: row.description
          };

          const keys = [row?.code, row?.id, row?.name]
            .map(normalizeKey)
            .filter(Boolean);

          keys.forEach((key) => {
            nextMeta[key] = meta;
          });
        });

        setProgramMeta(nextMeta);
      } catch (error) {
        console.error("Failed to load programs:", error);
      }
    };

    loadPrograms();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-700">Special Programs</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">Healing starts with awareness</h2>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-7 text-slate-700">
            These are scholarship-based programs and are highly competitive and designed for committed participants
            ready to lead healing, empowerment, and transformational growth in their communities.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => {
            const Icon = program.icon;
            const meta =
              programMeta[normalizeKey(program.programCode)] ||
              programMeta[normalizeKey(program.title)];
            const status = normalizeStatus(meta?.applicationStatus ?? meta?.status);
            const statusMessage = getStatusMessage(status);
            const isWrrp = program.programCode === "wrrp";
            const forcePreview = program.programCode === "gbv";
            const canNavigate =
              (status === "open" && program.route !== "/coming-soon") || forcePreview;
            const title = meta?.name || program.title;
            const description = meta?.description || program.description;
            const actionLabel = isWrrp
              ? "Start Program"
              : status === "open"
              ? "Open Program"
              : "Preview Program";
            
            return (
              <article 
                key={program.title} 
                className={`group relative overflow-hidden rounded-3xl shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
                  program.color === "refugee" ? "bg-gradient-to-br from-teal-50 to-cyan-50" :
                  program.color === "gbv" ? "bg-gradient-to-br from-purple-50 to-pink-50" :
                  "bg-gradient-to-br from-amber-50 to-orange-50"
                }`}
              >
                                
                <div className="relative p-8">
                  <div className="flex items-start justify-between">
                    <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg ${
                      program.color === "refugee" ? "bg-gradient-to-br from-teal-500 to-cyan-500" :
                      program.color === "gbv" ? "bg-gradient-to-br from-purple-500 to-pink-500" :
                      "bg-gradient-to-br from-amber-500 to-orange-500"
                    } text-white`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                      program.color === "refugee" ? "bg-teal-100 text-teal-800" :
                      program.color === "gbv" ? "bg-purple-100 text-purple-800" :
                      "bg-amber-100 text-amber-800"
                    }`}>
                      {program.badge}
                    </span>
                  </div>
                  
                  <h3 className="mt-6 text-xl font-bold text-slate-900 group-hover:text-slate-800 transition-colors">
                    {title}
                  </h3>
                  
                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {description}
                  </p>
                  
                  <div className="mt-6 space-y-3">
                    {program.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className={`h-2 w-2 rounded-full ${
                          program.color === "refugee" ? "bg-teal-500" :
                          program.color === "gbv" ? "bg-purple-500" :
                          "bg-amber-500"
                        }`} />
                        <span className="text-sm font-medium text-slate-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <div className="text-center">
                      {canNavigate ? (
                        <button 
                          onClick={() =>
                            navigate(isWrrp ? "/program/women-refugee-rise/verify" : program.route)
                          }
                          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
                        >
                          {actionLabel}
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      ) : (
                        <p className="text-sm text-slate-600">
                          {statusMessage}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

