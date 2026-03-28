import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Flame, Zap, Shield, Activity, Heart, Target, ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MOTOR_PROGRAMS_DB } from '@/data/motorProgramsDb';
import { ExerciseStage } from '@/components/training/InteractiveTrainingPlayer';

interface MotorZoneSectionProps {
    onStartExercise: (name: string, category: 'motor', xp: number, duration: number, customStages?: Omit<ExerciseStage, 'id'>[], metaId?: string) => void;
}

const MOTOR_MACRO_ZONES = [
    { id: 'strength', title: 'تنمية القوة البدنية', desc: 'تمارين لبناء العضلات وزيادة القوة الشاملة', icon: Dumbbell, color: 'text-red-400', bg: 'bg-red-500/10 hover:bg-red-500/20', border: 'border-red-500/20 hover:border-red-500/40', shadow: 'hover:shadow-[0_0_30px_rgba(248,113,113,0.3)]', emoji: '💪' },
    { id: 'endurance', title: 'التحمل التنفسي', desc: 'رفع كفاءة القلب والرئتين ومدة المجهود', icon: Heart, color: 'text-pink-400', bg: 'bg-pink-500/10 hover:bg-pink-500/20', border: 'border-pink-500/20 hover:border-pink-500/40', shadow: 'hover:shadow-[0_0_30px_rgba(244,114,182,0.3)]', emoji: '🫁' },
    { id: 'speed', title: 'السرعة والانفجار', desc: 'زيادة سرعة الانطلاق وتقوية الألياف السريعة', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/10 hover:bg-yellow-500/20', border: 'border-yellow-500/20 hover:border-yellow-500/40', shadow: 'hover:shadow-[0_0_30px_rgba(250,204,21,0.3)]', emoji: '⚡' },
    { id: 'balance', title: 'توازن واستقرار', desc: 'التحكم بالجسد أثناء الثبات والحركة', icon: Shield, color: 'text-teal-400', bg: 'bg-teal-500/10 hover:bg-teal-500/20', border: 'border-teal-500/20 hover:border-teal-500/40', shadow: 'hover:shadow-[0_0_30px_rgba(45,212,191,0.3)]', emoji: '⚖️' },
    { id: 'agility', title: 'الرشاقة', desc: 'تغيير الاتجاهات بسرعة وخفة بدون فقد التوازن', icon: Activity, color: 'text-blue-400', bg: 'bg-blue-500/10 hover:bg-blue-500/20', border: 'border-blue-500/20 hover:border-blue-500/40', shadow: 'hover:shadow-[0_0_30px_rgba(96,165,250,0.3)]', emoji: '🌀' },
    { id: 'flexibility', title: 'المرونة', desc: 'إطالة العضلات لزيادة المدى الحركي', icon: Target, color: 'text-indigo-400', bg: 'bg-indigo-500/10 hover:bg-indigo-500/20', border: 'border-indigo-500/20 hover:border-indigo-500/40', shadow: 'hover:shadow-[0_0_30px_rgba(129,140,248,0.3)]', emoji: '🧘' },
    { id: 'coordination', title: 'التوافق العضلي', desc: 'ربط أجزاء الجسم للعمل معاً بانسجام', icon: Dumbbell, color: 'text-purple-400', bg: 'bg-purple-500/10 hover:bg-purple-500/20', border: 'border-purple-500/20 hover:border-purple-500/40', shadow: 'hover:shadow-[0_0_30px_rgba(192,132,252,0.3)]', emoji: '🧠' },

    { id: 'response_speed', title: 'سرعة الاستجابة الحركية (ملحق ألعاب)', desc: 'يميز بين العادي وصاحب القرار السريع', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/10 hover:bg-yellow-500/20', border: 'border-yellow-500/20 hover:border-yellow-500/40', shadow: 'hover:shadow-[0_0_30px_rgba(234,179,8,0.3)]', emoji: '⚡' },
    { id: 'control_accuracy', title: 'التحكم الحركي والدقة (ملحق ألعاب)', desc: 'التحكم العصبي الدقيق والحركة الجودة', icon: Target, color: 'text-rose-400', bg: 'bg-rose-500/10 hover:bg-rose-500/20', border: 'border-rose-500/20 hover:border-rose-500/40', shadow: 'hover:shadow-[0_0_30px_rgba(244,63,94,0.3)]', emoji: '🎯' },
    { id: 'advanced_balance', title: 'التوازن الحركي المتقدم (ملحق ألعاب)', desc: 'الثبات تحت التشويش والتوازن الديناميكي', icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-500/10 hover:bg-emerald-500/20', border: 'border-emerald-500/20 hover:border-emerald-500/40', shadow: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]', emoji: '⚖️' },
    { id: 'agility_change', title: 'الرشاقة والتغيير السريع (ملحق ألعاب)', desc: 'التنقل بين الأهداف المتغيرة وتفادي العوائق', icon: Activity, color: 'text-blue-400', bg: 'bg-blue-500/10 hover:bg-blue-500/20', border: 'border-blue-500/20 hover:border-blue-500/40', shadow: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]', emoji: '🌀' },
    { id: 'advanced_coordination', title: 'التناسق الحركي المتقدم (ملحق ألعاب)', desc: 'التنسيق بين اليدين والتسلسل الحركي المعقد', icon: Dumbbell, color: 'text-indigo-400', bg: 'bg-indigo-500/10 hover:bg-indigo-500/20', border: 'border-indigo-500/20 hover:border-indigo-500/40', shadow: 'hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]', emoji: '🧠' },
    { id: 'motor_anticipation', title: 'التوقع الحركي (ملحق ألعاب)', desc: 'أهم معيار لكشف المواهب الرياضية العالية', icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/10 hover:bg-orange-500/20', border: 'border-orange-500/20 hover:border-orange-500/40', shadow: 'hover:shadow-[0_0_30px_rgba(249,115,22,0.3)]', emoji: '👁️' },
];

export const MotorZoneSection: React.FC<MotorZoneSectionProps> = ({ onStartExercise }) => {
    const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);

    const activeZone = MOTOR_MACRO_ZONES.find(z => z.id === selectedZoneId);
    
    // Determine dynamic level for time multipliers
    const getUserId = () => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            return user?.id || 'default';
        } catch {
            return 'default';
        }
    };
    const uid = getUserId();
    const level = (localStorage.getItem(`haraka_student_level_${uid}`) as 'primary' | 'middle' | 'high') || 'middle';
    
    // In MOTOR_PROGRAMS_DB, index 0 is always an intro stage, and index > 0 are the individual exercises.
    const activeProgramArray = activeZone ? MOTOR_PROGRAMS_DB[activeZone.id] : [];
    const introStage = activeProgramArray && activeProgramArray.length > 0 ? activeProgramArray[0] : null;
    let individualExercises = activeProgramArray && activeProgramArray.length > 1 ? activeProgramArray.slice(1) : [];

    // Dynamically adapt exercises based on the student's level
    if (individualExercises.length > 0) {
        individualExercises = individualExercises.map(ex => {
            let durationMultiplier = 1;
            let levelSuffix = '';
            
            if (level === 'primary') {
                durationMultiplier = 0.6; // 40% easier
                levelSuffix = ' (مبسط)';
            } else if (level === 'middle') {
                durationMultiplier = 1.0; // Normal
            } else if (level === 'high') {
                durationMultiplier = 1.4; // 40% harder
                levelSuffix = ' (احترافي)';
            }
            
            return {
                ...ex,
                name: ex.name + levelSuffix,
                durationSeconds: ex.durationSeconds ? Math.round(ex.durationSeconds * durationMultiplier) : undefined,
                xpReward: ex.xpReward ? Math.round(ex.xpReward * durationMultiplier) : undefined
            };
        });
    }

    const handleStartIndividualExercise = (exercise: Omit<ExerciseStage, 'id'>) => {
        if (!activeZone || !introStage) return;
        // Package the intro stage + the selected exercise stage
        const customStages = [introStage, exercise];
        onStartExercise(`${activeZone.emoji} ${activeZone.title} - ${exercise.name}`, 'motor', 150, 0, customStages, activeZone.id);
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/20 rounded-[2.5rem] p-6 sm:p-8 relative overflow-hidden shadow-2xl font-cairo"
            dir="rtl"
        >
            <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
            
            <div className="relative z-10 w-full">
                <AnimatePresence mode="wait">
                    {!selectedZoneId ? (
                        <motion.div 
                            key="grid"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <div className="flex flex-col items-center justify-center text-center mb-10">
                                <span className="px-5 py-2 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-sm uppercase tracking-[0.2em] mb-4 border border-indigo-500/30">
                                    المنطقة المتقدمة ✨
                                </span>
                                <h2 className="text-4xl md:text-5xl font-black text-white mb-4">وحدات الأداء الحركي الشامل</h2>
                                <p className="text-xl font-bold text-indigo-200/80">اختر الخلية التدريبية (الوحدة) لعرض التمارين التخصصية 👇</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {MOTOR_MACRO_ZONES.map((zone) => {
                                    const Icon = zone.icon;
                                    const exerciseCount = MOTOR_PROGRAMS_DB[zone.id] ? MOTOR_PROGRAMS_DB[zone.id].length - 1 : 0;
                                    
                                    return (
                                        <motion.button
                                            key={zone.id}
                                            whileHover={{ scale: 1.03, y: -4 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setSelectedZoneId(zone.id)}
                                            className={cn("flex flex-col text-right rounded-3xl p-6 border transition-all duration-300 backdrop-blur-md relative overflow-hidden", zone.bg, zone.border, zone.shadow)}
                                        >
                                            <div className="flex items-center justify-between mb-4 w-full">
                                                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center bg-black/20 backdrop-blur-xl border border-white/5", zone.color)}>
                                                    <Icon className="w-7 h-7" />
                                                </div>
                                                <span className="text-5xl drop-shadow-lg">{zone.emoji}</span>
                                            </div>
                                            <h4 className="font-black text-white text-2xl md:text-3xl mb-3">{zone.title}</h4>
                                            <p className="text-white/60 text-base md:text-lg font-bold leading-relaxed">{zone.desc}</p>
                                            
                                            <div className="mt-6 flex items-center justify-between w-full pt-4 border-t border-white/10">
                                                <span className="text-base font-bold text-white/50">{exerciseCount} تمارين تخصصية</span>
                                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group">
                                                    <ArrowRight className="w-5 h-5 text-white group-hover:-translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="exercises"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            {/* Submenu Top Bar */}
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 pb-6 border-b border-indigo-500/20">
                                <div className="flex items-center gap-4">
                                    <button 
                                        onClick={() => setSelectedZoneId(null)}
                                        className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md transition-colors border border-white/10 group shadow-lg"
                                    >
                                        <ArrowRight className="w-5 h-5 text-indigo-300 group-hover:-translate-x-1 transition-transform" />
                                        <span className="text-white font-bold text-sm">الرجوع للأقسام</span>
                                    </button>
                                    <div className="mr-4">
                                        <div className="flex items-center gap-4">
                                            <span className="text-5xl">{activeZone?.emoji}</span>
                                            <h2 className="text-4xl md:text-5xl font-black text-white">{activeZone?.title}</h2>
                                        </div>
                                        <p className="text-xl md:text-2xl font-bold text-indigo-200/60 mt-2">اختر تمريناً مخصصاً للبدء</p>
                                    </div>
                                </div>
                            </div>

                            {/* Submenu Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                                {individualExercises.map((ex, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="group relative bg-[#0b0f19]/80 backdrop-blur-xl border border-indigo-500/20 rounded-3xl overflow-hidden hover:border-indigo-400/50 transition-all flex flex-col md:flex-row shadow-xl"
                                    >
                                        {/* Image Section */}
                                        <div className="w-full md:w-2/5 h-48 md:h-auto relative overflow-hidden flex-shrink-0">
                                            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#0b0f19]/90 z-10" />
                                            <img
                                                src={ex.imageUrl}
                                                alt={ex.name}
                                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 brightness-75 group-hover:brightness-100"
                                            />
                                            {/* Level Badges */}
                                            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                                                <div className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-xs font-black text-emerald-400 flex items-center gap-1">
                                                    <CheckCircle2 className="w-3 h-3" /> مدمج المستويات الخمسة
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="p-6 md:p-8 flex flex-col justify-between flex-1 relative z-20">
                                            <div>
                                                <h3 className="text-2xl md:text-3xl font-black text-white mb-3 group-hover:text-indigo-300 transition-colors leading-tight">
                                                    {ex.name}
                                                </h3>
                                                {ex.description && ex.description.length > 0 && (
                                                    <p className="text-indigo-100/60 font-medium text-base md:text-lg leading-relaxed mb-4 line-clamp-2">
                                                        {ex.description.join(' • ')}
                                                    </p>
                                                )}
                                                {ex.durationSeconds && (
                                                    <div className="flex items-center gap-2 mb-6 text-base font-bold text-slate-400">
                                                        <Activity className="w-5 h-5 text-indigo-400" /> الوقت الأساسي: {ex.durationSeconds} ثانية
                                                    </div>
                                                )}
                                            </div>

                                            <button 
                                                onClick={() => handleStartIndividualExercise(ex)}
                                                className={cn("w-full py-4 rounded-2xl font-black text-lg transition-all shadow-lg flex items-center justify-center gap-3", activeZone?.bg, activeZone?.color, activeZone?.border)}
                                            >
                                                <Play className="w-5 h-5 fill-current" /> بدء هذا التمرين 
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.section>
    );
};
