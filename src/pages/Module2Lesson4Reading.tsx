import React from 'react';
import { Link, useParams } from 'react-router-dom';
import useModuleProgress from '@/hooks/useModuleProgress';

const Module2Lesson4Reading = () => {
  const { id } = useParams();
  const module2Progress = useModuleProgress(id || '', 'module2');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center mb-6">
            <Link to={`/courses/${id}/module2/lesson4/video`} className="text-purple-600 hover:text-purple-800 mr-4">← Back to Video</Link>
            <div className="w-2 h-2 bg-purple-600 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Module 2 of 8 - Page 9 of 6</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">2.4: Synaptic Pruning & Starvation Method - Reading</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Strategic Indifference Practice</h2>
            <p className="text-gray-700 mb-4">Choose one recurring negative thought. For 7 days: Do not argue with it, Do not suppress it, Observe and disengage.</p>
            <div className="bg-yellow-50 rounded-lg p-6 my-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-3">Tracking Table</h3>
              <p className="text-gray-700">Track your practice over 7 days.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <Link to={`/courses/${id}/module2/lesson4/video`} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors">← Back to Video</Link>
          <div className="flex items-center space-x-3">
            {!module2Progress.isLessonCompleted('lesson4') && (
              <button onClick={() => module2Progress.markLessonCompleted('lesson4')} className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">✓ Mark as Complete</button>
            )}
            <Link to={`/courses/${id}/module2/summary`} className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">Continue to Module Summary →</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Module2Lesson4Reading;
