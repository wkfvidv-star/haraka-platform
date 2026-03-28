import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Activity, Brain, Heart, Shield, Zap, Star,
  Trophy, Target, PlayCircle, ChevronDown, ChevronUp,
  Dumbbell, Wind, Book, UserCheck, Sparkles,
  Lock, CheckCircle2,
} from 'lucide-react';
import type { AssessmentResult, DomainId } from './FTUEAssessmentEngine';

// ─────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────
interface Props {
  result: AssessmentResult;
  studentName?: string;
  onComplete: () => void;
}

// ─────────────────────────────────────────────────────────────────
// LEVEL HELPERS
// ─────────────────────────────────────────────────────────────────
function getLevel(score: number) {
  if (score >= 85) return { label: 'ممتاز', color: 'text-emerald-400', bg: 'bg-emerald-500/20 border-emerald-500/40' };
  if (score >= 65) return { label: 'جيد', color: 'text-blue-400', bg: 'bg-blue-500/20 border-blue-500/40' };
  if (score >= 45) return { label: 'متوسط', color: 'text-yellow-400', bg: 'bg-yellow-500/20 border-yellow-500/40' };
  return { label: 'يحتاج تحسين', color: 'text-rose-400', bg: 'bg-rose-500/20 border-rose-500/40' };
}

// ─────────────────────────────────────────────────────────────────
// RADAR CHART (SVG)
// ─────────────────────────────────────────────────────────────────
function RadarChart({ scores }: { scores: { label: string; value: number }[] }) {
  const N = scores.length;
  const CX = 100; const CY = 100; const R = 75;

  const angleStep = (2 * Math.PI) / N;
  const angle = (i: number) => -Math.PI / 2 + i * angleStep;

  const axisEnd = (i: number, r = R) => ({
    x: CX + r * Math.cos(angle(i)),
    y: CY + r * Math.sin(angle(i)),
  });

  const polygon = (r: number) =>
    scores.map((_, i) => `${axisEnd(i, r).x},${axisEnd(i, r).y}`).join(' ');

  const valuePolygon = scores
    .map((s, i) => axisEnd(i, (s.value / 100) * R))
    .map(p => `${p.x},${p.y}`)
    .join(' ');

  return (
    <svg viewBox="0 0 200 200" className="w-full max-w-[220px] mx-auto">
      {/* Grid rings */}
      {[0.25, 0.5, 0.75, 1].map((f, gi) => (
        <polygon key={gi} points={polygon(R * f)}
          fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      ))}
      {/* Axis lines */}
      {scores.map((_, i) => {
        const ep = axisEnd(i);
        return <line key={i} x1={CX} y1={CY} x2={ep.x} y2={ep.y} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />;
      })}
      {/* Value area */}
      <motion.polygon
        points={polygon(0)}
        initial={{ points: polygon(0) }}
        animate={{ points: valuePolygon }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        fill="url(#radarFill)" stroke="url(#radarStroke)" strokeWidth="2"
        fillOpacity="0.35"
      />
      <defs>
        <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="radarStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      {/* Data points */}
      {scores.map((s, i) => {
        const p = axisEnd(i, (s.value / 100) * R);
        return (
          <motion.circle key={i} cx={CX} cy={CY} r={4}
            initial={{ cx: CX, cy: CY }}
            animate={{ cx: p.x, cy: p.y }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 + i * 0.05 }}
            fill="white" opacity="0.9"
          />
        );
      })}
      {/* Labels */}
      {scores.map((s, i) => {
        const ep = axisEnd(i, R + 18);
        const anchor = ep.x > CX + 5 ? 'start' : ep.x < CX - 5 ? 'end' : 'middle';
        return (
          <text key={i} x={ep.x} y={ep.y} textAnchor={anchor} dominantBaseline="middle"
            fill="rgba(255,255,255,0.65)" fontSize="9" fontWeight="700" fontFamily="Cairo, sans-serif">
            {s.label}
          </text>
        );
      })}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────
// TALENT BADGE
// ─────────────────────────────────────────────────────────────────
function TalentBadge({ result }: { result: AssessmentResult }) {
  const allScores: { label: string; score: number; talent: string; icon: React.ElementType; color: string; subscoreKey?: string }[] = [];
  
  if (result.motor) {
    allScores.push(
      { label: 'رد الفعل', score: result.motor.subscores?.reaction ?? result.motor.score, talent: 'بطل السرعة ⚡', icon: Zap, color: 'from-yellow-500 to-orange-500' },
      { label: 'التوازن', score: result.motor.subscores?.balance ?? result.motor.score, talent: 'سيد التوازن ⚖️', icon: Shield, color: 'from-cyan-500 to-teal-500' },
      { label: 'الأداء الحركي', score: result.motor.score, talent: 'بطل الحركة 🏃', icon: Activity, color: 'from-blue-500 to-cyan-600' }
    );
  }
  
  if (result.cognitive) {
    allScores.push(
      { label: 'التركيز', score: result.cognitive.subscores?.attention ?? result.cognitive.score, talent: 'قوة التركيز 🎯', icon: Target, color: 'from-violet-500 to-purple-600' },
      { label: 'الذاكرة', score: result.cognitive.subscores?.memory ?? result.cognitive.score, talent: 'ذاكرة الأبطال 🧠', icon: Brain, color: 'from-indigo-500 to-blue-600' }
    );
  }

  // Fallback if somehow empty
  if (allScores.length === 0) {
    allScores.push({ label: 'الأداء العام', score: 0, talent: 'مستعد للانطلاق 🚀', icon: Activity, color: 'from-blue-500 to-cyan-600' });
  }

  const top = [...allScores].sort((a, b) => b.score - a.score)[0];
  const Icon = top.icon;

  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', delay: 0.2 }}
      className="relative overflow-hidden rounded-[2.5rem] p-8 flex items-center gap-6 shadow-2xl"
      style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.15) 0%, rgba(251,146,60,0.15) 100%)', border: '2px solid rgba(251,191,36,0.3)' }}
    >
      {/* Glow */}
      <div className="absolute -top-6 -right-6 w-40 h-40 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
      <motion.div
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className={`w-20 h-20 rounded-[1.5rem] bg-gradient-to-br ${top.color} flex items-center justify-center shadow-xl flex-shrink-0 border-2 border-white/20`}
      >
        <Trophy className="w-10 h-10 text-white drop-shadow-md" />
      </motion.div>
      <div className="flex-1 min-w-0">
        <p className="text-yellow-300 text-sm font-black uppercase tracking-widest mb-1 drop-shadow-md">موهبتك المميزة</p>
        <p className="text-white font-black text-3xl sm:text-4xl leading-tight drop-shadow-lg">{top.talent}</p>
        <p className="text-white/80 text-lg mt-1 font-bold">أداؤك في {top.label}: <span className="text-yellow-400 font-black text-xl">{top.score}/100</span></p>
      </div>
      <div className="flex-shrink-0">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${top.color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
// SCORE CARDS
// ─────────────────────────────────────────────────────────────────
const DOMAIN_META: Record<DomainId, { icon: React.ElementType; color: string; gradient: string }> = {
  motor: { icon: Activity, color: 'text-blue-400', gradient: 'from-blue-500 to-cyan-600' },
  cognitive: { icon: Brain, color: 'text-violet-400', gradient: 'from-violet-500 to-purple-700' },
  psychological: { icon: Heart, color: 'text-rose-400', gradient: 'from-rose-500 to-pink-600' },
  rehab: { icon: Shield, color: 'text-emerald-400', gradient: 'from-emerald-500 to-teal-600' },
};

function DomainCard({ domain, delay }: { domain: { id: DomainId; label: string; score: number; subscores: Record<string, number> }; delay: number }) {
  const [open, setOpen] = useState(false);
  const meta = DOMAIN_META[domain.id];
  const Icon = meta.icon;
  const { label: lvLabel, color: lvColor, bg: lvBg } = getLevel(domain.score);

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className={`rounded-[2rem] border-2 p-6 transition-all hover:scale-[1.01] ${lvBg}`}>
      <div className="flex items-center gap-6 cursor-pointer" onClick={() => setOpen(o => !o)}>
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center flex-shrink-0 shadow-md`}>
          <Icon className="w-8 h-8 text-white drop-shadow-sm" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-2xl font-black text-white drop-shadow-sm">{domain.label}</p>
          <div className="mt-3 h-2.5 bg-white/10 rounded-full overflow-hidden shadow-inner">
            <motion.div className={`h-full rounded-full bg-gradient-to-l ${meta.gradient}`}
              initial={{ width: 0 }} animate={{ width: `${domain.score}%` }}
              transition={{ delay: delay + 0.2, duration: 0.9, ease: 'easeOut' }} />
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0 mr-4">
          <span className={`text-3xl font-black drop-shadow-md ${lvColor}`}>{domain.score}</span>
          <span className={`text-sm font-black opacity-80 ${lvColor}`}>{lvLabel}</span>
        </div>
        {Object.keys(domain.subscores || {}).length > 1 && (
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-2">
            {open ? <ChevronUp className="w-6 h-6 text-white" /> : <ChevronDown className="w-6 h-6 text-white" />}
          </div>
        )}
      </div>

      {/* Sub-scores breakdown */}
      <AnimatePresence>
        {open && Object.entries(domain.subscores || {}).length > 1 && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-6 border-t-2 border-white/10 pt-6">
            <div className="space-y-4">
              {Object.entries(domain.subscores || {}).map(([key, val]) => {
                const subLabels: Record<string, string> = {
                  reaction: 'رد الفعل', balance: 'التوازن', strength: 'القوة والمرونة',
                  memory: 'الذاكرة', math: 'سرعة الحساب', attention: 'الانتباه',
                };
                return (
                  <div key={key} className="flex items-center gap-4">
                    <span className="text-lg font-bold text-slate-300 w-32">{subLabels[key] ?? key}</span>
                    <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden shadow-inner">
                      <motion.div className={`h-full rounded-full bg-gradient-to-l ${meta.gradient} opacity-80`}
                        initial={{ width: 0 }} animate={{ width: `${val}%` }} transition={{ duration: 0.6 }} />
                    </div>
                    <span className="text-xl font-black text-white w-12 text-right">{val}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
// SMART RECOMMENDATIONS
// ─────────────────────────────────────────────────────────────────
interface ExZone {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  exercises: string[];
  priority: boolean;
}

function buildZones(result: AssessmentResult): ExZone[] {
  const { motor, cognitive, psychological, needsRehab } = result;

  const zones: ExZone[] = [];

  // Motor zone
  const weakMotor = motor?.subscores ? Object.entries(motor.subscores).sort((a, b) => a[1] - b[1])[0] : null;
  const motorExMap: Record<string, string[]> = {
    reaction: ['تمرين نقر كرة الرد السريع', 'تمرين الإشارات اللونية', 'تمرين الاستجابة بالقفز'],
    balance: ['الوقوف على لوحة التوازن', 'تمارين التوازن ذات القدم الواحدة', 'تمرين العقبات البطيئة'],
    strength: ['5 ضغطات معدّلة', 'تمرين التمدد الأمامي', 'تمرين الجسر البسيط'],
  };
  
  if (motor) {
    zones.push({
      id: 'motor', title: 'تمارين حركية', subtitle: `مُركَّز على: ${weakMotor && weakMotor[0] === 'reaction' ? 'رد الفعل' : weakMotor && weakMotor[0] === 'balance' ? 'التوازن' : 'القوة'}`,
      icon: Activity, color: 'from-blue-500 to-cyan-600',
      exercises: (weakMotor && motorExMap[weakMotor[0]]) ?? motorExMap.strength,
      priority: motor.score < 60,
    });
  }

  // Cognitive zone
  const weakCog = cognitive?.subscores ? Object.entries(cognitive.subscores).sort((a, b) => a[1] - b[1])[0] : null;
  const cogExMap: Record<string, string[]> = {
    memory: ['لعبة تذكر الأرقام', 'بطاقات التطابق', 'تمرين التسلسل العكسي'],
    math: ['حساب ذهني 60 ثانية', 'لعبة الأرقام المتسارعة', 'تحدي الجمع السريع'],
    attention: ['البحث في الشبكة', 'تمرين ستروب اللوني', 'اختبار الفروق الدقيقة'],
  };
  
  if (cognitive) {
    zones.push({
      id: 'cognitive', title: 'تمارين معرفية', subtitle: `تحسين: ${weakCog && weakCog[0] === 'memory' ? 'الذاكرة' : weakCog && weakCog[0] === 'math' ? 'سرعة الحساب' : 'الانتباه'}`,
      icon: Brain, color: 'from-violet-500 to-purple-700',
      exercises: (weakCog && cogExMap[weakCog[0]]) ?? cogExMap.attention,
      priority: cognitive.score < 60,
    });
  }

  // Psychological zone
  if (psychological) {
    const psychExercises = psychological.score < 60
      ? ['تمرين التنفس العميق 4-7-8', 'جلسة استرخاء عضلي تدريجي', 'تأمل 5 دقائق قبل التمرين']
      : ['تحدي الأداء الذروي', 'تمرين التصوّر الذهني', 'بروتوكول الدخول في الحالة الذهنية'];
    zones.push({
      id: 'psych', title: 'تمارين نفسية', subtitle: psychological.score < 60 ? 'استرخاء وتوازن نفسي' : 'تحفيز وأداء ذروي',
      icon: Heart, color: 'from-rose-500 to-pink-600',
      exercises: psychExercises,
      priority: psychological.score < 50,
    });
  }

  // Rehab zone (if needed)
  if (needsRehab) {
    zones.unshift({
      id: 'rehab', title: 'برنامج التأهيل', subtitle: 'تمارين مخصصة وآمنة لحالتك',
      icon: Shield, color: 'from-emerald-500 to-teal-600',
      exercises: ['تمارين تقوية خفيفة', 'تمدد علاجي للمنطقة المتأثرة', 'تمرين نطاق الحركة التدريجي'],
      priority: true,
    });
  }

  // AI Smart Training zone (always last)
  zones.push({
    id: 'smart', title: 'Smart Training AI', subtitle: 'مقترحات ذكية تتكيف مع أدائك',
    icon: Sparkles, color: 'from-orange-500 to-amber-500',
    exercises: ['روتين تدريب يومي مخصص', 'تحديات أسبوعية تكيفية', 'خطة تطور 4 أسابيع'],
    priority: false,
  });

  return zones;
}

function RecommendationsGrid({ result }: { result: AssessmentResult }) {
  const zones = buildZones(result);
  const [activeZone, setActiveZone] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-2xl font-black text-white flex items-center gap-3 drop-shadow-md">
        <Sparkles className="w-8 h-8 text-yellow-400" /> توصيات التدريب الذكية
      </h3>
      <div className="grid grid-cols-1 gap-4">
        {zones.map((z, i) => {
          const Icon = z.icon;
          const isActive = activeZone === z.id;
          return (
            <motion.div key={z.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.07 }}
              className={`rounded-[2rem] border-2 transition-all cursor-pointer shadow-lg ${isActive ? 'border-white/30 bg-white/10 scale-[1.01]' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
              <div className="flex items-center gap-5 p-6" onClick={() => setActiveZone(isActive ? null : z.id)}>
                <div className={`w-16 h-16 rounded-[1.25rem] bg-gradient-to-br ${z.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                  <Icon className="w-8 h-8 text-white drop-shadow-sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="text-xl font-black text-white drop-shadow-sm">{z.title}</p>
                    {z.priority && <span className="text-xs bg-rose-500/30 text-rose-300 border border-rose-500/40 px-3 py-1 rounded-xl font-bold">أولوية عالية</span>}
                  </div>
                  <p className="text-slate-300 text-base">{z.subtitle}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  {isActive ? <ChevronUp className="w-6 h-6 text-white" /> : <ChevronDown className="w-6 h-6 text-white" />}
                </div>
              </div>

              <AnimatePresence>
                {isActive && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t-2 border-white/10">
                    <div className="p-6 pt-4 space-y-4">
                      {z.exercises.map((ex, ei) => (
                        <div key={ei} className="flex items-center gap-4 bg-black/20 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                          <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${z.color} flex-shrink-0 shadow-[0_0_10px_rgba(255,255,255,0.5)]`} />
                          <span className="text-lg font-bold text-slate-200">{ex}</span>
                          <button className="mr-auto text-sm bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-xl font-black transition-colors shadow-md">
                            تدرب الآن
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// TEACHER EXERCISES SECTION
// ─────────────────────────────────────────────────────────────────
function TeacherSection() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
      className="rounded-[2rem] border-2 border-dashed border-white/20 bg-white/5 p-6 flex items-start gap-5 mt-4">
      <div className="w-16 h-16 rounded-[1.25rem] bg-white/10 flex items-center justify-center flex-shrink-0">
        <UserCheck className="w-8 h-8 text-slate-300" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <p className="text-xl font-black text-slate-200">تمارين الأستاذ / المدرب</p>
          <Lock className="w-5 h-5 text-slate-400" />
        </div>
        <p className="text-slate-400 text-lg leading-relaxed">
          عندما يرسل لك أستاذك أو مدربك تمارين مباشرة ستظهر هنا. ستصلك إشعار فور إضافتها.
        </p>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
// MAIN RESULTS COMPONENT
// ─────────────────────────────────────────────────────────────────
export function FTUEResults({ result, studentName, onComplete }: Props) {
  const [tab, setTab] = useState<'overview' | 'details' | 'plan'>('overview');

  const radarData = [
    { label: 'حركي', value: result.motor?.score || 0 },
    { label: 'معرفي', value: result.cognitive?.score || 0 },
    { label: 'نفسي', value: result.psychological?.score || 0 },
    { label: 'اللياقة', value: result.rehab?.score || 0 },
  ];

  const overallScore = Math.round(
    ((result.motor?.score || 0) * 0.35 + 
     (result.cognitive?.score || 0) * 0.3 + 
     (result.psychological?.score || 0) * 0.2 + 
     (result.rehab?.score || 0) * 0.15)
  );

  const domains = [
    result.motor ? { id: 'motor' as DomainId, label: 'الأداء الحركي', score: result.motor.score, subscores: result.motor.subscores || {} } : null,
    result.cognitive ? { id: 'cognitive' as DomainId, label: 'القدرات المعرفية', score: result.cognitive.score, subscores: result.cognitive.subscores || {} } : null,
    result.psychological ? { id: 'psychological' as DomainId, label: 'التقييم النفسي', score: result.psychological.score, subscores: result.psychological.subscores || {} } : null,
    result.rehab ? { id: 'rehab' as DomainId, label: 'جاهزية التأهيل', score: result.rehab.score, subscores: result.rehab.subscores || {} } : null,
  ].filter(Boolean) as { id: DomainId; label: string; score: number; subscores: Record<string, number> }[];

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto py-6" dir="rtl">
      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] bg-gradient-to-br from-blue-500 to-indigo-600 shadow-2xl mb-4 border-4 border-white/10">
          <CheckCircle2 className="w-12 h-12 text-white drop-shadow-md" />
        </motion.div>
        <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-lg mb-2">بصمتك الحركية جاهزة{studentName ? `، ${studentName.split(' ')[0]}` : ''}! 🎉</h2>
        <p className="text-white/80 text-xl font-bold mt-2">
          الدرجة الإجمالية: <span className="text-yellow-400 font-black text-3xl px-2 drop-shadow-md">{overallScore}/100</span>
          <span className="mx-3 text-white/40">·</span>
          <span className={getLevel(overallScore).color + ' font-black text-2xl drop-shadow-md'}>{getLevel(overallScore).label}</span>
        </p>
      </motion.div>

      {/* ── Talent Badge ── */}
      <TalentBadge result={result} />

      {/* ── Tab Switch ── */}
      <div className="flex gap-2 bg-white/5 p-2 rounded-[2rem] shadow-inner mb-4">
        {[{ id: 'overview', label: 'نظرة عامة' }, { id: 'details', label: 'تفاصيل' }, { id: 'plan', label: 'خطة التدريب' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as typeof tab)}
            className={`flex-1 py-4 rounded-3xl text-xl font-black transition-all ${tab === t.id ? 'bg-blue-600 text-white shadow-xl scale-[1.02]' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      <AnimatePresence mode="wait">
        {tab === 'overview' && (
          <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col gap-6">
            {/* Radar */}
            <div className="bg-white/5 rounded-[2.5rem] border border-white/10 p-8 shadow-xl">
              <p className="text-lg font-black text-slate-300 uppercase tracking-widest text-center mb-6">رادار الأداء الشامل</p>
              <div className="scale-125 transform-origin-center py-8">
                <RadarChart scores={radarData} />
              </div>
            </div>
            {/* Quick score row */}
            <div className="grid grid-cols-2 gap-4">
              {domains.map((d, i) => {
                const meta = DOMAIN_META[d.id];
                const Icon = meta.icon;
                const lv = getLevel(d.score);
                return (
                  <motion.div key={d.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.07 }}
                    className={`rounded-[2rem] border-2 p-6 flex flex-col md:flex-row items-center gap-4 text-center md:text-right shadow-lg ${lv.bg}`}>
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center flex-shrink-0 shadow-md`}>
                      <Icon className="w-8 h-8 text-white drop-shadow-sm" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-lg font-bold text-slate-300 truncate mb-1">{d.label}</p>
                      <p className={`text-4xl font-black drop-shadow-md ${lv.color}`}>{d.score} <span className="text-xl font-bold opacity-80">{lv.label}</span></p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {tab === 'details' && (
          <motion.div key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col gap-2.5">
            {domains.map((d, i) => <DomainCard key={d.id} domain={d} delay={i * 0.07} />)}
          </motion.div>
        )}

        {tab === 'plan' && (
          <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col gap-4">
            <RecommendationsGrid result={result} />
            <TeacherSection />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CTA ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-8">
        <Button onClick={onComplete}
          className="w-full bg-gradient-to-l from-orange-500 to-blue-600 hover:from-orange-400 hover:to-blue-500 text-white rounded-[2rem] h-20 text-3xl font-black shadow-2xl flex items-center justify-center gap-4 transition-all hover:scale-[1.02]">
          <PlayCircle className="w-10 h-10 drop-shadow-md" />
          افتح لوحة تماريني
        </Button>
      </motion.div>
    </div>
  );
}

export default FTUEResults;
