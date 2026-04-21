import { useEffect, useMemo, useRef, useState } from "react";
import { Send } from "lucide-react";
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
  if (value === "instructor" || value === "lecturer" || value === "teacher") return "Teacher";
  if (value === "student") return "Student";
  if (!value) return "User";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function CommunityChat({ studentMode = false }: { studentMode?: boolean }) {
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
  const quickStickers = ["🌟 Great job!", "🎓 Keep going!", "🚀 You got this!", "💪 Stay strong!", "✅ Done!"];

  const filteredContacts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const base = contacts.filter((contact) => contact.id !== user?.id);
    if (!query) return base;
    return base.filter(
      (contact) =>
        contact.name.toLowerCase().includes(query) ||
        String(contact.role || "").toLowerCase().includes(query)
    );
  }, [contacts, search, user?.id]);

  const activeSearchContacts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const active = contacts.filter(
      (contact) => contact.id !== user?.id && String(contact.status || "").toLowerCase() === "active"
    );
    if (!query) return active;
    return active.filter(
      (contact) =>
        contact.name.toLowerCase().includes(query) ||
        String(contact.role || "").toLowerCase().includes(query)
    );
  }, [contacts, search, user?.id]);

  useEffect(() => {
    async function loadContacts() {
      if (!accessToken) return;
      try {
        const data = studentMode
          ? await communityService.getStudentChatContacts(accessToken)
          : await communityService.getChatContacts(accessToken);
        const safeContacts = data.filter((contact) => contact.id !== user?.id);
        setContacts(safeContacts);
        if (!selected && safeContacts.length > 0) setSelected(safeContacts[0]);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load contacts");
      }
    }
    void loadContacts();
    const interval = setInterval(loadContacts, 15000);
    return () => clearInterval(interval);
  }, [accessToken, selected, studentMode, user?.id]);

  useEffect(() => {
    if (!selected) return;
    if (!filteredContacts.some((contact) => contact.id === selected.id)) {
      setSelected(filteredContacts[0] || null);
    }
  }, [filteredContacts, selected]);

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
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load messages");
      }
    }
    
    // Load messages immediately
    void loadMessages();
    
    // Set up polling for new messages every 5 seconds
    const interval = setInterval(loadMessages, 5000);
    
    return () => clearInterval(interval);
  }, [accessToken, selected?.id, studentMode]);

  useEffect(() => {
    if (!shouldAutoScroll) return;
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, shouldAutoScroll]);

  async function send() {
    if (!accessToken || !selected || !messageText.trim()) return;
    if (selected.id === user?.id) {
      setError("You cannot chat with yourself.");
      return;
    }
    
    try {
      setError("");
      if (studentMode) {
        await communityService.sendStudentMessage(accessToken, selected.id, messageText.trim());
      } else {
        await communityService.sendMessage(accessToken, selected.id, messageText.trim());
      }
      
      // Refresh messages to show the new one
      const data = studentMode
        ? await communityService.getStudentMessages(accessToken, selected.id)
        : await communityService.getMessages(accessToken, selected.id);
      setMessages(data);
      setShouldAutoScroll(true);
      setMessageText("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send message");
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

  const contactLabel = useMemo(() => selected?.name || "Select contact", [selected]);
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
      className={`${studentMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"} min-h-[680px] rounded-2xl border shadow-sm overflow-hidden`}
    >
      <div className="grid h-full grid-cols-1 md:grid-cols-[280px,1fr]">
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
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                placeholder="Search active students/teachers..."
                className={`w-full rounded-lg border px-3 py-2 text-xs font-normal ${
                  studentMode ? "border-slate-600 bg-slate-700 text-slate-100" : "border-slate-200 bg-white text-slate-800"
                }`}
              />
              {searchOpen ? (
                <div
                  className={`absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border ${
                    studentMode ? "border-slate-600 bg-slate-800" : "border-slate-200 bg-white"
                  }`}
                >
                  {activeSearchContacts.map((contact) => (
                    <button
                      key={`active-${contact.id}`}
                      type="button"
                      onClick={() => {
                        setSelected(contact);
                        setSearchOpen(false);
                        setShowProfile(true);
                      }}
                      className={`block w-full px-3 py-2 text-left text-xs ${
                        studentMode ? "text-slate-200 hover:bg-slate-700" : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {contact.name} ({normalizeRole(contact.role)})
                    </button>
                  ))}
                  {!activeSearchContacts.length ? (
                    <p className={`px-3 py-2 text-xs ${studentMode ? "text-slate-400" : "text-slate-500"}`}>
                      No active users found.
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
          {filteredContacts.map((contact) => (
            <button
              key={contact.id}
              className={`w-full text-left px-3 py-2 border-b ${
                studentMode ? "border-slate-700 hover:bg-slate-700" : "border-slate-50 hover:bg-slate-50"
              } ${selected?.id === contact.id ? (studentMode ? "bg-slate-700" : "bg-sky-50") : ""}`}
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
          ))}
          {!filteredContacts.length ? (
            <p className={`px-3 py-4 text-xs ${studentMode ? "text-slate-400" : "text-slate-500"}`}>
              Live messages require at least two users. Add another student or teacher account to start chatting.
            </p>
          ) : null}
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
                        : `/community/profile/${selected.id}`;
                      navigate(path);
                    }}
                    className="rounded-md bg-sky-700 px-2 py-1 text-xs text-white"
                  >
                    Open full profile
                  </button>
                </div>
              ) : null}
            </div>
            {showProfile && selectedProfile ? (
              <div className={`mt-2 rounded-lg border p-2 ${studentMode ? "border-slate-600 bg-slate-700" : "border-slate-200 bg-slate-50"}`}>
                <div className="flex items-center gap-2">
                  {selectedProfile.photo_url ? (
                    <img
                      src={selectedProfile.photo_url}
                      alt={selectedProfile.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold ${studentMode ? "bg-slate-600 text-slate-100" : "bg-slate-200 text-slate-700"}`}>
                      {selectedProfile.name.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 pr-1">
                    <p className={`break-words whitespace-normal text-sm font-semibold ${studentMode ? "text-slate-100" : "text-slate-800"}`}>{selectedProfile.name}</p>
                    <p className={`text-xs ${studentMode ? "text-slate-300" : "text-slate-600"}`}>
                      {normalizeRole(selectedProfile.role)} · {String(selectedProfile.status || "active")}
                    </p>
                    {(selectedProfile.city || selectedProfile.country) ? (
                      <p className={`text-xs ${studentMode ? "text-slate-400" : "text-slate-500"}`}>
                        {[selectedProfile.city, selectedProfile.country].filter(Boolean).join(", ")}
                      </p>
                    ) : null}
                  </div>
                </div>
                {selectedProfile.bio ? (
                  <p className={`mt-2 whitespace-pre-wrap text-xs ${studentMode ? "text-slate-300" : "text-slate-600"}`}>{selectedProfile.bio}</p>
                ) : null}
              </div>
            ) : null}
          </div>
          <div
            ref={messagesContainerRef}
            onScroll={handleMessagesScroll}
            className={`flex-1 overflow-y-auto overscroll-contain p-3 space-y-2 ${studentMode ? "bg-slate-900" : "bg-slate-50"}`}
          >
            {messages.map((msg) => {
              const mine = msg.sender_id === user?.id;
              return (
                <div key={msg.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] rounded-xl px-3 py-2 text-sm ${
                    mine
                      ? "bg-sky-700 text-white"
                      : studentMode
                        ? "bg-slate-700 border border-slate-600 text-slate-200"
                        : "bg-white border border-slate-200 text-slate-700"
                  }`}>
                    {editingMessageId === msg.id ? (
                      <div className="space-y-2">
                        <input
                          value={editingText}
                          onChange={(event) => setEditingText(event.target.value)}
                          className={`w-full rounded border px-2 py-1 text-xs ${
                            mine ? "border-sky-200 text-slate-800" : "border-slate-500 bg-slate-800 text-slate-100"
                          }`}
                        />
                        <div className="flex items-center gap-2 text-[10px]">
                          <button type="button" onClick={() => void saveEdit(msg.id)} className="rounded bg-emerald-600 px-2 py-1 text-white">Save</button>
                          <button type="button" onClick={() => { setEditingMessageId(null); setEditingText(""); }} className="rounded bg-slate-500 px-2 py-1 text-white">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <p>{msg.content}</p>
                    )}
                    <p className={`mt-1 text-[10px] ${mine ? "text-sky-100" : "text-slate-400"}`}>{formatTime(msg.created_at)}</p>
                    <div className="mt-1 flex items-center gap-2 text-[10px]">
                      {msg.edited_at ? <span className={mine ? "text-sky-100" : "text-slate-400"}>edited</span> : null}
                      {!mine && msg.recipient_id === user?.id && !msg.is_read ? (
                        <button type="button" onClick={() => void markAsRead(msg.id)} className="text-emerald-300">Mark read</button>
                      ) : null}
                      {mine && !msg.is_deleted ? (
                        <>
                          <button type="button" onClick={() => beginEdit(msg)} className="text-amber-200">Edit</button>
                          <button type="button" onClick={() => void removeMessage(msg.id)} className="text-rose-200">Delete</button>
                          {msg.is_read ? <span className="text-emerald-200">Read</span> : <span className="text-sky-100">Sent</span>}
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messageEndRef} />
          </div>
          <div className={`relative p-3 border-t flex gap-2 ${studentMode ? "border-slate-700" : "border-slate-200"}`}>
            {showEmojiPicker ? (
              <div className={`absolute bottom-14 left-3 z-20 w-[300px] rounded-xl border p-3 shadow-xl ${
                studentMode ? "border-slate-600 bg-slate-800" : "border-slate-200 bg-white"
              }`}>
                <p className={`text-xs font-semibold ${studentMode ? "text-slate-200" : "text-slate-700"}`}>Emojis</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {quickEmojis.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => appendToMessage(emoji)}
                      className={`rounded px-2 py-1 text-lg ${studentMode ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-100 hover:bg-slate-200"}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <p className={`mt-3 text-xs font-semibold ${studentMode ? "text-slate-200" : "text-slate-700"}`}>Stickers</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {quickStickers.map((sticker) => (
                    <button
                      key={sticker}
                      type="button"
                      onClick={() => appendToMessage(sticker)}
                      className={`rounded px-2 py-1 text-xs ${studentMode ? "bg-slate-700 text-slate-100 hover:bg-slate-600" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                    >
                      {sticker}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            <button
              type="button"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
              className={`rounded-lg border px-3 text-sm ${studentMode ? "border-slate-600 bg-slate-700 text-slate-100" : "border-slate-200 bg-slate-50 text-slate-700"}`}
              title="Insert emoji or sticker"
            >
              🙂
            </button>
            <input
              ref={inputRef}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={onMessageKeyDown}
              placeholder="Type a message..."
              className={`flex-1 rounded-lg border px-3 py-2 text-sm ${
                studentMode ? "border-slate-600 bg-slate-700 text-slate-100" : "border-slate-200"
              }`}
            />
            <button onClick={() => void send()} disabled={!messageText.trim() || !selected} className="rounded-lg bg-sky-700 px-3 text-white disabled:opacity-50">
              <Send className="h-4 w-4" />
            </button>
          </div>
          {error ? <p className="px-3 pb-2 text-xs text-red-600">{error}</p> : null}
        </div>
      </div>
    </div>
  );
}
