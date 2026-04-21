import type { UserRole } from "@/types";

export function roleHomePath(role: UserRole) {
  if (["admin", "owner", "manager", "content_editor", "support"].includes(role)) return "/admin";
  if (role === "instructor") return "/lecturer";
  return "/student";
}
