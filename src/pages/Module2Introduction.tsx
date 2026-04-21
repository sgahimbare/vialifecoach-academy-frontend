import React from 'react';
import { Link, useParams } from 'react-router-dom';
import useModuleProgress from '@/hooks/useModuleProgress';

const Module2Introduction = () => {
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
            <span className="text-sm text-gray-600">Module 2 of 8</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Module 2: Neural Architecture & Mechanics of Change
          </h1>
          
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-6">
            <p className="text-purple-800 text-sm">
              <strong>Area of Focus:</strong> Neuroplasticity, Cognitive Defusion, and Executive Agency
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-4">
              This module reframes personal development as a biologically grounded process of intentional brain restructuring. 
              Learners are positioned not as passive recipients of information, but as 
              <strong className="text-purple-600">active architects of their neural systems</strong>, 
              capable of redesigning habitual thought patterns through informed, deliberate practice.
            </p>
          </div>
        </div>

        {/* Module Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Module Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-purple-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-3">What You'll Learn</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span>Analyze neurobiological principles of synaptic pruning and LTP</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span>Evaluate structural consequences of repetitive negative cognition</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span>Apply cognitive defusion protocols</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span>Synthesize value-based behavioral responses</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-indigo-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-indigo-900 mb-3">Module Structure</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  <span>4 comprehensive lessons</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  <span>Interactive exercises and protocols</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  <span>Workbook integration</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  <span>Knowledge assessment</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">🧠 Neural Transformation Focus</h3>
            <p className="text-gray-700">
              This module bridges cutting-edge neuroscience with practical coaching techniques, 
              giving you the tools to literally rewire your brain for more adaptive, 
              value-aligned thinking patterns.
            </p>
          </div>
        </div>

        {/* Video Placeholder */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Module Introduction Video</h2>
          
          <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-white text-lg font-medium">Module 2 Introduction</p>
              <p className="text-gray-300 text-sm">Neural Architecture & Mechanics of Change</p>
            </div>
          </div>
          
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
            <p className="text-purple-800 text-sm">
              <strong>📖 Video Content:</strong> Comprehensive overview of neuroplasticity principles and cognitive restructuring techniques
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <div></div>
          <div className="flex items-center space-x-3">
            {!module2Progress.isLessonCompleted('introduction') && (
              <button
                onClick={() => module2Progress.markLessonCompleted('introduction')}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                ✓ Mark as Complete
              </button>
            )}
            <Link 
              to={`/courses/${id}/module2/learning-outcomes`}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Continue to Learning Outcomes →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Module2Introduction;
