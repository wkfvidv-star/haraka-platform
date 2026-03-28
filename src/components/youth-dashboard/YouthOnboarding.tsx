import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    ChevronLeft,
    ChevronRight,
    X,
    Activity,
    Target,
    BarChart3,
    Users,
    Brain,
    Gamepad2,
    Trophy,
    Gift,
    Camera,
    Play,
    Sparkles,
    Globe,
    Video
} from 'lucide-react';

interface SlideData {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
    bg: string;
}

interface YouthOnboardingProps {
    onComplete: () => void;
    isNewUser?: boolean;
}

export default function YouthOnboarding({ onComplete, isNewUser = true }: YouthOnboardingProps) {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    // Hardcoded SaaS-quality slides covering the 4 major platform hubs
    const slides: SlideData[] = [
        {
            id: 'library',
            title: 'مكتبة التدريبات المتكاملة',
            description: 'طور قدراتك من خلال تدريبات حركية، معرفية، ونفسية، بالإضافة لتمارين التأهيل المخصصة لاحتياجاتك وجسدك بدقة.',
            icon: Target,
            color: 'text-orange-500',
            bg: 'bg-orange-500/20'
        },
        {
            id: 'coach-sync',
            title: 'إرشاد مباشر من مدربك',
            description: 'احجز حصصك التدريبية الفردية واطلب خطط وأنظمة غذائية مخصصة من مدربك الخاص، وتلقى الإشعارات فور اعتمادها.',
            icon: Users,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/20'
        },
        {
            id: 'video-analysis',
            title: 'تحليل الأداء بالفيديو الذكي',
            description: 'ارفع فيديوهات أدائك الرياضي للمنصة لتحليل الزوايا والسرعة، واحصل على تقييم احترافي ومباشر من المدرب الذكي.',
            icon: Video,
            color: 'text-blue-500',
            bg: 'bg-blue-500/20'
        },
        {
            id: 'future',
            title: 'الواقع المعزز والمنافسات',
            description: 'استكشف المستقبل مع تمارين الواقع المعزز ومختبر الحركة، وتنافس في بطولات وطنية تضعك في صدارة الأبطال.',
            icon: Globe,
            color: 'text-purple-500',
            bg: 'bg-purple-500/20'
        }
    ];

    // Lock body scroll while onboarding is active
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const currentSlide = slides[currentSlideIndex];
    const Icon = currentSlide.icon;
    const isFirstSlide = currentSlideIndex === 0;
    const isLastSlide = currentSlideIndex === slides.length - 1;

    const handleNext = () => {
        if (isLastSlide) {
            onComplete();
        } else {
            setCurrentSlideIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (!isFirstSlide) {
            setCurrentSlideIndex(prev => prev - 1);
        }
    };

    // Animation variants
    const slideVariants = {
        initial: (direction: number) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0,
            scale: 0.95
        }),
        animate: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: { type: 'spring', stiffness: 300, damping: 30 }
        },
        exit: (direction: number) => ({
            x: direction > 0 ? -100 : 100,
            opacity: 0,
            scale: 0.95,
            transition: { duration: 0.2 }
        })
    };

    return (
        <div className="fixed inset-0 z-[100] font-arabic pointer-events-auto flex items-center justify-center p-4" dir="rtl">
            {/* Immersive Dimmed Backdrop with Blur */}
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md transition-opacity duration-300" />

            {/* Onboarding Wizard Modal */}
            <div className="relative pointer-events-auto max-w-2xl w-full">
                
                {/* Skip Top Button */}
                <div className="absolute -top-14 right-0 z-50">
                    <Button
                        variant="ghost"
                        onClick={onComplete}
                        className="text-white hover:text-orange-400 hover:bg-white/10 rounded-full gap-2 font-bold px-4"
                    >
                        تخطي الجولة المبدئية
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                <motion.div
                    className="bg-slate-900 border border-slate-700/50 rounded-[2rem] p-8 lg:p-12 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden relative"
                >
                    {/* Background Dynamic Glow inside modal */}
                    <div className={cn("absolute top-0 right-0 w-64 h-64 blur-[100px] -mr-32 -mt-32 rounded-full transition-colors duration-1000", currentSlide.bg)} />
                    <div className={cn("absolute bottom-0 left-0 w-64 h-64 blur-[100px] -ml-32 -mb-32 rounded-full transition-colors duration-1000", currentSlide.bg)} />

                    <AnimatePresence mode="wait" custom={1}>
                        <motion.div
                            key={currentSlideIndex}
                            custom={1}
                            variants={slideVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="relative z-10 flex flex-col items-center text-center"
                        >
                            {/* Slide Icon Presentation */}
                            <div className={cn("w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl shrink-0 border border-slate-700/50 mb-8", currentSlide.bg)}>
                                <Icon className={cn("w-12 h-12", currentSlide.color)} />
                            </div>
                            
                            {/* Content */}
                            <div className="max-w-xl mx-auto mb-12">
                                <h3 className="text-3xl font-black text-white tracking-tight mb-4 leading-tight">
                                    {currentSlide.title}
                                </h3>
                                <p className="text-slate-300 leading-relaxed font-medium text-lg">
                                    {currentSlide.description}
                                </p>
                            </div>

                            {/* Circular Progress Indicators */}
                            <div className="flex items-center justify-center gap-2 mb-10">
                                {slides.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={cn(
                                            "h-2 rounded-full transition-all duration-300",
                                            idx === currentSlideIndex
                                                ? cn("w-10 shadow-[0_0_10px_rgba(255,255,255,0.2)]", currentSlide.bg.split('/')[0]) // Use the base color without opacity
                                                : "bg-slate-700 w-3 hover:bg-slate-600 cursor-pointer"
                                        )}
                                        onClick={() => setCurrentSlideIndex(idx)}
                                    />
                                ))}
                            </div>

                            {/* Navigation Controls */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-sm">
                                <Button
                                    variant="outline"
                                    onClick={handlePrev}
                                    disabled={isFirstSlide}
                                    className="w-full sm:flex-1 bg-slate-800/50 hover:bg-slate-700 border-slate-700 text-slate-300 hover:text-white rounded-2xl h-14 gap-2 disabled:opacity-0 disabled:pointer-events-none transition-all"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                    السابق
                                </Button>

                                <Button
                                    onClick={handleNext}
                                    className="w-full sm:flex-1 bg-orange-500 hover:bg-orange-600 text-white border-0 rounded-2xl h-14 gap-2 font-bold shadow-lg shadow-orange-500/20 text-lg"
                                >
                                    {isLastSlide ? 'ابدأ الاستبيان' : 'التالي'}
                                    {!isLastSlide && <ChevronLeft className="w-5 h-5" />}
                                    {isLastSlide && <Sparkles className="w-5 h-5 mr-1" />}
                                </Button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}
