import { useState, useEffect } from "react";
import { 
  ArrowLeft, Eye, RefreshCw, Trash2, AlertTriangle, CheckCircle, RotateCcw, MessageSquare 
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAuth } from "@/context/AuthContext";
import { communityService } from "@/services/communityService";

interface DeletedMessage {
  id: number;
  content: string;
  created_at: string;
  deleted_at: string;
  deleted_by: number;
  sender_name: string;
  sender_role: string;
  recipient_name: string;
  recipient_role: string;
  deleted_by_name: string;
}

export default function AdminConversationAuditPage() {
  const { accessToken, user } = useAuth();
  const [deletedMessages, setDeletedMessages] = useState<DeletedMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMessages, setSelectedMessages] = useState<number[]>([]);
  const [isRestoring, setIsRestoring] = useState(false);

  console.log('🔍 AdminConversationAuditPage - Component loaded!');
  console.log('🔍 user:', user);
  console.log('🔍 accessToken:', accessToken ? 'exists' : 'missing');

  useEffect(() => {
    console.log('AdminConversationAuditPage - accessToken:', accessToken ? 'exists' : 'missing');
    loadDeletedConversations();
  }, [accessToken]);

  async function loadDeletedConversations() {
    if (!accessToken) {
      setError("Please log in to access this page");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      console.log('🔄 Loading deleted conversations via updated service...');
      
      // Use the updated service with direct fetch and better error handling
      const messages = await communityService.getDeletedConversations(accessToken);
      setDeletedMessages(messages);
      setError("");
    } catch (e) {
      console.error('❌ Error in loadDeletedConversations:', e);
      const errorMessage = e instanceof Error ? e.message : "Failed to load deleted conversations";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  async function restoreSelectedMessages() {
    if (!accessToken || selectedMessages.length === 0) return;
    
    if (!window.confirm(`Are you sure you want to restore ${selectedMessages.length} message(s)? This will make them visible again to the users.`)) {
      return;
    }

    try {
      setIsRestoring(true);
      console.log('🔄 Restoring selected messages:', selectedMessages);
      
      // Use the updated service with better error handling
      const response = await communityService.restoreConversations(accessToken, selectedMessages);
      
      if (response && typeof response === 'object' && 'success' in response && response.success) {
        setDeletedMessages(prev => prev.filter(msg => !selectedMessages.includes(msg.id)));
        setSelectedMessages([]);
        setError("");
        const restoredCount = (response as any).restoredCount || selectedMessages.length;
        alert(`Successfully restored ${restoredCount} message(s)`);
      }
    } catch (e) {
      console.error('❌ Error in restoreSelectedMessages:', e);
      const errorMessage = e instanceof Error ? e.message : "Failed to restore messages";
      setError(errorMessage);
    } finally {
      setIsRestoring(false);
    }
  }

  function toggleMessageSelection(messageId: number) {
    setSelectedMessages(prev => 
      prev.includes(messageId) 
        ? prev.filter(id => id !== messageId)
        : [...prev, messageId]
    );
  }

  function selectAllMessages() {
    setSelectedMessages(deletedMessages.map(msg => msg.id));
  }

  function clearSelection() {
    setSelectedMessages([]);
  }

  return (
    <AdminLayout 
      title="Conversation Audit" 
      subtitle="Review and restore deleted conversations"
      actions={
        <div className="flex items-center gap-4">
          <button
            onClick={loadDeletedConversations}
            disabled={loading}
            className="admin-btn flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => window.history.back()}
            className="admin-btn flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Selection Controls */}
        <div className="admin-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={selectAllMessages}
                disabled={deletedMessages.length === 0}
                className="admin-btn text-sm"
              >
                Select All ({deletedMessages.length})
              </button>
              <button
                onClick={clearSelection}
                disabled={selectedMessages.length === 0}
                className="admin-btn text-sm"
              >
                Clear Selection ({selectedMessages.length})
              </button>
              <button
                onClick={restoreSelectedMessages}
                disabled={selectedMessages.length === 0 || isRestoring}
                className="admin-btn-primary flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                {isRestoring ? 'Restoring...' : `Restore Selected (${selectedMessages.length})`}
              </button>
            </div>
            <div className="text-sm text-slate-400">
              {deletedMessages.length} deleted message(s) found
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="admin-card border-red-900 bg-red-950/50">
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Deleted Messages List */}
        {loading ? (
          <div className="admin-card">
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2 text-cyan-400" />
              <span className="text-slate-300">Loading deleted conversations...</span>
            </div>
          </div>
        ) : deletedMessages.length === 0 ? (
          <div className="admin-card">
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-slate-600" />
              <h3 className="text-lg font-medium text-slate-200 mb-2">No Deleted Conversations</h3>
              <p className="text-slate-400">No deleted conversations found in the system.</p>
            </div>
          </div>
        ) : (
          <div className="admin-card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Deleted Conversations ({deletedMessages.length})</h2>
              {selectedMessages.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-300">
                    {selectedMessages.length} selected
                  </span>
                  <button
                    onClick={restoreSelectedMessages}
                    disabled={isRestoring}
                    className="admin-btn-primary flex items-center gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    {isRestoring ? "Restoring..." : "Restore Selected"}
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {deletedMessages.map((message) => (
                <div 
                  key={message.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedMessages.includes(message.id)
                      ? 'border-red-500 bg-red-950/30'
                      : 'border-slate-700 hover:border-slate-600'
                  }`}
                  onClick={() => toggleMessageSelection(message.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="checkbox"
                          checked={selectedMessages.includes(message.id)}
                          onChange={() => toggleMessageSelection(message.id)}
                          className="rounded border-slate-600 bg-slate-800 text-red-500 focus:ring-red-500"
                        />
                        <span className="text-sm font-medium text-red-400">DELETED</span>
                        <span className="text-xs text-slate-400">
                          {new Date(message.deleted_at).toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="mb-2">
                        <p className="text-slate-200 text-sm">{message.content}</p>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span>
                          From: <span className="text-slate-300">{message.sender_name}</span> ({message.sender_role})
                        </span>
                        <span>
                          To: <span className="text-slate-300">{message.recipient_name}</span> ({message.recipient_role})
                        </span>
                        <span>
                          Deleted by: <span className="text-slate-300">{message.deleted_by_name}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="admin-card bg-red-950/30 border-red-900/50">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
            <div className="text-sm text-red-300">
              <p className="font-semibold mb-1 text-red-200">About Conversation Audit</p>
              <ul className="list-disc list-inside space-y-1 text-red-400">
                <li>When users delete conversations, messages are soft-deleted and stored here for audit purposes</li>
                <li>Admins can review deleted conversations to resolve disputes or investigate issues</li>
                <li>Selected messages can be restored to make them visible again to users</li>
                <li>This helps maintain trust and accountability in the platform</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}