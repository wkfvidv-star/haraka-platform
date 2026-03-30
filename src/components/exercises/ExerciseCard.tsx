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
        <Card className={cn(
            "bg-[#151928]/80 backdrop-blur-xl hover:shadow-xl transition-all duration-300 group relative overflow-hidden",
            "border-y border-r border-white/5 hover:border-white/10 border-l-[3px]",
            exercise.completed ? "border-l-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.05)]" : "border-l-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.05)]"
        )}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <CardHeader className={cn("pb-3 relative z-10", isSimplified ? "p-6" : "p-5")}>
                <div className="flex justify-between items-start">
                    <span
                        className={cn(
                            "mb-3 font-bold uppercase tracking-wider text-[10px] px-2.5 py-1 rounded-full",
                            exercise.level === 'beginner' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            exercise.level === 'intermediate' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        )}>
                        {exercise.level}
                    </span>
                    {exercise.completed && <CheckCircle className="w-5 h-5 text-emerald-500 filter drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]" />}
                </div>
                <CardTitle className={cn("font-black tracking-tight text-white line-clamp-1 mt-1", isSimplified ? "text-2xl" : "text-lg")}>{exercise.title}</CardTitle>
                <CardDescription className={cn("text-slate-400 mt-2 line-clamp-2 leading-relaxed min-h-[40px]", isSimplified ? "text-base" : "text-sm")}>{exercise.description}</CardDescription>
            </CardHeader>
            <CardContent className={cn("pb-4 relative z-10", isSimplified ? "p-6 pt-0" : "p-5 pt-0")}>
                <div className="flex items-center gap-3 text-xs font-bold text-slate-500 mt-1">
                    <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-slate-300">{exercise.durationSeconds}s</span>
                    </div>
                    {exercise.score !== undefined && (
                        <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                            <BarChart className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-blue-300">Score: {exercise.score}</span>
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter className={cn("relative z-10", isSimplified ? "p-6 pt-0" : "p-5 pt-0")}>
                <Button
                    className={cn(
                        "w-full font-black rounded-xl transition-all shadow-lg",
                        exercise.completed
                            ? "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300 border border-slate-700"
                            : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white border-none shadow-blue-500/25"
                    )}
                    size={isSimplified ? "lg" : "default"}
                    onClick={() => onStart(exercise)}
                    disabled={exercise.completed}
                >
                    {exercise.completed ? 'Completed' : (
                        <>
                            <Play className="w-4 h-4 mr-2 fill-current" />
                            Start Exercise
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}
