import React from 'react';
import { Link, useParams } from 'react-router-dom';
import useModuleProgress from '@/hooks/useModuleProgress';
import '@/styles/video.css';

const Module2Lesson2Video = () => {
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
            <span className="text-sm text-gray-600">Module 2 of 8 - Page 4 of 6</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            2.2: Cognitive Defusion — The Observer Protocol
          </h1>
          
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-6">
            <p className="text-orange-800 text-sm">
              <strong>🎭 Topic:</strong> Separating Identity from Cognition
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
              <p className="text-white text-lg font-medium">Lesson 2.2 Video</p>
              <p className="text-gray-300 text-sm">Cognitive Defusion — The Observer Protocol</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-purple-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-3">Coaching Framework</h3>
              <p className="text-gray-700 mb-4">
                Professional coaching distinguishes between <strong className="text-purple-600">the content of thought</strong> and 
                <strong className="text-purple-600">the process of thinking</strong>. Psychological distress persists when 
                individuals are <strong>fused</strong> with their thoughts—mistaking mental activity for objective truth.
              </p>
            </div>

            <div className="bg-indigo-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-indigo-900 mb-3">Technique: Linguistic Re-Contextualization</h3>
              <p className="text-gray-700 mb-4">
                The learner is guided through progressive levels of psychological distance:
              </p>
              
              <div className="space-y-4">
                <div className="bg-white rounded p-4 border-l-4 border-red-500">
                  <h4 className="font-semibold text-red-900 mb-2">Level 1 – Fusion:</h4>
                  <p className="text-gray-700 italic">"I am a failure."</p>
                  <p className="text-gray-600 text-sm">Identity is collapsed into thought.</p>
                </div>
                
                <div className="bg-white rounded p-4 border-l-4 border-yellow-500">
                  <h4 className="font-semibold text-yellow-900 mb-2">Level 2 – Awareness:</h4>
                  <p className="text-gray-700 italic">"I am having a thought that I am a failure."</p>
                  <p className="text-gray-600 text-sm">The self becomes container of thought.</p>
                </div>
                
                <div className="bg-white rounded p-4 border-l-4 border-green-500">
                  <h4 className="font-semibold text-green-900 mb-2">Level 3 – Defusion:</h4>
                  <p className="text-gray-700 italic">"I notice my mind generating a 'failure narrative' based on prior conditioning."</p>
                  <p className="text-gray-600 text-sm">The self becomes observer of cognition.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Instructional Video 2.2: "Hands as Thoughts" Metaphor</h3>
              <p className="text-gray-700">
                Instructor demonstrates cognitive fusion by obscuring vision with hands, then gradually moves them away 
                to illustrate defusion—thoughts remain present but no longer dictate perception.
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
            {!module2Progress.isLessonCompleted('lesson2') && (
              <button
                onClick={() => module2Progress.markLessonCompleted('lesson2')}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                ✓ Mark as Complete
              </button>
            )}
            <Link 
              to={`/courses/${id}/module2/lesson2/reading`}
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

export default Module2Lesson2Video;
