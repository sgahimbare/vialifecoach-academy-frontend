import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/types";
import { Navigate, Outlet } from "react-router-dom";

type ProtectedRouteProps = {
  children?: React.ReactNode;
  allowedRoles?: UserRole[];
};

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { accessToken, user, isLoading } = useAuth();

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (!accessToken || !user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/forbidden" replace />;
  }

  if (children) return <>{children}</>;
  return <Outlet />;
}

