import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { HeartPulse, ActivitySquare, ShieldAlert, Timer, ChevronLeft, CheckCircle2, AlertTriangle, Wind, Droplets } from 'lucide-react';
import { motion } from 'framer-motion';

export function RehabilitationSection() {
    return (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 bg-rose-500/20 rounded-xl border border-rose-500/30">
                            <HeartPulse className="w-6 h-6 text-rose-400" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">إعادة التأهيل والاستشفاء</h2>
                    </div>
                    <p className="text-slate-400 font-bold max-w-xl text-sm leading-relaxed">
                        برامج تعافي مخصصة مدعومة بالذكاء الاصطناعي للإصابات، وتتبع دقيق لجاهزية العضلات والمفاصل لضمان عودة قوية وآمنة.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10 font-bold h-12 rounded-xl transition-all">
                        تواصل مع المعالج <Wind className="w-4 h-4 mr-2" />
                    </Button>
                    <Button className="bg-rose-500 hover:bg-rose-600 text-white font-bold h-12 px-6 shadow-[0_0_20px_rgba(225,29,72,0.3)] shrink-0 rounded-xl transition-all hover:scale-105 border-none">
                        التشخيص اليومي (AI) <ShieldAlert className="w-4 h-4 mr-2" />
                    </Button>
                </div>
            </div>

            {/* Smart Recovery Alert */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="bg-gradient-to-r from-rose-500/10 to-orange-500/10 border-rose-500/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgNDAgTDEwIDQwIEwyMCAyMCBMMzAgMjAgTDQwIDAgTDUwIDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyMjUsIDI5LCA3MiwgMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] pointer-events-none" />
                    <CardContent className="p-5 flex flex-col md:flex-row items-center gap-5 relative z-10">
                        <div className="p-3 bg-rose-500/20 rounded-2xl">
                            <AlertTriangle className="w-8 h-8 text-rose-400 animate-pulse" />
                        </div>
                        <div className="flex-1 text-center md:text-right">
                            <h3 className="text-lg font-black text-rose-300 mb-1">إشعار الاستشفاء العضلي</h3>
                            <p className="text-rose-100/80 text-sm font-bold">بناءً على تمرين الأمس، عضلة الفخذ الأمامية اليمنى (Quad) مجهدة بنسبة 78%.ُنصح بتمارين التمدد وعدم المجهود القاسي اليوم.</p>
                        </div>
                        <Button className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold rounded-xl whitespace-nowrap">
                            عرض تمارين الإطالة
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Active Program Details */}
                <Card className="lg:col-span-2 bg-gradient-to-br from-[#0B0E14]/90 to-slate-900 border-white/5 shadow-xl relative overflow-hidden">
                    <CardHeader className="pb-4 border-b border-white/5 bg-white/5">
                        <CardTitle className="text-lg font-black text-white flex justify-between items-center">
                            <span className="flex items-center gap-2">
                                <ActivitySquare className="w-5 h-5 text-indigo-400" /> البرنامج التأهيلي النشط: الركبة
                            </span>
                            <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">المرحلة 2 الأسبوع 3</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            {/* Visual Timeline */}
                            <div className="relative pt-6 pb-2">
                                <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 rounded-full" />
                                <div className="absolute top-1/2 right-0 w-[50%] h-1 bg-indigo-500 -translate-y-1/2 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                                
                                <div className="relative flex justify-between items-center z-10">
                                    {[
                                        { label: "الألم الحاد", phase: 1, active: true },
                                        { label: "المدى الحركي", phase: 2, active: true },
                                        { label: "التقوية المطلقة", phase: 3, active: false },
                                        { label: "العودة للملعب", phase: 4, active: false }
                                    ].map((step, idx) => (
                                        <div key={idx} className="flex flex-col items-center gap-2">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs border-2 transition-all ${
                                                step.active ? "bg-indigo-500 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.6)]" : "bg-slate-900 border-slate-700 text-slate-500"
                                            }`}>
                                                {step.active ? <CheckCircle2 className="w-4 h-4" /> : step.phase}
                                            </div>
                                            <span className={`text-[11px] font-bold ${step.active ? "text-indigo-300" : "text-slate-500"}`}>{step.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Today's Tasks */}
                            <div className="space-y-3 mt-6">
                                <h4 className="text-sm font-black text-slate-300 mb-3">مهام الاستشفاء اليوم (3 متبقية)</h4>
                                {[
                                    { title: "علاج بالثلج (Cryotherapy)", duration: "15 دقيقة", icon: Droplets, type: "cold", done: true },
                                    { title: "تمارين التحمل الثابت (Isometrics)", duration: "20 دقيقة", icon: ActivitySquare, type: "active", done: false },
                                    { title: "التمدد الديناميكي للورك", duration: "10 دقائق", icon: HeartPulse, type: "stretch", done: false }
                                ].map((task, idx) => (
                                    <div key={idx} className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${task.done ? "bg-white/5 border-white/5 opacity-50" : "bg-slate-800/50 border-white/10 hover:bg-slate-800 hover:border-slate-600"}`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-slate-900 border border-white/5 ${task.done ? "text-slate-500" : "text-indigo-400"}`}>
                                                <task.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h5 className={`font-bold text-sm ${task.done ? "text-slate-400 line-through" : "text-white"}`}>{task.title}</h5>
                                                <span className="text-[10px] text-slate-400 flex items-center gap-1 font-bold mt-0.5"><Timer className="w-3 h-3" /> {task.duration}</span>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" className={task.done ? "text-slate-500" : "text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300"}>
                                            {task.done ? "مكتمل" : "ابدأ الآن"}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Readiness Vitals */}
                <Card className="bg-[#0B0E14]/90 backdrop-blur-xl border-white/5 shadow-xl flex flex-col">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-black text-white flex items-center justify-between">
                            مؤشر الجاهزية <Badge className="bg-green-500/20 text-green-400">82% مستعد</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col gap-5">
                        {/* Circular Progress Representation */}
                        <div className="flex justify-center py-4">
                            <div className="relative w-32 h-32 flex items-center justify-center rounded-full bg-slate-900 border-4 border-slate-800 shadow-inner">
                                <svg className="absolute inset-0 w-full h-full -rotate-90">
                                    <circle cx="50%" cy="50%" r="46%" fill="none" stroke="currentColor" strokeWidth="8" className="text-green-500/10" />
                                    <motion.circle 
                                        cx="50%" cy="50%" r="46%" fill="none" stroke="currentColor" strokeWidth="8" 
                                        strokeDasharray="289" strokeDashoffset="52" strokeLinecap="round"
                                        className="text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]" 
                                        initial={{ strokeDashoffset: 289 }} animate={{ strokeDashoffset: 52 }} transition={{ duration: 1.5, ease: "easeOut" }}
                                    />
                                </svg>
                                <div className="text-center flex flex-col items-center">
                                    <span className="text-3xl font-black text-white">82<span className="text-lg">%</span></span>
                                    <span className="text-[9px] text-green-400 font-bold uppercase tracking-widest mt-1">التعافي العام</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[
                                { label: "جودة النوم", val: "7.5 س", score: "جيد", border: "border-green-500/20", text: "text-green-400" },
                                { label: "الضغط العضلي", val: "متوسط", score: "تحذير", border: "border-yellow-500/20", text: "text-yellow-400" },
                                { label: "تقلب معدل نبض القلب (HRV)", val: "62 ms", score: "مثالي", border: "border-blue-500/20", text: "text-blue-400" },
                            ].map((stat, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                    <span className="text-xs font-bold text-slate-300">{stat.label}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-black text-white">{stat.val}</span>
                                        <Badge variant="outline" className={`border ${stat.border} ${stat.text} bg-transparent px-1.5 py-0 text-[9px]`}>{stat.score}</Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
