import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Clock, Users, ArrowUpRight } from 'lucide-react';

export const SmartCompetitions: React.FC = () => {

    const challenges = [
        {
            id: 1,
            title: 'تحدي 5000 خطوة',
            type: 'نشاط بدني',
            participants: 1240,
            timeLeft: '5 ساعات',
            reward: '50 XP',
            color: 'bg-blue-100 text-blue-700',
            icon: '👣'
        },
        {
            id: 2,
            title: 'ملك التوازن',
            type: 'مهارة حركية',
            participants: 350,
            timeLeft: 'يومان',
            reward: 'شارة',
            color: 'bg-yellow-100 text-yellow-700',
            icon: '⚖️'
        },
        {
            id: 3,
            title: 'أسرع رد فعل',
            type: 'ذهني',
            participants: 89,
            timeLeft: '12 ساعة',
            reward: '100 XP',
            color: 'bg-purple-100 text-purple-700',
            icon: '⚡'
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <div className="p-2 rounded-xl bg-yellow-500/10 ring-1 ring-yellow-500/20">
                        <Trophy className="w-6 h-6 text-yellow-500" />
                    </div>
                    <h3 className="text-2xl font-black text-white tracking-tight">
                        المنافسات النشطة
                    </h3>
                </div>
                <Button variant="ghost" className="text-sm font-black text-blue-400 hover:bg-blue-500/10">عرض الكل</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {challenges.map((challenge) => (
                    <Card key={challenge.id} className="glass-card group hover:scale-[1.03] transition-all duration-300 border-white/10 shadow-2xl relative overflow-hidden">
                        {/* Interactive Glow */}
                        <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/[0.03] transition-colors pointer-events-none" />

                        <CardHeader className="pb-4 relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner ring-1 ring-white/10 bg-white/5`}>
                                    {challenge.icon}
                                </div>
                                <Badge variant="outline" className="bg-white/5 text-gray-400 border-white/10 px-2 py-0.5 font-black text-[10px] uppercase">
                                    <Clock className="w-3 h-3 mr-1 ml-1" />
                                    {challenge.timeLeft}
                                </Badge>
                            </div>
                            <CardTitle className="text-xl font-black text-white leading-tight group-hover:text-blue-300 transition-colors">
                                {challenge.title}
                            </CardTitle>
                            <CardDescription className="text-sm font-bold text-gray-500 mt-1 uppercase tracking-wider">
                                {challenge.type}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="flex items-center justify-between text-xs font-black mb-6">
                                <span className="flex items-center gap-2 text-gray-400">
                                    <Users className="w-4 h-4 text-blue-400" />
                                    {challenge.participants.toLocaleString()} متسابق
                                </span>
                                <span className="text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20">
                                    +{challenge.reward === 'Badge' ? 'شارة' : challenge.reward}
                                </span>
                            </div>
                            <Button className="w-full h-11 bg-white text-blue-900 hover:bg-blue-50 font-black rounded-xl shadow-lg transition-all active:scale-95">
                                انضم الآن
                                <ArrowUpRight className="w-4 h-4 ml-2" />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
