import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Globe,
  GraduationCap,
  Briefcase,
  Trophy,
  FileText,
  Send,
  CheckCircle,
  AlertCircle,
  Upload,
  Save,
  Eye,
  ChevronRight,
  ChevronLeft,
  LogOut
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useApplication } from "../hooks/useApplication";
import { uploadFile } from "../services/apiService";

interface Section {
  id: string;
  name: string;
  icon: any;
  completed: boolean;
}

export default function GFApplicationPortalIntegrated() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, login, register, logout, isAuthenticated } = useAuth();
  const { 
    applicationData, 
    loading, 
    saving, 
    lastSaved, 
    updateSection, 
    saveApplication, 
    applyToProgram: submitApplication,
    getCompletionPercentage 
  } = useApplication();

  const [activeSection, setActiveSection] = useState("account");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Get navigation state
  const state = location.state as { 
    action?: string; 
    applicationId?: string; 
    applicationTitle?: string 
  } | null;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/application-portal/gf/home", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Account creation form state
  const [accountForm, setAccountForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    country: "",
    language: "English"
  });

  // Personal information form state
  const [personalForm, setPersonalForm] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    refugeeStatus: "",
    idNumber: "",
    phoneNumber: "",
    emailAddress: "",
    currentAddress: "",
    city: "",
    countryOfResidence: ""
  });

  // Education history form state
  const [educationForm, setEducationForm] = useState({
    highestEducation: "",
    institutionName: "",
    fieldOfStudy: "",
    graduationYear: "",
    gpa: "",
    certificates: "",
    additionalEducation: ""
  });

  // Work experience form state
  const [workForm, setWorkForm] = useState({
    hasWorkExperience: "",
    currentEmployer: "",
    jobTitle: "",
    workDuration: "",
    responsibilities: "",
    previousWork: "",
    skills: ""
  });

  // Activities form state
  const [activitiesForm, setActivitiesForm] = useState({
    extracurricular: "",
    volunteerWork: "",
    leadership: "",
    awards: "",
    hobbies: ""
  });

  // Personal statement form state
  const [statementForm, setStatementForm] = useState({
    motivation: "",
    goals: "",
    challenges: "",
    programFit: ""
  });

  // Program selection form state
  const [programForm, setProgramForm] = useState({
    firstChoice: "",
    secondChoice: "",
    availability: "",
    funding: "",
    accommodations: ""
  });

  // Documents form state
  const [documentsForm, setDocumentsForm] = useState({
    resume: "",
    transcript: "",
    certificates: "",
    idDocument: "",
    other: ""
  });

  // Recommendations form state
  const [recommendationsForm, setRecommendationsForm] = useState({
    recommender1Name: "",
    recommender1Email: "",
    recommender1Relation: "",
    recommender2Name: "",
    recommender2Email: "",
    recommender2Relation: ""
  });

  // Eligibility form state
  const [eligibilityForm, setEligibilityForm] = useState({
    ageRequirement: "",
    educationRequirement: "",
    languageRequirement: "",
    residencyRequirement: "",
    specialCircumstances: ""
  });

  // Sections configuration
  const baseSections: Section[] = [
    { id: "account", name: "Account Creation", icon: User, completed: !!applicationData.accountCreation },
    { id: "personal", name: "Personal Information", icon: User, completed: !!applicationData.personalInfo },
    { id: "background", name: "Background Information", icon: Globe, completed: !!applicationData.backgroundInfo },
    { id: "education", name: "Education History", icon: GraduationCap, completed: !!applicationData.educationHistory },
    { id: "work", name: "Work & Experience", icon: Briefcase, completed: !!applicationData.workExperience },
    { id: "activities", name: "Activities & Achievements", icon: Trophy, completed: !!applicationData.activities },
    { id: "statement", name: "Personal Statement", icon: FileText, completed: !!applicationData.personalStatement },
    { id: "program", name: "Program Selection", icon: CheckCircle, completed: !!applicationData.programSelection },
    { id: "documents", name: "Supporting Documents", icon: Upload, completed: !!applicationData.supportingDocuments },
    { id: "recommendations", name: "Recommendations", icon: AlertCircle, completed: !!applicationData.recommendations },
    { id: "eligibility", name: "Eligibility Questions", icon: CheckCircle, completed: !!applicationData.eligibilityQuestions },
    { id: "review", name: "Application Review", icon: Eye, completed: !!applicationData.submission },
    { id: "submission", name: "Submission", icon: Send, completed: !!applicationData.submission }
  ];

  const sections: Section[] = applicationData.accountCreation
    ? baseSections.filter(section => section.id !== "account")
    : baseSections;

  useEffect(() => {
    if (isAuthenticated && applicationData.accountCreation) {
      setAccountForm(applicationData.accountCreation);
    }
    if (applicationData.personalInfo) {
      setPersonalForm(applicationData.personalInfo);
    }
    if (applicationData.educationHistory) {
      setEducationForm(applicationData.educationHistory);
    }
    if (applicationData.workExperience) {
      setWorkForm(applicationData.workExperience);
    }
    if (applicationData.activities) {
      setActivitiesForm(applicationData.activities);
    }
    if (applicationData.personalStatement) {
      setStatementForm(applicationData.personalStatement);
    }
    if (applicationData.programSelection) {
      setProgramForm(applicationData.programSelection);
    }
    if (applicationData.supportingDocuments) {
      setDocumentsForm(applicationData.supportingDocuments);
    }
    if (applicationData.recommendations) {
      setRecommendationsForm(applicationData.recommendations);
    }
    if (applicationData.eligibilityQuestions) {
      setEligibilityForm(applicationData.eligibilityQuestions);
    }
  }, [applicationData, isAuthenticated]);

  useEffect(() => {
    if (applicationData.accountCreation && activeSection === "account") {
      setActiveSection("personal");
    }
  }, [applicationData.accountCreation, activeSection]);

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (accountForm.password !== accountForm.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const result = await register(accountForm.name, accountForm.email, accountForm.password);
      if (result.success) {
        updateSection("accountCreation", accountForm);
        setSuccess("Account created successfully!");
        setActiveSection("personal");
      } else {
        setError(result.error || "Registration failed");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    }
  };

  const handlePersonalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateSection("personalInfo", personalForm);
    await saveApplication();
    setActiveSection("background");
  };

  const handleFileUpload = async (file: File, type: string) => {
    try {
      const result = await uploadFile(file, type);
      if (result.url) {
        return result.url;
      }
      throw new Error("Upload failed");
    } catch (error) {
      setError("File upload failed");
      return null;
    }
  };

  const handleSaveProgress = async () => {
    const result = await saveApplication();
    if (result.success) {
      setSuccess("Application saved successfully!");
    } else {
      setError(result.error || "Failed to save");
    }
  };

  const handleSubmitApplication = async () => {
    if (!state?.applicationId) {
      setError("No program selected");
      return;
    }

    const result = await submitApplication(state.applicationId);
    if (result.success) {
      setSuccess("Application submitted successfully!");
      navigate("/application-portal/dashboard");
    } else {
      setError(result.error || "Submission failed");
    }
  };

  const navigateSection = (direction: "prev" | "next") => {
    const currentIndex = sections.findIndex(s => s.id === activeSection);
    if (direction === "prev" && currentIndex > 0) {
      setActiveSection(sections[currentIndex - 1].id);
    } else if (direction === "next" && currentIndex < sections.length - 1) {
      setActiveSection(sections[currentIndex + 1].id);
    }
  };

  const renderAccountCreation = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6">Create Your Account</h2>
      <form onSubmit={handleAccountSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name *</label>
            <input
              type="text"
              required
              value={accountForm.name}
              onChange={(e) => setAccountForm({...accountForm, name: e.target.value})}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email Address *</label>
            <input
              type="email"
              required
              value={accountForm.email}
              onChange={(e) => setAccountForm({...accountForm, email: e.target.value})}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="your.email@example.com"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Password *</label>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={accountForm.password}
              onChange={(e) => setAccountForm({...accountForm, password: e.target.value})}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Create a strong password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Confirm Password *</label>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={accountForm.confirmPassword}
              onChange={(e) => setAccountForm({...accountForm, confirmPassword: e.target.value})}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Confirm your password"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Phone Number *</label>
            <input
              type="tel"
              required
              value={accountForm.phone}
              onChange={(e) => setAccountForm({...accountForm, phone: e.target.value})}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="+254 XXX XXX XXX"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Country *</label>
            <select
              required
              value={accountForm.country}
              onChange={(e) => setAccountForm({...accountForm, country: e.target.value})}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Select Country</option>
              <option value="Kenya">Kenya</option>
              <option value="Uganda">Uganda</option>
              <option value="Rwanda">Rwanda</option>
              <option value="Tanzania">Tanzania</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Preferred Language</label>
          <select
            value={accountForm.language}
            onChange={(e) => setAccountForm({...accountForm, language: e.target.value})}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="English">English</option>
            <option value="French">French</option>
            <option value="Swahili">Swahili</option>
            <option value="Arabic">Arabic</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Create Account & Continue
        </button>
      </form>
    </div>
  );

  const renderPersonalInformation = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
      <form onSubmit={handlePersonalSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">First Name *</label>
            <input
              type="text"
              required
              value={personalForm.firstName}
              onChange={(e) => setPersonalForm({...personalForm, firstName: e.target.value})}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Last Name *</label>
            <input
              type="text"
              required
              value={personalForm.lastName}
              onChange={(e) => setPersonalForm({...personalForm, lastName: e.target.value})}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Date of Birth *</label>
            <input
              type="date"
              required
              value={personalForm.dateOfBirth}
              onChange={(e) => setPersonalForm({...personalForm, dateOfBirth: e.target.value})}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Gender *</label>
            <select
              required
              value={personalForm.gender}
              onChange={(e) => setPersonalForm({...personalForm, gender: e.target.value})}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Select Gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nationality *</label>
            <input
              type="text"
              required
              value={personalForm.nationality}
              onChange={(e) => setPersonalForm({...personalForm, nationality: e.target.value})}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Refugee Status</label>
            <select
              value={personalForm.refugeeStatus}
              onChange={(e) => setPersonalForm({...personalForm, refugeeStatus: e.target.value})}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Select Status</option>
              <option value="Refugee">Refugee</option>
              <option value="Asylum Seeker">Asylum Seeker</option>
              <option value="IDP">Internally Displaced Person</option>
              <option value="Stateless">Stateless</option>
              <option value="None">None</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Save & Continue
        </button>
      </form>
    </div>
  );

  const renderBackgroundInformation = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6">Background Information</h2>
      <div className="space-y-4">
        <p className="text-gray-600">Tell us about your background and circumstances.</p>
        <textarea
          className="w-full border rounded-lg px-3 py-2 h-32"
          placeholder="Describe your background, family situation, and any relevant circumstances..."
        />
        <button
          onClick={() => setActiveSection("education")}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Continue
        </button>
      </div>
    </div>
  );

  const renderEducationHistory = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6">Education History</h2>
      <form onSubmit={(e) => { e.preventDefault(); updateSection("educationHistory", educationForm); setActiveSection("work"); }} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Highest Education Level *</label>
            <select
              value={educationForm.highestEducation}
              onChange={(e) => setEducationForm({...educationForm, highestEducation: e.target.value})}
              className="w-full p-2 border rounded-lg"
              required
            >
              <option value="">Select Education Level</option>
              <option value="high_school">High School</option>
              <option value="bachelors">Bachelor's Degree</option>
              <option value="masters">Master's Degree</option>
              <option value="phd">PhD</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Institution Name *</label>
            <input
              type="text"
              value={educationForm.institutionName}
              onChange={(e) => setEducationForm({...educationForm, institutionName: e.target.value})}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Field of Study *</label>
            <input
              type="text"
              value={educationForm.fieldOfStudy}
              onChange={(e) => setEducationForm({...educationForm, fieldOfStudy: e.target.value})}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Graduation Year *</label>
            <input
              type="number"
              value={educationForm.graduationYear}
              onChange={(e) => setEducationForm({...educationForm, graduationYear: e.target.value})}
              className="w-full p-2 border rounded-lg"
              min="1950"
              max="2030"
              required
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">GPA/Score</label>
            <input
              type="text"
              value={educationForm.gpa}
              onChange={(e) => setEducationForm({...educationForm, gpa: e.target.value})}
              className="w-full p-2 border rounded-lg"
              placeholder="e.g., 3.5/4.0 or 85%"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Certificates</label>
            <input
              type="text"
              value={educationForm.certificates}
              onChange={(e) => setEducationForm({...educationForm, certificates: e.target.value})}
              className="w-full p-2 border rounded-lg"
              placeholder="List relevant certificates"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Additional Education</label>
          <textarea
            value={educationForm.additionalEducation}
            onChange={(e) => setEducationForm({...educationForm, additionalEducation: e.target.value})}
            className="w-full p-2 border rounded-lg"
            rows={3}
            placeholder="Any other educational achievements or ongoing studies"
          />
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setActiveSection("background")}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );

  const renderWorkExperience = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6">Work & Experience</h2>
      <form onSubmit={(e) => { e.preventDefault(); updateSection("workExperience", workForm); setActiveSection("activities"); }} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Do you have work experience? *</label>
          <select
            value={workForm.hasWorkExperience}
            onChange={(e) => setWorkForm({...workForm, hasWorkExperience: e.target.value})}
            className="w-full p-2 border rounded-lg"
            required
          >
            <option value="">Select Option</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        {workForm.hasWorkExperience === "yes" && (
          <>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Current/Most Recent Employer</label>
                <input
                  type="text"
                  value={workForm.currentEmployer}
                  onChange={(e) => setWorkForm({...workForm, currentEmployer: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Job Title</label>
                <input
                  type="text"
                  value={workForm.jobTitle}
                  onChange={(e) => setWorkForm({...workForm, jobTitle: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Duration of Employment</label>
                <input
                  type="text"
                  value={workForm.workDuration}
                  onChange={(e) => setWorkForm({...workForm, workDuration: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  placeholder="e.g., Jan 2020 - Present"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Key Responsibilities</label>
                <input
                  type="text"
                  value={workForm.responsibilities}
                  onChange={(e) => setWorkForm({...workForm, responsibilities: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Brief description of your role"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Previous Work Experience</label>
              <textarea
                value={workForm.previousWork}
                onChange={(e) => setWorkForm({...workForm, previousWork: e.target.value})}
                className="w-full p-2 border rounded-lg"
                rows={3}
                placeholder="List previous jobs and experiences"
              />
            </div>
          </>
        )}
        <div>
          <label className="block text-sm font-medium mb-2">Relevant Skills</label>
          <textarea
            value={workForm.skills}
            onChange={(e) => setWorkForm({...workForm, skills: e.target.value})}
            className="w-full p-2 border rounded-lg"
            rows={3}
            placeholder="List skills relevant to your application"
          />
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setActiveSection("education")}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );

  const renderActivities = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6">Activities & Achievements</h2>
      <form onSubmit={(e) => { e.preventDefault(); updateSection("activities", activitiesForm); setActiveSection("statement"); }} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Extracurricular Activities</label>
          <textarea
            value={activitiesForm.extracurricular}
            onChange={(e) => setActivitiesForm({...activitiesForm, extracurricular: e.target.value})}
            className="w-full p-2 border rounded-lg"
            rows={3}
            placeholder="Clubs, sports, organizations you've participated in"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Volunteer Work</label>
          <textarea
            value={activitiesForm.volunteerWork}
            onChange={(e) => setActivitiesForm({...activitiesForm, volunteerWork: e.target.value})}
            className="w-full p-2 border rounded-lg"
            rows={3}
            placeholder="Community service and volunteer experiences"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Leadership Experience</label>
          <textarea
            value={activitiesForm.leadership}
            onChange={(e) => setActivitiesForm({...activitiesForm, leadership: e.target.value})}
            className="w-full p-2 border rounded-lg"
            rows={3}
            placeholder="Leadership roles and responsibilities"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Awards & Recognition</label>
          <textarea
            value={activitiesForm.awards}
            onChange={(e) => setActivitiesForm({...activitiesForm, awards: e.target.value})}
            className="w-full p-2 border rounded-lg"
            rows={3}
            placeholder="Academic or professional awards you've received"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Hobbies & Interests</label>
          <textarea
            value={activitiesForm.hobbies}
            onChange={(e) => setActivitiesForm({...activitiesForm, hobbies: e.target.value})}
            className="w-full p-2 border rounded-lg"
            rows={3}
            placeholder="Your hobbies and personal interests"
          />
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setActiveSection("work")}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );

  const renderPersonalStatement = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6">Personal Statement</h2>
      <form onSubmit={(e) => { e.preventDefault(); updateSection("personalStatement", statementForm); setActiveSection("program"); }} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Motivation for Applying *</label>
          <textarea
            value={statementForm.motivation}
            onChange={(e) => setStatementForm({...statementForm, motivation: e.target.value})}
            className="w-full p-2 border rounded-lg"
            rows={4}
            placeholder="Why are you applying to this program? What motivates you?"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Goals & Aspirations *</label>
          <textarea
            value={statementForm.goals}
            onChange={(e) => setStatementForm({...statementForm, goals: e.target.value})}
            className="w-full p-2 border rounded-lg"
            rows={4}
            placeholder="What are your short-term and long-term goals?"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Challenges Overcome *</label>
          <textarea
            value={statementForm.challenges}
            onChange={(e) => setStatementForm({...statementForm, challenges: e.target.value})}
            className="w-full p-2 border rounded-lg"
            rows={4}
            placeholder="What challenges have you overcome and how did they shape you?"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Program Fit *</label>
          <textarea
            value={statementForm.programFit}
            onChange={(e) => setStatementForm({...statementForm, programFit: e.target.value})}
            className="w-full p-2 border rounded-lg"
            rows={4}
            placeholder="How does this program align with your goals and background?"
            required
          />
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setActiveSection("activities")}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );

  const renderProgramSelection = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6">Program Selection</h2>
      <form onSubmit={(e) => { e.preventDefault(); updateSection("programSelection", programForm); setActiveSection("documents"); }} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">First Choice Program *</label>
          <select
            value={programForm.firstChoice}
            onChange={(e) => setProgramForm({...programForm, firstChoice: e.target.value})}
            className="w-full p-2 border rounded-lg"
            required
          >
            <option value="">Select Program</option>
            <option value="Women Refugee Rise Program">Women Refugee Rise Program</option>
            <option value="GVB Healing Program">GVB Healing Program</option>
            <option value="Inner Leadership Program">Inner Leadership Program</option>
            <option value="Business Mentorship Program">Business Mentorship Program</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Second Choice Program</label>
          <select
            value={programForm.secondChoice}
            onChange={(e) => setProgramForm({...programForm, secondChoice: e.target.value})}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">Select Program</option>
            <option value="Women Refugee Rise Program">Women Refugee Rise Program</option>
            <option value="GVB Healing Program">GVB Healing Program</option>
            <option value="Inner Leadership Program">Inner Leadership Program</option>
            <option value="Business Mentorship Program">Business Mentorship Program</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Availability *</label>
          <select
            value={programForm.availability}
            onChange={(e) => setProgramForm({...programForm, availability: e.target.value})}
            className="w-full p-2 border rounded-lg"
            required
          >
            <option value="">Select Availability</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="flexible">Flexible</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Funding Requirements</label>
          <textarea
            value={programForm.funding}
            onChange={(e) => setProgramForm({...programForm, funding: e.target.value})}
            className="w-full p-2 border rounded-lg"
            rows={3}
            placeholder="Do you require financial assistance? Please explain."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Special Accommodations</label>
          <textarea
            value={programForm.accommodations}
            onChange={(e) => setProgramForm({...programForm, accommodations: e.target.value})}
            className="w-full p-2 border rounded-lg"
            rows={3}
            placeholder="Any special accommodations or support needed"
          />
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setActiveSection("statement")}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );

  const renderDocuments = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6">Supporting Documents</h2>
      <form onSubmit={(e) => { e.preventDefault(); updateSection("supportingDocuments", documentsForm); setActiveSection("recommendations"); }} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Resume/CV *</label>
          <input
            type="file"
            onChange={(e) => setDocumentsForm({...documentsForm, resume: e.target.files?.[0]?.name || ""})}
            className="w-full p-2 border rounded-lg"
            accept=".pdf,.doc,.docx"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Academic Transcripts *</label>
          <input
            type="file"
            onChange={(e) => setDocumentsForm({...documentsForm, transcript: e.target.files?.[0]?.name || ""})}
            className="w-full p-2 border rounded-lg"
            accept=".pdf,.doc,.docx"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Certificates</label>
          <input
            type="file"
            onChange={(e) => setDocumentsForm({...documentsForm, certificates: e.target.files?.[0]?.name || ""})}
            className="w-full p-2 border rounded-lg"
            accept=".pdf,.doc,.docx"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">ID Document *</label>
          <input
            type="file"
            onChange={(e) => setDocumentsForm({...documentsForm, idDocument: e.target.files?.[0]?.name || ""})}
            className="w-full p-2 border rounded-lg"
            accept=".pdf,.jpg,.jpeg,.png"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Other Documents</label>
          <input
            type="file"
            onChange={(e) => setDocumentsForm({...documentsForm, other: e.target.files?.[0]?.name || ""})}
            className="w-full p-2 border rounded-lg"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Accepted formats are PDF, DOC, DOCX, JPG, JPEG, PNG. Maximum file size is 5MB.
          </p>
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setActiveSection("program")}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );

  const renderRecommendations = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6">Recommendations</h2>
      <form onSubmit={(e) => { e.preventDefault(); updateSection("recommendations", recommendationsForm); setActiveSection("eligibility"); }} className="space-y-4">
        <h3 className="text-lg font-semibold mb-4">First Recommender</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name *</label>
            <input
              type="text"
              value={recommendationsForm.recommender1Name}
              onChange={(e) => setRecommendationsForm({...recommendationsForm, recommender1Name: e.target.value})}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email *</label>
            <input
              type="email"
              value={recommendationsForm.recommender1Email}
              onChange={(e) => setRecommendationsForm({...recommendationsForm, recommender1Email: e.target.value})}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Relationship to You *</label>
          <input
            type="text"
            value={recommendationsForm.recommender1Relation}
            onChange={(e) => setRecommendationsForm({...recommendationsForm, recommender1Relation: e.target.value})}
            className="w-full p-2 border rounded-lg"
            placeholder="e.g., Teacher, Employer, Mentor"
            required
          />
        </div>
        
        <h3 className="text-lg font-semibold mb-4 mt-6">Second Recommender</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={recommendationsForm.recommender2Name}
              onChange={(e) => setRecommendationsForm({...recommendationsForm, recommender2Name: e.target.value})}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={recommendationsForm.recommender2Email}
              onChange={(e) => setRecommendationsForm({...recommendationsForm, recommender2Email: e.target.value})}
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Relationship to You</label>
          <input
            type="text"
            value={recommendationsForm.recommender2Relation}
            onChange={(e) => setRecommendationsForm({...recommendationsForm, recommender2Relation: e.target.value})}
            className="w-full p-2 border rounded-lg"
            placeholder="e.g., Teacher, Employer, Mentor"
          />
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Your recommenders will be contacted automatically to provide their recommendations.
          </p>
        </div>
        
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setActiveSection("documents")}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );

  const renderEligibility = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6">Eligibility Questions</h2>
      <form onSubmit={(e) => { e.preventDefault(); updateSection("eligibilityQuestions", eligibilityForm); setActiveSection("review"); }} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Age Requirement *</label>
          <select
            value={eligibilityForm.ageRequirement}
            onChange={(e) => setEligibilityForm({...eligibilityForm, ageRequirement: e.target.value})}
            className="w-full p-2 border rounded-lg"
            required
          >
            <option value="">Select Option</option>
            <option value="18-25">18-25 years</option>
            <option value="26-35">26-35 years</option>
            <option value="36-45">36-45 years</option>
            <option value="46+">46+ years</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Education Requirement *</label>
          <select
            value={eligibilityForm.educationRequirement}
            onChange={(e) => setEligibilityForm({...eligibilityForm, educationRequirement: e.target.value})}
            className="w-full p-2 border rounded-lg"
            required
          >
            <option value="">Select Education Level</option>
            <option value="high_school">High School Graduate</option>
            <option value="some_college">Some College</option>
            <option value="bachelors">Bachelor's Degree</option>
            <option value="masters">Master's Degree</option>
            <option value="phd">PhD or higher</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Language Proficiency *</label>
          <select
            value={eligibilityForm.languageRequirement}
            onChange={(e) => setEligibilityForm({...eligibilityForm, languageRequirement: e.target.value})}
            className="w-full p-2 border rounded-lg"
            required
          >
            <option value="">Select Proficiency</option>
            <option value="basic">Basic</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="native">Native</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Residency Status *</label>
          <select
            value={eligibilityForm.residencyRequirement}
            onChange={(e) => setEligibilityForm({...eligibilityForm, residencyRequirement: e.target.value})}
            className="w-full p-2 border rounded-lg"
            required
          >
            <option value="">Select Status</option>
            <option value="citizen">Citizen</option>
            <option value="permanent_resident">Permanent Resident</option>
            <option value="refugee">Refugee</option>
            <option value="asylum_seeker">Asylum Seeker</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Special Circumstances</label>
          <textarea
            value={eligibilityForm.specialCircumstances}
            onChange={(e) => setEligibilityForm({...eligibilityForm, specialCircumstances: e.target.value})}
            className="w-full p-2 border rounded-lg"
            rows={3}
            placeholder="Any special circumstances we should be aware of?"
          />
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setActiveSection("recommendations")}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );

  const renderReview = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6">Application Review</h2>
      <div className="space-y-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Application Progress</h3>
          <p className="text-green-700">Your application is {getCompletionPercentage()} complete.</p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Review Your Information</h3>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Personal Information</h4>
              <p className="text-sm text-gray-600">Name: {personalForm.firstName} {personalForm.lastName}</p>
              <p className="text-sm text-gray-600">Email: {personalForm.emailAddress}</p>
              <p className="text-sm text-gray-600">Phone: {personalForm.phoneNumber}</p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Education</h4>
              <p className="text-sm text-gray-600">Institution: {educationForm.institutionName}</p>
              <p className="text-sm text-gray-600">Field: {educationForm.fieldOfStudy}</p>
              <p className="text-sm text-gray-600">Graduation: {educationForm.graduationYear}</p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Program Selection</h4>
              <p className="text-sm text-gray-600">First Choice: {programForm.firstChoice}</p>
              <p className="text-sm text-gray-600">Availability: {programForm.availability}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Important:</strong> Please review all information carefully before submitting. You cannot edit your application after submission.
          </p>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={() => setActiveSection("eligibility")}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back
          </button>
          <button
            onClick={() => setActiveSection("submission")}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Proceed to Submission
          </button>
        </div>
      </div>
    </div>
  );

  const renderSubmission = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6">Submit Application</h2>
      <div className="space-y-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">Ready to Submit?</h3>
          <p className="text-blue-700 mb-4">
            Your application is complete and ready for submission. Once submitted, you will not be able to make changes.
          </p>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" required />
              <span className="text-sm">I confirm that all information provided is accurate and complete</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" required />
              <span className="text-sm">I understand that false information may result in rejection</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" required />
              <span className="text-sm">I consent to the processing of my personal data</span>
            </label>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={() => setActiveSection("review")}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back to Review
          </button>
          <button
            onClick={async () => {
              if (state?.applicationId) {
                const result = await submitApplication(state.applicationId);
                if (result.success) {
                  setSuccess("Application submitted successfully!");
                  navigate("/application-portal/dashboard");
                } else {
                  setError(result.error || "Submission failed");
                }
              } else {
                setError("No program selected");
              }
            }}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
          >
            Submit Application
          </button>
        </div>
      </div>
    </div>
  );

  const renderCurrentSection = () => {
    switch (activeSection) {
      case "account":
        return renderAccountCreation();
      case "personal":
        return renderPersonalInformation();
      case "background":
        return renderBackgroundInformation();
      case "education":
        return renderEducationHistory();
      case "work":
        return renderWorkExperience();
      case "activities":
        return renderActivities();
      case "statement":
        return renderPersonalStatement();
      case "program":
        return renderProgramSelection();
      case "documents":
        return renderDocuments();
      case "recommendations":
        return renderRecommendations();
      case "eligibility":
        return renderEligibility();
      case "review":
        return renderReview();
      case "submission":
        return renderSubmission();
      default:
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-6">{sections.find(s => s.id === activeSection)?.name}</h2>
            <p className="text-gray-600">This section is under development.</p>
          </div>
        );
    }
  };

  const completionPercentage = getCompletionPercentage();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/application-portal")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Portal
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Vialifecoach GF Application Portal
              </h1>
              <p className="text-gray-600 text-sm">
                {state?.applicationTitle && `Applying to: ${state.applicationTitle}`}
              </p>
            </div>
          </div>
          {isAuthenticated && (
            <button
              onClick={logout}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Application Progress</span>
            <span className="text-sm text-gray-600">{completionPercentage}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          {lastSaved && (
            <p className="text-xs text-gray-500 mt-2">
              Last saved: {lastSaved.toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold mb-4">Application Sections</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 transition ${
                      activeSection === section.id
                        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <section.icon className="h-4 w-4" />
                    <span className="text-sm">{section.name}</span>
                    {section.completed && (
                      <CheckCircle className="h-3 w-3 text-green-500 ml-auto" />
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Alerts */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                {success}
              </div>
            )}

            {/* Section Content */}
            {renderCurrentSection()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => navigateSection("prev")}
                disabled={sections.findIndex(s => s.id === activeSection) === 0}
                className="flex items-center gap-2 px-6 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              <div className="flex gap-4">
                <button
                  onClick={handleSaveProgress}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Saving..." : "Save Progress"}
                </button>

                {activeSection === "submission" && (
                  <button
                    onClick={handleSubmitApplication}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Send className="h-4 w-4" />
                    Submit Application
                  </button>
                )}
              </div>

              <button
                onClick={() => navigateSection("next")}
                disabled={sections.findIndex(s => s.id === activeSection) === sections.length - 1}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

