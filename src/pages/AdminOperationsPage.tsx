import { FormEvent, useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAuth } from "@/context/AuthContext";
import {
  adminService,
  type AdminCommunityMessage,
  type AdminKpiPayload,
  type AdminSuccessStory,
  type AdminTodayControls,
  type ScriptGenerationJob
} from "@/services/adminService";
import { certificateService, type Certificate } from "@/services/certificateService";
import { extractApiErrorMessage } from "@/lib/apiError";
import { useToast } from "@/components/ui/toast";
import { roleAccess } from "@/components/admin/roleAccess";

function downloadCsv(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminOperationsPage() {
  const { accessToken, user } = useAuth();
  const { addToast } = useToast();
  const [message, setMessage] = useState("");
  const [kpis, setKpis] = useState<AdminKpiPayload | null>(null);
  const [auditLogs, setAuditLogs] = useState<Record<string, unknown>[]>([]);
  const [selectedAuditLogs, setSelectedAuditLogs] = useState<Set<number>>(new Set());
  const [tickets, setTickets] = useState<Record<string, unknown>[]>([]);
  const [incidents, setIncidents] = useState<Record<string, unknown>[]>([]);
  const [jobs, setJobs] = useState<ScriptGenerationJob[]>([]);
  const [mediaAssets, setMediaAssets] = useState<Record<string, unknown>[]>([]);
  const [successStories, setSuccessStories] = useState<AdminSuccessStory[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Record<string, unknown> | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [certificateStats, setCertificateStats] = useState<any>(null);
  const [todayControls, setTodayControls] = useState<AdminTodayControls>({
    student_live_messages_enabled: true,
    student_profile_view_enabled: true,
    student_grades_detail_enabled: true,
  });
  const [communityMessages, setCommunityMessages] = useState<AdminCommunityMessage[]>([]);

  const [userId, setUserId] = useState("");
  const [suspendReason, setSuspendReason] = useState("Policy review");
  const [courseId, setCourseId] = useState("");
  const [snapshotNotes, setSnapshotNotes] = useState("Admin snapshot");
  const [bulkIds, setBulkIds] = useState("");
  const [bulkAction, setBulkAction] = useState<"publish" | "unpublish" | "archive" | "unarchive" | "delete">("publish");
  const [scriptText, setScriptText] = useState("Welcome\nThis is the first slide.\n\nFocus\nExecute daily.");
  const [settingKey, setSettingKey] = useState("site-brand");
  const [settingJson, setSettingJson] = useState('{"appName":"VialifeCoach","primaryColor":"#111827"}');
  const [flagKey, setFlagKey] = useState("new-editor");
  const [flagEnabled, setFlagEnabled] = useState(true);
  const [flagConfigJson, setFlagConfigJson] = useState('{"rollout":100}');
  const [mediaFilename, setMediaFilename] = useState("lesson.mp4");
  const [storyDisplayName, setStoryDisplayName] = useState("");
  const [storyRoleLabel, setStoryRoleLabel] = useState("");
  const [storyCourse, setStoryCourse] = useState("");
  const [storyImageUrl, setStoryImageUrl] = useState("");
  const [storyVideoUrl, setStoryVideoUrl] = useState("");
  const [storyRating, setStoryRating] = useState("5");
  const [storyBody, setStoryBody] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [auditQuery, setAuditQuery] = useState("");
  const [ticketQuery, setTicketQuery] = useState("");
  const [communityMessageQuery, setCommunityMessageQuery] = useState("");
  const [auditPage, setAuditPage] = useState(1);
  const [ticketPage, setTicketPage] = useState(1);
  const pageSize = 8;

  async function refreshData() {
    if (!accessToken) return;
    try {
      const results = await Promise.allSettled([
        adminService.getKpis(accessToken),
        adminService.getAuditLogs(accessToken),
        adminService.listSupportTickets(accessToken),
        adminService.getIncidents(accessToken),
        adminService.listGenerationJobs(accessToken),
        adminService.listMediaAssets(accessToken),
        adminService.listSuccessStories(accessToken),
        adminService.getTodayControls(accessToken),
        adminService.listCommunityMessages(accessToken, "", 80),
      ]);

      const [
        kpiRes,
        auditRes,
        ticketRes,
        incidentRes,
        jobRes,
        mediaRes,
        storyRes,
        controlsRes,
        communityRes,
      ] = results;

      if (kpiRes.status === "fulfilled") setKpis(kpiRes.value);
      if (auditRes.status === "fulfilled") setAuditLogs(auditRes.value);
      if (ticketRes.status === "fulfilled") setTickets(ticketRes.value);
      if (incidentRes.status === "fulfilled") setIncidents(incidentRes.value);
      if (jobRes.status === "fulfilled") setJobs(jobRes.value);
      if (mediaRes.status === "fulfilled") setMediaAssets(mediaRes.value);
      if (storyRes.status === "fulfilled") setSuccessStories(storyRes.value);
      if (controlsRes.status === "fulfilled") setTodayControls(controlsRes.value);
      if (communityRes.status === "fulfilled") setCommunityMessages(communityRes.value);

      const failedCount = results.filter((r) => r.status === "rejected").length;
      if (failedCount > 0) {
        setMessage(`Loaded with ${failedCount} section error(s).`);
      }

      loadCertificateStats();
      loadCertificates();
    } catch (error) {
      setMessage("Could not load some operations data.");
      addToast({ variant: "destructive", title: "Load failed", description: extractApiErrorMessage(error) });
    }
  }

  async function setTodayControl(key: keyof AdminTodayControls, value: boolean) {
    if (!accessToken) return;
    try {
      const updated = await adminService.updateTodayControls(accessToken, { [key]: value });
      setTodayControls(updated);
      setMessage(`Updated control: ${key} = ${value ? "ON" : "OFF"}`);
    } catch (error) {
      addToast({ variant: "destructive", title: "Control update failed", description: extractApiErrorMessage(error) });
    }
  }

  async function refreshCommunityMessages() {
    if (!accessToken) return;
    try {
      const rows = await adminService.listCommunityMessages(accessToken, communityMessageQuery, 120);
      setCommunityMessages(rows);
    } catch (error) {
      addToast({ variant: "destructive", title: "Load failed", description: extractApiErrorMessage(error) });
    }
  }

  async function moderateCommunityMessage(id: number, action: "delete" | "restore" | "edit" | "mark_read", content?: string) {
    if (!accessToken) return;
    try {
      await adminService.moderateCommunityMessage(accessToken, id, action, content);
      await refreshCommunityMessages();
      setMessage(`Message ${id} updated with action: ${action}`);
    } catch (error) {
      addToast({ variant: "destructive", title: "Moderation failed", description: extractApiErrorMessage(error) });
    }
  }

  useEffect(() => {
    void refreshData();
  }, [accessToken]);

  async function runUserAction(action: "suspend" | "reactivate" | "reset" | "verify" | "2fa_on" | "2fa_off") {
    if (!accessToken || !userId.trim()) return;
    try {
      const id = Number(userId);
      if (action === "suspend") await adminService.suspendUser(id, suspendReason, accessToken);
      if (action === "reactivate") await adminService.reactivateUser(id, accessToken);
      if (action === "reset") await adminService.forcePasswordReset(id, accessToken);
      if (action === "verify") await adminService.resendVerification(id, accessToken);
      if (action === "2fa_on") await adminService.toggle2fa(id, true, accessToken);
      if (action === "2fa_off") await adminService.toggle2fa(id, false, accessToken);
      setMessage(`User action "${action}" completed.`);
      await refreshData();
    } catch (error) {
      setMessage(`User action "${action}" failed.`);
      addToast({ variant: "destructive", title: "User action failed", description: extractApiErrorMessage(error) });
    }
  }

  async function runCourseOps(event: FormEvent) {
    event.preventDefault();
    if (!accessToken || !courseId.trim()) return;
    try {
      const id = Number(courseId);
      const checklist = await adminService.getCourseChecklist(id, accessToken);
      await adminService.createCourseSnapshot(id, snapshotNotes, accessToken);
      setMessage(`Checklist ready: ${String((checklist as { ready?: boolean }).ready ?? false)}. Snapshot saved.`);
      await refreshData();
    } catch (error) {
      setMessage("Course operations failed.");
      addToast({ variant: "destructive", title: "Course operation failed", description: extractApiErrorMessage(error) });
    }
  }

  async function runBulkAction() {
    if (!accessToken || !bulkIds.trim()) return;
    const ids = bulkIds.split(",").map((v) => Number(v.trim())).filter((v) => Number.isFinite(v) && v > 0);
    if (!ids.length) return;
    try {
      await adminService.bulkCourseAction(ids, bulkAction, accessToken);
      setMessage(`Bulk action "${bulkAction}" completed.`);
    } catch (error) {
      setMessage("Bulk action failed.");
      addToast({ variant: "destructive", title: "Bulk action failed", description: extractApiErrorMessage(error) });
    }
  }

  async function runScriptGeneration() {
    if (!accessToken || !scriptText.trim()) return;
    try {
      await adminService.createScriptToPptVideo(scriptText, accessToken);
      setMessage("Script generation job created.");
      await refreshData();
    } catch (error) {
      setMessage("Script generation failed.");
      addToast({ variant: "destructive", title: "Generation failed", description: extractApiErrorMessage(error) });
    }
  }

  async function saveSetting() {
    if (!accessToken) return;
    try {
      await adminService.updateSetting(settingKey, JSON.parse(settingJson), accessToken);
      setMessage("Setting saved.");
      await refreshData();
    } catch (error) {
      setMessage("Setting save failed. Check JSON.");
      addToast({ variant: "destructive", title: "Settings failed", description: extractApiErrorMessage(error) });
    }
  }

  async function saveFlag() {
    if (!accessToken) return;
    try {
      await adminService.updateFeatureFlag(flagKey, flagEnabled, JSON.parse(flagConfigJson), accessToken);
      setMessage("Feature flag saved.");
      await refreshData();
    } catch (error) {
      setMessage("Feature flag save failed. Check JSON.");
      addToast({ variant: "destructive", title: "Feature flag failed", description: extractApiErrorMessage(error) });
    }
  }

  async function registerMedia() {
    if (!accessToken) return;
    try {
      const intent = await adminService.createUploadIntent(
        { filename: mediaFilename, mime_type: "video/mp4", size_bytes: 1024, folder: "courses" },
        accessToken
      ) as { data?: { upload_url?: string } };
      const url = intent?.data?.upload_url || "";
      if (!url) throw new Error("No upload URL");
      await adminService.registerMediaAsset({ asset_url: url, asset_type: "video", mime_type: "video/mp4", size_bytes: 1024 }, accessToken);
      setMessage("Media intent + register done.");
      await refreshData();
    } catch (error) {
      setMessage("Media register failed.");
      addToast({ variant: "destructive", title: "Media register failed", description: extractApiErrorMessage(error) });
    }
  }

  async function exportCsv(type: "revenue" | "refunds" | "coupons") {
    if (!accessToken) return;
    try {
      const csv = await adminService.exportReportCsv(type, accessToken);
      downloadCsv(`${type}-report.csv`, csv);
      setMessage(`${type} CSV exported.`);
    } catch (error) {
      setMessage(`Export ${type} failed.`);
      addToast({ variant: "destructive", title: "Export failed", description: extractApiErrorMessage(error) });
    }
  }

  async function createSuccessStory() {
    if (!accessToken || !storyDisplayName.trim() || !storyBody.trim()) return;
    try {
      await adminService.createSuccessStory(
        {
          display_name: storyDisplayName.trim(),
          role_label: storyRoleLabel.trim() || null,
          course: storyCourse.trim() || null,
          image_url: storyImageUrl.trim() || null,
          video_url: storyVideoUrl.trim() || null,
          rating: Number(storyRating) || 5,
          story: storyBody.trim(),
          is_approved: true,
        },
        accessToken
      );
      setMessage("Success story published.");
      setStoryDisplayName("");
      setStoryRoleLabel("");
      setStoryCourse("");
      setStoryImageUrl("");
      setStoryVideoUrl("");
      setStoryRating("5");
      setStoryBody("");
      await refreshData();
    } catch (error) {
      setMessage("Publishing success story failed.");
      addToast({ variant: "destructive", title: "Success story failed", description: extractApiErrorMessage(error) });
    }
  }

  async function updateTicketStatus(ticketId: number, status: string) {
    if (!accessToken) return;
    try {
      await adminService.updateSupportTicket(ticketId, { status }, accessToken);
      setMessage(`Ticket ${ticketId} updated to ${status}`);
      await refreshData();
    } catch (error) {
      setMessage(`Failed to update ticket ${ticketId}`);
      addToast({ variant: "destructive", title: "Update failed", description: extractApiErrorMessage(error) });
    }
  }

  async function deleteTicket(ticketId: number) {
    if (!accessToken) return;
    if (!confirm(`Are you sure you want to delete ticket #${ticketId}? This action cannot be undone.`)) return;
    
    try {
      await adminService.deleteSupportTicket(ticketId, accessToken);
      setMessage(`Ticket #${ticketId} deleted successfully`);
      
      console.log('🔄 FRONTEND: About to refresh data...');
      // Refresh audit logs to get the new entry from backend
      await refreshData();
      console.log('✅ FRONTEND: Data refreshed successfully');
      
      removeItemCompletely(ticketId, true);
    } catch (error) {
      console.error('Delete failed:', error);
      setMessage(`Delete failed: ${error instanceof Error ? error.message : String(error)}`);
      addToast({ 
        variant: "destructive", 
        title: "Delete Failed", 
        description: error instanceof Error ? error.message : String(error)
      });
    }
  }

  async function deleteAuditLog(logId: number) {
    if (!accessToken) return;
    if (!confirm(`Are you sure you want to delete this audit log? This action cannot be undone.`)) return;
    
    try {
      await adminService.deleteAuditLog(logId, accessToken);
      setMessage(`Audit log deleted successfully`);
      
      // Remove from audit logs immediately
      setAuditLogs(prev => prev.filter(log => Number(log.id) !== logId));
      
    } catch (error) {
      console.error('Audit log delete failed:', error);
      setMessage(`Audit log delete failed: ${error instanceof Error ? error.message : String(error)}`);
      addToast({ 
        variant: "destructive", 
        title: "Delete Failed", 
        description: error instanceof Error ? error.message : String(error)
      });
    }
  }

  function toggleAuditLogSelection(logId: number) {
    setSelectedAuditLogs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(logId)) {
        newSet.delete(logId);
      } else {
        newSet.add(logId);
      }
      return newSet;
    });
  }

  function toggleAllAuditLogs() {
    if (selectedAuditLogs.size === auditLogs.length) {
      setSelectedAuditLogs(new Set());
    } else {
      setSelectedAuditLogs(new Set(auditLogs.map(log => Number(log.id))));
    }
  }

  async function deleteSelectedAuditLogs() {
    if (!accessToken) return;
    if (selectedAuditLogs.size === 0) {
      addToast({ variant: "default", title: "No Selection", description: "Please select audit logs to delete" });
      return;
    }
    
    if (!confirm(`Are you sure you want to delete ${selectedAuditLogs.size} audit log(s)? This action cannot be undone.`)) return;
    
    try {
      const deletePromises = Array.from(selectedAuditLogs).map(logId => 
        adminService.deleteAuditLog(logId, accessToken)
      );
      
      await Promise.all(deletePromises);
      
      setMessage(`${selectedAuditLogs.size} audit logs deleted successfully`);
      
      // Remove deleted logs from the list
      setAuditLogs(prev => prev.filter(log => !selectedAuditLogs.has(Number(log.id))));
      setSelectedAuditLogs(new Set());
      
      addToast({ 
        variant: "default", 
        title: "Bulk Delete Successful", 
        description: `${selectedAuditLogs.size} audit logs deleted`
      });
      
    } catch (error) {
      console.error('Bulk delete failed:', error);
      setMessage(`Bulk delete failed: ${error instanceof Error ? error.message : String(error)}`);
      addToast({ 
        variant: "destructive", 
        title: "Bulk Delete Failed", 
        description: error instanceof Error ? error.message : String(error)
      });
    }
  }

  async function deleteAllAuditLogs() {
    if (!accessToken) return;
    if (auditLogs.length === 0) {
      addToast({ variant: "default", title: "No Logs", description: "No audit logs to delete" });
      return;
    }
    
    if (!confirm(`Are you sure you want to delete ALL ${auditLogs.length} audit logs? This action cannot be undone.`)) return;
    
    try {
      const deletePromises = auditLogs.map(log => 
        adminService.deleteAuditLog(Number(log.id), accessToken)
      );
      
      await Promise.all(deletePromises);
      
      setMessage(`All ${auditLogs.length} audit logs deleted successfully`);
      setAuditLogs([]);
      setSelectedAuditLogs(new Set());
      
      addToast({ 
        variant: "default", 
        title: "All Logs Deleted", 
        description: `All ${auditLogs.length} audit logs deleted`
      });
      
    } catch (error) {
      console.error('Delete all failed:', error);
      setMessage(`Delete all failed: ${error instanceof Error ? error.message : String(error)}`);
      addToast({ 
        variant: "destructive", 
        title: "Delete All Failed", 
        description: error instanceof Error ? error.message : String(error)
      });
    }
  }

  function viewTicketDetails(ticket: Record<string, unknown>) {
    setSelectedTicket(ticket);
  }

  // Certificate functions
  async function loadCertificateStats() {
    if (!accessToken) return;
    try {
      const stats = await certificateService.getCertificateStats(accessToken);
      setCertificateStats(stats);
    } catch (error) {
      console.error('Failed to load certificate stats:', error);
    }
  }

  async function generateCertificate(studentId: string, courseId: string) {
    if (!accessToken) return;
    try {
      const certificate = await certificateService.generateCertificate(studentId, courseId, accessToken);
      setMessage(`Certificate generated: ${certificate.certificate_code}`);
      loadCertificates();
      addToast({
        variant: "default",
        title: "Certificate Generated",
        description: `Certificate ${certificate.certificate_code} created successfully`
      });
    } catch (error) {
      console.error('Generate certificate failed:', error);
      setMessage(`Generate certificate failed: ${error instanceof Error ? error.message : String(error)}`);
      addToast({
        variant: "destructive",
        title: "Generation Failed",
        description: error instanceof Error ? error.message : String(error)
      });
    }
  }

  async function loadCertificates() {
    if (!accessToken) return;
    try {
      // Load recent certificates for admin view
      const result = await certificateService.searchCertificates("", {}, accessToken);
      setCertificates(result.certificates.slice(0, 10)); // Show recent 10
    } catch (error) {
      console.error('Failed to load certificates:', error);
    }
  }

  async function revokeCertificate(certificateId: string, reason: string) {
    if (!accessToken) return;
    if (!confirm(`Are you sure you want to revoke this certificate? Reason: ${reason}`)) return;
    
    try {
      await certificateService.revokeCertificate(certificateId, reason, accessToken);
      setMessage('Certificate revoked successfully');
      loadCertificates();
      addToast({
        variant: "default",
        title: "Certificate Revoked",
        description: "Certificate has been revoked"
      });
    } catch (error) {
      console.error('Revoke certificate failed:', error);
      setMessage(`Revoke certificate failed: ${error instanceof Error ? error.message : String(error)}`);
      addToast({
        variant: "destructive",
        title: "Revoke Failed",
        description: error instanceof Error ? error.message : String(error)
      });
    }
  }

  function onDropFile(file: File | null) {
    if (!file) return;
    setMediaFilename(file.name);
    setMessage(`Loaded file: ${file.name}`);
  }

  // Pagination calculations
  const filteredAudit = auditLogs.filter((row) => JSON.stringify(row).toLowerCase().includes(auditQuery.toLowerCase()));
  const filteredTickets = tickets.filter((row) => JSON.stringify(row).toLowerCase().includes(ticketQuery.toLowerCase()));
  
  const auditTotalPages = Math.max(1, Math.ceil(filteredAudit.length / pageSize));
  const ticketTotalPages = Math.max(1, Math.ceil(filteredTickets.length / pageSize));
  const pagedAudit = filteredAudit.slice((auditPage - 1) * pageSize, auditPage * pageSize);
  const pagedTickets = filteredTickets.slice((ticketPage - 1) * pageSize, ticketPage * pageSize);

  // Function to completely remove items
  const removeItemCompletely = (id: number, isTicket: boolean = true) => {
    if (isTicket) {
      setTickets(prev => prev.filter(item => Number(item.id) !== id));
      if (selectedTicket && Number(selectedTicket.id) === id) {
        setSelectedTicket(null);
      }
    } else {
      setAuditLogs(prev => prev.filter(item => Number(item.id) !== id));
    }
  };

  return (
    <AdminLayout title="Admin Operations" subtitle="Professional controls: KPI, lifecycle, reporting, media, settings, support, audit.">
      {message ? <p className="mb-4 rounded border border-slate-700 bg-slate-900 p-2 text-sm text-emerald-300">{message}</p> : null}

      <section className="grid gap-4 md:grid-cols-4">
        <div className="admin-card">New Users: {String(kpis?.kpis?.new_users ?? "-")}</div>
        <div className="admin-card">Enrollments: {String(kpis?.kpis?.enrollments ?? "-")}</div>
        <div className="admin-card">Revenue: {String(kpis?.kpis?.revenue ?? "-")}</div>
        <div className="admin-card">Lesson Completions: {String(kpis?.kpis?.lesson_completions ?? "-")}</div>
      </section>

      <section className="admin-card mt-5">
        <h2 className="font-semibold">User Lifecycle</h2>
        <div className="mt-3 grid gap-2 md:grid-cols-4">
          <input className="admin-input rounded border p-2" placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
          <input className="admin-input rounded border p-2" placeholder="Suspend reason" value={suspendReason} onChange={(e) => setSuspendReason(e.target.value)} />
          <button type="button" className="admin-btn" disabled={!roleAccess.canManageUsers(user?.role)} onClick={() => void runUserAction("suspend")}>Suspend</button>
          <button type="button" className="admin-btn" onClick={() => void runUserAction("reactivate")}>Reactivate</button>
          <button type="button" className="admin-btn" onClick={() => void runUserAction("reset")}>Force Reset</button>
          <button type="button" className="admin-btn" onClick={() => void runUserAction("verify")}>Resend Verify</button>
          <button type="button" className="admin-btn" onClick={() => void runUserAction("2fa_on")}>2FA On</button>
          <button type="button" className="admin-btn" onClick={() => void runUserAction("2fa_off")}>2FA Off</button>
        </div>
      </section>

      <section className="admin-card mt-5">
        <h2 className="font-semibold">Course Ops</h2>
        <form className="mt-3 grid gap-2 md:grid-cols-3" onSubmit={runCourseOps}>
          <input className="admin-input rounded border p-2" placeholder="Course ID" value={courseId} onChange={(e) => setCourseId(e.target.value)} />
          <input className="admin-input rounded border p-2" placeholder="Snapshot notes" value={snapshotNotes} onChange={(e) => setSnapshotNotes(e.target.value)} />
          <button className="admin-btn" type="submit">Checklist + Snapshot</button>
        </form>
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <input className="admin-input rounded border p-2" placeholder="Bulk IDs: 1,2,3" value={bulkIds} onChange={(e) => setBulkIds(e.target.value)} />
          <select className="admin-input rounded border p-2" value={bulkAction} onChange={(e) => setBulkAction(e.target.value as typeof bulkAction)}>
            <option value="publish">publish</option>
            <option value="unpublish">unpublish</option>
            <option value="archive">archive</option>
            <option value="unarchive">unarchive</option>
            <option value="delete">delete</option>
          </select>
          <button type="button" className="admin-btn" onClick={() => void runBulkAction()}>Run Bulk Action</button>
        </div>
      </section>

      <section className="admin-card mt-5">
        <h2 className="font-semibold">Script To PPT/Video</h2>
        <textarea className="admin-input mt-3 min-h-28 w-full rounded border p-2" value={scriptText} onChange={(e) => setScriptText(e.target.value)} />
        <button type="button" className="admin-btn mt-2" onClick={() => void runScriptGeneration()}>
          Generate Slides Job
        </button>
        <p className="mt-2 text-xs text-slate-400">Jobs: {jobs.length}</p>
      </section>

      <section className="admin-card mt-5">
        <h2 className="font-semibold">Media + Reports</h2>
        <div
          className={`mt-3 rounded border border-dashed p-4 text-center ${dragActive ? "border-cyan-400 bg-cyan-900/20" : "border-slate-600"}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            onDropFile(e.dataTransfer.files?.[0] || null);
          }}
        >
          Drag and drop media file here
          <input
            type="file"
            className="mt-2 block w-full text-sm"
            onChange={(e) => onDropFile(e.target.files?.[0] || null)}
          />
        </div>
        <div className="mt-3 grid gap-2 md:grid-cols-4">
          <input className="admin-input rounded border p-2" value={mediaFilename} onChange={(e) => setMediaFilename(e.target.value)} />
          <button type="button" className="admin-btn" onClick={() => void registerMedia()}>Create Upload + Register</button>
          <button type="button" className="admin-btn" onClick={() => void exportCsv("revenue")}>Export Revenue CSV</button>
          <button type="button" className="admin-btn" onClick={() => void exportCsv("refunds")}>Export Refunds CSV</button>
        </div>
        <p className="mt-2 text-xs text-slate-400">Media assets: {mediaAssets.length}</p>
      </section>

      <section className="admin-card mt-5">
        <h2 className="font-semibold">Success Stories Template</h2>
        <p className="mt-1 text-xs text-slate-400">Add story giver details, image link and optional video link to appear on Success Stories page.</p>
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <input className="admin-input rounded border p-2" placeholder="Story giver name" value={storyDisplayName} onChange={(e) => setStoryDisplayName(e.target.value)} />
          <input className="admin-input rounded border p-2" placeholder="Role label" value={storyRoleLabel} onChange={(e) => setStoryRoleLabel(e.target.value)} />
          <input className="admin-input rounded border p-2" placeholder="Course / Program" value={storyCourse} onChange={(e) => setStoryCourse(e.target.value)} />
          <input className="admin-input rounded border p-2 md:col-span-2" placeholder="Image URL" value={storyImageUrl} onChange={(e) => setStoryImageUrl(e.target.value)} />
          <input className="admin-input rounded border p-2" placeholder="Rating (1-5)" value={storyRating} onChange={(e) => setStoryRating(e.target.value)} />
          <input className="admin-input rounded border p-2 md:col-span-3" placeholder="Video URL (YouTube embed or direct link)" value={storyVideoUrl} onChange={(e) => setStoryVideoUrl(e.target.value)} />
          <textarea className="admin-input rounded border p-2 md:col-span-3 min-h-24" placeholder="Success story text" value={storyBody} onChange={(e) => setStoryBody(e.target.value)} />
          <button type="button" className="admin-btn md:col-span-3" onClick={() => void createSuccessStory()}>Publish Success Story</button>
        </div>
        <div className="mt-4 overflow-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="text-left text-slate-300">
              <tr>
                <th className="p-2">ID</th>
                <th className="p-2">Name</th>
                <th className="p-2">Role</th>
                <th className="p-2">Image</th>
                <th className="p-2">Video</th>
              </tr>
            </thead>
            <tbody>
              {successStories.slice(0, 8).map((row) => (
                <tr key={row.id} className="border-t border-slate-800">
                  <td className="p-2">{row.id}</td>
                  <td className="p-2">{row.display_name}</td>
                  <td className="p-2">{row.role_label || "-"}</td>
                  <td className="p-2">{row.image_url ? "Yes" : "No"}</td>
                  <td className="p-2">{row.video_url ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-card mt-5">
        <h2 className="font-semibold">Settings + Feature Flags</h2>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          <input className="admin-input rounded border p-2" value={settingKey} onChange={(e) => setSettingKey(e.target.value)} />
          <button type="button" className="admin-btn" disabled={!roleAccess.canManageSettings(user?.role)} onClick={() => void saveSetting()}>Save Setting JSON</button>
          <textarea className="admin-input rounded border p-2 md:col-span-2" value={settingJson} onChange={(e) => setSettingJson(e.target.value)} />
          <input className="admin-input rounded border p-2" value={flagKey} onChange={(e) => setFlagKey(e.target.value)} />
          <label className="flex items-center gap-2 rounded border border-slate-700 bg-slate-900 p-2">
            <input type="checkbox" checked={flagEnabled} onChange={(e) => setFlagEnabled(e.target.checked)} />
            Enabled
          </label>
          <textarea className="admin-input rounded border p-2 md:col-span-2" value={flagConfigJson} onChange={(e) => setFlagConfigJson(e.target.value)} />
          <button type="button" className="admin-btn md:col-span-2" disabled={!roleAccess.canManageSettings(user?.role)} onClick={() => void saveFlag()}>Save Feature Flag</button>
        </div>
      </section>

      <section className="admin-card mt-5">
        <h2 className="font-semibold">Today Changes Control Center</h2>
        <p className="mt-1 text-sm text-slate-300">Enable/disable new student-board experiences instantly.</p>
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <label className="flex items-center justify-between rounded border border-slate-700 bg-slate-900 p-3">
            <span className="text-sm">Live Messages</span>
            <input
              type="checkbox"
              checked={todayControls.student_live_messages_enabled}
              onChange={(e) => void setTodayControl("student_live_messages_enabled", e.target.checked)}
            />
          </label>
          <label className="flex items-center justify-between rounded border border-slate-700 bg-slate-900 p-3">
            <span className="text-sm">Profile View</span>
            <input
              type="checkbox"
              checked={todayControls.student_profile_view_enabled}
              onChange={(e) => void setTodayControl("student_profile_view_enabled", e.target.checked)}
            />
          </label>
          <label className="flex items-center justify-between rounded border border-slate-700 bg-slate-900 p-3">
            <span className="text-sm">Detailed Grades</span>
            <input
              type="checkbox"
              checked={todayControls.student_grades_detail_enabled}
              onChange={(e) => void setTodayControl("student_grades_detail_enabled", e.target.checked)}
            />
          </label>
        </div>
      </section>

      <section className="admin-card mt-5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-semibold">Live Message Moderation</h2>
          <button type="button" className="admin-btn" onClick={() => void refreshCommunityMessages()}>Refresh</button>
        </div>
        <div className="mt-2 flex gap-2">
          <input
            className="admin-input w-full rounded border p-2"
            placeholder="Search sender, recipient, or message..."
            value={communityMessageQuery}
            onChange={(e) => setCommunityMessageQuery(e.target.value)}
          />
          <button type="button" className="admin-btn" onClick={() => void refreshCommunityMessages()}>Search</button>
        </div>
        <div className="mt-3 overflow-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead className="text-left text-slate-300">
              <tr>
                <th className="p-2">ID</th>
                <th className="p-2">Sender</th>
                <th className="p-2">Recipient</th>
                <th className="p-2">Message</th>
                <th className="p-2">Flags</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {communityMessages.map((m) => (
                <tr key={m.id} className="border-t border-slate-800">
                  <td className="p-2">{m.id}</td>
                  <td className="p-2">{m.sender_name || m.sender_id}</td>
                  <td className="p-2">{m.recipient_name || m.recipient_id}</td>
                  <td className="p-2 max-w-[420px] whitespace-pre-wrap break-words">{m.content}</td>
                  <td className="p-2">
                    <span className="mr-2">{m.is_deleted ? "deleted" : "-"}</span>
                    <span>{m.is_read ? "read" : "unread"}</span>
                  </td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <button className="admin-btn" onClick={() => void moderateCommunityMessage(m.id, "mark_read")}>Mark Read</button>
                      {!m.is_deleted ? (
                        <button className="admin-btn bg-red-700 hover:bg-red-600" onClick={() => void moderateCommunityMessage(m.id, "delete")}>Delete</button>
                      ) : (
                        <button className="admin-btn bg-emerald-700 hover:bg-emerald-600" onClick={() => void moderateCommunityMessage(m.id, "restore")}>Restore</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {communityMessages.length === 0 ? (
                <tr>
                  <td className="p-3 text-slate-400" colSpan={6}>No community messages found.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="admin-card">
          <h3 className="font-semibold">Support Tickets</h3>
          <p className="text-sm text-slate-300">{tickets.length} ticket(s)</p>
        </div>
        <div className="admin-card">
          <h3 className="font-semibold">Incidents</h3>
          <p className="text-sm text-slate-300">{incidents.length} incident(s)</p>
        </div>
        <div className="admin-card">
          <h3 className="font-semibold">Audit Logs</h3>
          <p className="text-sm text-slate-300">{auditLogs.length} log entries</p>
        </div>
      </section>

      <section className="admin-card mt-5">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold">Support Tickets</h3>
            <p className="text-sm text-slate-300">{tickets.length} total tickets</p>
          </div>
          <a 
            href="/admin/support-tickets"
            className="admin-btn bg-sky-700 hover:bg-sky-600"
          >
            Manage Tickets →
          </a>
        </div>
        <div className="mt-3 overflow-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="text-left text-slate-300">
              <tr>
                <th className="p-2">ID</th>
                <th className="p-2">Subject</th>
                <th className="p-2">Status</th>
                <th className="p-2">Priority</th>
                <th className="p-2">Updated</th>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
              </tr>
            </thead>
            <tbody>
              {tickets.slice(0, 5).map((t) => (
                <tr 
                  key={String(t.id)} 
                  className="border-t border-slate-800 hover:bg-slate-800 cursor-pointer"
                  onClick={() => viewTicketDetails(t)}
                >
                  <td className="p-2">{String(t.id)}</td>
                  <td className="p-2">{String(t.subject ?? "-")}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      String(t.status) === 'open' ? 'bg-red-900 text-red-200' :
                      String(t.status) === 'in_progress' ? 'bg-yellow-900 text-yellow-200' :
                      String(t.status) === 'resolved' ? 'bg-green-900 text-green-200' :
                      'bg-slate-700 text-slate-300'
                    }`}>
                      {String(t.status ?? "-")}
                    </span>
                  </td>
                  <td className="p-2">{String(t.priority ?? "-")}</td>
                  <td className="p-2">{String(t.updated_at ?? "-")}</td>
                  <td className="p-2">{String(t.requester_name || t.name || "-")}</td>
                  <td className="p-2">{String(t.requester_email || t.email || "-")}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {tickets.length > 5 && (
            <div className="mt-2 text-center text-sm text-slate-400">
              Showing 5 of {tickets.length} tickets. <a href="/admin/support-tickets" className="text-sky-400 hover:text-sky-300">View all →</a>
            </div>
          )}
        </div>
      </section>

      <section className="admin-card mt-5">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Audit Timeline</h3>
          <div className="flex gap-2">
            <button 
              className="admin-btn bg-red-700 hover:bg-red-600 text-xs px-3 py-1"
              onClick={deleteAllAuditLogs}
              disabled={auditLogs.length === 0}
            >
              Delete All ({auditLogs.length})
            </button>
            <button 
              className="admin-btn bg-orange-700 hover:bg-orange-600 text-xs px-3 py-1"
              onClick={deleteSelectedAuditLogs}
              disabled={selectedAuditLogs.size === 0}
            >
              Delete Selected ({selectedAuditLogs.size})
            </button>
          </div>
        </div>
        <div className="mt-2 flex gap-2">
          <input
            className="admin-input w-full rounded border p-2"
            placeholder="Search audit logs"
            value={auditQuery}
            onChange={(e) => {
              setAuditQuery(e.target.value);
              setAuditPage(1);
            }}
          />
        </div>
        <div className="mt-3 overflow-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="text-left text-slate-300">
              <tr>
                <th className="p-2">
                  <input
                    type="checkbox"
                    checked={selectedAuditLogs.size === auditLogs.length && auditLogs.length > 0}
                    onChange={toggleAllAuditLogs}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="p-2">ID</th>
                <th className="p-2">User</th>
                <th className="p-2">Action</th>
                <th className="p-2">IP</th>
                <th className="p-2">Timestamp</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagedAudit.map((log) => (
                <tr key={String(log.id)} className="border-t border-slate-800">
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={selectedAuditLogs.has(Number(log.id))}
                      onChange={() => toggleAuditLogSelection(Number(log.id))}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="p-2">{String(log.id)}</td>
                  <td className="p-2">{String(log.actor_email ?? log.actor_user_id ?? "-")}</td>
                  <td className="p-2">{String(log.action ?? "-")}</td>
                  <td className="p-2">{String((log.details as Record<string, unknown> | undefined)?.ip_address ?? "-")}</td>
                  <td className="p-2">{String(log.created_at ?? "-")}</td>
                  <td className="p-2">
                    <button 
                      className="admin-btn bg-red-700 hover:bg-red-600 text-xs px-2 py-1"
                      onClick={() => deleteAuditLog(Number(log.id))}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 flex justify-end gap-2">
          <button className="admin-btn" disabled={auditPage <= 1} onClick={() => setAuditPage((p) => Math.max(1, p - 1))}>Prev</button>
          <span className="self-center text-sm text-slate-300">{auditPage}/{auditTotalPages}</span>
          <button className="admin-btn" disabled={auditPage >= auditTotalPages} onClick={() => setAuditPage((p) => Math.min(auditTotalPages, p + 1))}>Next</button>
        </div>
      </section>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-white">Ticket #{String(selectedTicket.id)}</h3>
              <button 
                onClick={() => setSelectedTicket(null)}
                className="text-slate-400 hover:text-white text-2xl leading-none"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-slate-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-3">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-400 block mb-1">Name</label>
                    <p className="text-white font-medium text-lg">
                      {String(selectedTicket.requester_name || selectedTicket.name || "Unknown")}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 block mb-1">Email Address</label>
                    <p className="text-white font-medium text-lg">
                      {String(selectedTicket.requester_email || selectedTicket.email || "Unknown")}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 block mb-1">Category</label>
                    <p className="text-white">{String(selectedTicket.category || "-")}</p>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 block mb-1">Status</label>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      String(selectedTicket.status) === 'open' ? 'bg-red-900 text-red-200' :
                      String(selectedTicket.status) === 'in-progress' ? 'bg-yellow-900 text-yellow-200' :
                      String(selectedTicket.status) === 'resolved' ? 'bg-green-900 text-green-200' :
                      'bg-slate-600 text-slate-300'
                    }`}>
                      {String(selectedTicket.status || "-")}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-slate-400 block mb-2">Subject</label>
                <p className="text-white font-medium text-lg bg-slate-700 p-3 rounded">
                  {String(selectedTicket.subject || selectedTicket.title || "-")}
                </p>
              </div>
              
              <div>
                <label className="text-sm text-slate-400 block mb-2">Message</label>
                <div className="bg-slate-700 p-4 rounded-lg max-h-60 overflow-y-auto">
                  <p className="text-white whitespace-pre-wrap leading-relaxed">
                    {String(selectedTicket.message || selectedTicket.description || selectedTicket.content || "-")}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="text-slate-400">Created</label>
                  <p className="text-white">{String(selectedTicket.created_at ?? "-")}</p>
                </div>
                <div>
                  <label className="text-slate-400">Last Updated</label>
                  <p className="text-white">{String(selectedTicket.updated_at ?? "-")}</p>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4 border-t border-slate-700">
                <button 
                  className="admin-btn bg-green-700 hover:bg-green-600"
                  onClick={() => updateTicketStatus(Number(selectedTicket.id), 'resolved')}
                >
                  Mark Resolved
                </button>
                <button 
                  className="admin-btn bg-yellow-700 hover:bg-yellow-600"
                  onClick={() => updateTicketStatus(Number(selectedTicket.id), 'in-progress')}
                >
                  In Progress
                </button>
                <button 
                  className="admin-btn bg-red-700 hover:bg-red-600"
                  onClick={() => updateTicketStatus(Number(selectedTicket.id), 'open')}
                >
                  Reopen
                </button>
                <button 
                  className="admin-btn bg-red-900 hover:bg-red-800 ml-auto"
                  onClick={() => deleteTicket(Number(selectedTicket.id))}
                >
                  Delete Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Management Section */}
      <section className="bg-slate-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          🎓 Certificate Management
        </h2>
        
        {/* Certificate Stats */}
        {certificateStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-700 rounded p-4">
              <h3 className="text-sm text-slate-400 mb-1">Total Issued</h3>
              <p className="text-2xl font-bold text-white">{certificateStats.total_issued}</p>
            </div>
            <div className="bg-slate-700 rounded p-4">
              <h3 className="text-sm text-slate-400 mb-1">This Month</h3>
              <p className="text-2xl font-bold text-green-400">{certificateStats.issued_this_month}</p>
            </div>
            <div className="bg-slate-700 rounded p-4">
              <h3 className="text-sm text-slate-400 mb-1">Popular Course</h3>
              <p className="text-lg font-bold text-blue-400">
                {certificateStats.popular_courses[0]?.course_title || "N/A"}
              </p>
            </div>
          </div>
        )}

        {/* Certificate Generation */}
        <div className="bg-slate-700 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Generate Certificate</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Student ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="admin-input"
            />
            <input
              type="text"
              placeholder="Course ID"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="admin-input"
            />
            <button
              onClick={() => generateCertificate(userId, courseId)}
              className="admin-btn"
              disabled={!userId || !courseId}
            >
              Generate Certificate
            </button>
          </div>
        </div>

        {/* Recent Certificates */}
        <div className="bg-slate-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Recent Certificates</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-slate-300">
                <tr>
                  <th className="p-2">Certificate ID</th>
                  <th className="p-2">Student</th>
                  <th className="p-2">Course</th>
                  <th className="p-2">Issue Date</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((cert) => (
                  <tr key={cert.id} className="border-t border-slate-600">
                    <td className="p-2 font-mono text-xs">{cert.certificate_code}</td>
                    <td className="p-2">{cert.student_name}</td>
                    <td className="p-2">{cert.course_title}</td>
                    <td className="p-2">{new Date(cert.issue_date).toLocaleDateString()}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        cert.status === 'issued' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {cert.status}
                      </span>
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => revokeCertificate(cert.id, "Administrative action")}
                        className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                        disabled={cert.status !== 'issued'}
                      >
                        Revoke
                      </button>
                    </td>
                  </tr>
                ))}
                {certificates.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-slate-400">
                      No certificates found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}
