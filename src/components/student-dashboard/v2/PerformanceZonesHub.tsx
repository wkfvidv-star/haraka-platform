import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CognitiveSection } from '@/components/dashboard/CognitiveSection';
import { MentalWellBeingSection } from '@/components/dashboard/MentalWellBeingSection';
import { AcademicSection } from '@/components/dashboard/AcademicSection';
import { RecoveryTimeline } from '@/components/student-dashboard/v2/RecoveryTimeline';
import { ExercisePack, SmartExerciseService } from '@/services/SmartExerciseService';
import { ExercisePackCard } from '@/components/smart-exercises/ExercisePackCard';
import { BaseExercise } from '@/types/ExerciseTypes';
import { SessionEngine } from '@/components/student-dashboard/v2/SessionEngine';
import { ExercisePackDetailsModal } from '@/components/student-dashboard/v2/ExercisePackDetailsModal';
import {
    Activity,
    Brain,
    Heart,
    RefreshCw,
    ChevronRight,
    Zap,
    Target,
    Shield,
    Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const zones = [
    {
        id: 'motor',
        label: 'الحركي',
        labelEn: 'MOTOR',
        icon: Activity,
        color: 'blue',
        gradient: 'from-blue-500 to-cyan-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
        activeBg: 'bg-blue-600',
        iconColor: 'text-blue-500',
        ring: 'ring-blue-500',
        description: 'السرعة · الرشاقة · التوافق · التوازن',
        badgeClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
        stats: [
            { label: 'السرعة', value: '78%', icon: Zap, color: 'text-yellow-500' },
            { label: 'التوافق', value: '82%', icon: Target, color: 'text-blue-500' },
            { label: 'التوازن', value: '70%', icon: Shield, color: 'text-cyan-500' },
        ],
    },
    {
        id: 'cognitive',
        label: 'المعرفي',
        labelEn: 'COGNITIVE',
        icon: Brain,
        color: 'indigo',
        gradient: 'from-indigo-500 to-violet-500',
        bg: 'bg-indigo-500/10',
        border: 'border-indigo-500/20',
        activeBg: 'bg-indigo-600',
        iconColor: 'text-indigo-500',
        ring: 'ring-indigo-500',
        description: 'التركيز · الذاكرة · التفكير السريع · حل المشكلات',
        badgeClass: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
        stats: [
            { label: 'التركيز', value: '91%', icon: Target, color: 'text-indigo-500' },
            { label: 'الذاكرة', value: '85%', icon: Brain, color: 'text-violet-500' },
            { label: 'رد الفعل', value: '340ms', icon: Zap, color: 'text-yellow-500' },
        ],
    },
    {
        id: 'psychological',
        label: 'النفسي',
        labelEn: 'PSYCHOLOGICAL',
        icon: Heart,
        color: 'rose',
        gradient: 'from-rose-500 to-pink-400',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/20',
        activeBg: 'bg-rose-600',
        iconColor: 'text-rose-500',
        ring: 'ring-rose-500',
        description: 'الرفاه · الثقة · المرونة النفسية · الدافعية',
        badgeClass: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
        stats: [
            { label: 'الرفاه', value: '88%', icon: Heart, color: 'text-rose-500' },
            { label: 'الدافعية', value: '76%', icon: Zap, color: 'text-orange-500' },
            { label: 'المرونة', value: '80%', icon: Shield, color: 'text-pink-500' },
        ],
    },
    {
        id: 'rehabilitation',
        label: 'إعادة التأهيل',
        labelEn: 'REHAB',
        icon: RefreshCw,
        color: 'emerald',
        gradient: 'from-emerald-500 to-teal-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
        activeBg: 'bg-emerald-600',
        iconColor: 'text-emerald-500',
        ring: 'ring-emerald-500',
        description: 'الاسترداد · التعافي · منع الإصابات · الصحة البدنية',
        badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
        stats: [
            { label: 'التعافي', value: '94%', icon: RefreshCw, color: 'text-emerald-500' },
            { label: 'الراحة', value: '7.5h', icon: Shield, color: 'text-teal-500' },
            { label: 'المنع', value: 'آمن', icon: Target, color: 'text-green-500' },
        ],
    },
];

export function PerformanceZonesHub() {
    const [activeZone, setActiveZone] = useState('motor');
    const [packs, setPacks] = useState<ExercisePack[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeExercise, setActiveExercise] = useState<BaseExercise | null>(null);
    const [selectedPack, setSelectedPack] = useState<ExercisePack | null>(null);

    React.useEffect(() => {
        const fetchPacks = async () => {
            try {
                const data = await SmartExerciseService.getAllPacks();
                setPacks(data);
            } catch (error) {
                console.error("Failed to load packs", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPacks();
    }, []);

    const startSession = (pack: ExercisePack) => {
        setSelectedPack(null); // Close details modal
        setActiveExercise({
            id: pack.id,
            title: pack.title,
            description: pack.description,
            category: pack.category.toLowerCase() as any,
            level: pack.difficulty.toLowerCase() as any,
            durationSeconds: pack.exercises.length * 60,
            completed: false
        });
    };

    const handlePackSelect = (pack: ExercisePack) => {
        setSelectedPack(pack);
    };

    const currentZone = zones.find((z) => z.id === activeZone)!;

    const motorPacks = packs.filter(p => p.category === 'Motor');
    const cognitivePacks = packs.filter(p => p.category === 'Cognitive');
    const perceptualPacks = packs.filter(p => p.category === 'Perceptual');
    const mentalPacks = packs.filter(p => p.category === 'Mental');
    const rehabPacks = packs.filter(p => p.category === 'Rehabilitation');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                        مناطق الأداء الشاملة
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        تحليل متكامل لكل جوانب تطورك الأكاديمي والبدني
                    </p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 bg-white dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-2xl px-3 py-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    نشط الآن
                </div>
            </div>

            {/* Zone Selector Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {zones.map((zone) => (
                    <button
                        key={zone.id}
                        onClick={() => setActiveZone(zone.id)}
                        className={cn(
                            'relative text-right p-4 rounded-2xl border transition-all duration-300 overflow-hidden group',
                            activeZone === zone.id
                                ? `${zone.bg} ${zone.border} shadow-lg ring-2 ${zone.ring}/30`
                                : 'bg-white dark:bg-white/5 border-slate-200/50 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 shadow-sm hover:shadow-md'
                        )}
                    >
                        {/* Gradient bar */}
                        <div
                            className={cn(
                                'absolute top-0 right-0 h-1 w-full bg-gradient-to-l transition-opacity duration-300',
                                `bg-gradient-to-l ${zone.gradient}`,
                                activeZone === zone.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                            )}
                        />

                        <div className="flex items-start justify-between gap-2">
                            <div
                                className={cn(
                                    'p-2 rounded-xl',
                                    zone.bg,
                                    activeZone === zone.id ? 'scale-110' : ''
                                )}
                            >
                                <zone.icon className={cn('w-5 h-5', zone.iconColor)} />
                            </div>
                            {activeZone === zone.id && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className={cn(
                                        'flex items-center gap-0.5 text-[10px] font-black px-2 py-0.5 rounded-full',
                                        zone.badgeClass
                                    )}
                                >
                                    <ChevronRight className="w-3 h-3" />
                                    فعّال
                                </motion.div>
                            )}
                        </div>

                        <div className="mt-3 text-right">
                            <p className="font-black text-base text-slate-900 dark:text-slate-100 leading-tight">{zone.label}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{zone.labelEn}</p>
                        </div>

                        {/* Mini stats */}
                        <div className="mt-3 flex items-center gap-2">
                            {zone.stats.slice(0, 2).map((stat) => (
                                <div
                                    key={stat.label}
                                    className="flex-1 bg-white/60 dark:bg-white/5 rounded-lg p-1.5 text-center"
                                >
                                    <p className="text-xs font-black text-slate-800 dark:text-slate-100">{stat.value}</p>
                                    <p className="text-[9px] text-slate-500 dark:text-slate-400 truncate">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </button>
                ))}
            </div>

            {/* Active Zone Detail */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeZone}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.28, ease: 'easeOut' }}
                    className="space-y-6"
                >
                    {/* Zone Stats Banner */}
                    <div
                        className={cn(
                            'rounded-3xl p-6 border flex flex-col lg:flex-row lg:items-center gap-6',
                            currentZone.bg,
                            currentZone.border
                        )}
                    >
                        <div className="flex items-center gap-4 flex-1">
                            <div
                                className={cn(
                                    'w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg flex-shrink-0',
                                    currentZone.gradient
                                )}
                            >
                                <currentZone.icon className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                                    منطقة الأداء {currentZone.label}
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                                    {currentZone.description}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            {currentZone.stats.map((s) => (
                                <div
                                    key={s.label}
                                    className="bg-white dark:bg-white/10 rounded-2xl p-3 text-center shadow-sm"
                                >
                                    <s.icon className={cn('w-5 h-5 mx-auto mb-1', s.color)} />
                                    <p className="text-lg font-black text-slate-900 dark:text-white">{s.value}</p>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Zone Content */}
                    <div className="rounded-3xl border border-slate-200/50 dark:border-white/5 bg-white dark:bg-white/5 backdrop-blur-md p-6 shadow-sm overflow-hidden min-h-[400px]">
                        {loading ? (
                            <div className="flex h-64 items-center justify-center">
                                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                            </div>
                        ) : (
                            <>
                                {activeZone === 'motor' && (
                                    <div className="space-y-8">
                                        <div>
                                            <div className="mb-8 p-6 bg-gradient-to-r from-blue-600/20 to-blue-900/40 rounded-3xl border border-blue-500/30 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                                                <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay animate-pulse" />
                                                <div className="relative z-10 flex-1">
                                                    <div className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full w-max mb-3 flex items-center gap-2">
                                                        <Activity className="w-3 h-3 fill-current" /> مختبر الحركة
                                                    </div>
                                                    <h3 className="text-2xl font-black text-white mb-2">مختبر الأداء الحركي الذكي</h3>
                                                    <p className="text-blue-100/80 mb-4 max-w-lg">
                                                        اكتشف مجموعة واسعة من تدريبات الأداء الحركي. هذه التمارين مخصصة لتحسين سرعتك، رشاقتك، وتوافقك الحركي.
                                                    </p>
                                                    <button onClick={() => {
                                                        const event = new CustomEvent('open-motion-lab');
                                                        window.dispatchEvent(event);
                                                    }} className="bg-blue-500 hover:bg-blue-400 text-white font-black px-6 py-3 rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all">
                                                        <Zap className="w-5 h-5" />
                                                        الدخول للمختبر الحي
                                                    </button>
                                                </div>
                                                <div className="relative z-10 w-48 h-48 bg-black/40 rounded-full border-4 border-blue-500/30 flex items-center justify-center shrink-0">
                                                    <Activity className="w-20 h-20 text-blue-400 animate-pulse" />
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mb-6">
                                                <h4 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-500">
                                                        <Activity className="w-6 h-6" />
                                                    </div>
                                                    مكتبة تمارين الأداء الحركي
                                                </h4>
                                                <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
                                                    {motorPacks.length} برامج تدريبية موجهة
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                                {motorPacks.map(pack => (
                                                    <ExercisePackCard key={pack.id} pack={pack} onStart={() => handlePackSelect(pack)} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {activeZone === 'cognitive' && (
                                    <div className="space-y-8">
                                        <CognitiveSection isSimplified={true} />
                                        <div className="mt-8 border-t border-slate-100 dark:border-white/5 pt-8">
                                            <div className="mb-8 p-6 bg-gradient-to-r from-indigo-600/20 to-indigo-900/40 rounded-3xl border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                                                <div className="absolute inset-x-0 bottom-0 h-1 bg-indigo-500 animate-pulse" />
                                                <div className="relative z-10 flex-1">
                                                    <div className="bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full w-max mb-3 flex items-center gap-2">
                                                        <Brain className="w-3 h-3 fill-current" /> ألعاب تدريب الدماغ
                                                    </div>
                                                    <h3 className="text-2xl font-black text-white mb-2">تدريب الذاكرة العاملة والمعالجة</h3>
                                                    <p className="text-indigo-100/80 mb-4 max-w-lg">
                                                        ألعاب مصغرة تفاعلية (Mini-games) مصممة علمياً لتنشيط مسارات الذاكرة وزيادة سرعة اتخاذ القرار.
                                                    </p>
                                                    <button onClick={() => cognitivePacks.find(p => p.id.startsWith('int-')) && startSession(cognitivePacks.find(p => p.id.startsWith('int-'))!)} className="bg-indigo-500 hover:bg-indigo-400 text-white font-black px-6 py-3 rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all">
                                                        <Brain className="w-5 h-5" />
                                                        بدء التدريب الذهني
                                                    </button>
                                                </div>
                                                <div className="relative z-10 grid grid-cols-2 gap-2 shrink-0">
                                                    {[...Array(4)].map((_, i) => (
                                                        <div key={i} className="w-16 h-16 rounded-xl bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}>
                                                            <Brain className="w-6 h-6 text-indigo-400/50" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
                                                <Brain className="w-5 h-5 text-indigo-500" />
                                                برامج تنمية القدرات المعرفية (داعمة)
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                                {cognitivePacks.map(pack => (
                                                    <ExercisePackCard key={pack.id} pack={pack} onStart={() => handlePackSelect(pack)} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {activeZone === 'psychological' && (
                                    <div className="space-y-8">
                                        <MentalWellBeingSection isSimplified={true} />
                                        <div className="mt-8 border-t border-slate-100 dark:border-white/5 pt-8">
                                            <div className="mb-8 p-6 bg-gradient-to-r from-rose-600/20 to-purple-900/40 rounded-3xl border border-rose-500/30 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
                                                <div className="relative z-10 flex-1">
                                                    <div className="bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full w-max mb-3 flex items-center gap-2">
                                                        <Heart className="w-3 h-3 fill-current" /> استرخاء وتأمل
                                                    </div>
                                                    <h3 className="text-2xl font-black text-white mb-2">دائرة التنفس الحيوي</h3>
                                                    <p className="text-rose-100/80 mb-4 max-w-lg">
                                                        جلسات تنفس موجهة تفاعلية تتكيف مع حالتك الحالية لخفض مستويات التوتر وتسريع عملية التعافي الذهني والبدني.
                                                    </p>
                                                    <button onClick={() => mentalPacks.find(p => p.id.startsWith('int-')) && startSession(mentalPacks.find(p => p.id.startsWith('int-'))!)} className="bg-rose-500 hover:bg-rose-400 text-white font-black px-6 py-3 rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-all">
                                                        <Heart className="w-5 h-5" />
                                                        بدء جلسة الاسترخاء
                                                    </button>
                                                </div>
                                                <div className="relative z-10 shrink-0">
                                                    <div className="w-32 h-32 rounded-full border-4 border-rose-400/30 flex items-center justify-center">
                                                        <Heart className="w-12 h-12 text-rose-400 animate-pulse" style={{ animationDuration: '3s' }} />
                                                    </div>
                                                </div>
                                            </div>

                                            <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
                                                <Heart className="w-5 h-5 text-rose-500" />
                                                برامج الرفاه النفسي (إضافية)
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                                {mentalPacks.map(pack => (
                                                    <ExercisePackCard key={pack.id} pack={pack} onStart={() => handlePackSelect(pack)} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {activeZone === 'rehabilitation' && (
                                    <div className="space-y-8">
                                        <div>
                                            <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
                                                <RefreshCw className="w-5 h-5 text-emerald-500" />
                                                برامج إعادة التأهيل
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                                {rehabPacks.map(pack => (
                                                    <ExercisePackCard key={pack.id} pack={pack} onStart={() => handlePackSelect(pack)} />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="pt-8 border-t border-slate-100 dark:border-white/5">
                                            <h3 className="font-black text-xl text-slate-900 dark:text-white mb-6">برنامج التعافي والتأهيل</h3>
                                            <RecoveryTimeline />
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>
            
            {/* Modals */}
            {selectedPack && (
                <ExercisePackDetailsModal
                    pack={selectedPack}
                    onClose={() => setSelectedPack(null)}
                    onStartSession={startSession}
                />
            )}

            {activeExercise && (
                <SessionEngine exercise={activeExercise} onClose={() => setActiveExercise(null)} />
            )}
        </div>
    );
}
