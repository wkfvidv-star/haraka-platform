import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Search, Filter, Eye, MessageSquare, Star, Plus, ShieldCheck, Video
} from 'lucide-react';
import { motion } from 'framer-motion';

// Dummy data for teachers
const MOCK_TEACHERS = [
    { id: 1, name: 'أ. محمود إبراهيم', subject: 'التربية الرياضية', studentsCount: 120, interactionLevel: 95, rating: 4.8, status: 'نشط جداً' },
    { id: 2, name: 'أ. فاطمة سعيد', subject: 'التأهيل الحركي', studentsCount: 45, interactionLevel: 88, rating: 4.5, status: 'نشط' },
    { id: 3, name: 'أ. عبد الله كمال', subject: 'اللياقة البدنية', studentsCount: 85, interactionLevel: 65, rating: 3.9, status: 'متوسط التفاعل' },
    { id: 4, name: 'أ. ريم الدوسري', subject: 'التربية الرياضية', studentsCount: 110, interactionLevel: 92, rating: 4.7, status: 'نشط' },
];

export const AdminTeachers: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const getInteractionColor = (level: number) => {
        if (level >= 90) return 'text-emerald-500';
        if (level >= 75) return 'text-blue-500';
        if (level >= 50) return 'text-amber-500';
        return 'text-rose-500';
    };

    const getInteractionBgColor = (level: number) => {
        if (level >= 90) return 'bg-emerald-500';
        if (level >= 75) return 'bg-blue-500';
        if (level >= 50) return 'bg-amber-500';
        return 'bg-rose-500';
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight">إدارة المعلمين والمدربين</h2>
                    <p className="text-slate-400 font-medium mt-1">
                        متابعة جودة التدريب، مستوى التفاعل، والمقررات المسندة
                    </p>
                </div>
                <Button className="bg-[#3b82f6] hover:bg-blue-600 text-white font-bold rounded-xl gap-2 shadow-lg shadow-blue-500/20">
                    <Plus className="w-4 h-4" />
                    إضافة معلم
                </Button>
            </div>

            {/* Filters and Search */}
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800">
                <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                            placeholder="ابحث بالاسم أو التخصص..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 pr-10 rounded-xl focus:ring-[#3b82f6]"
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button variant="outline" className="flex-1 md:flex-none bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl gap-2">
                            <Filter className="w-4 h-4" />
                            تصفية القسم
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Grid of Teacher Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {MOCK_TEACHERS.map((teacher, idx) => (
                    <motion.div
                        key={teacher.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800 hover:border-slate-700 transition-colors h-full flex flex-col group">
                            <CardContent className="p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex gap-4 items-center">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/30 text-indigo-400 font-bold text-xl relative">
                                            {teacher.name.split(' ')[1]?.charAt(0) || teacher.name.charAt(0)}
                                            {teacher.rating >= 4.5 && (
                                                <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full p-0.5 border-2 border-slate-900">
                                                    <Star className="w-3 h-3 text-white fill-white" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-lg text-white group-hover:text-indigo-400 transition-colors">{teacher.name}</h3>
                                            <p className="text-sm font-medium text-slate-400">{teacher.subject}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6 flex-1">
                                    <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-800/50">
                                        <p className="text-xs text-slate-500 mb-1">الطلاب المسجلين</p>
                                        <p className="font-bold text-white text-lg">{teacher.studentsCount}</p>
                                    </div>
                                    <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-800/50">
                                        <p className="text-xs text-slate-500 mb-1">نسبة التفاعل</p>
                                        <div className="flex items-center gap-2">
                                            <p className={`font-bold text-lg ${getInteractionColor(teacher.interactionLevel)}`}>
                                                {teacher.interactionLevel}%
                                            </p>
                                            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                <div className={`h-full ${getInteractionBgColor(teacher.interactionLevel)}`} style={{ width: `${teacher.interactionLevel}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-4 border-t border-slate-800">
                                    <Button variant="ghost" className="flex-1 bg-white/5 hover:bg-white/10 text-white rounded-lg h-10 gap-2">
                                        <Eye className="w-4 h-4 text-indigo-400" />
                                        الملف
                                    </Button>
                                    <Button variant="ghost" className="flex-1 bg-white/5 hover:bg-white/10 text-white rounded-lg h-10 gap-2">
                                        <Video className="w-4 h-4 text-purple-400" />
                                        مراجعة الفيديوهات
                                    </Button>
                                    <Button variant="ghost" size="icon" className="bg-white/5 hover:bg-blue-500/20 hover:text-blue-400 text-slate-400 rounded-lg h-10 w-10 shrink-0">
                                        <MessageSquare className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default AdminTeachers;
