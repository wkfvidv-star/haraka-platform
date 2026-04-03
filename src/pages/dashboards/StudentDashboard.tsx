import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { hceService, HCEInsights } from '@/services/hceService';
import { activityService, ActivityData } from '@/services/activityService';
import { healthService } from '@/services/healthService';

// ─── Full-Page Tab Components ────────────────────────────────────────
import { ActivitiesPage }           from '@/components/student-dashboard/v2/ActivitiesPage';
import { MovementFingerprintPage }  from '@/components/student-dashboard/v2/MovementFingerprintPage';
import { AchievementsPage }         from '@/components/student-dashboard/v2/AchievementsPage';
import { HealthWellbeingPage }      from '@/components/student-dashboard/v2/HealthWellbeingPage';
import { AIAssistant }              from '@/components/student-dashboard/v2/AIAssistant';
import { FirstTimeExperience }      from '@/components/student-dashboard/v2/FirstTimeExperience';
import { VideoRecordingPage }       from '@/components/student-dashboard/v2/VideoRecordingPage';
import { StudentProfileSettingsPage } from '@/components/student-dashboard/v2/StudentProfileSettingsPage';
import { SupportHelpPage }            from '@/components/student-dashboard/v2/SupportHelpPage';
import { GPSActivityHub }           from '@/components/youth-dashboard/gps/GPSActivityHub';
import { StudentMessaging }         from '@/components/student-dashboard/v2/StudentMessaging';
import { StudentReports }           from '@/components/student-dashboard/v2/StudentReports';
import { NutritionExercisePlans }   from '@/components/student-dashboard/v2/NutritionExercisePlans';
import { youthDataService }         from '@/services/youthDataService';
import { auditService }             from '@/services/auditService';

// ─── Shared / Service Components ────────────────────────────────────
import { SmartAccessModal }  from '@/components/access/SmartAccessModal';
import { HealthSurveyModal } from '@/components/health/HealthSurveyModal';
import { PostHealthActivitiesModal } from '@/components/health/PostHealthActivitiesModal';
import { VideoSubmissionModal } from '@/components/student-dashboard/v2/VideoSubmissionModal';
import { MOCK_TEACHER_ASSIGNMENTS } from '@/data/mockAssignments';
import { db, VideoSubmissionRecord } from '@/lib/mockDatabase';
import { profileService }    from '@/services/profileService';
import { cn } from '@/lib/utils';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';

// ─── UI Primitives ───────────────────────────────────────────────────
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast }   from '@/hooks/use-toast';
import {
  LayoutDashboard, Flame, Fingerprint, TrendingUp, Heart,
  Settings, HelpCircle, LogOut, Bell, Search, Zap, Target,
  Shield, Brain, Trophy, Star, Play, ChevronRight, MessageSquare,
  Dumbbell, Clock, CheckCircle2, Activity, Sparkles, PlayCircle, RefreshCw, Video, Camera, Users, ArrowUpRight,
  Navigation, MapPin, FileText, Utensils
} from 'lucide-react';

// ─── Tab definition ──────────────────────────────────────────────────
const TABS = [
  { id: 'home',        labelAr: 'الرئيسية',             icon: LayoutDashboard },
  { id: 'training',    labelAr: 'المختبر الحركي',       icon: Target },
  { id: 'reports',     labelAr: 'التقارير والتقييم',      icon: FileText },
  { id: 'nutrition',   labelAr: 'التغذية والخطط',       icon: Utensils },
  { id: 'messaging',   labelAr: 'تواصل مع أستاذك',      icon: MessageSquare },
  { id: 'fingerprint', labelAr: 'تحليلي ومواهبي',        icon: Fingerprint },
  { id: 'videos',      labelAr: 'سجل أدائك (فيديو)',   icon: Camera },
  { id: 'progress',    labelAr: 'التحديات والمنافسات',  icon: Trophy },
  { id: 'health',      labelAr: 'المدرب الذكي (AI)',    icon: Brain },
  { id: 'gps',         labelAr: 'التتبع الميداني 🛰️',  icon: Navigation },
] as const;

type TabId = (typeof TABS)[number]['id'];

// ═════════════════════════════════════════════════════════════════
// HOME — BENTO GRID
// ═════════════════════════════════════════════════════════════════

// ═════════════════════════════════════════════════════════════════
// HOME — BENTO GRID COMPONENTS
// ═════════════════════════════════════════════════════════════════

// ── Daily Training Card ─────────────────────────────────────────
function DailyTrainingBento({ onStart }: { onStart: () => void }) {
  return (
    <div className="relative rounded-[2rem] overflow-hidden h-full flex flex-col"
      style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 40%, #312e81 100%)' }}
    >
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full blur-[80px]" />
      <div className="relative z-10 p-8 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-[1rem] bg-orange-500/20 border border-orange-400/30 flex items-center justify-center">
            <Flame className="w-6 h-6 text-orange-400" />
          </div>
          <span className="text-sm md:text-base font-bold text-blue-200 uppercase tracking-widest">تمرين اليوم</span>
        </div>
        <h3 className="text-3xl md:text-4xl font-black text-white leading-tight mb-2">السرعة والرشاقة</h3>
        <p className="text-blue-300 text-base md:text-lg mb-6">عزز رد فعلك · تم اختيار التمارين استناداً لبصمتك</p>
        <div className="flex items-center gap-6 mb-8 mt-auto">
          <div className="flex items-center gap-2 text-blue-200 text-base md:text-lg">
            <Clock className="w-5 h-5" /> <span className="font-bold">53 دقيقة</span>
          </div>
          <div className="flex items-center gap-2 text-yellow-300 text-base md:text-lg">
            <Star className="w-5 h-5 fill-yellow-300" /> <span className="font-bold">+200 XP</span>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          onClick={onStart}
          className="mt-auto w-full py-4 md:py-5 rounded-2xl bg-gradient-to-l from-orange-500 to-red-500 text-white font-black text-base md:text-lg shadow-xl shadow-orange-500/30 flex items-center justify-center gap-3"
        >
          <Play className="w-5 h-5 fill-white" /> ابدأ التمرين الآن
        </motion.button>
      </div>
    </div>
  );
}

// ── Smart Coach AI Card ──────────────────────────────────────────
function SmartCoachBento({ name }: { name: string }) {
  return (
    <div className="rounded-[2rem] p-8 flex flex-col justify-between h-full relative overflow-hidden group shadow-lg" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)' }}>
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-400/30 transition-colors duration-700" />
      <div className="relative z-10 flex-1">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-[1rem] bg-indigo-500/30 border border-indigo-400/20 flex items-center justify-center shadow-inner">
            <Brain className="w-6 h-6 text-indigo-300" />
          </div>
          <span className="text-sm md:text-base font-black text-indigo-200 tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/10">المدرب الذكي</span>
        </div>
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-5 border border-white/5">
          <p className="text-white font-black text-xl md:text-2xl leading-relaxed">
            "مرحباً {name.split(' ')[0]}! أداؤك الأخير يظهر سرعة ممتازة ⚡، لكن التركيز انخفض قليلاً. ننصحك بإضافة تمارين التوازن اليوم لرفع مستوى أدائك الشامل!"
          </p>
        </div>
      </div>
      <div className="relative z-10 mt-6 flex gap-3">
        <button className="bg-indigo-500 hover:bg-indigo-400 text-white font-black py-4 px-6 rounded-2xl transition-all w-full text-center shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5" /> بناء خطتي اليومية
        </button>
      </div>
    </div>
  );
}

// ── Video Upload CTA Card ────────────────────────────────────────
function VideoUploadBento({ onClick, onUploadClick }: { onClick?: () => void, onUploadClick?: () => void }) {
  return (
    <div className="rounded-[2rem] border border-blue-500/20 bg-gradient-to-br from-blue-50 dark:from-blue-900/10 to-indigo-50 dark:to-indigo-900/10 backdrop-blur-md p-8 h-full flex flex-col justify-center items-center text-center relative overflow-hidden group hover:border-blue-500/40 transition-colors shadow-sm cursor-default">
      <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors duration-300" />
      <div className="relative z-10 w-full flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mb-5 shadow-xl shadow-blue-500/30 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">
          <Camera className="w-7 h-7 text-white" />
        </div>
        <h4 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-3">سجل أداءك</h4>
        <p className="text-sm md:text-base font-bold text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">الذكاء الاصطناعي جاهز لتحليل حركتك</p>
        <div className="flex w-full gap-2">
           <button onClick={onUploadClick} className="bg-white dark:bg-[#0B0E14] border-2 border-blue-600 text-blue-600 dark:text-blue-400 font-black py-3 px-4 rounded-xl shadow-sm hover:bg-blue-600 hover:text-white transition-all flex-[0.45] leading-relaxed text-sm">
             رفع 📁
           </button>
           <button onClick={onClick} className="bg-gradient-to-l from-blue-600 to-indigo-600 text-white font-black py-3 px-4 rounded-xl shadow-sm hover:from-blue-500 hover:to-indigo-500 transition-all flex-[0.55] leading-relaxed text-sm">
             تصوير 🎥
           </button>
        </div>
      </div>
    </div>
  );
}

// ── Talent Discovery Card ────────────────────────────────────────
function TalentDiscoveryBento() {
  return (
    <div className="rounded-[2rem] border border-slate-200/50 dark:border-white/5 bg-white dark:bg-white/5 backdrop-blur-md p-8 h-full flex flex-col items-center text-center group cursor-pointer shadow-sm hover:shadow-lg transition-all">
      <div className="flex items-center gap-3 w-full mb-6 relative">
        <div className="absolute left-0 top-0 w-2 h-12 bg-rose-500 rounded-full" />
        <div className="w-12 h-12 ml-2 rounded-[1rem] bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center flex-shrink-0">
          <Zap className="w-6 h-6 text-rose-600 dark:text-rose-400" />
        </div>
        <span className="font-black text-slate-800 dark:text-slate-100 text-lg md:text-xl text-right">اكتشاف المواهب</span>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-gradient-to-tr from-rose-400 to-orange-500 rounded-full flex items-center justify-center mb-5 shadow-lg shadow-rose-500/30 group-hover:scale-110 transition-transform duration-500">
          <Activity className="w-10 h-10 text-white" />
        </div>
        <h4 className="text-lg md:text-xl font-black text-slate-900 dark:text-white mb-3 bg-slate-100 dark:bg-white/5 px-4 py-1.5 rounded-full text-rose-600 dark:text-rose-400">⚡ موهبة استثنائية</h4>
        <p className="text-sm md:text-base font-bold text-slate-600 dark:text-slate-300 leading-relaxed">بناءً على بصمتك، لديك مقومات وراثية وحركية ممتازة لرياضة كرة السلة والمبارزة.</p>
      </div>
    </div>
  );
}

// ── Actionable Insights & Stats Card ──────────────────────────────
function ContextualStatsBento() {
  const stats = [
    { label: 'السرعة',   value: 82, icon: Zap,    color: 'text-yellow-500', bar: 'from-yellow-400 to-orange-500', message: 'ممتاز 🔥 حافظ على إيقاعك' },
    { label: 'التوازن',  value: 68, icon: Shield, color: 'text-cyan-500',   bar: 'from-cyan-400 to-teal-500', message: 'يحتاج تركيز 🎯 (انظر التقييم)' },
    { label: 'الرشاقة',  value: 89, icon: Activity, color: 'text-blue-500', bar: 'from-blue-400 to-indigo-500', message: 'نقطة قوتك المذهلة 🚀' },
  ];
  return (
    <div className="rounded-[2rem] border border-slate-200/50 dark:border-white/5 bg-white dark:bg-white/5 backdrop-blur-md p-8 h-full flex flex-col justify-center shadow-sm">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-white/5 pb-4">
        <div className="w-12 h-12 rounded-[1rem] bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
          <Target className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <span className="font-black text-slate-800 dark:text-slate-100 text-lg md:text-xl">رؤى الأداء (Insights)</span>
      </div>
      <div className="space-y-6 flex-1 flex flex-col justify-center">
        {stats.map((s, i) => (
          <div key={i} className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <s.icon className={`w-6 h-6 ${s.color}`} />
                <span className="text-base md:text-lg font-black text-slate-700 dark:text-slate-200">{s.label}</span>
              </div>
              <span className={`text-xl md:text-2xl font-black ${s.color}`}>{s.value}</span>
            </div>
            <div className="h-3 bg-slate-200 dark:bg-black/40 rounded-full overflow-hidden mb-2">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-l ${s.bar}`}
                initial={{ width: 0 }}
                animate={{ width: `${s.value}%` }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 pr-1">{s.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Challenges & Leaderboard Card ──────────────────────────────────
function ChallengesBento() {
  return (
    <div className="rounded-[2rem] border border-slate-200/50 dark:border-white/5 bg-white dark:bg-white/5 backdrop-blur-md p-8 h-full flex flex-col shadow-sm">
      <div className="flex items-center justify-between mb-5 border-b border-slate-100 dark:border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-[1rem] bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center shadow-inner">
            <Trophy className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <span className="font-black text-slate-800 dark:text-slate-100 text-lg md:text-xl">تحدي الأسبوع 🏆</span>
        </div>
      </div>
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 border border-yellow-200/60 dark:border-yellow-700/30 rounded-2xl p-6 mb-6 flex-1 flex flex-col justify-center">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-2">أسرع انطلاقة</h4>
            <p className="text-sm md:text-base font-bold text-slate-600 dark:text-slate-300 max-w-[200px]">تنافس مع زملائك في تسجيل أسرع زمن لتمرين السكوات القفزي.</p>
          </div>
          <div className="bg-yellow-400 text-yellow-900 font-bold px-3 py-1 rounded-full text-sm">متبقي ٣ أيام</div>
        </div>
        
        <div className="flex items-center gap-4 bg-white/60 dark:bg-black/20 p-3 rounded-xl mt-auto">
          <div className="flex -space-x-3 space-x-reverse">
            <div className="w-10 h-10 rounded-full border-2 border-white dark:border-[#1e2330] bg-blue-500 flex items-center justify-center text-white text-xs font-bold z-30">أنت</div>
            <div className="w-10 h-10 rounded-full border-2 border-white dark:border-[#1e2330] bg-emerald-400 z-20 flex items-center justify-center"><span className="text-[10px] text-emerald-900">1st</span></div>
            <div className="w-10 h-10 rounded-full border-2 border-white dark:border-[#1e2330] bg-slate-300 z-10 flex items-center justify-center max-w-full"><span className="text-[10px] text-slate-700">2nd</span></div>
          </div>
          <span className="text-sm font-black text-slate-500 dark:text-slate-400 tracking-wide">+12 مشارك مسجلون</span>
        </div>
      </div>
      <button className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black py-4 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-lg shadow-black/10">
        الانضمام للتحدي وتصوير الأداء
      </button>
    </div>
  );
}

// ── Error Boundary for Debugging ──────────────────────────────
class AppErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-red-900 text-white rounded-3xl m-4 border-4 border-red-500">
           <h2 className="text-3xl font-bold mb-4">CRASH DETECTED</h2>
           <p className="text-xl">{this.state.error?.message}</p>
           <pre className="mt-4 p-4 bg-black/50 text-left w-full overflow-auto">{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const COACH_EXERCISES = [
  { id: 'ce1', exerciseName: 'تحليل تكنيك السكوات', coachName: 'الكابتن أحمد', status: 'pending' },
  { id: 'ce2', exerciseName: 'اختبار الرشاقة الميداني', coachName: 'الكابتن أحمد', status: 'pending' }
];

// ── Teacher & Coach Hub (New Request) ──────────────────────────────
function TeacherCoachHubBento({ onSelectExercise }: { onSelectExercise: () => void }) {
  const [evaluatedVideos, setEvaluatedVideos] = useState<VideoSubmissionRecord[]>([]);

  useEffect(() => {
    let mounted = true;
    db.getSubmissions().then(subs => {
      if (mounted) {
        // Only show evaluated or redo videos, sorted by date (newest first)
        const evaluated = subs.filter(s => s.status === 'evaluated' || s.status === 'redo')
                              .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setEvaluatedVideos(evaluated);
      }
    });
    return () => { mounted = false; }
  }, []);

  return (
    <div className="rounded-[2.5rem] p-6 sm:p-8 bg-gradient-to-r from-slate-900 to-indigo-950 border border-indigo-500/20 shadow-xl overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col xl:flex-row gap-8">
        
        {/* RIGHT COLUMN: Teacher / Coach Feedback */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex flex-shrink-0 items-center justify-center border border-indigo-500/30">
              <MessageSquare className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-black text-white">ردود الأساتذة وتقييمات الفيديو</h3>
              <p className="text-indigo-200/60 font-bold text-sm">ملاحظات على آخر أداء قمت بتسجيله</p>
            </div>
          </div>

          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
            {evaluatedVideos.length === 0 ? (
               <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center text-slate-400 font-bold flex flex-col items-center">
                 <CheckCircle2 className="w-8 h-8 opacity-50 mb-2" />
                 لا توجد تقييمات جديدة حالياً.
               </div>
            ) : (
               evaluatedVideos.map(video => (
                 <motion.div key={video.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                       <h4 className="font-black text-white text-lg">{video.exerciseName}</h4>
                       {video.score !== undefined && (
                          <span className={cn("font-black text-lg", video.score >= 50 ? "text-emerald-400" : "text-red-400")}>{video.score}%</span>
                       )}
                    </div>
                    <div className="bg-black/20 rounded-xl p-4 border border-white/5 relative">
                       <MessageSquare className="w-4 h-4 text-indigo-400 absolute top-4 right-4" />
                       <p className="text-sm font-bold text-slate-300 pr-6 leading-relaxed">
                         <span className="text-indigo-300">[{video.coachName}]</span>: {video.coachNotes}
                       </p>
                    </div>
                    {video.technicalTips && video.technicalTips.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                         {video.technicalTips.map((tip, idx) => (
                            <span key={idx} className="text-xs font-bold text-yellow-400 bg-yellow-400/10 px-3 py-1.5 rounded-full">💡 {tip}</span>
                         ))}
                      </div>
                    )}
                 </motion.div>
               ))
            )}
          </div>
        </div>

        {/* LEFT COLUMN: Recommended Assignments */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex flex-shrink-0 items-center justify-center border border-orange-500/30">
              <Dumbbell className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-black text-white">تمارين مقترحة مخصصة لك</h3>
              <p className="text-orange-200/60 font-bold text-sm">من الأستاذ والمدرب الرياضي</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
            {/* Show Teacher Assignments from youthDataService */}
            {youthDataService.getTasks().filter(t => t.status !== 'completed').map(assign => (
               <motion.div key={assign.id} whileHover={{ scale: 1.01 }} onClick={onSelectExercise} className="bg-gradient-to-l from-indigo-500/10 to-transparent border border-indigo-500/30 hover:bg-indigo-500/20 cursor-pointer rounded-2xl p-5 flex items-center justify-between transition-all">
                  <div>
                    <span className="text-[10px] font-black text-white bg-rose-500 px-2 py-0.5 rounded-full mb-2 inline-block">مهمة تعليمية</span>
                    <h4 className="font-black text-white text-lg">{assign.title}</h4>
                    <p className="text-sm text-indigo-200 font-bold mt-1 flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {assign.coach}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"><Play className="w-5 h-5 fill-white translate-x-0.5" /></div>
                    <span className="text-[10px] text-rose-300 font-bold">موعد: {assign.dueDate}</span>
                  </div>
               </motion.div>
            ))}
            {COACH_EXERCISES.map(ce => (
               <motion.div key={ce.id} whileHover={{ scale: 1.01 }} onClick={onSelectExercise} className="bg-gradient-to-l from-orange-500/10 to-transparent border border-orange-500/30 hover:bg-orange-500/20 cursor-pointer rounded-2xl p-5 flex items-center justify-between transition-all">
                  <div>
                    <span className="text-[10px] font-black text-orange-900 bg-orange-400 px-2 py-0.5 rounded-full mb-2 inline-block">مهمة المدرب الرياضي</span>
                    <h4 className="font-black text-white text-lg">{ce.exerciseName}</h4>
                    <p className="text-sm text-orange-200 font-bold mt-1 flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {ce.coachName}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"><Play className="w-5 h-5 fill-white translate-x-0.5" /></div>
               </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Daily Energy Indicator (Header) ─────────────────────────────
function EnergyBar({ pct = 72 }: { pct?: number }) {
  const color = pct >= 70 ? 'from-emerald-500 to-teal-500' : pct >= 40 ? 'from-yellow-400 to-orange-500' : 'from-red-500 to-rose-500';
  const label = pct >= 70 ? 'طاقة عالية' : pct >= 40 ? 'طاقة متوسطة' : 'طاقة منخفضة';
  return (
    <div className="flex items-center gap-2 bg-white dark:bg-white/5 px-3 py-2 rounded-2xl border border-slate-200/50 dark:border-white/5 shadow-sm">
      <Zap className="w-4 h-4 text-yellow-500" />
      <div>
        <div className="flex items-center gap-2">
          <div className="w-20 h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
            <div className={`h-full rounded-full bg-gradient-to-l ${color}`} style={{ width: `${pct}%` }} />
          </div>
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{pct}%</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
// HOME TAB — Bento Grid Layout
// ═════════════════════════════════════════════════════════════════
// ── GPS Bento CTA ─────────────────────────────────────────────────
function GPSBentoCTA({ onOpen }: { onOpen: () => void }) {
  return (
    <div onClick={onOpen} className="cursor-pointer rounded-[2rem] relative overflow-hidden border border-orange-500/20 hover:border-orange-500/50 transition-all duration-300 group shadow-lg hover:shadow-orange-500/10"
      style={{ background: 'linear-gradient(135deg, #0c1220 0%, #12171f 50%, #0c1220 100%)' }}>
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-blue-500/5 group-hover:from-orange-500/10 group-hover:to-blue-500/10 transition-all duration-500" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

      {/* Animated rings */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 pointer-events-none">
        {[0,1,2].map(i=>(
          <motion.div key={i} className="absolute border border-orange-500/15 rounded-full"
            style={{width:50+i*35,height:50+i*35,top:-(25+i*17.5),left:-(25+i*17.5)}}
            animate={{scale:[1,1.4,1],opacity:[0.3,0,0.3]}}
            transition={{duration:2.5,repeat:Infinity,delay:i*0.8}} />
        ))}
        <div className="w-7 h-7 rounded-full bg-orange-500/30 border border-orange-500/60 flex items-center justify-center">
          <MapPin className="w-3.5 h-3.5 text-orange-400" />
        </div>
      </div>

      <div className="relative z-10 p-7 pr-24 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-400 text-xs font-bold">GPS جاهز للاتصال</span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-white mb-1.5">🛰️ نظام التتبع الميداني الذكي</h3>
          <p className="text-slate-400 font-bold text-sm max-w-lg leading-relaxed">
            تتبع حركتك في الواقع بالـ GPS، حلل أداءك، وأنجز تحديات جغرافية ذكية. تجربة تدريب ميداني حقيقية.
          </p>
          <div className="flex gap-4 mt-3">
            {[{icon:Navigation,label:'تتبع فعلي',c:'text-orange-400'},{icon:Trophy,label:'تحديات GPS',c:'text-yellow-400'},{icon:Activity,label:'تقارير ذكية',c:'text-blue-400'}].map((s,i)=>(
              <div key={i} className="flex items-center gap-1.5">
                <s.icon className={`w-3.5 h-3.5 ${s.c}`} />
                <span className={`text-xs font-bold ${s.c}`}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <motion.button whileHover={{scale:1.04}} whileTap={{scale:0.97}}
          className="flex-shrink-0 bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-400 hover:to-rose-500 text-white font-black px-7 py-3.5 rounded-2xl shadow-xl shadow-orange-500/30 flex items-center gap-2.5 transition-all text-sm">
          <Navigation className="w-4 h-4" /> ابدأ جلسة تتبع الآن
        </motion.button>
      </div>
    </div>
  );
}

function HomeTab({
  studentName, xp, level, coverImage,
  onStartTraining, onGoProgress, onGoVideos, onUploadClick, isFirstDay, onRestartOnboarding, onOpenGPS,
}: {
  studentName: string; xp: number; level: number; coverImage?: string | null;
  onStartTraining: () => void; onGoProgress: () => void; onGoVideos?: () => void; onUploadClick?: () => void;
  isFirstDay?: boolean;
  onRestartOnboarding?: () => void;
  onOpenGPS?: () => void;
}) {
  return (
    <div className="space-y-4">
      {/* First-Day Welcome Banner */}
      {isFirstDay && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl overflow-hidden border border-blue-500/30"
          style={{ background: 'linear-gradient(135deg, rgba(29,78,216,0.25) 0%, rgba(99,102,241,0.2) 100%)' }}
        >
          <div className="flex items-start gap-3 p-4">
            <span className="text-3xl flex-shrink-0">🎉</span>
            <div className="flex-1">
              <p className="font-black text-white text-base">أهلاً بك في أول يوم لك مع حركة!</p>
              <p className="text-blue-200/80 text-sm mt-0.5 leading-relaxed">
                لقد أنشأنا بصمتك الحركية. ركّز اليوم على <span className="text-blue-300 font-bold">تمرين اليوم</span> و<span className="text-indigo-300 font-bold">توصيات Smart Training</span> المخصصة لك.
              </p>
            </div>
            <button
              onClick={onStartTraining}
              className="flex-shrink-0 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black px-3 py-1.5 rounded-xl transition-colors"
            >
              ابدأ الآن
            </button>
          </div>
        </motion.div>
      )}

      {/* Hero Welcome Banner with Cover Image */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 relative w-full h-48 md:h-56 rounded-[2rem] overflow-hidden shadow-lg flex items-end p-6 md:p-8">
        <div className="absolute inset-0">
          {coverImage ? (
            <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-700 to-indigo-800" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
        </div>
        <div className="relative z-10 w-full flex justify-between items-end">
          <div>
            <h2 className="text-3xl lg:text-4xl font-black text-white drop-shadow-md">
              أهلاً، <span className="text-blue-400">{studentName.split(' ')[0]}</span> 👋
            </h2>
            <p className="text-slate-300 font-bold text-base mt-2 drop-shadow-sm flex items-center gap-2">
              <span>{new Date().toLocaleDateString('ar-MA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-400">مستعد للتدريب</span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── TEACHER & COACH HUB (Full Row) ── */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.02 }} className="mb-6">
        <AppErrorBoundary>
          <TeacherCoachHubBento onSelectExercise={onStartTraining} />
        </AppErrorBoundary>
      </motion.div>

      {/* ── BENTO GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 xl:gap-8 auto-rows-[minmax(180px,auto)]">

        {/* 1. Daily Training — large card (2 cols × 2 rows) */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="md:col-span-2 xl:col-span-2 xl:row-span-2"
        >
          <DailyTrainingBento onStart={onStartTraining} />
        </motion.div>

        {/* 2. Smart Coach AI */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="md:col-span-2 xl:col-span-2"
        >
          <SmartCoachBento name={studentName} />
        </motion.div>

        {/* 3. Video Upload CTA */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="xl:col-span-1"
        >
          <VideoUploadBento onClick={onGoVideos} onUploadClick={onUploadClick} />
        </motion.div>

        {/* 4. Talent Discovery */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="xl:col-span-1"
        >
          <TalentDiscoveryBento />
        </motion.div>

        {/* 5. Contextual Stats Insights */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="md:col-span-2 xl:col-span-2"
        >
          <ContextualStatsBento />
        </motion.div>

        {/* 6. Challenges & Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="md:col-span-2 xl:col-span-2"
        >
          <ChallengesBento />
        </motion.div>

        {/* 7. GPS Tracker CTA */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="md:col-span-2 xl:col-span-4"
        >
          <GPSBentoCTA onOpen={onOpenGPS} />
        </motion.div>

        {/* Re-do Fingerprint Assessment */}
        {onRestartOnboarding && (
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="md:col-span-2 xl:col-span-4"
          >
            <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-l from-indigo-900/30 to-violet-900/30 backdrop-blur-md p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                  <Fingerprint className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <p className="font-black text-white text-base">احتجت لتحديث بياناتك؟</p>
                  <p className="text-slate-400 text-sm mt-0.5">أعد اختبار البصمة الحركية لتحديث خطط المدرب الذكي</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                onClick={onRestartOnboarding}
                className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm px-5 py-2.5 rounded-2xl shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                تحديث البصمة
              </motion.button>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ═════════════════════════════════════════════════════════════════
export default function StudentDashboard() {
  const { language, t } = useLanguage();
  
  const getUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user?.id || 'default';
    } catch {
      return 'default';
    }
  };
  const uid = getUserId();
  
  const [profileImage, setProfileImage] = useState<string | null>(() => localStorage.getItem(`haraka_profile_img_${uid}`));
  const [coverImage, setCoverImage] = useState<string | null>(() => localStorage.getItem(`haraka_cover_img_${uid}`));

  useEffect(() => {
    const activeUid = getUserId();
    const handleUpdate = () => setProfileImage(localStorage.getItem(`haraka_profile_img_${activeUid}`));
    const handleCoverUpdate = () => setCoverImage(localStorage.getItem(`haraka_cover_img_${activeUid}`));
    
    window.addEventListener('haraka_profile_updated', handleUpdate);
    window.addEventListener('haraka_cover_updated', handleCoverUpdate);
    
    return () => {
      window.removeEventListener('haraka_profile_updated', handleUpdate);
      window.removeEventListener('haraka_cover_updated', handleCoverUpdate);
    };
  }, []);
  const { user, logout } = useAuth();
  const { toast }        = useToast();

  const [hceInsights, setHceInsights]         = useState<HCEInsights | null>(null);
  const [activityHistory, setActivityHistory] = useState<ActivityData[]>([]);
  const [fullProfile, setFullProfile]         = useState<any>(null);
  const [loading, setLoading]                 = useState(true);
  const [activeTab, setActiveTab]             = useState<TabId | 'settings' | 'help'>('home');
  const [isSidebarOpen, setIsSidebarOpen]     = useState(true);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [showPostHealthModal, setShowPostHealthModal] = useState(false); 
  const [unreadCount, setUnreadCount] = useState(0);

  // Sync notifications with real service data
  useEffect(() => {
    const syncData = () => {
      const reports = youthDataService.getReports();
      const messages = youthDataService.getMessages();
      
      const newNotifs = [
        ...reports.filter(r => r.status === 'new').map(r => ({
          id: `r-${r.id}`,
          text: `تقرير جديد: ${r.title}`,
          time: r.date,
          type: 'report'
        })),
        ...messages.filter(m => m.sender === 'coach' && m.status === 'unseen').map(m => ({
          id: `m-${m.id}`,
          text: `رسالة جديدة من المدرب: ${m.text.substring(0, 30)}...`,
          time: 'الآن',
          type: 'message'
        }))
      ];
      
      setNotifications(newNotifs);
      setUnreadCount(newNotifs.length);
    };

    syncData();
    const interval = setInterval(syncData, 5000); // Poll for updates
    return () => clearInterval(interval);
  }, []);

  // Modals & Navigation
  const [showSmartAccess, setShowSmartAccess] = useState(false); // Added
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false); // Original, but moved under comment
  const [showHealthSurvey, setShowHealthSurvey] = useState(false); // Added
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'قام الأستاذ بتقييم الفيديو الأخير الخاص بك بنجاح. راجع التقييم والملاحظات!', time: 'منذ 10 دقائق', type: 'video' },
    { id: 2, text: 'لقد ارتقيت للمستوى 2! أنت تبلي بلاءً حسناً.', time: 'قبل ساعتين', type: 'level' },
    { id: 3, text: 'تمرين التوازن الديناميكي بانتظارك اليوم لتحقيق أهدافك.', time: 'أمس', type: 'system' }
  ]); // Added
  const [hasHealthProfile, setHasHealthProfile] = useState(false); // Added
  const [searchQuery, setSearchQuery]         = useState('');
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);

  const DATABASE_EXERCISES = [
    { title: 'القفز العمودي (Sargeant Jump)', category: 'القوة الانفجارية' },
    { title: 'اختبار T-Test للرشاقة وتغيير الاتجاه', category: 'الرشاقة' },
    { title: 'الجري المكوكي 10 متر × 4', category: 'السرعة' },
    { title: 'المرونة: مد الذراعين من الجلوس', category: 'المرونة' },
    { title: 'توازن الطائر الفلامنغو (Stork Stand)', category: 'التوازن' },
    { title: 'تمرين بلانك 45 ثانية', category: 'القوة التحملية' },
    { title: 'سكوات الجدار (Wall Sit)', category: 'القوة التحملية' },
    { title: 'رمي واستقبال الكرات (التوافق اليدوي-العيني)', category: 'التوافق الحركي' }
  ];

  const [showOnboarding, setShowOnboarding] = useState<boolean>(() =>
    !localStorage.getItem(`haraka_ftue_complete_${uid}`)
  );

  const handleRestartOnboarding = useCallback(() => {
    const activeUid = getUserId();
    localStorage.removeItem(`haraka_ftue_complete_${activeUid}`);
    localStorage.removeItem(`haraka_ftue_phase_${activeUid}`);
    localStorage.removeItem(`haraka_ftue_date_${activeUid}`);
    localStorage.removeItem(`haraka_ftue_scores_${activeUid}`);
    setShowOnboarding(true);
  }, []);

  // Derive whether today is the student's first day (FTUE completed within last 24h)
  const isFirstDay = (() => {
    const activeUid = getUserId();
    const ftueDate = localStorage.getItem(`haraka_ftue_date_${activeUid}`);
    if (!ftueDate) return false;
    const diff = Date.now() - new Date(ftueDate).getTime();
    return diff < 24 * 60 * 60 * 1000; // 24 hours
  })();

  const isRTL = language === 'ar';

  const fetchDashboardData = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      
      // 1. Fetch Profile FAST and check health immediately
      let profileData = null;
      try {
          profileData = await profileService.getProfile(user.id);
          setFullProfile(profileData);
      } catch (err) {
          profileData = { firstName: user.name || 'طالب', lastName: '' };
          setFullProfile(profileData);
      }

      // 2. Decide if we show health survey
      const activeUid = user.id;
      const isFtueComplete = !!localStorage.getItem(`haraka_ftue_complete_${activeUid}`);
      const isHealthSurveyBypassed = !!localStorage.getItem(`haraka_health_survey_completed_${activeUid}`);
      
      if (isFtueComplete && !profileData?.healthProfile && !isHealthSurveyBypassed) {
          setShowHealthSurvey(true);
      } else {
          setHasHealthProfile(true);
      }

      // 3. Fetch the rest of the slow data concurrently in the background
      Promise.all([
        activityService.getHistory().catch(() => []),
        hceService.getPersonalInsights(user.id).catch(() => ({
          cognitive:     { status: 'جيد', observation: '', recommendation: 'الاستمرار في التركيز' },
          physical:      { status: 'جيد', observation: '', recommendation: 'زيادة معدل التمارين' },
          psychological: { status: 'مستقر', observation: '', recommendation: 'المحافظة على أوقات الراحة' },
          vision_forecast: 'الحفاظ على المسار سيؤدي إلى تحسن 15% في القدرات الحركية',
        })),
      ]).then(([history, insights]) => {
          setActivityHistory(history || []);
          setHceInsights(insights);
      });

    } catch (err) {
      console.error(err);
      toast({ title: 'تنبيه', description: 'تم التحميل من البيانات المحلية.', variant: 'default' });
    } finally {
      setLoading(false);
    }
  };

  // Handle successful completion of health survey
  const handleHealthSurveyComplete = () => {
      localStorage.setItem(`haraka_health_survey_completed_${user?.id || 'default'}`, 'true'); // Persist local bypass
      setHasHealthProfile(true);
      setShowHealthSurvey(false);
      // Immediately trigger the post-health activity selection modal
      setShowPostHealthModal(true);
  };

  // Handle section selection from the Post-Health Modal
  const handlePostHealthActivitySelect = (sectionId: string) => {
      setShowPostHealthModal(false);
      setActiveTab('training');
      
      // Because ActivitiesPage has Framer Motion animations that change DOM height,
      // a single timeout might calculate the wrong Y position or miss the element.
      // We retry finding and scrolling to the element for up to 1 second.
      let attempts = 0;
      const scrollInterval = setInterval(() => {
          const el = document.getElementById(sectionId);
          if (el) {
              const y = el.getBoundingClientRect().top + window.scrollY - 100;
              window.scrollTo({ top: y, behavior: 'smooth' });
              
              // If we've successfully found it and tried scrolling, we can reduce polling,
              // but we'll try a couple of times as the animation settles.
              if (attempts > 5) clearInterval(scrollInterval);
          }
          
          attempts++;
          if (attempts > 10) clearInterval(scrollInterval);
      }, 100);
  };

  useEffect(() => {
    fetchDashboardData();
    const openLab = () => setActiveTab('training');
    window.addEventListener('open-motion-lab', openLab);
    return () => window.removeEventListener('open-motion-lab', openLab);
  }, [user?.id]);

  const handleCompleteOnboarding = () => {
    setShowOnboarding(false);
    // Sequence the flow: after Onboarding, ALWAYS prompt for Health Profile for the MVP
    setTimeout(() => setShowHealthSurvey(true), 1500); // 1.5s delay for a smoother transition
  };

  // Derived
  const studentName = fullProfile?.firstName
    ? `${fullProfile.firstName} ${fullProfile.lastName || ''}`.trim()
    : user?.name || 'تلميذ حركة';
  const xp    = fullProfile?.xp || 0;
  const level = Math.floor(xp / 500) + 1;
  const initial = (fullProfile?.firstName?.[0] || user?.name?.[0] || '؟').toUpperCase();

  // Simulated Live Notifications Module
  useEffect(() => {
    const notifsEnabled = localStorage.getItem('haraka_notifs') !== 'false';
    if (!notifsEnabled) return;

    const notifMessages = [
      { title: language === 'ar' ? 'مدربك أرسل لك رسالة' : 'New message from Coach', desc: language === 'ar' ? 'لديك تمرين سرعة جديد بانتظارك من الكابتن أمين ⚡' : 'You have a new speed drill waiting! ⚡' },
      { title: language === 'ar' ? 'إنجاز جديد قريب!' : 'Achievement unlocked soon!', desc: language === 'ar' ? 'أنت على بعد 50 نقطة فقط من فتح وسام المحارب 🏆' : 'You are 50 XP away from the Warrior badge 🏆' },
      { title: language === 'ar' ? 'تذكير بالتدريب' : 'Training Reminder', desc: language === 'ar' ? 'لا تنسَ إكمال الجلسة الإدراكية الخاصة بك اليوم 🌟' : 'Dont forget to complete your cognitive session today 🌟' }
    ];

    let count = 0;
    const interval = setInterval(() => {
      if (count < notifMessages.length) {
        toast({
          title: notifMessages[count].title,
          description: notifMessages[count].desc,
          duration: 5000,
          className: 'bg-white dark:bg-slate-900 border-l-4 border-l-blue-500 shadow-xl'
        });
        count++;
      }
    }, 25000); // Trigger every 25 seconds for the live demo feel

    return () => clearInterval(interval);
  }, [language, toast]);

  return (
    <div className={`expert-dashboard-root selection:bg-orange-500/30 ${language === 'ar' ? 'rtl' : 'ltr-layout'}`}>

      {/* ── Animated Background ── */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-[-5%] bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/admin_school_play_bg.png)', opacity: 0.12 }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a]/95 via-[#020617]/80 to-[#0f172a]/95" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
      </div>

      <div className="flex h-screen overflow-hidden relative z-10">

        {/* ── First-Time User Experience ── */}
        {showOnboarding && (
          <FirstTimeExperience
            onComplete={handleCompleteOnboarding}
            studentName={studentName}
          />
        )}

        {/* ══════════════════════════════════════════════════════
            SIDEBAR
        ══════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside
              initial={{ x: isRTL ? 300 : -300 }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? 300 : -300 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={cn(
                "h-full border-slate-200 dark:border-white/5 bg-white dark:bg-[#0B0E14] flex flex-col z-50 shadow-xl overflow-hidden flex-shrink-0 fixed lg:static",
                isRTL ? "right-0 border-l" : "left-0 border-r"
              )}
              style={{ width: 300 }}
            >
              {/* Overlay for mobile when sidebar is open */}
              <div 
                className="fixed inset-0 bg-black/50 z-[-1] lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              />
              {/* Logo */}
              <div className="h-20 lg:h-24 flex items-center px-8 py-6 border-b border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[1rem] bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0 overflow-hidden">
                    {coverImage ? (
                      <img src={coverImage} alt="Brand" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white font-black text-2xl">H</span>
                    )}
                  </div>
                  <div>
                    <h2 className="font-black text-xl lg:text-2xl leading-tight text-slate-900 dark:text-white">{t('brand_name')}</h2>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-bold tracking-wider">{t('student_portal')}</span>
                  </div>
                </div>
              </div>

              {/* Nav */}
              <ScrollArea className="flex-1 px-5 py-6">
                <p className="px-4 mb-4 text-xs font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.15em]">
                  {t('menu_main')}
                </p>
                <div className="space-y-2">
                  {TABS.map(tab => {
                    const Icon = tab.icon;
                    const active = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-4 px-5 py-4 rounded-[1.25rem] transition-all duration-200 group ${
                          active
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-black'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-100 font-semibold'
                        }`}
                      >
                        <Icon className={`w-6 h-6 flex-shrink-0 transition-transform group-hover:scale-110 ${active ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                        <span className="text-base">{t('tab_' + tab.id)}</span>
                        {active && <div className="mr-auto w-2 h-2 rounded-full bg-white/60" />}
                      </button>
                    );
                  })}
                </div>

                {/* Bottom items */}
                <div className="mt-8 space-y-2 border-t border-slate-100 dark:border-white/5 pt-6">
                  <p className="px-4 mb-4 text-xs font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.15em]">{t('menu_support')}</p>
                  <button
                    onClick={handleRestartOnboarding}
                    className="w-full flex items-center gap-4 px-5 py-4 rounded-[1.25rem] text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 font-bold group transition-all"
                  >
                    <RefreshCw className="w-5 h-5 text-indigo-400 group-hover:rotate-180 transition-transform duration-500" />
                    <span className="text-base">{t('btn_retake_test')}</span>
                  </button>
                  <button 
                    onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }}
                    className="w-full flex items-center gap-4 px-5 py-4 rounded-[1.25rem] text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-100 font-bold group transition-all"
                  >
                    <Settings className="w-5 h-5 text-slate-400 group-hover:rotate-45 transition-transform duration-300" />
                    <span className="text-base">{t('btn_settings')}</span>
                  </button>
                  <button 
                    onClick={() => { setActiveTab('help'); setIsSidebarOpen(false); }}
                    className="w-full flex items-center gap-4 px-5 py-4 rounded-[1.25rem] text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-100 font-bold group transition-all"
                  >
                    <HelpCircle className="w-5 h-5 text-slate-400 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="text-base">{t('btn_help')}</span>
                  </button>
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-4 px-5 py-4 rounded-[1.25rem] text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 font-bold group transition-all"
                  >
                    <LogOut className={`w-5 h-5 text-slate-400 group-hover:text-red-400 group-hover:-translate-x-1 transition-all ${language === 'ar' ? '-scale-x-100' : ''}`} />
                    <span className="text-base">{t('btn_logout')}</span>
                  </button>
                </div>
              </ScrollArea>

              {/* Sidebar Footer — User Info */}
              <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50/60 dark:bg-white/[0.02]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[1rem] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md flex-shrink-0 overflow-hidden relative">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-base font-black text-white">{initial}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base md:text-lg font-black text-slate-900 dark:text-slate-100 truncate">{studentName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        المستوى {level} · <span className="text-yellow-500 font-bold">{xp} XP</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ══════════════════════════════════════════════════════
            MAIN AREA
        ══════════════════════════════════════════════════════ */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50/30 dark:bg-[#0B0E14]">

          {/* ── TOP HEADER ── */}
          <header className="h-20 lg:h-24 bg-white/80 dark:bg-[#0B0E14]/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5 flex items-center justify-between px-6 lg:px-8 z-10 sticky top-0 gap-6">
            {/* Left: Hamburger + Page Title */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 transition-colors"
              >
                <div className="space-y-2">
                  <span className="block w-6 h-0.5 bg-current rounded" />
                  <span className="block w-4 h-0.5 bg-current rounded" />
                  <span className="block w-6 h-0.5 bg-current rounded" />
                </div>
              </button>
              <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white hidden md:block">
                {activeTab === 'settings' ? t('settings_title') : t('tab_' + activeTab)}
              </h1>
            </div>

            {/* Center: Search */}
            <div className="flex-1 max-w-md hidden lg:flex items-center gap-3 bg-slate-100 dark:bg-white/5 rounded-[1.25rem] px-5 py-3 md:py-3.5 border border-transparent focus-within:border-blue-500/30 relative">
              <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <input
                value={searchQuery}
                onFocus={() => setShowGlobalSearch(true)}
                onBlur={() => setTimeout(() => setShowGlobalSearch(false), 200)}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t('search_placeholder')}
                className="flex-1 bg-transparent text-base text-slate-700 dark:text-slate-200 placeholder-slate-400 outline-none w-full"
              />
              
              <AnimatePresence>
                {showGlobalSearch && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                    className="absolute top-full mt-2 left-0 right-0 w-full bg-white dark:bg-[#1e2330] rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-white/10 z-50 text-right"
                  >
                    {(() => {
                      const normalizeStrict = (s: string) => s.replace(/[أإآا]/g, 'ا').replace(/[يى]/g, 'ي').replace(/[ةه]/g, 'ه');
                      const Q = normalizeStrict(searchQuery);
                      let matches = DATABASE_EXERCISES.filter(ex => !searchQuery || normalizeStrict(ex.title).includes(Q) || normalizeStrict(ex.category).includes(Q));
                      
                      // If no strict matches found, suggest all
                      const hasMatches = matches.length > 0;
                      if (!hasMatches) {
                        matches = DATABASE_EXERCISES.slice(0, 4); // Suggest first 4
                      }
                      
                      return (
                        <div className="max-h-60 overflow-y-auto py-2">
                          {!hasMatches && searchQuery && (
                            <div className="px-5 py-2 mb-1 bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-500 text-xs font-bold border-b border-yellow-100 dark:border-yellow-500/20">
                              لم نجد تطابق دقيق. هل تقصد أحد هذه التمارين؟
                            </div>
                          )}
                          {matches.map((ex, i) => (
                            <div 
                              key={i} 
                              onClick={() => {
                                setSearchQuery(ex.title);
                                setShowGlobalSearch(false);
                                setActiveTab('training');
                                toast({ title: 'توجيه للتمرين', description: `تم نقلك لصفحة ${ex.title}.`, className: 'bg-indigo-600 text-white border-none' });
                              }}
                              className="px-5 py-3 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer border-b border-slate-100 dark:border-white/5 last:border-none flex items-center justify-between transition-colors"
                            >
                              <span className="font-bold text-slate-800 dark:text-slate-200">{ex.title}</span>
                              <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-full">{ex.category}</span>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right: Energy + Notif + AI + Avatar */}
            <div className="flex items-center gap-4">
              <EnergyBar pct={72} />

              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="w-12 h-12 rounded-[1rem] flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 transition-colors"
                >
                  <Bell className="w-6 h-6" />
                  {notifications.length > 0 && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-[#0B0E14] rounded-full" />}
                </button>
                
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-[#1e2330] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 z-50 overflow-hidden text-right"
                    >
                      <div className="p-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                        <h3 className="font-black text-slate-800 dark:text-slate-100">الإشعارات</h3>
                        <span className="text-xs bg-rose-100 text-rose-600 font-bold px-2 py-1 rounded-full">{notifications.length} جديد</span>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.map(n => (
                          <div key={n.id} className="p-4 border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                              <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-snug">{n.text}</p>
                              <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 text-center bg-slate-50 dark:bg-white/5 cursor-pointer hover:bg-slate-100 dark:hover:bg-white/10">
                        <span className="text-xs font-black text-blue-600 dark:text-blue-400">تحديد الكل كمقروء</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={() => setIsAssistantOpen(!isAssistantOpen)}
                className={`h-12 rounded-[1rem] gap-3 px-5 text-base font-bold transition-all flex items-center ${
                  isAssistantOpen
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/25'
                    : 'bg-white dark:bg-white/5 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-white/10 shadow-sm hover:bg-slate-50 dark:hover:bg-white/10'
                }`}
              >
                <Brain className="w-5 h-5" />
                <span className="hidden sm:inline">AI مساعد</span>
              </button>

              {/* Avatar */}
              <div 
                onClick={() => setActiveTab('settings')}
                className="w-10 h-10 md:w-12 md:h-12 rounded-[1rem] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg cursor-pointer overflow-hidden relative"
              >
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg font-black text-white">{initial}</span>
                )}
              </div>
            </div>
          </header>

          <AnimatePresence>
            {!isSidebarOpen && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="lg:hidden fixed bottom-24 right-6 z-40"
              >
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-blue-500/40"
                >
                  <Navigation className="w-6 h-6" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Scrollable Content ── */}
          <ScrollArea className="flex-1">
            <div className="p-5 lg:p-7">
              <AnimatePresence mode="wait">

                {activeTab === 'home' && (
                  <motion.div key="home"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}
                  >
                    <AppErrorBoundary>
                    <HomeTab
                      studentName={studentName}
                      xp={xp} level={level} coverImage={coverImage}
                      onStartTraining={() => setActiveTab('training')}
                      onGoProgress={() => setActiveTab('progress')}
                      onGoVideos={() => setActiveTab('videos')}
                      onUploadClick={() => setIsVideoModalOpen(true)}
                      isFirstDay={isFirstDay}
                      onRestartOnboarding={handleRestartOnboarding}
                      onOpenGPS={() => setActiveTab('gps')}
                    />
                    </AppErrorBoundary>
                  </motion.div>
                )}

                {activeTab === 'training' && (
                  <motion.div key="training"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}
                  >
                    <ActivitiesPage onComplete={fetchDashboardData} />
                  </motion.div>
                )}

                {activeTab === 'reports' && (
                  <motion.div key="reports"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}
                  >
                    <StudentReports />
                  </motion.div>
                )}

                {activeTab === 'nutrition' && (
                  <motion.div key="nutrition"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}
                  >
                    <NutritionExercisePlans />
                  </motion.div>
                )}

                {activeTab === 'messaging' && (
                  <motion.div key="messaging"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}
                  >
                    <StudentMessaging />
                  </motion.div>
                )}

                {activeTab === 'fingerprint' && (
                  <motion.div key="fingerprint"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}
                  >
                    <MovementFingerprintPage />
                  </motion.div>
                )}

                {activeTab === 'progress' && (
                  <motion.div key="progress"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}
                  >
                    <AchievementsPage />
                  </motion.div>
                )}

                {activeTab === 'videos' && (
                  <motion.div key="videos"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}
                  >
                    <VideoRecordingPage />
                  </motion.div>
                )}

                {activeTab === 'health' && (
                  <motion.div key="health"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}
                  >
                    <HealthWellbeingPage />
                  </motion.div>
                )}

                {activeTab === 'gps' && (
                  <motion.div key="gps"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}
                  >
                    <AppErrorBoundary>
                      <GPSActivityHub />
                    </AppErrorBoundary>
                  </motion.div>
                )}

                {activeTab === 'settings' && (
                  <motion.div key="settings"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}
                  >
                    <StudentProfileSettingsPage onBack={() => setActiveTab('home')} />
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </ScrollArea>
        </div>

        {/* ── AI Assistant Docked Panel ── */}
        <div className={`h-screen border-r border-slate-200 dark:border-white/5 bg-white dark:bg-[#0B0E14] shadow-[-16px_0_32px_rgba(0,0,0,0.06)] dark:shadow-[-16px_0_32px_rgba(0,0,0,0.3)] transition-all duration-500 overflow-hidden z-30 ${
          isAssistantOpen ? 'w-[380px] opacity-100' : 'w-0 opacity-0 pointer-events-none'
        }`}>
          <div className="w-[380px] h-full">
            <AIAssistant mode="docked" forceOpen={true} userName={fullProfile?.firstName}
              onClose={() => setIsAssistantOpen(false)} />
          </div>
        </div>

        {!isAssistantOpen && <AIAssistant forceOpen={false} userName={fullProfile?.firstName} />}
      </div>

      {/* ── Modals ── */}
      <SmartAccessModal 
        isOpen={isAccessModalOpen} 
        onClose={() => setIsAccessModalOpen(false)} 
        onSuccess={() => setShowHealthSurvey(true)}
      />
      {/* Mandatory Onboarding Modals */}
      <HealthSurveyModal
        isOpen={showHealthSurvey}
        onClose={() => {}} // Force completion for MVP
        onComplete={handleHealthSurveyComplete}
      />
      
      {/* Post-Health Activity Selection Modal */}
      <PostHealthActivitiesModal
        isOpen={showPostHealthModal}
        onClose={() => setShowPostHealthModal(false)}
        onSelectActivity={handlePostHealthActivitySelect}
      />

      {/* Mobile Navigation */}
      <MobileBottomNav
        items={TABS.map(t => ({ id: t.id, label: t.labelAr, icon: t.icon }))}
        activeTab={activeTab as string}
        onTabChange={(id) => setActiveTab(id as TabId)}
        accentColor="blue"
      />

      {/* Standalone Video Upload Modal */}
      <VideoSubmissionModal 
        isOpen={isVideoModalOpen} 
        onClose={() => setIsVideoModalOpen(false)} 
      />
    </div>
  );
}