import React from 'react';
import { Link, useParams } from 'react-router-dom';

const Module1Lesson4 = () => {
  const { courseId } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center mb-6">
            <Link 
              to={`/courses/${courseId}/module1/lesson3`}
              className="text-blue-600 hover:text-blue-800 mr-4"
            >
              ← Back
            </Link>
            <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Module 1 of 8 - Page 5 of 6</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            5. Lesson 4: Somatic Markers & The Vagus Nerve
          </h1>
          
          <div className="bg-teal-50 border-l-4 border-teal-500 p-4 mb-6">
            <h2 className="text-lg font-semibold text-teal-900 mb-2">
              Topic: The Body-Mind Bridge
            </h2>
          </div>

          {/* Video Placeholder */}
          <div className="bg-gray-100 rounded-lg p-8 mb-6 text-center">
            <div className="bg-gray-300 rounded-lg h-64 flex items-center justify-center mb-4">
              <svg className="w-16 h-16 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/>
              </svg>
            </div>
            <p className="text-gray-600">Body Scan & Vagus Nerve Demonstration</p>
            <p className="text-sm text-gray-500">Placeholder for body scan demonstration and vagus nerve explanation video</p>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Your "thoughts" are often just a translation of your "body's tension." 
                This is known as the Somatic Marker Hypothesis.
              </h3>
            </div>

            {/* The Vagus Nerve Section */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <h3 className="text-lg font-semibold text-gray-900 p-4 bg-gray-50 border-b">
                The Vagus Nerve
              </h3>
              
              <div className="p-6">
                <div className="bg-teal-50 border-l-4 border-teal-300 p-4 mb-4">
                  <p className="text-teal-800 font-medium mb-2">
                    This nerve is the "data cable" of the body. 80% of its signals go from the Body to the Brain. 
                    If your stomach is tight, your brain invents a negative thought to explain the tightness.
                  </p>
                </div>

                {/* Visual Representation */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Signal Flow:</h4>
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                        <span className="text-orange-600 text-xs font-bold">BODY</span>
                      </div>
                      <p className="text-xs text-gray-600">Gut, Heart, Lungs</p>
                    </div>
                    <div className="flex-1 px-4">
                      <div className="h-2 bg-teal-500 rounded-full relative">
                        <div className="absolute left-0 top-0 w-4 h-4 bg-teal-600 rounded-full -mt-1"></div>
                        <div className="absolute right-0 top-0 w-4 h-4 bg-teal-600 rounded-full -mt-1"></div>
                      </div>
                      <p className="text-center text-xs text-gray-600 mt-2">80% Upward</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                        <span className="text-blue-600 text-xs font-bold">BRAIN</span>
                      </div>
                      <p className="text-xs text-gray-600">Thoughts & Emotions</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-red-50 rounded p-3">
                    <h5 className="font-medium text-red-900 mb-2">Body → Brain (80%)</h5>
                    <ul className="text-sm text-red-800 space-y-1">
                      <li>• Stomach tension → "I'm anxious"</li>
                      <li>• Heart racing → "Something's wrong"</li>
                      <li>• Shoulders tight → "I'm overwhelmed"</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 rounded p-3">
                    <h5 className="font-medium text-blue-900 mb-2">Brain → Body (20%)</h5>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Thoughts → Physical response</li>
                      <li>• Emotions → Body language</li>
                      <li>• Stress → Muscle tension</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Step */}
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
              <h4 className="font-semibold text-yellow-900 mb-3">Action Step:</h4>
              <p className="text-yellow-800 mb-4">
                To fix the thought, we must first "hack" the body's physical state.
              </p>
              
              <div className="bg-white rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-3">The Body Scan Audit:</h5>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</div>
                    <div>
                      <p className="font-medium text-gray-900">Scan Your Body</p>
                      <p className="text-sm text-gray-600">Close your eyes and mentally scan from head to toe</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</div>
                    <div>
                      <p className="font-medium text-gray-900">Identify Tension</p>
                      <p className="text-sm text-gray-600">Jaw clenched? Shoulders raised? Stomach tight?</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</div>
                    <div>
                      <p className="font-medium text-gray-900">Release & Observe</p>
                      <p className="text-sm text-gray-600">Consciously relax that area and notice thought changes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Common Somatic Markers */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Common Somatic Markers & Their Mental Stories:</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Physical Sensation</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Brain's Story</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Reality Check</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">Tight chest</td>
                      <td className="px-4 py-3 text-sm text-gray-700">"I'm having a heart attack"</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Anxiety or indigestion</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">Butterflies in stomach</td>
                      <td className="px-4 py-3 text-sm text-gray-700">"Something terrible is coming"</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Excitement or nervousness</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">Tense shoulders</td>
                      <td className="px-4 py-3 text-sm text-gray-700">"I can't handle this pressure"</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Poor posture or stress</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-green-800">
                <strong>🎯 Key Insight:</strong> Your body often knows you're stressed before your conscious mind does. 
                Learning to read and regulate your physical state gives you control over your mental state.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Link 
            to={`/courses/${courseId}/module1/lesson3`}
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            ← Previous
          </Link>
          <Link 
            to={`/courses/${courseId}/module1/summary`}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue to Module Summary →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Module1Lesson4;
