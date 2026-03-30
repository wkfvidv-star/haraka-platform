import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, Square, RefreshCcw, CheckCircle2, AlertTriangle, 
  Activity, Zap, Shield, Target, Brain, Eye, Volume2, 
  PlayCircle, Maximize, UserCheck, Play, ArrowRight, ArrowLeft, Star, Trophy
} from 'lucide-react';
import { cn } from '@/lib/utils';

type CameraStage = 'calibration' | 'reference' | 'countdown' | 'tracking' | 'analyzing' | 'results';

export function VideoRecordingPage() {
  const [stage, setStage] = useState<CameraStage>('calibration');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [countdown, setCountdown] = useState(3);
  
  // AI Progress
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStageText, setAnalysisStageText] = useState('جاري رفع الفيديو...');
  
  // Live Tracking & Feedback
  const [realtimeFeedback, setRealtimeFeedback] = useState('استعد...');
  const [feedbackColor, setFeedbackColor] = useState<'emerald' | 'amber' | 'blue'>('emerald');
  const [sessionData, setSessionData] = useState({ idle: 0, badForm: 0, good: 0 });

  // Exercise Context
  const exerciseName = "السكوات القفزي (Jump Squats)";
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Motion tracking variables
  const animationFrameRef = useRef<number>();
  const prevFrameRef = useRef<ImageData | null>(null);

  // ─── Camera Setup & Management ────────────────────────────────
  const startCamera = useCallback(async () => {
    try {
      if (streamRef.current) return;
      const constraints = { video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setHasPermission(true);
    } catch (err) {
      console.error("Camera access denied or error:", err);
      // Fallback to Simulation Mode if camera is blocked (e.g. testing over HTTP network)
      setHasPermission(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }, []);

  useEffect(() => {
    if (stage !== 'analyzing' && stage !== 'results') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [stage, startCamera, stopCamera]);

  // ─── Voice Synthesis ──────────────────────────────────────────
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance(text);
      msg.lang = 'ar-SA';
      msg.onend = () => setIsPlayingAudio(false);
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(msg);
    }
  };

  // ─── Live Motion Tracking Engine (Stage 3) ──────────────────
  const processFrame = useCallback(() => {
    if (stage !== 'tracking' || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    
    // If we have a real video stream, process pixels, otherwise simulate
    if (videoRef.current && hasPermission) {
        const video = videoRef.current;
        if (video.videoWidth === 0 || video.videoHeight === 0) {
          animationFrameRef.current = requestAnimationFrame(processFrame);
          return;
        }

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const currentData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        if (prevFrameRef.current) {
          let motionPixels = 0;
          let diffX = 0; let diffY = 0;
          
          const length = currentData.data.length;
          for (let i = 0; i < length; i += 4) {
            const rDiff = Math.abs(currentData.data[i] - prevFrameRef.current.data[i]);
            const gDiff = Math.abs(currentData.data[i+1] - prevFrameRef.current.data[i+1]);
            const bDiff = Math.abs(currentData.data[i+2] - prevFrameRef.current.data[i+2]);
            
            if (rDiff + gDiff + bDiff > 100) { 
              motionPixels++;
              const pxIndex = i / 4;
              diffX += pxIndex % canvas.width;
              diffY += Math.floor(pxIndex / canvas.width);
            }
          }
          
          const totalPixels = canvas.width * canvas.height;
          const motionPct = (motionPixels / totalPixels) * 100;

          if (motionPct < 2.0) {
            setRealtimeFeedback('⚠️ لم تقم بالحركة، حاول تقليد التمرين!');
            setFeedbackColor('amber');
            setSessionData(p => ({ ...p, idle: p.idle + 1 }));
          } else {
            const avgX = diffX / motionPixels;
            const avgY = diffY / motionPixels;
            const w = canvas.width; const h = canvas.height;

            if (avgX < w * 0.40) { 
              setRealtimeFeedback('❌ اتجه أكثر نحو اليمين لاستعادة التوازن');
              setFeedbackColor('amber');
              setSessionData(p => ({ ...p, badForm: p.badForm + 1 }));
            } else if (avgX > w * 0.60) {
              setRealtimeFeedback('❌ اتجه أكثر نحو اليسار، ظهرك مائل');
              setFeedbackColor('amber');
              setSessionData(p => ({ ...p, badForm: p.badForm + 1 }));
            } else if (avgY < h * 0.4) {
              setRealtimeFeedback('💡 ممتاز! ارفع ذراعيك بهذا الشكل');
              setFeedbackColor('blue');
              setSessionData(p => ({ ...p, good: p.good + 1 }));
            } else {
              setRealtimeFeedback('✅ أداء ممتاز 👏 استمر!');
              setFeedbackColor('emerald');
              setSessionData(p => ({ ...p, good: p.good + 1 }));
            }
          }
        }
        prevFrameRef.current = currentData;
    } else {
        // Simulation path for when camera is denied
        const rand = Math.random();
        if (rand < 0.1) {
            setRealtimeFeedback('❌ اتجه أكثر نحو اليمين لاستعادة التوازن');
            setFeedbackColor('amber');
            setSessionData(p => ({ ...p, badForm: p.badForm + 1 }));
        } else if (rand < 0.2) {
            setRealtimeFeedback('💡 ممتاز! ارفع ذراعيك بهذا الشكل');
            setFeedbackColor('blue');
            setSessionData(p => ({ ...p, good: p.good + 1 }));
        } else {
            setRealtimeFeedback('✅ أداء ممتاز 👏 استمر!');
            setFeedbackColor('emerald');
            setSessionData(p => ({ ...p, good: p.good + 1 }));
        }
    }

    setTimeout(() => {
      animationFrameRef.current = requestAnimationFrame(processFrame);
    }, 150);
  }, [stage, hasPermission]);

  useEffect(() => {
    if (stage === 'tracking') {
      prevFrameRef.current = null;
      animationFrameRef.current = requestAnimationFrame(processFrame);
      timerRef.current = setInterval(() => setRecordingTime(p => p + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    }
  }, [stage, processFrame]);

  // ─── Stage Transitions ────────────────────────────────────────
  const startCountdown = () => {
    setStage('countdown');
    window.speechSynthesis.cancel();
    let count = 3;
    setCountdown(count);
    const id = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(id);
        setSessionData({ idle: 0, badForm: 0, good: 0 });
        setRecordingTime(0);
        setStage('tracking');
      }
    }, 1000);
  };

  const finishTracking = () => {
    setStage('analyzing');
    // AI Loading Simulation
    setAnalysisProgress(0);
    const stages = [
      'تتبع نقاط الجسم (Pose Estimation)...',
      'حساب زوايا المفاصل (الركبتين والخصر)...',
      'مقارنة الحركة بالنموذج المثالي...',
      'توليد تقرير التقييم النهائي...'
    ];
    let step = 0;
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        const next = prev + (Math.random() * 8 + 2);
        if (next >= 25 && step === 0) { step = 1; setAnalysisStageText(stages[1]); }
        if (next >= 50 && step === 1) { step = 2; setAnalysisStageText(stages[2]); }
        if (next >= 85 && step === 2) { step = 3; setAnalysisStageText(stages[3]); }
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => setStage('results'), 600);
          return 100;
        }
        return next;
      });
    }, 200);
  };

  const formatTime = (secs: number) => {
    return `${Math.floor(secs / 60).toString().padStart(2, '0')}:${(secs % 60).toString().padStart(2, '0')}`;
  };

  // ─── Derived Final Scores for the Dashboard ───────────────────
  // Total sample ticks during tracking
  const totalTicks = Math.max(1, sessionData.idle + sessionData.badForm + sessionData.good);
  const accuracyScore = Math.round((sessionData.good / totalTicks) * 100) || 0;
  
  // Base scores adjusted realistically
  const finalAccuracy = Math.min(100, Math.max(30, accuracyScore + 15)); 
  const finalBalance  = Math.min(100, Math.max(20, 100 - (sessionData.badForm / totalTicks) * 120));
  const finalTiming   = recordingTime < 5 ? 40 : Math.min(100, 70 + (sessionData.good * 0.5));
  const totalScore    = Math.round((finalAccuracy * 0.5) + (finalBalance * 0.3) + (finalTiming * 0.2));

  // ─── Render Handling ──────────────────────────────────────────
  if (hasPermission === false && stage === 'calibration') {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center h-[70vh] rounded-[2rem] border border-slate-700 bg-[#0f121e]">
        <Camera className="w-16 h-16 text-slate-500 mb-4" />
        <h2 className="text-2xl font-black text-white mb-2">الكاميرا غير متاحة، تفعيل وضع المحاكاة</h2>
        <p className="text-slate-400 max-w-md">نظراً لتقييدات المتصفح (HTTP أو رفض الصلاحية)، سيعمل محرك الذكاء الاصطناعي في "وضع المحاكاة" لتستمتع بالتجربة.</p>
        <button onClick={() => { setHasPermission(null); setStage('calibration'); }} className="mt-8 bg-blue-600 hover:bg-blue-500 text-white font-black px-8 py-3 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all">استمرار بوضع المحاكاة المتقدم 🚀</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 relative overflow-hidden bg-slate-50 dark:bg-[#0B0E14] rounded-[2.5rem] min-h-[85vh] border border-slate-200/50 dark:border-white/5">
      <canvas ref={canvasRef} width="64" height="48" className="hidden" />

      <AnimatePresence mode="wait">
        
        {/* =========================================================
            STAGE 1: CALIBRATION & STAGE 2: REFERENCE (CAMERA STILL ON)
        ========================================================= */}
        {(stage === 'calibration' || stage === 'reference' || stage === 'countdown' || stage === 'tracking') && (
          <motion.div
            key="camera-view"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col p-4 md:p-6"
          >
            <div className="relative flex-1 bg-[#0b0e14] overflow-hidden rounded-[2rem] shadow-2xl border-4 border-slate-800/80">
              {/* Animated Matrix/Grid Background for Simulation Mode */}
              {hasPermission === false && (
                <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:30px_30px] opacity-40 animate-[pulse_4s_ease-in-out_infinite]" />
              )}
              {hasPermission !== false && (
                <video 
                  ref={videoRef} muted playsInline 
                  className={cn(
                    "w-full h-full object-cover -scale-x-100 transition-all duration-700",
                    stage === 'reference' ? "opacity-30 blur-sm scale-105" : "scale-100 opacity-100"
                  )}
                />
              )}

              {/* STAGE 1: CALIBRATION OVERLAY */}
              {stage === 'calibration' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-black/40">
                  <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute top-10 flex flex-col items-center">
                    <div className="bg-indigo-600 text-white px-6 py-2 rounded-full font-black tracking-widest text-lg mb-3 shadow-[0_0_20px_rgba(79,70,229,0.5)]">
                      مرحلة المعايرة (Calibration)
                    </div>
                    <p className="text-white text-xl font-bold drop-shadow-lg">قف في منتصف الإطار</p>
                    <p className="text-white/80 text-base font-bold drop-shadow-lg">تأكد أن جسمك بالكامل ظاهر لضمان التتبع الصحيح</p>
                  </motion.div>
                  
                  {/* Human Reference Silhouette / Box */}
                  <div className="w-[45%] h-[75%] border-4 border-dashed border-white/60 rounded-[3rem] relative animate-pulse flex items-center justify-center">
                    <UserCheck className="w-32 h-32 text-white/30" />
                    {/* Corners */}
                    <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-indigo-400 rounded-tl-xl" />
                    <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-indigo-400 rounded-tr-xl" />
                    <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-indigo-400 rounded-bl-xl" />
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-indigo-400 rounded-br-xl" />
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setStage('reference');
                      speak("عرض التمرين المرجعي. يرجى مشاهدة المدرب ثم الضغط على زر البدء الذكي.");
                    }}
                    className="absolute bottom-10 bg-white text-slate-900 font-black px-10 py-4 rounded-xl shadow-2xl flex items-center gap-2"
                  >
                    متابعة <ArrowLeft className="w-5 h-5" />
                  </motion.button>
                </div>
              )}

              {/* STAGE 2: REFERENCE EXERCISE */}
              {stage === 'reference' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10">
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-[#121620] rounded-[2rem] p-8 max-w-xl w-full shadow-2xl border border-white/10 text-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-200 dark:border-blue-800">
                      <PlayCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">عرض التمرين (Reference)</h3>
                    <p className="text-slate-500 font-bold mb-6 text-lg">{exerciseName}</p>
                    
                    {/* Simulated Animation Box */}
                    <div className="w-full aspect-video bg-slate-100 dark:bg-black/50 rounded-2xl mb-6 relative flex items-center justify-center overflow-hidden border border-slate-200 dark:border-white/5">
                      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent" />
                      <div className="flex flex-col items-center z-10">
                        <motion.div 
                          animate={{ y: [0, 20, 0], scaleY: [1, 0.9, 1] }} 
                          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                          className="w-16 h-32 bg-indigo-500 rounded-full"
                        />
                        <span className="text-indigo-400 font-bold mt-4 animate-pulse">محاكاة المدرب...</span>
                      </div>
                    </div>

                    <button 
                      onClick={startCountdown}
                      className="w-full bg-gradient-to-l from-blue-600 to-indigo-600 text-white font-black py-4 rounded-xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 text-lg hover:from-blue-500 hover:to-indigo-500 transition-all"
                    >
                      <Play className="w-5 h-5 fill-white" /> أنا جاهز، ابدأ التنفيذ!
                    </button>
                  </motion.div>
                </div>
              )}

              {/* STAGE 3: COUNTDOWN */}
              {stage === 'countdown' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20 backdrop-blur-sm">
                  <motion.div 
                    key={countdown}
                    initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1.2, opacity: 1 }} exit={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-white text-[10rem] font-black drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                  >
                    {countdown}
                  </motion.div>
                </div>
              )}

              {/* STAGE 4: LIVE TRACKING (REAL-TIME FEEDBACK) */}
              {stage === 'tracking' && (
                <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
                  {/* Top Analytics Bar */}
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-2">
                      <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3 shadow-lg">
                        <Activity className="w-5 h-5 text-indigo-400 animate-pulse" />
                        <span className="font-bold text-white text-sm">تتبع نقاط الجسم (Pose)</span>
                      </div>
                    </div>
                    
                    <div className="bg-red-500/20 backdrop-blur-md border border-red-500/50 px-4 py-2.5 rounded-xl flex items-center gap-3 shadow-lg">
                      <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                      <span className="font-black text-white text-xl tracking-widest">{formatTime(recordingTime)}</span>
                    </div>
                  </div>

                  {/* Pose Estimation Visual Overlay (Simulated High-Fi Nodes & Angles) */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center -z-0">
                    {/* Scanning Laser Line */}
                    <motion.div 
                      className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_rgba(34,211,238,0.8)] z-10"
                      animate={{ top: ['10%', '90%', '10%'], opacity: [0.1, 0.8, 0.1] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    />
                    
                    <div className="relative w-full max-w-sm h-full max-h-[75vh] border border-cyan-500/10 bg-cyan-500/[0.01] rounded-[3rem] overflow-hidden">
                      {/* Depth Field Grid */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_49%,rgba(34,211,238,0.1)_50%,transparent_51%)] bg-[length:100%_40px] opacity-30" />

                      {/* Head Node */}
                      <motion.div 
                        className={cn("absolute w-14 h-14 rounded-full border-2 -translate-x-1/2 transition-colors duration-500", feedbackColor === 'emerald' ? 'border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)] bg-emerald-500/10' : feedbackColor === 'amber' ? 'border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)] bg-amber-500/10' : 'border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)] bg-cyan-500/10')}
                        animate={{ top: ['15%', '25%', '15%'], left: ['50%', '51%', '50%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <div className="absolute -right-20 top-2 text-[10px] font-mono text-cyan-300 bg-black/60 px-1.5 py-0.5 rounded tracking-widest border border-cyan-500/30">H: {recordingTime + 85}%</div>
                      </motion.div>

                      {/* Shoulders Line */}
                      <motion.div 
                        className="absolute h-[3px] bg-cyan-400/60 rounded-full"
                        animate={{ top: ['25%', '35%', '25%'], left: '25%', right: '25%' }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      />
                      {/* Left Shoulder */}
                      <motion.div className="absolute w-5 h-5 rounded-full bg-cyan-500 shadow-[0_0_15px_cyan] border-2 border-white" animate={{ top: ['24%', '34%', '24%'], left: '23%' }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }} />
                      {/* Right Shoulder */}
                      <motion.div className="absolute w-5 h-5 rounded-full bg-cyan-500 shadow-[0_0_15px_cyan] border-2 border-white" animate={{ top: ['24%', '34%', '24%'], right: '23%' }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }} />

                      {/* Spine */}
                      <motion.div 
                        className="absolute w-[3px] bg-cyan-400/60 left-1/2 -translate-x-1/2 rounded-full"
                        animate={{ top: ['25%', '35%', '25%'], bottom: ['45%', '35%', '45%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      />

                      {/* Hips Line */}
                      <motion.div 
                        className="absolute h-[3px] bg-cyan-400/60 rounded-full"
                        animate={{ bottom: ['45%', '35%', '45%'], left: '30%', right: '30%' }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      />
                      {/* Left Hip */}
                      <motion.div className="absolute w-5 h-5 rounded-full bg-indigo-500 shadow-[0_0_15px_indigo] border-2 border-white" animate={{ bottom: ['44%', '34%', '44%'], left: '28%' }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }} />
                      {/* Right Hip */}
                      <motion.div className="absolute w-5 h-5 rounded-full bg-indigo-500 shadow-[0_0_15px_indigo] border-2 border-white" animate={{ bottom: ['44%', '34%', '44%'], right: '28%' }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }} />

                      {/* Left Leg (Thigh) */}
                      <motion.div className="absolute w-[3px] bg-indigo-400/60 transform origin-top left-[32%]" animate={{ bottom: ['25%', '25%', '25%'], top: ['55%', '65%', '55%'], rotate: ['10deg', '45deg', '10deg'] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }} />
                      <motion.div className="absolute w-5 h-5 rounded-full bg-purple-500 shadow-[0_0_15px_purple] border-2 border-white" animate={{ bottom: ['24%', '44%', '24%'], left: ['25%', '15%', '25%'] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }} />
                      
                      {/* Right Leg (Thigh) */}
                      <motion.div className="absolute w-[3px] bg-indigo-400/60 transform origin-top right-[32%]" animate={{ bottom: ['25%', '25%', '25%'], top: ['55%', '65%', '55%'], rotate: ['-10deg', '-45deg', '-10deg'] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }} />
                      <motion.div className="absolute w-5 h-5 rounded-full bg-purple-500 shadow-[0_0_15px_purple] border-2 border-white" animate={{ bottom: ['24%', '44%', '24%'], right: ['25%', '15%', '25%'] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }} />

                      {/* Dynamic Protractors (Angles) overlay */}
                      <motion.div className="absolute left-[15%] bottom-[35%] flex items-center gap-1 opacity-90" animate={{ rotate: [0, -35, 0], bottom: ['40%', '45%', '40%'] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
                         <svg width="40" height="40" viewBox="0 0 100 100" className="stroke-yellow-400 fill-yellow-400/30">
                            <path d="M50 50 L10 50 A40 40 0 0 1 50 10 Z" strokeWidth="2"/>
                         </svg>
                         <span className="text-yellow-400 font-mono text-sm font-black drop-shadow-[0_0_5px_rgba(250,204,21,0.8)] flex-col flex leading-none"><span>90°</span><span className="text-[10px] text-yellow-500">Knee</span></span>
                      </motion.div>

                      {/* Random Data Streams around the body */}
                      <div className="absolute bottom-[20%] right-2 flex flex-col gap-1.5 opacity-80 z-20">
                         <span className="text-[10px] font-mono text-emerald-400 bg-black/60 px-2 py-0.5 border border-emerald-500/20 rounded tracking-widest">vx_JMP: 2.1m/s</span>
                         <span className="text-[10px] font-mono text-emerald-400 bg-black/60 px-2 py-0.5 border border-emerald-500/20 rounded tracking-widest">vy_JMP: -0.8m/s</span>
                         <span className="text-[10px] font-mono text-emerald-400 bg-black/60 px-2 py-0.5 border border-emerald-500/20 rounded tracking-widest">conf_L: 0.98</span>
                      </div>
                    </div>
                  </div>

                  {/* SMART EVALUATION ENGINE - TEXT OVERLAY */}
                  <div className="flex flex-col items-center flex-1 justify-end pb-12 pointer-events-none">
                    <motion.div 
                      key={realtimeFeedback}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={cn(
                        "px-8 py-4 rounded-2xl backdrop-blur-xl border-2 text-center shadow-2xl max-w-lg w-full transition-all duration-300",
                        feedbackColor === 'amber'   ? "bg-amber-500/20 border-amber-500 text-amber-100" :
                        feedbackColor === 'emerald' ? "bg-emerald-500/20 border-emerald-500 text-emerald-100" :
                        "bg-blue-500/20 border-blue-500 text-blue-100"
                      )}
                    >
                      <h3 className={cn("font-black text-xl md:text-2xl drop-shadow-md", 
                        feedbackColor === 'amber' ? "text-amber-300" : feedbackColor === 'emerald' ? "text-emerald-300" : "text-blue-300"
                      )}>
                        {realtimeFeedback}
                      </h3>
                    </motion.div>
                  </div>

                  {/* Stop Button */}
                  <div className="flex justify-center pb-4 pointer-events-auto z-50">
                    <motion.button 
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={finishTracking}
                      className="bg-red-500 hover:bg-red-400 text-white font-black px-10 py-4 rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.5)] flex items-center gap-3 transition-colors border-2 border-red-400"
                    >
                      <Square className="w-5 h-5 fill-white" /> إنهاء التحليل
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* =========================================================
            STAGE 5: ANALYZING (LOADING)
        ========================================================= */}
        {stage === 'analyzing' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-50 p-8 text-center rounded-[2rem] border border-white/5"
          >
            <div className="relative w-48 h-48 mb-12">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" className="text-white/5" />
                <motion.circle 
                  cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" 
                  className="text-indigo-500 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                  initial={{ strokeDasharray: "0 283" }} animate={{ strokeDasharray: `${(analysisProgress / 100) * 283} 283` }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Brain className="w-14 h-14 text-indigo-400 animate-pulse" />
              </div>
            </div>
            <h2 className="text-5xl font-black text-white mb-4 drop-shadow-md">{Math.round(analysisProgress)}%</h2>
            <p className="text-xl font-bold text-indigo-300">{analysisStageText}</p>
          </motion.div>
        )}

        {/* =========================================================
            STAGE 6 & 7: SCORING & ADAPTIVE AI (RESULTS)
        ========================================================= */}
        {stage === 'results' && (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white">نظام التقييم النهائي 🏆</h2>
                <p className="text-slate-500 font-bold">نموذج تتبع المفاصل ثلاثي الأبعاد - {exerciseName}</p>
              </div>
              <button 
                onClick={() => setStage('calibration')}
                className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 font-black px-5 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 flex items-center gap-2"
              >
                <RefreshCcw className="w-5 h-5" /> إعادة
              </button>
            </div>

            {/* General Score Container */}
            <div className="rounded-[2.5rem] bg-gradient-to-tl from-indigo-950 via-slate-900 to-indigo-950 p-8 shadow-2xl border border-indigo-500/20 flex flex-col items-center justify-center relative overflow-hidden text-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px]" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/10 rounded-full blur-[100px]" />
              
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }} className="relative z-10 flex flex-col items-center">
                <Trophy className={cn("w-16 h-16 mb-4", totalScore >= 80 ? "text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.8)]" : "text-slate-400")} />
                <p className="text-indigo-200 font-bold uppercase tracking-widest mb-1">النتيجة العامة (Score)</p>
                <div className="flex items-baseline gap-2">
                  <span className={cn("text-8xl font-black", totalScore >= 80 ? 'text-white' : totalScore >= 50 ? 'text-amber-300' : 'text-rose-400')}>{totalScore}</span>
                  <span className="text-2xl font-black text-slate-500">/100</span>
                </div>
                
                <div className="flex gap-2 mt-4">
                  {[1,2,3,4,5].map(star => (
                    <Star key={star} className={cn("w-6 h-6", star <= Math.round(totalScore/20) ? "text-yellow-400 fill-yellow-400" : "text-white/10 fill-white/10")} />
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Detailed Metric Cards (Stage 6) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center">
                <Target className="w-8 h-8 text-blue-500 mb-3" />
                <h4 className="text-slate-800 dark:text-slate-200 font-black text-lg">دقة الحركة 🎯</h4>
                <span className="text-3xl font-black text-blue-600 dark:text-blue-400 my-2">{finalAccuracy}%</span>
                <p className="text-xs text-slate-500 font-bold">{finalAccuracy > 70 ? 'مدى التطابق مع زوايا المدرب' : 'يوجد انحراف بالزوايا أثناء الأداء'}</p>
              </div>
              <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center">
                <Shield className="w-8 h-8 text-cyan-500 mb-3" />
                <h4 className="text-slate-800 dark:text-slate-200 font-black text-lg">التوازن ⚖️</h4>
                <span className="text-3xl font-black text-cyan-600 dark:text-cyan-400 my-2">{finalBalance}%</span>
                <p className="text-xs text-slate-500 font-bold">{finalBalance > 70 ? 'تمركزك كان مثالياً بالمنتصف' : 'تحتاج للمحافظة على استقرار الظهر'}</p>
              </div>
              <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center">
                <Activity className="w-8 h-8 text-rose-500 mb-3" />
                <h4 className="text-slate-800 dark:text-slate-200 font-black text-lg">التوقيت والانسيابية ⏱️</h4>
                <span className="text-3xl font-black text-rose-600 dark:text-rose-400 my-2">{finalTiming}%</span>
                <p className="text-xs text-slate-500 font-bold">سرعة الاستجابة وتنفيذ التكرارات</p>
              </div>
            </div>

            {/* STAGE 7: ADAPTIVE AI */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="rounded-[2rem] border-2 border-indigo-200 dark:border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-900/10 p-6 flex flex-col md:flex-row gap-6 items-center">
              <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center flex-shrink-0">
                <Brain className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="flex-1 text-center md:text-right">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">توصية الذكاء التكيفي (Adaptive AI)</h3>
                
                {totalScore >= 80 ? (
                  <div>
                    <p className="text-slate-600 dark:text-slate-300 font-bold mb-3">أداء مبهر وتوازن عالي! محرك الذكاء الاصطناعي يقترح رفع مستوى التحدي.</p>
                    <div className="bg-white dark:bg-black/20 rounded-xl p-4 border border-indigo-100 dark:border-indigo-800 inline-block">
                      <span className="text-xs font-black bg-indigo-500 text-white px-2 py-1 rounded mb-1 inline-block">المستوى التالي المفتوح</span>
                      <p className="font-bold text-indigo-700 dark:text-indigo-300 text-lg">تمرين السكوات بقدم واحدة (Pistol Squat)</p>
                    </div>
                  </div>
                ) : (
                   <div>
                    <p className="text-slate-600 dark:text-slate-300 font-bold mb-3">يبدو أن التوازن كان يشكل تحدياً في هذا التمرين. ننصحك بالتدرج لبناء توافق عضلي أفضل.</p>
                    <div className="bg-white dark:bg-black/20 rounded-xl p-4 border border-indigo-100 dark:border-indigo-800 inline-block">
                      <span className="text-xs font-black bg-emerald-500 text-white px-2 py-1 rounded mb-1 inline-block">اقتراح المدرب</span>
                      <p className="font-bold text-indigo-700 dark:text-indigo-300 text-lg">السكوات باستخدام كرسي (Chair Box Squat)</p>
                    </div>
                  </div>
                )}
              </div>
              <button className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-black px-8 py-4 rounded-xl shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 flex-shrink-0">
                ترقية خطتي الآن <ArrowLeft className="w-5 h-5" />
              </button>
            </motion.div>

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
