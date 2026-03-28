import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Building2,
    School,
    UserCheck,
    BarChart3,
    Video,
    HeartPulse,
    FileText,
    Brain,
    Layers,
    Rocket,
    ChevronRight,
    ChevronLeft
} from 'lucide-react';

interface OnboardingSlide {
    title: string;
    description: string;
    icon: React.ElementType;
}

const slides: OnboardingSlide[] = [
    {
        title: 'مرحبًا بك في واجهة مديرية التربية',
        description: 'تمنحك هذه الواجهة نظرة شاملة على جميع المدارس، المديرين، المعلمين، والتلاميذ تحت إشرافك، مع أدوات ذكية لتحليل الأداء واتخاذ القرارات.',
        icon: Building2
    },
    {
        title: 'متابعة المدارس',
        description: 'يمكنك الاطلاع على كل المدارس التابعة للمديرية، عدد التلاميذ، عدد المعلمين، ومستوى الأداء العام لكل مدرسة.',
        icon: School
    },
    {
        title: 'متابعة مديري المدارس',
        description: 'راقب أداء مديري المدارس، نشاطاتهم، ومستوى إدارة المعلمين والتلاميذ ضمن كل مدرسة.',
        icon: UserCheck
    },
    {
        title: 'متابعة الأداء العام',
        description: 'اطلع على مؤشرات الأداء على مستوى الولاية، بما في ذلك النشاط البدني، الأداء المعرفي، والرفاه النفسي للتلاميذ.',
        icon: BarChart3
    },
    {
        title: 'تحليل الفيديو',
        description: 'مشاهدة وتحليل فيديوهات الأداء لجميع المدارس لتقييم جودة التدريب ومراقبة التقدم.',
        icon: Video
    },
    {
        title: 'متابعة الحالة الصحية والنفسية',
        description: 'راقب مؤشرات الصحة النفسية والبدنية للتلاميذ عبر المدارس، مع إمكانية مقارنة الأداء بين المؤسسات التعليمية.',
        icon: HeartPulse
    },
    {
        title: 'إنشاء التقارير والتحليلات',
        description: 'يمكنك إنشاء تقارير شاملة على مستوى الولاية وإرسالها للإدارة العليا أو الجهات الرسمية، أو تصديرها PDF / Excel.',
        icon: FileText
    },
    {
        title: 'الأدوات الذكية',
        description: 'المدرب الافتراضي والمساعد الذكي يساعدانك على اقتراح سياسات تطويرية وتحسين الأداء على مستوى جميع المدارس.',
        icon: Brain
    },
    {
        title: 'التنقل متعدد المستويات',
        description: 'سهولة التنقل من مستوى الولاية ← المدارس ← المديرين ← المعلمين ← التلاميذ للوصول لأي بيانات بسرعة.',
        icon: Layers
    },
    {
        title: 'ابدأ إدارة المديرية',
        description: 'استكشف لوحة التحكم وابدأ مراقبة جميع الأنشطة التعليمية، الصحة، الأداء، والتقارير خطوة بخطوة.',
        icon: Rocket
    }
];

interface DirectorateOnboardingProps {
    onComplete: () => void;
    onSkip?: () => void;
}

export const DirectorateOnboarding: React.FC<DirectorateOnboardingProps> = ({ onComplete, onSkip }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [direction, setDirection] = useState(1);

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setDirection(1);
            setCurrentSlide(prev => prev + 1);
        } else {
            onComplete();
        }
    };

    const handlePrev = () => {
        if (currentSlide > 0) {
            setDirection(-1);
            setCurrentSlide(prev => prev - 1);
        }
    };

    const currentData = slides[currentSlide];
    const Icon = currentData.icon;

    const variants = {
        enter: (dir: number) => ({
            x: dir > 0 ? 100 : -100,
            opacity: 0,
            scale: 0.95
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: { duration: 0.4, type: 'spring', bounce: 0.2 }
        },
        exit: (dir: number) => ({
            x: dir > 0 ? -100 : 100,
            opacity: 0,
            scale: 0.95,
            transition: { duration: 0.3 }
        })
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4" dir="rtl">
            <Card className="w-full max-w-3xl overflow-hidden bg-slate-900 border-slate-800 shadow-2xl relative">

                {/* Skip Button */}
                <Button
                    variant="ghost"
                    onClick={onSkip || onComplete}
                    className="absolute top-4 right-4 z-10 text-slate-400 hover:text-white"
                >
                    تخطي
                </Button>

                {/* Top Progress Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800">
                    <motion.div
                        className="h-full bg-blue-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>

                <div className="relative h-[480px] p-8 md:p-12 flex flex-col">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={currentSlide}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="flex-1 flex flex-col items-center justify-center text-center space-y-6"
                        >
                            <div className="w-24 h-24 bg-blue-500/10 rounded-3xl flex items-center justify-center border border-blue-500/20 mb-4 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                                <Icon className="w-12 h-12 text-blue-500" />
                            </div>

                            <h2 className="text-3xl md:text-4xl font-black text-white px-4 leading-tight">
                                {currentData.title}
                            </h2>

                            <p className="text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed">
                                {currentData.description}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    {/* Controls */}
                    <div className="mt-8 flex items-center justify-between z-10">
                        <Button
                            variant="outline"
                            onClick={handlePrev}
                            disabled={currentSlide === 0}
                            className={`border-slate-700 bg-slate-800/50 hover:bg-slate-700 text-white rounded-xl ${currentSlide === 0 ? 'opacity-0 pointer-events-none' : ''}`}
                        >
                            <ChevronRight className="w-4 h-4 ml-2" />
                            السابق
                        </Button>

                        {/* Dots */}
                        <div className="flex items-center gap-2" dir="ltr">
                            {slides.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-blue-500' : 'w-2 bg-slate-700'
                                        }`}
                                />
                            ))}
                        </div>

                        <Button
                            onClick={handleNext}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 px-8"
                        >
                            {currentSlide === slides.length - 1 ? (
                                'ابدأ الآن'
                            ) : (
                                <>
                                    التالي
                                    <ChevronLeft className="w-4 h-4 mr-2" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};
