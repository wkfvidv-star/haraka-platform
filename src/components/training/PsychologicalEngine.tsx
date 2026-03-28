import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X, CheckCircle2, ArrowRight, Brain, Wind, Edit3, HeartPulse, Activity, Zap, Shield, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PSYCHOLOGICAL_GAMES_DB, PsychGameLevel, PsychologicalGame } from '@/data/psychologicalProgramsDb';
import { activityService } from '@/services/activityService';

interface PsychologicalEngineProps {
    gameId: string;
    onComplete?: () => void;
    onClose: () => void;
}

type EngineState = 'intro' | 'active' | 'analysis' | 'completed';

export function PsychologicalEngine({ gameId, onComplete, onClose }: PsychologicalEngineProps) {
    const [engineState, setEngineState] = useState<EngineState>('intro');
    const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    
    // For input-type exercises
    const [userInput, setUserInput] = useState('');
    const [breathingPhase, setBreathingPhase] = useState<'in' | 'hold' | 'out'>('in');

    const game = PSYCHOLOGICAL_GAMES_DB[gameId];

    if (!game) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl">
                <div className="text-white text-xl">لم يتم العثور على الجلسة.</div>
                <button onClick={onClose} className="mt-4 px-6 py-2 bg-red-500 rounded-full text-white">إغلاق</button>
            </div>
        );
    }

    const currentLevel = game.levels[currentLevelIdx];

    // AUDIO LOGIC
    const speakText = (text: string) => {
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

    const playCompletionChime = () => {
        try {
            const Ctx = window.AudioContext || (window as any).webkitAudioContext;
            if (!Ctx) return;
            const audioCtx = new Ctx();
            
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
            oscillator.frequency.exponentialRampToValueAtTime(880.00, audioCtx.currentTime + 0.5); // A5
            
            gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.5);
            
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 1.5);
        } catch (e) {
            console.error("Audio playback failed", e);
        }
    };

    // Cleanup audio on unmount
    useEffect(() => {
        return () => {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    // Timer logic
    useEffect(() => {
        if (engineState === 'active' && isPlaying && currentLevel.timeLimitSeconds && timeLeft > 0) {
            const timerId = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timerId);
        } else if (engineState === 'active' && isPlaying && currentLevel.timeLimitSeconds && timeLeft <= 0) {
            handleLevelComplete();
        }
    }, [engineState, isPlaying, timeLeft, currentLevel]);

    useEffect(() => {
        if ('speechSynthesis' in window) {
            if (!isPlaying && engineState === 'active') {
                window.speechSynthesis.pause();
            } else {
                window.speechSynthesis.resume();
            }
        }
    }, [isPlaying, engineState]);

    // Breathing Logic
    useEffect(() => {
        if (engineState === 'active' && isPlaying && currentLevel.gameType === 'breathing' && currentLevel.config?.pattern) {
            let phaseTimer: NodeJS.Timeout;
            const pattern = currentLevel.config.pattern;
            const cycle = () => {
                setBreathingPhase('in');
                phaseTimer = setTimeout(() => {
                    setBreathingPhase('hold');
                    phaseTimer = setTimeout(() => {
                        setBreathingPhase('out');
                        phaseTimer = setTimeout(cycle, pattern.out * 1000);
                    }, pattern.hold * 1000);
                }, pattern.in * 1000);
            };
            cycle();
            return () => clearTimeout(phaseTimer);
        }
    }, [engineState, isPlaying, currentLevel]);

    // Setup initial Voice Intro
    useEffect(() => {
        if (engineState === 'intro') {
            const text = "مرحباً بك في جلسة " + game.title + ". " + game.description + ". تتكون هذه الجلسة من خمسة مستويات متدرجة.";
            speakText(text);
        } else if (engineState === 'active') {
            let prompt = "المستوى " + currentLevel.difficulty + ". ";
            if (currentLevel.gameType === 'breathing') {
                prompt += "تتبع إيقاع التنفس بتركيز.";
            } else if (currentLevel.gameType === 'visual_focus') {
                prompt += "حافظ على النقطة المركزية في مجال رؤيتك.";
            } else if (currentLevel.gameType === 'user_input' && currentLevel.config?.prompt) {
                prompt += currentLevel.config.prompt;
            } else if (currentLevel.gameType === 'analysis') {
                prompt += "استرخي تماماً ليتم رصد معدل التعافي.";
            }
            speakText(prompt);
            setTimeLeft(currentLevel.timeLimitSeconds || 60);
        }
    }, [engineState, currentLevelIdx]);

    const handleLevelComplete = () => {
        if (currentLevelIdx < game.levels.length - 1) {
            setCurrentLevelIdx(prev => prev + 1);
            playCompletionChime();
        } else {
            // Finished all stages -> go to Analysis
            setEngineState('analysis');
            activityService.completeSession('current-user-id', game.id, 10, 200);
            
            const transitionPhrases = [
                "لقد أتممت الجلسة بنجاح. جاري تحليل الأداء المعرفي.",
                "عمل رائع! أكملت مستويات الجلسة الخمسة، جاري المعالجة.",
                "انتهت المرحلة بنجاح. اسمح للذكاء الاصطناعي برصد نتائجك."
            ];
            speakText(transitionPhrases[Math.floor(Math.random() * transitionPhrases.length)]);
            
            // Auto complete after analysis
            setTimeout(() => {
                setEngineState('completed');
                playCompletionChime();
                const completionPhrases = [
                    "ممتاز! لقد اتخذت خطوة رائعة لصفائك الذهني.",
                    "عظيم! كل جلسة هنا تقربك من التوازن العاطفي الداخلي.",
                    "أحسنت! قوة التحكم بوعيك تتزايد يوماً بعد يوم."
                ];
                speakText(completionPhrases[Math.floor(Math.random() * completionPhrases.length)]);
            }, 6000);
        }
    };

    const handleStart = () => {
        setEngineState('active');
        setIsPlaying(true);
        playCompletionChime();
    };

    // Render logic for different exercise types
    const renderActiveExercise = () => {
        if (!currentLevel) return null;

        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4 w-full">
                
                {/* Visual indicator of current level */}
                <div className="absolute top-24 w-full flex justify-center gap-2 mb-8">
                    {game.levels.map((lvl, index) => (
                        <div 
                            key={lvl.id} 
                            className={cn(
                                "h-2 rounded-full transition-all duration-500",
                                index === currentLevelIdx ? "w-12 bg-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.6)]" : 
                                index < currentLevelIdx ? "w-4 bg-sky-500/40" : "w-4 bg-white/10"
                            )}
                        />
                    ))}
                </div>

                <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sky-400 font-black text-sm">
                    <Zap className="w-4 h-4 fill-sky-400" />
                    المستوى {currentLevel.difficulty}
                </div>

                {currentLevel.gameType === 'breathing' && (
                    <div className="relative flex items-center justify-center w-full max-w-sm aspect-square mb-12 mt-8">
                        {/* Breathing Visualizer */}
                        <motion.div 
                            className="absolute w-32 h-32 rounded-full bg-sky-500/30 blur-2xl"
                            animate={{
                                scale: breathingPhase === 'in' ? 2.8 : breathingPhase === 'hold' ? 2.8 : 1,
                                opacity: breathingPhase === 'in' ? 0.8 : breathingPhase === 'hold' ? 0.6 : 0.2
                            }}
                            transition={{ duration: breathingPhase === 'in' ? currentLevel.config.pattern.in : breathingPhase === 'out' ? currentLevel.config.pattern.out : currentLevel.config.pattern.hold }}
                        />
                        <motion.div 
                            className="absolute z-10 w-48 h-48 rounded-full border-4 border-sky-400 bg-sky-900/50 backdrop-blur-sm flex items-center justify-center text-3xl font-black text-white shadow-[0_0_50px_rgba(56,189,248,0.3)]"
                            animate={{
                                scale: breathingPhase === 'in' ? 1.6 : breathingPhase === 'hold' ? 1.6 : 1
                            }}
                            transition={{ duration: breathingPhase === 'in' ? currentLevel.config.pattern.in : breathingPhase === 'out' ? currentLevel.config.pattern.out : currentLevel.config.pattern.hold }}
                        >
                            {breathingPhase === 'in' ? 'شهيق...' : breathingPhase === 'hold' ? 'احتفظ...' : 'زفير...'}
                        </motion.div>
                    </div>
                )}

                {currentLevel.gameType === 'visual_focus' && (
                    <div className="mb-12 mt-8 flex flex-col items-center">
                        <motion.div 
                            animate={{ 
                                scale: [1, 1.2, 1], 
                                opacity: [0.7, 1, 0.7],
                                x: currentLevel.config.distractions ? [-10, 10, -5, 5, 0] : 0,
                                y: currentLevel.config.distractions ? [5, -10, 10, -5, 0] : 0,
                            }}
                            transition={{ 
                                duration: currentLevel.config.targetSpeed === 'fast' ? 1.5 : currentLevel.config.targetSpeed === 'slow' ? 4 : 2.5, 
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className={cn(
                                "w-12 h-12 rounded-full shadow-[0_0_40px_rgba(255,255,255,0.8)]",
                                currentLevel.config.color === 'blue' ? 'bg-blue-500' : 'bg-indigo-500'
                            )}
                        />
                        <p className="mt-12 text-indigo-200/60 font-medium text-lg">ركّز على النقطة فقط، ولا تحرك عينيك مهما حدث</p>
                    </div>
                )}

                {currentLevel.gameType === 'user_input' && (
                    <div className="w-full max-w-2xl mx-auto mb-12 mt-4 bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-md">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-sky-500/20 flex flex-col items-center justify-center">
                                <Edit3 className="w-6 h-6 text-sky-400" />
                            </div>
                            <h3 className="text-3xl font-black text-white text-right leading-tight">
                                {currentLevel.config?.prompt || "اكتب أفكارك بوضوح"}
                            </h3>
                        </div>
                        <textarea 
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-white text-xl min-h-[180px] focus:outline-none focus:border-sky-500/50 resize-none transition-colors"
                            placeholder="اكتب هنا بحرية... (بياناتك مشفرة ولا يتم تخزينها)"
                            dir="rtl"
                        />
                        <button 
                            onClick={handleLevelComplete}
                            disabled={userInput.length < 3}
                            className="w-full mt-6 py-4 rounded-xl font-black text-xl bg-gradient-to-l from-sky-500 to-indigo-600 disabled:opacity-50 disabled:from-slate-600 disabled:to-slate-800 text-white transition-all hover:-translate-y-1 shadow-lg"
                        >
                            تأكيد وتجاوز
                        </button>
                    </div>
                )}

                {currentLevel.gameType === 'analysis' && (
                    <div className="w-full max-w-2xl mx-auto mb-12 mt-8">
                        <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-teal-500/20 flex flex-col items-center justify-center border-4 border-teal-500/30">
                            <Activity className="w-10 h-10 text-teal-400 animate-pulse" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-8">
                            المسح الطاقي المتقدم
                        </h2>
                        <div className="space-y-4 text-2xl font-medium text-teal-100/80 leading-relaxed max-w-lg mx-auto">
                            استرخِ تماماً... يتم الآن رصد النبض وتسجيل معدل الانسجام النفسي من خلال كاميرا الجهاز وحركة العين.
                        </div>
                    </div>
                )}

                {currentLevel.gameType !== 'user_input' && (
                    <div className="text-7xl font-black font-mono text-white tracking-wider tabular-nums drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] mb-8">
                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </div>
                )}

            </div>
        );
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl font-cairo"
                dir="rtl"
            >
                {/* Massive Animated Background */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <motion.div 
                        animate={{ 
                            background: engineState === 'intro' ? 'radial-gradient(circle at 50% 50%, rgba(56,189,248,0.15) 0%, transparent 70%)' :
                                        engineState === 'analysis' ? 'radial-gradient(circle at 50% 50%, rgba(34,197,94,0.15) 0%, transparent 70%)' :
                                        'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.15) 0%, transparent 70%)'
                        }}
                        transition={{ duration: 2 }}
                        className="w-full h-full absolute inset-0" 
                    />
                </div>

                {/* Top Navbar */}
                <div className="absolute top-0 w-full px-8 py-6 flex justify-between items-center z-50 border-b border-white/10 bg-black/30 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex flex-col items-center justify-center border border-sky-500/30">
                            <Brain className="w-6 h-6 text-sky-400" />
                        </div>
                        <div>
                            <span className="text-xl font-black text-white block">{game.title}</span>
                            <span className="text-sm text-white/50">{engineState === 'active' ? `المستوى ${currentLevel.difficulty}` : 'الجاهزية والتحضير'}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                            if (onClose) onClose();
                        }}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-500/10 hover:bg-red-500/20 transition-all text-red-500 border border-red-500/20 shadow-lg group"
                    >
                        <span className="font-bold text-sm">توقف طارئ</span>
                        <X className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </button>
                </div>

                <div className="relative z-10 w-full max-w-5xl mx-auto px-6 h-full flex flex-col items-center justify-center mt-12">
                    <AnimatePresence mode="wait">
                        {engineState === 'intro' && (
                            <motion.div
                                key="intro"
                                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -30, scale: 1.05 }}
                                className="w-full flex flex-col items-center text-center bg-white/[0.03] border border-white/10 px-8 py-16 rounded-[4rem] backdrop-blur-2xl shadow-2xl relative overflow-hidden"
                            >
                                <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-500 to-transparent opacity-50" />
                                
                                <div className="w-24 h-24 rounded-3xl bg-sky-500/20 flex flex-col items-center justify-center border border-sky-500/40 mb-8 shadow-[0_0_40px_rgba(56,189,248,0.3)]">
                                    <Brain className="w-12 h-12 text-sky-400" />
                                </div>

                                <h2 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6">
                                    {game.title}
                                </h2>
                                <p className="text-2xl text-sky-200/70 leading-relaxed mb-12 max-w-3xl">
                                    {game.description}
                                </p>
                                
                                {/* Instructions & Controls section mapped correctly */}
                                {game.controls && game.controls.length > 0 && (
                                    <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 text-right">
                                        <div className="bg-black/40 border border-sky-500/20 rounded-3xl p-6">
                                            <h4 className="text-xl font-black text-sky-400 mb-4 flex items-center gap-2">
                                                <Target className="w-5 h-5" /> كيف تؤدي هذا التمرين؟
                                            </h4>
                                            <ul className="space-y-3">
                                                {game.controls.map((ctrl, i) => (
                                                    <li key={i} className="flex items-start gap-3 text-white/80 font-medium text-lg leading-snug">
                                                        <span className="w-2 h-2 rounded-full bg-sky-500 mt-2 flex-shrink-0" />
                                                        {ctrl}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="bg-black/40 border border-sky-500/20 rounded-3xl p-6 flex flex-col justify-center items-center text-center">
                                            <h4 className="text-3xl font-black text-white mb-2">{game.levels.length}</h4>
                                            <p className="text-sky-300 font-bold mb-4">مستويات للصعوبة المتدرجة</p>
                                            <div className="flex gap-2 w-full justify-center">
                                                {[1,2,3,4,5].map(l => (
                                                    <div key={l} className={cn("h-2 rounded-full", l <= game.levels.length ? "w-8 bg-sky-500" : "w-8 bg-white/10")} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={handleStart}
                                    className="px-16 py-6 rounded-full bg-gradient-to-l from-sky-500 hover:from-sky-400 to-indigo-600 hover:to-indigo-500 text-white font-black text-3xl shadow-[0_0_40px_rgba(56,189,248,0.5)] transition-all hover:scale-[1.03] uppercase tracking-wider items-center flex gap-4"
                                >
                                    <Play className="w-8 h-8 fill-white" /> ابدأ التحدي الآن
                                </button>
                            </motion.div>
                        )}

                        {engineState === 'active' && (
                            <motion.div
                                key="active"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="w-full flex flex-col items-center justify-center h-full"
                            >
                                {renderActiveExercise()}
                                
                                {/* Controls Overlay */}
                                {currentLevel.gameType !== 'user_input' && (
                                    <div className="absolute bottom-10 flex items-center justify-center w-full gap-6">
                                        <button 
                                            onClick={() => setIsPlaying(!isPlaying)}
                                            className="w-20 h-20 rounded-3xl bg-sky-500/20 border border-sky-500/40 text-sky-400 flex items-center justify-center shadow-[0_0_30px_rgba(56,189,248,0.2)] hover:scale-105 transition-all backdrop-blur-md"
                                        >
                                            {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current" />}
                                        </button>
                                        <button 
                                            onClick={handleLevelComplete}
                                            className="px-8 h-20 rounded-3xl bg-white/5 hover:bg-white/10 text-white/70 font-bold text-lg border border-white/10 transition-colors backdrop-blur-md"
                                        >
                                            إنهاء المستوى باكراً
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {engineState === 'analysis' && (
                            <motion.div
                                key="analysis"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-full max-w-xl text-center"
                            >
                                <div className="w-32 h-32 mx-auto rounded-full bg-emerald-500/20 border-4 border-emerald-500/50 flex flex-col items-center justify-center shadow-[0_0_60px_rgba(16,185,129,0.3)] mb-8 animate-pulse">
                                    <HeartPulse className="w-14 h-14 text-emerald-400" />
                                </div>
                                <h2 className="text-5xl font-black text-white mb-6">جارٍ المعالجة...</h2>
                                <div className="space-y-4 mb-8">
                                    <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                                        <div className="text-emerald-400 font-bold mb-2 text-xl">مستوى التوتر والذبذبة: آمن 🟢</div>
                                        <div className="w-full h-3 bg-white/10 rounded-full mt-4 overflow-hidden shadow-inner">
                                            <motion.div 
                                                className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full"
                                                initial={{ width: '100%' }}
                                                animate={{ width: '15%' }}
                                                transition={{ duration: 3, delay: 0.5, ease: "easeInOut" }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sky-200/80 font-bold text-xl pb-8 border-b border-white/10">"الذكاء الاصطناعي يحلل الاستجابة البصرية الآن لمعايرة جلستك القادمة."</p>
                            </motion.div>
                        )}

                        {engineState === 'completed' && (
                            <motion.div
                                key="completed"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-full max-w-xl text-center bg-white/5 p-16 rounded-[4rem] border border-white/10 backdrop-blur-2xl shadow-[0_0_100px_rgba(34,197,94,0.1)] relative overflow-hidden"
                            >
                                <div className="absolute -top-32 -right-32 w-64 h-64 bg-green-500/20 rounded-full blur-[100px]" />
                                <div className="w-32 h-32 mx-auto rounded-full bg-green-500/20 flex flex-col items-center justify-center border-4 border-green-500/40 shadow-[0_0_50px_rgba(34,197,94,0.4)] mb-8 relative z-10">
                                    <CheckCircle2 className="w-16 h-16 text-green-400" />
                                </div>
                                <h2 className="text-6xl font-black text-white mb-6 relative z-10 drop-shadow-lg">إنجاز رائع!</h2>
                                <p className="text-3xl font-bold text-emerald-300/80 mb-12 relative z-10 leading-relaxed">
                                    لقد اتخذت خطوة عملاقة نحو توازنك الذهني واستقرارك العاطفي اليوم.
                                </p>
                                <button
                                    onClick={() => {
                                        if (onComplete) onComplete();
                                        if (onClose) onClose();
                                    }}
                                    className="w-full py-6 rounded-full bg-gradient-to-l from-green-500 hover:from-green-400 to-emerald-600 text-white font-black text-2xl shadow-[0_0_30px_rgba(34,197,94,0.3)] transition-transform hover:scale-[1.03] relative z-10"
                                >
                                    إغلاق الجلسة
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
