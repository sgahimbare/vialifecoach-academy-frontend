import React from 'react';
import { Link, useParams } from 'react-router-dom';
import useModuleProgress from '@/hooks/useModuleProgress';

const Module2Lesson2Reading = () => {
  const { id } = useParams();
  const module2Progress = useModuleProgress(id || '', 'module2');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center mb-6">
            <Link 
              to={`/courses/${id}/module2/lesson2/video`}
              className="text-purple-600 hover:text-purple-800 mr-4"
            >
              ← Back to Video
            </Link>
            <div className="w-2 h-2 bg-purple-600 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Module 2 of 8 - Page 5 of 6</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            2.2: Cognitive Defusion — The Observer Protocol - Reading Material
          </h1>
          
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-6">
            <p className="text-purple-800 text-sm">
              <strong>📖 Deep Dive:</strong> Mastering psychological distance from thoughts
            </p>
          </div>
        </div>

        {/* Reading Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Cognitive Fusion</h2>
              
              <p className="text-gray-700 mb-4">
                <strong className="text-purple-600">Cognitive fusion</strong> occurs when we become entangled with our thoughts, 
                treating them as literal truth rather than mental events. This fusion is the primary mechanism 
                behind psychological suffering.
              </p>
              
              <div className="bg-red-50 rounded-lg p-6 my-6">
                <h3 className="text-lg font-semibold text-red-900 mb-3">Signs of Cognitive Fusion</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span>Believing thoughts are facts rather than interpretations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span>Letting thoughts dictate behavior automatically</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span>Emotional reactivity to mental content</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span>Difficulty seeing alternative perspectives</span>
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">The Observer Protocol</h2>
              
              <p className="text-gray-700 mb-4">
                The <strong className="text-purple-600">Observer Protocol</strong> creates psychological distance by 
                shifting your relationship to thoughts from "I AM" to "I NOTICE."
              </p>
              
              <div className="bg-green-50 rounded-lg p-6 my-6">
                <h3 className="text-lg font-semibold text-green-900 mb-3">Three Levels of Defusion</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Level 1: Awareness</h4>
                    <p className="text-gray-700 italic mb-2">"I am having the thought that..."</p>
                    <p className="text-gray-600 text-sm">You acknowledge the thought as a mental event</p>
                  </div>
                  
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Level 2: Curiosity</h4>
                    <p className="text-gray-700 italic mb-2">"I notice my mind is generating..."</p>
                    <p className="text-gray-600 text-sm">You become curious about the thought process</p>
                  </div>
                  
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Level 3: Observation</h4>
                    <p className="text-gray-700 italic mb-2">"I observe the experience of..."</p>
                    <p className="text-gray-600 text-sm">You witness thoughts as passing phenomena</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Practical Exercise: The Hands Metaphor</h2>
              
              <div className="bg-indigo-50 rounded-lg p-6 my-6">
                <h3 className="text-lg font-semibold text-indigo-900 mb-3">🤲 Hands as Thoughts Demonstration</h3>
                <p className="text-gray-700 mb-4">
                  Hold your hands directly in front of your eyes, blocking your vision. This represents 
                  <strong className="text-indigo-600">cognitive fusion</strong> - thoughts are so close they block everything else.
                </p>
                
                <ol className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">1.</span>
                    <span>Notice how completely your vision is obscured</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">2.</span>
                    <span>Slowly move hands away from your face</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">3.</span>
                    <span>Observe that your hands (thoughts) are still there, but no longer blocking your view</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">4.</span>
                    <span>You can now see around them, choosing where to focus your attention</span>
                  </li>
                </ol>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Daily Practice Integration</h2>
              
              <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🔄 5-Minute Daily Defusion Practice</h3>
                
                <div className="space-y-4">
                  <div className="bg-white rounded p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Step 1: Notice</h4>
                    <p className="text-gray-700">Identify a strong thought or emotion present right now</p>
                  </div>
                  
                  <div className="bg-white rounded p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Step 2: Label</h4>
                    <p className="text-gray-700">Say silently: "I'm having the thought that..." or "I'm noticing the feeling of..."</p>
                  </div>
                  
                  <div className="bg-white rounded p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Step 3: Observe</h4>
                    <p className="text-gray-700">Watch the thought/feeling as a passing experience, like clouds in the sky</p>
                  </div>
                  
                  <div className="bg-white rounded p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Step 4: Return</h4>
                    <p className="text-gray-700">Gently bring attention back to your present-moment activity</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Link 
            to={`/courses/${id}/module2/lesson2/video`}
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            ← Back to Video
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
              to={`/courses/${id}/module2/lesson3/video`}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Continue to Lesson 2.3 →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Module2Lesson2Reading;
