import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MessageSquare, X, Send, Bot, User, Sparkles, 
    ChevronDown, Maximize2, Minimize2, RotateCcw, Volume2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
    id: string;
    type: 'bot' | 'user';
    content: string;
    timestamp: Date;
}

// Smart context-aware responses based on keywords
const getSmartResponse = (input: string, userName: string): string => {
    const msg = input.toLowerCase();
    
    if (msg.includes('حصة') || msg.includes('موعد') || msg.includes('جدول')) {
        return `📅 **حصصك القادمة:**\n\n• **الثلاثاء الساعة 10:00 ص** — حصة القوة والتحمل (حضوري)\n• **الأربعاء الساعة 6:00 م** — تدريب الإدراك الحركي (أونلاين)\n• **الجمعة الساعة 8:00 ص** — تمرين الفريق الأسبوعي\n\n💡 هل تريد تأكيد حضورك لأي منها؟`;
    }
    
    if (msg.includes('غذاء') || msg.includes('وجبة') || msg.includes('أكل') || msg.includes('بروتين') || msg.includes('سعة') || msg.includes('سعرات')) {
        return `🥗 **برنامجك الغذائي اليوم:**\n\n• **الإفطار (560 سعرة)**: بيض مسلوق + خبز أسمر + موزة\n• **منتصف الضحى (220 سعرة)**: مكسرات + تفاحة\n• **الغداء (720 سعرة)**: صدر دجاج + أرز + سلطة ✅\n• **المساء (380 سعرة)**: مشروب بروتين + شوفان\n\n📊 **هدفك اليومي**: 2400 سعرة | تناولت حتى الآن: **780 سعرة**\n\n💪 _ابقَ ملتزماً وجسمك سيشكرك!_`;
    }
    
    if (msg.includes('تمرين') || msg.includes('تدريب') || msg.includes('تمرينات')) {
        return `🏋️ **توصيتي لك اليوم يا ${userName || 'بطل'}:**\n\n**1. دافع اليوم — القوة الأساسية:**\n• 3 مجموعات × 15 عدة ضغط\n• 3 مجموعات بلانك 45 ثانية\n• 3 مجموعات × 12 سكوات\n\n**2. التمرين المعرفي (10 دقائق):**\n• تتبع الأنماط السريعة\n\n⏱️ الوقت الإجمالي المقدر: **45 دقيقة**\n\nهل تريد أن أشرح لك طريقة الأداء الصحيحة لأي تمرين؟`;
    }
    
    if (msg.includes('ألم') || msg.includes('إصابة') || msg.includes('وجع') || msg.includes('تعب')) {
        return `⚠️ **تنبيه مهم:**\n\nبما أنك تشعر بألم، يُنصح بـ:\n\n• **التوقف** عن التمارين المرهقة مؤقتاً\n• **الراحة الفعالة**: تمارين إعادة التأهيل الخفيفة\n• **الثلج والتدليك**: إذا كان الألم موضعياً\n• **استشارة المدرب**: قبل استئناف أي نشاط مكثف\n\n🩺 هل تريد أن أفتح لك قسم **إعادة التأهيل الحركي**؟`;
    }
    
    if (msg.includes('نوم') || msg.includes('استرخاء') || msg.includes('تعب') || msg.includes('راحة')) {
        return `😴 **تحليل نومك الأخير:**\n\n• **إجمالي النوم**: 7.7 ساعة ✅\n• **النوم العميق**: 1.8 ساعة (جيد)\n• **جودة النوم**: 88% (ممتاز)\n\n🌙 **توصيات للتحسين:**\n\n1. نم في نفس الوقت يومياً\n2. تجنب الشاشات قبل النوم بـ 30 دقيقة\n3. تمرين التنفس العميق (5 دقائق قبل النوم)\n\n💆 هل تريد جلسة **تأمل موجه** الآن؟`;
    }
    
    if (msg.includes('وزن') || msg.includes('دهون') || msg.includes('جسم')) {
        return `📊 **تحليل تركيبة جسمك الحالية:**\n\n• **الوزن**: 68 كغ\n• **نسبة الدهون**: 12.8% (ممتاز) 💚\n• **الكتلة العضلية**: 42.3 كغ (فوق المتوسط) 💪\n• **مؤشر كتلة الجسم (BMI)**: 21.5 (طبيعي)\n\n🏆 **أنت في المستوى الأول من ناحية اللياقة البدنية للفئة العمرية!**\n\nهل تريد خطة مخصصة للحفاظ على هذه المؤشرات؟`;
    }
    
    if (msg.includes('مرحبا') || msg.includes('أهلا') || msg.includes('السلام')) {
        return `أهلاً وسهلاً يا ${userName || 'بطل'}! 👋\n\nأنا **مساعدك الذكي المتخصص** في المنصة. يمكنني مساعدتك في:\n\n• 📅 **جدولة الحصص** وإدارة مواعيدك\n• 🏋️ **التوصية بالتمارين** المناسبة لمستواك\n• 🥗 **متابعة البرنامج الغذائي** اليومي\n• 📊 **تحليل أدائك** ومؤشراتك الحيوية\n• 😴 **متابعة النوم والتعافي**\n\nبماذا أستطيع مساعدتك اليوم؟ 🚀`;
    }
    
    if (msg.includes('نقاط') || msg.includes('مستوى') || msg.includes('إنجاز') || msg.includes('شارة')) {
        return `🏆 **إنجازاتك الحالية:**\n\n• **المستوى**: 5 ⭐\n• **نقاط XP**: 2,480 / 3,000 للمستوى التالي\n• **رصيدك**: 340 نقطة\n• **الشارات**: 12 شارة مفتوحة\n\n🎯 **تحتاج 520 نقطة XP للوصول للمستوى 6!**\n\nكيف تكسب المزيد؟\n1. أداء التمارين اليومية (+50 XP)\n2. إكمال التحديات (+100 XP)\n3. الالتزام الأسبوعي (+200 XP)`;
    }
    
    // Default intelligent response
    const defaults = [
        `💭 فهمت سؤالك يا ${userName || 'بطل'}. بناءً على بياناتك وأهدافك الحالية:\n\n**أداؤك هذا الأسبوع ممتاز!** 💪 حافظت على معدل التزام 92% مع تحسن ملحوظ في مؤشرات القوة والتحمل.\n\n🎯 **توصيتي التالية**: ركّز على التدريب الفتري عالي الكثافة (HIIT) لمدة 20 دقيقة 3 مرات أسبوعياً لتحسين التحمل القلبي.\n\nهل تريد تفاصيل أكثر؟`,
        `✨ شكراً على سؤالك!\n\n🤖 **العقل الذكي يحلل بياناتك...**\n\nبناءً على مؤشراتك الحيوية (القلب: 82 نبضة/دقيقة، الأكسجين: 98%)، أنت في حالة مثالية للتدريب.\n\n**خطة اليوم المقترحة:**\n• 30 دقيقة قوة وتحمل\n• 10 دقائق تدريب معرفي\n• 5 دقائق تأمل للاسترخاء\n\nهل تبدأ بأيها أولاً؟`,
        `📈 **تقريرك اليومي الذكي:**\n\n• 🔥 السعرات المحروقة اليوم: **380 سعرة**\n• 👟 الخطوات: **12,840 خطوة** (85% من هدفك)\n• ⏱️ وقت النشاط: **4 ساعات**\n• 💧 الترطيب: تحتاج 500 مل ماء إضافية\n\n🌟 **إجمالي الأداء اليوم: B+**\n\nما الذي تريد تحسينه غداً؟`,
    ];
    return defaults[Math.floor(Math.random() * defaults.length)];
};

// Suggested prompts
const SUGGESTED_PROMPTS = [
    { emoji: '📅', text: 'ما هي حصصي القادمة؟' },
    { emoji: '🥗', text: 'ما هي وجباتي اليوم؟' },
    { emoji: '🏋️', text: 'اقترح لي تمريناً' },
    { emoji: '📊', text: 'تحليل تركيبة جسمي' },
    { emoji: '😴', text: 'كيف كان نومي الليلة؟' },
    { emoji: '🏆', text: 'ما هي نقاطي ومستواي؟' },
];

// Markdown-light renderer to handle bold and lists
function renderContent(text: string) {
    const lines = text.split('\n');
    return lines.map((line, i) => {
        // Bold text: **text**
        const renderedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        if (line.startsWith('• ')) {
            return <li key={i} className="mr-3 mb-1" dangerouslySetInnerHTML={{ __html: renderedLine.slice(2) }} />;
        }
        if (line.startsWith('**') && line.endsWith('**')) {
            return <p key={i} className="font-black text-slate-900 mt-2 mb-1" dangerouslySetInnerHTML={{ __html: renderedLine }} />;
        }
        if (line === '') return <div key={i} className="h-1" />;
        return <p key={i} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: renderedLine }} />;
    });
}

export function AICoachChat() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            type: 'bot',
            content: `أهلاً بك يا ${user?.firstName || 'بطل'}! 👋\n\nأنا **مساعدك الذكي** المتخصص في منصة حَرَكة. يمكنني مساعدتك في إدارة حصصك، متابعة برنامجك الغذائي، وتحليل أدائك الرياضي.\n\nبماذا أستطيع مساعدتك اليوم؟ 🚀`,
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

    useEffect(() => {
        if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
    }, [isOpen]);

    const handleSend = useCallback((text?: string) => {
        const content = text || inputValue.trim();
        if (!content) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            type: 'user',
            content,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);
        setShowSuggestions(false);

        setTimeout(() => {
            const response = getSmartResponse(content, user?.firstName || 'بطل');
            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                type: 'bot',
                content: response,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 1200 + Math.random() * 600);
    }, [inputValue, user]);

    const resetChat = () => {
        setMessages([{
            id: '1',
            type: 'bot',
            content: `أهلاً من جديد! 👋 كيف يمكنني مساعدتك؟`,
            timestamp: new Date()
        }]);
        setShowSuggestions(true);
    };

    const chatWidth = isExpanded ? 'w-[520px]' : 'w-[370px] sm:w-[420px]';
    const chatHeight = isExpanded ? 'h-[75vh]' : 'h-[520px] max-h-[75vh]';

    return (
        <div className="fixed bottom-6 lg:bottom-8 left-6 z-[100] font-arabic" dir="rtl">
            {/* FAB Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    >
                        <button
                            onClick={() => setIsOpen(true)}
                            className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-2xl shadow-indigo-500/40 flex items-center justify-center hover:scale-110 transition-transform relative border-2 border-white/20 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" />
                            <MessageSquare className="w-7 h-7 relative z-10" />
                            <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-indigo-600 animate-pulse" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', stiffness: 280, damping: 30 }}
                        className={cn(
                            'absolute bottom-0 left-0 bg-white rounded-[1.75rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-200 flex flex-col overflow-hidden transition-all duration-300',
                            chatWidth, chatHeight
                        )}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-l from-indigo-600 via-blue-600 to-indigo-700 px-5 py-4 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/25">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-white font-black text-base leading-none">المرشد الذكي</h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        <span className="text-indigo-200 text-xs font-bold">متاح الآن · يحلل بياناتك</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={resetChat}
                                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                                    title="محادثة جديدة"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                                >
                                    {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 scroll-smooth">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className={cn('flex gap-2.5', msg.type === 'user' ? 'flex-row-reverse mr-auto items-end max-w-[85%]' : 'items-start max-w-[92%]')}
                                >
                                    <div className={cn(
                                        'w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm',
                                        msg.type === 'user'
                                            ? 'bg-indigo-100 text-indigo-600'
                                            : 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white'
                                    )}>
                                        {msg.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                    </div>
                                    <div className={cn(
                                        'px-4 py-3 rounded-2xl text-sm shadow-sm',
                                        msg.type === 'user'
                                            ? 'bg-indigo-600 text-white rounded-tr-md'
                                            : 'bg-white text-slate-800 border border-slate-100 rounded-tl-md'
                                    )}>
                                        {msg.type === 'bot' ? (
                                            <div className="space-y-0.5 leading-relaxed font-medium">
                                                {renderContent(msg.content)}
                                            </div>
                                        ) : (
                                            <p className="font-bold">{msg.content}</p>
                                        )}
                                    </div>
                                </motion.div>
                            ))}

                            {/* Typing indicator */}
                            {isTyping && (
                                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2.5 items-start">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                                        <Bot className="w-4 h-4" />
                                    </div>
                                    <div className="px-4 py-3 rounded-2xl bg-white border border-slate-100 rounded-tl-md shadow-sm flex items-center gap-1.5">
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.1s]" />
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                                    </div>
                                </motion.div>
                            )}

                            {/* Suggested prompts */}
                            {showSuggestions && messages.length === 1 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col gap-2 pt-2"
                                >
                                    <p className="text-xs font-bold text-slate-400 text-center">اقتراحات سريعة</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {SUGGESTED_PROMPTS.map((p, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleSend(p.text)}
                                                className="text-right px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-all shadow-sm"
                                            >
                                                {p.emoji} {p.text}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-3 bg-white border-t border-slate-100 shrink-0">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="flex items-center gap-2"
                            >
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="اسألني عن تمريناتك، حصصك، غذاءك..."
                                    className="flex-1 bg-slate-100 rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/50 border border-transparent focus:border-indigo-300 transition-all placeholder:font-medium placeholder:text-slate-400"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim() || isTyping}
                                    className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 shadow-md shadow-indigo-500/30"
                                >
                                    <Send className="w-4 h-4 -rotate-90" />
                                </button>
                            </form>
                            <p className="text-[10px] text-center text-slate-300 mt-2 font-medium">مساعد ذكي متخصص في منصة حَرَكة</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
