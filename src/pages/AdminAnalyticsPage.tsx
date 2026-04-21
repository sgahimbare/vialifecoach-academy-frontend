import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { apiRequest } from "@/lib/api";

type TrafficOverview = {
  total_visits: number;
  unique_visitors: number;
  top_pages: Array<{ path: string; visits: number }>;
  geo?: Array<{ country_code: string; visits: number }>;
  referrers?: Array<{ referrer_domain: string; visits: number }>;
  daily_visits?: Array<{ day: string; visits: number }>;
};

type ShareLink = {
  id: number;
  slug: string;
  url: string;
  label?: string | null;
  shared_by_email?: string | null;
  shared_by_user_id?: number | null;
  created_at: string;
  click_count: number;
  last_click_at?: string | null;
};

type ShareOverview = {
  totals: { shares: number; clicks: number };
  links: ShareLink[];
  daily_clicks?: Array<{ day: string; clicks: number }>;
};

export default function AdminAnalyticsPage() {
  const { accessToken } = useAuth();
  const [traffic, setTraffic] = useState<TrafficOverview | null>(null);
  const [shares, setShares] = useState<ShareOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ url: "", label: "", shared_by_email: "" });
  const [activeVisitDay, setActiveVisitDay] = useState<string | null>(null);
  const [activeClickDay, setActiveClickDay] = useState<string | null>(null);
  const baseOrigin = useMemo(() => window.location.origin, []);
  const maxVisitValue = useMemo(() => {
    const values = traffic?.daily_visits?.map((day) => day.visits || 0) ?? [];
    return values.length ? Math.max(...values) : 0;
  }, [traffic]);

  const maxClickValue = useMemo(() => {
    const values = shares?.daily_clicks?.map((day) => day.clicks || 0) ?? [];
    return values.length ? Math.max(...values) : 0;
  }, [shares]);

  const maxBarHeight = 160;

  useEffect(() => {
    let alive = true;
    async function load() {
      if (!accessToken) return;
      try {
        const trafficRes = await apiRequest("/admin/analytics/traffic", { token: accessToken }) as any;
        const shareRes = await apiRequest("/admin/analytics/shares", { token: accessToken }) as any;
        if (!alive) return;
        setTraffic(trafficRes?.data || trafficRes);
        setShares(shareRes?.data || shareRes);
      } catch (error) {
        if (!alive) return;
        setTraffic(null);
        setShares(null);
      } finally {
        if (alive) setLoading(false);
      }
    }
    void load();
    return () => {
      alive = false;
    };
  }, [accessToken]);

  const handleCreateShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.url.trim()) return;
    try {
      const response = await apiRequest("/admin/analytics/share-links", {
        method: "POST",
        token: accessToken,
        body: JSON.stringify({
          url: form.url.trim(),
          label: form.label.trim() || null,
          shared_by_email: form.shared_by_email.trim() || null,
        }),
      }) as any;
      const created = response?.data || response;
      setShares((prev) => {
        if (!prev) return prev;
        return {
          totals: { ...prev.totals, shares: prev.totals.shares + 1 },
          links: [created, ...prev.links],
        };
      });
      setForm({ url: "", label: "", shared_by_email: "" });
    } catch (error) {
      console.error("Failed to create share link:", error);
    }
  };

  return (
    <AdminLayout title="Analytics" subtitle="Website visits, link shares, and click performance.">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="admin-card">
              <p className="text-sm text-slate-300">Total Visits</p>
              <p className="text-2xl font-bold text-white">{traffic?.total_visits ?? 0}</p>
            </div>
            <div className="admin-card">
              <p className="text-sm text-slate-300">Unique Visitors</p>
              <p className="text-2xl font-bold text-white">{traffic?.unique_visitors ?? 0}</p>
            </div>
            <div className="admin-card">
              <p className="text-sm text-slate-300">Total Shares</p>
              <p className="text-2xl font-bold text-white">{shares?.totals?.shares ?? 0}</p>
            </div>
            <div className="admin-card">
              <p className="text-sm text-slate-300">Total Clicks</p>
              <p className="text-2xl font-bold text-white">{shares?.totals?.clicks ?? 0}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="admin-card lg:col-span-2">
              <h3 className="text-lg font-semibold text-white mb-4">Shared Links</h3>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead className="admin-table-header">
                    <tr>
                      <th className="text-left px-4 py-3">Shared By</th>
                      <th className="text-left px-4 py-3">Label</th>
                      <th className="text-left px-4 py-3">Link</th>
                      <th className="text-left px-4 py-3">Clicks</th>
                      <th className="text-right px-4 py-3">Copy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(shares?.links || []).map((link) => (
                      <tr key={link.id} className="admin-table-row">
                        <td className="px-4 py-3 text-sm text-slate-100">
                          {link.shared_by_email || "Unknown"}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-200">{link.label || "-"}</td>
                        <td className="px-4 py-3 text-sm text-slate-200">
                          {link.url}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-100">{link.click_count || 0}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            className="admin-btn"
                            onClick={() => {
                              const shareUrl = `${baseOrigin}?share=${link.slug}`;
                              void navigator.clipboard.writeText(shareUrl);
                            }}
                          >
                            Copy Link
                          </button>
                        </td>
                      </tr>
                    ))}
                    {!shares?.links?.length ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-6 text-center text-slate-300">
                          No share links yet.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="admin-card">
              <h3 className="text-lg font-semibold text-white mb-4">Create Share Link</h3>
              <form className="space-y-3" onSubmit={handleCreateShare}>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">URL</label>
                  <input
                    value={form.url}
                    onChange={(e) => setForm((prev) => ({ ...prev, url: e.target.value }))}
                    placeholder="https://vialifecoach.org/..."
                    className="admin-input w-full rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Label</label>
                  <input
                    value={form.label}
                    onChange={(e) => setForm((prev) => ({ ...prev, label: e.target.value }))}
                    placeholder="Campaign / program name"
                    className="admin-input w-full rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Shared By (email)</label>
                  <input
                    value={form.shared_by_email}
                    onChange={(e) => setForm((prev) => ({ ...prev, shared_by_email: e.target.value }))}
                    placeholder="optional"
                    className="admin-input w-full rounded px-3 py-2"
                  />
                </div>
                <button type="submit" className="admin-btn-primary w-full">
                  Create Share Link
                </button>
              </form>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="admin-card">
              <h3 className="text-lg font-semibold text-white mb-4">Referral Sources</h3>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead className="admin-table-header">
                    <tr>
                      <th className="text-left px-4 py-3">Source</th>
                      <th className="text-left px-4 py-3">Visits</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(traffic?.referrers || []).map((row) => (
                      <tr key={row.referrer_domain} className="admin-table-row">
                        <td className="px-4 py-3 text-sm text-slate-100">{row.referrer_domain}</td>
                        <td className="px-4 py-3 text-sm text-slate-100">{row.visits}</td>
                      </tr>
                    ))}
                    {!traffic?.referrers?.length ? (
                      <tr>
                        <td colSpan={2} className="px-4 py-6 text-center text-slate-300">
                          No referral data yet.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="admin-card">
              <h3 className="text-lg font-semibold text-white mb-4">Geo (from browser locale)</h3>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead className="admin-table-header">
                    <tr>
                      <th className="text-left px-4 py-3">Country</th>
                      <th className="text-left px-4 py-3">Visits</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(traffic?.geo || []).map((row) => (
                      <tr key={row.country_code} className="admin-table-row">
                        <td className="px-4 py-3 text-sm text-slate-100">{row.country_code}</td>
                        <td className="px-4 py-3 text-sm text-slate-100">{row.visits}</td>
                      </tr>
                    ))}
                    {!traffic?.geo?.length ? (
                      <tr>
                        <td colSpan={2} className="px-4 py-6 text-center text-slate-300">
                          No geo data yet.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-slate-400">
                Geo is estimated from browser locale until IP-based lookup is added.
              </p>
            </div>
          </div>

          <div className="admin-card">
            <h3 className="text-lg font-semibold text-white mb-4">Daily Activity (last 14 days)</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-300 mb-3">Visits</p>
                <div className="flex items-end gap-2 h-40">
                  {(traffic?.daily_visits || []).map((day) => (
                    <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                      <div className="relative w-full h-full flex items-end justify-center group">
                        <button
                          type="button"
                          className="w-full rounded-md bg-cyan-500/60 focus:outline-none"
                          style={{ height: `${Math.max(8, maxVisitValue ? ((day.visits || 0) / maxVisitValue) * maxBarHeight : 8)}px` }}
                          title={`${day.visits ?? 0} visits (${maxVisitValue ? Math.round(((day.visits || 0) / maxVisitValue) * 100) : 0}%)`}
                          onClick={() =>
                            setActiveVisitDay((prev) => (prev === day.day ? null : day.day))
                          }
                        />
                        <span
                          className={`pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 rounded bg-slate-900/90 px-2 py-1 text-[10px] text-white opacity-0 transition ${activeVisitDay === day.day ? "opacity-100" : "group-hover:opacity-100"}`}
                        >
                          {maxVisitValue ? Math.round(((day.visits || 0) / maxVisitValue) * 100) : 0}%
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">{day.day}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-300 mb-3">Share Clicks</p>
                <div className="flex items-end gap-2 h-40">
                  {(shares?.daily_clicks || []).map((day) => (
                    <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                      <div className="relative w-full h-full flex items-end justify-center group">
                        <button
                          type="button"
                          className="w-full rounded-md bg-emerald-500/60 focus:outline-none"
                          style={{ height: `${Math.max(8, maxClickValue ? ((day.clicks || 0) / maxClickValue) * maxBarHeight : 8)}px` }}
                          title={`${day.clicks ?? 0} clicks (${maxClickValue ? Math.round(((day.clicks || 0) / maxClickValue) * 100) : 0}%)`}
                          onClick={() =>
                            setActiveClickDay((prev) => (prev === day.day ? null : day.day))
                          }
                        />
                        <span
                          className={`pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 rounded bg-slate-900/90 px-2 py-1 text-[10px] text-white opacity-0 transition ${activeClickDay === day.day ? "opacity-100" : "group-hover:opacity-100"}`}
                        >
                          {maxClickValue ? Math.round(((day.clicks || 0) / maxClickValue) * 100) : 0}%
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">{day.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="admin-card">
            <h3 className="text-lg font-semibold text-white mb-4">Top Pages</h3>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead className="admin-table-header">
                  <tr>
                    <th className="text-left px-4 py-3">Page</th>
                    <th className="text-left px-4 py-3">Visits</th>
                  </tr>
                </thead>
                <tbody>
                  {(traffic?.top_pages || []).map((page) => (
                    <tr key={page.path} className="admin-table-row">
                      <td className="px-4 py-3 text-sm text-slate-100">{page.path}</td>
                      <td className="px-4 py-3 text-sm text-slate-100">{page.visits}</td>
                    </tr>
                  ))}
                  {!traffic?.top_pages?.length ? (
                    <tr>
                      <td colSpan={2} className="px-4 py-6 text-center text-slate-300">
                        No visits recorded yet.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
