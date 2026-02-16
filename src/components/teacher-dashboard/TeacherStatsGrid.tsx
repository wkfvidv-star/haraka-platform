import React from 'react';
import { StatsCard } from '@/components/ui/stats-card';
import { Users, BookOpen, FileText, MessageSquare } from 'lucide-react';

interface TeacherStatsGridProps {
    stats: {
        totalStudents: number;
        activeStudents: number;
        completedExercises: number;
        pendingReports: number;
        unreadMessages: number;
    };
}

export function TeacherStatsGrid({ stats }: TeacherStatsGridProps) {
    const participationRate = Math.round((stats.activeStudents / stats.totalStudents) * 100);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
                title="الطلاب النشطون"
                value={`${stats.activeStudents}/${stats.totalStudents}`}
                description={`نسبة المشاركة الحالية ${participationRate}%`}
                icon={Users}
                color="blue"
                trend={{ value: 5, isPositive: true }}
            />
            <StatsCard
                title="التمارين المكتملة"
                value={stats.completedExercises.toString()}
                description="إجمالي الإنجازات هذا الشهر"
                icon={BookOpen}
                color="blue"
                trend={{ value: 15, isPositive: true }}
            />
            <StatsCard
                title="التقارير المعلقة"
                value={stats.pendingReports.toString()}
                description="تنتظر مراجعة الخبير"
                icon={FileText}
                color="blue"
            />
            <StatsCard
                title="رسائل جديدة"
                value={stats.unreadMessages.toString()}
                description="تفاعلات عائلية واردة"
                icon={MessageSquare}
                color="blue"
            />
        </div>
    );
}
