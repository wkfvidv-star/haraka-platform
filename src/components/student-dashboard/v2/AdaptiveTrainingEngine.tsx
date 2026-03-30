import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play, Clock, Flame, Target, ChevronRight,
    CheckCircle, Lock, Star, AlertTriangle, Zap,
    BarChart2, RefreshCw, Shield, Dumbbell, BrainCircuit
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrainingExercise {
    name: string;
    duration: string;
    reps?: string;
    type: 'warmup' | 'main' | 'cooldown';
}

interface TrainingProgram {
    id: string;
    title: string;
    targetDimension: string;
    difficulty: 1 | 2 | 3;
    durationWeeks: number;
    sessionsPerWeek: number;
    color: string;
    gradient: string;
    icon: React.ElementType;
    tags: string[];
    currentWeek: number;
    completedSessions: number;
    totalSessions: number;
    adaptationStatus: 'progressing' | 'challenging' | 'easy' | 'locked';
    todayExercises: TrainingExercise[];
    aiNote: string;
}

const programs: TrainingProgram[] = [
    {
        id: 'speed-agility',
        title: 'برنامج السرعة والرشاقة',
        targetDimension: 'السرعة · الرشاقة',
        difficulty: 2,
        durationWeeks: 8,
        sessionsPerWeek: 3,
        color: 'blue',
        gradient: 'from-blue-500 to-indigo-600',
        icon: Zap,
        tags: ['ذكي', 'تكيفي', 'متوسط'],
        currentWeek: 3,
        completedSessions: 8,
        totalSessions: 24,
        adaptationStatus: 'progressing',
        aiNote: 'أداؤك رائع! رفعنا الشدة بنسبة 10% هذا الأسبوع لمواكبة تطورك.',
        todayExercises: [
            { name: 'تسخين ديناميكي', duration: '8 دقائق', type: 'warmup' },
            { name: 'تمرين T-Test للرشاقة', duration: '15 دقيقة', reps: '×5', type: 'main' },
            { name: 'الجري المتقطع 30م', duration: '12 دقيقة', reps: '×8', type: 'main' },
            { name: 'تمارين سلم السرعة', duration: '10 دقيقة', type: 'main' },
            { name: 'تهدئة وتمدد', duration: '8 دقائق', type: 'cooldown' },
        ],
    },
    {
        id: 'power-strength',
        title: 'برنامج القوة الانفجارية',
        targetDimension: 'القوة الانفجارية',
        difficulty: 3,
        durationWeeks: 6,
        sessionsPerWeek: 3,
        color: 'orange',
        gradient: 'from-orange-500 to-red-600',
        icon: Dumbbell,
        tags: ['متقدم', 'قوة'],
        currentWeek: 1,
        completedSessions: 2,
        totalSessions: 18,
        adaptationStatus: 'challenging',
        aiNote: 'هذا البرنامج متطلب قليلاً. تأكد من الراحة الكافية بين الجلسات.',
        todayExercises: [
            { name: 'إحماء عضلي مكثف', duration: '10 دقائق', type: 'warmup' },
            { name: 'قفز عمودي من الثبات', duration: '12 دقيقة', reps: '×10', type: 'main' },
            { name: 'Squat Jump تدريجي', duration: '15 دقيقة', reps: '×8', type: 'main' },
            { name: 'تهدئة وتعافي', duration: '10 دقائق', type: 'cooldown' },
        ],
    },
    {
        id: 'balance-coordination',
        title: 'برنامج التوازن والتوافق',
        targetDimension: 'التوازن · التوافق الحركي',
        difficulty: 1,
        durationWeeks: 4,
        sessionsPerWeek: 4,
        color: 'emerald',
        gradient: 'from-emerald-500 to-teal-600',
        icon: Shield,
        tags: ['مبتدئ', 'تحسين نقاط ضعف'],
        currentWeek: 0,
        completedSessions: 0,
        totalSessions: 16,
        adaptationStatus: 'locked',
        aiNote: 'أكمل البرنامج الأول قبل الانتقال لهذا المستوى.',
        todayExercises: [
            { name: 'تمارين Y-Balance', duration: '10 دقائق', type: 'main' },
            { name: 'الوقوف أحادي القدم', duration: '8 دقائق', reps: '×5', type: 'main' },
            { name: 'تمارين التوافق باليدين', duration: '10 دقائق', type: 'main' },
            { name: 'تهدئة', duration: '5 دقائق', type: 'cooldown' },
        ],
    },
];

const difficultyLabel = ['', 'مبتدئ', 'متوسط', 'متقدم'];
const difficultyColor = ['', 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20', 'text-amber-400 bg-amber-500/10 border border-amber-500/20', 'text-red-400 bg-red-500/10 border border-red-500/20'];

const adaptationConfig = {
    progressing: { label: 'يتقدم جيداً', icon: TrendUp, color: 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20', dot: 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' },
    challenging: { label: 'تحدٍّ صعب', icon: AlertTriangle, color: 'text-amber-400 bg-amber-500/10 border border-amber-500/20', dot: 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]' },
    easy: { label: 'سهل نسبياً', icon: Star, color: 'text-blue-400 bg-blue-500/10 border border-blue-500/20', dot: 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]' },
    locked: { label: 'مقفل', icon: Lock, color: 'text-slate-400 bg-slate-800/50 border border-slate-700', dot: 'bg-slate-500' },
};

function TrendUp(props: any) {
    return <BarChart2 {...props} />;
}

const exerciseTypeStyle = {
    warmup: 'border-r-4 border-yellow-400 bg-yellow-500/10',
    main: 'border-r-4 border-blue-500 bg-blue-500/10',
    cooldown: 'border-r-4 border-emerald-400 bg-emerald-500/10',
};
const exerciseTypeLabel = { warmup: 'إحماء', main: 'تمرين', cooldown: 'تهدئة' };

export function AdaptiveTrainingEngine() {
    const [activeProgramId, setActiveProgramId] = useState<string>('speed-agility');
    const [showTodaySession, setShowTodaySession] = useState(false);
    const activeProgram = programs.find(p => p.id === activeProgramId)!;
    const progressPct = Math.round((activeProgram.completedSessions / activeProgram.totalSessions) * 100);
    const adaptation = adaptationConfig[activeProgram.adaptationStatus];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                        <RefreshCw className="w-5 h-5 text-white" />
                    </div>
                    البرامج التدريبية الذكية (Adaptive Training)
                </h2>
                <p className="text-sm text-slate-400 mt-1.5">
                    مسارات تدريبية تتكيف تلقائياً مع "بصمتك الحركية" بناءً على مبادئ التدرج والخصوصية.
                </p>
            </div>

            {/* AI Diagnosis from Motor Profile */}
            <div className="bg-[#151928]/80 backdrop-blur-xl rounded-3xl p-6 border border-indigo-500/20 shadow-[0_0_40px_rgba(79,70,229,0.1)] relative overflow-hidden">
                <div className="absolute left-0 top-0 w-32 h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay pointer-events-none"></div>
                <div className="flex items-start gap-5 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center flex-shrink-0 relative">
                        <div className="absolute -inset-2 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-2xl blur opacity-20 animate-pulse"></div>
                        <BrainCircuit className="w-7 h-7 text-indigo-400 relative z-10" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-white mb-2 tracking-tight">تحليل البصمة الحركية والتوجيه التدريبي</h3>
                        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                            بناءً على نتائج قياساتك الأخيرة (السرعة: 7.5ث، القوة: ضعف نسبي، المرونة: جيدة)، صمم لك الذكاء الاصطناعي 
                            برنامج <strong className="text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded-md mx-1">"السرعة والرشاقة"</strong> ليكون التركيز الأساسي لهذه الدورة التدريبية المصغرة (Microcycle). 
                            تم مراعاة التدرج في الحمل التدريبي لضمان التطور الآمن وتجنب الإصابات.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Program List */}
                <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">اختر برنامجاً</p>
                    {programs.map((program) => {
                        const isActive = activeProgramId === program.id;
                        const pct = Math.round((program.completedSessions / program.totalSessions) * 100);
                        const adapt = adaptationConfig[program.adaptationStatus];
                        return (
                            <button
                                key={program.id}
                                onClick={() => { if (program.adaptationStatus !== 'locked') setActiveProgramId(program.id); }}
                                disabled={program.adaptationStatus === 'locked'}
                                className={cn(
                                    'w-full text-right rounded-3xl border p-5 transition-all duration-300 group relative overflow-hidden',
                                    isActive ? 'bg-blue-900/20 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.15)]' :
                                        program.adaptationStatus === 'locked' ? 'opacity-50 cursor-not-allowed bg-black/20 border-white/5' :
                                            'bg-[#151928]/80 backdrop-blur-xl border-white/5 hover:border-white/10 hover:bg-[#1a1f33]'
                                )}
                            >
                                {isActive && <div className="absolute inset-0 bg-blue-500/5 pointer-events-none" />}
                                {!isActive && program.adaptationStatus !== 'locked' && (
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                )}
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br flex-shrink-0 shadow-lg', program.gradient)}>
                                        <program.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-base font-black text-white truncate">{program.title}</p>
                                        <p className="text-xs text-slate-400 mt-1">{program.targetDimension}</p>
                                        {/* Micro progress */}
                                        <div className="mt-2 flex items-center gap-2">
                                            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className={cn('h-full rounded-full bg-gradient-to-l', program.gradient)}
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                            <span className="text-[10px] text-slate-400 font-bold w-8">{pct}%</span>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0">
                                        {program.adaptationStatus === 'locked' ? (
                                            <Lock className="w-4 h-4 text-slate-400" />
                                        ) : (
                                            <span className={cn('w-2 h-2 rounded-full block', adapt.dot)} />
                                        )}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Active Program Detail */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Program Hero */}
                    <div className={cn('rounded-3xl p-6 text-white overflow-hidden relative bg-gradient-to-br', activeProgram.gradient)}>
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute -top-8 -left-8 w-40 h-40 rounded-full bg-white/30 blur-2xl" />
                        </div>
                        <div className="relative">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        {activeProgram.tags.map(t => (
                                            <span key={t} className="text-[11px] bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full font-bold">{t}</span>
                                        ))}
                                    </div>
                                    <h3 className="text-xl font-black">{activeProgram.title}</h3>
                                    <p className="text-sm text-white/80 mt-1">{activeProgram.targetDimension}</p>
                                </div>
                                <div className="text-center bg-white/20 backdrop-blur-sm rounded-2xl p-3 flex-shrink-0">
                                    <p className="text-2xl font-black">{progressPct}%</p>
                                    <p className="text-xs text-white/80 font-semibold">مكتمل</p>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-4">
                                <div className="flex justify-between text-xs text-white/70 mb-1.5">
                                    <span>{activeProgram.completedSessions} جلسة منجزة</span>
                                    <span>{activeProgram.totalSessions} جلسة إجمالاً</span>
                                </div>
                                <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full rounded-full bg-white/80"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progressPct}%` }}
                                        transition={{ duration: 0.8, ease: 'easeOut' }}
                                    />
                                </div>
                            </div>

                            {/* Stats row */}
                            <div className="grid grid-cols-3 gap-3 mt-4">
                                {[
                                    { label: 'الأسبوع', value: `${activeProgram.currentWeek} / ${activeProgram.durationWeeks}` },
                                    { label: 'جلسات/أسبوع', value: activeProgram.sessionsPerWeek },
                                    { label: 'الصعوبة', value: difficultyLabel[activeProgram.difficulty] },
                                ].map(s => (
                                    <div key={s.label} className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
                                        <p className="text-base font-black">{s.value}</p>
                                        <p className="text-[11px] text-white/70">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* AI Adaptation Note */}
                    <div className="rounded-3xl border border-white/5 bg-[#151928]/80 backdrop-blur-xl p-5 flex items-start gap-4 shadow-sm">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                            <Zap className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between gap-2 mb-2">
                                <p className="text-sm font-black text-white">تقييم الذكاء الاصطناعي</p>
                                <span className={cn('text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5', adaptation.color)}>
                                    <span className={cn('w-1.5 h-1.5 rounded-full block', adaptation.dot)} />
                                    {adaptation.label}
                                </span>
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed">{activeProgram.aiNote}</p>
                        </div>
                    </div>

                    {/* Today's Session Preview */}
                    <div className="rounded-3xl border border-white/5 bg-[#151928]/80 backdrop-blur-xl overflow-hidden shadow-sm">
                        <button
                            onClick={() => setShowTodaySession(!showTodaySession)}
                            className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                    <Play className="w-5 h-5 text-blue-400" />
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-white text-base">جلسة اليوم</p>
                                    <p className="text-xs text-slate-400 mt-0.5">{activeProgram.todayExercises.length} تمارين • ~53 دقيقة</p>
                                </div>
                            </div>
                            <ChevronRight className={cn('w-5 h-5 text-slate-400 transition-transform', showTodaySession ? 'rotate-90' : '')} />
                        </button>

                        <AnimatePresence>
                            {showTodaySession && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-5 pb-5 space-y-3">
                                        {activeProgram.todayExercises.map((ex, i) => (
                                            <div key={i} className={cn('rounded-2xl p-4 flex items-center gap-4 border', exerciseTypeStyle[ex.type], ex.type === 'warmup' ? 'border-yellow-500/10' : ex.type === 'main' ? 'border-blue-500/10' : 'border-emerald-500/10')}>
                                                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 shadow-inner">
                                                    <span className="text-xs font-black text-slate-300">{i + 1}</span>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold text-white mb-1">{ex.name}</p>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs text-slate-400 flex items-center gap-1.5">
                                                            <Clock className="w-3.5 h-3.5" />{ex.duration}
                                                        </span>
                                                        {ex.reps && <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-md">{ex.reps}</span>}
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                                                    {exerciseTypeLabel[ex.type]}
                                                </span>
                                            </div>
                                        ))}
                                        <button className={cn('w-full mt-4 py-3.5 rounded-2xl text-white font-black text-sm flex items-center justify-center gap-2 bg-gradient-to-l shadow-lg hover:opacity-90 transition-opacity', activeProgram.gradient)}>
                                            <Play className="w-4 h-4 fill-white" />
                                            ابدأ الجلسة الآن
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
