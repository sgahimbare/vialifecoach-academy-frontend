import React from 'react';
import { Link, useParams } from 'react-router-dom';
import useModuleProgress from '@/hooks/useModuleProgress';
import '@/styles/video.css';

const Module2Lesson1Video = () => {
  const { id } = useParams();
  const module2Progress = useModuleProgress(id || '', 'module2');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center mb-6">
            <Link 
              to={`/courses/${id}/modules`}
              className="text-purple-600 hover:text-purple-800 mr-4"
            >
              ← Go Back
            </Link>
            <div className="w-2 h-2 bg-purple-600 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Module 2 of 8 - Page 2 of 6</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            2.1: Hebbian Theory & Neural Paving
          </h1>
          
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-800 text-sm">
              <strong>🧠 Topic:</strong> The Physical Reality of Habitual Thought
            </p>
          </div>
        </div>

        {/* Video Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Video Lesson</h2>
          
          <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-white text-lg font-medium">Lesson 2.1 Video</p>
              <p className="text-gray-300 text-sm">Hebbian Theory & Neural Paving</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-purple-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-3">Academic Foundation</h3>
              <p className="text-gray-700 mb-4">
                Modern neuroplasticity is grounded in Hebbian Theory, which states that neural connections strengthen through repeated co-activation. 
                In applied coaching and behavioral science, this means that a so-called "limiting belief" is not merely a psychological construct—it is a 
                <strong className="text-purple-600">physically reinforced neural circuit</strong>.
              </p>
            </div>

            <div className="bg-indigo-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-indigo-900 mb-3">The Process of Neural "Paving"</h3>
              <p className="text-gray-700 mb-4">
                Each repetition of a thought pattern initiates biological reinforcement. Through 
                <strong className="text-indigo-600">myelination</strong>, a lipid-rich sheath forms around neuronal axons, 
                increasing the speed and efficiency of signal transmission.
              </p>
              
              <div className="bg-white rounded p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Functional Outcome</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">•</span>
                    <span>Frequently rehearsed negative thoughts become <strong className="text-indigo-600">high-speed neural expressways</strong></span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">•</span>
                    <span>Underused rational or self-supportive thoughts remain <strong className="text-indigo-600">slow, unstable pathways</strong></span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Table 2.1: Structural Evolution of a Thought</h3>
              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-lg overflow-hidden">
                  <thead className="bg-purple-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left">Stage of Thought</th>
                      <th className="px-4 py-3 text-left">Biological Mechanism</th>
                      <th className="px-4 py-3 text-left">Coaching Interpretation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="px-4 py-3">Initial Occurrence</td>
                      <td className="px-4 py-3">Temporary synaptic activation</td>
                      <td className="px-4 py-3">High effort, unfamiliar</td>
                    </tr>
                    <tr className="border-b bg-purple-50">
                      <td className="px-4 py-3">Repetition</td>
                      <td className="px-4 py-3">Long-Term Potentiation (LTP)</td>
                      <td className="px-4 py-3">Habit formation</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-3">Automation</td>
                      <td className="px-4 py-3">Dense myelination</td>
                      <td className="px-4 py-3">Default / autopilot thinking</td>
                    </tr>
                    <tr className="bg-indigo-50">
                      <td className="px-4 py-3">Extinction</td>
                      <td className="px-4 py-3">Synaptic pruning</td>
                      <td className="px-4 py-3">Cognitive freedom</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Key Takeaways */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Takeaways</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-3">✅ Understanding</h3>
              <p className="text-gray-700">
                Thoughts have physical reality in the brain - they're not just abstract concepts.
              </p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">🔄 Process</h3>
              <p className="text-gray-700">
                Repetition creates biological reinforcement through myelination.
              </p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-3">⚡ Efficiency</h3>
              <p className="text-gray-700">
                The brain automates frequently used pathways for cognitive efficiency.
              </p>
            </div>
            
            <div className="bg-indigo-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-indigo-900 mb-3">🎯 Application</h3>
              <p className="text-gray-700">
                We can intentionally shape our neural architecture through conscious practice.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Link 
            to={`/courses/${id}/modules`}
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            ← Go Back
          </Link>
          <div className="flex items-center space-x-3">
            {!module2Progress.isLessonCompleted('lesson1') && (
              <button
                onClick={() => module2Progress.markLessonCompleted('lesson1')}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                ✓ Mark as Complete
              </button>
            )}
            <Link 
              to={`/courses/${id}/module2/lesson1/reading`}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Continue to Reading Material →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Module2Lesson1Video;
