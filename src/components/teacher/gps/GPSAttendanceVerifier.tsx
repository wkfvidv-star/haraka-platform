import React, { useState } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin, CheckCircle, XCircle, Clock, Users, Calendar,
  Navigation, AlertTriangle, Download, Filter
} from 'lucide-react';
import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface AttendanceRecord {
  id: string;
  name: string;
  class: string;
  avatar: string;
  status: 'present' | 'absent' | 'late' | 'nearby';
  arrivalTime: string;
  departureTime: string;
  distance: number; // meters from activity zone
  pos: [number, number] | null;
}

const ACTIVITY_CENTER: [number, number] = [24.7150, 46.6770];
const RADIUS_M = 150; // meters

const ATTENDANCE: AttendanceRecord[] = [
  { id: 'st1', name: 'ياسين محمود',  class: 'القسم 4أ', avatar: 'ي', status: 'present', arrivalTime: '09:05', departureTime: '--:--', distance: 42,  pos: [24.7152, 46.6773] },
  { id: 'st2', name: 'نور حمداني',   class: 'القسم 5أ', avatar: 'ن', status: 'present', arrivalTime: '09:03', departureTime: '--:--', distance: 68,  pos: [24.7147, 46.6768] },
  { id: 'st3', name: 'بلال سعيد',    class: 'القسم 5أ', avatar: 'ب', status: 'late',    arrivalTime: '09:17', departureTime: '--:--', distance: 95,  pos: [24.7155, 46.6780] },
  { id: 'st4', name: 'أمير طارق',    class: 'القسم 4أ', avatar: 'أ', status: 'nearby',  arrivalTime: '--:--', departureTime: '--:--', distance: 185, pos: [24.7135, 46.6755] },
  { id: 'st5', name: 'سارة بوزيد',   class: 'القسم 4ب', avatar: 'س', status: 'absent',  arrivalTime: '--:--', departureTime: '--:--', distance: 999, pos: null },
  { id: 'st6', name: 'كريم معروف',   class: 'القسم 4ب', avatar: 'ك', status: 'absent',  arrivalTime: '--:--', departureTime: '--:--', distance: 999, pos: null },
  { id: 'st7', name: 'ليلى براهيمي', class: 'القسم 4أ', avatar: 'ل', status: 'present', arrivalTime: '09:02', departureTime: '--:--', distance: 30,  pos: [24.7150, 46.6771] },
  { id: 'st8', name: 'رضا سليماني',  class: 'القسم 5أ', avatar: 'ر', status: 'late',    arrivalTime: '09:20', departureTime: '--:--', distance: 110, pos: [24.7160, 46.6785] },
];

const statusCfg = {
  present: { label: 'حاضر',  color: 'bg-green-50 text-green-700 border-green-200', dot: 'bg-green-500', icon: CheckCircle,  iconColor: 'text-green-500' },
  absent:  { label: 'غائب',  color: 'bg-red-50 text-red-700 border-red-200',       dot: 'bg-red-500',   icon: XCircle,      iconColor: 'text-red-500' },
  late:    { label: 'متأخر', color: 'bg-yellow-50 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500', icon: Clock,    iconColor: 'text-yellow-500' },
  nearby:  { label: 'قريب', color: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-500', icon: Navigation, iconColor: 'text-orange-500' },
};

const markerColor = (status: string) => {
  const colors: Record<string, string> = { present: '#22c55e', absent: '#ef4444', late: '#f59e0b', nearby: '#f97316' };
  return colors[status] || '#94a3b8';
};

export function GPSAttendanceVerifier() {
  const [filter, setFilter] = useState<'all' | 'present' | 'absent' | 'late'>('all');

  const displayed = filter === 'all' ? ATTENDANCE : ATTENDANCE.filter(s => s.status === filter);
  const presentCount = ATTENDANCE.filter(s => s.status === 'present').length;
  const absentCount  = ATTENDANCE.filter(s => s.status === 'absent').length;
  const lateCount    = ATTENDANCE.filter(s => s.status === 'late').length;
  const nearbyCount  = ATTENDANCE.filter(s => s.status === 'nearby').length;

  return (
    <div className="space-y-6">

      {/* ─ Stats ─ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'حاضرون',  value: presentCount, color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200',  icon: CheckCircle },
          { label: 'غائبون',  value: absentCount,  color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200',    icon: XCircle },
          { label: 'متأخرون', value: lateCount,    color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', icon: Clock },
          { label: 'قريب من المنطقة', value: nearbyCount, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', icon: Navigation },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card className={`border ${s.border} shadow-sm`}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500">{s.label}</p>
                  <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* ─ Map ─ */}
        <div className="xl:col-span-3">
          <Card className="border-slate-200 overflow-hidden shadow-md">
            <CardHeader className="py-3 px-4 border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-sm font-black text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500" />
                خريطة الحضور بالموقع الجغرافي
                <Badge variant="outline" className="text-[10px] border-slate-200 text-slate-500 mr-auto">
                  نطاق المنطقة: {RADIUS_M} م
                </Badge>
              </CardTitle>
            </CardHeader>
            <div style={{ height: 400 }}>
              <MapContainer center={ACTIVITY_CENTER} zoom={16} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" attribution="&copy; OpenStreetMap" />
                {/* Activity zone */}
                <Circle
                  center={ACTIVITY_CENTER}
                  radius={RADIUS_M}
                  pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.08, weight: 2, dashArray: '6 4' }}
                />
                {/* Students */}
                {ATTENDANCE.filter(s => s.pos).map(student => (
                  <React.Fragment key={student.id}>
                    <Circle
                      center={student.pos!}
                      radius={18}
                      pathOptions={{ color: markerColor(student.status), fillColor: markerColor(student.status), fillOpacity: 0.7, weight: 2 }}
                    />
                    <Marker position={student.pos!}>
                      <Popup>
                        <div dir="rtl" className="text-right min-w-[150px]">
                          <p className="font-black text-slate-900 mb-1">{student.name}</p>
                          <p className="text-xs text-slate-500 mb-2">{student.class}</p>
                          <div className="space-y-1 text-xs">
                            <p><span className="font-bold">الحالة:</span> {statusCfg[student.status].label}</p>
                            <p><span className="font-bold">وقت الوصول:</span> {student.arrivalTime}</p>
                            <p><span className="font-bold">المسافة:</span> {student.distance} م</p>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  </React.Fragment>
                ))}
              </MapContainer>
            </div>
            {/* Legend */}
            <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex flex-wrap gap-4">
              {Object.entries(statusCfg).map(([key, cfg]) => (
                <div key={key} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${cfg.dot}`} />
                  <span className="text-xs font-bold text-slate-600">{cfg.label}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 mr-auto">
                <div className="w-3 h-3 rounded-full border-2 border-blue-400 border-dashed bg-transparent" />
                <span className="text-xs font-bold text-slate-500">منطقة النشاط</span>
              </div>
            </div>
          </Card>
        </div>

        {/* ─ Attendance Table ─ */}
        <div className="xl:col-span-2">
          <Card className="border-slate-200 shadow-sm h-full">
            <CardHeader className="py-3 px-4 border-b border-slate-100">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-500" />
                  كشف الحضور GPS
                </CardTitle>
                <Button size="sm" variant="outline" className="h-7 text-xs font-bold border-slate-200 gap-1">
                  <Download className="w-3 h-3" />تصدير
                </Button>
              </div>
              {/* Filter */}
              <div className="flex gap-1 mt-2 bg-slate-100 rounded-lg p-0.5">
                {['all', 'present', 'absent', 'late'].map(f => (
                  <button key={f} onClick={() => setFilter(f as any)}
                    className={`flex-1 py-1 rounded-md text-[10px] font-bold transition-all ${filter === f ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>
                    {f === 'all' ? 'الكل' : f === 'present' ? 'حاضر' : f === 'absent' ? 'غائب' : 'متأخر'}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto">
                {displayed.map((student, idx) => {
                  const cfg = statusCfg[student.status];
                  const Icon = cfg.icon;
                  return (
                    <motion.div key={student.id}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.04 }}
                      className="p-3.5 flex items-center gap-3">
                      {/* Avatar */}
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 text-white`}
                        style={{ backgroundColor: markerColor(student.status) }}>
                        {student.avatar}
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-bold text-sm text-slate-900 truncate">{student.name}</span>
                          <Badge className={`text-[9px] px-1.5 py-0 border rounded-full ${cfg.color}`}>
                            {cfg.label}
                          </Badge>
                        </div>
                        <div className="flex gap-3 text-[11px] font-semibold text-slate-500">
                          <span>🕐 {student.arrivalTime}</span>
                          {student.status !== 'absent' && <span>📍 {student.distance === 999 ? '--' : `${student.distance} م`}</span>}
                        </div>
                      </div>
                      {/* Status icon */}
                      <Icon className={`w-4 h-4 shrink-0 ${cfg.iconColor}`} />
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
