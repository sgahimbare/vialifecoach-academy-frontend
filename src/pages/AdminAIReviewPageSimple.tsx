import React from "react";

export default function AdminAIReviewPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">🤖 AI Application Review</h1>
      <div className="bg-white border rounded-lg p-6 shadow">
        <h2 className="text-lg font-semibold mb-4">AI Review System</h2>
        <p className="text-gray-600 mb-4">
          Intelligent application screening and qualification assessment powered by AI
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">📋 Applications</h3>
            <p className="text-blue-700">View and manage all applications</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">🤖 AI Analysis</h3>
            <p className="text-green-700">Automated scoring and recommendations</p>
          </div>
        </div>
      </div>
    </div>
  );
}
