import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Search, Filter, Briefcase, Users, Calendar, FileText, ChevronRight, User, Mail, Phone, MapPin, Clock, CheckCircle, AlertCircle, LogIn } from "lucide-react";

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
}

export default function ApplicationPortal() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);

  // Check if user should be directed to account creation
  const location = useLocation();
  const state = location.state as { action?: string; applicationId?: string; applicationTitle?: string } | null;
  
  useEffect(() => {
    if (state?.action === 'create-account') {
      console.log('User should create account for application:', state.applicationTitle);
    }
  }, [navigate]);

  const applicationTypes = [
    { value: 'all', label: 'All Programs' },
    { value: 'scholarship', label: 'Scholarships' },
    { value: 'training', label: 'Training Programs' },
    { value: 'job', label: 'Job Opportunities' },
    { value: 'internship', label: 'Internships' },
    { value: 'volunteer', label: 'Volunteer Programs' }
  ];

  const locations = [
    { value: 'all', label: 'All Locations' },
    { value: 'remote', label: 'Remote Programs' },
    { value: 'nairobi', label: 'Nairobi, Kenya' },
    { value: 'kakuma', label: 'Kakuma Refugee Camp' },
    { value: 'dadaab', label: 'Dadaab Refugee Camp' }
  ];

  // Mock applications - in real app, this would come from API
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
      ]
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
      ]
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
      ]
    }
  ];

  useEffect(() => {
    // Filter applications based on search and filters
    const filtered = mockApplications.filter(app => {
      const matchesSearch = app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           app.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           app.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || app.type === selectedType;
      const matchesLocation = selectedLocation === 'all' || app.location.toLowerCase().includes(selectedLocation.toLowerCase());
      
      return matchesSearch && matchesType && matchesLocation;
    });
    
    setApplications(filtered);
  }, [searchTerm, selectedType, selectedLocation]);

  const handleApplicationClick = (applicationId: string) => {
    // Direct to GF Application Portal with account creation context
    navigate('/application-portal', { 
      state: { 
        action: 'create-account',
        applicationId: applicationId,
        applicationTitle: mockApplications.find(app => app.id === applicationId)?.title
      } 
    });
  };

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
      case 'draft': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </button>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Vialifecoach Application Portal</h1>
              <p className="text-gray-600">Discover scholarships, training programs, and opportunities for refugee women and youth</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Programs & Scholarships</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for scholarships, training programs, and opportunities..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Program Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {applicationTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {locations.map(location => (
                    <option key={location.value} value={location.value}>
                      {location.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Applications Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Opportunities Found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Try adjusting your search criteria or filters to find opportunities that match your profile.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {applications.map(app => (
                <div key={app.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                            {getStatusIcon(app.status)}
                            <span className="ml-1">{getStatusText(app.status)}</span>
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Posted {app.postedDate}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm text-gray-500 mb-1">
                          Deadline: {app.deadline}
                        </div>
                        <div className="text-lg font-bold text-gray-900 mb-2">
                          {app.organization}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{app.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {app.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {app.requirements.slice(0, 3).map((req, index) => (
                          <span key={index} className="inline-flex items-center gap-1 text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-blue-700">{index + 1}</span>
                            </div>
                            <span>{req}</span>
                          </span>
                        ))}
                        {app.requirements.length > 3 && (
                          <span className="text-sm text-gray-500">+{app.requirements.length - 3} more</span>
                        )}
                      </div>
                    </div>

                    {/* Apply Button */}
                    <div className="text-center">
                      <button
                        onClick={() => handleApplicationClick(app.id)}
                        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors inline-flex items-center justify-center gap-2"
                      >
                        <User className="h-4 w-4" />
                        Create Account to Apply
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* GF Application Portal Link */}
        <div className="bg-blue-50 border-t border-blue-200">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LogIn className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Application Status</h3>
                  <p className="text-gray-600 max-w-md mx-auto mb-6">
                    Have you already applied? Check your application status, view decisions, and manage your profile in the Vialifecoach GF Application Portal.
                  </p>
                  
                  <button
                    onClick={() => navigate('/application-portal')}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    Check Application Status
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
