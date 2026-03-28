import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Zap, Shield, Activity, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatItem {
  id: string;
  label: string;
  value: number;
  unit: string;
  trend: number; // percentage change
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  gradientFrom: string;
  gradientTo: string;
}

const defaultStats: StatItem[] = [
  {
    id: 'speed',
    label: 'السرعة',
    value: 82,
    unit: 'نقطة',
    trend: 3.2,
    icon: Zap,
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/15',
    borderColor: 'border-yellow-200 dark:border-yellow-800/30',
    gradientFrom: '#f59e0b',
    gradientTo: '#f97316',
  },
  {
    id: 'balance',
    label: 'التوازن',
    value: 71,
    unit: 'نقطة',
    trend: 1.1,
    icon: Shield,
    color: 'text-cyan-600 dark:text-cyan-400',
    bgColor: 'bg-cyan-50 dark:bg-cyan-900/15',
    borderColor: 'border-cyan-200 dark:border-cyan-800/30',
    gradientFrom: '#06b6d4',
    gradientTo: '#14b8a6',
  },
  {
    id: 'agility',
    label: 'الرشاقة',
    value: 89,
    unit: 'نقطة',
    trend: 5.7,
    icon: Activity,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-900/15',
    borderColor: 'border-blue-200 dark:border-blue-800/30',
    gradientFrom: '#3b82f6',
    gradientTo: '#6366f1',
  },
  {
    id: 'focus',
    label: 'التركيز',
    value: 76,
    unit: 'نقطة',
    trend: 2.3,
    icon: Brain,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-900/15',
    borderColor: 'border-purple-200 dark:border-purple-800/30',
    gradientFrom: '#8b5cf6',
    gradientTo: '#ec4899',
  },
];

function MiniBar({ value, gradientFrom, gradientTo }: { value: number; gradientFrom: string; gradientTo: string }) {
  return (
    <div className="relative h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden mt-3">
      <motion.div
        className="absolute inset-y-0 right-0 h-full rounded-full"
        style={{ background: `linear-gradient(to left, ${gradientFrom}, ${gradientTo})` }}
        initial={{ width: '0%' }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
      />
    </div>
  );
}

interface Props {
  stats?: StatItem[];
  loading?: boolean;
}

export function MiniPerformanceStats({ stats = defaultStats, loading = false }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-28 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">مؤشرات الأداء الرئيسية</h3>
        <span className="text-xs text-slate-400 font-medium">مقاسة من البصمة الحركية</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className={cn(
              'rounded-2xl border p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-default',
              stat.bgColor,
              stat.borderColor
            )}
          >
            {/* Icon + trend */}
            <div className="flex items-center justify-between mb-2">
              <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center bg-white dark:bg-black/20 shadow-sm')}>
                <stat.icon className={cn('w-4.5 h-4.5', stat.color)} style={{ width: '18px', height: '18px' }} />
              </div>
              <div className={cn(
                'flex items-center gap-0.5 text-[10px] font-bold rounded-full px-2 py-0.5',
                stat.trend > 0
                  ? 'text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/30'
                  : 'text-rose-700 bg-rose-100 dark:text-rose-300 dark:bg-rose-900/30'
              )}>
                {stat.trend > 0
                  ? <TrendingUp className="w-2.5 h-2.5" />
                  : <TrendingDown className="w-2.5 h-2.5" />}
                {stat.trend > 0 ? '+' : ''}{stat.trend}%
              </div>
            </div>

            {/* Value */}
            <div className="mt-1">
              <p className={cn('text-2xl font-black', stat.color)}>{stat.value}</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">{stat.unit}</p>
            </div>

            {/* Label */}
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-1">{stat.label}</p>

            {/* Mini bar */}
            <MiniBar value={stat.value} gradientFrom={stat.gradientFrom} gradientTo={stat.gradientTo} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
