import { Link } from "react-router-dom";

const values = [
  {
    title: "Empathy First",
    text: "We design learning experiences that respect real human struggles and growth journeys.",
  },
  {
    title: "Practical Learning",
    text: "Our content focuses on what people can apply immediately in daily life and work.",
  },
  {
    title: "Integrity",
    text: "We value trust, transparency, and responsible use of education and technology.",
  },
  {
    title: "Impact",
    text: "We measure success by meaningful transformation in confidence, wellness, and leadership.",
  },
];

const audiences = [
  "Students and young professionals building emotional resilience and clarity.",
  "Aspiring coaches and facilitators developing practical mentoring skills.",
  "Educators and community leaders supporting youth development.",
  "Organizations investing in staff wellbeing and growth.",
];

const team = [
  {
    name: "Dr. Sarah Mitchell",
    role: "Academic Lead",
    bio: "Designs evidence-informed learning pathways in mental wellness and coaching practice.",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    linkedin: "#",
  },
  {
    name: "Marcus Thompson",
    role: "Leadership Programs Director",
    bio: "Leads leadership and career-development tracks with practical real-world frameworks.",
    image:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=600&q=80",
    linkedin: "#",
  },
  {
    name: "Elena Martinez",
    role: "Youth Development Specialist",
    bio: "Builds youth-focused mentorship content and student growth support programs.",
    image:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=600&q=80",
    linkedin: "#",
  },
  {
    name: "Michael Chen",
    role: "Wellness Strategy Advisor",
    bio: "Supports corporate wellbeing and outcome measurement across organizational learning.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    linkedin: "#",
  },
];

export default function AboutUsPage() {
  return (
    <main className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-emerald-50">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-sky-200/50 blur-3xl" />
      <div className="pointer-events-none absolute top-32 -right-24 h-72 w-72 rounded-full bg-emerald-200/50 blur-3xl" />

      <article className="relative z-10 mx-auto max-w-6xl px-6 py-12 sm:px-8 lg:px-10">
        <header className="rounded-2xl border border-sky-100 bg-gradient-to-r from-sky-600 via-cyan-600 to-emerald-600 p-8 text-white shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/80">About Us</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Vialifecoach Academy</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/90 sm:text-base">
            We equip people with practical skills in mental wellness, personal development, and entrepreneurship
            so they can grow with confidence and create lasting impact in their communities.
          </p>
        </header>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-sky-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-700">Mission</p>
            <p className="mt-2 text-sm leading-7 text-slate-700">
              Deliver accessible, high-quality education that helps learners build healthier minds, stronger
              leadership, and sustainable personal growth.
            </p>
          </div>
          <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Vision</p>
            <p className="mt-2 text-sm leading-7 text-slate-700">
              A world where emotional intelligence and practical life skills are available to everyone, not just a
              privileged few.
            </p>
          </div>
          <div className="rounded-xl border border-cyan-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-700">What We Do</p>
            <p className="mt-2 text-sm leading-7 text-slate-700">
              We combine structured courses, coaching frameworks, and peer community support to help learners
              turn knowledge into meaningful action.
            </p>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Our Story</h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            Vialifecoach Academy was built from a simple idea: people should have practical support for personal
            growth, not just theory. We saw students, workers, and leaders struggling with stress, direction, and
            confidence while lacking access to structured guidance that actually fits real life.
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            That is why we created a platform focused on relevant skills: emotional wellness, mindset
            development, coaching communication, and entrepreneurial thinking. Our goal is to help people grow in
            ways they can measure and apply every day.
          </p>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Who We Serve</h2>
            <ul className="mt-4 space-y-3">
              {audiences.map((item) => (
                <li key={item} className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Our Values</h2>
            <div className="mt-4 space-y-3">
              {values.map((value) => (
                <div key={value.title} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                  <p className="text-sm font-semibold text-slate-900">{value.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-700">{value.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Meet the Team</h2>
          <p className="mt-2 text-sm leading-7 text-slate-700">
            Our multidisciplinary team combines coaching, mental wellness, leadership development, and education
            strategy to deliver meaningful learning experiences.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <article
                key={member.name}
                className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-slate-900">{member.name}</h3>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wider text-sky-700">{member.role}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{member.bio}</p>
                  <a
                    href={member.linkedin}
                    className="mt-3 inline-block text-xs font-semibold uppercase tracking-wider text-sky-700 hover:text-sky-800"
                  >
                    LinkedIn
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-sky-100 bg-gradient-to-r from-sky-600 to-emerald-600 p-7 text-white shadow-xl">
          <h2 className="text-2xl font-semibold">Build Your Next Chapter With Us</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-white/90">
            Whether you are just starting your growth journey or scaling your leadership impact, Vialifecoach
            Academy gives you practical tools and a supportive community to move forward.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/courses" className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-sky-700">
              Explore Courses
            </Link>
            <Link
              to="/community"
              className="rounded-md border border-white/50 bg-white/10 px-4 py-2 text-sm font-semibold text-white"
            >
              Join Community
            </Link>
            <Link
              to="/contact-us"
              className="rounded-md border border-white/50 bg-white/10 px-4 py-2 text-sm font-semibold text-white"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </article>
    </main>
  );
}
