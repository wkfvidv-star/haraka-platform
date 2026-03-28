import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, BookOpen, School, Activity, Info, ChevronLeft, BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PreAssessmentSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: { educationalLevel: string; activityLevel: string }) => void;
}

const EDUCATIONAL_LEVELS = [
  { id: 'primary', label: 'المرحلة الابتدائية', icon: BookOpen,   desc: 'اختبارات مبسطة تركز على التوافق الحركي والتوازن الأساسي' },
  { id: 'middle',  label: 'المرحلة المتوسطة', icon: School,       desc: 'تحديات متوسطة لتقييم المهارات المعرفية وسرعة الاستجابة' },
  { id: 'high',    label: 'المرحلة الثانوية', icon: GraduationCap,desc: 'تحليل متقدم للأداء الرياضي والتوافق العضلي العصبي' },
];

const ACTIVITY_LEVELS = [
  { id: 'low',    label: 'نشاط خفيف',    desc: 'حركة قليلة خلال اليوم' },
  { id: 'medium', label: 'نشاط متوسط',   desc: 'ممارسة الرياضة 1-2 مرات أسبوعياً' },
  { id: 'high',   label: 'نشاط عالي',    desc: 'رياضي منتظم أو لاعب بنادي' },
];

export function PreAssessmentSurveyModal({ isOpen, onClose, onComplete }: PreAssessmentSurveyModalProps) {
  const [step, setStep] = useState(0);
  const [eduLevel, setEduLevel] = useState<string>('');
  const [activityLevel, setActivityLevel] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Auto-advance logic
  const handleSelectEdu = (id: string) => {
    setEduLevel(id);
    setTimeout(() => setStep(1), 500);
  };

  const handleSelectActivity = (id: string) => {
    setActivityLevel(id);
    setTimeout(() => {
      setStep(2);
      processAIConfiguration(id);
    }, 500);
  };

  const processAIConfiguration = (actLevel: string) => {
    setIsProcessing(true);
    // Simulate AI loading engine
    setTimeout(() => {
      setIsProcessing(false);
      setTimeout(() => {
        onComplete({ educationalLevel: eduLevel, activityLevel: actLevel });
      }, 1500);
    }, 3000);
  };

  const currentStepData = [
    { title: 'ما هي مرحلتك الدراسية؟', subtitle: 'سيتم تخصيص خوارزميات الذكاء الاصطناعي بناءً على فئتك العمرية.' },
    { title: 'ما هو معدل نشاطك البدني الحالي؟', subtitle: 'نحتاج لمعرفة هذا لنحدد معايير القياس المناسبة للياقتك.' },
    { title: 'تهيئة بيئة الاختبار', subtitle: 'جاري بناء بروتوكول القياس المخصص لك...' }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative flex flex-col h-full md:h-auto min-h-[500px]">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />

        {/* Progress Bar Header */}
        <div className="relative z-10 px-8 pt-8 pb-4">
          <div className="flex items-center gap-2 mb-6 cursor-pointer text-slate-400 hover:text-white transition-colors" onClick={() => step > 0 && !isProcessing && setStep(step - 1)}>
            {step > 0 && step < 2 && <ChevronLeft className="w-5 h-5" />}
            {step < 2 && <span className="font-bold text-sm tracking-wide">رجوع</span>}
          </div>
          
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">{currentStepData[step].title}</h2>
              <p className="text-blue-100/70 font-bold text-base md:text-lg">{currentStepData[step].subtitle}</p>
            </div>
            {step < 2 && <span className="text-indigo-400 font-black text-2xl bg-indigo-500/10 px-4 py-1.5 rounded-full">{step + 1}/2</span>}
          </div>

          {step < 2 && (
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden shadow-inner">
               <motion.div 
                 className="h-full bg-gradient-to-l from-indigo-500 to-blue-400 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                 initial={{ width: `${(step / 2) * 100}%` }}
                 animate={{ width: `${((step + 1) / 2) * 100}%` }}
                 transition={{ duration: 0.5, ease: "easeInOut" }}
               />
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="relative z-10 p-8 pt-4 min-h-[350px]">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Educational Level */}
            {step === 0 && (
              <motion.div key="step-0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                {EDUCATIONAL_LEVELS.map((level, idx) => {
                  const Icon = level.icon;
                  const isSelected = eduLevel === level.id;
                  return (
                    <motion.div 
                      key={level.id}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                      onClick={() => handleSelectEdu(level.id)}
                      className={cn(
                        "group cursor-pointer rounded-[1.5rem] border-2 p-6 flex items-center gap-6 transition-all duration-300",
                        isSelected 
                          ? "border-indigo-400 bg-indigo-500/20 shadow-[0_0_40px_rgba(99,102,241,0.3)] transform scale-[1.02]" 
                          : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                      )}
                    >
                      <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg", isSelected ? "bg-indigo-500 text-white shadow-indigo-500/50" : "bg-slate-800 text-slate-300 group-hover:text-indigo-300")}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-black text-white mb-1.5">{level.label}</h3>
                        <p className={cn("text-base font-bold", isSelected ? "text-indigo-200" : "text-slate-400")}>{level.desc}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}

            {/* STEP 2: Activity Level */}
            {step === 1 && (
              <motion.div key="step-1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-1 gap-4">
                {ACTIVITY_LEVELS.map((act, idx) => {
                  const isSelected = activityLevel === act.id;
                  return (
                    <motion.div 
                      key={act.id}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                      onClick={() => handleSelectActivity(act.id)}
                      className={cn(
                        "group cursor-pointer rounded-[1.5rem] border-2 p-6 flex items-center gap-6 transition-all duration-300",
                        isSelected 
                          ? "border-blue-400 bg-blue-500/20 shadow-[0_0_40px_rgba(59,130,246,0.3)] transform scale-[1.02]" 
                          : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                      )}
                    >
                      <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg", isSelected ? "bg-blue-500 text-white shadow-blue-500/50" : "bg-slate-800 text-slate-300 group-hover:text-blue-300")}>
                        <Activity className="w-8 h-8" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-black text-white mb-1.5">{act.label}</h3>
                        <p className={cn("text-base font-bold", isSelected ? "text-blue-200" : "text-slate-400")}>{act.desc}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}

            {/* STEP 3: AI Processing */}
            {step === 2 && (
               <motion.div key="step-2" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-12 text-center h-full">
                  
                  {isProcessing ? (
                     <>
                        <div className="relative mb-8">
                           <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-50 animate-pulse" />
                           <div className="w-24 h-24 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin flex items-center justify-center relative z-10 bg-[#0B0E14]">
                              <BrainCircuit className="w-10 h-10 text-indigo-400" />
                           </div>
                        </div>
                        <h3 className="text-2xl font-black text-white mb-2 animate-pulse">يتم الآن تجهيز خوارزميات التقييم...</h3>
                        <p className="text-slate-400 font-bold max-w-sm mx-auto">نقوم بضبط مستويات الصعوبة وحساسية الكاميرا بناءً على فئتك (المرحلة {EDUCATIONAL_LEVELS.find(e => e.id === eduLevel)?.label})</p>
                     </>
                  ) : (
                     <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                           <svg className="w-12 h-12 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                           </svg>
                        </div>
                        <h3 className="text-3xl font-black text-white mb-2">البيئة جاهزة</h3>
                        <p className="text-emerald-400 font-bold">يمكنك البدء بالاختبار الآن</p>
                     </motion.div>
                  )}

               </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Footer Info */}
        <div className="bg-slate-950/50 p-5 mt-auto flex items-center justify-center gap-3 text-slate-400 font-bold text-sm border-t border-white/5">
           <Info className="w-5 h-5 text-indigo-400" />
           جميع البيانات تخضع لمعايير السرية والأمان في منصة حركة
        </div>

    </div>
  );
}
