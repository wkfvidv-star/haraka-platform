import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, TrendingUp, Trophy, Star, Activity, Coins, Zap, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';

function AnimatedNumber({ value }: { value: number }) {
    const spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 });
    const display = useTransform(spring, (current) => Math.round(current).toLocaleString('ar-AE'));

    useEffect(() => {
        spring.set(value);
    }, [spring, value]);

    return <motion.span>{display}</motion.span>;
}

interface StudentIdentityCardProps {
    studentName?: string;
    studentLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
    levelProgress?: number;
    streak?: number;
    totalPoints?: number;
    latestBadge?: string;
    digitalId?: string;
    qrToken?: string;
    loading?: boolean;
    onStartSession?: () => void;
    onOpenAccess?: () => void;
}

export const StudentIdentityCard: React.FC<StudentIdentityCardProps> = ({
    studentName = "الطالب المجتهد",
    studentLevel = "Intermediate",
    levelProgress = 0,
    streak = 0,
    totalPoints = 0,
    latestBadge = "بطل التوازن",
    digitalId,
    qrToken,
    loading = false,
    onStartSession,
    onOpenAccess
}) => {
    const navigate = useNavigate();

    if (loading) {
        return (
            <Card className="w-full glass-card border-white/10 shadow-2xl p-8">
                <div className="flex flex-col md:flex-row items-center gap-10">
                    <Skeleton className="w-28 h-28 rounded-full bg-white/10" />
                    <div className="flex-1 space-y-4 w-full">
                        <Skeleton className="h-10 w-2/3 bg-white/10" />
                        <div className="flex gap-2">
                            <Skeleton className="h-6 w-20 bg-white/10" />
                            <Skeleton className="h-6 w-32 bg-white/10" />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-14 bg-white/10 rounded-xl" />)}
                        </div>
                    </div>
                </div>
            </Card>
        );
    }
    return (
        <Card className="w-full glass-card text-white overflow-hidden relative selection:bg-blue-500 selection:text-white border-white/10 shadow-2xl">
            {/* Brand Tint Overlay - Subtler for clarity */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-600/5 mix-blend-overlay pointer-events-none" />
            <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                <Activity className="w-64 h-64 text-white" />
            </div>

            <CardContent className="p-8 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-10">

                    {/* Avatar Section */}
                    <div className="relative">
                        <div className="w-28 h-28 rounded-full p-1.5 bg-white/10 backdrop-blur-md ring-1 ring-white/20">
                            <Avatar className="w-full h-full border-2 border-white/80 shadow-inner">
                                <AvatarImage src="/avatars/student-1.png" alt={studentName} />
                                <AvatarFallback className="bg-blue-900 text-2xl font-black">
                                    {studentName.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-orange-500 text-white text-xs font-black px-3 py-1 rounded-full border-2 border-[#0b0f1a] shadow-lg">
                            مستوى {studentLevel === 'Beginner' ? 1 : studentLevel === 'Intermediate' ? 2 : 3}
                        </div>
                    </div>

                    {/* Info & Metrics Section */}
                    <div className="flex-1 text-center md:text-right space-y-6">
                        <div>
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                <h2 className="text-3xl font-black tracking-tight text-white">{studentName}</h2>
                                {studentLevel === 'Advanced' && <Trophy className="w-6 h-6 text-yellow-500 animate-bounce" />}
                            </div>
                            <div className="flex items-center justify-center md:justify-start gap-3">
                                <Badge className="bg-blue-500 text-white hover:bg-blue-600 border-none px-3 py-1 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-500/20">
                                    {studentLevel === 'Beginner' ? 'مبتدئ' : studentLevel === 'Intermediate' ? 'متوسط' : 'متقدم'}
                                </Badge>
                                <span className="text-white/30">•</span>
                                <span className="text-sm font-bold flex items-center gap-1.5 text-blue-200">
                                    <TrendingUp className="w-4 h-4 text-green-400" />
                                    أداء متميز هذا الأسبوع
                                </span>
                            </div>
                        </div>

                        {/* Grid of Mini-Stats */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-md transition-all hover:bg-white/10 group">
                                <div className="text-[9px] font-black uppercase tracking-[2px] text-blue-400 mb-1 group-hover:text-blue-300 transition-colors">الخبرة (XP)</div>
                                <div className="text-xl font-black flex items-center justify-center md:justify-start gap-2 text-white">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    <AnimatedNumber value={totalPoints} />
                                </div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-md transition-all hover:bg-white/10 group">
                                <div className="text-[9px] font-black uppercase tracking-[2px] text-yellow-400 mb-1 group-hover:text-yellow-300 transition-colors">العملات</div>
                                <div className="text-xl font-black flex items-center justify-center md:justify-start gap-2 text-white">
                                    <Coins className="w-4 h-4 text-yellow-500" />
                                    <AnimatedNumber value={Math.floor(totalPoints / 10)} />
                                </div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-md transition-all hover:bg-white/10 group">
                                <div className="text-[9px] font-black uppercase tracking-[2px] text-orange-400 mb-1 group-hover:text-orange-300 transition-colors">التتابع</div>
                                <div className="text-xl font-black flex items-center justify-center md:justify-start gap-2 text-white">
                                    <Zap className="w-4 h-4 text-orange-500 fill-orange-500" />
                                    <AnimatedNumber value={streak} /> <span className="text-sm">يوم</span>
                                </div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-md transition-all hover:bg-white/10 group">
                                <div className="text-[9px] font-black uppercase tracking-[2px] text-purple-400 mb-1 group-hover:text-purple-300 transition-colors">أحدث وسام</div>
                                <div className="text-sm font-black flex items-center justify-center md:justify-start gap-2 text-white truncate">
                                    <Trophy className="w-4 h-4 text-purple-400" />
                                    {latestBadge}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="w-full md:w-auto flex flex-col gap-4 min-w-[280px]">
                        <Button
                            size="lg"
                            className="w-full bg-white text-blue-900 hover:bg-blue-50 font-black shadow-xl transition-all duration-300 hover:rotate-1 active:scale-95 h-16 text-xl group"
                            onClick={onStartSession}
                        >
                            <Play className="w-6 h-6 ml-3 fill-current group-hover:scale-110 transition-transform" />
                            ابدأ تمرين اليوم
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 border-none text-white hover:opacity-90 font-black transition-all duration-300 h-14 text-lg gap-3 shadow-lg shadow-orange-500/20"
                            onClick={onOpenAccess}
                        >
                            <QrCode className="w-6 h-6" />
                            الهوية الرقمية (Smart ID)
                        </Button>
                        <div className="space-y-3 pt-2">
                            <div className="flex justify-between text-[10px] font-black text-blue-200 px-1 uppercase tracking-[2px]">
                                <span>التقدم للمستوى التالي</span>
                                <span className="bg-blue-500/30 px-2 py-0.5 rounded-full text-white shadow-sm flex items-center gap-1">
                                    <AnimatedNumber value={levelProgress} />%
                                </span>
                            </div>
                            <div className="relative h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${levelProgress}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-indigo-400 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)]"
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </CardContent>
        </Card>
    );
};
