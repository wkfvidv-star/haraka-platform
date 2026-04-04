import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PlaySquare, Calendar, Send, Activity, Users, Bot, Sparkles, CheckCircle2, ChevronRight, Brain, HeartPulse, ActivitySquare, Pill, MessageSquare, Plus, Dumbbell, UploadCloud, Target, FileVideo } from 'lucide-react';
import { useCoachDashboard } from '@/contexts/CoachDashboardContext';
import { toast } from 'sonner';
import { EXERCISE_LIBRARY } from '@/components/coach-dashboard/CoachLibrary';

export default function CoachOverviewPanel() {
  const { setActiveTab } = useCoachDashboard();
  
  // Send Exercise Modal State
  const [exerciseModalOpen, setExerciseModalOpen] = useState(false);
  const [sendMode, setSendMode] = useState<'library' | 'custom' | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<'motor'|'cognitive'|'psych'|'rehab' | null>(null);
  const [customTitle, setCustomTitle] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [customSets, setCustomSets] = useState('');
  const [customReps, setCustomReps] = useState('');
  const [customFile, setCustomFile] = useState<File | null>(null);

  // Chatbot State
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', text: 'مرحباً كابتن 👋 أنا مساعدك الذكي المنظم لعملياتك. لقد لاحظت ضعفاً مؤخراً في التوازن لدى المتدرب رامي. هل ترغب في اقتراح برنامج علاجي؟' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userInput = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userInput }]);
    setChatInput('');

    // Haraka AI Intelligent Context Replies
    setTimeout(() => {
      let aiReply = '';
      const lowerInput = userInput.toLowerCase();
      
      if (lowerInput.includes('رامي') || lowerInput.includes('توازن')) {
        aiReply = `بناءً على سجلات المنصة، رامي (19 عام) لديه ضعف مستمر في الثبات المفصلي (Proprioception) للركبة اليسرى بسبب إصابة سابقة. أنصح بفتح [مكتبة إعادة التأهيل] وإرسال تمرين "توازن على نصف كرة (BOSU)" فوراً لتحسين حالته، هل أقوم بجدولته غداً؟`;
      } 
      else if (lowerInput.includes('نفسي') || lowerInput.includes('ضغط') || lowerInput.includes('خوف')) {
        aiReply = `وفقاً لقاعدة بيانات الأداء النفسي، أفضل تدخل للتعامل مع الضغط والانفعالات هو تمرين "التحكم في التنفس (Box Breathing 4-4-4-4)". يمكنك إرساله من قسم الأداء النفسي. كما يوجد جلسات تصور ذهني يمكنني اقتراحها.`;
      }
      else if (lowerInput.includes('معرفي') || lowerInput.includes('تركيز') || lowerInput.includes('استجابة')) {
        aiReply = `للأداء المعرفي وتشتت الذهن الواضح في آخر تقييم، أوصي ببروتوكول "المسح المحيطي" و"اختبار الاستجابة المتعددة". هذه التمارين متوفرة حالياً في القسم المعرفي لتطوير وعي اللاعب في الملعب.`;
      }
      else if (lowerInput.includes('محمد') || lowerInput.includes('سكوات') || lowerInput.includes('حركي')) {
        aiReply = `محمد متقدم جداً في الأداء الحركي. آخر فيديو للسكوات أظهر إتقاناً بنسبة 85%. إذا كنت تبحث عن كسر الروتين، يمكنك إسناد "القفز الصندوقي الانفجاري" من مكتبة الحركي كبرنامج مكمل هذا الأسبوع.`;
      }
      else {
         aiReply = `تم البحث في بيانات المنصة التدريبية (البرامج، التغذية، الفيديوهات)... تحليل استفسارك: "${userInput}". سأقوم بتوليد تقرير استنتاجي مخصص قريباً، هل تود أن أقوم بتوجيهك لقسم المكتبات أو رفع الفيديوهات للإجراء السريع؟`;
      }

      setChatMessages(prev => [...prev, { role: 'assistant', text: aiReply }]);
    }, 800);
  };

  const handleSendExercise = (exerciseTitle: string) => {
    toast.success(`تم إرسال تمرين "${exerciseTitle}" بنجاح للمتدربين المحددين!`);
    if(customFile) toast.success(`تم رفع الملف المرفق: ${customFile.name}`);
    
    setExerciseModalOpen(false);
    setSelectedTrack(null);
    setCustomFile(null);
    setCustomTitle('');
    setCustomDesc('');
    setCustomSets('');
    setCustomReps('');
  };

  return (
    <div className="space-y-8 relative">
      
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
          <Button onClick={() => { setExerciseModalOpen(true); setSendMode(null); setSelectedTrack(null); }} variant="outline" className="h-12 px-6 rounded-xl font-bold border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center gap-2 transition-colors">
            <Send className="w-5 h-5 text-emerald-600" /> إرسال تمرين
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: TASKS & SUMMARY (2/3 width) */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* COACH INSIGHTS PANEL (NEW: Advanced) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                   <h4 className="font-black text-indigo-900 text-sm">أفضل فرصة اليوم</h4>
                   <Sparkles className="w-4 h-4 text-indigo-500" />
                </div>
                <div>
                  <h5 className="font-extrabold text-slate-800 text-base mb-1">عمر خالد - 96% توافق</h5>
                   <p className="text-xs font-bold text-slate-500">يتطابق مع تخصص القوة العضلية.</p>
                </div>
                <Button onClick={() => setActiveTab('discover')} variant="ghost" size="sm" className="mt-2 w-full bg-white/50 hover:bg-white text-indigo-700 font-bold h-8 text-xs">
                   عرض التفاصيل
                </Button>
             </div>

             <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-100 rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                   <h4 className="font-black text-orange-900 text-sm">يحتاج إلى متابعة</h4>
                   <Activity className="w-4 h-4 text-orange-500 animate-pulse" />
                </div>
                <div>
                  <h5 className="font-extrabold text-slate-800 text-base mb-1">رامي (19 عام)</h5>
                   <p className="text-xs font-bold text-slate-500">ضعف بالثبات المفصلي (ركبة).</p>
                </div>
                <Button onClick={() => setActiveTab('athletes')} variant="ghost" size="sm" className="mt-2 w-full bg-white/50 hover:bg-white text-orange-700 font-bold h-8 text-xs">
                   مراجعة الملف
                </Button>
             </div>

             <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                   <h4 className="font-black text-emerald-900 text-sm">مؤشر الاستجابة</h4>
                   <Target className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <div className="flex items-baseline gap-1 mb-1">
                     <h5 className="font-extrabold text-slate-800 text-2xl">91%</h5>
                     <span className="text-xs font-bold text-emerald-600">+4% مقارنة بالشهر الماضي</span>
                  </div>
                   <p className="text-xs font-bold text-slate-500">معدل التزام وتجاوب عالٍ.</p>
                </div>
             </div>
          </div>

          {/* QUICK SUMMARY (KPIs) */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-slate-500 font-bold text-sm uppercase tracking-wider">إجمالي المتدربين</span>
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <div className="text-3xl lg:text-4xl font-black text-slate-900">42</div>
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

          {/* TODAY'S TASKS */}
          <Card className="bg-white border-slate-200 shadow-sm">
             <CardContent className="p-6 lg:p-8">
               <h3 className="text-2xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
                 <CheckCircle2 className="w-6 h-6 text-blue-600" /> مهام اليوم
               </h3>
               
               <div className="space-y-4">
                 <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-colors">
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-black text-xl">4</div>
                     <div>
                       <h4 className="font-bold text-slate-900 text-lg">حصص مجدولة اليوم</h4>
                       <p className="text-sm text-slate-500 font-medium">أول حصة تبدأ الساعة 04:00 م.</p>
                     </div>
                   </div>
                   <Button onClick={() => setActiveTab('schedule')} variant="ghost" className="text-blue-600 font-bold hover:bg-blue-50">إدارة الحصص</Button>
                 </div>

                 <div className="flex items-center justify-between p-4 bg-red-50/50 rounded-2xl border border-red-100 group hover:border-red-200 transition-colors">
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center font-black text-xl">7</div>
                     <div>
                       <h4 className="font-bold text-slate-900 text-lg">مرفقات تحتاج مراجعة</h4>
                       <p className="text-sm text-slate-500 font-medium">فيديوهات حركية ونفسية بانتظار التقييم.</p>
                     </div>
                   </div>
                   <Button onClick={() => setActiveTab('video-review')} className="font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl">المراجعة الآن</Button>
                 </div>
               </div>
             </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: AI CHATBOT */}
        <div className="xl:col-span-1">
          <Card className="bg-gradient-to-br from-slate-900 to-slate-950 text-white border-slate-800 shadow-xl h-full relative overflow-hidden flex flex-col min-h-[500px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            
            <div className="p-6 border-b border-white/10 shrink-0 relative z-10 flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/50">
                   <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight">Haraka AI</h3>
                  <p className="text-xs font-semibold text-slate-400">مساعدك التدريبي الذكي</p>
                </div>
            </div>

            {/* Chat Area */}
            <CardContent className="p-4 flex-1 flex flex-col justify-end relative z-10 h-[350px] overflow-y-auto custom-scrollbar">
              <div className="space-y-4 flex flex-col justify-end min-h-full">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed font-medium shadow-sm ${
                      msg.role === 'user' 
                       ? 'bg-blue-600 text-white rounded-br-sm' 
                       : 'bg-white/10 backdrop-blur-md text-slate-200 rounded-tr-sm border border-white/10'
                    }`}>
                      {msg.role === 'assistant' && <Sparkles className="w-3.5 h-3.5 text-yellow-500 mb-1" />}
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            </CardContent>

            {/* Input Form */}
            <div className="p-4 border-t border-white/10 shrink-0 bg-slate-950/50 backdrop-blur-md relative z-10">
              <form onSubmit={handleSendChat} className="flex gap-2">
                <input 
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="اسأل المساعد عن متدرب أو أداء..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                />
                <Button type="submit" disabled={!chatInput.trim()} className="w-12 h-12 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shrink-0 p-0 flex items-center justify-center">
                  <Send className="w-5 h-5 rtl:-scale-x-100" />
                </Button>
              </form>
            </div>
          </Card>
        </div>

      </div>

      {/* EXERCISE LIBRARY / SEND MODAL */}
      <Dialog open={exerciseModalOpen} onOpenChange={setExerciseModalOpen}>
        <DialogContent className="sm:max-w-xl lg:max-w-3xl p-0 overflow-hidden border-none text-right font-sans lg:rounded-3xl flex flex-col bg-white !fixed !inset-x-0 !top-[10vh] !mx-auto !translate-x-0 !translate-y-0 shadow-2xl" dir="rtl">
           <DialogHeader className="p-6 md:p-8 bg-slate-50 border-b border-slate-100 shrink-0">
             <DialogTitle className="text-2xl font-black text-slate-900 flex items-center gap-3">
               <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                 <Send className="w-5 h-5" />
               </div>
               مكتبة التمارين وإرسال المهام
             </DialogTitle>
             <p className="text-slate-500 font-bold mt-2 text-sm">اختر القسم التدريبي ثم استعرض المكتبة لإرسال تمرين مخصص فوراً لمتدربيك.</p>
           </DialogHeader>

           <div className="p-6 md:p-8 flex-1 overflow-y-auto bg-white custom-scrollbar">
              
              {!sendMode ? (
                 /* STEP 0: CHOOSE MODE */
                 <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                   <h4 className="font-extrabold text-slate-900 text-center mb-6 text-xl">كيف تود تعيين التمرين لمتدربيك؟</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                     <button onClick={() => setSendMode('library')} className="p-8 rounded-3xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-center group flex flex-col items-center justify-center gap-4 shadow-sm hover:shadow-xl relative overflow-hidden">
                       <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-[2rem] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform relative z-10">
                         <Dumbbell className="w-10 h-10" />
                       </div>
                       <div className="relative z-10">
                         <h5 className="font-black text-slate-900 text-xl mb-2">من المكتبة المركزية المعتمدة</h5>
                         <p className="text-sm text-slate-500 font-bold leading-relaxed px-4">تصفح مسارات التدريب الأربعة واختر من مئات التمارين العالمية المرفقة بالشروحات.</p>
                       </div>
                     </button>

                     <button onClick={() => setSendMode('custom')} className="p-8 rounded-3xl border-2 border-slate-100 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-center group flex flex-col items-center justify-center gap-4 shadow-sm hover:shadow-xl relative overflow-hidden">
                       <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform relative z-10">
                         <Plus className="w-10 h-10" />
                       </div>
                       <div className="relative z-10">
                         <h5 className="font-black text-slate-900 text-xl mb-2">إضافة تمرينك المخصص</h5>
                         <p className="text-sm text-slate-500 font-bold leading-relaxed px-4">كتابة تعليمات وتمرين خاص سريع وإرساله لتلبية احتياج فوري غير مدرج.</p>
                       </div>
                     </button>
                   </div>
                 </div>
              ) : sendMode === 'library' && !selectedTrack ? (
                /* STEP 1: SELECT TRACK */
                <div className="space-y-4 animate-in slide-in-from-right-4 fade-in duration-300">
                  <div className="flex items-center gap-4 mb-4">
                     <Button variant="ghost" onClick={() => setSendMode(null)} className="rounded-xl h-10 px-0 font-bold text-slate-500 hover:text-slate-900">
                       <ChevronRight className="w-5 h-5 ml-1" />
                     </Button>
                     <h4 className="font-extrabold text-slate-900">أقسام الأداء والمكتبات المتاحة:</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    <button onClick={() => setSelectedTrack('motor')} className="p-5 rounded-2xl border-2 border-slate-100 hover:border-blue-500 bg-white hover:bg-blue-50/50 transition-all text-right group flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <ActivitySquare className="w-6 h-6" />
                      </div>
                      <div>
                        <h5 className="font-black text-slate-900 text-lg mb-1">الأداء الحركي البدني</h5>
                        <p className="text-xs text-slate-500 font-bold">تمارين القوة، التحمل، التوافق العضلي والمهاري.</p>
                      </div>
                    </button>

                    <button onClick={() => setSelectedTrack('cognitive')} className="p-5 rounded-2xl border-2 border-slate-100 hover:border-amber-500 bg-white hover:bg-amber-50/50 transition-all text-right group flex items-start gap-4">
                      <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Brain className="w-6 h-6" />
                      </div>
                      <div>
                        <h5 className="font-black text-slate-900 text-lg mb-1">الأداء المعرفي</h5>
                        <p className="text-xs text-slate-500 font-bold">سرعة الاستجابة، التركيز، وتحديد مسار القرار.</p>
                      </div>
                    </button>

                    <button onClick={() => setSelectedTrack('psych')} className="p-5 rounded-2xl border-2 border-slate-100 hover:border-purple-500 bg-white hover:bg-purple-50/50 transition-all text-right group flex items-start gap-4">
                      <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <HeartPulse className="w-6 h-6" />
                      </div>
                      <div>
                        <h5 className="font-black text-slate-900 text-lg mb-1">الأداء النفسي</h5>
                        <p className="text-xs text-slate-500 font-bold">إدارة الضغط، الاسترخاء، ولغة الجسد التنافسية.</p>
                      </div>
                    </button>

                    <button onClick={() => setSelectedTrack('rehab')} className="p-5 rounded-2xl border-2 border-slate-100 hover:border-emerald-500 bg-white hover:bg-emerald-50/50 transition-all text-right group flex items-start gap-4">
                      <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Pill className="w-6 h-6" />
                      </div>
                      <div>
                        <h5 className="font-black text-slate-900 text-lg mb-1">إعادة التأهيل</h5>
                        <p className="text-xs text-slate-500 font-bold">تمارين تصحيح القوام وعلاج الإصابات الحركية.</p>
                      </div>
                    </button>

                  </div>
                </div>
              ) : sendMode === 'library' && selectedTrack ? (
                /* STEP 2: LIBRARY FOR SELECTED TRACK */
                <div className="space-y-6 animate-in slide-in-from-left-4 fade-in duration-300">
                  <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                     <Button variant="outline" onClick={() => setSelectedTrack(null)} className="rounded-xl h-10 px-4 font-bold text-slate-500 hover:text-slate-900 shadow-sm">
                       <ChevronRight className="w-4 h-4 ml-1" /> رجوع للأقسام
                     </Button>
                     <h4 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                        {selectedTrack === 'motor' ? 'مكتبة الأداء الحركي' :
                         selectedTrack === 'cognitive' ? 'مكتبة الأداء المعرفي' :
                         selectedTrack === 'psych' ? 'مكتبة الأداء النفسي' : 'مكتبة إعادة التأهيل'}
                     </h4>
                  </div>

                  <div className="space-y-4">
                    {EXERCISE_LIBRARY[selectedTrack].map((exercise) => (
                      <div key={exercise.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center hover:border-slate-300 transition-colors shadow-sm">
                         <div>
                            <div className="flex items-center gap-2 mb-1">
                               <h5 className="font-black text-slate-900">{exercise.title}</h5>
                               <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-200 text-slate-700">{exercise.diff}</span>
                            </div>
                            <p className="text-sm font-medium text-slate-500">{exercise.desc}</p>
                         </div>
                         <Button onClick={() => handleSendExercise(exercise.title)} className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl h-10 px-6 shrink-0 shadow-md">
                            إرسال للمتدرب <Send className="w-4 h-4 mr-2" />
                         </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* CUSTOM EXERCISE MODE */
                <div className="space-y-6 animate-in slide-in-from-left-4 fade-in duration-300 max-w-2xl mx-auto">
                   <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                     <div className="flex items-center gap-4">
                       <Button variant="outline" onClick={() => setSendMode(null)} className="rounded-xl h-10 px-4 font-bold text-slate-500 hover:text-slate-900 shadow-sm">
                         <ChevronRight className="w-4 h-4 ml-1" /> رجوع
                       </Button>
                       <h4 className="font-extrabold text-slate-900 text-lg">تأليف تمرين مخصص</h4>
                     </div>
                     <Button variant="ghost" onClick={() => setSendMode('library')} className="text-blue-600 font-bold hover:bg-blue-50 text-sm">
                        أو تصفح المكتبة الجاهزة
                     </Button>
                   </div>

                   <div className="space-y-5">
                      {/* DRAG AND DROP ZONE */}
                      <div>
                        <label className="block text-sm font-black text-slate-700 mb-2">إرفاق وسائط (صورة / فيديو)</label>
                        <div className="w-full h-32 border-2 border-dashed border-slate-200 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/50 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors relative">
                           <input 
                              type="file" 
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                              onChange={(e) => setCustomFile(e.target.files ? e.target.files[0] : null)}
                              accept="video/mp4,video/x-m4v,video/*,image/*"
                           />
                           
                           {customFile ? (
                              <div className="text-center">
                                 <FileVideo className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                                 <span className="text-sm font-bold text-slate-700">{customFile.name}</span>
                              </div>
                           ) : (
                              <div className="text-center">
                                 <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-blue-500 mx-auto mb-2" />
                                 <span className="text-sm font-bold text-slate-500">اسحب أو انقر لرفع المقاطع (MP4, JPG)</span>
                              </div>
                           )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-black text-slate-700 mb-2">اسم التمرين أو المهمة <span className="text-red-500">*</span></label>
                        <input 
                           type="text" 
                           value={customTitle} 
                           onChange={e => setCustomTitle(e.target.value)} 
                           placeholder="مثال: جلسة تمدد مسائية 15 دقيقة"
                           className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                        />
                      </div>

                      {/* Reps and Sets UI */}
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                           <label className="block text-sm font-black text-slate-700 mb-2">عدد المجموعات (Sets)</label>
                           <input 
                              type="text" 
                              value={customSets}
                              onChange={e => setCustomSets(e.target.value)}
                              placeholder="مثال: 3"
                              className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                           />
                         </div>
                         <div>
                           <label className="block text-sm font-black text-slate-700 mb-2">التكرارات (Reps/Time)</label>
                           <input 
                              type="text" 
                              value={customReps}
                              onChange={e => setCustomReps(e.target.value)}
                              placeholder="مثال: 12 تكرار"
                              className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                           />
                         </div>
                      </div>

                      <div>
                        <label className="block text-sm font-black text-slate-700 mb-2">تفاصيل وإرشادات إضافية</label>
                        <textarea 
                           rows={3}
                           value={customDesc} 
                           onChange={e => setCustomDesc(e.target.value)} 
                           placeholder="اكتب التوجيهات الدقيقة أو أرفق رابط يوتيوب هنا..."
                           className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium resize-none text-sm leading-relaxed custom-scrollbar"
                        />
                      </div>
                   </div>

                   <div className="pt-2">
                     <Button 
                        disabled={!customTitle.trim()}
                        onClick={() => handleSendExercise(customTitle)} 
                        className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black rounded-xl text-lg shadow-lg flex items-center justify-center gap-2"
                     >
                        إرسال لمتدربيك الآن <Send className="w-5 h-5 rtl:-scale-x-100" />
                     </Button>
                   </div>
                </div>
              )}
           </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

