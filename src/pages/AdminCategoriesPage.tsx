import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { adminService, type AdminCategory } from "@/services/adminService";
import { useToast } from "@/components/ui/toast";
import { extractApiErrorMessage } from "@/lib/apiError";

export default function AdminCategoriesPage() {
  const { accessToken } = useAuth();
  const { addToast } = useToast();
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [name, setName] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      if (!accessToken) return;
      try {
        const data = await adminService.getCategories(accessToken);
        if (isMounted) setCategories(data);
      } catch (error) {
        addToast({ variant: "destructive", title: "Load failed", description: extractApiErrorMessage(error) });
        if (isMounted) setCategories([]);
      }
    }
    void load();
    return () => {
      isMounted = false;
    };
  }, [accessToken]);

  async function createCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken || !name.trim()) return;
    setFeedback("");
    setIsSubmitting(true);
    try {
      const created = await adminService.createCategory({ name: name.trim() }, accessToken);
      setCategories((previous) => [created, ...previous]);
      setName("");
      setFeedback("Category created.");
      addToast({ variant: "success", title: "Category created" });
    } catch (error) {
      setFeedback("Unable to create category.");
      addToast({ variant: "destructive", title: "Create failed", description: extractApiErrorMessage(error) });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AdminLayout title="Admin Categories" subtitle="Manage course categories from backend data.">

      <form onSubmit={createCategory} className="mt-4 flex gap-2">
        <input
          className="admin-input w-full rounded border p-2"
          placeholder="Category name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="admin-btn-primary disabled:opacity-50"
        >
          {isSubmitting ? "Adding..." : "Add Category"}
        </button>
      </form>

      {feedback ? <p className="mt-3 text-sm text-emerald-300">{feedback}</p> : null}

      <div className="mt-6 space-y-2">
        {categories.map((category) => (
          <div key={category.id} className="admin-card">
            <p className="font-medium">{category.name}</p>
            <p className="text-xs text-slate-400">ID: {category.id}</p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
