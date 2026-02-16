import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GraduationCap, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TeacherHeroProps {
    userName: string;
    stats: {
        totalClasses: number;
        totalStudents: number;
        averageProgress: number;
        activeChallenges: number;
    };
}

export function TeacherHero({ userName, stats }: TeacherHeroProps) {
    return (
        <Card className="glass-card border-blue-500/20 shadow-[0_0_50px_rgba(0,0,0,0.3)] overflow-hidden relative group">
            <div className="absolute inset-0 bg-blue-600/10 mix-blend-overlay pointer-events-none" />

            <CardContent className="p-8 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-10">

                    {/* Highly Highlighted Teacher Profile Area */}
                    <div className="relative group/avatar">
                        <div className="w-32 h-32 rounded-[2.5rem] p-1.5 bg-white/10 backdrop-blur-md ring-2 ring-white/20 transition-transform group-hover/avatar:scale-105 duration-500 shadow-2xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent pointer-events-none" />
                            <div className="w-full h-full rounded-[2rem] bg-blue-900/50 flex items-center justify-center text-white border-2 border-white/30 overflow-hidden relative">
                                <User className="w-16 h-16 opacity-80" />
                                {/* Overlay glow for "Highlight" effect */}
                                <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(59,130,246,0.5)]" />
                            </div>
                        </div>
                        {/* Status/Badge */}
                        <div className="absolute -bottom-3 -right-3 bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full border-2 border-white shadow-xl uppercase tracking-widest animate-in fade-in zoom-in duration-700 delay-300">
                            Professional Coach
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="flex-1 text-center md:text-right space-y-6">
                        <div>
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 font-black text-[10px] px-3 py-1 uppercase tracking-widest">
                                    أهلًا بك
                                </Badge>
                                <div className="h-0.5 w-12 bg-blue-500/30 rounded-full" />
                            </div>
                            <h2 className="text-4xl font-black text-white tracking-tighter">أستاذ {userName}</h2>
                            <p className="text-blue-300 font-bold mt-2 text-lg opacity-90 max-w-2xl leading-relaxed">
                                لوحة التحكم الاحترافية للمدرب (Expert Dashboard). تابع تطور الأبطال، وصمم تحدياتك المبتكرة، وكن المُلهم لمستقبل رياضي أفضل.
                            </p>
                        </div>

                        {/* Quick Metrics Row - High Impact Readability */}
                        <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-8">
                            {[
                                { label: 'الصفوف', value: stats.totalClasses, color: 'text-blue-400' },
                                { label: 'الطلاب', value: stats.totalStudents, color: 'text-emerald-400' },
                                { label: 'متوسط التقدم', value: `${stats.averageProgress}%`, color: 'text-orange-400' },
                                { label: 'تحديات نشطة', value: stats.activeChallenges, color: 'text-blue-200' }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white/10 border-2 border-white/10 rounded-[2rem] px-8 py-6 backdrop-blur-2xl shadow-2xl flex flex-col items-center md:items-start transition-all hover:bg-white/15 hover:border-blue-500/30 cursor-default min-w-[160px] relative overflow-hidden group/metric">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                                    <div className="text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] mb-2 z-10">{stat.label}</div>
                                    <div className={`text-4xl sm:text-5xl font-black ${stat.color} tracking-tighter leading-none z-10 group-hover/metric:scale-105 transition-transform`}>{stat.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </CardContent>
        </Card>
    );
}
