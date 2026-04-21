import { Link } from "react-router-dom";
import { policyDocuments } from "@/data/policyContent";

export default function TermsPage() {
  const policy = policyDocuments.terms;

  return (
    <main className="relative overflow-hidden bg-gradient-to-br from-cyan-50 via-white to-indigo-50">
      <div className="pointer-events-none absolute -top-28 -left-20 h-72 w-72 rounded-full bg-cyan-200/50 blur-3xl" />
      <div className="pointer-events-none absolute top-36 -right-24 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
      <article className="relative z-10 mx-auto max-w-5xl px-6 py-12 sm:px-8 lg:px-10">
        <header className="rounded-2xl border border-cyan-100 bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-600 p-8 text-white shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-100">Legal</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Terms of Service</h1>
          <p className="mt-2 text-sm text-cyan-50">Last updated: February 26, 2026</p>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-cyan-50">
            Clear standards for using Vialifecoach Academy safely, lawfully, and responsibly.
          </p>
        </header>

        <section className="mt-6 space-y-3">
          {policy.sections.map((section) => (
            <Link
              key={section.slug}
              to={`/terms/${section.slug}`}
              className="group block rounded-xl border border-cyan-100 bg-white/90 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="rounded-xl bg-gradient-to-r from-white to-cyan-50 px-5 py-4 font-semibold text-slate-800 transition group-hover:from-cyan-50 group-hover:to-sky-50">
                {section.title}
              </div>
              <div className="px-5 pb-5 text-sm leading-7 text-slate-700">
                <div className="mb-3 h-px w-full bg-gradient-to-r from-cyan-200 to-indigo-200" />
                {section.summary}
                <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-cyan-700">
                  Click to read full explanation
                </p>
              </div>
            </Link>
          ))}
        </section>
      </article>
    </main>
  );
}
