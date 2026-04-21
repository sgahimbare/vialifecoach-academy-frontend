import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { BookOpen, Users, BarChart3, Settings, Award, Calendar, Video, FileText, TrendingUp, Plus, Edit, Trash2, MessageSquare } from "lucide-react";
import { instructorService, type InstructorDashboard } from "@/services/instructorService";
import { LecturerLayout } from "@/components/LecturerLayout";

export default function LecturerDashboardPage() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<InstructorDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await instructorService.getDashboard();
        setDashboard(data);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const stats = dashboard ? [
    {
      title: "Total Courses",
      value: dashboard.stats.totalCourses.toString(),
      icon: BookOpen,
      color: "bg-blue-500",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Students",
      value: dashboard.stats.totalStudents.toString(),
      icon: Users,
      color: "bg-green-500",
      bgColor: "bg-green-100",
    },
    {
      title: "Completion Rate",
      value: `${dashboard.stats.avgCompletionRate}%`,
      icon: TrendingUp,
      color: "bg-purple-500",
      bgColor: "bg-purple-100",
    },
    {
      title: "Avg. Rating",
      value: dashboard.stats.avgRating.toFixed(1),
      icon: Award,
      color: "bg-yellow-500",
      bgColor: "bg-yellow-100",
    },
  ] : [];

  const quickActions = [
    {
      title: "Create New Course",
      description: "Build and publish a new course",
      icon: Plus,
      link: "/lecturer/courses/new",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Manage Courses",
      description: `Edit and organize ${dashboard?.stats.totalCourses || 0} courses`,
      icon: Settings,
      link: "/lecturer/courses",
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      title: "Community",
      description: "Connect with fellow instructors",
      icon: Users,
      link: "/lecturer/community",
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      title: "Edit Profile",
      description: "Update your professional information",
      icon: Edit,
      link: "/lecturer/profile",
      color: "bg-orange-600 hover:bg-orange-700",
    },
  ];

  const recentActivity = dashboard?.recentActivity.map((activity, index) => ({
    title: activity.course_title,
    action: activity.action,
    time: activity.timestamp,
    type: activity.type,
  })) || [];

  if (loading) {
    return (
      <LecturerLayout title="Lecturer Dashboard" subtitle="Loading your dashboard...">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
          <span className="ml-3 text-slate-300">Loading dashboard...</span>
        </div>
      </LecturerLayout>
    );
  }

  return (
    <LecturerLayout 
      title="Lecturer Dashboard" 
      subtitle={`Welcome back, ${user?.name}. Here's what's happening with your courses today.`}
    >
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="lecturer-card">
            <div className="flex items-center">
              <stat.icon className={`h-6 w-6 ${stat.color} mr-3`} />
              <div>
                <p className="text-sm text-slate-400">{stat.title}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="lecturer-card hover:bg-slate-800/80 transition-colors group"
            >
              <div className="flex items-center mb-3">
                <div className={`p-2 rounded-lg ${action.color} text-white group-hover:bg-${action.color.replace('/20', '/30')} transition-colors`}>
                  <action.icon className="h-5 w-5" />
                </div>
              </div>
              <h3 className="font-medium text-white mb-1">{action.title}</h3>
              <p className="text-sm text-slate-400">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* My Courses */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white">My Courses</h2>
          <Link
            to="/lecturer/courses/new"
            className="lecturer-btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Course
          </Link>
        </div>
        
        {dashboard?.courses && dashboard.courses.length > 0 ? (
          <div className="grid gap-4">
            {dashboard.courses.map((course) => (
              <div key={course.id} className="lecturer-card">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-white mb-1">{course.title}</h3>
                    <p className="text-sm text-slate-400 line-clamp-2 mb-2">{course.description}</p>
                    <div className="flex items-center text-sm text-slate-500">
                      <Users className="h-4 w-4 mr-1" />
                      {course.enrollment_count || 0} students
                      <Award className="h-4 w-4 ml-4 mr-1" />
                      {course.rating || 0} rating
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Link
                      to={`/lecturer/courses/${course.id}/edit`}
                      className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <Link
                      to={`/lecturer/courses/${course.id}/discussions`}
                      className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="lecturer-card text-center py-8">
            <BookOpen className="h-12 w-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No courses yet</h3>
            <p className="text-slate-400 mb-4">Create your first course to get started</p>
            <Link
              to="/lecturer/courses/new"
              className="lecturer-btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Link>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
          <div className="lecturer-card">
            <div className="divide-y divide-slate-800">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="p-4 hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          activity.type === 'enrollment' ? 'bg-blue-600/20' :
                          activity.type === 'completion' ? 'bg-green-600/20' : 'bg-yellow-600/20'
                        }`}>
                          {
                            activity.type === 'enrollment' ? <Users className="h-4 w-4 text-blue-400" /> :
                            activity.type === 'completion' ? <Award className="h-4 w-4 text-green-400" /> :
                            <BarChart3 className="h-4 w-4 text-yellow-400" />
                          }
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-white">{activity.title}</p>
                        <p className="text-sm text-slate-400">{activity.action}</p>
                        <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500">
                  No recent activity
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Schedule */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Upcoming Schedule</h2>
          <div className="lecturer-card">
            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-slate-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-white">Live Session: Advanced Coaching</p>
                  <p className="text-xs text-slate-500">Today, 3:00 PM</p>
                </div>
              </div>
              <div className="flex items-center">
                <Video className="h-5 w-5 text-slate-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-white">Office Hours</p>
                  <p className="text-xs text-slate-500">Tomorrow, 10:00 AM</p>
                </div>
              </div>
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-slate-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-white">Assignment Review</p>
                  <p className="text-xs text-slate-500">Friday, 2:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LecturerLayout>
  );
}
