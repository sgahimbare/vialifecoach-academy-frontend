import { useAuth as useAppAuth } from "@/context/AuthContext";

export function useAuth() {
  return useAppAuth();
}
