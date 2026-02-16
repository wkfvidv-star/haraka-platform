import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, Brain, Smile } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DailyStateCardProps {
    activityLevel?: 'Low' | 'Medium' | 'High';
    focusLevel?: 'Low' | 'Medium' | 'High';
    mood?: 'Positive' | 'Neutral' | 'Negative';
    className?: string;
    isSimplified?: boolean;
}

export function DailyStateCard({
    activityLevel = 'Good',
    focusLevel = 'Medium',
    mood = 'Positive',
    className,
    isSimplified = false
}: any) {
    return (
        <Card className={cn("bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 border-indigo-100 dark:border-indigo-900/50 mb-4 shadow-sm", className)}>
            <CardContent className={cn("flex items-center justify-between", isSimplified ? "p-6" : "p-3 sm:p-4")}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full justify-around">

                    <div className="flex items-center gap-2">
                        <div className={cn("rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600", isSimplified ? "w-12 h-12" : "w-8 h-8")}>
                            <Activity className={cn(isSimplified ? "w-6 h-6" : "w-4 h-4")} />
                        </div>
                        <div className="flex flex-col">
                            <span className={cn("text-gray-500", isSimplified ? "text-sm font-medium" : "text-[10px]")}>النشاط</span>
                            <span className={cn("font-bold text-gray-700 dark:text-gray-200", isSimplified ? "text-lg" : "text-xs sm:text-sm")}>{activityLevel === 'Good' ? 'نشاط جيد' : activityLevel}</span>
                        </div>
                    </div>

                    <div className="hidden sm:block w-px h-8 bg-gray-200 dark:bg-gray-700" />

                    <div className="flex items-center gap-2">
                        <div className={cn("rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600", isSimplified ? "w-12 h-12" : "w-8 h-8")}>
                            <Brain className={cn(isSimplified ? "w-6 h-6" : "w-4 h-4")} />
                        </div>
                        <div className="flex flex-col">
                            <span className={cn("text-gray-500", isSimplified ? "text-sm font-medium" : "text-[10px]")}>التركيز</span>
                            <span className={cn("font-bold text-gray-700 dark:text-gray-200", isSimplified ? "text-lg" : "text-xs sm:text-sm")}>{focusLevel === 'Medium' ? 'تركيز متوسط' : focusLevel}</span>
                        </div>
                    </div>

                    <div className="hidden sm:block w-px h-8 bg-gray-200 dark:bg-gray-700" />

                    <div className="flex items-center gap-2">
                        <div className={cn("rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600", isSimplified ? "w-12 h-12" : "w-8 h-8")}>
                            <Smile className={cn(isSimplified ? "w-6 h-6" : "w-4 h-4")} />
                        </div>
                        <div className="flex flex-col">
                            <span className={cn("text-gray-500", isSimplified ? "text-sm font-medium" : "text-[10px]")}>المزاج</span>
                            <span className={cn("font-bold text-gray-700 dark:text-gray-200", isSimplified ? "text-lg" : "text-xs sm:text-sm")}>{mood === 'Positive' ? 'إيجابي' : mood}</span>
                        </div>
                    </div>

                </div>
            </CardContent>
        </Card>
    );
}
