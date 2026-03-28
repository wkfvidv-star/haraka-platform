import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    Activity,
    Users,
    TrendingUp,
    HeartPulse,
    AlertCircle,
    CheckCircle2,
    ShieldAlert
} from 'lucide-react';
import { motion } from 'framer-motion';

export function InstitutionalKPIs() {
    // Mock institutional data based on thesis Table 3 (مؤشرات الأداء على مستوى المؤسسة)
    const kpis = {
        participationRate: 85, // % of students actively using the platform
        avgMotorProfileProgress: 12, // % improvement over last month
        healthRiskStudents: 5, // % of students needing special rehabilitation/attention
        totalAssessments: 1250,
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                    <Activity className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                    <h3 className="text-xl font-black text-white">مؤشرات الأداء المؤسسية (Institutional KPIs)</h3>
                    <p className="text-sm text-slate-400">نظرة عامة على صحة ونشاط المؤسسة التعليمية</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Participation Rate */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Card className="bg-slate-900/60 border-slate-800 relative overflow-hidden group h-full">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-blue-500/10"></div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold text-slate-400 flex items-center justify-between">
                                نسبة المشاركة الفعالة
                                <Users className="w-4 h-4 text-blue-400" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline gap-2 mb-3">
                                <span className="text-4xl font-black text-white">{kpis.participationRate}%</span>
                                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-0 h-5 px-1.5">+5% الشهر الماضي</Badge>
                            </div>
                            <Progress value={kpis.participationRate} className="h-1.5 bg-slate-800" />
                            <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                هدف المؤسسة: 90%
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Avg Motor Profile Progress */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Card className="bg-slate-900/60 border-slate-800 relative overflow-hidden group h-full">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-emerald-500/10"></div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold text-slate-400 flex items-center justify-between">
                                تطور البصمة الحركية (متوسط)
                                <TrendingUp className="w-4 h-4 text-emerald-400" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline gap-2 mb-3">
                                <span className="text-4xl font-black text-white">+{kpis.avgMotorProfileProgress}%</span>
                                <span className="text-xs font-bold text-slate-500">تحسن عام</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-4">
                                <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                                    <p className="text-[10px] text-slate-400 mb-1">السرعة والرشاقة</p>
                                    <p className="text-sm font-bold text-emerald-400">+15%</p>
                                </div>
                                <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                                    <p className="text-[10px] text-slate-400 mb-1">القوة الوظيفية</p>
                                    <p className="text-sm font-bold text-emerald-400">+8%</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Health Risk & Rehab Needs */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <Card className="bg-slate-900/60 border-slate-800 relative overflow-hidden group h-full border-b-2 border-b-amber-500/50">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-amber-500/10"></div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold text-slate-400 flex items-center justify-between">
                                مؤشر الاحتياج التأهيلي
                                <ShieldAlert className="w-4 h-4 text-amber-400" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-4xl font-black text-white">{kpis.healthRiskStudents}%</span>
                                <span className="text-xs font-bold text-slate-500">من إجمالي الطلاب</span>
                            </div>
                            <p className="text-xs text-amber-500/80 mb-4 font-medium flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                يتطلبون برامج تدريب علاجية أو مكيّفة
                            </p>
                            
                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex items-start gap-3 mt-auto">
                                <HeartPulse className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-bold text-amber-500 mb-0.5">توصية النظام</p>
                                    <p className="text-[10px] text-slate-300 leading-tight">توجيه أساتذة التربية البدنية لتخصيص حصص إضافية للفئة ذات المؤشر الأحمر.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
