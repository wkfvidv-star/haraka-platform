import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Target, Zap, ChevronRight, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClassData {
    id: string;
    name: string;
    students: number;
    avgScore: number;
    dimensions: {
        speed: number;
        balance: number;
        agility: number;
        power: number;
    };
    trend: number;
}

const mockData: ClassData[] = [
    { id: '1', name: 'القسم 3 م 1', students: 32, avgScore: 82, trend: 4.5, dimensions: { speed: 85, balance: 78, agility: 88, power: 77 } },
    { id: '2', name: 'القسم 3 م 2', students: 28, avgScore: 76, trend: 2.1, dimensions: { speed: 75, balance: 80, agility: 72, power: 77 } },
    { id: '3', name: 'القسم 3 م 3', students: 30, avgScore: 71, trend: -1.2, dimensions: { speed: 68, balance: 75, agility: 70, power: 71 } },
    { id: '4', name: 'القسم 3 م 4', students: 31, avgScore: 88, trend: 5.8, dimensions: { speed: 92, balance: 85, agility: 90, power: 85 } },
];

export function ClassComparisonChart() {
    const maxScore = 100;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <Users className="w-5 h-5 text-indigo-500" />
                        مقارنة أداء الأقسام
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">متوسط البصمة الحركية لكل قسم</p>
                </div>
                <button className="text-blue-600 dark:text-blue-400 text-sm font-bold flex items-center gap-1 hover:underline">
                    تفاصيل أكثر <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            <div className="space-y-4">
                {mockData.sort((a, b) => b.avgScore - a.avgScore).map((cls, i) => (
                    <div key={cls.id} className="bg-slate-50 dark:bg-white/[0.02] rounded-2xl p-4 border border-slate-100 dark:border-white/5">
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-3">
                                <div className={cn('w-8 h-8 rounded-full flex items-center justify-center font-black text-sm',
                                    i === 0 ? 'bg-yellow-100 text-yellow-700' :
                                        i === 1 ? 'bg-slate-200 text-slate-700' :
                                            i === 2 ? 'bg-orange-100 text-orange-700' :
                                                'bg-blue-50 text-blue-600'
                                )}>
                                    {i + 1}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 dark:text-slate-200">{cls.name}</h4>
                                    <p className="text-xs text-slate-500">{cls.students} تلميذ</p>
                                </div>
                            </div>
                            <div className="text-left">
                                <p className="font-black text-lg text-slate-900 dark:text-white">{cls.avgScore}</p>
                                <div className={cn("text-[10px] font-bold flex items-center gap-0.5", cls.trend > 0 ? "text-emerald-500" : "text-rose-500")}>
                                    {cls.trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
                                    {Math.abs(cls.trend)}%
                                </div>
                            </div>
                        </div>

                        {/* Micro bar chart for dimensions */}
                        <div className="grid grid-cols-4 gap-2">
                            {[
                                { k: 'speed', icon: Zap, color: 'bg-blue-500' },
                                { k: 'agility', icon: Activity, color: 'bg-emerald-500' },
                                { k: 'power', icon: Target, color: 'bg-orange-500' },
                                { k: 'balance', icon: Users, color: 'bg-purple-500' },
                            ].map((dim) => {
                                const val = (cls.dimensions as any)[dim.k];
                                return (
                                    <div key={dim.k} className="relative h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden group cursor-help">
                                        <motion.div
                                            className={cn("absolute inset-y-0 right-0 rounded-full", dim.color)}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${val}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                        <div className="grid grid-cols-4 gap-2 mt-1 px-1">
                            <span className="text-[9px] text-slate-400 text-center">السرعة</span>
                            <span className="text-[9px] text-slate-400 text-center">الرشاقة</span>
                            <span className="text-[9px] text-slate-400 text-center">القوة</span>
                            <span className="text-[9px] text-slate-400 text-center">التوازن</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
