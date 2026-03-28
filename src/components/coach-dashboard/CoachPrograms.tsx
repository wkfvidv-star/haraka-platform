import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Play, TrendingUp, Users, Target, Clock, Plus, CheckSquare } from 'lucide-react';
import { toast } from 'sonner';

const programs = [
  { id: 1, title: 'برنامج الضخامة العضلية', level: 'متقدم', duration: '8 أسابيع', activeUsers: 45, color: 'from-blue-600 to-indigo-700' },
  { id: 2, title: 'حرق الدهون السريع', level: 'متوسط', duration: '4 أسابيع', activeUsers: 112, color: 'from-orange-500 to-red-600' },
  { id: 3, title: 'تأهيل إصابات الركبة', level: 'خاص', duration: 'مفتوح', activeUsers: 18, color: 'from-emerald-500 to-teal-600' },
  { id: 4, title: 'تأسيس اللياقة', level: 'مبتدئ', duration: '6 أسابيع', activeUsers: 89, color: 'from-purple-600 to-pink-600' },
];

export default function CoachPrograms() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">مكتبة البرامج التدريبية</h2>
          <p className="text-lg text-slate-500 mt-2 font-medium">إدارة الخطط والجداول المخصصة للمتدربين.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="h-12 px-6 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md">
              <Plus className="w-5 h-5 ml-2" /> برنامج جديد سريع
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] border-none rounded-3xl p-8 bg-white text-right font-sans" dir="rtl">
             <h3 className="text-2xl font-black text-slate-900 mb-6">إنشاء وتخصيص برنامج تدريبي</h3>
             <div className="space-y-4">
               <div>
                  <label className="text-sm font-bold text-slate-500 mb-2 block">اسم البرنامج الهدف</label>
                  <Input placeholder="مثال: زيادة القوة الانفجارية" className="h-12 bg-slate-50 font-bold border-slate-200" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-sm font-bold text-slate-500 mb-2 block">المدة (أيام)</label>
                    <Input type="number" defaultValue={30} className="h-12 bg-slate-50 font-bold border-slate-200" />
                 </div>
                 <div>
                    <label className="text-sm font-bold text-slate-500 mb-2 block">نوع التركيز (Goal)</label>
                    <select className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 font-bold text-slate-700 outline-none">
                       <option>سرعة (Speed)</option>
                       <option>قوة (Strength)</option>
                       <option>توازن (Balance)</option>
                       <option>تحمل (Endurance)</option>
                    </select>
                 </div>
               </div>
               <div>
                  <label className="text-sm font-bold text-slate-500 mb-2 block">اختيار التمارين الأساسية</label>
                  <div className="grid grid-cols-2 gap-2">
                     {['سكوات', 'ضغط صدر', 'قفز الحواجز', 'بلانك', 'إطالة ديناميكية', 'كارديو'].map(ex => (
                        <div key={ex} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:border-blue-300">
                           <CheckSquare className="w-4 h-4 text-slate-400" />
                           <span className="font-bold text-sm text-slate-700">{ex}</span>
                        </div>
                     ))}
                  </div>
               </div>
               <Button onClick={() => { toast.success('تم إنشاء البرنامج وإسناده للمتدربين بنجاح!'); setOpen(false); }} className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg rounded-xl mt-4 shadow-md">
                 حفظ وإسناد للمتدرب
               </Button>
             </div>
          </DialogContent>
        </Dialog>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {programs.map((program) => (
          <Card key={program.id} className="border-none shadow-md hover:shadow-xl transition-all overflow-hidden group cursor-pointer bg-white">
            <div className={`h-32 bg-gradient-to-r ${program.color} relative p-6 flex flex-col justify-end`}>
              <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-sm font-bold flex items-center gap-1">
                <TrendingUp className="w-4 h-4" /> {program.level}
              </div>
              <h3 className="text-2xl font-black text-white">{program.title}</h3>
            </div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4 text-slate-500">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Clock className="w-5 h-5 text-slate-400" /> {program.duration}
                  </div>
                  <div className="flex items-center gap-1.5 font-bold">
                    <Users className="w-5 h-5 text-slate-400" /> {program.activeUsers} متدرب
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => toast('جاري تحميل محرر البرنامج...')} className="flex-1 rounded-xl font-bold bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-200">
                  تعديل البرنامج
                </Button>
                <Button onClick={() => toast('تم تحديد البرنامج وإسناده للمتدرب بنجاح')} variant="outline" className="flex-1 rounded-xl font-bold text-blue-600 border-blue-200 hover:bg-blue-50">
                  <Users className="w-4 h-4 ml-2" /> إسناد للمتدرب
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
