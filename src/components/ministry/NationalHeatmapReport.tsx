import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, TrendingUp, Filter, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

// Simplified representation of Wilayas with performance data
const wilayaData = [
    { id: '16', name: 'الجزائر', score: 85, trend: 2.1, color: 'bg-emerald-500' },
    { id: '31', name: 'وهران', score: 82, trend: 1.5, color: 'bg-emerald-400' },
    { id: '25', name: 'قسنطينة', score: 79, trend: -0.5, color: 'bg-yellow-400' },
    { id: '30', name: 'ورقلة', score: 75, trend: 4.2, color: 'bg-orange-400' },
    { id: '08', name: 'بشار', score: 71, trend: 1.1, color: 'bg-orange-500' },
    { id: '19', name: 'سطيف', score: 88, trend: 3.4, color: 'bg-emerald-600' },
    { id: '09', name: 'البليدة', score: 81, trend: 0.8, color: 'bg-emerald-400' },
    { id: '39', name: 'الوادي', score: 68, trend: -1.2, color: 'bg-red-400' },
];

export function NationalHeatmapReport() {
    const [metric, setMetric] = useState('البصمة الحركية');

    return (
        <div className="bg-white dark:bg-[#0B0E14] border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-indigo-500" />
                        التوزيع الجغرافي للأداء
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">خريطة حرارية لمؤشرات الأداء الوطنية</p>
                </div>

                <div className="flex items-center gap-2">
                    <select
                        value={metric}
                        onChange={(e) => setMetric(e.target.value)}
                        className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none"
                    >
                        <option>البصمة الحركية</option>
                        <option>اكتشاف المواهب</option>
                        <option>معدل المشاركة</option>
                    </select>
                    <button className="p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                        <Download className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col md:flex-row gap-6">
                {/* Abstract Map Visualization */}
                <div className="flex-1 bg-slate-50 dark:bg-white/[0.02] rounded-2xl border border-slate-100 dark:border-white/5 relative flex items-center justify-center min-h-[300px] overflow-hidden">
                    {/* Abstract background representing map areas */}
                    <div className="absolute inset-0 opacity-10">
                        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id="hexagons" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
                                    <polygon points="24.8,22 37.3,29.2 37.3,43.7 24.8,50.9 12.3,43.7 12.3,29.2" fill="none" stroke="currentColor" strokeWidth="1" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#hexagons)" />
                        </svg>
                    </div>

                    <div className="relative z-10 text-center">
                        <MapPin className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                        <p className="text-slate-500 dark:text-slate-400 font-bold">خريطة الجزائر التفاعلية</p>
                        <p className="text-xs text-slate-400 mt-1">يتم جلب بيانات GIS حالياً...</p>
                    </div>

                    {/* Floating Data Points */}
                    {wilayaData.slice(0, 5).map((w, i) => (
                        <motion.div
                            key={w.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: i * 0.15 + 0.5 }}
                            className={`absolute ${i === 0 ? 'top-1/4 left-1/3' :
                                    i === 1 ? 'top-1/4 right-1/4' :
                                        i === 2 ? 'top-1/2 left-1/2' :
                                            i === 3 ? 'bottom-1/3 right-1/3' :
                                                'bottom-1/4 left-1/4'
                                } transform -translate-x-1/2 -translate-y-1/2`}
                        >
                            <div className={cn("w-16 h-16 rounded-full mix-blend-multiply blur-xl opacity-60 absolute inset-0 m-auto", w.color)} />
                            <div className="relative bg-white dark:bg-[#0B0E14] border border-slate-200 dark:border-white/10 rounded-xl p-2 shadow-lg text-center min-w-[80px]">
                                <p className="text-[10px] font-bold text-slate-500 mb-0.5">{w.name}</p>
                                <p className="text-sm font-black text-slate-900 dark:text-white">{w.score}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* List View */}
                <div className="w-full md:w-64 flex flex-col gap-3">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">أعلى الولايات ({metric})</p>
                    {wilayaData.sort((a, b) => b.score - a.score).slice(0, 5).map((w, i) => (
                        <div key={w.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-black text-slate-400 w-4">{i + 1}</span>
                                <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">{w.name}</span>
                            </div>
                            <div className="text-left">
                                <span className="font-black text-slate-900 dark:text-white block leading-none">{w.score}</span>
                                <span className={cn("text-[9px] font-bold", w.trend > 0 ? "text-emerald-500" : "text-rose-500")}>
                                    {w.trend > 0 ? '+' : ''}{w.trend}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
