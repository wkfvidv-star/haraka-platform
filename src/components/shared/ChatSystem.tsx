import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, MessageCircle, Users, X, Minimize2, Maximize2, Circle } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface ChatMessage {
  id: string;
  roomId: string;
  senderName: string;
  senderRole: string;
  text: string;
  timestamp: string; // ISO
  isSystem?: boolean;
}

export interface ChatRoom {
  id: string;
  label: string;
  emoji: string;
  allowedRole: string; // only this role can access
  description: string;
  color: string;
}

// ─── Room definitions ─────────────────────────────────────────────────────────
export const CHAT_ROOMS: ChatRoom[] = [
  { id: 'coaches',       label: 'غرفة المدربين',    emoji: '🏋️', allowedRole: 'coach',       description: 'تواصل بين المدربين', color: 'from-orange-500 to-red-500' },
  { id: 'teachers',      label: 'غرفة الأساتذة',    emoji: '📚', allowedRole: 'teacher',     description: 'تواصل بين الأساتذة', color: 'from-blue-500 to-indigo-600' },
  { id: 'parents',       label: 'غرفة الأولياء',    emoji: '👨‍👩‍👧', allowedRole: 'parent',      description: 'تواصل بين الأولياء', color: 'from-emerald-500 to-teal-600' },
  { id: 'principals',    label: 'غرفة المدراء',     emoji: '🏫', allowedRole: 'principal',   description: 'تواصل بين مدراء المدارس', color: 'from-violet-500 to-purple-600' },
  { id: 'directorates',  label: 'غرفة المديريات',  emoji: '🏛️', allowedRole: 'directorate', description: 'تواصل بين المديريات', color: 'from-slate-700 to-slate-900' },
  { id: 'ministry',      label: 'غرفة الوزارة',    emoji: '⚖️', allowedRole: 'ministry',    description: 'قناة الوزارة الرسمية', color: 'from-amber-600 to-orange-600' },
];

// ─── Storage helpers ──────────────────────────────────────────────────────────
function storageKey(roomId: string) { return `haraka_chat_${roomId}`; }

function loadMessages(roomId: string): ChatMessage[] {
  try { return JSON.parse(localStorage.getItem(storageKey(roomId)) || '[]'); }
  catch { return []; }
}

function saveMessage(msg: ChatMessage) {
  const all = loadMessages(msg.roomId);
  all.push(msg);
  // keep last 200 messages
  if (all.length > 200) all.splice(0, all.length - 200);
  localStorage.setItem(storageKey(msg.roomId), JSON.stringify(all));
}

// ─── ChatBubble ───────────────────────────────────────────────────────────────
function ChatBubble({ msg, isOwn }: { msg: ChatMessage; isOwn: boolean }) {
  if (msg.isSystem) {
    return (
      <div className="text-center py-1">
        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{msg.text}</span>
      </div>
    );
  }
  const t = new Date(msg.timestamp);
  const time = `${t.getHours().toString().padStart(2,'0')}:${t.getMinutes().toString().padStart(2,'0')}`;

  return (
    <div className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center text-white text-xs font-black shrink-0 mt-auto">
        {msg.senderName.charAt(0)}
      </div>
      {/* Bubble */}
      <div className={`max-w-[75%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
        {!isOwn && <p className="text-[10px] font-black text-slate-400 px-1">{msg.senderName}</p>}
        <div className={`px-4 py-2.5 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${
          isOwn
            ? 'bg-orange-500 text-white rounded-tr-md'
            : 'bg-white border border-slate-100 text-slate-800 rounded-tl-md'
        }`}>
          {msg.text}
        </div>
        <p className={`text-[10px] font-bold text-slate-400 px-1 ${isOwn ? 'text-right' : 'text-left'}`}>{time}</p>
      </div>
    </div>
  );
}

// ─── ChatPanel (single room) ─────────────────────────────────────────────────
function ChatPanel({ room, senderName, senderRole }: {
  room: ChatRoom;
  senderName: string;
  senderRole: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadMessages(room.id));
  const [text, setText] = useState('');
  const [onlineCount, setOnlineCount] = useState(1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<BroadcastChannel | null>(null);

  // Setup BroadcastChannel for real-time sync
  useEffect(() => {
    const ch = new BroadcastChannel(`haraka_chat_${room.id}`);
    channelRef.current = ch;
    ch.onmessage = (e) => {
      if (e.data.type === 'message') {
        setMessages(prev => [...prev, e.data.payload]);
      } else if (e.data.type === 'online') {
        setOnlineCount(count => Math.max(count, e.data.count));
      }
    };

    // Announce presence
    const announceInterval = setInterval(() => {
      ch.postMessage({ type: 'online', count: 1 });
    }, 10000);

    return () => {
      ch.close();
      clearInterval(announceInterval);
    };
  }, [room.id]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function send(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    const msg: ChatMessage = {
      id: `${Date.now()}-${Math.random()}`,
      roomId: room.id,
      senderName,
      senderRole,
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };
    saveMessage(msg);
    setMessages(prev => [...prev, msg]);
    channelRef.current?.postMessage({ type: 'message', payload: msg });
    setText('');
  }

  return (
    <div className="flex flex-col h-full" dir="rtl">
      {/* Room header */}
      <div className={`bg-gradient-to-r ${room.color} p-4 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{room.emoji}</span>
          <div>
            <h4 className="font-black text-white text-base">{room.label}</h4>
            <p className="text-white/70 text-xs font-bold">{room.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-white/20 px-2.5 py-1 rounded-full">
          <Circle className="w-2 h-2 text-emerald-300 fill-emerald-300 animate-pulse" />
          <span className="text-white text-xs font-black">{onlineCount} متصل</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 min-h-0">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="font-bold text-sm">لا توجد رسائل بعد</p>
            <p className="text-xs mt-1">كن أوّل من يبدأ المحادثة!</p>
          </div>
        ) : (
          messages.map(msg => (
            <ChatBubble
              key={msg.id}
              msg={msg}
              isOwn={msg.senderName === senderName && msg.senderRole === senderRole}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={send} className="p-3 bg-white border-t border-slate-100 flex gap-2">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={`اكتب رسالة في ${room.label}...`}
          className="flex-1 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-orange-400 transition-colors bg-slate-50"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="w-10 h-10 bg-orange-500 text-white rounded-2xl flex items-center justify-center hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-orange-500/30"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

// ─── Main ChatSystem export ───────────────────────────────────────────────────
interface ChatSystemProps {
  /** Role of the current user (must match ChatRoom.allowedRole) */
  userRole: string;
  userName: string;
  /** Whether to start open or collapsed */
  defaultOpen?: boolean;
  /** Show as inline panel (true) or floating widget (false) */
  inline?: boolean;
}

export function ChatSystem({ userRole, userName, defaultOpen = false, inline = true }: ChatSystemProps) {
  const myRoom = CHAT_ROOMS.find(r => r.allowedRole === userRole);
  const [open, setOpen] = useState(defaultOpen);
  const [minimized, setMinimized] = useState(false);

  if (!myRoom) return null; // no chat for this role

  if (inline) {
    return (
      <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden" style={{ height: 520 }}>
        {/* Inline full panel */}
        <div className="flex flex-col h-full">
          <ChatPanel room={myRoom} senderName={userName} senderRole={userRole} />
        </div>
      </div>
    );
  }

  // Floating widget
  return (
    <div className="fixed bottom-24 left-6 z-50" dir="rtl">
      {open && !minimized && (
        <div className="bg-white rounded-[1.5rem] shadow-2xl border border-slate-200 overflow-hidden mb-3 flex flex-col" style={{ width: 360, height: 480 }}>
          <div className="flex items-center justify-between p-3 border-b border-slate-100 bg-slate-50">
            <span className="font-black text-slate-900 text-sm flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-orange-500" />
              {myRoom.label}
            </span>
            <div className="flex gap-1">
              <button onClick={() => setMinimized(true)} className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-400 transition-colors">
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-400 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <ChatPanel room={myRoom} senderName={userName} senderRole={userRole} />
          </div>
        </div>
      )}
      {open && minimized && (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-3 mb-3 flex items-center gap-3">
          <span className="font-black text-slate-900 text-sm">{myRoom.emoji} {myRoom.label}</span>
          <button onClick={() => setMinimized(false)} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setOpen(false)} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      {/* FAB */}
      <button
        onClick={() => { setOpen(v => !v); setMinimized(false); }}
        className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 bg-gradient-to-br ${myRoom.color}`}
      >
        {open ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
      </button>
    </div>
  );
}

export default ChatSystem;
