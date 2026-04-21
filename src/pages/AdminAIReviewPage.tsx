import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";

interface Application {
  id: number;
  name: string;
  email: string;
  phone: string;
  education_level: string;
  work_experience: number;
  skills: string;
  motivation: string;
  availability: string;
  status: string;
  ai_review_score?: number;
  ai_review_notes?: string;
  ai_reviewed_at?: string;
  created_at: string;
  recommendation?: string;
}

export default function AdminAIReviewPage() {
  const { accessToken } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewingAll, setReviewingAll] = useState(false);

  // Fetch all applications
  useEffect(() => {
    if (accessToken) {
      fetchApplications();
    }
  }, [accessToken]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiRequest('/admin/ai/applications', {
        token: accessToken
      }) as any;
      
      if (response?.success) {
        const data = response?.data ?? response;
        const rows = Array.isArray(data) ? data : (Array.isArray((data as any)?.data) ? (data as any).data : []);
        setApplications(rows as Application[]);
      } else {
        setError('Failed to fetch applications');
      }
    } catch (err) {
      setError('Error fetching applications');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Review single application
  const reviewApplication = async (appId: number) => {
    try {
      const response = await apiRequest(`/admin/applications/${appId}/review`, {
        method: 'POST',
        token: accessToken
      }) as any;
      
      if (response?.success) {
        // Update the application in the list
        setApplications(prev => 
          prev.map(app => 
            app.id === appId 
              ? { ...app, ...(response.data?.application || response.application || {}) }
              : app
          )
        );
        alert('Application reviewed successfully!');
      } else {
        setError('Failed to review application');
      }
    } catch (err) {
      setError('Error reviewing application');
      console.error('Error:', err);
    }
  };

  // Review all pending applications
  const reviewAllApplications = async () => {
    try {
      setReviewingAll(true);
      setError(null);
      
      const response = await apiRequest('/admin/applications/review-all', {
        method: 'POST',
        token: accessToken
      }) as any;
      
      if (response?.success) {
        const count = Array.isArray(response.data) ? response.data.length : 0;
        alert(`AI review completed for ${count} applications!`);
        await fetchApplications(); // Refresh the list
      } else {
        setError('Failed to review applications');
      }
    } catch (err) {
      setError('Error reviewing applications');
      console.error('Error:', err);
    } finally {
      setReviewingAll(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getRecommendationBadge = (recommendation: string) => {
    if (recommendation?.includes('HIGHLY RECOMMENDED')) return 'bg-green-100 text-green-800';
    if (recommendation?.includes('RECOMMENDED')) return 'bg-blue-100 text-blue-800';
    if (recommendation?.includes('CONSIDER')) return 'bg-yellow-100 text-yellow-800';
    if (recommendation?.includes('MARGINAL')) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  if (!accessToken) {
    return <div className="admin-page admin-shell p-6">Please log in to access this page.</div>;
  }

  return (
    <div className="admin-page admin-shell p-6">
      <div className="mb-6">
        <h1 className="admin-title">🤖 AI Application Review</h1>
        <p className="admin-subtitle">
          Intelligent application screening and qualification assessment powered by AI
        </p>
        
        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={reviewAllApplications}
            disabled={reviewingAll}
            className="admin-button"
          >
            {reviewingAll ? '🔄 Reviewing All...' : '🚀 Review All Pending'}
          </button>
          
          <div className="flex gap-2">
            <span className="px-3 py-1 border border-slate-400 rounded-lg text-slate-300">
              Total: {applications.length}
            </span>
            <span className="px-3 py-1 border border-slate-400 rounded-lg text-slate-300">
              Pending: {applications.filter(app => !app.ai_review_score).length}
            </span>
            <span className="px-3 py-1 border border-slate-400 rounded-lg text-slate-300">
              Reviewed: {applications.filter(app => app.ai_review_score).length}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-900/50 border border-red-400 rounded-lg text-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
          <p className="mt-2 text-slate-300">Loading applications...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Applications List */}
          <div className="admin-card">
            <h2 className="text-xl font-bold text-slate-50 mb-4">📋 Applications ({Array.isArray(applications) ? applications.length : 0})</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {(Array.isArray(applications) ? applications : []).map((application) => (
                <div
                  key={application.id}
                  className="p-4 border border-slate-400 rounded-lg hover:border-slate-300 hover:bg-slate-500 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-slate-50">{application.name}</h3>
                      <p className="text-sm text-slate-300">{application.email}</p>
                      <p className="text-xs text-slate-400">{application.phone}</p>
                    </div>
                    <div className="text-right">
                      {application.ai_review_score ? (
                        <div>
                          <div className={`text-2xl font-bold ${getScoreColor(application.ai_review_score)}`}>
                            {application.ai_review_score}/100
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${getRecommendationBadge(application.recommendation || '')}`}>
                            {application.recommendation || 'Not Reviewed'}
                          </span>
                        </div>
                      ) : (
                        <span className="px-2 py-1 text-xs border border-slate-400 rounded text-slate-300">
                          Pending Review
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Application Details */}
                  <div className="mt-3 text-sm text-slate-400 space-y-1">
                    <div>🎓 Education: {application.education_level || 'Not specified'}</div>
                    <div>💼 Experience: {application.work_experience || 0} years</div>
                    <div>🔧 Skills: {application.skills || 'Not specified'}</div>
                    <div>⏰ Availability: {application.availability || 'Not specified'}</div>
                    <div>📅 Applied: {new Date(application.created_at).toLocaleDateString()}</div>
                  </div>
                  
                  {/* AI Review Notes */}
                  {application.ai_review_notes && (
                    <div className="mt-3 p-3 bg-slate-600 rounded-lg">
                      <h4 className="font-semibold text-slate-50 mb-1">🤖 AI Analysis:</h4>
                      <p className="text-sm text-slate-300 whitespace-pre-wrap">{application.ai_review_notes}</p>
                    </div>
                  )}
                  
                  {/* Action Button */}
                  <div className="mt-3">
                    <button
                      onClick={() => reviewApplication(application.id)}
                      disabled={!!application.ai_review_score}
                      className={`w-full py-2 px-4 rounded-lg transition-colors ${
                        application.ai_review_score
                          ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {application.ai_review_score ? '✅ Reviewed' : '🔍 Review with AI'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
