import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Shield, Activity, Target, Timer, Dumbbell, Brain,
  TrendingUp, TrendingDown, Minus, Info, Lightbulb, Award,
  Users, ChevronDown, ChevronUp, Fingerprint
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MotorProfileRadar } from './MotorProfileRadar';

// ─── Types ───────────────────────────────────────
interface PerformanceDimension {
  id: string;
  label: string;
  labelEn: string;
  score: number;
  ageAvg: number;
  percentile: number;
  trend: number;
  icon: React.ElementType;
  color: string;
  gradient: string;
  bgColor: string;
  borderColor: string;
  description: string;
  weaknessHint?: string;
}

interface Recommendation {
  id: string;
  dimension: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  icon: React.ElementType;
  color: string;
}

// ─── Data ────────────────────────────────────────
const dimensions: PerformanceDimension[] = [
  {
    id: 'speed', label: 'السرعة', labelEn: 'Speed', score: 82, ageAvg: 70, percentile: 78, trend: 3.2,
    icon: Zap, color: 'text-yellow-600 dark:text-yellow-400', gradient: 'from-yellow-400 to-orange-500',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/15', borderColor: 'border-yellow-200 dark:border-yellow-700/30',
    description: 'القدرة على تحريك الجسم بسرعة قصوى وكفاءة عالية واستجابة فورية.',
  },
  {
    id: 'balance', label: 'التوازن', labelEn: 'Balance', score: 71, ageAvg: 68, percentile: 65, trend: 1.1,
    icon: Shield, color: 'text-cyan-600 dark:text-cyan-400', gradient: 'from-cyan-400 to-teal-500',
    bgColor: 'bg-cyan-50 dark:bg-cyan-900/15', borderColor: 'border-cyan-200 dark:border-cyan-700/30',
    description: 'الحفاظ على استقرار الجسم في أوضاع متحركة وثابتة متغيرة.',
  },
  {
    id: 'agility', label: 'الرشاقة', labelEn: 'Agility', score: 89, ageAvg: 72, percentile: 91, trend: 5.7,
    icon: Activity, color: 'text-blue-600 dark:text-blue-400', gradient: 'from-blue-400 to-indigo-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/15', borderColor: 'border-blue-200 dark:border-blue-700/30',
    description: 'القدرة على التغيير السريع للاتجاه مع الحفاظ على السيطرة والتوازن.',
  },
  {
    id: 'coordination', label: 'التوافق الحركي', labelEn: 'Coordination', score: 68, ageAvg: 71, percentile: 60, trend: -0.5,
    icon: Target, color: 'text-purple-600 dark:text-purple-400', gradient: 'from-purple-400 to-violet-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/15', borderColor: 'border-purple-200 dark:border-purple-700/30',
    description: 'تناسق حركة الأطراف وانسجامها لتحقيق أداء سلس ومتوازن.',
    weaknessHint: 'يُعدّ التوافق الحركي من نقاط التطوير — نوصي بتمارين سلمية ويدوية.',
  },
  {
    id: 'cognitive', label: 'الإدراك الحركي', labelEn: 'Cognitive', score: 76, ageAvg: 69, percentile: 72, trend: 2.3,
    icon: Brain, color: 'text-rose-600 dark:text-rose-400', gradient: 'from-rose-400 to-pink-500',
    bgColor: 'bg-rose-50 dark:bg-rose-900/15', borderColor: 'border-rose-200 dark:border-rose-700/30',
    description: 'القدرة على اتخاذ قرارات حركية سريعة والاستجابة للمثيرات البيئية.',
  },
  {
    id: 'psychological', label: 'الحالة النفسية', labelEn: 'Psychological', score: 84, ageAvg: 75, percentile: 80, trend: 1.5,
    icon: Dumbbell, color: 'text-emerald-600 dark:text-emerald-400', gradient: 'from-emerald-400 to-green-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-900/15', borderColor: 'border-emerald-200 dark:border-emerald-700/30',
    description: 'مستوى الدافعية والحالة النفسية المرتبطة بالنشاط البدني والأداء الرياضي.',
  },
];

const recommendations: Recommendation[] = [
  {
    id: 'coord-rec',
    dimension: 'التوافق الحركي',
    title: 'تمارين التوافق باليدين والقدمين',
    description: 'افعل تمارين الدريبلينج بالكرة والسلم الحركي 3 مرات أسبوعياً لتحسين التوافق.',
    priority: 'high',
    icon: Target,
    color: 'text-purple-600 dark:text-purple-400',
  },
  {
    id: 'balance-rec',
    dimension: 'التوازن',
    title: 'تمارين Y-Balance والوقوف الأحادي',
    description: 'خصص 10 دقائق يومياً لتمارين التوازن على سطح غير مستقر لتطوير الثبات.',
    priority: 'medium',
    icon: Shield,
    color: 'text-cyan-600 dark:text-cyan-400',
  },
  {
    id: 'cognitive-rec',
    dimension: 'الإدراك الحركي',
    title: 'تمارين رد الفعل البصري',
    description: 'استخدم تطبيقات تدريب رد الفعل أو تمارين الضوء/الصوت لتحسين الاستجابة.',
    priority: 'medium',
    icon: Brain,
    color: 'text-rose-600 dark:text-rose-400',
  },
];

// ─── Sub Components ───────────────────────────────

function TrendIndicator({ trend }: { trend: number }) {
  if (trend > 0) return (
    <span className="flex items-center gap-0.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded-full">
      <TrendingUp className="w-3 h-3" />+{trend}%
    </span>
  );
  if (trend < 0) return (
    <span className="flex items-center gap-0.5 text-[11px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-900/30 dark:text-rose-400 px-2 py-0.5 rounded-full">
      <TrendingDown className="w-3 h-3" />{trend}%
    </span>
  );
  return (
    <span className="flex items-center gap-0.5 text-[11px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
      <Minus className="w-3 h-3" /> ثابت
    </span>
  );
}

function DimensionCard({ dim, index }: { dim: PerformanceDimension; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const vsAge = dim.score - dim.ageAvg;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className={cn(
        'rounded-3xl border p-5 md:p-6 cursor-pointer transition-all duration-200',
        dim.bgColor, dim.borderColor,
        expanded && 'shadow-lg bg-white/40 dark:bg-black/10'
      )}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-black/20 shadow-sm flex items-center justify-center flex-shrink-0">
            <dim.icon className={cn('w-6 h-6', dim.color)} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-base md:text-lg font-black text-slate-900 dark:text-slate-100">{dim.label}</span>
              <span className="text-xs text-slate-400 hidden sm:inline">{dim.labelEn}</span>
              <TrendIndicator trend={dim.trend} />
            </div>
            {/* Progress bar */}
            <div className="relative h-2.5 bg-white/60 dark:bg-black/20 rounded-full overflow-hidden">
              <motion.div
                className={cn('absolute inset-y-0 right-0 rounded-full bg-gradient-to-l', dim.gradient)}
                initial={{ width: '0%' }}
                animate={{ width: `${dim.score}%` }}
                transition={{ delay: 0.4 + index * 0.07, duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0 border-r border-slate-200/50 dark:border-white/10 pr-4">
          <div className="text-center">
            <p className={cn('text-2xl md:text-3xl font-black', dim.color)}>{dim.score}</p>
            <p className="text-xs font-bold text-slate-500 mt-0.5">نقطة</p>
          </div>
          <div className="bg-white/50 dark:bg-white/5 p-1.5 rounded-full">
            {expanded ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-5 pt-5 border-t border-black/5 dark:border-white/10 space-y-4">
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">{dim.description}</p>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/80 dark:bg-black/20 rounded-2xl p-4 text-center">
                  <p className="text-sm font-bold text-slate-500 mb-1">نقطتك</p>
                  <p className={cn('text-2xl font-black', dim.color)}>{dim.score}</p>
                </div>
                <div className="bg-white/80 dark:bg-black/20 rounded-2xl p-4 text-center">
                  <p className="text-sm font-bold text-slate-500 mb-1 flex items-center justify-center gap-1.5"><Users className="w-4 h-4" />متوسط الفئة</p>
                  <p className="text-2xl font-black text-slate-800 dark:text-slate-200">{dim.ageAvg}</p>
                </div>
                <div className="bg-white/80 dark:bg-black/20 rounded-2xl p-4 text-center">
                  <p className="text-sm font-bold text-slate-500 mb-1">الشريحة المئوية</p>
                  <p className="text-2xl font-black text-blue-600 dark:text-blue-400">%{dim.percentile}</p>
                </div>
              </div>

              {/* vs age group */}
              <div className={cn(
                'flex items-center gap-3 rounded-2xl px-5 py-4 text-base font-bold',
                vsAge >= 0
                  ? 'bg-emerald-100/80 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200'
                  : 'bg-amber-100/80 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200'
              )}>
                {vsAge >= 0 ? <TrendingUp className="w-5 h-5 flex-shrink-0" /> : <TrendingDown className="w-5 h-5 flex-shrink-0" />}
                {vsAge >= 0
                  ? `أنت أفضل من متوسط فئتك العمرية بـ ${vsAge} نقطة — استمر!`
                  : `أنت أقل من متوسط فئتك العمرية بـ ${Math.abs(vsAge)} نقطة — هذه فرصة للتطوير.`
                }
              </div>

              {dim.weaknessHint && (
                <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-700/30 rounded-2xl px-5 py-4">
                  <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm md:text-base text-amber-800 dark:text-amber-200 leading-relaxed font-medium">{dim.weaknessHint}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Component ──────────────────────────────
export function MovementFingerprintPage() {
  const avgScore = Math.round(dimensions.reduce((a, d) => a + d.score, 0) / dimensions.length);
  const topDim = [...dimensions].sort((a, b) => b.score - a.score)[0];
  const weakDim = [...dimensions].sort((a, b) => a.score - b.score)[0];

  return (
    <div className="space-y-8">

      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-[2rem] xl:rounded-[2.5rem] overflow-hidden p-8 lg:p-10 shadow-lg"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[60px]" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-12">
          <div className="flex-1">
            <div className="flex items-start md:items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center flex-shrink-0 mt-1 md:mt-0">
                <Fingerprint className="w-7 h-7 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-2 tracking-tight">البصمة الحركية الرقمية</h1>
                <p className="text-indigo-200 font-bold text-base tracking-wide uppercase">6 أبعاد لتحليل قدراتك الكاملة</p>
              </div>
            </div>
            <p className="text-slate-300 text-base md:text-lg max-w-2xl leading-relaxed mt-4">
              البصمة الحركية هي ملفك الرياضي العلمي الفريد — تحليل شامل لأدائك الحركي والمعرفي والنفسي
              يستخدمه الذكاء الاصطناعي لتخصيص برامجك التدريبية بدقة.
            </p>
          </div>

          {/* Overall score */}
          <div className="flex gap-4 md:gap-6 flex-shrink-0 bg-white/5 border border-white/10 p-5 rounded-3xl backdrop-blur-md">
            <div className="text-center pr-4 md:pr-6 border-l border-white/10 flex flex-col justify-center">
              <p className="text-4xl md:text-5xl lg:text-6xl font-black text-white">{avgScore}</p>
              <p className="text-sm md:text-base font-bold text-slate-400 mt-2 uppercase tracking-wider">النقاط المجمّعة</p>
            </div>
            <div className="flex flex-col gap-3 justify-center">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-4 py-2.5">
                <p className="text-xs text-emerald-400/80 font-bold uppercase mb-1 flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5" /> الأقوى</p>
                <p className="text-base font-black text-emerald-400">{topDim.label}</p>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl px-4 py-2.5">
                <p className="text-xs text-amber-400/80 font-bold uppercase mb-1 flex items-center gap-1.5"><TrendingDown className="w-3.5 h-3.5" /> للتطوير</p>
                <p className="text-base font-black text-amber-400">{weakDim.label}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Radar Chart + Summary */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        <div className="xl:col-span-2">
          <div className="rounded-[2rem] border border-slate-200/50 dark:border-white/5 bg-white dark:bg-white/5 backdrop-blur-md p-8 shadow-sm h-full flex flex-col justify-center">
            <MotorProfileRadar />
          </div>
        </div>

        {/* Age Comparison */}
        <div className="xl:col-span-3 rounded-[2rem] border border-slate-200/50 dark:border-white/5 bg-white dark:bg-white/5 backdrop-blur-md p-8 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg md:text-opacity-100 md:text-xl font-black text-slate-800 dark:text-slate-100">مقارنة مع الفئة العمرية</h3>
              <p className="text-sm font-bold text-slate-400">أداؤك مقارنة بمتوسط طلاب نفس عمرك</p>
            </div>
          </div>

          <div className="space-y-5">
            {dimensions.map((dim, i) => {
              const vsAge = dim.score - dim.ageAvg;
              return (
                <div key={dim.id} className="space-y-2.5">
                  <div className="flex items-center justify-between text-base">
                    <div className="flex items-center gap-3">
                      <dim.icon className={cn('w-5 h-5', dim.color)} />
                      <span className="text-base md:text-lg font-black text-slate-700 dark:text-slate-200">{dim.label}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-slate-400">متوسط: <strong className="text-slate-600 dark:text-slate-300">{dim.ageAvg}</strong></span>
                      <span className={cn(
                        'text-sm font-black px-3 py-1 rounded-full',
                        vsAge >= 0
                          ? 'text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/30'
                          : 'text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-900/30'
                      )}>
                        {vsAge >= 0 ? '+' : ''}{vsAge}
                      </span>
                      <span className={cn('text-lg md:text-xl font-black w-8 text-left', dim.color)}>{dim.score}</span>
                    </div>
                  </div>
                  {/* Stacked bar: age avg vs score */}
                  <div className="relative h-3 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                    {/* Age avg line */}
                    <div
                      className="absolute inset-y-0 right-0 bg-slate-300 dark:bg-white/10 rounded-full"
                      style={{ width: `${dim.ageAvg}%` }}
                    />
                    {/* My score */}
                    <motion.div
                      className={cn('absolute inset-y-0 right-0 rounded-full bg-gradient-to-l opacity-80', dim.gradient)}
                      initial={{ width: '0%' }}
                      animate={{ width: `${dim.score}%` }}
                      transition={{ delay: 0.3 + i * 0.08, duration: 0.9, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-6 mt-8 pt-6 border-t border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
              <div className="w-4 h-3 bg-slate-300 dark:bg-white/10 rounded" />
              متوسط الفئة العمرية
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
              <div className="w-4 h-3 rounded" style={{ background: 'linear-gradient(to right, #3b82f6, #8b5cf6)' }} />
              أداؤك الحالي
            </div>
          </div>
        </div>
      </div>

      {/* 6 Dimension Cards */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-2.5 h-8 bg-indigo-500 rounded-full" />
          <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">تفصيل الأبعاد الستة</h2>
          <span className="text-xs text-slate-400 mt-0.5">اضغط على أي بُعد لمزيد من التفاصيل</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {dimensions.map((dim, i) => (
            <DimensionCard key={dim.id} dim={dim} index={i} />
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="rounded-[2rem] border border-slate-200/50 dark:border-white/5 bg-white dark:bg-white/5 backdrop-blur-md p-8 lg:p-10 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <Lightbulb className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-black text-slate-800 dark:text-slate-100">توصيات تدريبية ذكية</h3>
            <p className="text-sm font-bold text-slate-400">بناءً على نقاط ضعفك — يُحدَّث أسبوعياً</p>
          </div>
        </div>

        <div className="space-y-6">
          {recommendations.map((rec, i) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className={cn(
                'flex flex-col sm:flex-row items-start gap-5 rounded-2xl p-5 md:p-6 border',
                rec.priority === 'high'
                  ? 'bg-red-50/60 dark:bg-red-900/10 border-red-200/50 dark:border-red-700/20'
                  : 'bg-blue-50/60 dark:bg-blue-900/10 border-blue-200/50 dark:border-blue-700/20'
              )}
            >
              <div className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                rec.priority === 'high' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-blue-100 dark:bg-blue-900/30'
              )}>
                <rec.icon className={cn('w-6 h-6', rec.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-black text-slate-800 dark:text-slate-100 text-base md:text-lg">{rec.title}</h4>
                  <span className={cn(
                    'text-xs font-bold px-3 py-1 rounded-full',
                    rec.priority === 'high'
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                  )}>
                    {rec.priority === 'high' ? 'أولوية عالية' : 'أولوية متوسطة'}
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-500 mb-2">البُعد: {rec.dimension}</p>
                <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{rec.description}</p>
              </div>
              <div className="flex-shrink-0 hidden sm:block">
                <Award className={cn('w-8 h-8 opacity-40', rec.color)} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
