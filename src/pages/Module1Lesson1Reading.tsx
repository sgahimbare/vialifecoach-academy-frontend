import React from 'react';
import { Link, useParams } from 'react-router-dom';
import useModuleProgress from '@/hooks/useModuleProgress';

const Module1Lesson1Reading = () => {
  const { id } = useParams(); // Changed from courseId to id
  const module1Progress = useModuleProgress(id || '', 'module1');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center mb-6">
            <Link 
              to={`/courses/${id}/module1/lesson1/video`}
              className="text-blue-600 hover:text-blue-800 mr-4"
            >
              ← Back to Video
            </Link>
            <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Module 1 of 8 - Page 2 of 6</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            2. Lesson 1: The Brain as a Prediction Engine
          </h1>
          
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-6">
            <h2 className="text-lg font-semibold text-purple-900 mb-2">
              Topic: Predictive Processing
            </h2>
            <p className="text-purple-800">
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
                Understanding the Predictive Processing Framework
              </h4>
              <p className="text-gray-700 mb-4">
                Contrary to popular belief, your brain does not perceive reality in real-time. 
                Instead, it functions as a Simulation Machine. Key Concept:
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                <h5 className="font-semibold text-blue-900 mb-2">Key Concept:</h5>
                <p className="text-blue-800">
                  Your brain lives in a dark, bony box (the skull). It uses "prior data" 
                  (memories/trauma) to predict what is happening in the outside world. If your "prior data" is negative, 
                  your brain projects a negative simulation onto your current environment.
                </p>
              </div>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                <h5 className="font-semibold text-yellow-900 mb-2">Why this matters:</h5>
                <p className="text-yellow-800">
                  Negative thinking is often a Prediction Error. You aren't seeing a "bad day"; 
                  you are seeing a brain that is predicting a bad day based on yesterday's data.
                </p>
              </div>
            </div>

            {/* Reactive vs Predictive Thinking Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <h4 className="text-lg font-semibold text-gray-900 p-4 bg-gray-50 border-b">
                Comparison Table: Reactive vs. Predictive Thinking
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Feature</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Reactive Brain (Old Model)</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Predictive Brain (The Truth)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">Primary Goal</td>
                      <td className="px-4 py-3 text-sm text-gray-700">To see the world as it is.</td>
                      <td className="px-4 py-3 text-sm text-gray-700">To survive by guessing what happens next.</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">Source of Truth</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Current sensory input (Eyes/Ears).</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Past Data (Memories/Trauma).</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">Negative Thought</td>
                      <td className="px-4 py-3 text-sm text-gray-700">A response to a bad event.</td>
                      <td className="px-4 py-3 text-sm text-gray-700">A pre-emptive simulation to avoid surprise.</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">Change Strategy</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Try to change the world.</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Update the "Prior Data" (Rewiring).</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Key Insights */}
            <div className="bg-green-50 rounded-lg p-6">
              <h4 className="font-semibold text-green-900 mb-4">
                💡 Key Insights & Applications
              </h4>
              <div className="space-y-3">
                <div className="bg-white rounded p-4">
                  <h5 className="font-medium text-gray-900 mb-2">1. The Simulation Reality</h5>
                  <p className="text-gray-700">
                    Your brain creates a "best guess" simulation of reality based on past experiences. 
                    This simulation can be accurate or completely wrong.
                  </p>
                </div>
                <div className="bg-white rounded p-4">
                  <h5 className="font-medium text-gray-900 mb-2">2. The Prediction Error</h5>
                  <p className="text-gray-700">
                    When your brain's prediction doesn't match reality, you experience cognitive dissonance. 
                    This often manifests as anxiety or confusion.
                  </p>
                </div>
                <div className="bg-white rounded p-4">
                  <h5 className="font-medium text-gray-900 mb-2">3. The Rewiring Opportunity</h5>
                  <p className="text-gray-700">
                    By updating your "prior data" with new, positive experiences, 
                    you can change your brain's predictions and thus your reality.
                  </p>
                </div>
              </div>
            </div>

            {/* Practical Exercise */}
            <div className="bg-orange-50 rounded-lg p-6">
              <h4 className="font-semibold text-orange-900 mb-4">
                🎯 Practical Exercise: Thought Analysis
              </h4>
              <div className="bg-white rounded-lg p-4">
                <p className="text-gray-800 mb-4">
                  <strong>Instructions:</strong> Think about a recent negative thought and analyze it using the predictive framework:
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      1. What was the negative thought?
                    </label>
                    <textarea 
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                      rows={2}
                      placeholder="Example: 'I'm going to fail this presentation...'"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      2. What past experience might be informing this prediction?
                    </label>
                    <textarea 
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                      rows={2}
                      placeholder="Example: 'I messed up a presentation last year...'"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      3. What's a more accurate prediction based on current evidence?
                    </label>
                    <textarea 
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                      rows={2}
                      placeholder="Example: 'I've practiced and prepared well, so I'll likely do fine...'"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-blue-800">
                <strong>💡 Key Insight:</strong> Understanding that your brain is a prediction engine 
                is the first step to rewiring negative thought patterns. You're not reacting to reality— 
                you're reacting to your brain's prediction of reality.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Link 
            to={`/courses/${id}/module1/lesson1/video`}
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            ← Back to Video
          </Link>
          <div className="flex items-center space-x-3">
            {!module1Progress.isLessonCompleted('lesson1') && (
              <button
                onClick={() => module1Progress.markLessonCompleted('lesson1')}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                ✓ Mark as Complete
              </button>
            )}
            <Link 
              to={`/courses/${id}/module1/lesson2/video`}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue to Lesson 2 →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Module1Lesson1Reading;
