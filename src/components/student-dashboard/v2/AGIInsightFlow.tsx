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
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-md">
                    <Brain className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">نواة الذكاء الاصطناعي</h2>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">الطبقة المعرفية الفائقة • AGI Layer</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {sections.map((section, idx) => (
                    <Card key={idx} className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-all rounded-3xl overflow-hidden group">
                        <CardHeader className="pb-3 border-b border-slate-50 bg-slate-50/50">
                            <CardTitle className={`flex items-center justify-between text-xs font-black uppercase tracking-widest text-slate-600`}>
                                <span>{section.title}</span>
                                <div className={`p-1.5 rounded-lg bg-white shadow-sm border border-slate-100 ${section.color}`}>
                                  <section.icon className="w-4 h-4" />
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-5">
                            <div className="space-y-4">
                                <div>
                                    <div className="text-slate-900 font-extrabold text-2xl mb-2 flex items-center gap-2">
                                        {/* <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> */}
                                        {section.data?.status || 'جاري التحليل'}
                                    </div>
                                    <p className="text-sm font-medium text-slate-500 leading-relaxed">"{section.data?.observation || 'مراقبة البيانات الحالية لك...'}"</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100/50 flex gap-3 items-start">
                                    <Sparkles className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                                    <p className="text-xs font-bold text-orange-800 leading-relaxed">
                                        {section.data?.recommendation || 'الذكاء الاصطناعي يقوم بتجهيز التوصيات...'}
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
