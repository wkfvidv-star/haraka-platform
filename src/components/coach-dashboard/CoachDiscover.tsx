import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCoachDashboard } from '@/contexts/CoachDashboardContext';
import { UserPlus, X, Sparkles, Target, Flame, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function CoachDiscover() {
  const { discoveredYouths, requestToTrain, ignoreYouth } = useCoachDashboard();

  if (discoveredYouths.length === 0) {
    return (
      <div className="flex items-center justify-center h-[50vh] bg-white/50 rounded-3xl border border-slate-200">
        <p className="text-slate-500 font-medium font-bold text-lg">لا يوجد رياضيين جدد مطابقين لتخصصك حالياً.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">اكتشف رياضيين جدد ✨</h2>
          <p className="text-base md:text-lg text-slate-500 mt-2 font-medium">نظام الذكاء الاصطناعي يرشح لك أفضل الرياضيين توافقاً مع خبراتك وتصنيفك التدريبي.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {discoveredYouths.map((youth) => (
          <Card key={youth.id} className="border-none shadow-md hover:shadow-xl transition-all overflow-hidden group bg-white flex flex-col relative">
            <div className="absolute top-4 right-4 z-10 w-full flex justify-between pr-4 pl-8" dir="rtl">
              <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-none font-black flex items-center gap-1.5 shadow-sm px-3 py-1.5 rounded-lg mr-auto">
                <Sparkles className="w-4 h-4" />
                {youth.matchPercentage}% توافق 
              </Badge>
            </div>
            
            <div className="h-28 bg-gradient-to-br from-indigo-50 to-blue-50 flex justify-center items-end relative p-4">
               <div className="w-20 h-20 rounded-3xl bg-white shadow-xl flex items-center justify-center text-3xl font-black text-indigo-600 translate-y-10 group-hover:scale-110 transition-transform duration-300 relative z-20 border border-slate-100">
                 {youth.name.charAt(0)}
               </div>
            </div>
            
            <CardContent className="pt-14 pb-6 px-5 text-center bg-white relative z-10 flex-1 flex flex-col">
              <h3 className="text-xl font-black text-slate-900 mb-1 tracking-tight">{youth.name}</h3>
              <p className="text-sm font-bold text-slate-500 mb-5">{youth.age} سنة</p>
              
              <div className="space-y-3 mb-6 mt-auto text-right">
                <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <Target className="w-4 h-4 text-blue-500 shrink-0" />
                  <span className="text-sm font-bold text-slate-700 truncate">الهدف: {youth.goal}</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-sm font-bold text-slate-700">المستوى: {youth.level}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-auto pt-2 border-t border-slate-100">
                <Button 
                  onClick={() => ignoreYouth(youth.id)}
                  variant="outline" 
                  className="flex-1 rounded-xl font-bold border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors h-11"
                >
                  <X className="w-4 h-4 ml-1.5" /> تجاهل
                </Button>
                <Button 
                  onClick={() => requestToTrain(youth.id)}
                  className="flex-[2] rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 transition-all h-11"
                >
                  <UserPlus className="w-4 h-4 ml-1.5" /> طلب تدريب
                </Button>
              </div>

            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
