import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { roleHomePath } from "../routeUtils";


export function GuestRoute({ children }: { children: React.ReactNode }) {
  const { accessToken, user, isLoading } = useAuth();
  if (isLoading) return <div className="p-6">Loading...</div>;
  if (accessToken && user) return <Navigate to={roleHomePath(user.role)} replace />;
  return <>{children}</>;
}
