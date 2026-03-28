import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Apple, Plus, Search, CheckCircle2, Flame, Beef, Users, Target, Droplets } from 'lucide-react';
import { toast } from 'sonner';

const nutritionPlans = [
  { id: 1, title: 'التنشيف وتقليل الدهون', calories: '1800 kcal', protein: '160g', carbs: '120g', fat: '75g', users: 32, color: 'bg-emerald-50 text-emerald-600' },
  { id: 2, title: 'تضخيم وبناء عضلي', calories: '3200 kcal', protein: '200g', carbs: '350g', fat: '110g', users: 15, color: 'bg-orange-50 text-orange-600' },
  { id: 3, title: 'الكيتو دايت للرياضيين', calories: '2200 kcal', protein: '140g', carbs: '30g', fat: '170g', users: 8, color: 'bg-purple-50 text-purple-600' },
  { id: 4, title: 'الصيام المتقطع التنافسي', calories: '2400 kcal', protein: '180g', carbs: '200g', fat: '80g', users: 44, color: 'bg-blue-50 text-blue-600' },
];

export default function CoachNutrition() {
  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">التغذية والأنظمة الصحية</h2>
          <p className="text-lg text-slate-500 mt-2 font-medium">بناء وتصنيف الأنظمة الغذائية وتتبع نسب الماكروز للمتدربين.</p>
        </div>
        <Button className="h-12 px-6 rounded-xl font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-md">
          <Plus className="w-5 h-5 ml-2" /> خطة غذائية جديدة
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* CREATE NEW MACRO CALC CARD */}
        <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg overflow-hidden relative cursor-pointer hover:shadow-xl transition-all group">
          <CardContent className="p-8 h-full flex flex-col justify-between z-10 relative">
            <div className="p-4 bg-white/20 rounded-2xl w-fit backdrop-blur-sm mb-6">
              <Apple className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-3xl font-black mb-2">حاسبة السعرات (Macros)</h3>
              <p className="text-blue-100 font-medium mb-6">أداة حساب احتياج المتدرب بناءً على الطول والوزن والهدف وتوليد نظام تلقائي.</p>
                  <Button onClick={() => toast.success('تم إنشاء وإرسال النظام الغذائي بنجاح!')} className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg rounded-xl shadow-md mt-6">
                    حفظ وإرسال للمتدرب
                  </Button>
            </div>
          </CardContent>
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
        </Card>

        {/* MOCK PLANS */}
        {nutritionPlans.map((plan) => (
          <Card key={plan.id} className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-all group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${plan.color}`}>
                  <Beef className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1.5 bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-sm font-bold">
                  <Users className="w-4 h-4" /> {plan.users} متدرب
                </div>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-6">{plan.title}</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-sm font-bold bg-slate-50 px-3 py-2 rounded-lg">
                  <span className="text-slate-500 uppercase flex items-center gap-2"><Flame className="w-4 h-4 text-orange-500"/> السعرات</span>
                  <span className="text-slate-900">{plan.calories}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold bg-slate-50 px-3 py-2 rounded-lg">
                  <span className="text-slate-500 uppercase flex items-center gap-2"><Target className="w-4 h-4 text-emerald-500"/> البروتين (P)</span>
                  <span className="text-slate-900">{plan.protein}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold bg-slate-50 px-3 py-2 rounded-lg">
                  <span className="text-slate-500 uppercase flex items-center gap-2"><Droplets className="w-4 h-4 text-blue-500"/> الكارب (C)</span>
                  <span className="text-slate-900">{plan.carbs}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold bg-slate-50 px-3 py-2 rounded-lg">
                  <span className="text-slate-500 uppercase flex items-center gap-2"><Droplets className="w-4 h-4 text-yellow-500"/> الدهون (F)</span>
                  <span className="text-slate-900">{plan.fat}</span>
                </div>
              </div>

              <div className="flex gap-2">
                 <Button onClick={() => toast('جاري تحميل محرر النظام الغذائي...')} variant="outline" className="flex-1 rounded-xl border-slate-200 text-slate-700 font-bold hover:bg-slate-50">تعديل</Button>
                 <Button onClick={() => toast('تم تحديد النظام للإسناد السريع')} className="flex-1 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800">تخصيص وإسناد</Button>
              </div>
            </CardContent>
          </Card>
        ))}

      </div>
    </div>
  );
}
