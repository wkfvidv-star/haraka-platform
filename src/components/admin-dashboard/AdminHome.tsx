import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Users,
    GraduationCap,
    Activity,
    Video,
    TrendingUp,
    AlertTriangle,
    ArrowUpRight,
    Brain,
    HeartPulse,
    BrainCircuit
} from 'lucide-react';
import { motion } from 'framer-motion';
import { InstitutionalKPIs } from '@/components/admin-dashboard/InstitutionalKPIs';

export const AdminHome: React.FC = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* 1. Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight">النظرة الشاملة</h2>
                    <p className="text-slate-400 font-medium mt-1">
                        ملخص أداء المنصة والإحصائيات الرئيسية لليوم
                    </p>
                </div>
                <Button className="bg-[#3b82f6] hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20">
                    تنزيل التقرير اليومي
                </Button>
            </div>

            {/* Institutional KPIs (Thesis Table 3) */}
            <InstitutionalKPIs />

            {/* 2. KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4" data-tour="admin_home">
                {[
                    { title: 'إجمالي التلاميذ', value: '2,450', trend: '+12%', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { title: 'إجمالي المعلمين', value: '184', trend: '+3%', icon: GraduationCap, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                    { title: 'نشاطات مكتملة (اليوم)', value: '8,234', trend: '+24%', icon: Activity, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                    { title: 'فيديوهات محللة', value: '456', trend: '+8%', icon: Video, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                    { title: 'مستوى التقدم العام', value: '87%', trend: '+5%', icon: TrendingUp, color: 'text-rose-500', bg: 'bg-rose-500/10' },
                ].map((kpi, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800 hover:border-slate-700 transition-colors">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-xl ${kpi.bg}`}>
                                        <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                                    </div>
                                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-2 py-0.5 text-xs font-bold">
                                        {kpi.trend}
                                    </Badge>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-3xl font-black text-white">{kpi.value}</h3>
                                    <p className="text-sm font-medium text-slate-400">{kpi.title}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* 3. Alerts & Quick Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Alerts Panel */}
                <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800 lg:col-span-1 border-l-4 border-l-amber-500" data-tour="admin_alerts">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-500" />
                            تنبيهات وإشعارات هامة
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            أحداث تتطلب انتباه الإدارة
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { text: 'انخفاض في مؤشر النشاط لـ 12 تلميذ في الصف 5-ب', time: 'قبل 10 دقائق', urgency: 'high' },
                            { text: 'المعلم "أحمد" تأخر في مراجعة التقييمات الأسبوعية', time: 'قبل ساعتين', urgency: 'medium' },
                            { text: 'تم رصد تحسن ملحوظ في الأداء الحركي لفريق كرة السلة', time: 'قبل 4 ساعات', urgency: 'low' },
                            { text: 'نظام التحليل واجه مشكلة في معالجة 3 فيديوهات', time: 'قبل 5 ساعات', urgency: 'high' },
                        ].map((alert, i) => (
                            <div key={i} className="flex gap-4 p-3 rounded-xl bg-slate-800/30 hover:bg-slate-800/80 transition-colors border border-slate-800/50">
                                <div className={`w-2 h-10 rounded-full mt-1 shrink-0 ${alert.urgency === 'high' ? 'bg-rose-500' :
                                    alert.urgency === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                                    }`} />
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-200 leading-snug">{alert.text}</p>
                                    <p className="text-xs text-slate-500 mt-1">{alert.time}</p>
                                </div>
                                <Button variant="ghost" size="icon" className="shrink-0 text-slate-400 hover:text-white">
                                    <ArrowUpRight className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Analytics Overview */}
                <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800 lg:col-span-2" data-tour="admin_metrics">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-white">تحليل المقاييس الثلاثية</CardTitle>
                        <CardDescription className="text-slate-400">
                            توزيع التقدم على المستويات البدنية، المعرفية، والنفسية
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Dummy progression bars to represent charts */}
                            {[
                                { label: 'النشاط البدني والحركي', val: '82%', icon: Activity, color: 'bg-blue-500', desc: 'استقرار ممتاز في التمارين' },
                                { label: 'التقدم المعرفي والأكاديمي', val: '75%', icon: Brain, color: 'bg-emerald-500', desc: 'تحسن في حل المشكلات' },
                                { label: 'الرفاه النفسي والاجتماعي', val: '91%', icon: HeartPulse, color: 'bg-rose-500', desc: 'ثقة عالية وتفاعل إيجابي' },
                            ].map((stat, i) => (
                                <div key={i} className="flex flex-col items-center justify-center p-6 bg-slate-950/50 rounded-2xl border border-slate-800/50 relative overflow-hidden group">
                                    <div className={`absolute top-0 w-full h-1 ${stat.color} opacity-50 group-hover:opacity-100 transition-opacity`} />
                                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                                        <stat.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h4 className="text-4xl font-black text-white mb-2">{stat.val}</h4>
                                    <p className="font-bold text-slate-300 text-center text-sm">{stat.label}</p>
                                    <p className="text-xs text-slate-500 text-center mt-2">{stat.desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* Placeholder for actual complex chart (e.g. Recharts) */}
                        <div className="mt-8 h-48 w-full rounded-2xl bg-gradient-to-b from-slate-800/30 to-slate-900/50 border border-slate-800 flex items-center justify-center border-dashed">
                            <div className="text-center">
                                <BrainCircuit className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                                <p className="text-slate-500 font-medium">مساحة مخصصة للرسم البياني المدمج (Recharts)</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
};

export default AdminHome;
