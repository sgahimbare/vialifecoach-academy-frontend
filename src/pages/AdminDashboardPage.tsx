import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { adminService, type AdminDashboardStats } from "@/services/adminService";

export default function AdminDashboardPage() {
  const { accessToken } = useAuth();
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    async function load() {
      if (!accessToken) return;
      try {
        const data = await adminService.getDashboard(accessToken);
        if (isMounted) setStats(data);
      } catch {
        if (isMounted) setStats(null);
      }
    }
    void load();
    return () => {
      isMounted = false;
    };
  }, [accessToken]);

  return (
    <AdminLayout title="Admin Dashboard" subtitle="Monitor platform activity and manage roles.">
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={() => navigate("/admin/analytics")}
          className="admin-btn-primary"
        >
          View
        </button>
      </div>
      {!stats ? <p className="mt-6 text-slate-300">No platform data available yet.</p> : null}
      {stats ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="admin-card">Total Users: {stats.total_users}</div>
          <div className="admin-card">Total Students: {stats.total_students}</div>
          <div className="admin-card">Total Lecturers: {stats.total_lecturers}</div>
          <div className="admin-card">Total Courses: {stats.total_courses}</div>
          <div className="admin-card">Total Enrollments: {stats.total_enrollments}</div>
        </div>
      ) : null}
    </AdminLayout>
  );
}
