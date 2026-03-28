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
                <h2 className={cn("font-bold text-gray-800 dark:text-gray-100", isSimplified ? "text-2xl" : "text-xl")}>
                    🧘 الصحة النفسية
                </h2>
                <p className={cn("text-gray-500", isSimplified ? "text-base" : "text-sm")}>
                    اعتني بنفسك ومشاعرك يومياً
                </p>
            </div>

            {/* Daily Mood Check-in */}
            <Card className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-500/20">
                <CardHeader>
                    <CardTitle className="text-lg text-blue-400">كيف تشعر اليوم؟</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-around py-4">
                    {[
                        { icon: Sun, label: 'رائع', value: 'great', color: 'text-yellow-400' },
                        { icon: Smile, label: 'جيد', value: 'good', color: 'text-emerald-400' },
                        { icon: Cloud, label: 'عادي', value: 'okay', color: 'text-blue-400' },
                        { icon: Moon, label: 'متعب', value: 'tired', color: 'text-indigo-400' },
                    ].map((item) => (
                        <div key={item.value} className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => handleMoodSelect(item.value)}>
                            <div className={cn(
                                "p-3 rounded-full bg-slate-800 border border-white/5 shadow-sm transition-transform hover:scale-110 hover:bg-slate-700",
                                mood === item.value ? "ring-2 ring-blue-400 bg-blue-500/10 scale-110" : ""
                            )}>
                                <item.icon className={cn("w-8 h-8", item.color)} />
                            </div>
                            <span className="text-sm font-medium text-slate-400">{item.label}</span>
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
