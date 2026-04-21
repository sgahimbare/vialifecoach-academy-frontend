import { useState } from "react";
import type { FormEvent } from "react";
import { Calendar, Mail } from "lucide-react";
import { buildApiUrl } from "@/lib/api";

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

export function SupportBookingForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = name && email && date && time && topic;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    
    const subjectText = `[Coaching Session Request] ${topic}`;
    const bodyText =
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "—"}\nPreferred Date: ${date}\nPreferred Time: ${time}\nTopic: ${topic}\n\nAdditional Notes:\n${message}`;

    let sentViaApi = false;
    try {
      const resp = await fetch(buildApiUrl("/support/booking"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
        name, 
        email, 
        requester_name: name, 
        requester_email: email, 
        phone, 
        date, 
        time, 
        topic, 
        message 
      }),
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.success) {
          sentViaApi = true;
        } else {
          throw new Error(data.message || "Failed to submit booking request");
        }
      } else {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${resp.status}`);
      }
    } catch (e) {
      console.warn("API submission failed, falling back to email:", e);
      // Show warning but still proceed with email fallback
      setError("Server unavailable, opening your email client...");
    }

    if (!sentViaApi) {
      openMailto("academy@vialifecoach.org", subjectText, bodyText);
    }

    setSent(true);
    setIsSubmitting(false);
  }

  return (
    <section id="booking">
      <div className="bg-gray-900 bg-opacity-80 border-gray-600 rounded-2xl border shadow-lg p-8 md:p-10"
        style={{
          background: "linear-gradient(135deg, #1f2937 0%, #4b5563 50%, #111827 100%)"
        }}>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">Book a Coaching Session</h2>
          <p className="text-gray-300 mt-1">
            Schedule a personalised one-on-one session with one of our certified life coaches.
          </p>
        </div>

        {sent ? (
          <div className="rounded-xl bg-gradient-to-br from-green-600 to-emerald-700 border border-green-500 p-6 text-center">
            <div className="text-white text-4xl mb-2">✓</div>
            <h3 className="font-semibold text-white mb-1">Booking Request Sent!</h3>
            <p className="text-sm text-green-100">
              Your booking request has been submitted. If your mail client opened, you
              can send the message there; otherwise our backend will process it.
              Our team will confirm your session within 24 hours.
            </p>
            {error && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">{error}</p>
              </div>
            )}
            <button onClick={() => setSent(false)} className="mt-4 text-sm text-white hover:text-green-100">
              Submit another request
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
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full rounded-lg border border-gray-600 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full rounded-lg border border-gray-600 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="w-full rounded-lg border border-gray-600 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Preferred Date *</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-600 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-gray-800 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Preferred Time *</label>
                <select
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full rounded-lg border border-gray-600 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent appearance-none bg-gray-800 text-white"
                  style={{ 
                    backgroundColor: '#1f2937',
                    color: '#ffffff'
                  }}
                >
                  <option value="">Select time</option>
                  <option value="9:00 AM">9:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="1:00 PM">1:00 PM</option>
                  <option value="2:00 PM">2:00 PM</option>
                  <option value="3:00 PM">3:00 PM</option>
                  <option value="4:00 PM">4:00 PM</option>
                  <option value="5:00 PM">5:00 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Session Topic *</label>
              <select
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full rounded-lg border border-gray-600 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent appearance-none bg-gray-800 text-white"
                style={{ 
                  backgroundColor: '#1f2937',
                  color: '#ffffff'
                }}
              >
                <option value="">Select a topic</option>
                <option value="Career Development">Career Development</option>
                <option value="Life Transitions">Life Transitions</option>
                <option value="Relationship Coaching">Relationship Coaching</option>
                <option value="Health & Wellness">Health & Wellness</option>
                <option value="Financial Planning">Financial Planning</option>
                <option value="Personal Growth">Personal Growth</option>
                <option value="Stress Management">Stress Management</option>
                <option value="Goal Setting">Goal Setting</option>
                <option value="Other">Other (Please specify in notes)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Additional Notes</label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Any specific goals, challenges, or questions you'd like to discuss..."
                className="w-full rounded-lg border border-gray-600 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none bg-gray-800 text-white placeholder-gray-400"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-xs flex items-center gap-1 text-gray-400">
                <Mail className="h-3.5 w-3.5" /> Sends to academy@vialifecoach.org
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
                    <Calendar className="h-4 w-4" /> Book Session
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
