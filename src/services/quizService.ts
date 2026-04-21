import { apiRequest } from "@/lib/api";

export type QuizRulesResponse = {
  success?: boolean;
  data?: {
    title?: string;
    intro?: string;
    conditions?: string[];
    process?: string[];
    controls?: Record<string, unknown>;
  };
  rules?: string[];
  message?: string;
};

export type QuizRuleStatus = {
  accepted?: boolean;
  data?: {
    accepted?: boolean;
  };
};

export const quizService = {
  getRules() {
    return apiRequest<QuizRulesResponse>("/quiz/rules");
  },

  getRulesStatus(courseId: number, token: string) {
    return apiRequest<QuizRuleStatus>(`/quiz/rules/status/${courseId}`, { token });
  },

  acknowledgeRules(courseId: number, token: string) {
    return apiRequest<{ success: boolean; message?: string }>("/quiz/rules/acknowledge", {
      method: "POST",
      token,
      body: JSON.stringify({ courseId }),
    });
  },

  logViolation(
    payload: { courseId?: number; quizId?: number; eventType: string; metadata?: Record<string, unknown> },
    token: string
  ) {
    return apiRequest<{ success: boolean }>("/quiz/rules/violation", {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    });
  },
};
