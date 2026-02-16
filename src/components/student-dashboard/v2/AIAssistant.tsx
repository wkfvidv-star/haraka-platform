import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export const AIAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'مرحباً! أنا مدربك الذكي. كيف يمكنني مساعدتك اليوم؟' }
    ]);

    return (
        <>
            {/* Floating Button */}
            <Button
                className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-[0_20px_50px_rgba(79,70,229,0.4)] bg-indigo-600 hover:bg-indigo-500 text-white z-50 transition-all hover:scale-110 active:scale-90 border-2 border-white/20"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X className="w-8 h-8" /> : <MessageCircle className="w-10 h-10" />}
            </Button>

            {/* Chat Interface */}
            {isOpen && (
                <Card className="fixed bottom-28 right-8 w-[90vw] md:w-[400px] h-[600px] glass-card border-indigo-500/20 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)] flex flex-col z-50 animate-in slide-in-from-bottom-2 fade-in duration-300 overflow-hidden">
                    <CardHeader className="bg-indigo-600 text-white p-6 relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Bot className="w-24 h-24" />
                        </div>
                        <CardTitle className="text-xl font-black flex items-center gap-3 relative z-10">
                            <Bot className="w-6 h-6" />
                            <span>المساعد الرياضي الذكي (AI)</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 overflow-hidden relative z-10">
                        <ScrollArea className="h-full p-6">
                            <div className="space-y-6">
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                        <Avatar className="w-10 h-10 border-2 border-white/10 shadow-lg">
                                            <AvatarFallback className={msg.role === 'assistant' ? 'bg-indigo-500 text-white font-black' : 'bg-gray-700 text-white font-black'}>
                                                {msg.role === 'assistant' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className={`rounded-2xl p-4 text-sm font-bold shadow-sm max-w-[80%] leading-relaxed ${msg.role === 'assistant'
                                            ? 'bg-white/5 border border-white/10 text-white backdrop-blur-md'
                                            : 'bg-indigo-600 text-white shadow-[0_4px_15px_rgba(79,70,229,0.3)]'
                                            }`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}

                                {/* Contextual Suggestions */}
                                <div className="flex flex-wrap gap-2 mt-8 py-4 border-t border-white/5">
                                    {['لماذا أدائي منخفض؟', 'ما هو تمرين اليوم؟', 'أشعر بالتعب'].map((suggestion, i) => (
                                        <button
                                            key={i}
                                            className="text-xs font-black bg-white/5 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-full hover:bg-indigo-500/20 hover:text-white transition-all shadow-sm"
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </ScrollArea>
                    </CardContent>
                    <CardFooter className="p-6 border-t border-white/5 bg-black/20 backdrop-blur-xl relative z-10">
                        <form className="flex w-full gap-3" onSubmit={(e) => e.preventDefault()}>
                            <Input placeholder="اسأل مدربك..." className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 font-bold h-12 focus:ring-indigo-500" />
                            <Button size="icon" className="bg-indigo-600 hover:bg-indigo-500 h-12 w-12 shadow-xl">
                                <Send className="w-5 h-5" />
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            )}
        </>
    );
};
