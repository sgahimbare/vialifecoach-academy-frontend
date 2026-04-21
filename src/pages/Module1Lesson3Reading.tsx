import React from 'react';
import { Link, useParams } from 'react-router-dom';
import useModuleProgress from '@/hooks/useModuleProgress';

const Module1Lesson3Reading = () => {
  const { id } = useParams(); // Changed from courseId to id
  const module1Progress = useModuleProgress(id || '', 'module1');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center mb-6">
            <Link 
              to={`/courses/${id}/module1/lesson3/video`}
              className="text-blue-600 hover:text-blue-800 mr-4"
            >
              ← Back to Video
            </Link>
            <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Module 1 of 8 - Page 4 of 6</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            4. Lesson 3: Mapping Cognitive Distortions
          </h1>
          
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-6">
            <h2 className="text-lg font-semibold text-orange-900 mb-2">
              Topic: The 10 "Mental Glitches"
            </h2>
            <p className="text-orange-800">
              Reading Material & Detailed Content
            </p>
          </div>
        </div>

        {/* Reading Material Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            📖 Reading Material
          </h3>
          
          <div className="space-y-8">
            {/* Main Content */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">
                To "rewire" the brain, we must identify the specific "bugs" in the software. 
                Alison students should familiarize themselves with these primary distortions:
              </h4>
            </div>

            {/* Distortion Identification Matrix Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <h4 className="text-lg font-semibold text-gray-900 p-4 bg-gray-50 border-b">
                Distortion Identification Matrix
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-orange-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Distortion Type</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Description</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Internal Dialogue Example</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium bg-red-50">Catastrophizing</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Expecting the worst-case scenario.</td>
                      <td className="px-4 py-3 text-sm text-gray-700 italic">"I missed the deadline, now I'll be homeless."</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium bg-yellow-50">All-or-Nothing Thinking</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Viewing life in black and white (Success vs. Failure).</td>
                      <td className="px-4 py-3 text-sm text-gray-700 italic">"If I'm not the best, I'm the worst."</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium bg-blue-50">Personalization</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Blaming yourself for events outside your control.</td>
                      <td className="px-4 py-3 text-sm text-gray-700 italic">"They're laughing, they must be mocking me."</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium bg-green-50">Mind Reading</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Assuming you know others' negative thoughts without proof.</td>
                      <td className="px-4 py-3 text-sm text-gray-700 italic">"He didn't text back, he must be angry with me."</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium bg-purple-50">The Mental Filter</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Obsessing over one negative detail while ignoring 99 positives.</td>
                      <td className="px-4 py-3 text-sm text-gray-700 italic">"The party was a failure because the cake was dry."</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Additional 7 Distortions */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6">
              <h4 className="font-semibold text-blue-900 mb-3">
                Additional 7 Distortions (Detailed in Reading Material):
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white rounded p-3">
                  <span className="font-medium text-gray-900">Overgeneralization:</span>
                  <p className="text-sm text-gray-600">One negative event = always negative</p>
                </div>
                <div className="bg-white rounded p-3">
                  <span className="font-medium text-gray-900">Discounting the Positive:</span>
                  <p className="text-sm text-gray-600">Rejecting positive experiences</p>
                </div>
                <div className="bg-white rounded p-3">
                  <span className="font-medium text-gray-900">Should Statements:</span>
                  <p className="text-sm text-gray-600">Using "should" to motivate</p>
                </div>
                <div className="bg-white rounded p-3">
                  <span className="font-medium text-gray-900">Labeling:</span>
                  <p className="text-sm text-gray-600">Extreme self-criticism</p>
                </div>
                <div className="bg-white rounded p-3">
                  <span className="font-medium text-gray-900">Emotional Reasoning:</span>
                  <p className="text-sm text-gray-600">"I feel it, therefore it must be true"</p>
                </div>
                <div className="bg-white rounded p-3">
                  <span className="font-medium text-gray-900">Fortune Telling:</span>
                  <p className="text-sm text-gray-600">Predicting negative outcomes</p>
                </div>
                <div className="bg-white rounded p-3">
                  <span className="font-medium text-gray-900">Magnification/Minimization:</span>
                  <p className="text-sm text-gray-600">Exaggerating negatives, minimizing positives</p>
                </div>
              </div>
            </div>

            {/* Interactive Exercise */}
            <div className="bg-green-50 rounded-lg p-6">
              <h4 className="font-semibold text-green-900 mb-3">🎯 Spot the Distortion Exercise:</h4>
              <div className="space-y-3">
                <div className="bg-white rounded p-4">
                  <p className="text-gray-800 mb-2">
                    <strong>Scenario:</strong> "My boss didn't smile at me this morning."
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Potential Distorted Thought:</strong> "She must think I'm doing a terrible job. 
                    I'm probably going to get fired."
                  </p>
                  <p className="text-green-700 font-medium">
                    <strong>Distortion:</strong> Mind Reading + Catastrophizing
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-yellow-800">
                <strong>💡 Key Insight:</strong> Recognizing these patterns is the first step. 
                Once you can name the distortion, you can challenge it with logic and evidence.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Link 
            to={`/courses/${id}/module1/lesson3/video`}
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            ← Back to Video
          </Link>
          <div className="flex items-center space-x-3">
            {!module1Progress.isLessonCompleted('lesson3') && (
              <button
                onClick={() => module1Progress.markLessonCompleted('lesson3')}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                ✓ Mark as Complete
              </button>
            )}
            <Link 
              to={`/courses/${id}/module1/lesson4/video`}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue to Lesson 4 →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Module1Lesson3Reading;
