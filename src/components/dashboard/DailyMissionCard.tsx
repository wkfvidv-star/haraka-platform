import React from 'react';
import { Button } from '@/components/ui/button';
import { Target, Zap, ChevronRight, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

interface DailyMissionCardProps {
    onStart?: () => void;
}

export function DailyMissionCard({ onStart }: DailyMissionCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 rounded-[1.5rem] text-white overflow-hidden relative shadow-xl group">
                {/* Background glow */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-56 h-56 bg-black/20 rounded-full -ml-16 -mb-16 blur-2xl pointer-events-none" />

                <div className="p-6 relative z-10">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-black text-yellow-300 mb-3 border border-white/20">
                        <Trophy className="w-3.5 h-3.5" />
                        تحدي النجوم اليومي
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-black leading-tight mb-2">
                        تحدي الـ 5000 خطوة 🏃‍♂️
                    </h3>

                    <p className="text-indigo-100 text-sm font-medium leading-relaxed mb-5">
                        أكمل 5000 خطوة قبل الساعة 6 مساءً واكسب شارة{' '}
                        <span className="text-yellow-300 font-black">"العداء النشيط"</span>{' '}
                        + 500 نقطة XP!
                    </p>

                    {/* Progress + Button row */}
                    <div className="flex items-center gap-4">
                        {/* Compact progress ring */}
                        <div className="relative w-16 h-16 shrink-0">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
                                <motion.circle
                                    cx="18" cy="18" r="15"
                                    fill="none" stroke="#facc15" strokeWidth="3" strokeLinecap="round"
                                    strokeDasharray="65, 100"
                                    animate={{ strokeDasharray: ['0, 100', '65, 100'] }}
                                    transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
                                    style={{ filter: 'drop-shadow(0 0 6px rgba(250,204,21,0.7))' }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-lg font-black">65%</span>
                                <span className="text-[9px] font-bold text-indigo-200">إنجاز</span>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <button
                            onClick={onStart}
                            className="flex-1 h-12 bg-white text-indigo-700 hover:bg-indigo-50 font-black text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.02] active:scale-95"
                        >
                            <Zap className="w-4 h-4 text-orange-500 fill-current" />
                            ابدأ التحدي الآن! 🚀
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
