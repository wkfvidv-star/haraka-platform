import React from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Zap, Target, Lock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const achievements = [
    { id: '1', title: 'البداية السريعة', desc: 'أكملت 5 جلسات تدريبية متتالية', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30 border-amber-200/50 dark:border-amber-700/50', date: 'منذ يومين', unlocked: true },
    { id: '2', title: 'مكتشف المواهب', desc: 'أكملت البصمة الحركية لـ 3 أبعاد بنجاح', icon: Target, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30 border-blue-200/50 dark:border-blue-700/50', date: 'أسبوع', unlocked: true },
    { id: '3', title: 'نجم الرشاقة', desc: 'حققت أعلى 10% في اختبارات الرشاقة الوطنية', icon: Star, color: 'text-fuchsia-500', bg: 'bg-fuchsia-100 dark:bg-fuchsia-900/30 border-fuchsia-200/50 dark:border-fuchsia-700/50', date: 'جديد', unlocked: true },
    { id: '4', title: 'بطل القوة 1', desc: 'أنهِ برنامج القوة الانفجارية كاملاً للمستوى 1', icon: Award, color: 'text-slate-400', bg: 'bg-slate-100 dark:bg-white/5 border-slate-200/50 dark:border-white/10', unlocked: false, progress: 60 },
    { id: '5', title: 'رياضي الموسم', desc: 'اجمع 20,000 نقطة خلال الفصل الدراسي', icon: Trophy, color: 'text-slate-400', bg: 'bg-slate-100 dark:bg-white/5 border-slate-200/50 dark:border-white/10', unlocked: false, progress: 35 }
];

function Trophy(props: any) {
    return <Award {...props} />;
}

export function AchievementShowcase() {
    const unlockedCount = achievements.filter(a => a.unlocked).length;

    return (
        <div className="bg-white dark:bg-[#0B0E14] border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm overflow-hidden h-full">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <Award className="w-5 h-5 text-fuchsia-500" />
                        المحفظة الرقمية للإنجازات
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">الرصيد المهاري والشارات المكتسبة</p>
                </div>
                <div className="text-center bg-slate-50 dark:bg-white/5 rounded-xl px-4 py-2 border border-slate-100 dark:border-white/5">
                    <p className="font-black text-xl text-slate-800 dark:text-slate-200 leading-none">{unlockedCount}<span className="text-sm text-slate-400">/{achievements.length}</span></p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">شارات مفتوحة</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((acc, i) => (
                    <motion.div
                        key={acc.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className={cn(
                            "relative rounded-2xl p-4 border flex flex-col justify-between overflow-hidden group",
                            acc.unlocked ? "hover:shadow-md transition-shadow cursor-pointer" : "opacity-75"
                        )}
                    >
                        {/* Background color block for unlocked items */}
                        {acc.unlocked && (
                            <div className={cn("absolute inset-0 opacity-20 transition-opacity group-hover:opacity-40", acc.bg)} />
                        )}
                        {!acc.unlocked && (
                            <div className="absolute inset-0 bg-slate-50 dark:bg-white/[0.02]" />
                        )}

                        <div className="relative z-10 flex items-start gap-4 h-full flex-col sm:flex-row">
                            <div className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm border",
                                acc.bg
                            )}>
                                {acc.unlocked ? (
                                    <acc.icon className={cn("w-6 h-6", acc.color)} />
                                ) : (
                                    <Lock className="w-5 h-5 text-slate-400" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0 w-full">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className={cn("font-bold text-sm truncate pr-2", acc.unlocked ? "text-slate-900 dark:text-white" : "text-slate-500")}>
                                        {acc.title}
                                    </h4>
                                    {acc.unlocked ? (
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-white/10 text-slate-600 dark:text-slate-300 shadow-sm flex-shrink-0">{acc.date}</span>
                                    ) : (
                                        <span className="text-[10px] font-bold text-slate-400">{acc.progress}%</span>
                                    )}
                                </div>
                                <p className={cn("text-xs leading-relaxed line-clamp-2", acc.unlocked ? "text-slate-600 dark:text-slate-300" : "text-slate-400")}>
                                    {acc.desc}
                                </p>

                                {/* Progress bar for locked achievements */}
                                {!acc.unlocked && (
                                    <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full mt-3 overflow-hidden">
                                        <motion.div
                                            className="h-full bg-slate-400 rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${acc.progress}%` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <button className="w-full mt-6 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 font-bold text-sm transition-colors border border-slate-200/50 dark:border-white/5 flex items-center justify-center gap-2">
                استعراض دليل الشارات <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}
