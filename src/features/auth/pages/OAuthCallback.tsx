import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { exchangeCodeForToken } from "@/features/auth/services/authApi";

export function OAuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleOAuthCallback() {
      // Parse query params
      const params = new URLSearchParams(location.search);
      const code = params.get("code");
      // const state = params.get("state"); // Unused variable, commented out
      const errorParam = params.get("error");

      if (errorParam) {
        setError(`Authentication error: ${errorParam}`);
        return;
      }

      if (!code) {
        setError("Authorization code not found in URL.");
        return;
      }

      try {
        // Exchange authorization code for access token via backend API
        const token = await exchangeCodeForToken(code);
        if (token) {
          await login(token);
          navigate("/", { replace: true });
        } else {
          setError("Failed to retrieve access token.");
        }
      } catch (err) {
        setError("Error during token exchange.");
      }
    }

    handleOAuthCallback();
  }, [location.search, login, navigate]);

  if (error) {
    return (
      <div className="p-4 max-w-md mx-auto mt-20 text-center text-red-600">
        <h2>Authentication Failed</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto mt-20 text-center">
      <h2>Signing you in...</h2>
      <p>Please wait while we complete your sign-in process.</p>
    </div>
  );
}

export default OAuthCallback;
