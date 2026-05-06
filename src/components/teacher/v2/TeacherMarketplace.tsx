import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Search, Download, Star, Filter, 
  ArrowRight, Award, Zap, Brain, Globe, 
  ClipboardCheck, Share2, Plus, Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { marketplaceService, Resource } from '@/services/marketplaceService';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function TeacherMarketplace() {
  const [query, setQuery] = useState('');
  const [resources, setResources] = useState<Resource[]>([]);
  const [activeType, setActiveType] = useState<string | 'all'>('all');

  useEffect(() => {
    if (query.trim()) {
      setResources(marketplaceService.searchResources(query));
    } else {
      setResources(marketplaceService.getResources());
    }
  }, [query]);

  const handleDownload = (res: Resource) => {
    toast.success(`تم استيراد "${res.title}"! تم توفير حوالي 45 دقيقة من التحضير.`);
  };

  const filteredResources = activeType === 'all' 
    ? resources 
    : resources.filter(r => r.type === activeType);

  return (
    <div className="space-y-8 pb-10" dir="rtl">
      
      {/* ── Smart Header: Focus on Benefit ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('/images/grid-pattern.png')] opacity-10 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-black">
              <Sparkles className="w-4 h-4" /> مساعدك الرقمي لتوفير الوقت
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.1]">
              لا تحضر دروسك يدوياً بعد اليوم <span className="text-blue-400">Haraka سيفعل ذلك!</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium max-w-xl">
              سوق الموارد صُمم لخدمتك؛ حمّل مناهج جاهزة، تمارين مصممة بالذكاء الاصطناعي، ووفر أكثر من <span className="text-white font-bold">5 ساعات أسبوعياً</span> من العمل الإداري.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-900/40">استيراد منهج الأسبوع القادم 📅</Button>
              <Button variant="outline" className="h-14 px-8 border-white/10 bg-white/5 text-white hover:bg-white/10 font-black rounded-2xl">استشارة AI 🤖</Button>
            </div>
          </div>
          <div className="hidden lg:block w-72 h-72 bg-blue-500/20 rounded-[3rem] border border-white/10 rotate-3 flex items-center justify-center relative shadow-inner">
             <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <Brain className="w-32 h-32 text-blue-400" />
             </div>
             <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl -mr-10">
                <div className="flex items-center gap-3 mb-3">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                   <span className="text-[10px] font-black uppercase text-slate-400">توفير الوقت اليوم</span>
                </div>
                <div className="text-3xl font-black">+120د</div>
                <p className="text-[10px] text-slate-500 mt-1 font-bold">عبر استخدام المناهج الجاهزة</p>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ── Main Content Area ── */}
        <div className="lg:col-span-8 space-y-8">
          
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900">موارد جاهزة للاستخدام الفوري ⚡</h2>
            <div className="flex gap-2">
               <Badge className="bg-slate-100 text-slate-600 border-none font-bold">الأكثر كفاءة</Badge>
               <Badge className="bg-blue-50 text-blue-600 border-none font-bold">توصية AI</Badge>
            </div>
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredResources.map((res) => (
                <motion.div
                  layout
                  key={res.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:border-blue-100 transition-all group flex flex-col md:flex-row gap-8 items-center"
                >
                  <div className="w-24 h-24 rounded-3xl bg-slate-50 flex items-center justify-center text-5xl shrink-0 shadow-inner group-hover:bg-blue-50 transition-colors">
                    {res.thumbnail}
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-blue-600/10 text-blue-600 border-none text-[10px] px-3 py-1 font-black">
                        توفير {(res.id === 'res-1' ? 60 : res.id === 'res-2' ? 120 : 45)} دقيقة تحضير
                      </Badge>
                      <div className="flex items-center gap-1 text-amber-500 font-black text-sm">
                        <Star className="w-4 h-4 fill-amber-500" /> {res.rating}
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">{res.title}</h3>
                    
                    <div className="flex items-center gap-6 text-slate-500 font-bold text-xs">
                      <div className="flex items-center gap-2">
                         <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-900">{res.author.charAt(0)}</div>
                         {res.author}
                      </div>
                      <div className="flex items-center gap-2">
                         <Download className="w-4 h-4" /> {res.downloads.toLocaleString()} أستاذ استخدمه
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <Button 
                      onClick={() => handleDownload(res)}
                      className="rounded-2xl bg-slate-950 hover:bg-blue-600 text-white font-black text-sm px-8 h-14 shadow-xl transition-all"
                    >
                      تفعيل بنقرة واحدة <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Side: Why Use This? ── */}
        <div className="lg:col-span-4 space-y-6">
           <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden p-8">
              <h4 className="text-xl font-black text-slate-900 mb-6">كيف تستفيد اليوم؟ 💎</h4>
              <div className="space-y-6">
                 {[
                   { title: 'تحضير تلقائي', desc: 'استورد المناهج مباشرة إلى جدولك الدراسي.', icon: ClipboardCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                   { title: 'تقارير ذكية', desc: 'كل درس يأتي مع معايير تقييم جاهزة لبرنامج AI.', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
                   { title: 'تواصل مع الأولياء', desc: 'يتم إرسال ملخص النشاط للأولياء تلقائياً.', icon: Share2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                 ].map((item, i) => (
                   <div key={i} className="flex gap-4">
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", item.bg)}>
                         <item.icon className={cn("w-6 h-6", item.color)} />
                      </div>
                      <div>
                         <h5 className="font-black text-slate-900 text-sm mb-1">{item.title}</h5>
                         <p className="text-slate-500 text-[11px] font-bold leading-relaxed">{item.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </Card>

           <Card className="bg-slate-900 border-none rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform" />
              <div className="relative z-10">
                 <h4 className="text-lg font-black mb-2">هل تبحث عن تمرين محدد؟</h4>
                 <p className="text-slate-400 text-xs font-medium mb-6">دعنا ننشئ لك منهماً مخصصاً في ثوانٍ عبر محرك Haraka AI.</p>
                 <Button className="w-full h-12 bg-white text-slate-900 hover:bg-blue-50 font-black rounded-xl">جرب محرك التوليد 🪄</Button>
              </div>
           </Card>
        </div>

      </div>
    </div>
  );
}

function FileText(props: any) { return <BookOpen {...props} />; }


          {filteredResources.length === 0 && (
             <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <Search className="w-16 h-16 mb-4 opacity-20" />
                <h3 className="text-xl font-black">لم يتم العثور على نتائج</h3>
                <p className="font-medium">جرب كلمات بحث مختلفة أو تصفية أخرى</p>
             </div>
          )}
        </div>

      </div>
    </div>
  );
}

function Activity(props: any) { return <Zap {...props} />; }
