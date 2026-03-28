import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Star, ChevronDown, Award, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Leader {
    id: string;
    rank: number;
    name: string;
    avatar: string;
    points: number;
    school: string;
    wilaya: string;
    trend: number;
    badges: string[];
}

const mockLeaders: Leader[] = [
    { id: '1', rank: 1, name: 'أحمد بن علي', avatar: 'أ', points: 15420, school: 'ثانوية المقراني', wilaya: 'الجزائر', trend: 2, badges: ['🔥', '⚡', '🏆'] },
    { id: '2', rank: 2, name: 'ياسين محمد', avatar: 'ي', points: 14850, school: 'متوسطة أول نوفمبر', wilaya: 'وهران', trend: 1, badges: ['🔥', '⚡'] },
    { id: '3', rank: 3, name: 'سارة كريم', avatar: 'س', points: 14200, school: 'ثانوية بن بولعيد', wilaya: 'قسنطينة', trend: 5, badges: ['⭐', '🌟'] },
    { id: '4', rank: 4, name: 'محمد أمين', avatar: 'م', points: 13950, school: 'متوسطة الأمير', wilaya: 'الجزائر', trend: -1, badges: ['🏃'] },
    { id: '5', rank: 5, name: 'فاطمة الزهراء', avatar: 'ف', points: 13800, school: 'ثانوية الإدريسي', wilaya: 'سطيف', trend: 3, badges: ['🎯'] },
];

export function NationalLeaderboard() {
    const [scope, setScope] = useState<'national' | 'wilaya' | 'school'>('national');
    const [isExpanded, setIsExpanded] = useState(false);

    // You
    const myRank = 142;
    const myPoints = 8450;
    const myTrend = 12;

    const topThree = mockLeaders.slice(0, 3);
    const restList = mockLeaders.slice(3, isExpanded ? 10 : 5);

    return (
        <div className="bg-white dark:bg-[#0B0E14] border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm overflow-hidden h-full flex flex-col">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        لوحة الصدارة
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">ترتيبك الأسبوعي مقارنة بالآخرين</p>
                </div>

                <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-2xl">
                    {[
                        { id: 'national', label: 'الوطني' },
                        { id: 'wilaya', label: 'الولائي' },
                        { id: 'school', label: 'المدرسي' },
                    ].map((s) => (
                        <button
                            key={s.id}
                            onClick={() => setScope(s.id as any)}
                            className={cn(
                                'px-4 py-1.5 rounded-xl text-xs font-bold transition-all',
                                scope === s.id
                                    ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            )}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Top 3 Podium */}
            <div className="flex justify-center items-end gap-2 sm:gap-4 mb-10 mt-6 h-48">
                {/* Number 2 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col items-center flex-1"
                >
                    <div className="relative mb-3">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-slate-300 to-slate-400 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-slate-400/30 border-2 border-white dark:border-[#0B0E14]">
                            {topThree[1].avatar}
                        </div>
                        <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-slate-300 flex items-center justify-center text-xs font-black text-white border-2 border-white dark:border-[#0B0E14]">2</div>
                    </div>
                    <p className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate w-full text-center">{topThree[1].name}</p>
                    <p className="text-xs font-black text-slate-500">{topThree[1].points.toLocaleString()}</p>
                    <div className="w-full h-24 bg-gradient-to-t from-slate-200 to-slate-100 dark:from-white/10 dark:to-white/5 rounded-t-xl mt-3 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-slate-300/20 dark:bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </div>
                </motion.div>

                {/* Number 1 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col items-center flex-1 z-10"
                >
                    <div className="relative mb-3">
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                            <span className="text-2xl animate-bounce tracking-widest drop-shadow-md">👑</span>
                        </div>
                        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-500 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-yellow-500/40 border-4 border-white dark:border-[#0B0E14]">
                            {topThree[0].avatar}
                        </div>
                        <div className="absolute -bottom-2 -left-2 w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-sm font-black text-white border-2 border-white dark:border-[#0B0E14]">1</div>
                    </div>
                    <p className="font-black text-base text-slate-900 dark:text-white truncate w-full text-center">{topThree[0].name}</p>
                    <p className="text-sm font-black text-yellow-600 dark:text-yellow-500">{topThree[0].points.toLocaleString()}</p>
                    <div className="w-full h-32 bg-gradient-to-t from-yellow-200 to-yellow-100 dark:from-yellow-900/40 dark:to-yellow-900/10 rounded-t-xl mt-3 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-yellow-400/20 dark:bg-yellow-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 text-[10px]">
                            {topThree[0].badges.map((b, i) => <span key={i}>{b}</span>)}
                        </div>
                    </div>
                </motion.div>

                {/* Number 3 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col items-center flex-1"
                >
                    <div className="relative mb-3">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-orange-400 to-amber-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-orange-500/30 border-2 border-white dark:border-[#0B0E14]">
                            {topThree[2].avatar}
                        </div>
                        <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-xs font-black text-white border-2 border-white dark:border-[#0B0E14]">3</div>
                    </div>
                    <p className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate w-full text-center">{topThree[2].name}</p>
                    <p className="text-xs font-black text-slate-500">{topThree[2].points.toLocaleString()}</p>
                    <div className="w-full h-16 bg-gradient-to-t from-orange-200 to-orange-100 dark:from-orange-900/30 dark:to-orange-900/5 rounded-t-xl mt-3 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-orange-400/20 dark:bg-orange-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </div>
                </motion.div>
            </div>

            {/* Current User Rank Bar */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 text-white flex items-center justify-between shadow-lg shadow-blue-500/25 mb-6 -mx-2 sm:mx-0">
                <div className="flex items-center gap-4">
                    <div className="text-center font-black">
                        <span className="text-2xl">{myRank}</span>
                        <span className="text-[10px] block opacity-70">ترتيبك</span>
                    </div>
                    <div className="h-10 w-px bg-white/20" />
                    <div>
                        <p className="font-bold">أنت (You)</p>
                        <div className="flex items-center gap-2 text-xs opacity-90">
                            <span>{myPoints.toLocaleString()} نقطة</span>
                            <span className="flex items-center gap-0.5 text-emerald-300 bg-white/10 px-1.5 py-0.5 rounded-full"><TrendingUp className="w-3 h-3" />+{myTrend}</span>
                        </div>
                    </div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl shadow-inner">
                    🎯
                </div>
            </div>

            {/* Rest of the List */}
            <div className="flex-1 overflow-auto -mx-2 px-2 pb-4 space-y-2">
                {restList.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                        <div className="flex items-center gap-4">
                            <span className="font-black text-slate-400 w-6 text-center">{user.rank}</span>
                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300">
                                {user.avatar}
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 dark:text-slate-100 text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{user.name}</p>
                                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                    <span className="truncate max-w-[120px]">{scope === 'national' ? user.wilaya : user.school}</span>
                                    {user.trend > 0 && <span className="text-emerald-500">+{user.trend} مراتب</span>}
                                </div>
                            </div>
                        </div>
                        <div className="text-left font-black text-slate-800 dark:text-slate-200">
                            {user.points.toLocaleString()}
                        </div>
                    </div>
                ))}
            </div>

            {/* Expand Button */}
            {!isExpanded && (
                <button
                    onClick={() => setIsExpanded(true)}
                    className="w-full py-3 mt-2 text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center justify-center gap-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
                >
                    عرض القائمة كاملة <ChevronDown className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}
