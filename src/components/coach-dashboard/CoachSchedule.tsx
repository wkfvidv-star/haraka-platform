import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Clock, MapPin, UserCheck, MoreHorizontal, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const scheduleItems = [
  { id: 1, time: '09:00 ص', type: 'تدريب شخصي', client: 'محمد', location: 'الصالة الرئيسية', status: 'upcoming', color: 'bg-blue-500' },
  { id: 2, time: '11:30 ص', type: 'متابعة عن بُعد', client: 'رحيم', location: 'مكالمة فيديو', status: 'completed', color: 'bg-emerald-500' },
  { id: 3, time: '02:00 م', type: 'تدريب شخصي', client: 'رامي', location: 'منطقة الأوزان الحرة', status: 'upcoming', color: 'bg-orange-500' },
  { id: 4, time: '05:00 م', type: 'تدريب شخصي', client: 'عبد الله', location: 'الصالة الرئيسية', status: 'upcoming', color: 'bg-blue-500' },
];

export default function CoachSchedule() {
  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">جدول المواعيد</h2>
          <p className="text-lg text-slate-500 mt-2 font-medium">تنظيم الحصص والتدريبات والمتابعات اليومية.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          <Button onClick={() => toast('تم عرض المواعيد الشهرية')} variant="ghost" className="rounded-lg font-bold text-slate-500 hover:text-slate-900">شهري</Button>
          <Button onClick={() => toast('تم عرض المواعيد الأسبوعية')} variant="ghost" className="rounded-lg font-bold text-slate-500 hover:text-slate-900">أسبوعي</Button>
          <Button onClick={() => toast('تم عرض المواعيد اليومية')} className="rounded-lg font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 shadow-none">يومي</Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* LEFT COLUMN: PENDING BOOKINGS & CALENDAR */}
        <div className="w-full lg:w-1/3 space-y-6">
          
          {/* BOOKING REQUESTS (NEW) */}
          <Card className="bg-white border-blue-200 shadow-sm border-t-4 border-t-blue-500">
            <CardContent className="p-6">
               <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center justify-between">
                 طلبات الحجز (2) <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
               </h3>
               
               <div className="space-y-4">
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                     <p className="font-bold text-slate-900 mb-1">محمد</p>
                     <p className="text-xs font-semibold text-slate-500 mb-3 block">اليوم, 08:00 م - تدريب أوزان حرة</p>
                     <div className="flex gap-2">
                       <Button onClick={() => toast.success('تمت الموافقة على الحجز بنجاح!')} className="flex-1 h-9 rounded-lg font-bold bg-emerald-600 hover:bg-emerald-700 shadow-sm text-xs"><CheckCircle className="w-4 h-4 ml-1"/> قبول</Button>
                       <Button onClick={() => toast.success('تم رفض الحجز')} variant="outline" className="flex-1 h-9 rounded-lg font-bold text-red-600 hover:bg-red-50 border-red-200 text-xs"><XCircle className="w-4 h-4 ml-1"/> رفض</Button>
                     </div>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                     <p className="font-bold text-slate-900 mb-1">عبد الله</p>
                     <p className="text-xs font-semibold text-slate-500 mb-3 block">غداً, 05:00 م - لياقة بدنية</p>
                     <div className="flex gap-2">
                       <Button onClick={() => toast.success('تمت الموافقة على الحجز بنجاح!')} className="flex-1 h-9 rounded-lg font-bold bg-emerald-600 hover:bg-emerald-700 shadow-sm text-xs"><CheckCircle className="w-4 h-4 ml-1"/> قبول</Button>
                       <Button onClick={() => toast.success('تم رفض الحجز')} variant="outline" className="flex-1 h-9 rounded-lg font-bold text-red-600 hover:bg-red-50 border-red-200 text-xs"><XCircle className="w-4 h-4 ml-1"/> رفض</Button>
                     </div>
                  </div>
               </div>
            </CardContent>
          </Card>

          {/* SIDE MINI CALENDAR (Visual Mock) */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">أكتوبر 2026</h3>
                <div className="flex gap-2">
                  <Button onClick={() => toast('الشهر السابق')} variant="outline" size="icon" className="h-8 w-8">&lt;</Button>
                  <Button onClick={() => toast('الشهر التالي')} variant="outline" size="icon" className="h-8 w-8">&gt;</Button>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-2 text-center mb-4">
                {['أح', 'إث', 'ثل', 'أر', 'خم', 'جم', 'سب'].map(d => (
                  <div key={d} className="text-sm font-bold text-slate-400">{d}</div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-2 text-center">
                {Array.from({length: 31}).map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-10 w-10 mx-auto rounded-xl flex items-center justify-center font-bold text-sm cursor-pointer transition-colors ${
                      i + 1 === 15 ? 'bg-blue-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* TIMELINE */}
        <div className="w-full lg:w-2/3">
          <Card className="bg-white border-none shadow-sm h-full">
            <CardContent className="p-8">
              <h3 className="text-2xl font-black text-slate-900 mb-8 border-b border-slate-100 pb-4">مواعيد اليوم (15 أكتوبر)</h3>
              
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                
                {scheduleItems.map((item, index) => (
                  <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    
                    {/* ICON / DOT */}
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white ${item.color} shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10`}>
                      <Clock className="w-4 h-4 text-white" />
                    </div>

                    {/* CARD */}
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-slate-100 bg-slate-50 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-slate-400 text-sm">{item.time}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6"><MoreHorizontal className="w-4 h-4 text-slate-400" /></Button>
                      </div>
                      <h4 className="font-extrabold text-lg text-slate-900 mb-1">{item.type}</h4>
                      <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold mb-3">
                        <UserCheck className="w-4 h-4" /> {item.client}
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold bg-white w-fit px-3 py-1.5 rounded-lg border border-slate-200">
                        <MapPin className="w-3.5 h-3.5" /> {item.location}
                      </div>
                    </div>
                  </div>
                ))}

              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
