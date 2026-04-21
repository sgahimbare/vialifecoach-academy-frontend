import type { UserRole } from "@/types";

export const roleAccess = {
  canManageUsers: (role?: UserRole) => ["admin", "owner", "manager"].includes(role || ""),
  canEditCourses: (role?: UserRole) => ["admin", "owner", "manager", "content_editor"].includes(role || ""),
  canViewReports: (role?: UserRole) => ["admin", "owner", "manager", "support"].includes(role || ""),
  canManageSettings: (role?: UserRole) => ["admin", "owner"].includes(role || ""),
  canManagePolicies: (role?: UserRole) => ["admin", "owner", "manager"].includes(role || ""),
};
