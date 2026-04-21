import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Upload, CheckCircle, AlertCircle, FileText } from "lucide-react";

interface RecommendationRequest {
  token: string;
  status: string;
  recommenderName?: string;
  recommenderEmail?: string;
  applicantName: string;
  programName: string;
  submittedAt?: string;
  responseText?: string;
  responseFileUrl?: string;
}

export default function RecommendationPortal() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState<RecommendationRequest | null>(null);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadRequest = async () => {
      try {
        const res = await fetch(`/api/v1/recommendations/${token}`);
        const data = await res.json();
        if (!data.success) {
          throw new Error(data.error || "Request not found");
        }
        setRequest(data.data);
      } catch (err: any) {
        setError(err.message || "Failed to load recommendation request");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadRequest();
    }
  }, [token]);

  const uploadFile = async () => {
    if (!file || !token) return null;
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`/api/v1/recommendations/${token}/upload`, {
      method: "POST",
      body: formData
    });
    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || "File upload failed");
    }
    return data.url as string;
  };

  const handleSubmit = async () => {
    if (!token) return;
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      let uploadedUrl = fileUrl;
      if (file && !uploadedUrl) {
        uploadedUrl = await uploadFile();
        setFileUrl(uploadedUrl);
      }

      const res = await fetch(`/api/v1/recommendations/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          fileUrl: uploadedUrl
        })
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Submission failed");
      }
      setSuccess("Thank you! Your recommendation has been submitted.");
      setRequest(prev => prev ? { ...prev, status: "submitted" } : prev);
    } catch (err: any) {
      setError(err.message || "Failed to submit recommendation");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-b-2 border-blue-500 rounded-full"></div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-200 flex items-center justify-center">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 max-w-md text-center">
          <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-3" />
          <h2 className="text-lg font-semibold mb-2">Recommendation Not Found</h2>
          <p className="text-slate-400 text-sm">This link is invalid or has expired.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-slate-50">Recommendation Request</h1>
            <p className="text-slate-400 text-sm">
              Applicant: {request.applicantName} • Program: {request.programName}
            </p>
          </div>

          {request.status === "submitted" && (
            <div className="bg-emerald-900/30 border border-emerald-700 rounded-lg p-4 mb-6 flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
              <span className="text-emerald-200">Recommendation already submitted. Thank you!</span>
            </div>
          )}

          {error && (
            <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-6 text-red-200">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-emerald-900/30 border border-emerald-700 rounded-lg p-4 mb-6 text-emerald-200">
              {success}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-300 mb-2">Recommendation Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full min-h-[140px] bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-100"
                placeholder="Write your recommendation here..."
                disabled={request.status === "submitted"}
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">Upload Document (optional)</label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-slate-700 file:text-slate-100 hover:file:bg-slate-600"
                  disabled={request.status === "submitted"}
                />
                {fileUrl && (
                  <a href={fileUrl} className="text-blue-300 text-sm flex items-center gap-1" target="_blank">
                    <FileText className="h-4 w-4" />
                    View
                  </a>
                )}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting || request.status === "submitted"}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              <Upload className="h-4 w-4" />
              {submitting ? "Submitting..." : "Submit Recommendation"}
            </button>

            <p className="text-xs text-slate-400">
              If you do not know the applicant or do not wish to recommend them, you can ignore this request.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
