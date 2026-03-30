import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Navigation, Zap, Calendar, TrendingUp } from 'lucide-react';

export const ActivityHistory = () => {
   const history = [
      { id: 1, date: 'اليوم', type: 'جري حر', dist: '5.2 كم', time: '35:20', speed: '8.8 كم/س', status: 'ممتاز' },
      { id: 2, date: 'أمس', type: 'تحدي الحديقة', dist: '3.0 كم', time: '21:10', speed: '8.5 كم/س', status: 'جيد جداً' },
      { id: 3, date: 'قبل 3 أيام', type: 'مشي سير', dist: '4.5 كم', time: '55:00', speed: '4.9 كم/س', status: 'متوسط' },
   ];

   return (
      <div className="space-y-6">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card className="bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border-indigo-500/20 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
               <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                     <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                        <Navigation className="w-6 h-6 text-indigo-400" />
                     </div>
                     <Badge variant="outline" className="border-indigo-400/30 text-indigo-300 font-bold">هذا الأسبوع</Badge>
                  </div>
                  <h4 className="text-slate-400 text-sm font-bold mb-1">إجمالي المسافة</h4>
                  <div className="text-3xl font-black text-white">12.7 <span className="text-sm text-slate-500 font-bold">كم</span></div>
               </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-rose-500/10 to-orange-500/10 border-rose-500/20 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
               <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                     <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-rose-400" />
                     </div>
                     <Badge variant="outline" className="border-rose-400/30 text-rose-300 font-bold">هذا الأسبوع</Badge>
                  </div>
                  <h4 className="text-slate-400 text-sm font-bold mb-1">وقت النشاط</h4>
                  <div className="text-3xl font-black text-white">1:51 <span className="text-sm text-slate-500 font-bold">ساعة</span></div>
               </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-teal-500/10 border-green-500/20 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
               <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                     <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                        <Zap className="w-6 h-6 text-green-400" />
                     </div>
                     <Badge variant="outline" className="border-green-400/30 text-green-300 font-bold">هذا الأسبوع</Badge>
                  </div>
                  <h4 className="text-slate-400 text-sm font-bold mb-1">متوسط السرعة</h4>
                  <div className="text-3xl font-black text-white">7.4 <span className="text-sm text-slate-500 font-bold">كم/س</span></div>
               </CardContent>
            </Card>
         </div>

         {/* History List */}
         <Card className="bg-[#0B0E14]/80 backdrop-blur-xl border border-white/5 shadow-2xl">
            <CardHeader className="border-b border-white/5 pb-4">
               <CardTitle className="text-lg font-black text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" /> سجل النشاطات السابقة
               </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y divide-white/5">
                  {history.map(item => (
                     <div key={item.id} className="p-4 hover:bg-white/5 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center shrink-0">
                              <TrendingUp className="w-5 h-5" />
                           </div>
                           <div>
                              <div className="flex items-center gap-2 mb-1">
                                 <h4 className="font-bold text-white text-sm">{item.type}</h4>
                                 <Badge variant="outline" className="text-[10px] border-white/10 text-slate-400 px-1 py-0">{item.date}</Badge>
                              </div>
                              <div className="flex items-center gap-4 text-[11px] font-bold text-slate-500">
                                 <span className="flex items-center gap-1"><Navigation className="w-3 h-3 text-orange-400/70" /> {item.dist}</span>
                                 <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-rose-400/70" /> {item.time}</span>
                                 <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-blue-400/70" /> {item.speed}</span>
                              </div>
                           </div>
                        </div>
                        <Badge className={`px-4 py-1.5 rounded-full font-bold text-xs ${item.status === 'ممتاز' ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : item.status === 'جيد جداً' ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'}`}>
                           أداء {item.status}
                        </Badge>
                     </div>
                  ))}
               </div>
            </CardContent>
         </Card>
      </div>
   );
};
