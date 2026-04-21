import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Calendar, Trophy, Star, Users, ArrowLeft, BookOpen, TrendingUp, Award } from "lucide-react";
import { CourseDiscussions } from "@/features/community/components/CourseDiscussions";
import { CommunityEvents } from "@/features/community/components/CommunityEvents";
import { CommunityChallenges } from "@/features/community/components/CommunityChallenges";
import { CommunitySuccessStories } from "@/features/community/components/CommunitySuccessStories";
import { CommunityMentorship } from "@/features/community/components/CommunityMentorship";
import { CommunityChat } from "@/features/community/components/CommunityChat";
import { LecturerCommunityChat } from "@/features/community/components/LecturerCommunityChat";
import { LecturerLayout } from "@/components/LecturerLayout";
import { UnifiedDiscussions } from "@/components/UnifiedDiscussions";
import { useAuth } from "@/context/AuthContext";
import { communityService, type CommunityDiscussionGroup } from "@/services/communityService";

type TabId = "discussions" | "events" | "challenges" | "stories" | "mentorship" | "analytics" | "live";

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "discussions", label: "Course Discussions", icon: <MessageSquare className="h-4 w-4" /> },
  { id: "live", label: "Live Messages", icon: <MessageSquare className="h-4 w-4" /> },
  { id: "events", label: "Instructor Events", icon: <Calendar className="h-4 w-4" /> },
  { id: "challenges", label: "Teaching Challenges", icon: <Trophy className="h-4 w-4" /> },
  { id: "stories", label: "Success Stories", icon: <Star className="h-4 w-4" /> },
  { id: "mentorship", label: "Mentorship", icon: <Users className="h-4 w-4" /> },
  { id: "analytics", label: "Analytics", icon: <TrendingUp className="h-4 w-4" /> },
];

export default function LecturerCommunityPage() {
  const { accessToken } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("discussions");
  const [groups, setGroups] = useState<CommunityDiscussionGroup[]>([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [boardError, setBoardError] = useState("");

  const lecturerTabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: "discussions", label: "Course Discussions", icon: <MessageSquare className="h-4 w-4" /> },
    { id: "live", label: unreadMessages > 0 ? `Live Messages (${unreadMessages})` : "Live Messages", icon: <MessageSquare className="h-4 w-4" /> },
    { id: "events", label: "Instructor Events", icon: <Calendar className="h-4 w-4" /> },
    { id: "challenges", label: "Teaching Challenges", icon: <Trophy className="h-4 w-4" /> },
    { id: "stories", label: "Success Stories", icon: <Star className="h-4 w-4" /> },
    { id: "mentorship", label: "Mentorship", icon: <Users className="h-4 w-4" /> },
    { id: "analytics", label: "Analytics", icon: <TrendingUp className="h-4 w-4" /> },
  ];

  useEffect(() => {
    async function loadInstructorBoardData() {
      if (!accessToken) return;
      try {
        // For instructors, we can use the same discussion groups but filter for instructor-relevant content
        const groupRows = await communityService.getStudentDiscussionGroups(accessToken);
        setGroups(groupRows);
        setBoardError("");
      } catch (error) {
        setBoardError(error instanceof Error ? error.message : "Failed to load instructor community data.");
      }
    }
    void loadInstructorBoardData();
  }, [accessToken]);

  useEffect(() => {
    async function loadUnreadCount() {
      if (!accessToken) return;
      try {
        // For now, set unread to 0 since the method doesn't exist
        // This can be implemented later when the backend supports it
        setUnreadMessages(0);
      } catch {
        setUnreadMessages(0);
      }
    }
    void loadUnreadCount();
  }, [accessToken]);

  function renderTabContent() {
    switch (activeTab) {
      case "discussions":
        return <UnifiedDiscussions showAllCourses={true} userRole="instructor" />;
      case "live":
        return (
          <div className="space-y-6 pt-4 md:pt-6">
            {boardError ? <p className="text-sm text-red-400">{boardError}</p> : null}
            <LecturerCommunityChat studentMode={false} />
          </div>
        );
      case "events":
        return <CommunityEvents />;
      case "challenges":
        return <CommunityChallenges />;
      case "stories":
        return <CommunitySuccessStories />;
      case "mentorship":
        return <CommunityMentorship />;
      case "analytics":
        return <InstructorAnalytics />;
      default:
        return <div className="text-center py-8 text-slate-500">Content coming soon...</div>;
    }
  }

  function InstructorAnalytics() {
    return (
      <div className="lecturer-card">
        <h3 className="text-lg font-semibold text-white mb-4">Course Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-600/10 p-4 rounded-xl border border-blue-800/30">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-400 mr-3" />
              <div>
                <p className="text-sm text-slate-400">Total Courses</p>
                <p className="text-2xl font-bold text-white">2</p>
              </div>
            </div>
          </div>
          <div className="bg-green-600/10 p-4 rounded-xl border border-green-800/30">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-400 mr-3" />
              <div>
                <p className="text-sm text-slate-400">Total Students</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
            </div>
          </div>
          <div className="bg-purple-600/10 p-4 rounded-xl border border-purple-800/30">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-purple-400 mr-3" />
              <div>
                <p className="text-sm text-slate-400">Avg. Rating</p>
                <p className="text-2xl font-bold text-white">0.0</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <h4 className="text-md font-medium text-white mb-3">Recent Performance</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
              <span className="text-sm text-slate-300">Course Completion Rate</span>
              <span className="text-sm font-medium text-white">0%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
              <span className="text-sm text-slate-300">Student Engagement</span>
              <span className="text-sm font-medium text-white">0%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
              <span className="text-sm text-slate-300">Quiz Success Rate</span>
              <span className="text-sm font-medium text-white">0%</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <LecturerLayout 
      title="Instructor Community" 
      subtitle="Connect with fellow instructors, share teaching experiences, and grow your professional network."
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
      {boardError && (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-800 rounded-lg">
          <p className="text-sm text-red-200">{boardError}</p>
        </div>
      )}

      <div className="lecturer-card">
        <div className="border-b border-slate-800">
          <nav className="flex -mb-px">
            {lecturerTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-3 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-cyan-500 text-cyan-400 bg-slate-800/50"
                    : "border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600 hover:bg-slate-800/30"
                }`}
              >
                {tab.icon}
                <span className="ml-2">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </LecturerLayout>
  );
}
