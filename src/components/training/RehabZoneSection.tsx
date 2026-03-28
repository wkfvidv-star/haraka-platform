import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Activity, Waves, Smile, ArrowRight, PlayCircle, ShieldCheck, Moon } from 'lucide-react';
import { REHAB_PROGRAMS_DB } from '@/data/rehabExercisesDb';

interface Props {
    onStartRehab: (exerciseId: string) => void;
}

const CAT_ICONS: Record<string, React.ReactNode> = {
    'basic_movement': <Activity className="w-8 h-8" />,
    'neural_control': <Heart className="w-8 h-8" />,
    'balance': <ShieldCheck className="w-8 h-8" />,
    'strength': <PlayCircle className="w-8 h-8" />,
    'mind_body': <Smile className="w-8 h-8" />,
    'relaxation': <Moon className="w-8 h-8" />,
    'lower-limb': <Activity className="w-8 h-8 text-slate-300" />,
    'upper-limb': <ShieldCheck className="w-8 h-8 text-slate-300" />,
    'balance-stability': <Heart className="w-8 h-8 text-slate-300" />,
    'neuro-coordination': <Smile className="w-8 h-8 text-slate-300" />,
    'flexibility-mobility': <Activity className="w-8 h-8 text-slate-300" />,
    'pain-relief': <Moon className="w-8 h-8 text-slate-300" />,
};

export const RehabZoneSection: React.FC<Props> = ({ onStartRehab }) => {
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

    return (
        <div className="w-full relative mt-16 mb-24 rounded-[3rem] p-8 md:p-12 overflow-hidden shadow-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-blue-500/20 font-cairo">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1)_0%,transparent_60%)] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.1)_0%,transparent_60%)] pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 text-right mb-12">
                <div className="inline-flex items-center justify-center p-4 bg-blue-500/10 rounded-3xl mb-6 shadow-[0_0_30px_rgba(59,130,246,0.3)] border border-blue-500/20">
                    <Heart className="w-12 h-12 text-blue-400" />
                </div>
                <h2 className="text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-lg mb-6">إعادة التأهيل الحركي</h2>
                <p className="text-3xl text-blue-200/90 font-black max-w-3xl ml-auto leading-relaxed">"لنبدأ رحلتك نحو التعافي واستعادة قوتك 💙"</p>
            </div>

            {/* Categories */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {REHAB_PROGRAMS_DB.map((prog) => {
                    const isExpanded = expandedCategory === prog.id;

                    return (
                        <div key={prog.id} className="w-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden transition-all duration-500 hover:border-blue-500/30">
                            {/* Category Header */}
                            <button 
                                onClick={() => setExpandedCategory(isExpanded ? null : prog.id)}
                                className="w-full p-6 flex items-center justify-between text-right group"
                            >
                                <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                    <ArrowRight className="w-6 h-6 text-white/50 group-hover:text-blue-400" />
                                </motion.div>
                                <div className="flex items-center gap-5">
                                    <h3 className="text-2xl md:text-3xl font-black text-white">{prog.title}</h3>
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-teal-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                                        {CAT_ICONS[prog.id]}
                                    </div>
                                </div>
                            </button>

                            {/* Exercises List (Accordion) */}
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden bg-black/20"
                                    >
                                        <div className="p-6 border-t border-white/5 flex flex-col gap-4">
                                            {prog.exercises.map((ex, idx) => (
                                                <div key={ex.id} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col md:flex-row items-end md:items-center justify-between gap-6 hover:bg-white/10 transition-colors">
                                                    
                                                    <button 
                                                        onClick={() => onStartRehab(ex.id)}
                                                        className="w-full md:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xl flex items-center justify-center gap-3 transition-all shadow-lg order-2 md:order-1 shrink-0"
                                                    >
                                                        <PlayCircle className="w-6 h-6" />
                                                        بدء الجلسة
                                                    </button>
                                                    
                                                    <div className="text-right w-full order-1 md:order-2">
                                                        <p className="text-blue-400 font-black text-sm uppercase tracking-widest mb-2">تمرين {idx + 1}</p>
                                                        <h4 className="text-2xl font-black text-white mb-2">{ex.name}</h4>
                                                        <p className="text-white/60 text-lg font-bold truncate max-w-md ml-auto">"{ex.introMessage}"</p>
                                                    </div>
                                                    
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
