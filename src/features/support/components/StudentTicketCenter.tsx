import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { studentService, type StudentTicket, type StudentTicketDetail } from "@/services/studentService";
import { SupportTicketForm } from "./SupportTicketForm";

export function StudentTicketCenter() {
  const { accessToken } = useAuth();
  const [tickets, setTickets] = useState<StudentTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<StudentTicketDetail | null>(null);
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");

  async function loadTickets() {
    if (!accessToken) return;
    try {
      const rows = await studentService.listTickets(accessToken);
      setTickets(rows);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load tickets.");
    }
  }

  async function openTicket(ticketId: number) {
    if (!accessToken) return;
    try {
      const details = await studentService.getTicket(accessToken, ticketId);
      setSelectedTicket(details);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load ticket details.");
    }
  }

  async function sendReply() {
    if (!accessToken || !selectedTicket || !reply.trim()) return;
    try {
      await studentService.replyToTicket(accessToken, selectedTicket.id, reply.trim());
      setReply("");
      await openTicket(selectedTicket.id);
      await loadTickets();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send reply.");
    }
  }

  useEffect(() => {
    void loadTickets();
  }, [accessToken]);

  return (
    <section className="space-y-8">
      <SupportTicketForm />

      <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6">
        <h2 className="text-xl font-semibold text-slate-100">My Support Tickets</h2>
        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        <div className="mt-4 grid gap-3">
          {tickets.length === 0 ? <p className="text-sm text-slate-400">No tickets yet.</p> : null}
          {tickets.map((ticket) => (
            <button
              key={ticket.id}
              type="button"
              onClick={() => void openTicket(ticket.id)}
              className="rounded-lg border border-slate-700 p-3 text-left hover:bg-slate-700"
            >
              <p className="text-sm font-semibold text-slate-100">#{ticket.id} - {ticket.subject}</p>
              <p className="text-xs text-slate-400">Status: {ticket.status}</p>
            </button>
          ))}
        </div>
      </div>

      {selectedTicket ? (
        <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6">
          <h3 className="text-lg font-semibold text-slate-100">Ticket #{selectedTicket.id}: {selectedTicket.subject}</h3>
          <p className="mt-2 text-sm text-slate-300">{selectedTicket.message}</p>
          <div className="mt-4 space-y-2">
            {selectedTicket.replies?.length ? selectedTicket.replies.map((item) => (
              <div key={item.id} className="rounded-lg bg-slate-700 p-3">
                <p className="text-xs font-semibold text-slate-200">{item.author_name || "Support"}</p>
                <p className="text-sm text-slate-300">{item.message}</p>
              </div>
            )) : <p className="text-sm text-slate-400">No replies yet.</p>}
          </div>
          <div className="mt-4 flex gap-2">
            <input
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              className="flex-1 rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-slate-100"
              placeholder="Reply to this ticket..."
            />
            <button
              type="button"
              onClick={() => void sendReply()}
              disabled={!reply.trim()}
              className="rounded-lg bg-sky-700 px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
