import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap, Brain, Trophy, ChevronLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  onComplete: () => void;
  studentName?: string;
}

const GOALS = [
  { id: 'fitness', title: 'لياقة عامة', desc: 'تحسين الصحة والنشاط اليومي', icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  { id: 'speed', title: 'سرعة ورشاقة', desc: 'تطوير ردة الفعل والسرعة', icon: Zap, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  { id: 'focus', title: 'تركيز ذهني', desc: 'تمرين العقل وسرعة القرار', icon: Brain, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/30' },
  { id: 'pro', title: 'احتراف رياضي', desc: 'الاستعداد للمنافسات', icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
];

const LEVELS = [
  { id: 'beginner', title: 'مبتدئ', desc: 'أريد البدء بأساسيات الحركة' },
  { id: 'intermediate', title: 'متوسط', desc: 'أمارس الرياضة من حين لآخر' },
  { id: 'advanced', title: 'متقدم', desc: 'أتمرن بانتظام وأبحث عن التحدي' },
];

export function FirstTimeExperience({ onComplete, studentName }: Props) {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState('');
  const [level, setLevel] = useState('');
  const [isFinishing, setIsFinishing] = useState(false);

  const getUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user?.id || 'default';
    } catch {
      return 'default';
    }
  };
  const uid = getUserId();

  const handleNext = () => {
    if (step === 1 && goal) setStep(2);
    else if (step === 2 && level) {
      setStep(3);
      generatePlan();
    }
  };

  const generatePlan = () => {
    setIsFinishing(true);
    setTimeout(() => {
      // Save minimal setup
      localStorage.setItem(`haraka_student_level_${uid}`, level);
      localStorage.setItem(`haraka_student_goal_${uid}`, goal);
      localStorage.setItem(`haraka_ftue_complete_${uid}`, 'true');
      localStorage.setItem(`haraka_ftue_date_${uid}`, new Date().toISOString());
      
      onComplete();
    }, 2000); // Quick setup loading animation
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center p-6 overflow-hidden rtl" style={{ fontFamily: "'Almarai','Tajawal',sans-serif" }}>
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-2xl px-4 flex flex-col h-full md:h-auto min-h-[500px]">
        {step < 3 && (
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-white">
              أهلاً بك <span className="text-blue-400">{studentName?.split(' ')[0]}</span> 👋
            </h1>
            <div className="bg-white/10 px-4 py-1.5 rounded-full text-indigo-300 font-black tracking-wide text-sm border border-white/5 shadow-inner">
              الخطوة {step} من 2
            </div>
          </div>
        )}

        <div className="flex-1">
          <AnimatePresence mode="wait">
            
            {/* Step 1: Goal */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full flex flex-col justify-center">
                <h2 className="text-2xl font-black text-slate-200 mb-6 text-center">ما هو هدفك الأساسي؟</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {GOALS.map(g => {
                    const isSelected = goal === g.id;
                    const Icon = g.icon;
                    return (
                      <motion.div 
                        key={g.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => setGoal(g.id)}
                        className={cn(
                          "cursor-pointer rounded-[1.5rem] p-5 flex items-center gap-4 transition-all duration-300 border-2",
                          isSelected ? `bg-white/10 border-blue-500 shadow-[0_0_25px_rgba(59,130,246,0.2)]` : `bg-white/5 border-transparent hover:bg-white/10`
                        )}
                      >
                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mx-auto", isSelected ? 'bg-blue-500' : g.bg)}>
                          <Icon className={cn("w-7 h-7", isSelected ? 'text-white' : g.color)} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-black text-white">{g.title}</h3>
                          <p className="text-slate-400 text-sm font-bold mt-1">{g.desc}</p>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 2: Level */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full flex flex-col justify-center">
                <h2 className="text-2xl font-black text-slate-200 mb-6 text-center">ما هو مستواك الحالي؟</h2>
                <div className="flex flex-col gap-4 max-w-md mx-auto w-full">
                  {LEVELS.map(l => {
                    const isSelected = level === l.id;
                    return (
                      <motion.div 
                        key={l.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => setLevel(l.id)}
                        className={cn(
                          "cursor-pointer rounded-2xl p-5 flex items-center justify-between transition-all duration-300 border-2",
                          isSelected ? `bg-blue-600/20 border-blue-500 shadow-lg` : `bg-white/5 border-white/5 hover:bg-white/10`
                        )}
                      >
                        <div>
                          <h3 className="text-xl font-black text-white">{l.title}</h3>
                          <p className="text-slate-400 text-sm font-bold mt-1">{l.desc}</p>
                        </div>
                        {isSelected && <CheckCircle2 className="w-6 h-6 text-blue-400" />}
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 3: Loading */}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 rounded-full border-4 border-slate-700 border-t-blue-500 animate-spin flex items-center justify-center mb-6 shadow-2xl bg-slate-900 z-10 relative">
                  <span className="text-3xl animate-pulse">⚡</span>
                </div>
                <h2 className="text-3xl font-black text-white mb-2 animate-pulse">جاري تجهيز مهمتك اليومية...</h2>
                <p className="text-slate-400 font-bold max-w-xs mx-auto">سيتم تخصيص التمارين والمهام بناءً على هدفك ومستواك.</p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        {step < 3 && (
          <div className="mt-8 flex justify-between items-center">
            <button 
              onClick={() => step > 1 && setStep(step - 1)}
              className={cn("px-6 py-3 font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-2", step === 1 && "opacity-0 pointer-events-none")}
            >
              <ArrowRight className="w-5 h-5" /> رجوع
            </button>
            <button 
              onClick={handleNext}
              disabled={(step === 1 && !goal) || (step === 2 && !level)}
              className="bg-white text-slate-900 px-8 py-3.5 rounded-2xl font-black text-lg flex items-center gap-2 hover:bg-blue-50 transition-all disabled:opacity-50 shadow-xl"
            >
              التالي <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default FirstTimeExperience;
