import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { 
  Search, MoreVertical, Filter, Dumbbell, MessageSquare, 
  PlaySquare, Send, Trophy, Flame, Activity, UserPlus, FileText, Apple, Target
} from 'lucide-react';
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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">إدارة المتدربين</h2>
          <p className="text-base md:text-lg text-slate-500 mt-2 font-medium">سجلات الأداء والقياسات الحيوية لجميع أعضاء فريقك.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute right-4 top-3.5 text-slate-400 w-5 h-5 pointer-events-none" />
            <Input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-4 pr-12 h-12 rounded-xl border-slate-200 bg-white font-bold text-slate-900 shadow-sm focus:ring-blue-500 w-full" 
              placeholder="البحث باسم المتدرب..." 
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="h-12 w-12 p-0 rounded-xl border-slate-200 text-slate-600 bg-white shadow-sm shrink-0">
              <Filter className="w-5 h-5" />
            </Button>
            <Button className="h-12 flex-1 sm:w-auto px-6 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200 flex items-center justify-center">
              <UserPlus className="w-5 h-5 ml-2" /> <span className="hidden sm:inline">إضافة جديد</span>
            </Button>
          </div>
        </div>
      </div>

      {/* CLIENTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredClients.map((client) => (
          <Dialog key={client.id}>
            <DialogTrigger asChild>
              <Card className="bg-white border-transparent hover:border-blue-200 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all overflow-hidden group cursor-pointer text-right relative transform hover:-translate-y-1">
                
                {/* Card Banner */}
                <div className="h-28 bg-gradient-to-br from-slate-100 to-slate-200 flex justify-center items-end relative p-4">
                   <div className="absolute top-4 right-4 z-10">
                     <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 bg-white/50 backdrop-blur hover:bg-white hover:text-slate-900 rounded-lg">
                       <MoreVertical className="w-4 h-4" />
                     </Button>
                   </div>
                   
                   {/* Status Indicator */}
                   <div className="absolute top-4 left-4 z-10 flex gap-1">
                      {client.status === 'active' && (
                        <span className="flex h-3 w-3 relative">
                           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                           <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                      )}
                   </div>

                   {/* Avatar */}
                   <div className="w-20 h-20 rounded-3xl bg-white shadow-xl flex items-center justify-center text-3xl font-black text-blue-600 translate-y-10 group-hover:scale-110 transition-transform duration-300 relative z-20 border border-slate-100">
                     {client.name.charAt(0)}
                   </div>
                </div>
                
                <CardContent className="pt-14 pb-6 px-5 text-center bg-white relative z-10">
                  <h3 className="text-xl font-black text-slate-900 mb-1 tracking-tight">{client.name}</h3>
                  <p className="text-sm font-bold text-slate-500 mb-5">{client.goal}</p>
                  
                  {/* Vitals Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="p-3 bg-slate-50/80 rounded-2xl flex flex-col items-center border border-slate-100/50">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">النبض المباشر</span>
                      <div className="flex items-center gap-1.5 text-slate-900 font-black text-lg">
                        <Activity className={`w-4 h-4 ${client.currentBpm ? 'text-red-500 animate-pulse' : 'text-slate-300'}`} />
                        <span>{client.currentBpm || '--'}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50/80 rounded-2xl flex flex-col items-center border border-slate-100/50">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">حالة النشاط</span>
                      <div className="flex items-center gap-1.5 text-slate-900 font-bold text-sm">
                        <Dumbbell className="w-4 h-4 text-blue-500" />
                        <span className="truncate max-w-[70px]">{client.lastWorkout}</span>
                      </div>
                    </div>
                  </div>

                  {/* Badges Flow */}
                  <div className="flex flex-wrap items-center justify-center gap-2">
                     <Badge variant="secondary" className={`px-2 py-1 rounded-md text-xs font-bold ${
                       client.status === 'active' 
                         ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100' 
                         : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100'
                     }`}>
                       {client.status === 'active' ? 'يتدرب الآن' : 'غير متصل'}
                     </Badge>
                     {client.id.includes('1') && <Badge className="bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-100 px-2 py-1 rounded-md text-xs font-bold border-none"><Flame className="w-3 h-3 ml-0.5" /> 7 أيام متتالية</Badge>}
                  </div>

                </CardContent>
              </Card>
            </DialogTrigger>

            {/* ATHLETE PROFILE MODAL (World-Class SaaS UI) */}
            <DialogContent className="sm:max-w-md lg:max-w-[850px] p-0 overflow-hidden border-none text-right font-sans rounded-[2rem] bg-white shadow-2xl flex flex-col max-h-[95vh]" dir="rtl">
              
              {/* Modal Header Cover */}
              <div className="bg-slate-950 p-6 md:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative shrink-0 overflow-hidden">
                 
                 {/* Decorative background shape */}
                 <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                    <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-blue-600 blur-3xl"></div>
                    <div className="absolute bottom-[-100px] right-[-50px] w-80 h-80 rounded-full bg-indigo-600 blur-3xl"></div>
                 </div>

                 <div className="w-24 h-24 md:w-28 md:h-28 bg-white rounded-[2rem] flex items-center justify-center text-5xl font-black text-slate-900 shadow-2xl shrink-0 relative z-10 border-4 border-slate-800 rotate-3 transform">
                    {client.name.charAt(0)}
                 </div>
                 
                 <div className="text-white text-center sm:text-right relative z-10 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2">{client.name}</h2>
                        <p className="text-slate-400 font-medium text-sm md:text-base mb-4 bg-slate-900/50 inline-block px-3 py-1 rounded-lg backdrop-blur">{client.goal} | العمر: {client.age || 24} عام</p>
                      </div>
                      
                      {/* Quick Actions Header */}
                      <div className="flex gap-2 justify-center sm:justify-start">
                         <Button onClick={() => setActiveTab('messages')} size="icon" variant="ghost" className="bg-white/10 hover:bg-white/20 text-white rounded-xl h-10 w-10">
                            <MessageSquare className="w-5 h-5" />
                         </Button>
                         <Button size="icon" variant="ghost" className="bg-white/10 hover:bg-white/20 text-white rounded-xl h-10 w-10">
                            <Dumbbell className="w-5 h-5" />
                         </Button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                       <Badge className="bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 px-3 py-1.5"><Trophy className="w-4 h-4 ml-1.5"/> مستوى متقدم</Badge>
                       <Badge className="bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 px-3 py-1.5"><Flame className="w-4 h-4 ml-1.5"/> درجة التزام %92</Badge>
                    </div>
                 </div>
              </div>

              {/* Scrollable Content inside Modal */}
              <div className="flex-1 overflow-y-auto bg-slate-50/50 p-4 md:p-8 space-y-6 md:space-y-8 custom-scrollbar relative z-10">
                
                {/* 1. Key Statistics Cards */}
                <div>
                   <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-blue-600" /> ملخص المؤشرات الحيوية</h3>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
                         <span className="text-[11px] font-black text-slate-400 uppercase mb-2">الوزن المفقود</span>
                         <span className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">4.5 <span className="text-sm text-slate-400 font-bold">KG</span></span>
                      </div>
                      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
                         <span className="text-[11px] font-black text-slate-400 uppercase mb-2">أيام النشاط (الشهر)</span>
                         <span className="text-2xl md:text-3xl font-black text-blue-600 tracking-tight">21 <span className="text-sm text-blue-400 font-bold">يوم</span></span>
                      </div>
                      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
                         <span className="text-[11px] font-black text-slate-400 uppercase mb-2">البرنامج الحالي</span>
                         <span className="text-lg font-black text-slate-900 truncate">تأسيس القوة</span>
                      </div>
                      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-2xl shadow-sm border border-emerald-100 flex flex-col justify-center">
                         <span className="text-[11px] font-black text-emerald-600 uppercase mb-2">نسبة الحضور المباشر</span>
                         <span className="text-2xl md:text-3xl font-black text-emerald-700 tracking-tight">92%</span>
                      </div>
                   </div>
                </div>

                {/* 2. Review & Approvals Queue */}
                <div className="space-y-4">
                   <h3 className="text-lg font-black text-slate-900 flex items-center gap-2"><PlaySquare className="w-5 h-5 text-indigo-600" /> المرفقات تحتاج تقييم</h3>
                   <div className="bg-white p-4 md:p-5 rounded-3xl border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm gap-4 hover:border-indigo-200 transition-colors group">
                      <div className="flex items-center gap-4">
                         <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <PlaySquare className="w-6 h-6" />
                         </div>
                         <div>
                            <h4 className="font-black text-slate-900 text-lg">تحليل تمرين السكوات</h4>
                            <p className="text-sm font-bold text-slate-500 mt-0.5">مُرسل منذ ساعتين - زاوية الركبة تحتاج تصحيح</p>
                         </div>
                      </div>
                      <Button onClick={() => setActiveTab('video-review')} className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 font-bold rounded-xl shadow-lg shadow-indigo-200 h-12 px-6">
                         بدء التحليل
                      </Button>
                   </div>
                </div>

                {/* 3. Assigned Documents */}
                <div className="space-y-4">
                   <h3 className="text-lg font-black text-slate-900 flex items-center gap-2"><Target className="w-5 h-5 text-orange-500" /> المستندات المسندة حالياً</h3>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm">
                        <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                           <FileText className="w-6 h-6" />
                        </div>
                        <div className="flex-1 hidden sm:block">
                           <h5 className="font-bold text-slate-900">برنامج ضخامة (متقدم)</h5>
                           <p className="text-xs text-slate-400 font-bold mt-1">مسار التدريب الرياضي</p>
                        </div>
                        <Button 
                           onClick={() => setActiveTab('programs')} 
                           variant="outline" 
                           size="sm" 
                           className="h-10 w-full sm:w-auto rounded-lg font-bold border-slate-200 text-slate-600 hover:bg-slate-50"
                        >تعديل/عرض</Button>
                      </div>

                      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                           <Apple className="w-6 h-6" />
                        </div>
                        <div className="flex-1 hidden sm:block">
                           <h5 className="font-bold text-slate-900">خطة التنشيف - 1800K</h5>
                           <p className="text-xs text-slate-400 font-bold mt-1">تتبع التغذية</p>
                        </div>
                        <Button 
                           onClick={() => setActiveTab('nutrition')} 
                           variant="outline" 
                           size="sm" 
                           className="h-10 w-full sm:w-auto rounded-lg font-bold border-slate-200 text-slate-600 hover:bg-slate-50"
                        >تعديل/عرض</Button>
                      </div>

                   </div>
                </div>

              </div>
              
              {/* Modal Footer (Sticky Actions) */}
              <div className="p-4 md:p-6 bg-white border-t border-slate-100 shrink-0">
                 <div className="flex flex-col sm:flex-row gap-3">
                    <Button onClick={() => setActiveTab('messages')} variant="outline" className="flex-1 h-14 rounded-xl font-bold border-slate-200 text-slate-700 hover:bg-slate-50 text-base shadow-sm">
                       <MessageSquare className="w-5 h-5 ml-2 text-blue-600" /> إرسال رسالة مباشرة
                    </Button>
                    <Button onClick={() => toast.success('تم فتح نافذة المعسكر المصغر')} className="flex-1 h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-base shadow-md">
                       <Send className="w-5 h-5 ml-2 text-emerald-400" /> تعيين خطة جديدة
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
