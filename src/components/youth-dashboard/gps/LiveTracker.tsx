import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play, Square, Navigation, Activity, Zap, Flame, Crosshair,
  AlertTriangle, CheckCircle2, TrendingUp, Timer, MapPin, Target,
  Shield, Phone, Bell, ArrowRight, ArrowLeft, ArrowUp, ChevronUp
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

function AutoCenter({ position, isTracking }: { position: [number, number]; isTracking: boolean }) {
  const map = useMap();
  useEffect(() => { if (isTracking) map.setView(position, map.getZoom()); }, [position, isTracking, map]);
  return null;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const CHECKPOINTS: { id: number; pos: [number, number]; label: string; exercise: string; reached: boolean }[] = [
  { id: 1, pos: [24.7150, 46.6780], label: 'نقطة أ', exercise: '10 قفزات', reached: false },
  { id: 2, pos: [24.7165, 46.6810], label: 'نقطة ب', exercise: 'ركض مكاني 30 ثانية', reached: false },
  { id: 3, pos: [24.7180, 46.6840], label: 'نقطة ج', exercise: '5 تمديدات', reached: false },
];

const AI_MESSAGES = [
  { condition: (s: number) => s < 3, msg: '⚠️ لم يتم اكتشاف أي حركة — ابدأ النشاط الآن!', color: 'bg-red-600/90 border-red-400/50' },
  { condition: (s: number) => s >= 3 && s < 6, msg: '🚶 أنت تمشي — جرب رفع الوتيرة قليلاً!', color: 'bg-yellow-600/90 border-yellow-400/50' },
  { condition: (s: number) => s >= 6 && s < 10, msg: '🏃 إيقاع ممتاز! أنت تجري بثبات 🔥', color: 'bg-green-600/90 border-green-400/50' },
  { condition: (s: number) => s >= 10, msg: '⚡ سرعة مذهلة! حافظ على هذا المستوى الاستثنائي!', color: 'bg-indigo-600/90 border-indigo-400/50' },
];

type ActivityState = 'idle' | 'walking' | 'running' | 'sprinting';

function getActivityState(speed: number): ActivityState {
  if (speed < 2) return 'idle';
  if (speed < 6) return 'walking';
  if (speed < 12) return 'running';
  return 'sprinting';
}

export interface SessionSummary {
  distance: number;
  duration: number;
  avgSpeed: number;
  maxSpeed: number;
  route: [number, number][];
  idlePeriods: number;
  checkpointsReached: number;
  activityBreakdown: { idle: number; walking: number; running: number; sprinting: number };
}

interface LiveTrackerProps {
  onSessionEnd?: (summary: SessionSummary) => void;
}

export const LiveTracker = ({ onSessionEnd }: LiveTrackerProps) => {
  const [isTracking, setIsTracking] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [route, setRoute] = useState<[number, number][]>([]);
  const [currentPos, setCurrentPos] = useState<[number, number]>([24.7136, 46.6753]);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [maxSpeed, setMaxSpeed] = useState(0);
  const [aiMessage, setAiMessage] = useState<{ msg: string; color: string } | null>(null);
  const [activityState, setActivityState] = useState<ActivityState>('idle');
  const [idleWarning, setIdleWarning] = useState(false);
  const [checkpoints, setCheckpoints] = useState(CHECKPOINTS);
  const [activeCheckpoint, setActiveCheckpoint] = useState<typeof CHECKPOINTS[0] | null>(null);
  const [idleCount, setIdleCount] = useState(0);
  const [activityBreakdown, setActivityBreakdown] = useState({ idle: 0, walking: 0, running: 0, sprinting: 0 });
  const [showEmergency, setShowEmergency] = useState(false);
  const [emergencySent, setEmergencySent] = useState(false);
  const [direction, setDirection] = useState<string | null>(null);

  const trackerRef = useRef<number | null>(null);
  const simulationRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const prevPosRef = useRef<[number, number] | null>(null);
  const prevTimeRef = useRef<number>(Date.now());
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const speedHistoryRef = useRef<number[]>([]);

  // Timer
  useEffect(() => {
    if (isTracking) {
      timerRef.current = setInterval(() => setDuration(p => p + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isTracking]);

  // Activity breakdown tracker
  useEffect(() => {
    if (!isTracking) return;
    setActivityBreakdown(prev => ({ ...prev, [activityState]: prev[activityState] + 1 }));
  }, [duration, activityState]);

  // AI coaching messages every 30 seconds
  useEffect(() => {
    if (!isTracking || duration === 0 || duration % 30 !== 0) return;
    const msg = AI_MESSAGES.find(m => m.condition(currentSpeed));
    if (msg) {
      setAiMessage(msg);
      setTimeout(() => setAiMessage(null), 5000);
    }
  }, [duration]);

  // Speed & idle detection
  const processPosition = useCallback((newPos: [number, number]) => {
    const now = Date.now();
    const elapsed = (now - prevTimeRef.current) / 3600000; // hours
    
    if (prevPosRef.current) {
      const dist = calculateDistance(prevPosRef.current[0], prevPosRef.current[1], newPos[0], newPos[1]);
      setDistance(d => d + dist);
      
      const speedKmh = elapsed > 0 ? dist / elapsed : 0;
      const clampedSpeed = Math.min(speedKmh, 40);
      speedHistoryRef.current = [...speedHistoryRef.current.slice(-5), clampedSpeed];
      const smoothSpeed = speedHistoryRef.current.reduce((a, b) => a + b, 0) / speedHistoryRef.current.length;
      
      setCurrentSpeed(smoothSpeed);
      setMaxSpeed(m => Math.max(m, smoothSpeed));
      setActivityState(getActivityState(smoothSpeed));
      setIdleWarning(smoothSpeed < 1.5);

      // Checkpoint detection (within 50m)
      setCheckpoints(prev => prev.map(cp => {
        if (!cp.reached) {
          const cpDist = calculateDistance(newPos[0], newPos[1], cp.pos[0], cp.pos[1]) * 1000;
          if (cpDist < 50) {
            setActiveCheckpoint(cp);
            setTimeout(() => setActiveCheckpoint(null), 8000);
            return { ...cp, reached: true };
          }
        }
        return cp;
      }));

      // Direction hint (simple bearing)
      const dLat = newPos[0] - prevPosRef.current[0];
      const dLon = newPos[1] - prevPosRef.current[1];
      if (Math.abs(dLat) > 0.0001 || Math.abs(dLon) > 0.0001) {
        const angle = Math.atan2(dLon, dLat) * 180 / Math.PI;
        if (angle > -45 && angle <= 45) setDirection('شمال ↑');
        else if (angle > 45 && angle <= 135) setDirection('شرق →');
        else if (angle > 135 || angle <= -135) setDirection('جنوب ↓');
        else setDirection('غرب ←');
      }
    }

    prevPosRef.current = newPos;
    prevTimeRef.current = now;
    setCurrentPos(newPos);
    setRoute(prev => [...prev, newPos]);
  }, []);

  const startRealTracking = () => {
    if (!('geolocation' in navigator)) {
      alert('GPS غير مدعوم في متصفحك. استخدم وضع المحاكاة.');
      return;
    }
    resetState();
    setIsTracking(true);
    trackerRef.current = navigator.geolocation.watchPosition(
      pos => processPosition([pos.coords.latitude, pos.coords.longitude]),
      err => console.error('GPS Error:', err),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );
  };

  const resetState = () => {
    setRoute([]);
    setDistance(0);
    setDuration(0);
    setCurrentSpeed(0);
    setMaxSpeed(0);
    setIdleCount(0);
    setActivityBreakdown({ idle: 0, walking: 0, running: 0, sprinting: 0 });
    setCheckpoints(CHECKPOINTS);
    prevPosRef.current = null;
    speedHistoryRef.current = [];
  };

  const toggleSimulation = () => {
    if (isSimulating) { stopTracking(); return; }
    resetState();
    setIsSimulating(true);
    setIsTracking(true);
    const startPos: [number, number] = [24.7136, 46.6753];
    setCurrentPos(startPos);
    prevPosRef.current = startPos;
    prevTimeRef.current = Date.now() - 2000;
    let simPos = startPos;

    simulationRef.current = setInterval(() => {
      const newLat = simPos[0] + (Math.random() * 0.001 - 0.0002);
      const newLng = simPos[1] + (Math.random() * 0.001);
      const newPos: [number, number] = [newLat, newLng];
      simPos = newPos;
      processPosition(newPos);
    }, 1500);
  };

  const stopTracking = () => {
    setIsTracking(false);
    setIsSimulating(false);
    if (trackerRef.current) navigator.geolocation.clearWatch(trackerRef.current);
    if (simulationRef.current) clearInterval(simulationRef.current);
    if (timerRef.current) clearInterval(timerRef.current);

    if (onSessionEnd && distance > 0) {
      onSessionEnd({
        distance, duration,
        avgSpeed: duration > 0 ? distance / (duration / 3600) : 0,
        maxSpeed,
        route,
        idlePeriods: idleCount,
        checkpointsReached: checkpoints.filter(c => c.reached).length,
        activityBreakdown,
      });
    }
  };

  const sendEmergency = () => {
    setEmergencySent(true);
    setTimeout(() => { setShowEmergency(false); setEmergencySent(false); }, 4000);
  };

  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  const stateColor = { idle: 'text-red-400', walking: 'text-yellow-400', running: 'text-green-400', sprinting: 'text-blue-400' }[activityState];
  const stateLabel = { idle: 'خامل', walking: 'مشي', running: 'جري', sprinting: 'سرعة عالية' }[activityState];

  return (
    <div className="flex flex-col gap-4" dir="rtl">
      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'المسافة', value: `${(distance * 1000).toFixed(0)} م`, icon: Navigation, color: 'text-orange-400', bg: 'from-orange-500/10 to-orange-900/5' },
          { label: 'السرعة', value: `${currentSpeed.toFixed(1)} كم/س`, icon: Zap, color: 'text-blue-400', bg: 'from-blue-500/10 to-blue-900/5' },
          { label: 'الوقت', value: fmt(duration), icon: Timer, color: 'text-rose-400', bg: 'from-rose-500/10 to-rose-900/5' },
          { label: 'الحالة', value: stateLabel, icon: Activity, color: stateColor, bg: 'from-green-500/10 to-green-900/5' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className={`bg-gradient-to-br ${s.bg} border-white/5 shadow-lg`}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0`}>
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

      {/* Map */}
      <div className="relative rounded-3xl overflow-hidden border border-white/5 shadow-2xl" style={{ height: 480 }}>
        <MapContainer center={currentPos} zoom={16} style={{ height: '100%', width: '100%' }} zoomControl={false}>
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='&copy; OpenStreetMap contributors' />
          <AutoCenter position={currentPos} isTracking={isTracking} />
          <Polyline positions={route} color="#f97316" weight={5} opacity={0.9} />
          <Marker position={currentPos}><Popup>📍 موقعك الحالي</Popup></Marker>
          {checkpoints.map(cp => (
            <React.Fragment key={cp.id}>
              <Circle center={cp.pos} radius={50} color={cp.reached ? '#22c55e' : '#f97316'} fillOpacity={0.15} />
              <Marker position={cp.pos}>
                <Popup><div dir="rtl"><strong>{cp.label}</strong><br />{cp.exercise}</div></Popup>
              </Marker>
            </React.Fragment>
          ))}
        </MapContainer>

        {/* Direction */}
        {direction && isTracking && (
          <div className="absolute top-4 right-4 z-10 bg-black/70 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 text-white font-black flex items-center gap-2">
            <Navigation className="w-4 h-4 text-orange-400" />
            <span className="text-sm">{direction}</span>
          </div>
        )}

        {/* Idle Warning */}
        <AnimatePresence>
          {idleWarning && isTracking && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-red-600/95 backdrop-blur-md border border-red-400/50 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-black text-sm">
              <AlertTriangle className="w-5 h-5 animate-bounce" />
              لم يتم اكتشاف حركة — ابدأ النشاط الآن!
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Coaching Prompt */}
        <AnimatePresence>
          {aiMessage && (
            <motion.div initial={{ opacity: 0, y: 30, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className={`absolute bottom-24 left-1/2 -translate-x-1/2 z-20 ${aiMessage.color} backdrop-blur-md border text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-bold text-sm`}>
              <Flame className="w-4 h-4 text-orange-300 shrink-0" />
              {aiMessage.msg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Checkpoint reached! */}
        <AnimatePresence>
          {activeCheckpoint && (
            <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-green-600/95 backdrop-blur-md border border-green-400 text-white px-8 py-5 rounded-3xl shadow-2xl text-center">
              <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-green-300" />
              <p className="font-black text-lg">وصلت لـ {activeCheckpoint.label}! 🎉</p>
              <p className="text-green-200 text-sm mt-1">تمرين: {activeCheckpoint.exercise}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex gap-3">
          {!isTracking ? (
            <>
              <Button onClick={startRealTracking} size="lg" className="h-13 px-7 rounded-full bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white font-black shadow-xl shadow-orange-500/30">
                <Play className="w-5 h-5 ml-2 fill-current" /> بدء التتبع الفعلي
              </Button>
              <Button onClick={toggleSimulation} variant="outline" size="lg" className="h-13 px-6 rounded-full bg-black/60 backdrop-blur-md border-white/10 text-slate-300 hover:text-white font-bold">
                <Crosshair className="w-4 h-4 ml-2" /> محاكاة
              </Button>
            </>
          ) : (
            <Button onClick={stopTracking} size="lg" className="h-13 px-8 rounded-full bg-red-600 hover:bg-red-700 text-white font-black shadow-xl shadow-red-500/30 animate-pulse">
              <Square className="w-5 h-5 ml-2 fill-current" /> إنهاء وتحليل الأداء
            </Button>
          )}
          <Button onClick={() => setShowEmergency(true)} size="icon" className="h-13 w-13 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-rose-400 hover:bg-rose-600 hover:text-white transition-colors">
            <Phone className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Checkpoints Progress */}
      <Card className="bg-slate-900/60 border-white/5">
        <CardContent className="p-5">
          <h4 className="font-black text-white mb-4 flex items-center gap-2"><Target className="w-4 h-4 text-orange-400" /> نقاط التفتيش</h4>
          <div className="flex gap-3 flex-wrap">
            {checkpoints.map(cp => (
              <div key={cp.id} className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-sm transition-all ${cp.reached ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                {cp.reached ? <CheckCircle2 className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                {cp.label} — {cp.exercise}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Breakdown */}
      {duration > 0 && (
        <Card className="bg-slate-900/60 border-white/5">
          <CardContent className="p-5">
            <h4 className="font-black text-white mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-blue-400" /> تفصيل النشاط</h4>
            <div className="grid grid-cols-4 gap-2">
              {[
                { key: 'sprinting', label: 'سرعة عالية', color: 'bg-blue-500' },
                { key: 'running', label: 'جري', color: 'bg-green-500' },
                { key: 'walking', label: 'مشي', color: 'bg-yellow-500' },
                { key: 'idle', label: 'خمول', color: 'bg-red-500' },
              ].map(a => {
                const val = activityBreakdown[a.key as keyof typeof activityBreakdown];
                const pct = duration > 0 ? Math.round((val / duration) * 100) : 0;
                return (
                  <div key={a.key} className="text-center">
                    <div className="h-2 bg-white/10 rounded-full mb-2 overflow-hidden">
                      <div className={`h-full ${a.color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold">{a.label}</p>
                    <p className="text-sm font-black text-white">{pct}%</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Emergency Modal */}
      <AnimatePresence>
        {showEmergency && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
              className="bg-[#0B0E14] border border-red-500/30 rounded-3xl p-8 max-w-sm w-full text-center">
              {emergencySent ? (
                <div>
                  <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-black text-white mb-2">تم إرسال موقعك!</h3>
                  <p className="text-slate-400">أُبلغ ولي الأمر بموقعك الحالي فوراً.</p>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-8 h-8 text-red-400" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">زر الطوارئ</h3>
                  <p className="text-slate-400 mb-6">سيتم إرسال موقعك الحالي إلى ولي الأمر فوراً.</p>
                  <div className="flex gap-3">
                    <Button onClick={sendEmergency} className="flex-1 bg-red-600 hover:bg-red-700 font-black rounded-2xl h-12">إرسال الموقع 🆘</Button>
                    <Button onClick={() => setShowEmergency(false)} variant="outline" className="flex-1 border-white/10 text-slate-400 rounded-2xl h-12">إلغاء</Button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
