import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Camera, Zap, ChevronLeft, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface YouthTechIntroProps {
  onComplete: () => void;
  userName?: string;
}

export default function YouthTechIntro({ onComplete, userName = 'أيها البطل' }: YouthTechIntroProps) {
  const [step, setStep] = useState(0);

  const slides = [
    {
      id: 'brain',
      icon: Brain,
      title: 'العقل الرقمي والتنبؤ',
      subtitle: 'ذكاء اصطناعي يرافقك خطوة بخطوة',
      color: 'bg-blue-600',
      glow: 'from-blue-500/20 to-indigo-500/5',
      content: 'نظامنا لا يعطيك أرقاماً فقط، بل يحتوي على "عقل رقمي" يحلل أدائك، يتوقع نقاط ضعفك، ويبتكر لك تدريبات مخصصة لرفع مستواك الرياضي والأكاديمي.'
    },
    {
      id: 'ar',
      icon: Camera,
      title: 'الواقع المعزز والتصحيح (AR)',
      subtitle: 'مدربك الشخصي في كاميرا هاتفك',
      color: 'bg-orange-500',
      glow: 'from-orange-500/20 to-red-500/5',
      content: 'انسَ الحساسات المعقدة! من خلال كاميرا جهازك، سيقوم النظام برسم هيكل افتراضي (33 نقطة مفصلية) فوق جسمك لتصحيح وضعياتك فوراً كأن المدرب يقف بجانبك.'
    }
  ];

  const currentSlide = slides[step];

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className={cn("absolute inset-0 bg-gradient-to-br opacity-50", currentSlide.glow)}
          />
        </AnimatePresence>
      </div>

      <div className="w-full max-w-2xl relative z-10 flex flex-col min-h-[500px]">
        {/* Header */}
        <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-white tracking-tighter mb-2">تعرف على منصتك الذكية</h1>
            <p className="text-slate-400 font-medium">مرحباً {userName}، نستخدم أحدث التقنيات لخدمتك</p>
        </div>

        {/* Content Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ x: 50, opacity: 0, scale: 0.95 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: -50, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex-1 flex flex-col justify-center"
          >
            <Card className="bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden ring-1 ring-white/5">
              <CardContent className="p-8 sm:p-12 flex flex-col items-center text-center">
                <div className="relative mb-8">
                  <div className={cn("absolute inset-0 blur-2xl opacity-50 rounded-full", currentSlide.color)} />
                  <div className={cn("w-24 h-24 rounded-3xl flex items-center justify-center relative z-10 shadow-2xl border border-white/20", currentSlide.color)}>
                    <currentSlide.icon className="w-12 h-12 text-white" />
                  </div>
                </div>
                
                <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">{currentSlide.title}</h2>
                <h3 className={cn("text-lg font-bold mb-6", currentSlide.color.replace('bg-', 'text-'))}>{currentSlide.subtitle}</h3>
                
                <p className="text-slate-300 text-lg leading-relaxed max-w-lg">
                  {currentSlide.content}
                </p>
                
                {/* Visual Fake Process Indicator */}
                <div className="mt-8 flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Neural Engine Active</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Footer & Controls */}
        <div className="mt-8 flex items-center justify-between">
            <div className="flex gap-2">
                {slides.map((_, i) => (
                    <div 
                        key={i} 
                        className={cn("w-2 h-2 rounded-full transition-all duration-300", i === step ? "w-8 bg-white" : "bg-white/20")}
                    />
                ))}
            </div>

            <Button 
                onClick={handleNext}
                className="bg-white text-slate-900 hover:bg-slate-200 hover:scale-105 active:scale-95 transition-all h-12 px-8 rounded-full font-black text-lg gap-2"
            >
                {step === slides.length - 1 ? 'دخول للمنصة' : 'متابعة'}
                <ChevronLeft className="w-5 h-5" />
            </Button>
        </div>
      </div>
    </div>
  );
}
