import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlaySquare, Calendar, Send, Activity, Users, AlertCircle, Bot, Sparkles, CheckCircle2 } from 'lucide-react';
import { useCoachDashboard } from '@/contexts/CoachDashboardContext';
import { toast } from 'sonner';

export default function CoachOverviewPanel() {
  const { setActiveTab } = useCoachDashboard();
  return (
    <div className="space-y-8">
      
      {/* HEADER & QUICK ACTIONS */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">مرحباً كابتن 👋</h2>
          <p className="text-lg text-slate-500 mt-2 font-medium">سير عملك اليومي (Daily Workflow) جاهز لبدء التدريب.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => setActiveTab('video-review')} className="h-12 px-6 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md flex items-center gap-2">
            <PlaySquare className="w-5 h-5" /> مراجعة الفيديوهات
          </Button>
          <Button onClick={() => setActiveTab('schedule')} variant="outline" className="h-12 px-6 rounded-xl font-bold border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" /> عرض الجدول
          </Button>
          <Button onClick={() => setActiveTab('programs')} variant="outline" className="h-12 px-6 rounded-xl font-bold border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-2">
            <Send className="w-5 h-5 text-emerald-600" /> إرسال تمرين
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: TASKS & SUMMARY (2/3 width) */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* QUICK SUMMARY (KPIs) */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-slate-500 font-bold text-sm uppercase tracking-wider">إجمالي المتدربين</span>
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <div className="text-4xl font-black text-slate-900">42</div>
              </CardContent>
            </Card>
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-slate-500 font-bold text-sm uppercase tracking-wider">متوسط الأداء العام</span>
                  <Activity className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="flex items-baseline gap-2">
                   <div className="text-4xl font-black text-slate-900">89<span className="text-2xl text-slate-400">%</span></div>
                   <span className="text-sm font-bold text-emerald-500">+2.4% أسبوعياً</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* TODAY'S TASKS (ACTIONABLE) */}
          <Card className="bg-white border-slate-200 shadow-sm">
             <CardContent className="p-6 lg:p-8">
               <h3 className="text-2xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
                 <CheckCircle2 className="w-6 h-6 text-blue-600" /> مهام اليوم
               </h3>
               
               <div className="space-y-4">
                 
                 {/* Task 1 */}
                 <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-colors">
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-black text-xl">
                       4
                     </div>
                     <div>
                       <h4 className="font-bold text-slate-900 text-lg">حصص مجدولة اليوم</h4>
                       <p className="text-sm text-slate-500 font-medium">أول حصة تبدأ الساعة 04:00 م.</p>
                     </div>
                   </div>
                   <Button onClick={() => setActiveTab('schedule')} variant="ghost" className="text-blue-600 font-bold hover:bg-blue-50">إدارة الحصص</Button>
                 </div>

                 {/* Task 2 */}
                 <div className="flex items-center justify-between p-4 bg-red-50/50 rounded-2xl border border-red-100 group hover:border-red-200 transition-colors">
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center font-black text-xl">
                       7
                     </div>
                     <div>
                       <h4 className="font-bold text-slate-900 text-lg">فيديوهات تحتاج مراجعة</h4>
                       <p className="text-sm text-slate-500 font-medium">أرسل المتدربون أداءهم لتمارين الأمس.</p>
                     </div>
                   </div>
                   <Button onClick={() => setActiveTab('video-review')} className="font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl">المراجعة الآن</Button>
                 </div>

                 {/* Task 3 */}
                 <div className="flex items-center justify-between p-4 bg-orange-50/50 rounded-2xl border border-orange-100 group hover:border-orange-200 transition-colors">
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center font-black text-xl">
                       2
                     </div>
                     <div>
                       <h4 className="font-bold text-slate-900 text-lg">متدربين غير نشطين</h4>
                       <p className="text-sm text-slate-500 font-medium">لم يتمرنوا منذ أكثر من 4 أيام.</p>
                     </div>
                   </div>
                   <Button onClick={() => setActiveTab('messages')} variant="outline" className="font-bold text-orange-600 border-orange-200 hover:bg-orange-50 rounded-xl">مراسلة</Button>
                 </div>

               </div>
             </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: SMART ASSISTANT */}
        <div className="xl:col-span-1">
          <Card className="bg-gradient-to-br from-slate-900 to-slate-950 text-white border-slate-800 shadow-xl h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
            
            <CardContent className="p-8 flex flex-col h-full relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/50">
                   <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight">المساعد الذكي</h3>
                  <p className="text-sm font-semibold text-slate-400">توصيات مخصصة مدعومة بالذكاء الاصطناعي</p>
                </div>
              </div>

              <div className="space-y-4 flex-1">
                {/* AI Suggestion 1 */}
                <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-5 rounded-2xl">
                  <div className="flex gap-3 mb-4">
                    <Sparkles className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm text-blue-200 mb-1">تنبيه أداء: رامي</h4>
                      <p className="text-sm leading-relaxed text-slate-300">"أظهر التحليل الحركي الأخير لرامي ضعفاً ملحوظاً في التوازن على القدم اليسرى. ينصح بجدولة تمارين ثبات مخصصة."</p>
                    </div>
                  </div>
                  <Button onClick={() => { setActiveTab('programs'); toast('تم فتح منشئ البرامج بوضع "تمارين التوازن"'); }} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md">
                    إرسال تمرين توازن مناسب
                  </Button>
                </div>

                {/* AI Suggestion 2 */}
                <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-5 rounded-2xl">
                  <div className="flex gap-3 mb-4">
                    <AlertCircle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm text-blue-200 mb-1">ركود في الأوزان: رحيم</h4>
                      <p className="text-sm leading-relaxed text-slate-300">رحيم يرفع نفس الوزن في تمرين السكوات للأسبوع الثالث توالياً. الوقت مناسب لزيادة الحمل (Progressive Overload).</p>
                    </div>
                  </div>
                  <Button onClick={() => { setActiveTab('programs'); toast('تعديل برنامج رحيم متاح الآن'); }} variant="outline" className="w-full border-blue-400/30 text-blue-300 hover:bg-white/10 font-bold rounded-xl">
                    تعديل برنامج رحيم
                  </Button>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
