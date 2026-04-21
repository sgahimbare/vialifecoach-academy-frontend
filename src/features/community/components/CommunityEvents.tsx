import { useEffect, useState } from "react";
import { Calendar, Users, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { communityService, type CommunityEvent } from "@/services/communityService";

function formatDateTime(value: string) {
  return new Date(value).toLocaleString();
}

export function CommunityEvents() {
  const { accessToken, user } = useAuth();
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [error, setError] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<CommunityEvent | null>(null);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    try {
      const data = await communityService.getEvents(accessToken);
      setEvents(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load events");
    }
  }

  useEffect(() => {
    void load();
  }, [accessToken]);

  function openRegister(event: CommunityEvent) {
    setSelectedEvent(event);
    setMessage("");
    if (accessToken) {
      setGuestName(user?.name || "");
      setGuestEmail("");
    }
  }

  async function submitRegistration() {
    if (!selectedEvent) return;
    try {
      await communityService.registerEvent(selectedEvent.id, {
        token: accessToken,
        name: accessToken ? undefined : guestName,
        email: accessToken ? undefined : guestEmail,
      });
      setMessage("Registration successful.");
      await load();
      setTimeout(() => setSelectedEvent(null), 900);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Registration failed.");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Upcoming Events</h2>
        <p className="text-sm text-slate-500 mt-1">Join our events, webinars, and learning sessions</p>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-3">
            <p className="text-xs rounded-full bg-slate-100 px-2 py-1 w-fit">{event.event_type}</p>
            <h3 className="font-semibold text-slate-800">{event.title}</h3>
            <p className="text-sm text-slate-600">{event.description || "No description provided."}</p>
            <p className="text-sm text-slate-600 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-sky-700" />
              {formatDateTime(event.start_at)}
            </p>
            <p className="text-sm text-slate-600 flex items-center gap-2">
              <Users className="h-4 w-4 text-sky-700" />
              {event.registered_count} registered
            </p>
            <button
              className="mt-2 rounded-xl bg-sky-700 px-4 py-2 text-sm text-white disabled:opacity-50"
              onClick={() => openRegister(event)}
              disabled={event.is_registered}
            >
              {event.is_registered ? "Registered" : "Register"}
            </button>
          </div>
        ))}
      </div>

      {selectedEvent ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">Event Registration</h3>
              <button type="button" onClick={() => setSelectedEvent(null)} className="rounded p-1 hover:bg-slate-100">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1 text-sm text-slate-600">{selectedEvent.title}</p>

            {!accessToken ? (
              <div className="mt-4 space-y-3">
                <input
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Full name"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
                <input
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-600">You are registering as {user?.name}.</p>
            )}

            {message ? <p className="mt-3 text-sm text-sky-700">{message}</p> : null}
            <button
              type="button"
              onClick={() => void submitRegistration()}
              disabled={!accessToken && (!guestName.trim() || !guestEmail.trim())}
              className="mt-4 w-full rounded-lg bg-sky-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              Submit Registration
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
