import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Activity,
    Brain,
    Heart,
    Sparkles,
    Zap
} from 'lucide-react';
import { ExercisePack, SmartExerciseService } from '@/services/SmartExerciseService';
import { ExercisePackCard } from './ExercisePackCard';

export const SmartExercisesSection: React.FC = () => {
    const [packs, setPacks] = useState<ExercisePack[]>([]);
    const [loading, setLoading] = useState(true);
    const [aiRecommendations, setAiRecommendations] = useState<ExercisePack[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [allPacks, recommended] = await Promise.all([
                    SmartExerciseService.getAllPacks(),
                    SmartExerciseService.getRecommendedPacks()
                ]);
                setPacks(allPacks);
                setAiRecommendations(recommended);
            } catch (error) {
                console.error("Failed to load exercises", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const motorPacks = packs.filter(p => p.category === 'Motor');
    const cognitivePacks = packs.filter(p => p.category === 'Cognitive');
    const mentalPacks = packs.filter(p => p.category === 'Mental');

    if (loading) {
        return <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Skeleton className="h-64" />
                <Skeleton className="h-64" />
                <Skeleton className="h-64" />
            </div>
        </div>;
    }

    return (
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent inline-flex items-center gap-2">
                        <Sparkles className="w-8 h-8 text-indigo-600" />
                        Smart Development Exercises
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        نظام تمرين ذكي متكامل لتطوير القدرات الحركية، الذهنية، والنفسية.
                    </p>
                </div>
            </div>

            {/* AI Recommendations Banner */}
            {aiRecommendations.length > 0 && (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
                    <div className="flex items-center gap-2 mb-3">
                        <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        <h3 className="font-bold text-indigo-900 dark:text-indigo-100">AI Weekly Picks (اختيارات الذكاء الاصطناعي لك)</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {aiRecommendations.map(pack => (
                            <ExercisePackCard key={`rec-${pack.id}`} pack={pack} />
                        ))}
                    </div>
                </div>
            )}

            <Tabs defaultValue="motor" className="w-full">
                <TabsList className="grid w-full grid-cols-3 h-14 p-1 bg-muted/50 rounded-xl">
                    <TabsTrigger value="motor" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-md h-full rounded-lg gap-2 text-lg">
                        <Activity className="w-5 h-5" />
                        <span className="hidden sm:inline">Motor & Physical (حركي)</span>
                    </TabsTrigger>
                    <TabsTrigger value="cognitive" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-md h-full rounded-lg gap-2 text-lg">
                        <Brain className="w-5 h-5" />
                        <span className="hidden sm:inline">Cognitive (ذهني)</span>
                    </TabsTrigger>
                    <TabsTrigger value="mental" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-md h-full rounded-lg gap-2 text-lg">
                        <Heart className="w-5 h-5" />
                        <span className="hidden sm:inline">Mental (نفسي)</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="motor" className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {motorPacks.map(pack => (
                            <ExercisePackCard key={pack.id} pack={pack} />
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="cognitive" className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cognitivePacks.map(pack => (
                            <ExercisePackCard key={pack.id} pack={pack} />
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="mental" className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mentalPacks.map(pack => (
                            <ExercisePackCard key={pack.id} pack={pack} />
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </section>
    );
};
