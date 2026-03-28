import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { HeartPulse, Activity, AlertOctagon, TrendingUp, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export const AdminHealth: React.FC = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-cairo">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                        <HeartPulse className="w-8 h-8 text-rose-500" />
                        الملف الصحي الشامل
                    </h2>
                    <p className="text-slate-400 font-medium mt-1">
                        متابعة الحالة الصحية والبدنية لجميع الطلاب (BMI، مؤشرات اللياقة، الإصابات)
                    </p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                        placeholder="بحث عن تلميذ..."
                        className="bg-slate-900 border-slate-800 text-white rounded-xl pr-10 focus:ring-rose-500"
                    />
                </div>
            </div>

            {/* Global Health KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { title: 'نسبة اللياقة العامة', val: '86%', desc: '+3% عن الشهر الماضي', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                    { title: 'متوسط مؤشر الكتلة (BMI)', val: '21.4', desc: 'ضمن المعدل الطبيعي', icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { title: 'حالات تحتاج متابعة', val: '14', desc: 'سمنة / نقص وزن', icon: AlertOctagon, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                    { title: 'سجل الإصابات النشطة', val: '3', desc: 'إعفاء من الأنشطة', icon: HeartPulse, color: 'text-rose-500', bg: 'bg-rose-500/10' },
                ].map((kpi, i) => (
                    <Card key={i} className="bg-slate-900/50 backdrop-blur-sm border-slate-800">
                        <CardContent className="p-5 flex flex-col justify-center gap-2">
                            <div className="flex justify-between items-center mb-1">
                                <h3 className="text-slate-400 text-sm font-bold">{kpi.title}</h3>
                                <div className={`p-2 rounded-lg ${kpi.bg}`}>
                                    <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                                </div>
                            </div>
                            <p className="text-3xl font-black text-white">{kpi.val}</p>
                            <p className="text-xs text-slate-500">{kpi.desc}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Needs Attention List */}
                <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800">
                    <CardContent className="p-6">
                        <h3 className="font-bold text-white mb-6 text-lg border-b border-slate-800 pb-2">تلاميذ يحتاجون تدخلاً صحياً</h3>
                        <div className="space-y-4">
                            {[
                                { name: 'عمر محمود', issue: 'مؤشر كتلة جسم مرتفع (BMI: 28)', tag: 'سمنة مفرطة', color: 'rose' },
                                { name: 'وليد سامي', issue: 'إصابة في الكاحل', tag: 'إعفاء طبي', color: 'amber' },
                                { name: 'سعاد فاضل', issue: 'ضعف عام مسجل في التقرير', tag: 'استشارة', color: 'blue' },
                            ].map((student, i) => (
                                <div key={i} className="flex justify-between items-center p-4 bg-slate-950/50 rounded-xl border border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-10 rounded-full bg-${student.color}-500 shrink-0`} />
                                        <div>
                                            <h4 className="font-bold text-slate-200">{student.name}</h4>
                                            <p className="text-xs text-slate-400 mt-1">{student.issue}</p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className={`border-${student.color}-500/30 text-${student.color}-400 bg-${student.color}-500/10`}>
                                        {student.tag}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* BMI Distribution Chart */}
                <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800">
                    <CardContent className="p-6 h-full flex flex-col">
                        <h3 className="font-bold text-white mb-6 text-lg border-b border-slate-800 pb-2">التوزيع العام لـ BMI في المنصة</h3>
                        <div className="flex-1 flex flex-col justify-center mb-4">
                            {/* Dummy BMI Chart */}
                            <div className="w-full flex items-end justify-center h-48 gap-2 px-8">
                                <div className="w-1/4 bg-blue-500/40 hover:bg-blue-500/60 transition-colors rounded-t flex flex-col justify-end items-center pb-2 text-xs font-bold text-white" style={{ height: '15%' }}>15%</div>
                                <div className="w-1/4 bg-emerald-500/70 hover:bg-emerald-500/90 transition-colors rounded-t flex flex-col justify-end items-center pb-2 text-xl font-bold text-white" style={{ height: '65%' }}>65%</div>
                                <div className="w-1/4 bg-amber-500/60 hover:bg-amber-500/80 transition-colors rounded-t flex flex-col justify-end items-center pb-2 text-sm font-bold text-white" style={{ height: '12%' }}>12%</div>
                                <div className="w-1/4 bg-rose-500/50 hover:bg-rose-500/70 transition-colors rounded-t flex flex-col justify-end items-center pb-2 text-xs font-bold text-white" style={{ height: '8%' }}>8%</div>
                            </div>
                            <div className="flex justify-center gap-2 mt-4 px-8 pt-4 border-t border-slate-800">
                                <div className="w-1/4 text-center text-xs font-bold text-slate-400">نقص وزن</div>
                                <div className="w-1/4 text-center text-xs font-bold text-slate-400">طبيعي</div>
                                <div className="w-1/4 text-center text-xs font-bold text-slate-400">زيادة طفيفة</div>
                                <div className="w-1/4 text-center text-xs font-bold text-slate-400">سمنة</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
};

export default AdminHealth;
