import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Apple, Info, CheckCircle2, ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

interface DietPlanRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DietPlanRequestModal({ isOpen, onClose }: DietPlanRequestModalProps) {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState<string | null>(null);
  const [allergies, setAllergies] = useState('');
  const { toast } = useToast();

  const goals = [
    { id: 'cut', label: 'حرق الدهون (Cut)', desc: 'عجز في السعرات الحرارية لفقدان الوزن', icon: '🔥' },
    { id: 'bulk', label: 'تضخيم عضلي (Bulk)', desc: 'فائض في السعرات لبناء العضلات', icon: '💪' },
    { id: 'maintain', label: 'المحافظة والأداء', desc: 'سعرات ثبات لدعم الأداء الرياضي', icon: '⚖️' },
  ];

  const handleSubmit = () => {
    const existing = JSON.parse(localStorage.getItem('haraka_pending_diets') || '[]');
    const newDietReq = {
      id: Date.now().toString(),
      type: 'Diet Plan Request',
      studentName: 'Redha',
      goal: goal,
      allergies: allergies,
      status: 'pending',
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('haraka_pending_diets', JSON.stringify([newDietReq, ...existing]));

    setStep(3);
    setTimeout(() => {
      toast({
        title: "🥗 تم إرسال الطلب",
        description: `سيقوم النظام الذكي وأخصائي التغذية بإعداد الخطة خلال 24 ساعة.`
      });
      setTimeout(() => {
        onClose();
        setStep(1);
        setGoal(null);
        setAllergies('');
      }, 2500);
    }, 2000);
  };

  const resetAndClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setGoal(null);
      setAllergies('');
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" dir="rtl">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 relative"
        >
          <Button variant="ghost" size="icon" onClick={resetAndClose} className="absolute top-4 left-4 z-10 text-white/70 hover:bg-white/20 hover:text-white rounded-full">
            <X className="w-5 h-5" />
          </Button>

          {/* Header */}
          <div className="bg-emerald-600 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/30 rounded-full blur-[60px] -translate-x-1/2 -translate-y-1/2" />
            <div className="relative z-10">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4">
                    <Utensils className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-black tracking-tight flex items-center gap-2">
                    النظام الغذائي <Badge className="bg-white text-emerald-700 hover:bg-white border-0 px-2 py-0 text-[10px] uppercase font-bold tracking-widest gap-1"><Sparkles className="w-3 h-3"/> AI Guided</Badge>
                </h2>
                <p className="text-emerald-50 font-medium mt-2 text-sm opacity-90">طلب خطة غذائية مخصصة بالكامل لمقاييسك البيولوجية وهدفك الحالي</p>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h3 className="text-lg font-bold text-slate-900 mb-4 tracking-tight">ما هو هدفك الغذائي؟</h3>
                <div className="space-y-3">
                  {goals.map(g => (
                    <div 
                      key={g.id} 
                      onClick={() => setGoal(g.id)}
                      className={cn(
                        "p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4",
                        goal === g.id 
                          ? "border-emerald-500 bg-emerald-50/50 shadow-sm" 
                          : "border-slate-100 hover:border-slate-200"
                      )}
                    >
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm text-2xl flex items-center justify-center shrink-0 border border-slate-100">
                        {g.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900">{g.label}</h4>
                        <p className="text-slate-500 text-sm font-medium">{g.desc}</p>
                      </div>
                      <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center", goal === g.id ? "border-emerald-500 bg-emerald-500" : "border-slate-300")}>
                        {goal === g.id && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                    onClick={() => setStep(2)} 
                    disabled={!goal} 
                    className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white h-12 rounded-xl font-bold"
                >
                    متابعة <ChevronLeft className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="flex items-center gap-2 mb-4">
                  <button onClick={() => setStep(1)} className="text-slate-400 hover:text-slate-900 transition-colors">
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">معلومات إضافية (خياري)</h3>
                </div>

                <div className="mb-6">
                    <div className="flex items-start gap-3 p-4 bg-orange-50 text-orange-800 rounded-2xl border border-orange-100 mb-4">
                        <Info className="w-5 h-5 shrink-0 mt-0.5 text-orange-500" />
                        <p className="text-sm font-medium">سيقوم النظام بجمع بيانات وزنك الحالي والمجهود البدني مباشرة من ملفك الشخصي.</p>
                    </div>

                    <label className="text-sm font-bold text-slate-700 mb-2 block">هل تعاني من حساسية غذائية معينة؟</label>
                    <Textarea 
                        placeholder="مثل: حساسية اللاكتوز، الغلوتين، المكسرات..."
                        className="resize-none h-24 rounded-xl border-slate-200 focus-visible:ring-emerald-500 bg-slate-50"
                        value={allergies}
                        onChange={(e) => setAllergies(e.target.value)}
                    />
                </div>

                <Button 
                    onClick={handleSubmit} 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                    <CheckCircle2 className="w-5 h-5" /> إرسال الطلب للاعتماد
                </Button>
              </motion.div>
            )}

            {step === 3 && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                    <div className="w-24 h-24 relative mb-2">
                        <div className="absolute inset-0 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Apple className="w-8 h-8 text-emerald-500" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">جاري المعالجة...</h3>
                    <p className="text-slate-500 font-medium">المدرب الذكي يقوم بتحليل بياناتك لحساب السعرات والماكروز المناسبة لك.</p>
                </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Ensure Badge is imported internally or explicitly above. Wait, Badge is imported inside lucide? No.
// Let me refactor and import Badge properly.
