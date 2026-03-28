import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Activity, Zap, Moon, Watch, Brain, AlertTriangle,
  TrendingUp, TrendingDown, Battery, CheckCircle2, ShieldAlert,
  Dumbbell, Footprints, Flame, Plus, X, Smartphone, Crosshair
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { StudentWellBeingIndicators } from './StudentWellBeingIndicators';

// ─── Mock Data & Types ───────────────────────────────────────
const MOCK_TREND_DATA = [
  { day: 'السبت', readiness: 65, fatigue: 40 },
  { day: 'الأحد', readiness: 72, fatigue: 35 },
  { day: 'الاثنين', readiness: 85, fatigue: 20 },
  { day: 'الثلاثاء', readiness: 78, fatigue: 25 },
  { day: 'الأربعاء', readiness: 90, fatigue: 15 },
  { day: 'الخميس', readiness: 88, fatigue: 18 },
  { day: 'الجمعة', readiness: 95, fatigue: 10 },
];

const WATCH_PROVIDERS = [
  { id: 'apple', name: 'Apple Watch', color: 'bg-black text-white' },
  { id: 'garmin', name: 'Garmin', color: 'bg-slate-800 text-white' },
  { id: 'wearos', name: 'Wear OS', color: 'bg-blue-600 text-white' },
  { id: 'fitbit', name: 'Fitbit', color: 'bg-teal-600 text-white' },
];

// ─── Main Component ──────────────────────────────
export function HealthWellbeingPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);

  // Vitals State
  const [vitals, setVitals] = useState({
    hr: 72,
    restingHr: 58,
    steps: 8450,
    calories: 2100,
    sleep: 6.5,
    sleepQuality: 75,
    activityMin: 45,
    spO2: 97,
    hrv: 42,
    water: 1.5,
    weight: 65,
    stress: 4
  });

  // Derived AI Scores
  const readinessScore = Math.min(100, Math.round((vitals.sleep / 8) * 40 + (100 - vitals.restingHr) * 0.3 + (vitals.activityMin > 30 ? 30 : 10)));
  const healthScore = Math.min(100, Math.round((vitals.steps / 10000) * 40 + (vitals.sleepQuality * 0.4) + 20));
  const fatigueScore = Math.min(100, Math.max(0, Math.round((vitals.hr - 60) * 1.5 + (8 - vitals.sleep) * 10 - (vitals.activityMin * 0.2))));

  const handleConnectWatch = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      setShowConnectModal(false);
      // Simulate receiving better, broader data
      setVitals({
        hr: 68, restingHr: 54, steps: 11200, calories: 2600, sleep: 7.8, sleepQuality: 90, activityMin: 65,
        spO2: 99, hrv: 65, water: vitals.water, weight: vitals.weight, stress: 2
      });
    }, 2500);
  };

  const handleManualSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setVitals(prev => ({
      ...prev,
      sleep: Number(fd.get('sleep')) || prev.sleep,
      steps: Number(fd.get('steps')) || prev.steps,
      hr: Number(fd.get('hr')) || prev.hr,
      water: Number(fd.get('water')) || prev.water,
      weight: Number(fd.get('weight')) || prev.weight,
      stress: Number(fd.get('stress')) || prev.stress,
    }));
    setShowManualModal(false);
  };

  return (
    <div className="space-y-6 pb-24 relative">
      
      {/* ── Header Banner & Connection CTA ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="relative rounded-[2rem] overflow-hidden p-8 lg:p-10 shadow-lg"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)' }}
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-[80px]" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                <Heart className="w-7 h-7 text-indigo-400" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-black text-white">الملف الصحي الشامل</h1>
            </div>
            <p className="text-indigo-200 text-base md:text-lg max-w-2xl leading-relaxed">
              نطام ذكي يتتبع مؤشراتك الفسيولوجية ويحللها لتقديم توصيات تدريبية دقيقة تحمي من الإجهاد وترفع جاهزيتك.
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {isConnected ? (
              <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-2xl px-6 py-4 flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-black text-emerald-100">الساعة متصلة بنجاح</span>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setShowConnectModal(true)}
                  className="bg-white hover:bg-slate-100 text-indigo-900 font-black px-6 py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3"
                >
                  <Watch className="w-6 h-6" /> ربط الساعة الذكية
                </button>
                <button
                  onClick={() => setShowManualModal(true)}
                  className="bg-indigo-900/50 hover:bg-indigo-800/50 border border-indigo-400/30 text-indigo-100 font-bold px-6 py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" /> إدخال يدوي
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── AI Insights Warning/Recommendation ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className={cn(
          "rounded-[2rem] p-6 lg:p-8 flex items-center gap-5 border shadow-sm",
          fatigueScore > 60 
            ? "bg-rose-50 dark:bg-rose-900/10 border-rose-200 dark:border-rose-800/30"
            : readinessScore > 80 
              ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/30"
              : "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/30"
        )}
      >
        <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner flex-shrink-0", 
          fatigueScore > 60 ? "bg-rose-100 dark:bg-rose-900/40" 
          : readinessScore > 80 ? "bg-emerald-100 dark:bg-emerald-900/40" 
          : "bg-blue-100 dark:bg-blue-900/40"
        )}>
          <Brain className={cn("w-8 h-8", 
            fatigueScore > 60 ? "text-rose-600 dark:text-rose-400" 
            : readinessScore > 80 ? "text-emerald-600 dark:text-emerald-400" 
            : "text-blue-600 dark:text-blue-400"
          )} />
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-100 mb-2">رؤية المدرب الذكي (AI Insight)</h3>
          <p className="text-base md:text-lg font-bold text-slate-600 dark:text-slate-300 leading-relaxed">
            {fatigueScore > 60 
              ? "⚠️ مؤشر الإجهاد مرتفع لديك بسبب قلة النوم وزيادة معدل النبض. ننصحك بإلغاء التمارين الشاقة اليوم والتركيز على تمارين الإطالة والتنفس."
              : readinessScore > 80
                ? "🚀 جاهزيتك اليوم ممتازة جداً! جسمك في أفضل حالات التعافي. هذا هو الوقت المثالي لكسر أرقامك القياسية في تمارين السرعة أو القوة."
                : "✅ الحالة الجسدية مستقرة. يمكنك أداء جدولك التدريبي المعتاد للحفاظ على مستوى اللياقة الحالي."}
          </p>
        </div>
      </motion.div>

      {/* ── AI Composite Scores ── */}
      <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-8 mb-4">المؤشرات الحيوية المركبة</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Readiness */}
        <div className="rounded-[2rem] border border-slate-200/50 dark:border-white/5 bg-white dark:bg-white/5 backdrop-blur-md p-8 flex flex-col items-center text-center shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
            <Battery className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h4 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-1">جاهزية اليوم</h4>
          <p className="text-sm font-bold text-slate-400 mb-6">Daily Readiness</p>
          <div className="relative w-36 h-36">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-white/5" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" 
                strokeDasharray={`${(readinessScore / 100) * 283} 283`} 
                className={readinessScore > 70 ? "text-emerald-500" : readinessScore > 40 ? "text-amber-500" : "text-rose-500"} 
                style={{ transition: 'stroke-dasharray 1s ease-in-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-black text-slate-900 dark:text-white">{readinessScore}</span>
            </div>
          </div>
        </div>

        {/* Health */}
        <div className="rounded-[2rem] border border-slate-200/50 dark:border-white/5 bg-white dark:bg-white/5 backdrop-blur-md p-8 flex flex-col items-center text-center shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
            <Activity className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h4 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-1">الصحة العامة</h4>
          <p className="text-sm font-bold text-slate-400 mb-6">Health Score</p>
          <div className="relative w-36 h-36">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-white/5" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" 
                strokeDasharray={`${(healthScore / 100) * 283} 283`} 
                className="text-blue-500"
                style={{ transition: 'stroke-dasharray 1s ease-in-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-black text-slate-900 dark:text-white">{healthScore}</span>
            </div>
          </div>
        </div>

        {/* Fatigue */}
        <div className="rounded-[2rem] border border-slate-200/50 dark:border-white/5 bg-white dark:bg-white/5 backdrop-blur-md p-8 flex flex-col items-center text-center shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mb-4">
            <ShieldAlert className="w-8 h-8 text-rose-600 dark:text-rose-400" />
          </div>
          <h4 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-1">مؤشر الإجهاد</h4>
          <p className="text-sm font-bold text-slate-400 mb-6">Fatigue Score</p>
          <div className="relative w-36 h-36">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-white/5" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" 
                strokeDasharray={`${(fatigueScore / 100) * 283} 283`} 
                className={fatigueScore > 60 ? "text-rose-500" : fatigueScore > 30 ? "text-amber-500" : "text-emerald-500"}
                style={{ transition: 'stroke-dasharray 1s ease-in-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-black text-slate-900 dark:text-white">{fatigueScore}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Vital Metrics Grid ── */}
      <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-10 mb-4">التفاصيل الفسيولوجية</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* HR */}
        <div className="rounded-[2rem] border border-slate-200/50 dark:border-white/5 bg-white dark:bg-white/5 p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-900/20 flex items-center justify-center">
              <Heart className="w-6 h-6 text-rose-500" />
            </div>
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 px-3 py-1 rounded-full">{vitals.hr > 85 ? 'مرتفع' : 'طبيعي'}</span>
          </div>
          <p className="text-5xl font-black text-slate-900 dark:text-white mb-2">{vitals.hr} <span className="text-lg text-slate-400 font-bold">bpm</span></p>
          <p className="text-lg font-bold text-slate-700 dark:text-slate-200">النبض الحالي</p>
        </div>

        {/* Resting HR */}
        <div className="rounded-[2rem] border border-slate-200/50 dark:border-white/5 bg-white dark:bg-white/5 p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center">
              <Activity className="w-6 h-6 text-indigo-500" />
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full">{vitals.restingHr < 60 ? 'ممتاز' : 'جيد'}</span>
          </div>
          <p className="text-5xl font-black text-slate-900 dark:text-white mb-2">{vitals.restingHr} <span className="text-lg text-slate-400 font-bold">bpm</span></p>
          <p className="text-lg font-bold text-slate-700 dark:text-slate-200">النبض وقت الراحة</p>
        </div>

        {/* Sleep */}
        <div className="rounded-[2rem] border border-slate-200/50 dark:border-white/5 bg-white dark:bg-white/5 p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-900/20 flex items-center justify-center">
              <Moon className="w-6 h-6 text-violet-500" />
            </div>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full">{vitals.sleep < 7 ? 'غير كافٍ' : 'كافٍ'}</span>
          </div>
          <p className="text-5xl font-black text-slate-900 dark:text-white mb-2">{vitals.sleep} <span className="text-lg text-slate-400 font-bold">ساعات</span></p>
          <p className="text-lg font-bold text-slate-700 dark:text-slate-200">مدة النوم</p>
        </div>

        {/* Steps */}
        <div className="rounded-[2rem] border border-slate-200/50 dark:border-white/5 bg-white dark:bg-white/5 p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
              <Footprints className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
          <p className="text-5xl font-black text-slate-900 dark:text-white mb-2">{vitals.steps.toLocaleString()} <span className="text-lg text-slate-400 font-bold">خطوة</span></p>
          <p className="text-lg font-bold text-slate-700 dark:text-slate-200">النشاط اليومي</p>
        </div>

        {/* Calories */}
        <div className="rounded-[2rem] border border-slate-200/50 dark:border-white/5 bg-white dark:bg-white/5 p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
              <Flame className="w-6 h-6 text-orange-500" />
            </div>
          </div>
          <p className="text-5xl font-black text-slate-900 dark:text-white mb-2">{vitals.calories.toLocaleString()} <span className="text-lg text-slate-400 font-bold">kcal</span></p>
          <p className="text-lg font-bold text-slate-700 dark:text-slate-200">الحرق الإجمالي</p>
        </div>

        {/* Global Extensions: SpO2 */}
        <div className="rounded-[2rem] border border-slate-200/50 dark:border-white/5 bg-white dark:bg-white/5 p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-900/20 flex items-center justify-center">
              <Activity className="w-6 h-6 text-cyan-500" />
            </div>
            <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20 px-3 py-1 rounded-full">{vitals.spO2 >= 95 ? 'صحي' : 'منخفض'}</span>
          </div>
          <p className="text-5xl font-black text-slate-900 dark:text-white mb-2">{vitals.spO2}% <span className="text-lg text-slate-400 font-bold">SpO2</span></p>
          <p className="text-lg font-bold text-slate-700 dark:text-slate-200">أكسجين الدم</p>
        </div>

        {/* Global Extensions: HRV */}
        <div className="rounded-[2rem] border border-slate-200/50 dark:border-white/5 bg-white dark:bg-white/5 p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-purple-500" />
            </div>
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-3 py-1 rounded-full">{vitals.hrv > 50 ? 'تعافي عالي' : 'إجهاد مستمر'}</span>
          </div>
          <p className="text-5xl font-black text-slate-900 dark:text-white mb-2">{vitals.hrv} <span className="text-lg text-slate-400 font-bold">ms</span></p>
          <p className="text-lg font-bold text-slate-700 dark:text-slate-200">تغير معدل النبض (HRV)</p>
        </div>

        {/* Global Extensions: Water Intake */}
        <div className="rounded-[2rem] border border-slate-200/50 dark:border-white/5 bg-white dark:bg-white/5 p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-900/20 flex items-center justify-center">
              <div className="w-6 h-6 text-sky-500 text-center font-black">💧</div>
            </div>
          </div>
          <p className="text-5xl font-black text-slate-900 dark:text-white mb-2">{vitals.water} <span className="text-lg text-slate-400 font-bold">Ltr</span></p>
          <p className="text-lg font-bold text-slate-700 dark:text-slate-200">ترطيب الجسم</p>
        </div>
      </div>

      {/* ── Time Tracking Chart ── */}
      <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-10 mb-6">تتبع التطور (أسبوعي)</h3>
      <div className="rounded-[2rem] border border-slate-200/50 dark:border-white/5 bg-white dark:bg-white/5 p-8 shadow-sm h-96">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={MOCK_TREND_DATA} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorReadiness" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorFatigue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.4} />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 14, fontWeight: 700}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 14, fontWeight: 700}} />
            <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
            <Area type="monotone" dataKey="readiness" name="الجاهزية" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorReadiness)" />
            <Area type="monotone" dataKey="fatigue" name="الإجهاد" stroke="#f43f5e" strokeWidth={4} fillOpacity={1} fill="url(#colorFatigue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Maintain older Wellbeing indicators if useful */}
      <div className="mt-10">
        <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-6">المؤشرات الأكاديمية / النفسية</h3>
        <div className="rounded-3xl border border-teal-100 dark:border-teal-900/30 bg-teal-50/50 dark:bg-teal-900/10 backdrop-blur-md p-6 shadow-sm overflow-hidden">
          <StudentWellBeingIndicators />
        </div>
      </div>

      {/* ── Modals ── */}
      <AnimatePresence>
        {/* Connect Watch Modal */}
        {showConnectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !isConnecting && setShowConnectModal(false)} />
            <motion.div initial={{scale:0.95, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.95, opacity:0}} className="relative z-10 w-full max-w-lg bg-white dark:bg-[#0f172a] rounded-[2rem] shadow-2xl overflow-hidden p-8">
              <button onClick={() => !isConnecting && setShowConnectModal(false)} className="absolute top-6 left-6 text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
              
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Watch className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <h2 className="text-2xl font-black text-center text-slate-800 dark:text-white mb-2">ربط الساعة الذكية</h2>
              <p className="text-center text-slate-500 font-bold mb-8">اختر مزود الخدمة لمزامنة بياناتك الفسيولوجية تلقائياً واكتشاف أفضل أوقات التدريب.</p>
              
              {isConnecting ? (
                <div className="flex flex-col items-center py-10">
                  <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
                  <p className="font-bold text-slate-600 dark:text-slate-300">جاري الاتصال واكتشاف البيانات...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {WATCH_PROVIDERS.map(provider => (
                    <button key={provider.id} onClick={handleConnectWatch} className={cn("w-full py-4 rounded-xl font-black text-lg transition-transform hover:scale-[1.02]", provider.color)}>
                      {provider.name}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* Manual Input Modal */}
        {showManualModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowManualModal(false)} />
            <motion.div initial={{scale:0.95, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.95, opacity:0}} className="relative z-10 w-full max-w-md bg-white dark:bg-[#0f172a] rounded-[2rem] shadow-2xl overflow-hidden p-8">
              <button onClick={() => setShowManualModal(false)} className="absolute top-6 left-6 text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
              
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <Smartphone className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <h2 className="text-2xl font-black text-center text-slate-800 dark:text-white mb-2">تسجيل البيانات يدوياً</h2>
              <p className="text-center text-slate-500 font-bold mb-6">أدخل بيانات اليوم لتسمح للمدرب الذكي بتقييم حالتك.</p>
              
              <form onSubmit={handleManualSave} className="space-y-5">
                <div>
                  <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-2">ساعات النوم 😴</label>
                  <input type="number" step="0.5" name="sleep" defaultValue={vitals.sleep} className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-xl p-4 text-xl font-black text-slate-900 dark:text-white focus:ring-2 ring-indigo-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-2">النبض ❤️</label>
                    <input type="number" name="hr" defaultValue={vitals.hr} className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-xl p-4 text-xl font-black text-slate-900 dark:text-white focus:ring-2 ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-2">الخطوات 👟</label>
                    <input type="number" name="steps" defaultValue={vitals.steps} className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-xl p-4 text-xl font-black text-slate-900 dark:text-white focus:ring-2 ring-indigo-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-2">الماء (لتر) 💧</label>
                    <input type="number" step="0.1" name="water" defaultValue={vitals.water} className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-xl p-4 text-xl font-black text-slate-900 dark:text-white focus:ring-2 ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-2">الوزن (كج) ⚖️</label>
                    <input type="number" step="0.1" name="weight" defaultValue={vitals.weight} className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-xl p-4 text-xl font-black text-slate-900 dark:text-white focus:ring-2 ring-indigo-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-2">مستوى التوتر (1-10) 🧠</label>
                  <input type="number" min="1" max="10" name="stress" defaultValue={vitals.stress} className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-xl p-4 text-xl font-black text-slate-900 dark:text-white focus:ring-2 ring-indigo-500" />
                </div>
                
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-xl mt-4 shadow-lg shadow-indigo-500/20 transition-all">
                  حفظ وتحديث المحرك الذكي
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
