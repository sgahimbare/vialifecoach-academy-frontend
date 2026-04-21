import React from "react";

export default function TestAdminPage() {
  console.log("TestAdminPage rendering...");
  
  return (
    <div style={{ padding: "20px", backgroundColor: "#f0f0f0", minHeight: "100vh" }}>
      <h1 style={{ color: "#333", fontSize: "24px", marginBottom: "20px" }}>
        🧪 Test Admin Page
      </h1>
      <p style={{ color: "#666", fontSize: "16px" }}>
        If you can see this page, the basic routing is working.
      </p>
      <div style={{ 
        backgroundColor: "#fff", 
        padding: "20px", 
        borderRadius: "8px", 
        border: "1px solid #ddd" 
      }}>
        <h2 style={{ color: "#1e3a8a", marginBottom: "10px" }}>
          AI Review System Test
        </h2>
        <p style={{ color: "#666" }}>
          This is a test to verify the admin routes are working.
        </p>
      </div>
    </div>
  );
}
