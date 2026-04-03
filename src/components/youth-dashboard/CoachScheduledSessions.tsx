import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, Video, MapPin, Clock, CheckCircle2, 
  ChevronLeft, User, Dumbbell, Wifi, AlertCircle 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { youthDataService, YouthSession } from '@/services/youthDataService';

const typeConfig = {
  'in-person': { label: 'حضوري', color: 'bg-emerald-50 text-emerald-700', icon: MapPin },
  'online': { label: 'أونلاين', color: 'bg-blue-50 text-blue-700', icon: Wifi },
  'group': { label: 'جماعي', color: 'bg-purple-50 text-purple-700', icon: User }
};

const statusConfig = {
  upcoming: { label: 'قادمة', dot: 'bg-orange-400' },
  confirmed: { label: 'مؤكدة', dot: 'bg-green-500' },
  completed: { label: 'مكتملة', dot: 'bg-slate-400' },
  cancelled: { label: 'ملغاة', dot: 'bg-red-400' },
  postponed: { label: 'مؤجلة', dot: 'bg-yellow-400' }
};

export function CoachScheduledSessions() {
  const [sessions, setSessions] = useState<YouthSession[]>([]);

  useEffect(() => {
    setSessions(youthDataService.getSessions());
  }, []);

  const confirm = (id: string) => {
    youthDataService.updateSessionStatus(id, 'confirmed');
    setSessions(youthDataService.getSessions());
  };

  const cancel = (id: string) => {
    youthDataService.updateSessionStatus(id, 'cancelled');
    setSessions(youthDataService.getSessions());
  };

  const upcoming = sessions.filter(s => s.status !== 'completed' && s.status !== 'cancelled');

  if (upcoming.length === 0) {
    return (
      <div className="bg-white rounded-[1.5rem] border border-slate-100 p-6 text-center shadow-sm">
        <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="font-bold text-slate-400 text-sm">لا توجد حصص مجدولة حالياً</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
          <Calendar className="w-5 h-5 text-orange-500" />
          حصصي المجدولة
        </h3>
        <Badge className="bg-orange-50 text-orange-600 border-0 font-bold">{upcoming.length} حصص</Badge>
      </div>

      <div className="space-y-3">
        {upcoming.map((s) => {
          const tc = typeConfig[s.type];
          const sc = statusConfig[s.status];
          const TypeIcon = tc.icon;

          return (
            <motion.div
              key={s.id}
              layout
              className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden"
            >
              {/* Color top stripe */}
              <div className={cn(
                'h-1 rounded-t-[1.5rem]',
                s.type === 'in-person' ? 'bg-emerald-500' :
                s.type === 'online' ? 'bg-blue-500' : 'bg-purple-500'
              )} />
              
              <div className="p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h4 className="font-black text-slate-900 text-base leading-tight">{s.title}</h4>
                    <p className="text-slate-500 text-sm font-medium mt-0.5">{s.coach}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`w-2 h-2 rounded-full ${sc.dot}`} />
                    <span className="text-xs font-bold text-slate-500">{sc.label}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap mb-3">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-bold">{s.date} · {s.time}</span>
                  </div>
                  <Badge className={cn('border-0 font-bold text-xs flex items-center gap-1', tc.color)}>
                    <TypeIcon className="w-3 h-3" />
                    {tc.label}
                  </Badge>
                  {s.location && (
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {s.location}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {s.status === 'upcoming' && (
                    <div className="flex-1 flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => confirm(s.id)}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-9 px-4 rounded-xl flex-1"
                      >
                        <CheckCircle2 className="w-4 h-4 ml-1" /> تأكيد الحضور
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => cancel(s.id)}
                        className="border-red-100 text-red-500 hover:bg-red-50 font-bold h-9 px-3 rounded-xl"
                      >
                        إلغاء
                      </Button>
                    </div>
                  )}
                  {s.type === 'online' && (
                    <Button
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold h-9 px-4 rounded-xl flex-1"
                    >
                      <Video className="w-4 h-4 ml-1" /> انضم الآن
                    </Button>
                  )}
                  {s.status === 'confirmed' && (
                    <div className="flex items-center gap-1.5 text-green-600 flex-1 justify-center font-bold text-sm">
                      <CheckCircle2 className="w-4 h-4" /> تم التأكيد
                    </div>
                  )}
                  <span className="text-xs font-bold text-slate-400">{s.duration}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
