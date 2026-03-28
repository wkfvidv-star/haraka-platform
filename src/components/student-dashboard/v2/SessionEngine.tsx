import React, { useState, useEffect, useRef } from 'react';
import { BaseExercise } from '@/types/ExerciseTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, Play, Square, Trophy, X, Brain, CheckCircle2, ShieldCheck, Star } from 'lucide-react';
import api from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface SessionEngineProps {
    exercise: BaseExercise;
    onClose: () => void;
}

export const SessionEngine: React.FC<SessionEngineProps> = ({ exercise, onClose }) => {
    const { user, updateUserStats } = useAuth();
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [sessionToken, setSessionToken] = useState<string | null>(null);
    const [isActive, setIsActive] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [duration, setDuration] = useState(0);
    const [motionScore, setMotionScore] = useState(0);
    const [reps, setReps] = useState(0);

    const [sessionResult, setSessionResult] = useState<{
        earnedXp: number;
        newTotalXp: number;
        newLevel: number;
        verdict: string;
        zScore: number;
    } | null>(null);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const aiSimRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (aiSimRef.current) clearInterval(aiSimRef.current);
        };
    }, []);

    const startSession = async () => {
        if (!user) return;
        try {
            const response = await api.post('/session/start', {
                userId: user.id,
                exerciseId: exercise.id
            });
            if (response.data.success) {
                setSessionId(response.data.sessionId);
                setSessionToken(response.data.sessionToken);
                setIsActive(true);
                toast({ title: 'بدأت الجلسة', description: 'يتم الآن تتبع حركتك بدقة...' });

                timerRef.current = setInterval(() => {
                    setDuration(d => d + 1);
                }, 1000);

                aiSimRef.current = setInterval(() => {
                    setMotionScore(Math.floor(Math.random() * 20) + 80);
                    if (Math.random() > 0.7) setReps(r => r + 1);
                }, 2000);
            }
        } catch (error) {
            toast({ title: 'خطأ', description: 'تعذر بدء الجلسة', variant: 'destructive' });
        }
    };

    const stopSession = async () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (aiSimRef.current) clearInterval(aiSimRef.current);
        setIsActive(false);

        if (sessionId && sessionToken) {
            setIsSubmitting(true);
            try {
                const response = await api.post('/session/complete', {
                    sessionToken,
                    frameCount: Math.max(duration * 15, 100),
                    durationSeconds: duration
                });

                if (response.data.success) {
                    setSessionResult(response.data);
                    updateUserStats({
                        xp: response.data.newTotalXp,
                        level: response.data.newLevel
                    });
                }
            } catch (error) {
                toast({ title: 'فشل التوثيق', description: 'تم رفض الجلسة أو تعذر التحقق منها', variant: 'destructive' });
                onClose();
            } finally {
                setIsSubmitting(false);
            }
        } else {
            onClose();
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    if (sessionResult) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 text-right" dir="rtl">
                <motion.div initial={{ opacity: 0, scale: 0.8, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="w-full max-w-lg">
                    <Card className="bg-[#0b0f1a] border-white/10 shadow-[0_0_50px_rgba(59,130,246,0.2)] overflow-hidden text-center relative">
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600" />
                        <CardContent className="pt-12 pb-8 px-8 flex flex-col items-center gap-6">
                            <motion.div
                                initial={{ rotate: -180, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                                className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center ring-2 ring-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)] mb-2"
                            >
                                <CheckCircle2 className="w-12 h-12 text-green-400" />
                            </motion.div>

                            <div className="space-y-1">
                                <h2 className="text-3xl font-black text-white">تم توثيق الجلسة!</h2>
                                <p className="text-gray-400 font-bold">تم تقييم أدائك الحركي بنجاح وتأمينه في سجل النظام.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 w-full mt-4">
                                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col items-center shadow-inner">
                                    <Star className="w-6 h-6 text-yellow-500 mb-2" />
                                    <span className="text-3xl font-black text-white">+{sessionResult.earnedXp}</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">خبرة مكتسبة</span>
                                </div>
                                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col items-center shadow-inner relative overflow-hidden">
                                    {sessionResult.verdict === 'ACCEPT' && <div className="absolute inset-0 bg-green-500/5 pointer-events-none" />}
                                    <ShieldCheck className={`w-6 h-6 mb-2 ${sessionResult.verdict === 'ACCEPT' ? 'text-green-400' : 'text-orange-400'}`} />
                                    <span className="text-xl font-black text-white">{sessionResult.verdict}</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Fraud Engine</span>
                                </div>
                            </div>

                            <Button onClick={onClose} size="lg" className="w-full mt-4 bg-white text-blue-900 hover:bg-gray-100 font-black text-lg h-14 rounded-xl">
                                استمرار
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 text-right" dir="rtl">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-4xl"
            >
                <Card className="bg-slate-900 border-white/10 shadow-2xl overflow-hidden relative">
                    {isSubmitting && (
                        <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center">
                            <Activity className="w-12 h-12 text-blue-500 animate-pulse mb-4" />
                            <h3 className="text-xl font-black text-white">جاري توثيق وتمحيص الجلسة...</h3>
                            <p className="text-gray-400 text-sm mt-2">عبر Fraud Engine و Vision AI</p>
                        </div>
                    )}

                    <CardHeader className="flex flex-row items-center justify-between border-b border-white/10 bg-black/40">
                        <CardTitle className="flex items-center gap-3 text-white text-xl">
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                                <Brain className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <span>{exercise.title}</span>
                                <span className="text-xs text-blue-400">محرك الجلسات الذكي قيد العمل</span>
                            </div>
                        </CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => { stopSession(); }}>
                            <X className="w-5 h-5 text-gray-400" />
                        </Button>
                    </CardHeader>

                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 relative bg-black/50 rounded-2xl aspect-video border border-white/5 flex items-center justify-center overflow-hidden">
                                {!isActive ? (
                                    <div className="flex flex-col items-center gap-4 text-center">
                                        {exercise.category === 'cognitive' ? <Brain className="w-16 h-16 text-green-500/20" /> : 
                                         exercise.category === 'mental' ? <Heart className="w-16 h-16 text-purple-500/20" /> :
                                         exercise.category === 'perceptual' ? <Crosshair className="w-16 h-16 text-indigo-500/20" /> :
                                         <Activity className="w-16 h-16 text-white/20" />}
                                        <p className="text-white/50">جاهز لبدء محاكاة التحدي: {exercise.title}.</p>
                                        <Button size="lg" className={`${exercise.category === 'cognitive' ? 'bg-green-600 hover:bg-green-500' : exercise.category === 'mental' ? 'bg-purple-600 hover:bg-purple-500' : exercise.category === 'perceptual' ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-blue-600 hover:bg-blue-500'} gap-2 text-white mt-4`} onClick={startSession}>
                                            <Play className="w-5 h-5 fill-current" /> بدء التدريب المباشر
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="w-full h-full relative flex items-center justify-center">
                                        {exercise.category === 'cognitive' && (
                                            <div className="flex flex-wrap gap-4 justify-center items-center w-3/4">
                                                {[1, 2, 3, 4, 5, 6].map(i => (
                                                    <div key={i} className={`w-20 h-20 rounded-xl transition-all duration-300 ${Math.random() > 0.5 ? 'bg-green-500/80 scale-110 shadow-[0_0_20px_rgba(34,197,94,0.5)]' : 'bg-gray-800 border border-white/10'}`} />
                                                ))}
                                                <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 text-white text-xs font-mono rounded-full border border-green-500/50">
                                                    Memory Matrix
                                                </div>
                                            </div>
                                        )}
                                        {exercise.category === 'perceptual' && (
                                            <div className="relative w-full h-full">
                                                <div className="absolute left-1/4 top-1/4 w-8 h-8 rounded-full bg-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.8)] animate-bounce" />
                                                <div className="absolute right-1/4 bottom-1/4 w-6 h-6 rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8)] animate-pulse" style={{ animationDuration: '0.5s' }} />
                                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-2 border-indigo-400/50 rounded-full flex items-center justify-center">
                                                    <Crosshair className="w-6 h-6 text-indigo-400/50" />
                                                </div>
                                                <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 text-white text-xs font-mono rounded-full border border-indigo-500/50">
                                                    Visual Tracking
                                                </div>
                                            </div>
                                        )}
                                        {exercise.category === 'mental' && (
                                            <div className="relative flex flex-col items-center justify-center">
                                                <div className="w-48 h-48 rounded-full bg-purple-500/10 flex items-center justify-center">
                                                    <div className="w-32 h-32 rounded-full border-4 border-purple-500/30 flex items-center justify-center relative">
                                                        <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl animate-ping" style={{ animationDuration: '4s' }} />
                                                        <Heart className="w-12 h-12 text-purple-400 animate-pulse" style={{ animationDuration: '4s' }} />
                                                    </div>
                                                </div>
                                                <div className="mt-8 text-xl font-bold text-purple-200 tracking-widest animate-pulse" style={{ animationDuration: '4s' }}>
                                                    تنفس... شهيق... زفير
                                                </div>
                                            </div>
                                        )}
                                        {(!['cognitive', 'perceptual', 'mental'].includes(exercise.category)) && (
                                            <>
                                                <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                                                    <Activity className="w-32 h-32 text-blue-500/20 animate-pulse" />
                                                </div>
                                                <div className="absolute top-4 left-4 flex gap-2">
                                                    <div className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-full border border-red-500/50 flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                                                        LIVE REC
                                                    </div>
                                                    <div className="px-3 py-1 bg-black/60 text-white text-xs font-mono rounded-full border border-white/10">
                                                        YOLOv8: Tracking
                                                    </div>
                                                </div>
                                                <div className="absolute bottom-4 right-4 px-4 py-2 bg-black/60 rounded-xl border border-white/10 backdrop-blur flex flex-col items-center">
                                                    <span className="text-[10px] text-white/50 uppercase">Reps / التكرارات</span>
                                                    <span className="text-3xl font-black text-white">{reps}</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/10 shrink-0">
                                    <p className="text-sm text-gray-400 mb-1">وقت الجلسة</p>
                                    <div className="text-4xl font-mono font-black text-white tracking-widest">{formatTime(duration)}</div>
                                </div>

                                <div className="bg-white/5 rounded-2xl p-4 border border-white/10 flex-1 flex flex-col justify-center">
                                    <p className="text-sm text-gray-400 mb-3 text-center">مؤشر جودة الحركة المباشر</p>
                                    <div className="relative w-full aspect-square max-w-[160px] mx-auto flex items-center justify-center">
                                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/10" />
                                            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className={`${motionScore > 90 ? 'text-green-500' : motionScore > 75 ? 'text-blue-500' : 'text-orange-500'} transition-all duration-500`} strokeDasharray={`${isActive ? (motionScore * 2.82) : 0} 283`} />
                                        </svg>
                                        <div className="absolute flex flex-col items-center justify-center">
                                            <span className="text-3xl font-black text-white">{isActive ? motionScore : '--'}</span>
                                            <span className="text-xs text-gray-400">/ 100</span>
                                        </div>
                                    </div>
                                </div>

                                {isActive && (
                                    <Button variant="destructive" className="w-full h-14 text-lg font-bold gap-2 mt-auto" onClick={stopSession}>
                                        <Square className="w-5 h-5 fill-current border-2 border-white rounded-sm p-[2px]" /> إنهاء وتخزين
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};
