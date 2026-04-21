import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { adminService, type AdminUser } from "@/services/adminService";
import { extractApiErrorMessage } from "@/lib/apiError";
import { useToast } from "@/components/ui/toast";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

const roleOptions: AdminUser["role"][] = [
  "student",
  "lecturer",
  "instructor",
  "admin",
  "owner",
  "manager",
  "content_editor",
  "support",
];

export default function AdminUsersPage() {
  const { accessToken } = useAuth();
  const { addToast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const pageSize = 10;

  useEffect(() => {
    let isMounted = true;
    async function loadUsers() {
      if (!accessToken) return;
      try {
        const data = await adminService.getUsers(accessToken);
        if (isMounted) setUsers(data);
      } catch (error) {
        addToast({ variant: "destructive", title: "Load users failed", description: extractApiErrorMessage(error) });
        if (isMounted) setUsers([]);
      }
    }
    void loadUsers();
    return () => {
      isMounted = false;
    };
  }, [accessToken]);

  async function updateRole(userId: number, role: AdminUser["role"]) {
    if (!accessToken) return;
    setUpdatingUserId(userId);
    try {
      const updated = await adminService.updateUserRole(userId, role, accessToken);
      setUsers((previous) => previous.map((user) => (user.id === updated.id ? updated : user)));
      addToast({ variant: "success", title: "Role updated" });
    } catch (error) {
      addToast({ variant: "destructive", title: "Unable to update role", description: extractApiErrorMessage(error) });
    } finally {
      setUpdatingUserId(null);
    }
  }

  async function deleteUser(userId: number) {
    if (!accessToken) return;
    if (deleteTarget !== userId) return;
    setUpdatingUserId(userId);
    try {
      await adminService.deleteUser(userId, accessToken);
      setUsers((previous) => previous.filter((user) => user.id !== userId));
      addToast({ variant: "success", title: "User deleted" });
    } catch (error) {
      addToast({ variant: "destructive", title: "Unable to delete user", description: extractApiErrorMessage(error) });
    } finally {
      setUpdatingUserId(null);
    }
  }

  const filtered = users.filter((u) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || String(u.id).includes(q);
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <AdminLayout title="User Management" subtitle="Assign roles and control access">
      <section className="admin-card">
        <div className="flex items-center gap-2">
          <input
            className="admin-input w-full rounded border p-2"
            placeholder="Search users by id, name, email"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
          <button className="admin-btn" onClick={() => setQuery("")}>Clear</button>
        </div>
      </section>
      <div className="admin-card mt-6 overflow-auto rounded border">
        <table className="w-full min-w-[700px]">
          <thead className="bg-slate-900/70 text-left text-sm text-slate-200">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Current Role</th>
              <th className="p-3">Verified</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((user) => (
              <tr className="border-t border-slate-800" key={user.id}>
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.role}</td>
                <td className="p-3">{user.verified ? "Yes" : "No"}</td>
                <td className="p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      className="admin-input rounded border p-2 text-sm"
                      defaultValue={user.role}
                      onChange={(event) => updateRole(user.id, event.target.value as AdminUser["role"])}
                      disabled={updatingUserId === user.id}
                    >
                      {roleOptions.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="rounded border border-red-500/40 bg-red-900/30 px-2 py-1 text-xs text-red-200"
                      onClick={() => setDeleteTarget(user.id)}
                      disabled={updatingUserId === user.id}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex items-center justify-between text-sm text-slate-300">
        <span>
          Showing {paged.length} of {filtered.length}
        </span>
        <div className="flex gap-2">
          <button className="admin-btn" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
          <span className="self-center">Page {page}/{totalPages}</span>
          <button className="admin-btn" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</button>
        </div>
      </div>
      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete user?"
        description={`This will permanently remove user #${deleteTarget ?? ""}.`}
        confirmText="Delete"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget !== null) {
            void deleteUser(deleteTarget);
          }
          setDeleteTarget(null);
        }}
      />
    </AdminLayout>
  );
}
