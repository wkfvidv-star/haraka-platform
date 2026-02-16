import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smile, Heart, Sun, Cloud, Moon, Book } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ExerciseCard } from '@/components/exercises/ExerciseCard';
import { MentalExercise } from '@/types/ExerciseTypes';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface MentalWellBeingSectionProps {
    isSimplified?: boolean;
}

const INITIAL_MENTAL_EXERCISES: MentalExercise[] = [
    {
        id: 'men-1',
        title: 'التخيل الذهني للمباراة',
        description: 'تخيل نفسك تؤدي حركاتك بامتياز في سيناريوهات مختلفة للمباراة.',
        category: 'mental',
        type: 'meditation',
        level: 'advanced',
        durationSeconds: 600,
        completed: false,
    },
    {
        id: 'men-2',
        title: 'إعادة شحن التركيز',
        description: 'تقنية سريعة لاستعادة التركيز الكامل بعد ارتكاب خطأ.',
        category: 'mental',
        type: 'breathing',
        level: 'intermediate',
        durationSeconds: 60,
        completed: false,
    },
    {
        id: 'men-3',
        title: 'حديث النفس الإيجابي',
        description: 'استبدال الأفكار السلبية بعبارات تعزيز الثقة والأداء.',
        category: 'mental',
        type: 'journaling',
        level: 'beginner',
        durationSeconds: 300,
        completed: false,
    },
    {
        id: 'men-4',
        title: 'اسرخاء العضلات المتدرج',
        description: 'تمرين للتخلص من التوتر الجسدي قبل المنافسة.',
        category: 'mental',
        type: 'meditation',
        level: 'intermediate',
        durationSeconds: 420,
        completed: false,
    },
    {
        id: 'men-5',
        title: 'تحليل المشاعر ما بعد الأداء',
        description: 'سجل مشاعرك بعد التدريب لتحسين الذكاء العاطفي الرياضي.',
        category: 'mental',
        type: 'journaling',
        level: 'beginner',
        durationSeconds: 240,
        completed: false,
    }
];

export function MentalWellBeingSection({ isSimplified = false }: MentalWellBeingSectionProps) {
    const [mood, setMood] = useLocalStorage<string | null>('daily-mood', null);
    const [exercises, setExercises] = useLocalStorage<MentalExercise[]>('mental-exercises', INITIAL_MENTAL_EXERCISES);

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
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
                <CardHeader>
                    <CardTitle className="text-lg text-blue-900">كيف تشعر اليوم؟</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-around py-4">
                    {[
                        { icon: Sun, label: 'رائع', value: 'great', color: 'text-yellow-500' },
                        { icon: Smile, label: 'جيد', value: 'good', color: 'text-green-500' },
                        { icon: Cloud, label: 'عادي', value: 'okay', color: 'text-blue-500' },
                        { icon: Moon, label: 'متعب', value: 'tired', color: 'text-purple-500' },
                    ].map((item) => (
                        <div key={item.value} className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => handleMoodSelect(item.value)}>
                            <div className={cn(
                                "p-3 rounded-full bg-white shadow-sm transition-transform hover:scale-110",
                                mood === item.value ? "ring-2 ring-blue-400 scale-110" : ""
                            )}>
                                <item.icon className={cn("w-8 h-8", item.color)} />
                            </div>
                            <span className="text-sm font-medium text-gray-600">{item.label}</span>
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
