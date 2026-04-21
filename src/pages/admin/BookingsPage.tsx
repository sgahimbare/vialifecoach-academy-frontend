import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/toast";
import { apiRequest } from "@/lib/api";
import { Calendar, Clock, User, AlertCircle, CheckCircle, Filter, RefreshCw, Reply, ArrowLeft, Ticket, ExternalLink } from "lucide-react";

interface BookingTicket {
  id: number;
  subject: string;
  message: string;
  status: "open" | "in_progress" | "closed";
  priority: "low" | "normal" | "high" | "urgent";
  requester_name: string;
  requester_email: string;
  created_at: string;
  updated_at: string;
  channel?: string;
}

const replyTemplates = [
  {
    label: "Confirm + Link",
    body:
      "Hello {name},\n\nThank you for booking a coaching session. Here is your session link: {link}\nDate/Time: {time}\nCalendar: {calendar}\n\nIf you need to reschedule, please reply to this email.\n\nWarm regards,\nVialife Coach Support",
  },
  {
    label: "Request Availability",
    body:
      "Hello {name},\n\nThanks for your booking request. Please confirm your preferred date and time, and we will send your session link.\n\nWarm regards,\nVialife Coach Support",
  },
  {
    label: "Reschedule",
    body:
      "Hello {name},\n\nWe need to reschedule your session. Please share your updated availability, and we will send a new session link.\n\nWarm regards,\nVialife Coach Support",
  },
];

export default function BookingsPage() {
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [bookings, setBookings] = useState<BookingTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<BookingTicket | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [meetingLink, setMeetingLink] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [meetingDateTime, setMeetingDateTime] = useState("");
  const [calendarLink, setCalendarLink] = useState("");
  const [isFetchingZohoUrl, setIsFetchingZohoUrl] = useState(false);

  async function loadBookings() {
    if (!accessToken) return;

    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("channel", "booking");
      if (filterStatus) params.append("status", filterStatus);
      if (filterPriority) params.append("priority", filterPriority);
      params.append("limit", "100");

      const data = await apiRequest<{ success: boolean; data?: BookingTicket[]; message?: string }>(
        `/admin/support/tickets?${params.toString()}`,
        { token: accessToken }
      );

      if (data.success) {
        setBookings(data.data || []);
      } else {
        throw new Error(data.message || "Failed to load bookings");
      }
    } catch (err) {
      console.error("Error loading bookings:", err);
      setError(err instanceof Error ? err.message : "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }

  async function openZohoAuthUrl() {
    if (!accessToken) return;
    try {
      setIsFetchingZohoUrl(true);
      const data = await apiRequest<{ auth_url?: string; message?: string }>(
        "/integrations/zoho/auth-url",
        { token: accessToken }
      );
      if (!data.auth_url) {
        throw new Error(data.message || "Zoho auth URL not available");
      }
      window.open(data.auth_url, "_blank");
    } catch (err) {
      addToast({
        title: "Failed to open Zoho OAuth",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsFetchingZohoUrl(false);
    }
  }

  async function updateBooking(ticketId: number, updates: { status?: string; priority?: string }) {
    if (!accessToken) return;

    try {
      setIsUpdating(true);
      const data = await apiRequest<{ success: boolean; message?: string }>(
        `/admin/support/tickets/${ticketId}`,
        {
          method: "PATCH",
          token: accessToken,
          body: JSON.stringify(updates),
        }
      );

      if (data.success) {
        addToast({ title: "Booking updated", variant: "default" });
        await loadBookings();
      } else {
        throw new Error(data.message || "Failed to update booking");
      }
    } catch (err) {
      addToast({
        title: "Failed to update booking",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  }

  async function sendReply(ticketId: number) {
    if (!accessToken || !replyText.trim()) return;

    try {
      setIsSubmittingReply(true);
      const data = await apiRequest<{ success: boolean; message?: string; email_sent?: boolean }>(
        `/admin/support/tickets/${ticketId}/reply`,
        {
          method: "POST",
          token: accessToken,
          body: JSON.stringify({ message: replyText.trim(), admin_reply: true }),
        }
      );

      if (data.success) {
        addToast({
          title: "Reply sent",
          description: data.email_sent === false ? "Reply saved, but email delivery failed." : undefined,
          variant: "default",
        });
        setReplyText("");
        setMeetingLink("");
        setMeetingTime("");
        setMeetingDateTime("");
        setCalendarLink("");
        await loadBookings();
      } else {
        throw new Error(data.message || "Failed to send reply");
      }
    } catch (err) {
      addToast({
        title: "Failed to send reply",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingReply(false);
    }
  }

  useEffect(() => {
    if (accessToken) {
      loadBookings();
    }
  }, [accessToken, filterStatus, filterPriority]);

  function getStatusColor(status: string) {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "closed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  function getPriorityColor(priority: string) {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "normal":
        return "bg-blue-100 text-blue-800";
      case "low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4" />;
      case "in_progress":
        return <Clock className="h-4 w-4" />;
      case "closed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Ticket className="h-4 w-4" />;
    }
  }

  function formatLocalDateTime(value: string) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString();
  }

  function buildWhatsAppLink(name: string, message: string) {
    const text = message.replace("{name}", name || "there");
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  }

  function applyTemplate(template: string) {
    const name = selectedBooking?.requester_name || "there";
    const timeText = meetingTime || formatLocalDateTime(meetingDateTime) || "[add time]";
    const text = template
      .replace("{name}", name)
      .replace("{link}", meetingLink || "[add link]")
      .replace("{time}", timeText)
      .replace("{calendar}", calendarLink || "[add calendar link]");
    setReplyText(text);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Bookings</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadBookings}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-900 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Admin
          </button>
          <button
            onClick={openZohoAuthUrl}
            disabled={isFetchingZohoUrl}
            className="flex items-center gap-2 px-3 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors disabled:opacity-50"
          >
            <ExternalLink className="h-4 w-4" />
            {isFetchingZohoUrl ? "Opening Zoho..." : "Get Zoho Token"}
          </button>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Bookings</h1>
        <p className="text-gray-300">Manage coaching session booking requests</p>
      </div>

      <div className="bg-slate-800 rounded-lg shadow-sm border border-slate-700 p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-300">Filters:</span>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-slate-100"
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-slate-100"
          >
            <option value="">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>

          <button
            onClick={loadBookings}
            className="px-3 py-2 bg-sky-700 text-white rounded-lg text-sm hover:bg-sky-800 flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg shadow-sm border border-slate-700">
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-slate-100">
            {bookings.length} Booking{bookings.length !== 1 ? "s" : ""}
          </h2>
        </div>

        {bookings.length === 0 ? (
          <div className="p-8 text-center">
            <Ticket className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-100 mb-2">No Booking Requests</h3>
            <p className="text-slate-400">No bookings found matching your criteria.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700">
            {bookings.map((booking) => (
              <div key={booking.id} className="p-4 hover:bg-slate-700 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-slate-100">{booking.subject}</h3>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}
                      >
                        {getStatusIcon(booking.status)}
                        {booking.status.replace("_", " ")}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(booking.priority)}`}
                      >
                        {booking.priority}
                      </span>
                    </div>

                    <p className="text-slate-300 mb-3 line-clamp-2">{booking.message}</p>

                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{booking.requester_name}</span>
                        <span className="text-slate-500">({booking.requester_email})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(booking.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="px-3 py-2 bg-sky-700 text-white rounded-lg text-sm hover:bg-sky-800"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-100">Booking Details</h2>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-slate-400 hover:text-slate-200 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-slate-100 mb-2">{selectedBooking.subject}</h3>
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedBooking.status)}`}
                  >
                    {getStatusIcon(selectedBooking.status)}
                    {selectedBooking.status.replace("_", " ")}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedBooking.priority)}`}
                  >
                    {selectedBooking.priority}
                  </span>
                </div>

                <p className="text-slate-300 whitespace-pre-wrap">{selectedBooking.message}</p>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-slate-100 mb-2">Contact Information</h4>
                <div className="space-y-1 text-sm text-slate-400">
                  <div><strong className="text-slate-300">Name:</strong> {selectedBooking.requester_name}</div>
                  <div><strong className="text-slate-300">Email:</strong> {selectedBooking.requester_email}</div>
                  <div><strong className="text-slate-300">Created:</strong> {new Date(selectedBooking.created_at).toLocaleString()}</div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <h4 className="text-sm font-medium text-slate-100">Update Booking</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                    <select
                      value={selectedBooking.status}
                      onChange={(e) => setSelectedBooking({ ...selectedBooking, status: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Priority</label>
                    <select
                      value={selectedBooking.priority}
                      onChange={(e) => setSelectedBooking({ ...selectedBooking, priority: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100"
                    >
                      <option value="urgent">Urgent</option>
                      <option value="high">High</option>
                      <option value="normal">Normal</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateBooking(selectedBooking.id, { status: selectedBooking.status, priority: selectedBooking.priority })}
                    disabled={isUpdating}
                    className="px-4 py-2 bg-sky-700 text-white rounded-lg hover:bg-sky-800 disabled:opacity-50"
                  >
                    {isUpdating ? "Updating..." : "Update Booking"}
                  </button>
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-600 text-slate-300"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="space-y-4 border-t border-slate-700 pt-6">
                <h4 className="text-sm font-medium text-slate-100">Reply to Applicant</h4>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Session Link</label>
                    <input
                      value={meetingLink}
                      onChange={(e) => setMeetingLink(e.target.value)}
                      placeholder="https://meet..."
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100"
                    />
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={async () => {
                          if (!meetingLink) return;
                          await navigator.clipboard.writeText(meetingLink);
                          addToast({ title: "Link copied", variant: "default" });
                        }}
                        className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-slate-200 hover:bg-slate-600"
                      >
                        Copy Link
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Session Time</label>
                    <input
                      value={meetingTime}
                      onChange={(e) => setMeetingTime(e.target.value)}
                      placeholder="e.g. Apr 5, 2026 2:00 PM"
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100"
                    />
                    <input
                      type="datetime-local"
                      value={meetingDateTime}
                      onChange={(e) => {
                        setMeetingDateTime(e.target.value);
                        if (!meetingTime) setMeetingTime(formatLocalDateTime(e.target.value));
                      }}
                      className="mt-2 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Calendar Link</label>
                    <input
                      value={calendarLink}
                      onChange={(e) => setCalendarLink(e.target.value)}
                      placeholder="Generate or paste a calendar link"
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100"
                    />
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (!meetingDateTime) {
                            addToast({
                              title: "Missing date/time",
                              description: "Please select a session date and time first.",
                              variant: "destructive",
                            });
                            return;
                          }
                          void (async () => {
                            try {
                              const payload = {
                                title: selectedBooking?.subject || "Coaching Session",
                                description: selectedBooking?.message || "",
                                startDateTime: meetingDateTime,
                                durationMinutes: 60,
                                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                                location: "Online",
                                meetingUrl: meetingLink,
                                attendeeEmail: selectedBooking?.requester_email,
                                attendeeName: selectedBooking?.requester_name,
                              };

                                                            const response = (await apiRequest(
                                "/integrations/zoho/calendar-events",
                                {
                                  method: "POST",
                                  token: accessToken || undefined,
                                  body: JSON.stringify(payload),
                                }
                              )) as {
                                success: boolean;
                                data?: { view_url?: string; meeting_link?: string };
                                message?: string;
                              };


                              if (!response.success) {
                                throw new Error(response.message || "Failed to create Zoho event");
                              }

                              const link = response.data?.view_url || response.data?.meeting_link;
                              if (link) {
                                setCalendarLink(link);
                                addToast({ title: "Zoho event created", variant: "default" });
                              } else {
                                addToast({
                                  title: "Zoho event created",
                                  description: "No event link returned. You can still send the reply.",
                                  variant: "default",
                                });
                              }
                            } catch (err) {
                              addToast({
                                title: "Zoho calendar error",
                                description: err instanceof Error ? err.message : "Unknown error",
                                variant: "destructive",
                              });
                            }
                          })();
                        }}
                        className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-slate-200 hover:bg-slate-600"
                      >
                        Generate Zoho Calendar Link
                      </button>
                    </div>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => {
                        const name = selectedBooking?.requester_name || "there";
                        const message = replyText || `Hello ${name}, your session link is ${meetingLink || '[add link]'}`;
                        const url = buildWhatsAppLink(name, message);
                        window.open(url, "_blank");
                      }}
                      className="px-3 py-2 bg-emerald-700 text-white rounded-lg text-sm hover:bg-emerald-800"
                    >
                      Send WhatsApp Instead
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {replyTemplates.map((template) => (
                    <button
                      key={template.label}
                      onClick={() => applyTemplate(template.body)}
                      className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-slate-200 hover:bg-slate-600"
                    >
                      {template.label}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Your Reply</label>
                  <textarea
                    rows={6}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your response to the applicant..."
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => sendReply(selectedBooking.id)}
                    disabled={!replyText.trim() || isSubmittingReply}
                    className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:opacity-50 flex items-center gap-2"
                  >
                    <Reply className="h-4 w-4" />
                    {isSubmittingReply ? "Sending..." : "Send Reply"}
                  </button>
                  <button
                    onClick={() => setReplyText("")}
                    className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-600 text-slate-300"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
