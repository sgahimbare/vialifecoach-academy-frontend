import { Link, Navigate, useParams } from "react-router-dom";
import { getPolicyDocument } from "@/data/policyContent";

const palette = {
  terms: {
    page: "from-cyan-50 via-white to-indigo-50",
    blob1: "bg-cyan-200/50",
    blob2: "bg-indigo-200/40",
    hero: "from-cyan-600 via-sky-600 to-indigo-600",
    border: "border-cyan-100",
    back: "text-cyan-700",
    card: "from-white to-cyan-50",
    dot: "bg-cyan-500",
  },
  privacy: {
    page: "from-emerald-50 via-white to-teal-50",
    blob1: "bg-emerald-200/50",
    blob2: "bg-teal-200/40",
    hero: "from-emerald-600 via-teal-600 to-cyan-600",
    border: "border-emerald-100",
    back: "text-emerald-700",
    card: "from-white to-emerald-50",
    dot: "bg-emerald-500",
  },
  cookies: {
    page: "from-amber-50 via-white to-orange-50",
    blob1: "bg-amber-200/50",
    blob2: "bg-orange-200/40",
    hero: "from-amber-500 via-orange-500 to-rose-500",
    border: "border-amber-100",
    back: "text-amber-700",
    card: "from-white to-amber-50",
    dot: "bg-amber-500",
  },
} as const;

type PolicySectionDetailPageProps = {
  policyKey?: "terms" | "privacy" | "cookies";
};

export default function PolicySectionDetailPage({ policyKey: forcedPolicyKey }: PolicySectionDetailPageProps) {
  const { policyKey, sectionSlug } = useParams<{ policyKey: string; sectionSlug: string }>();
  const resolvedPolicyKey = forcedPolicyKey || policyKey || "";
  const policy = getPolicyDocument(resolvedPolicyKey);

  if (!policy || !sectionSlug) return <Navigate to="/not-found" replace />;

  const sectionIndex = policy.sections.findIndex((item) => item.slug === sectionSlug);
  const section = sectionIndex >= 0 ? policy.sections[sectionIndex] : null;
  if (!section) return <Navigate to="/not-found" replace />;
  const previousSection = sectionIndex > 0 ? policy.sections[sectionIndex - 1] : null;
  const nextSection = sectionIndex < policy.sections.length - 1 ? policy.sections[sectionIndex + 1] : null;

  const style = palette[policy.key];

  return (
    <main className={`relative overflow-hidden bg-gradient-to-br ${style.page}`}>
      <div className={`pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full ${style.blob1} blur-3xl`} />
      <div className={`pointer-events-none absolute top-40 -right-24 h-72 w-72 rounded-full ${style.blob2} blur-3xl`} />

      <article className="relative z-10 mx-auto max-w-5xl px-6 py-12 sm:px-8 lg:px-10">
        <header className={`rounded-2xl border ${style.border} bg-gradient-to-r ${style.hero} p-8 text-white shadow-xl`}>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/80">{policy.title}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">{section.title}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/90">{section.summary}</p>
          <p className="mt-3 text-sm text-white/80">Last updated: {policy.lastUpdated}</p>
        </header>

        <section className={`mt-6 rounded-2xl border ${style.border} bg-white/95 p-6 shadow-sm`}>
          <Link to={policy.backPath} className={`text-sm font-semibold ${style.back}`}>
            ← Back to {policy.title}
          </Link>

          <div className="mt-5 space-y-4">
            {section.details.map((paragraph, index) => (
              <div key={`${section.slug}-${index}`} className={`rounded-xl border ${style.border} bg-gradient-to-r ${style.card} p-4`}>
                <div className="mb-2 flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${style.dot}`} />
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Detail {index + 1}
                  </span>
                </div>
                <p className="text-sm leading-7 text-slate-700">{paragraph}</p>
              </div>
            ))}
          </div>

          <div className={`mt-6 grid gap-3 border-t ${style.border} pt-5 sm:grid-cols-2`}>
            {previousSection ? (
              <Link
                to={`${policy.backPath}/${previousSection.slug}`}
                className={`rounded-xl border ${style.border} bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:shadow-sm`}
              >
                <p className="text-xs uppercase tracking-wider text-slate-500">Previous</p>
                <p className="mt-1">{previousSection.title}</p>
              </Link>
            ) : (
              <div className={`rounded-xl border ${style.border} bg-slate-50 px-4 py-3 text-sm text-slate-400`}>
                Start of document
              </div>
            )}

            {nextSection ? (
              <Link
                to={`${policy.backPath}/${nextSection.slug}`}
                className={`rounded-xl border ${style.border} bg-white px-4 py-3 text-right text-sm font-medium text-slate-700 transition hover:shadow-sm`}
              >
                <p className="text-xs uppercase tracking-wider text-slate-500">Next</p>
                <p className="mt-1">{nextSection.title}</p>
              </Link>
            ) : (
              <div className={`rounded-xl border ${style.border} bg-slate-50 px-4 py-3 text-right text-sm text-slate-400`}>
                End of document
              </div>
            )}
          </div>
        </section>
      </article>
    </main>
  );
}
