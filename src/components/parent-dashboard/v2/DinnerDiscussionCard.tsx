import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Coffee, ArrowLeft } from 'lucide-react';

interface Topic {
    id: string;
    category: string;
    question: string;
    suggestedFor?: string; // e.g., "For Ahmed"
    bgLight: string;
    borderLight: string;
    iconColor: string;
}

export const DinnerDiscussionCard: React.FC = () => {
    // Mock data based on the original request
    const topics: Topic[] = [
        {
            id: '1',
            category: 'علوم ورياضة',
            question: "كيف تعمل الروافع في جسم الإنسان أثناء الحركة؟",
            suggestedFor: "للابن أحمد",
            bgLight: "bg-blue-50 dark:bg-blue-900/20",
            borderLight: "border-blue-100 dark:border-blue-800",
            iconColor: "text-blue-500"
        },
        {
            id: '2',
            category: 'تحديات',
            question: "ما هو أصعب جزء في تعلم تقنية السباحة الجديدة اليوم؟",
            suggestedFor: "للابنة فاطمة",
            bgLight: "bg-purple-50 dark:bg-purple-900/20",
            borderLight: "border-purple-100 dark:border-purple-800",
            iconColor: "text-purple-500"
        },
        {
            id: '3',
            category: 'صحة الأسرة',
            question: "لماذا يعتبر شرب الماء مهماً جداً قبل وبعد التمرين؟",
            suggestedFor: "للجميع",
            bgLight: "bg-green-50 dark:bg-green-900/20",
            borderLight: "border-green-100 dark:border-green-800",
            iconColor: "text-green-500"
        }
    ];

    return (
        <Card className="glass-card border-orange-500/20 shadow-2xl relative overflow-hidden group h-full">
            <div className="absolute inset-0 bg-orange-600/5 mix-blend-overlay pointer-events-none" />
            <CardHeader className="border-b border-white/5 pb-4 relative z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 ring-1 ring-blue-500/20 rounded-xl shadow-lg">
                            <Coffee className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-black text-white tracking-tight">
                                حديث المائدة (Dinner Discussion)
                            </CardTitle>
                            <CardDescription className="text-gray-400 font-bold">
                                أسئلة مقترحة لنقاش عائلي ممتع وملهم اليوم
                            </CardDescription>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {topics.map((topic) => (
                        <div
                            key={topic.id}
                            className={`p-6 rounded-[2rem] border transition-all duration-300 hover:scale-[1.02] cursor-pointer group/topic relative overflow-hidden bg-black/20 ${topic.borderLight.replace('border-blue-100', 'border-blue-500/20').replace('border-purple-100', 'border-purple-500/20').replace('border-green-100', 'border-green-500/20')}`}
                        >
                            <div className="absolute inset-0 opacity-0 group-hover/topic:opacity-100 transition-opacity bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                            <div className="flex justify-between items-center mb-4">
                                <Badge className="bg-white/5 text-white border-white/10 font-black text-[10px] px-2.5 py-0.5 uppercase tracking-widest">
                                    {topic.category}
                                </Badge>
                                {topic.suggestedFor && (
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        {topic.suggestedFor}
                                    </span>
                                )}
                            </div>

                            <h3 className="text-base font-black text-white leading-relaxed tracking-tight group-hover/topic:text-blue-300 transition-colors">
                                "{topic.question}"
                            </h3>

                            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover/topic:text-gray-300 transition-colors">عرض النصائح</span>
                                <MessageSquare className={`w-4 h-4 ${topic.iconColor} drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]`} />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
