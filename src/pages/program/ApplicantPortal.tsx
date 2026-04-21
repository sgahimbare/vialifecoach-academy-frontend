import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, FileText, Mail, Calendar, CheckCircle, Clock, AlertCircle, User } from "lucide-react";

interface Application {
  id: string;
  submittedDate: string;
  lastUpdated?: string;
  status: 'submitted' | 'under_review' | 'shortlisted' | 'waitlisted' | 'approved' | 'admitted' | 'rejected' | 'pending' | 'deleted';
  fullName: string;
  email: string;
  referenceNumber: string;
  programName?: string;
  applicationData?: any;
}

export default function ApplicantPortal() {
  const navigate = useNavigate();
  const [searchEmail, setSearchEmail] = useState('');
  const [searchReference, setSearchReference] = useState('');
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchEmail) params.append('email', searchEmail);
      if (searchReference) params.append('reference', searchReference);
      const res = await fetch(`/api/v1/applications/search?${params.toString()}`);
      const data = await res.json();
      const rows = Array.isArray(data) ? data : (data?.data || []);
      setApplications(rows);
    } catch (error) {
      console.error('Failed to search applications:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'text-gray-600 bg-gray-100';
      case 'pending': return 'text-gray-600 bg-gray-100';
      case 'under_review': return 'text-blue-600 bg-blue-100';
      case 'shortlisted': return 'text-yellow-600 bg-yellow-100';
      case 'waitlisted': return 'text-orange-600 bg-orange-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'admitted': return 'text-emerald-700 bg-emerald-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'deleted': return 'text-gray-500 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <FileText className="h-4 w-4" />;
      case 'pending': return <FileText className="h-4 w-4" />;
      case 'under_review': return <Clock className="h-4 w-4" />;
      case 'shortlisted': return <CheckCircle className="h-4 w-4" />;
      case 'waitlisted': return <AlertCircle className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'admitted': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <AlertCircle className="h-4 w-4" />;
      case 'deleted': return <AlertCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'submitted': return 'Application Submitted';
      case 'pending': return 'Pending';
      case 'under_review': return 'Under Review';
      case 'shortlisted': return 'Shortlisted';
      case 'waitlisted': return 'Waitlisted';
      case 'approved': return 'Approved';
      case 'admitted': return 'Admitted';
      case 'rejected': return 'Not Selected';
      case 'deleted': return 'Withdrawn';
      default: return 'Unknown';
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'submitted': return 'Your application has been received and is awaiting initial review.';
      case 'pending': return 'Your application has been received and is awaiting initial review.';
      case 'under_review': return 'Your application is currently being reviewed by our selection committee.';
      case 'shortlisted': return 'Congratulations! You are in the final consideration group.';
      case 'waitlisted': return 'You are a strong candidate but no space is currently available.';
      case 'approved': return 'Congratulations! Your application has been approved.';
      case 'admitted': return 'Welcome! You have been admitted into the program.';
      case 'rejected': return 'We appreciate your interest, but you were not selected this time.';
      case 'deleted': return 'This application has been withdrawn.';
      default: return 'Status information not available.';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/program/women-refugee-rise')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Program
            </button>
            
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">Applicant Portal</h1>
              <p className="text-sm text-gray-600">Women Refugee Rise Program</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Search Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Check Your Application Status</h2>
            <p className="text-gray-600 mb-6">
              Enter your email address or application reference number to check your application status.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reference Number
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchReference}
                    onChange={(e) => setSearchReference(e.target.value)}
                    placeholder="WRRP-2024-XXX"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            
            <button
              onClick={handleSearch}
              disabled={loading || (!searchEmail && !searchReference)}
              className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Search Application
                </>
              )}
            </button>
          </div>

          {/* Results */}
          {applications.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Found {applications.length} Application{applications.length > 1 ? 's' : ''}
              </h3>
              
              {applications.map((application) => (
                <div key={application.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  {/* Application Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{application.fullName}</h4>
                        <p className="text-sm text-gray-600">{application.email}</p>
                        <p className="text-xs text-gray-500">Reference: {application.referenceNumber}</p>
                      </div>
                      
                      <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(application.status)}`}>
                        {getStatusIcon(application.status)}
                        {getStatusText(application.status)}
                      </div>
                    </div>
                  </div>

                  {/* Application Details */}
                  <div className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Application Details</h5>
                        <dl className="space-y-2">
                          <div className="flex justify-between">
                            <dt className="text-sm text-gray-600">Submitted:</dt>
                            <dd className="text-sm font-medium text-gray-900">{application.submittedDate}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-gray-600">Status:</dt>
                            <dd className={`text-sm font-medium ${getStatusColor(application.status)}`}>
                              {getStatusText(application.status)}
                            </dd>
                          </div>
                        </dl>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">What This Means</h5>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {getStatusDescription(application.status)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <div className="flex gap-3">
                      <button
                        onClick={() => setSelectedApplication(application)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                      >
                        View Details
                      </button>
                      
                      {application.status === 'accepted' && (
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                          Accept Offer
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {applications.length === 0 && !loading && (searchEmail || searchReference) && (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Application Found</h3>
              <p className="text-gray-600 mb-4">
                We couldn't find an application matching your search criteria.
              </p>
              <p className="text-sm text-gray-600">
                Please double-check your email address or reference number, or contact us if you believe this is an error.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Application Details Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Submitted Application</h3>
                <p className="text-sm text-gray-600">
                  {selectedApplication.programName || 'Program'} • {selectedApplication.referenceNumber}
                </p>
              </div>
              <button
                onClick={() => setSelectedApplication(null)}
                className="text-gray-500 hover:text-gray-800"
              >
                Close
              </button>
            </div>
            <div className="p-5 space-y-6">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Applicant</div>
                  <div className="font-medium text-gray-900">{selectedApplication.fullName}</div>
                  <div className="text-gray-600">{selectedApplication.email}</div>
                </div>
                <div>
                  <div className="text-gray-500">Status</div>
                  <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedApplication.status)}`}>
                    {getStatusIcon(selectedApplication.status)}
                    {getStatusText(selectedApplication.status)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Submitted</div>
                  <div className="text-gray-900">
                    {selectedApplication.submittedDate ? new Date(selectedApplication.submittedDate).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Last Updated</div>
                  <div className="text-gray-900">
                    {selectedApplication.lastUpdated ? new Date(selectedApplication.lastUpdated).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>

              {selectedApplication.applicationData && (
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Personal Information</h4>
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap">
{JSON.stringify(selectedApplication.applicationData.personalInfo || selectedApplication.applicationData.accountCreation || {}, null, 2)}
                    </pre>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Program Selection</h4>
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap">
{JSON.stringify(selectedApplication.applicationData.programSelection || {}, null, 2)}
                    </pre>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Personal Statement</h4>
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap">
{JSON.stringify(selectedApplication.applicationData.personalStatement || {}, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Contact Section */}
      <div className="bg-blue-50 mt-8">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
            <p className="text-gray-700 mb-6">
              If you have questions about your application or need assistance with the portal, our team is here to help.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <Mail className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900 mb-1">Email Support</h4>
                <p className="text-sm text-gray-600">programs@vialifecoach.org</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <User className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900 mb-1">Phone Support</h4>
                <p className="text-sm text-gray-600">+250-785-555-0123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
