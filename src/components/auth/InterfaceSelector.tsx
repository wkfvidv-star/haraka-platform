import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    GraduationCap,
    Users,
    UserCircle,
    Briefcase,
    Building2,
    ShieldCheck,
    Dumbbell,
    Trophy,
    ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Environment, UserRole } from '@/contexts/AuthContext';

interface InterfaceOption {
    key: UserRole;
    label: string;
    description: string;
    icon: React.ReactNode;
    color: string;
}

interface InterfaceSelectorProps {
    environment: Environment;
    onSelectRole: (role: UserRole) => void;
    onBack: () => void;
}

export const InterfaceSelector: React.FC<InterfaceSelectorProps> = ({ environment, onSelectRole, onBack }) => {
    const options: InterfaceOption[] = environment === 'school' ? [
        { key: 'student', label: 'واجهة التلميذ', description: 'الوصول إلى الأنشطة المدرسية والرحلة التعليمية', icon: <GraduationCap className="w-8 h-8" />, color: 'bg-blue-500' },
        { key: 'parent', label: 'واجهة الولي', description: 'متابعة أداء ومسار الأبناء التربوي', icon: <Users className="w-8 h-8" />, color: 'bg-indigo-500' },
        { key: 'teacher', label: 'واجهة المعلم', description: 'إدارة القسم وتقييم الأنشطة الصفية', icon: <UserCircle className="w-8 h-8" />, color: 'bg-cyan-500' },
        { key: 'principal', label: 'واجهة المدير', description: 'الإشراف الإداري والتربوي على المؤسسة', icon: <Building2 className="w-8 h-8" />, color: 'bg-blue-700' },
        { key: 'directorate', label: 'بوابة المديرية', description: 'متابعة إحصائيات وأداء الولاية', icon: <Briefcase className="w-8 h-8" />, color: 'bg-slate-700' },
        { key: 'ministry', label: 'بوابة الوزارة', description: 'الإشراف الوطني وصناعة القرار التربوي', icon: <ShieldCheck className="w-8 h-8" />, color: 'bg-slate-900' },
    ] : [
        { key: 'youth', label: 'واجهة الشاب', description: 'استكشاف التحديات والنوادي والفرص الإبداعية', icon: <Dumbbell className="w-8 h-8" />, color: 'bg-orange-500' },
        { key: 'coach', label: 'واجهة المدرب', description: 'قيادة الفرق وتطوير مهارات الشباب', icon: <UserCircle className="w-8 h-8" />, color: 'bg-rose-500' },
        { key: 'competition', label: 'واجهة المنظم', description: 'إدارة المسابقات والفعاليات الكبرى', icon: <Trophy className="w-8 h-8" />, color: 'bg-amber-500' },
    ];

    return (
        <div className="w-full max-w-5xl mx-auto px-4 py-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex items-center justify-between mb-8">
                <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/10 gap-2">
                    <ArrowRight className="w-4 h-4" />
                    رجوع للبوابات
                </Button>
                <div className="text-right">
                    <h2 className="text-3xl font-black text-white mb-2">اختر الواجهة المختصة</h2>
                    <p className="text-blue-100/60 font-bold">حدد نوع الحساب الذي تريد الوصول إليه أو إنشاؤه</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {options.map((option, idx) => (
                    <motion.div
                        key={option.key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSelectRole(option.key)}
                        className="cursor-pointer group"
                    >
                        <Card className="h-full border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all border-l-4 group-hover:bg-white/15" style={{ borderLeftColor: option.color.replace('bg-', '') }}>
                            <CardContent className="p-6 flex flex-col items-center text-center">
                                <div className={`w-16 h-16 rounded-2xl ${option.color} flex items-center justify-center mb-6 shadow-xl shadow-black/20 group-hover:scale-110 transition-transform`}>
                                    {React.cloneElement(option.icon as React.ReactElement, { className: 'w-10 h-10 text-white' })}
                                </div>
                                <h3 className="text-xl font-black text-white mb-3 tracking-tight">{option.label}</h3>
                                <p className="text-sm text-gray-400 font-bold leading-relaxed">{option.description}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
