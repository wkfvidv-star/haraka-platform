import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Activity, Heart, Calendar, Users } from 'lucide-react';

interface ChildSummary {
    id: string;
    name: string;
    avatarUrl?: string;
    age: number;
    activityLevel: number; // 0-100
    healthScore: number; // 0-100
    nextSession?: string;
}

interface ChildrenOverviewProps {
    children?: ChildSummary[];
    onViewChild?: (id: string) => void;
}

export const ChildrenOverview: React.FC<ChildrenOverviewProps> = ({
    children = [
        { id: '1', name: "أحمد", age: 14, activityLevel: 85, healthScore: 92, nextSession: "اليوم 16:00" },
        { id: '2', name: "فاطمة", age: 12, activityLevel: 78, healthScore: 95, nextSession: "غداً 15:30" },
        { id: '3', name: "يوسف", age: 10, activityLevel: 90, healthScore: 88, nextSession: "اليوم 18:00" },
    ],
    onViewChild
}) => {
    return (
        <Card className="glass-card border-white/10 shadow-2xl h-full relative overflow-hidden group">
            <CardHeader className="border-b border-white/5 pb-4 relative z-10">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                            <Users className="h-5 w-5 text-blue-400" />
                            ملخص الأبطال (Heroes Overview)
                        </CardTitle>
                        <CardDescription className="text-gray-400 font-bold mt-1">نظرة سريعة على أداء أطفالك هذا الأسبوع</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-8 relative z-10">
                <div className="space-y-10">
                    {children.map((child) => (
                        <div key={child.id} className="group/child relative">
                            <div className="flex items-start gap-6">
                                <Avatar className="h-14 w-14 border-2 border-white/20 shadow-2xl cursor-pointer ring-4 ring-white/5 transition-all group-hover/child:ring-blue-500/30 group-hover/child:scale-105" onClick={() => onViewChild?.(child.id)}>
                                    <AvatarImage src={child.avatarUrl} alt={child.name} />
                                    <AvatarFallback className="bg-blue-900 text-white font-black text-lg">{child.name[0]}</AvatarFallback>
                                </Avatar>

                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div onClick={() => onViewChild?.(child.id)} className="cursor-pointer">
                                            <h4 className="font-black text-white text-lg group-hover/child:text-blue-300 transition-colors uppercase tracking-tight">
                                                {child.name}
                                            </h4>
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{child.age} سنة (Active Member)</p>
                                        </div>
                                        {child.nextSession && (
                                            <div className="flex items-center text-[10px] font-black text-blue-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
                                                <Calendar className="w-3.5 h-3.5 ml-1.5 text-blue-400" />
                                                {child.nextSession}
                                            </div>
                                        )}
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2.5 p-3 rounded-2xl bg-black/20 border border-white/5">
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                <span className="flex items-center"><Activity className="w-3 h-3 ml-1.5 text-green-400" /> مؤشر النشاط</span>
                                                <span className="text-white bg-white/10 px-1.5 py-0.5 rounded">{child.activityLevel}%</span>
                                            </div>
                                            <Progress value={child.activityLevel} className="h-2 bg-white/5 [&>div]:bg-green-500" />
                                        </div>
                                        <div className="space-y-2.5 p-3 rounded-2xl bg-black/20 border border-white/5">
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                <span className="flex items-center"><Heart className="w-3 h-3 ml-1.5 text-red-500" /> الحماية الصحية</span>
                                                <span className="text-white bg-white/10 px-1.5 py-0.5 rounded">{child.healthScore}%</span>
                                            </div>
                                            <Progress value={child.healthScore} className="h-2 bg-white/5 [&>div]:bg-red-500" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Separator if not last */}
                            {children.indexOf(child) !== children.length - 1 && (
                                <div className="absolute -bottom-5 left-0 right-0 h-px bg-white/5" />
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
