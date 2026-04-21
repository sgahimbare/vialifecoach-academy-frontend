import React, { useState, useEffect } from 'react';
import { apiRequest } from '../lib/api';

export default function TestPage() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    testAPI();
  }, []);

  const testAPI = async () => {
    try {
      console.log('Testing API call...');
      const response = await apiRequest('/courses/1');
      console.log('API Response:', response);
      setMessage('API call successful!');
      setError('');
    } catch (err: any) {
      console.error('API Error:', err);
      setError(err.message || 'Unknown error');
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API Test Page</h1>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <button
            onClick={testAPI}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Test API Call
          </button>
          
          {message && (
            <div className="mt-4 p-4 bg-green-100 text-green-800 rounded">
              <strong>Success:</strong> {message}
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-800 rounded">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
