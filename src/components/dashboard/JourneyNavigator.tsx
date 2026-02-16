import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Star, Lock, Map } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Step {
    id: string;
    label: string;
    status: 'completed' | 'current' | 'locked';
    icon?: React.ReactNode;
}

interface JourneyNavigatorProps {
    currentStep: string;
    onStepClick: (stepId: string) => void;
}

export const JourneyNavigator: React.FC<JourneyNavigatorProps> = ({ currentStep, onStepClick }) => {
    const steps: Step[] = [
        { id: 'dashboard', label: 'البداية', status: 'completed' },
        { id: 'training', label: 'تدرب', status: 'current' },
        { id: 'metrics', label: 'تأكد', status: 'locked' },
        { id: 'progress', label: 'تطور', status: 'locked' },
        { id: 'ai-motion', label: 'تعلم', status: 'locked' },
        { id: 'competitions', label: 'شارك', status: 'locked' },
    ];

    const getStepStatus = (stepId: string, index: number): Step['status'] => {
        const currentIndex = steps.findIndex(s => s.id === currentStep);
        if (index < currentIndex) return 'completed';
        if (index === currentIndex) return 'current';
        return 'locked';
    };

    return (
        <Card className="mb-8 border-none shadow-xl bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 backdrop-blur-md overflow-hidden relative">
            {/* Animated Background Decoration */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 left-0 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
                <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
            </div>

            <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between relative px-2">
                    {/* The Connecting Path */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700/50 -translate-y-1/2 z-0 rounded-full mask-path">
                        <motion.div
                            className="h-full bg-gradient-to-r from-green-400 to-orange-500"
                            initial={{ width: "0%" }}
                            animate={{ width: `${(steps.findIndex(s => s.id === currentStep) / (steps.length - 1)) * 100}%` }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                        />
                    </div>

                    {steps.map((step, index) => {
                        const status = getStepStatus(step.id, index);
                        return (
                            <motion.button
                                key={step.id}
                                onClick={() => onStepClick(step.id)}
                                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ delay: index * 0.1, type: "spring" }}
                                className="relative z-10 flex flex-col items-center gap-3 group focus:outline-none"
                            >
                                <div
                                    className={cn(
                                        "w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg border-2",
                                        status === 'completed' ? "bg-green-500 border-green-400 text-white shadow-green-500/20" :
                                            status === 'current' ? "bg-white border-orange-500 text-orange-500 shadow-orange-500/40 scale-110 ring-4 ring-orange-500/10" :
                                                "bg-white/80 border-gray-100 text-gray-400 backdrop-blur-md dark:bg-gray-800/80 dark:border-gray-700"
                                    )}
                                >
                                    {status === 'completed' ? (
                                        <motion.div initial={{ rotate: -180 }} animate={{ rotate: 0 }}>
                                            <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7" />
                                        </motion.div>
                                    ) : status === 'current' ? (
                                        <div className="relative">
                                            <Star className="w-6 h-6 sm:w-7 sm:h-7 fill-current" />
                                            <motion.div
                                                className="absolute inset-0 bg-orange-500 rounded-full blur-md -z-10"
                                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            />
                                        </div>
                                    ) : (
                                        <Lock className="w-5 h-5 sm:w-6 sm:h-6 opacity-30" />
                                    )}
                                </div>

                                <span className={cn(
                                    "text-xs sm:text-sm font-black tracking-tight transition-all duration-300 px-2 py-0.5 rounded-full",
                                    status === 'current' ? "text-orange-600 bg-orange-100/50 scale-110" :
                                        status === 'completed' ? "text-green-600 opacity-80" :
                                            "text-gray-400 opacity-50"
                                )}>
                                    {step.label}
                                </span>

                                {status === 'current' && (
                                    <motion.div
                                        layoutId="active-nav-glow"
                                        className="absolute -bottom-2 w-1 h-1 bg-orange-500 rounded-full shadow-[0_0_10px_orange]"
                                    />
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
};
