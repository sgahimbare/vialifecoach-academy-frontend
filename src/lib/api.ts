// Determine the API base URL.  We expect a full URL (including protocol) in
// VITE_API_BASE_URL; if the value is missing or doesn’t look like a URL we fall
// back to the local development server.
export const API_BASE_URL = (() => {
  const env = import.meta.env.VITE_API_BASE_URL;
  if (env && /^https?:\/\//i.test(env)) {
    return env.replace(/\/$/, "");
  }
  if (env) {
    // warn if someone has accidentally supplied a relative path
    console.warn(
      `VITE_API_BASE_URL appears to be relative ("${env}"). ` +
        "requests will be sent to the host serving the frontend instead of the API. " +
        "Set a full URL (e.g. http://localhost:5000/api/v1) or remove the variable."
    );
  }
  return "http://localhost:5000/api/v1";
})();

export function buildApiUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

type RequestOptions = Omit<RequestInit, "headers"> & {
  token?: string | null;
  headers?: HeadersInit;
  _retry?: boolean;
};

async function refreshAccessToken() {
  const tryRefresh = async (path: string) => {
    const response = await fetch(buildApiUrl(path), {
      method: "POST",
      credentials: "include",
    });
    if (!response.ok) throw new Error(`Refresh failed: ${response.status}`);
    const data = (await response.json()) as { accessToken?: string };
    if (!data.accessToken) throw new Error("No access token returned");
    return data.accessToken;
  };

  try {
    return await tryRefresh("/auth/refresh-token");
  } catch {
    return tryRefresh("/admin/auth/refresh-token");
  }
}

function broadcastToken(token: string) {
  try {
    localStorage.setItem("accessToken", token);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("auth:token", { detail: token }));
    }
  } catch {
    // Ignore storage errors; request retry will still use the fresh token.
  }
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers, _retry, ...rest } = options;
  const finalHeaders: HeadersInit = {
    ...(rest.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  const response = await fetch(buildApiUrl(path), {
    credentials: "include",
    ...rest,
    headers: finalHeaders,
  });

  if ((response.status === 401 || response.status === 403) && token && !_retry) {
    try {
      const refreshed = await refreshAccessToken();
      broadcastToken(refreshed);
      return await apiRequest<T>(path, {
        ...options,
        token: refreshed,
        _retry: true,
      });
    } catch {
      // Fall through to normal error handling below.
    }
  }

  if (!response.ok) {
    // If a request is made without a token and the server returns 401/403,
    // fail soft to avoid noisy console errors for unauthenticated visitors.
    if (!token && (response.status === 401 || response.status === 403)) {
      return null as T;
    }
    const text = await response.text();
    const maybeJson = text ? (() => {
      try {
        return JSON.parse(text) as Record<string, unknown>;
      } catch {
        return null;
      }
    })() : null;
    const message =
      (maybeJson && typeof maybeJson.message === "string" && maybeJson.message) ||
      (maybeJson && typeof maybeJson.error === "string" && maybeJson.error) ||
      text ||
      `Request failed: ${response.status}`;
    throw new Error(message);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}
