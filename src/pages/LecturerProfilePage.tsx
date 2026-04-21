import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { profileService } from "@/services/profileService";
import { instructorService } from "@/services/instructorService";
import { extractApiErrorMessage } from "@/lib/apiError";
import { BookOpen, Users, Award, Calendar, Edit3, Save, X, ArrowLeft } from "lucide-react";
import { LecturerLayout } from "@/components/LecturerLayout";

export default function LecturerProfilePage() {
  const { user, accessToken, updateUserProfile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address1, setAddress1] = useState(user?.address_line1 || "");
  const [address2, setAddress2] = useState(user?.address_line2 || "");
  const [city, setCity] = useState(user?.city || "");
  const [state, setState] = useState(user?.state || "");
  const [country, setCountry] = useState(user?.country || "");
  const [postalCode, setPostalCode] = useState(user?.postal_code || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [photoUrl, setPhotoUrl] = useState(user?.photo || "");
  
  // Instructor-specific fields
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");
  const [qualification, setQualification] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  const initials = useMemo(() => {
    const value = name || user?.name || "";
    return value
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";
  }, [name, user?.name]);

  async function compressImageToDataUrl(file: File): Promise<string> {
    const objectUrl = URL.createObjectURL(file);
    try {
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("Unable to read image file."));
        img.src = objectUrl;
      });

      const maxSide = 720;
      const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
      const targetWidth = Math.max(1, Math.round(image.width * scale));
      const targetHeight = Math.max(1, Math.round(image.height * scale));

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Unable to get canvas context.");
      ctx.drawImage(image, 0, 0, targetWidth, targetHeight);
      return canvas.toDataURL("image/jpeg", 0.8);
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage("Please select an image file.");
      return;
    }
    try {
      const dataUrl = await compressImageToDataUrl(file);
      setPhotoUrl(dataUrl);
    } catch {
      setMessage("Failed to process image.");
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken) return;
    setIsSaving(true);
    setMessage("");
    try {
      const updatedProfile = await profileService.updateProfile(
        accessToken,
        {
          name,
          phone: phone || null,
          address_line1: address1 || null,
          address_line2: address2 || null,
          city: city || null,
          state: state || null,
          country: country || null,
          postal_code: postalCode || null,
          bio: bio || null,
          photo_url: photoUrl || null,
        }
      );
      if (updatedProfile) {
        updateUserProfile(updatedProfile);
      }
      setMessage("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      setMessage(extractApiErrorMessage(error, "Failed to update profile."));
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancel() {
    setName(user?.name || "");
    setPhone(user?.phone || "");
    setAddress1(user?.address_line1 || "");
    setAddress2(user?.address_line2 || "");
    setCity(user?.city || "");
    setState(user?.state || "");
    setCountry(user?.country || "");
    setPostalCode(user?.postal_code || "");
    setBio(user?.bio || "");
    setPhotoUrl(user?.photo || "");
    setSpecialization("");
    setExperience("");
    setQualification("");
    setLinkedinUrl("");
    setIsEditing(false);
    setMessage("");
  }

  if (!user) return null;

  return (
    <LecturerLayout 
      title="Lecturer Profile" 
      subtitle="Manage your professional information and teaching credentials"
      actions={
        <Link
          to="/lecturer"
          className="inline-flex items-center px-4 py-2 text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1">
          <div className="lecturer-card">
            <div className="text-center">
              <div className="relative inline-block">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="Profile"
                    className="h-32 w-32 rounded-full object-cover border-4 border-cyan-600/30 shadow-lg"
                  />
                ) : (
                  <div className="h-32 w-32 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center border-4 border-cyan-600/30 shadow-lg">
                    <span className="text-white text-3xl font-bold">{initials}</span>
                  </div>
                )}
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-cyan-600 text-white p-3 rounded-full cursor-pointer hover:bg-cyan-700 transition-colors shadow-lg border-2 border-slate-800">
                    <Edit3 className="h-4 w-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              
              <h2 className="mt-6 text-2xl font-bold text-white">{name}</h2>
              <p className="text-slate-400 font-medium">Lecturer</p>
              
              {/* Professional Stats */}
              <div className="mt-8 grid grid-cols-1 gap-4">
                <div className="bg-gradient-to-r from-blue-600/20 to-blue-700/20 p-4 rounded-xl border border-blue-800/50">
                  <BookOpen className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">Total Courses</p>
                  <p className="text-2xl font-bold text-white">2</p>
                </div>
                <div className="bg-gradient-to-r from-green-600/20 to-green-700/20 p-4 rounded-xl border border-green-800/50">
                  <Users className="h-6 w-6 text-green-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">Total Students</p>
                  <p className="text-2xl font-bold text-white">0</p>
                </div>
                <div className="bg-gradient-to-r from-yellow-600/20 to-yellow-700/20 p-4 rounded-xl border border-yellow-800/50">
                  <Award className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">Avg. Rating</p>
                  <p className="text-2xl font-bold text-white">0.0</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-8 space-y-3">
                <Link
                  to="/lecturer/courses"
                  className="w-full lecturer-btn-primary flex items-center justify-center"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Manage Courses
                </Link>
                <Link
                  to="/lecturer/community"
                  className="w-full lecturer-btn flex items-center justify-center"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Community
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Edit Form */}
        <div className="lg:col-span-2">
          <div className="lecturer-card">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">Profile Information</h2>
              <div className="flex items-center space-x-3">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="lecturer-btn-primary"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleCancel}
                      className="lecturer-btn"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="lecturer-btn-primary disabled:opacity-50"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {message && (
              <div className={`mb-6 p-4 rounded-lg border ${
                message.includes("success") 
                  ? "bg-green-900/50 border-green-800 text-green-200" 
                  : "bg-red-900/50 border-red-800 text-red-200"
              }`}>
                <p className="text-sm font-medium">{message}</p>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-8">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-6 pb-2 border-b border-slate-700">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={!isEditing}
                      className="lecturer-input w-full"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={!isEditing}
                      className="lecturer-input w-full"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-6 pb-2 border-b border-slate-700">
                  Professional Information
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Area of Specialization
                    </label>
                    <input
                      type="text"
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      disabled={!isEditing}
                      className="lecturer-input w-full"
                      placeholder="e.g., Psychology, Business Coaching, Time Management"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Years of Experience
                      </label>
                      <input
                        type="text"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        disabled={!isEditing}
                        className="lecturer-input w-full"
                        placeholder="e.g., 5+ years"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Highest Qualification
                      </label>
                      <input
                        type="text"
                        value={qualification}
                        onChange={(e) => setQualification(e.target.value)}
                        disabled={!isEditing}
                        className="lecturer-input w-full"
                        placeholder="e.g., PhD in Psychology, MBA"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      disabled={!isEditing}
                      className="lecturer-input w-full"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-6 pb-2 border-b border-slate-700">
                  Professional Bio
                </h3>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    About Yourself
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    disabled={!isEditing}
                    rows={5}
                    className="lecturer-input w-full resize-none"
                    placeholder="Tell us about yourself, your teaching philosophy, and expertise..."
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-6 pb-2 border-b border-slate-700">
                  Contact Information
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      value={address1}
                      onChange={(e) => setAddress1(e.target.value)}
                      disabled={!isEditing}
                      className="lecturer-input w-full"
                      placeholder="Street address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      value={address2}
                      onChange={(e) => setAddress2(e.target.value)}
                      disabled={!isEditing}
                      className="lecturer-input w-full"
                      placeholder="Apartment, suite, etc."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        disabled={!isEditing}
                        className="lecturer-input w-full"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        State/Province
                      </label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        disabled={!isEditing}
                        className="lecturer-input w-full"
                        placeholder="State or province"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        disabled={!isEditing}
                        className="lecturer-input w-full"
                        placeholder="Postal code"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      disabled={!isEditing}
                      className="lecturer-input w-full"
                      placeholder="Country"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </LecturerLayout>
  );
}
