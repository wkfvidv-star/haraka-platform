import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface RecoveryStep {
    id: number;
    title: string;
    description: string;
    status: 'completed' | 'current' | 'upcoming';
    date?: string;
}

const steps: RecoveryStep[] = [
    { id: 1, title: 'التشخيص الأولي', description: 'تحديد نوع الإصابة ودرجة حدتها.', status: 'completed', date: '2026-02-10' },
    { id: 2, title: 'التحكم في الألم', description: 'تمارين خفيفة لزيادة المدى الحركي.', status: 'completed', date: '2026-02-15' },
    { id: 3, title: 'التقوية الأساسية', description: 'بدء تمارين المقاومة الخفيفة والمستهدفة.', status: 'current' },
    { id: 4, title: 'العودة التدريجية', description: 'دمج الحركات الرياضية المتخصصة.', status: 'upcoming' },
    { id: 5, title: 'الجهوزية الكاملة', description: 'اختبار الأداء النهائي قبل العودة للملاعب.', status: 'upcoming' },
];

export const RecoveryTimeline: React.FC = () => {
    return (
        <Card className="glass-card border-orange-500/20 shadow-2xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -mr-10 -mt-10" />
            <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-10">
                    <div className="p-2.5 rounded-xl bg-orange-500/10 ring-1 ring-orange-500/20">
                        <Activity className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                        <h4 className="text-xl font-black text-white">مسار التعافي الذكي (Recovery Timeline)</h4>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">AI-BACKED REHABILITATION PLAN</p>
                    </div>
                </div>

                <div className="relative space-y-8">
                    {/* Vertical Line */}
                    <div className="absolute top-0 right-[25px] bottom-0 w-0.5 bg-white/5" />

                    {steps.map((step, idx) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-start gap-6 relative z-10"
                        >
                            <div className="flex-shrink-0 mt-1">
                                {step.status === 'completed' && (
                                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center ring-4 ring-green-500/10 border border-green-500/30">
                                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                                    </div>
                                )}
                                {step.status === 'current' && (
                                    <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center ring-4 ring-orange-500/20 border border-orange-500/50 animate-pulse">
                                        <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
                                    </div>
                                )}
                                {step.status === 'upcoming' && (
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center ring-1 ring-white/10 border border-white/5">
                                        <Circle className="w-4 h-4 text-gray-600" />
                                    </div>
                                )}
                            </div>

                            <div className={`flex-1 p-4 rounded-2xl border transition-all ${step.status === 'current'
                                ? 'bg-white/5 border-orange-500/30 shadow-xl'
                                : 'bg-transparent border-transparent'
                                }`}>
                                <div className="flex justify-between items-start mb-1">
                                    <h5 className={`text-base font-black ${step.status === 'upcoming' ? 'text-gray-500' : 'text-white'}`}>
                                        {step.title}
                                    </h5>
                                    {step.date && <span className="text-[10px] font-bold text-gray-500 uppercase">{step.date}</span>}
                                </div>
                                <p className={`text-sm font-medium leading-relaxed ${step.status === 'upcoming' ? 'text-gray-600' : 'text-gray-400'}`}>
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">المرحلة الحالية</span>
                        <span className="text-sm font-black text-orange-400">تقوية العضلات المحيطة (65%)</span>
                    </div>
                    <Button variant="outline" size="sm" className="bg-orange-500/10 border-orange-500/20 text-orange-400 hover:bg-orange-500/20 font-black h-9 px-4 rounded-xl">
                        التفاصيل الطبية <ArrowRight className="w-4 h-4 mr-2" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
