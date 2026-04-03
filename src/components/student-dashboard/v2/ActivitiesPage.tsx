import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Flame, Play, Clock, Zap, Shield, Wind, Heart,
    Brain, Activity, CheckCircle2, ChevronDown, ChevronRight,
    Star, Trophy, Users, Calendar, MapPin, User,
    Sparkles, Target, Eye, ArrowRight,
    TrendingUp, Award, BarChart2, School, Building2, Flag, Dumbbell
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SessionEngine } from './SessionEngine';
import { InteractiveTrainingPlayer, ExerciseSessionData, ExerciseStage } from '@/components/training/InteractiveTrainingPlayer';
import { CognitiveGameEngine } from '@/components/training/CognitiveGameEngine';
import { RehabZoneSection } from '@/components/training/RehabZoneSection';
import { RehabEngine } from '@/components/training/RehabEngine';
import { VideoAnalysisSection } from './VideoAnalysisSection';
import { MotorZoneSection } from '@/components/training/MotorZoneSection';
import { MotorGameEngine } from '@/components/training/MotorGameEngine';
import { PsychologicalZoneSection } from '@/components/training/PsychologicalZoneSection';
import { PsychologicalEngine } from '@/components/training/PsychologicalEngine';
import { VideoSubmissionModal } from './VideoSubmissionModal';
import { AssignmentPlayer, TeacherAssignment } from './AssignmentPlayer';
import { BaseExercise } from '@/types/ExerciseTypes';
import { MOTOR_PROGRAMS_DB } from '@/data/motorProgramsDb';
import { youthDataService } from '@/services/youthDataService';
import { auditService } from '@/services/auditService';

// ─────────────────────────────────────────
//  Types
// ─────────────────────────────────────────
interface Exercise {
    id: string;
    name: string;
    description: string;
    skill: string;
    duration: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    progress: number;
    xp: number;
    icon: React.ElementType;
}

interface TrainingZone {
    id: string;
    name: string;
    subtitle: string;
    color: string;
    glow: string;
    borderColor: string;
    gradient: string;
    textColor: string;
    badgeBg: string;
    icon: React.ElementType;
    exercises: Exercise[];
}

interface Competition {
    id: string;
    name: string;
    level: 'مدرسي' | 'ولائي' | 'وطني';
    levelColor: string;
    levelIcon: React.ElementType;
    participants: number;
    date: string;
    location: string;
    joined: boolean;
    prize?: string;
}

// ─────────────────────────────────────────
//  Static Data
// ─────────────────────────────────────────

const COGNITIVE_ZONE: TrainingZone = {
    id: 'cognitive',
    name: '🧠 قسم: الأداء المعرفي وتطوير الدماغ',
    subtitle: 'اختر المهارة الذهنية التي تريد تطويرها اليوم 👇', // User's requested title
    color: 'green',
    glow: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/25',
    gradient: 'from-emerald-400 to-teal-600',
    textColor: 'text-emerald-300',
    badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
    icon: Brain,
    exercises: [
        { id: 'processing_speed', name: 'سرعة المعالجة الذهنية', description: 'المطابقة السريعة تحت الضغط، الحساب الذهني الفوري المتغير', skill: 'السرعة', duration: '5 دقائق', level: 'Advanced', progress: 0, xp: 80, icon: Zap },
        { id: 'focus_attention', name: 'التركيز والانتباه', description: 'تحديد الهدف وسط الفوضى، مقاومة التشتت السمعي والبصري', skill: 'التركيز', duration: '8 دقائق', level: 'Intermediate', progress: 0, xp: 60, icon: Target },
        { id: 'advanced_memory', name: 'الذاكرة المتقدمة', description: 'التسلسل المنطقي، وتخزين المواقع العكسي تحت الضغط', skill: 'الذاكرة', duration: '7 دقائق', level: 'Advanced', progress: 0, xp: 70, icon: Brain },
        { id: 'mental_flexibility', name: 'المرونة التكيفية', description: 'تغيير القواعد المفاجئ، التنقل المزدوج، والتصنيف السريع', skill: 'الذكاء', duration: '6 دقائق', level: 'Intermediate', progress: 0, xp: 55, icon: Activity },
        { id: 'problem_solving', name: 'حل المشكلات والمنطق', description: 'إكمال الأنماط الذكية المعقدة، وحل الألغاز الرياضية السريعة', skill: 'التحليل', duration: '10 دقائق', level: 'Advanced', progress: 0, xp: 90, icon: BarChart2 },
        { id: 'decision_making', name: 'اتخاذ القرار تحت الضغط', description: 'القرار في الوقت المحدود جداً، والمخاطرة الذكية المقننة', skill: 'الإرادة', duration: '5 دقائق', level: 'Advanced', progress: 0, xp: 100, icon: Flag },
        { id: 'classic_memory', name: 'تدريب الذاكرة (كلاسيكي)', description: 'تنشيط قدرة الدماغ على التذكر المؤقت عبر البطاقات المتطابقة.', skill: 'الذاكرة', duration: '3 دقائق', level: 'Beginner', progress: 0, xp: 40, icon: Brain },
        { id: 'classic_speed', name: 'سرعة البديهة (كلاسيكي)', description: 'تجاوز التضارب اللوني اللفظي بأسرع وقت.', skill: 'السرعة', duration: '3 دقائق', level: 'Beginner', progress: 0, xp: 40, icon: Zap },
        { id: 'classic_focus', name: 'التركيز البصري (كلاسيكي)', description: 'تتبع هدف متحرك وتجاهل المشتتات.', skill: 'التركيز', duration: '3 دقائق', level: 'Beginner', progress: 0, xp: 40, icon: Target },
        { id: 'classic_problem', name: 'حل المشكلات (كلاسيكي)', description: 'إيجاد النمط المفقود في سلسلة أشكال رياضية.', skill: 'المنطق', duration: '4 دقائق', level: 'Beginner', progress: 0, xp: 50, icon: Activity },
        { id: 'classic_flexibility', name: 'المرونة الذهنية (كلاسيكي)', description: 'تصنيف الأشكال بناءً على القواعد المتغيرة بصرياً.', skill: 'المرونة', duration: '4 دقائق', level: 'Beginner', progress: 0, xp: 50, icon: Activity },
        { id: 'classic_decision', name: 'اتخاذ القرار (كلاسيكي)', description: 'تحليل اتجاهات الأسهم المتعاملة وتحديد الاتجاه الصحيح.', skill: 'الإرادة', duration: '3 دقائق', level: 'Beginner', progress: 0, xp: 40, icon: Flag },
        { id: 'classic_attention', name: 'الدقة والانتباه (كلاسيكي)', description: 'رصد الهدف المختلف عن بقية الأهداف وتحديده الدقيق.', skill: 'الدقة', duration: '3 دقائق', level: 'Beginner', progress: 0, xp: 40, icon: Target },
    ]
};


const COMPETITIONS: Competition[] = [
    {
        id: 'c1',
        name: 'بطولة الرشاقة المدرسية',
        level: 'مدرسي',
        levelColor: 'from-blue-500 to-cyan-500',
        levelIcon: School,
        participants: 48,
        date: '22 مارس 2026',
        location: 'ملعب المدرسة',
        joined: true,
        prize: 'ميدالية + 500 XP'
    },
    {
        id: 'c2',
        name: 'تحدي التوازن الولائي',
        level: 'ولائي',
        levelColor: 'from-purple-500 to-pink-500',
        levelIcon: Building2,
        participants: 120,
        date: '5 أبريل 2026',
        location: 'مركز رياضي — الولاية',
        joined: false,
        prize: 'كأس + 2000 XP'
    },
    {
        id: 'c3',
        name: 'أولمبياد الحركة الوطني',
        level: 'وطني',
        levelColor: 'from-orange-500 to-red-500',
        levelIcon: Flag,
        participants: 850,
        date: '20 ماي 2026',
        location: 'المركب الرياضي الوطني',
        joined: false,
        prize: 'ميدالية ذهبية + 10000 XP'
    },
];



const FINGERPRINT_WEAKNESSES = [
    { label: 'التوازن', score: 42, suggestion: 'توازن الشجرة + التحكم الحركي الدقيق', icon: Shield, color: 'text-orange-400', bg: 'bg-orange-500/15', border: 'border-orange-500/25', bar: 'bg-orange-400' },
    { label: 'رد الفعل', score: 55, suggestion: 'رد الفعل البصري + رد الفعل المتقدم', icon: Zap, color: 'text-blue-400', bg: 'bg-blue-500/15', border: 'border-blue-500/20', bar: 'bg-blue-400' },
    { label: 'الاسترخاء', score: 48, suggestion: 'التنفس المربع + التحكم في الضغط', icon: Wind, color: 'text-purple-400', bg: 'bg-purple-500/15', border: 'border-purple-500/20', bar: 'bg-purple-400' },
];

const SMART_SUGGESTIONS = [
    { name: 'توازن الشجرة', zone: 'التأهيل الحركي', reason: 'التوازن نقطة ضعف (42%)', icon: Shield, color: 'from-orange-400 to-red-500', xp: 10, route: 'motor', gameId: 'balance_tree' },
    { name: 'رد الفعل البصري', zone: 'الأداء المعرفي', reason: 'رد الفعل يحتاج تحسيناً (55%)', icon: Eye, color: 'from-emerald-400 to-teal-500', xp: 15, route: 'cognitive', gameId: 'processing_speed' },
    { name: 'التنفس المربع', zone: 'الرفاه النفسي', reason: 'الاسترخاء منخفض (48%)', icon: Wind, color: 'from-purple-400 to-violet-500', xp: 10, route: 'psych', gameId: 'breathing_square' },
];

// Weekly day progress for Daily Training
const WEEK_DAYS = ['أ', 'ث', 'خ', 'ج', 'س', 'أح', 'اث'];
const WEEK_DONE = [true, true, true, false, false, false, false]; // day 3 = today

// ─────────────────────────────────────────
//  Level Badge Config
// ─────────────────────────────────────────
const LEVEL_CONFIG = {
    Beginner:     { label: 'مبتدئ',  bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25' },
    Intermediate: { label: 'متوسط',  bg: 'bg-blue-500/15 text-blue-300 border-blue-500/25' },
    Advanced:     { label: 'متقدم',  bg: 'bg-red-500/15 text-red-300 border-red-500/25' },
};

// ─────────────────────────────────────────
//  Exercise Card
// ─────────────────────────────────────────
function ExerciseCard({ ex, zoneColor, onStart }: { ex: Exercise; zoneColor: string; onStart: () => void }) {
    const lvl = LEVEL_CONFIG[ex.level];
    const IconComp = ex.icon;

    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className="bg-white/[0.04] border border-white/[0.07] rounded-[1.5rem] p-6 flex flex-col gap-5 hover:bg-white/[0.07] hover:border-white/[0.12] transition-all cursor-pointer group h-full"
        >
            {/* Top row: icon + level badge */}
            <div className="flex items-start justify-between gap-4">
                <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br shadow-lg opacity-90 group-hover:opacity-100 transition-opacity', zoneColor)}>
                    <IconComp className="w-6 h-6 text-white" />
                </div>
                <span className={cn('text-xs md:text-sm font-black px-4 py-1.5 rounded-full border', lvl.bg)}>
                    {lvl.label}
                </span>
            </div>

            {/* Title & description */}
            <div className="flex-1 space-y-2">
                <h4 className="font-black text-white text-base md:text-lg leading-snug">{ex.name}</h4>
                <p className="text-white/45 text-sm md:text-base leading-relaxed line-clamp-2">{ex.description}</p>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-white/50 pt-2 border-t border-white/5">
                <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />{ex.duration}
                </span>
                <span className="flex items-center gap-1.5">
                    <Target className="w-4 h-4" />{ex.skill}
                </span>
                <span className="flex items-center gap-1.5 text-yellow-400/80 font-bold mr-auto">
                    <Zap className="w-4 h-4 fill-yellow-400" />+{ex.xp} XP
                </span>
            </div>

            {/* Progress */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-white/40 font-bold">التقدم</span>
                    <span className="text-xs font-black text-white/60">{ex.progress}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        className={cn('h-full rounded-full bg-gradient-to-l', zoneColor)}
                        initial={{ width: 0 }}
                        animate={{ width: `${ex.progress}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                    />
                </div>
            </div>

            {/* Start Button */}
            <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onStart}
                className={cn('w-full mt-2 py-3 md:py-3.5 rounded-xl text-white font-black text-sm md:text-base bg-gradient-to-l shadow-lg flex items-center justify-center gap-2', zoneColor)}
            >
                <Play className="w-5 h-5 fill-white" />ابدأ التمرين
            </motion.button>
        </motion.div>
    );
}

// ─────────────────────────────────────────
//  Dedicated Cognitive Zone Section (Enlarged Typography)
// ─────────────────────────────────────────
function CognitiveZoneSection({ zone, onStartExercise }: { zone: TrainingZone; onStartExercise: (ex: Exercise, category: any) => void }) {
    const Icon = zone.icon;

    return (
        <section className={cn(
            'rounded-[2.5rem] border-2 p-8 relative overflow-hidden transition-all duration-500 my-8 shadow-2xl',
            'bg-black/40 hover:bg-black/50',
            zone.borderColor
        )}>
            {/* Glow */}
            <div className={cn('absolute -top-32 -right-32 w-96 h-96 rounded-full blur-[120px] pointer-events-none opacity-40', zone.glow)} />
            
            {/* Header */}
            <div className="w-full flex items-center justify-between gap-6 relative z-10 mb-8">
                <div className="flex items-center gap-6">
                    <div className={cn('w-3 h-20 rounded-full bg-gradient-to-b shadow-[0_0_30px_rgba(16,185,129,0.5)]', zone.gradient)} />
                    <div className="text-right">
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3 drop-shadow-md">{zone.name}</h2>
                        <p className={cn('text-xl md:text-2xl font-black drop-shadow-md', zone.textColor)}>{zone.subtitle}</p>
                    </div>
                </div>
                <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
                    <div className={cn('w-16 h-16 rounded-3xl flex items-center justify-center bg-gradient-to-br shadow-[0_0_40px_rgba(16,185,129,0.4)]', zone.gradient)}>
                        <Icon className="w-8 h-8 text-white" />
                    </div>
                </div>
            </div>

            {/* Massive Exercises Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10">
                {zone.exercises.map((ex, i) => {
                    const IconComp = ex.icon;
                    return (
                        <motion.button
                            key={ex.id}
                            whileHover={{ y: -6, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onStartExercise(ex, 'cognitive')}
                            className="bg-white/[0.06] border border-white/[0.15] rounded-[2rem] p-6 hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-all cursor-pointer group text-right flex flex-col h-full shadow-lg"
                        >
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <div className={cn('w-16 h-16 rounded-[1.25rem] flex items-center justify-center flex-shrink-0 bg-gradient-to-br shadow-lg', zone.gradient)}>
                                    <IconComp className="w-8 h-8 text-white" />
                                </div>
                                <span className={cn('text-sm font-black px-4 py-1.5 rounded-full border', LEVEL_CONFIG[ex.level].bg)}>
                                    {LEVEL_CONFIG[ex.level].label}
                                </span>
                            </div>
                            
                            <h3 className="text-2xl font-black text-white leading-snug mb-3 group-hover:text-emerald-300 transition-colors">{ex.name}</h3>
                            <p className="text-white/60 text-lg font-medium leading-relaxed mb-6">{ex.description}</p>
                            
                            {/* Meta */}
                            <div className="flex items-center gap-4 text-sm font-bold text-white/50 mt-auto pt-4 border-t border-white/5 w-full">
                                <span className="flex items-center gap-2"><Clock className="w-4 h-4" />{ex.duration}</span>
                                <span className="flex items-center gap-2"><Target className="w-4 h-4" />{ex.skill}</span>
                                <span className="flex items-center gap-2 text-yellow-400 mr-auto"><Zap className="w-4 h-4 fill-yellow-400" />+{ex.xp} XP</span>
                            </div>
                            
                            <div className="w-full mt-5 py-3 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-emerald-300 font-black text-lg text-center transition-colors">
                                الدخول للتمرين
                            </div>
                        </motion.button>
                    )
                })}
            </div>
        </section>
    );
}

// ─────────────────────────────────────────
//  Standard Training Zone Section
// ─────────────────────────────────────────
function TrainingZoneSection({ zone, onStartExercise }: { zone: TrainingZone; onStartExercise: (ex: Exercise, category: any) => void }) {
    const [open, setOpen] = useState(true);
    const Icon = zone.icon;

    return (
        <section className={cn(
            'rounded-[2rem] border p-6 relative overflow-hidden transition-all duration-500',
            'bg-white/[0.02] hover:bg-white/[0.04]',
            zone.borderColor
        )}>
            {/* glow */}
            <div className={cn('absolute -top-20 -right-20 w-60 h-60 rounded-full blur-[90px] pointer-events-none opacity-60', zone.glow)} />

            {/* Header */}
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between gap-4 relative z-10 group"
            >
                <div className="flex items-center gap-4">
                    <div className="w-2 h-12 rounded-full bg-gradient-to-b shadow-[0_0_20px_rgba(0,0,0,0.3)]" />
                    <div className="text-right">
                        <h3 className="text-xl font-black text-white tracking-tight">{zone.name}</h3>
                        <p className={cn('text-sm font-bold', zone.textColor, 'opacity-70')}>{zone.subtitle}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={cn('hidden sm:flex text-[11px] font-black px-3 py-1.5 rounded-full border', zone.badgeBg)}>
                        {zone.exercises.length} تمارين
                    </span>
                    <ChevronDown className={cn('w-5 h-5 text-white/40 transition-transform duration-300', open ? 'rotate-180' : '')} />
                </div>
            </button>

            {/* Exercises Grid */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 relative z-10">
                            {zone.exercises.map((ex, i) => (
                                <motion.div
                                    key={ex.id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <ExerciseCard
                                        ex={ex}
                                        zoneColor={zone.gradient}
                                        onStart={() => {
                                            const cat = zone.id.includes('motor') ? 'motor' : 
                                                        zone.id.includes('cognitive') ? 'cognitive' : 
                                                        zone.id.includes('mental') ? 'psychological' : 'rehabilitation';
                                            onStartExercise(ex, cat);
                                        }}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}

// ─────────────────────────────────────────
//  Competition Card
// ─────────────────────────────────────────
function CompetitionCard({ comp }: { comp: Competition }) {
    const [joined, setJoined] = useState(comp.joined);
    const LevelIcon = comp.levelIcon;

    return (
        <motion.div
            whileHover={{ y: -3 }}
            className="bg-white/[0.04] border border-white/[0.08] rounded-[1.5rem] p-6 flex flex-col gap-5 hover:bg-white/[0.06] transition-all h-full"
        >
            {/* Level Badge */}
            <div className="flex items-start justify-between mb-1">
                <span className={cn('flex items-center gap-2 text-xs md:text-sm font-black px-4 py-1.5 rounded-full text-white bg-gradient-to-l shadow-lg', comp.levelColor)}>
                    <LevelIcon className="w-4 h-4" />
                    {comp.level}
                </span>
                {comp.prize && (
                    <div className="flex items-center gap-1.5 text-yellow-400/90 bg-yellow-400/10 px-3 py-1.5 rounded-full border border-yellow-400/20">
                        <Trophy className="w-4 h-4" />
                        <span className="text-xs md:text-sm font-bold">{comp.prize}</span>
                    </div>
                )}
            </div>

            <div>
                <h4 className="font-black text-white text-lg md:text-xl leading-snug">{comp.name}</h4>
            </div>

            <div className="space-y-3 text-sm md:text-base text-white/50 mt-auto">
                <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-white/40" />
                    <span>{comp.date}</span>
                </div>
                <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-white/40" />
                    <span className="truncate">{comp.location}</span>
                </div>
                <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-white/40" />
                    <span>{comp.participants} مشارك</span>
                </div>
            </div>

            {joined ? (
                <div className="flex items-center justify-center gap-2 mt-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-emerald-300 font-black text-sm md:text-base">مسجّل ✓</span>
                </div>
            ) : (
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setJoined(true)}
                    className={cn('w-full mt-4 py-3 rounded-xl text-white font-black text-sm md:text-base bg-gradient-to-l shadow-lg flex items-center justify-center gap-2', comp.levelColor)}
                >
                    <ArrowRight className="w-5 h-5" />شارك الآن
                </motion.button>
            )}
        </motion.div>
    );
}

export function ActivitiesPage({ onComplete }: { onComplete?: () => void }) {
    const level = (localStorage.getItem('haraka_student_level') as 'primary' | 'middle' | 'high') || 'middle';
    
    // Adapt Cognitive Zone based on level (Filter and rename exercises)
    const adaptedCognitiveZone = React.useMemo(() => {
        const zone = { ...COGNITIVE_ZONE };
        if (level === 'primary') {
            zone.exercises = zone.exercises.filter(e => e.level === 'Beginner').map(e => ({
                ...e,
                name: e.name + ' (ابتدائي)',
                xp: Math.round(e.xp * 0.5),
                duration: 'دقيقتان'
            }));
        } else if (level === 'middle') {
            zone.exercises = zone.exercises.filter(e => e.level === 'Beginner' || e.level === 'Intermediate').map(e => ({
                ...e,
                name: e.name + ' (متوسط)',
                xp: Math.round(e.xp * 0.8)
            }));
        } else {
            zone.exercises = zone.exercises.map(e => ({
                ...e,
                name: e.name + ' (ثانوي)',
                xp: Math.round(e.xp * 1.2)
            }));
        }
        return zone;
    }, [level]);

    const dailyTrainingTitle = level === 'primary' ? 'الرشاقة التفاعلية (مبسط)' : level === 'middle' ? 'الرشاقة التفاعلية (المتوسط)' : 'الرشاقة التفاعلية (احترافي)';
    const dailyTrainingDuration = level === 'primary' ? '5 دقائق' : level === 'middle' ? '8 دقائق' : '12 دقيقة';
    const dailyTrainingDurationSeconds = level === 'primary' ? 300 : level === 'middle' ? 480 : 720;
    const dailyTrainingXP = level === 'primary' ? 100 : level === 'middle' ? 200 : 350;

    const [activeSession, setActiveSession] = useState<ExerciseSessionData | null>(null);
    const [activeCognitiveGameId, setActiveCognitiveGameId] = useState<string | null>(null);
    const [activeRehabSessionId, setActiveRehabSessionId] = useState<string | null>(null);
    const [activePsychGameId, setActivePsychGameId] = useState<string | null>(null);
    const [activeMotorGameId, setActiveMotorGameId] = useState<{id: string, title: string} | null>(null);

    const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
    const [submissionExerciseName, setSubmissionExerciseName] = useState('');
    
    // UI layout tab
    const [activeCategory, setActiveCategory] = useState<'daily' | 'motor' | 'cognitive' | 'competitions'>('daily');

    const handleRequestVideoSubmission = (exerciseName: string) => {
        setSubmissionExerciseName(exerciseName);
        setIsSubmissionModalOpen(true);
    };

    const startSession = (name: string, category: 'motor' | 'cognitive' | 'psychological' | 'rehabilitation' = 'motor', xp: number = 200, duration: number = 90, customStages?: Omit<ExerciseStage, 'id'>[], metaId?: string) => {
        const GAME_ZONES = ['response_speed', 'control_accuracy', 'advanced_balance', 'agility_change', 'advanced_coordination', 'motor_anticipation'];
        if (metaId && GAME_ZONES.includes(metaId)) {
            setActiveMotorGameId({ id: metaId, title: name });
            return;
        }
        let totalDuration = 0;
        const generatedStages: ExerciseStage[] | undefined = customStages ? customStages.map((step, idx) => {
             totalDuration += step.durationSeconds;
             return { ...step, id: `stage-${idx}-${Date.now()}` };
        }) : undefined;

        setActiveSession({
            id: `session-${Date.now()}`,
            title: name,
            category: category,
            durationSeconds: totalDuration > 0 ? totalDuration : duration,
            xpReward: xp,
            stages: generatedStages
        });

        // BACKGROUND AUDIT LOG 
        auditService.log('بدء جلسة', `بدأ التلميذ جلسة: ${name} (فئة: ${category})`, 'youth');
    };

    return (
        <div className="space-y-6">
            
            {activeMotorGameId ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full">
                    <MotorGameEngine gameId={activeMotorGameId.id} title={activeMotorGameId.title} onComplete={() => { setActiveMotorGameId(null); onComplete?.(); }} onClose={() => { setActiveMotorGameId(null); onComplete?.(); }} />
                </motion.div>
            ) : activeRehabSessionId ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full">
                    <RehabEngine exerciseId={activeRehabSessionId} onClose={() => { setActiveRehabSessionId(null); onComplete?.(); }} />
                </motion.div>
            ) : activeCognitiveGameId ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full">
                    <CognitiveGameEngine gameId={activeCognitiveGameId} onClose={() => { setActiveCognitiveGameId(null); onComplete?.(); }} />
                </motion.div>
            ) : activePsychGameId ? (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="w-full">
                    <PsychologicalEngine gameId={activePsychGameId} onClose={() => { setActivePsychGameId(null); onComplete?.(); }} />
                </motion.div>
            ) : activeSession ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full">
                    <div className="flex items-center gap-4 mb-6">
                        <button onClick={() => { setActiveSession(null); onComplete?.(); }} className="flex items-center gap-2 px-6 py-3 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 font-black text-sm border border-red-500/20 shadow-lg group dark:text-red-400">
                            <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> إنهاء الجلسة
                        </button>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white border-r-2 border-slate-300 dark:border-slate-700 pr-4">جلسة تدريب مباشر</h2>
                    </div>
                    <InteractiveTrainingPlayer isOpen={!!activeSession} onClose={() => { setActiveSession(null); onComplete?.(); }} exercise={activeSession} onRequestVideoSubmission={handleRequestVideoSubmission} />
                </motion.div>
            ) : (
                <>

            {/* TAB NAVIGATION HEADER */}
            <div className="flex items-center gap-3 overflow-x-auto pb-4 hide-scrollbar">
                <button onClick={() => setActiveCategory('daily')} className={cn("px-6 py-3.5 rounded-2xl font-black whitespace-nowrap outline-none transition-all flex items-center gap-2", activeCategory === 'daily' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-white/10')}>
                    <Flame className="w-5 h-5"/> تدريب ونصائح
                </button>
                <button onClick={() => setActiveCategory('motor')} className={cn("px-6 py-3.5 rounded-2xl font-black whitespace-nowrap outline-none transition-all flex items-center gap-2", activeCategory === 'motor' ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30' : 'bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-white/10')}>
                    <Dumbbell className="w-5 h-5"/> الذكاء الحركي والتأهيل
                </button>
                <button onClick={() => setActiveCategory('cognitive')} className={cn("px-6 py-3.5 rounded-2xl font-black whitespace-nowrap outline-none transition-all flex items-center gap-2", activeCategory === 'cognitive' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30' : 'bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-white/10')}>
                    <Brain className="w-5 h-5"/> الأداء المعرفي والنفسي
                </button>
                <button onClick={() => setActiveCategory('competitions')} className={cn("px-6 py-3.5 rounded-2xl font-black whitespace-nowrap outline-none transition-all flex items-center gap-2", activeCategory === 'competitions' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-white/10')}>
                    <Trophy className="w-5 h-5"/> التحديات وسجل الأداء
                </button>
            </div>

            {activeCategory === 'daily' && (
                <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="space-y-8">

            {/* ══════════════════════════════════════════
                1. DAILY TRAINING CARD  ★ MOST PROMINENT
            ══════════════════════════════════════════ */}
            <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.0 }}
                className="relative rounded-[2.5rem] overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #0c1f4e 0%, #0f172a 45%, #1a0936 100%)' }}
            >
                {/* Background texture & glows */}
                <div className="absolute inset-0 opacity-[0.07] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-56 h-56 bg-purple-500/15 rounded-full blur-[80px] pointer-events-none" />

                <div className="relative z-10 p-7 sm:p-9">
                    {/* Top badge */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-400/30 flex items-center justify-center">
                            <Flame className="w-5 h-5 text-orange-400" />
                        </div>
                        <span className="text-sm md:text-base font-black text-orange-400 uppercase tracking-[0.2em]">تمرين اليوم</span>
                        <span className="mr-auto text-sm md:text-base bg-white/10 text-white/60 font-bold px-4 py-1.5 rounded-full">الثلاثاء 17 مارس</span>
                    </div>

                    {/* Main content row */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
                        <div className="flex-1">
                            <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-2">
                                {dailyTrainingTitle}
                            </h2>
                            <p className="text-blue-200/60 text-base md:text-lg mb-6">
                                تمرين T-Test · تغيير الاتجاه · الانطلاق السريع
                            </p>

                            {/* Stats row */}
                            <div className="flex flex-wrap items-center gap-6">
                                <span className="flex items-center gap-2 text-blue-200/80 text-base md:text-lg">
                                    <Clock className="w-5 h-5" />
                                    <strong className="text-white">{dailyTrainingDuration}</strong>
                                </span>
                                <span className="flex items-center gap-2 text-yellow-300 text-base md:text-lg font-bold">
                                    <Star className="w-5 h-5 fill-yellow-300" />+{dailyTrainingXP} XP
                                </span>
                                <span className="flex items-center gap-2 text-blue-300/60 text-base md:text-lg">
                                    <Trophy className="w-5 h-5" />يوم 3 / 6
                                </span>
                                <span className="text-sm md:text-base bg-blue-500/20 text-blue-300 border border-blue-500/25 font-black px-4 py-1.5 rounded-full">
                                    {level === 'primary' ? 'مبتدئ' : level === 'middle' ? 'متوسط' : 'متقدم'}
                                </span>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <motion.button
                            whileHover={{ scale: 1.06 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => startSession(dailyTrainingTitle, 'motor', dailyTrainingXP, dailyTrainingDurationSeconds)}
                            className="flex-shrink-0 flex items-center gap-3 px-10 py-5 rounded-[1.25rem] bg-gradient-to-l from-orange-500 to-red-500 text-white font-black shadow-2xl shadow-orange-500/40 text-xl"
                        >
                            <Play className="w-6 h-6 fill-white" />ابدأ الآن
                        </motion.button>
                    </div>

                    {/* Weekly streak bar */}
                    <div className="mt-8 pt-6 border-t border-white/10">
                        <div className="flex items-center gap-2 mb-4">
                            <Flame className="w-5 h-5 text-orange-400" />
                            <span className="text-sm md:text-base font-black text-white/60">تقدم الأسبوع</span>
                            <span className="text-sm md:text-base text-orange-400 font-bold mr-auto">3 أيام متتالية 🔥</span>
                        </div>
                        <div className="flex items-center gap-3">
                            {WEEK_DAYS.map((day, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                    <div className={cn(
                                        'w-full h-2.5 rounded-full transition-all',
                                        WEEK_DONE[i]
                                            ? 'bg-gradient-to-l from-orange-500 to-yellow-400 shadow-sm shadow-orange-500/40'
                                            : i === 3
                                                ? 'bg-orange-500/30 border border-orange-500/40'
                                                : 'bg-white/10'
                                    )} />
                                    <span className={cn(
                                        'text-xs md:text-sm font-bold',
                                        WEEK_DONE[i] ? 'text-orange-400' : i === 3 ? 'text-white/60' : 'text-white/20'
                                    )}>{day}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* ══════════════════════════════════════════
                1.5 SESSIONS & TASKS  ★ NEW
            ══════════════════════════════════════════ */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* UPCOMING SESSIONS */}
                <motion.section
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 }}
                    className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 shadow-sm"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white">جدول الحصص القادمة</h3>
                    </div>
                    <div className="space-y-4">
                        {youthDataService.getSessions().length === 0 ? (
                            <p className="text-center py-8 text-slate-400 font-bold">لا توجد حصص قادمة حالياً.</p>
                        ) : (
                            youthDataService.getSessions().map(session => (
                                <div key={session.id} className="group bg-slate-50 dark:bg-black/20 hover:bg-white dark:hover:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-blue-500/30 p-5 rounded-2xl transition-all flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-3 h-12 rounded-full",
                                            session.category === 'physical' ? 'bg-orange-500' : session.category === 'cognitive' ? 'bg-emerald-500' : 'bg-purple-500'
                                        )} />
                                        <div>
                                            <h4 className="font-black text-slate-900 dark:text-white text-lg">{session.title}</h4>
                                            <p className="text-sm font-bold text-slate-500 flex items-center gap-2">
                                                <Clock className="w-4 h-4" /> {session.time} · {session.date} · {session.coach}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={cn(
                                            "text-[10px] font-black px-3 py-1 rounded-full",
                                            session.status === 'confirmed' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                                        )}>
                                            {session.status === 'confirmed' ? 'مؤكد' : 'قيد الانتظار'}
                                        </span>
                                        <p className="text-[10px] text-slate-400 font-bold">{session.location || 'أونلاين'}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.section>

                {/* PENDING TASKS */}
                <motion.section
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 shadow-sm"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                            <Target className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white">المهام والواجبات</h3>
                    </div>
                    <div className="space-y-4">
                        {youthDataService.getTasks().filter(t => t.status !== 'completed').length === 0 ? (
                            <p className="text-center py-8 text-slate-400 font-bold">لا توجد مهام معلقة. أحسنت!</p>
                        ) : (
                            youthDataService.getTasks().filter(t => t.status !== 'completed').map(task => (
                                <div key={task.id} className="group bg-slate-50 dark:bg-black/20 hover:bg-white dark:hover:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-rose-500/30 p-5 rounded-2xl transition-all flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-black text-slate-900 dark:text-white text-lg">{task.title}</h4>
                                            <p className="text-sm font-bold text-slate-500 flex items-center gap-2">
                                                <User className="w-3.5 h-3.5" /> {task.coach}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className={cn("text-xs font-black", task.status === 'late' ? 'text-rose-500' : 'text-slate-400')}>
                                                موعد التسليم: {task.dueDate}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-2 pt-4 border-t border-slate-100 dark:border-white/5">
                                        <p className="text-xs text-slate-400 font-bold flex-1 pr-4">{task.details}</p>
                                        <button 
                                            onClick={() => {
                                                auditService.log('بدء مهمة', `بدأ التلميذ العمل على مهمة: ${task.title}`, 'youth');
                                                handleRequestVideoSubmission(task.title);
                                            }}
                                            className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-black px-4 py-2 rounded-xl shadow-lg shadow-rose-500/20 transition-all flex items-center gap-2"
                                        >
                                            إرسال الواجب <ArrowRight className="w-3 h-3 mirror-rtl" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.section>
            </div>

            {/* ══════════════════════════════════════════
                2. MOVEMENT FINGERPRINT SUMMARY
            ══════════════════════════════════════════ */}
            <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="bg-white/[0.03] border border-white/[0.07] rounded-[2rem] p-6 relative overflow-hidden"
            >
                <div className="absolute -top-16 -right-16 w-48 h-48 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <BarChart2 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-black text-white text-lg">ملخص البصمة الحركية</h3>
                                <p className="text-white/40 text-sm">نقاط الضعف التي تحتاج إلى تحسين</p>
                            </div>
                        </div>
                        <button className="text-blue-400 text-sm font-bold flex items-center gap-1.5 hover:text-blue-300 transition-colors">
                            التفاصيل <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {FINGERPRINT_WEAKNESSES.map((w, i) => {
                            const Icon = w.icon;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.08 }}
                                    className={cn('rounded-[1.25rem] p-5 border', w.bg, w.border)}
                                >
                                    <div className="flex items-center gap-2.5 mb-3">
                                        <Icon className={cn('w-5 h-5', w.color)} />
                                        <span className={cn('text-sm md:text-base font-black', w.color)}>{w.label}</span>
                                        <span className="text-white/30 text-sm md:text-base font-bold mr-auto">{w.score}%</span>
                                    </div>
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                                        <motion.div
                                            className={cn('h-full rounded-full', w.bar)}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${w.score}%` }}
                                            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 + i * 0.1 }}
                                        />
                                    </div>
                                    <p className="text-white/40 text-xs md:text-sm">→ {w.suggestion}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </motion.section>

            {/* ══════════════════════════════════════════
                3. SMART TRAINING (AI Suggestions)
            ══════════════════════════════════════════ */}
            <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.14 }}
                className="bg-gradient-to-l from-indigo-900/30 to-blue-900/20 border border-indigo-500/25 rounded-[2rem] p-6 relative overflow-hidden"
            >
                <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-black text-white text-lg">Smart Training ✦ توصيات الذكاء الاصطناعي</h3>
                            <p className="text-blue-300/60 text-sm">بناءً على البصمة الحركية، هذه أفضل 3 تمارين لك اليوم</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {SMART_SUGGESTIONS.map((s, i) => {
                            const Icon = s.icon;
                            return (
                                <motion.button
                                    key={i}
                                    whileHover={{ y: -3, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        auditService.log('اختيار توصية ذكية', `اختار التوصية: ${s.name}`, 'youth');
                                        if (s.route === 'motor') setActiveMotorGameId({ id: s.gameId, title: s.name });
                                        else if (s.route === 'cognitive') setActiveCognitiveGameId(s.gameId);
                                        else if (s.route === 'psych') setActivePsychGameId(s.gameId);
                                        else if (s.route === 'rehab') setActiveRehabSessionId(s.gameId);
                                        else startSession(s.name);
                                    }}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.14 + i * 0.07 }}
                                    className="text-right bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] rounded-[1.25rem] p-5 flex flex-col gap-3 transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0', s.color)}>
                                            <Icon className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-black text-white text-sm md:text-base truncate">{s.name}</p>
                                            <p className="text-white/40 text-xs md:text-sm">{s.zone}</p>
                                        </div>
                                        <span className="text-yellow-400/70 text-xs md:text-sm font-bold flex-shrink-0">+{s.xp} XP</span>
                                    </div>
                                    <p className="text-white/40 text-xs md:text-sm flex items-center gap-1.5 pt-1">
                                        <TrendingUp className="w-4 h-4 text-blue-400 flex-shrink-0" />{s.reason}
                                    </p>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            </motion.section>

                </motion.div>
            )}

            {activeCategory === 'motor' && (
                <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="space-y-8">
                    <MotorZoneSection onStartExercise={startSession} />
                    <RehabZoneSection onStartRehab={(id) => setActiveRehabSessionId(id)} />
                </motion.div>
            )}

            {activeCategory === 'cognitive' && (
                <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="space-y-8">
                    <CognitiveZoneSection zone={adaptedCognitiveZone} onStartExercise={(ex) => setActiveCognitiveGameId(ex.id)} />
                    <PsychologicalZoneSection onStartExercise={(gameId) => setActivePsychGameId(gameId)} />
                </motion.div>
            )}

            {activeCategory === 'competitions' && (
                <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="space-y-8">


            {/* ══════════════════════════════════════════
                6. COMPETITIONS & CHALLENGES ★ NEW
            ══════════════════════════════════════════ */}
            <motion.section
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="bg-white/[0.02] border border-white/[0.06] rounded-[2rem] p-6 space-y-5 relative overflow-hidden"
            >
                <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-yellow-500/6 rounded-full blur-[80px] pointer-events-none" />

                {/* Header */}
                <div className="relative z-10 flex items-center gap-5">
                    <div className="w-2 h-16 bg-gradient-to-b from-yellow-400 to-red-500 rounded-full shadow-[0_0_20px_rgba(251,191,36,0.4)]" />
                    <div>
                        <h3 className="text-2xl md:text-3xl font-black text-white mb-1">المسابقات والتحديات</h3>
                        <p className="text-yellow-200/50 font-bold text-base">مدرسية 🏫 · ولائية 🏙️ · وطنية 🇩🇿</p>
                    </div>
                </div>

                {/* Category tabs */}
                <div className="flex items-center gap-3 relative z-10">
                    {[
                        { label: 'مدرسية', icon: School, color: 'bg-blue-500/15 text-blue-300 border-blue-500/25' },
                        { label: 'ولائية', icon: Building2, color: 'bg-purple-500/15 text-purple-300 border-purple-500/25' },
                        { label: 'وطنية', icon: Flag, color: 'bg-orange-500/15 text-orange-300 border-orange-500/25' },
                    ].map((cat) => {
                        const CatIcon = cat.icon;
                        return (
                            <span key={cat.label} className={cn('flex items-center gap-2 text-sm md:text-base font-black px-4 py-2 rounded-full border', cat.color)}>
                                <CatIcon className="w-4 h-4" />{cat.label}
                            </span>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
                    {COMPETITIONS.map((comp, i) => (
                        <motion.div
                            key={comp.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.58 + i * 0.07 }}
                        >
                            <CompetitionCard comp={comp} />
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* ══════════════════════════════════════════
                7. VIDEO ANALYSIS — Independent Section
            ══════════════════════════════════════════ */}
            <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
            >
                <VideoAnalysisSection />
            </motion.div>
            
                </motion.div>
            )}

            </>
            )}



            <VideoSubmissionModal 
                isOpen={isSubmissionModalOpen} 
                onClose={() => setIsSubmissionModalOpen(false)} 
                exerciseName={submissionExerciseName} 
            />
        </div>
    );
}
