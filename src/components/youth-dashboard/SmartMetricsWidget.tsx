import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bluetooth, Watch, Activity, PlusCircle, CheckCircle, Smartphone, Wifi, Loader2, Heart, Moon, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export function SmartMetricsWidget() {
  const [isScanning, setIsScanning] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isWearableModalOpen, setIsWearableModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  
  const [manualData, setManualData] = useState({ weight: '', sleep: '', bpm: '' });
  const [isSaving, setIsSaving] = useState(false);
  
  const mockDevices = [
    { id: 1, name: 'Garmin Forerunner 955', type: 'Watch', signal: 95 },
    { id: 2, name: 'Apple Watch Series 8', type: 'Watch', signal: 82 },
    { id: 3, name: 'Polar H10 Heart Strap', type: 'Strap', signal: 60 }
  ];

  const handleStartScan = () => {
    setIsScanning(true);
    // Fake scanning delay
    setTimeout(() => {
       setIsScanning(false);
    }, 4000);
  };

  const handleConnectDevice = (id: number) => {
    setIsScanning(true);
    setTimeout(() => {
       setIsScanning(false);
       setIsConnected(true);
       setIsWearableModalOpen(false);
    }, 1500);
  };

  const handleSaveManual = () => {
     setIsSaving(true);
     setTimeout(() => {
        setIsSaving(false);
        setIsManualModalOpen(false);
        setManualData({ weight: '', sleep: '', bpm: '' });
     }, 1000);
  };

  return (
    <>
      <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-sm relative overflow-hidden group mb-5">
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/20 transition-colors" />
        
        <CardHeader className="pb-3 border-b border-white/5">
          <CardTitle className="text-white text-base flex items-center gap-2 font-black tracking-tight">
            <Activity className="w-5 h-5 text-blue-400" />
            المعلومات الحيوية
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-4 flex flex-col gap-3">
          {/* Wearable Dialog Trigger */}
          <Dialog open={isWearableModalOpen} onOpenChange={setIsWearableModalOpen}>
             <DialogTrigger asChild>
                <Button 
                  onClick={() => !isConnected && handleStartScan()}
                  variant="outline"
                  className={`w-full flex items-center justify-between px-4 py-6 border transition-all h-auto ${
                    isConnected 
                      ? 'bg-blue-500/10 border-blue-500/30 text-blue-300 hover:bg-blue-500/20' 
                      : 'bg-slate-900 border-white/10 hover:border-blue-500/50 hover:bg-white/5 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${isConnected ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-slate-400'}`}>
                      <Watch className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col items-start leading-none gap-1">
                      <span className="font-bold text-sm">{isConnected ? 'تم الاتصال (Garmin 955)' : 'ربط سوار ذكي'}</span>
                      <span className="text-[10px] text-slate-400 whitespace-normal text-right leading-tight">
                        {isConnected ? 'المزامنة الحية مفعلة لبياناتك' : 'اضغط للبحث عن أجهزة Apple, Garmin, Polar'}
                      </span>
                    </div>
                  </div>
                  {isConnected ? (
                    <CheckCircle className="w-5 h-5 text-blue-400 shrink-0" />
                  ) : (
                    <Bluetooth className="w-5 h-5 text-slate-500 shrink-0 group-hover:text-blue-400 transition-colors" />
                  )}
                </Button>
             </DialogTrigger>
             
             {/* Wearable Modal Content */}
             {!isConnected && (
                 <DialogContent className="bg-slate-950/90 backdrop-blur-3xl border border-white/10 text-white sm:max-w-md" dir="rtl">
                    <DialogHeader>
                       <DialogTitle className="flex items-center gap-2 text-xl"><Bluetooth className="text-blue-400" /> رادار التقاط الأجهزة</DialogTitle>
                       <DialogDescription className="text-slate-400 text-xs">
                          تأكد من تفعيل البلوتوث في جهازك القابل للارتداء وجعله في وضع الاقتران.
                       </DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-6 flex flex-col items-center justify-center min-h-[200px] relative">
                        <AnimatePresence mode="wait">
                           {isScanning ? (
                              <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4">
                                  <div className="relative flex items-center justify-center">
                                     <div className="absolute w-32 h-32 border border-blue-500/30 rounded-full animate-ping" />
                                     <div className="absolute w-24 h-24 border border-blue-500/50 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
                                     <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center border-2 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                                        <Smartphone className="text-blue-400 w-8 h-8" />
                                     </div>
                                  </div>
                                  <div className="text-sm font-bold text-blue-400 animate-pulse mt-4">جاري مسح المحيط...</div>
                              </motion.div>
                           ) : (
                              <motion.div key="results" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full space-y-2">
                                 {mockDevices.map((dev) => (
                                    <button key={dev.id} onClick={() => handleConnectDevice(dev.id)} className="w-full bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 p-4 rounded-2xl flex items-center justify-between group transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-300 group-hover:text-blue-400 transition-colors">
                                                <Watch className="w-5 h-5" />
                                            </div>
                                            <div className="text-right flex flex-col justify-center">
                                                <div className="font-bold text-sm text-slate-200 group-hover:text-white transition-colors">{dev.name}</div>
                                                <div className="text-[10px] text-slate-500 flex items-center gap-1"><Wifi className="w-3 h-3" /> إشارة قوية</div>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs px-4 h-8">ربط</Button>
                                    </button>
                                 ))}
                                 <div className="text-center mt-4">
                                     <Button variant="link" onClick={handleStartScan} className="text-slate-400 text-xs hover:text-white">إعادة البحث</Button>
                                 </div>
                              </motion.div>
                           )}
                        </AnimatePresence>
                    </div>
                 </DialogContent>
             )}
          </Dialog>

          {/* Manual Modal Trigger */}
          <Dialog open={isManualModalOpen} onOpenChange={setIsManualModalOpen}>
             <DialogTrigger asChild>
                <Button 
                  variant="ghost"
                  className="w-full bg-slate-800/50 hover:bg-slate-800 text-slate-300 border border-white/5 hover:border-white/10 justify-start gap-3 py-6 group transition-all h-auto"
                >
                  <div className="w-10 h-10 shrink-0 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                    <PlusCircle className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex flex-col items-start leading-none gap-1">
                    <span className="font-bold text-sm">إضافة مؤشرات يدوياً</span>
                    <span className="text-[10px] text-slate-400 whitespace-normal text-right leading-tight">سجل وزنك، ساعات التدريب والنوم بدقة</span>
                  </div>
                </Button>
             </DialogTrigger>
             
             {/* Manual Info Modal Content */}
             <DialogContent className="bg-slate-950/95 backdrop-blur-3xl border border-white/10 text-white sm:max-w-md overflow-y-auto max-h-[90vh] custom-scrollbar" dir="rtl">
                <DialogHeader>
                   <DialogTitle className="flex items-center gap-2 text-xl"><Activity className="text-orange-400" /> تسجيل المؤشرات اليومية</DialogTitle>
                   <DialogDescription className="text-slate-400 text-xs">
                      سيتم تحليل هذه البيانات بواسطة الذكاء الاصطناعي لتكييف خطتك الرياضية فوراً.
                   </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4 mt-2">
                   <div className="grid gap-2">
                       <Label htmlFor="weight" className="text-slate-300 font-bold flex items-center gap-2"><Scale className="w-4 h-4 text-emerald-400"/> وزن الجسم الحالي (كغ)</Label>
                       <Input id="weight" type="number" value={manualData.weight} onChange={(e) => setManualData({...manualData, weight: e.target.value})} className="bg-slate-900 border-white/10 focus:border-orange-500 rounded-xl" placeholder="مثال: 72.5" />
                   </div>
                   <div className="grid gap-2">
                       <Label htmlFor="sleep" className="text-slate-300 font-bold flex items-center gap-2"><Moon className="w-4 h-4 text-indigo-400"/> ساعات النوم ليلاً</Label>
                       <Input id="sleep" type="number" value={manualData.sleep} onChange={(e) => setManualData({...manualData, sleep: e.target.value})} className="bg-slate-900 border-white/10 focus:border-orange-500 rounded-xl" placeholder="مثال: 7.5" />
                   </div>
                   <div className="grid gap-2">
                       <Label htmlFor="bpm" className="text-slate-300 font-bold flex items-center gap-2"><Heart className="w-4 h-4 text-rose-400"/> نبض القلب أثناء الراحة (BPM)</Label>
                       <Input id="bpm" type="number" value={manualData.bpm} onChange={(e) => setManualData({...manualData, bpm: e.target.value})} className="bg-slate-900 border-white/10 focus:border-orange-500 rounded-xl" placeholder="مثال: 62" />
                   </div>
                </div>
                
                <DialogFooter className="sm:justify-start pt-4 border-t border-white/5">
                   <Button onClick={handleSaveManual} className="w-full bg-gradient-to-r from-orange-500 to-rose-600 text-white font-bold rounded-xl h-12 shadow-lg hover:opacity-90">
                      {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'حفظ المؤشرات وتحليلها'}
                   </Button>
                </DialogFooter>
             </DialogContent>
          </Dialog>

        </CardContent>
      </Card>
    </>
  );
}
