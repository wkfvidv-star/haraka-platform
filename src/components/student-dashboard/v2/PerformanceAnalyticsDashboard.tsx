import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity, Brain, Zap, TrendingUp, Target, BarChart2, Shield } from 'lucide-react';

export function PerformanceAnalyticsDashboard() {
    // Mock Data for charts
    const performanceTimeline = [
        { month: 'سبتمبر', motor: 65, cognitive: 70, reaction: 350 },
        { month: 'أكتوبر', motor: 68, cognitive: 74, reaction: 340 },
        { month: 'نوفمبر', motor: 75, cognitive: 79, reaction: 325 },
        { month: 'ديسمبر', motor: 82, cognitive: 85, reaction: 310 },
        { month: 'جانفي', motor: 88, cognitive: 91, reaction: 295 },
    ];

    const radarStats = [
        { label: 'السرعة الحركية', value: 85, color: 'bg-blue-500' },
        { label: 'الذاكرة العاملة', value: 92, color: 'bg-indigo-500' },
        { label: 'سرعة الاستجابة', value: 88, color: 'bg-yellow-500' },
        { label: 'التوافق العضلي العصب', value: 76, color: 'bg-emerald-500' },
        { label: 'المرونة النفسية', value: 80, color: 'bg-rose-500' }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <BarChart2 className="w-6 h-6 text-indigo-500" />
                        لوحة تحليلات الأداء الشاملة
                    </h2>
                    <p className="text-slate-500 mt-1">
                        تتبع تقدمك في المؤشرات الحركية، المعرفية والنفسية عبر الزمن.
                    </p>
                </div>
            </div>

            {/* Top Cards: Key Indices */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-card border-blue-500/20 shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-blue-500/20" />
                    <CardContent className="p-6 relative z-10 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                            <Activity className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Motor Index</p>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white">88<span className="text-lg text-slate-400">/100</span></h3>
                            <p className="text-xs font-bold text-emerald-500 flex items-center gap-1 mt-1">
                                <TrendingUp className="w-3 h-3" /> +12% هذا الشهر
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card border-indigo-500/20 shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-indigo-500/20" />
                    <CardContent className="p-6 relative z-10 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                            <Brain className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Cognitive Index</p>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white">91<span className="text-lg text-slate-400">/100</span></h3>
                            <p className="text-xs font-bold text-emerald-500 flex items-center gap-1 mt-1">
                                <TrendingUp className="w-3 h-3" /> +8% هذا الشهر
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card border-yellow-500/20 shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-yellow-500/20" />
                    <CardContent className="p-6 relative z-10 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.5)]">
                            <Zap className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Reaction Speed</p>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white">295<span className="text-lg text-slate-400">ms</span></h3>
                            <p className="text-xs font-bold text-emerald-500 flex items-center gap-1 mt-1">
                                <TrendingUp className="w-3 h-3" /> أسرع بـ 15ms
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Performance Timeline (Custom Bar Chart simulation) */}
                <Card className="lg:col-span-2 glass-card border-slate-200/50 dark:border-white/10 shadow-xl overflow-hidden">
                    <CardHeader className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 py-4">
                        <CardTitle className="text-sm font-black flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-indigo-500" /> مسار التطور الشامل (Timeline)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="flex items-end justify-between h-64 gap-2 pt-8 relative">
                            {/* Grid lines */}
                            <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col justify-between pointer-events-none opacity-10">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="w-full h-px bg-slate-900 dark:bg-white" />
                                ))}
                            </div>

                            {performanceTimeline.map((data, idx) => (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative z-10">
                                    <div className="w-full relative flex items-end justify-center h-full gap-1">
                                        <div 
                                            className="w-1/3 max-w-[20px] bg-blue-500 rounded-t-sm transition-all duration-500 group-hover:brightness-125" 
                                            style={{ height: `${data.motor}%` }}
                                        />
                                        <div 
                                            className="w-1/3 max-w-[20px] bg-indigo-500 rounded-t-sm transition-all duration-500 group-hover:brightness-125" 
                                            style={{ height: `${data.cognitive}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-bold text-slate-500">{data.month}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center gap-6 mt-6">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                                <div className="w-3 h-3 rounded-full bg-blue-500" /> الأداء الحركي
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                                <div className="w-3 h-3 rounded-full bg-indigo-500" /> الأداء المعرفي
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Radar/Skills distribution */}
                <Card className="glass-card border-slate-200/50 dark:border-white/10 shadow-xl overflow-hidden">
                    <CardHeader className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 py-4">
                        <CardTitle className="text-sm font-black flex items-center gap-2">
                            <Target className="w-4 h-4 text-emerald-500" /> تحليل المهارات الدقيقة
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-5">
                        {radarStats.map((stat, idx) => (
                            <div key={idx} className="space-y-1.5">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-bold text-slate-700 dark:text-slate-200">{stat.label}</span>
                                    <span className="font-black text-slate-900 dark:text-white">{stat.value}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full ${stat.color} rounded-full transition-all duration-1000`} 
                                        style={{ width: `${stat.value}%` }} 
                                    />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
