import { FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { extractApiErrorMessage } from "@/lib/apiError";

export default function LecturerLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationRequired, setVerificationRequired] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setVerificationError("");
    setVerificationMessage("");
    setIsSubmitting(true);
    try {
      await login({ email, password, role: "lecturer" });
      setVerificationRequired(false);
      setMessage("Login successful! Redirecting to lecturer dashboard...");
      const next = searchParams.get("next");
      setTimeout(() => {
        navigate(next || "/lecturer", { replace: true });
      }, 1000);
    } catch (error: any) {
      if (error?.requiresVerification) {
        setVerificationRequired(true);
        setVerificationError("Email not verified. Enter the code sent to your email.");
        return;
      }
      setError(extractApiErrorMessage(error, "Invalid credentials. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setVerificationError("");
    setVerificationMessage("");
    setVerificationLoading(true);

    try {
      const response = await fetch("/api/v1/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Verification failed");
      }

      setVerificationMessage("Email verified! Signing you in...");
      await login({ email, password, role: "lecturer" });
      const next = searchParams.get("next");
      navigate(next || "/lecturer", { replace: true });
    } catch (err: any) {
      setVerificationError(err.message || "Verification failed");
    } finally {
      setVerificationLoading(false);
    }
  }

  async function handleResendVerification() {
    setResendLoading(true);
    setVerificationError("");
    setVerificationMessage("");
    try {
      const response = await fetch("/api/v1/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Failed to resend verification code");
      }
      setVerificationMessage("Verification code resent. Please check your email.");
    } catch (err: any) {
      setVerificationError(err.message || "Failed to resend verification code");
    } finally {
      setResendLoading(false);
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
            <div className="mx-auto h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-slate-900">Lecturer & Coaches Login</h1>
            <p className="mt-1 text-sm text-slate-600">Access your teaching dashboard and tools</p>
          </div>

          {message && (
            <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-800">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm placeholder-slate-400 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                placeholder="lecturer@vialifecoach.org"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm placeholder-slate-400 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-purple-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Signing in..." : "Sign In as Lecturer"}
            </button>
          </form>

          {verificationRequired && (
            <div className="mt-6 rounded-xl border border-purple-200 bg-purple-50 p-4">
              <h2 className="text-base font-semibold text-purple-900">Verify Your Email</h2>
              <p className="mt-1 text-sm text-purple-800">
                Enter the verification code sent to <span className="font-semibold">{email}</span>.
              </p>

              {verificationError ? (
                <p className="mt-3 text-sm text-red-700">{verificationError}</p>
              ) : null}
              {verificationMessage ? (
                <p className="mt-3 text-sm text-purple-700">{verificationMessage}</p>
              ) : null}

              <form className="mt-4 space-y-3" onSubmit={handleVerify}>
                <label className="block text-sm font-medium text-slate-700">
                  Verification Code
                  <input
                    className="mt-1 w-full rounded-md border border-purple-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-purple-500 transition focus:ring-2"
                    value={verificationCode}
                    onChange={(event) => setVerificationCode(event.target.value)}
                    required
                  />
                </label>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="submit"
                    disabled={verificationLoading}
                    className="rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow disabled:opacity-50"
                  >
                    {verificationLoading ? "Verifying..." : "Verify & Continue"}
                  </button>
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={resendLoading}
                    className="rounded-md border border-purple-300 bg-white px-4 py-2 text-sm font-semibold text-purple-700 disabled:opacity-50"
                  >
                    {resendLoading ? "Resending..." : "Resend Code"}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              New lecturer or coach?{" "}
              <Link to="/signup?role=lecturer&next=/lecturer" className="font-medium text-cyan-600 hover:text-cyan-500">
                Create Account
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
