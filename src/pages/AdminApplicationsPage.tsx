import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/components/ui/toast";
import { apiRequest } from "@/lib/api";
import EmailTemplateModal from "@/components/EmailTemplateModal";
import { Search, Filter, Download, Eye, CheckCircle, XCircle, Clock, Calendar, User, Mail, FileText, Award, AlertTriangle, TrendingUp, Users, FileCheck, Send, Settings } from "lucide-react";
import { buildAdmissionLetterHtml } from "@/lib/admissionLetterTemplate";

interface Application {
  id: string;
  submittedAt: string;
  applicant: {
    name: string;
    email: string;
    phone: string;
    age: number;
    nationality: string;
    refugeeStatus: string;
    essays?: {
      personalStatement?: string;
      motivationEssay?: string;
      futureGoalsEssay?: string;
    };
  };
  program: {
    name: string;
    type: string;
  };
  status: 'unsubmitted' | 'pending' | 'under_review' | 'shortlisted' | 'waitlisted' | 'approved' | 'rejected' | 'admitted' | 'deleted';
  priority: 'high' | 'medium' | 'low';
  documents: {
    offerLetter: string;
    idDocument: string;
    cvResume?: string;
    recommendationLetters?: string[];
    certificates?: string[];
    essays?: string[];
  };
  reviewNotes?: string;
  reviewerFeedback?: {
    essaysReview?: string;
    documentsReview?: string;
    overallAssessment?: string;
  };
  reviewedBy?: string;
  reviewedAt?: string;
  admissionNumber?: string;
  orderNumber?: string;
  admissionDate?: string;
  finalDecision?: string;
  decisionDate?: string;
}

interface ApplicationStats {
  total: number;
  pending: number;
  underReview: number;
  approved: number;
  rejected: number;
  waitlisted: number;
  shortlisted: number;
  admitted: number;
  thisWeek: number;
}

export default function AdminApplicationsPage({ embedded = false }: { embedded?: boolean } = {}) {
  const { accessToken } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailType, setEmailType] = useState<'status' | 'rejection' | 'approval' | 'reminder'>('status');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [programFilter, setProgramFilter] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const normalizeApplications = (payload: any): Application[] => {
    const data = payload?.data ?? payload;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch real applications from API
        const applicationsResponse = await apiRequest('/admin/applications', { token: accessToken }) as any;
        
        if (!applicationsResponse.success) {
          throw new Error('Failed to fetch applications');
        }
        
        const applicationsData = normalizeApplications(applicationsResponse);
        setApplications(applicationsData);

        // Fetch real stats from API
        const statsResponse = await apiRequest('/admin/applications/stats', { token: accessToken }) as any;
        
        if (statsResponse.success) {
          const statsData = statsResponse.data || statsResponse;
          setStats(statsData);
        }
      } catch (error) {
        console.error('Failed to load applications:', error);
        // Set empty arrays on error to show no data state
        setApplications([]);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      loadData();
    }
  }, [accessToken]);


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unsubmitted': return 'bg-slate-200 text-slate-700 border-slate-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'under_review': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shortlisted': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'waitlisted': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'admitted': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'deleted': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'under_review': return <Eye className="h-4 w-4" />;
      case 'shortlisted': return <Award className="h-4 w-4" />;
      case 'waitlisted': return <AlertTriangle className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'admitted': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'deleted': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handleViewDetails = (application: Application) => {
    setSelectedApplication(application);
    setShowDetailsModal(true);
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: Application['status']) => {
    try {
      console.log('🔍 Frontend: Starting status update', { applicationId, newStatus });
      
      // Validate inputs
      if (!applicationId || !newStatus) {
        throw new Error('Missing application ID or status');
      }
      
      // Update status via API using apiRequest for proper authentication
      const requestBody = { 
        status: newStatus,
        reviewedAt: new Date().toISOString(),
        reviewedBy: 'Admin User'
      };
      
      console.log('🔍 Frontend: Request body:', requestBody);
      console.log('🔍 Frontend: Access token exists:', !!accessToken);
      
      const updatedApplicationResponse = await apiRequest(`/admin/applications/${applicationId}/status`, {
        method: 'PATCH',
        token: accessToken,
        body: JSON.stringify(requestBody)
      }) as { success: boolean; data: Application };

      console.log('🔍 Frontend: Success response:', updatedApplicationResponse);
      
      // Extract the actual application data from the wrapped response
      const updatedApplication = (updatedApplicationResponse as any)?.data || updatedApplicationResponse;
      
      // Validate the response has required structure
      if (!updatedApplication || !updatedApplication.id) {
        throw new Error('Invalid response from server');
      }
      
      // Update local state with the response
      setApplications(prev => prev.map(app => 
        app.id === applicationId ? updatedApplication : app
      ));

      // Update selected application if modal is open
      if (selectedApplication && selectedApplication.id === applicationId) {
        setSelectedApplication(updatedApplication);
      }

      // Refresh stats after status change
      try {
        const statsResponse = await apiRequest('/admin/applications/stats', { token: accessToken }) as any;
        if (statsResponse.success) {
          const statsData = statsResponse.data || statsResponse;
          setStats(statsData);
        }
      } catch (statsError) {
        console.error('Failed to refresh stats:', statsError);
      }

      // Show success message
      alert(`Application status updated to ${newStatus.replace('_', ' ')} successfully`);
    } catch (error: any) {
      console.error('❌ Frontend: Failed to update status:', error);
      alert(`Failed to update application status: ${error.message || 'Unknown error'}. Please try again.`);
    }
  };

  const handleSendEmail = (application: Application, type: 'status' | 'rejection' | 'approval' | 'reminder') => {
    setSelectedApplication(application);
    setEmailType(type);
    setShowEmailModal(true);
  };

  const getEmailTypeForStatus = (status: string): 'status' | 'rejection' | 'approval' | 'waitlisted' | 'shortlisted' | 'admitted' | 'under_review' | 'reminder' => {
    switch (status) {
      case 'unsubmitted':
        return 'reminder';
      case 'rejected':
        return 'rejection';
      case 'approved':
        return 'approval';
      case 'waitlisted':
        return 'waitlisted';
      case 'shortlisted':
        return 'shortlisted';
      case 'admitted':
        return 'admitted';
      case 'under_review':
        return 'under_review';
      default:
        return 'status';
    }
  };

  const handleStatusChange = (applicationId: string, newStatus: string) => {
    if (newStatus && newStatus !== selectedApplication?.status) {
      handleStatusUpdate(applicationId, newStatus as Application['status']);
    }
  };

  const handleModalStatusUpdate = () => {
    if (selectedStatus && selectedApplication) {
      handleStatusChange(selectedApplication.id, selectedStatus);
      setSelectedStatus('');
    }
  };

  const handleSendEmailWithTemplate = async (emailData: {
    to: string;
    subject: string;
    content: string;
    templateName: string;
  }) => {
    try {
      console.log('🔍 Frontend: Starting email send', { emailData });
      console.log('🔍 Frontend: Access token exists:', !!accessToken);
      console.log('🔍 Frontend: Access token length:', accessToken?.length || 0);
      console.log('🔍 Frontend: Selected application ID:', selectedApplication?.id);
      console.log('🔍 Frontend: Selected application:', selectedApplication);
      
      // Validate inputs
      if (!selectedApplication?.id) {
        throw new Error('No application selected');
      }
      
      if (!accessToken) {
        throw new Error('No access token - please login again');
      }
      
      if (!emailData.to || !emailData.subject || !emailData.content) {
        throw new Error('Missing email data');
      }
      
      const requestBody = {
        applicationId: selectedApplication.id,
        to: emailData.to,
        subject: emailData.subject,
        content: emailData.content,
        templateName: emailData.templateName,
        sentBy: 'Admin User',
        status: selectedApplication?.status,
        pdfHtml: emailData.templateName === "Admission Letter"
          ? buildAdmissionLetterHtml({
              applicantName: selectedApplication.applicant.name,
              programName: selectedApplication.program.name,
              administratorName: "Program Director",
              admissionType: "FULL-TIME ADMISSION",
              acceptanceConfirmation: "Please confirm your acceptance by replying to this email within 7 days.",
              documentationNote: "Submit all required documents (transcripts, identification, medical certificates)."
            })
          : undefined
      };
      
      console.log('🔍 Frontend: Request body prepared:', requestBody);
      
      // Send email via API
      const response = await fetch('/api/v1/admin/applications/send-email', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('🔍 Frontend: Email response status:', response.status);
      console.log('🔍 Frontend: Email response ok:', response.ok);
      console.log('🔍 Frontend: Email response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('🔍 Frontend: Email error response:', errorText);
        
        let errorData;
        try {
          errorData = errorText ? JSON.parse(errorText) : {};
        } catch (parseError) {
          errorData = { message: errorText };
        }
        
        throw new Error(errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const emailLog = await response.json();
      console.log('✅ Frontend: Email sent successfully:', emailLog);
      
      alert('Email sent successfully!');
      setShowEmailModal(false);

      // Refresh applications to reflect any status changes
      try {
        const applicationsResponse = await apiRequest('/admin/applications', { token: accessToken }) as any;
        if (applicationsResponse.success) {
          setApplications(normalizeApplications(applicationsResponse));
        }
      } catch (refreshError) {
        console.error('Failed to refresh applications after email:', refreshError);
      }
    } catch (error: any) {
      console.error('❌ Frontend: Failed to send email:', error);
      console.error('❌ Frontend: Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      alert(`Failed to send email: ${error.message || 'Unknown error'}. Please try again.`);
    }
  };

  const safeApplications = Array.isArray(applications) ? applications : [];
  const filteredApplications = safeApplications.filter(application => {
    const matchesSearch = searchTerm === '' || 
      application.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.applicant.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || application.status === statusFilter;
    const matchesProgram = programFilter === 'all' || application.program.name === programFilter;
    
    return matchesSearch && matchesStatus && matchesProgram;
  });

  const header = (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="admin-title">Applicants</h1>
        <p className="admin-subtitle">{safeApplications.length} total applications</p>
      </div>
      <button className="admin-button-primary">
        <Download className="h-4 w-4" />
        Export
      </button>
    </div>
  );

  const content = (
    <>
      {embedded && header}
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="admin-card">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-white truncate">Total Applications</h3>
              <p className="text-sm text-slate-400 truncate">All time</p>
            </div>
            <div className="text-2xl font-bold text-blue-400 shrink-0">{stats?.total || 0}</div>
          </div>
        </div>

        <div className="admin-card">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-white truncate">Pending Review</h3>
              <p className="text-sm text-slate-400 truncate">Awaiting action</p>
            </div>
            <div className="text-2xl font-bold text-yellow-400 shrink-0">{stats?.pending || 0}</div>
          </div>
        </div>

        <div className="admin-card">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-white truncate">Under Review</h3>
              <p className="text-sm text-slate-400 truncate">Being evaluated</p>
            </div>
            <div className="text-2xl font-bold text-blue-400 shrink-0">{stats?.underReview || 0}</div>
          </div>
        </div>

        <div className="admin-card">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-white truncate">Approved</h3>
              <p className="text-sm text-slate-400 truncate">Accepted</p>
            </div>
            <div className="text-2xl font-bold text-green-400 shrink-0">{stats?.approved || 0}</div>
          </div>
        </div>

        <div className="admin-card">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-white truncate">Rejected</h3>
              <p className="text-sm text-slate-400 truncate">Not successful</p>
            </div>
            <div className="text-2xl font-bold text-red-400 shrink-0">{stats?.rejected || 0}</div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-input pl-10"
            />
          </div>
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all" className="bg-slate-700">All Status</option>
          <option value="unsubmitted" className="bg-slate-700">Unsubmitted</option>
          <option value="pending" className="bg-slate-700">Pending</option>
          <option value="under_review" className="bg-slate-700">Under Review</option>
          <option value="shortlisted" className="bg-slate-700">Shortlisted</option>
          <option value="waitlisted" className="bg-slate-700">Waitlisted</option>
          <option value="approved" className="bg-slate-700">Approved</option>
          <option value="admitted" className="bg-slate-700">Admitted</option>
          <option value="rejected" className="bg-slate-700">Rejected</option>
          <option value="deleted" className="bg-slate-700">Deleted</option>
        </select>
        
        <select
          value={programFilter}
          onChange={(e) => setProgramFilter(e.target.value)}
          className="bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all" className="bg-slate-700">All Programs</option>
          <option value="Women Refugee Rise Program" className="bg-slate-700">Women Refugee Rise Program</option>
          <option value="GVB Healing Program" className="bg-slate-700">GVB Healing Program</option>
          <option value="Inner Leadership Program" className="bg-slate-700">Inner Leadership Program</option>
          <option value="Business Mentorship Program" className="bg-slate-700">Business Mentorship Program</option>
        </select>
      </div>

      {/* Applications Table */}
      <div className="admin-table-container">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-slate-400 text-lg mb-2">No applications found</div>
              <div className="text-slate-500 text-sm">
                {searchTerm || statusFilter !== 'all' || programFilter !== 'all' 
                  ? 'Try adjusting your filters or search terms'
                  : 'No applications have been submitted yet'
                }
              </div>
            </div>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Application ID</th>
                <th>Applicant</th>
                <th>Program</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((application) => (
              <tr key={application.id} className="hover:bg-slate-700/50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <div className="font-medium text-white">{application.id}</div>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <div className="font-medium text-white">{application.applicant.name}</div>
                    <div className="text-sm text-slate-400">{application.applicant.email}</div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  <div>
                    <div className="text-white">{application.program.name}</div>
                    <div className="text-slate-400">{application.program.type}</div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
                    {getStatusIcon(application.status)}
                    {application.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(application.priority)}`}>
                    {application.priority}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-400">
                  {new Date(application.submittedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewDetails(application)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200 shadow-sm"
                    >
                      <Eye className="h-3 w-3" />
                      View
                    </button>
                    
                    <button
                      onClick={() => handleSendEmail(application, 'status')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 hover:text-blue-900 transition-colors duration-200 shadow-sm"
                    >
                      <Mail className="h-3 w-3" />
                      Send Email
                    </button>
                    
                    {application.status === 'pending' && (
                      <button
                        onClick={() => handleStatusUpdate(application.id, 'under_review')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 hover:text-amber-900 transition-colors duration-200 shadow-sm"
                      >
                        <FileText className="h-3 w-3" />
                        Review
                      </button>
                    )}
                    
                    {application.status === 'under_review' && (
                      <>
                        <button
                          onClick={() => {
                            handleStatusUpdate(application.id, 'approved');
                            setShowDetailsModal(false);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 hover:text-green-900 transition-colors duration-200 shadow-sm"
                        >
                          <CheckCircle className="h-3 w-3" />
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            handleStatusUpdate(application.id, 'shortlisted');
                            setShowDetailsModal(false);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 hover:text-purple-900 transition-colors duration-200 shadow-sm"
                        >
                          <Award className="h-3 w-3" />
                          Shortlist
                        </button>
                        <button
                          onClick={() => {
                            handleStatusUpdate(application.id, 'rejected');
                            setShowDetailsModal(false);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 hover:text-red-900 transition-colors duration-200 shadow-sm"
                        >
                          <XCircle className="h-3 w-3" />
                          Reject
                        </button>
                        <button
                          onClick={() => {
                            handleStatusUpdate(application.id, 'waitlisted');
                            setShowDetailsModal(false);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-orange-50 border border-orange-200 text-orange-700 hover:bg-orange-100 hover:text-orange-900 transition-colors duration-200 shadow-sm"
                        >
                          <AlertTriangle className="h-3 w-3" />
                          Waitlist
                        </button>
                      </>
                    )}
                    
                    {application.status === 'shortlisted' && (
                      <>
                        <button
                          onClick={() => {
                            handleStatusUpdate(application.id, 'approved');
                            setShowDetailsModal(false);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 hover:text-green-900 transition-colors duration-200 shadow-sm"
                        >
                          <CheckCircle className="h-3 w-3" />
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            handleStatusUpdate(application.id, 'rejected');
                            setShowDetailsModal(false);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 hover:text-red-900 transition-colors duration-200 shadow-sm"
                        >
                          <XCircle className="h-3 w-3" />
                          Reject
                        </button>
                        <button
                          onClick={() => {
                            handleStatusUpdate(application.id, 'waitlisted');
                            setShowDetailsModal(false);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-orange-50 border border-orange-200 text-orange-700 hover:bg-orange-100 hover:text-orange-900 transition-colors duration-200 shadow-sm"
                        >
                          <AlertTriangle className="h-3 w-3" />
                          Waitlist
                        </button>
                      </>
                    )}

                    {application.status === 'approved' && (
                      <>
                        <button
                          onClick={() => {
                            const admissionNumber = 'WRRP' + new Date().getFullYear() + String(Math.floor(Math.random() * 1000)).padStart(3, '0');
                            const orderNumber = 'ORD-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 1000)).padStart(3, '0');
                            handleStatusUpdate(application.id, 'admitted');
                            setShowDetailsModal(false);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-900 transition-colors duration-200 shadow-sm"
                        >
                          <Award className="h-3 w-3" />
                          Admit and Generate Number
                        </button>
                        <button
                          onClick={() => {
                            handleStatusUpdate(application.id, 'rejected');
                            setShowDetailsModal(false);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 hover:text-red-900 transition-colors duration-200 shadow-sm"
                        >
                          <XCircle className="h-3 w-3" />
                          Reject
                        </button>
                      </>
                    )}

                    {application.status === 'admitted' && (
                      <div className="flex items-center gap-3 p-3 bg-emerald-900/30 rounded-lg border border-emerald-700">
                        <CheckCircle className="h-5 w-5 text-emerald-400" />
                        <div>
                          <p className="text-emerald-400 font-medium">Admitted</p>
                          <p className="text-slate-400 text-sm">
                            Admission: {application.admissionNumber} | Order: {application.orderNumber}
                          </p>
                        </div>
                      </div>
                    )}

                    {application.status !== 'admitted' && application.status !== 'deleted' && (
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
                            handleStatusUpdate(application.id, 'deleted');
                            setShowDetailsModal(false);
                          }
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 hover:text-red-900 transition-colors duration-200 shadow-sm ml-auto"
                      >
                        <XCircle className="h-3 w-3" />
                        Delete Application
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>

      {/* Application Details Modal */}
      {showDetailsModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl border border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Application Details</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Applicant Information */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Applicant Information
                </h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="admin-label">Full Name</label>
                    <div className="text-white">{selectedApplication?.applicant?.name || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="admin-label">Email Address</label>
                    <div className="text-white">{selectedApplication?.applicant?.email || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="admin-label">Phone Number</label>
                    <div className="text-white">{selectedApplication?.applicant?.phone || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="admin-label">Age</label>
                    <div className="text-white">{selectedApplication?.applicant?.age || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="admin-label">Nationality</label>
                    <div className="text-white">{selectedApplication?.applicant?.nationality || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="admin-label">Refugee Status</label>
                    <div className="text-white">{selectedApplication?.applicant?.refugeeStatus || 'N/A'}</div>
                  </div>
                </div>
              </div>

              {/* Program Information */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Program Information
                </h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="admin-label">Program Name</label>
                    <div className="text-white">{selectedApplication?.program?.name || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="admin-label">Program Type</label>
                    <div className="text-white">{selectedApplication?.program?.type || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="admin-label">Priority</label>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(selectedApplication?.priority || 'medium')}`}>
                      {selectedApplication?.priority || 'medium'}
                    </span>
                  </div>
                  <div>
                    <label className="admin-label">Submitted Date</label>
                    <div className="text-white">{selectedApplication?.submittedAt ? new Date(selectedApplication.submittedAt).toLocaleDateString() : 'N/A'}</div>
                  </div>
                  <div>
                    <label className="admin-label">Application Status</label>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedApplication?.status || 'pending')}`}>
                      {getStatusIcon(selectedApplication?.status || 'pending')}
                      {(selectedApplication?.status || 'pending').replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Essays Review */}
              {selectedApplication?.applicant?.essays && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Applicant Essays
                  </h4>
                  <div className="space-y-4">
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h5 className="font-medium text-white mb-2">Personal Statement</h5>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {selectedApplication.applicant.essays.personalStatement || 'No personal statement provided'}
                      </p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h5 className="font-medium text-white mb-2">Motivation Essay</h5>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {selectedApplication.applicant.essays.motivationEssay || 'No motivation essay provided'}
                      </p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h5 className="font-medium text-white mb-2">Future Goals Essay</h5>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {selectedApplication.applicant.essays.futureGoalsEssay || 'No future goals essay provided'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Documents */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Submitted Documents
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                    <FileCheck className="h-4 w-4 text-green-400" />
                    <span className="text-white">{selectedApplication.documents.offerLetter}</span>
                    <button className="admin-button-secondary ml-auto">View</button>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                    <FileCheck className="h-4 w-4 text-green-400" />
                    <span className="text-white">{selectedApplication.documents.idDocument}</span>
                    <button className="admin-button-secondary ml-auto">View</button>
                  </div>
                  {selectedApplication.documents.cvResume && (
                    <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                      <FileCheck className="h-4 w-4 text-green-400" />
                      <span className="text-white">{selectedApplication.documents.cvResume}</span>
                      <button className="admin-button-secondary ml-auto">View</button>
                    </div>
                  )}
                  {selectedApplication.documents.recommendationLetters && selectedApplication.documents.recommendationLetters.map((doc: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                      <FileCheck className="h-4 w-4 text-green-400" />
                      <span className="text-white">{doc}</span>
                      <button className="admin-button-secondary ml-auto">View</button>
                    </div>
                  ))}
                  {selectedApplication.documents.certificates && selectedApplication.documents.certificates.map((doc: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                      <FileCheck className="h-4 w-4 text-green-400" />
                      <span className="text-white">{doc}</span>
                      <button className="admin-button-secondary ml-auto">View</button>
                    </div>
                  ))}
                  {selectedApplication.documents.essays && selectedApplication.documents.essays.map((doc: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                      <FileCheck className="h-4 w-4 text-green-400" />
                      <span className="text-white">{doc}</span>
                      <button className="admin-button-secondary ml-auto">View</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review Information */}
              {selectedApplication.reviewNotes && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Review Information
                  </h4>
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <div className="mb-3">
                      <label className="admin-label">Review Notes</label>
                      <div className="text-white">{selectedApplication.reviewNotes}</div>
                    </div>
                    {selectedApplication.reviewerFeedback && (
                      <>
                        <div className="mb-3">
                          <label className="admin-label">Essays Review</label>
                          <div className="text-white">{selectedApplication.reviewerFeedback.essaysReview}</div>
                        </div>
                        <div className="mb-3">
                          <label className="admin-label">Documents Review</label>
                          <div className="text-white">{selectedApplication.reviewerFeedback.documentsReview}</div>
                        </div>
                        <div>
                          <label className="admin-label">Overall Assessment</label>
                          <div className="text-white">{selectedApplication.reviewerFeedback.overallAssessment}</div>
                        </div>
                      </>
                    )}
                    <div className="text-sm text-slate-400 mt-3">
                      <span className="text-white">Reviewed by: {selectedApplication.reviewedBy}</span>
                      <span className="ml-2">Reviewed at: {selectedApplication.reviewedAt && new Date(selectedApplication.reviewedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Update Section */}
              <div className="pt-4 border-t border-slate-700">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Application Status Management
                </h4>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="admin-label">Current Status</label>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(selectedApplication.status)}`}>
                        {getStatusIcon(selectedApplication.status)}
                        {selectedApplication.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="admin-label">Update Status</label>
                    <div className="flex gap-2">
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="flex-1 bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select new status...</option>
                        <option value="pending" className="bg-slate-700">Pending</option>
                        <option value="under_review" className="bg-slate-700">Under Review</option>
                        <option value="shortlisted" className="bg-slate-700">Shortlisted</option>
                        <option value="waitlisted" className="bg-slate-700">Waitlisted</option>
                        <option value="approved" className="bg-slate-700">Approved</option>
                        <option value="admitted" className="bg-slate-700">Admitted</option>
                        <option value="rejected" className="bg-slate-700">Rejected</option>
                        <option value="deleted" className="bg-slate-700">Delete Application</option>
                      </select>
                      
                      <button
                        onClick={handleModalStatusUpdate}
                        disabled={!selectedStatus || selectedStatus === selectedApplication?.status}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 hover:text-blue-900 transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Update Status
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleSendEmail(selectedApplication, 'status')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 hover:text-blue-900 transition-colors duration-200 shadow-sm"
                  >
                    <Mail className="h-3 w-3" />
                    Send Status Email
                  </button>

                  {selectedApplication.status === 'unsubmitted' && (
                    <button
                      onClick={() => handleSendEmail(selectedApplication, 'reminder')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 hover:text-amber-900 transition-colors duration-200 shadow-sm"
                    >
                      <Mail className="h-3 w-3" />
                      Send Reminder
                    </button>
                  )}
                  
                  {selectedApplication.status === 'approved' && (
                    <button
                      onClick={() => {
                        const admissionNumber = 'WRRP' + new Date().getFullYear() + String(Math.floor(Math.random() * 1000)).padStart(3, '0');
                        const orderNumber = 'ORD-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 1000)).padStart(3, '0');
                        handleStatusUpdate(selectedApplication.id, 'admitted');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-900 transition-colors duration-200 shadow-sm"
                    >
                      <Award className="h-3 w-3" />
                      Admit & Generate Number
                    </button>
                  )}
                </div>
              </div>
              
              {/* Modal Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="admin-button-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Template Modal */}
      {selectedApplication && (
        <EmailTemplateModal
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          application={selectedApplication}
          emailType={emailType}
          onSendEmail={handleSendEmailWithTemplate}
        />
      )}
    </>
  );

  if (loading) {
    if (embedded) {
      return (
        <div className="space-y-6">
          {header}
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      );
    }
    return (
      <AdminLayout title="Application Management" subtitle="Loading applications...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (embedded) {
    return <div className="space-y-6">{content}</div>;
  }

  return (
    <AdminLayout 
      title="Application Management" 
      subtitle={safeApplications.length + " total applications"}
      actions={
        <button className="admin-button-primary">
          <Download className="h-4 w-4" />
          Export
        </button>
      }
    >
      {content}
    </AdminLayout>
  );
}

