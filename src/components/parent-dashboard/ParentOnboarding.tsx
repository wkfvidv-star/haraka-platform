import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRight,
    ChevronLeft,
    X,
    Target,
    Users,
    Activity,
    Brain,
    MessageCircleQuestion,
    UserCheck,
    HeartHandshake,
    LayoutDashboard,
    Sparkles,
    ShieldCheck,
    TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/contexts/ThemeContext';

interface SlideData {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
}

const ONBOARDING_SLIDES: SlideData[] = [
    {
        id: 'welcome',
        title: 'مرحباً بك في عالم الحركة',
        description: 'بصفتك ولي الأمر، نضع بين يديك كل ما يخص نمو أطفالك وتطورهم في بيئة رياضية وصحية متكاملة.',
        icon: Sparkles,
        color: 'from-blue-600 to-indigo-600 shadow-blue-500/50'
    },
    {
        id: 'navigation',
        title: 'أدوات التحكم الشاملة',
        description: 'تنقل بسهولة بين لوحة التحكم، الرسائل، وجدول المواعيد. كل ما تحتاجه في متناول يدك.',
        icon: LayoutDashboard,
        color: 'from-emerald-500 to-teal-600 shadow-emerald-500/50'
    },
    {
        id: 'child_centric',
        title: 'تجربة محورها الطفل',
        description: 'تحول الواجهة ديناميكياً بناءً على الطفل المختار، لتعرض إحصائياته الخاصة وتقدمه بشكل دقيق.',
        icon: Users,
        color: 'from-orange-500 to-rose-600 shadow-orange-500/50'
    },
    {
        id: 'smart_alerts',
        title: 'تنبيهات ذكية ولحظية',
        description: 'ابقَ على اطلاع دائم بحضور طفلك، أدائه، والرسائل الهامة من المدربين عبر نظام إشعارات ذكي.',
        icon: TrendingUp,
        color: 'from-violet-600 to-purple-600 shadow-violet-500/50'
    },
    {
        id: 'ai_assistant',
        title: 'المساعد الذكي لولي الأمر',
        description: 'استخدم الذكاء الاصطناعي لتحليل تقدم طفلك وطلب نصائح تربوية ورياضية مخصصة بسهولة تامة.',
        icon: Brain,
        color: 'from-blue-400 to-cyan-500 shadow-cyan-500/50'
    }
];

interface ParentOnboardingProps {
    onComplete: () => void;
    onSkip?: () => void;
    isNewUser?: boolean;
}

export function ParentOnboarding({ onComplete, onSkip, isNewUser = false }: ParentOnboardingProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const { language } = useTranslation();
    const isRTL = language === 'ar';

    useEffect(() => {
        // Lock body scroll when onboarding is active
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleNext = () => {
        if (currentStep < ONBOARDING_SLIDES.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            finishOnboarding();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const finishOnboarding = () => {
        setIsVisible(false);
        setTimeout(() => {
            onComplete();
        }, 400); 
    };

    if (!isVisible) return null;

    const currentSlide = ONBOARDING_SLIDES[currentStep];
    const Icon = currentSlide.icon;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 lg:p-0" dir={isRTL ? "rtl" : "ltr"}>
            {/* Cinematic Backdrop */}
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-950/90 pointer-events-auto backdrop-blur-md"
                />
            </AnimatePresence>

            {/* Slide Content Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -30 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className={cn(
                        "relative z-[202] w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl overflow-hidden pointer-events-auto font-sans border border-white/5",
                        "flex flex-col md:flex-row h-auto min-h-[480px]"
                    )}
                >
                    {/* Visual Side */}
                    <div className={cn(
                        "md:w-5/12 bg-gradient-to-br flex flex-col items-center justify-center p-10 text-white relative overflow-hidden transition-all duration-700",
                        currentSlide.color
                    )}>
                        <motion.div
                            initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="relative z-10 p-8 bg-white/20 backdrop-blur-2xl rounded-[32px] border border-white/30 shadow-2xl"
                        >
                            <Icon className="w-20 h-20" />
                        </motion.div>
                        
                        {/* Decorative background shapes */}
                        <motion.div 
                            animate={{ 
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.5, 0.3] 
                            }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute top-0 right-0 w-48 h-48 bg-white/20 rounded-full -mr-24 -mt-24 blur-3xl" 
                        />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/20 rounded-full -ml-24 -mb-24 blur-3xl" />
                    </div>

                    {/* Content Side */}
                    <div className="flex-1 p-8 md:p-12 flex flex-col justify-between bg-white dark:bg-slate-900">
                        <div>
                            <div className="flex justify-between items-start mb-12">
                                <div className="space-y-2">
                                    <h4 className="text-blue-600 dark:text-blue-400 font-black text-xs uppercase tracking-[0.2em] opacity-80">جولة تعريفية</h4>
                                    <div className="flex gap-1.5">
                                        {ONBOARDING_SLIDES.map((_, idx) => (
                                            <div 
                                                key={idx} 
                                                className={cn(
                                                    "h-1.5 rounded-full transition-all duration-500",
                                                    idx === currentStep ? "w-10 bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]" : "w-2.5 bg-slate-200 dark:bg-slate-800"
                                                )}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={onSkip || finishOnboarding}
                                    className="text-slate-400 hover:text-rose-500 font-bold hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all rounded-xl"
                                >
                                    تخطي
                                </Button>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-6 leading-[1.2]">
                                    {currentSlide.title}
                                </h3>

                                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-10">
                                    {currentSlide.description}
                                </p>
                            </motion.div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-between mt-auto">
                            <div className="text-2xl font-black text-slate-200 dark:text-slate-800 font-mono tracking-tighter select-none" dir="ltr">
                                {currentStep + 1} <span className="text-slate-100 dark:text-slate-800/50">/</span> {ONBOARDING_SLIDES.length}
                            </div>

                            <div className="flex gap-4">
                                {currentStep > 0 && (
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        onClick={handlePrev}
                                        className="rounded-[20px] border-slate-200 dark:border-slate-800 bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 px-6 h-14 font-bold"
                                    >
                                        {isRTL ? <ChevronRight className="w-6 h-6 ml-2" /> : <ChevronLeft className="w-6 h-6 mr-2" />}
                                        السابق
                                    </Button>
                                )}

                                <Button
                                    size="lg"
                                    onClick={handleNext}
                                    className="rounded-[20px] bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 px-12 h-14 font-black shadow-2xl transition-all active:scale-95"
                                >
                                    {currentStep === ONBOARDING_SLIDES.length - 1 ? 'ابدأ الاستخدام' : 'التالي'}
                                    {currentStep !== ONBOARDING_SLIDES.length - 1 && (
                                        isRTL ? <ChevronLeft className="w-6 h-6 mr-2" /> : <ChevronRight className="w-6 h-6 ml-2" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
