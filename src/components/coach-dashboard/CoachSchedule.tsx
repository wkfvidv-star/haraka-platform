import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Calendar as CalendarIcon, Clock, MapPin, UserCheck, MoreHorizontal, CheckCircle, XCircle, Plus, Trash2, AlertCircle, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { useCoachDashboard } from '@/contexts/CoachDashboardContext';

export default function CoachSchedule() {
  const { sessions, bookingRequests, approveBooking, rejectBooking, createSession, cancelSession } = useCoachDashboard();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSessionData, setNewSessionData] = useState({ client: '', type: 'تدريب شخصي', time: '10:00 ص' });

  const handleCreateSession = () => {
    if (!newSessionData.client) {
      toast.error('يرجى تحديد اسم المتدرب');
      return;
    }
    createSession({
      client: newSessionData.client,
      type: newSessionData.type,
      time: newSessionData.time,
      location: 'المنصة',
      color: 'bg-indigo-500'
    });
    setIsDialogOpen(false);
    setNewSessionData({ client: '', type: 'تدريب شخصي', time: '10:00 ص' });
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">جدول المواعيد</h2>
          <p className="text-lg text-slate-500 mt-2 font-medium">تنظيم الحصص والتدريبات والمتابعات اليومية.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex flex-wrap items-center justify-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm shrink-0">
            <Button onClick={() => toast('تم عرض المواعيد الشهرية')} variant="ghost" className="rounded-lg font-bold text-slate-500 hover:text-slate-900">شهري</Button>
            <Button onClick={() => toast('تم عرض المواعيد الأسبوعية')} variant="ghost" className="rounded-lg font-bold text-slate-500 hover:text-slate-900">أسبوعي</Button>
            <Button onClick={() => toast('تم عرض المواعيد اليومية')} className="rounded-lg font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 shadow-none">يومي</Button>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="h-12 w-full sm:w-auto px-6 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200">
                <Plus className="w-5 h-5 ml-2" /> إنشاء حصة
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white border-none shadow-2xl rounded-3xl" dir="rtl">
               <div className="p-6">
                 <h2 className="text-2xl font-black text-slate-900 mb-6">إنشاء حصة جديدة</h2>
                 <div className="space-y-4">
                   <div>
                     <label className="text-sm font-bold text-slate-700 mb-1.5 block">اسم المتدرب / المجموعة</label>
                     <Input 
                       value={newSessionData.client}
                       onChange={e => setNewSessionData({...newSessionData, client: e.target.value})}
                       className="bg-slate-50 border-slate-200 focus:ring-blue-500 h-12 rounded-xl" placeholder="أدخل اسم المتدرب" />
                   </div>
                   <div>
                     <label className="text-sm font-bold text-slate-700 mb-1.5 block">نوع الحصة</label>
                     <select 
                       value={newSessionData.type}
                       onChange={e => setNewSessionData({...newSessionData, type: e.target.value})}
                       className="w-full bg-slate-50 border-slate-200 focus:ring-blue-500 h-12 rounded-xl px-4 font-medium text-slate-900 border outline-none">
                       <option>تدريب شخصي</option>
                       <option>متابعة عن بُعد</option>
                       <option>جلسة تقييم نفسي</option>
                       <option>تدريب ذهني</option>
                     </select>
                   </div>
                   <div>
                     <label className="text-sm font-bold text-slate-700 mb-1.5 block">الوقت والتاريخ</label>
                     <Input 
                       value={newSessionData.time}
                       onChange={e => setNewSessionData({...newSessionData, time: e.target.value})}
                       className="bg-slate-50 border-slate-200 focus:ring-blue-500 h-12 rounded-xl" placeholder="مثال: 10:00 ص" />
                   </div>
                   <Button onClick={handleCreateSession} className="w-full h-12 bg-blue-600 hover:bg-blue-700 font-bold rounded-xl mt-4">
                     تأكيد وإنشاء الحصة
                   </Button>
                 </div>
               </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* LEFT COLUMN: PENDING BOOKINGS & CALENDAR */}
        <div className="w-full lg:w-1/3 space-y-6">
          
          {/* BOOKING REQUESTS */}
          <Card className={`bg-white shadow-sm border-t-4 ${bookingRequests.length > 0 ? 'border-t-blue-500 border-blue-200' : 'border-t-slate-200 border-slate-200'}`}>
            <CardContent className="p-6">
               <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center justify-between">
                 طلبات الحجز ({bookingRequests.length}) 
                 {bookingRequests.length > 0 && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
               </h3>
               
               <div className="space-y-4">
                  {bookingRequests.map(request => (
                    <div key={request.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl relative overflow-hidden group hover:border-slate-300 transition-colors">
                       <p className="font-bold text-slate-900 mb-1">{request.client}</p>
                       <p className="text-xs font-semibold text-slate-500 mb-3 block">{request.details}</p>
                       <div className="flex gap-2 relative z-10">
                         <Button onClick={() => approveBooking(request.id)} className="flex-1 h-9 rounded-lg font-bold bg-emerald-600 hover:bg-emerald-700 shadow-sm text-xs transition-all"><CheckCircle className="w-4 h-4 ml-1"/> قبول</Button>
                         <Button onClick={() => rejectBooking(request.id)} variant="outline" className="flex-1 h-9 rounded-lg font-bold text-red-600 hover:bg-red-50 border-red-200 text-xs transition-all"><XCircle className="w-4 h-4 ml-1"/> رفض</Button>
                       </div>
                    </div>
                  ))}
                  {bookingRequests.length === 0 && (
                    <div className="p-6 bg-slate-50 border border-slate-100 rounded-xl text-center">
                      <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-slate-500 font-bold text-sm">لا توجد طلبات جديدة</p>
                    </div>
                  )}
               </div>
            </CardContent>
          </Card>

          {/* SIDE MINI CALENDAR (Visual Mock) */}
          <Card className="bg-white border-slate-200 shadow-sm hidden lg:block">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">الجدول الشهري</h3>
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
                
                {sessions.map((item, index) => (
                  <div key={item.id} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group \${item.status === 'cancelled' ? 'opacity-50' : 'is-active'}`}>
                    
                    {/* ICON / DOT */}
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white ${item.color} shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ${item.status === 'cancelled' && 'grayscale'}`}>
                      <Clock className="w-4 h-4 text-white" />
                    </div>

                    {/* CARD */}
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-slate-100 bg-slate-50 shadow-sm hover:shadow-md transition-all md:group-hover:-translate-y-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-bold text-sm ${item.status === 'cancelled' ? 'line-through text-red-400' : 'text-slate-500'}`}>{item.time}</span>
                        {item.status !== 'cancelled' && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6"><MoreHorizontal className="w-4 h-4 text-slate-400" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-40 p-2 border-slate-100 rounded-xl">
                              <DropdownMenuItem className="cursor-pointer gap-2 text-slate-700 font-bold hover:bg-slate-50 rounded-lg p-2 focus:bg-slate-50 mb-1" onClick={() => toast('سيتم إضافة هذه الميزة قريباً')}>
                                <Edit className="w-4 h-4" /> تعديل موعد
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer gap-2 text-red-600 font-bold hover:bg-red-50 rounded-lg p-2 focus:bg-red-50 focus:text-red-700" onClick={() => {
                                  if (window.confirm('هل أنت متأكد من رغبتك في إلغاء الحصة؟')) {
                                    cancelSession(item.id);
                                  }
                                }}>
                                <Trash2 className="w-4 h-4" /> إلغاء الحصة
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                      <h4 className={`font-extrabold text-lg text-slate-900 mb-1 ${item.status === 'cancelled' && 'line-through'}`}>{item.type} {item.status === 'cancelled' && '(ملغاة)'}</h4>
                      <div className="flex items-center gap-2 text-slate-600 text-sm font-semibold mb-3">
                        <UserCheck className="w-4 h-4" /> {item.client}
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold bg-white w-fit px-3 py-1.5 rounded-lg border border-slate-200">
                        <MapPin className="w-3.5 h-3.5" /> {item.location}
                      </div>
                    </div>
                  </div>
                ))}
                
                {sessions.length === 0 && (
                   <div className="text-center py-10">
                     <CalendarIcon className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                     <h3 className="text-xl font-bold text-slate-400">لا توجد حصص مجدولة اليوم</h3>
                   </div>
                )}

              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
