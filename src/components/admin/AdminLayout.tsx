import type { ReactNode } from "react";
import { AdminNav } from "@/components/admin/AdminNav";

type AdminLayoutProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function AdminLayout({ title, subtitle, actions, children }: AdminLayoutProps) {
  return (
    <main className="admin-page admin-shell">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="admin-title">{title}</h1>
          {subtitle ? <p className="admin-subtitle">{subtitle}</p> : null}
        </div>
        {actions}
      </div>
      <AdminNav />
      {children}
    </main>
  );
}
