import { useState, useEffect } from "react";
import { Award, Download, Eye, Calendar, ExternalLink, CheckCircle } from "lucide-react";
import { certificateService, Certificate } from "@/services/certificateService";

interface StudentCertificatesProps {
  studentId: string;
}

export default function StudentCertificates({ studentId }: StudentCertificatesProps) {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    certificateService.getStudentCertificates(studentId)
      .then((data) => {
        setCertificates(data.certificates || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load certificates:", error);
        setLoading(false);
      });
  }, [studentId]);

  const downloadCertificate = (certificate: Certificate) => {
    if (certificate.certificate_pdf_url) {
      // Download PDF if available
      window.open(certificate.certificate_pdf_url, '_blank');
    } else {
      // Download HTML as file
      const blob = new Blob([certificate.certificate_html], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${certificate.certificate_code}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  };

  const viewCertificate = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setShowPreview(true);
  };

  const getVerificationUrl = (certificateCode: string) => {
    return `${window.location.origin}/verify/${certificateCode}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (certificates.length === 0) {
    return (
      <div className="text-center py-12">
        <Award className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-600 mb-2">No Certificates Yet</h3>
        <p className="text-slate-500">
          Complete your courses to earn professional certificates
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Certificates Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((certificate) => (
          <div key={certificate.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="p-6">
              {/* Certificate Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <Award className="w-8 h-8 text-yellow-500 mr-3" />
                  <div>
                    <h3 className="font-semibold text-slate-800 line-clamp-2">
                      {certificate.course_title}
                    </h3>
                    <p className="text-sm text-slate-500">Certificate of Completion</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {certificate.status}
                </span>
              </div>

              {/* Certificate Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-slate-600">
                  <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                  Issued: {new Date(certificate.issue_date).toLocaleDateString()}
                </div>
                <div className="text-sm text-slate-600">
                  <span className="font-medium">Certificate ID:</span>
                  <span className="font-mono text-xs ml-1">{certificate.certificate_code}</span>
                </div>
                <div className="text-sm text-slate-600">
                  <span className="font-medium">Recipient:</span> {certificate.student_name}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => viewCertificate(certificate)}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </button>
                <button
                  onClick={() => downloadCertificate(certificate)}
                  className="flex-1 bg-slate-100 text-slate-700 px-3 py-2 rounded text-sm font-medium hover:bg-slate-200 transition-colors flex items-center justify-center"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </button>
              </div>

              {/* Verification Link */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <a
                  href={getVerificationUrl(certificate.certificate_code)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Verify Certificate
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Certificate Preview Modal */}
      {showPreview && selectedCertificate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{selectedCertificate.course_title}</h2>
                  <p className="text-blue-100">Certificate of Completion</p>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-white hover:text-blue-200 text-2xl leading-none"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Certificate Content */}
            <div className="p-6 overflow-auto max-h-[calc(90vh-200px)]">
              <div 
                dangerouslySetInnerHTML={{ __html: selectedCertificate.certificate_html }}
                className="mx-auto"
              />
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 p-6 border-t">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  Certificate ID: <span className="font-mono">{selectedCertificate.certificate_code}</span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => downloadCertificate(selectedCertificate)}
                    className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Certificate
                  </button>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="bg-slate-200 text-slate-700 px-4 py-2 rounded font-medium hover:bg-slate-300 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
