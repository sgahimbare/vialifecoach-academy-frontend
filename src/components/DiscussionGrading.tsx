import { useState, useEffect } from "react";
import { Award, Users, CheckCircle, Clock, Edit3, Save } from "lucide-react";
import { courseDiscussionService, type DiscussionGrade, type DiscussionComment } from "@/services/courseDiscussionService";
import { useAuth } from "@/context/AuthContext";
import { extractApiErrorMessage } from "@/lib/apiError";

interface DiscussionGradingProps {
  discussionId: number;
  discussionTitle: string;
}

export function DiscussionGrading({ discussionId, discussionTitle }: DiscussionGradingProps) {
  const { accessToken } = useAuth();
  const [grades, setGrades] = useState<DiscussionGrade[]>([]);
  const [comments, setComments] = useState<DiscussionComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [gradingMode, setGradingMode] = useState<{ [key: number]: { grade: number; feedback: string } }>({});

  useEffect(() => {
    loadData();
  }, [discussionId]);

  async function loadData() {
    if (!accessToken) return;
    setLoading(true);
    setError("");
    try {
      const [gradesData, discussionData] = await Promise.all([
        courseDiscussionService.getDiscussionGrades(discussionId),
        courseDiscussionService.getDiscussionById(discussionId)
      ]);
      setGrades(gradesData);
      setComments(discussionData.comments || []);
      
      // Initialize grading mode with existing grades
      const initialGradingMode: { [key: number]: { grade: number; feedback: string } } = {};
      gradesData.forEach(grade => {
        initialGradingMode[grade.student_id] = {
          grade: grade.grade,
          feedback: grade.feedback || ""
        };
      });
      setGradingMode(initialGradingMode);
    } catch (e) {
      setError("Failed to load grading data.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGradeStudent(studentId: number) {
    if (!accessToken) return;
    
    const grading = gradingMode[studentId];
    if (!grading) return;

    try {
      await courseDiscussionService.gradeStudent(
        discussionId,
        studentId,
        grading.grade,
        grading.feedback
      );
      setSuccess("Student graded successfully!");
      loadData(); // Reload to show updated grades
    } catch (e) {
      setError(extractApiErrorMessage(e, "Failed to grade student."));
    }
  }

  function getParticipatingStudents() {
    const participatingStudents = new Set(
      comments.map(comment => comment.user_id)
    );
    return Array.from(participatingStudents);
  }

  function getStudentById(studentId: number) {
    return comments.find(comment => comment.user_id === studentId);
  }

  function getStudentGrade(studentId: number) {
    return grades.find(grade => grade.student_id === studentId);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-2 text-gray-600">Loading grading data...</span>
      </div>
    );
  }

  const participatingStudents = getParticipatingStudents();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Award className="h-5 w-5 mr-2" />
          Grading: {discussionTitle}
        </h3>
        <div className="flex items-center text-sm text-gray-600">
          <Users className="h-4 w-4 mr-1" />
          {participatingStudents.length} students participated
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      {/* Students List */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200/50">
          <h4 className="font-medium text-gray-900">Student Participation & Grading</h4>
        </div>
        
        {participatingStudents.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Student Participation</h4>
            <p className="text-gray-600">Students haven't participated in this discussion yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200/50">
            {participatingStudents.map(studentId => {
              const student = getStudentById(studentId);
              const existingGrade = getStudentGrade(studentId);
              const currentGrading = gradingMode[studentId] || { grade: 0, feedback: "" };

              return (
                <div key={studentId} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <span className="text-blue-600 font-medium">
                            {student?.user_name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900">{student?.user_name}</h5>
                          <p className="text-sm text-gray-600 capitalize">{student?.user_role}</p>
                        </div>
                      </div>
                      
                      {/* Participation Status */}
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                        Participated with {comments.filter(c => c.user_id === studentId).length} comments
                      </div>

                      {/* Grading Form */}
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Grade (0-100)
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={currentGrading.grade}
                              onChange={(e) => setGradingMode(prev => ({
                                ...prev,
                                [studentId]: {
                                  ...prev[studentId],
                                  grade: parseInt(e.target.value) || 0
                                }
                              }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                              placeholder="Enter grade"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Status
                            </label>
                            <div className="flex items-center">
                              {existingGrade ? (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Graded
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Pending
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Feedback
                          </label>
                          <textarea
                            value={currentGrading.feedback}
                            onChange={(e) => setGradingMode(prev => ({
                              ...prev,
                              [studentId]: {
                                ...prev[studentId],
                                feedback: e.target.value
                              }
                            }))}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Provide feedback on the student's participation..."
                          />
                        </div>

                        <div className="flex justify-end">
                          <button
                            onClick={() => handleGradeStudent(studentId)}
                            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            {existingGrade ? 'Update Grade' : 'Submit Grade'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Grade Display */}
                    {existingGrade && (
                      <div className="ml-6 text-right">
                        <div className="text-2xl font-bold text-gray-900">{existingGrade.grade}%</div>
                        {existingGrade.feedback && (
                          <p className="text-sm text-gray-600 mt-1 italic">"{existingGrade.feedback}"</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          Graded {new Date(existingGrade.graded_at).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
