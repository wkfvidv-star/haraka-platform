import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRight,
    ChevronLeft,
    X,
    Target,
    LayoutDashboard,
    Users,
    BarChart3,
    CalendarCheck,
    Zap,
    CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/contexts/ThemeContext';

// Define metadata for each section that we might want to highlight
const SECTION_METADATA: Record<string, { title: string, description: string, icon: React.ElementType }> = {
    teacher_navigation: {
        title: 'أدوات التنقل السريعة',
        description: 'تنقل بمرونة بين لوحة التحكم، إدارة الصفوف، بنك التمارين، التحديات، والتقارير الشاملة.',
        icon: LayoutDashboard
    },
    teacher_hero: {
        title: 'الترحيب والإحصائيات الحيوية',
        description: 'نظرة سريعة على إجمالي طلابك المتميزين ومستوى تفاعلهم ونشاطهم اليومي.',
        icon: Target
    },
    teacher_stats: {
        title: 'مؤشرات الأداء (KPIs)',
        description: 'راقب بدقة معدلات الحضور، متوسطات التقدم الرياضي، والتمارين المنجزة لتحسين خططك.',
        icon: BarChart3
    },
    teacher_quick_actions: {
        title: 'الإجراءات العاجلة',
        description: 'نقرة واحدة لاختصار الوقت: أضف تمرسناً، أنشئ تحدياً، أو سجل الحضور مباشرة من هنا.',
        icon: Zap
    },
    teacher_classes: {
        title: 'الصفوف والفصول',
        description: 'إدارة تفصيلية للفصول الدراسية وتتبع مستمر لحالة كل فصل على حدة.',
        icon: Users
    },
    teacher_tasks: {
        title: 'منظم المهام',
        description: 'جدول مهامك وترتيب أولوياتها، مع تذكيرات مستمرة لإعداد التقارير وتقييمات الطلاب.',
        icon: CheckCircle2
    }
};

interface TeacherOnboardingProps {
    onComplete: () => void;
    onSkip?: () => void;
    isNewUser?: boolean;
}

interface SlideData {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    targetElement?: Element;
}

export function TeacherOnboarding({ onComplete, onSkip, isNewUser = false }: TeacherOnboardingProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [slides, setSlides] = useState<SlideData[]>([]);
    const [isVisible, setIsVisible] = useState(true);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const { language } = useTranslation();
    const isRTL = language === 'ar';

    // Discover and build slides based on what's visible on the screen
    useEffect(() => {
        // Intro slide
        const initialSlide: SlideData = {
            id: 'welcome',
            title: isNewUser ? 'مرحباً بك أستاذي الكريم' : 'عودة موفقة أستاذي الجليل',
            description: isNewUser
                ? 'بصفتك القلب النابض في حركة، نضع بين يديك أدوات متقدمة لتشكيل مستقبل طاقات شبابنا.'
                : 'دعنا نستعرض سريعاً أهم مؤشرات اليوم لصفوفك وطلابك.',
            icon: CalendarCheck
        };

        const discoveredSlides: SlideData[] = [initialSlide];

        // Find all elements with data-tour attribute
        const tourElements = document.querySelectorAll('[data-tour]');

        tourElements.forEach((el) => {
            const sectionId = el.getAttribute('data-tour');
            if (sectionId && SECTION_METADATA[sectionId]) {
                discoveredSlides.push({
                    id: sectionId,
                    ...SECTION_METADATA[sectionId],
                    targetElement: el
                });
            }
        });

        setSlides(discoveredSlides);

        // Lock body scroll when onboarding is active
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isNewUser]);

    // Update highlight rectangle based on current slide's target
    useEffect(() => {
        if (slides.length > 0 && currentStep > 0 && currentStep < slides.length) {
            const currentSlide = slides[currentStep];
            if (currentSlide.targetElement) {
                // Calculate position
                const rect = currentSlide.targetElement.getBoundingClientRect();
                setTargetRect(rect);

                // Scroll element into view smoothly, keeping it roughly in the center
                currentSlide.targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });

                // Add a highlight class to the target element
                currentSlide.targetElement.classList.add('tour-highlight-active');

                return () => {
                    currentSlide.targetElement?.classList.remove('tour-highlight-active');
                };
            }
        } else {
            setTargetRect(null);
        }
    }, [currentStep, slides]);

    // Recalculate rectangle on window resize
    useEffect(() => {
        const handleResize = () => {
            if (slides.length > 0 && currentStep > 0 && slides[currentStep]?.targetElement) {
                setTargetRect(slides[currentStep].targetElement!.getBoundingClientRect());
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [currentStep, slides]);

    const handleNext = () => {
        if (currentStep < slides.length - 1) {
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
            if (onSkip) onSkip();
        }, 400); // Wait for fade out animation
    };

    if (!isVisible || slides.length === 0) return null;

    const currentSlide = slides[currentStep];
    const Icon = currentSlide.icon;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none" dir={isRTL ? "rtl" : "ltr"}>
            {/* Dark Backdrop */}
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-blue-950/85 pointer-events-auto backdrop-blur-[3px] transition-all duration-300"
                    onClick={handleNext}
                />
            </AnimatePresence>

            {/* Target Element Highlighting Cutout */}
            {targetRect && currentStep > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: 1,
                        top: targetRect.top - 16,
                        left: targetRect.left - 16,
                        width: targetRect.width + 32,
                        height: targetRect.height + 32,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                        opacity: { duration: 0.2 }
                    }}
                    className="absolute rounded-2xl border-[3px] border-indigo-400 shadow-[0_0_0_9999px_rgba(23,37,84,0.7)] z-[201] pointer-events-none bg-transparent"
                    style={{
                        boxShadow: '0 0 0 9999px rgba(30,27,75,0.85), 0 0 40px rgba(99, 102, 241, 0.4) inset'
                    }}
                />
            )}

            {/* Slide Content Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                        "relative z-[202] w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden pointer-events-auto font-cairo",
                        "border border-slate-200 dark:border-slate-800",
                        // Position near the highlighted element if there is one, otherwise center
                        targetRect && currentStep > 0 ? "absolute" : "mx-4"
                    )}
                    style={targetRect && currentStep > 0 ? {
                        // Position below the element if there's room, otherwise above
                        top: targetRect.bottom + 40 + 300 > window.innerHeight
                            ? Math.max(20, targetRect.top - 320)
                            : targetRect.bottom + 40,
                        // Center horizontally relative to the element, but keep within viewport
                        left: Math.max(20, Math.min(
                            window.innerWidth - 420 /* max-w width approx */,
                            targetRect.left + (targetRect.width / 2) - 200
                        ))
                    } : {}}
                >
                    {/* Header Progress Bar */}
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800">
                        <motion.div
                            className="h-full bg-indigo-500"
                            initial={{ width: `${((currentStep) / slides.length) * 100}%` }}
                            animate={{ width: `${((currentStep + 1) / slides.length) * 100}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>

                    <div className="p-6 sm:p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/40 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                <Icon className="w-7 h-7" />
                            </div>
                            <button
                                onClick={finishOnboarding}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-3 tracking-wide">
                            {currentSlide.title}
                        </h3>

                        <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-8">
                            {currentSlide.description}
                        </p>

                        {/* Controls */}
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-bold text-slate-500">
                                {currentStep + 1} / {slides.length}
                            </div>

                            <div className="flex gap-3">
                                {currentStep > 0 && (
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={handlePrev}
                                        className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-white"
                                    >
                                        {isRTL ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                                    </Button>
                                )}

                                <Button
                                    onClick={handleNext}
                                    className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-8 font-bold shadow-lg shadow-indigo-500/20"
                                >
                                    {currentStep === slides.length - 1 ? 'إنهاء الجولة' : 'التالي'}
                                    {currentStep !== slides.length - 1 && (
                                        isRTL ? <ChevronLeft className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 ml-2" />
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
