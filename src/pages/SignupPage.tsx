import { FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { extractApiErrorMessage } from "@/lib/apiError";

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const role = searchParams.get("role") || "student";
  const isLecturer = role === "lecturer";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);
    try {
      await signup({ name, email, password, role });
      setMessage("Registration successful. Please verify your email.");
      const next = searchParams.get("next");
      
      if (isLecturer) {
        navigate(next ? `/lecturer-login?next=${encodeURIComponent(next)}` : "/lecturer-login", { replace: true });
      } else {
        navigate(next ? `/login?next=${encodeURIComponent(next)}` : "/login", { replace: true });
      }
    } catch (error) {
      setError(extractApiErrorMessage(error, "Something went wrong. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-[calc(100vh-48px)] overflow-hidden bg-gradient-to-br from-slate-900 via-cyan-900 to-emerald-900 px-4 py-12">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-md">
        <Link
          to="/home"
          className="mb-4 inline-flex items-center rounded-md border border-white/30 bg-white/10 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-white/20"
        >
          ← Back Home
        </Link>

        <section className="rounded-2xl border border-white/20 bg-white/95 p-6 shadow-2xl sm:p-7">
          <div className="text-center mb-6">
            <div className="mx-auto h-12 w-12 rounded-full bg-cyan-600 flex items-center justify-center mb-4">
              {isLecturer ? (
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              ) : (
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
            <h1 className="text-2xl font-semibold text-slate-900">
              {isLecturer ? "Create Lecturer Account" : "Create Student Account"}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              {isLecturer 
                ? "Join our teaching community and start creating courses." 
                : "Start your growth journey with Vialifecoach Academy."
              }
            </p>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-medium text-slate-800">Full Name</span>
              <input
                className="mt-1 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none ring-cyan-500 transition focus:ring-2"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-800">Email</span>
              <input
                className="mt-1 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none ring-cyan-500 transition focus:ring-2"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-800">Password</span>
              <input
                className="mt-1 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none ring-cyan-500 transition focus:ring-2"
                type="password"
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
            <button
              className="w-full rounded-md bg-gradient-to-r from-cyan-700 to-emerald-700 px-4 py-2.5 font-semibold text-white shadow disabled:opacity-50"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Account..." : `Create ${isLecturer ? "Lecturer" : "Student"} Account`}
            </button>
          </form>

          <p className="mt-4 text-sm text-slate-700">
            Already have an account?{" "}
            <Link
              className="font-semibold text-cyan-700 underline underline-offset-2"
              to={isLecturer 
                ? (searchParams.get("next") ? `/lecturer-login?next=${encodeURIComponent(searchParams.get("next") as string)}` : "/lecturer-login")
                : (searchParams.get("next") ? `/login?next=${encodeURIComponent(searchParams.get("next") as string)}` : "/login")
              }
            >
              Sign in
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
