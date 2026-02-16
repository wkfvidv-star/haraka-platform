import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BaseExercise } from '@/types/ExerciseTypes';
import { CheckCircle, Play, Clock, BarChart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExerciseCardProps {
    exercise: BaseExercise;
    onStart: (exercise: BaseExercise) => void;
    isSimplified?: boolean;
}

export function ExerciseCard({ exercise, onStart, isSimplified = false }: ExerciseCardProps) {
    return (
        <Card className={cn("hover:shadow-lg transition-all duration-300 border-l-4",
            exercise.completed ? "border-l-green-500" : "border-l-blue-500"
        )}>
            <CardHeader className={cn("pb-2", isSimplified ? "p-6" : "p-4")}>
                <div className="flex justify-between items-start">
                    <Badge variant={exercise.level === 'beginner' ? 'secondary' : exercise.level === 'intermediate' ? 'default' : 'destructive'}
                        className="mb-2">
                        {exercise.level}
                    </Badge>
                    {exercise.completed && <CheckCircle className="w-5 h-5 text-green-500" />}
                </div>
                <CardTitle className={cn(isSimplified ? "text-2xl" : "text-lg")}>{exercise.title}</CardTitle>
                <CardDescription className={cn(isSimplified ? "text-base" : "text-sm")}>{exercise.description}</CardDescription>
            </CardHeader>
            <CardContent className={cn("pb-2", isSimplified ? "p-6 pt-0" : "p-4 pt-0")}>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{exercise.durationSeconds}s</span>
                    </div>
                    {exercise.score !== undefined && (
                        <div className="flex items-center gap-1">
                            <BarChart className="w-4 h-4" />
                            <span>Score: {exercise.score}</span>
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter className={cn(isSimplified ? "p-6 pt-0" : "p-4 pt-0")}>
                <Button
                    className="w-full"
                    size={isSimplified ? "lg" : "default"}
                    onClick={() => onStart(exercise)}
                    disabled={exercise.completed} // Optional: allow re-play?
                >
                    {exercise.completed ? 'Completed' : (
                        <>
                            <Play className="w-4 h-4 mr-2" />
                            Start Exercise
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}
