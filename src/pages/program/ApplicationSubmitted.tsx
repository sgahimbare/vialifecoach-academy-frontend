import { useNavigate } from "react-router-dom";
import { CheckCircle, ArrowLeft, Mail, Calendar, Users, FileText } from "lucide-react";

export default function ApplicationSubmitted() {
  const navigate = useNavigate();

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
              <h1 className="text-xl font-bold text-gray-900">Application Submitted</h1>
              <p className="text-sm text-gray-600">Women Refugee Rise Program</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Success Message */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-white text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Application Received!</h2>
              <p className="text-lg opacity-90">
                Thank you for applying to the Women Refugee Rise Program scholarship.
              </p>
            </div>

            <div className="p-8">
              {/* What Happens Next */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">What Happens Next?</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Email Confirmation</h4>
                      <p className="text-sm text-gray-600">
                        You'll receive an email confirmation within 24 hours with your application reference number.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Review Period</h4>
                      <p className="text-sm text-gray-600">
                        Our selection committee reviews all applications over the next 4-6 weeks.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Status Updates</h4>
                      <p className="text-sm text-gray-600">
                        You'll receive automatic email notifications for any status changes.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FileText className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Final Decision</h4>
                      <p className="text-sm text-gray-600">
                        All applicants receive final notification regardless of outcome.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Application Timeline */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Timeline</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Application Submitted</div>
                      <div className="text-sm text-gray-600">Today - Your application is in our system</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Initial Review</div>
                      <div className="text-sm text-gray-600">Week 1-2 - Eligibility and completeness check</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Committee Review</div>
                      <div className="text-sm text-gray-600">Week 3-4 - Comprehensive evaluation</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Final Decision</div>
                      <div className="text-sm text-gray-600">Week 5-6 - Selection notifications sent</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Possible Status Outcomes */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Possible Application Status</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-2">✅ Accepted</h4>
                    <p className="text-sm text-green-800">
                      Congratulations! You'll receive full scholarship details and next steps.
                    </p>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-900 mb-2">⏳ Shortlisted</h4>
                    <p className="text-sm text-yellow-800">
                      You're in the final consideration. We may request additional information.
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">📋 Waitlisted</h4>
                    <p className="text-sm text-blue-800">
                      Strong candidate but no space available. You'll be contacted if spots open up.
                    </p>
                  </div>
                  
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-900 mb-2">❌ Not Selected</h4>
                    <p className="text-sm text-red-800">
                      Not selected this time, but we encourage you to apply for future cohorts.
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Questions?</h3>
                <p className="text-gray-700 mb-4">
                  If you have any questions about your application or the selection process, please don't hesitate to contact us.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div>
                    <strong>Email:</strong> programs@vialifecoach.org
                  </div>
                  <div>
                    <strong>Phone:</strong> +250-785-555-0123
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/program/women-refugee-rise')}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                >
                  Learn More About Program
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
                >
                  Return to Homepage
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
