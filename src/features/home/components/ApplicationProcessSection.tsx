import { useNavigate } from "react-router-dom";
import { User, FileText, CheckCircle, ArrowRight, BookOpen } from "lucide-react";

export function ApplicationProcessSection() {
  const navigate = useNavigate();

  
  const applicationSteps = [
    {
      number: "1",
      title: "Create Your Account",
      description: "Sign up in the Vialifecoach GF Application Portal with your basic information.",
      icon: <User className="h-5 w-5" />
    },
    {
      number: "2", 
      title: "Complete Your Profile",
      description: "Fill out your comprehensive profile with personal, educational, and background information.",
      icon: <FileText className="h-5 w-5" />
    },
    {
      number: "3",
      title: "Choose Your Programs",
      description: "Apply to all available programs or select specific ones that match your goals.",
      icon: <CheckCircle className="h-5 w-5" />
    }
  ];

  return (
    <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            How to Apply for Our Programs
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            We've simplified the application process with our unified portal. Create one account and apply to multiple programs with ease.
          </p>
        </div>

        
        {/* Application Process */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            Simple 3-Step Application Process
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {applicationSteps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step Number */}
                <div className="flex items-center justify-center mb-6">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                    {step.number}
                  </div>
                </div>
                
                {/* Step Content */}
                <div className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <div className="text-blue-600">
                        {step.icon}
                      </div>
                    </div>
                  </div>
                  
                  <h4 className="text-lg font-semibold text-slate-900 mb-3">
                    {step.title}
                  </h4>
                  
                  <p className="text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                
                {/* Connection Line */}
                {index < applicationSteps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-full w-full">
                    <div className="flex items-center justify-center">
                      <div className="w-full h-0.5 bg-blue-200"></div>
                      <ArrowRight className="h-4 w-4 text-blue-400 -ml-2" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <h4 className="text-xl font-bold text-slate-900 mb-4">
              Ready to Start Your Journey?
            </h4>
            <p className="text-slate-600 mb-6">
              Create your account in the Opportunities Portal to apply for our programs and track your application status. After applying, you can check back anytime to see if you've been accepted, rejected, or waitlisted.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/application-portal')}
                className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
              >
                <User className="h-5 w-5" />
                Browse Opportunities Portal
              </button>
              
              <button
                onClick={() => navigate('/application-portal')}
                className="inline-flex items-center gap-2 px-8 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-semibold transition-colors"
              >
                <BookOpen className="h-5 w-5" />
                View All Programs
              </button>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">
              Why Use the Vialifecoach GF Application Portal?
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-3" />
                <h5 className="font-semibold text-slate-900 mb-2">One Profile, Multiple Applications</h5>
                <p className="text-sm text-slate-600">
                  Fill out your information once and apply to multiple programs without repeating yourself.
                </p>
              </div>
              
              <div className="text-center">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-3" />
                <h5 className="font-semibold text-slate-900 mb-2">Save Progress Anytime</h5>
                <p className="text-sm text-slate-600">
                  Save your application progress and return later to complete it at your convenience.
                </p>
              </div>
              
              <div className="text-center">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-3" />
                <h5 className="font-semibold text-slate-900 mb-2">Track All Applications</h5>
                <p className="text-sm text-slate-600">
                  Monitor the status of all your applications in one centralized dashboard.
                </p>
              </div>
              
              <div className="text-center">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-3" />
                <h5 className="font-semibold text-slate-900 mb-2">Professional Experience</h5>
                <p className="text-sm text-slate-600">
                  Enjoy a streamlined, professional application process similar to major university applications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
