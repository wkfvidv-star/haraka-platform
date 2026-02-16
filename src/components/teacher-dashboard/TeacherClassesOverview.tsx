import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Eye } from 'lucide-react';

interface ClassItem {
    id: string;
    name: string;
    students: number;
    activeStudents: number;
    averageProgress: number;
    recentActivity: string;
    status: string;
}

interface TeacherClassesOverviewProps {
    classes: ClassItem[];
    onViewAll: () => void;
}

export function TeacherClassesOverview({ classes, onViewAll }: TeacherClassesOverviewProps) {
    return (
        <Card className="glass-card border-blue-500/20 shadow-xl overflow-hidden group">
            <div className="absolute inset-0 bg-blue-600/5 mix-blend-overlay pointer-events-none" />
            <CardHeader className="pb-4 border-b border-white/5">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3 text-xl font-black text-white tracking-tight">
                        <div className="p-2 bg-blue-500/10 ring-1 ring-blue-500/20 rounded-lg">
                            <Users className="h-5 w-5 text-blue-400" />
                        </div>
                        نظرة عامة على الصفوف (Classes Overview)
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-white/5 font-black text-[10px] uppercase tracking-widest" onClick={onViewAll}>
                        عرض الكل
                    </Button>
                </div>
                <CardDescription className="text-gray-400 font-bold mt-1">
                    حالة الصفوف والأنشطة الحديثة وإحصائيات المشاركة
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {classes.map((classItem) => (
                        <Card key={classItem.id} className="bg-black/20 border-white/10 hover:border-blue-500/30 transition-all duration-300 group/class rounded-[2rem] overflow-hidden">
                            <CardHeader className="pb-4 border-b border-white/5">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-xl font-black text-white group-hover/class:text-blue-300 transition-colors uppercase tracking-tight">
                                            {classItem.name}
                                        </CardTitle>
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-[0.1em] mt-1.5">{classItem.students} طالب (Registered Students)</p>
                                    </div>
                                    <Badge className="bg-green-600/20 text-green-400 border-green-600/30 font-black text-[11px] px-3 py-1 uppercase tracking-widest">
                                        {classItem.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-white/5 rounded-2xl border border-white/5 shadow-inner">
                                        <div className="text-2xl font-black text-blue-400 leading-tight">{classItem.activeStudents}</div>
                                        <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">نشط الآن</div>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-2xl border border-white/5 shadow-inner">
                                        <div className="text-2xl font-black text-green-400 leading-tight">{classItem.averageProgress}%</div>
                                        <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">متوسط التقدم</div>
                                    </div>
                                </div>

                                <div className="space-y-3 p-4 bg-black/20 rounded-2xl border border-white/5">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        <span>مؤشر المشاركة</span>
                                        <span className="text-white bg-white/10 px-1.5 py-0.5 rounded">{Math.round((classItem.activeStudents / classItem.students) * 100)}%</span>
                                    </div>
                                    <Progress value={(classItem.activeStudents / classItem.students) * 100} className="h-2 bg-white/5 [&>div]:bg-blue-500" />
                                </div>

                                <div className="text-[10px] font-bold text-gray-400 bg-white/5 p-3 rounded-xl border border-white/5 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                    <span className="font-black text-white/60 uppercase tracking-widest mr-1">النشاط الأخير:</span>
                                    <span className="text-white">{classItem.recentActivity}</span>
                                </div>

                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full bg-blue-600/10 border-blue-500/20 text-blue-400 hover:bg-blue-600 hover:text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all h-10"
                                    onClick={onViewAll}
                                >
                                    <Eye className="h-3.5 w-3.5 mr-2" />
                                    عرض تفاصيل الصف
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
