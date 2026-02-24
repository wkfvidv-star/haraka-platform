import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Video, MessageCircle, PlayCircle, ArrowRight, Trophy } from 'lucide-react';

interface AIGuidanceCenterProps {
    dailyRecommendation?: string;
    onStartTraining?: () => void;
    onAnalyzeVideo?: () => void;
    onTalkToAI?: () => void;
}

export const AIGuidanceCenter: React.FC<AIGuidanceCenterProps> = ({
    dailyRecommendation = "أحمد، بناءً على تحليلك الأخير، نلاحظ تحسناً في توازنك. جرب تمرين القرفصاء (Squats) في مختبر الحركة اليوم لتحقيق هدفك في بناء القوة.",
    onStartTraining,
    onAnalyzeVideo,
    onTalkToAI
}) => {
    return (
        <Card className="glass-card border-white/10 relative overflow-hidden group shadow-2xl">
            {/* Subtle brand accent */}
            <div className="absolute inset-y-0 right-0 w-1 bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-transparent pointer-events-none" />

            <CardHeader className="pb-4 relative z-10">
                <CardTitle className="flex items-center gap-3 text-xl font-black text-white">
                    <div className="p-2 rounded-lg bg-orange-500/20 ring-1 ring-orange-500/30 group-hover:scale-110 transition-transform duration-500">
                        <Trophy className="w-5 h-5 text-orange-400" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black text-white">مهمتك اليومية (My Daily Mission)</span>
                        <span className="text-[10px] text-orange-400/80 font-black uppercase tracking-[2px]">AGI-REASONING ACTIVE</span>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
                <div className="flex flex-col md:flex-row gap-8 items-center">

                    {/* Recommendation Text - Contained for maximum readability */}
                    <div className="flex-1 bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm">
                        <p className="text-lg font-bold text-gray-100 leading-relaxed">
                            "{dailyRecommendation}"
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 justify-end w-full md:w-auto">
                        <Button
                            onClick={onStartTraining}
                            className="bg-purple-600 hover:bg-purple-500 text-white shadow-xl flex-1 md:flex-none font-black h-12 px-6"
                        >
                            <PlayCircle className="w-5 h-5 ml-2" />
                            ابدأ التدريب المقترح
                        </Button>

                        <Button
                            variant="outline"
                            onClick={onAnalyzeVideo}
                            className="border-white/20 bg-white/5 text-white hover:bg-white/10 flex-1 md:flex-none font-bold h-12 px-6"
                        >
                            <Video className="w-5 h-5 ml-2" />
                            تحليل فيديو جديد
                        </Button>

                        <Button
                            variant="ghost"
                            onClick={onTalkToAI}
                            className="text-purple-300 hover:bg-purple-500/20 hover:text-white flex-1 md:flex-none font-bold h-12 px-6"
                        >
                            <MessageCircle className="w-5 h-5 ml-2" />
                            أخبرني المزيد
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
