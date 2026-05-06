import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Medal, Star, Target, Users, 
  MapPin, Flag, ChevronRight, Award, 
  Search, Filter, Globe, School,
  Activity, Video, ClipboardList, Send,
  Zap, Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// ── Types ──────────────────────────────────────────────────────────
interface Competition {
  id: string;
  title: string;
  type: 'school' | 'regional' | 'national';
  status: 'active' | 'upcoming' | 'completed';
  date: string;
  participants: number;
  myRank?: number;
  totalParticipants?: number;
}

// ── Mock Data ──────────────────────────────────────────────────────
const MOCK_COMPETITIONS: Competition[] = [
  { id: 'comp-1', title: 'بطولة ما بين الثانويات - ولاية الجزائر', type: 'regional', status: 'active', date: '15 ماي 2026', participants: 450, myRank: 12, totalParticipants: 450 },
  { id: 'comp-2', title: 'تحدي السرعة المدرسي الوطني', type: 'national', status: 'upcoming', date: '20 جوان 2026', participants: 2500 },
  { id: 'comp-3', title: 'دوري كرة القدم المدرسي - القسم الابتدائي', type: 'school', status: 'active', date: 'كل جمعة', participants: 80, myRank: 3, totalParticipants: 80 },
];

const SCHOOL_RANKINGS = [
  { rank: 1, name: 'محمد أمين', points: 2850, avatar: 'مأ', color: 'bg-amber-400' },
  { rank: 2, name: 'رياض بن علي', points: 2720, avatar: 'رب', color: 'bg-slate-400' },
  { rank: 3, name: 'ياسين رفيق', points: 2690, avatar: 'ير', color: 'bg-orange-400' }, // Current User
  { rank: 4, name: 'مراد سعيد', points: 2540, avatar: 'مس', color: 'bg-slate-300' },
  { rank: 5, name: 'حميد معروف', points: 2410, avatar: 'حم', color: 'bg-slate-300' },
];

// ── Questionnaire Sub-component ────────────────────────────────────
function QuestionnairesSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  
  const questions = [
    { 
      title: 'الأداء الحركي (Motor)', 
      desc: 'كيف تقيم توازنك وقدرتك على تغيير الاتجاه هذا الأسبوع؟',
      options: ['ممتاز - أشعر بخفة كبيرة', 'جيد - توازن مستقر', 'متوسط - أحتاج لمزيد من التركيز', 'ضعيف - أشعر ببعض الثقل'],
      icon: Activity,
      color: 'text-blue-400'
    },
    { 
      title: 'الأداء المعرفي (Cognitive)', 
      desc: 'كيف كان مستوى تركيزك وسرعة اتخاذ القرار خلال التدريبات؟',
      options: ['تركيز عالي جداً', 'تركيز جيد', 'تشتت بسيط', 'صعوبة في التركيز'],
      icon: Brain,
      color: 'text-indigo-400'
    },
    { 
      title: 'الأداء النفسي (Psychological)', 
      desc: 'ما هو مستوى حماسك ورغبتك في المنافسة اليوم؟',
      options: ['متحمس جداً للتحدي', 'جاهز نفسياً', 'هادئ', 'أشعر ببعض الضغط'],
      icon: Heart,
      color: 'text-rose-400'
    }
  ];

  const handleNext = () => {
    if (activeStep < questions.length - 1) {
      setActiveStep(prev => prev + 1);
    } else {
      setCompleted(true);
      toast.success('تم إرسال استبيان الأداء الشامل بنجاح!');
    }
  };

  if (completed) {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-3xl p-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Send className="w-8 h-8 text-white" />
        </div>
        <h4 className="text-xl font-black text-white mb-2">شكراً لك!</h4>
        <p className="text-emerald-400 text-sm font-bold">لقد تم إرسال تقييمك الذاتي للأستاذ بنجاح. سيقوم بمراجعته في أقرب وقت.</p>
      </div>
    );
  }

  const current = questions[activeStep];

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/40 rounded-[2rem] p-8 border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-blue-500/5 to-transparent pointer-events-none" />
        
        {/* Progress Dots */}
        <div className="flex gap-2 mb-8 justify-center">
          {questions.map((_, i) => (
            <div key={i} className={cn("h-1.5 rounded-full transition-all duration-500", i === activeStep ? "w-8 bg-blue-500" : "w-2 bg-white/10")} />
          ))}
        </div>

        <div className="flex items-center gap-4 mb-6">
           <div className={cn("w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner", current.color)}>
              <current.icon className="w-7 h-7" />
           </div>
           <div>
              <h4 className="font-black text-white text-xl">{current.title}</h4>
              <p className="text-xs text-slate-500 font-bold">الخطوة {activeStep + 1} من 3</p>
           </div>
        </div>

        <p className="text-slate-300 font-bold mb-8 leading-relaxed">
           {current.desc}
        </p>

        <div className="grid grid-cols-1 gap-3 mb-8">
           {current.options.map((opt, i) => (
             <button 
               key={i}
               onClick={handleNext}
               className="w-full text-right p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all text-slate-300 font-bold text-sm flex items-center justify-between group"
             >
                {opt}
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity -rotate-180" />
             </button>
           ))}
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-white/5">
           <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">تحليل النخبة الرياضية</span>
           <Badge className="bg-indigo-500 text-white border-none text-[10px] px-3">استبيان ذكي</Badge>
        </div>
      </div>
    </div>
  );
}

// ── Main Hub Component ────────────────────────────────────────────
export function SchoolSportsHub({ defaultTab = 'competitions' }: { defaultTab?: 'competitions' | 'rankings' | 'profile' }) {
  const [activeTab, setActiveTab] = useState<'competitions' | 'rankings' | 'profile'>(defaultTab);

  return (
    <div className="space-y-8 pb-10" dir="rtl">
      
      {/* ── Header Strategy ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 rounded-[2.5rem] p-10 text-white shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -mr-48 -mt-48" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
           <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-900/40 shrink-0">
              <School className="w-10 h-10 text-white" />
           </div>
           <div className="flex-1 text-center md:text-right">
              <h1 className="text-4xl font-black mb-2 tracking-tight">الرياضة المدرسية الجزائرية 🇩🇿</h1>
              <p className="text-slate-400 text-lg font-medium leading-relaxed">
                نافس، تفوق، وارفع اسم مدرستك في المحافل الوطنية. طريقك نحو النخبة يبدأ من هنا.
              </p>
           </div>
           <div className="flex bg-white/5 backdrop-blur-md rounded-2xl p-1 gap-1 border border-white/10 shrink-0">
              {[
                { id: 'competitions', label: 'المسابقات', icon: Trophy },
                { id: 'rankings', label: 'التصنيفات', icon: Medal },
                { id: 'profile', label: 'ملف التلميذ', icon: Users },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black transition-all",
                    activeTab === t.id ? "bg-white text-indigo-950 shadow-lg" : "text-white/60 hover:text-white"
                  )}
                >
                  <t.icon className="w-4 h-4" />
                  {t.label}
                </button>
              ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ── Main Panel ── */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            
            {/* Competitions View */}
            {activeTab === 'competitions' && (
              <motion.div 
                key="comps"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 gap-6"
              >
                {MOCK_COMPETITIONS.map(comp => (
                  <Card key={comp.id} className="bg-white border-none shadow-sm rounded-[2rem] overflow-hidden group hover:shadow-xl transition-all">
                    <div className="flex flex-col md:flex-row">
                       <div className="w-full md:w-48 bg-slate-100 flex items-center justify-center p-8 group-hover:bg-blue-50 transition-colors">
                          <Trophy className={cn("w-16 h-16 transition-transform group-hover:scale-110", comp.type === 'national' ? 'text-amber-500' : 'text-blue-500')} />
                       </div>
                       <CardContent className="flex-1 p-8">
                          <div className="flex items-center justify-between mb-4">
                             <Badge className={cn("border-none px-3 font-black text-[10px]", 
                               comp.type === 'national' ? 'bg-amber-100 text-amber-700' : 
                               comp.type === 'regional' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                             )}>
                               {comp.type === 'national' ? 'بطولة وطنية' : comp.type === 'regional' ? 'بطولة ولائية' : 'دوري مدرسي'}
                             </Badge>
                             <div className="flex items-center gap-1 text-slate-400 font-bold text-xs">
                                <Activity className="w-3 h-3" /> {comp.participants} مشارك
                             </div>
                          </div>
                          <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight">{comp.title}</h3>
                          <div className="flex items-center gap-4 text-slate-500 font-bold text-xs mb-6">
                             <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {comp.type === 'national' ? 'الجزائر العاصمة' : 'ملعب الحماية المدنية'}</div>
                             <div className="flex items-center gap-1"><Flag className="w-3 h-3" /> {comp.date}</div>
                          </div>

                          <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-slate-50">
                             {comp.myRank && (
                               <div className="flex-1 flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-sm border border-emerald-100">#{comp.myRank}</div>
                                  <div className="text-[10px] font-bold text-slate-400">ترتيبك الحالي من أصل {comp.totalParticipants}</div>
                               </div>
                             )}
                             <Button className="w-full sm:w-auto h-12 px-10 rounded-xl bg-slate-900 text-white font-black text-xs hover:bg-blue-600 shadow-lg">التفاصيل والتسجيل</Button>
                          </div>
                       </CardContent>
                    </div>
                  </Card>
                ))}
              </motion.div>
            )}

            {/* Rankings View */}
            {activeTab === 'rankings' && (
              <motion.div 
                key="ranks"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="bg-slate-950 rounded-3xl p-8 text-white mb-8">
                   <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xl font-black">تصنيف النخبة المدرسية 🏅</h3>
                      <Select size="sm" defaultValue="school">
                         <option value="school">مدرستي</option>
                         <option value="regional">الولاية</option>
                         <option value="national">وطني</option>
                      </Select>
                   </div>
                   <div className="space-y-4">
                      {SCHOOL_RANKINGS.map((r, i) => (
                        <div key={i} className={cn("flex items-center gap-4 p-4 rounded-2xl transition-all", r.name === 'ياسين رفيق' ? 'bg-blue-600 shadow-xl' : 'bg-white/5')}>
                           <div className="w-8 font-black text-lg italic opacity-50">#{r.rank}</div>
                           <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg", r.color)}>{r.avatar}</div>
                           <div className="flex-1">
                              <h4 className="font-black text-sm">{r.name}</h4>
                              <div className="flex items-center gap-1 text-[10px] opacity-60 font-bold">مدرسة الفضيل الورتلاني</div>
                           </div>
                           <div className="text-right">
                              <div className="font-black text-sm">{r.points.toLocaleString()}</div>
                              <div className="text-[9px] opacity-60 font-bold uppercase">نقطة</div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </motion.div>
            )}

            {/* Student Profile / Questionnaire View */}
            {activeTab === 'profile' && (
              <motion.div 
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden p-8">
                   <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                      <ClipboardList className="w-6 h-6 text-blue-600" /> استبياناتي وملفي التربوي
                   </h3>
                   <QuestionnairesSection />
                   
                   <div className="mt-10 pt-10 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-6">
                         <h4 className="text-lg font-black text-slate-900">إرسال فيديو للأستاذ 📹</h4>
                         <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold">متاح</Badge>
                      </div>
                      <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all group cursor-pointer">
                         <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <Video className="w-8 h-8 text-blue-600" />
                         </div>
                         <h5 className="font-black text-slate-900 mb-2">ارفع فيديو أداء تمرينك</h5>
                         <p className="text-slate-400 text-xs font-medium max-w-xs mx-auto">سيتم إرسال الفيديو مباشرة للأستاذ ليقوم بتقييمه وإضافة الملاحظات عليه.</p>
                      </div>
                   </div>
                </Card>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* ── Sidebar: Rewards & Milestones ── */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 border-none rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-900/20">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                   <Award className="w-6 h-6 text-yellow-300" />
                </div>
                <h4 className="font-black text-lg">جوائز الموسم</h4>
             </div>
             <p className="text-blue-50 text-sm font-medium leading-relaxed mb-8">
                أنت على بعد <span className="text-white font-bold">250 نقطة</span> فقط من الحصول على لقب "البطل الإقليمي" والمشاركة في النهائيات الكبرى.
             </p>
             <div className="space-y-4">
                <div className="flex justify-between text-xs font-bold">
                   <span>تقدمك في التصنيف</span>
                   <span>85%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                   <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} className="h-full bg-yellow-400" />
                </div>
             </div>
          </Card>

          <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden p-8">
             <h4 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" /> إنجازات المدرسة
             </h4>
             <div className="space-y-4">
                {[
                  { label: 'أفضل تلميذ في السرعة', user: 'ياسين رفيق', icon: Zap, color: 'text-blue-500' },
                  { label: 'الأكثر التزاماً بالحضور', user: 'مراد بن علي', icon: Calendar, color: 'text-emerald-500' },
                  { label: 'بطل كرة القدم المدرسية', user: 'محمد أمين', icon: Target, color: 'text-orange-500' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                     <div className={cn("w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm", item.color)}>
                        <item.icon className="w-5 h-5" />
                     </div>
                     <div>
                        <p className="text-[10px] text-slate-400 font-bold">{item.label}</p>
                        <p className="text-xs font-black text-slate-900">{item.user}</p>
                     </div>
                  </div>
                ))}
             </div>
             <Button variant="ghost" className="w-full mt-6 text-blue-600 font-bold text-xs hover:underline">عرض كل إنجازات المؤسسة</Button>
          </Card>
        </div>

      </div>
    </div>
  );
}

function Select({ children, size, defaultValue, ...props }: any) {
  return (
    <select defaultValue={defaultValue} className="bg-slate-800 text-white border-none rounded-lg px-3 py-1.5 text-xs font-bold focus:outline-none cursor-pointer">
      {children}
    </select>
  );
}
