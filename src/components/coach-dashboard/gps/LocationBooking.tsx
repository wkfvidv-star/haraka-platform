import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin, CheckCircle2, XCircle, Clock, CalendarCheck, Map, ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';

interface BookingRequest {
  id: string;
  studentName: string;
  parentName?: string;
  locationName: string;
  distance: string; // e.g. "1.2 km"
  date: string;
  time: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface Attendee {
  id: string;
  name: string;
  arrivedTime: string;
  verified: boolean;
}

export default function LocationBooking() {
  const [requests, setRequests] = useState<BookingRequest[]>([
    { id: '1', studentName: 'زياد خالد', parentName: 'خالد محمد', locationName: 'حديقة العليا', distance: '0.8 كيلومتر', date: 'غداً', time: '16:00', status: 'pending' },
    { id: '2', studentName: 'أنس عبدالله', locationName: 'ممشى الواحة', distance: '2.5 كيلومتر', date: 'السبت', time: '09:00', status: 'pending' },
    { id: '3', studentName: 'بدر حمد', parentName: 'حمد فهد', locationName: 'ملعب الحي', distance: '1.1 كيلومتر', date: 'اليوم', time: '17:30', status: 'approved' }
  ]);

  const [attendees, setAttendees] = useState<Attendee[]>([
    { id: 'a1', name: 'رحيم بوعلام', arrivedTime: '15:20', verified: true },
    { id: 'a2', name: 'غسان مراد', arrivedTime: '15:25', verified: true },
    { id: 'a3', name: 'عبدالله سعيد', arrivedTime: '--:--', verified: false },
  ]);

  const handleAction = (id: string, action: 'approved' | 'rejected') => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: action } : r));
    if (action === 'approved') toast.success('تم قبول الحجز وارسال تنبيه للمتدرب.');
    else toast.error('تم رفض الحجز.');
  };

  const simulateArrival = (id: string) => {
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setAttendees(prev => prev.map(a => a.id === id ? { ...a, verified: true, arrivedTime: timeString } : a));
    toast.success('تم تسجيل الحضور جغرافياً!');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" dir="rtl">
      
      {/* 📅 Booking Requests */}
      <Card className="border-slate-800 shadow-2xl bg-slate-900 rounded-3xl overflow-hidden flex flex-col h-[650px]">
        <div className="p-6 border-b border-slate-800 bg-slate-800/20">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-white font-black text-xl mb-1 flex items-center gap-2">
                <CalendarCheck className="w-6 h-6 text-purple-400" /> طلبات الحجز الميداني
              </h3>
              <p className="text-slate-400 font-medium text-sm">حجوزات تعتمد على المسافة الجغرافية</p>
            </div>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">جديد {requests.filter(r => r.status === 'pending').length}</Badge>
          </div>
        </div>

        <div className="p-6 flex-1 overflow-y-auto space-y-4 custom-scrollbar">
          <AnimatePresence>
            {requests.map((req) => (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`p-5 rounded-3xl border transition-all ${
                  req.status === 'pending' ? 'bg-slate-800/40 border-slate-700' : 
                  req.status === 'approved' ? 'bg-emerald-900/10 border-emerald-900/50' : 
                  'bg-red-900/10 border-red-900/50 opacity-60'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-white font-black text-lg">{req.studentName}</h4>
                    {req.parentName && <p className="text-xs text-slate-400 font-bold bg-slate-800 inline-block px-2 py-1 rounded-md mt-1">ولي الأمر: {req.parentName}</p>}
                  </div>
                  <Badge variant="outline" className={`font-bold border-none py-1 px-3
                    ${req.status === 'pending' ? 'bg-amber-500/20 text-amber-500' : ''}
                    ${req.status === 'approved' ? 'bg-emerald-500/20 text-emerald-500' : ''}
                    ${req.status === 'rejected' ? 'bg-red-500/20 text-red-500' : ''}
                  `}>
                    {req.status === 'pending' && 'قيد الانتظار'}
                    {req.status === 'approved' && 'مقبول'}
                    {req.status === 'rejected' && 'مرفوض'}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-slate-950/50 p-3 rounded-2xl flex items-center gap-3 border border-slate-800 text-sm">
                    <MapPin className="w-5 h-5 text-rose-400 shrink-0" />
                    <div className="min-w-0">
                       <p className="text-slate-300 font-bold truncate">{req.locationName}</p>
                       <p className="text-rose-400 text-xs font-black" dir="ltr">{req.distance} away</p>
                    </div>
                  </div>
                  <div className="bg-slate-950/50 p-3 rounded-2xl flex items-center gap-3 border border-slate-800 text-sm">
                    <Clock className="w-5 h-5 text-blue-400 shrink-0" />
                    <div>
                       <p className="text-slate-300 font-bold">{req.date}</p>
                       <p className="text-blue-400 text-xs font-black">{req.time}</p>
                    </div>
                  </div>
                </div>

                {req.status === 'pending' && (
                  <div className="flex gap-3">
                    <Button onClick={() => handleAction(req.id, 'approved')} className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold shadow-lg shadow-emerald-900/30">
                      <CheckCircle2 className="w-4 h-4 ml-2" /> قبول الموعد والمكان
                    </Button>
                    <Button onClick={() => handleAction(req.id, 'rejected')} variant="outline" className="rounded-xl border-red-500/30 text-red-400 hover:bg-red-500/10 font-bold">
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Card>

      {/* 📍 Geo-Attendance */}
      <Card className="border-slate-800 shadow-xl bg-slate-900/80 backdrop-blur-xl rounded-3xl h-[650px] flex flex-col pt-6 px-6 pb-0 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-emerald-600/20 to-transparent blur-3xl rounded-full" />
        
        <div className="relative z-10 mb-6">
          <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-3 ml-auto text-sm py-1">Geo-Fencing Active</Badge>
          <h3 className="text-white font-black text-2xl mb-2 flex items-center gap-2">
            التحقق من الحضور المكاني <Map className="w-6 h-6 text-emerald-400" />
          </h3>
          <p className="text-slate-400 font-medium leading-relaxed">
            يتم تسجيل حضور المتدرب آلياً بمجرد دخوله لنطاق التدريب (Geo-Fencing) عبر الـ GPS.
          </p>
        </div>

        <div className="bg-slate-950 p-4 rounded-3xl border border-slate-800 flex items-center justify-between mb-6 relative z-10">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center relative">
                 <ShieldCheck className="w-6 h-6 text-emerald-400 relative z-10" />
                 <div className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping" />
              </div>
              <div>
                 <p className="text-white font-bold text-lg">نطاق الحصة الحالية</p>
                 <p className="text-slate-400 text-sm font-medium">نقطة تجمع: صالة الفرسان الميدانية</p>
              </div>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pb-6 relative z-10 custom-scrollbar">
          {attendees.map(a => (
            <div key={a.id} className="flex items-center justify-between bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-700 text-white font-black flex items-center justify-center">
                  {a.name.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-bold">{a.name}</p>
                  <p className={`text-xs font-bold mt-1 ${a.verified ? 'text-emerald-400' : 'text-slate-500'}`}>
                    وقت الوصول: {a.arrivedTime}
                  </p>
                </div>
              </div>

              {a.verified ? (
                <div className="bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-bold border border-emerald-500/30">
                  <CheckCircle2 className="w-4 h-4" /> حاضر (GPS)
                </div>
              ) : (
                <Button 
                  onClick={() => simulateArrival(a.id)}
                  variant="outline" 
                  size="sm"
                  className="rounded-lg border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 font-bold"
                >
                  محاكاة الوصول
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
