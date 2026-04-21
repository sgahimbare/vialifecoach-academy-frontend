import { Link } from "react-router-dom";
import { ArrowRight, HandCoins, Handshake, PlayCircle } from "lucide-react";

export function HomeInsightSection() {
  return (
    <section className="bg-gradient-to-br from-slate-50 via-white to-cyan-50 pt-4 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-4 rounded-xl border border-slate-200 bg-white/90 p-5 text-center shadow-sm">
          <p className="text-sm leading-7 text-slate-700">
            Discover more about Vialifecoach Academy by scrolling down our website to explore detailed information
            about our programs and services.
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-700">
            If you would like guidance on how to use our portal, please{" "}
            <a
              href="https://www.youtube.com/watch?v=2Lz0VOltZKA"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-cyan-700 underline underline-offset-2 hover:text-cyan-800"
            >
              click here
            </a>{" "}
            to watch the instructional video.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
          <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-cyan-700">About Us</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">Who We Are in Brief</h3>
            <p className="mt-4 text-sm leading-7 text-slate-700">
              Vialifecoach Academy helps people grow through practical education in mental wellness, coaching,
              leadership, and entrepreneurship. We combine structured learning, community support, and action-based
              methods so learners can apply what they learn in real life.
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Our mission is to make personal growth education accessible, relevant, and measurable for students,
              young professionals, educators, and organizations.
            </p>

            <div className="mt-auto grid auto-rows-fr gap-3 pt-5 sm:grid-cols-2">
              <Link
                to="/partnerships"
                className="flex min-h-[165px] flex-col rounded-xl border border-cyan-100 bg-cyan-50 p-4 transition hover:border-cyan-300 hover:bg-cyan-100/70"
              >
                <div className="flex items-center gap-2">
                  <Handshake className="h-4 w-4 text-cyan-700" />
                  <p className="text-sm font-semibold text-slate-900">Partnerships</p>
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-700">
                  Collaborate with us for schools, organizations, and community impact.
                </p>
              </Link>

              <Link
                to="/donate"
                className="flex min-h-[165px] flex-col rounded-xl border border-emerald-100 bg-emerald-50 p-4 transition hover:border-emerald-300 hover:bg-emerald-100/70"
              >
                <div className="flex items-center gap-2">
                  <HandCoins className="h-4 w-4 text-emerald-700" />
                  <p className="text-sm font-semibold text-slate-900">Donate</p>
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-700">
                  Support accessible coaching and wellness education for more learners.
                </p>
              </Link>
            </div>

            <Link
              to="/about"
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-white"
            >
              <span className="inline-flex items-center gap-2 rounded-md bg-cyan-600 px-4 py-2 transition hover:bg-cyan-700">
                Read More About Us
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </article>

          <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">Success Stories</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">Watch Learner Transformation</h3>
            <p className="mt-4 text-sm leading-7 text-slate-700">
              Hear directly from our learners and community members about how coaching skills and wellness
              education helped them improve confidence, career direction, and everyday resilience.
            </p>
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
              <iframe
                className="aspect-video w-full"
                src="https://www.youtube.com/embed/2Lz0VOltZKA"
                title="Vialifecoach success story video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            <p className="mt-2 text-xs text-slate-500">Featured story video (about 2-3 minutes)</p>
            <Link
              to="/success-stories"
              className="mt-auto inline-flex items-center gap-2 rounded-md border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
            >
              <PlayCircle className="h-4 w-4" />
              View More Success Stories
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
