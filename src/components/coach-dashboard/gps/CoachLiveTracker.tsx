import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users, Activity, Navigation, AlertTriangle, Play, Square, FastForward,
  MessageCircle, Target, CheckCircle2, Shield, Zap, TrendingUp, Bot
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { toast } from 'sonner';

// Fix leaflet icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons for trainees based on status
const createStatusIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;"><div style="background-color: white; width: 6px; height: 6px; border-radius: 50%;"></div></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const ICONS = {
  active: createStatusIcon('#10b981'), // green
  idle: createStatusIcon('#ef4444'),   // red
  walking: createStatusIcon('#f59e0b'),// yellow
  sprinting: createStatusIcon('#3b82f6'),// blue
};

interface Trainee {
  id: string;
  name: string;
  avatar: string;
  pos: [number, number];
  speed: number;
  status: 'active' | 'idle' | 'walking' | 'sprinting';
  distance: number;
  lastUpdate: number;
}

const CENTER: [number, number] = [24.7136, 46.6753];

export default function CoachLiveTracker() {
  const [trainees, setTrainees] = useState<Trainee[]>([
    { id: 't1', name: 'رحيم بوعلام', avatar: 'ر', pos: [24.7130, 46.6750], speed: 0, status: 'idle', distance: 0, lastUpdate: Date.now() },
    { id: 't2', name: 'عبدالله سعيد', avatar: 'ع', pos: [24.7145, 46.6760], speed: 12, status: 'sprinting', distance: 1.2, lastUpdate: Date.now() },
    { id: 't3', name: 'غسان مراد', avatar: 'غ', pos: [24.7125, 46.6740], speed: 5, status: 'walking', distance: 0.8, lastUpdate: Date.now() },
    { id: 't4', name: 'أحمد كمال',   avatar: 'أ', pos: [24.7150, 46.6730], speed: 9, status: 'active', distance: 2.1, lastUpdate: Date.now() },
  ]);

  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedTrainee, setSelectedTrainee] = useState<Trainee | null>(null);
  const [aiAlerts, setAiAlerts] = useState<string[]>([]);

  // Simulation Logic
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setTrainees(prev => prev.map(t => {
        // Random movement
        const latDiff = (Math.random() - 0.5) * 0.0005;
        const lngDiff = (Math.random() - 0.5) * 0.0005;
        const newPos: [number, number] = [t.pos[0] + latDiff, t.pos[1] + lngDiff];
        
        // Random Speed
        let newSpeed = t.speed + (Math.random() - 0.5) * 4;
        if (newSpeed < 0) newSpeed = 0;
        if (newSpeed > 20) newSpeed = 20;

        let status: Trainee['status'] = 'idle';
        if (newSpeed > 1) status = 'walking';
        if (newSpeed > 6) status = 'active';
        if (newSpeed > 12) status = 'sprinting';

        // Fake AI Alert
        if (status === 'idle' && Math.random() > 0.95) {
          setAiAlerts(a => [`تنبيه: ${t.name} خامل منذ دقيقتين. تحقق من حالته!`, ...a].slice(0, 3));
        }

        return { ...t, pos: newPos, speed: newSpeed, status, distance: t.distance + (newSpeed / 3600), lastUpdate: Date.now() };
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const sendCommand = (cmd: string, tName: string) => {
    toast.success(`تم إرسال الأمر "${cmd}" إلى ${tName} عبر ساعة التدريب.`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'sprinting': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'walking': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'idle': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-slate-500 bg-slate-500/10';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" dir="rtl">
      
      {/* 📍 Map Area (3 cols) */}
      <div className="lg:col-span-3">
        <Card className="border-slate-800 shadow-2xl bg-slate-900 rounded-3xl overflow-hidden h-[600px] relative">
          <MapContainer center={CENTER} zoom={15} style={{ height: '100%', width: '100%' }} zoomControl={false}>
            {/* Using a dark map tileset for a sleek look */}
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            
            {/* Zone Circle */}
            <Circle center={CENTER} radius={500} color="#3b82f6" fillOpacity={0.05} dashArray="5, 10" />

            {/* Trainees Markers */}
            {trainees.map(t => (
              <Marker 
                key={t.id} 
                position={t.pos} 
                icon={ICONS[t.status]}
                eventHandlers={{ click: () => setSelectedTrainee(t) }}
              >
                <Popup className="custom-popup">
                  <div className="p-1 text-center font-tajawal" dir="rtl">
                    <p className="font-bold text-slate-800 text-base mb-1">{t.name}</p>
                    <p className="text-xs text-slate-500 bg-slate-100 rounded-md py-1">سرعة: {t.speed.toFixed(1)} كم/س</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Map Top-Right Overlay Controls */}
          <div className="absolute top-4 right-4 z-[400] flex gap-3">
            <Button 
              onClick={() => setIsSimulating(!isSimulating)}
              className={`rounded-xl shadow-xl font-bold border ${isSimulating ? 'bg-red-500 hover:bg-red-600 border-red-400' : 'bg-blue-600 hover:bg-blue-700 border-blue-500'}`}
            >
              {isSimulating ? <Square className="w-4 h-4 ml-2 fill-current" /> : <Play className="w-4 h-4 ml-2 fill-current" />}
              {isSimulating ? 'إيقاف التدريب المباشر' : 'بدء الحصة الميدانية'}
            </Button>
          </div>

          {/* AI Alerts Overlay */}
          <div className="absolute bottom-4 right-4 z-[400] flex flex-col gap-2 max-w-sm">
            <AnimatePresence>
              {aiAlerts.map((alert, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-slate-900/95 backdrop-blur-md border border-slate-700 p-4 rounded-2xl shadow-2xl flex gap-3 items-start"
                >
                  <Bot className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
                  <p className="text-sm font-semibold text-slate-200 leading-relaxed">{alert}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

        </Card>
      </div>

      {/* 📋 Sidebar (1 col) */}
      <div className="lg:col-span-1 flex flex-col gap-4">
        
        {/* Trainees List */}
        <Card className="border-slate-800 shadow-xl bg-slate-900/50 backdrop-blur-xl rounded-3xl flex-1 flex flex-col">
          <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-800/20">
            <h3 className="text-white font-black flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              المتدربين في الميدان
            </h3>
            <Badge className="bg-blue-500/20 text-blue-400">{trainees.length}</Badge>
          </div>
          <div className="p-3 flex-1 overflow-y-auto space-y-2">
            {trainees.map(t => (
              <div 
                key={t.id}
                onClick={() => setSelectedTrainee(t)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                  selectedTrainee?.id === t.id 
                    ? 'bg-blue-600/10 border-blue-500/50' 
                    : 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-800'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-black text-white shrink-0">
                  {t.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm truncate">{t.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className={`text-[10px] py-0 px-1 border-none ${getStatusColor(t.status)}`}>
                      {t.status === 'active' && 'جري'}
                      {t.status === 'sprinting' && 'سبرينت'}
                      {t.status === 'walking' && 'مشي'}
                      {t.status === 'idle' && 'متوقف'}
                    </Badge>
                    <span className="text-xs text-slate-400 font-mono">{t.speed.toFixed(1)} km/h</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Selected Trainee Actions */}
        <AnimatePresence>
          {selectedTrainee && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <Card className="border-blue-900 shadow-xl bg-gradient-to-b from-blue-900/20 to-slate-900 rounded-3xl">
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-blue-900/50">
                      {selectedTrainee.avatar}
                    </div>
                    <div>
                      <h4 className="text-white font-black text-lg">{selectedTrainee.name}</h4>
                      <p className="text-slate-400 text-xs flex items-center gap-1">المسافة المقطوعة: {selectedTrainee.distance.toFixed(2)} كم</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <Button onClick={() => sendCommand('زد سرعتك!', selectedTrainee.name)} variant="outline" className="h-10 border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 font-bold text-xs">
                      <FastForward className="w-4 h-4 ml-1" /> زد سرعتك
                    </Button>
                    <Button onClick={() => sendCommand('توقف للراحة', selectedTrainee.name)} variant="outline" className="h-10 border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20 font-bold text-xs">
                      <Square className="w-4 h-4 ml-1" /> توقف
                    </Button>
                    <Button onClick={() => sendCommand('رسالة صوتية', selectedTrainee.name)} variant="outline" className="col-span-2 h-10 border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold text-xs">
                      <MessageCircle className="w-4 h-4 ml-1" /> إرسال تنبيه مخصص
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
