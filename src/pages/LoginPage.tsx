import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";
import { roleHomePath } from "@/routes/routeUtils";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isAdminLogin = searchParams.get("admin") === "1";
  const portal = searchParams.get("portal");
  const isApplicantLogin = portal === "applicant" || location.pathname.startsWith("/application-portal/");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const [resetError, setResetError] = useState("");
  const [verificationRequired, setVerificationRequired] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setVerificationError("");
    setVerificationMessage("");
    setIsSubmitting(true);
    try {
      // Try selected mode first; if regular login fails, fall back to admin login.
      let user;
      try {
        user = await login({ email, password }, { admin: isAdminLogin });
      } catch (innerErr: any) {
        if (innerErr?.requiresVerification) {
          throw innerErr;
        }
        if (isAdminLogin) {
          throw new Error("ADMIN_LOGIN_FAILED");
        }
        user = await login({ email, password }, { admin: true });
      }
      setVerificationRequired(false);
      const next = searchParams.get("next");
      const defaultNext = isApplicantLogin ? "/application-portal/dashboard" : roleHomePath(user.role);
      navigate(next || defaultNext, { replace: true });
    } catch (err: any) {
      if (err?.requiresVerification) {
        setVerificationRequired(true);
        setVerificationError("Email not verified. Enter the code sent to your email.");
        return;
      }
      setError(isAdminLogin ? "Invalid admin credentials." : "Invalid email or password.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePasswordReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResetError("");
    setResetMessage("");
    setResetLoading(true);
    
    try {
      const data = await apiRequest<{ message?: string }>("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: resetEmail })
      });

      setResetMessage('Password reset instructions have been sent to your email. Please check your inbox.');
      setResetEmail('');
    } catch (err) {
      setResetError(err instanceof Error ? err.message : 'Failed to send reset email. Please try again.');
    } finally {
      setResetLoading(false);
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
      const user = await login({ email, password }, { admin: isAdminLogin });
      const next = searchParams.get("next");
      const defaultNext = isApplicantLogin ? "/application-portal/dashboard" : roleHomePath(user.role);
      navigate(next || defaultNext, { replace: true });
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
          to="/signup"
          className="mb-4 inline-flex items-center rounded-md border border-white/30 bg-white/10 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-white/20"
        >
          ← Go Back
        </Link>

        <section className="rounded-2xl border border-white/20 bg-white/95 p-6 shadow-2xl sm:p-7">
          <h1 className="text-2xl font-semibold text-slate-900">
            {isAdminLogin ? "Admin Login" : isApplicantLogin ? "Applicant Login" : "Welcome Back"}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {isAdminLogin
              ? "Sign in with admin credentials."
              : isApplicantLogin
              ? "Sign in to manage your application."
              : "Sign in to continue."}
          </p>

          <form
            className="mt-6 space-y-4"
            onSubmit={handleSubmit}
            autoComplete="off"
            data-lpignore="true"
          >
            <label className="block">
              <span className="text-sm font-medium text-slate-800">Email</span>
              <input
                className="mt-1 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none ring-cyan-500 transition focus:ring-2"
                type="email"
                name="auth_email_no_store"
                autoComplete="off"
                data-lpignore="true"
                data-1p-ignore="true"
                spellCheck={false}
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
                name="auth_password_no_store"
                autoComplete="new-password"
                data-lpignore="true"
                data-1p-ignore="true"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            
            {!isAdminLogin && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowPasswordReset(true)}
                  className="text-sm text-cyan-700 hover:text-cyan-800 underline underline-offset-2"
                >
                  Forgot your password?
                </button>
              </div>
            )}
            
            <button
              className="w-full rounded-md bg-gradient-to-r from-cyan-700 to-emerald-700 px-4 py-2.5 font-semibold text-white shadow disabled:opacity-50"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {verificationRequired && (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <h2 className="text-lg font-semibold text-emerald-900">Verify Your Email</h2>
              <p className="mt-1 text-sm text-emerald-800">
                Enter the verification code sent to <span className="font-semibold">{email}</span>.
              </p>

              {verificationError ? (
                <p className="mt-3 text-sm text-red-700">{verificationError}</p>
              ) : null}
              {verificationMessage ? (
                <p className="mt-3 text-sm text-emerald-700">{verificationMessage}</p>
              ) : null}

              <form className="mt-4 space-y-3" onSubmit={handleVerify}>
                <label className="block">
                  <span className="text-sm font-medium text-slate-800">Verification Code</span>
                  <input
                    className="mt-1 w-full rounded-md border border-emerald-200 bg-white px-3 py-2.5 text-slate-900 outline-none ring-emerald-500 transition focus:ring-2"
                    value={verificationCode}
                    onChange={(event) => setVerificationCode(event.target.value)}
                    required
                  />
                </label>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="submit"
                    disabled={verificationLoading}
                    className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow disabled:opacity-50"
                  >
                    {verificationLoading ? "Verifying..." : "Verify & Continue"}
                  </button>
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={resendLoading}
                    className="rounded-md border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 disabled:opacity-50"
                  >
                    {resendLoading ? "Resending..." : "Resend Code"}
                  </button>
                </div>
              </form>
            </div>
          )}

          <p className="mt-4 text-sm text-slate-700">
            No account?{" "}
            <Link
              className="font-semibold text-cyan-700 underline underline-offset-2"
              to={isApplicantLogin ? "/application-portal" : "/signup"}
            >
              Create one
            </Link>
          </p>
        </section>

        {/* Password Reset Modal */}
        {showPasswordReset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/95 p-6 shadow-2xl">
              <h2 className="text-xl font-semibold text-slate-900">Reset Your Password</h2>
              <p className="mt-2 text-sm text-slate-600">
                Enter your email address and we'll send you instructions to reset your password.
              </p>

              <form className="mt-6 space-y-4" onSubmit={handlePasswordReset}>
                <label className="block">
                  <span className="text-sm font-medium text-slate-800">Email Address</span>
                  <input
                    className="mt-1 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none ring-cyan-500 transition focus:ring-2"
                    type="email"
                    value={resetEmail}
                    onChange={(event) => setResetEmail(event.target.value)}
                    required
                    placeholder="Enter your email"
                  />
                </label>

                {resetMessage && (
                  <div className="rounded-md bg-green-50 p-3">
                    <p className="text-sm text-green-800">{resetMessage}</p>
                  </div>
                )}

                {resetError && (
                  <div className="rounded-md bg-red-50 p-3">
                    <p className="text-sm text-red-800">{resetError}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordReset(false);
                      setResetEmail("");
                      setResetMessage("");
                      setResetError("");
                    }}
                    className="flex-1 rounded-md border border-slate-300 bg-white px-4 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="flex-1 rounded-md bg-gradient-to-r from-cyan-700 to-emerald-700 px-4 py-2.5 font-semibold text-white shadow disabled:opacity-50"
                  >
                    {resetLoading ? "Sending..." : "Send Reset Email"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
