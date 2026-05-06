import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Download, Eye, CheckCircle2, 
  Clock, User, BarChart2, Bell, Zap, Filter, Search,
  ArrowRight, CloudDownload, MoreVertical,
  Activity, Heart, Brain, Dumbbell
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { youthDataService, YouthReport } from '@/services/youthDataService';
import { useToast } from '@/hooks/use-toast';

export function StudentReports() {
  const { toast } = useToast();
  const [reports, setReports] = useState<YouthReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<YouthReport | null>(null);
  const [filter, setFilter] = useState<YouthReport['category'] | 'all'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReports = () => {
      setReports(youthDataService.getReports());
      setLoading(false);
    };
    loadReports();
  }, []);

  const handleRead = (report: YouthReport) => {
    setSelectedReport(report);
    if (report.status === 'new') {
      youthDataService.markReportAsRead(report.id);
      setReports(youthDataService.getReports());
    }
  };

  const handleDownload = (report: YouthReport) => {
    toast({
      title: 'تحميل التقرير',
      description: `جاري تحميل ${report.title} بصيغة PDF...`,
      className: 'bg-indigo-600 text-white'
    });
    
    // Simulate a brief delay
    setTimeout(() => {
      toast({
        title: 'تم التحميل بنجاح',
        description: 'يمكنك العثور على التقرير في مجلد التحميلات.',
        className: 'bg-emerald-600 text-white'
      });
    }, 1500);
  };

  const filteredReports = filter === 'all' 
    ? reports 
    : reports.filter(r => r.category === filter);

  const getCategoryTheme = (category: string) => {
    switch(category) {
      case 'physical': return { icon: <Dumbbell className="w-5 h-5" />, color: "bg-orange-500", text: "بدني", shadow: "shadow-orange-500/20" };
      case 'cognitive': return { icon: <Brain className="w-5 h-5" />, color: "bg-blue-500", text: "معرفي", shadow: "shadow-blue-500/20" };
      case 'psychological': return { icon: <Heart className="w-5 h-5" />, color: "bg-emerald-500", text: "نفسي", shadow: "shadow-emerald-500/20" };
      default: return { icon: <FileText className="w-5 h-5" />, color: "bg-slate-500", text: "عام", shadow: "shadow-slate-500/20" };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-white/5 p-4 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar w-full md:w-auto pb-2 md:pb-0">
          {(['all', 'physical', 'cognitive', 'psychological'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-5 py-2.5 rounded-xl font-black text-sm whitespace-nowrap transition-all",
                filter === f 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                  : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10"
              )}
            >
              {f === 'all' ? 'الكل' : f === 'physical' ? 'بدني' : f === 'cognitive' ? 'معرفي' : 'نفسي'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto px-4 py-2 bg-slate-100 dark:bg-white/5 rounded-xl border border-transparent focus-within:border-indigo-500/50 transition-all">
          <Search className="w-4 h-4 text-slate-400" />
          <input type="text" placeholder="ابحث في التقارير..." className="bg-transparent border-none outline-none text-sm font-bold w-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredReports.map((report) => (
            <motion.div
              key={report.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group relative bg-white dark:bg-white/5 rounded-[2rem] border border-slate-200/60 dark:border-white/10 p-6 hover:shadow-xl hover:shadow-indigo-500/5 transition-all overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/10 transition-colors" />
              
              <div className="flex items-start justify-between mb-6 relative z-10">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg text-white",
                  getCategoryTheme(report.category).color,
                  getCategoryTheme(report.category).shadow
                )}>
                  {getCategoryTheme(report.category).icon}
                </div>
                {report.status === 'new' && (
                  <span className="flex items-center gap-1.5 bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 text-[10px] font-black px-3 py-1 rounded-full animate-pulse">
                    جديد <Bell className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>

              <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2 leading-tight">{report.title}</h4>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-6 flex items-center gap-2">
                <User className="w-4 h-4" /> {report.coach} · {report.date}
              </p>

              <div className="flex gap-2">
                <button 
                  onClick={() => handleRead(report)}
                  className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black py-3 rounded-xl transition-all hover:opacity-90 flex items-center justify-center gap-2 text-sm"
                >
                  <Eye className="w-4 h-4" /> عرض
                </button>
                <button 
                  onClick={() => handleDownload(report)}
                  className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                >
                  <CloudDownload className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Report Modal / Preview */}
      <AnimatePresence>
        {selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedReport(null)} />
            <motion.div initial={{scale:0.95, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.95, opacity:0}} className="relative z-10 w-full max-w-2xl bg-white dark:bg-[#0f172a] rounded-[2.5rem] shadow-2xl overflow-hidden">
              <div className="p-0 max-h-[70vh] overflow-y-auto bg-slate-50 dark:bg-slate-900/50">
                {/* PDF-Style Document Container */}
                <div className="m-6 md:m-10 bg-white dark:bg-[#0B0E14] shadow-2xl rounded-sm border border-slate-200 dark:border-white/5 p-8 md:p-12 min-h-[600px] relative">
                  {/* Watermark */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none overflow-hidden">
                    <FileText className="w-[400px] h-[400px] -rotate-12" />
                  </div>
                  
                  {/* Header */}
                  <div className="flex justify-between items-start border-b-2 border-slate-900 dark:border-white pb-8 mb-8 relative z-10">
                    <div>
                      <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">HARAKA REPORT</h1>
                      <p className="text-sm font-bold text-slate-500 mt-1">منصة حركة للتميز الرياضي</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-slate-400">ID: {selectedReport.id.toUpperCase()}</p>
                      <p className="text-xs font-black text-slate-400">DATE: {selectedReport.date}</p>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="space-y-8 relative z-10">
                    <div className="flex items-center gap-4 bg-slate-100 dark:bg-white/5 p-4 rounded-xl">
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white", getCategoryTheme(selectedReport.category).color)}>
                        {getCategoryTheme(selectedReport.category).icon}
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase">تصنيف التقرير</p>
                        <p className="font-bold text-slate-900 dark:text-white">{getCategoryTheme(selectedReport.category).text}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4 border-r-4 border-indigo-500 pr-3">الملاحظات التقنية</h3>
                      <div className="bg-slate-50 dark:bg-white/[0.01] p-6 rounded-2xl border border-dashed border-slate-200 dark:border-white/10">
                        <p className="text-base font-medium text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
                          {selectedReport.details}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="p-6 bg-slate-50 dark:bg-white/[0.01] rounded-2xl border border-slate-100 dark:border-white/5">
                        <h4 className="text-xs font-black text-slate-400 uppercase mb-3">التقييم العام</h4>
                        <div className="flex items-center gap-2">
                           <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                           <span className="text-xl font-black text-slate-900 dark:text-white">ممتاز</span>
                        </div>
                      </div>
                      <div className="p-6 bg-slate-50 dark:bg-white/[0.01] rounded-2xl border border-slate-100 dark:border-white/5">
                        <h4 className="text-xs font-black text-slate-400 uppercase mb-3">توصية الخبير</h4>
                        <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">الاستمرار في التدريب المكثف</p>
                      </div>
                    </div>

                    {/* Signature */}
                    <div className="pt-12 flex justify-between items-end">
                      <div className="text-center">
                        <div className="w-32 h-px bg-slate-300 dark:bg-white/20 mb-2" />
                        <p className="text-[10px] font-black text-slate-400 uppercase">توقيع الإدارة</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-slate-900 dark:text-white">{selectedReport.coach}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase">المدرب المسؤول</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white dark:bg-[#0f172a] border-t border-slate-100 dark:border-white/5 flex gap-4">
                <button 
                  onClick={() => handleDownload(selectedReport)}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <CloudDownload className="w-5 h-5" /> تحميل التقرير (PDF)
                </button>
                <button 
                  onClick={() => setSelectedReport(null)}
                  className="px-8 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-black py-4 rounded-2xl hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                >
                  إغلاق
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
