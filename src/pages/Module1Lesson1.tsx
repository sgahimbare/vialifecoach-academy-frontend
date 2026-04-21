import React from 'react';
import { Link, useParams } from 'react-router-dom';
import '../styles/video.css';

const Module1Lesson1 = () => {
  const { courseId } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center mb-6">
            <Link 
              to={`/courses/${courseId}/module1/learning-outcomes`}
              className="text-blue-600 hover:text-blue-800 mr-4"
            >
              ← Back
            </Link>
            <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Module 1 of 8 - Page 2 of 6</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            2. Lesson 1: The Brain as a Prediction Engine
          </h1>
        </div>

        {/* Video Hero Section */}
        <div className="bg-gray-900 rounded-2xl shadow-lg p-8 mb-6">
          <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-24 h-24 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14a1 1 0 00-1 1H6a1 1 0 00-1 1V5a1 1 0 00-1 1H3a1 1 0 00-1 1V0a1 1 0 00-1 1h18v18a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-16 h-16 text-white animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/>
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4 text-center">
            Predictive Processing Framework
          </h2>
          <p className="text-gray-300 text-center mb-6">
            Placeholder for brain prediction engine explanation video
          </p>
        </div>

        {/* Notes & Interactive Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            📝 Key Concepts & Notes
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Key Points */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="font-semibold text-blue-900 mb-3">
                💡 Core Concepts
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">▸</span>
                  <span>Your brain is a <strong>Simulation Machine</strong>, not a reality observer</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">▸</span>
                  <span>Uses <strong>"prior data"</strong> (memories/trauma) to predict</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">▸</span>
                  <span><strong>Prediction Error:</strong> Negative thoughts = simulation, not reality</span>
                </li>
              </ul>
            </div>

            {/* Interactive Exercise */}
            <div className="bg-green-50 rounded-lg p-6">
              <h4 className="font-semibold text-green-900 mb-3">
                🎯 Quick Exercise
              </h4>
              <div className="bg-white rounded-lg p-4">
                <p className="text-gray-800 mb-3">
                  <strong>Think about a recent negative thought you had:</strong>
                </p>
                <textarea 
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                  rows={3}
                  placeholder="Example: 'I'm going to fail this presentation...'"
                />
                <div className="mt-3">
                  <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    Analyze This Thought
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reading Material Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            📖 Reading Material
          </h3>
          
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3">
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

            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-green-800">
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
            to={`/courses/${courseId}/module1/learning-outcomes`}
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            ← Previous
          </Link>
          <Link 
            to={`/courses/${courseId}/module1/lesson2`}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue to Lesson 2 →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Module1Lesson1;
