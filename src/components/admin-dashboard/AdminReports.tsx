import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Share2, FileBarChart, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminReports: React.FC = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-cairo">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                        <FileText className="w-8 h-8 text-teal-500" />
                        منشئ التقارير الشاملة
                    </h2>
                    <p className="text-slate-400 font-medium mt-1">
                        إنشاء تقارير مفصلة، تصدير البيانات (PDF, Excel)، ومشاركتها مع الجهات المعنية
                    </p>
                </div>
                <Button variant="outline" className="bg-slate-900 border-slate-700 text-slate-300 hover:text-white rounded-xl">
                    <Filter className="w-4 h-4 ml-2" />
                    سجل التقارير السابقة
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {[
                    { title: 'تقرير الأداء العام', desc: 'شامل لكل التقييمات', icon: FileBarChart, color: 'text-blue-500', btn: 'bg-blue-600 hover:bg-blue-700' },
                    { title: 'تقرير النشاط البدني', desc: 'تفاصيل اللياقة والسرعة', icon: Activity, color: 'text-emerald-500', btn: 'bg-emerald-600 hover:bg-emerald-700' },
                    { title: 'تقرير الصحة النفسية', desc: 'مؤشرات التحفيز والتفاعل', icon: HeartPulse, color: 'text-rose-500', btn: 'bg-rose-600 hover:bg-rose-700' },
                    { title: 'تقرير الحضور والتفاعل', desc: 'مشاركة المعلمين والتلاميذ', icon: Users, color: 'text-purple-500', btn: 'bg-purple-600 hover:bg-purple-700' },
                ].map((rep, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800 hover:border-slate-700 transition-colors h-full flex flex-col">
                            <CardHeader className="pb-4">
                                <div className="p-3 bg-slate-950 rounded-xl w-fit mb-4 border border-slate-800/50">
                                    <rep.icon className={`w-6 h-6 ${rep.color}`} />
                                </div>
                                <CardTitle className="text-xl font-bold text-white">{rep.title}</CardTitle>
                                <CardDescription className="text-slate-400 font-medium">{rep.desc}</CardDescription>
                            </CardHeader>
                            <CardContent className="mt-auto space-y-3">
                                <Button className={`w-full text-white font-bold rounded-xl shadow-lg shadow-black/20 ${rep.btn}`}>
                                    <Download className="w-4 h-4 ml-2" />
                                    تصدير PDF
                                </Button>
                                <Button variant="outline" className="w-full bg-transparent border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl font-bold">
                                    <Share2 className="w-4 h-4 ml-2" />
                                    إرسال لولي الأمر/المعلم
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Custom Report Builder Space */}
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800 mt-8 border-dashed">
                <CardContent className="p-12 text-center flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center mb-6">
                        <FileText className="w-10 h-10 text-slate-600" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">تخصيص تقرير جديد</h3>
                    <p className="text-slate-500 max-w-md">يمكنك استخدام محرك الذكاء الاصطناعي لإنشاء تقرير مخصص يجمع بيانات من مصادر متعددة وتصديره إلى Excel أو PDF.</p>
                    <Button className="mt-6 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl px-8">
                        البدء في التخصيص
                    </Button>
                </CardContent>
            </Card>

        </div>
    );
};

export default AdminReports;

// Needed inside AdminReports for imports locally
import { Activity, HeartPulse, Users } from 'lucide-react';
