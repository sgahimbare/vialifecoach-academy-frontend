import React from 'react';
import { Link, useParams } from 'react-router-dom';
import useModuleProgress from '@/hooks/useModuleProgress';

const Module2LearningOutcomes = () => {
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
            <span className="text-sm text-gray-600">Module 2 of 8 - Page 1 of 6</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            1. Learning Outcomes
          </h1>
          
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-8">
            <p className="text-green-800 text-sm">
              <strong>🎯 By the end of this module, you will be able to:</strong>
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                🧠 Analyze Neurobiological Principles
              </h3>
              <p className="text-gray-700 mb-3">
                Understand the biological mechanisms behind thought patterns and brain plasticity.
              </p>
              <div className="bg-purple-50 rounded p-4">
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    <span><strong>Synaptic Pruning:</strong> How the brain eliminates unused neural connections</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    <span><strong>Long-Term Potentiation (LTP):</strong> How repeated thoughts strengthen neural pathways</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    <span><strong>Myelination:</strong> How practice creates faster neural highways</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                🔍 Evaluate Structural Consequences
              </h3>
              <p className="text-gray-700 mb-3">
                Assess how repetitive negative thinking physically changes brain structure.
              </p>
              <div className="bg-indigo-50 rounded p-4">
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">•</span>
                    <span>White-matter pathway development from thought repetition</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">•</span>
                    <span>Neural efficiency vs. cognitive flexibility trade-offs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">•</span>
                    <span>Biological basis of "stuck" thinking patterns</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                🎭 Apply Cognitive Defusion
              </h3>
              <p className="text-gray-700 mb-3">
                Master techniques to separate personal identity from transient mental events.
              </p>
              <div className="bg-purple-50 rounded p-4">
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    <span>Observer Protocol implementation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    <span>Linguistic re-contextualization techniques</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    <span>Psychological distance creation</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                ⚡ Synthesize Value-Based Responses
              </h3>
              <p className="text-gray-700 mb-3">
                Create behavioral responses that override automatic, survival-driven impulses.
              </p>
              <div className="bg-indigo-50 rounded p-4">
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">•</span>
                    <span>Executive agency development</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">•</span>
                    <span>Values-based decision making under pressure</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">•</span>
                    <span>Biological signal vs. conscious choice distinction</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              💡 Professional Application
            </h3>
            <p className="text-gray-700">
              These outcomes translate directly into coaching competencies, therapeutic techniques, 
              and personal development strategies grounded in modern neuroscience.
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
            {!module2Progress.isLessonCompleted('learning-outcomes') && (
              <button
                onClick={() => module2Progress.markLessonCompleted('learning-outcomes')}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                ✓ Mark as Complete
              </button>
            )}
            <Link 
              to={`/courses/${id}/module2/lesson1/video`}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Continue to Lesson 2.1 →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Module2LearningOutcomes;
