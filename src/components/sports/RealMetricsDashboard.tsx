import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Simple, visual, Arabic-first Vital Metrics Dashboard
// No technical jargon — designed like Fitbit/Apple Health simplified

const tips = {
  great: { label: 'ممتاز', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  good: { label: 'جيد', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  avg: { label: 'متوسط', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  low: { label: 'يحتاج تحسين', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
};

interface MetricCard {
  emoji: string;
  title: string;
  value: string;
  unit: string;
  desc: string;
  tip: string;
  status: keyof typeof tips;
  pct: number;
  color: string;
}

const metrics: MetricCard[] = [
  {
    emoji: '❤️',
    title: 'نبضات القلب',
    value: '72',
    unit: 'نبضة/دقيقة',
    desc: 'معدلك أثناء الراحة',
    tip: 'المعدل الطبيعي: 60-100 نبضة. كلما كان أقل، كان قلبك أكثر لياقة.',
    status: 'great',
    pct: 72,
    color: '#ef4444',
  },
  {
    emoji: '👟',
    title: 'خطوات اليوم',
    value: '7,240',
    unit: 'خطوة',
    desc: 'الهدف اليومي: 10,000 خطوة',
    tip: 'أنت وصلت 72% من هدفك! مشي 15 دقيقة إضافية سيكملك.',
    status: 'good',
    pct: 72,
    color: '#3b82f6',
  },
  {
    emoji: '🔥',
    title: 'السعرات المحروقة',
    value: '480',
    unit: 'سعرة حرارية',
    desc: 'منذ الاستيقاظ حتى الآن',
    tip: 'جلسة تدريب 30 دقيقة تحرق 200-400 سعرة إضافية.',
    status: 'good',
    pct: 64,
    color: '#f97316',
  },
  {
    emoji: '😴',
    title: 'نوم البارحة',
    value: '6.5',
    unit: 'ساعة',
    desc: 'الموصى به: 7-9 ساعات',
    tip: 'تحتاج نصف ساعة إضافية. حاول النوم مبكراً بـ 30 دقيقة الليلة.',
    status: 'avg',
    pct: 72,
    color: '#8b5cf6',
  },
  {
    emoji: '💧',
    title: 'الترطيب',
    value: '1.2',
    unit: 'لتر',
    desc: 'الهدف: 2.5-3 لتر يومياً',
    tip: 'اشرب كوب ماء كل ساعة. جسمك يحتاج سوائل أكثر أثناء التدريب.',
    status: 'low',
    pct: 40,
    color: '#06b6d4',
  },
  {
    emoji: '🫁',
    title: 'مستوى الأكسجين',
    value: '98',
    unit: '%',
    desc: 'مستوى SpO2 في الدم',
    tip: 'مستوى طبيعي ممتاز. 95% فأكثر يُعتبر صحياً.',
    status: 'great',
    pct: 98,
    color: '#22c55e',
  },
];

const weeklyData = [
  { day: 'الأح', steps: 8200, sleep: 7.5, cal: 520 },
  { day: 'الاث', steps: 5400, sleep: 6, cal: 380 },
  { day: 'الثل', steps: 9300, sleep: 8, cal: 640 },
  { day: 'الأر', steps: 6100, sleep: 7, cal: 420 },
  { day: 'الخم', steps: 10200, sleep: 7.5, cal: 710 },
  { day: 'الجم', steps: 4800, sleep: 9, cal: 310 },
  { day: 'السب', steps: 7240, sleep: 6.5, cal: 480 },
];
const maxSteps = 11000;

export default function RealMetricsDashboard() {
  const [selectedMetric, setSelectedMetric] = useState<MetricCard | null>(null);
  const [activeView, setActiveView] = useState<'today' | 'week'>('today');

  return (
    <div className="space-y-5 pb-20 lg:pb-0 animate-in fade-in zoom-in-95 duration-500" dir="rtl">
      {/* Header */}
      <div className="bg-slate-900 rounded-[2rem] p-5 relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
        <div className="relative z-10">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">مراقبة صحتك اليومية</p>
          <h2 className="text-2xl font-black text-white">المقاييس الحيوية</h2>
          <p className="text-slate-400 text-sm mt-1">أرقام واضحة بدون تعقيد — صحتك في لمحة</p>
          <div className="flex gap-2 mt-4">
            {(['today', 'week'] as const).map(v => (
              <button
                key={v}
                onClick={() => setActiveView(v)}
                className={cn(
                  'px-4 py-2 rounded-xl font-black text-xs transition-colors',
                  activeView === v ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                )}
              >
                {v === 'today' ? '📅 اليوم' : '📊 هذا الأسبوع'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeView === 'today' ? (
        <>
          {/* Overall Score */}
          <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-5">
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="32" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                  <motion.circle
                    cx="40" cy="40" r="32" fill="none"
                    stroke="#22c55e" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 32}
                    strokeDashoffset={2 * Math.PI * 32}
                    animate={{ strokeDashoffset: 2 * Math.PI * 32 * (1 - 0.74) }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-black text-slate-900">74%</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="font-black text-slate-900 text-lg">حالتك الصحية اليوم</p>
                <p className="text-slate-500 text-sm font-medium">معظم مؤشراتك إيجابية — استمر! 🎉</p>
                <div className="flex gap-3 mt-2">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">3 مؤشرات ممتازة</span>
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg">2 تحتاج انتباه</span>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {metrics.map((m, i) => {
              const t = tips[m.status];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => setSelectedMetric(selectedMetric?.title === m.title ? null : m)}
                  className={cn('bg-white rounded-[1.5rem] border shadow-sm p-4 cursor-pointer hover:shadow-md transition-all', t.border)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-11 h-11 ${t.bg} rounded-2xl flex items-center justify-center text-2xl`}>{m.emoji}</div>
                    <div className="flex-1">
                      <h4 className="font-black text-slate-900 text-sm">{m.title}</h4>
                      <p className="text-slate-400 text-[10px] font-bold">{m.desc}</p>
                    </div>
                    <div className="text-left">
                      <p className={`font-black text-xl leading-none ${t.color}`}>{m.value}</p>
                      <p className="text-slate-400 text-[9px] font-bold">{m.unit}</p>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${m.pct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.06 }}
                      style={{ backgroundColor: m.color }}
                      className="h-full rounded-full"
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${t.bg} ${t.color}`}>{t.label}</span>
                    {selectedMetric?.title === m.title ? (
                      <span className="text-[10px] font-bold text-slate-400">اخفِ النصيحة ▲</span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400">اعرف أكثر ▼</span>
                    )}
                  </div>
                  {selectedMetric?.title === m.title && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 bg-slate-50 rounded-2xl p-3 border border-slate-100"
                    >
                      <p className="text-slate-700 text-xs font-bold leading-relaxed">💡 {m.tip}</p>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Quick tips row */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-[1.5rem] border border-orange-200 p-4">
            <h3 className="font-black text-slate-900 text-sm mb-3">🎯 نصائح اليوم</h3>
            <div className="space-y-2">
              {[
                { icon: '💧', text: 'اشرب كوباً من الماء الآن — أنت تحتاج ترطيباً أكثر اليوم' },
                { icon: '🚶', text: 'مشي 20 دقيقة ستكمل هدف خطواتك اليومي' },
                { icon: '🌙', text: 'حاول النوم قبل الساعة 11 الليلة لتحسين نومك' },
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-base shrink-0">{tip.icon}</span>
                  <p className="text-slate-700 text-xs font-bold">{tip.text}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Weekly View */
        <div className="space-y-4">
          <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-5">
            <h3 className="font-black text-slate-900 text-sm mb-4 flex items-center gap-2">
              👟 الخطوات اليومية (الأسبوع)
            </h3>
            <div className="flex items-end justify-between gap-2 h-28">
              {weeklyData.map((d, i) => {
                const pct = Math.round((d.steps / maxSteps) * 100);
                const isToday = i === 6;
                return (
                  <div key={i} className="flex flex-col items-center flex-1 gap-1">
                    <span className="text-[9px] font-black text-slate-400">{(d.steps / 1000).toFixed(1)}k</span>
                    <div className="w-full bg-slate-100 rounded-xl overflow-hidden flex flex-col-reverse" style={{ height: '72px' }}>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${pct}%` }}
                        transition={{ duration: 0.5, delay: i * 0.05 }}
                        className={cn('rounded-xl', isToday ? 'bg-orange-500' : 'bg-blue-400')}
                      />
                    </div>
                    <span className={cn('text-[10px] font-black', isToday ? 'text-orange-600' : 'text-slate-400')}>{d.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'متوسط النوم', val: '7.2 ساعة', emoji: '😴', status: 'جيد جداً' },
              { label: 'متوسط السعرات', val: '494 سعرة', emoji: '🔥', status: 'ضمن الهدف' },
              { label: 'أفضل يوم', val: 'الخميس', emoji: '🏆', status: '10,200 خطوة' },
              { label: 'أيام نشاط', val: '5/7 أيام', emoji: '📅', status: 'ممتاز' },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-4 text-center">
                <span className="text-2xl">{s.emoji}</span>
                <p className="font-black text-slate-900 text-base mt-1">{s.val}</p>
                <p className="text-slate-400 text-[10px] font-bold">{s.label}</p>
                <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg mt-1 inline-block">{s.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}