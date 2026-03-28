import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Zap, Clock, Star, BrainCircuit, ChevronRight, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TodayExercise {
  name: string;
  duration: string;
  type: 'warmup' | 'main' | 'cooldown';
  xp: number;
}

interface DailyTrainingData {
  programTitle: string;
  targetDimension: string;
  gradient: string;
  completedToday: number;
  totalToday: number;
  estimatedMinutes: number;
  aiNote: string;
  todayExercises: TodayExercise[];
  totalXP: number;
}

const defaultData: DailyTrainingData = {
  programTitle: 'السرعة والرشاقة',
  targetDimension: 'السرعة · الرشاقة · رد الفعل',
  gradient: 'from-blue-500 via-indigo-500 to-violet-600',
  completedToday: 2,
  totalToday: 5,
  estimatedMinutes: 53,
  aiNote: 'أداؤك رائع! رفعنا شدة التدريب 10% هذا الأسبوع لمواكبة تطورك السريع.',
  todayExercises: [
    { name: 'تسخين ديناميكي', duration: '8 دق', type: 'warmup', xp: 20 },
    { name: 'تمرين T-Test للرشاقة', duration: '15 دق', type: 'main', xp: 50 },
    { name: 'الجري المتقطع 30م', duration: '12 دق', type: 'main', xp: 60 },
    { name: 'تمارين سلم السرعة', duration: '10 دق', type: 'main', xp: 45 },
    { name: 'تهدئة وتمدد', duration: '8 دق', type: 'cooldown', xp: 25 },
  ],
  totalXP: 200,
};

const motivationalMessages = [
  "هل أنت جاهز لكسر رقمك القياسي اليوم؟ 🔥",
  "كل جلسة تدريب تقربك خطوة من هدفك! 💪",
  "التحسن لا يحدث في منطقة الراحة، ابدأ الآن! ⚡",
  "أداؤك في الأسبوع الماضي كان رائعاً، استمر! 🌟",
  "جسمك أقوى مما تظن، هيا نثبت ذلك اليوم! 🎯",
  "النجاح يبدأ بخطوة واحدة — خذها الآن! 🚀",
  "كل تمرين يتركك نسخة أفضل مما كنت عليه أمس.",
];

const todayMsg = motivationalMessages[new Date().getDay() % motivationalMessages.length];

// Circular progress ring
function ProgressRing({ pct, size = 120, stroke = 10, gradient = 'ring-blue' }: {
  pct: number; size?: number; stroke?: number; gradient?: string;
}) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const id = `grad-${gradient}`;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }} className="drop-shadow-lg">
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      {/* Track */}
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="rgba(255,255,255,0.1)" strokeWidth={stroke} />
      {/* Progress */}
      <motion.circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={`url(#${id})`} strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
      />
    </svg>
  );
}

const typeStyle: Record<string, string> = {
  warmup:   'bg-yellow-400/20 text-yellow-300 border-yellow-400/30',
  main:     'bg-blue-400/20 text-blue-300 border-blue-400/30',
  cooldown: 'bg-emerald-400/20 text-emerald-300 border-emerald-400/30',
};

interface Props {
  data?: DailyTrainingData;
  onStartSession?: () => void;
  loading?: boolean;
}

export function DailyTrainingCard({ data = defaultData, onStartSession, loading = false }: Props) {
  const pct = Math.round((data.completedToday / data.totalToday) * 100);
  const [hovered, setHovered] = useState(false);

  if (loading) {
    return (
      <div className="h-64 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className={cn(
        'relative rounded-3xl overflow-hidden shadow-xl',
        `bg-gradient-to-br ${data.gradient}`
      )}
    >
      {/* Animated background texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      <motion.div
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5"
        animate={{ scale: hovered ? 1.1 : 1 }}
        transition={{ duration: 0.6 }}
      />
      <motion.div
        className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/5"
        animate={{ scale: hovered ? 1.2 : 1 }}
        transition={{ duration: 0.8 }}
      />

      <div className="relative z-10 p-6 lg:p-8">
        {/* Top Row: label + AI note */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-3">
              <Flame className="w-3.5 h-3.5 text-orange-300" />
              <span className="text-white/90 text-xs font-bold uppercase tracking-wider">تمرين اليوم</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-white leading-tight">{data.programTitle}</h2>
            <p className="text-white/60 text-sm mt-1">{data.targetDimension}</p>
          </div>
          {/* Circular Progress Ring */}
          <div className="flex-shrink-0 relative">
            <ProgressRing pct={pct} size={110} stroke={9} />
            <div className="absolute inset-0 flex flex-col items-center justify-center"
              style={{ transform: 'rotate(0deg)' }}>
              <span className="text-2xl font-black text-white">{pct}%</span>
              <span className="text-[10px] text-white/60 font-semibold">مكتمل</span>
            </div>
          </div>
        </div>

        {/* AI Note */}
        <div className="flex items-start gap-3 bg-white/10 border border-white/20 rounded-2xl p-4 mb-6">
          <BrainCircuit className="w-5 h-5 text-indigo-300 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[11px] text-white/50 font-bold uppercase tracking-wider mb-0.5">توصية الذكاء الاصطناعي</p>
            <p className="text-white/90 text-sm font-medium leading-relaxed">{data.aiNote}</p>
          </div>
        </div>

        {/* Exercise list */}
        <div className="space-y-2 mb-6">
          {data.todayExercises.slice(0, 4).map((ex, i) => (
            <div key={i} className={cn(
              'flex items-center justify-between rounded-xl px-4 py-2.5 border',
              i < data.completedToday
                ? 'bg-white/20 border-white/30 opacity-70'
                : 'bg-white/10 border-white/15'
            )}>
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black flex-shrink-0',
                  i < data.completedToday
                    ? 'bg-emerald-400 text-white'
                    : 'bg-white/20 text-white/70'
                )}>
                  {i < data.completedToday ? '✓' : i + 1}
                </div>
                <span className={cn('text-sm font-bold', i < data.completedToday ? 'text-white/60 line-through' : 'text-white')}>{ex.name}</span>
                <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border', typeStyle[ex.type])}>
                  {ex.type === 'warmup' ? 'إحماء' : ex.type === 'cooldown' ? 'تهدئة' : 'أساسي'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white/50 text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" />{ex.duration}
                </span>
                <span className="text-yellow-300 text-xs font-bold flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-yellow-300" />+{ex.xp}
                </span>
              </div>
            </div>
          ))}
          {data.todayExercises.length > 4 && (
            <p className="text-center text-white/40 text-xs">
              +{data.todayExercises.length - 4} تمارين أخرى...
            </p>
          )}
        </div>

        {/* Bottom row: stats + CTA */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="text-center">
              <p className="text-xl font-black text-white">{data.estimatedMinutes}</p>
              <p className="text-[11px] text-white/50">دقيقة</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <p className="text-xl font-black text-yellow-300">+{data.totalXP}</p>
              <p className="text-[11px] text-white/50">نقطة XP</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <p className="text-xl font-black text-white">{data.completedToday}/{data.totalToday}</p>
              <p className="text-[11px] text-white/50">تمارين</p>
            </div>
          </div>

          <motion.button
            onClick={onStartSession}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 bg-white text-indigo-700 font-black px-6 py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-sm"
          >
            <Play className="w-4 h-4 fill-indigo-700" />
            ابدأ الآن
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
