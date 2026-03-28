import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Activity, AlertTriangle, ArrowRight, CheckCircle, Info, Sparkles } from 'lucide-react';
import { REHAB_PROGRAMS_DB, RehabExercise } from '@/data/rehabExercisesDb';
import { activityService } from '@/services/activityService';

interface Props {
    exerciseId: string;
    onClose: () => void;
}

export const RehabEngine: React.FC<Props> = ({ exerciseId, onClose }) => {
    // Find exercise across all programs
    let activeEx: RehabExercise | null = null;
    let programTitle = '';
    
    for (const prog of REHAB_PROGRAMS_DB) {
        const found = prog.exercises.find(e => e.id === exerciseId);
        if (found) {
            activeEx = found;
            programTitle = prog.title;
            break;
        }
    }

    const [engineState, setEngineState] = useState<'intro' | 'active' | 'level_transition' | 'completed'>('intro');
    const [currentLevel, setCurrentLevel] = useState(1);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const playStartupChime = () => {
        try {
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1); 
            gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
            osc.start(audioCtx.currentTime);
            osc.stop(audioCtx.currentTime + 0.5);
        } catch (e) {}
    };

    const playVictoryChime = () => {
        try {
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(440, audioCtx.currentTime);
            osc.frequency.setValueAtTime(554.37, audioCtx.currentTime + 0.15);
            osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.3);
            osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.45);
            gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.05);
            gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime + 0.6);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.5);
            osc.start(audioCtx.currentTime);
            osc.stop(audioCtx.currentTime + 1.5);
        } catch (e) {}
    };

    const speak = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const cleanText = text.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '');
            const utterance = new SpeechSynthesisUtterance(cleanText);
            const voices = window.speechSynthesis.getVoices();
            const premiumArVoice = voices.find(v => v.name.includes('Tarika') || v.name.includes('Naayf') || v.name.includes('Laila') || v.name.includes('Hamed') || v.name.includes('Google Arabic')) || voices.find(v => v.lang.includes('ar'));
            if (premiumArVoice) {
                utterance.voice = premiumArVoice;
                utterance.lang = premiumArVoice.lang;
            } else {
                utterance.lang = 'ar-SA';
            }
            utterance.rate = 0.88; 
            utterance.pitch = 0.95; 
            window.speechSynthesis.speak(utterance);
        }
    };

    useEffect(() => {
        if (engineState === 'intro' && activeEx) {
            playStartupChime();
            speak(activeEx.introMessage);
        } else if (engineState === 'active' && activeEx) {
            const combinedInstructions = currentLevel === 1 
                ? "المستوى الأول. كيفيّة الأداء. " + activeEx.instructions.join('. . ')
                : `المستوى ${currentLevel}. ركز واستمر بنفس الجودة.`;
            speak(combinedInstructions);
        } else if (engineState === 'level_transition') {
            playVictoryChime();
            const rehabPhrases = [
                `أداء سليم وممتاز في المستوى ${currentLevel}. استعد للتقدم بهدوء.`,
                `لقد اجتزت المستوى ${currentLevel} بنجاح، جسدك يستجيب بشكل رائع للتعافي.`,
                `عظيم! أنهيت المستوى ${currentLevel}. خذ نفساً عميقاً للبدء بالمستوى التالي.`
            ];
            speak(rehabPhrases[Math.floor(Math.random() * rehabPhrases.length)]);
            const tm = setTimeout(() => {
                setCurrentLevel(prev => prev + 1);
                setElapsedSeconds(0);
                setEngineState('active');
            }, 6000);
            return () => clearTimeout(tm);
        } else if (engineState === 'completed') {
            playVictoryChime();
            speak("عمل ممتاز وراقي! حركتك تحسنت بشكل ممتاز، استمر على هذا المنوال الهادئ.");
        }
    }, [engineState, activeEx, currentLevel]);

    // Timer logic if active
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (engineState === 'active' && !isPaused) {
            timer = setInterval(() => {
                setElapsedSeconds(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [engineState, isPaused]);

    useEffect(() => {
        if ('speechSynthesis' in window) {
            if (isPaused) {
                window.speechSynthesis.pause();
            } else {
                window.speechSynthesis.resume();
            }
        }
    }, [isPaused]);

    // Dynamic Scaling Computations
    const baseDuration = activeEx?.durationSeconds || 60;
    const currentScaledDuration = baseDuration + ((currentLevel - 1) * 15);

    const baseRepsStr = activeEx?.reps || '10 تكرارات';
    const currentScaledReps = baseRepsStr.replace(/\d+/, (match) => String(parseInt(match) + ((currentLevel - 1) * 2)));

    // Handle auto-finish for timed exercises
    useEffect(() => {
        if (engineState === 'active' && activeEx?.type === 'timed') {
            if (elapsedSeconds >= currentScaledDuration) {
                handleLevelComplete();
            }
        }
    }, [elapsedSeconds, engineState, activeEx, currentScaledDuration]);

    const handleLevelComplete = async () => {
        if (currentLevel < 5) {
            setEngineState('level_transition');
        } else {
            try {
                const userId = localStorage.getItem('haraka_user_id') || 'dev-student-123';
                const durationMins = Math.max(1, Math.round(elapsedSeconds / 60));
                await activityService.completeSession(userId, `rehab-${activeEx?.id}`, durationMins, 50 * 5);
            } catch (error) {
                console.error(error);
            }
            setEngineState('completed');
        }
    };

    if (!activeEx) return null;

    const remainingTime = activeEx.type === 'timed'
        ? Math.max(0, currentScaledDuration - elapsedSeconds) 
        : null;

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="w-full relative rounded-[2.5rem] overflow-hidden min-h-[700px] bg-slate-900 border border-blue-500/20 shadow-2xl flex flex-col font-cairo"
        >
            {/* Cinematic Background Gradient specific to Rehab (Calming Blues and Teals) */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-slate-900 to-teal-900/30 font-sans pointer-events-none" />

            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
                <button 
                    onClick={() => {
                        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                        onClose();
                    }} 
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-500/10 hover:bg-red-500/20 transition-all text-red-400 border border-red-500/20 shadow-lg group backdrop-blur-md"
                >
                    <span className="font-bold text-sm">إنهاء الجلسة</span>
                    <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </button>
                <div className="text-left flex flex-col items-start bg-slate-900/50 px-6 py-2 rounded-2xl backdrop-blur-xl border border-white/5">
                    <p className="text-blue-400 font-bold uppercase tracking-wider text-xs mb-1">العيادة الحركية 💙 - المستوى {currentLevel}/5</p>
                    <h2 className="text-xl font-black text-white">{programTitle}</h2>
                </div>
            </div>

            {/* Main Surface */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 mt-24 relative z-10 w-full max-w-4xl mx-auto">
                <AnimatePresence mode="wait">
                    
                    {/* Intro State */}
                    {engineState === 'intro' && (
                        <motion.div 
                            key="intro"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20, transition: { duration: 0.5 } }}
                            className="w-full text-center flex flex-col items-center"
                        >
                            <div className="w-24 h-24 rounded-[2rem] bg-blue-500/10 border-2 border-blue-500/30 flex items-center justify-center mb-8 drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                                <Heart className="w-10 h-10 text-blue-400" />
                            </div>
                            
                            <h1 className="text-6xl md:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-lg">{activeEx.name}</h1>
                            <p className="text-3xl md:text-4xl text-blue-200/90 font-black max-w-2xl leading-relaxed mb-12 drop-shadow-md">"{activeEx.introMessage}"</p>

                            <button 
                                onClick={() => setEngineState('active')}
                                className="px-12 py-6 rounded-3xl bg-blue-600 hover:bg-blue-500 text-white font-black text-3xl shadow-[0_0_40px_rgba(37,99,235,0.4)] transition-all hover:scale-105 active:scale-95 flex items-center gap-4"
                            >
                                <Sparkles className="w-6 h-6" />
                                ابدأ الجلسة العلاجية
                            </button>
                        </motion.div>
                    )}

                    {/* Active State */}
                    {engineState === 'active' && (
                        <motion.div 
                            key="active"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } }}
                            exit={{ opacity: 0 }}
                            className="w-full flex flex-col items-center"
                        >
                            {/* Critical Therapeutic Warnings (Always Visible as requested) */}
                            <div className="flex flex-wrap gap-3 md:gap-6 justify-center mb-10 w-full">
                                <div className="bg-red-500/10 text-red-400 px-6 py-4 rounded-2xl border-2 border-red-500/20 text-lg md:text-2xl font-black flex items-center gap-3 shadow-lg backdrop-blur-md">
                                    <AlertTriangle className="w-8 h-8"/> توقف إذا شعرت بألم
                                </div>
                                <div className="bg-blue-500/10 text-blue-300 px-6 py-4 rounded-2xl border-2 border-blue-500/20 text-lg md:text-2xl font-black flex items-center gap-3 shadow-lg backdrop-blur-md">
                                    <Activity className="w-8 h-8"/> تحرك ببطء شديد
                                </div>
                                <div className="bg-emerald-500/10 text-emerald-400 px-6 py-4 rounded-2xl border-2 border-emerald-500/20 text-lg md:text-2xl font-black flex items-center gap-3 shadow-lg backdrop-blur-md">
                                    <CheckCircle className="w-8 h-8"/> الجودة أهم من السرعة
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full mb-12 items-center">
                                {/* Instructions Column */}
                                <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[2rem] backdrop-blur-sm order-2 md:order-1">
                                    <h3 className="text-3xl font-black text-white/90 mb-8 flex items-center gap-3 border-b border-white/10 pb-6">
                                        <Info className="w-8 h-8 text-blue-400" /> كيفية الأداء
                                    </h3>
                                    <ul className="space-y-6">
                                        {activeEx.instructions.map((inst, idx) => (
                                            <motion.li 
                                                key={idx}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.5 + Math.min(idx * 0.5, 2) }}
                                                className="flex items-start gap-5 text-white text-2xl md:text-3xl font-black font-sans leading-relaxed"
                                            >
                                                <span className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30 text-xl font-black shadow-inner">
                                                    {idx + 1}
                                                </span>
                                                <span className="pt-1 select-none">{inst}</span>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Calming Tracker Column */}
                                <div className="flex flex-col items-center justify-center order-1 md:order-2">
                                    <div className="relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80 mb-6">
                                        {/* Soothing breathing ring animation */}
                                        <motion.div 
                                            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                            className="absolute inset-0 rounded-full bg-blue-500/20 blur-3xl"
                                        />
                                        <div className="absolute inset-4 rounded-full border-4 border-dashed border-white/10 animate-[spin_30s_linear_infinite]" />
                                        
                                        <div className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-slate-900 border border-blue-500/30 shadow-[inset_0_0_40px_rgba(59,130,246,0.1)] flex items-center justify-center flex-col z-10 backdrop-blur-xl">
                                            {activeEx.type === 'timed' && remainingTime !== null ? (
                                                <>
                                                    <span className="text-white/40 font-black uppercase tracking-widest text-lg mb-2">المتبقي</span>
                                                    <span className="text-7xl md:text-8xl font-black text-white drop-shadow-2xl">{remainingTime}</span>
                                                </>
                                            ) : (
                                                <div className="text-center px-4">
                                                    <span className="text-white/40 font-black uppercase tracking-widest text-lg block mb-3">الكمية</span>
                                                    <span className="text-4xl md:text-5xl font-black text-blue-300 drop-shadow-2xl leading-tight block px-4">{currentScaledReps}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <button 
                                        onClick={handleLevelComplete}
                                        className="px-10 py-5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black text-2xl md:text-3xl border border-white/20 transition-all backdrop-blur-md shadow-xl mt-8"
                                    >
                                        إتمام المستوى {currentLevel} ✅
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Level Transition State */}
                    {engineState === 'level_transition' && (
                        <motion.div 
                            key="transition"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full flex flex-col items-center justify-center min-h-[500px]"
                        >
                            <div className="w-32 h-32 rounded-full bg-blue-500/20 border-4 border-blue-400 flex items-center justify-center mb-8 animate-pulse shadow-[0_0_50px_rgba(59,130,246,0.4)]">
                                <Sparkles className="w-16 h-16 text-blue-300" />
                            </div>
                            <h2 className="text-6xl md:text-7xl font-black text-white mb-6 drop-shadow-xl">أحسنت!</h2>
                            <p className="text-3xl font-black text-blue-200">اكتمل المستوى {currentLevel}</p>
                            <p className="text-2xl font-bold text-white/50 mt-6 animate-pulse">يتم تجهيز المستوى التالي...</p>
                        </motion.div>
                    )}

                    {/* Completed State (Smart Humane System) */}
                    {engineState === 'completed' && (
                        <motion.div 
                            key="completed"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full max-w-2xl text-center bg-slate-800/80 border border-blue-500/20 p-10 md:p-14 rounded-[3rem] backdrop-blur-2xl shadow-2xl"
                        >
                            <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-4 border-emerald-500/50 flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                                <Heart className="w-12 h-12 text-emerald-400" />
                            </div>
                            
                            <h2 className="text-5xl md:text-6xl font-black text-white mb-10 drop-shadow-lg">عمل مذهل وراقي! 🎉</h2>
                            
                            {/* Smart Feedback as requested by user */}
                            <div className="bg-black/30 p-8 rounded-3xl mb-10 border border-white/10 space-y-6 shadow-inner">
                                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                                    <span className="text-4xl">📊</span>
                                    <p className="text-2xl md:text-3xl font-black text-blue-200 leading-snug">تحليل: حركتك تحسنت بشكل ممتاز 👏، استمر على هذا المنوال الهادئ.</p>
                                </div>
                                <div className="w-full h-px bg-white/20 my-2" />
                                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                                    <span className="text-4xl">🎯</span>
                                    <p className="text-2xl md:text-3xl font-black text-emerald-300 leading-snug">اقتراح: سنعطيك تمارين مشابهة غداً لضمان استقرار المفصل وتقويته.</p>
                                </div>
                            </div>

                            <button 
                                onClick={onClose}
                                className="w-full py-6 rounded-3xl bg-gradient-to-l from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-black text-3xl shadow-[0_0_40px_rgba(37,99,235,0.4)] transition-all hover:scale-105 active:scale-95 flex justify-center items-center gap-3"
                            >
                                <CheckCircle className="w-8 h-8" /> إتمام التدريب
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};
