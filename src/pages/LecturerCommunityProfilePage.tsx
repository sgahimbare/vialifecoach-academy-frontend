import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, BookOpen, Users } from "lucide-react";
import { LecturerLayout } from "@/components/LecturerLayout";
import { useAuth } from "@/context/AuthContext";
import { communityService, type CommunityContactProfile } from "@/services/communityService";
import { useState, useEffect } from "react";

function normalizeRole(role?: string) {
  const value = String(role || "").toLowerCase();
  if (value === "instructor" || value === "lecturer" || value === "teacher") return "Instructor";
  if (value === "student") return "Student";
  if (!value) return "User";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function LecturerCommunityProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const { accessToken } = useAuth();
  const [profile, setProfile] = useState<CommunityContactProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      if (!accessToken || !userId) return;
      try {
        setLoading(true);
        const profileData = await communityService.getChatContactProfile(accessToken, parseInt(userId));
        setProfile(profileData);
        setError("");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load profile");
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [accessToken, userId]);

  if (loading) {
    return (
      <LecturerLayout 
        title="Loading Profile..." 
        subtitle="Please wait"
        actions={
          <Link
            to="/lecturer/community"
            className="inline-flex items-center px-4 py-2 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Community
          </Link>
        }
      >
        <div className="lecturer-card">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
          </div>
        </div>
      </LecturerLayout>
    );
  }

  if (error || !profile) {
    return (
      <LecturerLayout 
        title="Profile Not Found" 
        subtitle="Unable to load user profile"
        actions={
          <Link
            to="/lecturer/community"
            className="inline-flex items-center px-4 py-2 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Community
          </Link>
        }
      >
        <div className="lecturer-card">
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error || "Profile not found"}</p>
            <Link
              to="/lecturer/community"
              className="inline-flex items-center px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
            >
              Return to Community
            </Link>
          </div>
        </div>
      </LecturerLayout>
    );
  }

  return (
    <LecturerLayout 
      title={`${profile.name}'s Profile`} 
      subtitle={`${normalizeRole(profile.role)} • ${profile.status}`}
      actions={
        <Link
          to="/lecturer/community"
          className="inline-flex items-center px-4 py-2 text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Community
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="lecturer-card">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              {profile.photo_url ? (
                <img
                  src={profile.photo_url}
                  alt={profile.name}
                  className="h-24 w-24 rounded-full object-cover border-4 border-cyan-600/30"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center border-4 border-cyan-600/30">
                  <span className="text-white text-3xl font-bold">
                    {profile.name?.charAt(0)?.toUpperCase() || "?"}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-2">{profile.name}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-slate-300 mb-4">
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {normalizeRole(profile.role)}
                </span>
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Status: {profile.status}
                </span>
                {profile.last_active_at && (
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Last active: {new Date(profile.last_active_at).toLocaleDateString()}
                  </span>
                )}
              </div>
              
              {profile.bio && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white mb-2">About</h3>
                  <p className="text-slate-300 whitespace-pre-wrap">{profile.bio}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="lecturer-card">
          <h2 className="text-xl font-semibold text-white mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-cyan-400" />
                <div>
                  <p className="text-sm text-slate-400">Email</p>
                  <p className="text-white">{profile.email}</p>
                </div>
              </div>
            )}
            
            {profile.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-cyan-400" />
                <div>
                  <p className="text-sm text-slate-400">Phone</p>
                  <p className="text-white">{profile.phone}</p>
                </div>
              </div>
            )}
            
            {(profile.city || profile.state || profile.country) && (
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-cyan-400" />
                <div>
                  <p className="text-sm text-slate-400">Location</p>
                  <p className="text-white">
                    {[profile.city, profile.state, profile.country]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                </div>
              </div>
            )}
            
            {profile.created_at && (
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-cyan-400" />
                <div>
                  <p className="text-sm text-slate-400">Member Since</p>
                  <p className="text-white">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enrolled Courses */}
        {profile.enrolled_courses && profile.enrolled_courses.length > 0 && (
          <div className="lecturer-card">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Enrolled Courses ({profile.enrolled_courses.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.enrolled_courses.map((course) => (
                <div key={course.id} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                  <h3 className="font-medium text-white mb-2">{course.title}</h3>
                  {course.enrolled_at && (
                    <p className="text-xs text-slate-400">
                      Enrolled: {new Date(course.enrolled_at).toLocaleDateString()}
                    </p>
                  )}
                  {course.completed_at ? (
                    <p className="text-xs text-green-400">
                      Completed: {new Date(course.completed_at).toLocaleDateString()}
                    </p>
                  ) : (
                    <p className="text-xs text-yellow-400">In Progress</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="lecturer-card">
          <div className="flex flex-wrap gap-4">
            <Link
              to={`/lecturer/live-discussions`}
              className="lecturer-btn-primary"
            >
              Start Conversation
            </Link>
            <Link
              to="/lecturer/community"
              className="lecturer-btn"
            >
              Back to Community
            </Link>
          </div>
        </div>
      </div>
    </LecturerLayout>
  );
}
