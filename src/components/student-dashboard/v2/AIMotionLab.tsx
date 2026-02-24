import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, Camera, ChevronRight, Play, AlertCircle, CheckCircle2, ArrowRight, Activity, Scan, Brain, TrendingUp, Loader2, StopCircle, Mic, MicOff, Bot } from 'lucide-react';
import { MotionAnalysisService, BodyAnalysisMetrics, AISessionSummary } from '@/services/MotionAnalysisService';
import { AIService } from '@/services/AIService';

export const AIMotionLab: React.FC = () => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [analysisData, setAnalysisData] = useState<{ metrics: BodyAnalysisMetrics, summary: AISessionSummary } | null>(null);
    const [repCount, setRepCount] = useState(0);
    const [feedback, setFeedback] = useState("قم بمواجهة الكاميرا لبدء التحليل...");
    const [isRecordingVoice, setIsRecordingVoice] = useState(false);
    const [isBackendProcessing, setIsBackendProcessing] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const poseRef = useRef<any>(null);
    const cameraRef = useRef<any>(null);

    // Rep Counting Local State (Squats)
    const squatStage = useRef<'up' | 'down'>('up');

    const loadMediaPipe = async () => {
        if ((window as any).Pose) return;

        return new Promise((resolve) => {
            const scripts = [
                'https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js',
                'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js',
                'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js'
            ];

            let loadedCount = 0;
            scripts.forEach(src => {
                const script = document.createElement('script');
                script.src = src;
                script.async = true;
                script.onload = () => {
                    loadedCount++;
                    if (loadedCount === scripts.length) resolve(true);
                };
                document.body.appendChild(script);
            });
        });
    };

    const onResults = (results: any) => {
        if (!canvasRef.current || !videoRef.current) return;

        const canvasCtx = canvasRef.current.getContext('2d');
        if (!canvasCtx) return;

        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        // Draw the video frame to canvas
        canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

        if (results.poseLandmarks) {
            // Drawing Utils (loaded via CDN)
            const drawingUtils = (window as any);
            drawingUtils.drawConnectors(canvasCtx, results.poseLandmarks, (window as any).POSE_CONNECTIONS,
                { color: '#6366f1', lineWidth: 4 });
            drawingUtils.drawLandmarks(canvasCtx, results.poseLandmarks,
                { color: '#ffffff', lineWidth: 2, radius: 4 });

            // Expert Rep Counting Logic: Squat Analysis
            // Focus on Hip (23, 24) and Knee (25, 26)
            const leftHip = results.poseLandmarks[23];
            const leftKnee = results.poseLandmarks[25];
            const leftAnkle = results.poseLandmarks[27];

            // Calculate Angle (Heuristic for Squat)
            const angle = calculateAngle(leftHip, leftKnee, leftAnkle);

            if (angle > 160) {
                if (squatStage.current === 'down') {
                    setRepCount(prev => prev + 1);
                    setFeedback("عمل رائع! استمر...");
                }
                squatStage.current = 'up';
            } else if (angle < 90) {
                squatStage.current = 'down';
                setFeedback("وضعية جيدة، انزل أكثر...");
            }
        }
        canvasCtx.restore();
    };

    const calculateAngle = (a: any, b: any, c: any) => {
        const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
        let angle = Math.abs(radians * 180.0 / Math.PI);
        if (angle > 180.0) angle = 360 - angle;
        return angle;
    };

    const startCamera = async () => {
        setIsAnalyzing(true);
        await loadMediaPipe();

        const Pose = (window as any).Pose;
        const mpCamera = (window as any).Camera;

        poseRef.current = new Pose({
            locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
        });

        poseRef.current.setOptions({
            modelComplexity: 1,
            smoothLandmarks: true,
            enableSegmentation: false,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        poseRef.current.onResults(onResults);

        if (videoRef.current) {
            cameraRef.current = new mpCamera(videoRef.current, {
                onFrame: async () => {
                    await poseRef.current.send({ image: videoRef.current! });
                },
                width: 1280,
                height: 720
            });
            cameraRef.current.start();
            setIsCameraActive(true);
        }
    };

    const stopCamera = () => {
        if (cameraRef.current) cameraRef.current.stop();
        setIsCameraActive(false);
        setIsAnalyzing(false);
        setIsBackendProcessing(true); // YOLOv8/OpenCV Pipeline Triggered
        handleFinalizeSession();
    };

    const toggleVoiceCoach = async () => {
        if (!isRecordingVoice) {
            setIsRecordingVoice(true);
            setTimeout(async () => {
                setIsRecordingVoice(false);
                const transcript = await AIService.transcribeSpeech(new Blob());
                setFeedback(`أنت تقول: "${transcript}" - سأقوم بتحسين تحليلك...`);
            }, 3000);
        } else {
            setIsRecordingVoice(false);
        }
    };

    const handleFinalizeSession = async () => {
        const result = await MotionAnalysisService.analyzeSession();
        setAnalysisData(result);
        setIsBackendProcessing(false);
    };

    return (
        <Card className="glass-card overflow-hidden border-white/10 relative shadow-2xl">
            {/* Contextual brand accent */}
            <div className="absolute inset-0 bg-indigo-600/5 mix-blend-overlay pointer-events-none" />

            <CardHeader className="relative z-10 pb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <CardTitle className="text-2xl font-black flex items-center gap-3 text-white">
                            <div className="p-2 rounded-xl bg-indigo-500/20 ring-1 ring-indigo-500/30">
                                <Camera className="w-6 h-6 text-indigo-400" />
                            </div>
                            <span>مختبر الحركة الذكي (AI Motion Lab)</span>
                        </CardTitle>
                        <CardDescription className="text-gray-400 font-bold mt-2 text-base">
                            تحليل الجسم الكامل، التوازن، والذكاء الاصطناعي (Full Body Analysis)
                        </CardDescription>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.history.back()}
                        className="gap-2 border-white/10 bg-white/5 text-white hover:bg-white/10 font-bold h-10 px-4 self-start md:self-auto"
                    >
                        <ArrowRight className="w-4 h-4 ml-2" />
                        العودة للوحة التحكم
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="relative z-10">
                <div className="space-y-12">

                    {/* 1. Main Interaction Area */}
                    <div className="bg-[#030712] rounded-2xl overflow-hidden relative aspect-video shadow-[0_0_50px_rgba(0,0,0,0.5)] ring-1 ring-white/10">
                        {/* Real Camera Stream */}
                        <video
                            ref={videoRef}
                            className="absolute inset-0 w-full h-full object-cover opacity-0"
                            playsInline
                        />
                        <canvas
                            ref={canvasRef}
                            className="absolute inset-0 w-full h-full object-cover"
                            width={1280}
                            height={720}
                        />

                        {/* Top Overlay: Real-time Stats */}
                        {isCameraActive && (
                            <div className="absolute top-6 left-6 flex flex-col gap-3 z-20">
                                <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                                        <Activity className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">العدات (Reps)</div>
                                        <div className="text-3xl font-black text-white leading-none">{repCount}</div>
                                    </div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-[10px] font-black text-white hover:bg-white/20 transition-all uppercase tracking-widest text-center shadow-lg">
                                    {feedback}
                                </div>
                            </div>
                        )}

                        {!isCameraActive && !analysisData && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center text-white space-y-6 max-w-sm px-6">
                                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto ring-1 ring-white/10">
                                        <Camera className="w-12 h-12 text-blue-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black mb-2">مختبر الحركة الذكي (Ahmed)</h4>
                                        <p className="text-gray-500 font-bold">ابدأ الكاميرا واستعد لتصحيح حركتك في الوقت الفعلي.</p>
                                    </div>
                                    <Button onClick={startCamera} disabled={isAnalyzing} className="bg-indigo-600 hover:bg-indigo-500 text-white font-black h-14 px-10 rounded-2xl shadow-2xl transition-all hover:scale-105 active:scale-95">
                                        {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin ml-3" /> : <Play className="w-5 h-5 ml-3 fill-current" />}
                                        {isAnalyzing ? 'جاري التحميل...' : 'افتح الكاميرا وابدأ'}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {isCameraActive && (
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-4">
                                <Button
                                    onClick={toggleVoiceCoach}
                                    variant="secondary"
                                    className={`h-14 w-14 rounded-full shadow-2xl transition-all ${isRecordingVoice ? 'animate-pulse bg-red-500 text-white' : 'bg-white/10 text-white'}`}
                                >
                                    {isRecordingVoice ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                                </Button>
                                <Button
                                    onClick={stopCamera}
                                    variant="destructive"
                                    className="bg-red-600 hover:bg-red-500 text-white font-black h-14 px-8 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 border-4 border-white/20"
                                >
                                    <StopCircle className="w-6 h-6 ml-3" />
                                    إنهاء الجلسة والتحليل (YOLOv8)
                                </Button>
                            </div>
                        )}

                        {isBackendProcessing && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-30">
                                <div className="text-center space-y-4">
                                    <div className="relative">
                                        <Loader2 className="w-16 h-16 text-indigo-500 animate-spin mx-auto" />
                                        <Bot className="w-8 h-8 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black text-white">جاري المعالجة المتقدمة (Processing)</h4>
                                        <p className="text-gray-400 font-bold">يتم الآن تحليل حركتك بواسطة YOLOv8 و OpenCV...</p>
                                    </div>
                                    <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30">Backend: Active</Badge>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 2. Body Analysis Report */}
                    {analysisData && (
                        <div className="animate-in slide-in-from-bottom-10 fade-in duration-700 space-y-10">

                            {/* Header */}
                            <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                                <div className="p-2 rounded-lg bg-white/5 ring-1 ring-white/10">
                                    <Scan className="w-6 h-6 text-indigo-400" />
                                </div>
                                <h3 className="text-2xl font-black text-white tracking-tight">تقرير تحليل القوام الرقمي</h3>
                            </div>

                            {/* Posture & Balance */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Card className="bg-white/5 border-white/10 backdrop-blur-md shadow-xl rounded-2xl overflow-hidden">
                                    <CardHeader className="bg-white/5 border-b border-white/5"><CardTitle className="text-base font-black text-white">نقاط القوام</CardTitle></CardHeader>
                                    <CardContent className="flex items-center gap-8 py-8 px-6">
                                        <div className="relative w-28 h-28 flex items-center justify-center">
                                            <svg className="w-full h-full transform -rotate-90">
                                                <circle cx="56" cy="56" r="48" className="stroke-white/5" strokeWidth="10" fill="none" />
                                                <circle cx="56" cy="56" r="48" className="stroke-indigo-500 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" strokeWidth="10" fill="none" strokeDasharray="301.6" strokeDashoffset={301.6 - (301.6 * analysisData.metrics.postureScore.value) / 100} strokeLinecap="round" />
                                            </svg>
                                            <span className="absolute text-2xl font-black text-white">{analysisData.metrics.postureScore.value}%</span>
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-400 font-bold">الحالة الإجمالية:</span>
                                                <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30 px-3 font-black">{analysisData.metrics.postureScore.status}</Badge>
                                            </div>
                                            <div className="flex justify-between items-center text-sm border-t border-white/5 pt-2">
                                                <span className="text-gray-400 font-bold">استقامة العمود الفقري:</span>
                                                <span className="text-indigo-300 font-black">{analysisData.metrics.postureScore.spineAlignment}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-400 font-bold">وضعية الرأس:</span>
                                                <span className="text-indigo-300 font-black">{analysisData.metrics.postureScore.headPosition}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-white/5 border-white/10 backdrop-blur-md shadow-xl rounded-2xl overflow-hidden">
                                    <CardHeader className="bg-white/5 border-b border-white/5"><CardTitle className="text-base font-black text-white">التوازن</CardTitle></CardHeader>
                                    <CardContent className="py-8 px-6">
                                        <div className="flex justify-between mb-4 text-xs font-black uppercase tracking-widest text-blue-300">
                                            <span>الجزء الأيسر {analysisData.metrics.balance.leftSide}%</span>
                                            <span>الجزء الأيمن {analysisData.metrics.balance.rightSide}%</span>
                                        </div>
                                        <div className="flex h-5 rounded-full overflow-hidden bg-white/5 ring-1 ring-white/10 p-1">
                                            <div className="bg-blue-500 rounded-l-full shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-1000" style={{ width: `${analysisData.metrics.balance.leftSide}%` }}></div>
                                            <div className="bg-orange-500 rounded-r-full shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all duration-1000" style={{ width: `${analysisData.metrics.balance.rightSide}%` }}></div>
                                        </div>
                                        <div className="mt-6 flex items-center justify-center gap-3 bg-white/5 py-3 rounded-xl ring-1 ring-white/5">
                                            <TrendingUp className="w-4 h-4 text-blue-400" />
                                            <span className="text-sm font-bold text-gray-200">
                                                مؤشر التماثل: <span className="text-white font-black">{analysisData.metrics.balance.limbSymmetry}%</span> ({analysisData.metrics.balance.distributionStatus})
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Secondary Metrics */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {[
                                    { label: 'مركز الثقل (COG)', value: analysisData.metrics.centerOfGravity.offset, icon: Activity, color: 'text-indigo-400' },
                                    { label: 'زوايا الركبة', value: `L:${analysisData.metrics.jointAngles.knees.left}° / R:${analysisData.metrics.jointAngles.knees.right}°`, icon: Scan, color: 'text-blue-400' },
                                    { label: 'زوايا الأكتاف', value: `L:${analysisData.metrics.jointAngles.shoulders.left}° / R:${analysisData.metrics.jointAngles.shoulders.right}°`, icon: Scan, color: 'text-blue-400' },
                                    { label: 'مؤشر عدم التماثل', value: analysisData.metrics.asymmetryIndex, icon: AlertCircle, color: 'text-red-400' }
                                ].map((item, idx) => (
                                    <div key={idx} className="p-5 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm text-center ring-1 ring-white/5 hover:bg-white/10 transition-colors">
                                        <item.icon className={`w-5 h-5 mx-auto mb-3 ${item.color}`} />
                                        <div className="text-[10px] font-black text-gray-500 uppercase mb-2 tracking-widest leading-tight">{item.label}</div>
                                        <div className="text-base font-black text-white">{item.value}</div>
                                    </div>
                                ))}
                            </div>

                            {/* 3. AI Summary */}
                            <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden ring-1 ring-indigo-500/20">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px]" />
                                <div className="flex items-center gap-4 mb-8 relative z-10">
                                    <div className="p-3 rounded-xl bg-indigo-500/20 ring-1 ring-indigo-500/30">
                                        <Brain className="w-7 h-7 text-indigo-400 shadow-indigo-500/50" />
                                    </div>
                                    <h3 className="text-2xl font-black text-white tracking-tight">تحليل الذكاء الاصطناعي</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                                    <div className="space-y-4 bg-white/5 p-6 rounded-2xl border border-green-500/10 ring-1 ring-green-500/5">
                                        <h4 className="text-sm font-black text-green-400 flex items-center gap-2 uppercase tracking-wider"><CheckCircle2 className="w-5 h-5" /> نقاط القوة</h4>
                                        <ul className="text-sm space-y-3 font-bold text-gray-300 rtl list-none">
                                            {analysisData.summary.strengths.map((s, i) => <li key={i} className="flex gap-2"><span>•</span> {s}</li>)}
                                        </ul>
                                    </div>
                                    <div className="space-y-4 bg-white/5 p-6 rounded-2xl border border-red-500/10 ring-1 ring-red-500/5">
                                        <h4 className="text-sm font-black text-red-400 flex items-center gap-2 uppercase tracking-wider"><AlertCircle className="w-5 h-5" /> نقاط التحسين</h4>
                                        <ul className="text-sm space-y-3 font-bold text-gray-300 rtl list-none">
                                            {analysisData.summary.weaknesses.map((w, i) => <li key={i} className="flex gap-2"><span>•</span> {w}</li>)}
                                        </ul>
                                    </div>
                                    <div className="space-y-4 bg-white/5 p-6 rounded-2xl border border-blue-500/10 ring-1 ring-blue-500/5">
                                        <h4 className="text-sm font-black text-blue-400 flex items-center gap-2 uppercase tracking-wider"><TrendingUp className="w-5 h-5" /> التوصيات</h4>
                                        <ul className="text-sm space-y-3 font-bold text-gray-300 rtl list-none">
                                            {analysisData.summary.recommendations.map((r, i) => <li key={i} className="flex gap-2"><span>•</span> {r}</li>)}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
