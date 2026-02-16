import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Calendar, CheckCircle, Clock } from 'lucide-react';

export const VirtualCoach: React.FC = () => {
    return (
        <Card className="glass-card border-orange-500/20 shadow-2xl relative overflow-hidden group">
            {/* Subtle brand glow */}
            <div className="absolute inset-0 bg-orange-500/5 mix-blend-overlay pointer-events-none" />

            <CardHeader className="pb-4 relative z-10 border-b border-white/5">
                <CardTitle className="flex items-center gap-4">
                    <div className="relative">
                        <Avatar className="w-14 h-14 border-2 border-orange-500/30 shadow-lg">
                            <AvatarImage src="/coach-avatar.png" />
                            <AvatarFallback className="bg-orange-600 text-white font-black">مدرب</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#0b0f1a] rounded-full" />
                    </div>
                    <div>
                        <div className="text-xl font-black text-white leading-tight">المدرب الافتراضي</div>
                        <div className="text-sm text-orange-400 font-bold mt-1">خطتك الأسبوعية محدثة وجاهزة</div>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Weekly Goals */}
                    <div className="md:col-span-2 space-y-4">
                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-3 mb-6">
                            <div className="p-1.5 rounded-lg bg-orange-500/10 ring-1 ring-orange-500/20">
                                <Calendar className="w-4 h-4 text-orange-400" />
                            </div>
                            أهداف هذا الأسبوع
                        </h4>
                        <div className="space-y-3">
                            {[
                                { text: 'إكمال 3 جلسات توازن', done: true },
                                { text: 'تحسين سرعة رد الفعل بنسبة 2%', done: false },
                                { text: 'رفع فيديو لتحليل القفز', done: false }
                            ].map((goal, i) => (
                                <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${goal.done ? 'bg-green-500/10 border-green-500/20 text-green-300' : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'}`}>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${goal.done ? 'bg-green-600 border-green-500 text-white shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 'border-gray-600 shadow-inner'}`}>
                                        {goal.done && <CheckCircle className="w-4 h-4" />}
                                    </div>
                                    <span className={`text-sm font-bold ${goal.done ? 'opacity-60' : ''}`}>{goal.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Feedback */}
                    <div className="expert-note-bubble !bg-white/[0.03] !border-orange-500/40 border !rounded-3xl !p-6 shadow-2xl relative">
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                            <MessageSquare className="w-12 h-12 text-orange-400" />
                        </div>
                        <h4 className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            ملاحظة الخبير
                        </h4>
                        <p className="text-lg text-white font-bold leading-relaxed mb-6 italic leading-relaxed">
                            "أحسنت في تمرين الأمس! لاحظت تحسناً في ثبات الجذع، لكن نحتاج للعمل أكثر على الهبوط الآمن."
                        </p>
                        <div className="flex flex-col gap-4">
                            <div className="text-xs text-orange-400/80 font-bold border-t border-white/5 pt-4">
                                د. أحمد - خبير الأداء الحركي
                            </div>
                            <Button variant="outline" size="sm" className="w-full text-[11px] font-black text-white bg-white/5 border-white/10 hover:bg-white/10 h-10">
                                استمع للملاحظة الصوتية 🔊
                            </Button>
                        </div>
                    </div>

                </div>
            </CardContent>
        </Card>
    );
};
