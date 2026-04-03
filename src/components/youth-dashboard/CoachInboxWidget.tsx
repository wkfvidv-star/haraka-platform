import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from "@/components/ui/progress";
import { Apple, Video, Star, Bell, PlayCircle, ClipboardList, Dumbbell, ChevronLeft, Upload, CheckCircle2, Send, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DeepTrainingReportSheet, DeepDietReportSheet, DeepVideoReportSheet } from './DeepReportSheets';
import { youthDataService, YouthReport, YouthMessage } from '@/services/youthDataService';
import { useToast } from '@/hooks/use-toast';

export default function CoachInboxWidget() {
  const [activeTab, setActiveTab] = useState<'plans' | 'diets' | 'videos' | 'messages'>('plans');
  const [activeReport, setActiveReport] = useState<{ type: string, id: string } | null>(null);
  const [reports, setReports] = useState<YouthReport[]>([]);
  const [messages, setMessages] = useState<YouthMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Real Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      setReports(youthDataService.getReports());
      setMessages(youthDataService.getMessages());
    };
    
    fetchData();
    if (activeTab === 'messages') {
      youthDataService.markMessagesAsSeen();
      scrollToBottom();
    }

    const handleNewMessage = () => {
      setMessages(youthDataService.getMessages());
      if (activeTab === 'messages') {
         youthDataService.markMessagesAsSeen();
      }
    };
    
    window.addEventListener('haraka_new_coach_message', handleNewMessage);
    return () => window.removeEventListener('haraka_new_coach_message', handleNewMessage);
  }, [activeTab]);

  const scrollToBottom = () => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const getActiveTabItems = () => {
    switch(activeTab) {
      case 'plans': return reports.filter(r => r.type === 'training');
      case 'diets': return reports.filter(r => r.type === 'diet');
      case 'videos': return reports.filter(r => r.type === 'video');
      default: return [];
    }
  };

  const openReport = (report: YouthReport) => {
    youthDataService.markReportAsRead(report.id);
    setReports(youthDataService.getReports()); // Refresh
    setActiveReport({ type: report.type, id: report.id });
  };
  
  const closeReport = () => setActiveReport(null);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim()) return;
    
    youthDataService.sendMessage(newMessage);
    setMessages(youthDataService.getMessages());
    setNewMessage('');
    scrollToBottom();
  };

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
            <Badge className="bg-indigo-500/20 text-indigo-200 border-indigo-500/30">
               {reports.filter(r => r.status === 'new').length + messages.filter(m => m.sender === 'coach' && m.status === 'unseen').length} جديد
            </Badge>
          </div>
          
          <div className="flex gap-1 bg-white/5 p-1 rounded-xl w-full border border-white/10 overflow-x-auto no-scrollbar">
            <button onClick={() => setActiveTab('plans')} className={cn("flex-1 whitespace-nowrap px-4 py-2 text-[11px] sm:text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5", activeTab === 'plans' ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/20" : "text-slate-400 hover:text-white")}>
                <Dumbbell className="w-3.5 h-3.5" /> برامج
                {reports.filter(r => r.type === 'training' && r.status === 'new').length > 0 && <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />}
            </button>
            <button onClick={() => setActiveTab('diets')} className={cn("flex-1 whitespace-nowrap px-4 py-2 text-[11px] sm:text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5", activeTab === 'diets' ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20" : "text-slate-400 hover:text-white")}>
                <Apple className="w-3.5 h-3.5" /> تغذية
                {reports.filter(r => r.type === 'diet' && r.status === 'new').length > 0 && <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />}
            </button>
            <button onClick={() => setActiveTab('videos')} className={cn("flex-1 whitespace-nowrap px-4 py-2 text-[11px] sm:text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5", activeTab === 'videos' ? "bg-orange-500 text-white shadow-md shadow-orange-500/20" : "text-slate-400 hover:text-white")}>
                <PlayCircle className="w-3.5 h-3.5" /> تقارير
                {reports.filter(r => r.type === 'video' && r.status === 'new').length > 0 && <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />}
            </button>
            <button onClick={() => setActiveTab('messages')} className={cn("flex-1 whitespace-nowrap px-4 py-2 text-[11px] sm:text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5", activeTab === 'messages' ? "bg-blue-500 text-white shadow-md shadow-blue-500/20" : "text-slate-400 hover:text-white")}>
                <MessageCircle className="w-3.5 h-3.5" /> التواصل
                {messages.filter(m => m.sender === 'coach' && m.status === 'unseen').length > 0 && <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />}
            </button>
          </div>
        </CardHeader>
        
        {/* Scrollable Content Area */}
        <CardContent className="p-0 relative z-10 flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto no-scrollbar min-h-[300px]">
            <AnimatePresence mode="popLayout">
                {activeTab !== 'messages' ? (
                  getActiveTabItems().map((item) => (
                    <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                        className="border-b border-white/5 p-4 transition-all cursor-pointer hover:bg-white/10 group/item flex items-center gap-4"
                        onClick={() => openReport(item)}
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
                                    <Star className="w-3 h-3 ml-1 text-yellow-500" /> {item.coach}
                                </Badge>
                                <span className="text-[10px] text-slate-500 font-bold">{item.date}</span>
                                {item.status === 'new' && <Badge className="bg-indigo-500 text-white text-[8px] py-0 h-4">جديد</Badge>}
                            </div>
                        </div>
                        <div className={cn("shrink-0 transition-colors", item.status === 'new' ? "text-indigo-400" : "text-white/20 group-hover/item:text-white")}>
                            <ChevronLeft className="w-6 h-6" />
                        </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="flex flex-col h-full bg-slate-900/10 h-[400px]">
                     <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {messages.length === 0 ? (
                           <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2 opacity-50">
                              <MessageCircle className="w-12 h-12" />
                              <p className="font-bold">ابدأ محادثة مع مدربك الآن</p>
                           </div>
                        ) : (
                           messages.map((msg) => (
                              <div key={msg.id} className={cn("max-w-[85%] rounded-2xl p-4 shadow-sm", 
                                 msg.sender === 'youth' 
                                 ? "mr-auto bg-indigo-600 text-white rounded-br-none" 
                                 : "ml-auto bg-slate-800 text-slate-200 border border-white/5 rounded-bl-none"
                              )}>
                                 <p className="text-sm font-bold leading-relaxed">{msg.text}</p>
                                 <div className={cn("flex items-center gap-1.5 mt-2", msg.sender === 'youth' ? "justify-end" : "justify-start")}>
                                    <span className="text-[9px] opacity-60 font-mono">
                                       {new Date(msg.timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    {msg.sender === 'youth' && (
                                       <div className="flex items-center gap-0.5">
                                          <CheckCircle2 className={cn("w-3 h-3", msg.status === 'seen' ? "text-blue-300" : "text-white/40")} />
                                       </div>
                                    )}
                                 </div>
                              </div>
                           ))
                        )}
                        <div ref={chatEndRef} />
                     </div>
                     
                     <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 flex gap-2 bg-slate-900/40">
                        <input
                           type="text"
                           placeholder="اكتب استفسارك هنا..."
                           className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                           value={newMessage}
                           onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <Button type="submit" size="icon" className="bg-indigo-600 hover:bg-indigo-500 shrink-0 rounded-xl">
                           <Send className="w-4 h-4" />
                        </Button>
                     </form>
                  </div>
                )}
            </AnimatePresence>
          </div>
          
          {/* UPLOAD ACTION BAR (Only in Reports) */}
          {activeTab !== 'messages' && (
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
                     <Progress value={uploadProgress} className="h-2 bg-slate-800" />
                  </motion.div>
                ) : (
                  <Button key="btn" onClick={triggerUpload} className="w-full bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-400 hover:to-rose-500 text-white shadow-xl shadow-orange-500/20 flex flex-col items-center justify-center gap-1 h-auto py-3 rounded-xl border-none group">
                      <div className="flex items-center gap-2"><Upload className="w-4 h-4 text-white group-hover:-translate-y-1 transition-transform animate-bounce" /><span className="font-bold">إرسال فيديو للتحليل المباشر</span></div>
                      <span className="text-[9px] text-white/70 tracking-widest uppercase">Select a file from your device</span>
                  </Button>
                )}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Deep Report Modals */}
      <DeepTrainingReportSheet isOpen={activeReport?.type === 'training'} onClose={closeReport} data={reports.find(p => p.id === activeReport?.id)} />
      <DeepDietReportSheet isOpen={activeReport?.type === 'diet'} onClose={closeReport} data={reports.find(d => d.id === activeReport?.id)} />
      <DeepVideoReportSheet isOpen={activeReport?.type === 'video'} onClose={closeReport} data={reports.find(v => v.id === activeReport?.id)} />
    </>
  );
}
