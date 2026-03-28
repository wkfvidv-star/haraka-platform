import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Video, Dumbbell, BarChart3, ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';

const ONBOARDING_SLIDES = [
  {
    id: 1,
    title: 'مرحباً بك في لوحة القيادة الذكية',
    description: 'تم تطوير هذه اللوحة خصيصاً لتمنحك دقة لا مثيل لها في تقييم أداء تلاميذك وتحليل بياناتهم الحركية والسيكولوجية.',
    icon: Sparkles,
    color: 'text-blue-600',
    bg: 'bg-blue-100',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 2,
    title: 'مختبر التحليل المرئي الاحترافي',
    description: 'تصفح فيديوهات التلاميذ إطاراً بإطار (Frame-by-Frame)، وارسم ملاحظاتك الهندسية مباشرة فوق الفيديو، مع أداة الملاحظات الصوتية الفورية.',
    icon: Video,
    color: 'text-emerald-600',
    bg: 'bg-emerald-100',
    image: 'https://images.unsplash.com/photo-1576403913070-5b6fb1bfa54d?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 3,
    title: 'نظام المناهج التفاعلية',
    description: 'أسند تمارين جاهزة مدعمة بالصور والفيديوهات المتتالية لطلابك بكبسة زر، أو ارفع مقاطعك الخاصة ليستلمها التلميذ فوراً.',
    icon: Dumbbell,
    color: 'text-amber-600',
    bg: 'bg-amber-100',
    image: 'https://images.unsplash.com/photo-1434493789847-2a0a5ce538f6?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 4,
    title: 'تقارير أكاديمية بمنظور عالمي',
    description: 'استخرج تقارير جاهزة للطباعة (PDF) تتضمن تحليل نقاط القوة والضعف للمهارات الحركية والنفسية لكل طالب مع رسم بياني للتقدم.',
    icon: BarChart3,
    color: 'text-purple-600',
    bg: 'bg-purple-100',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'
  }
];

export function TeacherOnboarding() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Check if it's the first time
    const hasSeenOnboarding = localStorage.getItem('haraka_teacher_onboarding_v2');
    if (!hasSeenOnboarding) {
      // Small delay for smooth entrance after login
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('haraka_teacher_onboarding_v2', 'true');
  };

  const slide = ONBOARDING_SLIDES[currentSlide];
  const Icon = slide.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-slate-900/40 backdrop-blur-md rtl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white w-full max-w-4xl rounded-[2rem] shadow-2xl overflow-hidden relative flex flex-col md:flex-row"
          >
            {/* Close Button */}
            <button 
              onClick={handleClose}
              className="absolute top-4 left-4 z-50 p-2 bg-black/10 hover:bg-black/20 text-white rounded-full backdrop-blur-sm transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image Side */}
            <div className="w-full md:w-1/2 h-64 md:h-[500px] relative">
               <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-slate-900/60 to-transparent z-10" />
               <AnimatePresence mode="wait">
                 <motion.img 
                   key={slide.image}
                   src={slide.image}
                   initial={{ opacity: 0, scale: 1.1 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0 }}
                   transition={{ duration: 0.5 }}
                   className="w-full h-full object-cover absolute inset-0"
                 />
               </AnimatePresence>
               <div className="absolute bottom-8 right-8 z-20 text-white flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center`}>
                     <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white/80 text-sm font-bold tracking-widest uppercase">النسخة الجديدة 2.0</div>
                    <div className="text-xl font-black">{slide.title}</div>
                  </div>
               </div>
            </div>

            {/* Content Side */}
            <div className="w-full md:w-1/2 p-10 md:p-12 flex flex-col">
               <div className="flex gap-2 mb-10 w-full">
                 {ONBOARDING_SLIDES.map((_, idx) => (
                   <div 
                     key={idx} 
                     className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-blue-600 flex-1' : 'bg-slate-200 w-8 cursor-pointer hover:bg-slate-300'}`}
                     onClick={() => setCurrentSlide(idx)}
                   />
                 ))}
               </div>

               <AnimatePresence mode="wait">
                 <motion.div 
                   key={currentSlide}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: 20 }}
                   transition={{ duration: 0.3 }}
                   className="flex-1"
                 >
                   <div className={`w-16 h-16 ${slide.bg} ${slide.color} rounded-2xl flex items-center justify-center mb-6`}>
                      <Icon className="w-8 h-8" />
                   </div>
                   <h2 className="text-3xl font-extrabold text-slate-900 mb-4 leading-tight">{slide.title}</h2>
                   <p className="text-lg font-medium text-slate-500 leading-relaxed">{slide.description}</p>
                 </motion.div>
               </AnimatePresence>

               <div className="mt-auto pt-10 flex gap-4">
                 {currentSlide < ONBOARDING_SLIDES.length - 1 ? (
                   <>
                     <Button 
                       onClick={() => setCurrentSlide(prev => prev + 1)}
                       className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-14 text-lg font-bold rounded-xl"
                     >
                       التالي
                       <ChevronLeft className="w-5 h-5 mr-2" />
                     </Button>
                     <Button 
                       variant="ghost" 
                       onClick={handleClose}
                       className="px-6 text-slate-500 hover:text-slate-800 h-14 text-base font-bold rounded-xl whitespace-nowrap"
                     >
                       تخطي
                     </Button>
                   </>
                 ) : (
                   <Button 
                     onClick={handleClose}
                     className="w-full bg-slate-900 hover:bg-slate-800 text-white h-14 text-lg font-bold rounded-xl"
                   >
                     البدء في استخدام المنصة
                     <Sparkles className="w-5 h-5 mr-2" />
                   </Button>
                 )}
               </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
