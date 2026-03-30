import React, { useState } from 'react';
import { MapContainer, TileLayer, Circle, Tooltip } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Navigation, Zap, Calendar, TrendingUp, Flame, Map, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';

const HISTORY = [
  { id: 1, date: 'اليوم', type: 'جري حر', dist: 2.3, time: 1200, speed: 6.9, status: 'ممتاز', pos: [24.7140, 46.6760] as [number,number], intensity: 0.9 },
  { id: 2, date: 'أمس', type: 'تحدي الحديقة', dist: 3.0, time: 1320, speed: 8.5, status: 'جيد جداً', pos: [24.7125, 46.6740] as [number,number], intensity: 0.7 },
  { id: 3, date: 'قبل 2 يوم', type: 'مشي نشط', dist: 4.5, time: 3300, speed: 4.9, status: 'متوسط', pos: [24.7155, 46.6775] as [number,number], intensity: 0.4 },
  { id: 4, date: 'قبل 4 أيام', type: 'جري سريع', dist: 1.8, time: 900, speed: 12.0, status: 'ممتاز', pos: [24.7162, 46.6790] as [number,number], intensity: 1.0 },
  { id: 5, date: 'قبل 5 أيام', type: 'مشي', dist: 5.2, time: 3600, speed: 5.2, status: 'جيد', pos: [24.7110, 46.6720] as [number,number], intensity: 0.3 },
];

const WEEKLY: { day: string; dist: number; active: boolean }[] = [
  { day: 'السبت', dist: 5.2, active: true },
  { day: 'الأحد', dist: 3.0, active: true },
  { day: 'الاثنين', dist: 0, active: false },
  { day: 'الثلاثاء', dist: 4.5, active: true },
  { day: 'الأربعاء', dist: 1.8, active: true },
  { day: 'الخميس', dist: 2.3, active: true },
  { day: 'الجمعة', dist: 0, active: false },
];

const maxDist = Math.max(...WEEKLY.map(w => w.dist), 1);

const statusStyle: Record<string, string> = {
  'ممتاز': 'bg-green-500/15 text-green-400 border-green-500/30',
  'جيد جداً': 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  'جيد': 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  'متوسط': 'bg-orange-500/15 text-orange-400 border-orange-500/30',
};

const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

export const ActivityHeatmap = () => {
  const [view, setView] = useState<'history' | 'heatmap'>('heatmap');

  const totalDist = HISTORY.reduce((a, b) => a + b.dist, 0);
  const totalTime = HISTORY.reduce((a, b) => a + b.time, 0);
  const avgSpeed = HISTORY.reduce((a, b) => a + b.speed, 0) / HISTORY.length;

  return (
    <div className="space-y-5" dir="rtl">
      {/* Summary Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'المسافة الأسبوعية', value: `${totalDist.toFixed(1)} كم`, icon: Navigation, color: 'text-orange-400', bg: 'from-orange-500/10 to-transparent' },
          { label: 'وقت النشاط', value: `${Math.floor(totalTime / 3600)}س ${Math.floor((totalTime % 3600) / 60)}د`, icon: Clock, color: 'text-rose-400', bg: 'from-rose-500/10 to-transparent' },
          { label: 'متوسط السرعة', value: `${avgSpeed.toFixed(1)} كم/س`, icon: Zap, color: 'text-green-400', bg: 'from-green-500/10 to-transparent' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <Card className={`bg-gradient-to-br ${s.bg} border-white/5 shadow-lg`}>
              <CardContent className="p-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">{s.label}</p>
                  <p className={`text-lg font-black ${s.color}`}>{s.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Weekly Bar Chart */}
      <Card className="bg-slate-900/60 border-white/5">
        <CardHeader className="pb-3 border-b border-white/5">
          <CardTitle className="text-white font-black flex items-center gap-2 text-base">
            <BarChart3 className="w-5 h-5 text-blue-400" /> نشاط الأسبوع
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="flex items-end gap-2 h-28">
            {WEEKLY.map((w, i) => (
              <div key={i} className="flex flex-col items-center gap-1 flex-1">
                <span className="text-[9px] text-slate-400 font-bold">{w.dist > 0 ? `${w.dist}` : ''}</span>
                <motion.div
                  className={`w-full rounded-t-lg ${w.active ? 'bg-gradient-to-t from-orange-600 to-orange-400' : 'bg-white/5'}`}
                  initial={{ height: 0 }}
                  animate={{ height: w.dist > 0 ? `${(w.dist / maxDist) * 100}%` : '8px' }}
                  transition={{ duration: 0.8, delay: i * 0.05, ease: 'easeOut' }}
                />
                <span className="text-[10px] text-slate-500 font-bold">{w.day.slice(0, 3)}</span>
              </div>
            ))}
          </div>
          <p className="text-slate-500 text-xs font-bold text-center mt-3">المسافة اليومية (كم) — الأسبوع الحالي</p>
        </CardContent>
      </Card>

      {/* Toggle */}
      <div className="flex gap-2 bg-slate-900/50 p-1.5 rounded-2xl border border-white/5 w-full">
        {[
          { id: 'heatmap', label: 'خريطة الحرارة', icon: Map },
          { id: 'history', label: 'سجل التمارين', icon: Calendar },
        ].map(t => (
          <button key={t.id} onClick={() => setView(t.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${
              view === t.id ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Heatmap */}
      {view === 'heatmap' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="bg-slate-900/60 border-white/5 overflow-hidden">
            <CardHeader className="pb-3 border-b border-white/5">
              <CardTitle className="text-white font-black flex items-center gap-2 text-base">
                <Flame className="w-5 h-5 text-orange-400" /> خريطة الأماكن النشطة
              </CardTitle>
              <p className="text-slate-500 text-xs font-bold mt-1">المناطق الأكثر زيارة هذا الأسبوع</p>
            </CardHeader>
            <div style={{ height: 380 }}>
              <MapContainer center={[24.7136, 46.6753]} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='&copy; OpenStreetMap' />
                {HISTORY.map(h => (
                  <Circle key={h.id} center={h.pos}
                    radius={120}
                    pathOptions={{
                      fillColor: h.intensity > 0.7 ? '#ef4444' : h.intensity > 0.4 ? '#f97316' : '#eab308',
                      fillOpacity: h.intensity * 0.6,
                      color: 'transparent',
                    }}>
                    <Tooltip direction="top" permanent={false}>
                      <div dir="rtl" className="text-xs font-bold">{h.type} — {h.dist} كم</div>
                    </Tooltip>
                  </Circle>
                ))}
              </MapContainer>
            </div>
            <div className="p-4 border-t border-white/5 flex items-center justify-center gap-6">
              {[
                { color: 'bg-red-500', label: 'نشاط مرتفع' },
                { color: 'bg-orange-500', label: 'نشاط متوسط' },
                { color: 'bg-yellow-500', label: 'نشاط خفيف' },
              ].map((l, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${l.color}`} />
                  <span className="text-slate-400 text-xs font-bold">{l.label}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* History List */}
      {view === 'history' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="bg-slate-900/60 border-white/5">
            <CardHeader className="pb-3 border-b border-white/5">
              <CardTitle className="text-white font-black flex items-center gap-2 text-base">
                <Calendar className="w-5 h-5 text-blue-400" /> سجل النشاطات
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {HISTORY.map((item, i) => (
                  <motion.div key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    className="p-4 hover:bg-white/[0.03] transition-colors flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                        <TrendingUp className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-black text-white text-sm">{item.type}</h4>
                          <Badge variant="outline" className="text-[9px] border-white/10 text-slate-400 px-1.5 py-0">{item.date}</Badge>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500">
                          <span className="flex items-center gap-1"><Navigation className="w-3 h-3 text-orange-400/70" />{item.dist} كم</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-rose-400/70" />{fmt(item.time)}</span>
                          <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-blue-400/70" />{item.speed} كم/س</span>
                        </div>
                      </div>
                    </div>
                    <Badge className={`px-3 py-1 rounded-full font-bold text-xs border ${statusStyle[item.status] || ''}`}>
                      {item.status}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
