import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, Video as VideoIcon, CheckCircle2, AlertTriangle, MessageSquare, FastForward, Maximize2, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_VIDEOS = [
    { id: 1, student: 'ياسين أحمد', type: 'تمرين الجري السريع', duration: '0:45', date: 'اليوم, 10:30 ص', status: 'analyzed', issues: 1 },
    { id: 2, student: 'عمر محمود', type: 'تمرين التوازن', duration: '1:12', date: 'أمس, 02:15 م', status: 'pending', issues: 0 },
    { id: 3, student: 'لينا سالم', type: 'القفز العالي', duration: '0:30', date: 'منذ يومين', status: 'analyzed', issues: 0 },
];

export const AdminVideoAnalysis: React.FC = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-cairo">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight">الفيديوهات والتحليل الذكي</h2>
                    <p className="text-slate-400 font-medium mt-1">
                        مراجعة وتحليل فيديوهات الأداء (السرعة، الرشاقة، التوافق العضلي العصبي)
                    </p>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl gap-2 shadow-lg shadow-purple-500/20">
                    <VideoIcon className="w-4 h-4" />
                    رفع فيديو للتحليل
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Video Player Area */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-slate-900 border-slate-800 overflow-hidden relative group">
                        <div className="absolute top-4 right-4 z-10 flex gap-2">
                            <div className="bg-red-500/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1 border border-red-400">
                                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                تحليل مباشر الذكاء الاصطناعي
                            </div>
                        </div>
                        {/* Dummy Video Player */}
                        <div className="w-full aspect-video bg-slate-950 relative flex items-center justify-center border-b border-slate-800">
                            <div className="absolute inset-0 flex items-center justify-center opacity-20">
                                <div className="w-full h-full border border-purple-500/30 grid grid-cols-3 grid-rows-3">
                                    <div className="border border-purple-500/30" />
                                    <div className="border border-purple-500/30 relative">
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-emerald-500 rounded-lg animate-pulse" />
                                    </div>
                                    <div className="border border-purple-500/30" />
                                </div>
                            </div>
                            <Button variant="ghost" className="w-20 h-20 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md">
                                <PlayCircle className="w-12 h-12" />
                            </Button>
                        </div>

                        {/* Player Controls */}
                        <div className="flex items-center justify-between p-4 bg-slate-900/80">
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white"><PlayCircle className="w-5 h-5" /></Button>
                                <div className="h-6 w-[1px] bg-slate-800 mx-2 self-center" />
                                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white"><FastForward className="w-5 h-5" /></Button>
                            </div>
                            <div className="flex-1 px-4">
                                <div className="w-full h-1.5 bg-slate-800 rounded-full cursor-pointer relative">
                                    <div className="absolute top-0 left-0 h-full w-1/3 bg-purple-500 rounded-full" />
                                    {/* AI Marker */}
                                    <div className="absolute top-1/2 -translate-y-1/2 left-1/3 w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)] border-2 border-slate-900 cursor-pointer" title="تنبيه حركي" />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-slate-400 text-xs font-bold self-center mr-2">0:15 / 0:45</span>
                                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white"><Maximize2 className="w-5 h-5" /></Button>
                            </div>
                        </div>
                    </Card>

                    {/* AI Insights Panel */}
                    <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Brain className="w-5 h-5 text-purple-400" />
                                ملاحظات المدرب الافتراضي (AI)
                            </h3>
                            <div className="space-y-4">
                                <div className="flex gap-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                    <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-amber-500">عدم تناسق في وضعية الظهر (0:15)</h4>
                                        <p className="text-sm text-slate-300 mt-1">يلاحظ تقوس خفيف في الظهر أثناء الهبوط. ينصح بتوجيه التلميذ لتمارين تقوية عضلات الجذع.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-emerald-500">تحسن ملحوظ في سرعة الانطلاق</h4>
                                        <p className="text-sm text-slate-300 mt-1">مقارنة بالفيديو السابق، سرعة الانطلاق ارتفعت بنسبة 12%. توافق عضلي عصبي ممتاز.</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Video Queue / History */}
                <div className="space-y-6">
                    <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800 flex-1 h-full">
                        <CardContent className="p-4">
                            <h3 className="font-bold text-white mb-4 px-2">قائمة الفيديوهات المرفوعة</h3>
                            <div className="space-y-3">
                                {MOCK_VIDEOS.map((vid) => (
                                    <motion.div key={vid.id} className="p-3 bg-slate-950/50 rounded-xl border border-slate-800 hover:border-purple-500/50 transition-colors cursor-pointer group flex gap-3">
                                        <div className="w-20 h-16 bg-slate-800 rounded-lg relative overflow-hidden flex-shrink-0 flex items-center justify-center">
                                            <VideoIcon className="w-6 h-6 text-slate-600 group-hover:text-purple-400 transition-colors" />
                                            <span className="absolute bottom-1 left-1 bg-black/70 px-1 text-[10px] text-white font-bold rounded">{vid.duration}</span>
                                        </div>
                                        <div className="flex-1 py-1 flex flex-col justify-between">
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-200 line-clamp-1 group-hover:text-purple-300">{vid.type}</h4>
                                                <p className="text-xs text-slate-500">{vid.student}</p>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-[10px] font-bold text-slate-400">{vid.date}</span>
                                                {vid.status === 'analyzed' ? (
                                                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-4 ${vid.issues > 0 ? 'border-amber-500/50 text-amber-500' : 'border-emerald-500/50 text-emerald-500'}`}>
                                                        تم التحليل
                                                    </Badge>
                                                ) : (
                                                    <span className="flex h-2 w-2 relative">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminVideoAnalysis;
