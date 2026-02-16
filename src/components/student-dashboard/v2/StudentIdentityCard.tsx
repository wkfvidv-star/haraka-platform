import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, TrendingUp, Trophy, Star, Activity } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface StudentIdentityCardProps {
    studentName?: string;
    studentLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
    levelProgress?: number;
    streak?: number;
    totalPoints?: number;
    latestBadge?: string;
    onStartSession?: () => void;
}

export const StudentIdentityCard: React.FC<StudentIdentityCardProps> = ({
    studentName = "الطالب المجتهد",
    studentLevel = "Intermediate",
    levelProgress = 65,
    streak = 5,
    totalPoints = 1250,
    latestBadge = "بطل التوازن",
    onStartSession
}) => {
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

                    {/* Info Section */}
                    <div className="flex-1 text-center md:text-right space-y-4">
                        <div>
                            <h2 className="text-3xl font-black tracking-tight text-white mb-2">{studentName}</h2>
                            <div className="flex items-center justify-center md:justify-start gap-3">
                                <Badge className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border-blue-400/30 px-3 py-0.5 font-bold">
                                    {studentLevel === 'Beginner' ? 'مبتدئ' : studentLevel === 'Intermediate' ? 'متوسط' : 'متقدم'}
                                </Badge>
                                <span className="text-white/30">•</span>
                                <span className="text-sm font-bold flex items-center gap-1.5 text-blue-200">
                                    <TrendingUp className="w-4 h-4" />
                                    أفضل بنسبة 12% هذا الأسبوع
                                </span>
                            </div>
                        </div>

                        {/* Stats Row */}
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2">
                            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 backdrop-blur-sm shadow-sm">
                                <div className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-1">نقاط الخبرة</div>
                                <div className="text-lg font-black flex items-center gap-1.5 text-white">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    {totalPoints}
                                </div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 backdrop-blur-sm shadow-sm">
                                <div className="text-[10px] font-black uppercase tracking-widest text-green-400 mb-1">التتابع اليومي</div>
                                <div className="text-lg font-black flex items-center gap-1.5 text-white">
                                    <Activity className="w-4 h-4 text-green-500" />
                                    {streak} أيام
                                </div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 backdrop-blur-sm shadow-sm">
                                <div className="text-[10px] font-black uppercase tracking-widest text-orange-400 mb-1">أحدث شارة</div>
                                <div className="text-lg font-black flex items-center gap-1.5 text-white">
                                    <Trophy className="w-4 h-4 text-orange-500 fill-orange-500" />
                                    {latestBadge}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="w-full md:w-auto flex flex-col gap-4 min-w-[240px]">
                        <Button
                            size="lg"
                            className="w-full bg-white text-blue-900 hover:bg-blue-50 font-black shadow-xl transition-all duration-300 hover:scale-[1.03] active:scale-95 h-14 text-lg"
                            onClick={onStartSession}
                        >
                            <Play className="w-6 h-6 ml-3 fill-current" />
                            ابدأ تمرين اليوم
                        </Button>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-black text-blue-200 px-1 uppercase tracking-wider">
                                <span>التقدم للمستوى التالي</span>
                                <span className="bg-blue-500/20 px-2 py-0.5 rounded text-blue-100">{levelProgress}%</span>
                            </div>
                            <Progress value={levelProgress} className="h-3 bg-white/5 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-blue-400 border border-white/10" />
                        </div>
                    </div>

                </div>
            </CardContent>
        </Card>
    );
};
