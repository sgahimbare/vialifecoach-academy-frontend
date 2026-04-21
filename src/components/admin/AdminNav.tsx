import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { roleAccess } from "./roleAccess";

const adminLinks = [
  { label: "Overview", to: "/admin", visible: () => true },
  { label: "Application Center", to: "/admin/program-keywords", visible: () => true },
  { label: "Letter", to: "/admin/admission-letter", visible: () => true },
  { label: "Users", to: "/admin/users", visible: roleAccess.canManageUsers },
  { label: "Courses", to: "/admin/courses", visible: roleAccess.canEditCourses },
  { label: "Categories", to: "/admin/categories", visible: roleAccess.canEditCourses },
  { label: "Quiz Policies", to: "/admin/quiz-policies", visible: roleAccess.canManagePolicies },
  { label: "Bookings", to: "/admin/bookings", visible: () => true },
  { label: "Support Tickets", to: "/admin/support-tickets", visible: () => true },
  { label: "Operations", to: "/admin/operations", visible: () => true },
  { label: "Reports", to: "/admin/reports", visible: roleAccess.canViewReports },
  { label: "Conversation Audit", to: "/admin/conversation-audit", visible: () => true },
];

export function AdminNav() {
  const { logout, user } = useAuth();

  console.log('AdminNav - user role:', user?.role);
  console.log('AdminNav - all links:', adminLinks);
  console.log('AdminNav - visible links:', adminLinks.filter((link) => link.visible(user?.role)));

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-3">
      {adminLinks.filter((link) => link.visible(user?.role)).map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `rounded border px-3 py-1.5 text-sm ${
              isActive
                ? "border-cyan-500/50 bg-cyan-700/80 text-white"
                : "border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700"
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
      <button
        type="button"
        onClick={() => void logout()}
        className="ml-auto rounded border border-red-500/40 bg-red-900/40 px-3 py-1.5 text-sm text-red-200 hover:bg-red-800/60"
      >
        Admin Logout
      </button>
    </div>
  );
}
