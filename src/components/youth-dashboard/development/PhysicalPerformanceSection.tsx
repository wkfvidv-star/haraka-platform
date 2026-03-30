import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Flame, Activity, Zap, Target, Trophy, ChevronLeft, Footprints, Dumbbell } from 'lucide-react';
import { motion } from 'framer-motion';

export function PhysicalPerformanceSection() {
    return (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 bg-orange-500/20 rounded-xl border border-orange-500/30">
                            <Flame className="w-6 h-6 text-orange-400" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">الأداء الحركي الشامل</h2>
                    </div>
                    <p className="text-slate-400 font-bold max-w-xl text-sm leading-relaxed">
                        تتبع مستواك البدني بدقة عالية، حلل قواك الحركية، وقارن أرقامك مع المعايير الاحترافية لرفع جاهزيتك.
                    </p>
                </div>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold h-12 px-6 shadow-[0_0_20px_rgba(249,115,22,0.3)] shrink-0 rounded-xl transition-all hover:scale-105 border-none">
                    بدء اختبار قياس الأداء <Flame className="w-4 h-4 mr-2" />
                </Button>
            </div>

            {/* Top Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {[
                    { title: "القوة الانفجارية", value: "92", unit: "W/kg", icon: Zap, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
                    { title: "السرعة القصوى", value: "31.5", unit: "km/h", icon: Activity, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
                    { title: "التحمل المستمر", value: "88", unit: "Vo2Max", icon: Target, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
                    { title: "المرونة الشاملة", value: "115", unit: "درجة", icon: Footprints, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
                ].map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                        <Card className={`relative overflow-hidden bg-[#0B0E14]/80 backdrop-blur-xl border ${stat.border}`}>
                            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl -mr-12 -mt-12 opacity-50 ${stat.bg}`} />
                            <CardContent className="p-5 flex flex-col justify-between h-full relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}><stat.icon className="w-5 h-5" /></div>
                                    <Badge className="bg-white/5 text-white/70 hover:bg-white/10 font-bold px-2 py-0.5 rounded-md border border-white/10">{stat.unit}</Badge>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-500">{stat.title}</h4>
                                    <div className="text-3xl font-black text-white flex items-baseline gap-1">
                                        {stat.value}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Radar Chart & Active Programs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 bg-gradient-to-br from-slate-900/90 to-[#0a101d] border-white/5 shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50 pointer-events-none" />
                    <CardHeader className="pb-2 border-b border-white/5 bg-white/5 relative z-10">
                        <CardTitle className="flex items-center justify-between text-white">
                            <span className="flex items-center gap-2 font-black text-lg"><Dumbbell className="w-5 h-5 text-indigo-400" /> تحليل الكتلة العضلية والأداء</span>
                            <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">تحديث تلقائي الذكاء الاصطناعي</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 relative z-10 flex flex-col items-center justify-center min-h-[300px]">
                        {/* Placeholder for actual Radar Chart to maintain premium look without complex dependencies */}
                        <div className="relative w-64 h-64 flex items-center justify-center mt-8 md:mt-0">
                            <div className="absolute inset-0 border-[3px] border-indigo-500/20 rounded-full animate-[spin_10s_linear_infinite]" />
                            <div className="absolute inset-4 border border-indigo-500/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                            <div className="absolute inset-12 border border-indigo-400/20 rounded-full flex flex-col items-center justify-center bg-indigo-500/5 backdrop-blur-sm">
                                <Trophy className="w-10 h-10 text-yellow-400 mb-2 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
                                <span className="text-white font-black text-xl">متوازن</span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">التصنيف الإجمالي</span>
                            </div>
                            
                            {/* Hexagon approximation */}
                            <svg className="absolute inset-0 w-full h-full text-indigo-500/30 drop-shadow-2xl pointer-events-none" viewBox="0 0 100 100">
                                <polygon points="50,5 95,27 95,73 50,95 5,73 5,27" fill="currentColor" opacity="0.4" stroke="rgba(99,102,241,0.8)" strokeWidth="1" />
                                <polygon points="50,20 80,35 80,65 50,80 20,65 20,35" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="2" />
                            </svg>
                            
                            {/* Labels */}
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-300 bg-slate-900/80 px-2 py-1 rounded border border-white/5">السرعة</div>
                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-300 bg-slate-900/80 px-2 py-1 rounded border border-white/5">المرونة</div>
                            <div className="absolute top-1/2 -right-14 -translate-y-1/2 text-xs font-bold text-slate-300 bg-slate-900/80 px-2 py-1 rounded border border-white/5">القوة</div>
                            <div className="absolute top-1/2 -left-14 -translate-y-1/2 text-xs font-bold text-slate-300 bg-slate-900/80 px-2 py-1 rounded border border-white/5">التحمل</div>
                        </div>
                    </CardContent>
                </Card>

                {/* Progress Details */}
                <Card className="bg-[#0B0E14]/80 backdrop-blur-md border border-white/5 flex flex-col shadow-xl">
                    <CardHeader className="pb-4 border-b border-white/5 bg-white/5">
                        <CardTitle className="text-lg font-black text-white flex items-center gap-2">
                           <Target className="w-5 h-5 text-orange-400" /> النقاط المستهدفة
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col gap-6 p-6">
                        {[
                            { label: "قوة الجذع (Core)", target: "95%", current: 82, color: "bg-orange-500" },
                            { label: "التوازن الحركي", target: "100%", current: 90, color: "bg-blue-500" },
                            { label: "كفاءة المفاصل", target: "90%", current: 75, color: "bg-green-500" }
                        ].map((item, i) => (
                            <div key={i} className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
                                <div className="flex justify-between items-center text-sm font-bold">
                                    <span className="text-slate-300">{item.label}</span>
                                    <span className="text-white bg-white/10 px-2 py-0.5 rounded text-[10px]">{item.target} مستهدف</span>
                                </div>
                                <div className="h-3 relative bg-slate-800 rounded-full overflow-hidden shadow-inner border border-white/5">
                                    <motion.div 
                                        initial={{ width: 0 }} 
                                        animate={{ width: `${item.current}%` }} 
                                        transition={{ duration: 1, delay: 0.5 + i * 0.2 }}
                                        className={`absolute h-full ${item.color} rounded-full shadow-[0_0_10px_currentColor]`} 
                                    />
                                </div>
                            </div>
                        ))}

                        <div className="mt-auto pt-2">
                            <Button variant="outline" className="w-full justify-between bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10 font-bold h-12 rounded-xl transition-all shadow-md">
                                استعراض السجل الكامل <ChevronLeft className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
