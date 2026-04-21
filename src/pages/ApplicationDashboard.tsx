import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Download,
  RefreshCw
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useApplication } from "../hooks/useApplication";
import { getMyApplications } from "../services/apiService";

interface Application {
  id: string;
  title: string;
  status: string;
  submittedDate: string;
  lastUpdated: string;
  programId: string;
  applicationData?: any;
}

export default function ApplicationDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const apps = await getMyApplications();
      setApplications(apps);
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'unsubmitted':
        return <Clock className="h-4 w-4 text-slate-400" />;
      case 'submitted':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'under review':
        return <Eye className="h-4 w-4 text-blue-500" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'unsubmitted':
        return 'bg-slate-700 text-slate-200 border-slate-600';
      case 'submitted':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'under review':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'accepted':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatLabel = (key: string) => {
    return key
      .replace(/_/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const renderValue = (value: any) => {
    if (value === null || value === undefined || value === "") return "—";
    if (Array.isArray(value)) {
      return value.length ? value.join(", ") : "—";
    }
    if (typeof value === "object") {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  const renderKeyValueGrid = (data: any) => {
    if (!data || typeof data !== "object") return null;
    const entries = Object.entries(data);
    if (entries.length === 0) return null;

    return (
      <div className="grid md:grid-cols-2 gap-4 text-sm">
        {entries.map(([key, value]) => (
          <div key={key} className="bg-slate-800 border border-slate-700 rounded-lg p-3">
            <div className="text-slate-400 text-xs mb-1">{formatLabel(key)}</div>
            {typeof value === "object" && value !== null && !Array.isArray(value) ? (
              <pre className="text-xs text-slate-200 whitespace-pre-wrap">
{renderValue(value)}
              </pre>
            ) : (
              <div className="text-slate-100">{renderValue(value)}</div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderSection = (title: string, data: any) => {
    if (!data || (typeof data === "object" && Object.keys(data).length === 0)) return null;
    return (
      <div className="border border-slate-700 rounded-xl p-4 bg-slate-900">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-slate-100">{title}</h4>
          <span className="text-xs text-slate-500">Read-only</span>
        </div>
        {renderKeyValueGrid(data)}
      </div>
    );
  };

  const handleDownloadPdf = async (application: Application) => {
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const left = 14;
      const right = pageWidth - 14;
      const maxTextWidth = right - left;

      const writeLine = (text: string, y: number, fontSize = 10) => {
        doc.setFontSize(fontSize);
        const lines = doc.splitTextToSize(text, maxTextWidth);
        doc.text(lines, left, y);
        return y + lines.length * (fontSize * 0.5 + 2);
      };

      let y = 16;
      doc.setFontSize(16);
      doc.text("Vialifecoach GF Application", left, y);
      y += 8;
      doc.setFontSize(12);
      doc.text(`${application.title}`, left, y);
      y += 6;
      doc.setFontSize(10);
      y = writeLine(`Application ID: ${application.id}`, y, 10);
      y = writeLine(`Status: ${application.status}`, y, 10);
      y = writeLine(`Submitted: ${new Date(application.submittedDate).toLocaleDateString()}`, y, 10);
      y = writeLine(`Last Updated: ${new Date(application.lastUpdated).toLocaleDateString()}`, y, 10);
      y += 4;

      const sections: { title: string; data: any }[] = [
        { title: "Account Creation", data: application.applicationData?.accountCreation },
        { title: "Personal Information", data: application.applicationData?.personalInfo },
        { title: "Background Information", data: application.applicationData?.backgroundInfo },
        { title: "Education History", data: application.applicationData?.educationHistory },
        { title: "Work Experience", data: application.applicationData?.workExperience },
        { title: "Activities", data: application.applicationData?.activities },
        { title: "Personal Statement", data: application.applicationData?.personalStatement },
        { title: "Program Selection", data: application.applicationData?.programSelection },
        { title: "Supporting Documents", data: application.applicationData?.supportingDocuments },
        { title: "Recommendations", data: application.applicationData?.recommendations },
        { title: "Eligibility Questions", data: application.applicationData?.eligibilityQuestions },
        { title: "Submission", data: application.applicationData?.submission }
      ];

      const formatLabel = (key: string) => key
        .replace(/_/g, " ")
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/\b\w/g, (c) => c.toUpperCase());

      const renderKeyValues = (data: any) => {
        if (!data || typeof data !== "object") return;
        const entries = Object.entries(data);
        for (const [key, value] of entries) {
          const label = formatLabel(key);
          const val = Array.isArray(value) ? value.join(", ") : (value ?? "—");
          y = writeLine(`${label}: ${val}`, y, 10);
          if (y > pageHeight - 12) {
            doc.addPage();
            y = 14;
          }
        }
      };

      for (const section of sections) {
        if (!section.data || (typeof section.data === "object" && Object.keys(section.data).length === 0)) {
          continue;
        }
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 14;
        }
        doc.setFontSize(12);
        doc.text(section.title, left, y);
        y += 6;
        renderKeyValues(section.data);
        y += 4;
      }

      doc.save(`${application.id}-application.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("PDF download failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-b-2 border-blue-500 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/application-portal")}
              className="flex items-center gap-2 text-slate-300 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Portal
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-50">
                Application Dashboard
              </h1>
              <p className="text-slate-400 text-sm">
                Track your application status and progress
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={loadApplications}
              className="flex items-center gap-2 text-slate-300 hover:text-white"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <button
              onClick={() => navigate("/application-portal/gf")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              New Application
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-slate-300 hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-2 text-slate-50">Welcome back, {user?.name}!</h2>
          <p className="text-slate-400">
            You have {applications.length} application{applications.length !== 1 ? 's' : ''} in progress.
          </p>
        </div>

        {/* Applications Grid */}
        {applications.length === 0 ? (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center">
            <FileText className="h-16 w-16 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-50 mb-2">No Applications Yet</h3>
            <p className="text-slate-400 mb-6">
              Start your journey by applying to one of our programs.
            </p>
            <button
              onClick={() => navigate("/application-portal")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Browse Programs
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {applications.map((application) => (
              <div key={application.id} className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-slate-50">
                        {application.title}
                      </h3>
                      <span
                        className={`flex items-center gap-1 text-xs px-3 py-1 rounded-full border ${getStatusColor(
                          application.status
                        )}`}
                      >
                        {getStatusIcon(application.status)}
                        {application.status}
                      </span>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-300">
                      <div>
                        <p><strong>Submitted:</strong> {new Date(application.submittedDate).toLocaleDateString()}</p>
                        <p><strong>Last Updated:</strong> {new Date(application.lastUpdated).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p><strong>Application ID:</strong> #{application.id}</p>
                        <p><strong>Program ID:</strong> {application.programId}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => setSelectedApplication(application)}
                      className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg"
                      title="View Application"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDownloadPdf(application)}
                      className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg"
                      title="Download PDF"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {application.status.toLowerCase() !== 'unsubmitted' && (
                  <div className="mt-6 pt-6 border-t border-slate-700">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-slate-300">Submitted</span>
                      </div>
                      <div className={`flex items-center gap-2 ${
                        application.status === 'Under Review' || application.status === 'Accepted' || application.status === 'Rejected'
                          ? 'text-blue-400'
                          : 'text-slate-500'
                      }`}>
                        <Eye className="h-4 w-4" />
                        <span>Under Review</span>
                      </div>
                      <div className={`flex items-center gap-2 ${
                        application.status === 'Accepted'
                          ? 'text-green-400'
                          : application.status === 'Rejected'
                          ? 'text-red-400'
                          : 'text-slate-500'
                      }`}>
                        {application.status === 'Accepted' ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : application.status === 'Rejected' ? (
                          <AlertCircle className="h-4 w-4" />
                        ) : (
                          <Clock className="h-4 w-4" />
                        )}
                        <span>{application.status === 'Accepted' ? 'Accepted' : application.status === 'Rejected' ? 'Rejected' : 'Decision'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Application Details Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
            <div className="p-5 border-b border-slate-700 flex items-center justify-between bg-slate-900">
              <div>
                <h3 className="text-lg font-semibold text-slate-50">Your Submitted Application</h3>
                <p className="text-sm text-slate-400">
                  {selectedApplication.title} • {selectedApplication.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedApplication(null)}
                className="text-slate-400 hover:text-slate-200"
              >
                Close
              </button>
            </div>
            <div className="p-5 space-y-6 bg-slate-800">
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-slate-900 border border-slate-700 rounded-lg p-3">
                  <div className="text-slate-400 text-xs mb-1">Status</div>
                  <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedApplication.status)}`}>
                    {getStatusIcon(selectedApplication.status)}
                    {selectedApplication.status}
                  </div>
                </div>
                <div className="bg-slate-900 border border-slate-700 rounded-lg p-3">
                  <div className="text-slate-400 text-xs mb-1">Submitted</div>
                  <div className="text-slate-100">
                    {selectedApplication.submittedDate ? new Date(selectedApplication.submittedDate).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
                <div className="bg-slate-900 border border-slate-700 rounded-lg p-3">
                  <div className="text-slate-400 text-xs mb-1">Last Updated</div>
                  <div className="text-slate-100">
                    {selectedApplication.lastUpdated ? new Date(selectedApplication.lastUpdated).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>

              {selectedApplication.applicationData ? (
                <div className="space-y-4">
                  {renderSection("Account Creation", selectedApplication.applicationData.accountCreation)}
                  {renderSection("Personal Information", selectedApplication.applicationData.personalInfo)}
                  {renderSection("Background Information", selectedApplication.applicationData.backgroundInfo)}
                  {renderSection("Education History", selectedApplication.applicationData.educationHistory)}
                  {renderSection("Work Experience", selectedApplication.applicationData.workExperience)}
                  {renderSection("Activities", selectedApplication.applicationData.activities)}
                  {renderSection("Personal Statement", selectedApplication.applicationData.personalStatement)}
                  {renderSection("Program Selection", selectedApplication.applicationData.programSelection)}
                  {renderSection("Supporting Documents", selectedApplication.applicationData.supportingDocuments)}
                  {renderSection("Recommendations", selectedApplication.applicationData.recommendations)}
                  {renderSection("Eligibility Questions", selectedApplication.applicationData.eligibilityQuestions)}
                  {renderSection("Submission", selectedApplication.applicationData.submission)}
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 text-sm text-slate-300">
                  Application details are not available for this submission.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
