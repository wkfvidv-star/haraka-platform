import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Building2,
    Globe,
    BarChart3,
    FileText,
    School,
    Video,
    Brain,
    HeartPulse,
    MapPin,
    PlayCircle
} from 'lucide-react';

interface MinistryOnboardingProps {
    onComplete: () => void;
    onSkip: () => void;
}

const slides = [
    {
        title: 'مرحبًا بك في واجهة الوزارة',
        description: 'تمنحك هذه الواجهة نظرة شاملة على جميع مديريات التربية والمدارس، مع أدوات ذكية لمتابعة الأداء الوطني واتخاذ قرارات استراتيجية.',
        icon: Building2,
        gradient: 'from-red-500 to-rose-600'
    },
    {
        title: 'متابعة المديريات',
        description: 'راقب أداء جميع المديريات، عدد المدارس، التلاميذ، والمعلمين، مع مؤشرات الأداء الرئيسية على مستوى الولاية.',
        icon: Globe,
        gradient: 'from-blue-500 to-indigo-600'
    },
    {
        title: 'متابعة الأداء العام على المستوى الوطني',
        description: 'اطلع على مؤشرات النشاط البدني، الأداء المعرفي، والرفاه النفسي لجميع التلاميذ على مستوى الوطن.',
        icon: BarChart3,
        gradient: 'from-emerald-500 to-teal-600'
    },
    {
        title: 'تحليل البيانات والتقارير الشاملة',
        description: 'إنشاء ومراجعة تقارير على المستوى الوطني، مقارنة المديريات والمدارس، وتحليل التطور العام.',
        icon: FileText,
        gradient: 'from-amber-500 to-orange-600'
    },
    {
        title: 'متابعة الأداء المدرسي',
        description: 'إمكانية الاطلاع على أداء كل مدرسة ومدير، بما في ذلك النشاط التعليمي والصحي والنفسي.',
        icon: School,
        gradient: 'from-purple-500 to-fuchsia-600'
    },
    {
        title: 'تحليل الفيديوهات على نطاق واسع',
        description: 'مراجعة فيديوهات الأداء من جميع المدارس والمديريات، لتقييم جودة التدريب ونقاط القوة والضعف.',
        icon: Video,
        gradient: 'from-cyan-500 to-blue-600'
    },
    {
        title: 'الأدوات الذكية',
        description: 'استخدام المدرب الافتراضي والمساعد الذكي لتقديم توصيات استراتيجية لكل المديريات والمدارس.',
        icon: Brain,
        gradient: 'from-pink-500 to-rose-500'
    },
    {
        title: 'متابعة الحالة الصحية والنفسية الوطنية',
        description: 'تحليل المؤشرات الصحية والنفسية لكل الطلاب والمدارس على مستوى كل ولاية ومقارنة الأداء بين المديريات.',
        icon: HeartPulse,
        gradient: 'from-green-500 to-emerald-600'
    },
    {
        title: 'التنقل متعدد المستويات',
        description: 'سهولة التنقل من المستوى الوطني ← المديريات ← المدارس ← المعلمين ← التلاميذ للوصول لأي بيانات بسرعة.',
        icon: MapPin,
        gradient: 'from-violet-500 to-purple-600'
    },
    {
        title: 'ابدأ إدارة الوزارة',
        description: 'استكشف لوحة التحكم وابدأ في متابعة جميع مديريات التربية والمدارس واتخاذ القرارات الاستراتيجية خطوة بخطوة.',
        icon: PlayCircle,
        gradient: 'from-red-600 to-rose-700'
    }
];

export const MinistryOnboarding: React.FC<MinistryOnboardingProps> = ({ onComplete, onSkip }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        if (currentSlide === slides.length - 1) {
            onComplete();
        } else {
            setCurrentSlide(prev => prev + 1);
        }
    };

    const prevSlide = () => {
        setCurrentSlide(prev => (prev > 0 ? prev - 1 : prev));
    };

    const isLastSlide = currentSlide === slides.length - 1;

    // Animation variants customized for Ministry Dashboard
    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0,
            scale: 0.95
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 100 : -100,
            opacity: 0,
            scale: 0.95
        })
    };

    const [direction, setDirection] = useState(0);

    const handleNext = () => {
        setDirection(1);
        nextSlide();
    };

    const handlePrev = () => {
        setDirection(-1);
        prevSlide();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md" dir="rtl">
            {/* Background Abstract Layer */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className={`absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-tr ${slides[currentSlide].gradient} rounded-full blur-[100px] mix-blend-screen opacity-20`}
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className={`absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-bl ${slides[currentSlide].gradient} rounded-full blur-[100px] mix-blend-screen opacity-20`}
                />
            </div>

            <Card className="relative w-full max-w-2xl bg-slate-900/90 border-slate-700 shadow-2xl overflow-hidden glass-card">
                {/* Skip Button */}
                <div className="absolute top-4 left-4 z-50">
                    <Button
                        variant="ghost"
                        onClick={onSkip}
                        className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-full font-bold"
                    >
                        تخطي
                    </Button>
                </div>

                <CardContent className="p-0">
                    <div className="relative h-[480px] flex items-center justify-center">
                        <AnimatePresence initial={false} custom={direction}>
                            <motion.div
                                key={currentSlide}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.2 },
                                    scale: { duration: 0.2 }
                                }}
                                className="absolute inset-0 flex flex-col items-center justify-center text-center p-12"
                            >
                                {/* Slide Icon */}
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", damping: 15, delay: 0.1 }}
                                    className={`w-32 h-32 rounded-[2.5rem] bg-gradient-to-br ${slides[currentSlide].gradient} flex items-center justify-center mb-10 shadow-lg shadow-black/20`}
                                >
                                    {React.createElement(slides[currentSlide].icon, {
                                        className: "w-16 h-16 text-white"
                                    })}
                                </motion.div>

                                {/* Slide Text */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="space-y-4"
                                >
                                    <h2 className="text-3xl font-black text-white tracking-tight">
                                        {slides[currentSlide].title}
                                    </h2>
                                    <p className="text-lg font-bold text-slate-300 leading-relaxed max-w-lg mx-auto">
                                        {slides[currentSlide].description}
                                    </p>
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation Controls */}
                    <div className="p-8 bg-slate-950/50 border-t border-slate-800 flex items-center justify-between">
                        <Button
                            variant="outline"
                            onClick={handlePrev}
                            disabled={currentSlide === 0}
                            className="border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 rounded-xl font-bold px-6 h-12"
                        >
                            السابق
                        </Button>

                        {/* Progress Indicators */}
                        <div className="flex flex-col items-center gap-3">
                            <div className="flex items-center gap-2">
                                {slides.map((_, idx) => (
                                    <motion.div
                                        key={idx}
                                        className={`h-2 rounded-full transition-all duration-300 ${idx === currentSlide
                                            ? `w-8 bg-gradient-to-r ${slides[currentSlide].gradient}`
                                            : "w-2 bg-slate-700"
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-xs font-bold text-slate-500">
                                {currentSlide + 1} / {slides.length}
                            </span>
                        </div>

                        <Button
                            onClick={handleNext}
                            className={`rounded-xl font-bold px-8 h-12 text-white shadow-lg transition-all ${isLastSlide
                                ? 'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 shadow-red-900/40'
                                : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/40'
                                }`}
                        >
                            {isLastSlide ? 'ابدأ الآن' : 'التالي'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
