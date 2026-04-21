import { useState } from "react";
import type { FormEvent } from "react";
import { Send, Mail } from "lucide-react";
import { buildApiUrl } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "react-router-dom";
import { studentService } from "@/services/studentService";

// helper to open a mailto: link via an anchor element.  Using window.location
// sometimes gets blocked or aborts script execution before React state updates.
// Programmatically clicking an <a> ensures the browser treats the action as a
// user gesture and keeps our page active.
function openMailto(to: string, subject: string, body: string) {
  const href = `mailto:${to}?subject=${subject}&body=${body}`;
  const a = document.createElement("a");
  a.href = href;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function SupportTicketForm() {
  const { accessToken } = useAuth();
  const location = useLocation();
  const isStudentBoard = location.pathname.startsWith("/student/");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("General");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = name && email && subject && message;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    
    const subjectText = `[Support Ticket – ${category}] ${subject}`;
    const bodyText =
      `Name: ${name}\nEmail: ${email}\nCategory: ${category}\n\nMessage:\n${message}`;

    // attempt to send via backend if available; fall back to mailto otherwise
    let sentViaApi = false;
    try {
      console.log('🎫 FRONTEND: Submitting support ticket...');
      console.log('🎫 FRONTEND: Is student board:', isStudentBoard);
      console.log('🎫 FRONTEND: Has access token:', !!accessToken);
      
      if (isStudentBoard && accessToken) {
        console.log('🎫 FRONTEND: Using student service...');
        await studentService.submitTicket(accessToken, {
          name,
          email,
          subject,
          message,
          topic: category,
        });
        sentViaApi = true;
        console.log('🎫 FRONTEND: Student service submission successful');
      } else {
        console.log('🎫 FRONTEND: Using public API...');
        const apiUrl = buildApiUrl("/support/ticket");
        console.log('🎫 FRONTEND: API URL:', apiUrl);
        
        const requestBody = {
          name,
          email,
          requester_name: name,
          requester_email: email,
          phone: "",
          category,
          subject,
          message
        };
        
        console.log('🎫 FRONTEND: Request body:', JSON.stringify(requestBody));
        
        // Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
        
        const resp = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        console.log('🎫 FRONTEND: Response status:', resp.status);
        console.log('🎫 FRONTEND: Response ok:', resp.ok);

        if (resp.ok) {
          const data = await resp.json();
          console.log('🎫 FRONTEND: Response data:', data);
          sentViaApi = true;
          console.log('🎫 FRONTEND: Public API submission successful');
        } else {
          const errorData = await resp.json().catch(() => ({}));
          console.error('🎫 FRONTEND: API error:', errorData);
          throw new Error(errorData.message || `Server error: ${resp.status}`);
        }
      }
    } catch (e) {
      console.error('🎫 FRONTEND: Submission error:', e);
      setError(e instanceof Error ? e.message : "Failed to submit ticket.");
    } finally {
      // Always reset submitting state
      setIsSubmitting(false);
    }

    if (!sentViaApi && !isStudentBoard) {
      console.log('🎫 FRONTEND: Falling back to mailto...');
      openMailto("support@vialifecoach.org", subjectText, bodyText);
      setError("Server unavailable, opening your email client...");
      sentViaApi = true;
    }

    if (!sentViaApi) {
      console.log('🎫 FRONTEND: No submission method worked');
      return;
    }

    console.log('🎫 FRONTEND: Ticket submitted successfully');
    setSent(true);
  }

  return (
    <section id="ticket">
      <div className={`${isStudentBoard ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700" : "bg-gray-900 bg-opacity-80 border-gray-600"} rounded-2xl border shadow-lg p-8 md:p-10`}
        style={isStudentBoard ? {} : {
          background: "linear-gradient(135deg, #1f2937 0%, #4b5563 50%, #111827 100%)"
        }}>
        <div className="mb-6">
          <h2 className={`text-2xl font-bold ${isStudentBoard ? "text-slate-100" : "text-white"}`}>Submit a Support Ticket</h2>
          <p className={`${isStudentBoard ? "text-slate-300" : "text-gray-300"} mt-1`}>
            Describe your issue in detail and our support team will respond within 24 hours.
          </p>
        </div>

        {sent ? (
          <div className="rounded-xl bg-gradient-to-br from-green-600 to-emerald-700 border border-green-500 p-6 text-center">
            <div className="text-white text-4xl mb-2">✓</div>
            <h3 className="font-semibold text-white mb-1">Ticket Submitted Successfully</h3>
            <p className="text-sm text-green-100">
              Your support request has been submitted. If your mail client opened, you
              can send the message there; otherwise our backend will process it. Our team will respond within 24 hours.
            </p>
            {error && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">{error}</p>
              </div>
            )}
            <button onClick={() => setSent(false)} className="mt-4 text-sm text-white hover:text-green-100">
              Submit another ticket
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl bg-gradient-to-br from-red-600 to-red-700 border border-red-500 p-4">
                <p className="text-sm text-white">{error}</p>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={`block text-sm font-medium ${isStudentBoard ? "text-slate-300" : "text-gray-300"} mb-1.5`}>Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent ${isStudentBoard ? "border-slate-600 bg-slate-800 text-slate-100 placeholder-slate-400" : "border-gray-600 bg-gray-800 text-white placeholder-gray-400"}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${isStudentBoard ? "text-slate-300" : "text-gray-300"} mb-1.5`}>Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent ${isStudentBoard ? "border-slate-600 bg-slate-800 text-slate-100 placeholder-slate-400" : "border-gray-600 bg-gray-800 text-white placeholder-gray-400"}`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={`block text-sm font-medium ${isStudentBoard ? "text-slate-300" : "text-gray-300"} mb-1.5`}>Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent appearance-none ${isStudentBoard ? "border-slate-600 bg-slate-700 text-slate-100" : "border-gray-600 bg-gray-800 text-white"}`}
                  style={{ 
                    backgroundColor: isStudentBoard ? '#1e293b' : '#1f2937',
                    color: isStudentBoard ? '#f1f5f9' : '#ffffff'
                  }}
                >
                  <option>General</option>
                  <option>Technical Issue</option>
                  <option>Billing &amp; Payments</option>
                  <option>Course Content</option>
                  <option>Account Access</option>
                  <option>Coaching Sessions</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium ${isStudentBoard ? "text-slate-300" : "text-gray-300"} mb-1.5`}>Subject *</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief description of your issue"
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent ${isStudentBoard ? "border-slate-600 bg-slate-700 text-slate-100" : "border-gray-600 bg-gray-800 text-white"}`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${isStudentBoard ? "text-slate-300" : "text-gray-300"} mb-1.5`}>Message *</label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please describe your issue in as much detail as possible…"
                className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none ${isStudentBoard ? "border-slate-600 bg-slate-700 text-slate-100" : "border-gray-600 bg-gray-800 text-white"}`}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className={`text-xs flex items-center gap-1 ${isStudentBoard ? "text-slate-500" : "text-gray-400"}`}>
                <Mail className="h-3.5 w-3.5" /> {isStudentBoard ? "Raises ticket inside Student Board" : "Sends to support@vialifecoach.org"}
              </p>
              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Submit Ticket
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
