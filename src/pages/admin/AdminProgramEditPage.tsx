import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Save, 
  X, 
  Eye, 
  Target,
  Award,
  BarChart3,
  TrendingUp,
  Users
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { apiRequest } from "@/lib/api";
import ProgramPreview from "@/components/admin/ProgramPreview";
import { useAuth } from "@/context/AuthContext";

interface Program {
  id: string;
  name: string;
  description: string;
  type: 'scholarship' | 'therapeutic' | 'leadership' | 'business';
  deadline?: string | null;
  openDate?: string | null;
  status?: 'active' | 'closed' | 'draft' | 'archived';
}

export default function AdminProgramEditPage() {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "scholarship" as Program['type'],
    deadline: "",
    openDate: "",
    status: "active" as Program['status']
  });

  useEffect(() => {
    if (programId && accessToken) {
      loadProgram();
    }
  }, [programId, accessToken]);

  const formatDateInput = (value?: string | null) => {
    if (!value) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "";
    return parsed.toISOString().slice(0, 10);
  };

  async function loadProgram() {
    try {
      setLoading(true);
      const response = await apiRequest('/admin/programs', { token: accessToken }) as any;
      if (response?.success) {
        const programs = response.data || [];
        const foundProgram = programs.find((p: any) => (p.id || p.code) === programId);
        if (foundProgram) {
          const normalized = {
            id: foundProgram.id || foundProgram.code,
            name: foundProgram.name,
            description: foundProgram.description,
            type: foundProgram.type,
            openDate: foundProgram.openDate || foundProgram.open_date,
            deadline: foundProgram.deadline,
            status: foundProgram.status
          } as Program;
          setProgram(normalized);
          setFormData({
            name: normalized.name,
            description: normalized.description,
            type: normalized.type as Program['type'],
            openDate: formatDateInput(normalized.openDate),
            deadline: formatDateInput(normalized.deadline),
            status: (normalized.status || "active") as Program['status']
          });
        }
      }
    } catch (err) {
      console.error('Error loading program:', err);
      setError("Failed to load program");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!program) return;

    try {
      setSaving(true);
      setError("");

      const payload = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        openDate: formData.openDate || null,
        deadline: formData.deadline || null,
        status: formData.status || "active"
      };

      const updateResponse = await apiRequest(`/admin/programs/${programId}`, {
        method: 'PUT',
        token: accessToken,
        body: JSON.stringify(payload)
      }) as any;

      if (!updateResponse?.success) {
        throw new Error(updateResponse?.error || "Failed to update program");
      }

      const updated = updateResponse.data || updateResponse;
      setProgram(prev => prev ? {
        ...prev,
        name: updated.name ?? prev.name,
        description: updated.description ?? prev.description,
        type: (updated.type ?? prev.type) as Program['type'],
        deadline: updated.deadline ?? prev.deadline
      } : prev);

      alert(`Program "${formData.name}" updated successfully!`);
      
    } catch (err) {
      console.error('Error saving program:', err);
      setError("Failed to save program");
    } finally {
      setSaving(false);
    }
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

  if (loading) {
    return (
      <AdminLayout title="Edit Program">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!program) {
    return (
      <AdminLayout title="Program Not Found">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Program Not Found</h3>
            <p className="text-gray-500 mb-4">The program you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/admin/programs-overview')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Programs
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Edit ${program.name}`}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/admin/programs-overview')}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Edit Program</h1>
          </div>
          
          {/* Program Info Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                {getProgramIcon(program.type)}
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">{program.name}</h3>
                <p className="text-sm text-blue-700">
                  ID: {program.id} • Type: {program.type}
                  {program.openDate ? ` • Open Date: ${new Date(program.openDate).toLocaleDateString()}` : ""}
                  {program.deadline ? ` • Deadline: ${new Date(program.deadline).toLocaleDateString()}` : ""}
                  {program.status ? ` • Status: ${program.status}` : ""}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Program Preview */}
        <ProgramPreview
          program={program}
          onClose={() => navigate('/admin/programs-overview')}
          onEdit={() => {
            // Edit functionality is already handled by this page
            console.log('Edit program from preview');
          }}
        />

        {/* Edit Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Program Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Program Type
              </label>
              <select
                id="type"
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

            {/* Open Date / Deadline / Status */}
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label htmlFor="openDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Application Open Date (Optional)
                </label>
                <input
                  type="date"
                  id="openDate"
                  value={formData.openDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, openDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
                  Application Deadline (Optional)
                </label>
                <input
                  type="date"
                  id="deadline"
                  value={formData.deadline}
                  onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Application Status
                </label>
                <select
                  id="status"
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
            <p className="text-xs text-gray-500 -mt-2">
              Open date controls when applicants can start. Deadline locks drafts and submissions after the date.
            </p>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => navigate('/admin/programs-overview')}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => alert('Preview functionality - see main preview window')}
                  className="px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
            <div className="flex items-center gap-2">
              <div className="text-red-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 00-1.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
