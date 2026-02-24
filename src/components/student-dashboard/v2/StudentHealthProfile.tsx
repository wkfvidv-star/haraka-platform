import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Activity, Heart, Scale, Ruler, Moon, Droplets, Flame, Footprints } from 'lucide-react';

interface StudentHealthProfileProps {
    metrics?: {
        steps: number;
        calories: number;
        activeMinutes: number;
        date: string;
    } | null;
}

export const StudentHealthProfile: React.FC<StudentHealthProfileProps> = ({ metrics }) => {
    // Real Data from props with fallbacks
    const healthMetrics = {
        height: 145, // Still mock as it's typically in a Profile model we haven't fully exposed yet
        weight: 38,
        bmi: 18.1,
        bloodType: 'O+',
        heartRate: 78,
        steps: metrics?.steps || 0,
        calories: metrics?.calories || 0,
        sleep: '0 ساعات',
        hydration: '0 لتر'
    };

    const performanceStats = [
        { label: 'التحمل الدوري التنفسي', value: 85, color: 'bg-green-500' },
        { label: 'القوة العضلية', value: 72, color: 'bg-blue-500' },
        { label: 'المرونة', value: 65, color: 'bg-yellow-500' },
        { label: 'الرشاقة', value: 90, color: 'bg-orange-500' },
        { label: 'التوازن', value: 78, color: 'bg-purple-500' },
    ];

    return (
        <div className="space-y-10 animate-in slide-in-from-bottom-5 duration-500">

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="w-2 h-10 bg-teal-500 rounded-full shadow-[0_0_15px_rgba(20,184,166,0.4)]"></div>
                <h2 className="text-3xl font-black text-white tracking-tight">الملف البدني والصحي</h2>
            </div>

            {/* Row 1: Core Bio-Metrics (Cards) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                    { icon: Scale, value: healthMetrics.weight, unit: 'كجم', label: 'الوزن', color: 'text-teal-400', border: 'border-teal-500/20' },
                    { icon: Ruler, value: healthMetrics.height, unit: 'سم', label: 'الطول', color: 'text-blue-400', border: 'border-blue-500/20' },
                    { icon: Heart, value: healthMetrics.heartRate, unit: 'ن/د', label: 'نبضات القلب', color: 'text-red-400', border: 'border-red-500/20', pulse: true },
                    { icon: Activity, value: healthMetrics.bmi, unit: '', label: 'مؤشر الكتلة', color: 'text-indigo-400', border: 'border-indigo-500/20' }
                ].map((item, idx) => (
                    <Card key={idx} className={`glass-card ${item.border} hover:scale-[1.05] transition-all duration-300 shadow-xl overflow-hidden group`}>
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-current opacity-20" />
                        <CardContent className="p-6 flex flex-col items-center justify-center text-center relative z-10">
                            <item.icon className={`w-10 h-10 ${item.color} mb-3 ${item.pulse ? 'animate-pulse' : ''} group-hover:scale-110 transition-transform`} />
                            <div className="text-3xl font-black text-white mb-1">
                                {item.value} <span className="text-xs font-bold text-gray-500 uppercase">{item.unit}</span>
                            </div>
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Row 2: Daily Activity & Lifestyle */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Calories & Steps */}
                <Card className="col-span-1 glass-card border-orange-500/20 shadow-2xl overflow-hidden">
                    <CardHeader className="bg-white/5 border-b border-white/5 py-4">
                        <CardTitle className="text-base font-black flex items-center gap-3 text-orange-400">
                            <div className="p-1.5 rounded-lg bg-orange-500/10 ring-1 ring-orange-500/20">
                                <Flame className="w-5 h-5" />
                            </div>
                            <span>النشاط اليومي</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-400">
                                    <Footprints className="w-4 h-4 text-blue-400" /> الخطوات
                                </div>
                                <span className="text-lg font-black text-white">{healthMetrics.steps}</span>
                            </div>
                            <Progress value={(healthMetrics.steps / 10000) * 100} className="h-3 bg-white/5 [&>div]:bg-orange-500 border border-white/5 shadow-inner" />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-400">
                                    <Flame className="w-4 h-4 text-red-500" /> السعرات
                                </div>
                                <span className="text-lg font-black text-white">{healthMetrics.calories} <span className="text-[10px] text-gray-500">سعرة</span></span>
                            </div>
                            <Progress value={65} className="h-3 bg-white/5 [&>div]:bg-red-500 border border-white/5 shadow-inner" />
                        </div>
                    </CardContent>
                </Card>

                {/* Performance Bars */}
                <Card className="col-span-1 md:col-span-2 glass-card border-white/10 shadow-2xl overflow-hidden">
                    <CardHeader className="bg-white/5 border-b border-white/5 py-4">
                        <CardTitle className="text-base font-black text-white flex items-center gap-3">
                            <div className="p-1.5 rounded-lg bg-white/5 ring-1 ring-white/10">
                                <Activity className="w-5 h-5 text-blue-400" />
                            </div>
                            <span>تحليل القدرات البدنية</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                        {performanceStats.map((stat, idx) => (
                            <div key={idx} className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-xs font-black text-gray-300 uppercase tracking-tight">{stat.label}</span>
                                    <span className="text-xs font-black text-white bg-white/5 px-2 py-0.5 rounded border border-white/10">{stat.value}%</span>
                                </div>
                                <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner ring-1 ring-black/20">
                                    <div
                                        className={`h-full rounded-full ${stat.color} shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-all duration-1000`}
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
};
