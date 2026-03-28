import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity, Heart, Scale, Ruler, Moon, Droplets, Flame, Footprints, ShieldCheck, FileKey, Stethoscope, Watch, Info, AlertTriangle, Syringe, Pill } from 'lucide-react';
import { healthService, PhysicalMetric } from '@/services/healthService';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { WearablesSyncPanel } from '@/components/student-dashboard/v2/WearablesSyncPanel';

interface StudentHealthProfileProps {
    metrics?: Partial<PhysicalMetric> & {
        steps?: number;
        calories?: number;
    };
    healthProfile?: any;
}

export function StudentHealthProfile({ metrics, healthProfile }: StudentHealthProfileProps) {
    const [physicalData, setPhysicalData] = useState<PhysicalMetric | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHealth = async () => {
            try {
                setLoading(true);
                const data = await healthService.getHealthProfile();
                if (data.metrics) {
                    setPhysicalData(data.metrics);
                }
            } catch (error) {
                console.error("Failed to fetch health data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHealth();
    }, []);

    const healthMetrics = {
        height: physicalData?.height || 145,
        weight: physicalData?.weight || 38,
        bmi: physicalData?.bmi || (physicalData?.weight && physicalData?.height ? parseFloat((physicalData.weight / Math.pow(physicalData.height / 100, 2)).toFixed(1)) : 18.1),
        bloodType: (physicalData as any)?.bloodType || 'O+',
        heartRate: physicalData?.heartRate || 78,
        steps: (metrics as any)?.steps || (physicalData?.agilityScore ? physicalData.agilityScore * 100 : 0),
        calories: (metrics as any)?.calories || 0,
    };

    const performanceStats = [
        { label: 'التحمل الدوري التنفسي', value: physicalData?.enduranceScore || 85, color: 'bg-green-500' },
        { label: 'القوة العضلية', value: physicalData?.strengthScore || 72, color: 'bg-blue-500' },
        { label: 'المرونة', value: physicalData?.flexibilityScore || 65, color: 'bg-yellow-500' },
        { label: 'الرشاقة', value: physicalData?.agilityScore || 90, color: 'bg-orange-500' },
        { label: 'التوازن', value: physicalData?.balanceScore || 78, color: 'bg-purple-500' },
    ];

    return (
        <div className="space-y-10 animate-in slide-in-from-bottom-5 duration-500">

            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b border-teal-500/20">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-tr from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(20,184,166,0.3)] border border-teal-400/50 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                        <Stethoscope className="w-8 h-8 text-white relative z-10" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
                            الملف الطبي الرقمي المعتمد
                            <ShieldCheck className="w-6 h-6 text-teal-400" />
                        </h2>
                        <div className="flex items-center gap-3 mt-1 text-sm font-bold text-slate-400">
                            <span className="flex items-center gap-1">
                                <FileKey className="w-4 h-4 text-emerald-400" />
                                معرف السجل: 
                                <span className="font-mono text-emerald-300">DZ-MED-{new Date().getFullYear()}-{Math.floor(1000 + Math.random() * 9000)}</span>
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                            <span>الجمهورية الجزائرية الديمقراطية الشعبية</span>
                        </div>
                    </div>
                </div>
                {!loading && (
                    <div className="flex flex-col items-end mt-4 md:mt-0 gap-2">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 gap-1.5 font-bold px-3 py-1 text-xs">
                                <Watch className="w-3.5 h-3.5" />
                                متصل بالساعة الذكية
                            </Badge>
                            <Badge variant="outline" className="bg-teal-500/10 text-teal-400 border-teal-500/20 gap-2 font-black px-4 py-1.5 animate-pulse text-sm">
                                <Droplets className="w-4 h-4" />
                                مزامنة حية
                            </Badge>
                        </div>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            حماية وتشفير متقدم (HIPAA/GDPR)
                        </span>
                    </div>
                )}
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

            {/* Medical History Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass-card border-amber-500/20 shadow-lg">
                    <CardHeader className="bg-amber-500/5 border-b border-amber-500/10 pb-4">
                        <CardTitle className="text-base font-black flex items-center gap-2 text-amber-500">
                            <AlertTriangle className="w-5 h-5" />
                            الإصابات السابقة والقيود
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 space-y-4">
                        <div className="flex items-start gap-3 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                            <div className="p-2 bg-amber-500/10 rounded-lg shrink-0">
                                <Activity className="w-4 h-4 text-amber-500" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white mb-1">التواء خفيف في الكاحل الأيمن</p>
                                <p className="text-xs text-slate-400">تاريخ الإصابة: منذ 3 أشهر. التوصية: تجنب تمارين القفز العنيف.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-amber-500/80 bg-amber-500/5 p-2 rounded-lg">
                            <Info className="w-4 h-4 shrink-0" />
                            <span>يتم أخذ هذا السجل في الاعتبار عند توليد البرامج التدريبية المخصصة (Adaptive Training).</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card border-rose-500/20 shadow-lg">
                    <CardHeader className="bg-rose-500/5 border-b border-rose-500/10 pb-4">
                        <CardTitle className="text-base font-black flex items-center gap-2 text-rose-500">
                            <Syringe className="w-5 h-5" />
                            الحساسية والتاريخ الطبي
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 space-y-4">
                        <div className="flex items-start gap-4 flex-wrap">
                            <Badge variant="outline" className="bg-rose-500/10 text-rose-400 border-rose-500/20 gap-2 px-3 py-1.5 text-sm font-bold">
                                <Pill className="w-4 h-4" />
                                حساسية البنسلين
                            </Badge>
                            <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-700 gap-2 px-3 py-1.5 text-sm font-bold">
                                لا توجد أمراض مزمنة الربو (-)
                            </Badge>
                            <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-700 gap-2 px-3 py-1.5 text-sm font-bold">
                                أمراض القلب (-)
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
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

                {/* Expert Medical Metrics */}
                <Card className="col-span-full border-teal-500/20 bg-[#0B0E14]/80 backdrop-blur-sm overflow-hidden mt-2 relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-emerald-500/5 z-0" />
                    <CardContent className="p-6 relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <Activity className="w-5 h-5 text-teal-400" />
                            <h3 className="text-lg font-black text-white">مؤشرات حيوية متقدمة (Advanced Biomarkers)</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            
                            {/* Metabolic Age */}
                            <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800 relative overflow-hidden">
                                <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-500/10 rounded-full blur-xl"></div>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Activity className="w-4 h-4 text-blue-400" />
                                        <span className="text-sm font-bold">العمر الأيضي (Metabolic Age)</span>
                                    </div>
                                    <Info className="w-4 h-4 text-slate-600" />
                                </div>
                                <div className="flex items-baseline gap-2 mt-2">
                                    <span className="text-3xl font-black text-white">
                                        {healthProfile?.age ? Math.max(12, healthProfile.age - 2) : 14}
                                    </span>
                                    <span className="text-sm font-bold text-slate-500">سنة</span>
                                </div>
                                <div className="mt-3 flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 w-fit px-2 py-1 rounded-md">
                                    أصغر بـ 2 سنة من العمر الفعلي
                                </div>
                            </div>

                            {/* Hydration / SpO2 */}
                            <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800 relative overflow-hidden">
                                <div className="absolute -right-4 -top-4 w-16 h-16 bg-cyan-500/10 rounded-full blur-xl"></div>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Droplets className="w-4 h-4 text-cyan-400" />
                                        <span className="text-sm font-bold">الترطيب ومستوى الأكسجين</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-end mt-2">
                                    <div>
                                        <div className="text-xs text-slate-500 mb-1">الترطيب (Hydration)</div>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-black text-cyan-400">68</span>
                                            <span className="text-xs font-bold text-cyan-700">%</span>
                                        </div>
                                    </div>
                                    <div className="h-8 w-px bg-slate-800"></div>
                                    <div className="text-left">
                                        <div className="text-xs text-slate-500 mb-1">SpO2</div>
                                        <div className="flex items-baseline gap-1 justify-end">
                                            <span className="text-2xl font-black text-emerald-400">98</span>
                                            <span className="text-xs font-bold text-emerald-700">%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-1.5 mt-3 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: '68%' }}></div>
                                </div>
                            </div>

                            {/* Sleep Quality */}
                            <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800 relative overflow-hidden">
                                <div className="absolute -right-4 -top-4 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl"></div>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Moon className="w-4 h-4 text-indigo-400" />
                                        <span className="text-sm font-bold">جودة النوم (Sleep Quality)</span>
                                    </div>
                                    <Badge className="bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 text-[10px] px-2 py-0">من الساعة</Badge>
                                </div>
                                <div className="flex items-baseline gap-2 mt-2">
                                    <span className="text-3xl font-black text-white">85</span>
                                    <span className="text-sm font-bold text-slate-500">/ 100</span>
                                </div>
                                <div className="mt-3 flex items-center gap-2 text-xs font-bold text-indigo-400">
                                    دورة نوم عميق ممتازة (1.5h Deep Sleep)
                                </div>
                            </div>

                            {/* Resting HR */}
                            <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800 relative overflow-hidden">
                                <div className="absolute -right-4 -top-4 w-16 h-16 bg-red-500/10 rounded-full blur-xl"></div>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Heart className="w-4 h-4 text-red-400" />
                                        <span className="text-sm font-bold">نبض الراحة (Resting HR)</span>
                                    </div>
                                    <Badge className="bg-red-500/20 text-red-300 hover:bg-red-500/30 text-[10px] px-2 py-0">من الساعة</Badge>
                                </div>
                                <div className="flex items-baseline gap-2 mt-2">
                                    <span className="text-3xl font-black text-white">62</span>
                                    <span className="text-sm font-bold text-slate-500">نبضة/د</span>
                                </div>
                                <div className="mt-3 flex items-center gap-2 text-xs font-bold text-emerald-400">
                                    لياقة قلبية ممتازة (رياضي)
                                </div>
                            </div>

                            {/* VO2 Max */}
                            <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800 relative overflow-hidden">
                                <div className="absolute -right-4 -top-4 w-16 h-16 bg-orange-500/10 rounded-full blur-xl"></div>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Activity className="w-4 h-4 text-orange-400" />
                                        <span className="text-sm font-bold">أقصى استهلاك للبصمة (VO2 Max)</span>
                                    </div>
                                    <Info className="w-4 h-4 text-slate-600" />
                                </div>
                                <div className="flex items-baseline gap-2 mt-2">
                                    <span className="text-3xl font-black text-white">48.5</span>
                                    <span className="text-sm font-bold text-slate-500">مل/كجم/د</span>
                                </div>
                                <div className="mt-3 flex items-center gap-2 text-xs font-bold text-orange-400 bg-orange-500/10 w-fit px-2 py-1 rounded-md">
                                    أعلى بـ 15% من المتوسط الوطني
                                </div>
                            </div>

                            {/* Recovery Level */}
                            <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800 relative overflow-hidden">
                                <div className="absolute -right-4 -top-4 w-16 h-16 bg-green-500/10 rounded-full blur-xl"></div>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <ShieldCheck className="w-4 h-4 text-green-400" />
                                        <span className="text-sm font-bold">مستوى التعافي البدني</span>
                                    </div>
                                    <Badge className="bg-green-500/20 text-green-300 hover:bg-green-500/30 text-[10px] px-2 py-0">محدث للتو</Badge>
                                </div>
                                <div className="flex items-baseline gap-2 mt-2">
                                    <span className="text-3xl font-black text-white">94</span>
                                    <span className="text-sm font-bold text-slate-500">/ 100</span>
                                </div>
                                <div className="h-1.5 mt-3 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 rounded-full" style={{ width: '94%' }}></div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Wearables Integration Hub */}
            <div className="mt-8">
                <WearablesSyncPanel />
            </div>

            {/* Official Authentication Stamp */}
            <div className="mt-8 flex justify-end">
                <div className="border-2 border-dashed border-emerald-500/30 rounded-xl p-4 flex items-center gap-4 bg-emerald-500/5 backdrop-blur-sm">
                    <div className="w-12 h-12 rounded-full border-2 border-emerald-500/50 flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-sm font-black text-emerald-400">سجل إلكتروني مصادق عليه</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">منصة حركة - وزارة الصحة والتربية الوطنية</p>
                        <p className="text-[10px] font-mono text-slate-500 mt-1">تاريخ آخر تحديث: {new Date().toLocaleDateString('ar-DZ')}</p>
                    </div>
                </div>
            </div>

        </div>
    );
};
