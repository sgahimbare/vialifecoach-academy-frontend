const GOOGLE_OAUTH_BASE_URL = "https://accounts.google.com/o/oauth2/v2/auth";

export function buildGoogleOAuthUrl() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();
  const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI?.trim();

  if (!clientId || !redirectUri) {
    throw new Error("Missing Google OAuth env vars: VITE_GOOGLE_CLIENT_ID and/or VITE_GOOGLE_REDIRECT_URI");
  }

  const scope = encodeURIComponent("openid email profile");
  const responseType = "code";

  return (
    `${GOOGLE_OAUTH_BASE_URL}` +
    `?response_type=${responseType}` +
    `&client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${scope}` +
    `&access_type=offline` +
    `&prompt=consent`
  );
}
