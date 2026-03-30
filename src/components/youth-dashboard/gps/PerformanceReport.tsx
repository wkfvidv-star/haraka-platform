import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Navigation, Zap, Timer, Activity, TrendingUp, Target, Star,
  CheckCircle2, AlertTriangle, Flame, Brain, RotateCcw, Trophy
} from 'lucide-react';
import { motion } from 'framer-motion';
import type { SessionSummary } from './LiveTracker';

interface PerformanceReportProps {
  summary: SessionSummary;
  onNewSession: () => void;
}

function ScoreRing({ score, size = 100 }: { score: number; size?: number }) {
  const r = (size / 2) - 8;
  const circ = 2 * Math.PI * r;
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444';
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="8"
        strokeLinecap="round" strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - (circ * score) / 100 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x={size / 2} y={size / 2 + 6} textAnchor="middle" fill={color} fontSize="18" fontWeight="900">{score}</text>
    </svg>
  );
}

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
      <motion.div className={`h-full rounded-full ${color}`} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: 'easeOut' }} />
    </div>
  );
}

export const PerformanceReport = ({ summary, onNewSession }: PerformanceReportProps) => {
  const { distance, duration, avgSpeed, maxSpeed, checkpointsReached, activityBreakdown, idlePeriods } = summary;
  const distM = Math.round(distance * 1000);
  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  const totalSeconds = activityBreakdown.idle + activityBreakdown.walking + activityBreakdown.running + activityBreakdown.sprinting || 1;

  // Performance Score
  const distScore = Math.min((distM / 1000) * 20, 40);
  const speedScore = Math.min(avgSpeed * 3, 30);
  const cpScore = checkpointsReached * 10;
  const idlePenalty = Math.min(idlePeriods * 2, 20);
  const totalScore = Math.round(Math.max(distScore + speedScore + cpScore - idlePenalty, 0));

  const grade = totalScore >= 85 ? 'ممتاز' : totalScore >= 70 ? 'جيد جداً' : totalScore >= 55 ? 'جيد' : 'يحتاج تحسين';
  const gradeColor = totalScore >= 85 ? 'text-green-400' : totalScore >= 70 ? 'text-blue-400' : totalScore >= 55 ? 'text-yellow-400' : 'text-red-400';

  // AI Smart Feedback
  const feedbacks: { icon: React.ReactNode; msg: string; type: 'good' | 'warn' | 'tip' }[] = [];
  if (activityBreakdown.idle / totalSeconds > 0.3) feedbacks.push({ icon: <AlertTriangle className="w-4 h-4" />, msg: '⚠️ فترات التوقف أثّرت على أدائك — حاول تقليل أوقات الراحة في الجلسة القادمة.', type: 'warn' });
  if (activityBreakdown.sprinting / totalSeconds > 0.2) feedbacks.push({ icon: <Flame className="w-4 h-4" />, msg: '🔥 أداء استثنائي في الجري السريع — أنت تتجاوز معدل الأقران!', type: 'good' });
  if (avgSpeed > 8) feedbacks.push({ icon: <Zap className="w-4 h-4" />, msg: '⚡ سرعتك المتوسطة ممتازة — جرب الحفاظ عليها طوال المسار في الجلسة التالية.', type: 'good' });
  if (distM < 500) feedbacks.push({ icon: <Target className="w-4 h-4" />, msg: '🎯 المسافة أقل من المعتاد — من المقترح رفعها تدريجياً لتحسين التحمل.', type: 'tip' });
  if (checkpointsReached > 0) feedbacks.push({ icon: <CheckCircle2 className="w-4 h-4" />, msg: `✅ وصلت لـ ${checkpointsReached} نقطة تفتيش — عمل رائع!`, type: 'good' });
  if (feedbacks.length === 0) feedbacks.push({ icon: <Star className="w-4 h-4" />, msg: '⭐ أداء متوازن — استمر على هذا النهج وستلاحظ تقدماً مستمراً.', type: 'tip' });

  return (
    <div className="space-y-5" dir="rtl">
      {/* Hero Score Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden border border-white/5 bg-gradient-to-br from-slate-900 to-slate-950 p-8">
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 to-indigo-500/5" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="text-center">
            <ScoreRing score={totalScore} size={120} />
            <p className={`font-black text-lg mt-2 ${gradeColor}`}>{grade}</p>
            <p className="text-slate-500 text-xs font-bold">نتيجة الجلسة</p>
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-2xl font-black text-white mb-1 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-400" /> تقرير أداء الجلسة
              </h3>
              <p className="text-slate-400 text-sm">تحليل مفصل بناءً على بيانات GPS الفعلية</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { label: 'المسافة', val: `${distM} م`, icon: Navigation, c: 'text-orange-400' },
                { label: 'المدة', val: fmt(duration), icon: Timer, c: 'text-rose-400' },
                { label: 'متوسط السرعة', val: `${avgSpeed.toFixed(1)} كم/س`, icon: Zap, c: 'text-blue-400' },
                { label: 'أقصى سرعة', val: `${maxSpeed.toFixed(1)} كم/س`, icon: TrendingUp, c: 'text-purple-400' },
                { label: 'نقاط تفتيش', val: `${checkpointsReached}/3`, icon: Target, c: 'text-green-400' },
                { label: 'فترات توقف', val: idlePeriods.toString(), icon: Activity, c: idlePeriods > 3 ? 'text-red-400' : 'text-green-400' },
              ].map((s, i) => (
                <div key={i} className="bg-white/5 rounded-2xl p-3 flex items-center gap-2">
                  <s.icon className={`w-4 h-4 ${s.c} shrink-0`} />
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold">{s.label}</p>
                    <p className={`text-sm font-black ${s.c}`}>{s.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Activity Breakdown Chart */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="bg-slate-900/60 border-white/5">
          <CardHeader className="pb-3 border-b border-white/5">
            <CardTitle className="text-white font-black flex items-center gap-2 text-base">
              <Activity className="w-5 h-5 text-blue-400" /> تفصيل النشاط
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            {[
              { key: 'sprinting', label: 'جري سريع', color: 'bg-blue-500', textColor: 'text-blue-400' },
              { key: 'running', label: 'جري', color: 'bg-green-500', textColor: 'text-green-400' },
              { key: 'walking', label: 'مشي', color: 'bg-yellow-500', textColor: 'text-yellow-400' },
              { key: 'idle', label: 'خمول/توقف', color: 'bg-red-500', textColor: 'text-red-400' },
            ].map(a => {
              const val = activityBreakdown[a.key as keyof typeof activityBreakdown];
              const pct = Math.round((val / totalSeconds) * 100);
              return (
                <div key={a.key}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-slate-300 font-bold text-sm">{a.label}</span>
                    <span className={`font-black text-sm ${a.textColor}`}>{pct}% ({fmt(val)})</span>
                  </div>
                  <MiniBar value={val} max={totalSeconds} color={a.color} />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Smart Feedback */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="bg-slate-900/60 border-white/5">
          <CardHeader className="pb-3 border-b border-white/5">
            <CardTitle className="text-white font-black flex items-center gap-2 text-base">
              <Brain className="w-5 h-5 text-indigo-400" /> التغذية الراجعة الذكية
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-3">
            {feedbacks.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.08 }}
                className={`flex items-start gap-3 p-4 rounded-2xl border ${
                  f.type === 'good' ? 'bg-green-500/10 border-green-500/20 text-green-300'
                    : f.type === 'warn' ? 'bg-red-500/10 border-red-500/20 text-red-300'
                    : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300'
                }`}>
                <span className="mt-0.5 shrink-0">{f.icon}</span>
                <p className="text-sm font-bold leading-relaxed">{f.msg}</p>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Speed Stability Progress Bars */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="bg-slate-900/60 border-white/5">
          <CardHeader className="pb-3 border-b border-white/5">
            <CardTitle className="text-white font-black flex items-center gap-2 text-base">
              <TrendingUp className="w-5 h-5 text-orange-400" /> مؤشرات الأداء
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            {[
              { label: 'ثبات السرعة', value: Math.max(0, 100 - (idlePeriods * 10)), color: 'bg-orange-500', max: 100 },
              { label: 'الالتزام بالمسار', value: (checkpointsReached / 3) * 100, color: 'bg-blue-500', max: 100 },
              { label: 'معدل النشاط', value: Math.round(((totalSeconds - activityBreakdown.idle) / totalSeconds) * 100), color: 'bg-green-500', max: 100 },
              { label: 'كثافة التدريب', value: Math.min(avgSpeed * 10, 100), color: 'bg-purple-500', max: 100 },
            ].map((p, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300 font-bold text-sm">{p.label}</span>
                  <span className="text-white font-black text-sm">{Math.round(p.value)}%</span>
                </div>
                <MiniBar value={p.value} max={p.max} color={p.color} />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      <Button onClick={onNewSession} className="w-full h-14 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white font-black text-base shadow-xl shadow-orange-500/20">
        <RotateCcw className="w-5 h-5 ml-2" /> بدء جلسة تتبع جديدة
      </Button>
    </div>
  );
};
