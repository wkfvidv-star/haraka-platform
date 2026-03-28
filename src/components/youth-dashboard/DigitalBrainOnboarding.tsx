import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Brain, Activity, Target, Sparkles, ChevronLeft, ShieldCheck, Zap } from 'lucide-react';

interface DigitalBrainOnboardingProps {
    onComplete: () => void;
}

export function DigitalBrainOnboarding({ onComplete }: DigitalBrainOnboardingProps) {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            id: 'intro',
            title: 'ما هو العقل الرقمي؟',
            subtitle: 'رفيقك الذكي لتحقيق أقصى إمكاناتك',
            description: 'العقل الرقمي هو المحرك الذي يدير منصة حَرَكة. يجمع كل بياناتك الحيوية، المعرفية، والنفسية في مكان واحد آمن ليصنع لك مساراً لا يشبه أحداً غيرك.',
            icon: Brain,
            color: 'text-indigo-500',
            bg: 'bg-indigo-500/10'
        },
        {
            id: 'process',
            title: 'كيف يحلل الأداء؟',
            subtitle: '10,000 نقطة بيانات تُعالج في ثوانٍ',
            description: 'بفضل خوارزميات الذكاء الاصطناعي المتقدمة، يقوم العقل الرقمي بتحليل حركتك عبر الكاميرا وكشف الزوايا الدقيقة، ليرشدك للإصلاحات الفورية ويقيك من الإصابات.',
            icon: Activity,
            color: 'text-orange-500',
            bg: 'bg-orange-500/10'
        },
        {
            id: 'outcome',
            title: 'النتيجة: نموذجك الخارق',
            subtitle: 'خطة ديناميكية تتطور معك يومياً',
            description: 'لن تحتاج لخطط ثابتة بعد اليوم. العقل الرقمي يواكب تقدمك ويُعَدِّل كثافة التمارين ونظامك الغذائي تلقائياً لضمان تطورك المستمر والوصول لأهدافك بدقة.',
            icon: ShieldCheck,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10'
        }
    ];

    const nextSlide = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(c => c + 1);
        } else {
            onComplete();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 font-arabic bg-slate-900" dir="rtl">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px]"
            >
                {/* Visual Area */}
                <div className="w-full md:w-1/2 bg-black relative flex flex-col items-center justify-center p-10 overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={currentSlide}
                            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 1.1, rotate: 5 }}
                            transition={{ duration: 0.5, type: 'spring' }}
                            className="relative z-10 flex flex-col items-center text-center"
                        >
                            <div className={`w-36 h-36 rounded-full ${slides[currentSlide].bg} flex items-center justify-center mb-8 relative`}>
                                <div className="absolute inset-0 bg-white/5 rounded-full animate-ping" />
                                {React.createElement(slides[currentSlide].icon, { className: `w-16 h-16 ${slides[currentSlide].color} drop-shadow-[0_0_15px_currentColor]` })}
                            </div>
                            <h3 className="text-3xl font-black text-white px-4">{slides[currentSlide].title}</h3>
                            <p className="text-indigo-400 font-bold mt-2 uppercase tracking-widest text-sm">{slides[currentSlide].subtitle}</p>
                        </motion.div>
                    </AnimatePresence>

                    {/* Matrix Effect Background */}
                    <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
                </div>

                {/* Content Area */}
                <div className="w-full md:w-1/2 p-10 lg:p-14 flex flex-col justify-center relative bg-slate-900">
                    <div className="mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-indigo-500" />
                        <span className="font-extrabold text-slate-400 text-sm tracking-widest">DIGITAL BRAIN ENGINE</span>
                    </div>
                    
                    <div className="min-h-[120px] mb-10">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSlide}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <p className="text-slate-300 text-lg leading-relaxed font-semibold">
                                    {slides[currentSlide].description}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                        <div className="flex gap-2">
                            {slides.map((_, idx) => (
                                <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-indigo-500' : 'w-2 bg-slate-700'}`} />
                            ))}
                        </div>
                        
                        <Button 
                            onClick={nextSlide}
                            size="lg"
                            className="bg-white text-slate-900 hover:bg-slate-200 font-black px-8 py-6 rounded-2xl text-lg group"
                        >
                            {currentSlide === slides.length - 1 ? 'متابعة لمنصتك' : 'التالي'}
                            <ChevronLeft className="w-5 h-5 ml-2 group-hover:-translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
