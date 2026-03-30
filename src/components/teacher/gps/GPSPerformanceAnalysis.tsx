import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Activity, TrendingUp, TrendingDown, Zap, Clock, Award, BarChart3,
  ChevronUp, ChevronDown, Minus, AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend
} from 'recharts';

// ── Mock Data ──────────────────────────────────────────────────────────────

const STUDENTS_PERF = [
  { name: 'نور حمداني',  speed: 11.2, stability: 88, stops: 1, avgPace: 5.4, score: 97, trend: 'up' },
  { name: 'ياسين محمود', speed: 8.4,  stability: 75, stops: 2, avgPace: 7.1, score: 92, trend: 'up' },
  { name: 'بلال سعيد',   speed: 7.8,  stability: 70, stops: 3, avgPace: 7.7, score: 85, trend: 'stable' },
  { name: 'أمير طارق',   speed: 6.1,  stability: 60, stops: 4, avgPace: 9.8, score: 78, trend: 'down' },
  { name: 'سارة بوزيد',  speed: 3.2,  stability: 35, stops: 9, avgPace: 18.7, score: 45, trend: 'down' },
  { name: 'كريم معروف',  speed: 1.0,  stability: 10, stops: 14, avgPace: 60, score: 22, trend: 'down' },
];

const SPEED_TIMELINE = [
  { time: '0:00', 'نور': 0, 'ياسين': 0, 'بلال': 0 },
  { time: '2:00', 'نور': 7, 'ياسين': 5, 'بلال': 6 },
  { time: '4:00', 'نور': 10, 'ياسين': 8, 'بلال': 7 },
  { time: '6:00', 'نور': 12, 'ياسين': 9, 'بلال': 8.5 },
  { time: '8:00', 'نور': 11, 'ياسين': 7, 'بلال': 7 },
  { time: '10:00', 'نور': 13, 'ياسين': 8.5, 'بلال': 9 },
  { time: '12:00', 'نور': 10, 'ياسين': 6, 'بلال': 7.5 },
];

const RADAR_DATA = [
  { metric: 'السرعة',     'نور': 97, 'ياسين': 84, 'أمير': 61 },
  { metric: 'الاستقرار', 'نور': 88, 'ياسين': 75, 'أمير': 60 },
  { metric: 'المداومة',  'نور': 95, 'ياسين': 80, 'أمير': 55 },
  { metric: 'التفاعل',   'نور': 90, 'ياسين': 88, 'أمير': 50 },
  { metric: 'الدقة',     'نور': 92, 'ياسين': 70, 'أمير': 65 },
];

const ACTIVITY_BREAKDOWN = [
  { name: 'سرعة عالية', نور: 35, ياسين: 22, بلال: 18, fill: '#6366f1' },
  { name: 'جري',       نور: 45, ياسين: 48, بلال: 42, fill: '#10b981' },
  { name: 'مشي',       نور: 15, ياسين: 20, بلال: 30, fill: '#f59e0b' },
  { name: 'خمول',      نور: 5,  ياسين: 10, بلال: 10, fill: '#ef4444' },
];

const trendIcon = (t: string) => {
  if (t === 'up')     return <ChevronUp className="w-4 h-4 text-green-500" />;
  if (t === 'down')   return <ChevronDown className="w-4 h-4 text-red-500" />;
  return <Minus className="w-4 h-4 text-slate-400" />;
};

const scoreColor = (s: number) =>
  s >= 85 ? 'text-green-600' : s >= 60 ? 'text-yellow-500' : 'text-red-500';

// ── Component ──────────────────────────────────────────────────────────────

export function GPSPerformanceAnalysis() {
  const [chartView, setChartView] = useState<'speed' | 'radar' | 'activity'>('speed');

  return (
    <div className="space-y-6">

      {/* ─ Header KPIs ─ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'متوسط السرعة',   value: '6.5 كم/س', icon: Zap,      color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200' },
          { label: 'متوسط التوقفات', value: '5.5 توقف', icon: Clock,    color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
          { label: 'أعلى درجة',     value: '97 / 100', icon: Award,    color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200' },
          { label: 'تحتاج تدخل',    value: '2 تلاميذ', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50',    border: 'border-red-200' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card className={`border ${s.border} shadow-sm`}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500">{s.label}</p>
                  <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* ─ Rankings Table ─ */}
        <div className="xl:col-span-2">
          <Card className="border-slate-200 shadow-sm h-full">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base font-black text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-500" />
                ترتيب التلاميذ حسب الأداء
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {STUDENTS_PERF.map((s, idx) => (
                  <motion.div key={s.name}
                    initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                    className="p-4 flex items-center gap-3"
                  >
                    {/* Rank Badge */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0 ${
                      idx === 0 ? 'bg-yellow-400 text-yellow-900' :
                      idx === 1 ? 'bg-slate-300 text-slate-700' :
                      idx === 2 ? 'bg-amber-600 text-white' :
                      'bg-slate-100 text-slate-500'
                    }`}>{idx + 1}</div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-slate-900 truncate">{s.name}</span>
                        {trendIcon(s.trend)}
                      </div>
                      <div className="flex gap-3 text-[11px] font-semibold text-slate-500">
                        <span>⚡ {s.speed} كم/س</span>
                        <span>⏸ {s.stops} توقفات</span>
                        <span>📊 {s.stability}%</span>
                      </div>
                    </div>
                    {/* Score */}
                    <div className={`text-xl font-black shrink-0 ${scoreColor(s.score)}`}>{s.score}</div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ─ Charts Panel ─ */}
        <div className="xl:col-span-3 space-y-4">
          {/* Toggle */}
          <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
            {[
              { id: 'speed',    label: 'السرعة عبر الزمن' },
              { id: 'radar',    label: 'المقارنة الشاملة' },
              { id: 'activity', label: 'تفصيل النشاط' },
            ].map(tab => (
              <button key={tab.id} onClick={() => setChartView(tab.id as any)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${chartView === tab.id ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>
                {tab.label}
              </button>
            ))}
          </div>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-5">
              {chartView === 'speed' && (
                <div>
                  <h3 className="text-sm font-black text-slate-700 mb-4">تطور السرعة خلال النشاط (كم/س)</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={SPEED_TIMELINE}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="time" tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} />
                      <YAxis tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} />
                      <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12, fontWeight: 700 }} />
                      <Legend />
                      <Line dataKey="نور"   stroke="#8b5cf6" strokeWidth={3} dot={false} />
                      <Line dataKey="ياسين" stroke="#3b82f6" strokeWidth={3} dot={false} />
                      <Line dataKey="بلال"  stroke="#06b6d4" strokeWidth={3} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {chartView === 'radar' && (
                <div>
                  <h3 className="text-sm font-black text-slate-700 mb-4">تحليل شامل للمهارات الحركية</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <RadarChart data={RADAR_DATA}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }} />
                      <Radar name="نور"   dataKey="نور"   stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
                      <Radar name="ياسين" dataKey="ياسين" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                      <Radar name="أمير"  dataKey="أمير"  stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {chartView === 'activity' && (
                <div>
                  <h3 className="text-sm font-black text-slate-700 mb-4">توزيع النشاط الحركي بالنسبة المئوية</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={ACTIVITY_BREAKDOWN}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} />
                      <YAxis tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} />
                      <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12, fontWeight: 700 }} />
                      <Legend />
                      <Bar dataKey="نور"   fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="ياسين" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="بلال"  fill="#06b6d4" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ─ Underperformers ─ */}
      <Card className="border-red-100 shadow-sm bg-red-50/30">
        <CardHeader className="pb-3 border-b border-red-100">
          <CardTitle className="text-base font-black text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            التلاميذ الذين يحتاجون متابعة عاجلة
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {STUDENTS_PERF.filter(s => s.score < 60).map(student => (
              <div key={student.name} className="bg-white border border-red-200 rounded-xl p-4 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                  <span className="text-red-600 font-black text-sm">{student.name.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-slate-900">{student.name}</span>
                    <span className="text-xl font-black text-red-600">{student.score}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-500">
                      <span>استقرار السرعة</span>
                      <span>{student.stability}%</span>
                    </div>
                    <div className="h-2 bg-red-100 rounded-full overflow-hidden">
                      <div className="h-full bg-red-400 rounded-full" style={{ width: `${student.stability}%` }} />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      ⏸ {student.stops} توقفات مسجلة — {student.speed < 2 ? 'لا حركة فعلية' : 'نشاط ضعيف جداً'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
