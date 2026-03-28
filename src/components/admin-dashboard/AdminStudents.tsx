import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Search, Filter, MoreVertical, Activity, HeartPulse, Brain, Eye, MessageSquare, AlertCircle, Plus
} from 'lucide-react';
import { motion } from 'framer-motion';

// Dummy data for students
const MOCK_STUDENTS = [
    { id: 1, name: 'ياسين أحمد', age: 10, grade: 'الخامس', activity: 'high', health: 'excellent', psych: 'stable', lastActive: 'اليوم, 10:30 ص' },
    { id: 2, name: 'سارة خالد', age: 11, grade: 'السادس', activity: 'medium', health: 'good', psych: 'needs_attention', lastActive: 'أمس, 02:15 م' },
    { id: 3, name: 'عمر محمود', age: 9, grade: 'الرابع', activity: 'low', health: 'needs_review', psych: 'stable', lastActive: 'منذ يومين' },
    { id: 4, name: 'لينا سالم', age: 12, grade: 'السابع', activity: 'high', health: 'excellent', psych: 'excellent', lastActive: 'اليوم, 08:00 ص' },
    { id: 5, name: 'يوسف رامي', age: 10, grade: 'الخامس', activity: 'medium', health: 'good', psych: 'stable', lastActive: 'اليوم, 11:45 ص' },
];

export const AdminStudents: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const getActivityBadge = (level: string) => {
        switch (level) {
            case 'high': return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">مرتفع</Badge>;
            case 'medium': return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">متوسط</Badge>;
            case 'low': return <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20">منخفض</Badge>;
            default: return null;
        }
    };

    const getHealthIcon = (status: string) => {
        switch (status) {
            case 'excellent': return <HeartPulse className="w-5 h-5 text-emerald-500" title="ممتاز" />;
            case 'good': return <HeartPulse className="w-5 h-5 text-blue-500" title="جيد" />;
            case 'needs_review': return <HeartPulse className="w-5 h-5 text-rose-500 animate-pulse" title="يحتاج مراجعة" />;
            default: return null;
        }
    };

    const getPsychIcon = (status: string) => {
        switch (status) {
            case 'excellent': return <Brain className="w-5 h-5 text-emerald-500" title="ممتاز" />;
            case 'stable': return <Brain className="w-5 h-5 text-blue-500" title="مستقر" />;
            case 'needs_attention': return <Brain className="w-5 h-5 text-amber-500" title="يحتاج انتباه" />;
            default: return null;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight">إدارة التلاميذ</h2>
                    <p className="text-slate-400 font-medium mt-1">
                        متابعة شاملة للملفات الشخصية، الأداء، والصحة لجميع التلاميذ
                    </p>
                </div>
                <Button className="bg-[#3b82f6] hover:bg-blue-600 text-white font-bold rounded-xl gap-2 shadow-lg shadow-blue-500/20">
                    <Plus className="w-4 h-4" />
                    إضافة تلميذ جديد
                </Button>
            </div>

            {/* Filters and Search */}
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800">
                <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                            placeholder="ابحث بالاسم أو الصف..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 pr-10 rounded-xl focus:ring-[#3b82f6]"
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button variant="outline" className="flex-1 md:flex-none bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl gap-2">
                            <Filter className="w-4 h-4" />
                            تصفية متقدمة
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Students Table */}
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-slate-950/50 border-b border-slate-800">
                                <th className="p-4 text-sm font-bold text-slate-400">التلميذ</th>
                                <th className="p-4 text-sm font-bold text-slate-400">العمر / الصف</th>
                                <th className="p-4 text-sm font-bold text-slate-400 text-center">النشاط البدني</th>
                                <th className="p-4 text-sm font-bold text-slate-400 text-center">الصحة / النفسية</th>
                                <th className="p-4 text-sm font-bold text-slate-400">آخر نشاط</th>
                                <th className="p-4 text-sm font-bold text-slate-400 text-center">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {MOCK_STUDENTS.map((student, idx) => (
                                <motion.tr
                                    key={student.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="hover:bg-slate-800/20 transition-colors group"
                                >
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30 text-blue-400 font-bold">
                                                {student.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-sm">{student.name}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">ID: STU-{student.id}000</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <p className="font-medium text-slate-300">{student.grade}</p>
                                        <p className="text-xs text-slate-500">{student.age} سنوات</p>
                                    </td>
                                    <td className="p-4 text-center">
                                        {getActivityBadge(student.activity)}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-center gap-3">
                                            {getHealthIcon(student.health)}
                                            {getPsychIcon(student.psych)}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <p className="text-sm font-medium text-slate-400">{student.lastActive}</p>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300" title="عرض الملف">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300" title="إرسال رسالة للولي">
                                                <MessageSquare className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-400 hover:bg-amber-500/20 hover:text-amber-300" title="تنبيه المدرب">
                                                <AlertCircle className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default AdminStudents;
