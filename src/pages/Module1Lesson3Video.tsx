import React from 'react';
import { Link, useParams } from 'react-router-dom';
import '../styles/video.css';

const Module1Lesson3Video = () => {
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
            <span className="text-sm text-gray-600">Module 1 of 8 - Page 4 of 6</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            4. Lesson 3: Mapping Cognitive Distortions
          </h1>
          
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-6">
            <h2 className="text-lg font-semibold text-orange-900 mb-2">
              Topic: The 10 "Mental Glitches"
            </h2>
            <p className="text-orange-800">
              Identifying the specific bugs in your thinking patterns
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
            Cognitive Distortions Explained
          </h2>
          <p className="text-gray-300 text-center mb-4">
            Placeholder for cognitive distortions explanation video with examples
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
              Duration: ~10 minutes
            </div>
          </div>
        </div>

        {/* Quick Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            📋 Quick Summary
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-orange-50 rounded-lg p-4">
              <h4 className="font-semibold text-orange-900 mb-2">
                🐛 The Problem
              </h4>
              <p className="text-sm text-orange-800">
                Your brain has "software glitches" that distort reality
              </p>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">
                🔍 The Solution
              </h4>
              <p className="text-sm text-yellow-800">
                Name the distortion to gain power over it
              </p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">
                🎯 Top 3
              </h4>
              <p className="text-sm text-green-800">
                Catastrophizing, All-or-Nothing, Mind Reading
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
            to={`/courses/${id}/module1/lesson3/reading`}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue to Reading Material →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Module1Lesson3Video;
