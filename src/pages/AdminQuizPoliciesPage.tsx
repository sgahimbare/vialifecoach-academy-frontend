import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAuth } from "@/context/AuthContext";
import { adminService, type QuizPolicy } from "@/services/adminService";
import { useToast } from "@/components/ui/toast";
import { extractApiErrorMessage } from "@/lib/apiError";

type ComplianceData = {
  summary?: Record<string, unknown>;
  by_course?: Array<Record<string, unknown>>;
};

export default function AdminQuizPoliciesPage() {
  const { accessToken } = useAuth();
  const { addToast } = useToast();
  const [policy, setPolicy] = useState<QuizPolicy | null>(null);
  const [compliance, setCompliance] = useState<ComplianceData>({});
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [conditionsText, setConditionsText] = useState("");
  const [processText, setProcessText] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!accessToken) return;
      try {
        const [p, c] = await Promise.all([
          adminService.getQuizPolicy(accessToken),
          adminService.getQuizPolicyCompliance(accessToken),
        ]);
        if (!mounted) return;
        setPolicy(p);
        setCompliance(c as ComplianceData);
        setConditionsText(Array.isArray(p.conditions) ? p.conditions.join("\n") : "");
        setProcessText(Array.isArray(p.process) ? p.process.join("\n") : "");
      } catch (error) {
        if (!mounted) return;
        setMessage("Unable to load quiz policy data.");
        addToast({ variant: "destructive", title: "Load failed", description: extractApiErrorMessage(error) });
      }
    }
    void load();
    return () => {
      mounted = false;
    };
  }, [accessToken]);

  function updateField<K extends keyof QuizPolicy>(key: K, value: QuizPolicy[K]) {
    if (!policy) return;
    setPolicy({ ...policy, [key]: value });
  }

  async function savePolicy() {
    if (!accessToken || !policy) return;
    setSaving(true);
    setMessage("");
    try {
      const payload: Partial<QuizPolicy> = {
        ...policy,
        conditions: conditionsText.split("\n").map((s) => s.trim()).filter(Boolean),
        process: processText.split("\n").map((s) => s.trim()).filter(Boolean),
      };
      const updated = await adminService.updateQuizPolicy(payload, accessToken);
      setPolicy(updated);
      setMessage("Quiz policy updated.");
    } catch (error) {
      setMessage("Failed to update quiz policy.");
      addToast({ variant: "destructive", title: "Save failed", description: extractApiErrorMessage(error) });
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout title="Quiz Policy" subtitle="Configure enforcement rules and monitor compliance.">
      {message ? <p className="mt-3 text-sm text-emerald-300">{message}</p> : null}

      {!policy ? (
        <p className="mt-6 text-slate-300">Loading policy...</p>
      ) : (
        <>
          <section className="admin-card mt-4">
            <h2 className="font-semibold">Policy Controls</h2>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={Boolean(policy.require_acknowledgement)} onChange={(e) => updateField("require_acknowledgement", e.target.checked)} />
                Require acknowledgement
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={Boolean(policy.block_copy_paste)} onChange={(e) => updateField("block_copy_paste", e.target.checked)} />
                Block copy/paste
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={Boolean(policy.block_right_click)} onChange={(e) => updateField("block_right_click", e.target.checked)} />
                Block right click
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={Boolean(policy.full_screen_required)} onChange={(e) => updateField("full_screen_required", e.target.checked)} />
                Require fullscreen
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={Boolean(policy.auto_submit_on_violation)} onChange={(e) => updateField("auto_submit_on_violation", e.target.checked)} />
                Auto-submit on violation
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={Boolean(policy.camera_required)} onChange={(e) => updateField("camera_required", e.target.checked)} />
                Camera required
              </label>
              <label className="flex items-center gap-2 md:col-span-2">
                <span className="text-sm text-slate-300">Tab switch limit</span>
                <input
                  className="admin-input w-28 rounded border p-2"
                  type="number"
                  min={0}
                  value={Number(policy.tab_switch_limit || 0)}
                  onChange={(e) => updateField("tab_switch_limit", Number(e.target.value))}
                />
              </label>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <textarea
                className="admin-input min-h-28 rounded border p-2"
                value={conditionsText}
                onChange={(e) => setConditionsText(e.target.value)}
                placeholder="Conditions, one per line"
              />
              <textarea
                className="admin-input min-h-28 rounded border p-2"
                value={processText}
                onChange={(e) => setProcessText(e.target.value)}
                placeholder="Process steps, one per line"
              />
            </div>

            <button className="admin-btn-primary mt-4" disabled={saving} onClick={() => void savePolicy()}>
              {saving ? "Saving..." : "Save Policy"}
            </button>
          </section>

          <section className="mt-4 grid gap-4 md:grid-cols-4">
            <div className="admin-card">
              <p className="text-sm text-slate-300">Total Acceptances</p>
              <p className="text-xl font-semibold">{String(compliance.summary?.total_acceptances ?? 0)}</p>
            </div>
            <div className="admin-card">
              <p className="text-sm text-slate-300">Total Violations</p>
              <p className="text-xl font-semibold">{String(compliance.summary?.total_violations ?? 0)}</p>
            </div>
            <div className="admin-card">
              <p className="text-sm text-slate-300">Total Attempts</p>
              <p className="text-xl font-semibold">{String(compliance.summary?.total_attempts ?? 0)}</p>
            </div>
            <div className="admin-card">
              <p className="text-sm text-slate-300">Passed Attempts</p>
              <p className="text-xl font-semibold">{String(compliance.summary?.passed_attempts ?? 0)}</p>
            </div>
          </section>

          <section className="admin-card mt-4">
            <h2 className="font-semibold">Compliance By Course</h2>
            <div className="mt-3 overflow-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead className="text-left text-slate-300">
                  <tr>
                    <th className="p-2">Course</th>
                    <th className="p-2">Accepted Users</th>
                    <th className="p-2">Violations</th>
                  </tr>
                </thead>
                <tbody>
                  {(compliance.by_course || []).map((row) => (
                    <tr key={String(row.course_id)} className="border-t border-slate-800">
                      <td className="p-2">{String(row.course_title || row.course_id)}</td>
                      <td className="p-2">{String(row.accepted_users || 0)}</td>
                      <td className="p-2">{String(row.violations || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </AdminLayout>
  );
}
