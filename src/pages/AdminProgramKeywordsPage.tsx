import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";
import AdminApplicationsPage from "@/pages/AdminApplicationsPage";

interface ProgramKeyword {
  id: number;
  program_name: string;
  keywords: string;
  weight: number;
  category: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface Program {
  name: string;
  has_keywords: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export default function AdminProgramKeywordsPage() {
  const { accessToken } = useAuth();
  const [keywords, setKeywords] = useState<ProgramKeyword[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form state
  const [keywordRows, setKeywordRows] = useState<Array<{
    keyword: string;
    weight: number;
    category: string;
    active: boolean;
  }>>([
    { keyword: "", weight: 1.0, category: "general", active: true }
  ]);
  const [bulkInput, setBulkInput] = useState("");
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filterProgram, setFilterProgram] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'keywords' | 'applicants' | 'review'>('keywords');
  const [applications, setApplications] = useState<any[]>([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [programHint, setProgramHint] = useState<string>("Select a program to manage keywords.");

  // Fetch data
  useEffect(() => {
    fetchKeywords();
    fetchPrograms();
    if (activeTab === 'review') {
      fetchApplications();
    }
  }, [filterProgram, activeTab]);

  useEffect(() => {
    if (!filterProgram && programs.length > 0) {
      setFilterProgram(programs[0].name);
      setProgramHint(`Managing keywords for ${programs[0].name}.`);
    }
  }, [programs, filterProgram]);

  const fetchKeywords = async () => {
    try {
      setLoading(true);
      const url = filterProgram 
        ? `/admin/program-keywords?program_name=${encodeURIComponent(filterProgram)}`
        : '/admin/program-keywords';
      const response = await apiRequest<ApiResponse<ProgramKeyword[]>>(url, {
        token: accessToken
      });
      
      if (response.success) {
        setKeywords(response.data || []);
      }
    } catch (err) {
      setError('Error fetching keywords');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrograms = async () => {
    try {
      const response = await apiRequest<ApiResponse<Program[]>>('/admin/programs-for-keywords', {
        token: accessToken
      });
      
      if (response.success) {
        setPrograms(response.data || []);
      }
    } catch (err) {
      console.error('Error fetching programs:', err);
    }
  };

  const fetchApplications = async () => {
    try {
      setReviewLoading(true);
      const response = await apiRequest<any>('/admin/applications', {
        token: accessToken
      });
      const rows = Array.isArray(response)
        ? response
        : (response?.data && Array.isArray(response.data) ? response.data : []);
      setApplications(rows);
    } catch (err) {
      setError('Error fetching applications');
      console.error('Error:', err);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleReviewAllApplications = async () => {
    try {
      setReviewLoading(true);
      const response = await apiRequest('/admin/applications/review-all', {
        method: 'POST',
        token: accessToken
      });
      
      if (response) {
        setSuccess('All applications reviewed successfully!');
        fetchApplications();
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError('Error reviewing applications');
      console.error('Error:', err);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!filterProgram) {
      setError('Select a program first');
      return;
    }
    const cleanedRows = keywordRows
      .map((row) => ({ ...row, keyword: row.keyword.trim() }))
      .filter((row) => row.keyword.length > 0);

    if (cleanedRows.length === 0) {
      setError('At least one keyword is required');
      return;
    }

    try {
      let savedCount = 0;
      for (const row of cleanedRows) {
        const response = await apiRequest<ApiResponse<ProgramKeyword>>('/admin/program-keywords', {
          method: 'POST',
          token: accessToken,
          body: JSON.stringify({
            program_name: filterProgram,
            keywords: row.keyword,
            weight: row.weight,
            category: row.category,
            active: row.active
          })
        });
        if (response.success) {
          savedCount += 1;
        }
      }

      if (savedCount > 0) {
        setSuccess(`Saved ${savedCount} keyword${savedCount > 1 ? "s" : ""} successfully!`);
        setKeywordRows([{ keyword: "", weight: 1.0, category: "general", active: true }]);
        setEditingId(null);
        fetchKeywords();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError('Failed to save keywords');
      }
    } catch (err) {
      setError('Error saving keywords');
      console.error('Error:', err);
    }
  };

  const handleEdit = (keyword: ProgramKeyword) => {
    setFilterProgram(keyword.program_name);
    setProgramHint(`Managing keywords for ${keyword.program_name}.`);
    setKeywordRows([
      {
        keyword: keyword.keywords,
        weight: keyword.weight,
        category: keyword.category,
        active: keyword.active
      }
    ]);
    setEditingId(keyword.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete these keywords?')) return;
    
    try {
      const response = await apiRequest<ApiResponse<null>>(`/admin/program-keywords/${id}`, {
        method: 'DELETE',
        token: accessToken
      });
      
      if (response.success) {
        setSuccess('Keywords deleted successfully!');
        fetchKeywords();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError('Failed to delete keywords');
      }
    } catch (err) {
      setError('Error deleting keywords');
      console.error('Error:', err);
    }
  };

  const categories = ['general', 'skills', 'experience', 'education', 'motivation', 'technical', 'soft-skills'];

  if (!accessToken) {
    return <div className="admin-page admin-shell p-6">Please log in to access this page.</div>;
  }

  return (
    <div className="admin-page admin-shell p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="admin-title">Application Center</h1>
          <p className="admin-subtitle">
            Review applicants and fine-tune program keywords with transparent, auditable criteria.
          </p>
        </div>
        <button
          type="button"
          onClick={() => (window.location.href = "/admin")}
          className="rounded-lg border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-800"
        >
          Go Back to Admin
        </button>
        <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-300">
          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-slate-500">Programs loaded</p>
            <p className="text-xl font-semibold text-slate-100">{programs.length}</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-slate-700">
        <div className="flex flex-wrap gap-6">
          <button
            onClick={() => setActiveTab('applicants')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'applicants'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Applicants
          </button>
          <button
            onClick={() => setActiveTab('keywords')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'keywords'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Program Keywords
          </button>
          <button
            onClick={() => setActiveTab('review')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'review'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Application Review
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-900/50 border border-red-400 rounded-lg text-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-900/50 border border-green-400 rounded-lg text-green-200">
          {success}
        </div>
      )}

      {activeTab === 'applicants' ? (
        <div className="admin-card">
          <AdminApplicationsPage embedded />
        </div>
      ) : activeTab === 'keywords' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-4">
            <div className="admin-card">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-50">Programs</h2>
                  <p className="text-xs text-slate-400 mt-1">{programHint}</p>
                </div>
                <span className="rounded-full border border-slate-700 px-2 py-1 text-xs text-slate-300">
                  {programs.filter((p) => p.has_keywords).length} configured
                </span>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-2">
                {programs.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-700 p-4 text-sm text-slate-400">
                    No programs found.
                  </div>
                ) : (
                  programs.map((program) => (
                    <button
                      key={program.name}
                      type="button"
                      onClick={() => {
                        setFilterProgram(program.name);
                        setProgramHint(`Managing keywords for ${program.name}.`);
                      }}
                      className={`flex items-center justify-between rounded-lg border px-3 py-3 text-left text-sm transition ${
                        filterProgram === program.name
                          ? "border-cyan-500/70 bg-cyan-900/40 text-slate-100"
                          : "border-slate-800 bg-slate-900/40 text-slate-300 hover:border-slate-500"
                      }`}
                    >
                      <span className="font-semibold">{program.name}</span>
                      <span className={`text-xs ${program.has_keywords ? "text-emerald-300" : "text-slate-500"}`}>
                        {program.has_keywords ? "Keywords set" : "No keywords"}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="admin-card">
              <h2 className="text-xl font-bold text-slate-50 mb-4">
                {editingId ? "Edit Keywords" : "Add Keywords"}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Selected Program</label>
                  <input
                    value={filterProgram || ""}
                    readOnly
                    className="w-full px-3 py-2 border border-slate-800 rounded-lg bg-slate-900 text-slate-100"
                    placeholder="Choose a program from the list"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Select a program on the left to update its keywords.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Keyword Table</label>
                  <div className="overflow-x-auto border border-slate-800 rounded-lg">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-900/70 text-slate-400">
                        <tr>
                          <th className="px-3 py-2 text-left">Keyword</th>
                          <th className="px-3 py-2 text-left">Weight</th>
                          <th className="px-3 py-2 text-left">Category</th>
                          <th className="px-3 py-2 text-left">Active</th>
                          <th className="px-3 py-2 text-right">Remove</th>
                        </tr>
                      </thead>
                      <tbody>
                        {keywordRows.map((row, idx) => (
                          <tr key={idx} className="border-t border-slate-800">
                            <td className="px-3 py-2">
                              <input
                                value={row.keyword}
                                onChange={(e) => {
                                  const next = [...keywordRows];
                                  next[idx] = { ...next[idx], keyword: e.target.value };
                                  setKeywordRows(next);
                                }}
                                placeholder="e.g. leadership"
                                className="w-full px-2 py-1.5 border border-slate-800 rounded bg-slate-900 text-slate-100"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="number"
                                step="0.1"
                                min="0.1"
                                max="5.0"
                                value={row.weight}
                                onChange={(e) => {
                                  const next = [...keywordRows];
                                  next[idx] = { ...next[idx], weight: parseFloat(e.target.value) || 1.0 };
                                  setKeywordRows(next);
                                }}
                                className="w-24 px-2 py-1.5 border border-slate-800 rounded bg-slate-900 text-slate-100"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <select
                                value={row.category}
                                onChange={(e) => {
                                  const next = [...keywordRows];
                                  next[idx] = { ...next[idx], category: e.target.value };
                                  setKeywordRows(next);
                                }}
                                className="w-full px-2 py-1.5 border border-slate-800 rounded bg-slate-900 text-slate-100"
                              >
                                {categories.map((cat) => (
                                  <option key={cat} value={cat}>
                                    {cat.charAt(0).toUpperCase() + cat.slice(1).replace("-", " ")}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="checkbox"
                                checked={row.active}
                                onChange={(e) => {
                                  const next = [...keywordRows];
                                  next[idx] = { ...next[idx], active: e.target.checked };
                                  setKeywordRows(next);
                                }}
                                className="h-4 w-4"
                              />
                            </td>
                            <td className="px-3 py-2 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  const next = keywordRows.filter((_, i) => i !== idx);
                                  setKeywordRows(next.length ? next : [{ keyword: "", weight: 1.0, category: "general", active: true }]);
                                }}
                                className="text-rose-300 hover:text-rose-200"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                    <span>Add one keyword per row with its own weight and category.</span>
                    <button
                      type="button"
                      onClick={() => setKeywordRows([...keywordRows, { keyword: "", weight: 1.0, category: "general", active: true }])}
                      className="rounded-md border border-slate-700 px-2 py-1 text-slate-200 hover:bg-slate-800"
                    >
                      Add Row
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Bulk Add Keywords</label>
                  <textarea
                    value={bulkInput}
                    onChange={(e) => setBulkInput(e.target.value)}
                    placeholder="Paste keywords separated by commas or new lines"
                    className="w-full px-3 py-2 border border-slate-800 rounded-lg bg-slate-900 text-slate-50 placeholder-slate-500"
                    rows={3}
                  />
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                    <span>Keywords will be added as new rows with default weight and category.</span>
                    <button
                      type="button"
                      onClick={() => {
                        const parts = bulkInput
                          .split(/[\n,]+/g)
                          .map((p) => p.trim())
                          .filter((p) => p.length > 0);
                        if (parts.length === 0) return;
                        const existing = keywordRows.filter((r) => r.keyword.trim().length > 0);
                        const additions = parts.map((keyword) => ({
                          keyword,
                          weight: 1.0,
                          category: "general",
                          active: true
                        }));
                        setKeywordRows([...existing, ...additions]);
                        setBulkInput("");
                      }}
                      className="rounded-md border border-slate-700 px-2 py-1 text-slate-200 hover:bg-slate-800"
                    >
                      Add From Paste
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-cyan-600 text-white py-2 px-4 rounded-lg hover:bg-cyan-700 transition-colors"
                  >
                    {editingId ? "Update Keywords" : "Save Keywords"}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                    onClick={() => {
                      setEditingId(null);
                      setKeywordRows([{ keyword: "", weight: 1.0, category: "general", active: true }]);
                    }}
                    className="px-4 py-2 rounded-lg border border-slate-700 text-slate-200 hover:bg-slate-800"
                  >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="admin-card">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-50">Keywords List</h2>
                  <p className="text-xs text-slate-400">Showing keywords for the selected program.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Active program</span>
                  <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-200">
                    {filterProgram || "None selected"}
                  </span>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto"></div>
                  <p className="mt-2 text-slate-300">Loading keywords...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="admin-table w-full">
                    <thead className="admin-table-header">
                      <tr>
                        <th className="text-left">Program</th>
                        <th className="text-left">Keywords</th>
                        <th className="text-left">Category</th>
                        <th className="text-left">Weight</th>
                        <th className="text-left">Status</th>
                        <th className="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {keywords.map((keyword) => (
                        <tr key={keyword.id} className="admin-table-row">
                          <td className="font-semibold text-slate-100">{keyword.program_name}</td>
                          <td className="text-slate-300">{keyword.keywords}</td>
                          <td>
                            <span className="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-300">
                              {keyword.category}
                            </span>
                          </td>
                          <td className="text-slate-200">{keyword.weight}</td>
                          <td>
                            {keyword.active ? (
                              <span className="rounded-full bg-emerald-900/60 px-2 py-1 text-xs text-emerald-200">Active</span>
                            ) : (
                              <span className="rounded-full bg-slate-700 px-2 py-1 text-xs text-slate-300">Inactive</span>
                            )}
                          </td>
                          <td className="text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleEdit(keyword)}
                                className="text-cyan-300 hover:text-cyan-200 text-sm"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(keyword.id)}
                                className="text-rose-300 hover:text-rose-200 text-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {keywords.length === 0 && (
                    <div className="text-center py-10 text-slate-400">
                      No keywords for this program yet. Add keywords to get started.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Applications Review Tab
        <div className="admin-card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-50">Applications Review</h2>
            <button
              onClick={handleReviewAllApplications}
              disabled={reviewLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {reviewLoading ? "Reviewing..." : "Review All Applications"}
            </button>
          </div>

          {reviewLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
              <p className="mt-2 text-slate-300">Loading applications...</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {(Array.isArray(applications) ? applications : []).map((application) => (
                <div key={application.id} className="p-4 border border-slate-400 rounded-lg bg-slate-600">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-50">{application.name}</h3>
                      <p className="text-sm text-slate-300">{application.email}</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">
                          Score: {application.ai_review_score || 'Not reviewed'}
                        </span>
                        <span className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">
                          {application.education_level}
                        </span>
                        <span className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">
                          {application.work_experience} years exp
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-sm text-slate-300">
                      <strong>Skills:</strong> {application.skills}
                    </p>
                    <p className="text-sm text-slate-300">
                      <strong>Program Match:</strong> 
                      {application.ai_review_score ? (
                        <span className={`ml-2 px-2 py-1 rounded text-xs ${
                          application.ai_review_score >= 70 ? 'bg-green-900/50 text-green-300' :
                          application.ai_review_score >= 50 ? 'bg-yellow-900/50 text-yellow-300' :
                          'bg-red-900/50 text-red-300'
                        }`}>
                          {application.ai_review_score >= 70 ? 'High Match' :
                           application.ai_review_score >= 50 ? 'Medium Match' : 'Low Match'}
                        </span>
                      ) : (
                        <span className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">Not Evaluated</span>
                      )}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Applied: {new Date(application.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {(Array.isArray(applications) ? applications : []).length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  No applications found. Applications will appear here once they are submitted.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
