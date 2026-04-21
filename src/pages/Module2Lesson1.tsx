import React from 'react';
import { Link, useParams } from 'react-router-dom';
import useModuleProgress from '@/hooks/useModuleProgress';

const Module2Lesson1 = () => {
  const { id } = useParams();
  const module2Progress = useModuleProgress(id || '', 'module2');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center mb-6">
            <Link 
              to={`/courses/${id}/module2/learning-outcomes`}
              className="text-purple-600 hover:text-purple-800 mr-4"
            >
              ← Back
            </Link>
            <div className="w-2 h-2 bg-purple-600 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Module 2 of 8 - Page 3 of 6</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Lesson 2.1: Core Beliefs and Internal Scripts
          </h1>
          
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-6">
            <h2 className="text-lg font-semibold text-purple-900 mb-2">
              Conceptual Overview
            </h2>
            <p className="text-purple-800">
              Negative thoughts do not emerge randomly. They arise from cognitive schemas—deeply embedded belief systems that organize perception and meaning. This lesson introduces core beliefs as the foundational structures of negative thinking and explains how those beliefs generate internal scripts that shape daily cognition.
            </p>
          </div>
        </div>

        {/* Video Hero Section */}
        <div className="bg-gray-900 rounded-2xl shadow-lg p-8 mb-6">
          <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center mb-4">
            <div className="text-center">
              <svg className="w-16 h-16 text-white animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/>
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4 text-center">
            Core Beliefs and Internal Scripts
          </h2>
          <p className="text-gray-300 text-center mb-6">
            Understanding the foundational structures that generate negative thinking patterns
          </p>
        </div>

        {/* Notes & Interactive Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            📝 Key Concepts & Notes
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Key Points */}
            <div className="bg-purple-50 rounded-lg p-6">
              <h4 className="font-semibold text-purple-900 mb-3">
                💡 Core Concepts
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">▸</span>
                  <span>Core beliefs are global assumptions about self, others, and world</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">▸</span>
                  <span>Internal scripts are moment-to-moment expressions of beliefs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">▸</span>
                  <span>Beliefs feel "obvious" due to reinforcement and familiarity</span>
                </li>
              </ul>
            </div>

            {/* Interactive Exercise */}
            <div className="bg-indigo-50 rounded-lg p-6">
              <h4 className="font-semibold text-indigo-900 mb-3">
                🎯 Quick Exercise
              </h4>
              <div className="bg-white rounded-lg p-4">
                <p className="text-gray-800 mb-3">
                  <strong>Identify a core belief:</strong>
                </p>
                <textarea 
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                  rows={3}
                  placeholder="Example: 'I am not good enough' or 'People will reject me'"
                />
                <div className="mt-3">
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                    Analyze This Belief
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Link 
            to={`/courses/${id}/module2/learning-outcomes`}
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            ← Previous
          </Link>
          <div className="flex items-center space-x-3">
            {!module2Progress.isLessonCompleted('lesson2.1') && (
              <button
                onClick={() => module2Progress.markLessonCompleted('lesson2.1')}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                ✓ Mark as Complete
              </button>
            )}
            <Link 
              to={`/courses/${id}/module2/lesson2`}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Continue to Lesson 2.2 →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Module2Lesson1;
