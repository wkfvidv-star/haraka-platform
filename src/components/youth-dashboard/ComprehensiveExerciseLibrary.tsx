import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Brain, HeartPulse, Wind, Play, Lock, ChevronLeft, ShieldCheck, Dumbbell, Zap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type Category = 'motor' | 'rehab' | 'cognitive' | 'psychological';

export default function ComprehensiveExerciseLibrary() {
  const [activeCategory, setActiveCategory] = useState<Category>('motor');
  const { toast } = useToast();

  const categories = [
    { id: 'motor', label: 'الأداء الحركي', icon: Activity, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
    { id: 'rehab', label: 'التأهيل الحركي', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { id: 'cognitive', label: 'الأداء المعرفي', icon: Brain, color: 'text-indigo-500', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
    { id: 'psychological', label: 'الدعم النفسي', icon: Wind, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  ];

  const libraryData = {
    motor: [
        { id: 'm1', title: 'القفز العمودي (Sargeant Jump)', level: 'متقدم', duration: '15 دقيقة', icon: Zap, focus: 'القوة الانفجارية', plays: 1205 },
        { id: 'm2', title: 'اختبار T-Test', level: 'متوسط', duration: '20 دقيقة', icon: Activity, focus: 'الرشاقة وتغيير الاتجاه', plays: 890 },
        { id: 'm3', title: 'الجري المكوكي 10 متر × 4', level: 'متقدم', duration: '25 دقيقة', icon: Zap, focus: 'السرعة', plays: 2400 },
        { id: 'm4', title: 'سكوات الجدار (Wall Sit)', level: 'مبتدئ', duration: '10 دقائق', icon: Dumbbell, focus: 'القوة التحملية', plays: 3100 },
        { id: 'm5', title: 'تمرين بلانك 45 ثانية', level: 'متوسط', duration: '15 دقيقة', icon: ShieldCheck, focus: 'قوة وتوازن الجذع', plays: 4500 },
    ],
    rehab: [
        { id: 'r1', title: 'التأهيل: مد الذراعين من الجلوس', level: 'علاجي', duration: '15 دقيقة', icon: ShieldCheck, focus: 'المرونة ومرونة المفاصل', plays: 450, locked: false },
        { id: 'r2', title: 'توازن الطائر الفلامنغو (Stork Stand)', level: 'علاجي', duration: '20 دقيقة', icon: HeartPulse, focus: 'التوازن وتأهيل الكاحل', plays: 320, locked: false },
        { id: 'r3', title: 'تأهيل الرباط الصليبي (مرحلة 3)', level: 'علاجي متقدم', duration: '35 دقيقة', icon: ShieldCheck, focus: 'ثبات الركبة', plays: 150, locked: true },
    ],
    cognitive: [
        { id: 'c1', title: 'رمي واستقبال الكرات', level: 'دقيق', duration: '10 دقائق', icon: Brain, focus: 'التوافق اليدوي-العيني (الحركي-المعرفي)', plays: 5400 },
        { id: 'c2', title: 'انتباه مزدوج (Dual Tasking)', level: 'متقدم', duration: '15 دقيقة', icon: Brain, focus: 'التركيز وتعدد المهام', plays: 3100 },
    ],
    psychological: [
        { id: 'p1', title: 'التصور الذهني للمباراة (Visualization)', level: 'احترافي', duration: '20 دقيقة', icon: Wind, focus: 'الاستعداد الذهني وتقليل التوتر', plays: 1200 },
        { id: 'p2', title: 'تنظيم التنفس الاسترجاعي', level: 'أساسي', duration: '10 دقائق', icon: Wind, focus: 'الهدوء الانفعالي ودقات القلب', plays: 8900 },
    ]
  };

  const handlePlay = (locked: boolean, title: string) => {
    if (locked) {
        toast({ title: "محتوى مقفل", description: "يجب إنهاء المراحل السابقة من بروتوكول التأهيل للوصول لهذا التمرين.", variant: "destructive" });
    } else {
        toast({ title: "جاري التحميل...", description: `فتح: ${title}` });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700" dir="rtl">
        {/* Header Segment */}
        <Card className="bg-slate-900 border border-white/10 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
            <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/5">
                            <Activity className="w-6 h-6 text-emerald-400" />
                        </div>
                        المكتبة الشاملة للتمارين
                    </h2>
                    <p className="text-slate-400 mt-2 font-medium max-w-lg">
                        منصة موحدة تحتوي على جميع التمارين في مجالات الأداء الحركي، التأهيل، التحفيز الذهني والدعم النفسي. مقسّمة علمياً لسهولة الوصول.
                    </p>
                </div>
            </CardContent>
        </Card>

        {/* Category Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id as Category)}
                        className={cn(
                            "p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all border-2",
                            isActive ? cn("bg-slate-800 border-white/20 shadow-lg scale-[1.02]", cat.color) : "bg-slate-900/50 border-white/5 text-slate-400 hover:bg-slate-800/80 hover:border-white/10 hover:text-white"
                        )}
                    >
                        <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mb-1", isActive ? cat.bg : "bg-slate-800")}>
                            <cat.icon className={cn("w-6 h-6", isActive ? cat.color : "text-slate-500")} />
                        </div>
                        <span className="font-black text-sm">{cat.label}</span>
                    </button>
                )
            })}
        </div>

        {/* Exercises Grid */}
        <div className="mt-8">
            <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                {categories.find(c => c.id === activeCategory)?.icon && React.createElement(categories.find(c => c.id === activeCategory)!.icon, { className: cn("w-5 h-5", categories.find(c => c.id === activeCategory)?.color) })}
                تمارين {categories.find(c => c.id === activeCategory)?.label}
            </h3>
            
            <AnimatePresence mode="popLayout">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {libraryData[activeCategory].map((exe: any, i) => (
                        <motion.div
                            key={exe.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden group hover:border-white/20 transition-all cursor-pointer h-full flex flex-col">
                                <div className="h-32 bg-slate-800 relative flex items-center justify-center overflow-hidden">
                                    <exe.icon className="w-16 h-16 text-white/5 group-hover:scale-110 transition-transform duration-500" />
                                    {exe.locked && (
                                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
                                            <Lock className="w-8 h-8 text-slate-400" />
                                        </div>
                                    )}
                                </div>
                                <CardContent className="p-5 flex-1 flex flex-col relative z-10 bg-slate-900">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-white text-base leading-tight group-hover:text-emerald-400 transition-colors">{exe.title}</h4>
                                    </div>
                                    <div className="space-y-2 mt-2 flex-1">
                                        <div className="flex items-center justify-between text-xs font-bold">
                                            <span className="text-slate-500">مستوى الصعوبة:</span>
                                            <span className={cn(
                                                exe.level === 'متقدم' || exe.level.includes('احتراف') ? "text-orange-400" :
                                                exe.level.includes('علاج') ? "text-emerald-400" : "text-indigo-400"
                                            )}>{exe.level}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs font-bold">
                                            <span className="text-slate-500">نطاق التركيز:</span>
                                            <span className="text-slate-300">{exe.focus}</span>
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-500">{exe.duration}</span>
                                        <Button 
                                            size="sm" 
                                            variant={exe.locked ? 'secondary' : 'default'}
                                            onClick={() => handlePlay(exe.locked, exe.title)}
                                            className={cn("h-8 rounded-lg px-4 gap-2 font-bold", exe.locked ? "bg-slate-800 text-slate-500" : "bg-emerald-600 hover:bg-emerald-700 text-white")}
                                        >
                                            {exe.locked ? <Lock className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                                            {exe.locked ? 'مُقفل' : 'بدء التمرين'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </AnimatePresence>
        </div>
    </div>
  );
}
