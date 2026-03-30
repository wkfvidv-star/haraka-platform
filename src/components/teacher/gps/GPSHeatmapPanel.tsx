import React, { useState } from 'react';
import { MapContainer, TileLayer, Circle, Tooltip } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, BarChart3, Map, TrendingUp, Info, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
  ResponsiveContainer, Cell
} from 'recharts';
import 'leaflet/dist/leaflet.css';

// Activity hotspots (simulated collective GPS data)
const HOTSPOTS = [
  { pos: [24.7148, 46.6765] as [number, number], intensity: 0.95, visits: 28, zone: 'ملعب المدرسة',   type: 'رياضي' },
  { pos: [24.7130, 46.6745] as [number, number], intensity: 0.75, visits: 18, zone: 'حديقة الحي',     type: 'ترفيهي' },
  { pos: [24.7165, 46.6785] as [number, number], intensity: 0.55, visits: 12, zone: 'المسار الجبلي',  type: 'تحمل' },
  { pos: [24.7110, 46.6725] as [number, number], intensity: 0.35, visits: 7,  zone: 'الطريق الخلفي', type: 'مشي' },
  { pos: [24.7175, 46.6800] as [number, number], intensity: 0.20, visits: 4,  zone: 'المنطقة الشمالية', type: 'استكشاف' },
  { pos: [24.7140, 46.6800] as [number, number], intensity: 0.60, visits: 14, zone: 'ساحة التمارين', type: 'رياضي' },
];

const WEEKLY_DATA = [
  { day: 'السبت',    dist: 18.4, students: 24 },
  { day: 'الأحد',    dist: 22.1, students: 26 },
  { day: 'الاثنين',  dist: 8.5,  students: 14 },
  { day: 'الثلاثاء', dist: 25.3, students: 28 },
  { day: 'الأربعاء', dist: 19.7, students: 22 },
  { day: 'الخميس',  dist: 28.0, students: 28 },
  { day: 'الجمعة',   dist: 0,    students: 0 },
];

const ZONE_BREAKDOWN = [
  { zone: 'ملعب المدرسة',    pct: 35, color: '#ef4444' },
  { zone: 'حديقة الحي',      pct: 25, color: '#f97316' },
  { zone: 'ساحة التمارين',   pct: 22, color: '#f59e0b' },
  { zone: 'المسار الجبلي',   pct: 12, color: '#22c55e' },
  { zone: 'مناطق أخرى',      pct: 6,  color: '#94a3b8' },
];

const heatColor = (intensity: number) => {
  if (intensity > 0.8) return '#ef4444';
  if (intensity > 0.6) return '#f97316';
  if (intensity > 0.4) return '#f59e0b';
  return '#eab308';
};

const maxDist = Math.max(...WEEKLY_DATA.map(d => d.dist));

export function GPSHeatmapPanel() {
  const [view, setView] = useState<'heatmap' | 'analysis'>('heatmap');
  const [selectedHotspot, setSelectedHotspot] = useState<typeof HOTSPOTS[0] | null>(null);

  const totalVisits    = HOTSPOTS.reduce((a, h) => a + h.visits, 0);
  const avgDailyDist   = (WEEKLY_DATA.reduce((a, d) => a + d.dist, 0) / WEEKLY_DATA.filter(d => d.dist > 0).length).toFixed(1);
  const peakDay        = WEEKLY_DATA.reduce((a, b) => (b.dist > a.dist ? b : a));
  const unusedZones    = HOTSPOTS.filter(h => h.intensity < 0.3).length;

  return (
    <div className="space-y-6">

      {/* ─ Summary Cards ─ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي الزيارات',   value: totalVisits,       color: 'text-red-600',   bg: 'bg-red-50',   border: 'border-red-200',   icon: Flame },
          { label: 'متوسط المسافة اليومية', value: `${avgDailyDist} كم`, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', icon: TrendingUp },
          { label: 'أكثر يوم نشاطاً',   value: peakDay.day,       color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', icon: BarChart3 },
          { label: 'مناطق غير مستغلة', value: unusedZones,        color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200', icon: Map },
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

      {/* ─ Toggle ─ */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {[
          { id: 'heatmap', label: '🗺️ خريطة النشاط الحراري' },
          { id: 'analysis', label: '📊 تحليل التوزيع الأسبوعي' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setView(tab.id as any)}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${view === tab.id ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {view === 'heatmap' && (
          <motion.div key="heatmap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* Map */}
            <div className="xl:col-span-2">
              <Card className="border-slate-200 overflow-hidden shadow-md">
                <CardHeader className="py-3 px-4 border-b border-slate-100 bg-slate-50/50">
                  <CardTitle className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-500" />
                    خريطة المناطق الأكثر نشاطاً — القسم كاملاً
                  </CardTitle>
                </CardHeader>
                <div style={{ height: 400 }}>
                  <MapContainer center={[24.7148, 46.6770]} zoom={15} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" attribution="&copy; OpenStreetMap" />
                    {HOTSPOTS.map((h, idx) => (
                      <Circle
                        key={idx}
                        center={h.pos}
                        radius={100 + h.intensity * 80}
                        pathOptions={{
                          fillColor: heatColor(h.intensity),
                          fillOpacity: h.intensity * 0.55,
                          color: heatColor(h.intensity),
                          weight: 1,
                          opacity: 0.6,
                        }}
                        eventHandlers={{ click: () => setSelectedHotspot(h) }}
                      >
                        <Tooltip direction="top" permanent={h.intensity > 0.7}>
                          <div dir="rtl" className="text-xs font-bold">
                            {h.zone} — {h.visits} زيارة
                          </div>
                        </Tooltip>
                      </Circle>
                    ))}
                  </MapContainer>
                </div>
                {/* Legend */}
                <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex flex-wrap gap-4">
                  {[
                    { color: 'bg-red-500',    label: 'نشاط مرتفع جداً' },
                    { color: 'bg-orange-500', label: 'نشاط مرتفع' },
                    { color: 'bg-yellow-500', label: 'نشاط متوسط' },
                    { color: 'bg-yellow-300', label: 'نشاط خفيف' },
                  ].map((l, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${l.color}`} />
                      <span className="text-xs font-bold text-slate-600">{l.label}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Hotspot Details + Zone Breakdown */}
            <div className="space-y-4">
              {/* Selected hotspot */}
              <AnimatePresence>
                {selectedHotspot && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <Card className="border-orange-200 bg-orange-50/40 shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                            <Flame className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <p className="font-black text-sm text-slate-900">{selectedHotspot.zone}</p>
                            <Badge className="mt-1 text-[10px] bg-orange-100 text-orange-700 border-orange-200 border px-2 py-0 rounded-full">
                              {selectedHotspot.type}
                            </Badge>
                            <div className="mt-2 space-y-1 text-xs font-semibold text-slate-600">
                              <p>👥 {selectedHotspot.visits} زيارة من التلاميذ</p>
                              <p>🔥 شدة النشاط: {Math.round(selectedHotspot.intensity * 100)}%</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Zone breakdown */}
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3 border-b border-slate-100">
                  <CardTitle className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-500" />
                    توزيع النشاط على المناطق
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {ZONE_BREAKDOWN.map((z, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                        <span>{z.zone}</span>
                        <span>{z.pct}%</span>
                      </div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${z.pct}%` }}
                          transition={{ duration: 0.8, delay: i * 0.07 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: z.color }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Unused zones */}
              <Card className="border-slate-200 bg-slate-50/50 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-black text-slate-700 mb-1">المناطق غير المستغلة</p>
                      <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                        {unusedZones} مناطق بنشاط منخفض. يمكنك تصميم مسارات جديدة تمر بها لتوسيع نطاق النشاط.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {view === 'analysis' && (
          <motion.div key="analysis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 xl:grid-cols-2 gap-6">

            {/* Weekly bar chart */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-black text-slate-900">المسافة الإجمالية اليومية للقسم (كم)</CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={WEEKLY_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} />
                    <YAxis tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} />
                    <RTooltip
                      contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12, fontWeight: 700 }}
                      formatter={(v: any) => [`${v} كم`, 'المسافة']}
                    />
                    <Bar dataKey="dist" radius={[6, 6, 0, 0]}>
                      {WEEKLY_DATA.map((entry, index) => (
                        <Cell key={index} fill={entry.day === peakDay.day ? '#f97316' : '#3b82f6'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Students participation per day */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-black text-slate-900">عدد التلاميذ النشطين يومياً</CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="space-y-3">
                  {WEEKLY_DATA.map((d, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-600 w-16 text-right shrink-0">{d.day}</span>
                      <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(d.students / 28) * 100}%` }}
                          transition={{ duration: 0.7, delay: i * 0.07, ease: 'easeOut' }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: d.students === peakDay.students ? '#f97316' : '#6366f1' }}
                        />
                      </div>
                      <span className={`text-sm font-black w-12 text-left shrink-0 ${d.students === 0 ? 'text-slate-300' : 'text-slate-700'}`}>
                        {d.students > 0 ? `${d.students} 👥` : 'عطلة'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
