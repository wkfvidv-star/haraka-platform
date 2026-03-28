import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Activity, Brain, HeartPulse, Filter, TrendingUp, Download, BarChart3, Target, Cpu
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminPerformance: React.FC = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* Header & Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight">تحليل الأداء العام</h2>
                    <p className="text-slate-400 font-medium mt-1">
                        مراقبة التقدم العام الشامل لكل النشاطات (الحركي، المعرفي، النفسي)
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="bg-slate-900 border-slate-700 text-slate-300 hover:text-white rounded-xl">
                        <Filter className="w-4 h-4 ml-2" />
                        تصفية
                    </Button>
                    <Button className="bg-[#3b82f6] hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20">
                        <Download className="w-4 h-4 ml-2" />
                        تصدير التقرير
                    </Button>
                </div>
            </div>

            {/* Filters Bar */}
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800">
                <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500">الصف الدراسي</label>
                        <Select defaultValue="all">
                            <SelectTrigger className="bg-slate-950 border-slate-800 text-white rounded-xl">
                                <SelectValue placeholder="اختر الصف" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800 text-white">
                                <SelectItem value="all">جميع الصفوف</SelectItem>
                                <SelectItem value="g4">الرابع</SelectItem>
                                <SelectItem value="g5">الخامس</SelectItem>
                                <SelectItem value="g6">السادس</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500">الفئة العمرية</label>
                        <Select defaultValue="all">
                            <SelectTrigger className="bg-slate-950 border-slate-800 text-white rounded-xl">
                                <SelectValue placeholder="اختر العمر" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800 text-white">
                                <SelectItem value="all">الجميع</SelectItem>
                                <SelectItem value="9-10">9 - 10 سنوات</SelectItem>
                                <SelectItem value="11-12">11 - 12 سنة</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500">نوع النشاط</label>
                        <Select defaultValue="all">
                            <SelectTrigger className="bg-slate-950 border-slate-800 text-white rounded-xl">
                                <SelectValue placeholder="اختر النشاط" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800 text-white">
                                <SelectItem value="all">جميع النشاطات</SelectItem>
                                <SelectItem value="motor">حركي وبدني</SelectItem>
                                <SelectItem value="cognitive">معرفي</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500">المعلم / المدرب</label>
                        <Select defaultValue="all">
                            <SelectTrigger className="bg-slate-950 border-slate-800 text-white rounded-xl">
                                <SelectValue placeholder="اختر المعلم" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800 text-white">
                                <SelectItem value="all">الجميع</SelectItem>
                                <SelectItem value="t1">أ. محمود إبراهيم</SelectItem>
                                <SelectItem value="t2">أ. فاطمة سعيد</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Main KPI Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: 'النشاط الحركي', value: '88%', trend: '+4.5%', icon: Activity, color: 'text-blue-500', barCol: 'bg-blue-500' },
                    { title: 'الأداء المعرفي', value: '76%', trend: '+2.1%', icon: Brain, color: 'text-emerald-500', barCol: 'bg-emerald-500' },
                    { title: 'الرفاه النفسي', value: '92%', trend: '+5.8%', icon: HeartPulse, color: 'text-rose-500', barCol: 'bg-rose-500' },
                ].map((kpi, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }}>
                        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800 relative overflow-hidden group">
                            <div className={`absolute bottom-0 w-full h-1 ${kpi.barCol} opacity-50 group-hover:opacity-100 transition-opacity`} />
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/50">
                                        <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                                    </div>
                                    <div className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg text-sm font-bold">
                                        <TrendingUp className="w-4 h-4" />
                                        {kpi.trend}
                                    </div>
                                </div>
                                <h3 className="text-4xl font-black text-white mb-1">{kpi.value}</h3>
                                <p className="text-slate-400 font-medium">{kpi.title}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Trend Line Chart Dummy */}
                <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-[#3b82f6]" />
                            التقدم الزمني خلال الفصل الدراسي
                        </CardTitle>
                        <CardDescription className="text-slate-400">تحليل الاتجاهات للمؤشرات الثلاثة</CardDescription>
                    </CardHeader>
                    <CardContent className="h-72 flex items-center justify-center border-t border-slate-800/50  relative">
                        <div className="absolute inset-x-8 inset-y-8 flex items-end justify-between gap-2">
                            {[40, 55, 45, 60, 75, 65, 80, 85, 90, 88].map((h, i) => (
                                <div key={i} className="w-full flex justify-center gap-1 items-end h-full">
                                    <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 1, delay: i * 0.05 }} className="w-1/3 bg-blue-500/80 rounded-t-sm" />
                                    <motion.div initial={{ height: 0 }} animate={{ height: `${Math.max(20, h - 20)}%` }} transition={{ duration: 1, delay: i * 0.05 }} className="w-1/3 bg-emerald-500/80 rounded-t-sm" />
                                    <motion.div initial={{ height: 0 }} animate={{ height: `${Math.min(100, h + 15)}%` }} transition={{ duration: 1, delay: i * 0.05 }} className="w-1/3 bg-rose-500/80 rounded-t-sm" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Distribution Chart Dummy */}
                <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                            <Target className="w-5 h-5 text-purple-500" />
                            توزيع مستويات الأداء
                        </CardTitle>
                        <CardDescription className="text-slate-400">نسب التلاميذ في كل مستوى</CardDescription>
                    </CardHeader>
                    <CardContent className="h-72 flex items-center justify-center border-t border-slate-800/50 flex-col gap-6">
                        <div className="w-full max-w-sm space-y-4">
                            {[
                                { label: 'مستوى متقدم', val: 35, color: 'bg-blue-500' },
                                { label: 'مستوى متوسط', val: 45, color: 'bg-emerald-500' },
                                { label: 'مستوى تأسيسي', val: 20, color: 'bg-amber-500' },
                            ].map((stat, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-bold text-slate-300">{stat.label}</span>
                                        <span className="font-bold text-white">{stat.val}%</span>
                                    </div>
                                    <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${stat.val}%` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className={`h-full ${stat.color} rounded-full`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
};

export default AdminPerformance;
