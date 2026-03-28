import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Sparkles, Maximize2, Minimize2, Paperclip, Mic, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  role: 'bot' | 'user';
  content: string;
  timestamp: Date;
}

const AI_KNOWLEDGE_BASE: Record<string, string[]> = {
  'مرحبا': [
    'أهلاً بك أيها البطل في منصة شباب الثورية! أنا مساعدك (Haraka AI)، خبير رياضي وصحي بانتظار استفساراتك.',
    'أهلاً بك! مستعدون لتحطيم أرقامك القياسية اليوم؟ اسألني عن جدولك التدريبي أو التغذوي.',
    'مرحبا! كيف يمكنني مساعدتك اليوم لرفع مستوى أدائك الأكاديمي والرياضي؟'
  ],
  'سرع': [ // للسرعة / اسرع
    'للأداء الانفجاري، جرب الخطة التدريبية الخاصة بالسرعة. يمكنك أيضاً رفع فيديو لركضك وسأقوم بتحليل زاويا الدفع الخاصة بك.',
    'السرعة تبدأ من التوافق العضلي العصبي، توجه لقسم "التمارين" وابدأ بتمارين الرشاقة (Agility). هل ترغب في جدولة حصة؟'
  ],
  'ارهاق': [ // ارهاق / تعب
    'التعافي هو نصف التدريب! أنصحك في قسم التطور الشامل باختيار "الدعم النفسي". كما يمكنك تسجيل مؤشرات نومك من قسم المؤشرات الحيوية.',
    'أرى أنك مجهد. ربما عليك تجربة جلسة "تنفس وتأمل" من قسم الدعم النفسي اليوم بدلاً من التدريب العنيف.'
  ],
  'مختبر': [
    'مختبر الحركة الذكي هو عينك الخبيرة. استخدم كاميرا جهازك وسأقوم ببناء مجسم 3D لمفاصلك لاكتشاف نقاط ضعفك بدقة ميليمترية!',
    'في مختبر الحركة، لا مجال للتخمين. نقوم برصد زوايا ركبتيك وحوضك أثناء التمارين لتجنب الإصابات.'
  ],
  'سوار': [
    'لربط السوار، اذهب ليمين الشاشة واضغط على "ربط سوار ذكي"، سيتم مزامنة نبضات قلبك ومعدل الأكسجين تلقائياً مع خطتك التكيفية.'
  ]
};

const DYNAMIC_FALLBACKS = [
    "سؤال مثير للاهتمام! لضمان دقة إجابتي، هل يمكنك ربط هذا باستفسار عن أدائك الحركي أو الأكاديمي؟",
    "كمحرك ذكاء اصطناعي متخصص، أقوم بجمع بياناتك لتقديم إجابة مخصصة. هل تريد أن نراجع تقريرك الأخير معاً؟",
    "فهمت ما تقصده. يمكنك دائماً التوجه لمختبر الذكاء الاصطناعي (AI Motion Lab) لتجربة هذه المفاهيم بشكل عملي واستكشاف مقاييسك.",
    "هذا يحتاج لتحليل متقدم! سأقوم بتوثيق ملاحظتك في ملف 'التطور الشامل' الخاص بك.",
    "لدينا تحديات جديدة في قسم 'المسابقات الذكية' قد تثير حماسك وتجيب على شغفك بالتطور، هل تود الاطلاع عليها؟"
];

function PortalOverlay({ children, isOpen }: { children: React.ReactNode, isOpen: boolean }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;
    return createPortal(<AnimatePresence>{isOpen && children}</AnimatePresence>, document.body);
}

export function HarakaChatbot({ inline = true }: { inline?: boolean }) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(inline);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'bot',
      content: `مرحباً ${user?.name || 'بك'}! أنا محرك (Haraka AI)، جاهز لتحليل أدائك ومناقشة تفاصيل بياناتك.`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isTyping, isExpanded]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: userMessage, timestamp: new Date() }]);
    setIsTyping(true);

    setTimeout(() => {
      let botContent = DYNAMIC_FALLBACKS[Math.floor(Math.random() * DYNAMIC_FALLBACKS.length)];
      
      const normalizedQuery = userMessage.toLowerCase();
      for (const [key, responses] of Object.entries(AI_KNOWLEDGE_BASE)) {
        if (normalizedQuery.includes(key)) {
          botContent = responses[Math.floor(Math.random() * responses.length)];
          break;
        }
      }

      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'bot', content: botContent, timestamp: new Date() }]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  if (inline) {
    return (
      <div className="w-full relative">
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full bg-slate-900 hover:bg-slate-800 border border-white/10 shadow-2xl rounded-2xl flex items-center justify-between p-3 transition-all duration-300 group overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-rose-600/10 opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-rose-500 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.3)]">
              <Bot className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div className="text-right">
              <h3 className="text-white text-sm font-black leading-none">مساعد الذكاء الاصطناعي</h3>
              <p className="text-orange-400 text-[10px] uppercase font-bold mt-1 tracking-widest">Haraka Engine Active</p>
            </div>
          </div>
          <Maximize2 className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors relative z-10" />
        </button>

        <PortalOverlay isOpen={isExpanded}>
               <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 h-screen w-screen overflow-hidden left-0 top-0">
                  <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{ duration: 0.2 }} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsExpanded(false)} />
                  <motion.div initial={{opacity:0, scale:0.95, y:20}} animate={{opacity:1, scale:1, y:0}} exit={{opacity:0, scale:0.95, y:20}} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="bg-slate-900 border border-orange-500/20 w-full max-w-4xl h-[85vh] rounded-[2rem] flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.8)] relative z-10 overflow-hidden">
                     <div className="p-4 sm:p-6 border-b border-orange-500/20 flex justify-between items-center bg-slate-950/50">
                         <h2 className="text-xl font-bold text-white flex gap-2 items-center"><Bot className="text-orange-400 w-6 h-6 animate-pulse"/> المساعد الذكي المتقدم </h2>
                         <button onClick={() => setIsExpanded(false)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 transition-colors"><X /></button>
                     </div>
                     <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 flex flex-col items-center custom-scrollbar">
                        {messages.map((msg) => (
                           <div key={msg.id} className={cn("flex gap-4 w-full max-w-2xl", msg.role === 'user' ? "flex-row" : "flex-row-reverse")}>
                              <div className="shrink-0 mt-1">
                                 {msg.role === 'bot' ? (
                                   <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-rose-500 flex items-center justify-center shadow-lg"><Bot className="w-5 h-5 text-white" /></div>
                                 ) : (
                                   <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-lg"><User className="w-5 h-5 text-slate-300" /></div>
                                 )}
                               </div>
                               <div className={cn("px-5 py-4 text-sm leading-relaxed max-w-[85%]", msg.role === 'user' ? "bg-orange-600 text-white rounded-2xl rounded-tr-sm shadow-xl shadow-orange-500/10" : "bg-white/5 text-slate-200 border border-white/10 rounded-2xl rounded-tl-sm")}>
                                 {msg.content}
                               </div>
                           </div>
                        ))}
                        {isTyping && (
                           <div className="flex gap-4 w-full max-w-2xl flex-row-reverse">
                              <div className="shrink-0 mt-1">
                                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-rose-500 flex items-center justify-center shadow-lg"><Bot className="w-5 h-5 text-white" /></div>
                              </div>
                              <div className="bg-white/5 border border-white/10 px-5 py-4 rounded-2xl rounded-tl-sm flex items-center gap-2 text-slate-400 text-sm">
                                  <Loader2 className="w-4 h-4 animate-spin text-orange-400" /> المحرك يحلل...
                              </div>
                           </div>
                        )}
                        <div ref={messagesEndRef} />
                     </div>
                     <div className="p-4 sm:p-6 border-t border-orange-500/20 bg-slate-950/80 flex gap-4 max-w-3xl w-full mx-auto justify-center">
                        <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-5 py-4 text-white hover:border-orange-500/50 focus:outline-none focus:border-orange-500 transition-colors" placeholder="اسأل الذكاء الاصطناعي..."/>
                        <button onClick={handleSendMessage} className="px-8 bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-400 hover:to-rose-500 rounded-xl font-bold flex gap-2 shadow-[0_0_20px_rgba(249,115,22,0.4)] text-white transition-all items-center justify-center"><Send className="w-5 h-5 rtl:-scale-x-100" /> إرسال</button>
                     </div>
                  </motion.div>
               </div>
        </PortalOverlay>
      </div>
    );
  }

  return null;
}
