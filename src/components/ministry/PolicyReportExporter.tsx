import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, FileBarChart, Download, FileJson, Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function PolicyReportExporter() {
    const [selectedReport, setSelectedReport] = useState('quarterly-skills');
    const [format, setFormat] = useState('pdf');
    const [isExporting, setIsExporting] = useState(false);
    const [hasExported, setHasExported] = useState(false);

    const reports = [
        { id: 'quarterly-skills', name: 'التقرير الفصلي للمهارات الحركية الوطنية', desc: 'تحليل شامل لجميع المدارس بناءً على 7 مؤشرات' },
        { id: 'talent-discovery', name: 'إحصاءات المواهب الرياضية المكتشفة', desc: 'استهداف وزارة الشباب لبرامج الرعاية' },
        { id: 'health-risk', name: 'مؤشرات المخاطر الصحية والبدنية', desc: 'للتنسيق مع وزارة الصحة' },
        { id: 'curriculum-impact', name: 'أثر برامج التربية البدنية', desc: 'مقارنة المناهج وتقييم الكفاءة' }
    ];

    const handleExport = () => {
        setIsExporting(true);
        setHasExported(false);

        // Simulate API call to generate report
        setTimeout(() => {
            setIsExporting(false);
            setHasExported(true);

            // Reset success state after 3 seconds
            setTimeout(() => setHasExported(false), 3000);
        }, 2000);
    };

    return (
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-6 text-white border border-indigo-500/20 shadow-xl overflow-hidden relative h-full flex flex-col">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-20"></div>

            <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
                            <FileBarChart className="w-6 h-6 text-indigo-300" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black">مولد التقارير الوزارية</h3>
                            <p className="text-indigo-200/80 text-sm mt-0.5">بدون بيانات شخصية (No PII)</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 flex-1">
                    <div>
                        <label className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-2 block">نوع التقرير</label>
                        <div className="grid grid-cols-1 gap-2">
                            {reports.map(r => (
                                <button
                                    key={r.id}
                                    onClick={() => setSelectedReport(r.id)}
                                    className={cn(
                                        "text-right p-3 rounded-xl border transition-all duration-200 flex items-center justify-between group",
                                        selectedReport === r.id
                                            ? "bg-indigo-500/20 border-indigo-400 shadow-sm"
                                            : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                                    )}
                                >
                                    <div>
                                        <p className="font-bold text-sm text-white">{r.name}</p>
                                        <p className="text-xs text-indigo-200/60 mt-0.5">{r.desc}</p>
                                    </div>
                                    <div className={cn(
                                        "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                                        selectedReport === r.id ? "border-indigo-400" : "border-slate-500"
                                    )}>
                                        {selectedReport === r.id && <div className="w-2 h-2 bg-indigo-400 rounded-full" />}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-2 block mt-2">صيغة التصدير</label>
                        <div className="flex gap-2">
                            {[
                                { id: 'pdf', label: 'PDF', icon: FileText },
                                { id: 'excel', label: 'Excel', icon: FileBarChart },
                                { id: 'json', label: 'JSON API', icon: FileJson }
                            ].map(f => (
                                <button
                                    key={f.id}
                                    onClick={() => setFormat(f.id)}
                                    className={cn(
                                        "flex-1 flex flex-col items-center justify-center py-3 rounded-xl border transition-all duration-200",
                                        format === f.id
                                            ? "bg-indigo-500/20 border-indigo-400 shadow-sm"
                                            : "bg-white/5 border-white/10 hover:bg-white/10"
                                    )}
                                >
                                    <f.icon className={cn("w-5 h-5 mb-1.5", format === f.id ? "text-indigo-300" : "text-slate-400")} />
                                    <span className={cn("text-xs font-bold", format === f.id ? "text-white" : "text-slate-300")}>{f.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex gap-3">
                    <Button
                        onClick={handleExport}
                        disabled={isExporting}
                        className={cn(
                            "flex-1 font-black text-sm h-12 shadow-lg transition-all",
                            hasExported
                                ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                                : "bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 text-white"
                        )}
                    >
                        {isExporting ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> جاري توليد التقرير...</>
                        ) : hasExported ? (
                            <><CheckCircle2 className="w-4 h-4 mr-2" /> تم التصدير بنجاح</>
                        ) : (
                            <><Download className="w-4 h-4 mr-2" /> إنشاء التقرير</>
                        )}
                    </Button>
                    <Button variant="outline" className="h-12 w-12 p-0 border-white/10 bg-white/5 hover:bg-white/10 flex-shrink-0" title="إرسال عبر البريد الرسمي">
                        <Mail className="w-5 h-5 text-indigo-200" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
