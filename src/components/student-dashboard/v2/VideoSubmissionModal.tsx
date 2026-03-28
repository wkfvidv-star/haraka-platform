import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera, Upload, X, CheckCircle2, Play, Square,
  RefreshCcw, FileText, Send, User, Brain, AlertTriangle, ShieldCheck, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

export interface VideoSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  exerciseName?: string;
  exerciseType?: 'motor' | 'cognitive' | 'rehab';
  isAssignment?: boolean;
}

type SubmissionStep = 'selection' | 'recording' | 'preview' | 'uploading' | 'analyzing' | 'success';
import { db } from '@/lib/mockDatabase';

export function VideoSubmissionModal({ isOpen, onClose, exerciseName, exerciseType, isAssignment }: VideoSubmissionModalProps) {
  const { updateUserStats } = useAuth();

  const [step, setStep] = useState<SubmissionStep>('selection');
  
  // Media States
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  // Form States
  const [customExerciseName, setCustomExerciseName] = useState(exerciseName || '');
  const [customExerciseType, setCustomExerciseType] = useState<'motor' | 'cognitive' | 'rehab'>(exerciseType || 'motor');
  const [note, setNote] = useState('');
  
  // Progress State
  const [uploadProgress, setUploadProgress] = useState(0);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on close
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      resetState();
    }
  }, [isOpen]);

  const resetState = () => {
    setStep('selection');
    setVideoBlob(null);
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoUrl(null);
    setNote('');
    setCustomExerciseName(exerciseName || '');
    setCustomExerciseType(exerciseType || 'motor');
    setUploadProgress(0);
    setRecordingTime(0);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // 1. RECORDING LOGIC
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setStep('recording');
    } catch (err) {
      alert("تعذر الوصول للكاميرا والميكروفون.");
    }
  };

  const startRecording = () => {
    if (!streamRef.current) return;
    chunksRef.current = [];
    const mimeType = MediaRecorder.isTypeSupported('video/webm; codecs=vp9,opus') ? 'video/webm; codecs=vp9,opus' : 'video/webm';
    try {
      const mr = new MediaRecorder(streamRef.current, { mimeType });
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setVideoBlob(blob);
        setVideoUrl(URL.createObjectURL(blob));
        setStep('preview');
        stopCamera();
      };
      
      mediaRecorderRef.current = mr;
      mr.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime(p => p + 1), 1000);
    } catch(e) {
      console.error(e);
      alert("الجهاز غير مدعوم للتسجيل.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current!);
    }
  };

  // 2. UPLOAD LOGIC
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 100 * 1024 * 1024) {
      alert("حجم الفيديو يجب أن يكون أقل من 100 ميجابايت.");
      return;
    }
    setVideoBlob(file);
    setVideoUrl(URL.createObjectURL(file));
    setStep('preview');
  };

  // 3. SUBMIT LOGIC
  const handleSubmit = () => {
    setStep('uploading');
    setUploadProgress(0);
    
    // Fake upload progression
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const next = prev + Math.random() * 20;
        if (next >= 100) {
          clearInterval(interval);
          setStep('analyzing');
          startAiAnalysis();
          return 100;
        }
        return next;
      });
    }, 300);
  };

  const startAiAnalysis = () => {
    // Simulate AI processing time
    setTimeout(() => {
      finishUpload();
    }, 4500); // 4.5 seconds of analyzing
  }

  const finishUpload = async () => {
    try {
        await db.saveSubmission({
            id: `sub-${Date.now()}`,
            studentName: 'الطالب الحالي',
            exerciseName: customExerciseName || 'تمرين عام',
            exerciseType: customExerciseType,
            note: note,
            date: new Date().toISOString(),
            videoBlob: videoBlob,
            status: 'pending'
        });
    } catch (e) {
        console.error("IndexedDB Save Failed", e);
    }
    
    setStep('success');
    if (updateUserStats) updateUserStats({ xp: 500 });
  };

  const formatTime = (secs: number) => {
    return `${Math.floor(secs / 60).toString().padStart(2, '0')}:${(secs % 60).toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-10 font-tajawal ltr">
      {/* Backdrop */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" />

      {/* Modal Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl bg-white dark:bg-[#0f172a] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200 dark:border-slate-800"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-black/20">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white">توثيق الأداء</h2>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
              {exerciseName ? `تمرين: ${exerciseName}` : 'رفع فيديو جديد للتقييم'}
            </p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-white/20 transition-colors">
            <X className="w-5 h-5 text-slate-600 dark:text-white" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <AnimatePresence mode="wait">
            
            {/* ── SELECTION STEP ── */}
            {step === 'selection' && (
              <motion.div key="selection" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full min-h-[400px] gap-8 text-center">
                <div className="max-w-md">
                  <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/10">
                    <Camera className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black mb-3">كيف تود تقديم أدائك؟</h3>
                  <p className="text-slate-500 font-bold mb-8">اختر تصوير أدائك مباشرة الآن باستخدام كاميرا الجهاز، أو قم برفع فيديو التقطته مسبقاً.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
                  <button onClick={startCamera} className="group relative p-8 rounded-3xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-all flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Camera className="w-8 h-8" />
                    </div>
                    <span className="font-black text-xl text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300">تسجيل فيديو الآن</span>
                  </button>
                  
                  <button onClick={() => fileInputRef.current?.click()} className="group relative p-8 rounded-3xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8" />
                    </div>
                    <span className="font-black text-xl text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300">رفع من الجهاز</span>
                    <input type="file" accept="video/*" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── RECORDING STEP ── */}
            {step === 'recording' && (
              <motion.div key="recording" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full gap-4">
                <div className="relative flex-1 bg-black rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-800 min-h-[400px]">
                  <video ref={videoRef} muted playsInline className="w-full h-full object-cover -scale-x-100" />
                  
                  {isRecording && (
                    <div className="absolute top-6 left-6 bg-red-500/20 backdrop-blur-md border border-red-500 px-4 py-2 rounded-xl flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                      <span className="font-black text-white text-xl tracking-widest">{formatTime(recordingTime)}</span>
                    </div>
                  )}

                  <div className="absolute bottom-6 inset-x-0 flex justify-center items-center gap-4">
                    {!isRecording ? (
                      <button onClick={startRecording} className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border-4 border-white/30 flex items-center justify-center group">
                        <div className="w-14 h-14 rounded-full bg-red-500 group-hover:bg-red-400 transition-colors shadow-[0_0_20px_rgba(239,68,68,0.5)]" />
                      </button>
                    ) : (
                      <button onClick={stopRecording} className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border-4 border-white/30 flex items-center justify-center group">
                        <div className="w-8 h-8 rounded-lg bg-red-500 group-hover:bg-red-400 transition-colors shadow-[0_0_20px_rgba(239,68,68,0.5)] flex items-center justify-center">
                           <Square className="w-4 h-4 text-white fill-white" />
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── PREVIEW & DETAILS STEP ── */}
            {step === 'preview' && (
              <motion.div key="preview" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col md:flex-row gap-8 min-h-[400px]">
                {/* Video Review Pane */}
                <div className="w-full md:w-1/2 flex flex-col gap-4">
                  <div className="relative bg-black rounded-3xl overflow-hidden aspect-[9/16] md:aspect-auto md:flex-1 shadow-lg">
                    {videoUrl && <video ref={previewRef} src={videoUrl} controls playsInline className="w-full h-full object-contain bg-[#111]" />}
                  </div>
                  <button onClick={resetState} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold transition-colors">
                    <RefreshCcw className="w-4 h-4" /> إعادة التصوير أو الرفع
                  </button>
                </div>

                {/* Submission Details Pane */}
                <div className="w-full md:w-1/2 flex flex-col gap-6">
                  <div>
                    <h3 className="text-xl font-black mb-1">تفاصيل التسليم 📝</h3>
                    <p className="text-slate-500 text-sm font-bold">يرجى توضيح أي ملاحظات.</p>
                  </div>
                  
                  <div className="space-y-4 flex-1">
                    {/* Is Standalone Upload (no exerciseName provided) */}
                    {!exerciseName && (
                      <>
                        <div>
                          <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-2">اسم التمرين</label>
                          <input 
                            type="text"
                            value={customExerciseName} onChange={e => setCustomExerciseName(e.target.value)}
                            placeholder="مثال: الجري للمسافات القصيرة"
                            className="w-full p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-indigo-500 outline-none text-sm font-bold text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-2">نوع التمرين</label>
                          <div className="flex gap-2">
                            <button onClick={() => setCustomExerciseType('motor')} className={cn("flex-1 p-3 rounded-xl border-2 font-bold text-sm", customExerciseType === 'motor' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors')}>حركي / رياضي</button>
                            <button onClick={() => setCustomExerciseType('cognitive')} className={cn("flex-1 p-3 rounded-xl border-2 font-bold text-sm", customExerciseType === 'cognitive' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors')}>معرفي / دراسي</button>
                            <button onClick={() => setCustomExerciseType('rehab')} className={cn("flex-1 p-3 rounded-xl border-2 font-bold text-sm", customExerciseType === 'rehab' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors')}>إعادة تأهيل</button>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Note input */}
                    <div>
                      <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-2">إضافة ملاحظة (اختياري)</label>
                      <textarea 
                        value={note} onChange={e => setNote(e.target.value)}
                        placeholder="أضف ملاحظة حول التعب أو الألم أو استفسار..."
                        className="w-full p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none resize-none h-24 text-sm font-bold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 placeholder:font-normal transition-all"
                      />
                    </div>
                    
                    {/* Smart Routing Assurance */}
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-l from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border border-indigo-100 dark:border-indigo-800/50">
                      <Brain className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-black text-indigo-900 dark:text-indigo-300">توجيه ذكي 🎯</p>
                        <p className="text-xs text-indigo-700/80 dark:text-indigo-400 mt-1 font-bold">سيتم إرسال الفيديو تلقائياً إلى الجهة المختصة (مدرب، أستاذ، أو مختص) بناءً على نوع التمرين للتقييم.</p>
                      </div>
                    </div>
                  </div>

                  <button onClick={handleSubmit} className="w-full py-4 rounded-2xl bg-gradient-to-l from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black text-lg flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-all">
                    <Send className="w-5 h-5 -rotate-90" /> إرسال الفيديو للتقييم
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── UPLOADING STEP ── */}
            {step === 'uploading' && (
              <motion.div key="uploading" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-full min-h-[400px] text-center max-w-sm mx-auto gap-6">
                <div className="relative w-32 h-32 mb-4 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 absolute">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" className="text-slate-100 dark:text-slate-800" />
                    <motion.circle 
                      cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" 
                      className="text-indigo-500"
                      initial={{ strokeDasharray: "0 283" }} animate={{ strokeDasharray: `${(uploadProgress / 100) * 283} 283` }}
                    />
                  </svg>
                  <Upload className="w-10 h-10 text-indigo-500 animate-pulse -ml-0 -mb-0" />
                </div>
                <h3 className="text-2xl font-black">جاري رفع الفيديو...</h3>
                <p className="text-slate-500 font-bold">{Math.round(uploadProgress)}% - يتم ضغط ونقل البيانات بأمان.</p>
              </motion.div>
            )}

            {/* ── ANALYZING STEP (AI MAGIC) ── */}
            {step === 'analyzing' && (
              <motion.div key="analyzing" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-full min-h-[400px] gap-8">
                <div className="relative w-full max-w-lg bg-black rounded-3xl overflow-hidden aspect-[16/9] shadow-2xl border border-indigo-500/30">
                  {videoUrl && <video src={videoUrl} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-50 blur-sm" />}
                  {/* Scanning Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/30 to-transparent flex items-center justify-center" style={{ animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }}>
                     <div className="w-full h-1 bg-indigo-400 shadow-[0_0_15px_rgba(99,102,241,1)] transform -translate-y-[50px] animate-[bounce_2s_ease-in-out_infinite]" />
                  </div>
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4 text-center">
                    <Sparkles className="w-12 h-12 text-indigo-400 mb-4 animate-pulse" />
                    <h3 className="text-xl md:text-2xl font-black text-white px-6 py-3 bg-black/60 rounded-2xl backdrop-blur-md border border-white/10">
                      محرك الذكاء الاصطناعي يحلل الحركة...
                    </h3>
                  </div>
                  
                  {/* Floating Metrics */}
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 }} className="absolute bottom-6 left-6 bg-black/70 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 z-20">
                    <p className="text-xs font-bold text-slate-300 mb-1">زاوية الركبة والمفاصل</p>
                    <p className="text-emerald-400 font-mono font-black text-xl flex items-center gap-2">94.2° <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">✓ مثالي</span></p>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.5 }} className="absolute top-6 right-6 bg-black/70 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 z-20 text-right">
                    <p className="text-xs font-bold text-slate-300 mb-1">التطابق الحركي العام</p>
                    <p className="text-indigo-400 font-mono font-black text-xl flex items-center gap-2 flex-row-reverse">89% <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">ممتاز</span></p>
                  </motion.div>
                </div>

                <div className="flex gap-2 w-full max-w-sm">
                   <div className="h-1.5 flex-1 bg-indigo-500 rounded-full animate-pulse" />
                   <div className="h-1.5 flex-1 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s'}} />
                   <div className="h-1.5 flex-1 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s'}} />
                </div>
              </motion.div>
            )}

            {/* ── SUCCESS STEP ── */}
            {step === 'success' && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.8, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="flex flex-col items-center justify-center h-full min-h-[400px] text-center max-w-md mx-auto gap-6">
                <div className="w-28 h-28 rounded-full bg-emerald-100 dark:bg-emerald-900/40 border-4 border-emerald-400 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.3)]">
                  <ShieldCheck className="w-14 h-14 text-emerald-500" />
                </div>
                
                <div>
                  <h3 className="text-3xl font-black mb-2">تم الإرسال بنجاح! 🚀</h3>
                  <p className="text-slate-500 font-bold text-lg leading-relaxed mb-4">
                    الفيديو الآن <span className="text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded">⏳ قيد المراجعة</span>.
                    سيتم إشعارك فور حصولك على تقييم المدرب.
                  </p>
                  <div className="inline-flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 px-4 py-2 rounded-xl text-yellow-700 dark:text-yellow-400 font-black">
                     🎉 حصلت على مكافأة توثيق (+500 XP)
                  </div>
                </div>

                <div className="w-full mt-4">
                  <button onClick={onClose} className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-black font-black text-lg transition-colors">
                    العودة للمنصة
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
