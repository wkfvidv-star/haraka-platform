import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Users,
    GraduationCap,
    School,
    Map,
    Activity,
    Trophy,
    TrendingUp,
    BrainCircuit,
    Zap
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

// Mock Data
const weeklyActivityData = [
    { day: 'السبت', مدرسة: 4000, مجتمع: 2400 },
    { day: 'الأحد', مدرسة: 3000, مجتمع: 1398 },
    { day: 'الإثنين', مدرسة: 2000, مجتمع: 9800 },
    { day: 'الثلاثاء', مدرسة: 2780, مجتمع: 3908 },
    { day: 'الأربعاء', مدرسة: 1890, مجتمع: 4800 },
    { day: 'الخميس', مدرسة: 2390, مجتمع: 3800 },
    { day: 'الجمعة', مدرسة: 3490, مجتمع: 4300 },
];

const distributionData = [
    { name: 'شباب', value: 45 },
    { name: 'تلاميذ', value: 35 },
    { name: 'معلمون', value: 10 },
    { name: 'مدربون', value: 10 },
];

export function GlobalDashboard() {
    const kpiCards = [
        { title: 'التلاميذ', value: '45,231', icon: GraduationCap, color: 'text-blue-400', bg: 'bg-blue-500/10', trend: '+12%' },
        { title: 'الشباب', value: '112,045', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10', trend: '+24%' },
        { title: 'المعلمون', value: '3,420', icon: BrainCircuit, color: 'text-indigo-400', bg: 'bg-indigo-500/10', trend: '+2%' },
        { title: 'المدربون', value: '1,850', icon: Users, color: 'text-orange-400', bg: 'bg-orange-500/10', trend: '+5%' },
        { title: 'المدارس', value: '412', icon: School, color: 'text-emerald-400', bg: 'bg-emerald-500/10', trend: '+0%' },
        { title: 'المديريات', value: '48', icon: Map, color: 'text-rose-400', bg: 'bg-rose-500/10', trend: 'ثابت' },
        { title: 'الأنشطة المنجزة', value: '1.2M', icon: Activity, color: 'text-cyan-400', bg: 'bg-cyan-500/10', trend: '+45%' },
        { title: 'التحديات النشطة', value: '24', icon: Trophy, color: 'text-purple-400', bg: 'bg-purple-500/10', trend: 'مستمر' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* Platform Title Area */}
            <div>
                <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                    الرؤية الشاملة
                    <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-bold border border-indigo-500/20 uppercase tracking-widest">
                        System Live
                    </span>
                </h2>
                <p className="text-slate-400 mt-2 font-medium">نظرة لحظية على أداء منصة حركة بالكامل (البيئة المدرسية والمجتمعية).</p>
            </div>

            {/* KPI Grid (The 8 requested metrics) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {kpiCards.map((kpi, index) => (
                    <Card key={index} className="bg-[#11162d]/80 border-white/5 backdrop-blur-xl hover:border-indigo-500/30 transition-all duration-300 group">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div className={`p-3 rounded-2xl ${kpi.bg} ${kpi.color} mb-4 ring-1 ring-white/5 group-hover:scale-110 transition-transform`}>
                                    <kpi.icon className="w-6 h-6" />
                                </div>
                                <div className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                                    {kpi.trend}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-slate-400 text-sm font-bold mb-1">{kpi.title}</h3>
                                <div className="text-3xl font-black text-white tracking-tighter">{kpi.value}</div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Activity Chart */}
                <Card className="lg:col-span-2 bg-[#11162d]/80 border-white/5 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="text-white text-xl flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-indigo-400" />
                            نشاط المستخدمين التراكمي
                        </CardTitle>
                        <CardDescription className="text-slate-400">تحليل التفاعل المدمج بين البيئة المدرسية والمجتمعية خلال الأسبوع</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[350px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={weeklyActivityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorSchool" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.5} />
                                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorCommunity" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.5} />
                                            <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#2e334d" vertical={false} />
                                    <XAxis dataKey="day" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <RechartsTooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff' }}
                                        itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                                    />
                                    <Legend verticalAlign="top" height={36} iconType="circle" />
                                    <Area type="monotone" name="البيئة المدرسية" dataKey="مدرسة" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorSchool)" />
                                    <Area type="monotone" name="البيئة المجتمعية" dataKey="مجتمع" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#colorCommunity)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* User Distribution Bar Chart */}
                <Card className="lg:col-span-1 bg-[#11162d]/80 border-white/5 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="text-white text-xl">توزيع المستخدمين</CardTitle>
                        <CardDescription className="text-slate-400">الكثافة الديموغرافية للمنصة</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[350px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={distributionData} layout="vertical" margin={{ top: 0, right: 0, left: 40, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#2e334d" horizontal={true} vertical={false} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" stroke="#64748b" tick={{ fill: '#cbd5e1', fontSize: 12, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                                    <RechartsTooltip
                                        cursor={{ fill: '#1e293b', opacity: 0.4 }}
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff' }}
                                    />
                                    <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={24} name="النسبة %" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        {/* System Alerts */}
                        <div className="mt-6 space-y-3">
                            <h4 className="text-sm font-black text-slate-300 uppercase tracking-widest mb-4">التنبيهات الحية</h4>

                            <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <div>
                                    <div className="text-sm font-bold text-white">تسجيل مكثف للشباب</div>
                                    <div className="text-xs text-slate-400">زيادة بنسبة 45% في تسجيلات الشباب في الرياض خلال 24 ساعة.</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                <div className="w-2 h-2 mt-1.5 rounded-full bg-amber-500" />
                                <div>
                                    <div className="text-sm font-bold text-white">انخفاض التفاعل المدرسي</div>
                                    <div className="text-xs text-slate-400">لوحظ انخفاض في تفاعل المنطقة الشرقية (مدارس الطالبات).</div>
                                </div>
                            </div>

                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
