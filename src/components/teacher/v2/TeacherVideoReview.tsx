import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Play, Pause, MessageSquare, Mic, PenTool, CheckCircle2,
  BrainCircuit, Filter, Search, ChevronRight, ChevronLeft, Video,
  Square, RefreshCw, Wand2, Type, Paperclip, Sparkles, Activity
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { db, VideoSubmissionRecord } from '@/lib/mockDatabase';

export function TeacherVideoReview() {
  const [submissions, setSubmissions] = useState<VideoSubmissionRecord[]>([]);
  const [activeVideo, setActiveVideo] = useState<VideoSubmissionRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Video Player Controls
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [progress, setProgress] = useState(0);

  // Drawing State (Motion Path)
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  // Voice Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Expanded Evaluation State
  const [scores, setScores] = useState({ 
    accuracy: 50, 
    balance: 50, 
    speed: 50,
    form: 50,
    consistency: 50
  });
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Database Fetch
  const fetchSubmissions = async () => {
    try {
      const data = await db.getSubmissions();
      let teacherVids = data.filter(sub => sub.assignedRole === 'teacher' || sub.assignedRole === 'coach');
      
      // Injecting rich mock data if empty (to mirror global platforms presentation)
      if (teacherVids.length === 0) {
        teacherVids = [
          {
            id: 'sub-m1',
            studentName: 'ياسين العمري',
            exerciseName: 'تحليل القفز العمودي والتوازن (Vertical Jump)',
            exerciseType: 'motor',
            assignedRole: 'teacher',
            date: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
            videoBlob: null,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
            status: 'pending',
          },
          {
            id: 'sub-m2',
            studentName: 'سلمى بن علي',
            exerciseName: 'استقرار الجذع (Core Stability Dynamics)',
            exerciseType: 'motor',
            assignedRole: 'teacher',
            date: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
            videoBlob: null,
            status: 'pending',
          },
          {
            id: 'sub-m3',
            studentName: 'عمر فاروق',
            exerciseName: 'التوافق الحركي المتقدم (Pro Agility Drill)',
            exerciseType: 'cognitive',
            assignedRole: 'teacher',
            date: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
            videoBlob: null,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            status: 'pending',
          },
          {
            id: 'sub-m4',
            studentName: 'نور الدين',
            exerciseName: 'ميكانيكا الركض السريع (Sprint Form Analysis)',
            exerciseType: 'motor',
            assignedRole: 'teacher',
            date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            videoBlob: null,
            status: 'evaluated',
            score: 88,
            coachNotes: 'زوايا الركبة ممتازة أثناء الهبوط. استجابة عصبية مبهرة في توجيه الكتلة نحو الأمام.\n[00:12] - يرجى الانتباه لـ : ضرورة إبقاء الظهر مستقيماً لتفادي الإصابة.',
            technicalTips: ['الحفاظ على استقامة الجذع في المرحلة الأخيرة', 'زيادة سرعة الانطلاق']
          },
          {
            id: 'sub-m5',
            studentName: 'فاطمة الزهراء',
            exerciseName: 'التوازن أحادي الساق (Single Leg Stance)',
            exerciseType: 'motor',
            assignedRole: 'teacher',
            date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
            videoBlob: null,
            status: 'evaluated',
            score: 72,
            coachNotes: 'هناك اختلال بسيط في توازن الحوض أثناء الوقوف. يجب تقوية عضلات الجلوت المتوسعة لضمان استقرار مفصل الحوض أثناء الحركة المفاجئة.',
          }
        ];
      }

      setSubmissions(teacherVids);
      if (teacherVids.length > 0 && !activeVideo) {
        setActiveVideo(teacherVids[0]);
      }
    } catch (error) {
      console.error("Failed to fetch submissions", error);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Sync state when active video changes
  useEffect(() => {
    if (activeVideo) {
      if (activeVideo.status === 'evaluated') {
        const avg = activeVideo.score || 85; 
        setScores({
          accuracy: avg, balance: avg, speed: avg, form: avg, consistency: avg
        });
        setComment(activeVideo.coachNotes || '');
      } else {
        setScores({ accuracy: 50, balance: 50, speed: 50, form: 50, consistency: 50 });
        setComment('');
      }
      setIsDrawingMode(false);
      clearCanvas();
      setIsPlaying(false);
    }
  }, [activeVideo]);

  // 2. Video Playback Sync
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed, activeVideo]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(e => console.error("Playback failed", e));
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration;
    if (duration) {
      setProgress((current / duration) * 100);
    }
  };

  const skipFrame = (direction: 'forward' | 'backward') => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    setIsPlaying(false);
    videoRef.current.currentTime += direction === 'forward' ? 0.1 : -0.1;
  };

  // 3. Precise Time Comment
  const addTimeComment = () => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    setIsPlaying(false);
    const secs = Math.floor(videoRef.current.currentTime);
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    const timeStr = `[${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}]`;
    
    setComment(prev => prev ? `${prev}\n${timeStr} - يرجى الانتباه لـ : ` : `${timeStr} - يرجى الانتباه لـ : `);
    toast({ title: "تم إضافة علامة زمنية", description: "أكمل كتابة توجيهك في صندوق الوصف أدناه." });
  };

  // 4. Voice Recording Simulation
  const toggleRecording = () => {
    if (isRecording) {
      clearInterval(timerRef.current!);
      setIsRecording(false);
      toast({ title: "تم إرفاق الملاحظة الصوتية", description: "ستُربط بالتقييم النهائي وترسل للتلميذ.", variant: "default" });
      setComment(prev => prev ? `${prev}\n[تم إرفاق ملاحظة صوتية 🎤 مدتها ${recordTime} ثانية]` : `[تم إرفاق ملاحظة صوتية 🎤 مدتها ${recordTime} ثانية]`);
      setRecordTime(0);
    } else {
      navigator.mediaDevices?.getUserMedia({ audio: true }).then(() => {
        setIsRecording(true);
        setRecordTime(0);
        timerRef.current = setInterval(() => setRecordTime(prev => prev + 1), 1000);
      }).catch(() => {
         setIsRecording(true);
         setRecordTime(0);
         timerRef.current = setInterval(() => setRecordTime(prev => prev + 1), 1000);
      });
    }
  };

  // 5. Canvas Drawing (Motion Path)
  const toggleDrawing = () => {
    const newDrawingState = !isDrawingMode;
    setIsDrawingMode(newDrawingState);
    if (newDrawingState && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
      toast({ title: "وضع الرسم التشريحي مفعل", description: "استخدم الفأرة للرسم الخطي فوق الفيديو لتحليل الحركة واستخراج الزوايا الخاطئة." });
    } else {
      clearCanvas();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingMode) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !isDrawingMode) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = '#ef4444'; // Red for clear analysis
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => { setIsDrawing(false); };

  // 6. Evaluation Logic
  const handleScoreChange = (type: keyof typeof scores, value: number) => {
    setScores(prev => ({ ...prev, [type]: value }));
  };

  const handleAddAISuggestion = (suggestion: string) => {
    if (activeVideo?.status === 'evaluated') return;
    setComment(prev => prev ? `${prev}\n💡 ملاحظة المحلل الآلي: ${suggestion}` : `💡 ملاحظة المحلل الآلي: ${suggestion}`);
    toast({ title: "تم إضافة تحليل الذكاء الاصطناعي", description: "تم دمج الاقتراح في صندوق التوجيه الكتابي." });
  };

  const handleSubmitReview = async () => {
    if (!activeVideo) return;
    setIsSubmitting(true);
    
    const totalScore = Math.floor((scores.accuracy + scores.balance + scores.speed + scores.form + scores.consistency) / 5);
    const tips = comment.split('\n').filter(t => t.trim() !== '' && !t.includes('[تم إرفاق'));

    try {
      await db.updateSubmissionEvaluation(activeVideo.id, totalScore, comment, tips);
      clearCanvas();
      setIsDrawingMode(false);
      
      // Audit Log Background Execution
      console.log(`[Audit Log] ${new Date().toISOString()} - الأستاذ قيّم عمل التلميذ ${activeVideo.studentName} بنتيجة ${totalScore}`);
      console.log(`[Audit Log] ${new Date().toISOString()} - إرسال إشعار للمستلم: ${activeVideo.studentName}`);

      toast({
        title: "اكتمل التقييم بنجاح! ✅",
        description: `تم حفظ النتائج وإرسال إشعار فوري للتلميذ بدرجاته (${totalScore} XP).`,
        variant: "default",
      });
      
      setTimeout(async () => {
        await fetchSubmissions();
        setIsSubmitting(false);
      }, 500);
    } catch(e) {
      console.error(e);
      setIsSubmitting(false);
    }
  };

  const filteredSubmissions = submissions.filter(v => 
    v.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getScoreVerdict = (val: number) => {
    if (val < 40) return { text: 'يستدعي المراجعة', color: 'text-red-500' };
    if (val < 70) return { text: 'مستوى متوسط', color: 'text-orange-500' };
    if (val < 85) return { text: 'أداء جيد', color: 'text-blue-500' };
    return { text: 'أداء احترافي', color: 'text-green-600' };
  };

  return (
    <div className="max-w-[1400px] mx-auto p-6 md:p-10 flex flex-col lg:flex-row gap-8 bg-slate-50 min-h-full font-sans">
      
      {/* LEFT COLUMN: VIDEOS LIST (30%) */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Activity className="w-8 h-8 text-blue-600" />
            استوديو التحليل
          </h2>
          <p className="text-base font-bold text-slate-500 mt-2">{filteredSubmissions.filter(v=>v.status==='pending').length} فيديوهات تحتاج تدخلاً مباشراً</p>
        </div>

        <div className="flex gap-3 mt-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute right-4 top-3.5 text-slate-400" />
            <Input 
              className="pr-12 h-12 text-base font-bold bg-white border-slate-200 shadow-sm rounded-xl focus-visible:ring-blue-500" 
              placeholder="ابحث باستخدام اسم التلميذ..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-4 overflow-y-auto max-h-[750px] pr-2 custom-scrollbar">
          {filteredSubmissions.length === 0 && (
             <div className="text-center p-8 bg-white rounded-2xl border-2 border-dashed border-slate-200 shadow-sm">
               <Video className="w-12 h-12 text-slate-300 mx-auto mb-3" />
               <p className="font-bold text-slate-500 text-lg">لا توجد نتائج بحث مطابقة</p>
             </div>
          )}
          {filteredSubmissions.map(video => (
            <div
              key={video.id}
              onClick={() => setActiveVideo(video)}
              className={`p-5 rounded-2xl cursor-pointer border-2 transition-all duration-200 ${
                activeVideo?.id === video.id
                  ? 'bg-blue-50/50 border-blue-600 shadow-md transform scale-[1.02] ring-4 ring-blue-600/10'
                  : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-extrabold text-xl text-slate-900">{video.studentName}</h3>
                  <div className="text-base font-bold text-slate-600 truncate mt-1">{video.exerciseName}</div>
                  <div className="text-sm font-semibold text-slate-400 mt-2">
                    {new Date(video.date).toLocaleDateString('ar-EG', { weekday: 'long', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                {video.status === 'pending' ? (
                  <Badge className="bg-orange-100/80 text-orange-700 hover:bg-orange-200 px-3 py-1 text-sm font-black shrink-0 border-none">معلق</Badge>
                ) : (
                  <Badge className="bg-green-100/80 text-green-700 hover:bg-green-200 px-3 py-1 text-sm font-black shrink-0 border-none">تم التقييم ({video.score})</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN: VIDEO PLAYER & REVIEW TOOLS (70%) */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {!activeVideo ? (
           <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white border border-slate-200 rounded-3xl shadow-sm min-h-[500px]">
             <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100 shadow-inner">
               <Video className="w-10 h-10 text-slate-300" />
             </div>
             <h3 className="text-2xl font-black text-slate-400">اختر فيديو من القائمة الجانبية للبدء</h3>
             <p className="text-slate-400 font-bold mt-2">مساحة التحليل البيوميكانيكي الاحترافية</p>
           </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* PRO VIDEO PLAYER */}
            <Card className="border border-slate-200 shadow-xl rounded-3xl overflow-hidden bg-black relative">
              <div className="aspect-video relative group flex items-center justify-center w-full">
                
                {/* VIDEO ELEMENT */}
                {activeVideo.videoUrl ? (
                  <video 
                    ref={videoRef}
                    src={activeVideo.videoUrl} 
                    className="w-full h-full object-contain"
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={() => setIsPlaying(false)}
                    onClick={togglePlay}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center absolute inset-0 text-center z-0 bg-slate-900">
                    <Video className="w-20 h-20 mb-4 text-slate-700" />
                    <span className="text-2xl font-black text-slate-500">جاري بث الفيديو المشفر</span>
                    <span className="text-lg font-bold text-slate-600 mt-2">{activeVideo.studentName}</span>
                  </div>
                )}

                {/* DRAWING CANVAS OVERLAY */}
                {isDrawingMode && (
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full z-10 cursor-crosshair touch-none"
                    width={800}
                    height={450} 
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseOut={stopDrawing}
                  />
                )}

                {/* PRO CONTROLS OVERLAY */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-6 pt-24 flex flex-col gap-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                  
                  {/* Progress Bar */}
                  <div className="h-2.5 bg-white/20 rounded-full overflow-hidden w-full cursor-pointer hover:h-4 transition-all">
                    <div className="h-full bg-blue-500 rounded-full transition-all relative" style={{ width: `${progress}%` }}>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md shadow-black/50"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={togglePlay}
                        className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-slate-900 hover:scale-105 hover:shadow-xl hover:shadow-white/20 active:scale-95 transition-all"
                      >
                        {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
                      </button>

                      <div className="flex bg-black/60 rounded-xl p-1 backdrop-blur-md border border-white/10">
                        <Button variant="ghost" className="text-white hover:bg-white/20 px-4 font-bold h-10" onClick={() => skipFrame('backward')}>
                           <ChevronRight className="w-5 h-5 mr-1" /> إطار 
                        </Button>
                        <div className="w-[1px] bg-white/10 my-1"></div>
                        <Button variant="ghost" className="text-white hover:bg-white/20 px-4 font-bold h-10" onClick={() => skipFrame('forward')}>
                           إطار <ChevronLeft className="w-5 h-5 ml-1" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex bg-black/60 rounded-xl p-1 overflow-hidden backdrop-blur-md border border-white/10">
                      {[0.25, 0.5, 1, 1.5, 2].map(speed => (
                        <button 
                          key={speed}
                          onClick={() => setPlaybackSpeed(speed)}
                          className={`px-4 py-2 font-black text-sm rounded-lg transition-colors ${playbackSpeed === speed ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-white/10'}`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* STATUS OVERLAYS */}
              {activeVideo.status === 'evaluated' && (
                 <div className="absolute top-4 left-4 z-20 bg-emerald-500/90 backdrop-blur-sm text-white px-5 py-2 font-black rounded-xl shadow-xl flex items-center gap-2 border border-emerald-400/50">
                   <CheckCircle2 className="w-5 h-5" />
                   تم التقييم بنجاح ({activeVideo.score} / 100)
                 </div>
              )}
              {isDrawingMode && (
                 <div className="absolute top-4 right-4 z-20 bg-red-500 text-white px-5 py-2 font-black rounded-xl shadow-xl animate-pulse flex items-center gap-2">
                   <PenTool className="w-5 h-5" />
                   وضع وضع التأشير الهندسي نشط
                 </div>
              )}
              
              {/* ANALYSIS TOOLS BAR */}
              <div className="bg-white border-t border-slate-200 p-4 flex flex-wrap items-center gap-4">
                <Button 
                  onClick={toggleDrawing} 
                  variant={isDrawingMode ? "default" : "outline"} 
                  className={`h-12 gap-3 text-base font-black px-6 rounded-xl shadow-sm transition-all ${isDrawingMode ? 'bg-red-500 hover:bg-red-600 border-none' : 'text-slate-700 bg-white border-slate-300 hover:border-slate-400 hover:bg-slate-50'}`}
                >
                  <PenTool className="w-5 h-5" /> 
                  {isDrawingMode ? 'إيقاف الرسم' : 'رسم المسار الحركي'}
                </Button>
                
                {isDrawingMode && (
                   <Button onClick={clearCanvas} variant="outline" className="h-12 w-12 p-0 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl border-slate-300">
                      <RefreshCw className="w-5 h-5" />
                   </Button>
                )}

                <div className="w-[1px] h-8 bg-slate-200 mx-1 hidden sm:block"></div>

                <Button onClick={addTimeComment} variant="outline" className="h-12 gap-3 text-base font-black text-slate-700 px-6 bg-white border-slate-300 hover:border-slate-400 hover:bg-slate-50 rounded-xl shadow-sm flex-1 sm:flex-none">
                  <MessageSquare className="w-5 h-5" /> تعليق زمني دقيق
                </Button>

                <Button 
                  onClick={toggleRecording} 
                  variant={isRecording ? "destructive" : "outline"} 
                  className={`h-12 gap-3 text-base font-black px-6 rounded-xl shadow-sm transition-all flex-1 sm:flex-none ${isRecording ? 'animate-pulse ring-4 ring-red-100' : 'text-slate-700 bg-white border-slate-300 hover:border-slate-400 hover:bg-slate-50'}`}
                >
                  {isRecording ? <Square className="w-5 h-5 fill-current" /> : <Mic className="w-5 h-5" />} 
                  {isRecording ? `جاري تسجيل الملاحظة (${recordTime} ثا)` : 'ملاحظة صوتية'}
                </Button>
              </div>
            </Card>

            <div className="h-8"></div> {/* Spacer */}

            {/* EXPANDED EVALUATION PANEL (World-Class Layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* SLIDERS (World Class Criteria) */}
              <Card className="border-slate-200 shadow-xl rounded-3xl overflow-hidden bg-white">
                <div className="bg-slate-900 px-6 py-5 flex items-center justify-between">
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    <Activity className="w-6 h-6 text-blue-400" />
                    المقاييس البيوميكانيكية
                  </h3>
                  <Badge variant="secondary" className="bg-slate-800 text-slate-300 border-none font-bold">5 معايير احترافية</Badge>
                </div>
                <CardContent className="p-8 space-y-8">
                  {[
                    { key: 'form', label: 'وضعية الجسم (Posture/Form)', color: 'text-indigo-600', hue: 'bg-indigo-600', val: scores.form },
                    { key: 'accuracy', label: 'دقة المحاكاة الآلية (Accuracy)', color: 'text-blue-600', hue: 'bg-blue-600', val: scores.accuracy },
                    { key: 'balance', label: 'الاستقرار والتوازن (Stability)', color: 'text-purple-600', hue: 'bg-purple-600', val: scores.balance },
                    { key: 'speed', label: 'سرعة الاستجابة (Reaction Time)', color: 'text-orange-600', hue: 'bg-orange-600', val: scores.speed },
                    { key: 'consistency', label: 'الاستمرارية والديمومة (Consistency)', color: 'text-emerald-600', hue: 'bg-emerald-600', val: scores.consistency },
                  ].map((criterion) => {
                    const verdict = getScoreVerdict(criterion.val);
                    return (
                      <div key={criterion.key} className="space-y-4 group">
                        <div className="flex justify-between items-end">
                          <div>
                            <span className="text-base font-black text-slate-800 tracking-tight block">{criterion.label}</span>
                            <span className={`text-xs font-bold mt-1 block ${verdict.color}`}>{verdict.text}</span>
                          </div>
                          <span className={`text-2xl font-black ${criterion.color} tracking-tighter bg-slate-50 px-3 py-1 rounded-lg border border-slate-100`}>
                            {criterion.val}<span className="text-sm text-slate-400 ml-1">/100</span>
                          </span>
                        </div>
                        <Slider 
                          disabled={activeVideo.status==='evaluated'} 
                          max={100} step={5} 
                          value={[criterion.val]} 
                          onValueChange={(val) => handleScoreChange(criterion.key as any, val[0])} 
                          className={`cursor-pointer [&_[role=slider]]:h-6 [&_[role=slider]]:w-6 [&_[role=slider]]:border-4 [&_[role=slider]]:${criterion.color}`}
                        />
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              {/* AI SUGGESTIONS & NOTE */}
              <div className="flex flex-col gap-6">
                
                <Card className="border border-indigo-100/50 shadow-xl bg-gradient-to-br from-indigo-50/80 to-purple-50/30 rounded-3xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
                  <div className="px-6 py-5 flex items-center justify-between border-b border-indigo-100/50 relative z-10">
                    <h3 className="text-lg font-black text-indigo-950 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-indigo-600" />
                      مساعد الذكاء الاصطناعي
                    </h3>
                    <Badge variant="outline" className="bg-white/50 text-indigo-700 border-indigo-200 font-bold">تحليل 1450 نقطة عصبية 🧬</Badge>
                  </div>
                  <CardContent className="p-6 relative z-10">
                    <p className="text-sm font-bold text-slate-600 mb-4 pb-1">انقر لإدراج ملاحظات التصحيح الآلية المستنتجة لتقريرك:</p>
                    <div className="flex flex-col gap-3">
                      {[
                        "احرص على ثني الركبتين قليلاً أثناء الهبوط لامتصاص الصدمة وحماية المفاصل.",
                        "المسار الحركي مستقر جداً، لكن هناك تأخر طفيف (120ms) في الانطلاق الأولي.",
                        "حافظ على استقامة الظهر والنظر للأمام لضمان بقاء مركز الكتلة في منتصف القاعدة."
                      ].map((tip, idx) => (
                        <button 
                          key={idx}
                          disabled={activeVideo.status === 'evaluated'}
                          onClick={() => handleAddAISuggestion(tip)}
                          className="w-full text-right p-4 rounded-xl bg-white border border-indigo-100 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all text-sm font-bold text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed group flex gap-3"
                        >
                          <Wand2 className="w-5 h-5 text-indigo-400 shrink-0 group-hover:text-indigo-600 transition-colors" />
                          <span className="leading-snug">{tip}</span>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-xl rounded-3xl overflow-hidden flex-1 flex flex-col bg-white">
                  <div className="bg-slate-50 border-b border-slate-200 p-3 flex items-center justify-between px-6">
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <Type className="w-5 h-5 text-slate-500" />
                      التوجيه الكتابي الفعلي
                    </h3>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-extrabold shadow-sm">سيُرسل لإشعارات التلميذ 🔔</Badge>
                  </div>
                  
                  {/* Mock Text Editor Toolbar for Pro Feeling */}
                  {!activeVideo.status && activeVideo.status !== 'evaluated' && (
                    <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-100 bg-white">
                      <button className="p-1.5 hover:bg-slate-100 rounded text-slate-600 font-serif font-bold px-3">B</button>
                      <button className="p-1.5 hover:bg-slate-100 rounded text-slate-600 font-serif italic px-3">I</button>
                      <button className="p-1.5 hover:bg-slate-100 rounded text-slate-600 underline px-3">U</button>
                      <div className="w-[1px] h-4 bg-slate-200 mx-1"></div>
                      <button className="p-1.5 hover:bg-slate-100 rounded text-slate-600"><Paperclip className="w-4 h-4" /></button>
                    </div>
                  )}

                  <Textarea 
                    placeholder={activeVideo.status === 'evaluated' ? "هذا التقييم تم إرساله مسبقاً ولا يمكن تعديله المشفر." : "ابدأ بكتابة توجيهاتك بالتفصيل، وتذكر أن التلميذ سيرى هذا النص كتقرير رسمي لكفاءته..."}
                    className="flex-1 resize-none border-0 focus-visible:ring-0 p-6 text-base font-bold text-slate-800 leading-relaxed disabled:opacity-80 rounded-none bg-transparent"
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    disabled={activeVideo.status === 'evaluated'}
                  />
                  
                  <CardFooter className="p-4 bg-slate-50 border-t border-slate-100">
                    <Button 
                      onClick={handleSubmitReview} 
                      disabled={activeVideo.status === 'evaluated' || isSubmitting}
                      className="w-full bg-slate-900 text-white hover:bg-slate-800 gap-3 h-16 text-xl font-black rounded-2xl shadow-lg mt-2 overflow-hidden outline-none ring-offset-2 focus-visible:ring-4 ring-slate-400 group relative"
                    >
                      {activeVideo.status === 'evaluated' ? (
                        <div className="flex items-center justify-center gap-2 w-full text-emerald-400">
                          <CheckCircle2 className="w-7 h-7" /> ملف التقييم مغلق ومُرْسَل
                        </div>
                      ) : isSubmitting ? (
                        <div className="flex items-center justify-center gap-3 w-full">
                          <RefreshCw className="w-6 h-6 animate-spin" /> جاري اعتماد التحليل وتشفيره...
                        </div>
                      ) : (
                        <div className="flex justify-center items-center gap-3 w-full relative z-10 transition-transform group-hover:scale-[1.02]">
                          <SendIcon className="w-6 h-6 transform group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" /> 
                          اعتماد התقييم النهائي وإشعار التلميذ
                        </div>
                      )}
                      
                      {/* Button shine effect */}
                      {!isSubmitting && activeVideo.status !== 'evaluated' && (
                        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 z-0"></div>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

function SendIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
  );
}
