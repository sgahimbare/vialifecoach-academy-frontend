import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { certificateService } from "@/services/certificateService";

export default function CertificateTemplatePage() {
  const [certificatePreview, setCertificatePreview] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    certificateService
      .getCertificatePreview()
      .then((html) => {
        setCertificatePreview(html);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load certificate preview:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-10">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <Link
            to="/certifications"
            className="inline-flex items-center text-blue-700 hover:text-blue-800 font-medium mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Certifications
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-3">Certificate Template</h1>
            <p className="text-slate-600">
              This is how your certificate of completion will look after successful course completion.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-xl p-3 sm:p-6 md:p-8 overflow-x-auto">
              <div
                dangerouslySetInnerHTML={{ __html: certificatePreview }}
                className="mx-auto"
                style={{ maxWidth: "1123px" }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
