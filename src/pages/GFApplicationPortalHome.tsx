import { useNavigate } from "react-router-dom";
import { ArrowLeft, LogIn, UserPlus } from "lucide-react";

export default function GFApplicationPortalHome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate("/application-portal")}
          className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Programs
        </button>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-slate-50 mb-3">
            Vialifecoach GF Application Portal
          </h1>
          <p className="text-slate-400 mb-8">
            Please log in if you already have an account, or create a new account to start your application.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-slate-50 mb-2">Already have an account?</h2>
              <p className="text-slate-400 mb-4">
                Log in to continue your application and check your status.
              </p>
              <button
                onClick={() => navigate("/application-portal/login?portal=applicant")}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                <LogIn className="h-4 w-4" />
                Log In
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-slate-50 mb-2">New applicant?</h2>
              <p className="text-slate-400 mb-4">
                Create an account to start your application.
              </p>
              <button
                onClick={() =>
                  navigate("/application-portal/gf/create-account")
                }
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
              >
                <UserPlus className="h-4 w-4" />
                Create Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
