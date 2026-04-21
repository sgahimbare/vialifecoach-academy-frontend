import { useState } from "react";
import { useEffect } from "react";
import { MessageSquare, Calendar, Trophy, Star, Users } from "lucide-react";
import { CourseDiscussions } from "@/features/community/components/CourseDiscussions";
import { CommunityEvents } from "@/features/community/components/CommunityEvents";
import { CommunityChallenges } from "@/features/community/components/CommunityChallenges";
import { CommunitySuccessStories } from "@/features/community/components/CommunitySuccessStories";
import { CommunityMentorship } from "@/features/community/components/CommunityMentorship";
import { CommunityChat } from "@/features/community/components/CommunityChat";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "react-router-dom";
import { communityService, type CommunityDiscussionGroup } from "@/services/communityService";

type TabId = "discussions" | "events" | "challenges" | "stories" | "mentorship" | "groups" | "live";

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "discussions", label: "My Discussions", icon: <MessageSquare className="h-4 w-4" /> },
  { id: "events", label: "Events & Webinars", icon: <Calendar className="h-4 w-4" /> },
  { id: "challenges", label: "Challenges", icon: <Trophy className="h-4 w-4" /> },
  { id: "stories", label: "Success Stories", icon: <Star className="h-4 w-4" /> },
  { id: "mentorship", label: "Mentorship", icon: <Users className="h-4 w-4" /> },
];

export default function CommunityPage() {
  const { accessToken } = useAuth();
  const location = useLocation();
  const isStudentBoard = location.pathname.startsWith("/student/");
  const [activeTab, setActiveTab] = useState<TabId>("discussions");
  const [groups, setGroups] = useState<CommunityDiscussionGroup[]>([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [boardError, setBoardError] = useState("");

  useEffect(() => {
    async function loadStudentBoardData() {
      if (!isStudentBoard || !accessToken) return;
      try {
        const groupRows = await communityService.getStudentDiscussionGroups(accessToken);
        setGroups(groupRows);
        setBoardError("");
      } catch (error) {
        setBoardError(error instanceof Error ? error.message : "Failed to load student community data.");
      }
    }
    void loadStudentBoardData();
  }, [isStudentBoard, accessToken]);

  useEffect(() => {
    async function loadUnreadCount() {
      if (!isStudentBoard || !accessToken) return;
      try {
        const contacts = await communityService.getStudentChatContacts(accessToken);
        const unreadTotal = contacts.reduce((sum, item) => sum + Number(item.unread_count || 0), 0);
        setUnreadMessages(unreadTotal);
      } catch {
        setUnreadMessages(0);
      }
    }
    void loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 7000);
    return () => clearInterval(interval);
  }, [isStudentBoard, accessToken]);

  const studentTabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: "groups", label: "Discussion Groups", icon: <Users className="h-4 w-4" /> },
    { id: "discussions", label: "Discussions", icon: <MessageSquare className="h-4 w-4" /> },
    { id: "live", label: unreadMessages > 0 ? `Live Messages (${unreadMessages})` : "Live Messages", icon: <MessageSquare className="h-4 w-4" /> },
    { id: "mentorship", label: "Mentorship", icon: <Users className="h-4 w-4" /> },
  ];

  const normalTabs = tabs;
  const visibleTabSource = isStudentBoard ? studentTabs : normalTabs;
  const publicTabs: TabId[] = ["events", "challenges", "stories"];
  const visibleTabs = visibleTabSource.filter((tab) => (isStudentBoard ? true : accessToken || publicTabs.includes(tab.id)));
  const safeActiveTab: TabId = (accessToken || publicTabs.includes(activeTab)) ? activeTab : "events";

  return (
    <main className={`${isStudentBoard ? "bg-slate-900" : "bg-slate-50"} min-h-screen`}>

      {/* Hero */}
      <section className="bg-gradient-to-br from-sky-700 to-sky-900 text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-3">{isStudentBoard ? "Student Community Hub" : "Our Community"}</h1>
          <p className="text-sky-100 text-lg max-w-2xl mx-auto">
            {isStudentBoard
              ? "Stay inside your student board: join discussion groups, collaborate in course discussions, and use live messaging."
              : "Connect, grow, and thrive together. Engage in course discussions, chat with fellow learners, join challenges, and find your mentor."}
          </p>
        </div>
      </section>

      {/* Tab Navigation */}
      <div
        className={`${
          isStudentBoard ? "bg-slate-800/95 border-slate-700" : "bg-white/95 border-slate-200"
        } sticky top-16 z-30 border-b shadow-sm backdrop-blur`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto scrollbar-hide gap-1 py-1">
            {visibleTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex-shrink-0 ${
                  safeActiveTab === tab.id
                    ? "border-sky-500 text-sky-300"
                    : isStudentBoard
                      ? "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {isStudentBoard && safeActiveTab === "groups" ? (
          <div className="space-y-3">
            {boardError ? <p className="text-sm text-red-600">{boardError}</p> : null}
            {groups.length === 0 ? <p className="text-sm text-slate-400">No discussion groups available yet.</p> : null}
            {groups.map((group) => (
              <div key={group.course_id} className="rounded-xl border border-slate-700 bg-slate-800 p-4">
                <p className="text-sm font-semibold text-slate-100">{group.group_name}</p>
                <p className="mt-1 text-xs text-slate-400">{group.short_description || "Course group"}</p>
                <p className="mt-2 text-xs text-slate-500">Posts: {group.posts_count}</p>
              </div>
            ))}
          </div>
        ) : null}
        {safeActiveTab === "discussions" && <CourseDiscussions studentMode={isStudentBoard} />}
        {isStudentBoard && safeActiveTab === "live" ? (
          <div className="space-y-6 pt-4 md:pt-6">
            {boardError ? <p className="text-sm text-red-600">{boardError}</p> : null}
            <CommunityChat studentMode />
          </div>
        ) : null}
        {!isStudentBoard && safeActiveTab === "events" && <CommunityEvents />}
        {!isStudentBoard && safeActiveTab === "challenges" && <CommunityChallenges />}
        {!isStudentBoard && safeActiveTab === "stories" && <CommunitySuccessStories />}
        {safeActiveTab === "mentorship" && <CommunityMentorship studentMode={isStudentBoard} />}
      </div>

    </main>
  );
}
