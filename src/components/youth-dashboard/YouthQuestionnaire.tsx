import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
    Flame, Brain, Dumbbell, HeartPulse, Clock, Activity, Target, 
    Sparkles, ChevronLeft, Check, ArrowRight, Camera, Trophy, Gift, Gamepad2, Play, Compass 
} from 'lucide-react';

export type QuestionnaireData = { 
    goal: string; 
    level: string; 
    commitment: string;
    tech: string;
    motivation: string;
    creation: string;
};

interface YouthQuestionnaireProps {
    onComplete: (data: QuestionnaireData) => void;
}

export default function YouthQuestionnaire({ onComplete }: YouthQuestionnaireProps) {
    const [step, setStep] = useState(1);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    
    // State to store user selections (can be sent to backend later)
    const [selections, setSelections] = useState<QuestionnaireData>({
        goal: '',
        level: '',
        commitment: '',
        tech: '',
        motivation: '',
        creation: ''
    });

    // --- STEP 1: Primary Goal ---
    const goals = [
        { id: 'muscle', label: 'بناء العضلات', desc: 'زيادة القوة والكتلة العضلية', icon: Dumbbell, color: 'text-orange-500', bg: 'bg-orange-50' },
        { id: 'weight-loss', label: 'إنقاص الوزن والتنشيف', desc: 'حرق الدهون ونحت الجسم', icon: Flame, color: 'text-red-500', bg: 'bg-red-50' },
        { id: 'endurance', label: 'التحمل واللياقة', desc: 'رفع مستوى اللياقة القلبية والتنفسية', icon: HeartPulse, color: 'text-rose-500', bg: 'bg-rose-50' },
        { id: 'agility', label: 'المرونة والسرعة', desc: 'تحسين ردود الفعل، التوازن، وخفة الحركة', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
        { id: 'functional', label: 'اللياقة الوظيفية', desc: 'قوة الأداء للحياة اليومية والمهام الحركية', icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { id: 'focus', label: 'التركيز والأداء الذهني', desc: 'تطوير القدرات المعرفية وتقليل التوتر', icon: Brain, color: 'text-purple-500', bg: 'bg-purple-50' },
        { id: 'rehab', label: 'الشفاء والتأهيل الرياضي', desc: 'تصحيح القوام والوقاية من الإصابات', icon: Sparkles, color: 'text-teal-500', bg: 'bg-teal-50' },
        { id: 'health', label: 'أسلوب حياة نشط', desc: 'بناء روتين يومي صحي ومستدام', icon: Check, color: 'text-sky-500', bg: 'bg-sky-50' },
        { id: 'other', label: 'أخرى (تصفح المكتبة)', desc: 'حرية استكشاف جميع أقسام المنصة', icon: Compass, color: 'text-indigo-500', bg: 'bg-indigo-50' }
    ];

    // --- STEP 2: Activity Level ---
    const levels = [
        { id: 'beginner', label: 'مبتدئ', desc: 'أبدأ رحلتي الرياضية للتو', icon: Target },
        { id: 'intermediate', label: 'متوسط', desc: 'أمارس الرياضة بشكل متقطع', icon: Flame },
        { id: 'pro', label: 'متقدم', desc: 'رياضي محترف وأتدرب بانتظام', icon: Sparkles }
    ];

    // --- STEP 3: Time Commitment ---
    const times = [
        { id: '15', label: '15 دقيقة', desc: 'جلسات مكثفة وقصيرة', icon: Clock },
        { id: '30', label: '30 دقيقة', desc: 'نصف ساعة يومياً كافية', icon: Clock },
        { id: '60', label: 'ساعة فأكثر', desc: 'تطوير شامل ومستمر', icon: Clock }
    ];

    // --- STEP 4: Tech Interest (AI vs AR) ---
    const techs = [
        { id: 'ar', label: 'الواقع المعزز (AR)', desc: 'تجربة غامرة وتفاعلية مع مدرب ثلاثي الأبعاد', icon: Camera, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { id: 'smart', label: 'الخطط التكيفية الذكية', desc: 'جلسات تتكيف أوتوماتيكياً مع مستواي', icon: Brain, color: 'text-indigo-500', bg: 'bg-indigo-50' },
        { id: 'motion', label: 'تصحيح الحركة المباشر', desc: 'تحليل حركتي وتصحيحها فورياً عبر الكاميرا', icon: Activity, color: 'text-rose-500', bg: 'bg-rose-50' }
    ];

    // --- STEP 5: Motivation Profile ---
    const motivations = [
        { id: 'compete', label: 'المنافسة والتحدي', desc: 'تصدر لوحات الصدارة وتحدي الأصدقاء', icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-50' },
        { id: 'rewards', label: 'نظام المكافآت', desc: 'جمع النقاط واستبدالها بجوائز حصرية', icon: Gift, color: 'text-pink-500', bg: 'bg-pink-50' },
        { id: 'self', label: 'التطور الشخصي', desc: 'نمو هادئ وتتبع دقيق وعميق للأداء', icon: Target, color: 'text-sky-500', bg: 'bg-sky-50' }
    ];

    // --- STEP 6: Content Creation ---
    const creations = [
        { id: 'creator', label: 'أود صناعة الألعاب', desc: 'استخدام مختبر حركة لبناء ألعابي الحركية الخاصة ومشاركتها', icon: Gamepad2, color: 'text-purple-500', bg: 'bg-purple-50' },
        { id: 'player', label: 'أود التجربة فقط', desc: 'أريد التركيز على اللعب واكتشاف مهاراتي', icon: Play, color: 'text-orange-500', bg: 'bg-orange-50' }
    ];

    const handleSelect = (key: keyof QuestionnaireData, value: string) => {
        setSelections(prev => ({ ...prev, [key]: value }));
        
        // Auto-advance
        setTimeout(() => {
            if (step < 6) {
                setStep(prev => prev + 1);
            } else {
                finishQuestionnaire();
            }
        }, 300);
    };

    const finishQuestionnaire = () => {
        setIsAnalyzing(true);
        // Simulate AI analyzing their profile based on all 6 dimensions
        setTimeout(() => {
            onComplete(selections);
        }, 4000);
    };

    const slideVariants = {
        enter: (direction: number) => ({ x: direction > 0 ? -20 : 20, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (direction: number) => ({ x: direction < 0 ? 20 : -20, opacity: 0 })
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden" dir="rtl">
            {/* Clean minimal background blur effect */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />

            <Card className="bg-white/90 backdrop-blur-xl border-slate-200/60 shadow-2xl rounded-[3rem] overflow-hidden relative p-2 lg:p-4 w-full max-w-4xl z-10">
                {/* Progress Bar Header */}
            <div className="flex items-center justify-between p-6 pb-2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-md">
                        <Sparkles className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                        <h3 className="font-black text-slate-900 leading-tight">تخصيص تجربتك الرياضية</h3>
                        <p className="text-xs font-bold text-slate-400">ملفك الرياضي المتكامل</p>
                    </div>
                </div>
                
                {!isAnalyzing && (
                    <div className="flex items-center gap-1.5">
                       {[1, 2, 3, 4, 5, 6].map(i => (
                           <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i <= step ? 'bg-orange-500 w-6 shadow-[0_0_8px_rgba(249,115,22,0.5)]' : 'bg-slate-200 w-3'}`} />
                       ))}
                    </div>
                )}
            </div>

            <div className="p-6 pt-4 relative min-h-[450px] flex flex-col justify-center">
                <AnimatePresence mode="wait" custom={1}>
                    
                    {isAnalyzing && (
                        <motion.div
                            key="analyzing"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center text-center py-10"
                        >
                            <div className="relative mb-8">
                                <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full animate-pulse" />
                                <div className="w-32 h-32 bg-slate-900 rounded-full flex items-center justify-center shadow-2xl relative z-10 border-4 border-slate-800 animate-pulse">
                                    <Brain className="w-16 h-16 text-blue-400 animate-bounce" />
                                </div>
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">جاري تحليل ملفك الرياضي...</h2>
                            <p className="text-slate-500 font-medium text-lg max-w-sm">
                                نظامنا يقوم الآن بتخصيص تجربتك الرياضية وتهيئة خطة ملائمة لأهدافك...
                            </p>
                        </motion.div>
                    )}

                    {step === 1 && !isAnalyzing && (
                        <motion.div key="step1" variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-6">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 mt-4">ما هو هدفك الرئيسي؟</h2>
                                <p className="text-slate-500 font-medium">اختر الهدف الذي ترغب في التركيز عليه بشكل أساسي</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {goals.map(goal => (
                                    <div 
                                        key={goal.id} 
                                        onClick={() => handleSelect('goal', goal.id)}
                                        className={`p-5 rounded-3xl border-2 cursor-pointer transition-all flex items-center gap-4 ${selections.goal === goal.id ? 'border-orange-500 bg-orange-50/30' : 'border-slate-100 bg-white hover:border-slate-300 hover:shadow-sm'}`}
                                    >
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${selections.goal === goal.id ? 'bg-orange-500 text-white shadow-md' : `${goal.bg} ${goal.color}`}`}>
                                            <goal.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className={`font-extrabold text-lg ${selections.goal === goal.id ? 'text-slate-900' : 'text-slate-700'}`}>{goal.label}</h4>
                                            <p className="text-sm font-semibold text-slate-400 mt-1">{goal.desc}</p>
                                        </div>
                                        {selections.goal === goal.id && <Check className="w-6 h-6 text-orange-500 mr-auto" />}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && !isAnalyzing && (
                        <motion.div key="step2" variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-6">
                            <div className="flex items-center mb-2">
                               <Button variant="ghost" className="text-slate-400 p-0 h-8 hover:bg-transparent hover:text-slate-900" onClick={() => setStep(1)}><ArrowRight className="w-5 h-5 ml-1" /> تراجع</Button>
                            </div>
                            <div className="text-center mb-8">
                                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">كيف تقيم مستوى نشاطك الحالي؟</h2>
                                <p className="text-slate-500 font-medium">هذا يساعدنا في تخصيص كثافة التمارين</p>
                            </div>
                            <div className="flex flex-col gap-4">
                                {levels.map(level => (
                                    <div 
                                        key={level.id} 
                                        onClick={() => handleSelect('level', level.id)}
                                        className={`p-5 rounded-3xl border-2 cursor-pointer transition-all flex items-center gap-4 ${selections.level === level.id ? 'border-orange-500 bg-slate-900 text-white shadow-md' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                                    >
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${selections.level === level.id ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                            <level.icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-extrabold text-lg">{level.label}</h4>
                                            <p className={`text-sm ${selections.level === level.id ? 'text-slate-400' : 'text-slate-400'} mt-1 font-semibold`}>{level.desc}</p>
                                        </div>
                                        {selections.level === level.id && <Check className="w-6 h-6 text-orange-500" />}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && !isAnalyzing && (
                        <motion.div key="step3" variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-6">
                            <div className="flex items-center mb-2">
                               <Button variant="ghost" className="text-slate-400 p-0 h-8 hover:bg-transparent hover:text-slate-900" onClick={() => setStep(2)}><ArrowRight className="w-5 h-5 ml-1" /> تراجع</Button>
                            </div>
                            <div className="text-center mb-8">
                                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">كم من الوقت يمكنك تخصيصه يومياً؟</h2>
                                <p className="text-slate-500 font-medium">الاستمرارية أهم من المدة. كن واقعياً!</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {times.map(time => (
                                    <div 
                                        key={time.id} 
                                        onClick={() => handleSelect('commitment', time.id)}
                                        className={`p-6 rounded-3xl border-2 cursor-pointer transition-all flex flex-col items-center text-center gap-3 ${selections.commitment === time.id ? 'border-orange-500 bg-orange-50/50 shadow-md transform -translate-y-1' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                                    >
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${selections.commitment === time.id ? 'bg-orange-500 text-white shadow-md' : 'bg-slate-100 text-slate-500'}`}>
                                            <time.icon className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h4 className={`font-black text-xl mb-1 ${selections.commitment === time.id ? 'text-slate-900' : 'text-slate-700'}`}>{time.label}</h4>
                                            <p className="text-sm font-semibold text-slate-400 leading-tight">{time.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 4 && !isAnalyzing && (
                        <motion.div key="step4" variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-6">
                            <div className="flex items-center mb-2">
                               <Button variant="ghost" className="text-slate-400 p-0 h-8 hover:bg-transparent hover:text-slate-900" onClick={() => setStep(3)}><ArrowRight className="w-5 h-5 ml-1" /> تراجع</Button>
                            </div>
                            <div className="text-center mb-8">
                                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">ما التقنية التي تثير حماسك؟</h2>
                                <p className="text-slate-500 font-medium">خيارات المدرب الذكي المتعددة لتنتقي ما يناسبك</p>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {techs.map(tech => (
                                    <div 
                                        key={tech.id} 
                                        onClick={() => handleSelect('tech', tech.id)}
                                        className={`p-5 rounded-3xl border-2 cursor-pointer transition-all flex items-center gap-4 ${selections.tech === tech.id ? 'border-orange-500 bg-orange-50/30 shadow-md' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                                    >
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${selections.tech === tech.id ? 'bg-orange-500 text-white shadow-md' : `${tech.bg} ${tech.color}`}`}>
                                            <tech.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className={`font-extrabold text-lg ${selections.tech === tech.id ? 'text-slate-900' : 'text-slate-700'}`}>{tech.label}</h4>
                                            <p className="text-sm font-semibold text-slate-400 mt-1">{tech.desc}</p>
                                        </div>
                                        {selections.tech === tech.id && <Check className="w-6 h-6 text-orange-500 mr-auto" />}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 5 && !isAnalyzing && (
                        <motion.div key="step5" variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-6">
                            <div className="flex items-center mb-2">
                               <Button variant="ghost" className="text-slate-400 p-0 h-8 hover:bg-transparent hover:text-slate-900" onClick={() => setStep(4)}><ArrowRight className="w-5 h-5 ml-1" /> تراجع</Button>
                            </div>
                            <div className="text-center mb-8">
                                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">ما هو محفزك الأكبر؟</h2>
                                <p className="text-slate-500 font-medium">سنخصص بيئة المنصة لدعم رحلتك بأفضل شكل</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {motivations.map(mot => (
                                    <div 
                                        key={mot.id} 
                                        onClick={() => handleSelect('motivation', mot.id)}
                                        className={`p-6 rounded-3xl border-2 cursor-pointer transition-all flex flex-col items-center text-center gap-3 ${selections.motivation === mot.id ? 'border-orange-500 bg-orange-50/50 shadow-md transform -translate-y-1' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                                    >
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${selections.motivation === mot.id ? 'bg-orange-500 text-white shadow-md' : `${mot.bg} ${mot.color}`}`}>
                                            <mot.icon className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h4 className={`font-black text-xl mb-1 ${selections.motivation === mot.id ? 'text-slate-900' : 'text-slate-700'}`}>{mot.label}</h4>
                                            <p className="text-sm font-semibold text-slate-400 leading-tight">{mot.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 6 && !isAnalyzing && (
                        <motion.div key="step6" variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-6">
                            <div className="flex items-center mb-2">
                               <Button variant="ghost" className="text-slate-400 p-0 h-8 hover:bg-transparent hover:text-slate-900" onClick={() => setStep(5)}><ArrowRight className="w-5 h-5 ml-1" /> تراجع</Button>
                            </div>
                            <div className="text-center mb-8">
                                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">هل لديك شغف بالإبداع؟</h2>
                                <p className="text-slate-500 font-medium">مختبر منصتنا للإبداع الرياضي والحركي بانتظارك</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {creations.map(creation => (
                                    <div 
                                        key={creation.id} 
                                        onClick={() => handleSelect('creation', creation.id)}
                                        className={`p-6 rounded-3xl border-2 cursor-pointer transition-all flex flex-col items-center text-center gap-4 ${selections.creation === creation.id ? 'border-orange-500 bg-orange-50/30' : 'border-slate-100 bg-white hover:border-slate-300 hover:shadow-sm'}`}
                                    >
                                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 ${selections.creation === creation.id ? 'bg-orange-500 text-white shadow-lg' : `${creation.bg} ${creation.color}`}`}>
                                            <creation.icon className="w-10 h-10" />
                                        </div>
                                        <div>
                                            <h4 className={`font-black text-xl mb-2 ${selections.creation === creation.id ? 'text-slate-900' : 'text-slate-700'}`}>{creation.label}</h4>
                                            <p className="text-sm font-semibold text-slate-400 leading-relaxed">{creation.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </Card>
        </div>
    );
}
