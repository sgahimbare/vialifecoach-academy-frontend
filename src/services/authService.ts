import { apiRequest, buildApiUrl } from "@/lib/api";
import type { User } from "@/types";

type RoleInput = User["role"] | "lecturer";

function normalizeRole(role: RoleInput): User["role"] {
  return role === "lecturer" ? "instructor" : role;
}

function normalizeUser(user: Omit<User, "role"> & { role: RoleInput }): User {
  return {
    ...user,
    role: normalizeRole(user.role),
  };
}

export type SignupPayload = {
  name: string;
  email: string;
  password: string;
  role?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
  role?: string;
};

export type LoginOptions = {
  admin?: boolean;
};

type AuthResponse = {
  accessToken: string;
  user: Omit<User, "role"> & { role: RoleInput };
};

type SignupResponse = {
  success?: boolean;
  message?: string;
  warning?: string | null;
};

export type MeResponse = Omit<User, "role"> & { role: RoleInput };

export const authService = {
  async signup(payload: SignupPayload) {
    const data = await apiRequest<SignupResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return data;
  },

  async login(payload: LoginPayload, options: LoginOptions = {}) {
    const endpoint = options.admin
      ? import.meta.env.VITE_ADMIN_LOGIN_ENDPOINT || "/admin/auth/login"
      : "/auth/login";

    const response = await fetch(buildApiUrl(endpoint), {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    const maybeJson = text ? (() => {
      try {
        return JSON.parse(text) as Record<string, unknown>;
      } catch {
        return null;
      }
    })() : null;

    if (!response.ok) {
      if (maybeJson && (maybeJson as any).requiresVerification) {
        const error: any = new Error(
          (maybeJson as any).message || "Email not verified"
        );
        error.requiresVerification = true;
        error.email = (maybeJson as any).email || payload.email;
        throw error;
      }
      const message =
        (maybeJson && typeof (maybeJson as any).message === "string" && (maybeJson as any).message) ||
        (maybeJson && typeof (maybeJson as any).error === "string" && (maybeJson as any).error) ||
        text ||
        `Request failed: ${response.status}`;
      throw new Error(message);
    }

    const data = (maybeJson || {}) as AuthResponse;
    return {
      accessToken: data.accessToken,
      user: normalizeUser(data.user),
    };
  },

  async me(token: string) {
    try {
      const data = await apiRequest<MeResponse>("/auth/me", { token });
      return normalizeUser(data);
    } catch {
      const data = await apiRequest<MeResponse>("/admin/auth/me", { token });
      return normalizeUser(data);
    }
  },

  async refreshToken() {
    const currentToken = localStorage.getItem("accessToken");
    try {
      return await apiRequest<{ accessToken: string }>("/auth/refresh-token", {
        method: "POST",
        token: currentToken,
      });
    } catch {
      return apiRequest<{ accessToken: string }>("/admin/auth/refresh-token", {
        method: "POST",
        token: currentToken,
      });
    }
  },

  async logout() {
    const currentToken = localStorage.getItem("accessToken");
    try {
      await apiRequest<void>("/auth/logout", { 
        method: "DELETE",
        token: currentToken,
      });
    } catch {
      await apiRequest<void>("/admin/auth/logout", { 
        method: "DELETE",
        token: currentToken,
      });
    }
  },
};
