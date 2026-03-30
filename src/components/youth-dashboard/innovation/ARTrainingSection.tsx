import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, ScanFace, Scan, Layers, Maximize, Play, PlayCircle, Loader2, Focus, Video, MoveUpRight, Zap, RefreshCw, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function ARTrainingSection() {
    const [isScanning, setIsScanning] = React.useState(true);

    React.useEffect(() => {
        const timer = setTimeout(() => setIsScanning(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="space-y-6 md:space-y-0 md:h-[calc(100vh-140px)] flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Minimal Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 md:pb-6 shrink-0">
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="p-2.5 bg-cyan-500/20 rounded-xl border border-cyan-500/30 flex-shrink-0 relative">
                        <Camera className="w-6 h-6 text-cyan-400" />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                        </span>
                    </div>
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                            محاكي الواقع المعزز (AR) <Badge variant="outline" className="border-cyan-500/40 text-cyan-400 bg-cyan-500/10 uppercase tracking-widest text-[9px] px-1.5 py-0">BETA</Badge>
                        </h2>
                        <p className="text-slate-400 text-xs font-bold leading-relaxed">تدرب مع مدرب ثلاثي الأبعاد مباشرة في غرفتك عبر كاميرا هاتفك</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Button variant="outline" className="flex-1 md:flex-none bg-slate-900 border-white/10 text-slate-300 hover:text-white hover:bg-white/5 font-bold rounded-xl h-10">
                        معايرة الكاميرا <RefreshCw className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                    <Button className="flex-1 md:flex-none bg-cyan-600 hover:bg-cyan-500 text-white font-bold h-10 px-6 shadow-[0_0_15px_rgba(8,145,178,0.4)] border-none rounded-xl">
                        تسجيل الجلسة <Video className="w-4 h-4 ml-1.5" />
                    </Button>
                </div>
            </div>

            {/* AR Live Viewport */}
            <div className="flex-1 min-h-[500px] w-full relative rounded-3xl overflow-hidden border border-white/5 bg-slate-950 shadow-2xl isolate group">
                {/* Simulated Camera Feed Background - Premium Dark Look */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0B0E14] to-[#131A2A] z-0" />
                <div className="absolute inset-0 bg-[url('/images/gym_placeholder_dark.jpg')] bg-cover bg-center opacity-20 filter contrast-125 grayscale mix-blend-overlay" />
                
                {/* AR Grid & Scanning FX */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMjAgTDIwIDIwIEwyMCAwIEwzMCAwIEwzMCAyMCBMNDAgMjAgTDQwIDMwIEwzMCAzMCBMMzAgNDAgTDIwIDQwIEwyMCAzMCBMMCAzMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDgsMTQ1LDE3OCwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] opacity-60 pointer-events-none z-0" />
                
                {/* HUD Elements */}
                <div className="absolute top-6 left-6 z-20 flex gap-2">
                    <div className="px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 backdrop-blur-md flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[10px] text-white font-black tracking-widest uppercase">REC</span>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 backdrop-blur-md flex items-center gap-2">
                        <Scan className="w-3 h-3 text-cyan-400" />
                        <span className="text-[10px] text-cyan-400 font-bold">3D TRACKING</span>
                    </div>
                </div>

                {/* Right Side Tools Overlay */}
                <div className="absolute top-6 right-6 bottom-6 w-16 z-20 flex flex-col justify-between items-end pointer-events-none">
                    <div className="flex flex-col gap-3 pointer-events-auto">
                        {[Focus, Layers, ScanFace, Maximize].map((Icon, idx) => (
                            <button key={idx} className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors shadow-lg group/btn relative">
                                <Icon className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                            </button>
                        ))}
                    </div>
                    
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-1 h-24 bg-black/40 rounded-full overflow-hidden border border-white/10 relative">
                            <div className="absolute bottom-0 left-0 right-0 h-[70%] bg-gradient-to-t from-cyan-500 to-emerald-400 rounded-full" />
                        </div>
                        <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">ZOOM</span>
                    </div>
                </div>

                {/* Center AR Interaction Area */}
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
                    <AnimatePresence mode="wait">
                        {isScanning ? (
                            <motion.div 
                                key="scanning"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
                                className="flex flex-col items-center gap-6"
                            >
                                <div className="relative w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center">
                                    <div className="absolute inset-0 border-[4px] border-dashed border-cyan-500/40 rounded-3xl animate-[spin_10s_linear_infinite]" />
                                    <div className="absolute inset-4 border-[2px] border-cyan-400/20 rounded-2xl animate-[spin_5s_linear_infinite_reverse]" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-full h-1 bg-cyan-400/80 shadow-[0_0_15px_rgba(34,211,238,0.8)] absolute top-0 animate-[ping_3s_ease-in-out_infinite] translate-y-32" style={{ animationName: 'scan-vertical' }} />
                                    </div>
                                    <Smartphone className="w-16 h-16 text-cyan-300/50" />
                                </div>
                                <h3 className="text-xl font-black text-cyan-300 tracking-wider animate-pulse flex items-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" /> جاري تحليل البيئة المحيطة...
                                </h3>
                                <p className="text-sm font-bold text-slate-400">الرجاء توجيه الكاميرا لمساحة فارغة (2x2 متر)</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="ready"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center group/play cursor-pointer"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-3xl group-hover/play:bg-cyan-500/40 transition-colors duration-500" />
                                    <div className="w-24 h-24 rounded-full bg-cyan-500/10 border border-cyan-400/50 flex items-center justify-center shadow-[0_0_30px_rgba(8,145,178,0.3)] backdrop-blur-sm group-hover/play:scale-110 transition-transform duration-500 relative z-10">
                                        <Play className="w-10 h-10 text-cyan-300 ml-2" />
                                    </div>
                                    <div className="absolute inset-0 border-2 border-cyan-500/30 rounded-full animate-ping z-0" style={{ animationDuration: '3s' }} />
                                </div>
                                <div className="mt-8 text-center bg-black/40 px-6 py-3 rounded-2xl border border-white/10 backdrop-blur-md">
                                    <h3 className="text-2xl font-black text-white mb-1">جاهز للإسقاط!</h3>
                                    <p className="text-sm text-cyan-400 font-bold">انقر لبدء إسقاط الكابتن (Holocoach)</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Bottom Stats Overlay */}
                <div className="absolute bottom-6 left-6 right-24 z-20 flex gap-4 pointer-events-none">
                    <div className="px-5 py-3 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-md flex flex-col gap-1 pointer-events-auto">
                        <span className="text-[10px] text-slate-400 font-black tracking-widest uppercase">التمرين الحالي</span>
                        <div className="flex items-center gap-2 text-white font-bold">
                            <Zap className="w-4 h-4 text-yellow-400" />
                            سكوات القوة (Power Squats)
                        </div>
                    </div>
                </div>

                {/* Corner Brackets */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-cyan-500/50 rounded-tl-xl pointer-events-none" />
                <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-cyan-500/50 rounded-tr-xl pointer-events-none" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-cyan-500/50 rounded-bl-xl pointer-events-none" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-cyan-500/50 rounded-br-xl pointer-events-none" />
            </div>
            
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes scan-vertical {
                    0%, 100% { transform: translateY(-80px); opacity: 0; }
                    50% { transform: translateY(80px); opacity: 1; }
                }
            `}} />
        </div>
    );
}
