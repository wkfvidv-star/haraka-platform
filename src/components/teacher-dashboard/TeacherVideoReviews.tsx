import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, CheckCircle2, Clock, XCircle, Award, Videotape, MessageSquare, Send, Star, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { db, VideoSubmissionRecord } from '@/lib/mockDatabase';

export function TeacherVideoReviews() {
  const [submissions, setSubmissions] = useState<VideoSubmissionRecord[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'evaluated' | 'redo'>('pending');
  const [selectedSubmission, setSelectedSubmission] = useState<VideoSubmissionRecord | null>(null);

  // Review Form States
  const [score, setScore] = useState<number>(85);
  const [note, setNote] = useState<string>('');
  const [currentTip, setCurrentTip] = useState<string>('');
  const [tips, setTips] = useState<string[]>([]);

  useEffect(() => {
    fetchSubs();
  }, []);

  const fetchSubs = async () => {
    try {
      const data = await db.getSubmissions();
      setSubmissions(data.filter(s => s.assignedRole === 'teacher'));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelect = (sub: VideoSubmissionRecord) => {
      setSelectedSubmission(sub);
      setScore(sub.score || 85);
      setNote(sub.coachNotes || '');
      setTips(sub.technicalTips || []);
      setCurrentTip('');
  };

  const addTip = () => {
      if (currentTip.trim() !== '') {
          setTips([...tips, currentTip.trim()]);
          setCurrentTip('');
      }
  };

  const removeTip = (index: number) => {
      setTips(tips.filter((_, i) => i !== index));
  };

  const submitReview = async () => {
      if (!selectedSubmission) return;
      try {
          await db.updateSubmissionEvaluation(selectedSubmission.id, score, note, tips);
          await fetchSubs(); // refresh list
          setSelectedSubmission(null);
      } catch (e) {
          alert('فشل حفظ التقييم');
      }
  };

  const filtered = submissions.filter(sub => filter === 'all' ? true : sub.status === filter);

  return (
    <div className="space-y-8 font-tajawal ltr">
      {/* Header */}
      <div className="bg-slate-900/40 border border-slate-700/50 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />
         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
               <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shadow-lg">
                  <Play className="w-8 h-8 text-blue-400" />
               </div>
               <div>
                 <h2 className="text-3xl font-black text-white tracking-tight">تقييم الأعمال (للأساتذة)</h2>
                 <p className="text-slate-400 font-bold mt-1 text-lg leading-relaxed">قم بمراجعة فيديوهات التمارين الموجهة لك (مثل التمارين المعرفية).</p>
               </div>
            </div>

            <div className="flex bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
               {['pending', 'evaluated', 'redo', 'all'].map((f) => (
                   <button 
                       key={f} 
                       onClick={() => setFilter(f as any)} 
                       className={cn(
                           "px-6 py-2.5 rounded-xl font-black text-sm transition-all",
                           filter === f ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-white hover:bg-white/5"
                       )}
                   >
                       {f === 'pending' ? 'بانتظار التقييم' : f === 'evaluated' ? 'تم التقييم' : f === 'redo' ? 'إعادة مطلوبة' : 'الكل'}
                   </button>
               ))}
            </div>
         </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
              {filtered.map((sub, i) => {
                  const thumbUrl = sub.videoUrl || 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop';
                  let relativeDate = sub.date;
                  try { relativeDate = new Intl.DateTimeFormat('ar-SA', { month: 'short', day: 'numeric', hour: 'numeric', minute:'numeric' }).format(new Date(sub.date)); } catch(e) {}
                  
                  return (
                      <motion.div
                          layout
                          key={sub.id}
                          initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.05 }}
                          onClick={() => handleSelect(sub)}
                          className="bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 rounded-[2rem] p-5 cursor-pointer group transition-all shadow-xl hover:shadow-blue-900/20 flex flex-col"
                      >
                          <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-4 bg-slate-950">
                             <img src={thumbUrl} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
                             <div className="absolute top-3 right-3">
                                 {sub.status === 'pending' && <span className="bg-yellow-500 text-yellow-950 font-black text-[10px] px-2 py-1 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1"><Clock className="w-3 h-3"/> جديد</span>}
                                 {sub.status === 'evaluated' && <span className="bg-emerald-500 text-emerald-950 font-black text-[10px] px-2 py-1 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> مقيم</span>}
                                 {sub.status === 'redo' && <span className="bg-red-500 text-red-950 font-black text-[10px] px-2 py-1 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1"><AlertCircle className="w-3 h-3"/> يحتاج إعادة</span>}
                             </div>
                             <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4 flex flex-col justify-end">
                                 <span className="text-white/80 font-mono text-xs font-bold">{relativeDate}</span>
                             </div>
                             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-blue-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md shadow-lg shadow-blue-500/50 scale-90 group-hover:scale-100">
                                 <Play className="w-6 h-6 translate-x-1" />
                             </div>
                          </div>
                          <div className="flex-1">
                              <h3 className="text-lg font-black text-white line-clamp-1 mb-1">{sub.exerciseName}</h3>
                              <p className="text-slate-400 text-sm font-bold flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">T</div> {sub.studentName}</p>
                          </div>
                      </motion.div>
                  )
              })}
          </AnimatePresence>
      </div>

      {filtered.length === 0 && (
         <div className="bg-slate-900/30 border border-slate-800 border-dashed rounded-[3rem] p-16 flex flex-col items-center justify-center text-center mt-8">
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
               <CheckCircle2 className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="text-2xl font-black text-slate-300 mb-2">لا توجد مهام حالياً</h3>
            <p className="text-slate-500 font-bold max-w-sm">جميع فيديوهات التمارين المرفوعة تم تقييمها بنجاح.</p>
         </div>
      )}

      {/* Grading / Review Modal */}
      <AnimatePresence>
          {selectedSubmission && (
              <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto"
              >
                  <motion.div 
                      layoutId={selectedSubmission.id}
                      className="bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full max-w-6xl shadow-[0_0_100px_rgba(37,99,235,0.15)] flex flex-col lg:flex-row overflow-hidden max-h-[90vh]"
                      onClick={e => e.stopPropagation()}
                  >
                      {/* Left: Video Player */}
                      <div className="w-full lg:w-3/5 bg-black relative flex flex-col">
                          <div className="p-4 absolute top-0 inset-x-0 z-10 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
                             <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 font-black text-white">{selectedSubmission.studentName[0]}</div>
                                 <span className="text-white font-black text-lg">{selectedSubmission.studentName}</span>
                             </div>
                             <button onClick={() => setSelectedSubmission(null)} className="w-10 h-10 bg-white/10 hover:bg-red-500 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors">
                                 <XCircle className="w-6 h-6" />
                             </button>
                          </div>
                          <div className="flex-1 flex items-center justify-center relative min-h-[300px]">
                              {selectedSubmission.videoUrl ? (
                                  <video src={selectedSubmission.videoUrl} controls autoPlay className="w-full h-full object-contain" />
                              ) : (
                                  <>
                                    <img src={'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop'} className="w-full h-full object-cover opacity-30" />
                                    <h3 className="absolute text-slate-500 font-black text-2xl">لا يوجد فيديو (بيانات تجريبية)</h3>
                                  </>
                              )}
                          </div>
                          <div className="p-5 bg-slate-950 border-t border-slate-900 flex justify-between items-center">
                              <span className="text-blue-400 font-black text-lg">{selectedSubmission.exerciseName}</span>
                              <span className="text-slate-500 font-mono text-sm">{new Date(selectedSubmission.date).toLocaleString('ar-SA')}</span>
                          </div>
                      </div>

                      {/* Right: Grading Tools */}
                      <div className="w-full lg:w-2/5 p-6 lg:p-8 bg-slate-900 flex flex-col h-full overflow-y-auto">
                          <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3"><Award className="w-6 h-6 text-yellow-500" /> لوحة التقييم الفني</h3>
                          
                          <div className="space-y-6 flex-1">
                              {/* Score Slider */}
                              <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50">
                                  <div className="flex justify-between items-end mb-4">
                                      <label className="text-slate-300 font-black block">الدرجة النهائية (Score)</label>
                                      <span className={cn("text-5xl font-black tracking-tighter", score >= 80 ? "text-emerald-400" : score >= 50 ? "text-yellow-400" : "text-red-400")}>{score}<span className="text-2xl text-slate-500">/100</span></span>
                                  </div>
                                  <input 
                                      type="range" min="0" max="100" value={score} onChange={(e) => setScore(Number(e.target.value))}
                                      className="w-full h-3 bg-slate-950 rounded-full appearance-none outline-none accent-blue-500 border border-slate-700" 
                                  />
                                  <div className="flex justify-between text-xs font-bold text-slate-500 mt-2 px-1">
                                      <span>إعادة مطلوبة (0)</span><span>مقبول (50)</span><span>ممتاز (100)</span>
                                  </div>
                              </div>

                              {/* General Note */}
                              <div>
                                  <label className="text-slate-300 font-black block mb-3">الملاحظة التوجيهية العامة</label>
                                  <textarea 
                                      value={note} onChange={e => setNote(e.target.value)}
                                      placeholder="اكتب تعليقك لتوجيه التلميذ وتحفيزه..."
                                      className="w-full p-5 rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:border-blue-500 outline-none font-bold text-sm h-32 resize-none leading-relaxed transition-colors"
                                  />
                              </div>

                              {/* Technical Tips */}
                              <div>
                                  <label className="text-slate-300 font-black block mb-3">النصائح الفنية الدقيقة المضافة ({tips.length})</label>
                                  <div className="flex gap-2 mb-4">
                                      <input 
                                          type="text" value={currentTip} onChange={e => setCurrentTip(e.target.value)}
                                          onKeyDown={e => e.key === 'Enter' && addTip()}
                                          placeholder="نصيحة (مثال: ارفع صدرك للأعلى)"
                                          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:border-blue-500 text-sm font-bold"
                                      />
                                      <button onClick={addTip} className="bg-blue-600 hover:bg-blue-500 text-white px-5 rounded-xl font-black transition-colors shrink-0">إضافة</button>
                                  </div>
                                  <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                                      {tips.map((tip, idx) => (
                                          <div key={idx} className="flex items-center justify-between bg-emerald-900/10 border border-emerald-500/20 px-4 py-3 rounded-xl group relative overflow-hidden">
                                              <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-emerald-400 to-teal-600" />
                                              <div className="flex items-start gap-2 text-sm text-emerald-100 font-bold pr-3">
                                                  <Star className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                                  <span>{tip}</span>
                                              </div>
                                              <button onClick={() => removeTip(idx)} className="text-slate-600 hover:text-red-400 transition-colors p-1"><XCircle className="w-4 h-4" /></button>
                                          </div>
                                      ))}
                                      {tips.length === 0 && <p className="text-center text-slate-500 text-sm font-bold py-4">لم يتم إضافة أي نصيحة تقنية دقيقة</p>}
                                  </div>
                              </div>
                          </div>

                          <button 
                              onClick={submitReview}
                              className="w-full bg-gradient-to-l from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xl py-5 rounded-2xl mt-6 flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(37,99,235,0.3)] transition-all"
                          >
                              <Send className="w-6 h-6 -rotate-90" /> حفظ وإرسال التقييم
                          </button>
                      </div>
                  </motion.div>
              </motion.div>
          )}
      </AnimatePresence>

    </div>
  );
}
