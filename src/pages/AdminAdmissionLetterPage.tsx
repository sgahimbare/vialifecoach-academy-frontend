import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Mail, Download, Send, FileText, Search, Filter, CheckCircle, AlertCircle, Clock, Calendar, Globe, Award, Users } from "lucide-react";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { apiRequest } from "@/lib/api";
import { buildAdmissionLetterHtml } from "@/lib/admissionLetterTemplate";

interface Applicant {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  program: string;
  applicationDate: string;
  status: 'Accepted' | 'Pending' | 'Rejected';
  avatar?: string;
  admissionNumber?: string;
  admissionDate?: string;
}

// Backend response types - matches Application from AdminApplicationsPage
interface BackendApplication {
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

interface LetterFields {
  applicantName: string;
  programName: string;
  programDuration: string;
  startDate: string;
  locationMode: string;
  registrationDeadline: string;
  orientationDate: string;
  firstDayOfClasses: string;
  tuitionFees: string;
  paymentDeadline: string;
  campusAddress: string;
  administratorName: string;
  admissionType: string;
  acceptanceConfirmation: string;
  documentationNote: string;
}

export default function AdminAdmissionLetterPage() {
  const { user, accessToken } = useAuth();
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showSuccess, setShowSuccess] = useState(false);
  const [emailStatus, setEmailStatus] = useState<{sent: boolean; to: string; error?: string}>({sent: false, to: ''});

  const [letterFields, setLetterFields] = useState<LetterFields>({
    applicantName: "",
    programName: "",
    programDuration: "",
    startDate: "",
    locationMode: "",
    registrationDeadline: "",
    orientationDate: "",
    firstDayOfClasses: "",
    tuitionFees: "",
    paymentDeadline: "",
    campusAddress: "",
    administratorName: user?.name || "",
    admissionType: "FULL-TIME ADMISSION",
    acceptanceConfirmation: "Please confirm your acceptance by replying to this email within 7 days.",
    documentationNote: "Submit all required documents (transcripts, identification, medical certificates)."
  });

  const [letterBody, setLetterBody] = useState<string>(
    "<p>On behalf of the entire Vialifecoach Academy community, I am delighted to extend our warmest congratulations on your successful admission to the <strong>[Program Name]</strong> program for the current academic year.</p>\n<p>Your application demonstrated exceptional merit and potential, and we believe you will make significant contributions to our learning environment. This admission reflects our confidence in your ability to excel academically and thrive personally.</p>\n<p>We are excited to welcome you to the Vialifecoach Academy community and look forward to your contribution to our learning environment.</p>"
  );

  // Fetch real applicants data
  useEffect(() => {
    fetchApplicants();
  }, []);


  useEffect(() => {
    if (!selectedApplicant) return;
    setLetterFields((prev) => ({
      ...prev,
      applicantName: selectedApplicant.name || prev.applicantName,
      programName: selectedApplicant.program || prev.programName
    }));
  }, [selectedApplicant]);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      // Use the same API endpoint as AdminApplicationsPage
      const applicationsResponse = await apiRequest('/admin/applications', { 
        token: accessToken 
      }) as any;
      
      if (applicationsResponse.success) {
        // Show all applicants from the applications page - no status filter
        const allApplicants = applicationsResponse.data || [];
        
        // Transform backend data to frontend format
        const transformedApplicants = allApplicants.map((app: any): Applicant => ({
          id: parseInt(app.id) || 0,
          name: app.applicant.name,
          email: app.applicant.email,
          phone: app.applicant.phone,
          program: app.program.name,
          applicationDate: new Date(app.submittedAt).toLocaleDateString(),
          status: app.status === 'admitted' ? 'Accepted' : 'Pending' as const,
          avatar: undefined,
          admissionNumber: app.admissionNumber,
          admissionDate: app.admissionDate
        }));
        setApplicants(transformedApplicants);
      } else {
        console.error('Failed to fetch applicants');
        setApplicants([]);
      }
    } catch (error) {
      console.error('Error fetching applicants:', error);
      setApplicants([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredApplicants = applicants.filter(applicant => {
    const matchesSearch = applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         applicant.program.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || applicant.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const setField = (key: keyof LetterFields, value: string) => {
    setLetterFields((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const getMissingFields = () => {
    const requiredKeys: Array<keyof LetterFields> = [
      'applicantName',
      'programName',
      'programDuration',
      'startDate',
      'locationMode',
      'registrationDeadline',
      'orientationDate',
      'firstDayOfClasses',
      'tuitionFees',
      'paymentDeadline',
      'campusAddress',
      'administratorName',
      'admissionType',
      'acceptanceConfirmation',
      'documentationNote'
    ];
    return requiredKeys.filter((key) => !String(letterFields[key] || "").trim());
  };

  const isLetterBodyEmpty = () => {
    const plainText = String(letterBody || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    return plainText.length === 0;
  };

  const isReadyToSend = useMemo(() => {
    return Boolean(selectedApplicant) && getMissingFields().length === 0 && !isLetterBodyEmpty();
  }, [selectedApplicant, letterFields, letterBody]);

  const buildEmailHtml = () => {
    return buildAdmissionLetterHtml({
      ...letterFields,
      letterBodyHtml: letterBody
    });
  };

  const handleSendEmail = async () => {
    if (!selectedApplicant) {
      setEmailStatus({sent: false, to: '', error: 'Please select an applicant first'});
      return;
    }

    const missing = getMissingFields();
    if (missing.length > 0) {
      setEmailStatus({sent: false, to: selectedApplicant.email, error: 'Please complete all required fields before sending.'});
      return;
    }
    if (isLetterBodyEmpty()) {
      setEmailStatus({sent: false, to: selectedApplicant.email, error: 'Please enter the letter body before sending.'});
      return;
    }

    try {
      setSending(true);
      setEmailStatus({sent: false, to: selectedApplicant.email, error: undefined});
      
      // Send email to applicant's Gmail via professional email service
      const response = await fetch('/api/v1/admin/applications/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          applicationId: selectedApplicant.id,
          to: selectedApplicant.email,
          subject: `Official Admission Offer - Vialifecoach Academy - ${new Date().getFullYear()}`,
          content: buildEmailHtml(),
          pdfHtml: buildEmailHtml(),
          templateName: 'Admission Letter',
          sentBy: user?.name || 'Admin',
          admissionMeta: {
            applicantName: selectedApplicant.name,
            programName: selectedApplicant.program || "Program",
            admissionNumber: selectedApplicant.admissionNumber,
            admissionDate: selectedApplicant.admissionDate
          }
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setEmailStatus({sent: true, to: selectedApplicant.email});
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000);
      } else {
        setEmailStatus({sent: false, to: selectedApplicant.email, error: result.message || 'Failed to send email'});
      }
      
    } catch (error) {
      console.error('Error sending admission email:', error);
      setEmailStatus({sent: false, to: selectedApplicant.email, error: 'Network error. Please try again.'});
    } finally {
      setSending(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!selectedApplicant) {
      alert("Please select an applicant first");
      return;
    }

    const missing = getMissingFields();
    if (missing.length > 0) {
      alert("Please complete all required fields before downloading the PDF.");
      return;
    }
    if (isLetterBodyEmpty()) {
      alert("Please enter the letter body before downloading the PDF.");
      return;
    }

    try {
      setLoading(true);
      
      // Generate PDF with professional template
      const personalizedTemplate = buildEmailHtml();

      // Generate PDF via API
      const response = await fetch('/api/v1/admin/generate-admission-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          htmlContent: personalizedTemplate,
          fileName: `Vialifecoach_Academy_Admission_${selectedApplicant.name.replace(/\s+/g, '_')}.pdf`
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Vialifecoach_Academy_Admission_${selectedApplicant.name.replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        alert(`PDF successfully downloaded for ${selectedApplicant.name}`);
      } else {
        alert('Failed to generate PDF. Please try again.');
      }
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Admission Letters">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-50 mb-4">Admission Letter Management</h1>
          <p className="text-lg text-slate-300">Send professional admission letters directly to applicants' Gmail accounts</p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-green-800">Email Sent Successfully!</h3>
                <p className="text-green-700">Admission letter has been sent to <strong>{emailStatus.to}</strong></p>
              </div>
            </div>
          </div>
        )}

        {/* Email Status */}
        {emailStatus.error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="text-lg font-semibold text-red-800">Email Failed to Send</h3>
                <p className="text-red-700">Failed to send to <strong>{emailStatus.to}</strong>: {emailStatus.error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content - Vertical Layout */}
        <div className="space-y-6">
          {/* Find Applicants - Top */}
          <div className="admin-card">
            <h2 className="text-xl font-bold text-slate-50 mb-4 flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-400" />
                Find Applicants
              </h2>
            
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or program..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-600 text-slate-50 placeholder-slate-400"
                />
              </div>
            
            <div className="relative">
                <Filter className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-slate-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-slate-600 text-slate-50"
                >
                  <option value="all">All Applicants</option>
                  <option value="accepted">Accepted Only</option>
                  <option value="pending">Pending Only</option>
                  <option value="rejected">Rejected Only</option>
                </select>
              </div>
          </div>
          </div>

          {/* Selected Applicant - Middle */}
          <div className="admin-card">
            <h2 className="text-xl font-bold text-slate-50 mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-400" />
                  Selected Applicant
                </span>
                <span className="text-sm text-slate-400">
                  {filteredApplicants.length} {filteredApplicants.length === 1 ? 'Applicant' : 'Applicants'}
                </span>
            </h2>
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-400"></div>
              </div>
            ) : filteredApplicants.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {filteredApplicants.map((applicant) => (
                  <div
                    key={applicant.id}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      selectedApplicant?.id === applicant.id
                        ? 'border-blue-400 bg-slate-600 shadow-lg transform scale-105'
                        : 'border-slate-400 hover:border-slate-300 hover:bg-slate-500 hover:shadow-md'
                    }`}
                    onClick={() => setSelectedApplicant(applicant)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {applicant.avatar && (
                            <img 
                              src={applicant.avatar} 
                              alt={applicant.name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-slate-400"
                            />
                          )}
                          <div>
                            <p className="font-semibold text-slate-50 text-lg">{applicant.name}</p>
                            <p className="text-sm text-slate-300 flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              {applicant.email}
                            </p>
                            <p className="text-sm text-slate-400">{applicant.program}</p>
                            <p className="text-xs text-slate-500">Applied: {applicant.applicationDate}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          applicant.status === 'Accepted' 
                            ? 'bg-green-100 text-green-800 border-green-200'
                            : applicant.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                            : 'bg-red-100 text-red-800 border-red-200'
                        }`}>
                          {applicant.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-16 w-16 mx-auto mb-4 text-slate-400" />
                <h3 className="text-xl font-semibold text-slate-300 mb-2">No Applicants Found</h3>
                <p className="text-slate-500">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>

          {/* Admission Letter Builder - Bottom (Full Width) */}
          <div className="admin-card">
            <h2 className="text-xl font-bold text-slate-50 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-400" />
              Admission Letter Builder
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Applicant Name</label>
                  <input
                    value={letterFields.applicantName}
                    onChange={(e) => setField('applicantName', e.target.value)}
                    placeholder="Applicant full name"
                    className="w-full rounded-lg border border-slate-400 px-3 py-2 text-slate-50 bg-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Program Name</label>
                  <input
                    value={letterFields.programName}
                    onChange={(e) => setField('programName', e.target.value)}
                    placeholder="Program name"
                    className="w-full rounded-lg border border-slate-400 px-3 py-2 text-slate-50 bg-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Program Duration</label>
                  <input
                    value={letterFields.programDuration}
                    onChange={(e) => setField('programDuration', e.target.value)}
                    placeholder="e.g., 6 months"
                    className="w-full rounded-lg border border-slate-400 px-3 py-2 text-slate-50 bg-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Start Date</label>
                  <input
                    value={letterFields.startDate}
                    onChange={(e) => setField('startDate', e.target.value)}
                    placeholder="e.g., September 1, 2026"
                    className="w-full rounded-lg border border-slate-400 px-3 py-2 text-slate-50 bg-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Location / Mode</label>
                  <input
                    value={letterFields.locationMode}
                    onChange={(e) => setField('locationMode', e.target.value)}
                    placeholder="e.g., Online"
                    className="w-full rounded-lg border border-slate-400 px-3 py-2 text-slate-50 bg-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Admission Type</label>
                  <input
                    value={letterFields.admissionType}
                    onChange={(e) => setField('admissionType', e.target.value)}
                    placeholder="e.g., FULL-TIME ADMISSION"
                    className="w-full rounded-lg border border-slate-400 px-3 py-2 text-slate-50 bg-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Registration Deadline</label>
                  <input
                    value={letterFields.registrationDeadline}
                    onChange={(e) => setField('registrationDeadline', e.target.value)}
                    placeholder="e.g., August 15, 2026"
                    className="w-full rounded-lg border border-slate-400 px-3 py-2 text-slate-50 bg-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Orientation Date</label>
                  <input
                    value={letterFields.orientationDate}
                    onChange={(e) => setField('orientationDate', e.target.value)}
                    placeholder="e.g., August 25, 2026"
                    className="w-full rounded-lg border border-slate-400 px-3 py-2 text-slate-50 bg-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">First Day of Classes</label>
                  <input
                    value={letterFields.firstDayOfClasses}
                    onChange={(e) => setField('firstDayOfClasses', e.target.value)}
                    placeholder="e.g., September 1, 2026"
                    className="w-full rounded-lg border border-slate-400 px-3 py-2 text-slate-50 bg-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Tuition Fees</label>
                  <input
                    value={letterFields.tuitionFees}
                    onChange={(e) => setField('tuitionFees', e.target.value)}
                    placeholder="e.g., USD 1,000"
                    className="w-full rounded-lg border border-slate-400 px-3 py-2 text-slate-50 bg-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Payment Deadline</label>
                  <input
                    value={letterFields.paymentDeadline}
                    onChange={(e) => setField('paymentDeadline', e.target.value)}
                    placeholder="e.g., August 20, 2026"
                    className="w-full rounded-lg border border-slate-400 px-3 py-2 text-slate-50 bg-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Campus Address</label>
                  <input
                    value={letterFields.campusAddress}
                    onChange={(e) => setField('campusAddress', e.target.value)}
                    placeholder="Campus address, city, country"
                    className="w-full rounded-lg border border-slate-400 px-3 py-2 text-slate-50 bg-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Administrator Name</label>
                  <input
                    value={letterFields.administratorName}
                    onChange={(e) => setField('administratorName', e.target.value)}
                    placeholder="Administrator name"
                    className="w-full rounded-lg border border-slate-400 px-3 py-2 text-slate-50 bg-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Letter Body</label>
                <RichTextEditor
                  value={letterBody}
                  onChange={setLetterBody}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Acceptance Confirmation Text</label>
                  <textarea
                    value={letterFields.acceptanceConfirmation}
                    onChange={(e) => setField('acceptanceConfirmation', e.target.value)}
                    className="w-full rounded-lg border border-slate-400 px-3 py-2 text-slate-50 bg-slate-600 min-h-[90px]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Documentation Note</label>
                  <textarea
                    value={letterFields.documentationNote}
                    onChange={(e) => setField('documentationNote', e.target.value)}
                    className="w-full rounded-lg border border-slate-400 px-3 py-2 text-slate-50 bg-slate-600 min-h-[90px]"
                  />
                </div>
              </div>

              <div className="mt-2 rounded-lg border border-slate-400 bg-slate-600 p-4">
                <p className="text-sm text-slate-300 mb-2"><strong>Preview</strong></p>
                <div className="max-h-80 overflow-y-auto border border-slate-400 bg-white p-4 rounded-lg" dangerouslySetInnerHTML={{ __html: buildEmailHtml() }} />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Full Width */}
        {selectedApplicant && (
          <div className="mt-6 admin-card mb-6">
            <h3 className="text-lg font-bold text-slate-50 mb-4">Send Admission Package</h3>
            {!isReadyToSend && (
              <div className="mb-4 rounded-lg border border-amber-200 bg-amber-900/50 p-3 text-sm text-amber-200">
                Please complete all required fields before sending or downloading the letter.
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={handleSendEmail}
                disabled={sending || !isReadyToSend}
                className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                <Send className="h-5 w-5" />
                {sending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    <span>Sending to Gmail...</span>
                  </>
                ) : (
                  <>
                    <span>Send to Gmail</span>
                    <span className="text-xs opacity-75 ml-2">{selectedApplicant.email}</span>
                  </>
                )}
              </button>
              
              <button
                onClick={handleDownloadPDF}
                disabled={loading || sending || !isReadyToSend}
                className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                <Download className="h-5 w-5" />
                {loading ? 'Generating...' : 'Download PDF'}
              </button>
            </div>
            
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Email Delivery Status</h4>
              {emailStatus.sent ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Sent to {emailStatus.to}</span>
                </div>
              ) : emailStatus.error ? (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">Failed: {emailStatus.error}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Ready to send</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 admin-card">
          <h3 className="text-lg font-bold text-slate-50 mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-400" />
            Professional Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-slate-300">
            <div className="text-center">
              <div className="bg-slate-600 p-4 rounded-lg border border-slate-400">
                <Mail className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <h4 className="font-semibold">Direct Gmail Delivery</h4>
                <p className="text-sm">Enabled when all fields are complete and an applicant is selected.</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-slate-600 p-4 rounded-lg border border-slate-400">
                <FileText className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <h4 className="font-semibold">Professional Template</h4>
                <p className="text-sm">Editable structured template with live preview.</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-slate-600 p-4 rounded-lg border border-slate-400">
                <Calendar className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <h4 className="font-semibold">Real-time Preview</h4>
                <p className="text-sm">Updates as you edit fields and letter body.</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-slate-600 p-4 rounded-lg border border-slate-400">
                <Award className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <h4 className="font-semibold">Success Tracking</h4>
                <p className="text-sm">Shows send status and PDF generation results.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
