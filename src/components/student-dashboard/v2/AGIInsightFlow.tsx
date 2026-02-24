import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, TrendingUp, Heart, Sparkles } from 'lucide-react';
import { HCEInsights } from '@/services/hceService';

interface AGIInsightFlowProps {
    insights: HCEInsights | null;
}

export const AGIInsightFlow: React.FC<AGIInsightFlowProps> = ({ insights }) => {
    const sections = [
        { title: "التطور الإدراكي", data: insights?.cognitive, icon: Brain, color: "text-purple-400", shadow: "shadow-purple-500/20" },
        { title: "التطور الحركي", data: insights?.physical, icon: TrendingUp, color: "text-blue-400", shadow: "shadow-blue-500/20" },
        { title: "الاستقرار النفسي", data: insights?.psychological, icon: Heart, color: "text-pink-400", shadow: "shadow-pink-500/20" }
    ];

    return (
        <div className="relative mb-12">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-full bg-blue-600">
                    <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h2 className="text-xl font-black text-white">العقل الرقمي (Digital Brain)</h2>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-[3px]">AGI LAYER</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {sections.map((section, idx) => (
                    <Card key={idx} className={`glass-card border-white/10 relative overflow-hidden group ${section.shadow}`}>
                        <CardHeader className="pb-2">
                            <CardTitle className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest ${section.color}`}>
                                <section.icon className="w-4 h-4" />
                                {section.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-white font-black text-lg mb-1">{section.data?.status || 'جاري التحليل'}</div>
                                    <p className="text-[11px] text-white/50 leading-relaxed">"{section.data?.observation || '...'}"</p>
                                </div>
                                <div className="p-3 rounded-xl bg-white/5 border-l-2 border-orange-500/50">
                                    <p className="text-[12px] font-bold text-white">
                                        {section.data?.recommendation || '...'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
