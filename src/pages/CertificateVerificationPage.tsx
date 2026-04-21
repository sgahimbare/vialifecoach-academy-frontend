import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Shield, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";
import { certificateService, Certificate } from "@/services/certificateService";

export default function CertificateVerificationPage() {
  const { certificateCode } = useParams<{ certificateCode: string }>();
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!certificateCode) {
      setError("Certificate code is required");
      setLoading(false);
      return;
    }

    certificateService.verifyCertificate(certificateCode)
      .then((data) => {
        setCertificate(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to verify certificate");
        setLoading(false);
      });
  }, [certificateCode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Verifying certificate...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Certificate Not Found</h1>
            <p className="text-slate-600 mb-6">{error}</p>
            <p className="text-sm text-slate-500">
              Please check the certificate code or contact support if you believe this is an error.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <Shield className="w-12 h-12 text-yellow-300 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Certificate Verification</h1>
          <p className="text-blue-100">Verify the authenticity of Vialifecoach certificates</p>
        </div>
      </div>

      {/* Verification Result */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            {/* Status Banner */}
            <div className={`p-6 text-center ${
              certificate?.status === 'issued' ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800'
            }`}>
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="w-8 h-8 mr-2" />
                <span className="text-xl font-semibold">
                  {certificate?.status === 'issued' ? 'Certificate Verified' : 'Certificate Status: ' + certificate?.status}
                </span>
              </div>
              <p className="text-sm opacity-90">
                This certificate has been verified as authentic
              </p>
            </div>

            {/* Certificate Details */}
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800 mb-4">Certificate Details</h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Certificate ID</p>
                      <p className="font-mono text-slate-800">{certificate?.certificate_code}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Issue Date</p>
                      <p className="text-slate-800">
                        {certificate?.issue_date ? new Date(certificate.issue_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        certificate?.status === 'issued' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {certificate?.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-800 mb-4">Recipient Information</h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Student Name</p>
                      <p className="text-slate-800 font-medium">{certificate?.student_name}</p>
                    </div>
                    {certificate?.student_email && (
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Email</p>
                        <p className="text-slate-800">{certificate.student_email}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Course Completed</p>
                      <p className="text-slate-800 font-medium">{certificate?.course_title}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Description */}
              {certificate?.course_description && (
                <div className="mt-8 pt-8 border-t border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">Course Description</h3>
                  <p className="text-slate-600 leading-relaxed">{certificate.course_description}</p>
                </div>
              )}

              {/* Verification Badge */}
              <div className="mt-8 p-6 bg-blue-50 rounded-lg text-center">
                <Shield className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Official Verification</h3>
                <p className="text-blue-700 text-sm">
                  This certificate has been verified through the Vialifecoach Global Foundation 
                  certification system and is confirmed to be authentic.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-8 text-center">
            <button 
              onClick={() => window.history.back()}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold border border-blue-200 hover:bg-blue-50 transition-colors mr-4"
            >
              Go Back
            </button>
            <a 
              href="/certifications"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View All Certifications
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
