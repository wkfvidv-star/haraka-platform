import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { auditService, AuditLog } from '@/services/auditService';
import { Clock, History, Search, Filter, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export function YouthAuditLogWidget() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLogs = () => {
      const allLogs = auditService.getAllLogs('youth');
      setLogs(allLogs);
    };

    fetchLogs();
    
    // Refresh interval every 5 seconds to show new background actions
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="bg-slate-900/50 backdrop-blur-xl border-white/5 shadow-2xl overflow-hidden h-full flex flex-col">
      <CardHeader className="pb-4 border-b border-white/5 px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-white text-xl flex items-center gap-3 font-black tracking-tighter">
            <div className="p-2 bg-indigo-500/20 rounded-xl">
               <History className="w-5 h-5 text-indigo-400" />
            </div>
            سجل النشاط (Audit Log)
          </CardTitle>
          <div className="relative group">
             <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
             <input
               type="text"
               placeholder="بحث في العمليات..."
               className="bg-white/5 border border-white/10 rounded-xl pr-10 pl-4 py-2 text-sm text-white w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-bold"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
        </div>
        <p className="text-xs text-slate-400 font-medium mt-2 flex items-center gap-1.5">
           <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> تطبيق معايير الشفافية الكاملة لجميع العمليات.
        </p>
      </CardHeader>
      
      <CardContent className="p-0 flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {filteredLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
                 <Clock className="w-12 h-12 opacity-20" />
                 <p className="font-bold">لا توجد سجلات مطابقة للبحث.</p>
              </div>
            ) : (
              filteredLogs.map((log, idx) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="relative group pr-6"
                >
                  {/* Timeline link */}
                  <div className="absolute right-2 top-0 bottom-0 w-0.5 bg-indigo-500/10 group-last:bg-transparent" />
                  <div className="absolute right-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 border-2 border-slate-900 group-hover:scale-125 transition-transform" />
                  
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-4 hover:bg-white/10 hover:border-white/10 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <span className="font-black text-indigo-400 text-sm tracking-wide bg-indigo-500/10 px-3 py-1 rounded-full">{log.action}</span>
                      <span className="text-[10px] sm:text-xs font-mono text-slate-500 flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        {new Date(log.timestamp).toLocaleString('ar-SA', { 
                           year: 'numeric', month: 'long', day: 'numeric',
                           hour: '2-digit', minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-slate-300 font-bold text-sm leading-relaxed">{log.details}</p>
                    <div className="mt-2 flex items-center gap-2">
                       <span className="text-[10px] font-mono text-slate-600 bg-black/20 px-2 py-0.5 rounded border border-white/5 overflow-hidden text-ellipsis whitespace-nowrap">ID: {log.id}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
        
        {/* Footer info or summary if needed */}
        <div className="p-4 border-t border-white/5 bg-slate-950/20 text-center">
            <p className="text-[10px] text-slate-500 font-bold">جميع العمليات موقعة رقمياً ومسؤولة للتدقيق الإداري.</p>
        </div>
      </CardContent>
    </Card>
  );
}
