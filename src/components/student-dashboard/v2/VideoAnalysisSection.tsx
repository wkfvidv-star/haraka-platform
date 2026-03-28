import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, CheckCircle2, Clock, XCircle, Award, Star, MessageSquare, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { db, VideoSubmissionRecord } from '@/lib/mockDatabase';

export function VideoAnalysisSection() {
  const [submissions, setSubmissions] = useState<VideoSubmissionRecord[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'evaluated' | 'redo'>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<VideoSubmissionRecord | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchSubs = async () => {
      try {
        const data = await db.getSubmissions();
        if (mounted) setSubmissions(data);
      } catch (e) {}
    };
    fetchSubs(); // Initial fetch
    const interval = setInterval(fetchSubs, 2000); // Poll for new uploads rapidly
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const filtered = submissions.filter(sub => filter === 'all' ? true : sub.status === filter);

  return (
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-[2rem] p-6 lg:p-8 space-y-8 relative overflow-hidden font-tajawal ltr">
      {/* Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-2 h-16 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.4)]" />
          <div>
            <h3 className="text-2xl md:text-3xl font-black text-white mb-1">سجل التقييمات والأداء</h3>
            <p className="text-indigo-200/60 font-bold text-sm md:text-base">تتبع فيديوهاتك المرسلة وملاحظات المدربين.</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <FilterBtn active={filter === 'all'} onClick={() => setFilter('all')} icon={Award} label="الكل" color="text-indigo-400" />
          <FilterBtn active={filter === 'pending'} onClick={() => setFilter('pending')} icon={Clock} label="قيد المراجعة" color="text-yellow-400" />
          <FilterBtn active={filter === 'evaluated'} onClick={() => setFilter('evaluated')} icon={CheckCircle2} label="تم التقييم" color="text-emerald-400" />
          <FilterBtn active={filter === 'redo'} onClick={() => setFilter('redo')} icon={XCircle} label="يحتاج إعادة" color="text-red-400" />
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10">
        <AnimatePresence mode="popLayout">
          {filtered.map((sub, i) => {
            const isEvaluated = sub.status === 'evaluated' || sub.status === 'redo';
            const thumbUrl = sub.videoUrl || 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop';
            let relativeDate = sub.date;
            try { relativeDate = new Intl.DateTimeFormat('ar-SA', { month: 'short', day: 'numeric', hour: 'numeric', minute:'numeric' }).format(new Date(sub.date)); } catch(e) {}

            return (
              <motion.div
                layout
                key={sub.id}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedSubmission(sub)}
                className="group cursor-pointer bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-indigo-500/50 rounded-3xl p-4 transition-all shadow-lg flex flex-col"
              >
                {/* Thumbnail */}
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-4 bg-slate-900 border border-white/5">
                  <img src={thumbUrl} alt="" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4 z-10">
                    <div className="flex justify-between items-center">
                      <StatusBadge status={sub.status} />
                      <span className="text-white/80 text-xs font-bold font-mono">{relativeDate}</span>
                    </div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                     <Play className="w-5 h-5 text-white/80 translate-x-0.5" />
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                   <div>
                     <h4 className="text-lg font-black text-white mb-2 line-clamp-1">{sub.exerciseName}</h4>
                     {sub.status === 'evaluated' && sub.score !== undefined && (
                       <div className="flex items-center gap-2 mb-3">
                         <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">{sub.score}</span>
                         <span className="text-slate-400 font-bold text-sm">/100</span>
                       </div>
                     )}
                   </div>

                   {isEvaluated && sub.coachNotes && (
                     <div className="mt-3 text-slate-400 text-sm leading-relaxed line-clamp-2 border-t border-white/5 pt-3">
                       <span className="text-indigo-400 font-bold">{sub.coachName}: </span> {sub.coachNotes}
                     </div>
                   )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
         <div className="py-20 flex flex-col items-center justify-center text-center opacity-50 relative z-10">
            <Award className="w-16 h-16 text-slate-500 mb-4" />
            <p className="text-xl font-black text-white">لا توجد سجلات بالفئة المحددة</p>
         </div>
      )}

      {/* Expanded Review Modal */}
      <AnimatePresence>
        {selectedSubmission && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedSubmission(null)}
          >
             <motion.div
               layoutId={selectedSubmission.id}
               onClick={(e) => e.stopPropagation()}
               className="w-full max-w-4xl bg-slate-900 rounded-[2rem] border border-slate-800 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
             >
                <div className="w-full md:w-1/2 bg-black relative aspect-square md:aspect-auto">
                   
                   {selectedSubmission.videoUrl ? (
                     <video src={selectedSubmission.videoUrl} controls autoPlay className="w-full h-full object-contain" />
                   ) : (
                     <>
                       <img src={'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop'} className="w-full h-full object-cover opacity-50" />
                       <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                             <Play className="w-8 h-8 text-white translate-x-1" />
                          </div>
                       </div>
                     </>
                   )}
                </div>
                
                <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto flex flex-col gap-6">
                   <div className="flex justify-between items-start">
                      <div>
                         <StatusBadge status={selectedSubmission.status} />
                         <h2 className="text-2xl font-black text-white mt-3">{selectedSubmission.exerciseName}</h2>
                      </div>
                      <button onClick={() => setSelectedSubmission(null)} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors"><XCircle className="w-6 h-6 text-slate-400 hover:text-white" /></button>
                   </div>

                   {(selectedSubmission.status === 'evaluated' || selectedSubmission.status === 'redo') && selectedSubmission.coachName && (
                      <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50">
                          <div className="flex items-center gap-3 mb-4">
                             <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                <Award className="w-5 h-5 text-indigo-400" />
                             </div>
                             <div>
                                <p className="text-white font-bold">{selectedSubmission.coachName}</p>
                                <p className="text-indigo-400 text-xs">التقييم الفني للمدرب</p>
                             </div>
                             {selectedSubmission.score !== undefined && (
                                <div className={cn("ml-auto text-3xl font-black", selectedSubmission.score >= 50 ? "text-emerald-400" : "text-red-400")}>
                                    {selectedSubmission.score}
                                </div>
                             )}
                          </div>
                          <p className="text-slate-300 leading-relaxed text-sm md:text-base bg-black/20 p-4 rounded-xl font-bold">
                             " {selectedSubmission.coachNotes} "
                          </p>

                          {selectedSubmission.technicalTips && selectedSubmission.technicalTips.length > 0 && (
                            <div className="mt-4 space-y-2">
                               <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">نصائح فنية:</p>
                               {selectedSubmission.technicalTips.map((t, i) => (
                                 <div key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                   <Star className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                                   <span className="font-bold">{t}</span>
                                 </div>
                               ))}
                            </div>
                          )}
                      </div>
                   )}

                   {selectedSubmission.status === 'pending' && (
                     <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
                        <Clock className="w-16 h-16 text-yellow-500 mb-4" />
                        <h3 className="text-xl font-black text-white mb-2">جاري التقييم</h3>
                        <p className="text-slate-400 text-sm font-bold">سيقوم المدرب بمراجعة أدائك قريباً وتزويدك بالملاحظات الدقيقة.</p>
                     </div>
                   )}
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

function FilterBtn({ active, onClick, icon: Icon, label, color }: { active: boolean, onClick: () => void, icon: any, label: string, color: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 font-bold text-sm whitespace-nowrap transition-all duration-300",
        active ? "bg-white/10 text-white shadow-lg" : "bg-transparent text-slate-400 hover:bg-white/5"
      )}
    >
      <Icon className={cn("w-4 h-4", active ? color : "")} />
      {label}
    </button>
  );
}

function StatusBadge({ status }: { status: VideoSubmissionRecord['status'] }) {
  if (status === 'pending') return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 text-xs font-bold"><Clock className="w-3.5 h-3.5" /> قيد المراجعة</span>;
  if (status === 'evaluated') return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold"><CheckCircle2 className="w-3.5 h-3.5" /> قيمت</span>;
  return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold"><AlertCircle className="w-3.5 h-3.5" /> إعادة مطلوبة</span>;
}
