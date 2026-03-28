import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, ChevronLeft, BrainCircuit, Activity, Users, Video, 
  Dumbbell, HeartPulse, Sparkles, LayoutDashboard, Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type OnboardingStep = 'welcome' | 'profiling' | 'processing' | 'tour';

interface CoachOnboardingProps {
    onComplete: () => void;
}

export function CoachOnboarding({ onComplete }: CoachOnboardingProps) {
    const [step, setStep] = useState<OnboardingStep>('welcome');
    
    // Profiling State
    const [profStep, setProfStep] = useState(0);
    const [profile, setProfile] = useState({ domain: '', capacity: '', challenge: '' });

    // Processing State
    const [processingText, setProcessingText] = useState('يتم الآن تحليل ملفك الشخصي...');

    // Tour State
    const [tourStep, setTourStep] = useState(0);

    const handleProfileSelect = (key: keyof typeof profile, value: string) => {
        setProfile(p => ({ ...p, [key]: value }));
        
        // Auto advance profiling
        if (profStep < 2) {
            setTimeout(() => setProfStep(p => p + 1), 300);
        } else {
            // Done profiling, trigger processing
            setTimeout(() => setStep('processing'), 300);
        }
    };

    // AI Processing Simulation effect
    useEffect(() => {
        if (step === 'processing') {
            const texts = [
                'تهيئة مساحة العمل الخاصة بك...',
                'تخصيص خوارزميات الذكاء الاصطناعي لتناسب أسلوبك...',
                'إعداد استوديو التحليل الحركي...',
                'تم تجهيز المنصة بنجاح!'
            ];
            
            let i = 0;
            const interval = setInterval(() => {
                i++;
                if (i < texts.length) {
                    setProcessingText(texts[i]);
                } else {
                    clearInterval(interval);
                    setTimeout(() => setStep('tour'), 800);
                }
            }, 1200);

            return () => clearInterval(interval);
        }
    }, [step]);

    // Render logic per step
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950 text-slate-50 overflow-hidden" dir="rtl">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15)_0,rgba(15,23,42,1)_100%)]"></div>
            <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30"></div>
            
            <AnimatePresence mode="wait">
                
                {/* 1. WELCOME STEP */}
                {step === 'welcome' && (
                    <motion.div 
                        key="welcome"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="relative z-10 flex flex-col items-center text-center max-w-2xl px-6"
                    >
                        <div className="w-20 h-20 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-8 border border-blue-500/30">
                            <Target className="w-10 h-10 text-blue-400" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">مرحباً بك في <span className="text-blue-500">منصتك الذكية</span></h1>
                        <p className="text-xl text-slate-400 mb-10 leading-relaxed font-medium">
                            تم تصميم هذه المساحة خصيصاً للمدربين النخبة. سنقوم الآن بطرح 3 أسئلة سريعة لنسمح للذكاء الاصطناعي بتخصيص الأدوات لتناسب أسلوبك في التدريب (1-on-1).
                        </p>
                        <Button 
                            onClick={() => setStep('profiling')}
                            className="h-14 px-10 text-lg font-bold rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_40px_-10px_rgba(59,130,246,0.6)]"
                        >
                            ابدأ الإعداد المخصص <ChevronLeft className="mr-2 w-5 h-5" />
                        </Button>
                    </motion.div>
                )}

                {/* 2. PROFILING STEP */}
                {step === 'profiling' && (
                    <motion.div 
                        key="profiling"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="relative z-10 w-full max-w-3xl px-6"
                    >
                        <div className="mb-12 flex items-center gap-4">
                            <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-blue-500"
                                    initial={{ width: `${(profStep / 3) * 100}%` }}
                                    animate={{ width: `${((profStep + 1) / 3) * 100}%` }}
                                />
                            </div>
                            <span className="text-slate-400 font-bold text-sm">{profStep + 1} من 3</span>
                        </div>

                        <AnimatePresence mode="wait">
                            {profStep === 0 && (
                                <motion.div key="q1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                                    <h2 className="text-3xl font-black mb-8 text-white">ما هو مجال تخصصك التدريبي الأساسي؟</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            { id: 'bodybuilding', label: 'كمال الأجسام وبناء العضلات', icon: Dumbbell },
                                            { id: 'fitness', label: 'اللياقة البدنية وحرق الدهون', icon: Activity },
                                            { id: 'rehab', label: 'تأهيل الإصابات وتقويم القوام', icon: HeartPulse },
                                            { id: 'sports', label: 'تطوير الأداء الرياضي (ألعاب رياضية)', icon: Target }
                                        ].map(opt => (
                                            <button 
                                                key={opt.id}
                                                onClick={() => handleProfileSelect('domain', opt.id)}
                                                className="flex items-center gap-4 p-6 rounded-2xl border-2 border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:border-blue-500 transition-all text-right group"
                                            >
                                                <div className="w-12 h-12 rounded-xl bg-slate-800 group-hover:bg-blue-500 group-hover:text-white flex items-center justify-center text-slate-400 transition-colors">
                                                    <opt.icon className="w-6 h-6" />
                                                </div>
                                                <span className="text-lg font-bold text-slate-200 group-hover:text-white">{opt.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {profStep === 1 && (
                                <motion.div key="q2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                                    <h2 className="text-3xl font-black mb-8 text-white">كم عدد المتدربين (1-on-1) الذين تديرهم حالياً؟</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {[
                                            { id: 'small', label: '1 إلى 5 متدربين', desc: 'تركيز شديد على القلة' },
                                            { id: 'medium', label: '6 إلى 20 متدرب', desc: 'وازن بين العدد والجودة' },
                                            { id: 'large', label: 'أكثر من 20 متدرب', desc: 'نطاق واسع ومتابعة مكثفة' }
                                        ].map(opt => (
                                            <button 
                                                key={opt.id}
                                                onClick={() => handleProfileSelect('capacity', opt.id)}
                                                className="flex flex-col gap-2 p-6 rounded-2xl border-2 border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:border-blue-500 transition-all text-right group"
                                            >
                                                <Users className="w-8 h-8 text-slate-500 group-hover:text-blue-400 mb-2" />
                                                <span className="text-xl font-black text-slate-200 group-hover:text-white">{opt.label}</span>
                                                <span className="text-sm font-medium text-slate-500">{opt.desc}</span>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {profStep === 2 && (
                                <motion.div key="q3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                                    <h2 className="text-3xl font-black mb-8 text-white">ما هو التحدي الأكبر الذي تواجهه حالياً؟</h2>
                                    <div className="grid grid-cols-1 gap-4">
                                        {[
                                            { id: 'time', label: 'استنزاف الوقت في صناعة الجداول والبرامج ومتابعة المتدربين.' },
                                            { id: 'analysis', label: 'الرغبة في أدوات أدق لتحليل أداء وحركة المشتركين (Video Analysis).' },
                                            { id: 'scale', label: 'إدارة عدد أكبر من المتدربين مع المحافظة على جودة وتخصيص الخدمة.' }
                                        ].map(opt => (
                                            <button 
                                                key={opt.id}
                                                onClick={() => handleProfileSelect('challenge', opt.id)}
                                                className="flex items-center gap-4 p-6 rounded-2xl border-2 border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:border-blue-500 transition-all text-right group"
                                            >
                                                <Sparkles className="w-6 h-6 text-slate-500 group-hover:text-amber-400 shrink-0" />
                                                <span className="text-lg font-bold text-slate-300 group-hover:text-white">{opt.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* 3. AI PROCESSING STEP */}
                {step === 'processing' && (
                    <motion.div 
                        key="processing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative z-10 flex flex-col items-center text-center max-w-sm"
                    >
                        <div className="relative mb-12">
                            {/* Animated rings */}
                            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                            <motion.div 
                                animate={{ rotate: 360 }} 
                                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                                className="w-32 h-32 rounded-full border-t-2 border-r-2 border-blue-500/20"
                            ></motion.div>
                            <motion.div 
                                animate={{ rotate: -360 }} 
                                transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                                className="absolute inset-4 rounded-full border-b-2 border-l-2 border-blue-400/40"
                            ></motion.div>
                            
                            <div className="absolute inset-0 flex items-center justify-center">
                                <BrainCircuit className="w-12 h-12 text-blue-400" />
                            </div>
                        </div>
                        <motion.h3 
                            key={processingText}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-2xl font-bold text-white mb-2"
                        >
                            {processingText}
                        </motion.h3>
                    </motion.div>
                )}

                {/* 4. TOUR STEP */}
                {step === 'tour' && (
                    <motion.div 
                        key="tour"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative z-10 w-full max-w-4xl px-6"
                    >
                        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl overflow-hidden relative">
                            {/* Decorative gradient */}
                            <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                            
                            <AnimatePresence mode="wait">
                                {tourStep === 0 && (
                                    <motion.div key="t1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="flex flex-col md:flex-row gap-10 items-center">
                                        <div className="flex-1 text-right">
                                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/20 text-blue-400 mb-6 border border-blue-500/30">
                                                <LayoutDashboard className="w-8 h-8" />
                                            </div>
                                            <h2 className="text-3xl font-black text-white mb-4">مركز القيادة اليومي</h2>
                                            <p className="text-lg text-slate-400 leading-relaxed mb-6 font-medium">لوحة تحكم ذكية تعرض لك التنبيهات المهمة، والحصص القادمة، وحالة المتدربين النشطين فور دخولك لتبدأ يومك بتركيز شديد.</p>
                                        </div>
                                        <div className="flex-1 w-full bg-slate-950 rounded-2xl border border-slate-800 h-64 relative overflow-hidden flex items-center justify-center">
                                            <div className="w-3/4 h-3/4 flex flex-col gap-4 opacity-50">
                                                <div className="w-full h-8 bg-slate-800 rounded"></div>
                                                <div className="flex gap-4">
                                                    <div className="flex-1 h-32 bg-slate-800 rounded"></div>
                                                    <div className="flex-1 h-32 bg-slate-800 rounded"></div>
                                                    <div className="flex-1 h-32 bg-blue-900 rounded"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                                {tourStep === 1 && (
                                    <motion.div key="t2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="flex flex-col md:flex-row gap-10 items-center">
                                        <div className="flex-1 text-right">
                                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/20 text-red-400 mb-6 border border-red-500/30">
                                                <Video className="w-8 h-8" />
                                            </div>
                                            <h2 className="text-3xl font-black text-white mb-4">استوديو التحليل الحركي</h2>
                                            <p className="text-lg text-slate-400 leading-relaxed mb-6 font-medium">راجع مقاطع فيديو المتدربين بإحترافية تامة. ارسم الملاحظات، سجل رسالة صوتية، أو أضف تعليقات على الحركة (Frame-by-Frame).</p>
                                        </div>
                                        <div className="flex-1 w-full bg-slate-950 rounded-2xl border border-slate-800 h-64 relative overflow-hidden flex items-center justify-center">
                                            <div className="w-4/5 h-4/5 rounded-xl border-2 border-red-500/50 flex flex-col justify-end p-4 relative">
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-dashed border-red-500/50 rounded-full"></div>
                                                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
                                                    <div className="w-1/3 h-full bg-red-500"></div>
                                                </div>
                                                <div className="flex justify-between w-full">
                                                    <div className="w-6 h-6 rounded-full bg-slate-800"></div>
                                                    <div className="flex gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-slate-800"></div>
                                                        <div className="w-6 h-6 rounded-full bg-slate-800"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                                {tourStep === 2 && (
                                    <motion.div key="t3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="flex flex-col md:flex-row gap-10 items-center">
                                        <div className="flex-1 text-right">
                                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 mb-6 border border-emerald-500/30">
                                                <Activity className="w-8 h-8" />
                                            </div>
                                            <h2 className="text-3xl font-black text-white mb-4">منشئ البرامج الذكي</h2>
                                            <p className="text-lg text-slate-400 leading-relaxed mb-6 font-medium">اصنع برامج مخصصة، وجداول غذائية في دقائق بمساعدة الذكاء الاصطناعي بناءً على تخصصك كمدرب {profile.domain === 'rehab' ? 'تأهيلي' : 'محترف'}. وخصصها لكل متدرب بنقرة واحدة.</p>
                                        </div>
                                        <div className="flex-1 w-full bg-slate-950 rounded-2xl border border-slate-800 h-64 relative overflow-hidden flex items-center justify-center p-6">
                                            <div className="w-full h-full flex flex-col gap-3 opacity-70">
                                                <div className="flex gap-2 w-full"><div className="w-2/3 h-8 bg-slate-800 rounded"></div><div className="w-1/3 h-8 bg-emerald-900/50 rounded"></div></div>
                                                <div className="flex gap-2 w-full"><div className="w-full h-12 bg-slate-800 rounded"></div></div>
                                                <div className="flex gap-2 w-full"><div className="w-full h-12 bg-slate-800 rounded"></div></div>
                                                <div className="flex gap-2 w-full mt-auto"><div className="w-full h-10 bg-emerald-600 rounded"></div></div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="mt-10 flex items-center justify-between pt-6 border-t border-slate-800">
                                <div className="flex gap-2">
                                    {[0, 1, 2].map(i => (
                                        <div key={i} className={`h-2 rounded-full transition-all ${tourStep === i ? 'w-8 bg-blue-500' : 'w-2 bg-slate-800'}`} />
                                    ))}
                                </div>
                                <Button 
                                    onClick={() => {
                                        if (tourStep < 2) setTourStep(t => t + 1);
                                        else onComplete();
                                    }}
                                    className="h-12 px-8 rounded-full bg-white text-slate-900 hover:bg-slate-200 font-bold"
                                >
                                    {tourStep === 2 ? 'ادخل للوحة التحكم' : 'التالي'}
                                    {tourStep === 2 ? <Send className="w-4 h-4 mr-2" /> : <ChevronLeft className="w-4 h-4 mr-2" />}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
