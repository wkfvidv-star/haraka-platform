import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { 
  Play, Pause, FastForward, Rewind, Mic, Pencil, 
  Send, CheckCircle, Video, PlaySquare 
} from 'lucide-react';
import { toast } from 'sonner';

const pendingVideos = [
  { id: 1, student: 'محمد', exercise: 'تمرين السكوات (Squat)', time: 'منذ ساعتين', status: 'pending' },
  { id: 2, student: 'رامي', exercise: 'الضغط الصدري (Push-ups)', time: 'منذ 5 ساعات', status: 'reviewed' },
];

export default function CoachVideoReview() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [rating, setRating] = useState([85]);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const changeSpeed = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackRate(speed);
    }
  };

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-140px)]">
      {/* HEADER */}
      <div className="shrink-0 mb-2">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">استوديو التحليل الحركي</h2>
        <p className="text-lg text-slate-500 mt-2 font-medium">مراجعة أداء المتدربين بدقة باستخدام أدوات الفيديو المتقدمة.</p>
      </div>

      <div className="flex-1 flex gap-6 min-h-0 overflow-hidden">
        
        {/* SIDEBAR: PENDING VIDEOS */}
        <Card className="w-1/3 bg-white border-slate-200 shadow-sm flex flex-col h-full overflow-hidden shrink-0">
          <div className="p-4 border-b border-slate-100 shrink-0 bg-slate-50 font-bold text-slate-700">
            طابور المراجعة (2)
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {pendingVideos.map((vid) => (
              <div key={vid.id} className={`p-4 rounded-xl border cursor-pointer transition-all ${vid.status === 'pending' ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-300 opacity-60'}`}>
                <div className="flex justify-between items-start mb-2">
                   <h4 className="font-bold text-slate-900">{vid.student}</h4>
                   {vid.status === 'pending' 
                     ? <span className="w-2 h-2 rounded-full bg-blue-600 mt-2"></span>
                     : <CheckCircle className="w-4 h-4 text-emerald-500" />
                   }
                </div>
                <p className="text-sm font-semibold text-slate-600 mb-1">{vid.exercise}</p>
                <span className="text-xs text-slate-400 font-medium">{vid.time}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* WORKSPACE: VIDEO PLAYER & TOOLS */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* VIDEO PLAYER */}
          <Card className="bg-black rounded-2xl overflow-hidden shadow-lg relative shrink-0 aspect-video group">
             {/* Mock placeholder since no actual video */}
             <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
               <Video className="w-20 h-20 text-slate-800" />
               <video ref={videoRef} className="hidden" src="" />
             </div>
             
             {/* Player Controls Overlaid */}
             <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
               
               {/* Timeline (Mock) */}
               <div className="w-full h-1.5 bg-white/30 rounded-full cursor-pointer relative">
                  <div className="absolute left-0 h-full bg-blue-500 rounded-full w-1/3"></div>
               </div>

               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="text-white hover:text-blue-400" onClick={togglePlay}>
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </Button>
                    <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1">
                      {[0.5, 1, 1.5].map(speed => (
                        <button 
                          key={speed}
                          onClick={() => changeSpeed(speed)}
                          className={`px-2 py-1 rounded text-xs font-bold ${playbackRate === speed ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'}`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                 </div>
                 
                 <div className="flex gap-2">
                    <Button onClick={() => toast('تم تحديد هذه اللحظة للمراجعة المتقدمة')} variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full bg-red-500/20 text-red-400">
                      <Mic className="w-5 h-5" />
                    </Button>
                    <Button onClick={() => toast('فتح محرر الرسم على الفيديو')} variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full bg-blue-500/20 text-blue-400">
                      <Pencil className="w-5 h-5" />
                    </Button>
                 </div>
               </div>
             </div>
          </Card>

          {/* RATING & FEEDBACK PANEL */}
          <Card className="bg-white border-slate-200 shadow-sm flex-1 flex flex-col">
             <CardContent className="p-6 flex-1 flex flex-col gap-6">
                
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="text-xl font-bold flex items-center gap-2"><PlaySquare className="w-5 h-5 text-blue-600" /> تقييم الأداء النهائي</h3>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-md">
                    {rating}%
                  </div>
                </div>

                <div className="space-y-4">
                   <div className="flex justify-between items-center text-sm font-bold text-slate-500 px-2">
                     <span>مستوى الإتقان (1-100)</span>
                   </div>
                   <Slider defaultValue={[85]} max={100} step={1} onValueChange={setRating} className="cursor-pointer" />
                </div>

                <div className="flex-1 mt-2">
                   <textarea 
                     className="w-full h-full min-h-[100px] resize-none border border-slate-200 rounded-xl p-4 bg-slate-50 font-medium text-slate-700 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                     placeholder="الملاحظات والتوصيات الحركية المرفقة للتقييم..."
                   ></textarea>
                </div>

                <Button onClick={() => toast.success('تم إرسال التقييم للمتدرب بنجاح!')} className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg rounded-xl shadow-md">
                   <Send className="w-5 h-5 ml-2" /> إرسال التقييم للمتدرب
                </Button>
             </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
