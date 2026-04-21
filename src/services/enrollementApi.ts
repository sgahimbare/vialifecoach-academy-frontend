// Enrollment API service
export const enrollmentApi = {
  // Enroll a user in a course
  async enrollInCourse(courseId: string): Promise<{ success: boolean; message: string }> {
    // In a real application, this would make an API call to your backend
    // For now, we'll simulate the enrollment process
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store enrollment in localStorage for demo purposes
      const enrollments = JSON.parse(localStorage.getItem('userEnrollments') || '[]');
      
      if (!enrollments.includes(courseId)) {
        enrollments.push(courseId);
        localStorage.setItem('userEnrollments', JSON.stringify(enrollments));
      }
      
      return {
        success: true,
        message: 'Successfully enrolled in course!'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to enroll in course. Please try again.'
      };
    }
  },

  // Check if user is enrolled in a course
  async isEnrolled(courseId: string): Promise<boolean> {
    try {
      const enrollments = JSON.parse(localStorage.getItem('userEnrollments') || '[]');
      return enrollments.includes(courseId);
    } catch (error) {
      return false;
    }
  },

  // Get all enrolled courses for a user
  async getEnrolledCourses(): Promise<string[]> {
    try {
      return JSON.parse(localStorage.getItem('userEnrollments') || '[]');
    } catch (error) {
      return [];
    }
  },

  // Unenroll from a course
  async unenrollFromCourse(courseId: string): Promise<{ success: boolean; message: string }> {
    try {
      const enrollments = JSON.parse(localStorage.getItem('userEnrollments') || '[]');
      const updatedEnrollments = enrollments.filter((id: string) => id !== courseId);
      localStorage.setItem('userEnrollments', JSON.stringify(updatedEnrollments));
      
      return {
        success: true,
        message: 'Successfully unenrolled from course.'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to unenroll from course. Please try again.'
      };
    }
  }
};