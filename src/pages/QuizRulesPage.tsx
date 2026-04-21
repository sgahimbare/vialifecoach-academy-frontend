import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { quizService } from "@/services/quizService";

const fallbackRules = [
  "You may move forward and backward between questions.",
  "Copying quiz questions or answers is not allowed.",
  "Pasting content from outside sources is not allowed.",
  "If time expires, your quiz will auto-submit.",
  "Any attempt to bypass exam rules may invalidate your attempt.",
];

export default function QuizRulesPage() {
  const { accessToken } = useAuth();
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [rules, setRules] = useState<string[]>(fallbackRules);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadRulesAndStatus() {
      try {
        const data = await quizService.getRules();
        const dynamicRules = data?.data?.conditions || data.rules;
        if (isMounted && dynamicRules && dynamicRules.length > 0) {
          setRules(dynamicRules);
        }
      } catch {
        if (isMounted) setRules(fallbackRules);
      }

      if (!accessToken || !courseId) return;
      try {
        const status = await quizService.getRulesStatus(Number(courseId), accessToken);
        const acceptedStatus = Boolean(status?.data?.accepted ?? status?.accepted);
        if (isMounted && acceptedStatus) {
          setAccepted(true);
        }
      } catch {
        // Status check is optional for rendering.
      }
    }
    void loadRulesAndStatus();
    return () => {
      isMounted = false;
    };
  }, [accessToken, courseId]);

  async function handleAccept() {
    setError("");
    if (!accepted) {
      setError("You must accept the quiz rules to continue.");
      return;
    }
    if (!accessToken || !courseId) return;
    setLoading(true);
    try {
      await quizService.acknowledgeRules(Number(courseId), accessToken);
      navigate(`/student/quiz/${courseId}/start`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">Quiz Conditions and Exam Rules</h1>
      <p className="mt-2 text-sm text-gray-700">
        Please read and accept these rules before starting the quiz.
      </p>
      <ol className="mt-4 list-decimal space-y-2 pl-6">
        {rules.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ol>
      <label className="mt-6 flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(event) => setAccepted(event.target.checked)}
        />
        I have read and agree to these rules.
      </label>
      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      <div className="mt-4 flex gap-3">
        <button className="rounded border px-4 py-2" onClick={() => navigate(-1)} type="button">
          Cancel
        </button>
        <button
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          onClick={handleAccept}
          type="button"
          disabled={loading}
        >
          {loading ? "Starting..." : "Accept and Start Quiz"}
        </button>
      </div>
    </main>
  );
}
