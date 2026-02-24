import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Timer, Focus, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ExerciseCard } from '@/components/exercises/ExerciseCard';
import { CognitiveExercise } from '@/types/ExerciseTypes';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { SmartExerciseService } from '@/services/SmartExerciseService';

interface CognitiveSectionProps {
    isSimplified?: boolean;
}

export function CognitiveSection({ isSimplified = false }: CognitiveSectionProps) {
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

    const handleStartExercise = (exerciseId: string) => {
        console.log('Starting exercise:', exerciseId);
        // Mock completion for now
        const updatedExercises = exercises.map(ex => {
            if (ex.id === exerciseId) {
                return { ...ex, completed: true, score: Math.floor(Math.random() * 20) + 80 };
            }
            return ex;
        });
        setExercises(updatedExercises);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-blue-400 gap-4">
                <Loader2 className="w-10 h-10 animate-spin" />
                <span className="font-bold">جاري تحميل القدرات الذهنية...</span>
            </div>
        );
    }

    if (error) {
        return (
            <Card className="border-red-200 bg-red-50">
                <CardContent className="flex items-center gap-4 py-6 text-red-700">
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
                    🧠 القدرات الذهنية
                </h2>
                <p className={cn("text-gray-500", isSimplified ? "text-base" : "text-sm")}>
                    تمارين ممتعة لتنشيط عقلك وتحسين تركيزك
                </p>
            </div>

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
