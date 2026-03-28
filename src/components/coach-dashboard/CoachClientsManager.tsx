import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Search, User, Activity, MoreVertical, Filter, Dumbbell, MessageSquare, PlaySquare, Send, Trophy, Flame } from 'lucide-react';
import { coachClients } from '@/data/mockCoachData';
import { Badge } from '@/components/ui/badge';
import { useCoachDashboard } from '@/contexts/CoachDashboardContext';
import { toast } from 'sonner';

export default function CoachClientsManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const { setActiveTab } = useCoachDashboard();

  const filteredClients = coachClients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">إدارة المتدربين</h2>
          <p className="text-lg text-slate-500 mt-2 font-medium">سجلات الأداء والقياسات الحيوية لجميع أعضاء الفريق.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute right-4 top-3 text-slate-400 w-5 h-5" />
            <Input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-4 pr-12 h-12 rounded-xl border-slate-200 bg-white font-semibold" 
              placeholder="البحث بالاسم..." 
            />
          </div>
          <Button variant="outline" className="h-12 w-12 p-0 rounded-xl border-slate-200 text-slate-600">
            <Filter className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* CLIENTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredClients.map((client) => (
          <Dialog key={client.id}>
            <DialogTrigger asChild>
              <Card className="bg-white border-slate-200 shadow-sm hover:shadow-lg transition-all overflow-hidden group cursor-pointer text-right">
                <div className="h-24 bg-slate-50 border-b border-slate-100 flex justify-center items-end relative">
                   <div className="absolute top-4 right-4"><Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900"><MoreVertical className="w-4 h-4" /></Button></div>
                   <div className="w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center text-3xl font-black text-blue-600 translate-y-10 group-hover:scale-105 transition-transform">
                     {client.name.charAt(0)}
                   </div>
                </div>
                
                <CardContent className="pt-14 pb-8 px-6 text-center">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{client.name}</h3>
                  <p className="text-sm font-semibold text-slate-500 mb-4">{client.goal}</p>
                  
                  {/* Vitals */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="p-3 bg-slate-50 rounded-xl flex flex-col items-center">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">النبض</span>
                      <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                        <Activity className={`w-3.5 h-3.5 ${client.currentBpm ? 'text-red-500' : 'text-slate-300'}`} />
                        <span>{client.currentBpm || '--'}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl flex flex-col items-center">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">النشاط</span>
                      <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                        <Dumbbell className="w-3.5 h-3.5 text-blue-500" />
                        <span className="truncate max-w-[60px]">{client.lastWorkout}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <Badge variant="secondary" className={`px-3 py-1.5 rounded-lg text-sm font-bold w-full justify-center ${
                    client.status === 'active' 
                      ? 'bg-green-100 text-green-700 hover:bg-green-100' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-100'
                  }`}>
                    {client.status === 'active' ? 'في صالة التدريب' : 'غير نشط حالياً'}
                  </Badge>
                </CardContent>
              </Card>
            </DialogTrigger>

            {/* ATHLETE PROFILE MODAL */}
            <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-none text-right font-sans rounded-3xl" dir="rtl">
              
              <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-8 flex items-center gap-6">
                 <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center text-4xl font-black text-blue-600 shadow-lg shrink-0">
                    {client.name.charAt(0)}
                 </div>
                 <div className="text-white">
                    <h2 className="text-3xl font-black mb-1">{client.name}</h2>
                    <p className="text-blue-100 font-semibold mb-3">{client.goal} | العمر: {client.age || 24} عام</p>
                    <div className="flex items-center gap-2">
                       <Badge className="bg-white/20 hover:bg-white/30 text-white font-bold border-none"><Trophy className="w-3 h-3 ml-1"/> المستوى: متقدم</Badge>
                       <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold border-none"><Flame className="w-3 h-3 ml-1"/> ملتزم جداً</Badge>
                    </div>
                 </div>
              </div>

              <div className="p-8 bg-slate-50 space-y-8">
                
                {/* Athlete Vitals Details */}
                <div>
                   <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-blue-600" /> تقدم الأداء العام</h3>
                   <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-xl border border-slate-200">
                         <span className="text-sm font-bold text-slate-400 block mb-1">الدهون المفقودة</span>
                         <span className="text-2xl font-black text-slate-900">4.5 KG</span>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-slate-200">
                         <span className="text-sm font-bold text-slate-400 block mb-1">كتلة عضلية</span>
                         <span className="text-2xl font-black text-slate-900">+1.2 KG</span>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-slate-200">
                         <span className="text-sm font-bold text-slate-400 block mb-1">نسبة الحضور</span>
                         <span className="text-2xl font-black text-slate-900">92%</span>
                      </div>
                   </div>
                </div>

                {/* Video Submissions */}
                <div className="bg-white p-5 rounded-2xl border border-blue-100 flex items-center justify-between shadow-sm">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                         <PlaySquare className="w-6 h-6" />
                      </div>
                      <div>
                         <h4 className="font-bold text-slate-900">آخر فيديو تم رفعه: تمرين السكوات</h4>
                         <p className="text-sm font-semibold text-slate-500">منذ ساعتين - ينتظر تقييمك</p>
                      </div>
                   </div>
                   <Button onClick={() => setActiveTab('video-review')} className="bg-blue-600 hover:bg-blue-700 font-bold rounded-xl shadow-md">
                      تحليل الفيديو
                   </Button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-slate-200">
                   <Button onClick={() => setActiveTab('messages')} variant="outline" className="flex-1 h-14 rounded-xl font-bold border-slate-300 text-slate-700 hover:bg-slate-100 text-lg">
                      <MessageSquare className="w-5 h-5 ml-2 text-blue-600" /> رسالة فورية
                   </Button>
                   <Button onClick={() => setActiveTab('programs')} variant="outline" className="flex-1 h-14 rounded-xl font-bold border-slate-300 text-slate-700 hover:bg-slate-100 text-lg">
                      <Send className="w-5 h-5 ml-2 text-emerald-600" /> إرسال برنامج
                   </Button>
                </div>

              </div>

            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
}
