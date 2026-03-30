import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileText, Download, TrendingUp, TrendingDown, Star, AlertCircle,
  Activity, Navigation, Clock, Zap, Users, Brain, ChevronDown, ChevronUp,
  Award, Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

interface StudentReport {
  id: string;
  name: string;
  class: string;
  avatar: string;
  color: string;
  gpsScore: number;
  motScore: number;
  cogScore: number;
  overall: number;
  distance: string;
  avgSpeed: string;
  duration: string;
  activeRatio: number;
  strengths: string[];
  weaknesses: string[];
  recommendation: string;
  trend: 'up' | 'down' | 'stable';
  weeklyProgress: { week: string; score: number }[];
}

const REPORTS: StudentReport[] = [
  {
    id: 'st1', name: 'نور حمداني', class: 'القسم 5أ', avatar: 'ن', color: '#8b5cf6',
    gpsScore: 95, motScore: 92, cogScore: 88, overall: 93,
    distance: '3.1 كم', avgSpeed: '11.2 كم/س', duration: '26 دقيقة', activeRatio: 95,
    strengths: ['السرعة الاستثنائية', 'المداومة العالية', 'الالتزام بالمسار'],
    weaknesses: ['مرحلة الإحماء قصيرة'],
    recommendation: 'إسناد مسارات متقدمة ذات كثافة عالية. يمكن تعيينه قائداً للمجموعة.',
    trend: 'up',
    weeklyProgress: [{ week: 'أ1', score: 80 }, { week: 'أ2', score: 85 }, { week: 'أ3', score: 90 }, { week: 'أ4', score: 93 }],
  },
  {
    id: 'st2', name: 'ياسين محمود', class: 'القسم 4أ', avatar: 'ي', color: '#3b82f6',
    gpsScore: 88, motScore: 90, cogScore: 85, overall: 88,
    distance: '2.3 كم', avgSpeed: '8.4 كم/س', duration: '21 دقيقة', activeRatio: 88,
    strengths: ['استقرار السرعة', 'اتباع التعليمات', 'أداء الحركات'], 
    weaknesses: ['بعض التوقفات غير المبررة'],
    recommendation: 'زيادة تدريج صعوبة المسارات ومراقبة فترات التوقف.',
    trend: 'up',
    weeklyProgress: [{ week: 'أ1', score: 75 }, { week: 'أ2', score: 80 }, { week: 'أ3', score: 85 }, { week: 'أ4', score: 88 }],
  },
  {
    id: 'st3', name: 'سارة بوزيد', class: 'القسم 4ب', avatar: 'س', color: '#f59e0b',
    gpsScore: 40, motScore: 55, cogScore: 70, overall: 52,
    distance: '0.8 كم', avgSpeed: '3.2 كم/س', duration: '14 دقيقة', activeRatio: 42,
    strengths: ['قدرة معرفية جيدة'],
    weaknesses: ['نشاط حركي ضعيف جداً', 'فترات خمول طويلة', 'مسافة منخفضة'],
    recommendation: 'برنامج تحفيز خاص. جلسات مشي جماعية مع مجموعة صغيرة أولاً.',
    trend: 'down',
    weeklyProgress: [{ week: 'أ1', score: 60 }, { week: 'أ2', score: 55 }, { week: 'أ3', score: 50 }, { week: 'أ4', score: 52 }],
  },
  {
    id: 'st4', name: 'كريم معروف', class: 'القسم 4ب', avatar: 'ك', color: '#ef4444',
    gpsScore: 18, motScore: 25, cogScore: 65, overall: 30,
    distance: '0.2 كم', avgSpeed: '1.0 كم/س', duration: '4 دقيقة', activeRatio: 12,
    strengths: ['إمكانيات ذهنية'],
    weaknesses: ['رفض شبه تام للنشاط', 'لا حركة GPS حقيقية', 'خروج متكرر عن المسار'],
    recommendation: 'تدخل فوري مع ولي الأمر. اجتماع مع الأخصائي النفسي. برنامج تشجيع مخصص.',
    trend: 'down',
    weeklyProgress: [{ week: 'أ1', score: 45 }, { week: 'أ2', score: 38 }, { week: 'أ3', score: 30 }, { week: 'أ4', score: 30 }],
  },
];

const overallColor = (s: number) =>
  s >= 80 ? 'text-green-600' : s >= 55 ? 'text-yellow-500' : 'text-red-500';

const overallBg = (s: number) =>
  s >= 80 ? 'bg-green-50 border-green-200' : s >= 55 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200';

export function GPSSmartReports() {
  const [expandedId, setExpandedId] = useState<string | null>('st1');
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExport = () => {
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 2500);
  };

  const radarData = (r: StudentReport) => [
    { metric: 'السرعة',     score: r.gpsScore },
    { metric: 'الحركة',    score: r.motScore },
    { metric: 'الإدراك',   score: r.cogScore },
    { metric: 'الانتظام',  score: r.activeRatio },
    { metric: 'المسافة',   score: Math.round((parseFloat(r.distance) / 3.5) * 100) },
  ];

  return (
    <div className="space-y-6">

      {/* ─ Header ─ */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900">التقارير الذكية الشاملة</h2>
          <p className="text-sm text-slate-500 font-semibold">تجمع بيانات GPS مع الأداء الحركي والمعرفي</p>
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-2 font-bold border-slate-200 text-slate-700">
          <Download className="w-4 h-4" />
          {exportSuccess ? '✅ تم التصدير!' : 'تصدير كل التقارير PDF'}
        </Button>
      </div>

      {/* ─ Report Cards ─ */}
      <div className="space-y-4">
        {REPORTS.map((report, idx) => {
          const isExpanded = expandedId === report.id;
          return (
            <motion.div key={report.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
              <Card className={`border-2 shadow-sm transition-all ${isExpanded ? 'border-blue-300 shadow-blue-100 shadow-md' : 'border-slate-200'}`}>
                {/* ── Summary Row ── */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : report.id)}
                  className="w-full text-right p-5 flex items-center gap-4"
                >
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-white text-lg shrink-0 shadow-sm"
                    style={{ backgroundColor: report.color }}>
                    {report.avatar}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-black text-slate-900">{report.name}</span>
                      <span className="text-xs text-slate-400 font-semibold">{report.class}</span>
                      <Badge className={`text-[10px] px-2 py-0 border rounded-full ${overallBg(report.overall)}`}>
                        {report.trend === 'up' ? '↑ تصاعدي' : report.trend === 'down' ? '↓ تراجع' : '→ ثابت'}
                      </Badge>
                    </div>
                    {/* Mini metrics */}
                    <div className="flex gap-4 mt-1 text-xs font-semibold text-slate-500 flex-wrap">
                      <span>📡 GPS: {report.gpsScore}</span>
                      <span>🏃 حركي: {report.motScore}</span>
                      <span>🧠 معرفي: {report.cogScore}</span>
                      <span>📏 {report.distance}</span>
                      <span>⚡ {report.avgSpeed}</span>
                    </div>
                  </div>
                  {/* Overall score */}
                  <div className="shrink-0 text-center">
                    <div className={`text-4xl font-black ${overallColor(report.overall)}`}>{report.overall}</div>
                    <div className="text-xs text-slate-400 font-bold">/ 100</div>
                  </div>
                  {/* Chevron */}
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
                </button>

                {/* ── Expanded Details ── */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="border-t border-slate-100 p-5 grid grid-cols-1 xl:grid-cols-3 gap-6">

                        {/* Radar + Progress Chart */}
                        <div className="xl:col-span-1 flex flex-col gap-4">
                          <div>
                            <p className="text-xs font-black text-slate-500 mb-2 uppercase tracking-wide">تحليل الجوانب الخمسة</p>
                            <ResponsiveContainer width="100%" height={200}>
                              <RadarChart data={radarData(report)}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                                <Radar dataKey="score" stroke={report.color} fill={report.color} fillOpacity={0.2} />
                              </RadarChart>
                            </ResponsiveContainer>
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-500 mb-2 uppercase tracking-wide">التقدم خلال الشهر</p>
                            <ResponsiveContainer width="100%" height={100}>
                              <LineChart data={report.weeklyProgress}>
                                <Line dataKey="score" stroke={report.color} strokeWidth={3} dot={{ r: 4, fill: report.color }} />
                                <XAxis dataKey="week" tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 11, fontWeight: 700 }} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Strengths & Weaknesses */}
                        <div className="space-y-4">
                          {/* GPS Stats */}
                          <div className="grid grid-cols-3 gap-3">
                            {[
                              { label: 'المسافة',    value: report.distance, icon: Navigation,  color: 'text-orange-600', bg: 'bg-orange-50' },
                              { label: 'السرعة',     value: report.avgSpeed,  icon: Zap,          color: 'text-blue-600',   bg: 'bg-blue-50' },
                              { label: 'الوقت',      value: report.duration,  icon: Clock,        color: 'text-rose-600',   bg: 'bg-rose-50' },
                            ].map(s => (
                              <div key={s.label} className={`${s.bg} rounded-xl p-3 text-center`}>
                                <s.icon className={`w-4 h-4 ${s.color} mx-auto mb-1`} />
                                <p className="text-[10px] font-bold text-slate-500">{s.label}</p>
                                <p className={`text-sm font-black ${s.color}`}>{s.value}</p>
                              </div>
                            ))}
                          </div>

                          <div>
                            <p className="text-xs font-black text-slate-700 mb-2 flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 text-green-500" />نقاط القوة
                            </p>
                            <div className="space-y-1.5">
                              {report.strengths.map((s, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm">
                                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                                  <span className="font-semibold text-slate-700">{s}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="text-xs font-black text-slate-700 mb-2 flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5 text-red-500" />نقاط الضعف
                            </p>
                            <div className="space-y-1.5">
                              {report.weaknesses.map((w, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm">
                                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                                  <span className="font-semibold text-slate-700">{w}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* AI Recommendation */}
                        <div className="space-y-4">
                          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <Brain className="w-4 h-4 text-indigo-600" />
                              <p className="text-sm font-black text-indigo-800">توصية الذكاء الاصطناعي</p>
                            </div>
                            <p className="text-sm text-indigo-700 font-semibold leading-relaxed">{report.recommendation}</p>
                          </div>

                          {/* Score bars */}
                          <div className="space-y-3">
                            {[
                              { label: 'أداء GPS الحركي',  value: report.gpsScore, color: '#8b5cf6' },
                              { label: 'الأداء الحركي',    value: report.motScore, color: '#3b82f6' },
                              { label: 'الأداء المعرفي',   value: report.cogScore, color: '#10b981' },
                              { label: 'نسبة النشاط',      value: report.activeRatio, color: '#f97316' },
                            ].map(bar => (
                              <div key={bar.label}>
                                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                                  <span>{bar.label}</span>
                                  <span>{bar.value}%</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${bar.value}%` }}
                                    transition={{ duration: 0.7 }}
                                    className="h-full rounded-full"
                                    style={{ backgroundColor: bar.color }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>

                          <Button size="sm" className="w-full bg-slate-900 text-white hover:bg-slate-800 font-bold text-sm gap-2">
                            <FileText className="w-3.5 h-3.5" />
                            تصدير تقرير {report.name}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
