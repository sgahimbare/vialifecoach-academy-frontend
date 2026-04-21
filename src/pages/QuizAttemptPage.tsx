import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useParams } from "react-router-dom";
import { quizService } from "@/services/quizService";

type Question = {
  id: number;
  prompt: string;
};

const quizQuestions: Question[] = [
  { id: 1, prompt: "Define active listening in one sentence." },
  { id: 2, prompt: "List two coaching ethics principles." },
  { id: 3, prompt: "How would you structure a first coaching session?" },
];

export default function QuizAttemptPage() {
  const { accessToken } = useAuth();
  const { courseId } = useParams();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [warning, setWarning] = useState("");
  const [violationCount, setViolationCount] = useState(0);
  const [tabLimit, setTabLimit] = useState(3);
  const [autoSubmitOnViolation, setAutoSubmitOnViolation] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const tabSwitches = useRef(0);

  const current = quizQuestions[index];
  const total = quizQuestions.length;

  const timeRemaining = useMemo(() => "30:00", []);

  function updateAnswer(value: string) {
    setAnswers((previous) => ({ ...previous, [current.id]: value }));
  }

  function blockPaste(event: React.ClipboardEvent<HTMLTextAreaElement>) {
    event.preventDefault();
    setWarning("Pasting is disabled during the quiz.");
    void sendViolation("paste_attempt");
  }

  function blockQuizActions(event: React.SyntheticEvent) {
    event.preventDefault();
    setWarning("Copying is disabled during the quiz.");
    const type = event.type === "contextmenu" ? "right_click_attempt" : "copy_or_cut_attempt";
    void sendViolation(type);
  }

  async function sendViolation(eventType: string, metadata: Record<string, unknown> = {}) {
    if (!accessToken) return;
    setViolationCount((c) => c + 1);
    try {
      await quizService.logViolation(
        {
          courseId: courseId ? Number(courseId) : undefined,
          eventType,
          metadata,
        },
        accessToken
      );
    } catch {
      // Silent: quiz UX should not break on telemetry failure.
    }
  }

  function submitQuiz() {
    setSubmitted(true);
    setWarning("Quiz submitted.");
  }

  useEffect(() => {
    let mounted = true;
    async function loadPolicy() {
      try {
        const rules = await quizService.getRules();
        const controls = rules?.data?.controls || {};
        if (!mounted) return;
        if (typeof controls.tab_switch_limit === "number") setTabLimit(controls.tab_switch_limit);
        if (typeof controls.auto_submit_on_violation === "boolean") {
          setAutoSubmitOnViolation(controls.auto_submit_on_violation);
        }
      } catch {
        // Keep defaults.
      }
    }
    void loadPolicy();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    function handleVisibility() {
      if (document.hidden) {
        tabSwitches.current += 1;
        setWarning("Tab switching detected.");
        void sendViolation("tab_switch", { count: tabSwitches.current });
        if (autoSubmitOnViolation && tabSwitches.current > tabLimit && !submitted) {
          submitQuiz();
        }
      }
    }
    function handleFullscreenChange() {
      const inFullscreen = Boolean(document.fullscreenElement);
      if (!inFullscreen) {
        setWarning("Fullscreen exited.");
        void sendViolation("fullscreen_exit");
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [accessToken, courseId]);

  return (
    <main className="mx-auto max-w-3xl p-6">
      <header className="mb-4 flex items-center justify-between rounded border p-3">
        <p className="text-sm font-medium">Time Remaining: {timeRemaining}</p>
        <p className="text-sm">
          Question {index + 1} of {total}
        </p>
      </header>

      <section
        className="select-none rounded border p-4"
        onCopy={blockQuizActions}
        onCut={blockQuizActions}
        onContextMenu={blockQuizActions}
      >
        <p className="font-medium">{current.prompt}</p>
        <textarea
          className="mt-3 min-h-40 w-full rounded border p-3"
          value={answers[current.id] || ""}
          onChange={(event) => updateAnswer(event.target.value)}
          onPaste={blockPaste}
          placeholder="Write your answer here."
        />
      </section>

      {warning ? <p className="mt-3 text-sm text-amber-700">{warning}</p> : null}
      <p className="mt-1 text-xs text-gray-500">Policy violations recorded: {violationCount}</p>

      <div className="mt-4 flex gap-3">
        <button
          type="button"
          className="rounded border px-4 py-2 disabled:opacity-50"
          disabled={index === 0}
          onClick={() => setIndex((previous) => previous - 1)}
        >
          Previous
        </button>
        <button
          type="button"
          className="rounded border px-4 py-2 disabled:opacity-50"
          disabled={index === total - 1}
          onClick={() => setIndex((previous) => previous + 1)}
        >
          Next
        </button>
        <button type="button" className="rounded bg-black px-4 py-2 text-white" onClick={submitQuiz} disabled={submitted}>
          Submit Quiz
        </button>
      </div>
    </main>
  );
}
