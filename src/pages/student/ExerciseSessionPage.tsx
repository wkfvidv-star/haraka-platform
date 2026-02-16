import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, ChevronRight, PlayCircle, CheckCircle2, Timer } from 'lucide-react';
import { SmartExerciseService, ExercisePack, Exercise } from '@/services/SmartExerciseService';
import { useTranslation } from '@/contexts/ThemeContext';
import { useTheme } from '@/contexts/ThemeContext';

export const ExerciseSessionPage: React.FC = () => {
    const { packId } = useParams<{ packId: string }>();
    const navigate = useNavigate();
    const { isRTL } = useTheme();
    const [pack, setPack] = useState<ExercisePack | null>(null);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    // Safety check for loading
    useEffect(() => {
        const loadPack = async () => {
            if (!packId) return;
            const data = await SmartExerciseService.getPackById(packId);
            if (data) {
                setPack(data);
            } else {
                // If not found, go back
                navigate(-1);
            }
        };
        loadPack();
    }, [packId, navigate]);

    if (!pack) return <div className="flex items-center justify-center min-h-screen">Loading Session...</div>;

    const currentExercise = pack.exercises[currentExerciseIndex];
    const progress = ((currentExerciseIndex) / pack.exercises.length) * 100;

    const handleNext = () => {
        if (currentExerciseIndex < pack.exercises.length - 1) {
            setCurrentExerciseIndex(prev => prev + 1);
        } else {
            setIsComplete(true);
        }
    };

    const handleBack = () => {
        // Return to Main Menu (Dashboard)
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-background p-4 md:p-8 space-y-6">
            {/* Top Navigation Bar with Back Button */}
            <header className="flex items-center gap-4 border-b pb-4 mb-6">
                <Button variant="outline" size="sm" onClick={handleBack} className="gap-2 hover:bg-muted border-primary/20 text-primary">
                    {isRTL ? <ArrowRight className="w-5 h-5" /> : <ChevronRight className="w-5 h-5 rotate-180" />}
                    <span className="text-lg font-bold">القائمة الرئيسية (Main Menu)</span>
                </Button>
                <div>
                    <h1 className="text-xl font-bold">{pack.title}</h1>
                    <p className="text-sm text-muted-foreground">{pack.category} • {pack.difficulty}</p>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto space-y-8">

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{currentExerciseIndex + 1} / {pack.exercises.length}</span>
                    </div>
                    <Progress value={isComplete ? 100 : progress} className="h-2" />
                </div>

                {!isComplete ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Video / Visual Placeholder */}
                        <Card className="aspect-video bg-black/5 dark:bg-black/40 flex items-center justify-center border-2 border-dashed">
                            <PlayCircle className="w-20 h-20 text-muted-foreground/50" />
                            <span className="sr-only">Video Placeholder</span>
                        </Card>

                        {/* Instructions */}
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-2xl">{currentExercise.title}</CardTitle>
                                    <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">
                                        <Timer className="w-4 h-4" />
                                        {currentExercise.duration}
                                    </div>
                                </div>
                                <CardDescription>{currentExercise.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <h3 className="font-semibold mb-3">Instructions (التعليمات):</h3>
                                    <ul className="space-y-3">
                                        {currentExercise.instructions.map((step, idx) => (
                                            <li key={idx} className="flex gap-3">
                                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                                                    {idx + 1}
                                                </span>
                                                <span>{step}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <Button size="lg" className="w-full text-lg font-bold" onClick={handleNext}>
                                    {currentExerciseIndex === pack.exercises.length - 1 ? 'Complete Pack' : 'Next Exercise'}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <Card className="text-center py-12 space-y-6">
                        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-12 h-12" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-green-700 dark:text-green-400">Excellent Job!</h2>
                            <p className="text-muted-foreground mt-2">You completed {pack.title}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mt-8">
                            {pack.kpis.map((kpi, idx) => (
                                <div key={idx} className="bg-muted p-4 rounded-xl">
                                    <div className="text-2xl font-bold">{kpi.value}{kpi.unit}</div>
                                    <div className="text-xs text-muted-foreground">{kpi.name}</div>
                                </div>
                            ))}
                        </div>
                        <Button size="lg" onClick={() => navigate('/')}>
                            Back to Main Menu (القائمة الرئيسية)
                        </Button>
                    </Card>
                )}
            </main>
        </div>
    );
};
