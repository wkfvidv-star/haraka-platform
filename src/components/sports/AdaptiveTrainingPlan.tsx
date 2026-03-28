import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

// =====================================================================
// ADAPTIVE TRAINING PLAN — Nike Training Club Style — Full Arabic
// =====================================================================

type Level = 'beginner' | 'intermediate' | 'advanced';
type DayStatus = 'completed' | 'active' | 'rest' | 'upcoming';

interface Exercise {
  id: string;
  name: string;
  sets: string;
  rest: string;
  emoji: string;
  tip: string;
  muscleGroup: string;
}

interface TrainingDay {
  day: string;
  label: string;
  status: DayStatus;
  type: string;
  duration: string;
  exercises: Exercise[];
}

const PLANS = {
  beginner: {
    title: 'خطة المبتدئ',
    subtitle: '4 أسابيع • 3 أيام في الأسبوع',
    desc: 'مثالية إذا بدأت للتو — تدريجية وآمنة ومناسبة لجميع الأعمار.',
    color: 'from-emerald-500 to-teal-600',
    lightBg: 'bg-emerald-50',
    border: 'border-emerald-200',
    textColor: 'text-emerald-700',
  },
  intermediate: {
    title: 'خطة المتوسط',
    subtitle: '6 أسابيع • 4 أيام في الأسبوع',
    desc: 'لمن لديه أساس جيد ويريد الارتقاء بأدائه إلى مستوى أعلى.',
    color: 'from-blue-500 to-indigo-600',
    lightBg: 'bg-blue-50',
    border: 'border-blue-200',
    textColor: 'text-blue-700',
  },
  advanced: {
    title: 'خطة المتقدم',
    subtitle: '8 أسابيع • 5 أيام في الأسبوع',
    desc: 'للرياضيين الجادين — شدة عالية، تنوع كبير، نتائج سريعة.',
    color: 'from-orange-500 to-rose-600',
    lightBg: 'bg-orange-50',
    border: 'border-orange-200',
    textColor: 'text-orange-700',
  },
};

const WEEK_SCHEDULE: TrainingDay[] = [
  {
    day: 'الأح',
    label: 'الأحد',
    status: 'completed',
    type: 'قوة الجزء العلوي',
    duration: '45 دقيقة',
    exercises: [
      { id: 'e1', name: 'ضغط (Push-Up)', sets: '3 × 12 عدة', rest: '45 ثانية', emoji: '💪', tip: 'اجعل جسمك مستقيماً تماماً من الكعب للرأس', muscleGroup: 'الصدر والكتف' },
      { id: 'e2', name: 'شد للأعلى (Pull-Up)', sets: '3 × 8 عدة', rest: '60 ثانية', emoji: '🏋️', tip: 'ابدأ من وضع ذراعين مستقيمتين بالكامل', muscleGroup: 'الظهر والذراعين' },
      { id: 'e3', name: 'بلانك (Plank)', sets: '3 × 40 ثانية', rest: '30 ثانية', emoji: '🔥', tip: 'شد بطنك للداخل وابقَ ساكناً', muscleGroup: 'الجذع والبطن' },
    ],
  },
  {
    day: 'الاث',
    label: 'الاثنين',
    status: 'active',
    type: 'قوة الجزء السفلي',
    duration: '50 دقيقة',
    exercises: [
      { id: 'e4', name: 'قرفصاء (Squat)', sets: '4 × 15 عدة', rest: '60 ثانية', emoji: '🦵', tip: 'ركبتاك يجب أن تكونا فوق أصابع قدميك — لا تجاوزهما', muscleGroup: 'الفخذ والمؤخرة' },
      { id: 'e5', name: 'طعنة (Lunge)', sets: '3 × 12 عدة لكل ساق', rest: '45 ثانية', emoji: '⚡', tip: 'ظهرك منتصب — خطوة واسعة للأمام', muscleGroup: 'الفخذ والساق' },
      { id: 'e6', name: 'جسر الأرداف (Glute Bridge)', sets: '3 × 20 عدة', rest: '30 ثانية', emoji: '🌉', tip: 'ارفع الوركين واضغط العضلة في الذروة لثانيتين', muscleGroup: 'المؤخرة والجذع' },
    ],
  },
  {
    day: 'الثل',
    label: 'الثلاثاء',
    status: 'rest',
    type: 'يوم راحة + إطالة',
    duration: '20 دقيقة',
    exercises: [
      { id: 'e7', name: 'تمدد الصدر', sets: '3 × 30 ثانية', rest: 'بدون', emoji: '🤸', tip: 'تنفس بعمق أثناء التمدد', muscleGroup: 'الصدر والكتف' },
      { id: 'e8', name: 'تدوير الكتف', sets: '2 × 20 دورة', rest: 'بدون', emoji: '🌀', tip: 'دوّر ببطء باتجاهين متعاكسين', muscleGroup: 'الكتف' },
    ],
  },
  {
    day: 'الأر',
    label: 'الأربعاء',
    status: 'upcoming',
    type: 'كارديو وتحمل',
    duration: '40 دقيقة',
    exercises: [
      { id: 'e9', name: 'قفز (Jumping Jacks)', sets: '4 × 30 عدة', rest: '20 ثانية', emoji: '🎉', tip: 'ابدأ ببطء وزد السرعة تدريجياً', muscleGroup: 'كامل الجسم' },
      { id: 'e10', name: 'تسلق الجبل (Mountain Climber)', sets: '3 × 20 عدة', rest: '30 ثانية', emoji: '⛰️', tip: 'جسمك مستقيم — ساقيك بسرعة', muscleGroup: 'البطن والجذع' },
      { id: 'e11', name: 'برباس (Burpee)', sets: '3 × 10 عدة', rest: '60 ثانية', emoji: '💥', tip: 'الحركة المتكاملة: قرفصاء → ضغط → قفز', muscleGroup: 'كامل الجسم' },
    ],
  },
  { day: 'الخم', label: 'الخميس', status: 'upcoming', type: 'تطوير القوة', duration: '55 دقيقة', exercises: [] },
  { day: 'الجم', label: 'الجمعة', status: 'upcoming', type: 'كارديو خفيف', duration: '35 دقيقة', exercises: [] },
  { day: 'السب', label: 'السبت', status: 'rest', type: 'يوم راحة كامل', duration: 'راحة', exercises: [] },
];

const statusConfig = {
  completed: { label: 'مكتمل ✓', bg: 'bg-emerald-500', text: 'text-white', ring: 'ring-emerald-200' },
  active: { label: 'اليوم', bg: 'bg-orange-500', text: 'text-white', ring: 'ring-orange-200' },
  rest: { label: 'راحة', bg: 'bg-slate-200', text: 'text-slate-600', ring: 'ring-slate-100' },
  upcoming: { label: 'قادم', bg: 'bg-slate-100', text: 'text-slate-500', ring: 'ring-slate-100' },
};

export const AdaptiveTrainingPlan: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<Level | null>('intermediate');
  const [activeDay, setActiveDay] = useState<TrainingDay | null>(WEEK_SCHEDULE[1]); // Monday = active
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [expandedTip, setExpandedTip] = useState<string | null>(null);

  const toggleExercise = (id: string) => {
    setCompletedExercises(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const plan = selectedLevel ? PLANS[selectedLevel] : null;
  const allDone = activeDay?.exercises.every(e => completedExercises.has(e.id));
  const donePct = activeDay?.exercises.length
    ? Math.round((activeDay.exercises.filter(e => completedExercises.has(e.id)).length / activeDay.exercises.length) * 100)
    : 0;

  return (
    <div className="space-y-5 pb-20 lg:pb-0 animate-in fade-in zoom-in-95 duration-500" dir="rtl">

      {/* Header */}
      <div className="bg-slate-900 rounded-[2rem] p-6 relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
        <div className="relative z-10">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">مدرّبك الذكي جهّز لك</p>
          <h2 className="text-2xl font-black text-white mb-1">خطتي التدريبية</h2>
          <p className="text-slate-400 text-sm">تتكيف مع مستواك تلقائياً — جلسة نظيفة كل أسبوع</p>
        </div>
      </div>

      {/* Level Selector */}
      <div>
        <h3 className="font-black text-slate-900 text-sm mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-orange-500 rounded-full" /> اختر مستواك
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {(Object.entries(PLANS) as [Level, typeof PLANS.beginner][]).map(([key, p]) => (
            <button
              key={key}
              onClick={() => setSelectedLevel(key)}
              className={cn(
                'rounded-[1.25rem] p-3 border-2 text-center transition-all',
                selectedLevel === key
                  ? `bg-gradient-to-br ${p.color} text-white border-transparent shadow-lg`
                  : `bg-white ${p.border} hover:${p.lightBg}`
              )}
            >
              <p className={cn('font-black text-sm', selectedLevel === key ? 'text-white' : p.textColor)}>{p.title}</p>
              <p className={cn('text-[10px] font-bold mt-0.5', selectedLevel === key ? 'text-white/80' : 'text-slate-400')}>
                {p.subtitle.split('•')[0].trim()}
              </p>
            </button>
          ))}
        </div>
        {plan && (
          <div className={`mt-3 ${plan.lightBg} rounded-2xl px-4 py-3 border ${plan.border}`}>
            <p className={`text-xs font-bold ${plan.textColor}`}>{plan.desc}</p>
          </div>
        )}
      </div>

      {/* Weekly Overview — Day Pills */}
      <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-black text-slate-900 text-sm">أيام الأسبوع</h3>
          <span className="text-xs font-bold text-slate-400">الأسبوع 2 من 6</span>
        </div>
        <div className="flex gap-2">
          {WEEK_SCHEDULE.map((d, i) => {
            const cfg = statusConfig[d.status];
            const isSelected = activeDay?.day === d.day;
            return (
              <button
                key={i}
                onClick={() => d.exercises.length > 0 ? setActiveDay(d) : null}
                className={cn(
                  'flex-1 flex flex-col items-center py-2 rounded-2xl transition-all',
                  isSelected ? 'ring-2 ring-offset-1 scale-105 ' + cfg.ring : '',
                  d.exercises.length === 0 ? 'opacity-50 cursor-default' : 'cursor-pointer hover:scale-105'
                )}
              >
                <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black mb-1', cfg.bg, cfg.text)}>
                  {d.day === 'الثل' || d.day === 'السب' ? '😴' : d.status === 'completed' ? '✓' : d.day}
                </div>
                <span className="text-[9px] font-bold text-slate-400">{cfg.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Day Detail */}
      <AnimatePresence mode="wait">
        {activeDay && (
          <motion.div
            key={activeDay.day}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {/* Day Header */}
            <div className={cn(
              'rounded-[1.5rem] p-5 mb-4',
              activeDay.status === 'active' ? 'bg-orange-500' : activeDay.status === 'completed' ? 'bg-emerald-500' : 'bg-slate-700'
            )}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-xs font-bold">{activeDay.label}</p>
                  <h3 className="font-black text-white text-lg">{activeDay.type}</h3>
                  <p className="text-white/80 text-xs font-bold">⏱️ {activeDay.duration}</p>
                </div>
                {activeDay.exercises.length > 0 && (
                  <div className="relative w-14 h-14">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
                      <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="5" />
                      <motion.circle
                        cx="28" cy="28" r="22" fill="none"
                        stroke="white" strokeWidth="5" strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 22}
                        strokeDashoffset={2 * Math.PI * 22}
                        animate={{ strokeDashoffset: 2 * Math.PI * 22 * (1 - donePct / 100) }}
                        transition={{ duration: 0.5 }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white font-black text-xs">{donePct}%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Exercises */}
            {activeDay.exercises.length > 0 ? (
              <div className="space-y-3">
                {activeDay.exercises.map((ex, i) => {
                  const done = completedExercises.has(ex.id);
                  const tipOpen = expandedTip === ex.id;
                  return (
                    <div key={ex.id} className={cn('bg-white rounded-[1.5rem] border shadow-sm overflow-hidden transition-all', done ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-100')}>
                      <div className="flex items-center gap-3 p-4">
                        <button
                          onClick={() => toggleExercise(ex.id)}
                          className={cn(
                            'w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 text-2xl transition-all',
                            done ? 'bg-emerald-500' : 'bg-slate-100 hover:bg-orange-50'
                          )}
                        >
                          {done ? <CheckCircle2 className="w-5 h-5 text-white" /> : ex.emoji}
                        </button>
                        <div className="flex-1">
                          <h4 className={cn('font-black text-sm', done ? 'text-emerald-700 line-through decoration-emerald-400' : 'text-slate-900')}>
                            {ex.name}
                          </h4>
                          <p className="text-slate-400 text-[10px] font-bold">{ex.muscleGroup}</p>
                          <div className="flex gap-2 mt-1">
                            <span className="text-[10px] font-black bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg">{ex.sets}</span>
                            <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg">راحة {ex.rest}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => setExpandedTip(tipOpen ? null : ex.id)}
                          className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-orange-50 hover:text-orange-500 transition-colors shrink-0"
                        >
                          {tipOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                      <AnimatePresence>
                        {tipOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-slate-100 bg-amber-50 px-4 py-3 flex items-start gap-2"
                          >
                            <span className="text-base shrink-0">💡</span>
                            <p className="text-amber-800 text-xs font-bold leading-relaxed">{ex.tip}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}

                {/* Complete Session Button */}
                <button
                  onClick={() => {
                    activeDay.exercises.forEach(e => setCompletedExercises(prev => new Set([...prev, e.id])));
                  }}
                  className={cn(
                    'w-full py-4 rounded-2xl font-black text-sm transition-all',
                    allDone
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                      : 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/30'
                  )}
                >
                  {allDone ? '🏆 أكملت جلسة اليوم! — رائع!' : '✓ أنهيت الجلسة كاملة'}
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-8 text-center">
                <span className="text-4xl">😴</span>
                <p className="font-black text-slate-700 mt-3">يوم راحة</p>
                <p className="text-slate-400 text-sm font-medium mt-1">استرح واشرب ماءً كافياً — جسمك يبني العضلات أثناء الراحة!</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Week Progress Bar */}
      <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-black text-slate-900 text-sm">تقدم الأسبوع الحالي</span>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">1/4 جلسات ✓</span>
        </div>
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '25%' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full"
          />
        </div>
        <p className="text-slate-400 text-[10px] font-bold mt-1.5">3 جلسات متبقية هذا الأسبوع</p>
      </div>
    </div>
  );
};

export default AdaptiveTrainingPlan;