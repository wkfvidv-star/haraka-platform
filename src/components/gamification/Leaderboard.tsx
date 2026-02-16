import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Crown, Globe, School, Users } from 'lucide-react';

interface LeaderboardEntry {
    id: string;
    rank: number;
    name: string;
    avatar?: string;
    points: number;
    level: number;
    trend?: 'up' | 'down' | 'stable';
}

interface LeaderboardProps {
    data: {
        class: LeaderboardEntry[];
        school: LeaderboardEntry[];
        global: LeaderboardEntry[];
    };
    currentUserid: string;
}

export function Leaderboard({ data, currentUserid }: LeaderboardProps) {
    const [scope, setScope] = useState<'class' | 'school' | 'global'>('class');

    const currentData = data[scope];

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1: return <Crown className="h-6 w-6 text-yellow-500" />;
            case 2: return <Medal className="h-6 w-6 text-gray-400" />;
            case 3: return <Medal className="h-6 w-6 text-amber-600" />;
            default: return <span className="text-lg font-bold text-gray-500 w-6 text-center">{rank}</span>;
        }
    };

    return (
        <Card className="h-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-yellow-500" />
                            لوحة المتصدرين
                        </CardTitle>
                        <CardDescription>تنافس مع زملائك والطلاب الآخرين</CardDescription>
                    </div>
                    <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                        <Button
                            variant={scope === 'class' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setScope('class')}
                            className="text-xs"
                        >
                            <Users className="h-3 w-3 mr-1" />
                            الفصل
                        </Button>
                        <Button
                            variant={scope === 'school' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setScope('school')}
                            className="text-xs"
                        >
                            <School className="h-3 w-3 mr-1" />
                            المدرسة
                        </Button>
                        <Button
                            variant={scope === 'global' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setScope('global')}
                            className="text-xs"
                        >
                            <Globe className="h-3 w-3 mr-1" />
                            العالم
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {currentData.map((entry) => (
                        <div
                            key={entry.id}
                            className={`flex items-center justify-between p-3 rounded-lg border ${entry.id === currentUserid
                                    ? 'bg-educational-primary/5 border-educational-primary/20'
                                    : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-8">
                                    {getRankIcon(entry.rank)}
                                </div>
                                <Avatar className="h-10 w-10 border-2 border-white dark:border-gray-700 shadow-sm">
                                    <AvatarImage src={entry.avatar} />
                                    <AvatarFallback>{entry.name.slice(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-semibold text-sm flex items-center gap-2">
                                        {entry.name}
                                        {entry.id === currentUserid && (
                                            <Badge variant="secondary" className="text-[10px] h-4">أنت</Badge>
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-500">المستوى {entry.level}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-educational-primary">{entry.points.toLocaleString()}</div>
                                <div className="text-[10px] text-gray-400">نقطة XP</div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
