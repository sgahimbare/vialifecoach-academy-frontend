import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, Mail, User, CheckCircle, AlertCircle, ArrowLeft, Shield } from "lucide-react";

export default function WRRPVerificationPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    admissionNumber: '',
    applicationEmail: '',
    offerLetter: null as File | null
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          offerLetter: 'Please upload a PDF, JPEG, PNG, or Word document'
        }));
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          offerLetter: 'File size must be less than 5MB'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        offerLetter: file
      }));
      
      // Clear error when file is selected
      if (errors.offerLetter) {
        setErrors(prev => ({
          ...prev,
          offerLetter: ''
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.admissionNumber.trim()) {
      newErrors.admissionNumber = 'Admission number is required';
    } else if (!/^[A-Z0-9]{6,12}$/.test(formData.admissionNumber.trim())) {
      newErrors.admissionNumber = 'Admission number must be 6-12 alphanumeric characters';
    }

    if (!formData.applicationEmail.trim()) {
      newErrors.applicationEmail = 'Application email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.applicationEmail.trim())) {
      newErrors.applicationEmail = 'Please enter a valid email address';
    }

    if (!formData.offerLetter) {
      newErrors.offerLetter = 'Offer letter is required for verification';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API verification process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful verification (in real app, this would be an API call)
      // For demo purposes, we'll accept any valid-looking data
      setIsVerified(true);
    } catch (error) {
      setErrors({
        submit: 'Verification failed. Please check your information and try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinueToProgram = () => {
    navigate('/program/women-refugee-rise');
  };

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Verification Successful!
            </h2>
            
            <p className="text-gray-600 mb-8">
              Your admission has been verified. You now have access to the Women Refugee Rise Program.
            </p>
            
            <button
              onClick={handleContinueToProgram}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center justify-center gap-2"
            >
              Continue to Program
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Verify Your Admission
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Please provide your admission details to verify your enrollment in the Women Refugee Rise Program
            </p>
          </div>
        </div>

        {/* Verification Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Admission Number */}
              <div>
                <label htmlFor="admissionNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Admission Number
                  </div>
                </label>
                <input
                  type="text"
                  id="admissionNumber"
                  name="admissionNumber"
                  value={formData.admissionNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your admission number (e.g., WRRP2024001)"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.admissionNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.admissionNumber && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.admissionNumber}
                  </p>
                )}
              </div>

              {/* Application Email */}
              <div>
                <label htmlFor="applicationEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Application Email
                  </div>
                </label>
                <input
                  type="email"
                  id="applicationEmail"
                  name="applicationEmail"
                  value={formData.applicationEmail}
                  onChange={handleInputChange}
                  placeholder="Enter the email you used for your application"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.applicationEmail ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.applicationEmail && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.applicationEmail}
                  </p>
                )}
              </div>

              {/* Offer Letter Upload */}
              <div>
                <label htmlFor="offerLetter" className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Offer Letter Attachment
                  </div>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    id="offerLetter"
                    name="offerLetter"
                    onChange={handleFileUpload}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    className="hidden"
                  />
                  <label htmlFor="offerLetter" className="cursor-pointer">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      {formData.offerLetter ? formData.offerLetter.name : 'Click to upload your offer letter'}
                    </p>
                    <p className="text-sm text-gray-500">
                      PDF, JPEG, PNG, or Word document (max 5MB)
                    </p>
                  </label>
                </div>
                {errors.offerLetter && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.offerLetter}
                  </p>
                )}
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {errors.submit}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4" />
                    Verify Admission
                  </>
                )}
              </button>
            </form>

            {/* Help Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  If you're having trouble with verification, please contact our support team.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="mailto:support@vialifecoach.org"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                  >
                    <Mail className="h-4 w-4" />
                    support@vialifecoach.org
                  </a>
                  <a
                    href="tel:+250-785-555-0123"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                  >
                    +250-785-555-0123
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
