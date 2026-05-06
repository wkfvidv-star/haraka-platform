import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, Users, MessageSquare, Heart, Star, 
  X, Mic, Camera, Share2, Award, Zap, 
  Flame, ShieldCheck, Crown, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface LiveStreamHubProps {
  userRole: 'teacher' | 'coach';
  userName: string;
  onClose: () => void;
}

export function LiveStreamHub({ userRole, userName, onClose }: LiveStreamHubProps) {
  const [isLive, setIsLive] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [hearts, setHearts] = useState<{ id: number, x: number }[]>([]);
  const [messages, setMessages] = useState<{ id: number, user: string, text: string }[]>([]);
  const [reputationXP, setReputationXP] = useState(0);
  
  const chatRef = useRef<HTMLDivElement>(null);

  // Mock viewers and chat
  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        setViewerCount(prev => prev + Math.floor(Math.random() * 5));
        setReputationXP(prev => prev + 10);
        
        const mockUsers = ['ياسين', 'أمين', 'سارة', 'ليلى', 'كريم', 'محمد'];
        const mockMsgs = [
          'شكراً أستاذ على هذه النصيحة!',
          'كيف يمكنني تحسين ركضي؟',
          'واو! تمرين مذهل',
          'هل هذا التمرين مناسب للمبتدئين؟',
          'أفضل مدرب في المنصة 🔥',
          'تحية من وهران!'
        ];
        
        const newMsg = {
          id: Date.now(),
          user: mockUsers[Math.floor(Math.random() * mockUsers.length)],
          text: mockMsgs[Math.floor(Math.random() * mockMsgs.length)]
        };
        
        setMessages(prev => [...prev.slice(-15), newMsg]);
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [isLive]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleLive = () => {
    if (!isLive) {
      toast.success('أنت الآن على الهواء مباشرة! 🔴');
      setIsLive(true);
      setViewerCount(12);
    } else {
      setIsLive(false);
      onClose();
    }
  };

  const spawnHeart = () => {
    const id = Date.now();
    setHearts(prev => [...prev, { id, x: Math.random() * 100 - 50 }]);
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== id));
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col md:flex-row overflow-hidden font-arabic" dir="rtl">
      
      {/* ── Video Area ── */}
      <div className="flex-1 relative bg-slate-900 overflow-hidden">
        {/* Mock Camera Preview */}
        <div className="absolute inset-0 flex items-center justify-center">
           {!isLive ? (
             <div className="text-center space-y-6 max-w-md p-8">
                <div className="w-24 h-24 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-blue-500/50">
                   <Video className="w-10 h-10 text-blue-400" />
                </div>
                <h2 className="text-3xl font-black text-white">جاهز للانطلاق؟ 🎥</h2>
                <p className="text-slate-400 font-medium leading-relaxed">
                  ابدأ بثاً مباشراً الآن لمشاركة خبرتك مع {userRole === 'teacher' ? 'تلاميذك' : 'الشباب'}. سيؤدي هذا لزيادة نقاط شهرتك في المنصة.
                </p>
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 space-y-3">
                   <div className="flex justify-between text-xs font-bold text-slate-400">
                      <span>الشهرة المتوقعة</span>
                      <span className="text-blue-400">+500 XP</span>
                   </div>
                   <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-3/4" />
                   </div>
                </div>
                <Button onClick={toggleLive} className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white font-black text-xl rounded-2xl shadow-xl shadow-blue-900/40">
                  بدء البث المباشر
                </Button>
             </div>
           ) : (
             <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40">
                {/* Mock Live Content */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                   <div className="w-64 h-64 border-8 border-white/10 rounded-full animate-ping" />
                </div>
                
                {/* Floating Hearts Container */}
                <div className="absolute bottom-20 left-10 pointer-events-none">
                   <AnimatePresence>
                     {hearts.map(h => (
                       <motion.div
                         key={h.id}
                         initial={{ y: 0, opacity: 1, scale: 1 }}
                         animate={{ y: -400, opacity: 0, scale: 1.5, x: h.x }}
                         exit={{ opacity: 0 }}
                         transition={{ duration: 2, ease: "easeOut" }}
                         className="absolute"
                       >
                         <Heart className="text-rose-500 fill-rose-500 w-8 h-8" />
                       </motion.div>
                     ))}
                   </AnimatePresence>
                </div>
             </div>
           )}
        </div>

        {/* Live Overlay UI */}
        <AnimatePresence>
          {isLive && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none"
            >
              <div className="flex items-center justify-between pointer-events-auto">
                <div className="flex items-center gap-3">
                   <div className="bg-rose-600 text-white px-3 py-1 rounded-lg font-black text-xs animate-pulse">LIVE</div>
                   <div className="bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-lg flex items-center gap-2 text-xs font-bold border border-white/10">
                      <Users className="w-3 h-3 text-blue-400" /> {viewerCount}
                   </div>
                </div>
                <Button onClick={toggleLive} variant="ghost" className="bg-black/20 text-white hover:bg-white/10 rounded-full p-2 h-auto">
                   <X className="w-6 h-6" />
                </Button>
              </div>

              <div className="flex justify-between items-end">
                 <div className="space-y-4 pointer-events-auto">
                    {/* XP Indicator */}
                    <div className="bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center gap-3">
                       <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center shadow-lg shadow-amber-900/20">
                          <Crown className="w-4 h-4 text-white" />
                       </div>
                       <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Reputation XP</p>
                          <p className="text-sm font-black text-white">{reputationXP}</p>
                       </div>
                    </div>
                 </div>
                 
                 <div className="flex flex-col gap-4 pointer-events-auto">
                    <button onClick={spawnHeart} className="w-14 h-14 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-xl shadow-rose-900/40 hover:scale-110 active:scale-90 transition-transform">
                       <Heart className="w-8 h-8 fill-rose-500" />
                    </button>
                    <button className="w-12 h-12 bg-white/10 text-white rounded-full flex items-center justify-center backdrop-blur-md border border-white/10">
                       <Share2 className="w-5 h-5" />
                    </button>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Side Area: Chat & Community ── */}
      <div className="w-full md:w-96 bg-slate-900 border-r border-white/5 flex flex-col shrink-0">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg">
                 {userName.charAt(0)}
              </div>
              <div>
                 <h3 className="text-white font-black text-sm">{userName}</h3>
                 <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{userRole === 'teacher' ? 'أستاذ خبير' : 'مدرب محترف'}</p>
              </div>
           </div>
           <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-white font-black text-sm">4.9</span>
           </div>
        </div>

        {/* Chat Feed */}
        <div 
          ref={chatRef}
          className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide"
        >
           {messages.map(msg => (
             <motion.div 
               initial={{ opacity: 0, x: -10 }}
               animate={{ opacity: 1, x: 0 }}
               key={msg.id} 
               className="flex gap-3"
             >
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] text-slate-400 font-bold shrink-0">
                   {msg.user.charAt(0)}
                </div>
                <div className="bg-slate-800/40 rounded-2xl rounded-tr-none p-3 border border-white/5">
                   <p className="text-[10px] text-blue-400 font-black mb-1">{msg.user}</p>
                   <p className="text-xs text-slate-100 font-medium leading-relaxed">{msg.text}</p>
                </div>
             </motion.div>
           ))}
           {messages.length === 0 && (
             <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4">
                <MessageSquare className="w-12 h-12 opacity-20" />
                <p className="text-xs font-bold">بانتظار انضمام المشاهدين...</p>
             </div>
           )}
        </div>

        {/* Gifts / Interaction Bar */}
        <div className="p-6 bg-slate-950/50 border-t border-white/5">
           <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-12 bg-slate-800/50 border border-white/10 rounded-xl px-4 flex items-center">
                 <input 
                   type="text" 
                   placeholder="اكتب رسالة..." 
                   className="bg-transparent border-none text-white text-xs font-bold w-full focus:outline-none placeholder:text-slate-600"
                 />
              </div>
              <Button className="h-12 w-12 rounded-xl bg-blue-600 p-0">
                 <Send className="w-5 h-5 text-white" />
              </Button>
           </div>
           
           <div className="flex justify-between items-center bg-slate-800/30 p-2 rounded-xl border border-white/5">
              <div className="flex gap-2">
                 <div className="w-8 h-8 bg-amber-500/10 text-amber-500 rounded-lg flex items-center justify-center cursor-pointer hover:bg-amber-500/20 transition-colors">
                    <Award className="w-4 h-4" />
                 </div>
                 <div className="w-8 h-8 bg-blue-500/10 text-blue-500 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-500/20 transition-colors">
                    <Zap className="w-4 h-4" />
                 </div>
                 <div className="w-8 h-8 bg-emerald-500/10 text-emerald-500 rounded-lg flex items-center justify-center cursor-pointer hover:bg-emerald-500/20 transition-colors">
                    <Flame className="w-4 h-4" />
                 </div>
              </div>
              <p className="text-[10px] text-slate-500 font-black">هدايا الدعم 💎</p>
           </div>
        </div>
      </div>
    </div>
  );
}

function Send(props: any) { return <ArrowRight {...props} />; }
