import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Dumbbell, ActivitySquare, Brain, HeartPulse, Pill, Filter, PlayCircle, Plus, MoreVertical, Users, Target, Activity, CheckCircle2, Send, ListOrdered, FileVideo, ChevronLeft, Clock, Activity as ActivityIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// Global Data (Image-Rich)
export const EXERCISE_LIBRARY = {
  motor: [
    { 
      id: 'm1', title: 'تمرين القوة الأساسية (Core)', diff: 'مبتدئ', desc: 'لزيادة القوة العضلية الانفجارية للأطراف السفلية، يركز على العضلات الرباعية والخلفية.', 
      duration: '15 د', uses: 240, sets: 4, reps: '8-12',
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop',
      steps: ['قف بثبات والقدمان متباعدتان بعرض الكتفين.', 'انزل ببطء مع الحفاظ على استقامة الظهر حتى يكون الفخذ موازياً للأرض.', 'ادفع بقوة للصعود للوضع الأصلي.'],
      focus: 'عضلات الجذع'
    },
    { 
      id: 'm2', title: 'تمرين السكوات الديناميكي', diff: 'متوسط', desc: 'لتحسين التوافق العضلي العصبي والقدرة الانفجارية (Plyometrics).', 
      duration: '20 د', uses: 185, sets: 3, reps: '10', hasAR: true,
      image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop',
      steps: ['اختر صندوقاً صلباً بارتفاع مناسب لمستواك.', 'اقفز باستخدام قوة الأطراف السفلية والذراعين للاهبوط الناعم أعلى الصندوق.'],
      focus: 'الفخذ'
    },
    { 
      id: 'm3', title: 'تدريب HIIT المتكامل', diff: 'متقدم', desc: 'تمرين مركب لتقوية السلسلة العضلية الخلفية بأكملها.', 
      duration: '30 د', uses: 312, sets: 5, reps: '5-8',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop',
      steps: ['ارفع صدرك للأعلى، تأكد من استقامة ظهرك.', 'ادفع الأرض للوقوف مستقيماً، مع قبض العضلات.'],
      focus: 'كامل الجسم'
    },
    { 
      id: 'm4', title: 'البلانك والتعزيز الجانبي', diff: 'مبتدئ', desc: 'لتقوية عضلات الجذع.', 
      duration: '12 د', uses: 312, sets: 5, reps: '5-8',
      image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=2069&auto=format&fit=crop',
      steps: ['ارفع صدرك للأعلى، تأكد من استقامة ظهرك.', 'ادفع الأرض للوقوف مستقيماً، مع قبض العضلات.'],
      focus: 'الجذع'
    }
  ],
  cognitive: [
    { 
      id: 'c1', title: 'تتبع الأنماط السريعة', diff: 'متوسط', desc: 'تدريب سرعة اتخاذ القرار تحت الضغط وتعدد المهام البصرية.', 
      duration: '10 د', uses: 120, sets: 3, reps: '20 قرار',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
      steps: ['قف أمام الشاشة التفاعلية أو شبكة الأضواء بوضعية الاستعداد.', 'بمجرد رؤية الإشارة اللونية المحددة، المس الهدف بأقصى سرعة ممكنة.'],
      focus: 'سرعة المعالجة'
    },
    { 
      id: 'c2', title: 'تمرين الذاكرة العاملة', diff: 'مبتدئ', desc: 'لتحسين التركيز البصري والوعي المكاني ورد الفعل التلقائي.', 
      duration: '15 د', uses: 210, sets: 2, reps: 'دقيقتين',
      image: 'https://images.unsplash.com/photo-1534067783941-51c9c23eceab?q=80&w=1974&auto=format&fit=crop',
      steps: ['ركز نظرك على الهدف الرئيسي المتحرك فقط.', 'استخدم عينيك في التتبع دون تحريك رأسك يميناً ويساراً.'],
      focus: 'الذاكرة قصيرة الأمد'
    },
    { 
      id: 'c3', title: 'سرعة الاستجابة والقرار', diff: 'متقدم', desc: 'اختبارات تذكر النماذج التكتيكية تحت إجهاد بدني.', 
      duration: '20 د', uses: 210, sets: 2, reps: 'دقيقتين', hasAR: true,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
      steps: ['ركز نظرك على الهدف الرئيسي.'],
      focus: 'زمن الرجع'
    },
    { 
      id: 'c4', title: 'الاتزان الثنائي المهام', diff: 'متوسط', desc: 'تمرين لفك الضغط الإدراكي وفصل المحفزات المتضاربة.', 
      duration: '18 د', uses: 210, sets: 2, reps: 'دقيقتين',
      image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=1931&auto=format&fit=crop',
      steps: ['استخدم عينيك في التتبع.'],
      focus: 'التنسيق المعرفي'
    }
  ],
  psych: [
    { 
      id: 'p1', title: 'التنفس العميق للصندوق', diff: 'مبتدئ', desc: 'لتقليل التوتر قبل المنافسات وبناء لغة الجسد القوية للملعب.', 
      duration: '5 د', uses: 320, sets: 1, reps: '1 جلسة',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1999&auto=format&fit=crop',
      steps: ['اجلس استلقِ في مكان هادئ وتأكد من راحة جميع عضلاتك.', 'تخيل نفسك وأنت تؤدي المهارة بنجاح تام وتشعر بلحظة الانتصار.'],
      focus: 'الجهاز العصبي'
    },
    { 
      id: 'p2', title: 'التأمل الحيوي الموجه', diff: 'متوسط', desc: 'للتحكم الفوري في معدل نبضات القلب وإدارة الانفعالات وقت الغضب.', 
      duration: '15 د', uses: 410, sets: 5, reps: 'دورات',
      image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=2070&auto=format&fit=crop',
      steps: ['استنشق الهواء ببطء من الأنف لمدة 4 ثوانٍ.', 'أخرج الهواء ببطء من الفم لمدة 4 ثوانٍ.', 'ابقَ دون استنشاق لمدة 4 ثوانٍ ثم كرر.'],
      focus: 'الوعي الذاتي'
    },
    { 
      id: 'p3', title: 'تفريغ الضغط والصمود', diff: 'متوسط', desc: 'برمجة التفكير الداخلي للتخلص من مشاعر الفشل والإحباط.', 
      duration: '20 د', uses: 410, sets: 5, reps: 'دورات',
      image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=2070&auto=format&fit=crop',
      steps: ['أخرج الهواء ببطء من الفم.', 'ابقَ دون استنشاق لمدة 4 ثوانٍ ثم كرر.'],
      focus: 'المرونة النفسية'
    },
    { 
      id: 'p4', title: 'التصور الذهني للأداء', diff: 'مبتدئ', desc: 'التعامل مع الضغط الجماهيري وتقبل الخوف.', 
      duration: '12 د', uses: 410, sets: 5, reps: 'دورات',
      image: 'https://images.unsplash.com/photo-1520004434532-668416a08753?q=80&w=2070&auto=format&fit=crop',
      steps: ['استنشق الهواء ببطء.', 'ابقَ دون استنشاق.'],
      focus: 'التصور الذهني'
    }
  ],
  rehab: [
    { 
      id: 'r1', title: 'تمديد الركبة بالمطاط (Resistance Band Extension)', diff: 'تأهيلي', desc: 'في المراحل الأولى بعد إصابة الأربطة الصليبية لبناء العضلة الرباعية.', 
      duration: '15 د', uses: 145, sets: 3, reps: '15',
      image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=2069&auto=format&fit=crop',
      steps: ['ثبّت الحبل المطاطي بقاعدة قوية ولف الطرف الآخر حول كاحلك المريض.', 'اجلس أو قف بثبات واسحب المطاط بمد مفصل الركبة كلياً للوراء أو للأمام.', 'احمل الانقباض لمدة ثانيتين ثم عد ببطء شديد تحت شد المقاومة.', 'التركيز العالي يجب أن يكون على مسار النزول السلبي.'],
      focus: 'الركبة'
    },
    { 
      id: 'r2', title: 'توازن على نصف كرة (BOSU Ball Balance)', diff: 'تأهيلي', desc: 'لاستعادة الثبات المفصلي والإحساس العميق (Proprioception) للكاحل أو الركبة.', 
      duration: '10 د', uses: 180, sets: 4, reps: '30 ثانية',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop',
      steps: ['قف بحذر بقدم الإصابة في مركز كرة BOSU.', 'ارفع القدم السليمة عن الأرض وحاول التوازن.', 'ارفع ذراعيك للجانبين لتحسين قدرة التوازن وتقليل الارتجاف.', 'مع التطور الملحوظ، حاول التوازن وعيناك مغلقتان.'],
      focus: 'التوازن'
    }
  ]
};

export default function CoachLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExerciseDetails, setSelectedExerciseDetails] = useState<any>(null);

  // Helper function to safely get elements ensuring there's no crash
  const getArray = (arr: any[]) => arr || [];

  return (
    <div className="relative min-h-[calc(100vh-80px)] bg-[#0a0f1c] -mx-4 sm:-mx-6 lg:-mx-10 mt-[-40px] px-4 sm:px-6 lg:px-10 py-10" dir="rtl">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10 max-w-[1600px] mx-auto">
        <div className="text-right">
          <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-white mb-2">مكتبة المنصة الشاملة</h2>
          <p className="text-lg text-slate-400 font-medium">تصفح مسارات التدريب الاحترافية للمقارنة والإحالة لمتدربيك.</p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-4 bg-[#0a0f1c]/50 p-4 rounded-2xl border border-slate-800 backdrop-blur-sm relative z-10 w-full lg:w-auto shadow-lg">
          <div className="relative w-full lg:w-96">
            <Input 
              placeholder="البحث في المكتبة..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-4 pr-11 py-6 rounded-xl border border-slate-700 bg-slate-800/80 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 font-bold transition-all shadow-sm"
            />
            <Search className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>
      
      {/* HORIZONTAL CAROUSEL GRIDS A LA NETFLIX */}
      <div className="space-y-14 mt-12 pb-20 max-w-[1600px] mx-auto">
         
         {/* TRACK: MOTOR */}
         {(searchTerm === '' || EXERCISE_LIBRARY.motor.filter(e => e.title.includes(searchTerm)).length > 0) && (
           <div className="space-y-5">
              <div className="flex items-center justify-between px-2">
                 <button className="text-slate-400 hover:text-white text-sm font-bold flex items-center transition-colors">
                    <ChevronLeft className="w-4 h-4 mr-1 ml-1" /> عرض الكل
                 </button>
                 <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-white">الأداء الحركي</h3>
                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                       <ActivityIcon className="w-5 h-5 text-orange-600" />
                    </div>
                 </div>
              </div>
              <div className="flex overflow-x-auto gap-4 md:gap-6 pb-6 pt-2 snap-x px-2 custom-scrollbar-hide" style={{ direction: 'rtl' }}>
                 {getArray(EXERCISE_LIBRARY.motor)
                    .filter(e => searchTerm === '' ? true : e.title.includes(searchTerm))
                    .map((ex, idx) => (
                    <ExerciseCard key={`motor-${idx}`} ex={ex} track="motor" type="حركي" onClick={() => setSelectedExerciseDetails({...ex, track: 'motor'})} />
                 ))}
              </div>
           </div>
         )}

         {/* TRACK: COGNITIVE */}
         {(searchTerm === '' || EXERCISE_LIBRARY.cognitive.filter(e => e.title.includes(searchTerm)).length > 0) && (
           <div className="space-y-5">
              <div className="flex items-center justify-between px-2">
                 <button className="text-slate-400 hover:text-white text-sm font-bold flex items-center transition-colors">
                    <ChevronLeft className="w-4 h-4 mr-1 ml-1" /> عرض الكل
                 </button>
                 <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-white">الأداء المعرفي</h3>
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                       <Brain className="w-5 h-5 text-blue-600" />
                    </div>
                 </div>
              </div>
              <div className="flex overflow-x-auto gap-4 md:gap-6 pb-6 pt-2 snap-x px-2 custom-scrollbar-hide" style={{ direction: 'rtl' }}>
                 {getArray(EXERCISE_LIBRARY.cognitive)
                    .filter(e => searchTerm === '' ? true : e.title.includes(searchTerm))
                    .map((ex, idx) => (
                    <ExerciseCard key={`cog-${idx}`} ex={ex} track="cognitive" type="معرفي" onClick={() => setSelectedExerciseDetails({...ex, track: 'cognitive'})} />
                 ))}
              </div>
           </div>
         )}

         {/* TRACK: PSYCH */}
         {(searchTerm === '' || EXERCISE_LIBRARY.psych.filter(e => e.title.includes(searchTerm)).length > 0) && (
           <div className="space-y-5">
              <div className="flex items-center justify-between px-2">
                 <button className="text-slate-400 hover:text-white text-sm font-bold flex items-center transition-colors">
                    <ChevronLeft className="w-4 h-4 mr-1 ml-1" /> عرض الكل
                 </button>
                 <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-white">الأداء النفسي</h3>
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                       <HeartPulse className="w-5 h-5 text-emerald-600" />
                    </div>
                 </div>
              </div>
              <div className="flex overflow-x-auto gap-4 md:gap-6 pb-6 pt-2 snap-x px-2 custom-scrollbar-hide" style={{ direction: 'rtl' }}>
                 {getArray(EXERCISE_LIBRARY.psych)
                    .filter(e => searchTerm === '' ? true : e.title.includes(searchTerm))
                    .map((ex, idx) => (
                    <ExerciseCard key={`psych-${idx}`} ex={ex} track="psych" type="نفسي" onClick={() => setSelectedExerciseDetails({...ex, track: 'psych'})} />
                 ))}
              </div>
           </div>
         )}

         {/* TRACK: REHAB */}
         {(searchTerm === '' || EXERCISE_LIBRARY.rehab.filter(e => e.title.includes(searchTerm)).length > 0) && (
           <div className="space-y-5">
              <div className="flex items-center justify-between px-2">
                 <button className="text-slate-400 hover:text-white text-sm font-bold flex items-center transition-colors">
                    <ChevronLeft className="w-4 h-4 mr-1 ml-1" /> عرض الكل
                 </button>
                 <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-white">إعادة التأهيل</h3>
                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                       <Pill className="w-5 h-5 text-red-600" />
                    </div>
                 </div>
              </div>
              <div className="flex overflow-x-auto gap-4 md:gap-6 pb-6 pt-2 snap-x px-2 custom-scrollbar-hide" style={{ direction: 'rtl' }}>
                 {getArray(EXERCISE_LIBRARY.rehab)
                    .filter(e => searchTerm === '' ? true : e.title.includes(searchTerm))
                    .map((ex, idx) => (
                    <ExerciseCard key={`rehab-${idx}`} ex={ex} track="rehab" type="تأهيلي" onClick={() => setSelectedExerciseDetails({...ex, track: 'rehab'})} />
                 ))}
              </div>
           </div>
         )}
         
      </div>

      {/* HOW TO PERFORM MODAL (Stays Bright for Content Readability) */}
      {selectedExerciseDetails && (
        <Dialog open={!!selectedExerciseDetails} onOpenChange={(open) => !open && setSelectedExerciseDetails(null)}>
           <DialogContent className="sm:max-w-xl md:max-w-2xl lg:max-w-3xl p-0 overflow-hidden border-none text-right font-sans rounded-[2rem] shadow-2xl bg-white" dir="rtl">
              
              <div className="h-64 md:h-80 w-full relative">
                 <img src={selectedExerciseDetails.image} alt="Exercise Cover" className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                 
                 <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                    <Button variant="ghost" className="w-10 h-10 bg-black/40 text-white hover:bg-white hover:text-black rounded-full backdrop-blur-md shadow-sm p-0 flex items-center justify-center border border-white/20">
                       <PlayCircle className="w-5 h-5 ml-0.5" />
                    </Button>
                 </div>

                 <div className="absolute bottom-6 right-6 left-6 z-10 text-white">
                    <Badge className="bg-blue-600/90 hover:bg-blue-600 border-none px-3 py-1 mb-3 text-xs md:text-sm font-bold shadow-lg backdrop-blur-sm">
                       {selectedExerciseDetails.track === 'motor' ? 'أداء حركي' : selectedExerciseDetails.track === 'cognitive' ? 'أداء معرفي' : selectedExerciseDetails.track === 'psych' ? 'أداء نفسي' : 'تأهيل حركي'}
                    </Badge>
                    <h2 className="text-2xl md:text-4xl font-black leading-tight tracking-tight drop-shadow-md">{selectedExerciseDetails.title}</h2>
                 </div>
              </div>

              <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8 bg-white overflow-y-auto max-h-[50vh] custom-scrollbar">
                 
                 <div className="md:col-span-2 space-y-6">
                    <div>
                       <h3 className="text-lg font-black text-slate-900 mb-3 flex items-center gap-2"><ListOrdered className="w-5 h-5 text-blue-600" /> كيفية الأداء والتوجيهات الفنية</h3>
                       <div className="space-y-4">
                          {selectedExerciseDetails.steps?.map((step: string, sIdx: number) => (
                             <div key={sIdx} className="flex gap-4 items-start group">
                                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-black shrink-0 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">{sIdx + 1}</div>
                                <p className="text-slate-600 font-medium leading-relaxed mt-1 text-sm md:text-base">{step}</p>
                             </div>
                          ))}
                       </div>
                    </div>
                    
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                       <p className="text-slate-500 font-bold leading-relaxed text-sm"><strong className="text-slate-900 font-black">الهدف من التمرين: </strong>{selectedExerciseDetails.desc}</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                       <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">المقاييس الافتراضية</h4>
                       
                       <div className="space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-200/50 pb-3">
                             <span className="text-slate-600 font-bold flex items-center gap-2"><Target className="w-4 h-4 text-slate-400" /> المجموعات</span>
                             <span className="text-slate-900 font-black text-lg">{selectedExerciseDetails.sets}</span>
                          </div>
                          <div className="flex items-center justify-between border-b border-slate-200/50 pb-3">
                             <span className="text-slate-600 font-bold flex items-center gap-2"><Activity className="w-4 h-4 text-slate-400" /> التكرارات</span>
                             <span className="text-slate-900 font-black text-lg text-left" dir="ltr">{selectedExerciseDetails.reps}</span>
                          </div>
                          <div className="flex items-center justify-between pb-1">
                             <span className="text-slate-600 font-bold flex items-center gap-2"><PlayCircle className="w-4 h-4 text-slate-400" /> مدة التنفيذ</span>
                             <span className="text-slate-900 font-black">{selectedExerciseDetails.duration}</span>
                          </div>
                       </div>
                    </div>

                    <Button onClick={() => {
                        toast.success(`تم إدراج תمرين ${selectedExerciseDetails.title} للمتدربين.`);
                        setSelectedExerciseDetails(null);
                    }} className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl text-lg shadow-[0_8px_20px_-4px_rgba(37,99,235,0.4)] hover:-translate-y-1 transition-transform">
                       إرسال لمتدرب <Send className="w-5 h-5 mr-2 rtl:-scale-x-100" />
                    </Button>
                 </div>
              </div>
           </DialogContent>
        </Dialog>
      )}

      {/* Global styling overrides specifically for this dark page component's scrollbar */}
      <style>{`
        .custom-scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .custom-scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Reusable Dark Card UI matching the Netflix UI screenshot
// ----------------------------------------------------------------------------
function ExerciseCard({ ex, type, track, onClick }: { ex: any, type: string, track: string, onClick: () => void }) {
   return (
      <div 
         onClick={onClick}
         className="shrink-0 w-72 md:w-80 h-auto rounded-[2rem] bg-white overflow-hidden shadow-lg snap-start cursor-pointer group hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 border border-slate-800"
      >
         {/* Top Image Box */}
         <div className="relative w-full h-44 overflow-hidden">
            <img src={ex.image} alt={ex.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            
            {/* Gradient Overlay for bottom dark text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

            {/* Badges Overlay */}
            <div className="absolute top-3 left-3 flex gap-2 z-10">
               {ex.hasAR && (
                  <Badge className="bg-purple-600 text-white font-black text-xs px-2 shadow-lg rounded-lg outline-none border-none">
                     AR
                  </Badge>
               )}
            </div>

            <div className="absolute top-3 right-3 z-10">
               <Badge className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border-none font-bold shadow-lg rounded-xl flex items-center gap-1 px-3 py-1">
                  {ex.duration} <Clock className="w-3.5 h-3.5 ml-0.5" />
               </Badge>
            </div>

            {/* Bottom info on image */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10 w-[calc(100%-1.5rem)]">
               <div className="w-8 h-8 rounded-full border border-white/40 bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white hover:text-black hover:scale-110 transition-all text-white">
                  <PlayCircle className="w-5 h-5 ml-0.5" />
               </div>
               <span className="text-white text-[10px] font-bold bg-white/20 px-2.5 py-1 rounded-xl backdrop-blur-md">
                  {ex.focus || 'عام'}
               </span>
            </div>
         </div>

         {/* Bottom White Panel */}
         <div className="p-4 bg-white text-right flex flex-col justify-between" style={{ minHeight: '88px' }}>
            <h4 className="font-extrabold text-slate-900 text-[14px] leading-tight">
               {ex.title}
            </h4>
            
            <div className="flex justify-between items-center mt-3">
               <span className="text-xs font-bold text-slate-500">{type}</span>
               <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                  ex.diff === 'مبتدئ' ? 'bg-emerald-100 text-emerald-700' :
                  ex.diff === 'متوسط' ? 'bg-orange-100 text-orange-700' :
                  'bg-red-100 text-red-700'
               }`}>
                  {ex.diff}
               </span>
            </div>
         </div>
      </div>
   );
}
