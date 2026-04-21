import React from 'react';
import { Link, useParams } from 'react-router-dom';
import useModuleProgress from '@/hooks/useModuleProgress';

const Module1Introduction = () => {
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
            <span className="text-sm text-gray-600">Module 1 of 8</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Module 1: The Neuroscience of Awareness
          </h1>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              Section 1: Identifying the Biological Mechanics of Negative Thought
            </h2>
            <p className="text-blue-800">
              Understanding the fundamental neurological processes that drive negative thinking patterns
            </p>
          </div>

          {/* Video Placeholder */}
          <div className="bg-gray-100 rounded-lg p-8 mb-6 text-center">
            <div className="bg-gray-300 rounded-lg h-64 flex items-center justify-center mb-4">
              <svg className="w-16 h-16 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/>
              </svg>
            </div>
            <p className="text-gray-600">Module Introduction Video</p>
            <p className="text-sm text-gray-500">Placeholder for course introduction video</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <div></div>
          <div className="flex items-center space-x-3">
            {!module1Progress.isLessonCompleted('introduction') && (
              <button
                onClick={() => module1Progress.markLessonCompleted('introduction')}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                ✓ Mark as Complete
              </button>
            )}
            <Link 
              to={`/courses/${id}/module1/learning-outcomes`}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue to Learning Outcomes →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Module1Introduction;
