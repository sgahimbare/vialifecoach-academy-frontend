import React from 'react';
import { Link, useParams } from 'react-router-dom';
import useModuleProgress from '@/hooks/useModuleProgress';

const Module1LearningOutcomes = () => {
  const { id } = useParams(); // Changed from courseId to id to match route
  const module1Progress = useModuleProgress(id || '', 'module1');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center mb-6">
            <Link 
              to={`/courses/${id}/modules`}
              className="text-blue-600 hover:text-blue-800 mr-4"
            >
              ← Go Back
            </Link>
            <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Module 1 of 8 - Page 1 of 6</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            1. Learning Outcomes
          </h1>
          
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-8">
            <p className="text-green-800 font-medium mb-4">
              By the end of this module, you will be able to:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">✓</span>
                <span className="text-gray-800">
                  <strong>Define the Predictive Processing Framework</strong> and its role in negative thinking.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">✓</span>
                <span className="text-gray-800">
                  <strong>Identify the 10 Cognitive Distortions</strong> used by the "Internal Critic."
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">✓</span>
                <span className="text-gray-800">
                  <strong>Explain the 12-millisecond latency</strong> (The Amygdala Hijack).
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 mt-1">✓</span>
                <span className="text-gray-800">
                  <strong>Categorize your own Somatic Markers</strong> (physical triggers for mental stress).
                </span>
              </li>
            </ul>
          </div>

          {/* Video Placeholder */}
          <div className="bg-gray-100 rounded-lg p-8 mb-6 text-center">
            <div className="bg-gray-300 rounded-lg h-48 flex items-center justify-center mb-4">
              <svg className="w-16 h-16 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/>
              </svg>
            </div>
            <p className="text-gray-600">Learning Outcomes Overview Video</p>
            <p className="text-sm text-gray-500">Placeholder for learning outcomes explanation video</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              <strong>💡 Pro Tip:</strong> Keep these learning outcomes in mind as you progress through the module. 
              Each lesson is designed to help you master one of these key skills.
            </p>
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
            {!module1Progress.isLessonCompleted('learning-outcomes') && (
              <button
                onClick={() => module1Progress.markLessonCompleted('learning-outcomes')}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                ✓ Mark as Complete
              </button>
            )}
            <Link 
              to={`/courses/${id}/module1/lesson1/video`}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue to Lesson 1 Video →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Module1LearningOutcomes;
