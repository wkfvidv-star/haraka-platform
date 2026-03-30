import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, useMapEvents, Polyline, Popup, Circle } from 'react-leaflet';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Save, Plus, Target, Trash2, Route, CheckSquare, Send, X } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { toast } from 'sonner';

// Custom Map Marker Icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Checkpoint {
  id: string;
  lat: number;
  lng: number;
  exercise: string;
}

const CENTER: [number, number] = [24.7136, 46.6753];

// Helper Component to handle map clicks
function MapEvents({ onClick }: { onClick: (latlng: L.LatLng) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
}

export default function SessionBuilder() {
  const [sessionName, setSessionName] = useState('حصة تحضير بدني - الأربعاء');
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Derive polyline path
  const path = checkpoints.map(cp => [cp.lat, cp.lng] as [number, number]);

  const addCheckpoint = (latlng: L.LatLng) => {
    setCheckpoints(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        lat: latlng.lat,
        lng: latlng.lng,
        exercise: 'تمرين حر', // Default
      }
    ]);
    toast.success('تمت إضافة النقطة بنجاح.');
  };

  const removeCheckpoint = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCheckpoints(prev => prev.filter(cp => cp.id !== id));
  };

  const updateExercise = (id: string, val: string) => {
    setCheckpoints(prev => prev.map(cp => cp.id === id ? { ...cp, exercise: val } : cp));
  };

  const saveSession = () => {
    if (checkpoints.length < 2) {
      toast.error('يجب إضافة نقطتين على الأقل لإنشاء مسار.');
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('تم حفظ المسار وإرساله للمتدربين.');
      // setCheckpoints([]);
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[650px]" dir="rtl">
      
      {/* 📍 Map Area */}
      <div className="lg:col-span-3 h-full relative border-slate-800 shadow-2xl bg-slate-900 rounded-3xl overflow-hidden">
        <MapContainer center={CENTER} zoom={15} style={{ height: '100%', width: '100%' }} zoomControl={false}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          <MapEvents onClick={addCheckpoint} />
          
          {checkpoints.length > 1 && (
            <Polyline positions={path} color="#3b82f6" weight={4} dashArray="10, 10" className="animate-pulse" />
          )}

          {checkpoints.map((cp, idx) => (
            <React.Fragment key={cp.id}>
              <Circle center={[cp.lat, cp.lng]} radius={30} color="#10b981" fillOpacity={0.2} stroke={false} />
              <Marker position={[cp.lat, cp.lng]}>
                <Popup className="custom-popup" closeButton={false}>
                  <div className="font-tajawal p-2 min-w-[150px]" dir="rtl">
                    <div className="flex justify-between items-center mb-2">
                       <p className="font-black text-slate-800">نقطة تفتيش {idx + 1}</p>
                       <button onClick={(e) => removeCheckpoint(cp.id, e as any)} className="text-red-500 hover:bg-red-50 p-1 rounded-md"><Trash2 className="w-3 h-3" /></button>
                    </div>
                    <Input 
                      value={cp.exercise}
                      onChange={(e) => updateExercise(cp.id, e.target.value)}
                      placeholder="التمرين المطلوب..."
                      className="text-sm h-8 mt-1 border border-slate-300 font-bold bg-white text-slate-900 focus-visible:ring-blue-500 mb-1"
                    />
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          ))}
        </MapContainer>

        {/* Floating Help */}
        <div className="absolute top-4 left-4 z-[400] bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700 shadow-xl flex items-center gap-3">
           <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></div>
           <p className="text-sm text-slate-300 font-bold">انقر على الخريطة لإضافة نقاط تفتيش</p>
        </div>
      </div>

      {/* 📋 Sidebar */}
      <Card className="lg:col-span-1 border-slate-800 shadow-xl bg-slate-900/50 backdrop-blur-xl rounded-3xl flex flex-col h-full overflow-hidden">
        <div className="p-5 border-b border-slate-800 bg-slate-800/30">
          <h3 className="text-white font-black flex items-center gap-2 mb-4 text-lg">
            <Route className="w-5 h-5 text-emerald-400" /> مسار الحصة
          </h3>
          <div className="space-y-1">
             <label className="text-xs text-slate-400 font-bold ml-2">اسم الحصة</label>
             <Input 
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                className="bg-slate-950/50 border-slate-700 text-white font-bold h-11 rounded-xl"
             />
          </div>
        </div>

        <div className="p-4 flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          <AnimatePresence>
            {checkpoints.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-8 border border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center h-40">
                <Target className="w-8 h-8 text-slate-600 mb-3" />
                <p className="text-slate-500 text-sm font-bold">لم يتم إضافة نقاط تفتيش المسار بعد.</p>
              </motion.div>
            )}
            
            {checkpoints.map((cp, idx) => (
              <motion.div
                key={cp.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50 relative group"
              >
                <button 
                  onClick={() => removeCheckpoint(cp.id)}
                  className="absolute top-2 left-2 p-1.5 rounded-lg bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black shrink-0">
                    {idx + 1}
                  </div>
                  <p className="text-slate-300 font-bold text-sm">نقطة تفتيش</p>
                </div>
                <div>
                   <Input 
                      value={cp.exercise}
                      onChange={(e) => updateExercise(cp.id, e.target.value)}
                      placeholder="مثال: 10 تمارين ضغط"
                      className="bg-slate-950/50 border-slate-700 text-slate-200 text-sm h-10 mt-2 rounded-xl"
                   />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950 shrink-0">
          <Button 
            onClick={saveSession}
            disabled={isSaving || checkpoints.length === 0}
            className="w-full h-12 rounded-xl bg-gradient-to-l from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black shadow-lg shadow-emerald-900/40"
          >
            {isSaving ? (
              <span className="flex items-center animate-pulse"><Target className="w-5 h-5 ml-2 animate-spin" /> جاري الحفظ...</span>
            ) : (
              <span className="flex items-center"><Send className="w-5 h-5 ml-2" /> إتمام والحفظ بالنظام</span>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
