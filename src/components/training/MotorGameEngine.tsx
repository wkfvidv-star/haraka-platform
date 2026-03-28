import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, HeartPulse, Activity, Target } from 'lucide-react';

interface MotorGameEngineProps {
    gameId: string; // 'response_speed' | 'control_accuracy' | 'advanced_balance' | 'agility_change' | 'advanced_coordination' | 'motor_anticipation'
    title: string;
    onComplete: (score: number, accuracy: number) => void;
    onClose: () => void;
}

type EngineState = 'intro' | 'level_transition' | 'active' | 'analysis' | 'completed';

export function MotorGameEngine({ gameId, title, onComplete, onClose }: MotorGameEngineProps) {
    const [engineState, setEngineState] = useState<EngineState>('intro');
    const [timeLeft, setTimeLeft] = useState(25); // 25 seconds per level
    const [currentLevel, setCurrentLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [clicks, setClicks] = useState({ total: 0, hits: 0 });

    // Game Specific States
    const [reactionTarget, setReactionTarget] = useState<{ type: 'red' | 'green' | 'up', active: boolean }>({ type: 'red', active: false });
    const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });
    const [targetPos, setTargetPos] = useState({ x: 50, y: 50 });
    const [balanceOffset, setBalanceOffset] = useState(0); // -100 to 100
    const [anticipationVisible, setAnticipationVisible] = useState(true);

    const containerRef = useRef<HTMLDivElement>(null);
    const gameLoopRef = useRef<number>(0);

    // Audio SFX
    const playSfx = (type: 'hit' | 'miss' | 'level' | 'victory') => {
        try {
            if (type === 'victory') {
                const winAudio = new Audio('https://actions.google.com/sounds/v1/crowds/battle_crowd_celebrate_shout.ogg');
                winAudio.volume = 0.4;
                winAudio.play().catch(()=>{});
                return;
            }
            if (type === 'level') {
                const lvlAudio = new Audio('https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg');
                lvlAudio.volume = 0.3;
                lvlAudio.play().catch(()=>{});
                return;
            }

            const ctx = window.AudioContext || (window as any).webkitAudioContext;
            if (!ctx) return;
            const audioCtx = new ctx();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            if (type === 'hit') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
                gain.gain.setValueAtTime(0, audioCtx.currentTime);
                gain.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
                osc.start(audioCtx.currentTime);
                osc.stop(audioCtx.currentTime + 0.2);
            } else if (type === 'miss') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(300, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.2);
                gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
                osc.start(audioCtx.currentTime);
                osc.stop(audioCtx.currentTime + 0.3);
            }
        } catch(e) {}
    };

    const registerClick = (hit: boolean) => {
        if (hit) playSfx('hit'); else playSfx('miss');
        setClicks(p => {
            const newTotal = p.total + 1;
            const newHits = p.hits + (hit ? 1 : 0);
            setAccuracy(Math.round((newHits / newTotal) * 100));
            return { total: newTotal, hits: newHits };
        });
        if (hit) setScore(s => s + (50 * currentLevel)); // Extra points for harder levels
        else setScore(s => Math.max(0, s - 20));
    };

    // Intro Voice TTS
    useEffect(() => {
        if (engineState === 'intro') {
            try {
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                const text = `أهلاً بك يا بطل في ${title}. استعد، وركز جيداً لتحقيق أعلى مستوى وأفضل أداء حركي.`;
                const utterance = new SpeechSynthesisUtterance(text);
                const voices = window.speechSynthesis.getVoices();
                const arVoice = voices.find(v => v.lang.includes('ar') || v.name.includes('Arabic') || v.name.includes('عربي'));
                if (arVoice) {
                    utterance.voice = arVoice;
                    utterance.lang = arVoice.lang;
                }
                window.speechSynthesis.speak(utterance);
            } catch(e) {}
        }
    }, [engineState, title]);

    // Main Game Loop for Movement
    useEffect(() => {
        if (engineState !== 'active') {
            if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
            return;
        }

        let lastTime = performance.now();
        const loop = (time: number) => {
            const dt = (time - lastTime) / 1000;
            lastTime = time;

            // Speed multiplier based on level
            const speedMod = 1 + ((currentLevel - 1) * 0.35);

            if (gameId === 'control_accuracy') {
                setTargetPos(prev => {
                    const nx = prev.x + (Math.sin(time / (1000 / speedMod)) * 1 * speedMod) + (Math.random() - 0.5) * 2 * speedMod;
                    const ny = prev.y + (Math.cos(time / (800 / speedMod)) * 1 * speedMod) + (Math.random() - 0.5) * 2 * speedMod;
                    return { x: Math.max(10, Math.min(90, nx)), y: Math.max(10, Math.min(90, ny)) };
                });
            } else if (gameId === 'advanced_balance') {
                setBalanceOffset(prev => {
                    const drift = (Math.random() - 0.5) * 150 * dt * speedMod;
                    const newOffset = prev + drift + (prev > 0 ? 5 * dt * speedMod : prev < 0 ? -5 * dt * speedMod : 0);
                    
                    if (Math.abs(newOffset) > 90) {
                        registerClick(false);
                        return 0;
                    }
                    return newOffset;
                });
                setScore(s => s + Math.floor(1 * speedMod));
            }

            gameLoopRef.current = requestAnimationFrame(loop);
        };
        gameLoopRef.current = requestAnimationFrame(loop);

        return () => {
             if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
        };
    }, [engineState, gameId, currentLevel]);

    // Spawner for Reaction/Agility/Anticipation Games
    useEffect(() => {
        if (engineState !== 'active') return;
        let timer: NodeJS.Timeout;

        const speedMod = Math.max(0.3, 1 - ((currentLevel - 1) * 0.15));

        const spawnEntity = () => {
            if (gameId === 'response_speed') {
                const types: ('red' | 'green' | 'up')[] = ['red', 'green', 'up'];
                setReactionTarget({ type: types[Math.floor(Math.random() * types.length)], active: true });
                timer = setTimeout(() => {
                    setReactionTarget(p => ({ ...p, active: false }));
                    timer = setTimeout(spawnEntity, (Math.random() * 1500 + 500) * speedMod);
                }, 1000 * speedMod);
            } else if (gameId === 'agility_change' || gameId === 'advanced_coordination') {
                setTargetPos({ x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 });
                timer = setTimeout(spawnEntity, (Math.random() * 2000 + 1000) * speedMod);
            } else if (gameId === 'motor_anticipation') {
                setTargetPos({ x: -10, y: 50 });
                setAnticipationVisible(true);
                let pos = -10;
                const moveTimer = setInterval(() => {
                    pos += 2 * (1 / speedMod); // Move faster if speedMod is smaller
                    setTargetPos(p => ({ ...p, x: pos }));
                    if (pos > 30 && pos < 70) setAnticipationVisible(false);
                    else setAnticipationVisible(true);
                    
                    if (pos > 100) {
                        clearInterval(moveTimer);
                        timer = setTimeout(spawnEntity, 1000 * speedMod);
                    }
                }, 50);
                return () => clearInterval(moveTimer);
            }
        };

        if (['response_speed', 'agility_change', 'advanced_coordination', 'motor_anticipation'].includes(gameId)) {
            timer = setTimeout(spawnEntity, 1000);
        }

        return () => clearTimeout(timer);
    }, [engineState, gameId, currentLevel]);

    // Timer Countdown & Level Progression
    useEffect(() => {
        if (engineState === 'active' && timeLeft > 0) {
            const tm = setInterval(() => setTimeLeft(l => l - 1), 1000);
            return () => clearInterval(tm);
        } else if (engineState === 'active' && timeLeft <= 0) {
            if (currentLevel < 5) {
                // Next level transition
                setEngineState('level_transition');
                playSfx('level');
                setTimeout(() => {
                    setCurrentLevel(l => l + 1);
                    setTimeLeft(25);
                    setEngineState('active');
                }, 3500);
            } else {
                // Game Finished
                setEngineState('analysis');
                setTimeout(() => {
                    setEngineState('completed');
                    playSfx('victory');
                    
                    // Voice Congrats (Arabic)
                    try {
                        const scoreSnapshot = score + (clicks.total > 0 ? 50 : 0);
                        const text = `ممتاز! أداء حركي استثنائي. لقد أكملت المستويات الخمسة كلها بنجاح وسجلت ${scoreSnapshot} نقطة، مبروك يا بطل!`;
                        const utterance = new SpeechSynthesisUtterance(text);
                        const voices = window.speechSynthesis.getVoices();
                        const arVoice = voices.find(v => v.lang.includes('ar') || v.name.includes('Arabic') || v.name.includes('عربي'));
                        if (arVoice) {
                            utterance.voice = arVoice;
                            utterance.lang = arVoice.lang;
                        }
                        window.speechSynthesis.speak(utterance);
                    } catch(e) {}
                }, 4000);
            }
        }
    }, [engineState, timeLeft, currentLevel, score]);

    // Handlers
    const handleGameInteraction = (e: React.MouseEvent | React.TouchEvent | KeyboardEvent) => {
        if (engineState !== 'active') return;

        if (gameId === 'response_speed') {
            // Handled via keyboard/buttons
        } else if (gameId === 'control_accuracy') {
            if ('clientX' in e && containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                setCursorPos({ x, y });
                const dist = Math.sqrt(Math.pow(x - targetPos.x, 2) + Math.pow(y - targetPos.y, 2));
                if (dist < 15) { setScore(s => s + 5); } else { setScore(s => Math.max(0, s - 1)); }
            }
        } else if (gameId === 'advanced_balance' && 'clientX' in e) {
            const isLeft = e.clientX < window.innerWidth / 2;
            setBalanceOffset(prev => prev + (isLeft ? -25 : 25));
            playSfx('hit');
        } else if (gameId === 'motor_anticipation') {
            if (targetPos.x >= 70 && targetPos.x <= 90 && !anticipationVisible) {
                registerClick(true);
            } else {
                registerClick(false);
            }
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (engineState !== 'active') return;
            if (gameId === 'response_speed' && reactionTarget.active) {
                let hit = false;
                if (e.key === 'ArrowRight' && reactionTarget.type === 'red') hit = true;
                if (e.key === 'ArrowLeft' && reactionTarget.type === 'green') hit = true;
                if (e.key === 'ArrowUp' && reactionTarget.type === 'up') hit = true;
                registerClick(hit);
                setReactionTarget(p => ({ ...p, active: false }));
            } else if (gameId === 'advanced_balance') {
                if (e.key === 'ArrowRight') setBalanceOffset(p => p + 25);
                if (e.key === 'ArrowLeft') setBalanceOffset(p => p - 25);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [engineState, gameId, reactionTarget]);

    const renderGameUI = () => {
        switch (gameId) {
            case 'response_speed':
                return (
                    <div className="w-full flex-1 flex flex-col items-center justify-center p-8">
                        <div className="absolute top-24 text-white z-10 w-full mb-12 font-black text-3xl md:text-5xl text-center shadow-2xl drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]">
                            <span className="bg-black/60 backdrop-blur-md px-8 py-4 rounded-3xl border border-white/10 inline-block leading-relaxed">أحمر ⬅️ اقفز يميناً | أخضر ⬅️ اقفز يساراً | سهم أعلى ⬅️ اقفز عالياً</span>
                        </div>
                        <AnimatePresence>
                            {reactionTarget.active && (
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    className={`w-40 h-40 rounded-3xl flex items-center justify-center text-7xl shadow-2xl ${
                                        reactionTarget.type === 'red' ? 'bg-red-500 shadow-red-500/50' :
                                        reactionTarget.type === 'green' ? 'bg-green-500 shadow-green-500/50' :
                                        'bg-blue-500 shadow-blue-500/50'
                                    }`}
                                >
                                    {reactionTarget.type === 'up' && '⬆️'}
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <div className="flex gap-4 mt-20 md:hidden z-20">
                            <button onClick={() => { if(reactionTarget.type==='green')registerClick(true); else registerClick(false); setReactionTarget(p=>({ ...p, active: false })); }} className="w-28 h-20 bg-white/10 hover:bg-white/20 active:scale-95 transition-all rounded-2xl text-xl font-bold shadow-xl border border-white/10">اقفز يساراً</button>
                            <button onClick={() => { if(reactionTarget.type==='up')registerClick(true); else registerClick(false); setReactionTarget(p=>({ ...p, active: false })); }} className="w-28 h-20 bg-white/10 hover:bg-white/20 active:scale-95 transition-all rounded-2xl text-xl font-bold shadow-xl border border-white/10">اقفز عالياً</button>
                            <button onClick={() => { if(reactionTarget.type==='red')registerClick(true); else registerClick(false); setReactionTarget(p=>({ ...p, active: false })); }} className="w-28 h-20 bg-white/10 hover:bg-white/20 active:scale-95 transition-all rounded-2xl text-xl font-bold shadow-xl border border-white/10">اقفز يميناً</button>
                        </div>
                    </div>
                );
            case 'control_accuracy':
                return (
                    <div className="w-full flex-1 relative cursor-crosshair overflow-hidden" ref={containerRef} onPointerMove={handleGameInteraction}>
                        <div className="absolute inset-0 bg-white/5" />
                        <motion.div
                            className="absolute w-20 h-20 rounded-full border-4 border-indigo-500/50 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_30px_rgba(99,102,241,0.5)]"
                            style={{ left: `${targetPos.x}%`, top: `${targetPos.y}%` }}
                        />
                        <motion.div
                            className="absolute w-6 h-6 rounded-full bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.8)] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                            style={{ left: `${cursorPos.x}%`, top: `${cursorPos.y}%` }}
                        />
                        <div className="absolute top-24 w-full text-center text-white font-black text-2xl md:text-4xl drop-shadow-[0_0_20px_rgba(0,0,0,1)] bg-black/40 py-6 backdrop-blur-md border-y border-white/5 pointer-events-none">تتبع الحلقة الزرقاء بالمؤشر باستمرار</div>
                    </div>
                );
            case 'advanced_balance':
                return (
                    <div className="w-full flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden" onClick={handleGameInteraction}>
                        <div className="absolute w-full h-1 bg-white/20 top-1/2 -translate-y-1/2" />
                        <div className="absolute w-[2px] h-[100px] bg-white/50 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2" />
                        
                        <motion.div
                            className="w-16 h-16 rounded-full bg-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.8)] absolute top-1/2 -mt-8 pointer-events-none"
                            style={{ left: `calc(50% + ${balanceOffset}%)`, x: '-50%' }}
                        />
                        <div className="absolute top-24 text-center text-white font-black text-2xl md:text-4xl w-full px-8 drop-shadow-[0_0_20px_rgba(0,0,0,1)] bg-black/40 py-6 backdrop-blur-md z-10 border-y border-white/5 pointer-events-none">
                            اضغط يميناً ويساراً لمعاكسة الانحراف والحفاظ على الكرة بالمنتصف
                        </div>
                    </div>
                );
            case 'agility_change':
            case 'advanced_coordination':
                return (
                    <div className="w-full flex-1 relative overflow-hidden" onClick={(e) => {
                        const tgt = e.target as HTMLElement;
                        if (!tgt.closest('.click-target')) {
                            registerClick(false);
                            setScore(s => Math.max(0, s - 10));
                        }
                    }}>
                        <AnimatePresence>
                            <motion.button
                                key={`${targetPos.x}-${targetPos.y}`}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                onClick={(e) => { e.stopPropagation(); registerClick(true); setTargetPos({x: -100, y: -100}) }}
                                className="click-target absolute w-16 h-16 bg-blue-500 rounded-full border-4 border-blue-300 shadow-[0_0_30px_rgba(59,130,246,0.8)] focus:outline-none -translate-x-1/2 -translate-y-1/2"
                                style={{ left: `${targetPos.x}%`, top: `${targetPos.y}%` }}
                            >
                                <Target className="w-8 h-8 text-white mx-auto" />
                            </motion.button>
                        </AnimatePresence>
                        <div className="absolute top-24 w-full text-center text-white font-black text-2xl md:text-4xl drop-shadow-[0_0_20px_rgba(0,0,0,1)] bg-black/40 py-6 backdrop-blur-md border-y border-white/5 pointer-events-none z-10">اضغط على الأهداف المنبثقة فور ظهورها وتجنب الأخطاء</div>
                    </div>
                );
            case 'motor_anticipation':
                return (
                    <div className="w-full flex-1 relative flex items-center justify-center overflow-hidden" onClick={handleGameInteraction}>
                        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-4 bg-white/5" />
                        <div className="absolute top-1/2 -translate-y-1/2 right-[10%] w-[10%] h-12 border-2 border-orange-500/20 rounded-lg" />
                        <div className="absolute top-24 w-full text-center text-white font-black text-2xl md:text-4xl drop-shadow-[0_0_20px_rgba(0,0,0,1)] bg-black/40 py-6 backdrop-blur-md border-y border-white/5 pointer-events-none z-20">اضغط الشاشة عندما تتوقع وصول الهدف المخفي للمربع يميناً</div>

                        <div className="absolute top-1/4 bottom-1/4 left-[30%] right-[30%] bg-[#0b0f19] border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl">
                            <Activity className="w-16 h-16 text-white/10" />
                        </div>

                        <div
                            className={`absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.8)] -translate-x-1/2 transition-opacity ${anticipationVisible ? 'opacity-100' : 'opacity-0'}`}
                            style={{ left: `${targetPos.x}%` }}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b0f19] font-cairo"
                dir="rtl"
            >
                {/* Navbar */}
                <div className="absolute top-0 w-full px-8 py-4 flex justify-between items-center z-50 border-b border-white/10 bg-black/40 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl md:text-2xl font-black text-white">{title}</h2>
                        {engineState === 'active' && (
                            <div className="hidden md:flex items-center gap-6 text-white bg-white/5 px-6 py-2 rounded-full border border-white/10">
                                <div className="flex gap-2">
                                  {[1,2,3,4,5].map(lvl => (
                                      <div key={lvl} className={`w-3 h-3 rounded-full ${currentLevel >= lvl ? 'bg-indigo-400' : 'bg-white/10'}`} />
                                  ))}
                                </div>
                                <div className="font-mono font-bold text-sky-400">الوقت: {timeLeft}s</div>
                                <div className="font-mono font-bold text-emerald-400">الدقة: {accuracy}%</div>
                                <div className="font-mono font-bold text-yellow-400">النقاط: {score}</div>
                            </div>
                        )}
                    </div>
                    <button onClick={onClose} className="w-12 h-12 flex items-center justify-center rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors border border-red-500/20">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {engineState === 'intro' && (
                    <motion.div className="max-w-2xl text-center p-10 bg-black/60 border border-white/20 rounded-[3rem] backdrop-blur-xl shadow-2xl drop-shadow-[0_0_40px_rgba(99,102,241,0.2)]">
                        <Activity className="w-24 h-24 text-indigo-400 mx-auto mb-6" />
                        <h1 className="text-5xl font-black text-white mb-6 tracking-tight drop-shadow-md">{title}</h1>
                        <p className="text-2xl text-indigo-200/90 mb-8 font-bold leading-relaxed drop-shadow-sm">
                            {gameId === 'response_speed' ? 'تحدي يختبر سرعة ردود أفعالك العصبية. ركز على الإشارات البصرية واستجب بأسرع ما يمكن.' :
                             gameId === 'control_accuracy' ? 'تحدي يقيس براعتك في التوافق العضلي العصبي. تتبع الهدف المتحرك بمؤشّرك بأعلى دقة ممكنة.' :
                             gameId === 'advanced_balance' ? 'اختبار يحاكي توازنك الجسدي تحت الضغط والتشويش. لمعاكسة الانحرافات المتغيرة.' :
                             gameId === 'agility_change' ? 'تحدي يحاكي الرشاقة الحركية والتغيير المفاجئ للاتجاه. لاقتناص الأهداف المنبثقة بسرعات مختلفة.' :
                             gameId === 'advanced_coordination' ? 'اختبار متقدم للتنسيق العضلي وسرعة المعالجة.' :
                             gameId === 'motor_anticipation' ? 'تحدي لتقييم قدرتك على التنبؤ الزماني والمكاني للحركة. لحساب السرعات المخفية.' :
                             'استعد لاختبار أدائك الحركي. يتكون هذا التحدي التفاعلي من 5 مستويات تتصاعد خطورتها وسرعتها.'}
                        </p>
                        
                        <div className="bg-white/10 border border-white/10 rounded-3xl p-6 text-right mb-8 shadow-inner backdrop-blur-md">
                            <h4 className="text-emerald-400 font-black text-2xl mb-4 flex items-center gap-3 drop-shadow-md">
                                <Target className="w-8 h-8" /> كيفية الأداء والتّحكم:
                            </h4>
                            <ul className="space-y-3 pr-2">
                                {(
                                    gameId === 'response_speed' ? ['إذا ظهر لون أحمر: اقفز يميناً (انقر يمين)', 'إذا ظهر لون أخضر: اقفز يساراً (انقر يسار)', 'إذا ظهر سهم أعلى: اقفز عالياً (انقر أعلى)', 'اربط حركتك الجسدية بالضغط على الأزرار للتفاعل المتكامل.'] :
                                    gameId === 'control_accuracy' ? ['اضغط باستمرار على الشاشة أو حرك مؤشر الماوس لتتبع الدائرة الزرقاء.', 'يجب إبقاء المؤشر الخاص بك داخل الحلقة المتحركة لكسب النقاط.'] :
                                    gameId === 'advanced_balance' ? ['المس الجانب الأيمن أو الأيسر من الشاشة لمعاكسة الانحراف.', 'يمكنك استخدام السهم الأيمن (➡️) والأيسر (⬅️) من لوحة المفاتيح للحفاظ على مركز الكرة.'] :
                                    gameId === 'agility_change' ? ['راقب الشاشة جيداً وانقر على الأهداف الزرقاء المنبثقة فور ظهورها.', 'تجنب النقر العشوائي في الفراغ لأن ذلك سيطرح من رصيد نقاطك.'] :
                                    gameId === 'advanced_coordination' ? ['انتبه للأهداف الحركية المعقدة والمتحركة وانقر عليها فور ظهورها.', 'تتطلب بعض الأهداف تفاعلاً متزامناً باليدين بتركيز تام.'] :
                                    gameId === 'motor_anticipation' ? ['راقب الهدف البرتقالي وهو يتحرك ثم يختفي في مساره.', 'انقر في اللحظة الزمنية الدقيقة التي تتوقع فيها وصوله إلى المربع الوهمي في أقصى اليمين.'] :
                                    ['اتبع التعليمات التي تظهر على الشاشة لكل مستوى.']
                                ).map((ctrl, i) => (
                                    <li key={i} className="text-white font-bold text-xl md:text-2xl flex items-start gap-3 drop-shadow-sm leading-relaxed">
                                        <span className="text-indigo-400 mt-1">•</span> {ctrl}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button onClick={() => setEngineState('active')} className="w-full py-5 rounded-full bg-indigo-500 hover:bg-indigo-400 text-white font-black text-2xl shadow-[0_0_40px_rgba(99,102,241,0.6)] transition-all">
                            ابدأ التحدي (5 مستويات)
                        </button>
                    </motion.div>
                )}

                {engineState === 'level_transition' && (
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center p-12 bg-indigo-500/10 border border-indigo-500/30 rounded-[3rem] backdrop-blur-xl">
                        <h2 className="text-5xl md:text-7xl font-black text-indigo-400 mb-6 tracking-wide drop-shadow-[0_0_30px_rgba(99,102,241,0.6)]">
                            المستوى {currentLevel + 1}
                        </h2>
                        <p className="text-2xl text-white/80 font-bold">تجهّز.. الصعوبة والسرعة في ازدياد!</p>
                    </motion.div>
                )}

                {engineState === 'active' && (
                    <div className="w-full h-full pt-20 pb-8 flex flex-col relative">
                        <div className="md:hidden flex items-center justify-center gap-4 text-white p-4 font-mono font-bold text-sm bg-black/20">
                            <span className="text-indigo-400">Lvl {currentLevel}</span>
                            <span className="text-sky-400">T: {timeLeft}s</span>
                            <span className="text-emerald-400">Acc: {accuracy}%</span>
                            <span className="text-yellow-400">Pts: {score}</span>
                        </div>
                        {renderGameUI()}
                    </div>
                )}

                {engineState === 'analysis' && (
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
                        <HeartPulse className="w-24 h-24 text-emerald-400 mx-auto mb-6 animate-pulse" />
                        <h2 className="text-4xl font-black text-white mb-2">جاري تحليل الأداء...</h2>
                        <p className="text-emerald-400/80 font-bold text-xl">حساب التوافق العصبي عبر المستويات الخمسة</p>
                    </motion.div>
                )}

                {engineState === 'completed' && (
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-xl w-full mx-4 bg-white/5 border border-white/10 p-10 rounded-3xl backdrop-blur-md text-center">
                        <CheckCircle2 className="w-24 h-24 text-green-400 mx-auto mb-6" />
                        <h2 className="text-5xl font-black text-white mb-6">نتائج الاختبار</h2>
                        
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
                                <div className="text-white/50 text-sm font-bold mb-1">النقاط الإجمالية</div>
                                <div className="text-4xl font-black text-yellow-400">{score + (clicks.total > 0 ? 50 : 0)}</div>
                            </div>
                            <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
                                <div className="text-white/50 text-sm font-bold mb-1">دقة التحكم</div>
                                <div className="text-4xl font-black text-emerald-400">{accuracy}%</div>
                            </div>
                        </div>

                        <button onClick={() => onComplete(score, accuracy)} className="w-full py-5 rounded-2xl bg-green-500 hover:bg-green-400 text-white font-black text-2xl shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all">
                            تسجيل التقييم
                        </button>
                    </motion.div>
                )}
            </motion.div>
        </AnimatePresence>
    );
}
