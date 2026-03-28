import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, PlayCircle, Send, CheckCircle2, Dumbbell, Brain, Activity, HeartPulse, Video as VideoIcon, ListStart, UploadCloud, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { db } from '@/lib/mockDatabase';

const MOCK_EXERCISES = [
  // Motor
  { id: 1, title: 'تمرين التوازن - ثبات الشجرة', category: 'motor', goal: 'توازن', level: 'ابتدائي', duration: '5 دقائق', bg: 'bg-emerald-100', icon: Dumbbell, color: 'text-emerald-600',
    demoImages: ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80'],
    instructions: ['قف مستقيماً مع ضم القدمين.', 'ارفع الركبة اليمنى ببطء إلى مستوى الخصر.', 'افتح الذراعين للجانبين للحفاظ على التوازن.', 'اثبت على هذه الوضعية لمدة 10 ثوانٍ، ثم كرر للقدم الأخرى.'] },
  { id: 2, title: 'الجري السريع بالمكان', category: 'motor', goal: 'لياقة بدنية', level: 'متوسط', duration: '10 دقائق', bg: 'bg-emerald-100', icon: Dumbbell, color: 'text-emerald-600',
    demoImages: ['https://images.unsplash.com/photo-1552674605-1a89c3ab2a60?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80'],
    instructions: ['حافظ على استقامة الظهر والنظر للأمام.', 'ابدأ بالجري في نفس المكان مع رفع الركبتين عالياً.', 'حرك الذراعين بشكل عكسي مع حركة القدمين.', 'استمر لمدة دقيقة متواصلة ثم استرح 30 ثانية.'] },
  { id: 3, title: 'القفز الجانبي (Agility)', category: 'motor', goal: 'سرعة رد فعل', level: 'ثانوي', duration: '7 دقائق', bg: 'bg-emerald-100', icon: Dumbbell, color: 'text-emerald-600',
    demoImages: ['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80'],
    instructions: ['ضع خطاً وهمياً على الأرض.', 'اقفز بكلتا القدمين معاً للجانب الأيمن من الخط.', 'اقفز فوراً للجانب الأيسر بدون توقف.', 'كرر الحركة بأسرع ما يمكن لمدة 45 ثانية.'] },
  { id: 4, title: 'تمارين الضغط للمستوى المبتدئ', category: 'motor', goal: 'قوة بدنية', level: 'تأهيلي', duration: '15 دقيقة', bg: 'bg-emerald-100', icon: Dumbbell, color: 'text-emerald-600',
    demoImages: ['https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80'],
    instructions: ['استند على ركبتيك ويديك على الأرض.', 'اجعل اليدين باتساع الصدر والظهر مستقيماً.', 'انزل بصدرك ببطء نحو الأرض حتى يقترب منها.', 'ادفع جسمك للأعلى للعودة لوضع البداية.'] },
  
  // Cognitive
  { id: 5, title: 'عصب الذهن - لعبة الألوان المطابقة', category: 'cognitive', goal: 'تذكر مرئي', level: 'ابتدائي', duration: '5 دقائق', bg: 'bg-blue-100', icon: Brain, color: 'text-blue-600',
    demoImages: ['https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80'], 
    instructions: ['ستظهر لك مجموعة من المربعات الملونة لبضع ثوانٍ.', 'حاول حفظ ترتيب الألوان في عقلك.', 'عند اختفاء الألوان، انقر على المربعات بالتسلسل الصحيح.', 'تزداد الصعوبة مع كل مرحلة تتجاوزها.'] },
  { id: 6, title: 'الذاكرة المكانية - مربعات التركيز', category: 'cognitive', goal: 'تركيز', level: 'متوسط', duration: '10 دقائق', bg: 'bg-blue-100', icon: Brain, color: 'text-blue-600',
    demoImages: ['https://images.unsplash.com/photo-1614036634955-ae5e90f23a31?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1633534570077-e61a4f0b2f54?auto=format&fit=crop&w=800&q=80'],
    instructions: ['راقب الشاشة بدقة لمتابعة النمط الذي سيظهر.', 'سيتم تظليل بعض المربعات وتعود لوضعها المخفي.', 'أعد اختيار نفس المربعات لتأكيد مهارتك في الحفظ المكاني.'] },
  { id: 7, title: 'تمرين التوافق الحركي/البصري', category: 'cognitive', goal: 'توافق عصبي', level: 'ثانوي', duration: '15 دقيقة', bg: 'bg-blue-100', icon: Brain, color: 'text-blue-600',
    demoImages: ['https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?auto=format&fit=crop&w=800&q=80'],
    instructions: ['قف أمام الكاميرا وانتظر الدوائر التفاعلية.', 'عندما تظهر الدائرة الحمراء، المسها بيدك اليمنى.', 'عندما تظهر الدائرة الزرقاء، المسها بيدك اليسرى.', 'احرص على الاستجابة سريعاً قبل اختفاء الدائرة.'] },

  // Psychological
  { id: 8, title: 'التنفس الصندوقي (4-4-4-4) للهدوء', category: 'psychological', goal: 'خفض التوتر', level: 'متنوع', duration: '5 دقائق', bg: 'bg-purple-100', icon: HeartPulse, color: 'text-purple-600',
    demoImages: ['https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1545389336-eaee37b6ab3d?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=800&q=80'],
    instructions: ['اجلس في وضع مريح وأغلق عينيك.', 'استنشق الهواء ببطء من أنفك لمدة 4 ثوانٍ.', 'احبس أنفاسك بهدوء لمدة 4 ثوانٍ.', 'ازفر الهواء ببطء من فمك لمدة 4 ثوانٍ.', 'انتظر 4 ثوانٍ قبل أخذ النفس التالي، وكرر الدورة.'] },
  { id: 9, title: 'التأمل الذهني الموجه (Mindfulness)', category: 'psychological', goal: 'استرخاء', level: 'متوسط', duration: '15 دقيقة', bg: 'bg-purple-100', icon: HeartPulse, color: 'text-purple-600',
    demoImages: ['https://images.unsplash.com/photo-1518241353330-0f7941c2d1b5?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1447452001602-7090c7bf2ce3?auto=format&fit=crop&w=800&q=80'],
    instructions: ['اختر مكاناً هادئاً وابحث عن الاسترخاء الجسدي التام.', 'استمع جيداً للتعليمات الصوتية المرفقة وركز فقط على صوت المرشد.', 'إذا شرد ذهنك، أعد تركيزك بلطف إلى أنفاسك.', 'استمر حتى يخبرك المرشد بنهاية الجلسة.'] },
  { id: 10, title: 'تحليل وتقييم الضغط النفسي', category: 'psychological', goal: 'قياس نفسي', level: 'ثانوي', duration: '10 دقائق', bg: 'bg-purple-100', icon: HeartPulse, color: 'text-purple-600',
    demoImages: ['https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80'],
    instructions: ['سيطلب منك النظام الإجابة على 10 أسئلة سيكولوجية سريعة.', 'أجب بصراحة تامة عن شعورك خلال الأسبوعين الماضيين.', 'لا تفكر كثيراً في الإجابات، حدد الخيار الأقرب لشعورك الأول.'] },

  // Rehab
  { id: 11, title: 'إطالة الكاحل ما بعد الإصابة', category: 'rehab', goal: 'مرونة مفاصل', level: 'علاجي', duration: '10 دقائق', bg: 'bg-orange-100', icon: Activity, color: 'text-orange-600',
    demoImages: ['https://images.unsplash.com/photo-1552674605-1a89c3ab2a60?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80'],
    instructions: ['اجلس على الأرض مع فرد الساق المصابة.', 'استخدم منشفة ولفها حول الجزء الأمامي من القدم.', 'اسحب المنشفة نحوك بلطف حتى تشعر بشد في الكاحل وتجاهل الألم الحاد.', 'اثبت لمدة 30 ثانية وكرر ذلك 3 مرات.'] },
  { id: 12, title: 'تأهيل مفصل الكتف - الدوران البطيء', category: 'rehab', goal: 'استعادة حركة', level: 'علاجي', duration: '15 دقيقة', bg: 'bg-orange-100', icon: Activity, color: 'text-orange-600',
    demoImages: ['https://images.unsplash.com/photo-1576678927484-a14ec7b8ea01?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80'],
    instructions: ['قف وانحنِ للأمام قليلاً داعماً نفسك بيدك السليمة على الطاولة.', 'اسمح لذراعك المصابة بالتدلي بحرية نحو الأرض.', 'ابدأ في تحريك الذراع في دوائر صغيرة جداً كالبندول ببطء تام.', 'قم بعمل 10 دوائر مع عقارب الساعة و10 عكسها دون إجبار المفصل.'] },
  { id: 13, title: 'تقوية الركبة الأمامية (Isometrics)', category: 'rehab', goal: 'تقوية عضلية', level: 'علاجي', duration: '20 دقيقة', bg: 'bg-orange-100', icon: Activity, color: 'text-orange-600',
    demoImages: ['https://images.unsplash.com/photo-1571019613589-9a706b88bdf2?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80'],
    instructions: ['استلقِ على ظهرك مع الحفاظ على استقامة الركبة بالكامل.', 'ضع منشفة صغيرة مبرومة أسفل الركبة للمسند.', 'شد عضلة الفخذ الأمامية بقوة لدفع الركبة للأسفل نحو المنشفة.', 'اثبت لمدة 5 ثوانٍ واسترح، كرر التمرين 15 مرة.'] },
];

export function TeacherExerciseManager() {
  const [activeExercise, setActiveExercise] = useState(MOCK_EXERCISES[0]);
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'motor' | 'cognitive' | 'psychological' | 'rehab'>('all');
  const [targetStudent, setTargetStudent] = useState('الطالب الحالي'); // Locked to current mock student for testing
  const [additionalNote, setAdditionalNote] = useState('');

  // Upload Logic
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedBlob, setUploadedBlob] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Custom Video Player State
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [durationStr, setDurationStr] = useState("00:00 / 00:00");
  const SLIDESHOW_DURATION = 6000; // 6 seconds total for a slideshow cycle

  useEffect(() => {
    // Reset video state & uploads when active exercise changes
    setUploadedBlob(null);
    setPreviewUrl(null);
    setIsPlaying(false);
    setProgress(0);
    setDurationStr("00:00 / 00:00");
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [activeExercise]);

  useEffect(() => {
    // Simulated video playback for Slideshows
    let interval: NodeJS.Timeout;
    if (isPlaying && !previewUrl) {
      interval = setInterval(() => {
        setProgress(p => {
          const newProgress = p + (100 / (SLIDESHOW_DURATION / 100)); // Advance progress string every 100ms
          if (newProgress >= 100) {
            setIsPlaying(false); // End of "video"
            return 0; // Reset for next play
          }
          return newProgress;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, previewUrl]);

  useEffect(() => {
     if (isPlaying && !previewUrl) {
       const totalSeconds = SLIDESHOW_DURATION / 1000;
       const currentSeconds = Math.min(Math.floor((progress / 100) * totalSeconds), totalSeconds);
       const pad = (num: number) => num.toString().padStart(2, '0');
       const curMins = pad(Math.floor(currentSeconds / 60));
       const curSecs = pad(Math.floor(currentSeconds % 60));
       const durMins = pad(Math.floor(totalSeconds / 60));
       const durSecs = pad(Math.floor(totalSeconds % 60));
       setDurationStr(`${curMins}:${curSecs} / ${durMins}:${durSecs}`);
     }
  }, [progress, isPlaying, previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setUploadedBlob(file);
      setPreviewUrl(URL.createObjectURL(file));
      setIsPlaying(false);
      setProgress(0);
      if (videoRef.current) videoRef.current.load();
      toast({
        title: "تم إدراج مقطعك التوضيحي السري",
        description: "سيتم إرسال هذا المقطع الخاص بدلاً من المشهد الافتراضي.",
        className: "bg-blue-50 border-blue-200"
      });
    }
  };

  const togglePlay = () => {
    if (previewUrl && videoRef.current) {
       // Real Video Playing
       if (isPlaying) videoRef.current.pause();
       else videoRef.current.play().catch(e => console.error("Playback restriction: ", e));
    } else {
      // Slideshow simulation
      if (isPlaying) {
        // Pause slideshow
        setProgress(0); // Reset progress on pause for slideshow
      } else {
        // Start slideshow
        setProgress(0); // Ensure it starts from beginning
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current || !previewUrl) return; // Only for real videos
    const cur = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 1;
    setProgress((cur / dur) * 100);

    const pad = (num: number) => num.toString().padStart(2, '0');
    const curMins = pad(Math.floor(cur / 60));
    const curSecs = pad(Math.floor(cur % 60));
    const durMins = pad(Math.floor(dur / 60));
    const durSecs = pad(Math.floor(dur % 60));
    setDurationStr(`${curMins}:${curSecs} / ${durMins}:${durSecs}`);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const percentage = Math.max(0, Math.min(100, (x / bounds.width) * 100));
    
    setProgress(percentage);
    if (previewUrl && videoRef.current) {
      videoRef.current.currentTime = (percentage / 100) * (videoRef.current.duration || 1);
    } else {
      // For slideshow, if clicked, we can jump to a specific "frame"
      // If slideshow is paused, clicking should not start it.
      // If slideshow is playing, clicking should jump to that point.
      // For simplicity, we'll just update progress, and the useEffect will continue from there if playing.
    }
  };

  const filteredExercises = MOCK_EXERCISES.filter(ex => {
    const matchesSearch = ex.title.toLowerCase().includes(searchQuery.toLowerCase()) || ex.goal.includes(searchQuery);
    const matchesTab = activeTab === 'all' || ex.category === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleSend = async () => {
    setIsSending(true);
    try {
      // Create a REAL record in the global mock database
      await db.saveSubmission({
        id: `assigned-task-${Date.now()}`,
        studentName: targetStudent, // Hardcoded to الطالب الحالي will instantly show on Student Dashboard!
        exerciseName: activeExercise.title,
        exerciseType: activeExercise.category as any,
        date: new Date().toISOString(),
        status: 'pending',
        videoBlob: null,
        note: additionalNote,
        demoImages: uploadedBlob ? undefined : activeExercise.demoImages, // Pass the array 
        demoVideoBlob: uploadedBlob,
        exerciseInstructions: activeExercise.instructions
      });

      toast({
        title: "تم الإرسال بنظام التكليف الحي! ✅",
        description: `تم إرسال تكليف (${activeExercise.title}) لـ ${targetStudent}. سيظهر فوراً في الإشعارات والمهام الخاصة به.`,
        duration: 5000,
        className: "bg-green-50 border-green-200"
      });
      
      setAdditionalNote('');
    } catch (e) {
      console.error(e);
      toast({ title: "حدث خطأ أثناء الإرسال", variant: "destructive" });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto p-6 md:p-10 flex flex-col lg:flex-row gap-8 bg-slate-50 min-h-full font-sans">
      
      {/* LEFT COLUMN: EXERCISE LIBRARY (60%) */}
      <div className="w-full lg:w-3/5 flex flex-col gap-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Dumbbell className="w-8 h-8 text-blue-600" />
            مكتبة المناهج والتمارين المركزية
          </h2>
          <p className="text-base font-bold text-slate-500 mt-2">محرك مركزي متصل مباشرة مع حاسبات الطلاب ومهامهم.</p>
        </div>

        {/* TABS & FILTERS */}
        <div className="flex flex-col gap-4">
          <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 overflow-x-auto custom-scrollbar">
            {[
              { id: 'all', label: 'الكل' },
              { id: 'motor', label: 'حركي / رياضي' },
              { id: 'cognitive', label: 'معرفي / ذهني' },
              { id: 'psychological', label: 'نفسي / وقائي' },
              { id: 'rehab', label: 'تأهيل علاجي' }
            ].map(tab => (
              <Button 
                key={tab.id}
                variant="ghost" 
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 rounded-xl text-sm font-bold h-12 transition-all shrink-0 ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          <div className="relative w-full">
            <Search className="w-5 h-5 absolute right-4 top-4 text-slate-400" />
            <Input 
              className="pr-12 h-14 text-base font-bold bg-white border-slate-200 placeholder:text-slate-400 rounded-2xl shadow-sm focus-visible:ring-blue-500 focus-visible:ring-2 border-2" 
              placeholder="ابحث عن تمرين بمسمى أو هدف حيوي..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* EXERCISES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-5 overflow-y-auto max-h-[700px] pr-2 pb-10 custom-scrollbar">
          {filteredExercises.length === 0 && (
             <div className="col-span-1 border-2 border-dashed border-slate-200 rounded-3xl p-10 flex flex-col items-center justify-center text-slate-500 w-full bg-white">
                <Dumbbell className="w-12 h-12 mb-4 text-slate-300" />
                <span className="text-lg font-bold text-center">لا توجد تمارين تطابق هذا البحث</span>
             </div>
          )}
          {filteredExercises.map(exercise => {
            const Icon = exercise.icon;
            return (
              <Card 
                key={exercise.id} 
                className={`cursor-pointer transition-all border-2 overflow-hidden rounded-3xl group ${
                  activeExercise.id === exercise.id 
                    ? 'border-blue-600 shadow-xl ring-4 ring-blue-600/10 scale-[1.02] bg-white' 
                    : 'border-slate-200 hover:border-blue-400 shadow-sm bg-white'
                }`}
                onClick={() => setActiveExercise(exercise)}
              >
                <div className={`h-32 ${exercise.bg} flex items-center justify-center relative overflow-hidden transition-colors`}>
                   <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                   <Icon className={`w-14 h-14 ${exercise.color} transform group-hover:scale-110 transition-transform drop-shadow-sm`} />
                   <Badge className="absolute top-4 right-4 bg-white/80 text-slate-800 border-none font-bold backdrop-blur-md shadow-sm">
                      {exercise.category === 'motor' ? 'حركي' : exercise.category === 'cognitive' ? 'ذهني' : exercise.category === 'psychological' ? 'نفسي' : 'تأهيل'}
                   </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-black text-slate-900 mb-3 leading-snug">{exercise.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-slate-50 text-slate-700 text-xs font-bold px-3 py-1 border-slate-200">{exercise.goal}</Badge>
                    <Badge variant="outline" className="bg-slate-50 text-slate-700 text-xs font-bold px-3 py-1 border-slate-200">{exercise.level}</Badge>
                    <Badge variant="outline" className="bg-slate-50 text-blue-700 text-xs font-bold px-3 py-1 border-blue-100">{exercise.duration}</Badge>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* RIGHT COLUMN: EXERCISE DETAILS & SEND FORM (40%) */}
      <div className="w-full lg:w-2/5 flex flex-col gap-6">
        
        {/* TUTORIAL & INSTRUCTIONS PANEL (World-Class Feature) */}
        <div className="bg-white border-2 border-slate-200 rounded-[2rem] p-6 shadow-xl flex flex-col gap-5 overflow-hidden">
          {/* Video Player Header */}
          <div className="flex flex-col gap-3">
             <div className="flex items-center justify-between">
               <h3 className="text-2xl font-black text-slate-900 leading-tight flex items-center gap-2">
                  <PlayCircle className="w-7 h-7 text-blue-600" />
                  {activeExercise.title}
               </h3>
               <Badge className="bg-blue-50 text-blue-700 border-none font-bold px-3 py-1 shrink-0">{activeExercise.duration}</Badge>
             </div>
             <p className="text-slate-500 font-bold text-sm">يحتوي هذا التمرين على شرح مرئي وتوجيهات أداء دقيقة ليتم شحنها للتلميذ.</p>
          </div>

          {/* Custom File Upload Button */}
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-2 transition-all hover:bg-slate-100">
             <div className="flex flex-col">
                <span className="text-sm font-black text-slate-800 flex items-center gap-1.5"><UploadCloud className="w-4 h-4 text-blue-600" /> إرفاق مقطع توضيحي خاص بك</span>
                <span className="text-xs font-bold text-slate-500 mt-1 max-w-[200px] leading-tight">اضغط لاستبدال المقطع الافتراضي بفيديو مصور خصيصاً لتلميذك.</span>
             </div>
             <input type="file" accept="video/mp4,video/mkv,video/mov,video/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
             {uploadedBlob ? (
                <Button variant="outline" className="h-10 border-red-200 text-red-700 bg-red-50 hover:bg-red-100 font-bold px-4 rounded-xl shrink-0" onClick={() => { setUploadedBlob(null); setPreviewUrl(null); }}>
                   إلغاء المرفق <X className="w-4 h-4 mr-1" />
                </Button>
             ) : (
                <Button variant="outline" className="h-10 border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 shadow-sm font-bold px-4 rounded-xl shrink-0" onClick={() => fileInputRef.current?.click()}>
                   اختر ملفاً
                </Button>
             )}
          </div>

          {/* Real Video Player / Slideshow Component */}
          <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-inner group cursor-pointer" onClick={togglePlay}>
            {previewUrl ? (
              <video 
                ref={videoRef}
                key={previewUrl} // force reload on source change
                src={previewUrl}
                className={`w-full h-full object-cover transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-70 group-hover:opacity-90'}`}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
                playsInline
              />
            ) : (
               // Image Slideshow simulation
               <div className={`w-full h-full relative transition-opacity duration-300 ${isPlaying ? 'opacity-100' : 'opacity-70 group-hover:opacity-90'}`}>
                 {activeExercise.demoImages?.map((imgStr, idx) => {
                   // Calculate which image to show based on progress
                   const currentActiveIndex = Math.floor((progress / 100) * (activeExercise.demoImages?.length || 1));
                   const showSlide = Math.min(activeExercise.demoImages!.length - 1, currentActiveIndex) === idx;
                   return (
                     <img 
                       key={imgStr} 
                       src={imgStr} 
                       alt="Exercise step" 
                       className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${showSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                     />
                   );
                 })}
               </div>
            )}
            
            {/* Player Overlay controls simulation */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4 transition-opacity duration-300 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
               <div className="flex items-center gap-3 w-full" onClick={e => e.stopPropagation()}>
                  <button onClick={togglePlay} className="focus:outline-none">
                     <PlayCircle className={`w-8 h-8 text-white hover:text-blue-400 cursor-pointer shadow-black/50 drop-shadow-md ${isPlaying ? 'fill-white/20' : ''}`} />
                  </button>
                  <div className="h-2 bg-white/30 rounded-full flex-1 overflow-hidden cursor-pointer" onClick={handleProgressClick}>
                     <div className="h-full bg-blue-500 transition-all relative" style={{ width: `${Math.max(0, progress)}%` }}></div>
                  </div>
                  <span className="text-white text-xs font-bold font-mono min-w-[80px] text-right">{durationStr}</span>
               </div>
            </div>
            
            {/* Play Button Overlay (when paused) */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-16 h-16 bg-blue-600/90 rounded-full flex items-center justify-center text-white shadow-xl backdrop-blur-sm pl-1">
                   <PlayCircle className="w-10 h-10" />
                </div>
              </div>
            )}

            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20 flex items-center gap-2">
               <VideoIcon className="w-4 h-4 text-emerald-400" />
               <span className="text-white text-xs font-bold leading-none">
                  {uploadedBlob ? 'مقطع مُدرج حصري للتلميذ 🔒' : `شرح مرئي (${activeExercise.category === 'motor' ? 'حركي' : activeExercise.category === 'rehab' ? 'علاجي' : activeExercise.category === 'psychological' ? 'نفسي' : 'معرفي'})`}
               </span>
            </div>
          </div>

          {/* Execution Instructions Display */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
             <h4 className="text-base font-black text-slate-900 mb-3 block flex items-center gap-2">
               <ListStart className="w-5 h-5 text-slate-500" />
               كيفية الأداء (الخطوات التطبيقية):
             </h4>
             <ul className="flex flex-col gap-3">
               {activeExercise.instructions.map((step, idx) => (
                 <li key={idx} className="flex gap-3 text-sm font-bold text-slate-700 leading-snug items-start">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-black text-xs shadow-sm shadow-blue-200/50">{idx + 1}</span>
                    <span className="pt-1">{step}</span>
                 </li>
               ))}
             </ul>
          </div>
        </div>

        {/* ASSIGNMENT FORM */}
        <div className="sticky top-10 bg-white border-2 border-slate-200 rounded-[2rem] p-6 shadow-xl flex flex-col gap-5">
          <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
            <label className="text-sm font-black text-blue-800 uppercase tracking-widest mb-3 block flex items-center gap-2">
               <CheckCircle2 className="w-4 h-4" /> إسناد إجباري إلى:
            </label>
            <select 
              value={targetStudent}
              onChange={(e) => setTargetStudent(e.target.value)}
              className="w-full h-12 border-2 border-blue-200 rounded-xl px-4 bg-white text-base font-black text-blue-900 outline-none focus:ring-4 focus:ring-blue-100 cursor-pointer shadow-sm"
            >
              <option value="الطالب الحالي">الطالب الحالي (مزامنة مباشرة للمنصة)</option>
              <option value="كامل القسم 3-أ">كامل القسم 3-أ</option>
              <option value="مجموعة الاستدراك">مجموعة الاستدراك</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-black text-slate-500 uppercase tracking-widest mb-2 block ml-2">ملاحظة أستاذ ملحقة (اختياري)</label>
            <textarea 
              value={additionalNote}
              onChange={(e) => setAdditionalNote(e.target.value)}
              className="w-full border-2 border-slate-200 rounded-2xl p-4 bg-slate-50 text-base font-bold text-slate-800 outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-400 resize-none h-24 shadow-inner placeholder:text-slate-400 placeholder:font-medium transition-all"
              placeholder="اكتب التوجيهات الإضافية هنا..."
            ></textarea>
          </div>

          <Button 
            onClick={handleSend} 
            disabled={isSending}
            className="w-full bg-slate-900 text-white hover:bg-slate-800 h-16 text-xl font-black gap-3 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 overflow-hidden relative group"
          >
            {isSending ? (
              <span className="flex items-center gap-3"><CheckCircle2 className="w-7 h-7 animate-pulse text-blue-400"/> جاري التشفير والإرسال...</span>
            ) : (
              <>
                <Send className="w-6 h-6 ml-1 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                تكليف وإرسال مع الفيديو الإيضاحي
              </>
            )}

            {!isSending && (
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 z-0"></div>
            )}
          </Button>

        </div>
      </div>

    </div>
  );
}
