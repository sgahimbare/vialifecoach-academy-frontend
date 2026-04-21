import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MailCheck, ShieldCheck } from "lucide-react";
import { login, register } from "../services/apiService";

export default function GFAccountCreateVerify() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"create" | "verify">("create");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    country: "",
    language: "English",
  });

  const [code, setCode] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await register(form.name, form.email, form.password);
      if (response?.message) {
        setSuccess("Account created. Check your email for the verification code.");
        setStep("verify");
      } else {
        setError(response?.error || "Registration failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      setLoading(true);
      const res = await fetch("/api/v1/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, code })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Verification failed");
      }

      // Login after verification
      const loginResult = await login(form.email, form.password);
      if (!loginResult?.accessToken) {
        throw new Error("Login failed after verification");
      }

      // Save accountCreation section to application data
      await fetch("/api/v1/common/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + loginResult.accessToken
        },
        body: JSON.stringify({
          data: {
            accountCreation: {
              name: form.name,
              email: form.email,
              phone: form.phone,
              country: form.country,
              language: form.language
            }
          }
        })
      });

      setSuccess("Account verified! Redirecting...");
      navigate("/application-portal/gf", { replace: true });
    } catch (err: any) {
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setSuccess("");
    setResendLoading(true);
    try {
      const res = await fetch("/api/v1/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Failed to resend code");
      }
      setSuccess("Verification code resent. Check your email.");
    } catch (err: any) {
      setError(err.message || "Failed to resend code");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate("/application-portal/gf/home")}
          className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Portal
        </button>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-slate-50 mb-2">
            {step === "create" ? "Create Your Account" : "Verify Your Account"}
          </h1>
          <p className="text-slate-400 mb-6">
            {step === "create"
              ? "Fill in your details to create an account."
              : "Enter the verification code sent to your email."}
          </p>

          {error && (
            <div className="mb-4 rounded-lg border border-red-700 bg-red-900/30 p-3 text-red-200">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 rounded-lg border border-emerald-700 bg-emerald-900/30 p-3 text-emerald-200">
              {success}
            </div>
          )}

          {step === "create" ? (
            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Full Name *</label>
                  <input
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Email *</label>
                  <input
                    type="email"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Password *</label>
                  <input
                    type="password"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Confirm Password *</label>
                  <input
                    type="password"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Phone Number *</label>
                  <input
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Country *</label>
                  <input
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100"
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1">Preferred Language</label>
                <select
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100"
                  value={form.language}
                  onChange={(e) => setForm({ ...form, language: e.target.value })}
                >
                  <option>English</option>
                  <option>French</option>
                  <option>Swahili</option>
                  <option>Arabic</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                <MailCheck className="h-4 w-4" />
                {loading ? "Creating..." : "Create Account"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Verification Code *</label>
                <input
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
                >
                  <ShieldCheck className="h-4 w-4" />
                  {loading ? "Verifying..." : "Verify & Continue"}
                </button>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="inline-flex items-center gap-2 border border-emerald-600 text-emerald-200 px-4 py-2 rounded-lg hover:bg-emerald-900/40 disabled:opacity-60"
                >
                  {resendLoading ? "Resending..." : "Resend Code"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
