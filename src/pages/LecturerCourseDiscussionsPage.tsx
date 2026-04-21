import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MessageSquare, Users, Award, BookOpen } from "lucide-react";
import { CourseDiscussions } from "@/components/CourseDiscussions";
import { DiscussionGrading } from "@/components/DiscussionGrading";
import { courseDiscussionService, type CourseDiscussion } from "@/services/courseDiscussionService";
import { LecturerLayout } from "@/components/LecturerLayout";
import { useAuth } from "@/context/AuthContext";

export default function LecturerCourseDiscussionsPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { accessToken } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [discussions, setDiscussions] = useState<CourseDiscussion[]>([]);
  const [selectedDiscussion, setSelectedDiscussion] = useState<CourseDiscussion | null>(null);
  const [activeTab, setActiveTab] = useState<'discussions' | 'grading'>('discussions');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (courseId && accessToken) {
      loadCourseData();
    }
  }, [courseId, accessToken]);

  async function loadCourseData() {
    if (!courseId || !accessToken) return;
    setLoading(true);
    try {
      // Load course discussions
      const discussionsData = await courseDiscussionService.getCourseDiscussions(parseInt(courseId));
      setDiscussions(discussionsData);
      
      // Mock course data (in real app, you'd fetch this from course service)
      setCourse({
        id: courseId,
        title: discussionsData[0]?.course_id === 1 ? "Overcoming Negative Thinking: Rewiring Your Brain for Positivity" : 
               discussionsData[0]?.course_id === 2 ? "How to Master Time Management: Taking Control of Your Day" : 
               "Course",
        description: "Course description here"
      });
    } catch (error) {
      console.error("Error loading course data:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="ml-2 text-gray-600">Loading course discussions...</span>
          </div>
        </div>
      </main>
    );
  }

  return (
    <LecturerLayout 
      title="Course Discussions" 
      subtitle={`${course?.title} - Manage discussions and grade student participation`}
      actions={
        <div className="flex items-center space-x-4">
          <Link
            to="/lecturer"
            className="inline-flex items-center px-4 py-2 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center space-x-4 text-sm text-slate-400">
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-1" />
              {discussions.length} discussions
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              Students participating
            </div>
          </div>
        </div>
      }
    >
      {/* Tabs */}
      <div className="lecturer-card">
        <div className="border-b border-slate-800">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('discussions')}
              className={`flex items-center px-6 py-3 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'discussions'
                  ? "border-cyan-500 text-cyan-400 bg-slate-800/50"
                  : "border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600 hover:bg-slate-800/30"
              }`}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Discussions
            </button>
            <button
              onClick={() => setActiveTab('grading')}
              className={`flex items-center px-6 py-3 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'grading'
                  ? "border-cyan-500 text-cyan-400 bg-slate-800/50"
                  : "border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600 hover:bg-slate-800/30"
              }`}
            >
              <Award className="h-4 w-4 mr-2" />
              Grading
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'discussions' ? (
            courseId ? (
              <CourseDiscussions courseId={parseInt(courseId)} isInstructor={true} />
            ) : (
              <div className="text-center text-slate-500">
                Invalid course ID
              </div>
            )
          ) : (
            <div className="space-y-6">
              {discussions.length === 0 ? (
                <div className="text-center py-8">
                  <Award className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No Discussions Yet</h3>
                  <p className="text-slate-400">Create discussions first to start grading student participation.</p>
                </div>
              ) : (
                discussions.map((discussion) => (
                  <div key={discussion.id} className="mb-6">
                    <DiscussionGrading 
                      discussionId={discussion.id} 
                      discussionTitle={discussion.title}
                    />
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </LecturerLayout>
  );
}
