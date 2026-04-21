import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { QuickResponseTemplates } from "@/components/admin/QuickResponseTemplates";
import { useToast } from "@/components/ui/toast";
import { apiRequest } from "@/lib/api";
import { 
  Ticket, 
  Mail, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  User,
  Calendar,
  Filter,
  RefreshCw,
  Reply,
  Archive,
  Trash2,
  ArrowLeft
} from "lucide-react";

interface SupportTicket {
  id: number;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  requester_name: string;
  requester_email: string;
  assigned_to?: number | null;
  created_at: string;
  updated_at: string;
  channel?: string;
}

export default function SupportTicketsPage() {
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterPriority, setFilterPriority] = useState<string>("");
  const [filterChannel, setFilterChannel] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [quickReplyTicketId, setQuickReplyTicketId] = useState<number | null>(null);
  const [quickReplyText, setQuickReplyText] = useState("");

  async function loadTickets() {
    if (!accessToken) return;
    
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterStatus) params.append('status', filterStatus);
      if (filterPriority) params.append('priority', filterPriority);
      if (filterChannel) params.append('channel', filterChannel);
      params.append('limit', '100');

      const data = await apiRequest<{ success: boolean; data?: SupportTicket[]; message?: string }>(
        `/admin/support/tickets?${params.toString()}`,
        { token: accessToken }
      );
      if (data.success) {
        setTickets(data.data || []);
        console.log('📋 Loaded', data.data?.length || 0, 'support tickets');
      } else {
        throw new Error(data.message || 'Failed to load tickets');
      }
    } catch (error) {
      console.error('Error loading support tickets:', error);
      setError(error instanceof Error ? error.message : 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  }

  async function updateTicket(ticketId: number, updates: { status?: string; priority?: string; assigned_to?: string }) {
    if (!accessToken) return;

    try {
      setIsUpdating(true);
      const data = await apiRequest<{ success: boolean; data?: SupportTicket; message?: string }>(
        `/admin/support/tickets/${ticketId}`,
        {
          method: 'PATCH',
          token: accessToken,
          body: JSON.stringify(updates)
        }
      );
      if (data.success) {
        addToast({
          title: "Ticket updated successfully",
          variant: "default"
        });
        await loadTickets(); // Reload tickets
      } else {
        throw new Error(data.message || 'Failed to update ticket');
      }
    } catch (error) {
      console.error('Error updating ticket:', error);
      addToast({
        title: "Failed to update ticket", 
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  }

  async function sendQuickReply(ticketId: number) {
    if (!accessToken || !quickReplyText.trim()) {
      console.log('❌ FRONTEND: Validation failed - no token or message');
      addToast({
        title: "Validation failed", 
        description: "Please enter a reply message",
        variant: "destructive"
      });
      return;
    }

    let timeoutId: NodeJS.Timeout | null = null;
    try {
      setIsSubmittingReply(true);
      console.log('🔄 FRONTEND: Sending quick reply to ticket:', ticketId);
      console.log('🔄 FRONTEND: Reply message:', quickReplyText.trim());
      console.log('🔄 FRONTEND: Access token exists:', !!accessToken);
      console.log('🔄 FRONTEND: Access token length:', accessToken?.length);
      console.log('🔄 FRONTEND: Current origin:', window.location.origin);
      
      console.log('🔄 FRONTEND: API URL:', `/admin/support/tickets/${ticketId}/reply`);

      const requestBody = {
        message: quickReplyText.trim(),
        admin_reply: true
      };
      
      console.log('🔄 FRONTEND: Request body:', JSON.stringify(requestBody));

      const controller = new AbortController();
      timeoutId = setTimeout(() => {
        console.log('🔄 FRONTEND: Request timeout - aborting...');
        controller.abort();
      }, 10000); // 10 second timeout

      console.log('🔄 FRONTEND: Starting fetch request...');
      const data = await apiRequest<{ success: boolean; message?: string; email_sent?: boolean }>(
        `/admin/support/tickets/${ticketId}/reply`,
        {
          method: 'POST',
          token: accessToken,
          body: JSON.stringify(requestBody),
          signal: controller.signal
        }
      );
      if (timeoutId) clearTimeout(timeoutId);
      console.log('🔄 FRONTEND: Response data:', data);
      
      if (data.success) {
        console.log('🔄 FRONTEND: Reply sent successfully!');
        addToast({
          title: "Reply sent successfully",
          description: data.email_sent === false ? "Reply saved, but email delivery failed. Check email settings." : undefined,
          variant: "default"
        });
        setQuickReplyText("");
        setQuickReplyTicketId(null);
        await loadTickets(); // Reload tickets to show updated status
      } else {
        console.error('🔄 FRONTEND: Backend returned error:', data);
        throw new Error(data.message || 'Failed to send reply');
      }
    } catch (error) {
      if (timeoutId) clearTimeout(timeoutId);
      console.error('🔄 FRONTEND: Error sending quick reply:', error);
      console.error('🔄 FRONTEND: Error name:', error instanceof Error ? error.name : 'Unknown');
      console.error('🔄 FRONTEND: Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Request timed out. Please check your connection and try again.';
        } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      addToast({
        title: "Failed to send reply", 
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      console.log('🔄 FRONTEND: Setting isSubmittingReply to false');
      setIsSubmittingReply(false);
    }
  }

  // Add a test function to check connectivity
  async function testAdminConnectivity() {
    if (!accessToken) {
      console.log('❌ FRONTEND: No access token for connectivity test');
      return false;
    }

    try {
      console.log('🔧 FRONTEND: Testing admin connectivity...');
      await apiRequest(`/admin/support/tickets?limit=1`, { token: accessToken });
      console.log('🔧 FRONTEND: Connectivity test response: OK');
      return true;
    } catch (error) {
      console.error('🔧 FRONTEND: Connectivity test failed:', error);
      return false;
    }
  }

  async function sendReply(ticketId: number) {
    if (!accessToken || !replyText.trim()) return;

    try {
      setIsSubmittingReply(true);
      const data = await apiRequest<{ success: boolean; message?: string; email_sent?: boolean }>(
        `/admin/support/tickets/${ticketId}/reply`,
        {
          method: 'POST',
          token: accessToken,
          body: JSON.stringify({
            message: replyText.trim(),
            admin_reply: true
          })
        }
      );
      if (data.success) {
        addToast({
          title: "Reply sent successfully",
          description: data.email_sent === false ? "Reply saved, but email delivery failed. Check email settings." : undefined,
          variant: "default"
        });
        setReplyText("");
        await loadTickets(); // Reload tickets to show updated status
      } else {
        throw new Error(data.message || 'Failed to send reply');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      addToast({
        title: "Failed to send reply", 
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive"
      });
    } finally {
      setIsSubmittingReply(false);
    }
  }

  useEffect(() => {
    if (accessToken) {
      loadTickets();
    }
  }, [accessToken, filterStatus, filterPriority, filterChannel]);

  function getStatusColor(status: string) {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  function getChannelColor(channel?: string) {
    switch (channel) {
      case 'booking': return 'bg-emerald-100 text-emerald-800';
      case 'support': return 'bg-indigo-100 text-indigo-800';
      case 'contact': return 'bg-cyan-100 text-cyan-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  }

  function getChannelLabel(channel?: string) {
    if (!channel) return 'general';
    return channel.replace(/_/g, ' ');
  }

  function getPriorityColor(priority: string) {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case 'open': return <AlertCircle className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'closed': return <CheckCircle className="h-4 w-4" />;
      default: return <Ticket className="h-4 w-4" />;
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const baseTickets = tickets.filter((ticket) => ticket.channel !== 'booking');
  const visibleTickets = filterChannel
    ? baseTickets.filter((ticket) => ticket.channel === filterChannel)
    : baseTickets;

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Support Tickets</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadTickets}
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
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Admin
          </button>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Support Tickets</h1>
        <p className="text-gray-300">Manage and respond to customer support requests</p>
      </div>

      {/* Filters */}
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
            onClick={loadTickets}
            className="px-3 py-2 bg-sky-700 text-white rounded-lg text-sm hover:bg-sky-800 flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-slate-800 rounded-lg shadow-sm border border-slate-700">
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-slate-100">
            {visibleTickets.length} Support Ticket{visibleTickets.length !== 1 ? 's' : ''}
          </h2>
        </div>

        {visibleTickets.length === 0 ? (
          <div className="p-8 text-center">
            <Ticket className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-100 mb-2">No Support Tickets</h3>
            <p className="text-slate-400">No support tickets found matching your criteria.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700">
            {visibleTickets.map((ticket) => (
              <div key={ticket.id} className="p-4 hover:bg-slate-700 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-slate-100">{ticket.subject}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {getStatusIcon(ticket.status)}
                        {ticket.status.replace('_', ' ')}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                      {ticket.channel && (
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getChannelColor(ticket.channel)}`}>
                          {getChannelLabel(ticket.channel)}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-slate-300 mb-3 line-clamp-2">{ticket.message}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{ticket.requester_name}</span>
                        <span className="text-slate-500">({ticket.requester_email})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => setSelectedTicket(ticket)}
                      className="px-3 py-2 bg-sky-700 text-white rounded-lg text-sm hover:bg-sky-800"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => setQuickReplyTicketId(ticket.id)}
                      className="px-3 py-2 bg-green-700 text-white rounded-lg text-sm hover:bg-green-800 flex items-center gap-1"
                    >
                      <Reply className="h-4 w-4" />
                      Reply
                    </button>
                  </div>
                </div>
                
                {/* Quick Reply Section */}
                {quickReplyTicketId === ticket.id && (
                  <div className="mt-4 p-3 bg-slate-700 rounded-lg border border-slate-600">
                    <div className="space-y-3">
                      <textarea
                        rows={3}
                        value={quickReplyText}
                        onChange={(e) => setQuickReplyText(e.target.value)}
                        placeholder="Type your quick reply..."
                        className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-slate-100 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-sky-400"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => sendQuickReply(ticket.id)}
                          disabled={!quickReplyText.trim() || isSubmittingReply}
                          className="px-3 py-2 bg-green-700 text-white rounded-lg text-sm hover:bg-green-800 disabled:opacity-50 flex items-center gap-1"
                        >
                          <Reply className="h-4 w-4" />
                          {isSubmittingReply ? 'Sending...' : 'Send Reply'}
                        </button>
                        <button
                          onClick={() => {
                            setQuickReplyTicketId(null);
                            setQuickReplyText("");
                          }}
                          className="px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-sm hover:bg-slate-500 text-slate-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-100">Ticket Details</h2>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="text-slate-400 hover:text-slate-200 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-slate-100 mb-2">{selectedTicket.subject}</h3>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTicket.status)}`}>
                    {getStatusIcon(selectedTicket.status)}
                    {selectedTicket.status.replace('_', ' ')}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                    {selectedTicket.priority}
                  </span>
                </div>
                
                <p className="text-slate-300 whitespace-pre-wrap">{selectedTicket.message}</p>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-slate-100 mb-2">Contact Information</h4>
                <div className="space-y-1 text-sm text-slate-400">
                  <div><strong className="text-slate-300">Name:</strong> {selectedTicket.requester_name}</div>
                  <div><strong className="text-slate-300">Email:</strong> {selectedTicket.requester_email}</div>
                  {selectedTicket.channel && <div><strong className="text-slate-300">Channel:</strong> {selectedTicket.channel}</div>}
                  <div><strong className="text-slate-300">Created:</strong> {new Date(selectedTicket.created_at).toLocaleString()}</div>
                </div>
              </div>

              {/* Update Form */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-slate-100">Update Ticket</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                    <select
                      value={selectedTicket.status}
                      onChange={(e) => setSelectedTicket({...selectedTicket, status: e.target.value as any})}
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
                      value={selectedTicket.priority}
                      onChange={(e) => setSelectedTicket({...selectedTicket, priority: e.target.value as any})}
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
                    onClick={() => updateTicket(selectedTicket.id, {
                      status: selectedTicket.status,
                      priority: selectedTicket.priority
                    })}
                    disabled={isUpdating}
                    className="px-4 py-2 bg-sky-700 text-white rounded-lg hover:bg-sky-800 disabled:opacity-50"
                  >
                    {isUpdating ? 'Updating...' : 'Update Ticket'}
                  </button>
                  
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-600 text-slate-300"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Reply Section */}
              <div className="space-y-4 border-t border-slate-700 pt-6">
                <h4 className="text-sm font-medium text-slate-100">Reply to Customer</h4>
                
                {/* Quick Response Templates */}
                <QuickResponseTemplates onTemplateSelect={(template) => setReplyText(template)} />
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Your Reply</label>
                  <textarea
                    rows={4}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your response to the customer..."
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => sendReply(selectedTicket.id)}
                    disabled={!replyText.trim() || isSubmittingReply}
                    className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:opacity-50 flex items-center gap-2"
                  >
                    <Reply className="h-4 w-4" />
                    {isSubmittingReply ? 'Sending...' : 'Send Reply'}
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
