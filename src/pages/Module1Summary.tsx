import React from 'react';
import { Link, useParams } from 'react-router-dom';
import useModuleProgress from '@/hooks/useModuleProgress';

const Module1Summary = () => {
  const { id } = useParams(); // Changed from courseId to id
  const module1Progress = useModuleProgress(id || '', 'module1');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center mb-6">
            <Link 
              to={`/courses/${id}/module1/lesson4`}
              className="text-blue-600 hover:text-blue-800 mr-4"
            >
              ← Back
            </Link>
            <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Module 1 of 8 - Page 6 of 6</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            6. Module 1 Summary
          </h1>
          
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
            <h2 className="text-lg font-semibold text-green-900 mb-2">
              🎉 Congratulations! You've completed Module 1
            </h2>
            <p className="text-green-800">
              Let's review the key concepts you've mastered about the neuroscience of negative thinking.
            </p>
          </div>

          {/* Video Placeholder */}
          <div className="bg-gray-100 rounded-lg p-8 mb-6 text-center">
            <div className="bg-gray-300 rounded-lg h-64 flex items-center justify-center mb-4">
              <svg className="w-16 h-16 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/>
              </svg>
            </div>
            <p className="text-gray-600">Module 1 Summary Recap</p>
            <p className="text-sm text-gray-500">Placeholder for module summary recap video</p>
          </div>

          {/* Key Takeaways */}
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Key Takeaways
              </h3>
              
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">The Brain Predicts</h4>
                      <p className="text-gray-700">
                        It doesn't see; it guesses. Your brain creates simulations based on past data, 
                        not current reality.
                      </p>
                      <div className="bg-blue-50 rounded p-2 mt-2">
                        <p className="text-sm text-blue-800">
                          <strong>Remember:</strong> Negative thoughts are often prediction errors, not reactions to reality.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border-l-4 border-red-500">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Speed Matters</h4>
                      <p className="text-gray-700">
                        The Amygdala (Fear) is faster than the Cortex (Logic). 
                        Your body reacts before your mind can reason.
                      </p>
                      <div className="bg-red-50 rounded p-2 mt-2">
                        <p className="text-sm text-red-800">
                          <strong>Key Fact:</strong> 12ms (fear) vs 24ms (logic) - that's why stress feels automatic.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Glitch Identification</h4>
                      <p className="text-gray-700">
                        Distortions are the specific ways our logic fails. 
                        Naming them gives us power over them.
                      </p>
                      <div className="bg-orange-50 rounded p-2 mt-2">
                        <p className="text-sm text-orange-800">
                          <strong>Top 3:</strong> Catastrophizing, All-or-Nothing, Mind Reading
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border-l-4 border-teal-500">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">4</div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">The Body Speaks</h4>
                      <p className="text-gray-700">
                        Physical tension creates mental negativity. 
                        The Vagus nerve sends 80% of signals from body to brain.
                      </p>
                      <div className="bg-teal-50 rounded p-2 mt-2">
                        <p className="text-sm text-teal-800">
                          <strong>Action:</strong> Body scan → Release tension → Mind follows
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Module Completion Quiz */}
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-4">
                📝 Quick Knowledge Check
              </h3>
              <div className="space-y-3">
                <div className="bg-white rounded p-3">
                  <p className="font-medium text-gray-900 mb-2">1. What processes information faster: Amygdala or Cortex?</p>
                  <p className="text-yellow-700 text-sm">Answer: Amygdala (12ms vs 24ms)</p>
                </div>
                <div className="bg-white rounded p-3">
                  <p className="font-medium text-gray-900 mb-2">2. What percentage of Vagus nerve signals go from body to brain?</p>
                  <p className="text-yellow-700 text-sm">Answer: 80%</p>
                </div>
                <div className="bg-white rounded p-3">
                  <p className="font-medium text-gray-900 mb-2">3. Name one cognitive distortion we covered.</p>
                  <p className="text-yellow-700 text-sm">Answer: Any from Catastrophizing, All-or-Nothing, Mind Reading, etc.</p>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-4">
                🚀 Ready for Module 2?
              </h3>
              <p className="text-green-800 mb-4">
                In Module 2, you'll learn practical techniques to apply this neuroscience knowledge 
                and begin rewiring your negative thought patterns.
              </p>
              <div className="bg-white rounded p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Coming Up Next:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• The Neural Brake Technique</li>
                  <li>• Cognitive Restructuring Methods</li>
                  <li>• Somatic Regulation Practices</li>
                  <li>• Building New Neural Pathways</li>
                </ul>
              </div>
            </div>

            {/* Certificate of Completion */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Module 1 Complete!</h4>
              <p className="text-gray-600">You've mastered the neuroscience of negative thinking</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Link 
            to={`/courses/${id}/module1/lesson4`}
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            ← Previous
          </Link>
          <div className="flex items-center space-x-3">
            {!module1Progress.isLessonCompleted('summary') && (
              <button
                onClick={() => module1Progress.markLessonCompleted('summary')}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                ✓ Mark Module as Complete
              </button>
            )}
            <Link 
              to={`/courses/${id}/modules`}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Modules →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Module1Summary;
