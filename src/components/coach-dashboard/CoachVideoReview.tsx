import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, Pause, FastForward, Rewind, Mic, Pencil, 
  Send, CheckCircle, Video, PlaySquare, Trash2, Upload
} from 'lucide-react';
import { toast } from 'sonner';

export default function CoachVideoReview() {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [rating, setRating] = useState([85]);
  const [progress, setProgress] = useState(0);
  
  // Videos Data
  const [videos, setVideos] = useState([
    { id: 1, student: 'محمد', track: 'motor', exercise: 'تمرين السكوات (Squat)', time: 'منذ ساعتين', status: 'pending', fileUrl: '' },
    { id: 2, student: 'رامي', track: 'cognitive', exercise: 'اختبار سرعة الاستجابة (رد الفعل)', time: 'منذ 5 ساعات', status: 'reviewed', fileUrl: '' },
    { id: 3, student: 'خالد', track: 'rehab', exercise: 'جلسة تأهيل الركبة المتصالبة', time: 'منذ 8 ساعات', status: 'pending', fileUrl: '' },
    { id: 4, student: 'يوسف', track: 'psych', exercise: 'تحليل لغة الجسد والثقة قبل المنافسة', time: 'منذ يوم', status: 'pending', fileUrl: '' },
  ]);

  const activeVideo = videos[activeVideoIndex];
  
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Drawing Canvas State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Handle genuine file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const newVideos = [...videos];
      newVideos[activeVideoIndex].fileUrl = url;
      setVideos(newVideos);
      toast.success('تم تحميل فيديو المتدرب الفعلي بنجاح!');
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };
    
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [activeVideoIndex, videos]);

  const togglePlay = () => {
    if (videoRef.current && activeVideo.fileUrl) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    } else {
      toast.error('الرجاء عرض ملف الفيديو الفعلي المرسل أولاً');
    }
  };

  const changeSpeed = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackRate(speed);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && activeVideo.fileUrl) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      videoRef.current.currentTime = percentage * videoRef.current.duration;
    }
  };

  // Canvas Drawing Logic
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingMode || !canvasRef.current || !activeVideo.fileUrl) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Resume drawing logic
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !isDrawingMode || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.strokeStyle = '#ef4444'; // Red for visibility
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawingMode && canvasRef.current) {
      setIsDrawing(false);
    }
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  // Adjust canvas size when switching drawing mode
  useEffect(() => {
    if (isDrawingMode && canvasRef.current && videoRef.current) {
      canvasRef.current.width = videoRef.current.offsetWidth;
      canvasRef.current.height = videoRef.current.offsetHeight;
    }
  }, [isDrawingMode]);


  return (
    <div className="space-y-6 flex flex-col min-h-[calc(100vh-140px)]">
      {/* HEADER */}
      <div className="shrink-0 mb-2">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">استوديو التحليل الحركي</h2>
        <p className="text-base md:text-lg text-slate-500 mt-2 font-medium">مراجعة والتحليل الدقيق لأداء المتدربين من خلال فيديوهاتهم الفعلية المرسلة.</p>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6">
        
        {/* SIDEBAR: PENDING VIDEOS */}
        <Card className="w-full lg:w-1/3 xl:w-1/4 bg-white border-slate-200 shadow-sm flex flex-col lg:h-[700px] shrink-0 order-2 lg:order-1">
          <div className="p-4 border-b border-slate-100 shrink-0 bg-slate-50 font-bold text-slate-700 flex justify-between items-center">
            <span>المرسلات بانتظار المراجعة</span>
            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md text-xs">{videos.length}</span>
          </div>
           <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {videos.map((vid, idx) => (
              <div 
                key={vid.id} 
                onClick={() => {
                   setActiveVideoIndex(idx);
                   setIsPlaying(false);
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  activeVideo.id === vid.id 
                    ? 'bg-blue-50 border-blue-400 shadow-md ring-2 ring-blue-500/20' 
                    : vid.status === 'pending' 
                      ? 'bg-white border-slate-200 hover:border-blue-300' 
                      : 'bg-slate-50 border-slate-100 hover:border-slate-300 opacity-70'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                   <h4 className={`font-bold ${activeVideo.id === vid.id ? 'text-blue-900' : 'text-slate-900'}`}>{vid.student}</h4>
                   {vid.status === 'pending' 
                     ? <span className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-1 shadow-sm shadow-blue-400 animate-pulse"></span>
                     : <CheckCircle className="w-4 h-4 text-emerald-500" />
                   }
                </div>
                <div className="mb-2">
                   <span className={`text-[10px] font-black uppercase inline-block px-2 py-0.5 rounded-md mb-1.5 ${
                      vid.track === 'motor' ? 'bg-indigo-100 text-indigo-700' :
                      vid.track === 'cognitive' ? 'bg-amber-100 text-amber-700' :
                      vid.track === 'psych' ? 'bg-purple-100 text-purple-700' :
                      'bg-emerald-100 text-emerald-700'
                   }`}>
                     {vid.track === 'motor' ? 'الأداء الحركي' : vid.track === 'cognitive' ? 'الأداء المعرفي' : vid.track === 'psych' ? 'الأداء النفسي' : 'إعادة التأهيل'}
                   </span>
                   <p className="text-sm font-semibold text-slate-600 line-clamp-1">{vid.exercise}</p>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 font-medium pt-2 border-t border-slate-200/60 mt-2">
                  <div className="flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5" />
                    {vid.fileUrl ? <span className="text-emerald-500 font-bold">مرفق جاهز</span> : <span>يحتاج تنزيل / محاكاة</span>}
                  </div>
                  <span>{vid.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* WORKSPACE: VIDEO PLAYER & TOOLS */}
        <div className="flex-1 flex flex-col gap-6 order-1 lg:order-2">
          
          {/* VIDEO PLAYER */}
          <Card className={`bg-black rounded-3xl overflow-hidden shadow-2xl relative shrink-0 aspect-video group border-2 ${activeVideo.fileUrl ? 'border-transparent' : 'border-dashed border-slate-700'}`}>
             
             {!activeVideo.fileUrl ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                   <Upload className="w-16 h-16 text-slate-600 mb-4" />
                   <h3 className="text-white text-xl md:text-2xl font-black mb-2">استعراض مرفق فيديو المتدرب المباشر</h3>
                   <p className="text-slate-400 mb-6 font-medium text-sm md:text-base max-w-md">انقر أدناه لاختيار ملف الـ MP4/MOV الفعلي الذي أرسله المتدرب لرؤيته وتحليله مباشرةً بأدوات المنصة.</p>
                   <Button variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white font-bold h-12 px-6 rounded-xl relative overflow-hidden">
                       <input 
                         type="file" 
                         accept="video/mp4,video/x-m4v,video/*" 
                         className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-20"
                         onChange={handleFileUpload}
                       />
                       <span>اختر الفيديو الحقيقي للمعاينة والتحليل</span>
                   </Button>
                </div>
             ) : (
               <>
                 {/* Actual Video */}
                 <video 
                   ref={videoRef} 
                   src={activeVideo.fileUrl} 
                   className="w-full h-full object-contain bg-black"
                   playsInline
                   onClick={togglePlay}
                 />
                 
                 {/* Drawing Canvas Overlaid */}
                 {isDrawingMode && (
                   <canvas
                     ref={canvasRef}
                     className="absolute inset-0 z-10 cursor-crosshair touch-none"
                     onMouseDown={startDrawing}
                     onMouseMove={draw}
                     onMouseUp={stopDrawing}
                     onMouseLeave={stopDrawing}
                     onTouchStart={startDrawing}
                     onTouchMove={draw}
                     onTouchEnd={stopDrawing}
                   />
                 )}
               </>
             )}
             
             {/* Player Controls Overlaid (Only if Video Exists) */}
             <div className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 md:p-6 flex flex-col gap-4 z-20 transition-opacity ${!activeVideo.fileUrl ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
               
               {/* Timeline */}
               <div 
                 className="w-full h-2 md:h-1.5 bg-white/30 rounded-full cursor-pointer relative"
                 onClick={handleSeek}
               >
                  <div className="absolute left-0 h-full bg-blue-500 rounded-full transition-all duration-100 shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: `${progress}%` }}></div>
               </div>

               <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                 <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
                    <Button variant="ghost" size="icon" className="text-white hover:text-blue-400 hover:bg-white/10" onClick={togglePlay}>
                      {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7" />}
                    </Button>
                    <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md rounded-lg p-1">
                      {[0.5, 1, 1.5, 2].map(speed => (
                        <button 
                          key={speed}
                          onClick={() => changeSpeed(speed)}
                          className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${playbackRate === speed ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-white/10'}`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                 </div>
                 
                 <div className="flex gap-2 w-full sm:w-auto justify-center">
                    <Button 
                      onClick={() => {
                        toast(isDrawingMode ? 'تم إيقاف وضع الرسم' : 'وضع الرسم نشط! ارسم على الفيديو مباشرة');
                        setIsDrawingMode(!isDrawingMode);
                        if (!isDrawingMode && isPlaying) togglePlay(); // Pause automatically when drawing
                      }} 
                      variant="ghost" 
                      className={`text-white rounded-xl flex items-center gap-2 px-4 ${isDrawingMode ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}`}
                    >
                      <Pencil className="w-5 h-5" />
                      <span className="hidden sm:inline font-bold text-sm">أدوات منصة التحليل (رسم)</span>
                    </Button>

                    {isDrawingMode && (
                      <Button onClick={clearCanvas} variant="ghost" size="icon" className="text-white bg-red-500/80 hover:bg-red-600 rounded-xl">
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    )}
                 </div>
               </div>
             </div>

             {/* Top Right Status Badge inside video */}
             <div className="absolute top-4 right-4 z-20 pointer-events-none">
                <div className={`bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2 ${activeVideo.fileUrl ? '' : 'hidden'}`}>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    {activeVideo.student} - مراجعة الفيديو الفعلي
                </div>
             </div>
          </Card>

          {/* RATING & FEEDBACK PANEL */}
          <Card className="bg-white border-slate-200 shadow-sm flex-1 flex flex-col">
             <CardContent className="p-4 md:p-6 flex-1 flex flex-col gap-6">
                
                <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-100 pb-4 gap-4 text-center sm:text-right">
                  <h3 className="text-xl font-bold flex items-center justify-center sm:justify-start gap-2 text-slate-900 w-full sm:w-auto">
                    <PlaySquare className="w-5 h-5 text-blue-600" /> تقييم الأداء النهائي وإعداد التقرير
                  </h3>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-indigo-200 mx-auto sm:mx-0">
                    {rating}%
                  </div>
                </div>

                <div className="space-y-4">
                   <div className="flex justify-between items-center text-sm font-bold text-slate-500 px-2 min-w-[200px]">
                     <span>
                        {activeVideo.track === 'motor' ? 'مستوى الإتقان والتوافق العضلي' :
                         activeVideo.track === 'rehab' ? 'مستوى تقدم التعافي والتوازن الحركي' :
                         activeVideo.track === 'cognitive' ? 'سرعة الاستجابة واتخاذ القرار السليم' :
                         'مستوى الثقة بالنفس والتعامل مع الضغط'}
                     </span>
                   </div>
                   <Slider defaultValue={[85]} max={100} step={1} onValueChange={setRating} className="cursor-pointer" />
                </div>

                <div className="flex-1 mt-2 min-h-[120px]">
                   <textarea 
                     className="w-full h-full min-h-[120px] resize-none border border-slate-200 rounded-2xl p-4 bg-slate-50 font-medium text-slate-700 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                     placeholder="دوّن الملاحظات والتوصيات الحركية المرفقة، سيتم دمجها مع الفيديو الفعلي وإرسالها للمتدرب فوراً..."
                   ></textarea>
                </div>

                <Button onClick={() => toast.success('تم إرسال التقييم والفيديو المحلل للمتدرب بنجاح!')} className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-emerald-200 hover:scale-[1.01] transition-transform flex items-center justify-center">
                   <Send className="w-5 h-5 flex-shrink-0 ml-2" /> إرسال التحليل الجاهز كالمحترفين
                </Button>
             </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
