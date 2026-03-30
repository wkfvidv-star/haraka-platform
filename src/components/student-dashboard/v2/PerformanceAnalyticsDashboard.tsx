import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity, Brain, Zap, TrendingUp, Target, BarChart2, Shield, HeartPulse, Moon, Footprints, Watch } from 'lucide-react';
import { cn } from '@/lib/utils';

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

    const braceletStats = [
        { label: 'معدل النبض (HR)', value: '72', unit: 'bpm', icon: HeartPulse, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
        { label: 'جودة النوم', value: '85', unit: '%', icon: Moon, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
        { label: 'النشاط اليومي', value: '8.5K', unit: 'خطوة', icon: Footprints, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
        { label: 'الضغط النفسي (HRV)', value: '45', unit: 'ms', icon: Activity, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                            <BarChart2 className="w-5 h-5 text-indigo-400" />
                        </div>
                        لوحة تحليلات الأداء الشاملة
                    </h2>
                    <p className="text-slate-400 mt-2 text-lg">
                        تتبع تقدمك في المؤشرات الحركية، المعرفية والنفسية عبر الزمن.
                    </p>
                </div>
            </div>

            {/* Top Cards: Key Indices */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-[#151928]/90 backdrop-blur-xl border border-blue-500/20 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[80px] -mr-10 -mt-10 transition-all duration-500 group-hover:bg-blue-500/20 pointer-events-none" />
                    <CardContent className="p-6 relative z-10 flex items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.15)] flex-shrink-0">
                            <Activity className="w-8 h-8 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Motor Index</p>
                            <h3 className="text-4xl font-black text-white tracking-tight">88<span className="text-xl text-slate-500 font-bold ml-1">/100</span></h3>
                            <p className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-2 bg-emerald-500/10 w-fit px-2.5 py-1 rounded-full border border-emerald-500/20">
                                <TrendingUp className="w-3 h-3" /> +12% هذا الشهر
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#151928]/90 backdrop-blur-xl border border-indigo-500/20 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[80px] -mr-10 -mt-10 transition-all duration-500 group-hover:bg-indigo-500/20 pointer-events-none" />
                    <CardContent className="p-6 relative z-10 flex items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.15)] flex-shrink-0">
                            <Brain className="w-8 h-8 text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Cognitive Index</p>
                            <h3 className="text-4xl font-black text-white tracking-tight">91<span className="text-xl text-slate-500 font-bold ml-1">/100</span></h3>
                            <p className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-2 bg-emerald-500/10 w-fit px-2.5 py-1 rounded-full border border-emerald-500/20">
                                <TrendingUp className="w-3 h-3" /> +8% هذا الشهر
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#151928]/90 backdrop-blur-xl border border-yellow-500/20 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-[80px] -mr-10 -mt-10 transition-all duration-500 group-hover:bg-yellow-500/20 pointer-events-none" />
                    <CardContent className="p-6 relative z-10 flex items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.15)] flex-shrink-0">
                            <Zap className="w-8 h-8 text-yellow-400" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Reaction Speed</p>
                            <h3 className="text-4xl font-black text-white tracking-tight">295<span className="text-xl text-slate-500 font-bold ml-1">ms</span></h3>
                            <p className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-2 bg-emerald-500/10 w-fit px-2.5 py-1 rounded-full border border-emerald-500/20">
                                <TrendingUp className="w-3 h-3" /> أسرع بـ 15ms
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Real-time Bracelet Metrics */}
            <div>
                <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                    <Watch className="w-5 h-5 text-rose-400" />
                    مؤشرات السوار الحيوي (Live Metrics)
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {braceletStats.map((stat, idx) => (
                        <Card key={idx} className="bg-[#151928]/80 backdrop-blur-xl border-white/5 shadow-md relative overflow-hidden group hover:border-white/10 transition-colors">
                            <CardContent className="p-4 sm:p-5 flex flex-col gap-3">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0', stat.bg)}>
                                        <stat.icon className={cn('w-5 h-5', stat.color)} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-400 line-clamp-2">{stat.label}</span>
                                </div>
                                <div>
                                    <h4 className="text-2xl font-black text-white tracking-tight">
                                        {stat.value}
                                        <span className="text-xs font-bold text-slate-500 ml-1">{stat.unit}</span>
                                    </h4>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Performance Timeline (Custom Bar Chart simulation) */}
                <Card className="lg:col-span-2 bg-[#151928]/80 backdrop-blur-xl border-white/5 shadow-xl relative overflow-hidden">
                    <CardHeader className="bg-white/[0.02] border-b border-white/5 py-5">
                        <CardTitle className="text-sm font-black text-white flex items-center gap-2 tracking-wide">
                            <TrendingUp className="w-5 h-5 text-indigo-400" /> مسار التطور الشامل (Timeline)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="flex items-end justify-between h-[280px] gap-2 pt-8 relative">
                            {/* Grid lines */}
                            <div className="absolute inset-x-0 bottom-8 top-8 flex flex-col justify-between pointer-events-none opacity-20">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="w-full h-px bg-slate-700" />
                                ))}
                            </div>

                            {performanceTimeline.map((data, idx) => (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-3 group relative z-10 h-full justify-end">
                                    <div className="w-full relative flex items-end justify-center h-full gap-1.5 pb-2">
                                        <div 
                                            className="w-1/3 max-w-[24px] bg-blue-500/80 rounded-t-md transition-all duration-500 group-hover:brightness-125 border-x border-t border-blue-400/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]" 
                                            style={{ height: `${data.motor}%` }}
                                        />
                                        <div 
                                            className="w-1/3 max-w-[24px] bg-indigo-500/80 rounded-t-md transition-all duration-500 group-hover:brightness-125 border-x border-t border-indigo-400/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]" 
                                            style={{ height: `${data.cognitive}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-bold text-slate-400">{data.month}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center gap-8 mt-6">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                                <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" /> الأداء الحركي
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                                <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" /> الأداء المعرفي
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Radar/Skills distribution */}
                <Card className="bg-[#151928]/80 backdrop-blur-xl border-white/5 shadow-xl relative overflow-hidden">
                    <CardHeader className="bg-white/[0.02] border-b border-white/5 py-5">
                        <CardTitle className="text-sm font-black text-white flex items-center gap-2 tracking-wide">
                            <Target className="w-5 h-5 text-emerald-400" /> تحليل المهارات الدقيقة
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-7">
                        {radarStats.map((stat, idx) => (
                            <div key={idx} className="space-y-2 group">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-bold text-slate-400 group-hover:text-slate-300 transition-colors">{stat.label}</span>
                                    <span className="font-black text-white">{stat.value}%</span>
                                </div>
                                <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                    <div 
                                        className={`h-full ${stat.color} rounded-full transition-all duration-1000 shadow-[0_0_10px_currentColor] opacity-80`} 
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
