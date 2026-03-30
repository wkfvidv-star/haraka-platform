import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Map, Activity, Bell, Route, MapPin, Flame, FileText, Brain,
  BarChart3, Users, Satellite
} from 'lucide-react';
import { GPSTrackingPanel } from './GPSTrackingPanel';
import { GPSPerformanceAnalysis } from './GPSPerformanceAnalysis';
import { GPSAlertSystem } from './GPSAlertSystem';
import { GPSRouteBuilder } from './GPSRouteBuilder';
import { GPSAttendanceVerifier } from './GPSAttendanceVerifier';
import { GPSHeatmapPanel } from './GPSHeatmapPanel';
import { GPSSmartReports } from './GPSSmartReports';
import { GPSRecommendations } from './GPSRecommendations';

const GPS_TABS = [
  { id: 'tracking',     label: 'مراقبة حية',       icon: Satellite,  color: 'text-blue-400',   activeBg: 'bg-blue-600' },
  { id: 'performance',  label: 'تحليل الأداء',      icon: Activity,   color: 'text-green-400',  activeBg: 'bg-green-600' },
  { id: 'alerts',       label: 'التنبيهات الذكية',  icon: Bell,       color: 'text-red-400',    activeBg: 'bg-red-600' },
  { id: 'routes',       label: 'المسارات التدريبية', icon: Route,      color: 'text-orange-400', activeBg: 'bg-orange-500' },
  { id: 'attendance',   label: 'الحضور GPS',        icon: MapPin,     color: 'text-purple-400', activeBg: 'bg-purple-600' },
  { id: 'heatmap',      label: 'خريطة النشاط',     icon: Flame,      color: 'text-rose-400',   activeBg: 'bg-rose-600' },
  { id: 'reports',      label: 'التقارير الذكية',   icon: FileText,   color: 'text-cyan-400',   activeBg: 'bg-cyan-600' },
  { id: 'recommend',    label: 'التوصيات AI',       icon: Brain,      color: 'text-indigo-400', activeBg: 'bg-indigo-600' },
];

export function TeacherGPSDashboard() {
  const [activeTab, setActiveTab] = useState('tracking');

  const renderContent = () => {
    switch (activeTab) {
      case 'tracking':    return <GPSTrackingPanel />;
      case 'performance': return <GPSPerformanceAnalysis />;
      case 'alerts':      return <GPSAlertSystem />;
      case 'routes':      return <GPSRouteBuilder />;
      case 'attendance':  return <GPSAttendanceVerifier />;
      case 'heatmap':     return <GPSHeatmapPanel />;
      case 'reports':     return <GPSSmartReports />;
      case 'recommend':   return <GPSRecommendations />;
      default:            return <GPSTrackingPanel />;
    }
  };

  const current = GPS_TABS.find(t => t.id === activeTab);

  return (
    <div className="min-h-full space-y-6" dir="rtl">
      {/* ─── Header ─────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Satellite className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                نظام تحليل GPS الميداني
              </h1>
              <p className="text-sm font-semibold text-slate-500">
                مراقبة وتحليل أداء التلاميذ في العالم الحقيقي
              </p>
            </div>
          </div>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-bold text-green-700">نظام GPS نشط</span>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-bold text-blue-700">28 تلميذ مرصود</span>
          </div>
        </div>
      </div>

      {/* ─── Tab Navigation ─────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm">
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-1.5">
          {GPS_TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl font-bold text-xs transition-all ${
                  isActive
                    ? `${tab.activeBg} text-white shadow-md`
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : tab.color}`} />
                <span className="text-center leading-tight">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Content ─────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
