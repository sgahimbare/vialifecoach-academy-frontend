import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ExternalLink, User, FileText, AlertCircle, CheckCircle, Calendar, MapPin, Mail, Phone } from "lucide-react";
import { useEffect, useState } from "react";

interface Application {
  id: string;
  title: string;
  organization: string;
  location: string;
  type: string;
  status: 'active' | 'closed' | 'draft';
  deadline: string;
  postedDate: string;
  description: string;
  requirements: string[];
  benefits: string[];
  contactEmail?: string;
  contactPhone?: string;
}

export default function ApplicationDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if we have application data from GF Application Portal state
  const applicationFromState = location.state as { applicationId?: string; applicationTitle?: string };

  // Mock application data - in real app, this would come from API
  const mockApplications: Application[] = [
    {
      id: '1',
      title: 'Women Refugee Rise Program',
      organization: 'ViaLife Coach Academy',
      location: 'Remote',
      type: 'scholarship',
      status: 'active',
      deadline: '2024-04-30',
      postedDate: '2024-03-01',
      description: 'A comprehensive 3-pillar program supporting refugee women with mental health coaching, entrepreneurship skills, and virtual assistant training.',
      requirements: [
        'Must be refugee, asylum seeker, or IDP woman',
        '18+ years old',
        'Strong motivation to improve life',
        'Ability to commit 3-9 months',
        'Access to internet/phone'
      ],
      benefits: [
        'Full scholarship coverage',
        'Mental health support',
        'Business skills training',
        'Job placement assistance',
        'Mentorship program',
        'Community network'
      ],
      contactEmail: 'programs@vialifecoach.org',
      contactPhone: '+250-785-555-0123'
    },
    {
      id: '2',
      title: 'Digital Skills Training',
      organization: 'Tech for Refugees',
      location: 'Nairobi',
      type: 'training',
      status: 'active',
      deadline: '2024-04-15',
      postedDate: '2024-02-20',
      description: 'Learn essential digital skills including computer basics, internet safety, and online tools for modern work environments.',
      requirements: [
        'Basic literacy preferred',
        'Access to device for practice',
        'Commitment to complete all modules'
      ],
      benefits: [
        'Free certification',
        'Job placement support',
        'Mentorship',
        'Practice materials'
      ],
      contactEmail: 'info@techforrefugees.org',
      contactPhone: '+250-785-555-0456'
    },
    {
      id: '3',
      title: 'Business Mentorship Program',
      organization: 'Women Entrepreneurs Network',
      location: 'Remote',
      type: 'volunteer',
      status: 'closed',
      deadline: '2024-03-01',
      postedDate: '2024-03-10',
      description: 'Connect with experienced business mentors who can guide you through starting and growing your own business.',
      requirements: [
        'Business idea or existing business',
        'Commitment to weekly meetings',
        'Goal-oriented mindset'
      ],
      benefits: [
        'One-on-one mentorship',
        'Business planning guidance',
        'Networking opportunities',
        'Skill development workshops'
      ],
      contactEmail: 'mentorship@wenet.org',
      contactPhone: '+250-785-555-0789'
    }
  ];

  useEffect(() => {
    // Find the application by ID
    const foundApplication = mockApplications.find(app => app.id === id);
    setApplication(foundApplication || null);
    setLoading(false);
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'closed': return 'text-red-600 bg-red-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Accepting Applications';
      case 'closed': return 'Applications Closed';
      case 'draft': return 'Coming Soon';
      default: return 'Unknown';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'closed': return <AlertCircle className="h-4 w-4" />;
      case 'draft': return <Calendar className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Not Found</h2>
          <p className="text-gray-600 mb-6">
            The application you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/application-portal')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Browse All Applications
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/application-portal')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Applications
            </button>
            
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">Application Details</h1>
              <p className="text-sm text-gray-600">{application.title}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{application.title}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{application.organization}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{application.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Deadline: {application.deadline}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(application.status)}`}>
                    {getStatusIcon(application.status)}
                    {getStatusText(application.status)}
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Description */}
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">About This Opportunity</h3>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {application.description}
                  </p>

                  {/* Requirements */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Requirements</h4>
                    <ul className="space-y-2">
                      {application.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                          <span className="text-gray-700">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Benefits</h4>
                    <ul className="space-y-2">
                      {application.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Contact & Apply */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact & Application</h3>
                  
                  {application.contactEmail && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Contact Email</h4>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Mail className="h-4 w-4" />
                        <a 
                          href={`mailto:${application.contactEmail}`}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          {application.contactEmail}
                        </a>
                      </div>
                    </div>
                  )}

                  {application.contactPhone && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Contact Phone</h4>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Phone className="h-4 w-4" />
                        <a 
                          href={`tel:${application.contactPhone}`}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          {application.contactPhone}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Apply Button */}
                  {application.status === 'active' && (
                    <button
                      onClick={() => navigate('/application-portal')}
                      className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors inline-flex items-center justify-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Apply in GF Application Portal
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </button>
                  )}

                  {application.status === 'closed' && (
                    <div className="w-full px-6 py-3 bg-red-50 border border-red-200 rounded-lg text-center">
                      <div className="flex items-center justify-center gap-2 text-red-800">
                        <AlertCircle className="h-4 w-4" />
                        <span className="font-medium">Applications are currently closed</span>
                      </div>
                      <p className="text-sm text-red-700 mt-2">
                        This application deadline has passed. Please check back for future opportunities.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
