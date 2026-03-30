import React, { useState } from 'react';
import { MapContainer, TileLayer, Polyline, Circle, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Route, Plus, Trash2, Save, MapPin, Flag, Target, Zap,
  Users, Clock, Play, ChevronRight, Star, Award
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

interface Checkpoint {
  id: number;
  pos: [number, number];
  label: string;
  instruction: string;
}

interface TrainingRoute {
  id: string;
  name: string;
  level: string;
  target: string;
  distance: string;
  duration: string;
  checkpoints: Checkpoint[];
  color: string;
  assigned: number;
}

const PRESET_ROUTES: TrainingRoute[] = [
  {
    id: 'r1', name: 'مسار السرعة المكثف', level: 'متقدم', target: 'السرعة',
    distance: '3.5 كم', duration: '25 دقيقة', assigned: 8, color: '#3b82f6',
    checkpoints: [
      { id: 1, pos: [24.7136, 46.6753], label: 'البداية', instruction: 'الإحماء: ركض خفيف لمدة دقيقة' },
      { id: 2, pos: [24.7155, 46.6780], label: 'نقطة أ', instruction: 'ركض بأقصى سرعة 200 متر' },
      { id: 3, pos: [24.7175, 46.6810], label: 'نقطة ب', instruction: 'تمارين التنفس: 30 ثانية' },
      { id: 4, pos: [24.7195, 46.6845], label: 'النهاية', instruction: 'تمديد وتبريد 3 دقائق' },
    ],
  },
  {
    id: 'r2', name: 'مسار التحمل والمداومة', level: 'متوسط', target: 'التحمل',
    distance: '5 كم', duration: '40 دقيقة', assigned: 12, color: '#10b981',
    checkpoints: [
      { id: 1, pos: [24.7136, 46.6753], label: 'البداية', instruction: 'إحماء خفيف 5 دقائق' },
      { id: 2, pos: [24.7115, 46.6730], label: 'نقطة أ', instruction: 'مشي سريع 500 متر' },
      { id: 3, pos: [24.7100, 46.6710], label: 'نقطة ب', instruction: 'جري بإيقاع ثابت' },
      { id: 4, pos: [24.7136, 46.6753], label: 'العودة', instruction: 'تمارين التمدد الكاملة' },
    ],
  },
  {
    id: 'r3', name: 'مسار الرشاقة والتنسيق', level: 'مبتدئ', target: 'الرشاقة',
    distance: '2 كم', duration: '20 دقيقة', assigned: 6, color: '#f59e0b',
    checkpoints: [
      { id: 1, pos: [24.7136, 46.6753], label: 'البداية', instruction: 'إحماء + تمارين المرونة' },
      { id: 2, pos: [24.7148, 46.6770], label: 'نقطة أ', instruction: '10 قفزات استعراضية' },
      { id: 3, pos: [24.7158, 46.6760], label: 'النهاية', instruction: 'تقييم الرشاقة الختامي' },
    ],
  },
];

// Map click handler for route builder
function RouteBuilder({ points, setPoints }: { points: [number, number][], setPoints: (p: [number, number][]) => void }) {
  useMapEvents({
    click(e) {
      setPoints([...points, [e.latlng.lat, e.latlng.lng]]);
    },
  });
  return null;
}

export function GPSRouteBuilder() {
  const [activeRoute, setActiveRoute] = useState<TrainingRoute | null>(PRESET_ROUTES[0]);
  const [builderMode, setBuilderMode] = useState(false);
  const [drawnPoints, setDrawnPoints] = useState<[number, number][]>([]);
  const [newRouteName, setNewRouteName] = useState('');
  const [newRouteLevel, setNewRouteLevel] = useState('متوسط');
  const [newRouteTarget, setNewRouteTarget] = useState('السرعة');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    setBuilderMode(false);
    setDrawnPoints([]);
  };

  const levelColor = { 'مبتدئ': 'bg-green-100 text-green-700', 'متوسط': 'bg-yellow-100 text-yellow-700', 'متقدم': 'bg-red-100 text-red-700' };
  const targetColor = { 'السرعة': 'bg-blue-100 text-blue-700', 'التحمل': 'bg-green-100 text-green-700', 'الرشاقة': 'bg-orange-100 text-orange-700' };

  return (
    <div className="space-y-6">

      {/* ─ Controls Row ─ */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900">المسارات التدريبية</h2>
          <p className="text-sm text-slate-500 font-semibold">أنشئ وخصص مسارات الأنشطة الميدانية</p>
        </div>
        <Button
          onClick={() => { setBuilderMode(!builderMode); setDrawnPoints([]); }}
          className={`gap-2 font-bold ${builderMode ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
        >
          {builderMode ? (
            <><Trash2 className="w-4 h-4" />إلغاء الرسم</>
          ) : (
            <><Plus className="w-4 h-4" />رسم مسار جديد</>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ─ Route List ─ */}
        <div className="xl:col-span-1 space-y-3">
          {PRESET_ROUTES.map(route => (
            <motion.button
              key={route.id}
              onClick={() => { setActiveRoute(route); setBuilderMode(false); }}
              whileHover={{ scale: 1.01 }}
              className={`w-full text-right p-4 rounded-2xl border-2 transition-all shadow-sm ${
                activeRoute?.id === route.id
                  ? 'border-blue-500 bg-blue-50/50 shadow-blue-100 shadow-md'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm" style={{ backgroundColor: route.color + '20' }}>
                  <Route className="w-5 h-5" style={{ color: route.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="font-black text-sm text-slate-900">{route.name}</span>
                  </div>
                  <div className="flex gap-2 mb-2 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${(levelColor as any)[route.level]}`}>{route.level}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${(targetColor as any)[route.target]}`}>{route.target}</span>
                  </div>
                  <div className="flex gap-3 text-xs font-semibold text-slate-500">
                    <span>📏 {route.distance}</span>
                    <span>⏱ {route.duration}</span>
                    <span>👥 {route.assigned} تلاميذ</span>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 mt-1 transition-colors ${activeRoute?.id === route.id ? 'text-blue-500' : 'text-slate-300'}`} />
              </div>
            </motion.button>
          ))}
        </div>

        {/* ─ Map & Details ─ */}
        <div className="xl:col-span-2 space-y-4">
          {/* Builder inputs */}
          <AnimatePresence>
            {builderMode && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <Card className="border-blue-200 bg-blue-50/30 shadow-sm">
                  <CardContent className="p-4">
                    <p className="text-sm font-bold text-blue-700 mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      انقر على الخريطة لإضافة نقاط المسار ({drawnPoints.length} نقطة مضافة)
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        value={newRouteName}
                        onChange={e => setNewRouteName(e.target.value)}
                        placeholder="اسم المسار..."
                        className="px-3 py-2 rounded-xl border border-blue-200 bg-white text-sm font-semibold text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-400"
                      />
                      <select value={newRouteLevel} onChange={e => setNewRouteLevel(e.target.value)}
                        className="px-3 py-2 rounded-xl border border-blue-200 bg-white text-sm font-semibold text-slate-700 outline-none">
                        <option>مبتدئ</option><option>متوسط</option><option>متقدم</option>
                      </select>
                      <select value={newRouteTarget} onChange={e => setNewRouteTarget(e.target.value)}
                        className="px-3 py-2 rounded-xl border border-blue-200 bg-white text-sm font-semibold text-slate-700 outline-none">
                        <option>السرعة</option><option>التحمل</option><option>الرشاقة</option>
                      </select>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button onClick={handleSave} className="bg-green-600 text-white hover:bg-green-700 font-bold text-sm">
                        <Save className="w-4 h-4 ml-2" />حفظ المسار
                      </Button>
                      <Button onClick={() => setDrawnPoints([])} variant="outline" className="font-bold text-sm border-slate-200">
                        <Trash2 className="w-4 h-4 ml-2" />مسح النقاط
                      </Button>
                    </div>
                    {saved && (
                      <p className="text-green-600 text-sm font-bold mt-2">✅ تم حفظ المسار بنجاح!</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Map */}
          <Card className="border-slate-200 overflow-hidden shadow-md">
            <div style={{ height: 400 }}>
              <MapContainer
                center={[24.7155, 46.6780]}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  attribution="&copy; OpenStreetMap"
                />
                {builderMode && (
                  <RouteBuilder points={drawnPoints} setPoints={setDrawnPoints} />
                )}
                {/* Active route */}
                {!builderMode && activeRoute && (
                  <>
                    <Polyline
                      positions={activeRoute.checkpoints.map(cp => cp.pos)}
                      pathOptions={{ color: activeRoute.color, weight: 5, opacity: 0.9 }}
                    />
                    {activeRoute.checkpoints.map((cp, idx) => (
                      <React.Fragment key={cp.id}>
                        <Circle
                          center={cp.pos}
                          radius={30}
                          pathOptions={{ color: activeRoute.color, fillColor: activeRoute.color, fillOpacity: 0.25, weight: 2 }}
                        />
                        <Marker position={cp.pos}>
                          <Popup>
                            <div dir="rtl" className="text-right">
                              <p className="font-black text-slate-900 mb-1">{cp.label}</p>
                              <p className="text-xs text-slate-600">{cp.instruction}</p>
                            </div>
                          </Popup>
                        </Marker>
                      </React.Fragment>
                    ))}
                  </>
                )}
                {/* Drawn route */}
                {builderMode && drawnPoints.length > 1 && (
                  <Polyline
                    positions={drawnPoints}
                    pathOptions={{ color: '#3b82f6', weight: 4, dashArray: '8 4', opacity: 0.85 }}
                  />
                )}
                {builderMode && drawnPoints.map((p, i) => (
                  <Circle key={i} center={p} radius={20} pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.4 }} />
                ))}
              </MapContainer>
            </div>
          </Card>

          {/* Checkpoints List */}
          {!builderMode && activeRoute && (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Flag className="w-4 h-4 text-orange-500" />
                  نقاط التفتيش — {activeRoute.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {activeRoute.checkpoints.map((cp, idx) => (
                    <div key={cp.id} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-white text-sm shrink-0 shadow-sm"
                        style={{ backgroundColor: activeRoute.color }}>
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-900">{cp.label}</p>
                        <p className="text-xs text-slate-500 font-semibold mt-0.5">{cp.instruction}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-4">
                  <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700 font-bold text-sm gap-2">
                    <Play className="w-3.5 h-3.5" />إطلاق للتلاميذ
                  </Button>
                  <Button size="sm" variant="outline" className="font-bold text-sm gap-2 border-slate-200">
                    <Users className="w-3.5 h-3.5" />تخصيص المجموعة
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
