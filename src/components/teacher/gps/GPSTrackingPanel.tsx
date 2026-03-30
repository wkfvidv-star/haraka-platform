import React, { useState } from 'react';
import {
  MapContainer, TileLayer, Polyline, Marker, Popup, Circle, useMap
} from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Navigation, Activity, Timer, Zap, Users, User, ChevronDown,
  Satellite, TrendingUp, Eye, AlertTriangle, CheckCircle, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// ─── Mock Data ──────────────────────────────────────────────────────────────

const CLASS_OPTIONS = ['القسم 4أ', 'القسم 4ب', 'القسم 5أ', 'كل الأقسام'];

interface StudentTrack {
  id: string;
  name: string;
  class: string;
  avatar: string;
  status: 'active' | 'idle' | 'stopped';
  speed: number;
  distance: number;
  duration: number;
  score: number;
  route: [number, number][];
  currentPos: [number, number];
  color: string;
}

const MOCK_STUDENTS: StudentTrack[] = [
  {
    id: 'st1', name: 'ياسين محمود', class: 'القسم 4أ', avatar: 'ي',
    status: 'active', speed: 8.4, distance: 2.3, duration: 1240, score: 92,
    color: '#3b82f6',
    currentPos: [24.7148, 46.6765],
    route: [[24.7136, 46.6753], [24.7140, 46.6760], [24.7144, 46.6763], [24.7148, 46.6765]],
  },
  {
    id: 'st2', name: 'أمير طارق', class: 'القسم 4أ', avatar: 'أ',
    status: 'active', speed: 6.1, distance: 1.8, duration: 980, score: 78,
    color: '#10b981',
    currentPos: [24.7130, 46.6740],
    route: [[24.7120, 46.6730], [24.7126, 46.6735], [24.7130, 46.6740]],
  },
  {
    id: 'st3', name: 'سارة بوزيد', class: 'القسم 4ب', avatar: 'س',
    status: 'idle', speed: 0.5, distance: 0.8, duration: 600, score: 45,
    color: '#f59e0b',
    currentPos: [24.7160, 46.6780],
    route: [[24.7155, 46.6775], [24.7158, 46.6778], [24.7160, 46.6780]],
  },
  {
    id: 'st4', name: 'كريم معروف', class: 'القسم 4ب', avatar: 'ك',
    status: 'stopped', speed: 0, distance: 0.2, duration: 120, score: 22,
    color: '#ef4444',
    currentPos: [24.7170, 46.6800],
    route: [[24.7168, 46.6798], [24.7170, 46.6800]],
  },
  {
    id: 'st5', name: 'نور حمداني', class: 'القسم 5أ', avatar: 'ن',
    status: 'active', speed: 11.2, distance: 3.1, duration: 1560, score: 97,
    color: '#8b5cf6',
    currentPos: [24.7125, 46.6755],
    route: [[24.7110, 46.6740], [24.7116, 46.6745], [24.7120, 46.6750], [24.7125, 46.6755]],
  },
  {
    id: 'st6', name: 'بلال سعيد', class: 'القسم 5أ', avatar: 'ب',
    status: 'active', speed: 7.8, distance: 2.0, duration: 1100, score: 85,
    color: '#06b6d4',
    currentPos: [24.7142, 46.6790],
    route: [[24.7135, 46.6783], [24.7138, 46.6786], [24.7142, 46.6790]],
  },
];

const statusConfig = {
  active:  { label: 'نشط',     color: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500' },
  idle:    { label: 'خامل',    color: 'bg-yellow-100 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500' },
  stopped: { label: 'متوقف',  color: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' },
};

const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

// ─── Component ──────────────────────────────────────────────────────────────

export function GPSTrackingPanel() {
  const [selectedClass, setSelectedClass] = useState('كل الأقسام');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [viewMode, setViewMode] = useState<'all' | 'single'>('all');

  const filtered = selectedClass === 'كل الأقسام'
    ? MOCK_STUDENTS
    : MOCK_STUDENTS.filter(s => s.class === selectedClass);

  const displayStudents = viewMode === 'single' && selectedStudent
    ? filtered.filter(s => s.id === selectedStudent)
    : filtered;

  const activeCount   = filtered.filter(s => s.status === 'active').length;
  const idleCount     = filtered.filter(s => s.status === 'idle').length;
  const stoppedCount  = filtered.filter(s => s.status === 'stopped').length;

  const mapCenter: [number, number] = [24.7145, 46.6765];

  return (
    <div className="space-y-6">
      {/* ─ Stats Bar ─ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي التلاميذ', value: filtered.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
          { label: 'نشطون الآن',       value: activeCount,    icon: Activity, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
          { label: 'خاملون',           value: idleCount,      icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
          { label: 'متوقفون',          value: stoppedCount,   icon: TrendingUp, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card className={`border ${s.border} shadow-sm`}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 mb-0.5">{s.label}</p>
                  <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ─ Map Panel ─ */}
        <div className="xl:col-span-2 space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Class filter */}
            <div className="relative">
              <button
                onClick={() => setShowClassDropdown(!showClassDropdown)}
                className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
              >
                <Users className="w-4 h-4 text-blue-500" />
                {selectedClass}
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
              <AnimatePresence>
                {showClassDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="absolute top-full mt-1 right-0 bg-white rounded-xl border border-slate-200 shadow-xl z-20 overflow-hidden min-w-[160px]"
                  >
                    {CLASS_OPTIONS.map(cls => (
                      <button key={cls} onClick={() => { setSelectedClass(cls); setShowClassDropdown(false); setSelectedStudent(null); setViewMode('all'); }}
                        className={`w-full text-right px-4 py-3 text-sm font-semibold transition-colors ${cls === selectedClass ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'}`}>
                        {cls}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* View mode */}
            <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
              <button onClick={() => { setViewMode('all'); setSelectedStudent(null); }}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'all' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>
                <Users className="w-4 h-4 inline ml-1.5" />عرض الكل
              </button>
              <button onClick={() => setViewMode('single')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'single' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>
                <User className="w-4 h-4 inline ml-1.5" />تلميذ واحد
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mr-auto">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              تحديث مباشر
            </div>
          </div>

          {/* Map */}
          <Card className="border-slate-200 overflow-hidden shadow-md">
            <div style={{ height: 460 }}>
              <MapContainer center={mapCenter} zoom={15} style={{ height: '100%', width: '100%' }} zoomControl={true}>
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  attribution="&copy; OpenStreetMap"
                />
                {displayStudents.map(student => (
                  <React.Fragment key={student.id}>
                    <Polyline
                      positions={student.route}
                      pathOptions={{ color: student.color, weight: 4, opacity: 0.85 }}
                    />
                    <Circle
                      center={student.currentPos}
                      radius={25}
                      pathOptions={{ color: student.color, fillColor: student.color, fillOpacity: 0.3, weight: 2 }}
                    />
                    <Marker position={student.currentPos}>
                      <Popup>
                        <div dir="rtl" className="text-right min-w-[160px]">
                          <p className="font-black text-slate-900 mb-1">{student.name}</p>
                          <p className="text-xs text-slate-500 mb-2">{student.class}</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <span className="font-bold text-blue-600">{student.speed} كم/س</span>
                            <span className="font-bold text-green-600">{student.distance} كم</span>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  </React.Fragment>
                ))}
              </MapContainer>
            </div>
            {/* Legend */}
            <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex flex-wrap gap-3">
              {displayStudents.map(s => (
                <button key={s.id} onClick={() => { setSelectedStudent(s.id); setViewMode('single'); }}
                  className={`flex items-center gap-2 text-xs font-bold rounded-lg px-3 py-1.5 border transition-all ${selectedStudent === s.id ? 'border-blue-300 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                  {s.name}
                  <div className={`w-1.5 h-1.5 rounded-full ${statusConfig[s.status].dot}`} />
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* ─ Student List Panel ─ */}
        <div className="xl:col-span-1">
          <Card className="border-slate-200 shadow-sm h-full">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base font-black text-slate-900 flex items-center gap-2">
                <Satellite className="w-4 h-4 text-blue-500" />
                بيانات التلاميذ اللحظية
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 max-h-[480px] overflow-y-auto">
                {filtered
                  .sort((a, b) => b.score - a.score)
                  .map((student, idx) => {
                  const cfg = statusConfig[student.status];
                  return (
                    <motion.button
                      key={student.id}
                      onClick={() => { setSelectedStudent(student.id); setViewMode('single'); }}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className={`w-full text-right p-4 hover:bg-slate-50 transition-colors flex items-center gap-3 ${selectedStudent === student.id ? 'bg-blue-50/50' : ''}`}
                    >
                      {/* Rank */}
                      <div className="text-xs font-black text-slate-400 w-5 shrink-0">#{idx + 1}</div>
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm shrink-0 shadow-sm"
                        style={{ backgroundColor: student.color }}>
                        {student.avatar}
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-sm text-slate-900 truncate">{student.name}</span>
                          <Badge className={`text-[9px] px-1.5 py-0 border rounded-full ${cfg.color}`}>
                            <span className={`w-1 h-1 rounded-full ${cfg.dot} inline-block ml-1`} />
                            {cfg.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500">
                          <span>{student.speed} كم/س</span>
                          <span>·</span>
                          <span>{student.distance} كم</span>
                          <span>·</span>
                          <span>{fmt(student.duration)}</span>
                        </div>
                      </div>
                      {/* Score */}
                      <div className={`text-lg font-black shrink-0 ${student.score >= 80 ? 'text-green-600' : student.score >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                        {student.score}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ─ Comparison Bar ─ */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-base font-black text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-500" />
            مقارنة أداء المسافة المقطوعة
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {[...filtered].sort((a, b) => b.distance - a.distance).map(student => {
              const maxDist = Math.max(...filtered.map(s => s.distance), 1);
              const pct = (student.distance / maxDist) * 100;
              return (
                <div key={student.id} className="flex items-center gap-4">
                  <div className="w-24 text-sm font-bold text-slate-700 text-right truncate shrink-0">{student.name}</div>
                  <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: student.color }}
                    />
                  </div>
                  <div className="text-sm font-black text-slate-700 w-14 text-left shrink-0">{student.distance} كم</div>
                  <div className={`text-xs font-bold px-2 py-0.5 rounded-full ${student.distance >= 2.5 ? 'bg-green-100 text-green-700' : student.distance >= 1 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                    {student.distance >= 2.5 ? 'ممتاز' : student.distance >= 1 ? 'متوسط' : 'ضعيف'}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
