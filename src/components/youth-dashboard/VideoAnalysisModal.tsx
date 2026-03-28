import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Upload, Video, Play, CheckCircle2, AlertTriangle,
    BarChart3, Zap, Activity, Target, Eye, Layers,
    TrendingUp, Clock, ChevronRight, Sparkles, RotateCcw,
    Download, Share2, Camera, Brain, ArrowUp, ArrowDown, Minus, FlipHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface VideoAnalysisModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Mode = 'choose' | 'upload' | 'camera' | 'analyzing' | 'results';

const analysisCategories = [
    { key: 'posture', label: 'وضعية الجسم', icon: Activity, color: 'bg-blue-100 text-blue-600' },
    { key: 'joints', label: 'زوايا المفاصل', icon: Layers, color: 'bg-purple-100 text-purple-600' },
    { key: 'balance', label: 'التوازن', icon: Target, color: 'bg-emerald-100 text-emerald-600' },
    { key: 'tempo', label: 'الإيقاع والسرعة', icon: Zap, color: 'bg-orange-100 text-orange-600' },
    { key: 'form', label: 'جودة الأداء', icon: Eye, color: 'bg-teal-100 text-teal-600' },
    { key: 'injury', label: 'مؤشر الإصابة', icon: AlertTriangle, color: 'bg-red-100 text-red-600' },
];

const mockResults = {
    overallScore: 78,
    grade: 'B+',
    summary: 'أداء جيد مع الحاجة لتحسين زاوية الركبة في مرحلة النزول وتقوية عضلات الجذع.',
    metrics: [
        { key: 'posture', label: 'وضعية الجسم', score: 82, trend: 'up', note: 'العمود الفقري في وضع محايد جيد مع انحراف طفيف في الكتف الأيسر' },
        { key: 'joints', label: 'زوايا المفاصل', score: 75, trend: 'same', note: 'زاوية الورك ممتازة (95°). زاوية الركبة تحتاج تعديل: 112° بدلاً من 90°' },
        { key: 'balance', label: 'التوازن', score: 80, trend: 'up', note: 'توزيع الوزن متوازن 52%-48%. تحسن عن الجلسة السابقة' },
        { key: 'tempo', label: 'الإيقاع والسرعة', score: 70, trend: 'down', note: 'سرعة النزول مرتفعة (0.8 ثانية). الموصى به: 2-3 ثانية' },
        { key: 'form', label: 'جودة الأداء', score: 85, trend: 'up', note: 'اتساق التكرارات ممتاز — 95% في النطاق الصحيح' },
        { key: 'injury', label: 'مؤشر الإصابة', score: 88, trend: 'up', note: 'خطر إصابة منخفض جداً. لا توجد إجهاد مفرط' },
    ],
    keyFrames: [
        { time: '0:03', issue: 'جيد — وضعية البداية ممتازة', type: 'good' },
        { time: '0:07', issue: 'تنبيه — الركبة تتجاوز أصابع القدم', type: 'warning' },
        { time: '0:11', issue: 'جيد — قمة حركة الورك صحيحة', type: 'good' },
        { time: '0:15', issue: 'خطأ — إيقاع النزول سريع جداً', type: 'error' },
        { time: '0:22', issue: 'جيد — عودة سلسة للوضع الأولي', type: 'good' },
    ],
    bodyErrors: [
        { zone: 'الركبة اليسرى', desc: 'تتجاوز خط الإصبع — اخفض الوركين أكثر', severity: 'warning', x: '38%', y: '62%' },
        { zone: 'أسفل الظهر', desc: 'انحناء طفيف للخلف — شد البطن للداخل', severity: 'info', x: '50%', y: '40%' },
    ],
    coachSuggestions: [
        'ابطئ مرحلة النزول: عدّ لـ 3 ثوانٍ أثناء الهبوط',
        'اعمل على إبقاء الركبتين خلف أصابع القدم في كل تكرار',
        'ركّز على تقوية عضلات الجذع بـ 5 دقائق بلانك يومياً',
        'أضف حزام مقاومة حول الركبتين لتحسين التنشيط العضلي',
    ],
};

function ScoreRing({ score, grade }: { score: number; grade: string }) {
    const radius = 52;
    const circ = 2 * Math.PI * radius;
    const offset = circ - (score / 100) * circ;
    const color = score >= 80 ? '#22c55e' : score >= 65 ? '#f97316' : '#ef4444';
    return (
        <div className="relative w-32 h-32 mx-auto">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="8" />
                <motion.circle
                    cx="60" cy="60" r={radius} fill="none"
                    stroke={color} strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={circ} strokeDashoffset={circ}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-900">{score}</span>
                <span className="text-sm font-black" style={{ color }}>{grade}</span>
            </div>
        </div>
    );
}

export function VideoAnalysisModal({ isOpen, onClose }: VideoAnalysisModalProps) {
    const [mode, setMode] = useState<Mode>('choose');
    const [progress, setProgress] = useState(0);
    const [progressLabel, setProgressLabel] = useState('');
    const [dragOver, setDragOver] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [showOverlay, setShowOverlay] = useState(true);
    const [activeMetric, setActiveMetric] = useState<string | null>(null);
    const [cameraOn, setCameraOn] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        if (!isOpen) {
            setMode('choose');
            setProgress(0);
            setFileName(null);
            setVideoUrl(null);
            setActiveMetric(null);
            stopCamera();
        }
    }, [isOpen]);

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
        setCameraOn(false);
    };

    const openCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            streamRef.current = stream;
            setCameraOn(true);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
        } catch {
            // permission denied — show fallback
        }
    };

    const runAnalysis = () => {
        setMode('analyzing');
        const steps: [number, string][] = [
            [10, 'استخراج الإطارات…'],
            [25, 'تحديد نقاط الهيكل العظمي (33 نقطة)…'],
            [45, 'تحليل زوايا المفاصل…'],
            [60, 'تقييم التوازن والتناسق…'],
            [75, 'قياس الإيقاع والسرعة…'],
            [88, 'حساب مؤشر الإصابة…'],
            [100, 'توليد التقرير النهائي…'],
        ];
        let i = 0;
        const go = () => {
            if (i >= steps.length) { setTimeout(() => { stopCamera(); setMode('results'); }, 500); return; }
            const [p, l] = steps[i];
            setProgress(p); setProgressLabel(l);
            i++; setTimeout(go, 700);
        };
        go();
    };

    const handleFile = (file: File) => {
        if (!file.type.startsWith('video/')) return;
        setFileName(file.name);
        setVideoUrl(URL.createObjectURL(file));
    };

    const trendIcon = (t: string) =>
        t === 'up' ? <ArrowUp className="w-3 h-3 text-emerald-500" /> :
        t === 'down' ? <ArrowDown className="w-3 h-3 text-red-500" /> :
        <Minus className="w-3 h-3 text-slate-400" />;

    const scoreColor = (s: number) =>
        s >= 80 ? 'text-emerald-600 bg-emerald-50' : s >= 65 ? 'text-orange-600 bg-orange-50' : 'text-red-600 bg-red-50';

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/80 backdrop-blur-md" dir="rtl">
            <motion.div
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 80 }}
                className="bg-white w-full sm:max-w-2xl sm:rounded-[2.5rem] rounded-t-[2.5rem] shadow-2xl overflow-hidden h-[92vh] sm:h-[90vh] flex flex-col"
            >
                {/* Header */}
                <div className="bg-slate-900 px-6 py-5 flex items-center justify-between shrink-0 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                            <Video className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-white font-black text-lg leading-tight">تحليل الفيديو الذكي</h2>
                            <p className="text-slate-400 text-xs font-bold">رؤية حاسوبية + تتبع الهيكل العظمي</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors relative z-10">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Stage indicator */}
                {mode !== 'choose' && mode !== 'results' && (
                    <div className="flex items-center gap-0 px-6 py-3 bg-slate-50 border-b border-slate-100 shrink-0">
                        {['رفع / كاميرا', 'تحليل ذكي', 'النتائج'].map((s, i) => {
                            const stageMap = { 'upload': 0, 'camera': 0, 'analyzing': 1, 'results': 2 };
                            const idx = (stageMap as any)[mode] ?? 0;
                            return (
                                <React.Fragment key={s}>
                                    <div className={cn('flex items-center gap-1.5 text-xs font-black', i <= idx ? 'text-indigo-600' : 'text-slate-300')}>
                                        <div className={cn('w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black', i <= idx ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400')}>{i + 1}</div>
                                        {s}
                                    </div>
                                    {i < 2 && <div className={cn('flex-1 h-0.5 mx-2', i < idx ? 'bg-indigo-600' : 'bg-slate-200')} />}
                                </React.Fragment>
                            );
                        })}
                    </div>
                )}

                {/* Body */}
                <div className="flex-1 overflow-y-auto">

                    {/* ── CHOOSE MODE ── */}
                    {mode === 'choose' && (
                        <div className="p-6 space-y-5">
                            <div>
                                <h3 className="font-black text-slate-900 text-lg mb-1">كيف تريد التحليل؟</h3>
                                <p className="text-slate-500 text-sm font-medium">اختر طريقة لتحليل أداءك الحركي بالذكاء الاصطناعي</p>
                            </div>

                            {/* Mode cards */}
                            <div className="grid grid-cols-1 gap-4">
                                {/* Upload video */}
                                <button
                                    onClick={() => setMode('upload')}
                                    className="bg-white border-2 border-indigo-200 hover:border-indigo-400 rounded-2xl p-5 text-right transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-2xl shrink-0 group-hover:bg-indigo-200 transition-colors">
                                            📤
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-black text-slate-900 text-base">رفع فيديو مسجّل</h4>
                                            <p className="text-slate-500 text-sm font-medium mt-0.5">ارفع فيديو التمرين — يُعرض الفيديو ثم يُحلَّل</p>
                                            <div className="flex gap-2 mt-2">
                                                <span className="text-[10px] font-black bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg">MP4, MOV, AVI</span>
                                                <span className="text-[10px] font-black bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg">حتى 500 MB</span>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-indigo-400 group-hover:translate-x-[-4px] transition-transform" />
                                    </div>
                                </button>

                                {/* Live camera */}
                                <button
                                    onClick={() => { setMode('camera'); setTimeout(openCamera, 300); }}
                                    className="bg-white border-2 border-emerald-200 hover:border-emerald-400 rounded-2xl p-5 text-right transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-2xl shrink-0 group-hover:bg-emerald-200 transition-colors">
                                            🎥
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-black text-slate-900 text-base">تحليل مباشر بالكاميرا</h4>
                                            <p className="text-slate-500 text-sm font-medium mt-0.5">أنجز التمرين الآن — يُحلَّل جسمك في الوقت الحقيقي</p>
                                            <div className="flex gap-2 mt-2">
                                                <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-lg">لحظي</span>
                                                <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-lg">بدون رفع</span>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-[-4px] transition-transform" />
                                    </div>
                                </button>
                            </div>

                            {/* What AI analyzes */}
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                <p className="font-black text-slate-900 text-sm mb-3">🤖 ماذا يحلل الذكاء الاصطناعي؟</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {analysisCategories.map(c => (
                                        <div key={c.key} className="flex items-center gap-2">
                                            <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${c.color}`}>
                                                <c.icon className="w-3.5 h-3.5" />
                                            </div>
                                            <span className="text-slate-700 font-bold text-xs">{c.label}</span>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-slate-400 text-xs font-medium mt-3">يتتبع النظام 33 نقطة على هيكلك العظمي لقياس الزوايا والسرعة والتوازن.</p>
                            </div>
                        </div>
                    )}

                    {/* ── UPLOAD MODE ── */}
                    {mode === 'upload' && (
                        <div className="p-6 space-y-5">
                            <button onClick={() => setMode('choose')} className="text-slate-400 text-sm font-bold flex items-center gap-1 hover:text-slate-700">
                                ← العودة
                            </button>

                            {/* Drop zone */}
                            <div
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
                                onClick={() => fileRef.current?.click()}
                                className={cn(
                                    'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all',
                                    dragOver ? 'border-indigo-400 bg-indigo-50' :
                                    videoUrl ? 'border-emerald-400 bg-emerald-50' :
                                    'border-slate-200 bg-slate-50 hover:border-indigo-300'
                                )}
                            >
                                {videoUrl ? (
                                    <>
                                        <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                                        <p className="font-black text-emerald-700">{fileName}</p>
                                        <p className="text-emerald-600 text-sm font-bold mt-0.5">تم تحميل الفيديو ✓</p>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                                        <p className="font-black text-slate-700">اسحب الفيديو هنا أو اضغط</p>
                                        <p className="text-slate-400 text-sm font-medium mt-1">MP4, MOV, AVI · حتى 500 MB</p>
                                    </>
                                )}
                                <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
                            </div>

                            {/* Video preview with overlay */}
                            {videoUrl && (
                                <div className="bg-slate-900 rounded-2xl overflow-hidden relative">
                                    <video
                                        src={videoUrl}
                                        controls
                                        className="w-full max-h-64 object-contain"
                                        style={{ background: '#000' }}
                                    />
                                    {/* Skeleton overlay demo */}
                                    {showOverlay && (
                                        <div className="absolute inset-0 pointer-events-none">
                                            <svg className="w-full h-full opacity-80" viewBox="0 0 400 250">
                                                {[[200,30],[200,90],[170,90],[145,150],[125,210],[175,210],[230,90],[255,150],[275,210],[225,210],[200,155],[190,210],[210,210]].map(([x,y],i) => (
                                                    <motion.circle key={i} cx={x} cy={y} r={5}
                                                        fill={i === 3 || i === 6 ? '#f97316' : '#22c55e'}
                                                        animate={{ opacity: [0.5,1,0.5] }}
                                                        transition={{ duration: 2, delay: i*0.1, repeat: Infinity }}
                                                    />
                                                ))}
                                                {[[200,30,200,90],[200,90,170,90],[170,90,145,150],[145,150,125,210],[145,150,175,210],[200,90,230,90],[230,90,255,150],[255,150,275,210],[255,150,225,210],[200,90,200,155],[200,155,190,210],[200,155,210,210]].map(([x1,y1,x2,y2],i) => (
                                                    <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#22c55e" strokeWidth="1.5" opacity="0.5" />
                                                ))}
                                            </svg>
                                            {/* Error labels */}
                                            {mockResults.bodyErrors.map((err, i) => (
                                                <motion.div key={i}
                                                    style={{ position: 'absolute', top: err.y, right: err.x }}
                                                    animate={{ opacity: [0.7, 1, 0.7] }}
                                                    transition={{ duration: 1.5, delay: i * 0.5, repeat: Infinity }}
                                                    className={cn('text-[9px] font-black px-2 py-1 rounded-lg pointer-events-none', err.severity === 'warning' ? 'bg-orange-500/90 text-white' : 'bg-blue-500/90 text-white')}
                                                >
                                                    {err.zone}
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="absolute top-2 left-2 flex gap-2">
                                        <button
                                            onClick={() => setShowOverlay(o => !o)}
                                            className="bg-white/20 hover:bg-white/30 text-white text-[10px] font-black px-2.5 py-1.5 rounded-xl backdrop-blur-sm transition-colors"
                                        >
                                            {showOverlay ? '🦴 إخفاء التحليل' : '🦴 إظهار التحليل'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {videoUrl && (
                                <div className="bg-indigo-50 rounded-2xl p-3 border border-indigo-100 flex gap-2">
                                    <Brain className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                                    <p className="text-indigo-700 text-xs font-bold leading-relaxed">
                                        يمكنك رؤية تحليل الهيكل العظمي فوق الفيديو — النقاط البرتقالية تدل على مناطق تحتاج تصحيح.
                                    </p>
                                </div>
                            )}

                            <Button
                                onClick={runAnalysis}
                                disabled={!videoUrl}
                                className="w-full h-14 rounded-2xl font-black text-base bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30 disabled:opacity-40"
                            >
                                <Sparkles className="w-5 h-5 ml-2" /> بدء التحليل الذكي
                            </Button>
                        </div>
                    )}

                    {/* ── LIVE CAMERA MODE ── */}
                    {mode === 'camera' && (
                        <div className="p-6 space-y-4">
                            <button onClick={() => { setMode('choose'); stopCamera(); }} className="text-slate-400 text-sm font-bold flex items-center gap-1 hover:text-slate-700">
                                ← العودة
                            </button>

                            {/* Info steps */}
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                <p className="font-black text-slate-900 text-sm mb-3">📋 كيفية التحليل المباشر</p>
                                <div className="space-y-2">
                                    {[
                                        { emoji: '📏', text: 'قف على بعد 2 متر من الكاميرا — يجب أن يكون جسمك كله مرئياً' },
                                        { emoji: '💡', text: 'تأكد من إضاءة جيدة أمامك — تجنب الخلفية المضيئة' },
                                        { emoji: '🦴', text: 'ستظهر نقاط ملوّنة على جسمك — خضراء = صحيح، برتقالية = يحتاج تعديل' },
                                        { emoji: '⚡', text: 'ابدأ التمرين وسيتتبع النظام حركتك مباشرة ويعطيك ملاحظات صوتية' },
                                    ].map((s, i) => (
                                        <div key={i} className="flex items-start gap-2">
                                            <span className="text-base shrink-0">{s.emoji}</span>
                                            <p className="text-slate-700 text-xs font-bold leading-relaxed">{s.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Camera view */}
                            <div className="bg-slate-900 rounded-2xl overflow-hidden aspect-video relative flex items-center justify-center">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full h-full object-cover"
                                    style={{ transform: 'scaleX(-1)' }}
                                />
                                {!cameraOn && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl">📷</div>
                                        <p className="text-white font-black text-sm">انتظر — جارٍ فتح الكاميرا...</p>
                                    </div>
                                )}
                                {cameraOn && (
                                    <>
                                        {/* Animated skeleton overlay */}
                                        <svg className="absolute inset-0 w-full h-full opacity-80 pointer-events-none" viewBox="0 0 640 360">
                                            {[[320,60],[320,140],[275,140],[240,220],[210,310],[275,310],[365,140],[400,220],[430,310],[365,310],[320,220],[300,310],[340,310]].map(([x,y],i) => (
                                                <motion.circle key={i} cx={x} cy={y} r={6}
                                                    fill={i === 2 || i === 3 ? '#f97316' : '#22c55e'}
                                                    animate={{ opacity:[0.6,1,0.6], r:[5,7,5] }}
                                                    transition={{ duration:1.5, delay:i*0.08, repeat:Infinity }}
                                                />
                                            ))}
                                        </svg>
                                        {/* Error popups */}
                                        <motion.div
                                            className="absolute top-12 left-4 bg-orange-500/90 text-white text-[10px] font-black px-3 py-1.5 rounded-2xl"
                                            animate={{ y:[0,4,0] }} transition={{ duration:2, repeat:Infinity }}
                                        >
                                            ⚠️ الركبة تتجاوز الإصبع
                                        </motion.div>
                                        <motion.div
                                            className="absolute bottom-12 right-4 bg-emerald-500/90 text-white text-[10px] font-black px-3 py-1.5 rounded-2xl"
                                            animate={{ y:[0,-4,0] }} transition={{ duration:2.5, repeat:Infinity }}
                                        >
                                            ✅ وضعية الظهر ممتازة
                                        </motion.div>
                                        <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full">
                                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> تحليل مباشر
                                        </div>
                                    </>
                                )}
                            </div>

                            {cameraOn && (
                                <Button onClick={runAnalysis} className="w-full h-14 rounded-2xl font-black text-base bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg">
                                    <Sparkles className="w-5 h-5 ml-2" /> إنهاء وتوليد التقرير
                                </Button>
                            )}
                        </div>
                    )}

                    {/* ── ANALYZING ── */}
                    {mode === 'analyzing' && (
                        <div className="p-8 flex flex-col items-center justify-center min-h-[400px] space-y-8">
                            <div className="relative w-28 h-28">
                                <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
                                <motion.div
                                    className="absolute inset-0 rounded-full border-4 border-t-indigo-600 border-r-indigo-600 border-b-transparent border-l-transparent"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Brain className="w-10 h-10 text-indigo-500" />
                                </div>
                            </div>
                            <div className="w-full space-y-3 max-w-xs">
                                <div className="flex justify-between text-sm font-bold">
                                    <span className="text-slate-600">{progressLabel}</span>
                                    <span className="text-indigo-600">{progress}%</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                            </div>
                            <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
                                {analysisCategories.slice(0, 3).map((c, i) => (
                                    <motion.div
                                        key={c.key}
                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                        transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}
                                        className="bg-slate-50 rounded-2xl p-3 text-center"
                                    >
                                        <c.icon className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
                                        <p className="text-xs font-bold text-slate-500">{c.label}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── RESULTS ── */}
                    {mode === 'results' && (
                        <div className="p-5 space-y-5">
                            {/* Overall Score */}
                            <div className="bg-slate-900 rounded-2xl p-5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl" />
                                <div className="relative z-10 flex items-center gap-6">
                                    <ScoreRing score={mockResults.overallScore} grade={mockResults.grade} />
                                    <div className="flex-1">
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">التقييم الإجمالي</p>
                                        <p className="text-white font-medium text-sm leading-relaxed">{mockResults.summary}</p>
                                        <div className="flex gap-2 mt-3">
                                            <button className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors">
                                                <Download className="w-3.5 h-3.5" /> PDF
                                            </button>
                                            <button className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors">
                                                <Share2 className="w-3.5 h-3.5" /> مشاركة
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Body Error Map */}
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                                <h3 className="font-black text-slate-900 text-sm mb-3 flex items-center gap-2">
                                    🫀 خريطة الأخطاء على الجسم
                                </h3>
                                <div className="relative bg-slate-50 rounded-2xl overflow-hidden h-48 flex items-center justify-center">
                                    {/* Body silhouette */}
                                    <svg viewBox="0 0 100 200" className="h-full opacity-20">
                                        <ellipse cx="50" cy="18" rx="12" ry="14" fill="#64748b"/>
                                        <rect x="32" y="32" width="36" height="50" rx="6" fill="#64748b"/>
                                        <rect x="14" y="34" width="16" height="40" rx="6" fill="#64748b"/>
                                        <rect x="70" y="34" width="16" height="40" rx="6" fill="#64748b"/>
                                        <rect x="34" y="82" width="14" height="55" rx="6" fill="#64748b"/>
                                        <rect x="52" y="82" width="14" height="55" rx="6" fill="#64748b"/>
                                        <rect x="34" y="137" width="14" height="45" rx="6" fill="#64748b"/>
                                        <rect x="52" y="137" width="14" height="45" rx="6" fill="#64748b"/>
                                    </svg>
                                    {mockResults.bodyErrors.map((err, i) => (
                                        <motion.div key={i}
                                            style={{ position: 'absolute', top: err.y, right: err.x, transform: 'translate(50%, -50%)' }}
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ duration: 1.5, delay: i * 0.5, repeat: Infinity }}
                                        >
                                            <div className={cn('w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px] text-white shadow-lg', err.severity === 'warning' ? 'bg-orange-500' : 'bg-blue-500')}>
                                                !
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                                <div className="space-y-2 mt-3">
                                    {mockResults.bodyErrors.map((err, i) => (
                                        <div key={i} className={cn('flex items-start gap-2 p-2.5 rounded-xl', err.severity === 'warning' ? 'bg-orange-50 border border-orange-200' : 'bg-blue-50 border border-blue-200')}>
                                            <span className={cn('text-xs font-black shrink-0', err.severity === 'warning' ? 'text-orange-700' : 'text-blue-700')}>⚠️ {err.zone}</span>
                                            <span className="text-xs font-medium text-slate-600">{err.desc}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Metric Cards */}
                            <div>
                                <h3 className="font-black text-slate-900 text-base mb-3">مؤشرات التحليل التفصيلية</h3>
                                <div className="space-y-2">
                                    {mockResults.metrics.map((m) => {
                                        const isActive = activeMetric === m.key;
                                        return (
                                            <div key={m.key} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                                <button
                                                    className="w-full flex items-center gap-3 p-4 text-right"
                                                    onClick={() => setActiveMetric(isActive ? null : m.key)}
                                                >
                                                    <div className={cn('px-2.5 py-1 rounded-xl font-black text-sm', scoreColor(m.score))}>{m.score}</div>
                                                    <span className="font-bold text-slate-900 flex-1">{m.label}</span>
                                                    {trendIcon(m.trend)}
                                                    <ChevronRight className={cn('w-4 h-4 text-slate-300 transition-transform', isActive && 'rotate-90')} />
                                                </button>
                                                {isActive && (
                                                    <div className="px-4 pb-4 border-t border-slate-50">
                                                        <div className="pt-3 space-y-2">
                                                            <Progress value={m.score} className="h-1.5" />
                                                            <p className="text-slate-600 font-medium text-sm leading-relaxed">{m.note}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Key Frames Timeline */}
                            <div>
                                <h3 className="font-black text-slate-900 text-base mb-3 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-slate-500" /> لحظات مرصودة في الفيديو
                                </h3>
                                <div className="space-y-2">
                                    {mockResults.keyFrames.map((f, i) => (
                                        <div key={i} className={cn('flex items-center gap-3 p-3 rounded-2xl border',
                                            f.type === 'good' ? 'bg-emerald-50 border-emerald-100' :
                                            f.type === 'warning' ? 'bg-orange-50 border-orange-100' :
                                            'bg-red-50 border-red-100'
                                        )}>
                                            <span className="text-xs font-black text-slate-500 bg-white px-2 py-1 rounded-lg border border-slate-200 shrink-0 font-mono">{f.time}</span>
                                            <span className={cn('text-sm font-bold',
                                                f.type === 'good' ? 'text-emerald-700' :
                                                f.type === 'warning' ? 'text-orange-700' : 'text-red-700'
                                            )}>{f.issue}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Coach suggestions */}
                            <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
                                <h3 className="font-black text-indigo-900 text-base mb-3 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-indigo-600" /> توصيات المدرب الذكي
                                </h3>
                                <ul className="space-y-2">
                                    {mockResults.coachSuggestions.map((s, i) => (
                                        <li key={i} className="flex items-start gap-2 text-indigo-800 text-sm font-medium">
                                            <span className="w-5 h-5 bg-indigo-200 text-indigo-700 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">{i + 1}</span>
                                            {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Button onClick={() => setMode('choose')} variant="outline" className="w-full h-12 rounded-2xl font-bold border-slate-200 hover:bg-slate-50 flex items-center gap-2">
                                <RotateCcw className="w-4 h-4" /> تحليل جديد
                            </Button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
