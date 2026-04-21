import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "@/types";
import {
  authService,
  type LoginOptions,
  type LoginPayload,
  type SignupPayload,
} from "@/services/authService";

type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (payload: LoginPayload | string, options?: LoginOptions) => Promise<User>;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

function getStoredToken() {
  return localStorage.getItem("accessToken");
}

function storeToken(token: string) {
  localStorage.setItem("accessToken", token);
}

function clearStoredToken() {
  localStorage.removeItem("accessToken");
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(getStoredToken());
  const [isLoading, setIsLoading] = useState(true);

  const handleAuthenticatedState = (token: string, authUser: User) => {
    setAccessToken(token);
    setUser(authUser);
    storeToken(token);
  };

  const clearAuth = () => {
    setAccessToken(null);
    setUser(null);
    clearStoredToken();
  };

  const login = async (payload: LoginPayload | string, options: LoginOptions = {}) => {
    if (typeof payload === "string") {
      const me = await authService.me(payload);
      handleAuthenticatedState(payload, me);
      return me;
    }

    const data = await authService.login(payload, options);
    handleAuthenticatedState(data.accessToken, data.user);
    return data.user;
  };

  const signup = async (payload: SignupPayload) => {
    await authService.signup(payload);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      clearAuth();
    }
  };

  const updateUserProfile = (updates: Partial<User>) => {
    setUser((previous) => (previous ? { ...previous, ...updates } : previous));
  };

  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      try {
        const localToken = getStoredToken();
        if (localToken) {
          const me = await authService.me(localToken);
          if (isMounted) handleAuthenticatedState(localToken, me);
          return;
        }

        const refreshed = await authService.refreshToken();
        const me = await authService.me(refreshed.accessToken);
        if (isMounted) handleAuthenticatedState(refreshed.accessToken, me);
      } catch {
        if (isMounted) clearAuth();
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void bootstrap();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    function handleTokenUpdate(event: Event) {
      const detail = (event as CustomEvent<string>).detail;
      if (detail && typeof detail === "string") {
        setAccessToken(detail);
        storeToken(detail);
      }
    }

    if (typeof window === "undefined") return;
    window.addEventListener("auth:token", handleTokenUpdate as EventListener);
    return () => {
      window.removeEventListener("auth:token", handleTokenUpdate as EventListener);
    };
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      accessToken,
      isLoading,
      login,
      signup,
      logout,
      updateUserProfile,
    }),
    [user, accessToken, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
