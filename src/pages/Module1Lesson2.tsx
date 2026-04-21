import React from 'react';
import { Link, useParams } from 'react-router-dom';

const Module1Lesson2 = () => {
  const { courseId } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center mb-6">
            <Link 
              to={`/courses/${courseId}/module1/lesson1`}
              className="text-blue-600 hover:text-blue-800 mr-4"
            >
              ← Back
            </Link>
            <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Module 1 of 8 - Page 3 of 6</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            3. Lesson 2: The 12-Millisecond Latency
          </h1>
          
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <h2 className="text-lg font-semibold text-red-900 mb-2">
              Topic: The Physics of the Amygdala Hijack
            </h2>
          </div>

          {/* Video Placeholder - Specific Animation */}
          <div className="bg-gray-100 rounded-lg p-8 mb-6 text-center">
            <div className="bg-gray-300 rounded-lg h-64 flex items-center justify-center mb-4">
              <svg className="w-16 h-16 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/>
              </svg>
            </div>
            <p className="text-gray-600 font-medium">12-Millisecond Latency Animation</p>
            <p className="text-sm text-gray-500 mb-2">3-minute animation showing spark traveling from Thalamus to Amygdala</p>
            <p className="text-xs text-gray-400">Developer Note: Insert animation with voiceover explaining the 12-millisecond gap</p>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                In this lesson, we explore the speed of thought. Negative thoughts often feel 
                "automatic" because, biologically, they are.
              </h3>
            </div>

            {/* The "High Road" vs. The "Low Road" */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <h3 className="text-lg font-semibold text-gray-900 p-4 bg-gray-50 border-b">
                The "High Road" vs. The "Low Road"
              </h3>
              
              <div className="p-6 space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 font-bold">12ms</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">The Low Road (The Amygdala)</h4>
                    <p className="text-gray-700 mb-2">
                      Processes information in 12ms. This is your survival instinct (Fight or Flight).
                    </p>
                    <div className="bg-red-50 border-l-4 border-red-300 p-3">
                      <p className="text-red-800 text-sm">
                        <strong>Fast & Primitive:</strong> Binary thinking - "Am I in danger?" 
                        No nuance, no context, just survival.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold">24ms</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">The High Road (Prefrontal Cortex)</h4>
                      <p className="text-gray-700 mb-2">
                        Processes information in 24ms. This is your logical, coaching brain.
                      </p>
                      <div className="bg-blue-50 border-l-4 border-blue-300 p-3">
                        <p className="text-blue-800 text-sm">
                          <strong>Slow & Sophisticated:</strong> Context, empathy, logic, 
                          long-term thinking - your inner coach.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Insight */}
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
              <h4 className="font-semibold text-yellow-900 mb-3">Course Insight:</h4>
              <p className="text-yellow-800 mb-3">
                Because the Amygdala is twice as fast, your body is flooded with stress chemicals 
                before your logic can even speak. This explains why you can't "just think positive" 
                when you are already in a state of panic.
              </p>
              
              <div className="bg-white rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-2">The Sequence:</h5>
                <ol className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center">
                    <span className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs mr-2">1</span>
                    <span>Stimulus enters brain → Amygdala (12ms) → STRESS RESPONSE</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs mr-2">2</span>
                    <span>Same stimulus reaches Cortex (24ms) → LOGIC ARRIVES</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-6 h-6 bg-gray-500 text-white rounded-full flex items-center justify-center text-xs mr-2">3</span>
                    <span>Result: Body already in panic before logic can intervene</span>
                  </li>
                </ol>
              </div>
            </div>

            {/* Visual Timeline */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Neural Response Timeline</h4>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-300"></div>
                <div className="space-y-4">
                  <div className="flex items-center ml-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                    <div>
                      <span className="font-medium">0ms</span>
                      <span className="text-gray-600 ml-2">- Stimulus received</span>
                    </div>
                  </div>
                  <div className="flex items-center ml-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                    <div>
                      <span className="font-medium">12ms</span>
                      <span className="text-gray-600 ml-2">- Amygdala responds (STRESS)</span>
                    </div>
                  </div>
                  <div className="flex items-center ml-4">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    <div>
                      <span className="font-medium">24ms</span>
                      <span className="text-gray-600 ml-2">- Cortex responds (LOGIC)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-green-800">
                <strong>🎯 Key Takeaway:</strong> The solution isn't to "think faster" but to 
                recognize the 12ms gap and learn to insert a "neural brake" before the stress response takes over.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Link 
            to={`/courses/${courseId}/module1/lesson1`}
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            ← Previous
          </Link>
          <Link 
            to={`/courses/${courseId}/module1/lesson3`}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue to Lesson 3 →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Module1Lesson2;
