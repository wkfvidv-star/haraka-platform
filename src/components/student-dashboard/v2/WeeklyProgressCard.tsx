import React from 'react';
import { motion } from 'framer-motion';
import { Flame, CheckCircle2, Circle, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DayStatus {
  label: string;
  completed: boolean;
  isToday: boolean;
  minutes: number;
}

interface Props {
  streak?: number;
  weeklyGoal?: number;
  completedDays?: number;
  weekDays?: DayStatus[];
  loading?: boolean;
}

const defaultDays: DayStatus[] = (() => {
  const today = new Date().getDay(); // 0=Sun
  const labels = ['أح', 'إث', 'ثل', 'أر', 'خم', 'جم', 'سب'];
  return labels.map((label, i) => ({
    label,
    completed: i < today,
    isToday: i === today,
    minutes: i < today ? [30, 45, 25, 50, 40, 35, 20][i] : 0,
  }));
})();

export function WeeklyProgressCard({
  streak = 5,
  weeklyGoal = 5,
  completedDays = 3,
  weekDays = defaultDays,
  loading = false,
}: Props) {
  const pct = Math.round((completedDays / weeklyGoal) * 100);

  if (loading) {
    return <div className="h-48 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />;
  }

  return (
    <div className="rounded-3xl border border-slate-200/50 dark:border-white/5 bg-white dark:bg-white/5 backdrop-blur-md p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">التقدم الأسبوعي</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {completedDays} من أصل {weeklyGoal} أيام مكتملة
          </p>
        </div>
        <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200/50 dark:border-orange-700/30 rounded-2xl px-3 py-2">
          <Flame className="w-4 h-4 text-orange-500" />
          <div>
            <p className="text-base font-black text-orange-600 dark:text-orange-400 leading-none">{streak}</p>
            <p className="text-[10px] text-orange-400/70 font-semibold leading-none mt-0.5">يوم متتالي</p>
          </div>
        </div>
      </div>

      {/* Day circles */}
      <div className="flex items-end justify-between gap-1 mb-5">
        {weekDays.map((day, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
            {/* Activity bar */}
            <div className="relative w-full h-10 bg-slate-100 dark:bg-white/5 rounded-lg overflow-hidden">
              {day.completed && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-indigo-400 rounded-lg"
                  initial={{ height: '0%' }}
                  animate={{ height: `${Math.min(100, (day.minutes / 60) * 100)}%` }}
                  transition={{ duration: 0.8, delay: i * 0.07, ease: 'easeOut' }}
                />
              )}
              {day.isToday && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-400 rounded" />
              )}
            </div>
            {/* Status icon */}
            <div className={cn(
              'w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all',
              day.completed
                ? 'bg-blue-500 border-blue-500 shadow-sm shadow-blue-500/30'
                : day.isToday
                  ? 'bg-orange-500 border-orange-500 shadow-sm shadow-orange-500/30'
                  : 'bg-transparent border-slate-200 dark:border-white/10'
            )}>
              {day.completed ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-white fill-white" />
              ) : day.isToday ? (
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              ) : (
                <Circle className="w-3 h-3 text-slate-300 dark:text-white/20" />
              )}
            </div>
            {/* Day label */}
            <span className={cn(
              'text-[10px] font-bold',
              day.isToday
                ? 'text-orange-500'
                : day.completed
                  ? 'text-blue-500 dark:text-blue-400'
                  : 'text-slate-400 dark:text-slate-500'
            )}>
              {day.label}
            </span>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">هدف الأسبوع</span>
          <span className="font-black text-blue-600 dark:text-blue-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />{pct}%
          </span>
        </div>
        <div className="relative h-2.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 right-0 h-full rounded-full bg-gradient-to-l from-blue-500 to-indigo-500"
            initial={{ width: '0%' }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
          />
        </div>
      </div>
    </div>
  );
}
