import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Timer, Focus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ExerciseCard } from '@/components/exercises/ExerciseCard';
import { CognitiveExercise } from '@/types/ExerciseTypes';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface CognitiveSectionProps {
    isSimplified?: boolean;
}

const INITIAL_GAMES: CognitiveExercise[] = [
    {
        id: 'cog-1',
        title: 'سرعة رد الفعل المتقدمة',
        description: 'اضغط على الهدف الصحيح (ألوان/أشكال) بأقصى سرعة ممكنة.',
        category: 'cognitive',
        type: 'focus',
        level: 'intermediate',
        durationSeconds: 60,
        completed: false,
        score: 0,
        targetMetric: 'Reaction Time (ms)'
    },
    {
        id: 'cog-2',
        title: 'الذاكرة التكتيكية',
        description: 'شاهد تشكيلة اللاعبين لمدة 5 ثوانٍ ثم أعد ترتيبهم في أماكنهم الصحيحة.',
        category: 'cognitive',
        type: 'memory',
        level: 'advanced',
        durationSeconds: 120,
        completed: false,
        score: 0,
        targetMetric: 'Accuracy (%)'
    },
    {
        id: 'cog-3',
        title: 'اتخاذ القرار السريع',
        description: 'شاهد سيناريو قصير للهجمة واختر التمريرة الصحيحة في جزء من الثانية.',
        category: 'cognitive',
        type: 'focus',
        level: 'advanced',
        durationSeconds: 180,
        completed: false,
        score: 0,
        targetMetric: 'Decision Speed (ms)'
    },
    {
        id: 'cog-4',
        title: 'تتبع اللاعبين المتعدد',
        description: 'تتبع حركة 3 لاعبين محددين وسط مجموعة متحركة.',
        category: 'cognitive',
        type: 'focus',
        level: 'intermediate',
        durationSeconds: 90,
        completed: false,
        score: 0,
        targetMetric: 'Tracking Accuracy (%)'
    },
    {
        id: 'cog-5',
        title: 'التعرف على الأنماط',
        description: 'اكتشف النمط التكتيكي المتكرر في تحركات الخصم.',
        category: 'cognitive',
        type: 'pattern',
        level: 'advanced',
        durationSeconds: 150,
        completed: false,
        score: 0,
        targetMetric: 'Pattern Recognition Score'
    }
];

export function CognitiveSection({ isSimplified = false }: CognitiveSectionProps) {
    const [exercises, setExercises] = useLocalStorage<CognitiveExercise[]>('cognitive-exercises', INITIAL_GAMES);

    const handleStartExercise = (exerciseId: string) => {
        // In a real app, this would open a modal or navigate to the game
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
