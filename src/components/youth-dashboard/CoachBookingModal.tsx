import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, User, ChevronLeft, ChevronRight, CheckCircle2, ShieldCheck, X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { youthDataService } from '@/services/youthDataService';

interface CoachBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CoachBookingModal({ isOpen, onClose }: CoachBookingModalProps) {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedCoach, setSelectedCoach] = useState<string | null>(null);
  const { toast } = useToast();

  const coaches = [
    { id: 'c1', name: 'الكابتن أحمد', spec: 'تدريب القوة واللياقة', rating: 4.9, avatar: '💪' },
    { id: 'c2', name: 'المدربة سارة', spec: 'مرونة وإعادة تأهيل', rating: 5.0, avatar: '🧘‍♀️' },
    { id: 'c3', name: 'الكابتن خالد', spec: 'الأداء العالي والسرعة', rating: 4.8, avatar: '⚡' },
  ];

  const timeSlots = ["09:00 ص", "10:30 ص", "04:00 م", "05:30 م", "07:00 م", "08:15 م"];
  const dates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      day: d.toLocaleDateString('ar-TN', { weekday: 'short' }),
      date: d.getDate(),
      fullDate: d
    };
  });

  const handleConfirm = () => {
    const coach = coaches.find(c => c.id === selectedCoach);
    
    youthDataService.addSession({
      title: `جلسة مع ${coach?.name}`,
      coach: coach?.name || 'مدرب مجهول',
      date: selectedDate ? `2024-03-${selectedDate.toString().padStart(2, '0')}` : '2024-03-30',
      time: selectedTime || '10:00 ص',
      type: 'in-person',
      category: 'physical',
      status: 'upcoming',
      duration: '60 دقيقة'
    });

    setStep(3);
    setTimeout(() => {
      toast({
        title: "✅ تم الحجز بنجاح",
        description: `تم تأكيد جلستك المباشرة (1-on-1). سيصلك رابط الجلسة قريباً.`
      });
      setTimeout(() => {
        onClose();
        setStep(1);
        setSelectedDate(null);
        setSelectedTime(null);
        setSelectedCoach(null);
      }, 2000);
    }, 1500);
  };

  const resetAndClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setSelectedDate(null);
      setSelectedTime(null);
      setSelectedCoach(null);
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
            <Button variant="ghost" size="icon" onClick={resetAndClose} className="absolute top-4 left-4 z-10 text-slate-400 hover:bg-slate-100 hover:text-slate-900 rounded-full">
                <X className="w-5 h-5" />
            </Button>

          {/* Header */}
          <div className="bg-slate-900 p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-orange-500/20 rounded-full blur-[60px] -translate-x-1/2 -translate-y-1/2" />
            <h2 className="text-2xl font-black relative z-10 flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-orange-500" />
              حجز جلسة تدريبية
            </h2>
            <p className="text-slate-400 font-medium mt-1 relative z-10">اختر مدربك وحدد الموعد المناسب لجلستك 1-on-1</p>
          </div>

          {/* Body */}
          <div className="p-6">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h3 className="text-lg font-bold text-slate-900 mb-4 tracking-tight">اختر المدرب (Step 1 of 2)</h3>
                <div className="space-y-3">
                  {coaches.map(coach => (
                    <div 
                      key={coach.id} 
                      onClick={() => setSelectedCoach(coach.id)}
                      className={cn(
                        "p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4",
                        selectedCoach === coach.id 
                          ? "border-orange-500 bg-orange-50/50 shadow-sm" 
                          : "border-slate-100 hover:border-slate-200"
                      )}
                    >
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm text-2xl flex items-center justify-center shrink-0 border border-slate-100">
                        {coach.avatar}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900">{coach.name}</h4>
                        <p className="text-slate-500 text-sm font-medium">{coach.spec}</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm font-bold text-slate-700 bg-white px-2 py-1 rounded-lg border border-slate-100">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        {coach.rating}
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                    onClick={() => setStep(2)} 
                    disabled={!selectedCoach} 
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
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">تحديد الموعد (Step 2 of 2)</h3>
                </div>

                <div className="mb-6">
                  <p className="text-sm font-bold text-slate-500 mb-3">الأيام المتاحة هذا الأسبوع</p>
                  <div className="flex justify-between gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {dates.map((d, i) => (
                      <div 
                        key={i} 
                        onClick={() => setSelectedDate(d.date)}
                        className={cn(
                          "flex flex-col items-center justify-center w-[60px] min-w-[60px] h-[75px] rounded-2xl cursor-pointer transition-all border-2",
                          selectedDate === d.date
                            ? "border-orange-500 bg-orange-500 text-white shadow-md"
                            : "border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200"
                        )}
                      >
                        <span className="text-xs font-bold uppercase">{d.day}</span>
                        <span className="text-xl font-black mt-1">{d.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                   <p className="text-sm font-bold text-slate-500 mb-3">الأوقات المتاحة</p>
                   <div className="grid grid-cols-3 gap-3">
                     {timeSlots.map((time, i) => (
                       <div
                         key={i}
                         onClick={() => setSelectedTime(time)}
                         className={cn(
                           "flex items-center justify-center py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-all border-2",
                           selectedTime === time
                            ? "border-slate-900 bg-slate-900 text-white shadow-md"
                            : "border-slate-100 bg-white text-slate-600 hover:border-slate-200"
                         )}
                       >
                         {time}
                       </div>
                     ))}
                   </div>
                </div>

                <Button 
                    onClick={handleConfirm} 
                    disabled={!selectedDate || !selectedTime} 
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white h-12 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                    <CheckCircle2 className="w-5 h-5" /> تأكيد الحجز المباشر
                </Button>
              </motion.div>
            )}

            {step === 3 && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">حجز مؤكد!</h3>
                    <p className="text-slate-500 font-medium">تم جدولة الحصة بنجاح. سيقوم المدرب بمراجعة ملفك قبل الجلسة.</p>
                </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
