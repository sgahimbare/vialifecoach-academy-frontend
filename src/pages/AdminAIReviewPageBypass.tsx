import React from "react";
import { Navigate } from "react-router-dom";

export default function AdminAIReviewPageBypass() {
  console.log("AdminAIReviewPageBypass rendering...");
  
  // Temporarily bypass authentication for testing
  const user = { role: "admin" };
  
  if (!user || user.role !== "admin") {
    console.log("Redirecting to login - user:", user);
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="admin-page admin-shell p-6">
      <h1 className="admin-title">🤖 AI Application Review (Bypass Test)</h1>
      <p className="admin-subtitle">
        This page bypasses authentication to test if routing works.
      </p>
      <div className="admin-card">
        <h2 style={{ color: "hsl(var(--foreground))", marginBottom: "10px" }}>
          ✅ Routing Test Successful
        </h2>
        <p style={{ color: "hsl(var(--muted-foreground))", marginBottom: "10px" }}>
          If you can see this, the admin routes are working correctly.
        </p>
        <div style={{ 
          backgroundColor: "hsl(var(--muted))", 
          padding: "15px", 
          borderRadius: "6px",
          marginTop: "15px"
        }}>
          <h3 style={{ color: "hsl(var(--foreground))", marginBottom: "8px" }}>
            🎯 Issue Isolation:
          </h3>
          <p style={{ color: "hsl(var(--muted-foreground))" }}>
            The white page issue was related to CSS compilation errors.
          </p>
          <p style={{ color: "hsl(var(--muted-foreground))", marginTop: "5px" }}>
            Admin theme restored to original CSS variables.
          </p>
        </div>
      </div>
    </div>
  );
}
