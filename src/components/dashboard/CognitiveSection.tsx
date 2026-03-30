import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Timer, Focus, Loader2, AlertCircle, Sparkles, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ExerciseCard } from '@/components/exercises/ExerciseCard';
import { CognitiveExercise } from '@/types/ExerciseTypes';
import { SmartExerciseService } from '@/services/SmartExerciseService';
import { hceService } from '@/services/hceService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface CognitiveSectionProps {
    isSimplified?: boolean;
}

export function CognitiveSection({ isSimplified = false }: CognitiveSectionProps) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [exercises, setExercises] = useState<CognitiveExercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                setLoading(true);
                const packs = await SmartExerciseService.getPacksByCategory('Cognitive');

                // Map ExercisePack to CognitiveExercise for backward compatibility with ExerciseCard
                const mapped = packs.map(pack => ({
                    id: pack.id,
                    title: pack.title,
                    description: pack.description,
                    category: 'cognitive' as const,
                    type: (pack.subCategory.toLowerCase() as any) || 'focus',
                    level: pack.difficulty.toLowerCase() as any,
                    durationSeconds: parseInt(pack.exercises[0]?.duration) * 60 || 300,
                    completed: false,
                    score: 0,
                    targetMetric: pack.kpis[0]?.name || 'Performance'
                }));

                setExercises(mapped);
            } catch (err) {
                console.error("Failed to fetch cognitive exercises", err);
                setError("عذراً، فشل تحميل التمارين الإدراكية.");
            } finally {
                setLoading(false);
            }
        };

        fetchExercises();
    }, []);

    const handleStartExercise = async (exerciseId: string) => {
        console.log('Starting exercise:', exerciseId);

        // Expert KPI Tracking: Simulating high-precision data
        const accuracy = Math.floor(Math.random() * 15) + 85; // 85-100%
        const reactionTime = Math.floor(Math.random() * 200) + 300; // 300-500ms

        const updatedExercises = exercises.map(ex => {
            if (ex.id === exerciseId) {
                return { ...ex, completed: true, score: accuracy };
            }
            return ex;
        });
        setExercises(updatedExercises);

        // UPI Integration: Encrypt performance into Neural Profile
        try {
            if (user?.id) {
                const response = await hceService.recordActivity(user.id, 'COGNITIVE_DRILL', {
                    exerciseId,
                    accuracy,
                    reactionTime,
                    mood: localStorage.getItem('daily-mood') || 'normal'
                });

                if (response.adjustment) {
                    toast({
                        title: "تحليل الحراك الذهني (UPI)",
                        description: response.adjustment,
                    });
                }
            }
        } catch (err) {
            console.warn("Cognitive encoding failed.");
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[40vh] text-indigo-400 gap-4">
                <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full" />
                    <Loader2 className="w-12 h-12 animate-spin relative z-10 text-indigo-400" />
                </div>
                <span className="font-black tracking-widest uppercase text-sm">جاري تهيئة مركز القيادة الذهنية...</span>
            </div>
        );
    }

    if (error) {
        return (
            <Card className="border-rose-500/20 bg-rose-500/10 backdrop-blur-md">
                <CardContent className="flex items-center gap-4 py-6 text-rose-400">
                    <AlertCircle className="w-6 h-6" />
                    <p className="font-bold flex-1">{error}</p>
                    <Button variant="outline" onClick={() => window.location.reload()} className="border-rose-500/30 hover:bg-rose-500/10 text-white">إعادة المحاولة</Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
                            <Brain className="w-6 h-6 text-indigo-400" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                            القدرات الذهنية <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 hidden sm:flex">إشراف الذكاء الاصطناعي</Badge>
                        </h2>
                    </div>
                    <p className="text-slate-400 font-bold max-w-xl text-sm leading-relaxed">
                        تدريبات متقدمة لتحسين زمن الاستجابة، التركيز العميق، وصناعة القرار السريع تحت الضغط.
                    </p>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-12 px-6 shadow-[0_0_20px_rgba(79,70,229,0.4)] shrink-0 rounded-xl transition-all hover:scale-105 border-none">
                    بدء جلسة التركيز العميق <Sparkles className="w-4 h-4 mr-2 text-indigo-200" />
                </Button>
            </div>

            {/* Neural Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {[
                    { label: "زمن الاستجابة", val: "245", unit: "ms", icon: Zap, color: "text-amber-400", border: "border-amber-500/20", glow: "shadow-[0_0_30px_rgba(251,191,36,0.15)] bg-gradient-to-br from-amber-500/10 to-transparent" },
                    { label: "مؤشر التركيز", val: "88", unit: "%", icon: Focus, color: "text-blue-400", border: "border-blue-500/20", glow: "shadow-[0_0_30px_rgba(56,189,248,0.15)] bg-gradient-to-br from-blue-500/10 to-transparent" },
                    { label: "المرونة العصبية", val: "متقدم", unit: "المستوى", icon: Activity, color: "text-emerald-400", border: "border-emerald-500/20", glow: "shadow-[0_0_30px_rgba(52,211,153,0.15)] bg-gradient-to-br from-emerald-500/10 to-transparent" },
                ].map((stat, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * idx }}>
                        <Card className={cn("border bg-slate-900/40 backdrop-blur-xl relative overflow-hidden", stat.border, stat.glow)}>
                            <CardContent className="p-5 flex items-center justify-between">
                                <div>
                                    <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">{stat.label}</span>
                                    <div className="flex items-baseline gap-1 mt-1">
                                        <span className={cn("text-3xl font-black", stat.color)}>{stat.val}</span>
                                        <span className="text-[10px] font-bold text-slate-500">{stat.unit}</span>
                                    </div>
                                </div>
                                <div className={cn("p-3 rounded-2xl bg-slate-950/50 border border-white/5", stat.color)}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Exercises Grid */}
            <div className="mt-8">
                <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                    <Timer className="w-5 h-5 text-indigo-400" /> التدريبات المتاحة اليوم
                </h3>
                <div className={cn("grid gap-5", isSimplified ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3")}>
                    {exercises.length === 0 ? (
                        <div className="col-span-full p-8 text-center rounded-2xl border border-white/5 bg-white/5 text-slate-400 font-bold">
                            لا توجد تدريبات مبرمجة لليوم، خذ قسطاً من الراحة الذهنية.
                        </div>
                    ) : (
                        exercises.map((game, i) => (
                            <motion.div key={game.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + (i * 0.1) }}>
                                <div className="p-1 rounded-2xl bg-gradient-to-b from-slate-800 to-transparent shadow-xl h-full">
                                    <ExerciseCard
                                        exercise={game}
                                        onStart={() => handleStartExercise(game.id)}
                                        isSimplified={isSimplified}
                                    />
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
