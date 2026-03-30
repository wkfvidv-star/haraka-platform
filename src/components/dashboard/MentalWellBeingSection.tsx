import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smile, Heart, Sun, Cloud, Moon, Book, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ExerciseCard } from '@/components/exercises/ExerciseCard';
import { MentalExercise } from '@/types/ExerciseTypes';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { SmartExerciseService } from '@/services/SmartExerciseService';

interface MentalWellBeingSectionProps {
    isSimplified?: boolean;
}

export function MentalWellBeingSection({ isSimplified = false }: MentalWellBeingSectionProps) {
    const [mood, setMood] = useLocalStorage<string | null>('daily-mood', null);
    const [exercises, setExercises] = useState<MentalExercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                setLoading(true);
                const packs = await SmartExerciseService.getPacksByCategory('Mental');

                const mapped = packs.map(pack => ({
                    id: pack.id,
                    title: pack.title,
                    description: pack.description,
                    category: 'mental' as const,
                    type: (pack.subCategory.toLowerCase() as any) || 'meditation',
                    level: pack.difficulty.toLowerCase() as any,
                    durationSeconds: parseInt(pack.exercises[0]?.duration) * 60 || 300,
                    completed: false
                }));

                setExercises(mapped);
            } catch (err) {
                console.error("Failed to fetch mental exercises", err);
                setError("عذراً، فشل تحميل تمارين الرفاه النفسي.");
            } finally {
                setLoading(false);
            }
        };

        fetchExercises();
    }, []);

    const handleStartExercise = (exerciseId: string) => {
        console.log('Starting mental exercise:', exerciseId);
        const updatedExercises = exercises.map(ex => {
            if (ex.id === exerciseId) {
                return { ...ex, completed: true };
            }
            return ex;
        });
        setExercises(updatedExercises);
    };

    const handleMoodSelect = (selectedMood: string) => {
        setMood(selectedMood);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-purple-400 gap-4">
                <Loader2 className="w-10 h-10 animate-spin" />
                <span className="font-bold">جاري تحميل تمارين الرفاه...</span>
            </div>
        );
    }

    if (error) {
        return (
            <Card className="border-rose-500/20 bg-rose-500/10">
                <CardContent className="flex items-center gap-4 py-6 text-rose-400">
                    <AlertCircle className="w-6 h-6" />
                    <p className="font-medium">{error}</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h2 className={cn("font-black tracking-tight text-white", isSimplified ? "text-3xl" : "text-2xl")}>
                    🧘 الصحة النفسية
                </h2>
                <p className={cn("text-slate-400", isSimplified ? "text-lg" : "text-sm")}>
                    اعتني بنفسك ومشاعرك يومياً
                </p>
            </div>

            {/* Daily Mood Check-in */}
            <Card className="bg-[#151928]/90 backdrop-blur-xl border border-blue-500/20 relative overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 pointer-events-none" />
                <div className="absolute -left-20 -top-20 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
                <CardHeader className="relative z-10 pb-4">
                    <CardTitle className="text-xl font-black text-white">كيف تشعر اليوم؟</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-around py-6 relative z-10">
                    {[
                        { icon: Sun, label: 'رائع', value: 'great', color: 'text-amber-400 hover:text-amber-300' },
                        { icon: Smile, label: 'جيد', value: 'good', color: 'text-emerald-400 hover:text-emerald-300' },
                        { icon: Cloud, label: 'عادي', value: 'okay', color: 'text-blue-400 hover:text-blue-300' },
                        { icon: Moon, label: 'متعب', value: 'tired', color: 'text-indigo-400 hover:text-indigo-300' },
                    ].map((item) => (
                        <div key={item.value} className="flex flex-col items-center gap-3 cursor-pointer group" onClick={() => handleMoodSelect(item.value)}>
                            <div className={cn(
                                "p-4 rounded-2xl bg-[#1a1f33] border border-white/5 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg",
                                mood === item.value ? "ring-2 ring-blue-500 bg-blue-500/20 -translate-y-1 shadow-lg shadow-blue-500/20" : ""
                            )}>
                                <item.icon className={cn("w-8 h-8 transition-colors", item.color, mood === item.value ? "scale-110" : "")} strokeWidth={mood === item.value ? 2.5 : 2} />
                            </div>
                            <span className={cn("text-sm font-bold transition-colors", mood === item.value ? "text-white" : "text-slate-400 group-hover:text-slate-300")}>{item.label}</span>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <div className={cn("grid gap-4", isSimplified ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3")}>
                {exercises.map((game) => (
                    <ExerciseCard
                        key={game.id}
                        exercise={game}
                        onStart={() => handleStartExercise(game.id)}
                        isSimplified={isSimplified}
                    />
                ))}
            </div>
        </div>
    );
}
