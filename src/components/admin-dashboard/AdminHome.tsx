import React, { useState, useEffect } from 'react';
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
    BrainCircuit,
    Play,
    Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { InstitutionalKPIs } from '@/components/admin-dashboard/InstitutionalKPIs';
import { unifiedDataService, SystemKPIs, Insight } from '@/services/unifiedDataService';
import { simulationEngine } from '@/utils/simulationEngine';
import { eventBus, EVENTS } from '@/services/eventBus';
import { useToast } from '@/components/ui/use-toast';

export const AdminHome: React.FC = () => {
    const [kpis, setKpis] = useState<SystemKPIs>(unifiedDataService.getKPIs());
    const [insights, setInsights] = useState<Insight[]>(unifiedDataService.getInsights('admin'));
    const [isSimulating, setIsSimulating] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const refreshData = () => {
            setKpis(unifiedDataService.getKPIs());
            setInsights(unifiedDataService.getInsights('admin'));
        };

        const unsubscribe = eventBus.subscribe(EVENTS.KPI_UPDATED, refreshData);
        const unsubscribeSim = eventBus.subscribe(EVENTS.SIMULATION_STEP, refreshData);

        return () => {
            unsubscribe();
            unsubscribeSim();
        };
    }, []);

    const handleRunSimulation = async () => {
        setIsSimulating(true);
        toast({
            title: "بدء المحاكاة",
            description: "جاري توليد بيانات مترابطة لجميع الحسابات...",
        });

        try {
            await simulationEngine.executeFullDayScenario();
            toast({
                title: "اكتملت المحاكاة",
                description: "تم تحديث النظام ببيانات يوماً كاملاً بنجاح.",
                variant: "default",
            });
        } catch (error) {
            toast({
                title: "خطأ في المحاكاة",
                description: "حدث خطأ غير متوقع أثناء توليد البيانات.",
                variant: "destructive",
            });
        } finally {
            setIsSimulating(false);
        }
    };

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
                <div className="flex gap-3">
                    <Button 
                        onClick={handleRunSimulation}
                        disabled={isSimulating}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-lg shadow-amber-500/20 gap-2"
                    >
                        {isSimulating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                        تشغيل محاكاة اليوم
                    </Button>
                    <Button className="bg-[#3b82f6] hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20">
                        تنزيل التقرير اليومي
                    </Button>
                </div>
            </div>

            {/* Institutional KPIs (Thesis Table 3) */}
            <InstitutionalKPIs />

            {/* 2. KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4" data-tour="admin_home">
                {[
                    { title: 'إجمالي التلاميذ', value: kpis.totalUsers.toLocaleString(), trend: '+12%', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { title: 'تلاميذ نشطون', value: kpis.activeStudents.toLocaleString(), trend: '+3%', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                    { title: 'نشاطات مكتملة', value: kpis.completedTasks.toLocaleString(), trend: '+24%', icon: ArrowUpRight, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                    { title: 'مشاركة المعلمين', value: `${kpis.teacherEngagement}%`, trend: '+8%', icon: GraduationCap, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                    { title: 'التقدم العام', value: `${kpis.averagePerformance}%`, trend: `+${kpis.improvementRate}%`, icon: TrendingUp, color: 'text-rose-500', bg: 'bg-rose-500/10' },
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
                            تنبيهات وإرشادات ذكية
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            اقتراحات Decision Intelligence بناءً على البيانات
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {insights.length > 0 ? insights.map((insight, i) => (
                            <div key={i} className="flex gap-4 p-3 rounded-xl bg-slate-800/30 hover:bg-slate-800/80 transition-colors border border-slate-800/50">
                                <div className={`w-2 h-10 rounded-full mt-1 shrink-0 ${insight.type === 'alert' ? 'bg-rose-500' :
                                    insight.type === 'recommendation' ? 'bg-amber-500' : 'bg-emerald-500'
                                    }`} />
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-200 leading-snug">{insight.title}</p>
                                    <p className="text-xs text-slate-400 mt-1">{insight.content}</p>
                                </div>
                                <Button variant="ghost" size="icon" className="shrink-0 text-slate-400 hover:text-white">
                                    <ArrowUpRight className="w-4 h-4" />
                                </Button>
                            </div>
                        )) : (
                           <div className="text-center py-8 text-slate-500 text-sm">لا توجد تنبيهات حالياً</div>
                        )}
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
