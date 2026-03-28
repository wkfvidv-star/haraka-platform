import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Target, Dumbbell, BatteryCharging, HeartHandshake, Eye, Sparkles, ArrowRight, Play, Activity, Settings2, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PSYCHOLOGICAL_GAMES_DB } from '@/data/psychologicalProgramsDb';

interface PsychologicalZoneSectionProps {
    onStartExercise: (gameId: string) => void;
}

const PSYCHOLOGICAL_MACRO_ZONES = [
    { id: 'stress_control', title: 'التحكم في الضغط', desc: 'الأداء تحت الضغط وسرعة اتخاذ القرار', icon: Activity, color: 'text-rose-400', bg: 'bg-rose-500/10 hover:bg-rose-500/20', border: 'border-rose-500/20 hover:border-rose-500/40', shadow: 'hover:shadow-[0_0_30px_rgba(244,63,94,0.3)]', emoji: '💥' },
    { id: 'deep_focus', title: 'التركيز العميق', desc: 'مقاومة التشتت والمثابرة طويلة المدى', icon: Target, color: 'text-indigo-400', bg: 'bg-indigo-500/10 hover:bg-indigo-500/20', border: 'border-indigo-500/20 hover:border-indigo-500/40', shadow: 'hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]', emoji: '🎯' },
    { id: 'emotional_control', title: 'التحكم العاطفي', desc: 'الاستجابة الهادئة وإدارة الإحباط الداخلي', icon: HeartHandshake, color: 'text-sky-400', bg: 'bg-sky-500/10 hover:bg-sky-500/20', border: 'border-sky-500/20 hover:border-sky-500/40', shadow: 'hover:shadow-[0_0_30px_rgba(56,189,248,0.3)]', emoji: '⚖️' },
    { id: 'confidence_decision', title: 'الثقة واتخاذ القرار', desc: 'الحسم المطلق والمخاطرة التكتيكية الذكية', icon: Dumbbell, color: 'text-yellow-400', bg: 'bg-yellow-500/10 hover:bg-yellow-500/20', border: 'border-yellow-500/20 hover:border-yellow-500/40', shadow: 'hover:shadow-[0_0_30px_rgba(234,179,8,0.3)]', emoji: '🦅' },
    { id: 'resilience', title: 'الصمود الذهني', desc: 'الاستمرار رغم الانتكاسات وتجديد الطاقة', icon: BatteryCharging, color: 'text-orange-400', bg: 'bg-orange-500/10 hover:bg-orange-500/20', border: 'border-orange-500/20 hover:border-orange-500/40', shadow: 'hover:shadow-[0_0_30px_rgba(249,115,22,0.3)]', emoji: '🔗' },
    { id: 'relaxation_balance', title: 'الاسترخاء والتوازن', desc: 'التفريغ التنفسي وإعادة تهيئة النظام العصبي', icon: Wind, color: 'text-emerald-400', bg: 'bg-emerald-500/10 hover:bg-emerald-500/20', border: 'border-emerald-500/20 hover:border-emerald-500/40', shadow: 'hover:shadow-[0_0_30px_rgba(52,211,153,0.3)]', emoji: '🌊' },
    { id: 'stress_management', title: 'إدارة التوتر والقلق', desc: 'تمارين للتخلص من الضغط والتوتر', icon: Wind, color: 'text-teal-400', bg: 'bg-teal-500/10 hover:bg-teal-500/20', border: 'border-teal-500/20 hover:border-teal-500/40', shadow: 'hover:shadow-[0_0_30px_rgba(45,212,191,0.3)]', emoji: '😌' },
    { id: 'mental_focus', title: 'تحسين التركيز الذهني', desc: 'تمارين لزيادة الانتباه وتصفية الذهن', icon: Target, color: 'text-indigo-400', bg: 'bg-indigo-500/10 hover:bg-indigo-500/20', border: 'border-indigo-500/20 hover:border-indigo-500/40', shadow: 'hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]', emoji: '🎯' },
    { id: 'self_confidence', title: 'بناء الثقة بالنفس', desc: 'تعزيز الإيمان بقدراتك وإمكانياتك', icon: Dumbbell, color: 'text-rose-400', bg: 'bg-rose-500/10 hover:bg-rose-500/20', border: 'border-rose-500/20 hover:border-rose-500/40', shadow: 'hover:shadow-[0_0_30px_rgba(244,63,94,0.3)]', emoji: '💪' },
    { id: 'energy_boost', title: 'رفع الدافعية والطاقة', desc: 'تجديد النشاط وشحن الطاقة الإيجابية', icon: BatteryCharging, color: 'text-yellow-400', bg: 'bg-yellow-500/10 hover:bg-yellow-500/20', border: 'border-yellow-500/20 hover:border-yellow-500/40', shadow: 'hover:shadow-[0_0_30px_rgba(234,179,8,0.3)]', emoji: '🔋' },
    { id: 'relaxation', title: 'الاسترخاء والهدوء', desc: 'تمارين للوصول للهدوء والسلام الداخلي', icon: Sparkles, color: 'text-cyan-400', bg: 'bg-cyan-500/10 hover:bg-cyan-500/20', border: 'border-cyan-500/20 hover:border-cyan-500/40', shadow: 'hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]', emoji: '🧘' },
    { id: 'emotional_balance', title: 'التوازن العاطفي', desc: 'إدارة المشاعر وتحقيق الاستقرار النفسي', icon: HeartHandshake, color: 'text-pink-400', bg: 'bg-pink-500/10 hover:bg-pink-500/20', border: 'border-pink-500/20 hover:border-pink-500/40', shadow: 'hover:shadow-[0_0_30px_rgba(236,72,153,0.3)]', emoji: '🌿' },
    { id: 'self_awareness', title: 'الوعي الذاتي', desc: 'اكتشاف الذات ومراقبة الأفكار بصدق', icon: Eye, color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10 hover:bg-fuchsia-500/20', border: 'border-fuchsia-500/20 hover:border-fuchsia-500/40', shadow: 'hover:shadow-[0_0_30px_rgba(217,70,239,0.3)]', emoji: '🧠' },
];

export const PsychologicalZoneSection: React.FC<PsychologicalZoneSectionProps> = ({ onStartExercise }) => {
    const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);

    const activeZone = PSYCHOLOGICAL_MACRO_ZONES.find(z => z.id === selectedZoneId);
    
    // Convert Record to Array for rendering
    const allGames = Object.values(PSYCHOLOGICAL_GAMES_DB);
    const individualExercises = allGames;

    const handleStartIndividualExercise = (gameId: string) => {
        onStartExercise(gameId);
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-slate-900 via-sky-950/40 to-slate-900 border border-sky-500/20 rounded-[2.5rem] p-6 sm:p-8 relative overflow-hidden shadow-2xl font-cairo"
            dir="rtl"
        >
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
            
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
                                <span className="px-5 py-2 rounded-full bg-sky-500/20 text-sky-300 font-bold text-sm uppercase tracking-[0.2em] mb-4 border border-sky-500/30">
                                    المنطقة النفسية والذهنية 🧠
                                </span>
                                <h2 className="text-4xl md:text-5xl font-black text-white mb-4">وحدات الأداء النفسي</h2>
                                <p className="text-xl font-bold text-sky-200/80">اختر البرنامج النفسي الذي تحتاجه اليوم 👇</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {PSYCHOLOGICAL_MACRO_ZONES.slice(0, 6).map((zone) => {
                                    const Icon = zone.icon;
                                    // Count matches where PSYCHOLOGICAL_GAMES_DB match id
                                    const exerciseCount = PSYCHOLOGICAL_GAMES_DB[zone.id] ? 1 : 0;
                                    
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
                                            <h4 className="font-black text-white text-2xl mb-2">{zone.title}</h4>
                                            <p className="text-white/60 text-sm font-bold leading-relaxed">{zone.desc}</p>
                                            
                                            <div className="mt-6 flex items-center justify-between w-full pt-4 border-t border-white/10">
                                                <span className="text-sm font-bold text-white/50">{exerciseCount} جلسات مخصصة</span>
                                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group">
                                                    <ArrowRight className="w-4 h-4 text-white group-hover:-translate-x-1 transition-transform" />
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
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 pb-6 border-b border-sky-500/20">
                                <div className="flex items-center gap-4">
                                    <button 
                                        onClick={() => setSelectedZoneId(null)}
                                        className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md transition-colors border border-white/10 group shadow-lg"
                                    >
                                        <ArrowRight className="w-5 h-5 text-sky-300 group-hover:-translate-x-1 transition-transform" />
                                        <span className="text-white font-bold text-sm">الرجوع للأقسام</span>
                                    </button>
                                    <div className="mr-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-4xl">{activeZone?.emoji}</span>
                                            <h2 className="text-3xl md:text-4xl font-black text-white">{activeZone?.title}</h2>
                                        </div>
                                        <p className="text-lg font-bold text-sky-200/60 mt-2">اختر الجلسة النفسية للمتابعة</p>
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
                                        className="group relative bg-[#0b0f19]/80 backdrop-blur-xl border border-sky-500/20 rounded-3xl overflow-hidden hover:border-sky-400/50 transition-all flex flex-col md:flex-row shadow-xl"
                                    >
                                        {/* Image Section */}
                                        <div className="w-full md:w-2/5 h-48 md:h-auto relative overflow-hidden flex-shrink-0">
                                            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#0b0f19]/90 z-10" />
                                            <div className="w-full h-full bg-slate-900 border-l border-white/5 opacity-80" />
                                            {/* Type Badges */}
                                            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                                                <div className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-xs font-black text-sky-400 flex items-center gap-1">
                                                    {ex.category}
                                                </div>
                                                <div className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-xs font-bold text-white/70">
                                                    {ex.levels.length} مستويات
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="p-6 md:p-8 flex-1 flex flex-col justify-between relative z-20">
                                            <div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Brain className="w-5 h-5 text-sky-400" />
                                                    <h3 className="text-2xl font-black text-white">{ex.title}</h3>
                                                </div>
                                                <p className="text-sky-100/60 font-medium leading-relaxed text-sm mb-6">
                                                    {ex.description}
                                                </p>
                                                
                                                <div className="grid grid-cols-2 gap-4 mb-6">
                                                    <div className="bg-sky-500/10 border border-sky-500/20 rounded-2xl p-4">
                                                        <Settings2 className="w-5 h-5 text-sky-400 mb-2" />
                                                        <div className="text-sm font-black text-white">{ex.levels.length} مراحل</div>
                                                        <div className="text-xs text-sky-200/50 mt-1">تدرج الصعوبة</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <button 
                                                onClick={() => handleStartIndividualExercise(ex.id)}
                                                className="w-full sm:w-auto mt-4 sm:mt-0 px-8 py-4 bg-gradient-to-l from-sky-500 hover:from-sky-400 to-indigo-600 hover:to-indigo-500 text-white font-black rounded-xl shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(56,189,248,0.5)] flex items-center justify-center sm:justify-between gap-4 group/btn"
                                            >
                                                <Play className="w-5 h-5 fill-current" /> بدء الجلسة
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
