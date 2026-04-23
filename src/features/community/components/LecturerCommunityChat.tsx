import { useEffect, useMemo, useRef, useState } from "react";
import { Send, Search, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  communityService,
  type CommunityContact,
  type CommunityContactProfile,
  type CommunityMessage,
} from "@/services/communityService";

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatConversationTime(value?: string | null) {
  if (!value) return "";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return "";
  const now = new Date();
  const isToday = dt.toDateString() === now.toDateString();
  if (isToday) return formatTime(value);
  return dt.toLocaleDateString([], { month: "short", day: "numeric" });
}

function normalizeRole(role?: string) {
  const value = String(role || "").toLowerCase();
  if (value === "instructor" || value === "lecturer" || value === "teacher") return "Instructor";
  if (value === "student") return "Student";
  if (!value) return "User";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function LecturerCommunityChat({ studentMode = false }: { studentMode?: boolean }) {
  const navigate = useNavigate();
  const { user, accessToken } = useAuth();
  const [contacts, setContacts] = useState<CommunityContact[]>([]);
  const [selected, setSelected] = useState<CommunityContact | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<CommunityContactProfile | null>(null);
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [messageText, setMessageText] = useState("");
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [error, setError] = useState("");
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const searchWrapRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const quickEmojis = [
    "😀", "😁", "😂", "🤣", "😊", "🙂", "😉", "😍", "😘", "😎",
    "🤩", "🥳", "🤔", "😮", "😢", "😭", "😡", "👍", "👎", "👏",
    "🙌", "🙏", "💪", "👌", "🤝", "💯", "🔥", "✨", "🌟", "🎉",
    "🎊", "❤️", "💙", "💚", "💛", "🧠", "📚", "🎓", "🚀", "✅"
  ];

  // Only show contacts that have been discussed with (have last_message)
  const recentContacts = useMemo(() => {
    return contacts.filter((contact) => 
      contact.id !== user?.id && contact.last_message
    );
  }, [contacts, user?.id]);

  // Show search results only when searching
  const searchResults = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return [];
    return contacts.filter((contact) => 
      contact.id !== user?.id && 
      (contact.name.toLowerCase().includes(query) ||
       String(contact.role || "").toLowerCase().includes(query))
    );
  }, [contacts, search, user?.id]);

  // All available users (excluding current user)
  const allAvailableUsers = useMemo(() => {
    const filtered = contacts.filter((contact) => 
      contact.id !== user?.id
    );
    console.log('All available users:', filtered); // Debug log
    return filtered;
  }, [contacts, user?.id]);

  useEffect(() => {
    async function loadContacts() {
      if (!accessToken) return;
      try {
        const data = studentMode
          ? await communityService.getStudentChatContacts(accessToken)
          : await communityService.getChatContacts(accessToken);
        const safeContacts = data.filter((contact) => contact.id !== user?.id);
        setContacts(safeContacts);
        // Only auto-select if there's a recent conversation
        const recent = safeContacts.filter(c => c.last_message);
        if (!selected && recent.length > 0) setSelected(recent[0]);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load contacts");
      }
    }
    void loadContacts();
    const interval = setInterval(loadContacts, 15000);
    return () => clearInterval(interval);
  }, [accessToken, studentMode, user?.id]);

  useEffect(() => {
    if (!selected) return;
    // Only reset if selected contact is not in any available users (not just recent)
    if (!allAvailableUsers.some((contact) => contact.id === selected.id)) {
      setSelected(recentContacts[0] || null);
    }
  }, [allAvailableUsers, selected]);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!searchWrapRef.current?.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    async function loadSelectedProfile() {
      if (!accessToken || !selected) {
        setSelectedProfile(null);
        return;
      }
      try {
        const profile = studentMode
          ? await communityService.getStudentChatContactProfile(accessToken, selected.id)
          : await communityService.getChatContactProfile(accessToken, selected.id);
        setSelectedProfile(profile);
      } catch {
        setSelectedProfile(null);
      }
    }
    void loadSelectedProfile();
  }, [accessToken, selected?.id, studentMode]);

  useEffect(() => {
    async function loadMessages() {
      if (!accessToken || !selected) return;
      try {
        const data = studentMode
          ? await communityService.getStudentMessages(accessToken, selected.id)
          : await communityService.getMessages(accessToken, selected.id);
        setMessages(data);
        setError("");
        if (shouldAutoScroll) {
          setTimeout(() => messageEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load messages");
      }
    }
    void loadMessages();
    const interval = setInterval(loadMessages, 7000);
    return () => clearInterval(interval);
  }, [accessToken, selected?.id, studentMode, shouldAutoScroll]);

  useEffect(() => {
    if (!shouldAutoScroll) return;
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, shouldAutoScroll]);

  async function send() {
    if (!accessToken || !selected || !messageText.trim()) return;
    const temp: CommunityMessage = {
      id: -Date.now(),
      sender_id: user?.id || 0,
      recipient_id: selected.id,
      content: messageText.trim(),
      created_at: new Date().toISOString(),
      is_read: false,
    };
    setMessages((prev) => [...prev, temp]);
    setMessageText("");
    try {
      const response = (studentMode
        ? await communityService.sendStudentMessage(accessToken, selected.id, messageText.trim())
        : await communityService.sendMessage(accessToken, selected.id, messageText.trim())) as {
        data?: Partial<CommunityMessage>;
      };
      setMessages((prev) =>
        prev.map((msg) => (msg.id === temp.id ? ({ ...msg, ...response.data } as CommunityMessage) : msg))
      );
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send message");
      setMessages((prev) => prev.filter((msg) => msg.id !== temp.id));
    }
  }

  async function markAsRead(messageId: number) {
    if (!accessToken) return;
    try {
      if (studentMode) {
        await communityService.markStudentMessageRead(accessToken, messageId);
      } else {
        await communityService.markMessageRead(accessToken, messageId);
      }
      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, is_read: true, read_at: new Date().toISOString() } : msg))
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to mark as read");
    }
  }

  function beginEdit(message: CommunityMessage) {
    setEditingMessageId(message.id);
    setEditingText(message.content);
  }

  async function saveEdit(messageId: number) {
    if (!accessToken || !editingText.trim()) return;
    try {
      const response = studentMode
        ? await communityService.editStudentMessage(accessToken, messageId, editingText.trim())
        : await communityService.editMessage(accessToken, messageId, editingText.trim());
      const updated = response?.data;
      if (updated) {
        setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, ...updated } : msg)));
      }
      setEditingMessageId(null);
      setEditingText("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to edit message");
    }
  }

  async function removeMessage(messageId: number) {
    if (!accessToken) return;
    try {
      if (studentMode) {
        await communityService.deleteStudentMessage(accessToken, messageId);
      } else {
        await communityService.deleteMessage(accessToken, messageId);
      }
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, content: "message deleted", is_deleted: true, deleted_at: new Date().toISOString(), edited_at: null }
            : msg
        )
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete message");
    }
  }

  async function deleteConversation(contactId: number) {
    if (!accessToken) return;
    try {
      if (studentMode) {
        await communityService.deleteStudentConversation(accessToken, contactId);
      } else {
        await communityService.deleteConversation(accessToken, contactId);
      }
      // Clear messages and reset selection
      setMessages([]);
      setSelected(null);
      // Reload contacts to refresh the list
      const data = studentMode
        ? await communityService.getStudentChatContacts(accessToken)
        : await communityService.getChatContacts(accessToken);
      const safeContacts = data.filter((contact) => contact.id !== user?.id);
      setContacts(safeContacts);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete conversation");
    }
  }

  const contactLabel = useMemo(() => {
    console.log('Selected contact changed:', selected); // Debug log
    return selected?.name || "Select contact";
  }, [selected]);
  const selectedRole = useMemo(() => selected?.role || "", [selected]);

  function onMessageKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void send();
    }
  }

  function handleMessagesScroll() {
    const el = messagesContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShouldAutoScroll(distanceFromBottom < 80);
  }

  function appendToMessage(value: string) {
    setMessageText((prev) => (prev ? `${prev} ${value}` : value));
    inputRef.current?.focus();
  }

  return (
    <div
      className={`${studentMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"} min-h-[500px] rounded-xl border shadow-sm overflow-hidden flex flex-col`}
    >
      <div className="grid h-full grid-cols-1 md:grid-cols-[280px,1fr] flex-1">
        <div className={`border-r overflow-y-auto ${studentMode ? "border-slate-700" : "border-slate-200"}`}>
          <div className={`p-3 border-b ${studentMode ? "border-slate-700" : "border-slate-100"}`}>
            <p className={`text-sm font-semibold ${studentMode ? "text-slate-100" : "text-slate-800"}`}>
              {user?.name || "My Account"}
            </p>
            {user?.role ? (
              <p className={`text-xs ${studentMode ? "text-slate-400" : "text-slate-500"}`}>
                {normalizeRole(user.role)}
              </p>
            ) : null}
            <div className="relative mt-2" ref={searchWrapRef}>
              <div className="relative">
                <Search className={`absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 ${studentMode ? "text-slate-400" : "text-slate-500"}`} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  placeholder="Search to find users..."
                  className={`w-full rounded-lg border pl-7 pr-3 py-2 text-xs font-normal ${
                    studentMode ? "border-slate-600 bg-slate-700 text-slate-100" : "border-slate-200 bg-white text-slate-800"
                  }`}
                />
              </div>
              {searchOpen ? (
                <div
                  className={`absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border ${
                    studentMode ? "border-slate-600 bg-slate-800" : "border-slate-200 bg-white"
                  }`}
                >
                  {/* Show all users when search is open, regardless of search text */}
                  {(search ? searchResults : allAvailableUsers).map((contact) => (
                    <button
                      key={`search-${contact.id}`}
                      type="button"
                      onClick={() => {
                        console.log('Selected contact:', contact); // Debug log
                        setSelected(contact);
                        setSearch(""); // Clear search after selection
                        setSearchOpen(false);
                        setShowProfile(false); // Hide profile initially
                      }}
                      className={`block w-full px-3 py-2 text-left text-xs ${
                        studentMode ? "text-slate-200 hover:bg-slate-700" : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {contact.name} ({normalizeRole(contact.role)})
                    </button>
                  ))}
                  {!(search ? searchResults : allAvailableUsers).length ? (
                    <p className={`px-3 py-2 text-xs ${studentMode ? "text-slate-400" : "text-slate-500"}`}>
                      No users found.
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
          
          {/* Only show recent conversations */}
          <div className="flex-1 overflow-y-auto">
            {recentContacts.map((contact) => (
              <div key={contact.id} className={`w-full text-left px-3 py-2 border-b ${
                studentMode ? "border-slate-700 hover:bg-slate-700" : "border-slate-50 hover:bg-slate-50"
              } ${selected?.id === contact.id ? (studentMode ? "bg-slate-700" : "bg-sky-50") : ""}`}>
                <button
                  className="flex-1 text-left"
                  onClick={() => setSelected(contact)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 pr-1">
                      <p className={`break-words whitespace-normal text-sm font-medium ${studentMode ? "text-slate-100" : "text-slate-800"}`}>{contact.name}</p>
                      <p className={`text-xs ${studentMode ? "text-slate-400" : "text-slate-500"}`}>
                        {normalizeRole(contact.role)}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {contact.last_message_at ? (
                        <span className={`text-[10px] ${studentMode ? "text-slate-400" : "text-slate-500"}`}>
                          {formatConversationTime(contact.last_message_at)}
                        </span>
                      ) : null}
                      {Number(contact.unread_count || 0) > 0 ? (
                        <span className="rounded-full bg-emerald-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                          {contact.unread_count}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  {contact.last_message ? (
                    <p className={`mt-1 truncate text-xs ${studentMode ? "text-slate-400" : "text-slate-500"}`}>
                      {contact.last_message}
                    </p>
                  ) : null}
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete the conversation with ${contact.name}? This action cannot be undone.`)) {
                      void deleteConversation(contact.id);
                    }
                  }}
                  className={`ml-2 p-1 rounded text-xs ${
                    studentMode 
                      ? "text-red-400 hover:bg-red-900/20" 
                      : "text-red-500 hover:bg-red-50"
                  }`}
                  title="Delete conversation"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
            
            {!recentContacts.length && !search && (
              <p className={`px-3 py-4 text-xs ${studentMode ? "text-slate-400" : "text-slate-500"}`}>
                No recent conversations. Search for users to start chatting.
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <div className={`p-3 border-b ${studentMode ? "border-slate-700" : "border-slate-100"}`}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className={`text-sm font-semibold ${studentMode ? "text-slate-100" : "text-slate-800"}`}>{contactLabel}</p>
                {selected ? (
                  <p className={`text-xs ${studentMode ? "text-slate-400" : "text-slate-500"}`}>
                    {normalizeRole(selectedRole)}
                  </p>
                ) : null}
              </div>
              {selected ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowProfile((prev) => !prev)}
                    className={`rounded-md px-2 py-1 text-xs ${
                      studentMode ? "bg-slate-700 text-slate-200" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {showProfile ? "Hide profile" : "View profile"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!selected) return;
                      const path = studentMode
                        ? `/student/community/profile/${selected.id}`
                        : `/lecturer/community/profile/${selected.id}`;
                      navigate(path);
                    }}
                    className={`rounded-md px-2 py-1 text-xs ${
                      studentMode ? "bg-cyan-600 text-white" : "bg-cyan-500 text-white"
                    }`}
                  >
                    Open full profile
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          {showProfile && selectedProfile ? (
            <div className={`p-4 border-b ${studentMode ? "border-slate-700" : "border-slate-100"}`}>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  {selectedProfile.photo_url ? (
                    <img
                      src={selectedProfile.photo_url}
                      alt={selectedProfile.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center text-lg font-bold ${
                      studentMode ? "bg-slate-600 text-slate-100" : "bg-slate-200 text-slate-700"
                    }`}>
                      {selectedProfile.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className={`text-base font-semibold ${studentMode ? "text-slate-100" : "text-slate-800"}`}>
                      {selectedProfile.name}
                    </h3>
                    <p className={`text-sm ${studentMode ? "text-slate-400" : "text-slate-500"}`}>
                      {normalizeRole(selectedProfile.role)}
                    </p>
                    <p className={`text-xs ${studentMode ? "text-slate-400" : "text-slate-500"}`}>
                      Status: {selectedProfile.status}
                    </p>
                  </div>
                </div>
                
                {selectedProfile.bio && (
                  <div>
                    <h4 className={`text-sm font-medium mb-2 ${studentMode ? "text-slate-200" : "text-slate-700"}`}>
                      About
                    </h4>
                    <p className={`text-sm ${studentMode ? "text-slate-300" : "text-slate-600"}`}>
                      {selectedProfile.bio}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedProfile.email && (
                    <div>
                      <h4 className={`text-sm font-medium mb-2 ${studentMode ? "text-slate-200" : "text-slate-700"}`}>
                        Email
                      </h4>
                      <p className={`text-sm ${studentMode ? "text-slate-300" : "text-slate-600"}`}>
                        {selectedProfile.email}
                      </p>
                    </div>
                  )}

                  {selectedProfile.phone && (
                    <div>
                      <h4 className={`text-sm font-medium mb-2 ${studentMode ? "text-slate-200" : "text-slate-700"}`}>
                        Phone
                      </h4>
                      <p className={`text-sm ${studentMode ? "text-slate-300" : "text-slate-600"}`}>
                        {selectedProfile.phone}
                      </p>
                    </div>
                  )}
                </div>

                {(selectedProfile.city || selectedProfile.state || selectedProfile.country) && (
                  <div>
                    <h4 className={`text-sm font-medium mb-2 ${studentMode ? "text-slate-200" : "text-slate-700"}`}>
                      Location
                    </h4>
                    <p className={`text-sm ${studentMode ? "text-slate-300" : "text-slate-600"}`}>
                      {[selectedProfile.city, selectedProfile.state, selectedProfile.country]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  </div>
                )}

                {selectedProfile.last_active_at && (
                  <div>
                    <h4 className={`text-sm font-medium mb-2 ${studentMode ? "text-slate-200" : "text-slate-700"}`}>
                      Last Active
                    </h4>
                    <p className={`text-sm ${studentMode ? "text-slate-300" : "text-slate-600"}`}>
                      {new Date(selectedProfile.last_active_at).toLocaleDateString()} at{' '}
                      {new Date(selectedProfile.last_active_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                )}

                {selectedProfile.enrolled_courses && selectedProfile.enrolled_courses.length > 0 && (
                  <div>
                    <h4 className={`text-sm font-medium mb-2 ${studentMode ? "text-slate-200" : "text-slate-700"}`}>
                      Enrolled Courses ({selectedProfile.enrolled_courses.length})
                    </h4>
                    <div className="space-y-1">
                      {selectedProfile.enrolled_courses.slice(0, 3).map((course) => (
                        <div key={course.id} className={`text-sm ${studentMode ? "text-slate-300" : "text-slate-600"}`}>
                          • {course.title}
                        </div>
                      ))}
                      {selectedProfile.enrolled_courses.length > 3 && (
                        <div className={`text-xs ${studentMode ? "text-slate-400" : "text-slate-500"}`}>
                          ...and {selectedProfile.enrolled_courses.length - 3} more courses
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {/* Messages area - only this should scroll */}
          <div
            ref={messagesContainerRef}
            onScroll={handleMessagesScroll}
            className={`flex-1 overflow-y-auto p-3 ${studentMode ? "bg-slate-900" : "bg-slate-50"}`}
          >
            {!selected ? (
              <p className={`text-center text-sm ${studentMode ? "text-slate-400" : "text-slate-500"}`}>
                Select a conversation or search for users to start messaging.
              </p>
            ) : messages.length === 0 ? (
              <p className={`text-center text-sm ${studentMode ? "text-slate-400" : "text-slate-500"}`}>
                No messages yet. Start the conversation!
              </p>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => {
                  const isOwn = msg.sender_id === user?.id;
                  const isEditing = msg.id === editingMessageId;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-3 py-2 ${
                          isOwn
                            ? studentMode
                              ? "bg-cyan-600 text-white"
                              : "bg-cyan-500 text-white"
                            : studentMode
                              ? "bg-slate-700 text-slate-100"
                              : "bg-white text-slate-800 border border-slate-200"
                        }`}
                      >
                        {msg.is_deleted ? (
                          <p className={`text-xs italic ${isOwn ? "text-cyan-100" : studentMode ? "text-slate-400" : "text-slate-500"}`}>
                            message deleted
                          </p>
                        ) : isEditing ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  void saveEdit(msg.id);
                                } else if (e.key === "Escape") {
                                  setEditingMessageId(null);
                                  setEditingText("");
                                }
                              }}
                              className={`rounded px-2 py-1 text-xs ${
                                studentMode
                                  ? "bg-slate-600 text-slate-100"
                                  : "bg-white text-slate-800 border border-slate-300"
                              }`}
                              autoFocus
                            />
                            <button
                              onClick={() => void saveEdit(msg.id)}
                              className={`rounded px-2 py-1 text-xs ${
                                studentMode
                                  ? "bg-slate-500 text-slate-100"
                                  : "bg-slate-200 text-slate-700"
                              }`}
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <>
                            <p className={`text-sm break-words ${isOwn ? "text-white" : ""}`}>
                              {msg.content}
                            </p>
                            <div className={`mt-1 flex items-center gap-2 ${isOwn ? "justify-end" : "justify-start"}`}>
                              <span className={`text-[10px] ${isOwn ? "text-cyan-100" : studentMode ? "text-slate-400" : "text-slate-500"}`}>
                                {formatTime(msg.created_at)}
                              </span>
                              {!isOwn && !msg.is_read && Number(msg.id) > 0 ? (
                                <button
                                  onClick={() => void markAsRead(msg.id)}
                                  className={`text-[10px] underline ${isOwn ? "text-cyan-100" : studentMode ? "text-slate-400" : "text-slate-500"}`}
                                >
                                  Mark as read
                                </button>
                              ) : null}
                              {isOwn && Number(msg.id) > 0 ? (
                                <>
                                  <button
                                    onClick={() => beginEdit(msg)}
                                    className={`text-[10px] underline ${isOwn ? "text-cyan-100" : studentMode ? "text-slate-400" : "text-slate-500"}`}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => void removeMessage(msg.id)}
                                    className={`text-[10px] underline ${isOwn ? "text-cyan-100" : studentMode ? "text-slate-400" : "text-slate-500"}`}
                                  >
                                    Delete
                                  </button>
                                </>
                              ) : null}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messageEndRef} />
              </div>
            )}
          </div>

          {/* Typing bar - fixed at bottom */}
          {selected && (
            <div className={`p-3 border-t ${studentMode ? "border-slate-700" : "border-slate-100"}`}>
              {error && (
                <p className={`mb-2 text-xs ${studentMode ? "text-red-400" : "text-red-600"}`}>{error}</p>
              )}
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={onMessageKeyDown}
                  placeholder="Type a message..."
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm ${
                    studentMode
                      ? "border-slate-600 bg-slate-700 text-slate-100 placeholder-slate-400"
                      : "border-slate-200 bg-white text-slate-800 placeholder-slate-500"
                  }`}
                />
                <button
                  onClick={() => void send()}
                  disabled={!messageText.trim()}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    messageText.trim()
                      ? studentMode
                        ? "bg-cyan-600 text-white hover:bg-cyan-700"
                        : "bg-cyan-500 text-white hover:bg-cyan-600"
                      : studentMode
                        ? "bg-slate-600 text-slate-400"
                        : "bg-slate-200 text-slate-400"
                  }`}
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {quickEmojis.slice(0, 10).map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => appendToMessage(emoji)}
                    className={`rounded px-2 py-1 text-xs ${
                      studentMode
                        ? "bg-slate-700 text-slate-200 hover:bg-slate-600"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
