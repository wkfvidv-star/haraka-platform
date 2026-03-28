import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from "@/components/ui/progress";
import { Apple, Video, Star, Bell, PlayCircle, ClipboardList, Dumbbell, ChevronLeft, Upload, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DeepTrainingReportSheet, DeepDietReportSheet, DeepVideoReportSheet } from './DeepReportSheets';

export default function CoachInboxWidget() {
  const [activeTab, setActiveTab] = useState<'plans' | 'diets' | 'videos'>('plans');
  const [activeReport, setActiveReport] = useState<{ type: string, id: string } | null>(null);
  
  // Real Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const mockPlans = [
    { id: 'p1', title: 'خطة القوة والتحمل (أسبوع 1)', coach: 'الكابتن أحمد', date: 'اليوم', type: 'training', status: 'new', details: 'ركز هذا الأسبوع...' },
  ];

  const mockDiets = [
    { id: 'd1', title: 'نظام حرق الدهون (عجز 300 سعرة)', coach: 'أخصائية التغذية', date: 'أمس', type: 'diet', status: 'read', details: 'سعراتك اليومية المتبقية: 2100.' }
  ];

  const mockVideos = [
    { id: 'v1', title: 'تصحيح زاوية النزول في السكوات', coach: 'الكابتن أحمد', date: 'منذ ساعتين', type: 'video', status: 'new', details: 'لقد قمت بتحليل الفيديو الأخير.' }
  ];

  const getActiveTabItems = () => {
    switch(activeTab) {
      case 'plans': return mockPlans;
      case 'diets': return mockDiets;
      case 'videos': return mockVideos;
      default: return [];
    }
  };

  const openReport = (type: string, id: string) => setActiveReport({ type, id });
  const closeReport = () => setActiveReport(null);

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Simulate fake fast upload over 3 seconds
      const interval = setInterval(() => {
         setUploadProgress(prev => {
            if (prev >= 100) {
               clearInterval(interval);
               setIsUploading(false);
               setShowSuccessToast(true);
               setTimeout(() => setShowSuccessToast(false), 4000);
               return 100;
            }
            return prev + Math.random() * 20;
         });
      }, 500);
    }
  };

  return (
    <>
      <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-sm overflow-hidden group flex flex-col h-full relative min-h-[450px]">
        {/* Hidden File Input for Real Interaction */}
        <input type="file" ref={fileInputRef} className="hidden" accept="video/mp4,video/x-m4v,video/*,image/*" onChange={handleFileChange} />
        
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
        
        {/* Header and Tabs */}
        <CardHeader className="pb-4 relative z-10 border-b border-white/5 flex-shrink-0">
          <div className="flex justify-between items-center mb-4">
            <CardTitle className="text-white text-xl flex items-center gap-3 font-black tracking-tight">
              <div className="relative">
                <Bell className="w-5 h-5 text-indigo-400" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border border-slate-900 rounded-full animate-ping" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border border-slate-900 rounded-full" />
              </div>
              الوارد من المدرب
            </CardTitle>
            <Badge className="bg-indigo-500/20 text-indigo-200 border-indigo-500/30">2 جديد</Badge>
          </div>
          
          <div className="flex gap-1 bg-white/5 p-1 rounded-xl w-full border border-white/10">
            <button onClick={() => setActiveTab('plans')} className={cn("flex-1 whitespace-nowrap overflow-hidden text-ellipsis py-2 text-[11px] sm:text-sm font-bold rounded-lg transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2", activeTab === 'plans' ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/20" : "text-slate-400 hover:text-white")}>
                <Dumbbell className="w-4 h-4" /> تدريب
            </button>
            <button onClick={() => setActiveTab('diets')} className={cn("flex-1 whitespace-nowrap overflow-hidden text-ellipsis py-2 text-[11px] sm:text-sm font-bold rounded-lg transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2", activeTab === 'diets' ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20" : "text-slate-400 hover:text-white")}>
                <Apple className="w-4 h-4" /> تغذية
            </button>
            <button onClick={() => setActiveTab('videos')} className={cn("flex-1 whitespace-nowrap overflow-hidden text-ellipsis py-2 text-[11px] sm:text-sm font-bold rounded-lg transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2", activeTab === 'videos' ? "bg-orange-500 text-white shadow-md shadow-orange-500/20" : "text-slate-400 hover:text-white")}>
                <PlayCircle className="w-4 h-4" /> تحليلات
            </button>
          </div>
        </CardHeader>
        
        {/* Scrollable Content Area */}
        <CardContent className="p-0 relative z-10 flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto no-scrollbar min-h-[220px]">
            <AnimatePresence mode="popLayout">
                {getActiveTabItems().map((item) => (
                    <motion.div key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                        className="border-b border-white/5 p-4 transition-all cursor-pointer hover:bg-white/10 group/item flex items-center gap-4"
                        onClick={() => openReport(item.type, item.id)}
                    >
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg border border-white/10 bg-slate-800 group-hover/item:scale-110 transition-transform">
                            {item.type === 'training' && <ClipboardList className="w-6 h-6 text-indigo-400" />}
                            {item.type === 'diet' && <Apple className="w-6 h-6 text-emerald-400" />}
                            {item.type === 'video' && <Video className="w-6 h-6 text-orange-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className={cn("text-base font-black truncate w-full", item.status === 'new' ? "text-white" : "text-slate-300")}>
                                {item.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-[10px] bg-slate-800/50 border-white/10 text-slate-400 py-0 h-5" dir="rtl">
                                    <Star className="w-3 h-3 mr-1 text-yellow-500" /> {item.coach}
                                </Badge>
                            </div>
                        </div>
                        <div className="shrink-0 text-white/20 group-hover/item:text-white transition-colors">
                            <ChevronLeft className="w-6 h-6" />
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
          </div>
          
          {/* UPLOAD ACTION BAR */}
          <div className="p-4 border-t border-white/5 bg-slate-900/80 backdrop-blur-sm">
            <AnimatePresence mode="wait">
              {showSuccessToast ? (
                <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col items-center justify-center gap-1 text-emerald-400 bg-emerald-500/10 py-3 rounded-xl border border-emerald-500/20">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /><span className="font-bold text-sm">تم إرسال الملف لمدربك بنجاح!</span></div>
                  <span className="text-[10px] text-emerald-500/80">سيتم إشعارك فور تحليله.</span>
                </motion.div>
              ) : isUploading ? (
                <motion.div key="uploading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3 py-2">
                   <div className="flex justify-between text-xs font-bold text-orange-400">
                      <span>جاري الرفع للذكاء الاصطناعي...</span><span>{Math.round(uploadProgress)}%</span>
                   </div>
                   <Progress value={uploadProgress} className="h-2 bg-slate-800" indicatorColor="bg-gradient-to-r from-orange-500 to-rose-500" />
                </motion.div>
              ) : (
                <Button key="btn" onClick={triggerUpload} className="w-full bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-400 hover:to-rose-500 text-white shadow-xl shadow-orange-500/20 flex flex-col items-center justify-center gap-1 h-auto py-3 rounded-xl border-none group">
                    <div className="flex items-center gap-2"><Upload className="w-5 h-5 text-white group-hover:-translate-y-1 transition-transform animate-bounce" /><span className="font-bold">إرسال فيديو للتحليل المباشر</span></div>
                    <span className="text-[9px] text-white/70 tracking-widest uppercase">Select a file from your device</span>
                </Button>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Deep Report Modals */}
      <DeepTrainingReportSheet isOpen={activeReport?.type === 'training'} onClose={closeReport} data={mockPlans.find(p => p.id === activeReport?.id)} />
      <DeepDietReportSheet isOpen={activeReport?.type === 'diet'} onClose={closeReport} data={mockDiets.find(d => d.id === activeReport?.id)} />
      <DeepVideoReportSheet isOpen={activeReport?.type === 'video'} onClose={closeReport} data={mockVideos.find(v => v.id === activeReport?.id)} />
    </>
  );
}
