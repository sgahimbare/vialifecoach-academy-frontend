import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { ProtectedRoute } from "./guads/ProtectedRoutes";
import { GuestRoute } from "./guads/GuestRoutes";
import ProfilePage from "@/features/profile/pages/ProfilePage";
import { Home } from "@/features/home/pages/Home";
import { Catalog } from "@/features/catalog/pages/Catalog";
import CertificationsPage from "@/pages/CertificationsPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import CoursesListPage from "@/pages/CoursesListPage";
import CoursePublicDetailPage from "@/pages/CoursePublicDetailPage";
import CourseStartPage from "@/pages/CourseStartPage";
import LinearCoursePlayer from "@/components/LinearCoursePlayer";
import ContactUsPage from "@/pages/ContactUsPage";
import AboutUsPage from "@/pages/AboutUsPage";
import SuccessStoriesPage from "@/pages/SuccessStoriesPage";
import PartnershipsPage from "@/pages/PartnershipsPage";
import DonatePage from "@/pages/DonatePage";
import TermsPage from "@/pages/TermsPage";
import CookiesPage from "@/pages/CookiesPage";
import PrivacyPage from "@/pages/PrivacyPage";
import ResourcesPage from "@/pages/ResourcesPage";
import CertificateTemplatePage from "@/pages/CertificateTemplatePage";
import CertificateVerificationPage from "@/pages/CertificateVerificationPage";
import SupportPage from "@/pages/SupportPage";
import { SupportFAQPage } from "@/pages/SupportFAQPage";
import { SupportTicketPage } from "@/pages/SupportTicketPage";
import { SupportBookingPage } from "@/pages/SupportBookingPage";
import { SupportWhatsAppPage } from "@/pages/SupportWhatsAppPage";
import CommunityPage from "@/pages/CommunityPage";
import LessonManagement from "@/pages/LessonManagement";
// Women Refugee Rise Program Imports
import WomenRefugeeRiseProgram from "@/pages/WomenRefugeeRiseProgram";
import WRRPVerificationPage from "@/pages/WRRPVerificationPage";
import MentalHealthPillar from "@/pages/program/MentalHealthPillar";
import EntrepreneurshipPillar from "@/pages/program/EntrepreneurshipPillar";
import VirtualAssistantPillar from "@/pages/program/VirtualAssistantPillar";
import GvbHealingProgram from "@/pages/program/GvbHealingProgram";
import ComingSoonPage from "@/pages/ComingSoonPage";
import ApplicationSubmitted from "@/pages/program/ApplicationSubmitted";
import ApplicationPortal from "@/pages/ApplicationPortal";
import ApplicationDetailsPage from "@/pages/ApplicationDetailsPage";
import GFApplicationPortal from "@/pages/GFApplicationPortalIntegrated";
import GFApplicationPortalHome from "@/pages/GFApplicationPortalHome";
import GFAccountCreateVerify from "@/pages/GFAccountCreateVerify";
import ApplicationDashboard from "@/pages/ApplicationDashboard";
import RecommendationPortal from "@/pages/RecommendationPortal";
import AdminDashboard from "@/pages/AdminDashboard";
import StudentDashboardPage from "@/pages/StudentDashboardPage";
import StudentCoursesPage from "@/pages/StudentCoursesPage";
import StudentCourseOverviewPage from "@/pages/StudentCourseOverviewPage";
import StudentQuizCenterPage from "@/pages/StudentQuizCenterPage";
import QuizRulesPage from "@/pages/QuizRulesPage";
import QuizAttemptPage from "@/pages/QuizAttemptPage";
import LecturerDashboardPage from "@/pages/LecturerDashboardPage";
import LecturerCoursesPage from "@/pages/LecturerCoursesPage";
import LecturerCreateCoursePage from "@/pages/LecturerCreateCoursePage";
import LecturerQuizRulesInfoPage from "@/pages/LecturerQuizRulesInfoPage";
import LecturerCommunityPage from "@/pages/LecturerCommunityPage";
import LecturerProfilePage from "@/pages/LecturerProfilePage";
import LecturerCourseDiscussionsPage from "@/pages/LecturerCourseDiscussionsPage";
import LiveDiscussionsPage from "@/pages/LiveDiscussionsPage";
import LecturerCommunityProfilePage from "@/pages/LecturerCommunityProfilePage";
import LecturerLoginPage from '@/pages/LecturerLoginPage';
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import AdminApplicationsPage from "@/pages/AdminApplicationsPage";
import AdminAdmissionLetterPage from "@/pages/AdminAdmissionLetterPage";
import AdminEmailTemplatesPage from "@/pages/AdminEmailTemplatesPage";
import AdminUsersPage from "@/pages/AdminUsersPage";
import AdminCoursesPage from "@/pages/AdminCoursesPage";
import AdminCategoriesPage from "@/pages/AdminCategoriesPage";
import AdminQuizPoliciesPage from "@/pages/AdminQuizPoliciesPage";
import AdminOperationsPage from "@/pages/AdminOperationsPage";
import AdminReportCenterPage from "@/pages/AdminReportCenterPage";
import AdminConversationAuditPage from "@/pages/AdminConversationAuditPage";
import AdminAnalyticsPage from "@/pages/AdminAnalyticsPage";
import AdminProgramsOverviewPage from "@/pages/admin/AdminProgramsOverviewPage";
import AdminProgramEditPage from "@/pages/admin/AdminProgramEditPage";
import AdminProgramKeywordsPage from "@/pages/AdminProgramKeywordsPage";
import SupportTicketsPage from "@/pages/admin/SupportTicketsPage";
import BookingsPage from "@/pages/admin/BookingsPage";
import CourseOverviewPage from "@/pages/admin/CourseOverviewPage";
import ModuleManagementPage from "@/pages/admin/ModuleManagementPage";
import UnifiedCourseManagementPage from "@/pages/admin/UnifiedCourseManagementPage";
import CoursePlayerPage from "@/pages/CoursePlayerPage";
import { AdminErrorBoundary } from "@/components/admin/AdminErrorBoundary";
import ForbiddenPage from "@/pages/ForbiddenPage";
import NotFoundPage from "@/pages/NotFoundPage";
import { OAuthCallback } from "@/features/auth/pages/OAuthCallback";
import { useAuth } from "@/context/AuthContext";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
// Module 1 Pages
import Module1Introduction from "@/pages/Module1Introduction";
import Module1LearningOutcomes from "@/pages/Module1LearningOutcomes";
import Module1Lesson1Video from "@/pages/Module1Lesson1Video";
import Module1Lesson1Reading from "@/pages/Module1Lesson1Reading";
import Module1Lesson2Video from "@/pages/Module1Lesson2Video";
import Module1Lesson2Reading from "@/pages/Module1Lesson2Reading";
import Module1Lesson3Video from "@/pages/Module1Lesson3Video";
import Module1Lesson3Reading from "@/pages/Module1Lesson3Reading";
import Module1Lesson4Video from "@/pages/Module1Lesson4Video";
import Module1Lesson4Reading from "@/pages/Module1Lesson4Reading";
import Module1Lesson1 from "@/pages/Module1Lesson1";
import Module1Lesson2 from "@/pages/Module1Lesson2";
import Module1Lesson3 from "@/pages/Module1Lesson3";
import Module1Lesson4 from "@/pages/Module1Lesson4";
import Module1Summary from "@/pages/Module1Summary";
// Module 2 Pages
import Module2Introduction from '@/pages/Module2Introduction';
import Module2LearningOutcomes from '@/pages/Module2LearningOutcomes';
import Module2Lesson1 from '@/pages/Module2Lesson1';
import Module2Lesson2 from '@/pages/Module2Lesson2';
import Module2Summary from '@/pages/Module2Summary';
import CourseLearningPage from '../pages/CourseLearningPage';
import TestPage from '../pages/TestPage';
import CourseModulesPage from "@/pages/CourseModulesPage";

function StudentSessionBoundary() {
  const location = useLocation();
  const { user, accessToken, logout } = useAuth();
  const isLoggingOut = useRef(false);
  const previousPathRef = useRef(location.pathname);

  useEffect(() => {
    const previousPath = previousPathRef.current;
    const wasInStudentArea = previousPath.startsWith("/student");
    const isInStudentArea = location.pathname.startsWith("/student");

    // Only reset a student session when they actively leave /student pages.
    if (accessToken && user?.role === "student" && wasInStudentArea && !isInStudentArea && !isLoggingOut.current) {
      isLoggingOut.current = true;
      void logout().finally(() => {
        isLoggingOut.current = false;
      });
    }

    previousPathRef.current = location.pathname;
  }, [location.pathname, accessToken, user, logout]);

  return null;
}

export default function AppRoutes() {
  return (
    <>
      <StudentSessionBoundary />
      <Routes>
        <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="lecturer-login" element={<LecturerLoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="courses" element={<CoursesListPage />} />
        <Route path="catalog" element={<Catalog />} />
        <Route path="courses/:id" element={<CoursePublicDetailPage />} />
        <Route path="courses/:id/overview" element={<CoursePublicDetailPage />} />
        <Route path="courses/:id/start" element={<CourseStartPage />} />
        <Route path="courses/:id/player" element={<CoursePlayerPage />} />
        {/* Module 1 Sequential Routes */}
        <Route path="courses/:id/modules" element={<CourseModulesPage />} />
        <Route path="/courses/:id/learn" element={<CourseLearningPage />} />
        <Route path="/test-api" element={<TestPage />} />
        <Route path="courses/:id/module1/introduction" element={<Module1Introduction />} />
        <Route path="courses/:id/module1/learning-outcomes" element={<Module1LearningOutcomes />} />
        <Route path="courses/:id/module1/lesson1/video" element={<Module1Lesson1Video />} />
        <Route path="courses/:id/module1/lesson1/reading" element={<Module1Lesson1Reading />} />
        <Route path="courses/:id/module1/lesson2/video" element={<Module1Lesson2Video />} />
        <Route path="courses/:id/module1/lesson2/reading" element={<Module1Lesson2Reading />} />
        <Route path="courses/:id/module1/lesson3/video" element={<Module1Lesson3Video />} />
        <Route path="courses/:id/module1/lesson3/reading" element={<Module1Lesson3Reading />} />
        <Route path="courses/:id/module1/lesson4/video" element={<Module1Lesson4Video />} />
        <Route path="courses/:id/module1/lesson4/reading" element={<Module1Lesson4Reading />} />
        <Route path="courses/:id/module1/lesson1" element={<Module1Lesson1 />} />
        <Route path="courses/:id/module1/lesson2" element={<Module1Lesson2 />} />
        <Route path="courses/:id/module1/lesson3" element={<Module1Lesson3 />} />
        <Route path="courses/:id/module1/lesson4" element={<Module1Lesson4 />} />
        <Route path="courses/:id/module1/summary" element={<Module1Summary />} />
        {/* Module 2 Sequential Routes */}
        <Route path="courses/:id/module2/introduction" element={<Module2Introduction />} />
        <Route path="courses/:id/module2/learning-outcomes" element={<Module2LearningOutcomes />} />
        <Route path="courses/:id/module2/lesson1" element={<Module2Lesson1 />} />
        <Route path="courses/:id/module2/lesson2" element={<Module2Lesson2 />} />
        <Route path="courses/:id/module2/summary" element={<Module2Summary />} />
        <Route path="contact-us" element={<ContactUsPage />} />
        <Route path="about" element={<AboutUsPage />} />
        <Route path="success-stories" element={<SuccessStoriesPage />} />
        <Route path="partnerships" element={<PartnershipsPage />} />
        <Route path="donate" element={<DonatePage />} />
        <Route path="resources" element={<ResourcesPage />} />
        <Route path="certifications" element={<CertificationsPage />} />
        <Route path="certifications/template" element={<CertificateTemplatePage />} />
        <Route path="verify/:certificateCode" element={<CertificateVerificationPage />} />
        <Route
          path="community"
          element={<CommunityPage />}
        />
        <Route path="support" element={<SupportPage />} />
        <Route path="support/faq" element={<SupportFAQPage />} />
        <Route path="support/ticket" element={<SupportTicketPage />} />
        <Route path="support/booking" element={<SupportBookingPage />} />
        <Route path="support/whatsapp" element={<SupportWhatsAppPage />} />
        <Route path="terms/:sectionSlug" element={<TermsPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="privacy/:sectionSlug" element={<PrivacyPage />} />
        <Route path="cookies" element={<CookiesPage />} />
        <Route path="cookies/:sectionSlug" element={<CookiesPage />} />
        {/* Application Portal Routes */}
        <Route path="application-portal" element={<ApplicationPortal />} />
        <Route path="application-portal/login" element={<LoginPage />} />
        <Route path="application-portal/:id" element={<ApplicationDetailsPage />} />
        <Route path="application-portal/gf/home" element={<GFApplicationPortalHome />} />
        <Route path="application-portal/gf/create-account" element={<GFAccountCreateVerify />} />
        <Route path="application-portal/gf" element={<GFApplicationPortal />} />
        <Route path="application-portal/dashboard" element={<ApplicationDashboard />} />
        <Route path="recommendation/:token" element={<RecommendationPortal />} />
        <Route path="admin/dashboard" element={<AdminDashboard />} />
        {/* Women Refugee Rise Program Routes */}
        <Route path="program/women-refugee-rise/verify" element={<WRRPVerificationPage />} />
        <Route path="program/women-refugee-rise" element={<WomenRefugeeRiseProgram />} />
        <Route path="program/gvb-healing" element={<GvbHealingProgram />} />
        <Route path="program/mental-health" element={<MentalHealthPillar />} />
        <Route path="program/entrepreneurship" element={<EntrepreneurshipPillar />} />
        <Route path="program/virtual-assistant" element={<VirtualAssistantPillar />} />
        <Route path="program/application-submitted" element={<ApplicationSubmitted />} />
        <Route path="admin/programs-overview" element={<AdminProgramsOverviewPage />} />
          <Route path="admin/programs/:programId/edit" element={<AdminProgramEditPage />} />
          <Route path="coming-soon" element={<ComingSoonPage />} />
        <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="forbidden" element={<ForbiddenPage />} />
        </Route>

        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <GuestRoute>
              <SignupPage />
            </GuestRoute>
          }
        />
        <Route path="/auth" element={<Navigate to="/login" replace />} />
        <Route
          path="/auth/callback"
          element={
            <GuestRoute>
              <OAuthCallback />
            </GuestRoute>
          }
        />

        {/* Dedicated admin-only routes with highest priority */}
        <Route
          path="/admin"
          element={<ProtectedRoute allowedRoles={["admin", "owner", "manager", "content_editor", "support", "lecturer", "instructor"]} />}
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="applications" element={<AdminApplicationsPage />} />
          <Route path="ai-review" element={<Navigate to="/admin/program-keywords" replace />} />
          <Route path="program-keywords" element={<AdminProgramKeywordsPage />} />
          <Route path="admission-letter" element={<AdminAdmissionLetterPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="courses" element={<AdminCoursesPage />} />
          <Route path="courses/:courseId" element={<UnifiedCourseManagementPage />} />
          <Route path="courses/:courseId/overview" element={<CourseOverviewPage />} />
          <Route path="courses/:courseId/modules" element={<ModuleManagementPage />} />
          <Route path="lessons" element={<LessonManagement />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="quiz-policies" element={<AdminQuizPoliciesPage />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="support-tickets" element={<SupportTicketsPage />} />
          <Route path="operations" element={<AdminOperationsPage />} />
          <Route path="reports" element={<AdminReportCenterPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
          <Route path="conversation-audit" element={<AdminConversationAuditPage />} />
          <Route path="test" element={<div>Admin Test Route Works!</div>} />
          <Route path="*" element={<AdminDashboardPage />} /> {/* Fallback for admin */}
        </Route>

        {/* Admin super-route - admins can access everything */}
        <Route
          path="/admin-super"
          element={<ProtectedRoute allowedRoles={["admin", "owner"]} />}
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="programs-overview" element={<AdminProgramsOverviewPage />} />
          <Route path="applications" element={<AdminApplicationsPage />} />
          <Route path="ai-review" element={<Navigate to="/admin/program-keywords" replace />} />
          <Route path="email-templates" element={<AdminEmailTemplatesPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="courses" element={<AdminCoursesPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="quiz-policies" element={<AdminQuizPoliciesPage />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="operations" element={<AdminOperationsPage />} />
          <Route path="reports" element={<AdminReportCenterPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
          <Route path="conversation-audit" element={<AdminConversationAuditPage />} />
          <Route path="lecturer-community" element={<LecturerCommunityPage />} />
          <Route path="student-community" element={<CommunityPage />} />
          <Route path="*" element={<AdminDashboardPage />} />
        </Route>

        <Route path="/lecturer" element={<ProtectedRoute allowedRoles={["instructor", "admin"]} />}>
          <Route index element={<LecturerDashboardPage />} />
          <Route path="courses" element={<LecturerCoursesPage />} />
          <Route path="courses/new" element={<LecturerCreateCoursePage />} />
          <Route path="courses/:id/edit" element={<LecturerCreateCoursePage />} />
          <Route path="courses/:id/discussions" element={<LecturerCourseDiscussionsPage />} />
          <Route path="quiz-rules" element={<LecturerQuizRulesInfoPage />} />
          <Route path="community" element={<LecturerCommunityPage />} />
          <Route path="community/profile/:userId" element={<LecturerCommunityProfilePage />} />
          <Route path="live-discussions" element={<LiveDiscussionsPage />} />
          <Route path="profile" element={<LecturerProfilePage />} />
        </Route>

        <Route path="/student" element={<ProtectedRoute allowedRoles={["student", "admin"]} />}>
          <Route index element={<StudentDashboardPage />} />
          <Route path="courses" element={<StudentCoursesPage />} />
          <Route path="courses/:id" element={<CoursePublicDetailPage />} />
          <Route path="courses/:id/overview" element={<StudentCourseOverviewPage />} />
          <Route path="courses/:id/start" element={<CourseStartPage />} />
          <Route path="quiz-center" element={<StudentQuizCenterPage />} />
          <Route path="quiz/:courseId/rules" element={<QuizRulesPage />} />
          <Route path="quiz/:courseId/start" element={<QuizAttemptPage />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="support" element={<SupportPage />} />
          <Route path="support/faq" element={<SupportFAQPage />} />
          <Route path="support/ticket" element={<SupportTicketPage />} />
          <Route path="support/booking" element={<SupportBookingPage />} />
          <Route path="support/whatsapp" element={<SupportWhatsAppPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route path="/not-found" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </>
  );
}
