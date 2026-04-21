import { useState, useEffect } from "react";
import { 
  Plus, 
  Edit, 
  Eye, 
  Target,
  Award,
  TrendingUp,
  BarChart3
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import ProgramPreview from "./ProgramPreview";

interface Program {
  id: string;
  name: string;
  description: string;
  type: 'scholarship' | 'therapeutic' | 'leadership' | 'business';
  deadline?: string | null;
  openDate?: string | null;
  status?: 'active' | 'closed' | 'draft' | 'archived';
}

interface ProgramsSectionProps {
  accessToken: string;
}

export default function ProgramsSection({ accessToken }: ProgramsSectionProps) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [previewProgram, setPreviewProgram] = useState<Program | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "scholarship" as Program['type'],
    deadline: "",
    openDate: "",
    status: "active" as Program['status']
  });

  useEffect(() => {
    loadPrograms();
  }, [accessToken]);

  async function loadPrograms() {
    try {
      setLoading(true);
      const response = await apiRequest('/admin/programs', { token: accessToken }) as any;
      if (response?.success) {
        const raw = response.data || [];
        const normalized = raw.map((item: any) => ({
          id: item.id || item.code,
          name: item.name,
          description: item.description,
          type: item.type,
          openDate: item.openDate || item.open_date,
          deadline: item.deadline,
          status: item.status
        })) as Program[];
        setPrograms(normalized);
      }
    } catch (err) {
      console.error('Error loading programs:', err);
    } finally {
      setLoading(false);
    }
  }

  const formatDateInput = (value?: string | null) => {
    if (!value) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "";
    return parsed.toISOString().slice(0, 10);
  };

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken) return;

    try {
      if (!editingProgram) return;
      const payload = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        openDate: formData.openDate || null,
        deadline: formData.deadline || null,
        status: formData.status || "active"
      };

      const response = await apiRequest(`/admin/programs/${editingProgram.id}`, {
        method: "PUT",
        token: accessToken,
        body: JSON.stringify(payload)
      }) as any;

      if (!response?.success) {
        throw new Error(response?.error || "Failed to update program");
      }

      const updated = response.data || response;
      setPrograms(prev => prev.map(program =>
        program.id === editingProgram.id
          ? {
              ...program,
              name: updated.name ?? program.name,
              description: updated.description ?? program.description,
              type: updated.type ?? program.type,
              deadline: updated.deadline ?? program.deadline,
              status: updated.status ?? program.status
            }
          : program
      ));

      alert(`Program "${formData.name}" updated successfully!`);
      setShowForm(false);
      setEditingProgram(null);
    } catch (err) {
      console.error('Error saving program:', err);
    }
  }

  function handlePreview(program: Program) {
    setPreviewProgram(program);
  }

  function handleEdit(program: Program) {
    setEditingProgram(program);
    setFormData({
      name: program.name,
      description: program.description,
      type: program.type,
      openDate: formatDateInput(program.openDate),
      deadline: formatDateInput(program.deadline),
      status: (program.status || "active") as Program['status']
    });
    setShowForm(true);
  }

  function handleCancel() {
    setShowForm(false);
    setEditingProgram(null);
    setFormData({
      name: "",
      description: "",
      type: "scholarship",
      openDate: "",
      deadline: "",
      status: "active"
    });
  }

  const getProgramIcon = (type: string) => {
    switch (type) {
      case 'scholarship': return <Award className="w-5 h-5" />;
      case 'therapeutic': return <Target className="w-5 h-5" />;
      case 'leadership': return <TrendingUp className="w-5 h-5" />;
      case 'business': return <BarChart3 className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  const getProgramColor = (type: string) => {
    switch (type) {
      case 'scholarship': return 'bg-purple-100 text-purple-800';
      case 'therapeutic': return 'bg-green-100 text-green-800';
      case 'leadership': return 'bg-blue-100 text-blue-800';
      case 'business': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="admin-card mt-5">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-card mt-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Programs ({programs.length})</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Program
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="border border-gray-300 rounded-lg p-4 mb-4 bg-blue-50">
          <h3 className="text-md font-medium mb-3">
            {editingProgram ? 'Edit Program' : 'Add New Program'}
          </h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Program Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Program Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Program['type'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="scholarship">Scholarship</option>
                  <option value="therapeutic">Therapeutic</option>
                  <option value="leadership">Leadership</option>
                  <option value="business">Business</option>
                </select>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Application Deadline (Optional)
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Application Open Date (Optional)
                </label>
                <input
                  type="date"
                  value={formData.openDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, openDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Application Status
                </label>
                <select
                  value={formData.status || "active"}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Program['status'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Accepting Applications</option>
                  <option value="closed">Closed</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingProgram ? 'Update Program' : 'Add Program'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Programs List */}
      <div className="space-y-3">
        {programs.map((program) => (
          <div key={program.id} className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${getProgramColor(program.type)}`}>
                    {getProgramIcon(program.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{program.name}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getProgramColor(program.type)}`}>
                      {program.type}
                    </span>
                    {program.status ? (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {program.status === "active" ? "Accepting" : program.status}
                      </span>
                    ) : null}
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{program.description}</p>
                {program.openDate ? (
                  <p className="text-xs text-slate-500 mt-1">
                    Open Date: {new Date(program.openDate).toLocaleDateString()}
                  </p>
                ) : null}
                {program.deadline ? (
                  <p className="text-xs text-slate-500 mt-1">
                    Deadline: {new Date(program.deadline).toLocaleDateString()}
                  </p>
                ) : null}
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => handlePreview(program)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Preview Program"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEdit(program)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit Program"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Program Preview Modal */}
      {previewProgram && (
        <ProgramPreview
          program={previewProgram}
          onClose={() => setPreviewProgram(null)}
          onEdit={() => {
            setPreviewProgram(null);
            handleEdit(previewProgram);
          }}
        />
      )}
    </div>
  );
}
