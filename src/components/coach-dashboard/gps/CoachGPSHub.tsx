import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Navigation, MapPin, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import CoachLiveTracker from './CoachLiveTracker';
import SessionBuilder from './SessionBuilder';
import LocationBooking from './LocationBooking';

export default function CoachGPSHub() {
  const [activeTab, setActiveTab] = useState<'tracker' | 'builder' | 'booking'>('tracker');

  const tabs = [
    { id: 'tracker', label: 'التتبع المباشر', icon: Navigation, desc: 'مراقبة حية للمتدربين' },
    { id: 'builder', label: 'تصميم المسار', icon: Map, desc: 'إنشاء حصص ميدانية' },
    { id: 'booking', label: 'الحجز المكاني', icon: MapPin, desc: 'إدارة الطلبات والحضور' },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="bg-slate-950 rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between border border-slate-800 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-emerald-900/20 opacity-50" />
        <div className="z-10 text-center md:text-right mb-6 md:mb-0">
          <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold mb-3">Live GPS System</Badge>
          <h2 className="text-3xl font-black text-white mb-2">المركز الميداني الذكي</h2>
          <p className="text-slate-400 font-medium">نظام تتبع، إدارة، وتحليل حصص التدريب الواقعية.</p>
        </div>

        {/* Action Pills */}
        <div className="flex bg-slate-900/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/50 z-10 w-full md:w-auto relative overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 md:flex-none flex items-center gap-3 px-6 py-3.5 rounded-xl transition-all duration-300 font-bold text-sm min-w-max relative ${
                  isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="gps-tab-indicator"
                    className="absolute inset-0 bg-blue-600 rounded-xl shadow-lg shadow-blue-900/50"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-100' : ''}`} />
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="min-h-[600px]"
        >
          {activeTab === 'tracker' && <CoachLiveTracker />}
          {activeTab === 'builder' && <SessionBuilder />}
          {activeTab === 'booking' && <LocationBooking />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
