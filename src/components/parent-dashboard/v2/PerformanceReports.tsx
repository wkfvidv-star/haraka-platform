import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, Brain, Heart, TrendingUp, 
  Target, Award, Calendar, AlertCircle,
  BarChart3, PieChart, LineChart, ArrowUpRight,
  Zap, Shield, Star
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Child } from '@/services/parentDataService';

interface PerformanceReportsProps {
  selectedChild?: Child;
}

export const PerformanceReports: React.FC<PerformanceReportsProps> = ({ selectedChild }) => {
  if (!selectedChild) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-500 space-y-4">
        <div className="p-6 bg-white/5 rounded-full backdrop-blur-md">
          <Target className="w-12 h-12" />
        </div>
        <p className="text-xl font-black">يرجى اختيار طفل لعرض التقارير</p>
      </div>
    );
  }

  const performanceMetrics = [
    { 
      label: 'الأداء البدني', 
      value: selectedChild.performance.physical, 
      icon: Activity, 
      color: 'blue', 
      details: 'اللياقة، القوة، والتحمل العضلي',
      trend: '+5%',
      feedback: 'تحسن ملحوظ في سرعة الجري وقوة التحمل مقارنة بالشهر السابق.'
    },
    { 
      label: 'الأداء المعرفي', 
      value: selectedChild.performance.cognitive, 
      icon: Brain, 
      color: 'emerald', 
      details: 'التركيز، حل المشكلات، والسرعة الذهنية',
      trend: '+12%',
      feedback: 'يظهر سرعة أكبر في حل الألغاز المعقدة وزيادة في مدة التركيز المتواصل.'
    },
    { 
      label: 'الأداء النفسي', 
      value: selectedChild.performance.psychological, 
      icon: Heart, 
      color: 'rose', 
      details: 'المزاج، الثقة بالنفس، والتحكم في المشاعر',
      trend: '+8%',
      feedback: 'ارتفاع في مستوى المحفزات الذاتية والروح الرياضية بعد الجلسات الجماعية.'
    },
  ];

  const moodHistory = [
    { day: 'السبت', mood: 'سعيد' },
    { day: 'الأحد', mood: 'متحمس' },
    { day: 'الاثنين', mood: 'هادئ' },
    { day: 'الثلاثاء', mood: 'سعيد' },
    { day: 'الأربعاء', mood: selectedChild.mood || 'يتم التحديث' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-1000" dir="rtl">
      {/* 📊 Pillars Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {performanceMetrics.map((metric, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={metric.label}
          >
            <Card className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[40px] overflow-hidden group hover:border-white/20 transition-all duration-500 shadow-2xl">
              <CardContent className="p-8 space-y-6">
                 <div className="flex items-center justify-between">
                    <div className={`p-4 rounded-3xl bg-${metric.color}-500/10 text-${metric.color}-400 group-hover:scale-110 transition-transform`}>
                       <metric.icon className="w-8 h-8" />
                    </div>
                    <div className="text-right">
                       <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{metric.details}</p>
                       <h3 className="text-2xl font-black text-white">{metric.label}</h3>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <div className="flex justify-between items-end">
                       <div className="flex items-center gap-2">
                          <span className={`text-4xl font-black text-${metric.color}-400`}>{metric.value}%</span>
                          <span className="text-emerald-500 text-xs font-bold leading-none bg-emerald-500/10 px-2 py-1 rounded-md">{metric.trend}</span>
                       </div>
                    </div>
                    <Progress value={metric.value} className={`h-2.5 bg-white/5`} />
                 </div>

                 <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                       <Award className={`w-4 h-4 text-${metric.color}-400`} />
                       <p className="text-[10px] text-slate-400 font-bold uppercase">تقييم المدرب</p>
                    </div>
                    <p className="text-xs text-white/80 font-medium leading-relaxed italic">
                       &quot;{metric.feedback}&quot;
                    </p>
                 </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* 📈 Detailed Stats & Mood Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Mood Tracking History */}
         <Card className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[40px] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-[80px]" />
            <div className="relative z-10">
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400">
                        <LineChart className="w-6 h-6" />
                     </div>
                     <div>
                        <h3 className="font-black text-xl text-white">تتبع الحالة المزاجية</h3>
                        <p className="text-slate-500 text-xs font-bold">بناءً على مدخلات {selectedChild.name} اليومية</p>
                     </div>
                  </div>
                  <Badge variant="outline" className="text-emerald-400 border-emerald-400/20">تقرير أسبوعي</Badge>
               </div>

               <div className="space-y-4">
                  {moodHistory.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all group">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center font-bold text-slate-400 group-hover:text-emerald-400 transition-colors">
                             {item.day.charAt(0)}
                          </div>
                          <span className="font-bold text-white">{item.day}</span>
                       </div>
                       <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-slate-500">{item.mood}</span>
                          <span className="text-2xl">
                             {item.mood === 'سعيد' ? '😊' : 
                              item.mood === 'متحمس' ? '🤩' : 
                              item.mood === 'هادئ' ? '😌' : '😕'}
                          </span>
                       </div>
                    </div>
                  ))}
               </div>
               
               <div className="mt-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-4">
                  <AlertCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-emerald-50 text-right leading-relaxed font-medium">
                     <strong>ملاحظة الذكاء الاصطناعي:</strong> نلاحظ تحسناً كبيراً في الحالة المزاجية للطفل في الأيام التي يمارس فيها أنشطته البدنية المفضلة.
                  </p>
               </div>
            </div>
         </Card>

         {/* Gamification Progress */}
         <Card className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[40px] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/5 rounded-full blur-[80px]" />
            <div className="relative z-10">
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
                        <Zap className="w-6 h-6" />
                     </div>
                     <div>
                        <h3 className="font-black text-xl text-white">التقدم في الإنجازات</h3>
                        <p className="text-slate-500 text-xs font-bold">تتبع الأهداف والمهام المكتملة</p>
                     </div>
                  </div>
                  <Trophy className="w-8 h-8 text-amber-400" />
               </div>

               <div className="space-y-6">
                  {[
                    { label: 'المهام الأسبوعية المكتملة', value: 85, color: 'blue' },
                    { label: 'ساعات النشاط الكلي', value: 92, color: 'emerald' },
                    { label: 'تفاعل المجتمع', value: 45, color: 'indigo' },
                  ].map((stat, idx) => (
                    <div key={idx} className="space-y-2">
                       <div className="flex justify-between items-center text-sm font-bold">
                          <span className="text-white/80">{stat.label}</span>
                          <span className={`text-${stat.color}-400`}>{stat.value}%</span>
                       </div>
                       <Progress value={stat.value} className="h-2 bg-white/5" />
                    </div>
                  ))}
               </div>

               <div className="grid grid-cols-2 gap-4 mt-10">
                  <div className="bg-white/5 rounded-3xl p-5 border border-white/5 text-center group hover:bg-white/10 transition-all">
                     <Shield className="w-8 h-8 text-blue-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">الميداليات</p>
                     <p className="text-xl font-black text-white">12 ميدالية</p>
                  </div>
                  <div className="bg-white/5 rounded-3xl p-5 border border-white/5 text-center group hover:bg-white/10 transition-all">
                     <Star className="w-8 h-8 text-amber-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">النقاط</p>
                     <p className="text-xl font-black text-white">{selectedChild.xp} XP</p>
                  </div>
               </div>
            </div>
         </Card>
      </div>

      {/* 📥 Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[32px]">
         <div>
            <h4 className="text-lg font-black text-white">هل ترغب في نسخة مطبوعة؟</h4>
            <p className="text-slate-400 text-sm font-medium">يمكنك تحميل التقرير الشامل بصيغة PDF لمشاركته مع طبيبك أو مدرستك.</p>
         </div>
         <Button className="h-14 px-10 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg transition-all shadow-xl shadow-blue-500/20">
            تحميل التقرير الكامل (PDF)
         </Button>
      </div>
    </div>
  );
};

// Internal icon constants for the Progress component issue we saw earlier
const Trophy = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);
