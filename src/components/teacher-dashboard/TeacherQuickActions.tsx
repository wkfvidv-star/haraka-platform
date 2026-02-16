import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, Users, BookOpen, Trophy, MessageSquare } from 'lucide-react';

interface TeacherQuickActionsProps {
    setActiveTab: (tab: string) => void;
    unreadMessages: number;
}

export function TeacherQuickActions({ setActiveTab, unreadMessages }: TeacherQuickActionsProps) {
    return (
        <Card className="glass-card border-blue-500/20 shadow-xl overflow-hidden group">
            <div className="absolute inset-0 bg-blue-600/5 mix-blend-overlay pointer-events-none" />
            <CardHeader className="pb-4 border-b border-white/5">
                <CardTitle className="flex items-center gap-3 text-xl font-black text-white tracking-tight">
                    <div className="p-2 bg-blue-500/10 ring-1 ring-blue-500/20 rounded-lg">
                        <Target className="h-5 w-5 text-blue-400" />
                    </div>
                    الإجراءات السريعة (Quick Access)
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <Button
                        variant="outline"
                        className="h-28 flex-col gap-3 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-blue-500/30 transition-all duration-300 group/btn rounded-2xl shadow-lg shadow-black/20"
                        onClick={() => setActiveTab('classes')}
                    >
                        <div className="p-3 bg-blue-600/10 rounded-xl group-hover/btn:scale-110 group-hover/btn:bg-blue-600/20 transition-all duration-300 ring-1 ring-white/5">
                            <Users className="h-7 w-7 text-blue-400" />
                        </div>
                        <span className="font-black text-sm uppercase tracking-[0.2em] text-white">إدارة الصفوف</span>
                    </Button>

                    <Button
                        variant="outline"
                        className="h-28 flex-col gap-3 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-green-500/30 transition-all duration-300 group/btn rounded-2xl shadow-lg shadow-black/20"
                        onClick={() => setActiveTab('exercises')}
                    >
                        <div className="p-3 bg-green-600/10 rounded-xl group-hover/btn:scale-110 group-hover/btn:bg-green-600/20 transition-all duration-300 ring-1 ring-white/5">
                            <BookOpen className="h-7 w-7 text-green-400" />
                        </div>
                        <span className="font-black text-sm uppercase tracking-[0.2em] text-white">التمارين</span>
                    </Button>

                    <Button
                        variant="outline"
                        className="h-28 flex-col gap-3 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-amber-500/30 transition-all duration-300 group/btn rounded-2xl shadow-lg shadow-black/20"
                        onClick={() => setActiveTab('challenges')}
                    >
                        <div className="p-3 bg-amber-600/10 rounded-xl group-hover/btn:scale-110 group-hover/btn:bg-amber-600/20 transition-all duration-300 ring-1 ring-white/5">
                            <Trophy className="h-7 w-7 text-amber-400" />
                        </div>
                        <span className="font-black text-sm uppercase tracking-[0.2em] text-white">التحديات</span>
                    </Button>

                    <Button
                        variant="outline"
                        className="h-28 flex-col gap-3 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-blue-500/30 transition-all duration-300 group/btn rounded-2xl shadow-lg shadow-black/20 relative"
                        onClick={() => setActiveTab('communication')}
                    >
                        <div className="p-3 bg-blue-600/10 rounded-xl group-hover/btn:scale-110 group-hover/btn:bg-blue-600/20 transition-all duration-300 ring-1 ring-white/5">
                            <MessageSquare className="h-7 w-7 text-blue-400" />
                        </div>
                        <span className="font-black text-sm uppercase tracking-[0.2em] text-white">التواصل</span>
                        {unreadMessages > 0 && (
                            <Badge className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] h-6 w-6 flex items-center justify-center p-0 rounded-full shadow-lg shadow-red-600/20 font-black animate-pulse border-2 border-white">
                                {unreadMessages}
                            </Badge>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
