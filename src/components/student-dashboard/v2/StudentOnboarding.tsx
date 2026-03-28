import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles, Activity, Brain, Heart, HeartPulse,
    Video, FileText, UserCheck, MessageSquare, PlayCircle,
    ChevronRight, ChevronLeft, X, ArrowRight
} from 'lucide-react';

interface SlideData {
    title: string;
    description: string;
    icon: React.ElementType;
    bg: string;           // full-screen background gradient
    iconBg: string;       // icon box color
    textColor: string;    // main text color
    descColor: string;    // description color
    btnBg: string;        // button background
    dotColor: string;     // progress dot
}

const slides: SlideData[] = [
    {
        title: "مرحبًا بك في حركة",
        description: "منصتك الذكية المتخصصة في تطوير القدرات البدنية والذهنية واكتشاف إمكاناتك الحقيقية.",
        icon: Sparkles,
        bg: "linear-gradient(160deg, #6C3DE0 0%, #9B5DE5 40%, #F15BB5 100%)",
        iconBg: "rgba(255,255,255,0.25)",
        textColor: "#FFFFFF",
        descColor: "rgba(255,255,255,0.80)",
        btnBg: "rgba(255,255,255,0.22)",
        dotColor: "#fff"
    },
    {
        title: "تطوير الأداء الحركي",
        description: "تمارين مصممة لتحسين السرعة، الرشاقة، التوازن والتنسيق الحركي.",
        icon: Activity,
        bg: "linear-gradient(160deg, #0F4C75 0%, #1282A2 45%, #00B4D8 100%)",
        iconBg: "rgba(255,255,255,0.22)",
        textColor: "#FFFFFF",
        descColor: "rgba(255,255,255,0.80)",
        btnBg: "rgba(255,255,255,0.20)",
        dotColor: "#fff"
    },
    {
        title: "تطوير الأداء المعرفي",
        description: "تمارين تفاعلية لتطوير التركيز وسرعة اتخاذ القرار أثناء الحركة.",
        icon: Brain,
        bg: "linear-gradient(160deg, #1A1A2E 0%, #16213E 40%, #0F3460 80%, #533483 100%)",
        iconBg: "rgba(255,255,255,0.18)",
        textColor: "#FFFFFF",
        descColor: "rgba(255,255,255,0.75)",
        btnBg: "rgba(255,255,255,0.15)",
        dotColor: "#a78bfa"
    },
    {
        title: "الرفاه النفسي",
        description: "أنشطة لتعزيز الثقة بالنفس والتحفيز والقدرة على مواجهة التحديات.",
        icon: Heart,
        bg: "linear-gradient(160deg, #FF6B6B 0%, #EE4D6F 40%, #C9184A 100%)",
        iconBg: "rgba(255,255,255,0.22)",
        textColor: "#FFFFFF",
        descColor: "rgba(255,255,255,0.82)",
        btnBg: "rgba(255,255,255,0.20)",
        dotColor: "#fff"
    },
    {
        title: "التأهيل الحركي",
        description: "برامج موجهة لتحسين الحركة واستعادة القدرات البدنية بطريقة آمنة.",
        icon: HeartPulse,
        bg: "linear-gradient(160deg, #F77F00 0%, #FCBF49 45%, #EAE2B7 100%)",
        iconBg: "rgba(0,0,0,0.18)",
        textColor: "#1A0A00",
        descColor: "rgba(30,15,0,0.72)",
        btnBg: "rgba(0,0,0,0.14)",
        dotColor: "#F77F00"
    },
    {
        title: "تحليل الأداء عبر الفيديو",
        description: "ارفع فيديو أدائك وسيحلل النظام حركاتك ويقدم ملاحظات دقيقة.",
        icon: Video,
        bg: "linear-gradient(160deg, #004E89 0%, #0077B6 40%, #00B4D8 100%)",
        iconBg: "rgba(255,255,255,0.22)",
        textColor: "#FFFFFF",
        descColor: "rgba(255,255,255,0.80)",
        btnBg: "rgba(255,255,255,0.20)",
        dotColor: "#fff"
    },
    {
        title: "الملف الصحي للجسم",
        description: "تابع مؤشرات جسمك الصحية والبدنية وراقب تقدمك بدقة.",
        icon: FileText,
        bg: "linear-gradient(160deg, #1B4332 0%, #2D6A4F 40%, #52B788 100%)",
        iconBg: "rgba(255,255,255,0.22)",
        textColor: "#FFFFFF",
        descColor: "rgba(255,255,255,0.80)",
        btnBg: "rgba(255,255,255,0.20)",
        dotColor: "#fff"
    },
    {
        title: "المدرب الافتراضي",
        description: "مدرب ذكي يقدم إرشادات ونصائح تدريبية مخصصة حسب مستواك.",
        icon: UserCheck,
        bg: "linear-gradient(160deg, #3A0CA3 0%, #4361EE 45%, #4CC9F0 100%)",
        iconBg: "rgba(255,255,255,0.22)",
        textColor: "#FFFFFF",
        descColor: "rgba(255,255,255,0.80)",
        btnBg: "rgba(255,255,255,0.20)",
        dotColor: "#fff"
    },
    {
        title: "المساعد الذكي",
        description: "اطرح أسئلتك واحصل على إرشادات حول الأنشطة في أي وقت.",
        icon: MessageSquare,
        bg: "linear-gradient(160deg, #212529 0%, #343A40 40%, #495057 100%)",
        iconBg: "rgba(255,255,255,0.20)",
        textColor: "#FFFFFF",
        descColor: "rgba(255,255,255,0.75)",
        btnBg: "rgba(255,255,255,0.16)",
        dotColor: "#6C757D"
    },
    {
        title: "ابدأ رحلتك !",
        description: "استكشف الأنشطة والأدوات الذكية وطوّر نفسك خطوة بخطوة.",
        icon: PlayCircle,
        bg: "linear-gradient(160deg, #007200 0%, #38B000 45%, #70E000 100%)",
        iconBg: "rgba(0,0,0,0.18)",
        textColor: "#0A1700",
        descColor: "rgba(10,23,0,0.68)",
        btnBg: "rgba(0,0,0,0.16)",
        dotColor: "#007200"
    }
];

interface StudentOnboardingProps {
    onComplete: () => void;
    onSkip: () => void;
}

export function StudentOnboarding({ onComplete, onSkip }: StudentOnboardingProps) {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [direction, setDirection] = useState(1);

    const slide = slides[currentSlideIndex];
    const isLastSlide = currentSlideIndex === slides.length - 1;

    const goNext = () => {
        if (!isLastSlide) {
            setDirection(1);
            setCurrentSlideIndex(p => p + 1);
        } else {
            onComplete();
        }
    };

    const goPrev = () => {
        if (currentSlideIndex > 0) {
            setDirection(-1);
            setCurrentSlideIndex(p => p - 1);
        }
    };

    const handleDragEnd = (_: any, info: any) => {
        if (info.offset.x > 60) goPrev();
        else if (info.offset.x < -60) goNext();
    };

    const slideVariants = {
        enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (d: number) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
    };

    return (
        <div
            className="fixed inset-0 z-[100] overflow-hidden select-none"
            dir="rtl"
            style={{ fontFamily: "'Almarai', 'Tajawal', sans-serif" }}
        >
            {/* Animated full-screen background */}
            <AnimatePresence>
                <motion.div
                    key={`bg-${currentSlideIndex}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.55, ease: 'easeInOut' }}
                    className="absolute inset-0"
                    style={{ background: slide.bg }}
                />
            </AnimatePresence>

            {/* Decorative circles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/8 blur-3xl" />
                <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-white/6 blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/4 blur-3xl" />
            </div>

            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 pt-10 pb-4">
                {/* Slide counter */}
                <div
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold"
                    style={{ background: 'rgba(0,0,0,0.18)', color: slide.textColor, backdropFilter: 'blur(10px)' }}
                >
                    <span>{currentSlideIndex + 1}</span>
                    <span style={{ opacity: 0.5 }}>/</span>
                    <span style={{ opacity: 0.6 }}>{slides.length}</span>
                </div>

                {/* Skip button */}
                <button
                    onClick={onSkip}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 hover:scale-105 active:scale-95"
                    style={{
                        background: 'rgba(0,0,0,0.18)',
                        color: slide.textColor,
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <X className="w-4 h-4" />
                    تخطي
                </button>
            </div>

            {/* Progress bar */}
            <div className="absolute top-[72px] left-6 right-6 z-20">
                <div className="h-1 rounded-full" style={{ background: 'rgba(0,0,0,0.18)' }}>
                    <motion.div
                        className="h-full rounded-full"
                        animate={{ width: `${((currentSlideIndex + 1) / slides.length) * 100}%` }}
                        transition={{ duration: 0.4 }}
                        style={{ background: slide.textColor, opacity: 0.7 }}
                    />
                </div>
            </div>

            {/* Slide content */}
            <div className="absolute inset-0 flex items-center justify-center px-8">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={currentSlideIndex}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.6}
                        onDragEnd={handleDragEnd}
                        className="w-full max-w-lg flex flex-col items-center text-center gap-8"
                    >
                        {/* Icon */}
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 18 }}
                            className="w-36 h-36 rounded-[2.5rem] flex items-center justify-center shadow-2xl"
                            style={{
                                background: slide.iconBg,
                                backdropFilter: 'blur(20px)',
                                border: '2px solid rgba(255,255,255,0.25)',
                                boxShadow: '0 32px 80px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)'
                            }}
                        >
                            {React.createElement(slide.icon, {
                                className: "w-20 h-20",
                                style: { color: slide.textColor, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))' }
                            })}
                        </motion.div>

                        {/* Text */}
                        <div className="space-y-4">
                            <motion.h1
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.18, duration: 0.4 }}
                                className="font-black leading-tight"
                                style={{
                                    fontSize: 'clamp(2.2rem, 6vw, 3.8rem)',
                                    color: slide.textColor,
                                    textShadow: '0 2px 20px rgba(0,0,0,0.15)'
                                }}
                            >
                                {slide.title}
                            </motion.h1>

                            <motion.p
                                initial={{ y: 16, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.28, duration: 0.4 }}
                                className="font-medium leading-relaxed"
                                style={{
                                    fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
                                    color: slide.descColor,
                                    maxWidth: '36ch',
                                    margin: '0 auto'
                                }}
                            >
                                {slide.description}
                            </motion.p>
                        </div>

                        {/* Final CTA */}
                        {isLastSlide && (
                            <motion.button
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                onClick={onComplete}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.97 }}
                                className="mt-4 px-12 py-5 rounded-2xl font-black text-xl shadow-2xl"
                                style={{
                                    background: slide.textColor,
                                    color: slide.bg.includes('#0A1700') ? '#007200' : (slide.bg.includes('#1A0A00') ? '#F77F00' : '#1a1a2e'),
                                    boxShadow: '0 20px 60px rgba(0,0,0,0.35)'
                                }}
                            >
                                ابدأ الآن 🚀
                            </motion.button>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Bottom nav */}
            <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col items-center gap-6 px-8 pb-12">

                {/* Dot indicators */}
                <div className="flex items-center gap-2">
                    {slides.map((s, i) => (
                        <motion.button
                            key={i}
                            onClick={() => {
                                setDirection(i > currentSlideIndex ? 1 : -1);
                                setCurrentSlideIndex(i);
                            }}
                            animate={{
                                width: i === currentSlideIndex ? 32 : 8,
                                opacity: i === currentSlideIndex ? 1 : 0.35,
                            }}
                            transition={{ duration: 0.3 }}
                            className="h-2 rounded-full"
                            style={{ background: slide.textColor }}
                        />
                    ))}
                </div>

                {/* Navigation buttons */}
                <div className="w-full flex items-center justify-between max-w-sm">
                    <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={goPrev}
                        className="flex items-center gap-2 px-7 py-4 rounded-2xl text-lg font-bold transition-all"
                        style={{
                            background: currentSlideIndex === 0 ? 'transparent' : 'rgba(0,0,0,0.18)',
                            color: currentSlideIndex === 0 ? 'transparent' : slide.textColor,
                            backdropFilter: 'blur(10px)',
                            pointerEvents: currentSlideIndex === 0 ? 'none' : 'auto',
                            border: `1.5px solid ${currentSlideIndex === 0 ? 'transparent' : 'rgba(255,255,255,0.2)'}`
                        }}
                    >
                        <ChevronRight className="w-5 h-5" />
                        السابق
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={goNext}
                        className="flex items-center gap-2 px-8 py-4 rounded-2xl text-lg font-black shadow-xl"
                        style={{
                            background: slide.textColor,
                            color: '#1a1a2e',
                            boxShadow: '0 12px 40px rgba(0,0,0,0.25)'
                        }}
                    >
                        {isLastSlide ? 'ابدأ' : 'التالي'}
                        <ChevronLeft className="w-5 h-5" />
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
