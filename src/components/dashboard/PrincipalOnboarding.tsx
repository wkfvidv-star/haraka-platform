import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRight,
    ChevronLeft,
    X,
    Target,
    Users,
    Globe,
    BarChart3,
    Activity,
    Brain
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/contexts/ThemeContext';

// Define metadata for each section that we might want to highlight
const SECTION_METADATA: Record<string, { title: string, description: string, icon: React.ElementType }> = {
    ai_systems: {
        title: 'أنظمة الرؤى والذكاء التنبؤي',
        description: 'لوحة القيادة الذكية التي تحلل البيانات وتتنبأ بالنتائج الأكاديمية وتقدم توصيات استباقية لإدارة المدرسة بنجاح.',
        icon: Brain
    },
    quick_stats: {
        title: 'الإحصائيات السريعة',
        description: 'نظرة عامة فورية على أعداد الطلاب، المعلمين النشطين، ومعدلات الحضور لضمان سير العملية التعليمية بسلاسة.',
        icon: Activity
    },
    main_tabs: {
        title: 'مركز التحكم الشامل',
        description: 'تنقل بسهولة بين التحليلات التفصيلية، تقارير المعلمين والطلاب، ونظرة عامة على أحدث الأنشطة والفعاليات في مدرستك.',
        icon: Globe
    }
};

interface PrincipalOnboardingProps {
    onComplete: () => void;
    isNewUser?: boolean;
}

interface SlideData {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    targetElement?: Element;
}

export function PrincipalOnboarding({ onComplete, isNewUser = false }: PrincipalOnboardingProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [slides, setSlides] = useState<SlideData[]>([]);
    const [isVisible, setIsVisible] = useState(true);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const { language } = useTranslation();
    const isRTL = language === 'ar';

    // Discover and build slides based on what's visible on the screen
    useEffect(() => {
        // We always start with an intro slide
        const initialSlide: SlideData = {
            id: 'welcome',
            title: isNewUser ? 'مرحباً بك في لوحة تحكم الإدارة' : 'عودة حميدة أيها المدير',
            description: isNewUser
                ? 'دعنا نأخذ جولة سريعة لاكتشاف أنظمة الذكاء الاصطناعي والتحليلات التي ستساعدك في قيادة المدرسة نحو التميز.'
                : 'دعنا نستعرض سريعاً أهم المؤشرات والتحليلات الاستراتيجية لليوم.',
            icon: Target
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
        }, 400); // Wait for fade out animation
    };

    if (!isVisible || slides.length === 0) return null;

    const currentSlide = slides[currentStep];
    const Icon = currentSlide.icon;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
            {/* Dark Backdrop */}
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/70 pointer-events-auto backdrop-blur-sm transition-all duration-300"
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
                    className="absolute rounded-xl border-2 border-blue-500 shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] z-[101] pointer-events-none bg-transparent"
                    style={{
                        boxShadow: '0 0 0 9999px rgba(0,0,0,0.7), 0 0 30px rgba(59, 130, 246, 0.5) inset'
                    }}
                />
            )}

            {/* Slide Content Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                        "relative z-[102] w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden pointer-events-auto",
                        // Position near the highlighted element if there is one, otherwise center
                        targetRect && currentStep > 0 ? "absolute" : "mx-4"
                    )}
                    style={targetRect && currentStep > 0 ? {
                        // Position below the element if there's room, otherwise above
                        top: targetRect.bottom + 40 + 300 > window.innerHeight
                            ? Math.max(20, targetRect.top - 300)
                            : targetRect.bottom + 40,
                        // Center horizontally relative to the element, but keep within viewport
                        left: Math.max(20, Math.min(
                            window.innerWidth - 420 /* max-w width approx */,
                            targetRect.left + (targetRect.width / 2) - 200
                        ))
                    } : {}}
                >
                    {/* Header Progress Bar */}
                    <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700">
                        <motion.div
                            className="h-full bg-blue-600"
                            initial={{ width: `${((currentStep) / slides.length) * 100}%` }}
                            animate={{ width: `${((currentStep + 1) / slides.length) * 100}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>

                    <div className="p-6 sm:p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <Icon className="w-6 h-6" />
                            </div>
                            <button
                                onClick={finishOnboarding}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                            {currentSlide.title}
                        </h3>

                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                            {currentSlide.description}
                        </p>

                        {/* Controls */}
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-medium text-gray-500">
                                {currentStep + 1} / {slides.length}
                            </div>

                            <div className="flex gap-2">
                                {currentStep > 0 && (
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={handlePrev}
                                        className="rounded-full"
                                    >
                                        {isRTL ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                                    </Button>
                                )}

                                <Button
                                    onClick={handleNext}
                                    className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-6"
                                >
                                    {currentStep === slides.length - 1 ? 'ابدأ العمل' : 'التالي'}
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
