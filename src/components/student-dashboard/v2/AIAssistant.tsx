import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, Bot, User, Loader2, Mic, MicOff } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AIService } from '@/services/AIService';

interface AIAssistantProps {
    forceOpen?: boolean;
    userName?: string;
    mode?: 'floating' | 'docked';
    onClose?: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
    forceOpen = false,
    userName,
    mode = 'floating',
    onClose
}) => {
    const [isOpen, setIsOpen] = useState(forceOpen);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            text: userName
                ? `مرحباً ${userName}! أنا مدربك الذكي. أنا هنا لمساعدتك في رحلتك الرياضية اليوم. هل نبدأ بأول تمرين؟`
                : 'مرحباً! أنا مدربك الذكي. كيف يمكنني مساعدتك اليوم في رحلتك الرياضية؟'
        }
    ]);

    const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
        e?.preventDefault();
        const userMessage = customText || input.trim();
        if (!userMessage || isLoading) return;

        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setIsLoading(true);

        try {
            const reply = await AIService.getAICoachResponse(userMessage);
            setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', text: 'عذراً، حدث خطأ أثناء الاتصال بالمدرب الذكي.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleRecording = async () => {
        if (!isRecording) {
            setIsRecording(true);
            setTimeout(async () => {
                setIsRecording(false);
                const transcript = await AIService.transcribeSpeech(new Blob());
                handleSendMessage(undefined, transcript);
            }, 3000);
        } else {
            setIsRecording(false);
        }
    };

    const chatContentJSX = (
        <Card className={`${mode === 'docked' ? 'h-full w-full' : 'fixed bottom-28 left-8 w-[90vw] md:w-[400px] h-[600px]'} glass-card border-indigo-500/20 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)] flex flex-col z-50 animate-in slide-in-from-bottom-2 fade-in duration-300 overflow-hidden`}>
            {/* ... keeping the same header ... */}
            <CardHeader className="bg-indigo-600 text-white p-6 relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Bot className="w-24 h-24" />
                </div>
                <div className="flex items-center justify-between relative z-10 w-full">
                    <CardTitle className="text-xl font-black flex items-center gap-3">
                        <Bot className="w-6 h-6" />
                        <span>المدرب الذكي (AI Coach)</span>
                    </CardTitle>
                    {mode === 'floating' && (
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/10">
                            <X className="w-5 h-5" />
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden relative z-10 flex flex-col bg-slate-50 dark:bg-[#0B0E14]">
                <ScrollArea className="flex-1 p-6">
                    <div className="space-y-6">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <Avatar className={`w-10 h-10 border-2 shadow-lg ${msg.role === 'user' ? 'border-indigo-200' : 'border-indigo-500/30'}`}>
                                    <AvatarFallback className={msg.role === 'assistant' ? 'bg-indigo-600 text-white font-black' : 'bg-slate-200 text-slate-700 font-black'}>
                                        {msg.role === 'assistant' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                                    </AvatarFallback>
                                </Avatar>
                                <div className={`rounded-2xl p-4 text-sm font-bold shadow-sm max-w-[80%] leading-relaxed ${msg.role === 'assistant'
                                    ? 'bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 text-slate-800 dark:text-slate-200'
                                    : 'bg-indigo-600 text-white shadow-[0_4px_15px_rgba(79,70,229,0.3)]'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-4">
                                <Avatar className="w-10 h-10 border-2 border-indigo-500/30">
                                    <AvatarFallback className="bg-indigo-600 text-white"><Bot className="w-5 h-5" /></AvatarFallback>
                                </Avatar>
                                <div className="bg-white dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/10">
                                    <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
                
                {/* Suggested Questions Bubble */}
                {messages.length === 1 && (
                    <div className="px-6 pb-4 pt-2 flex gap-2 flex-wrap">
                        {['كيف أحسن سرعتي؟', 'ما هو تماريني اليوم؟', 'لدي شد عضلي، ماذا أفعل؟'].map((q, i) => (
                            <button 
                                key={i}
                                onClick={() => handleSendMessage(undefined, q)}
                                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 px-3 py-1.5 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                )}
            </CardContent>
            <CardFooter className="p-4 border-t border-slate-200 dark:border-white/5 bg-white dark:bg-[#0B0E14] relative z-10">
                <form className="flex w-full gap-2 items-center" onSubmit={handleSendMessage}>
                    <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={toggleRecording}
                        className={`h-10 w-10 shrink-0 text-slate-500 rounded-full transition-all ${isRecording ? 'animate-pulse text-red-500 bg-red-50 dark:bg-red-500/10' : 'hover:bg-slate-100 dark:hover:bg-white/5'}`}
                    >
                        {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </Button>
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="اسأل مدربك..."
                        className="bg-slate-100 dark:bg-white/5 border-transparent text-slate-900 dark:text-white placeholder:text-slate-500 font-bold h-10 focus:ring-1 focus:ring-indigo-500 rounded-full px-4"
                    />
                    <Button type="submit" size="icon" disabled={isLoading || isRecording || !input.trim()} className="bg-indigo-600 hover:bg-indigo-500 h-10 w-10 shrink-0 shadow-md rounded-full">
                        <Send className="w-4 h-4 rtl:rotate-180" />
                    </Button>
                </form>
            </CardFooter>
        </Card>
    );

    if (mode === 'docked') {
        return chatContentJSX;
    }

    return (
        <>
            <Button
                className="fixed bottom-8 left-8 h-16 w-16 rounded-full shadow-[0_20px_50px_rgba(79,70,229,0.4)] bg-indigo-600 hover:bg-indigo-500 text-white z-50 transition-all hover:scale-110 active:scale-90 border-2 border-white/20"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X className="w-8 h-8" /> : <MessageCircle className="w-10 h-10" />}
            </Button>

            {(isOpen || forceOpen) && chatContentJSX}
        </>
    );
};
