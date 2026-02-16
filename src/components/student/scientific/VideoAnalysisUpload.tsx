import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, Video, Wand2, CheckCircle2, AlertCircle, ScanLine, PlayCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function VideoAnalysisUpload() {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isAnalyzed, setIsAnalyzed] = useState(false);

    const handleUpload = () => {
        setIsUploading(true);
        // Simulate upload
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            setUploadProgress(progress);
            if (progress >= 100) {
                clearInterval(interval);
                setIsUploading(false);
                setIsAnalyzed(true);
            }
        }, 100);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <Card className="border-2 border-dashed border-blue-200 bg-blue-50/30">
                <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                    {!isAnalyzed ? (
                        <>
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                                <Video className="w-10 h-10 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">رفع فيديو للتحليل</h3>
                            <p className="text-slate-500 mb-6 max-w-xs mx-auto">
                                ارفع فيديو لأداء التمرين للحصول على تحليل شامل لزوايا المفاصل والأخطاء الفنية.
                            </p>

                            {isUploading ? (
                                <div className="w-full max-w-xs space-y-2">
                                    <div className="flex justify-between text-xs text-blue-600 font-medium">
                                        <span>جاري التحليل بالذكاء الاصطناعي...</span>
                                        <span>{uploadProgress}%</span>
                                    </div>
                                    <Progress value={uploadProgress} className="h-2" />
                                </div>
                            ) : (
                                <div className="flex gap-3">
                                    <Button onClick={handleUpload} className="gap-2" size="lg">
                                        <Upload className="w-4 h-4" /> رفع فيديو
                                    </Button>
                                    <Button variant="outline" size="lg" className="gap-2">
                                        <Video className="w-4 h-4" /> تسجيل مباشر
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center relative">
                            <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden mb-4 group cursor-pointer">
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all">
                                    <PlayCircle className="w-16 h-16 text-white opacity-80 group-hover:scale-110 transition-transform" />
                                </div>
                                {/* Mock Skeleton Overlay */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60" viewBox="0 0 100 100">
                                    <line x1="50" y1="20" x2="50" y2="50" stroke="#00ff00" strokeWidth="2" />
                                    <line x1="50" y1="50" x2="30" y2="80" stroke="#00ff00" strokeWidth="2" />
                                    <line x1="50" y1="50" x2="70" y2="80" stroke="#00ff00" strokeWidth="2" />
                                    <circle cx="50" cy="20" r="5" fill="#00ff00" />
                                    <circle cx="30" cy="80" r="3" fill="red" /> {/* Error point */}
                                </svg>
                                <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                                    <ScanLine className="w-3 h-3 text-green-400" /> AI Tracking Active
                                </div>
                            </div>
                            <Button variant="ghost" onClick={() => setIsAnalyzed(false)} className="text-sm text-slate-500">
                                تحليل فيديو آخر
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Results Section */}
            <div className="space-y-6">
                <Card className={`${isAnalyzed ? 'opacity-100' : 'opacity-50 blur-sm pointer-events-none'} transition-all duration-500`}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Wand2 className="w-5 h-5 text-purple-600" />
                            نتائج التحليل الذكي
                        </CardTitle>
                        <CardDescription>تم اكتشاف 3 نقاط قوة و 1 نقطة تحسين</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Score */}
                        <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-xl">
                            <div className="relative">
                                <svg className="w-20 h-20 transform -rotate-90">
                                    <circle cx="40" cy="40" r="36" stroke="#e2e8f0" strokeWidth="8" fill="transparent" />
                                    <circle cx="40" cy="40" r="36" stroke="#3b82f6" strokeWidth="8" fill="transparent" strokeDasharray="226" strokeDashoffset="45" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center font-bold text-xl text-blue-600">
                                    82%
                                </div>
                            </div>
                            <div>
                                <div className="font-bold text-lg mb-1">أداء ممتاز!</div>
                                <p className="text-sm text-slate-500">تكنيك الحركة دقيق بنسبة كبيرة.</p>
                            </div>
                        </div>

                        {/* Feedback Points */}
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 bg-green-50 text-green-800 rounded-lg text-sm">
                                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                <div>
                                    <span className="font-bold block mb-1">استقامة الظهر</span>
                                    حافظت على استقامة العمود الفقري طوال الحركة.
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-green-50 text-green-800 rounded-lg text-sm">
                                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                <div>
                                    <span className="font-bold block mb-1">ثبات الكعب</span>
                                    الكعبان ملامسان للأرض بشكل مثالي.
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-red-50 text-red-800 rounded-lg text-sm">
                                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                <div>
                                    <span className="font-bold block mb-1">انحراف الركبة (تحتاج تحسين)</span>
                                    لوحظ انحراف بسيط للركبة اليمنى للداخل أثناء الهبوط. حاول دفع ركبتيك للخارج.
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
