import React from 'react';
import { Home, Dumbbell, Activity, TrendingUp, Brain, Users, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JourneyMapProps {
    currentStep: string;
    onStepClick: (stepId: string) => void;
}

export function JourneyMap({ currentStep, onStepClick }: JourneyMapProps) {
    const steps = [
        { id: 'dashboard', label: 'الرئيسية', icon: Home },
        { id: 'training', label: 'التدريب', icon: Dumbbell },
        { id: 'body-analysis', label: 'التقييم', icon: Activity },
        { id: 'progress', label: 'التقدم', icon: TrendingUp },
        { id: 'ai-chat', label: 'الذكاء', icon: Brain },
        { id: 'competitions', label: 'المجتمع', icon: Users },
    ];

    // Helper to determine if a step is "completed" (before current) or active
    const getStepStatus = (index: number) => {
        const currentIndex = steps.findIndex(s => s.id === currentStep);
        if (index < currentIndex) return 'completed';
        if (index === currentIndex) return 'active';
        return 'upcoming';
    };

    return (
        <div className="w-full overflow-x-auto py-4 px-2 mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between min-w-[600px] relative">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 dark:bg-gray-700 -z-10 rounded-full" />
                <div
                    className="absolute top-1/2 right-0 h-1 bg-educational-primary transition-all duration-500 -z-10 rounded-full"
                    style={{
                        width: `${(steps.findIndex(s => s.id === currentStep) / (steps.length - 1)) * 100}%`
                    }}
                />

                {steps.map((step, index) => {
                    const status = getStepStatus(index);
                    const Icon = step.icon;

                    return (
                        <button
                            key={step.id}
                            onClick={() => onStepClick(step.id)}
                            className={cn(
                                "flex flex-col items-center gap-2 relative group transition-all duration-300",
                                status === 'active' ? "scale-110" : "hover:scale-105"
                            )}
                        >
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 shadow-sm",
                                status === 'completed' && "bg-educational-primary border-educational-primary text-white",
                                status === 'active' && "bg-white border-educational-primary text-educational-primary shadow-md shadow-educational-primary/20",
                                status === 'upcoming' && "bg-gray-50 border-gray-200 text-gray-400 dark:bg-gray-800 dark:border-gray-600"
                            )}>
                                {status === 'completed' ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                            </div>
                            <span className={cn(
                                "text-xs font-medium transition-colors duration-300",
                                status === 'active' ? "text-educational-primary font-bold" : "text-gray-500"
                            )}>
                                {step.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
