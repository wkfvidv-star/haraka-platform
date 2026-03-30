import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video as VideoIcon, CheckCircle2, AlertTriangle, Brain, Activity, Download, Users, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const analysisData = [
    { name: '1 أكتوبر', videos: 12 },
    { name: '5 أكتوبر', videos: 25 },
    { name: '10 أكتوبر', videos: 40 },
    { name: '15 أكتوبر', videos: 35 },
    { name: '20 أكتوبر', videos: 50 },
    { name: '25 أكتوبر', videos: 82 },
    { name: '30 أكتوبر', videos: 60 },
];

const TEACHER_ACTIVES = [
    { id: 1, name: 'أ. محمود إبراهيم', count: 145, classes: 'الرابع والخامس', avatar: 'M' },
    { id: 2, name: 'أ. طارق زيد', count: 89, classes: 'السادس', avatar: 'T' },
    { id: 3, name: 'أ. سارة كامل', count: 64, classes: 'الثالث', avatar: 'S' },
];

export const AdminVideoAnalysis: React.FC = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-cairo" dir="rtl">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight">إحصائيات تحليل الفيديو</h2>
                    <p className="text-slate-400 font-medium mt-1">
                        مؤشرات مراقبة استخدام المعلمين لتقنية التحليل الحركي الأوتوماتيكي
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="bg-slate-900 border-slate-700 text-slate-300 hover:text-white rounded-xl">
                        تصفية التقرير
                    </Button>
                    <Button className="bg-[#3b82f6] hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20">
                        <Download className="w-4 h-4 ml-2" />
                        تخزين السجل
                    </Button>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { title: 'إجمالي الفيديوهات', value: '1,420', desc: 'مقطع محلل بنجاح', icon: VideoIcon, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                    { title: 'دقة الذكاء الاصطناعي', value: '98.5%', desc: 'متوسط ثقة الملاحظات', icon: Brain, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                    { title: 'كثافة الاستخدام', value: '+34%', desc: 'نمو استخدام المعلمين للميزة', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { title: 'المعلمين النشطين', value: '18', desc: 'معلم يستخدم التحليل هذا الأسبوع', icon: Users, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                ].map((kpi, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                        <Card className="bg-slate-900/60 backdrop-blur-md border-slate-800 hover:border-slate-700 transition-colors">
                            <CardContent className="p-5 flex items-center gap-4">
                                <div className={`p-4 rounded-xl ${kpi.bg}`}>
                                    <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                                </div>
                                <div>
                                    <p className="text-slate-400 text-xs font-bold">{kpi.title}</p>
                                    <h3 className="text-2xl font-black text-white leading-tight">{kpi.value}</h3>
                                    <p className="text-slate-500 text-[10px] mt-0.5">{kpi.desc}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* AI Performance Chart Areas */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-slate-900/60 backdrop-blur-md border-slate-800 relative overflow-hidden group">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                                <Layers className="w-5 h-5 text-purple-400" />
                                حجم الفيديوهات المحللة عبر النظام
                            </CardTitle>
                            <CardDescription className="text-slate-400">كمية عمليات التحليل على مدار الشهر</CardDescription>
                        </CardHeader>
                        <CardContent className="h-72 w-full pb-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={analysisData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorVideos" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'Cairo' }} axisLine={false} tickLine={false} dy={10} />
                                    <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'Cairo' }} axisLine={false} tickLine={false} dx={-10} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff', direction: 'rtl', fontFamily: 'Cairo' }}
                                        itemStyle={{ fontFamily: 'Cairo', fontWeight: 'bold', color: '#a855f7' }}
                                        labelStyle={{ color: '#94a3b8', marginBottom: '8px' }}
                                    />
                                    <Area type="monotone" name="مقطع تحليل" dataKey="videos" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorVideos)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Common AI School-wide Alerts */}
                    <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-amber-500" />
                                أبرز الملاحظات الحركية المتكررة (على مستوى المدرسة)
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex gap-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                    <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                                        <span className="text-amber-500 font-black text-sm">#1</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-amber-500 text-sm">عدم استقامة الظهر أثناء الجري (45 حالة)</h4>
                                        <p className="text-xs text-slate-300 mt-1">منتشر بشكل كبير في الصف الرابع، ينصح بإطلاق برنامج تقوية الجذع.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                                        <span className="text-purple-400 font-black text-sm">#2</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-purple-400 text-sm">زوايا القفز غير مثالية (28 حالة)</h4>
                                        <p className="text-xs text-slate-300 mt-1">تمركز القوة الحركية في إحدى الساقين أكثر من الأخرى.</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Most Active Teachers */}
                <div className="space-y-6">
                    <Card className="bg-slate-900/60 backdrop-blur-md border-slate-800 flex-1 h-full">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                                <Users className="w-5 h-5 text-[#3b82f6]" />
                                أكثر المعلمين استخداماً للنظام
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="space-y-3">
                                {TEACHER_ACTIVES.map((teacher, idx) => (
                                    <motion.div key={teacher.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="p-3 bg-slate-950/50 rounded-xl border border-slate-800 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-sm">
                                                {teacher.avatar}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-white">{teacher.name}</h4>
                                                <p className="text-[10px] text-slate-400 mt-0.5">يدرس: {teacher.classes}</p>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <span className="block text-lg font-black text-purple-400">{teacher.count}</span>
                                            <span className="text-[9px] text-slate-500">مقطع</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            <Button variant="ghost" className="w-full mt-4 text-xs font-bold text-[#3b82f6] hover:bg-blue-500/10">عرض القائمة الكاملة</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminVideoAnalysis;
