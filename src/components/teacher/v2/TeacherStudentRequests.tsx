import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Utensils, Calendar as CalendarIcon, CheckCircle2, XCircle, ChevronLeft, ArrowRight, Apple, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export function TeacherStudentRequests() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [diets, setDiets] = useState<any[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'bookings' | 'diets'>('bookings');
  const { toast } = useToast();

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    const b = JSON.parse(localStorage.getItem('haraka_pending_bookings') || '[]');
    const d = JSON.parse(localStorage.getItem('haraka_pending_diets') || '[]');
    setBookings(b.filter((req: any) => req.status === 'pending'));
    setDiets(d.filter((req: any) => req.status === 'pending'));
  };

  const handleAcceptBooking = (booking: any) => {
    // Update local storage bookings
    const allB = JSON.parse(localStorage.getItem('haraka_pending_bookings') || '[]');
    const updatedB = allB.map((b: any) => b.id === booking.id ? { ...b, status: 'accepted' } : b);
    localStorage.setItem('haraka_pending_bookings', JSON.stringify(updatedB));

    // Send notification to youth
    const notes = JSON.parse(localStorage.getItem('haraka_youth_notifications') || '[]');
    notes.unshift({
        id: Date.now().toString(),
        type: 'booking_accepted',
        title: '✅ تم تأكيد حجز الحصة!',
        message: `المدرب أكد حصتك يوم ${booking.date} الساعة ${booking.time}.`,
        read: false,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('haraka_youth_notifications', JSON.stringify(notes));

    toast({ title: 'تم تأكيد الحجز', description: 'تم إرسال إشعار للشاب بنجاح.' });
    loadRequests();
  };

  const [selectedDietReq, setSelectedDietReq] = useState<any>(null);

  const suggestedDiets = [
    { id: 'd1', name: 'خطة حرق الدهون المتقدمة', calories: '1800 kcal', desc: 'نظام قليل الكربوهيدرات مع التركيز على البروتين.' },
    { id: 'd2', name: 'خطة التضخيم العضلي', calories: '2800 kcal', desc: 'نظام غني بالكربوهيدرات المعقدة والبروتين الكامل.' },
    { id: 'd3', name: 'الصيام المتقطع الذكي', calories: '2000 kcal', desc: 'نظام 16/8 للمحافظة على الوزن وتحسين الأيض.' }
  ];

  const handleSendDiet = (dietPlanName: string) => {
    if (!selectedDietReq) return;

    // Update local storage diets
    const allD = JSON.parse(localStorage.getItem('haraka_pending_diets') || '[]');
    const updatedD = allD.map((d: any) => d.id === selectedDietReq.id ? { ...d, status: 'completed' } : d);
    localStorage.setItem('haraka_pending_diets', JSON.stringify(updatedD));

    // Send notification to youth
    const notes = JSON.parse(localStorage.getItem('haraka_youth_notifications') || '[]');
    notes.unshift({
        id: Date.now().toString(),
        type: 'diet_received',
        title: '🥗 خطتك الغذائية جاهزة!',
        message: `أرسل لك المدرب خطة: ${dietPlanName}. يمكنك مراجعتها الآن.`,
        read: false,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('haraka_youth_notifications', JSON.stringify(notes));

    toast({ title: 'تم إرسال النظام الغذائي', description: 'تم توجيه الخطة للشاب بنجاح.' });
    setSelectedDietReq(null);
    loadRequests();
  };

  const getGoalLabel = (goal: string) => {
    if (goal === 'cut') return 'حرق الدهون';
    if (goal === 'bulk') return 'تضخيم عضلي';
    return 'محافظة وأداء';
  };

  return (
    <div className="space-y-6" dir="rtl">
      {selectedDietReq ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm relative">
            <Button variant="ghost" className="mb-6 text-slate-500 hover:text-slate-900" onClick={() => setSelectedDietReq(null)}>
                <ArrowRight className="w-5 h-5 ml-2" /> العودة للطلبات
            </Button>
            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                    <Apple className="w-8 h-8" />
                </div>
                <div>
                   <h2 className="text-2xl font-black text-slate-900">إنشاء نظام غذائي (لـ {selectedDietReq.studentName})</h2>
                   <p className="text-slate-500 font-medium">الهدف المسجل: {getGoalLabel(selectedDietReq.goal)} | الحساسية: {selectedDietReq.allergies || 'لا توجد'}</p>
                </div>
            </div>

            <h3 className="font-bold text-slate-900 mb-4">الأنظمة الغذائية المقترحة من الذكاء الاصطناعي:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {suggestedDiets.map(diet => (
                    <div key={diet.id} className="p-6 rounded-2xl border-2 border-slate-100 hover:border-emerald-500 group transition-all cursor-pointer bg-slate-50" onClick={() => handleSendDiet(diet.name)}>
                        <h4 className="font-black text-lg text-slate-900 mb-1">{diet.name}</h4>
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 mb-3">{diet.calories}</Badge>
                        <p className="text-slate-500 text-sm font-medium">{diet.desc}</p>
                        <Button className="w-full mt-6 bg-white border border-slate-200 text-slate-900 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-colors">
                            إرسال واعتماد
                        </Button>
                    </div>
                ))}
            </div>
        </motion.div>
      ) : (
        <>
            <div className="bg-white rounded-[2rem] border border-slate-200 p-6 flex items-center gap-4 shadow-sm">
                <button onClick={() => setActiveSubTab('bookings')} className={cn("px-6 py-3 rounded-xl font-bold transition-all text-sm", activeSubTab === 'bookings' ? 'bg-orange-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')}>
                    حجوزات الحصص ({bookings.length})
                </button>
                <button onClick={() => setActiveSubTab('diets')} className={cn("px-6 py-3 rounded-xl font-bold transition-all text-sm", activeSubTab === 'diets' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')}>
                    طلبات التغذية ({diets.length})
                </button>
            </div>

            <ScrollArea className="h-[calc(100vh-250px)]">
                <div className="space-y-4">
                    {activeSubTab === 'bookings' && bookings.length === 0 && (
                        <div className="text-center py-20 text-slate-500 font-medium">لا توجد طلبات حجوزات معلقة.</div>
                    )}
                    {activeSubTab === 'diets' && diets.length === 0 && (
                        <div className="text-center py-20 text-slate-500 font-medium">لا توجد طلبات أنظمة غذائية معلقة.</div>
                    )}

                    {activeSubTab === 'bookings' && bookings.map(b => (
                        <div key={b.id} className="bg-white p-6 rounded-2xl border-l-4 border-l-orange-500 border-y border-r border-slate-200 shadow-sm flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                                    <CalendarIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-extrabold text-slate-900 text-lg">طلب حصة تدريبية: {b.studentName}</h4>
                                    <p className="text-slate-500 font-medium text-sm">التاريخ المختار: اليوم {b.date} | الوقت: {b.time}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 font-bold" onClick={() => loadRequests()}>رفض</Button>
                                <Button className="bg-orange-600 hover:bg-orange-700 text-white font-bold" onClick={() => handleAcceptBooking(b)}>
                                    <CheckCircle2 className="w-4 h-4 ml-2" /> تأكيد الحجز
                                </Button>
                            </div>
                        </div>
                    ))}

                    {activeSubTab === 'diets' && diets.map(d => (
                        <div key={d.id} className="bg-white p-6 rounded-2xl border-l-4 border-l-emerald-500 border-y border-r border-slate-200 shadow-sm flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                                    <Utensils className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-extrabold text-slate-900 text-lg">طلب نظام غذائي: {d.studentName}</h4>
                                    <p className="text-slate-500 font-medium text-sm">الهدف: {getGoalLabel(d.goal)} | الحساسية: {d.allergies || 'لا يوجد'}</p>
                                </div>
                            </div>
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold" onClick={() => setSelectedDietReq(d)}>
                                إعداد الخطة الغذائية <ChevronLeft className="w-4 h-4 mr-2" />
                            </Button>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </>
      )}
    </div>
  );
}
