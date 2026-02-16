import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Bell, Mail, Star, Activity, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ParentIdentityCardProps {
    parentName?: string;
    childrenCount?: number;
    unreadMessages?: number;
    activeAlerts?: number;
    familyScore?: number; // Gamification element for the family
    onViewMessages?: () => void;
}

export const ParentIdentityCard: React.FC<ParentIdentityCardProps> = ({
    parentName = "ولي الأمر",
    childrenCount = 3,
    unreadMessages = 2,
    activeAlerts = 1,
    familyScore = 85, // out of 100
    onViewMessages
}) => {
    return (
        <Card className="w-full glass-card border-blue-500/20 shadow-[0_0_50px_rgba(0,0,0,0.3)] overflow-hidden relative group">
            <div className="absolute inset-0 bg-blue-600/10 mix-blend-overlay pointer-events-none" />

            <CardContent className="p-8 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-8">

                    {/* Avatar Section */}
                    <div className="relative group/avatar">
                        <div className="w-28 h-28 rounded-full p-1.5 bg-white/10 backdrop-blur-md ring-1 ring-white/20 transition-transform group-hover/avatar:scale-105 duration-300">
                            <Avatar className="w-full h-full border-2 border-white/50 shadow-2xl">
                                <AvatarImage src="/avatars/parent-1.png" alt={parentName} />
                                <AvatarFallback className="bg-blue-900 text-white text-2xl font-black">
                                    {parentName.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 text-[10px] font-black px-3 py-1 rounded-full border border-white shadow-xl uppercase tracking-wider">
                            دعم الأسرة
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="flex-1 text-center md:text-right space-y-4">
                        <div>
                            <h2 className="text-3xl font-black text-white tracking-tight">{parentName}</h2>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2">
                                <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border border-white/10 font-black text-[10px] px-3 py-0.5 uppercase">
                                    ولي أمر متميز
                                </Badge>
                                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-200">
                                    <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                                    <span>مشاركة استثنائية (Expert Level)</span>
                                </div>
                            </div>
                        </div>

                        {/* Stats Row */}
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            {[
                                { icon: Users, label: 'الأطفال', value: childrenCount, color: 'text-blue-400' },
                                { icon: Bell, label: 'تنبيهات', value: activeAlerts, color: 'text-orange-400' },
                                { icon: Mail, label: 'رسائل', value: `${unreadMessages} جديد`, color: 'text-green-400' }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 backdrop-blur-md shadow-lg flex items-center gap-3 group/stat hover:bg-white/10 transition-colors cursor-default">
                                    <stat.icon className={`w-5 h-5 ${stat.color} drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]`} />
                                    <div>
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{stat.label}</div>
                                        <div className="text-sm font-black text-white">{stat.value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="w-full md:w-auto flex flex-col gap-4 min-w-[240px]">
                        <Button
                            size="lg"
                            className="w-full h-14 bg-white text-blue-900 hover:bg-blue-50 font-black shadow-2xl shadow-white/10 transition-all hover:scale-[1.02] active:scale-95 text-lg rounded-2xl"
                            onClick={onViewMessages}
                        >
                            <Mail className="w-5 h-5 ml-3 fill-current" />
                            فتح صندوق الوارد
                        </Button>
                        <div className="space-y-3 p-4 bg-black/20 rounded-2xl border border-white/5">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-blue-200">
                                <span>مؤشر النشاط العائلي</span>
                                <span className="text-white bg-white/10 px-2 py-0.5 rounded">{familyScore}%</span>
                            </div>
                            <Progress value={familyScore} className="h-2 bg-white/10 [&>div]:bg-green-500 shadow-inner" />
                        </div>
                    </div>

                </div>
            </CardContent>
        </Card>
    );
};
