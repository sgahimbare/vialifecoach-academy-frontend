// Debug script to check what's causing white page
console.log("=== WHITE PAGE DEBUG ===");
console.log("1. Checking if frontend is running...");
console.log("2. Current URL:", window.location.href);
console.log("3. User auth status:", localStorage.getItem("accessToken"));
console.log("4. React render status:", document.getElementById("root"));

// Check for errors
window.addEventListener('error', (e) => {
  console.error("JavaScript Error:", e.error);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error("Unhandled Promise Rejection:", e.reason);
});

// Check if React is mounting
setTimeout(() => {
  const root = document.getElementById("root");
  if (root) {
    console.log("5. Root element content:", root.innerHTML.length > 0 ? "Has content" : "Empty");
    if (root.innerHTML.length === 0) {
      console.log("6. Root is empty - possible React error");
    }
  } else {
    console.log("6. Root element not found");
  }
}, 3000);
