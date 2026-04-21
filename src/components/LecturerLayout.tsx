import type { ReactNode } from "react";
import { LecturerNav } from "@/components/LecturerNav";

type LecturerLayoutProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function LecturerLayout({ title, subtitle, actions, children }: LecturerLayoutProps) {
  return (
    <main className="lecturer-page lecturer-shell">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="lecturer-title">{title}</h1>
          {subtitle ? <p className="lecturer-subtitle">{subtitle}</p> : null}
        </div>
        {actions}
      </div>
      <LecturerNav />
      {children}
    </main>
  );
}
