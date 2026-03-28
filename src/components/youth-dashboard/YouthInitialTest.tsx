import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Brain, Zap, Target, Timer, Trophy, ArrowRight, Play } from 'lucide-react';

export interface TestResult {
    score: number;
    reactionTime: number; // in ms
}

interface YouthInitialTestProps {
    onComplete: (data: TestResult) => void;
}

export default function YouthInitialTest({ onComplete }: YouthInitialTestProps) {
    const [phase, setPhase] = useState<'intro' | 'wait' | 'click' | 'result'>('intro');
    const [reactionTimes, setReactionTimes] = useState<number[]>([]);
    const [attemptsLeft, setAttemptsLeft] = useState(3);
    const [startTime, setStartTime] = useState<number>(0);
    const [targetPos, setTargetPos] = useState({ x: 50, y: 50 });
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const startTest = () => {
        setPhase('wait');
        setAttemptsLeft(3);
        setReactionTimes([]);
        scheduleNextTarget();
    };

    const scheduleNextTarget = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        // Random wait between 1.5s to 3.5s
        const waitTime = Math.random() * 2000 + 1500;
        timeoutRef.current = setTimeout(() => {
            // Pick random position
            setTargetPos({
                x: Math.random() * 80 + 10, // 10% to 90%
                y: Math.random() * 80 + 10
            });
            setStartTime(performance.now());
            setPhase('click');
        }, waitTime);
    };

    const handleTargetClick = () => {
        if (phase !== 'click') return; // User clicked too early or wrong time
        
        const endTime = performance.now();
        const reactionTime = endTime - startTime;
        const newTimes = [...reactionTimes, reactionTime];
        setReactionTimes(newTimes);
        
        const remaining = attemptsLeft - 1;
        setAttemptsLeft(remaining);

        if (remaining > 0) {
            setPhase('wait');
            scheduleNextTarget();
        } else {
            finishTest(newTimes);
        }
    };

    const handleEarlyClick = () => {
        if (phase === 'wait') {
            // User clicked before target appeared
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            alert('لقد نقرت مبكراً! تحلى بالصبر.');
            scheduleNextTarget();
        }
    };

    const finishTest = (times: number[]) => {
        setPhase('result');
        setIsAnalyzing(true);
        setTimeout(() => {
            setIsAnalyzing(false);
        }, 2500);
    };

    const getFinalResult = (): TestResult => {
        const avg = reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length;
        // Basic scoring: 200ms = 99, 400ms = 70, 600ms = 40
        let score = Math.max(10, Math.min(99, 100 - ((avg - 200) / 5)));
        return { score: Math.round(score), reactionTime: Math.round(avg) };
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const slideVariants = {
        enter: { opacity: 0, y: 20 },
        center: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden font-arabic" dir="rtl">
            {/* Background effects */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <Card className="bg-white/90 backdrop-blur-xl border-slate-200/60 shadow-2xl rounded-[3rem] overflow-hidden relative p-4 lg:p-6 w-full max-w-3xl z-10 flex flex-col items-center justify-center min-h-[500px]">
                
                <AnimatePresence mode="wait">
                    
                    {phase === 'intro' && (
                        <motion.div key="intro" variants={slideVariants} initial="enter" animate="center" exit="exit" className="text-center space-y-6 p-8">
                            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl mx-auto border-4 border-white">
                                <Brain className="w-12 h-12 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 tracking-tight">اختبار التركيز وسرعة البديهة</h1>
                                <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-lg mx-auto">
                                    لنقم بقياس استجابتك العصبية الأساسية لبناء خطتك التدريبية.
                                    <br />ستظهر الدائرة البرتقالية فجأة... انقر عليها بأسرع ما يمكن!
                                </p>
                            </div>
                            <Button 
                                onClick={startTest}
                                className="h-14 px-10 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-lg font-bold shadow-xl shadow-slate-900/20 gap-2 w-full sm:w-auto mt-4"
                            >
                                <Play className="w-5 h-5 fill-current" />
                                أبدأ الاختبار الآن
                            </Button>
                        </motion.div>
                    )}

                    {(phase === 'wait' || phase === 'click') && (
                        <motion.div 
                            key="test" 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            className="w-full h-[400px] relative bg-slate-100 rounded-[2rem] border-2 border-slate-200 overflow-hidden cursor-crosshair shadow-inner"
                            onClick={handleEarlyClick}
                        >
                            <div className="absolute top-4 right-6 text-sm font-bold text-slate-400 flex items-center gap-2">
                                <Target className="w-4 h-4" /> المحاولات المتبقية: {attemptsLeft}
                            </div>
                            
                            {phase === 'wait' && (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-black text-2xl animate-pulse">
                                    استعد...
                                </div>
                            )}

                            {phase === 'click' && (
                                <motion.button
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute w-20 h-20 bg-gradient-to-br from-orange-400 to-rose-500 rounded-full shadow-[0_0_30px_rgba(249,115,22,0.6)] border-4 border-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                                    style={{ 
                                        top: `${targetPos.y}%`, 
                                        left: `${targetPos.x}%`,
                                        transform: 'translate(-50%, -50%)'
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleTargetClick();
                                    }}
                                >
                                    <Zap className="w-8 h-8 text-white" />
                                </motion.button>
                            )}
                        </motion.div>
                    )}

                    {phase === 'result' && (
                        <motion.div key="result" variants={slideVariants} initial="enter" animate="center" exit="exit" className="text-center w-full px-4 text-slate-900">
                            {isAnalyzing ? (
                                <div className="space-y-6 py-10">
                                    <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center shadow-xl relative mx-auto border-4 border-slate-800 animate-pulse">
                                        <Timer className="w-10 h-10 text-orange-400 animate-spin-slow" />
                                    </div>
                                    <h2 className="text-2xl font-black mb-2 tracking-tight">جاري حساب المؤشر الحيوي...</h2>
                                    <p className="text-slate-500 font-medium">نحلل سرعة استجابتك لبناء ملفك الجسدي المبدئي</p>
                                </div>
                            ) : (
                                <div className="space-y-8 max-w-md mx-auto py-4">
                                    <div className="w-24 h-24 bg-emerald-100 rounded-3xl flex items-center justify-center shadow-lg relative mx-auto border-4 border-emerald-50">
                                        <Trophy className="w-12 h-12 text-emerald-500" />
                                        <div className="absolute -bottom-3 -right-3 bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                            مكتمل
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h2 className="text-3xl font-black mb-6 tracking-tight">نتائج التقييم المبدئي</h2>
                                        
                                        <div className="grid grid-cols-2 gap-4 mb-8">
                                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                                <div className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">سرعة الاستجابة</div>
                                                <div className="text-2xl font-black text-slate-900 flex items-center justify-center gap-1">
                                                    {getFinalResult().reactionTime} <span className="text-sm font-semibold text-slate-500">ms</span>
                                                </div>
                                            </div>
                                            <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
                                                <div className="text-xs font-bold text-orange-400 mb-1 uppercase tracking-wider">مؤشر التركيز</div>
                                                <div className="text-2xl font-black text-orange-600 flex items-center justify-center gap-1">
                                                    {getFinalResult().score} <span className="text-sm font-semibold text-orange-400">/ 100</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Button 
                                        onClick={() => onComplete(getFinalResult())}
                                        className="h-14 w-full bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-lg font-bold shadow-xl shadow-slate-900/20 gap-2"
                                    >
                                        الدخول إلى المنصة
                                        <ArrowRight className="w-5 h-5 ml-1" />
                                    </Button>
                                    
                                    <Button 
                                        variant="ghost"
                                        onClick={startTest}
                                        className="text-slate-500 hover:text-slate-900 font-bold mt-2"
                                    >
                                        إعادة الاختبار
                                    </Button>
                                </div>
                            )}
                        </motion.div>
                    )}

                </AnimatePresence>
            </Card>
        </div>
    );
}
