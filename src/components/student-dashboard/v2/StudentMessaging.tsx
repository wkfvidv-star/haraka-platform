import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, MessageSquare, Check, CheckCheck, 
  User, Clock, AlertCircle, Paperclip, MoreVertical, 
  ArrowRight, Search, Phone, Video, Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { youthDataService, YouthMessage } from '@/services/youthDataService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export function StudentMessaging() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<YouthMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadMessages = () => {
      const msgs = youthDataService.getMessages();
      setMessages(msgs);
      setLoading(false);
      youthDataService.markMessagesAsSeen();
    };

    loadMessages();

    const handleNewMessage = (e: any) => {
      setMessages(prev => [...prev, e.detail]);
      youthDataService.markMessagesAsSeen();
    };

    window.addEventListener('haraka_new_coach_message', handleNewMessage);
    return () => window.removeEventListener('haraka_new_coach_message', handleNewMessage);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = youthDataService.sendMessage(inputText);
    setMessages(prev => [...prev, newMessage]);
    setInputText('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] max-h-[800px] bg-white dark:bg-[#0B0E14] rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-xl overflow-hidden">
      
      {/* Header */}
      <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg relative">
            <User className="w-6 h-6 text-white" />
            <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-[#0B0E14] rounded-full" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">الأستاذ / المدرب المسؤول</h3>
            <p className="text-sm text-emerald-500 font-bold">متصل الآن (Online)</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400">
            <Search className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-opacity-5"
      >
        <div className="text-center py-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 dark:bg-white/5 px-4 py-1.5 rounded-full">اليوم</span>
        </div>

        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                "flex w-full mb-4",
                msg.sender === 'youth' ? "justify-end" : "justify-start"
              )}
            >
              <div className={cn(
                "max-w-[80%] rounded-2xl px-5 py-3 shadow-sm",
                msg.sender === 'youth' 
                  ? "bg-indigo-600 text-white rounded-tr-none" 
                  : "bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-white/5"
              )}>
                <p className="text-base font-bold leading-relaxed">{msg.text}</p>
                <div className={cn(
                  "flex items-center gap-1.5 mt-1.5 justify-end opacity-60",
                  msg.sender === 'youth' ? "text-indigo-100" : "text-slate-400"
                )}>
                  <span className="text-[10px] font-bold">
                    {new Date(msg.timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {msg.sender === 'youth' && (
                    msg.status === 'seen' ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
        <div className="flex items-center gap-3 bg-white dark:bg-white/5 rounded-2xl px-4 py-2 border border-slate-200 dark:border-white/10 focus-within:border-indigo-500/50 transition-all shadow-inner">
          <button type="button" className="p-2 text-slate-400 hover:text-indigo-500 transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="اكتب رسالتك هنا..."
            className="flex-1 bg-transparent border-none outline-none text-slate-800 dark:text-slate-200 font-bold py-2"
          />
          <button 
            type="submit"
            disabled={!inputText.trim()}
            className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:grayscale text-white rounded-xl shadow-lg shadow-indigo-500/20 transition-all"
          >
            <Send className="w-5 h-5 flex-shrink-0 mirror-rtl" />
          </button>
        </div>
      </form>
    </div>
  );
}
