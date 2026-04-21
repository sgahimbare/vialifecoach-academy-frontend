import React from 'react';
import { Link, useParams } from 'react-router-dom';
import '../styles/video.css';

const Module1Lesson2Video = () => {
  const { id } = useParams(); // Changed from courseId to id

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center mb-6">
            <Link 
              to={`/courses/${id}/modules`}
              className="text-blue-600 hover:text-blue-800 mr-4"
            >
              ← Go Back
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
            <p className="text-red-800">
              Understanding why negative thoughts feel automatic
            </p>
          </div>
        </div>

        {/* Video Hero Section */}
        <div className="bg-gray-900 rounded-2xl shadow-lg p-8 mb-6">
          <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center mb-6">
            <svg className="w-24 h-24 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14a1 1 0 00-1 1H6a1 1 0 00-1 1V5a1 1 0 00-1 1H3a1 1 0 00-1 1V0a1 1 0 00-1 1h18v18a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-16 h-16 text-white animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/>
              </svg>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4 text-center">
            12-Millisecond Latency Animation
          </h2>
          <p className="text-gray-300 text-center mb-4">
            3-minute animation showing spark traveling from Thalamus to Amygdala
          </p>
          <p className="text-gray-400 text-sm text-center">
            Developer Note: Insert animation with voiceover explaining the 12-millisecond gap
          </p>
          
          {/* Video Controls */}
          <div className="flex items-center justify-center space-x-4">
            <button className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600">
              <svg className="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/>
              </svg>
              Play
            </button>
            <div className="text-gray-400 text-sm">
              Duration: ~3 minutes
            </div>
          </div>
        </div>

        {/* Quick Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            📋 Quick Summary
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-50 rounded-lg p-4">
              <h4 className="font-semibold text-red-900 mb-2">
                ⚡ Key Speed
              </h4>
              <p className="text-sm text-red-800">
                Amygdala: 12ms (Fast)<br/>
                Cortex: 24ms (Slow)
              </p>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">
                🧠 The Problem
              </h4>
              <p className="text-sm text-yellow-800">
                Fear arrives twice as fast as logic
              </p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">
                🎯 Solution
              </h4>
              <p className="text-sm text-green-800">
                Insert "neural brake" before stress response
              </p>
            </div>
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
          <Link 
            to={`/courses/${id}/module1/lesson2/reading`}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue to Reading Material →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Module1Lesson2Video;
