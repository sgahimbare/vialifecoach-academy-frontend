import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Search, Filter, Download, Eye, CheckCircle, XCircle, Clock, Calendar, User, Mail, FileText, Award, AlertTriangle, TrendingUp, Users, FileCheck, Send } from "lucide-react";

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
  status: 'pending' | 'under_review' | 'shortlisted' | 'waitlisted' | 'approved' | 'rejected' | 'admitted' | 'deleted';
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

export default function AdminApplicationsPage() {
  const { accessToken } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [programFilter, setProgramFilter] = useState<string>('all');

  // Mock data - in real app, this would come from API
  const mockApplications: Application[] = [
    {
      id: 'APP001',
      submittedAt: '2024-03-08T10:30:00Z',
      applicant: {
        name: 'Amina Khamis',
        email: 'amina.k@email.com',
        phone: '+250-785-123-456',
        age: 28,
        nationality: 'Rwandan',
        refugeeStatus: 'Refugee',
        essays: {
          personalStatement: 'I am passionate about empowering women refugees in my community...',
          motivationEssay: 'My motivation comes from personal experience overcoming challenges...',
          futureGoalsEssay: 'I aim to establish a business that supports other refugee women...'
        }
      },
      program: {
        name: 'Women Refugee Rise Program',
        type: 'scholarship'
      },
      status: 'under_review',
      priority: 'high',
      documents: {
        offerLetter: 'offer_letter_app001.pdf',
        idDocument: 'id_app001.pdf',
        cvResume: 'cv_app001.pdf',
        recommendationLetters: ['recommendation1_app001.pdf', 'recommendation2_app001.pdf'],
        certificates: ['certificate_app001.pdf'],
        essays: ['personal_statement_app001.pdf', 'motivation_essay_app001.pdf']
      }
    },
    {
      id: 'APP002',
      submittedAt: '2024-03-07T14:15:00Z',
      applicant: {
        name: 'Grace Mugisha',
        email: 'grace.m@email.com',
        phone: '+250-785-234-567',
        age: 32,
        nationality: 'Congolese',
        refugeeStatus: 'Asylum Seeker',
        essays: {
          personalStatement: 'As a survivor of conflict, I understand the importance of mental health...',
          motivationEssay: 'I want to learn skills that will help me support my family...',
          futureGoalsEssay: 'My goal is to create a community center for women...'
        }
      },
      program: {
        name: 'Women Refugee Rise Program',
        type: 'scholarship'
      },
      status: 'under_review',
      priority: 'medium',
      documents: {
        offerLetter: 'offer_letter_app002.pdf',
        idDocument: 'id_app002.pdf',
        cvResume: 'cv_app002.pdf',
        recommendationLetters: ['recommendation1_app002.pdf'],
        essays: ['personal_statement_app002.pdf', 'motivation_essay_app002.pdf']
      },
      reviewNotes: 'Application looks strong, need to verify documents',
      reviewerFeedback: {
        essaysReview: 'Well-written essays showing clear motivation and goals',
        documentsReview: 'All documents submitted, recommendation letters strong',
        overallAssessment: 'Good candidate for the program'
      },
      reviewedBy: 'Admin User',
      reviewedAt: '2024-03-08T09:00:00Z'
    },
    {
      id: 'APP003',
      submittedAt: '2024-03-06T16:45:00Z',
      applicant: {
        name: 'Sarah Niyonzima',
        email: 'sarah.n@email.com',
        phone: '+250-785-345-678',
        age: 25,
        nationality: 'Burundian',
        refugeeStatus: 'Refugee',
        essays: {
          personalStatement: 'I believe in the power of education to transform lives...',
          motivationEssay: 'This program aligns perfectly with my goals...',
          futureGoalsEssay: 'I plan to start a social enterprise helping refugee women...'
        }
      },
      program: {
        name: 'Women Refugee Rise Program',
        type: 'scholarship'
      },
      status: 'admitted',
      priority: 'high',
      documents: {
        offerLetter: 'offer_letter_app003.pdf',
        idDocument: 'id_app003.pdf',
        cvResume: 'cv_app003.pdf',
        recommendationLetters: ['recommendation_app003.pdf'],
        certificates: ['certificate_app003.pdf', 'leadership_cert_app003.pdf'],
        essays: ['personal_statement_app003.pdf', 'motivation_essay_app003.pdf']
      },
      reviewNotes: 'Excellent candidate, approved for WRRP2024001',
      reviewerFeedback: {
        essaysReview: 'Outstanding essays demonstrating leadership potential',
        documentsReview: 'Complete and verified documentation',
        overallAssessment: 'Top candidate - immediate admission recommended'
      },
      reviewedBy: 'Admin User',
      reviewedAt: '2024-03-07T11:30:00Z',
      admissionNumber: 'WRRP2024001',
      orderNumber: 'ORD-2024-001',
      admissionDate: '2024-03-10T00:00:00Z',
      finalDecision: 'Admitted to Women Refugee Rise Program',
      decisionDate: '2024-03-07T11:30:00Z'
    }
  ];

  const mockStats: ApplicationStats = {
    total: 156,
    pending: 23,
    underReview: 18,
    approved: 89,
    rejected: 15,
    waitlisted: 11,
    shortlisted: 8,
    admitted: 12,
    thisWeek: 7
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setApplications(mockApplications);
        setStats(mockStats);
      } catch (error) {
        console.error('Failed to load applications:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [accessToken]);

  const getStatusColor = (status: string) => {
    switch (status) {
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

  const handleStatusUpdate = (applicationId: string, newStatus: Application['status']) => {
    setApplications(prev => prev.map(app => 
      app.id === applicationId 
        ? { ...app, status: newStatus, reviewedAt: new Date().toISOString(), reviewedBy: 'Admin User' }
        : app
    ));
  };

  const handleSendEmail = (application: Application, emailType: 'status' | 'rejection' | 'approval') => {
    let subject = '';
    let content = '';

    if (emailType === 'status') {
      subject = 'Update on Your Application Status';
      content = 'Dear ' + application.applicant?.name + ',\n\nThank you for submitting your application to **' + application.program?.name + '**.\n\nWe would like to inform you that your application is currently **under review** by our evaluation team. We appreciate the time and effort you invested in your submission.\n\nOur team is carefully reviewing all applications to ensure a fair and thorough selection process. You will be notified once a final decision has been made.\n\nThank you for your patience and interest in being part of **' + application.program?.name + '**.\n\nIf you have any questions, please feel free to contact us.\n\nKind regards,\nVialifecoach Global Foundation Academy';
    } else if (emailType === 'rejection') {
      subject = 'Regarding Your Application to ' + application.program?.name;
      content = 'Dear ' + application.applicant?.name + ',\n\nThank you for your interest in ' + application.program?.name + ' and for taking the time to submit your application.\n\nAfter careful consideration, we regret to inform you that your application was not selected for this round of the program. The selection process was highly competitive, and we received many strong applications.\n\nWe truly appreciate the effort you invested in applying. We encourage you to continue pursuing opportunities aligned with your goals and welcome you to apply again in future programs.\n\nWe wish you every success in your future endeavors.\n\nKind regards,\nVialifecoach Global Foundation Academy';
    } else if (emailType === 'approval') {
      subject = 'Congratulations! Your Application to ' + application.program?.name + ' Has Been Approved';
      content = 'Dear ' + application.applicant?.name + ',\n\nCongratulations! We are pleased to inform you that your application to ' + application.program?.name + ' has been successfully approved.\n\nAfter careful review, our team was impressed by your qualifications and motivation. We are excited to welcome you to the program.\n\n**Next Steps:**\n\n1. Please confirm your acceptance of this opportunity by replying to this email.\n2. Complete the required onboarding or registration process.\n3. Further details and instructions will be shared shortly.\n\nWe look forward to working with you and supporting your journey with ' + application.program?.name + '.\n\nIf you have any questions, feel free to contact us.\n\nWarm regards,\nVialifecoach Global Foundation Academy';
    }

    // Create email log
    const emailLog = {
      id: 'LOG' + Date.now(),
      applicantId: application.id,
      applicantName: application.applicant?.name || '',
      applicantEmail: application.applicant?.email || '',
      templateName: emailType.charAt(0).toUpperCase() + emailType.slice(1) + ' Email',
      subject,
      content,
      status: 'sent',
      sentAt: new Date().toISOString(),
      sentBy: 'Admin User',
      applicationId: application.id,
      applicationStatus: application.status
    };

    // Add to email logs (in real app, this would be sent to API)
    console.log('Email sent:', { subject, content, to: application.applicant?.email });
    
    // Show success message
    alert(emailType.charAt(0).toUpperCase() + emailType.slice(1) + ' email sent successfully to ' + application.applicant?.name);
  };

  const filteredApplications = applications.filter(application => {
    const matchesSearch = searchTerm === '' || 
      application.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.applicant.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || application.status === statusFilter;
    const matchesProgram = programFilter === 'all' || application.program.name === programFilter;
    
    return matchesSearch && matchesStatus && matchesProgram;
  });

  if (loading) {
    return (
      <AdminLayout title="Application Management" subtitle="Loading applications...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Application Management" 
      subtitle={applications.length + " total applications"}
      actions={
        <button className="admin-button-primary">
          <Download className="h-4 w-4" />
          Export
        </button>
      }
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="admin-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Total Applications</h3>
              <p className="text-sm text-slate-400">All time</p>
            </div>
            <div className="text-2xl font-bold text-blue-400">{stats?.total || 0}</div>
          </div>
        </div>

        <div className="admin-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Pending Review</h3>
              <p className="text-sm text-slate-400">Awaiting action</p>
            </div>
            <div className="text-2xl font-bold text-yellow-400">{stats?.pending || 0}</div>
          </div>
        </div>

        <div className="admin-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Under Review</h3>
              <p className="text-sm text-slate-400">Being evaluated</p>
            </div>
            <div className="text-2xl font-bold text-blue-400">{stats?.underReview || 0}</div>
          </div>
        </div>

        <div className="admin-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Approved</h3>
              <p className="text-sm text-slate-400">Accepted</p>
            </div>
            <div className="text-2xl font-bold text-green-400">{stats?.approved || 0}</div>
          </div>
        </div>

        <div className="admin-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Rejected</h3>
              <p className="text-sm text-slate-400">Not successful</p>
            </div>
            <div className="text-2xl font-bold text-red-400">{stats?.rejected || 0}</div>
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
          className="admin-select"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="under_review">Under Review</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="waitlisted">Waitlisted</option>
          <option value="approved">Approved</option>
          <option value="admitted">Admitted</option>
          <option value="rejected">Rejected</option>
          <option value="deleted">Deleted</option>
        </select>
        
        <select
          value={programFilter}
          onChange={(e) => setProgramFilter(e.target.value)}
          className="admin-select"
        >
          <option value="all">All Programs</option>
          <option value="Women Refugee Rise Program">Women Refugee Rise Program</option>
          <option value="GVB Healing Program">GVB Healing Program</option>
          <option value="Inner Leadership Program">Inner Leadership Program</option>
        </select>
      </div>

      {/* Applications Table */}
      <div className="admin-table-container">
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
                      className="admin-button-secondary"
                    >
                      <Eye className="h-3 w-3" />
                      View
                    </button>
                    
                    {application.status === 'pending' && (
                      <button
                        onClick={() => handleStatusUpdate(application.id, 'under_review')}
                        className="admin-button-secondary"
                      >
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
                          className="admin-button-success"
                        >
                          <CheckCircle className="h-3 w-3" />
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            handleStatusUpdate(application.id, 'shortlisted');
                            setShowDetailsModal(false);
                          }}
                          className="admin-button-secondary"
                        >
                          <Award className="h-3 w-3" />
                          Shortlist
                        </button>
                        <button
                          onClick={() => {
                            handleStatusUpdate(application.id, 'rejected');
                            setShowDetailsModal(false);
                          }}
                          className="admin-button-danger"
                        >
                          <XCircle className="h-3 w-3" />
                          Reject
                        </button>
                        <button
                          onClick={() => {
                            handleStatusUpdate(application.id, 'waitlisted');
                            setShowDetailsModal(false);
                          }}
                          className="admin-button-secondary"
                        >
                          <AlertTriangle className="h-3 w-3" />
                          Waitlist
                        </button>
                        <button
                          onClick={() => {
                            handleSendEmail(application, 'status');
                            setShowDetailsModal(false);
                          }}
                          className="admin-button-secondary"
                        >
                          <Mail className="h-3 w-3" />
                          Send Status Email
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
                          className="admin-button-success"
                        >
                          <CheckCircle className="h-3 w-3" />
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            handleStatusUpdate(application.id, 'rejected');
                            setShowDetailsModal(false);
                          }}
                          className="admin-button-danger"
                        >
                          <XCircle className="h-3 w-3" />
                          Reject
                        </button>
                        <button
                          onClick={() => {
                            handleStatusUpdate(application.id, 'waitlisted');
                            setShowDetailsModal(false);
                          }}
                          className="admin-button-secondary"
                        >
                          <AlertTriangle className="h-3 w-3" />
                          Waitlist
                        </button>
                        <button
                          onClick={() => {
                            handleSendEmail(application, 'approval');
                            setShowDetailsModal(false);
                          }}
                          className="admin-button-secondary"
                        >
                          <Mail className="h-3 w-3" />
                          Send Approval Email
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
                          className="admin-button-success"
                        >
                          <Award className="h-3 w-3" />
                          Admit and Generate Number
                        </button>
                        <button
                          onClick={() => {
                            handleStatusUpdate(application.id, 'rejected');
                            setShowDetailsModal(false);
                          }}
                          className="admin-button-danger"
                        >
                          <XCircle className="h-3 w-3" />
                          Reject
                        </button>
                        <button
                          onClick={() => {
                            handleSendEmail(application, 'approval');
                            setShowDetailsModal(false);
                          }}
                          className="admin-button-secondary"
                        >
                          <Mail className="h-3 w-3" />
                          Send Approval Email
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
                        className="admin-button-danger ml-auto"
                      >
                        <XCircle className="h-4 w-4" />
                        Delete Application
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredApplications.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            No applications found matching your criteria.
          </div>
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
                    <div className="text-white">{selectedApplication.applicant.name}</div>
                  </div>
                  <div>
                    <label className="admin-label">Email Address</label>
                    <div className="text-white">{selectedApplication.applicant.email}</div>
                  </div>
                  <div>
                    <label className="admin-label">Phone Number</label>
                    <div className="text-white">{selectedApplication.applicant.phone}</div>
                  </div>
                  <div>
                    <label className="admin-label">Age</label>
                    <div className="text-white">{selectedApplication.applicant.age}</div>
                  </div>
                  <div>
                    <label className="admin-label">Nationality</label>
                    <div className="text-white">{selectedApplication.applicant.nationality}</div>
                  </div>
                  <div>
                    <label className="admin-label">Refugee Status</label>
                    <div className="text-white">{selectedApplication.applicant.refugeeStatus}</div>
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
                    <div className="text-white">{selectedApplication.program.name}</div>
                  </div>
                  <div>
                    <label className="admin-label">Program Type</label>
                    <div className="text-white">{selectedApplication.program.type}</div>
                  </div>
                  <div>
                    <label className="admin-label">Priority</label>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(selectedApplication.priority)}`}>
                      {selectedApplication.priority}
                    </span>
                  </div>
                  <div>
                    <label className="admin-label">Submitted Date</label>
                    <div className="text-white">{new Date(selectedApplication.submittedAt).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <label className="admin-label">Application Status</label>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedApplication.status)}`}>
                      {getStatusIcon(selectedApplication.status)}
                      {selectedApplication.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Essays Review */}
              {selectedApplication.applicant.essays && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Applicant Essays
                  </h4>
                  <div className="space-y-4">
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h5 className="font-medium text-white mb-2">Personal Statement</h5>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {selectedApplication.applicant.essays.personalStatement}
                      </p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h5 className="font-medium text-white mb-2">Motivation Essay</h5>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {selectedApplication.applicant.essays.motivationEssay}
                      </p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h5 className="font-medium text-white mb-2">Future Goals Essay</h5>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {selectedApplication.applicant.essays.futureGoalsEssay}
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

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-700">
                {selectedApplication.status === 'pending' && (
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedApplication.id, 'under_review');
                      setShowDetailsModal(false);
                    }}
                    className="admin-button-primary"
                  >
                    Start Review
                  </button>
                )}
                
                {selectedApplication.status === 'under_review' && (
                  <>
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedApplication.id, 'approved');
                        setShowDetailsModal(false);
                      }}
                      className="admin-button-success"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve Application
                    </button>
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedApplication.id, 'shortlisted');
                        setShowDetailsModal(false);
                      }}
                      className="admin-button-secondary"
                    >
                      <Award className="h-4 w-4" />
                      Shortlist
                    </button>
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedApplication.id, 'rejected');
                        setShowDetailsModal(false);
                      }}
                      className="admin-button-danger"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject Application
                    </button>
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedApplication.id, 'waitlisted');
                        setShowDetailsModal(false);
                      }}
                      className="admin-button-secondary"
                    >
                      <AlertTriangle className="h-4 w-4" />
                      Add to Waitlist
                    </button>
                    <button
                      onClick={() => {
                        handleSendEmail(selectedApplication, 'status');
                        setShowDetailsModal(false);
                      }}
                      className="admin-button-secondary"
                    >
                      <Mail className="h-4 w-4" />
                      Send Status Email
                    </button>
                  </>
                )}
                
                {selectedApplication.status === 'shortlisted' && (
                  <>
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedApplication.id, 'approved');
                        setShowDetailsModal(false);
                      }}
                      className="admin-button-success"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve Application
                    </button>
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedApplication.id, 'rejected');
                        setShowDetailsModal(false);
                      }}
                      className="admin-button-danger"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject Application
                    </button>
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedApplication.id, 'waitlisted');
                        setShowDetailsModal(false);
                      }}
                      className="admin-button-secondary"
                    >
                      <AlertTriangle className="h-4 w-4" />
                      Waitlist
                    </button>
                    <button
                      onClick={() => {
                        handleSendEmail(selectedApplication, 'approval');
                        setShowDetailsModal(false);
                      }}
                      className="admin-button-secondary"
                    >
                      <Mail className="h-4 w-4" />
                      Send Approval Email
                    </button>
                  </>
                )}

                {selectedApplication.status === 'approved' && (
                  <>
                    <button
                      onClick={() => {
                        const admissionNumber = 'WRRP' + new Date().getFullYear() + String(Math.floor(Math.random() * 1000)).padStart(3, '0');
                            const orderNumber = 'ORD-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 1000)).padStart(3, '0');
                            handleStatusUpdate(selectedApplication.id, 'admitted');
                            setShowDetailsModal(false);
                          }}
                      className="admin-button-success"
                    >
                      <Award className="h-4 w-4" />
                      Admit and Generate Number
                    </button>
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedApplication.id, 'rejected');
                        setShowDetailsModal(false);
                      }}
                      className="admin-button-danger"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject Application
                    </button>
                    <button
                      onClick={() => {
                        handleSendEmail(selectedApplication, 'approval');
                        setShowDetailsModal(false);
                      }}
                      className="admin-button-secondary"
                    >
                      <Mail className="h-4 w-4" />
                      Send Approval Email
                    </button>
                  </>
                )}

                {selectedApplication.status === 'admitted' && (
                  <div className="flex items-center gap-3 p-3 bg-emerald-900/30 rounded-lg border border-emerald-700">
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                    <div>
                      <p className="text-emerald-400 font-medium">Admitted</p>
                      <p className="text-slate-400 text-sm">
                        Admission: {selectedApplication.admissionNumber} | Order: {selectedApplication.orderNumber}
                      </p>
                    </div>
                  </div>
                )}

                {selectedApplication.status !== 'admitted' && selectedApplication.status !== 'deleted' && (
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
                        handleStatusUpdate(selectedApplication.id, 'deleted');
                        setShowDetailsModal(false);
                      }
                    }}
                    className="admin-button-danger ml-auto"
                  >
                    <XCircle className="h-4 w-4" />
                    Delete Application
                  </button>
                )}
                
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
    </AdminLayout>
  );
}

