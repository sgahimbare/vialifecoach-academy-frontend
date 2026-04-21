import { Link } from "react-router-dom";
import { ArrowLeft, MessageSquare, Users, TrendingUp } from "lucide-react";
import { LecturerLayout } from "@/components/LecturerLayout";
import { LecturerCommunityChat } from "@/features/community/components/LecturerCommunityChat";
import { useAuth } from "@/context/AuthContext";
import { communityService } from "@/services/communityService";
import { useState, useEffect } from "react";

export default function LiveDiscussionsPage() {
  const { accessToken } = useAuth();
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUnreadCount() {
      if (!accessToken) return;
      try {
        const contacts = await communityService.getStudentChatContacts(accessToken);
        const unreadTotal = contacts.reduce((sum, item) => sum + Number(item.unread_count || 0), 0);
        setUnreadMessages(unreadTotal);
      } catch {
        setUnreadMessages(0);
      }
    }
    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 7000);
    return () => clearInterval(interval);
  }, [accessToken]);

  return (
    <LecturerLayout 
      title="Live Messages" 
      subtitle={`Real-time messaging with students and instructors ${unreadMessages > 0 ? `(${unreadMessages} unread)` : ''}`}
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
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="lecturer-card">
            <div className="flex items-center">
              <MessageSquare className="h-6 w-6 text-cyan-400 mr-3" />
              <div>
                <p className="text-sm text-slate-400">Active Chats</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
            </div>
          </div>
          <div className="lecturer-card">
            <div className="flex items-center">
              <Users className="h-6 w-6 text-green-400 mr-3" />
              <div>
                <p className="text-sm text-slate-400">Contacts Online</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
            </div>
          </div>
          <div className="lecturer-card">
            <div className="flex items-center">
              <TrendingUp className="h-6 w-6 text-purple-400 mr-3" />
              <div>
                <p className="text-sm text-slate-400">Unread Messages</p>
                <p className="text-2xl font-bold text-white">{unreadMessages}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lecturer-card">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white mb-2">Live Chat Interface</h3>
          <p className="text-slate-400">Communicate in real-time with students and fellow instructors. Select a contact to start messaging.</p>
        </div>
        
        <div className="space-y-6 pt-4 md:pt-6">
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <LecturerCommunityChat studentMode={false} />
        </div>
      </div>
    </LecturerLayout>
  );
}
