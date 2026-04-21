import { Link } from "react-router-dom";

export default function DonatePage() {
  return (
    <main className="bg-gradient-to-br from-emerald-50 via-white to-cyan-50 py-12">
      <section className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-10">
        <header className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-600 to-cyan-600 p-8 text-white shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/80">Donate</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Support Our Learning Mission</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/90">
            Your support helps expand access to practical mental wellness and coaching education for students,
            youth, and underserved communities.
          </p>
        </header>

        <article className="mt-6 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">How to Donate</h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            To contribute, please contact our team and we will share available donation options and documentation.
          </p>
          <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Donation Contact</p>
            <p className="mt-1 text-sm font-medium text-emerald-900">partnership@vialifecoach.org</p>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="mailto:partnership@vialifecoach.org?subject=Donation%20Support%20Inquiry"
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Email Donation Team
            </a>
            <Link
              to="/partnerships"
              className="rounded-md border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
            >
              View Partnerships
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
}
