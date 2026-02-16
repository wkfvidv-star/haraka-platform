import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, CheckCircle, Trophy, FileText } from 'lucide-react';

interface ActivityItem {
    id: string;
    type: string;
    student: string;
    activity: string;
    class: string;
    time: string;
    score: number | null;
}

interface TeacherRecentActivityProps {
    activities: ActivityItem[];
}

export function TeacherRecentActivity({ activities }: TeacherRecentActivityProps) {
    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'exercise_completed': return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'challenge_joined': return <Trophy className="h-5 w-5 text-amber-500" />;
            case 'report_requested': return <FileText className="h-5 w-5 text-blue-500" />;
            default: return <Activity className="h-5 w-5 text-gray-500" />;
        }
    };

    return (
        <Card className="glass-card border-blue-500/20 shadow-xl overflow-hidden group h-full">
            <div className="absolute inset-0 bg-blue-600/5 mix-blend-overlay pointer-events-none" />
            <CardHeader className="pb-4 border-b border-white/5">
                <CardTitle className="flex items-center gap-3 text-xl font-black text-white tracking-tight">
                    <div className="p-2 bg-green-500/10 ring-1 ring-green-500/20 rounded-lg">
                        <Activity className="h-5 w-5 text-green-400" />
                    </div>
                    الأنشطة الحديثة (Recent Activity)
                </CardTitle>
                <CardDescription className="text-gray-400 font-bold mt-1">
                    آخر الأنشطة والتفاعلات مع الطلاب في جميع الصفوف
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="space-y-4">
                    {activities.map((activity) => (
                        <div key={activity.id} className="group/activity relative overflow-hidden flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-blue-500/20 transition-all duration-300 shadow-lg">
                            <div className="flex items-center gap-4 flex-1 min-w-0 z-10">
                                <div className="p-3 bg-black/20 rounded-xl ring-1 ring-white/5 group-hover/activity:scale-110 transition-transform duration-300">
                                    {getActivityIcon(activity.type)}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="font-black text-sm text-white truncate group-hover/activity:text-blue-300 transition-colors uppercase tracking-tight">
                                        {activity.student}
                                    </h4>
                                    <p className="text-xs font-bold text-gray-400 truncate mt-0.5">{activity.activity}</p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <Badge variant="outline" className="text-[10px] font-black text-blue-300 border-blue-500/30 bg-blue-500/5 px-2 h-5 uppercase tracking-widest">
                                            {activity.class}
                                        </Badge>
                                        <div className="flex items-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                            <span>{activity.time}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {activity.score && (
                                <div className="text-right flex-shrink-0 z-10 pl-4 border-l border-white/5">
                                    <div className="text-2xl font-black text-blue-400 leading-tight">{activity.score}%</div>
                                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">النتيجة</div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="mt-8 border-t border-white/5 pt-4">
                    <Button variant="ghost" size="sm" className="w-full text-gray-400 hover:text-white hover:bg-white/5 font-black text-[10px] uppercase tracking-widest h-10">
                        عرض سجل الأنشطة الكامل
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
