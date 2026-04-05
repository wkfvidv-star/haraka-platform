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

            {/* Professional Audit Ledger (Credibility & Transparency) */}
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800 mt-8 overflow-hidden">
                <CardHeader className="border-b border-slate-800 bg-slate-950/50">
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                                <Shield className="w-5 h-5 text-teal-500" />
                                سجل العمليات والتدقيق (Audit Ledger)
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                                تتبع كامل وشامل لكل العمليات في النظام لضمان المصداقية
                            </CardDescription>
                        </div>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => { (window as any).auditLedger?.(); }}
                            className="bg-teal-500/10 text-teal-400 border-teal-500/20 hover:bg-teal-500/20"
                        >
                            تحديث السجل
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-right border-collapse">
                            <thead>
                                <tr className="bg-slate-900 text-slate-400 text-xs uppercase font-black tracking-widest border-b border-slate-800">
                                    <th className="px-6 py-4">الوقت</th>
                                    <th className="px-6 py-4">المنفذ (الدور)</th>
                                    <th className="px-6 py-4">العملية</th>
                                    <th className="px-6 py-4">التفاصيل</th>
                                    <th className="px-px"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {(auditService.getAllLogs().length > 0 ? auditService.getAllLogs().slice(0, 10) : [
                                    { timestamp: new Date().toISOString(), actorRole: 'system', action: 'بدء التشغيل', details: 'تحميل سجلات النظام مؤقتاً...', category: 'system' }
                                ]).map((log: any, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4 text-xs font-bold text-slate-300">
                                            {new Date(log.timestamp).toLocaleTimeString('ar-DZ')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className={`
                                                    font-black text-[10px] 
                                                    ${log.actorRole === 'admin' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 
                                                      log.actorRole === 'teacher' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                      log.actorRole === 'parent' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                      'bg-slate-500/10 text-slate-400 border-slate-500/20'}
                                                `}>
                                                    {log.actorRole === 'admin' ? 'إدارة' : 
                                                     log.actorRole === 'teacher' ? 'أستاذ' :
                                                     log.actorRole === 'parent' ? 'ولي أمر' :
                                                     log.actorRole === 'system' ? 'النظام' : log.actorRole}
                                                </Badge>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-black text-white">
                                            {log.action}
                                        </td>
                                        <td className="px-6 py-4 text-xs font-bold text-slate-400 max-w-sm truncate">
                                            {log.details}
                                        </td>
                                        <td className="px-6 py-4 text-left">
                                            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ArrowUpRight className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
};

export default AdminReports;

// Needed inside AdminReports for imports locally
import { Activity, HeartPulse, Users } from 'lucide-react';
