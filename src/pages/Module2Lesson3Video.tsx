import React from 'react';
import { Link, useParams } from 'react-router-dom';
import useModuleProgress from '@/hooks/useModuleProgress';
import '@/styles/video.css';

const Module2Lesson3Video = () => {
  const { id } = useParams();
  const module2Progress = useModuleProgress(id || '', 'module2');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center mb-6">
            <Link to={`/courses/${id}/modules`} className="text-purple-600 hover:text-purple-800 mr-4">← Go Back</Link>
            <div className="w-2 h-2 bg-purple-600 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Module 2 of 8 - Page 6 of 6</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">2.3: Executive Agency vs. Biological Noise</h1>
          <div className="bg-teal-50 border-l-4 border-teal-500 p-4 mb-6">
            <p className="text-teal-800 text-sm"><strong>⚡ Topic:</strong> The "Ghost in the Machine" Principle</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Video Lesson</h2>
          <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-white text-lg font-medium">Lesson 2.3 Video</p>
              <p className="text-gray-300 text-sm">Executive Agency vs. Biological Noise</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-purple-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-3">Conceptual Distinction</h3>
              <p className="text-gray-700">Neuroscience explains <strong>why</strong> emotional reactions arise; coaching focuses on <strong>what</strong> is done next. Automatic emotional surges are framed as <strong className="text-purple-600">biological noise</strong>—data, not directives.</p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-indigo-900 mb-3">The Three-Step Agency Override Protocol</h3>
              <ol className="space-y-3 text-gray-700">
                <li><strong>1. Identify Signal</strong> - "I am experiencing physiological anxiety."</li>
                <li><strong>2. Label Source</strong> - "This response originates from an ancient threat-detection system."</li>
                <li><strong>3. Execute Value</strong> - "Despite this signal, I choose to act in alignment with professionalism."</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <Link to={`/courses/${id}/modules`} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors">← Go Back</Link>
          <div className="flex items-center space-x-3">
            {!module2Progress.isLessonCompleted('lesson3') && (
              <button onClick={() => module2Progress.markLessonCompleted('lesson3')} className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">✓ Mark as Complete</button>
            )}
            <Link to={`/courses/${id}/module2/lesson3/reading`} className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">Continue to Reading Material →</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Module2Lesson3Video;
