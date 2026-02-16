import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Bot, X, MessageSquare, Sparkles, Send } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export const ParentAIAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-10 left-10 z-[100] flex flex-col items-end gap-6 rtl:left-auto rtl:right-10">
            {isOpen && (
                <Card className="w-96 shadow-[0_0_50px_rgba(0,0,0,0.5)] glass-card border-blue-500/20 animate-in slide-in-from-bottom-10 fade-in duration-500 rounded-[2.5rem] overflow-hidden flex flex-col h-[550px]">
                    {/* Header */}
                    <div className="bg-blue-600/20 backdrop-blur-xl p-6 border-b border-white/5 flex justify-between items-center text-white relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-blue-600/10 pointer-events-none" />
                        <div className="flex items-center gap-3 relative z-10">
                            <div className="p-2 bg-blue-500/20 ring-1 ring-blue-500/30 rounded-xl">
                                <Bot className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-black text-sm uppercase tracking-widest text-white">المساعد الذكي (Expert Advisor)</h3>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">نشط الآن (Online)</span>
                                </div>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-white hover:bg-white/10 rounded-xl relative z-10 transition-transform active:scale-90"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Chat Area */}
                    <ScrollArea className="flex-1 p-6 bg-black/20">
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner shrink-0 ring-1 ring-white/5">
                                    <Bot className="w-6 h-6 text-purple-400" />
                                </div>
                                <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl rounded-tr-none border border-white/5 shadow-xl max-w-[85%]">
                                    <p className="text-sm font-bold text-gray-200 leading-relaxed">
                                        مرحباً بك! أنا مساعدك الذكي. يمكنني مساعدتك في تحليل تقارير أطفالك، اقتراح وجبات صحية، أو نصائح تربوية رياضية. كيف يمكنني مساعدتك اليوم؟
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-end items-start gap-4">
                                <div className="bg-blue-600 text-white p-4 rounded-3xl rounded-tl-none shadow-2xl shadow-blue-900/40 border border-blue-500/30 max-w-[85%]">
                                    <p className="text-sm font-black">
                                        كيف هو أداء أحمد هذا الأسبوع؟
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner shrink-0 ring-1 ring-white/5">
                                    <Bot className="w-6 h-6 text-purple-400" />
                                </div>
                                <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl rounded-tr-none border border-white/5 shadow-xl max-w-[85%]">
                                    <p className="text-sm font-bold text-gray-200 leading-relaxed">
                                        أداء أحمد ممتاز! لقد حقق تحسناً بنسبة <span className="text-green-400 font-black">5%</span> في تمارين القوة، وحافظ على انتظامه في الحضور. أنصح بتشجيعه على تمارين المرونة.
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <Badge variant="outline" className="bg-white/5 text-xs font-black text-blue-300 border-white/10">تحليل الأداء</Badge>
                                        <Badge variant="outline" className="bg-white/5 text-xs font-black text-orange-300 border-white/10">نصيحة تدريبية</Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>

                    {/* Input Area */}
                    <div className="p-6 border-t border-white/5 bg-white/5 backdrop-blur-2xl">
                        <div className="relative group/input">
                            <input
                                type="text"
                                placeholder="اسأل الخبير التربوي الرياضي..."
                                className="w-full pr-6 pl-14 py-4 bg-black/40 border border-white/5 rounded-2xl text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold"
                            />
                            <Button
                                size="icon"
                                className="absolute left-2 top-2 h-10 w-10 rounded-xl bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-900/20 active:scale-90 transition-transform"
                            >
                                <Send className="w-4 h-4 text-white" />
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            <Button
                onClick={() => setIsOpen(!isOpen)}
                size="lg"
                className={`h-20 w-20 rounded-[2.5rem] shadow-[0_0_50px_rgba(59,130,246,0.3)] transition-all duration-500 hover:scale-110 active:scale-95 group/btn border-4 border-white/10
                    ${isOpen ? 'bg-gray-800 hover:bg-gray-700 rotate-[360deg]' : 'bg-gradient-to-br from-blue-600 to-blue-400 hover:shadow-blue-500/50'}
                `}
            >
                {isOpen ? <X className="w-8 h-8 text-white" /> : (
                    <div className="relative">
                        <Sparkles className="w-8 h-8 text-white group-hover/btn:rotate-12 transition-transform" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-blue-600 animate-bounce" />
                    </div>
                )}
            </Button>
        </div>
    );
};
