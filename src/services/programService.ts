import { apiRequest } from "@/lib/api";

export interface ProgramPillar {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  duration: string;
  status: 'locked' | 'available' | 'completed';
  modules: ProgramModule[];
}

export interface ProgramModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  lessons: number;
  completed: boolean;
  topics: string[];
  order: number;
}

export interface UserProgramProgress {
  currentPillar: number;
  completedPillars: string[];
  enrolledDate: string;
  estimatedCompletion: string;
  totalProgress: number;
}

export interface ProgramEnrollment {
  userId: string;
  programId: string;
  enrolledDate: string;
  currentPillar: string;
  status: 'active' | 'completed' | 'paused';
}

class ProgramService {
  // Program Overview
  async getProgramOverview() {
    const response = await apiRequest('/program/women-refugee-rise', {});
    return response;
  }

  // Pillar Management
  async getAllPillars() {
    const response = await apiRequest('/program/pillars', {});
    return response;
  }

  async getPillarById(pillarId: string) {
    const response = await apiRequest(`/program/pillars/${pillarId}`, {});
    return response;
  }

  // Module Management
  async getPillarModules(pillarId: string) {
    const response = await apiRequest(`/program/pillars/${pillarId}/modules`, {});
    return response;
  }

  async getModuleById(pillarId: string, moduleId: string) {
    const response = await apiRequest(`/program/pillars/${pillarId}/modules/${moduleId}`, {});
    return response;
  }

  // User Progress
  async getUserProgress(userId: string) {
    const response = await apiRequest(`/program/progress/${userId}`, {});
    return response;
  }

  async updateUserProgress(userId: string, progress: Partial<UserProgramProgress>) {
    const response = await apiRequest(`/program/progress/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(progress)
    });
    return response;
  }

  // Enrollment Management
  async enrollInProgram(userId: string) {
    const response = await apiRequest('/program/enroll', {
      method: 'POST',
      body: JSON.stringify({ userId })
    });
    return response;
  }

  async completePillar(userId: string, pillarId: string) {
    const response = await apiRequest(`/program/complete-pillar`, {
      method: 'POST',
      body: JSON.stringify({ userId, pillarId })
    });
    return response;
  }

  async completeModule(userId: string, pillarId: string, moduleId: string) {
    const response = await apiRequest(`/program/complete-module`, {
      method: 'POST',
      body: JSON.stringify({ userId, pillarId, moduleId })
    });
    return response;
  }

  // Community and Support
  async getPeerSupportGroups(pillarId: string) {
    const response = await apiRequest(`/program/support-groups/${pillarId}`, {});
    return response;
  }

  async getSuccessStories() {
    const response = await apiRequest('/program/success-stories', {});
    return response;
  }

  // Assessments and Progress Tracking
  async getInitialAssessment() {
    const response = await apiRequest('/program/assessment', {});
    return response;
  }

  async submitAssessment(userId: string, assessmentData: any) {
    const response = await apiRequest(`/program/assessment`, {
      method: 'POST',
      body: JSON.stringify({ userId, ...assessmentData })
    });
    return response;
  }

  // Resources and Materials
  async getPillarResources(pillarId: string) {
    const response = await apiRequest(`/program/pillars/${pillarId}/resources`, {});
    return response;
  }

  async getModuleResources(pillarId: string, moduleId: string) {
    const response = await apiRequest(`/program/pillars/${pillarId}/modules/${moduleId}/resources`, {});
    return response;
  }

  // Mentorship
  async getAvailableMentors(pillarId: string) {
    const response = await apiRequest(`/program/mentors/${pillarId}`, {});
    return response;
  }

  async requestMentorship(userId: string, mentorId: string) {
    const response = await apiRequest('/program/mentorship', {
      method: 'POST',
      body: JSON.stringify({ userId, mentorId })
    });
    return response;
  }

  // Certificates
  async generatePillarCertificate(userId: string, pillarId: string) {
    const response = await apiRequest(`/program/certificate/pillar`, {
      method: 'POST',
      body: JSON.stringify({ userId, pillarId })
    });
    return response;
  }

  async generateProgramCertificate(userId: string) {
    const response = await apiRequest('/program/certificate/program', {
      method: 'POST',
      body: JSON.stringify({ userId })
    });
    return response;
  }

  // Analytics and Reporting
  async getProgramAnalytics() {
    const response = await apiRequest('/program/analytics', {});
    return response;
  }

  async getUserAnalytics(userId: string) {
    const response = await apiRequest(`/program/analytics/${userId}`, {});
    return response;
  }
}

export const programService = new ProgramService();
