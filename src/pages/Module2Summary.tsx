import React from 'react';
import { Link, useParams } from 'react-router-dom';
import useModuleProgress from '@/hooks/useModuleProgress';

const Module2Summary = () => {
  const { id } = useParams();
  const module2Progress = useModuleProgress(id || '', 'module2');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center mb-6">
            <Link to={`/courses/${id}/module2/lesson4`} className="text-purple-600 hover:text-purple-800 mr-4">← Back</Link>
            <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Module 2 of 8 - Page 10 of 10</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">6. Module 2 Summary & Assessment</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="space-y-8">
            <div className="bg-green-50 rounded-lg p-6">
              <h2 className="text-xl font-bold text-green-900 mb-4">Key Takeaways</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Brain structure reflects repeated cognitive behavior</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Cognitive defusion separates identity from automatic mental content</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Executive agency enables values-based action beyond survival reflexes</span>
                </li>
              </ul>
            </div>

            <div className="bg-purple-50 rounded-lg p-6">
              <h2 className="text-xl font-bold text-purple-900 mb-4">Knowledge Check — Quiz 2</h2>
              <ol className="space-y-4 text-gray-700">
                <li>
                  <strong>1. What role does myelination play in reinforcing habitual negative thinking?</strong>
                  <p className="text-gray-600 mt-2">Answer: Myelination creates faster, more efficient neural pathways for frequently used thoughts</p>
                </li>
                <li>
                  <strong>2. Define cognitive fusion using your own words.</strong>
                  <p className="text-gray-600 mt-2">Answer: When we become entangled with thoughts, treating them as literal truth rather than mental events</p>
                </li>
                <li>
                  <strong>3. Explain how synaptic pruning contributes to long-term dissolution of limiting beliefs.</strong>
                  <p className="text-gray-600 mt-2">Answer: Unused neural connections are gradually eliminated, weakening old thought patterns</p>
                </li>
              </ol>
            </div>

            <div className="bg-indigo-50 rounded-lg p-6">
              <h2 className="text-xl font-bold text-indigo-900 mb-4">🚀 Ready for Module 3?</h2>
              <p className="text-indigo-800 mb-4">
                In Module 3, you'll learn practical techniques to apply this neuroscience knowledge 
                and begin rewiring your negative thought patterns.
              </p>
              <div className="bg-white rounded p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Coming Up Next:</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Advanced Cognitive Restructuring Methods</li>
                  <li>• Somatic Regulation Practices</li>
                  <li>• Building New Neural Pathways</li>
                  <li>• Integration with Daily Life</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <Link to={`/courses/${id}/module2/lesson4`} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors">← Previous</Link>
          <div className="flex items-center space-x-3">
            {!module2Progress.isLessonCompleted('summary') && (
              <button onClick={() => module2Progress.markLessonCompleted('summary')} className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">✓ Mark Module as Complete</button>
            )}
            <Link to={`/courses/${id}/modules`} className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">Back to Modules →</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Module2Summary;
