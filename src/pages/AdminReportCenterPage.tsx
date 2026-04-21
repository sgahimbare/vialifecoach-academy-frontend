import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAuth } from "@/context/AuthContext";
import { adminService } from "@/services/adminService";
import { extractApiErrorMessage } from "@/lib/apiError";
import { useToast } from "@/components/ui/toast";

function downloadCsv(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminReportCenterPage() {
  const { accessToken } = useAuth();
  const { addToast } = useToast();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [kpis, setKpis] = useState<Record<string, unknown> | null>(null);
  const [revenue, setRevenue] = useState<Record<string, unknown>[]>([]);
  const [coupons, setCoupons] = useState<Record<string, unknown>[]>([]);
  const [refunds, setRefunds] = useState<Record<string, unknown>[]>([]);

  async function load() {
    if (!accessToken) return;
    try {
      const [k, r, c, rf] = await Promise.all([
        adminService.getKpis(accessToken, from || undefined, to || undefined),
        adminService.getRevenueReport(accessToken),
        adminService.getCouponReport(accessToken),
        adminService.getRefundReport(accessToken),
      ]);
      setKpis(k.kpis);
      setRevenue(r);
      setCoupons(c);
      setRefunds(rf);
    } catch (error) {
      addToast({ variant: "destructive", title: "Load failed", description: extractApiErrorMessage(error) });
    }
  }

  useEffect(() => {
    void load();
  }, [accessToken]);

  async function exportType(type: "revenue" | "refunds" | "coupons") {
    if (!accessToken) return;
    try {
      const csv = await adminService.exportReportCsv(type, accessToken);
      downloadCsv(`${type}-report.csv`, csv);
      addToast({ variant: "success", title: "Export ready", description: `${type} CSV downloaded` });
    } catch (error) {
      addToast({ variant: "destructive", title: "Export failed", description: extractApiErrorMessage(error) });
    }
  }

  return (
    <AdminLayout title="Report Center" subtitle="Date-filtered analytics and exportable reports">
      <section className="admin-card">
        <div className="grid gap-2 md:grid-cols-4">
          <input className="admin-input rounded border p-2" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          <input className="admin-input rounded border p-2" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          <button className="admin-btn" onClick={() => void load()}>Apply Range</button>
          <div className="flex gap-2">
            <button className="admin-btn" onClick={() => void exportType("revenue")}>Revenue CSV</button>
            <button className="admin-btn" onClick={() => void exportType("refunds")}>Refund CSV</button>
          </div>
        </div>
      </section>

      <section className="mt-4 grid gap-4 md:grid-cols-4">
        <div className="admin-card">New Users: {String(kpis?.new_users ?? "-")}</div>
        <div className="admin-card">Enrollments: {String(kpis?.enrollments ?? "-")}</div>
        <div className="admin-card">Revenue: {String(kpis?.revenue ?? "-")}</div>
        <div className="admin-card">Completions: {String(kpis?.lesson_completions ?? "-")}</div>
      </section>

      <section className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="admin-card"><h3 className="font-semibold">Revenue Rows</h3><p className="text-sm text-slate-300">{revenue.length}</p></div>
        <div className="admin-card"><h3 className="font-semibold">Coupon Rows</h3><p className="text-sm text-slate-300">{coupons.length}</p></div>
        <div className="admin-card"><h3 className="font-semibold">Refund Rows</h3><p className="text-sm text-slate-300">{refunds.length}</p></div>
      </section>
    </AdminLayout>
  );
}
