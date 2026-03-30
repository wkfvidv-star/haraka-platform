import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Map, Users, MapPin, Calendar, Star, Compass } from 'lucide-react';

export const RouteAndTrainerMap = () => {
   const [mode, setMode] = useState<'routes' | 'trainers'>('routes');
   const centerPos: [number, number] = [24.7136, 46.6753]; // Riyadh

   const trainers = [
      { id: 1, name: 'الكابتن أحمد', spec: 'مدرب لياقة بدنية', rating: 4.8, dist: '1.2 كم', pos: [24.7150, 46.6800] as [number, number] },
      { id: 2, name: 'الكابتن سارة', spec: 'مدربة جري', rating: 4.9, dist: '2.5 كم', pos: [24.7100, 46.6700] as [number, number] },
   ];

   const routes = [
      { id: 1, name: 'مسار الحديقة العامة', diff: 'سهل', length: '3.5 كم', pos: [24.7180, 46.6850] as [number, number] },
      { id: 2, name: 'ماراثون الحي الشمالي', diff: 'صعب', length: '10 كم', pos: [24.7200, 46.6600] as [number, number] },
   ];

   return (
      <div className="flex flex-col gap-6">
         {/* Controls */}
         <div className="flex gap-4 p-2 bg-slate-900/50 rounded-2xl w-fit mx-auto border border-white/5 shadow-2xl">
            <Button 
               variant={mode === 'routes' ? 'default' : 'ghost'} 
               className={`rounded-xl font-bold px-8 ${mode === 'routes' ? 'bg-gradient-to-r from-orange-500 to-rose-600 shadow-lg text-white' : 'text-slate-400 hover:text-white'}`}
               onClick={() => setMode('routes')}
            >
               <Map className="w-4 h-4 mr-2" /> استكشاف المسارات
            </Button>
            <Button 
               variant={mode === 'trainers' ? 'default' : 'ghost'} 
               className={`rounded-xl font-bold px-8 ${mode === 'trainers' ? 'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg text-white' : 'text-slate-400 hover:text-white'}`}
               onClick={() => setMode('trainers')}
            >
               <Users className="w-4 h-4 mr-2" /> البحث عن مدربين
            </Button>
         </div>

         <div className="h-[500px] rounded-3xl overflow-hidden relative border border-white/5 bg-slate-900 shadow-2xl">
            {/* Map Layer */}
            <MapContainer center={centerPos} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={true}>
               <TileLayer 
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
               />

               {mode === 'trainers' && trainers.map(t => (
                  <Marker key={t.id} position={t.pos}>
                     <Popup className="custom-popup">
                        <div className="text-right p-1 font-arabic" dir="rtl">
                           <h4 className="font-black text-sm mb-1">{t.name}</h4>
                           <div className="text-xs text-slate-500 mb-2">{t.spec}</div>
                           <div className="flex gap-3 mb-3 text-xs font-bold items-center">
                              <span className="flex items-center text-yellow-500"><Star className="w-3 h-3 fill-current ml-1" /> {t.rating}</span>
                              <span className="flex items-center text-slate-400"><MapPin className="w-3 h-3 ml-1" /> {t.dist}</span>
                           </div>
                           <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-[10px] font-bold rounded-lg h-8">
                              <Calendar className="w-3 h-3 ml-1" /> حجز جلسة
                           </Button>
                        </div>
                     </Popup>
                  </Marker>
               ))}

               {mode === 'routes' && routes.map(r => (
                  <Marker key={r.id} position={r.pos}>
                     <Popup className="custom-popup">
                        <div className="text-right p-1 font-arabic" dir="rtl">
                           <h4 className="font-black text-sm mb-1">{r.name}</h4>
                           <div className="flex gap-2 mt-2 mb-3">
                              <Badge variant="outline" className={`text-[9px] ${r.diff === 'سهل' ? 'border-green-500/50 text-green-500' : 'border-red-500/50 text-red-500'}`}>{r.diff}</Badge>
                              <Badge variant="outline" className="text-[9px] border-orange-500/50 text-orange-500">{r.length}</Badge>
                           </div>
                           <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700 text-[10px] font-bold rounded-lg h-8">
                              <Compass className="w-3 h-3 ml-1" /> بدء المسار
                           </Button>
                        </div>
                     </Popup>
                  </Marker>
               ))}
            </MapContainer>
         </div>
      </div>
   );
};
