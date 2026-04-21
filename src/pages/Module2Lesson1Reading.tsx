import React from 'react';
import { Link, useParams } from 'react-router-dom';
import useModuleProgress from '@/hooks/useModuleProgress';

const Module2Lesson1Reading = () => {
  const { id } = useParams();
  const module2Progress = useModuleProgress(id || '', 'module2');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center mb-6">
            <Link 
              to={`/courses/${id}/module2/lesson1/video`}
              className="text-purple-600 hover:text-purple-800 mr-4"
            >
              ← Back to Video
            </Link>
            <div className="w-2 h-2 bg-purple-600 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Module 2 of 8 - Page 3 of 6</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            2.1: Hebbian Theory & Neural Paving - Reading Material
          </h1>
          
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-6">
            <p className="text-purple-800 text-sm">
              <strong>📖 Deep Dive:</strong> Understanding the biological basis of thought patterns and neural pathway formation
            </p>
          </div>
        </div>

        {/* Reading Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">The Biological Reality of Mental Habits</h2>
              
              <p className="text-gray-700 mb-4">
                Every thought you think creates a physical pattern of neural activation. When you repeat the same type of thought repeatedly, 
                you're not just "thinking differently" - you're literally <strong className="text-purple-600">rewiring your brain</strong>.
              </p>
              
              <div className="bg-purple-50 rounded-lg p-6 my-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-3">Hebbian Theory: "Neurons That Fire Together, Wire Together"</h3>
                <p className="text-gray-700 mb-4">
                  Canadian psychologist Donald Hebb discovered that when neurons activate simultaneously, the synaptic connection 
                  between them strengthens. This principle, known as <strong className="text-purple-600">Hebbian Learning</strong>, 
                  explains how habits form at the biological level.
                </p>
                
                <blockquote className="border-l-4 border-purple-500 pl-4 italic text-gray-600 my-4">
                  "What fires together, wires together. What fires apart, wires apart." - Donald Hebb
                </blockquote>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Myelination: Creating Neural Highways</h2>
              
              <p className="text-gray-700 mb-4">
                When you repeatedly practice a thought pattern, your brain begins a process called <strong className="text-purple-600">myelination</strong>. 
                Specialized cells wrap neural axons in a fatty substance called myelin, which acts like insulation on electrical wires.
              </p>
              
              <div className="bg-indigo-50 rounded-lg p-6 my-6">
                <h3 className="text-lg font-semibold text-indigo-900 mb-3">The Speed Difference</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">•</span>
                    <span><strong>Unmyelinated pathways:</strong> 2-3 meters per second (walking speed)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">•</span>
                    <span><strong>Myelinated pathways:</strong> 100+ meters per second (high-speed train)</span>
                  </li>
                </ul>
                
                <p className="text-gray-700 mt-4">
                  This explains why negative thinking patterns feel "automatic" - they've become high-speed neural highways 
                  through repeated myelination.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Practical Implications for Personal Change</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <div className="bg-red-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-red-900 mb-3">⚠️ The Challenge</h3>
                  <p className="text-gray-700 mb-3">
                    Your negative thoughts have become superhighways in your brain. They're fast, efficient, and require 
                    minimal energy to activate.
                  </p>
                  <p className="text-gray-700">
                    Positive thoughts might be like dirt roads - slower, rougher, and requiring more conscious effort.
                  </p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">✅ The Opportunity</h3>
                  <p className="text-gray-700 mb-3">
                    Through consistent practice, you can pave new neural highways. Each repetition adds myelin, 
                    making positive thoughts faster and more automatic.
                  </p>
                  <p className="text-gray-700">
                    The brain doesn't care about content - it only cares about repetition.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Exercise: Neural Pathway Audit</h2>
              
              <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🔍 Identify Your Neural Highways</h3>
                <p className="text-gray-700 mb-4">
                  For the next 24 hours, notice which thoughts feel "automatic" vs. which require conscious effort. 
                  This will help you identify your most myelinated pathways.
                </p>
                
                <div className="bg-white rounded p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Thought Speed Classification</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="w-4 h-4 bg-green-500 rounded-full mr-3"></span>
                      <span className="text-gray-700"><strong>High-Speed Highway:</strong> Instant, automatic, no effort required</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-4 h-4 bg-yellow-500 rounded-full mr-3"></span>
                      <span className="text-gray-700"><strong>Medium-Speed Road:</strong> Some effort, familiar path</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-4 h-4 bg-red-500 rounded-full mr-3"></span>
                      <span className="text-gray-700"><strong>Dirt Path:</strong> High effort, unfamiliar, requires concentration</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Link 
            to={`/courses/${id}/module2/lesson1/video`}
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            ← Back to Video
          </Link>
          <div className="flex items-center space-x-3">
            {!module2Progress.isLessonCompleted('lesson1') && (
              <button
                onClick={() => module2Progress.markLessonCompleted('lesson1')}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                ✓ Mark as Complete
              </button>
            )}
            <Link 
              to={`/courses/${id}/module2/lesson2/video`}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Continue to Lesson 2.2 →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Module2Lesson1Reading;
