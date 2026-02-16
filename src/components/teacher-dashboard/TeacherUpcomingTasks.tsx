import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileText, Trophy, BookOpen, Edit, Clock } from 'lucide-react';

interface TaskItem {
    id: string;
    title: string;
    dueDate: string;
    priority: string;
    type: string;
}

interface TeacherUpcomingTasksProps {
    tasks: TaskItem[];
}

export function TeacherUpcomingTasks({ tasks }: TeacherUpcomingTasksProps) {
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'عاجل': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 border-red-200';
            case 'مهم': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200 border-orange-200';
            case 'عادي': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTaskIcon = (type: string) => {
        switch (type) {
            case 'تقرير': return <FileText className="h-5 w-5 text-white" />;
            case 'تحدي': return <Trophy className="h-5 w-5 text-white" />;
            case 'تمرين': return <BookOpen className="h-5 w-5 text-white" />;
            default: return <Calendar className="h-5 w-5 text-white" />;
        }
    };

    const getTaskColor = (type: string) => {
        switch (type) {
            case 'تقرير': return 'bg-blue-500';
            case 'تحدي': return 'bg-amber-500';
            case 'تمرين': return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <Card className="glass-card border-blue-500/20 shadow-xl overflow-hidden group h-full">
            <div className="absolute inset-0 bg-blue-600/5 mix-blend-overlay pointer-events-none" />
            <CardHeader className="pb-4 border-b border-white/5">
                <CardTitle className="flex items-center gap-3 text-xl font-black text-white tracking-tight">
                    <div className="p-2 bg-orange-500/10 ring-1 ring-orange-500/20 rounded-lg">
                        <Calendar className="h-5 w-5 text-orange-400" />
                    </div>
                    المهام القادمة (Upcoming Tasks)
                </CardTitle>
                <CardDescription className="text-gray-400 font-bold mt-1">
                    المهام والمواعيد والتقارير المطلوبة قريباً
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="space-y-4">
                    {tasks.map((task) => (
                        <div key={task.id} className="group/task relative overflow-hidden flex items-start justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-blue-500/20 transition-all duration-300 shadow-lg">
                            <div className="flex items-start gap-4 flex-1 min-w-0 z-10">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getTaskColor(task.type)} shadow-xl ring-1 ring-white/20 group-hover/task:scale-110 transition-transform duration-300`}>
                                    {getTaskIcon(task.type)}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="font-black text-sm text-white group-hover/task:text-blue-300 transition-colors uppercase tracking-tight leading-tight">
                                        {task.title}
                                    </h4>
                                    <div className="flex flex-wrap items-center gap-3 mt-3">
                                        <Badge className={`text-[10px] font-black px-2.5 py-0.5 border-2 uppercase tracking-widest ${getPriorityColor(task.priority)}`}>
                                            {task.priority}
                                        </Badge>
                                        <div className="flex items-center text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                            <Clock className="w-3.5 h-3.5 mr-1.5 text-blue-400 opacity-70" />
                                            {task.dueDate}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Button size="icon" variant="ghost" className="h-10 w-10 text-gray-500 hover:text-white hover:bg-white/10 rounded-xl transition-all active:scale-95 z-10">
                                <Edit className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
                <div className="mt-8 border-t border-white/5 pt-4">
                    <Button variant="ghost" className="w-full text-blue-400 hover:text-white hover:bg-blue-600 font-black text-[10px] uppercase tracking-widest h-10 border border-blue-500/20 rounded-xl transition-all">
                        إضافة مهمة جديدة (New Task)
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
