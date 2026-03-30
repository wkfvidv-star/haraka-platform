import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Bell, AlertTriangle, MapPin, Activity, Clock, CheckCircle,
  XCircle, Navigation, Zap, Send, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Alert {
  id: string;
  studentName: string;
  class: string;
  type: 'no_movement' | 'weak_activity' | 'off_route' | 'late_start';
  severity: 'high' | 'medium' | 'low';
  message: string;
  time: string;
  read: boolean;
}

const MOCK_ALERTS: Alert[] = [
  {
    id: 'a1', studentName: 'كريم معروف', class: 'القسم 4ب',
    type: 'no_movement', severity: 'high', read: false,
    message: 'لا توجد حركة GPS منذ 14 دقيقة — التلميذ لم يبدأ النشاط.',
    time: 'منذ 2 دقيقة',
  },
  {
    id: 'a2', studentName: 'سارة بوزيد', class: 'القسم 4ب',
    type: 'weak_activity', severity: 'medium', read: false,
    message: 'متوسط السرعة 0.5 كم/س فقط — نشاط ضعيف جداً دون المستوى المطلوب.',
    time: 'منذ 5 دقائق',
  },
  {
    id: 'a3', studentName: 'أمير طارق', class: 'القسم 4أ',
    type: 'off_route', severity: 'medium', read: false,
    message: 'التلميذ خارج المسار المحدد بمسافة 320 متر — يتجه شمالاً.',
    time: 'منذ 8 دقائق',
  },
  {
    id: 'a4', studentName: 'بلال سعيد', class: 'القسم 5أ',
    type: 'late_start', severity: 'low', read: true,
    message: 'تأخر في بدء النشاط لمدة 6 دقائق عن الوقت المحدد.',
    time: 'منذ 12 دقيقة',
  },
  {
    id: 'a5', studentName: 'ياسين محمود', class: 'القسم 4أ',
    type: 'weak_activity', severity: 'low', read: true,
    message: 'سجّل فترة توقف مدتها 3 دقائق خلال النشاط — احتمال إجهاد.',
    time: 'منذ 18 دقيقة',
  },
];

const INACTIVE_STUDENTS = [
  { name: 'كريم معروف', class: 'القسم 4ب', reason: 'لا حركة GPS' },
  { name: 'رضا سليماني', class: 'القسم 5أ', reason: 'لم يسجّل موقع' },
  { name: 'ليلى براهيمي', class: 'القسم 4أ', reason: 'سرعة < 0.3 كم/س' },
];

const alertConfig = {
  no_movement:   { icon: XCircle,       color: 'text-red-600',    bg: 'bg-red-50',     border: 'border-red-200',    label: 'لا حركة' },
  weak_activity: { icon: Activity,      color: 'text-yellow-600', bg: 'bg-yellow-50',  border: 'border-yellow-200', label: 'نشاط ضعيف' },
  off_route:     { icon: Navigation,    color: 'text-orange-600', bg: 'bg-orange-50',  border: 'border-orange-200', label: 'خروج عن المسار' },
  late_start:    { icon: Clock,         color: 'text-blue-600',   bg: 'bg-blue-50',    border: 'border-blue-200',   label: 'تأخر البدء' },
};

const severityBadge = {
  high:   'bg-red-100 text-red-700 border-red-200',
  medium: 'bg-orange-100 text-orange-700 border-orange-200',
  low:    'bg-slate-100 text-slate-600 border-slate-200',
};

export function GPSAlertSystem() {
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [filter, setFilter] = useState<'all' | 'unread' | 'high'>('all');

  const unreadCount = alerts.filter(a => !a.read).length;

  const filtered = alerts.filter(a => {
    if (filter === 'unread') return !a.read;
    if (filter === 'high')   return a.severity === 'high';
    return true;
  });

  const markRead = (id: string) =>
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));

  const markAllRead = () =>
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));

  return (
    <div className="space-y-6">

      {/* ─ Header Stats ─ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'تنبيهات غير مقروءة', value: unreadCount,        icon: Bell,          color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200' },
          { label: 'حالات عالية الخطورة', value: alerts.filter(a => a.severity === 'high').length, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
          { label: 'تلاميذ غير نشطين',   value: INACTIVE_STUDENTS.length, icon: XCircle,  color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ─ Alert Feed ─ */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
              {[
                { id: 'all',    label: `الكل (${alerts.length})` },
                { id: 'unread', label: `غير مقروء (${unreadCount})` },
                { id: 'high',   label: 'عالية الخطورة' },
              ].map(tab => (
                <button key={tab.id} onClick={() => setFilter(tab.id as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === tab.id ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>
                  {tab.label}
                </button>
              ))}
            </div>
            {unreadCount > 0 && (
              <Button onClick={markAllRead} variant="outline" size="sm" className="text-sm font-bold border-slate-200 text-slate-600">
                <CheckCircle className="w-4 h-4 ml-2" />
                تحديد الكل كمقروء
              </Button>
            )}
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {filtered.map((alert, idx) => {
                const cfg = alertConfig[alert.type];
                const Icon = cfg.icon;
                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ delay: idx * 0.04 }}
                  >
                    <Card className={`border ${cfg.border} shadow-sm ${!alert.read ? 'shadow-md' : 'opacity-75'}`}>
                      <CardContent className="p-4 flex items-start gap-4">
                        {/* Icon */}
                        <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                          <Icon className={`w-5 h-5 ${cfg.color}`} />
                        </div>
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-black text-sm text-slate-900">{alert.studentName}</span>
                              <span className="text-xs text-slate-400 font-semibold">{alert.class}</span>
                              <Badge className={`text-[10px] px-2 py-0 border rounded-full ${severityBadge[alert.severity]}`}>
                                {alert.severity === 'high' ? 'عالي' : alert.severity === 'medium' ? 'متوسط' : 'منخفض'}
                              </Badge>
                              <Badge variant="outline" className="text-[10px] px-2 py-0 border-slate-200 text-slate-500">
                                {cfg.label}
                              </Badge>
                            </div>
                            <span className="text-[11px] text-slate-400 font-semibold shrink-0">{alert.time}</span>
                          </div>
                          <p className="text-sm text-slate-600 font-medium leading-relaxed">{alert.message}</p>
                          {/* Actions */}
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" className="h-8 text-xs font-bold bg-slate-900 text-white hover:bg-slate-800">
                              <Send className="w-3 h-3 ml-1.5" />
                              إرسال تنبيه
                            </Button>
                            {!alert.read && (
                              <Button size="sm" variant="outline" onClick={() => markRead(alert.id)}
                                className="h-8 text-xs font-bold border-slate-200">
                                <Eye className="w-3 h-3 ml-1.5" />
                                تحديد كمقروء
                              </Button>
                            )}
                          </div>
                        </div>
                        {/* Unread dot */}
                        {!alert.read && (
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0 mt-1.5 animate-pulse" />
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* ─ Inactive List ─ */}
        <div>
          <Card className="border-red-200 bg-red-50/30 shadow-sm">
            <CardHeader className="pb-3 border-b border-red-200">
              <CardTitle className="text-sm font-black text-red-700 flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                التلاميذ الذين لم ينجزوا النشاط
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {INACTIVE_STUDENTS.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.07 }}
                  className="bg-white border border-red-200 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                    <span className="font-black text-red-600 text-sm">{s.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-slate-900 truncate">{s.name}</p>
                    <p className="text-xs text-slate-500 font-semibold">{s.class}</p>
                    <Badge className="mt-1 text-[10px] px-2 py-0 bg-red-100 text-red-700 border-red-200 border rounded-full">
                      {s.reason}
                    </Badge>
                  </div>
                  <Button size="sm" variant="outline" className="h-8 text-xs font-bold border-red-200 text-red-600 hover:bg-red-50 shrink-0">
                    <Send className="w-3 h-3" />
                  </Button>
                </motion.div>
              ))}

              <div className="pt-2">
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-9 text-sm">
                  <Bell className="w-3.5 h-3.5 ml-2" />
                  إشعار كل التلاميذ الغائبين
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Auto-alert settings */}
          <Card className="border-slate-200 shadow-sm mt-4">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-500" />
                إعدادات التنبيه التلقائي
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {[
                { label: 'تنبيه عند انعدام الحركة',   active: true },
                { label: 'تنبيه عند الخروج عن المسار', active: true },
                { label: 'تنبيه عند النشاط الضعيف',   active: false },
                { label: 'تقرير نهاية النشاط',         active: true },
              ].map((setting, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">{setting.label}</span>
                  <div className={`relative w-10 h-5 rounded-full cursor-pointer transition-colors ${setting.active ? 'bg-green-500' : 'bg-slate-300'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${setting.active ? 'right-0.5' : 'left-0.5'}`} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
