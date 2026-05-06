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
    toast.success(`تم استيراد "${res.title}" إلى مكتبتك بنجاح!`);
  };

  const filteredResources = activeType === 'all' 
    ? resources 
    : resources.filter(r => r.type === activeType);

  return (
    <div className="space-y-8 pb-10" dir="rtl">
      
      {/* ── Header Strategy ── */}
      <div className="relative overflow-hidden bg-slate-950 rounded-[2.5rem] p-10 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] -ml-32 -mb-32" />
        
        <div className="relative z-10 max-w-3xl">
          <Badge className="bg-blue-500/20 text-blue-300 border-none mb-4 px-4 py-1 font-bold">مركز موارد الأساتذة 📚</Badge>
          <h1 className="text-4xl font-black mb-4 tracking-tight leading-tight">اكتشف أفضل المناهج والتمارين الحركية لطلابك</h1>
          <p className="text-slate-400 text-lg font-medium leading-relaxed">
            استعرض آلاف الموارد التعليمية المعتمدة من وزارة التربية والزملاء الأساتذة لرفع كفاءة حصص التربية البدنية.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ── Filter Sidebar ── */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
            <CardHeader className="p-6 border-b border-slate-50">
              <CardTitle className="text-lg font-black flex items-center gap-2">
                <Filter className="w-5 h-5 text-blue-600" /> تصفية المحتوى
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {[
                { id: 'all', label: 'الكل', icon: Globe },
                { id: 'lesson', label: 'دروس نموذجية', icon: BookOpen },
                { id: 'exercise', label: 'تمارين حركية', icon: Activity },
                { id: 'curriculum', label: 'مناهج فصلية', icon: ClipboardCheck },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveType(t.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm",
                    activeType === t.id 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-900/10" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <t.icon className="w-4 h-4" />
                  {t.label}
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 border-none rounded-3xl p-6 text-white shadow-xl shadow-blue-900/20">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                   <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="font-black text-sm">مساعد الذكاء الاصطناعي</h4>
             </div>
             <p className="text-blue-50 text-xs font-medium leading-relaxed mb-6">
                "بناءً على أداء قسمك الأخير، ننصحك بتحميل 'دليل التوازن الأساسي' لتقوية مهارات التلاميذ الحركية."
             </p>
             <Button variant="secondary" className="w-full font-black text-blue-900 bg-white hover:bg-blue-50 rounded-xl">إنشاء منهج مخصص</Button>
          </Card>
        </div>

        {/* ── Main Content Area ── */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Search Bar */}
          <div className="relative group">
            <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text" 
              placeholder="ابحث عن درس، تمرين، أو أستاذ..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-16 bg-white border border-slate-100 rounded-3xl pr-14 pl-6 font-bold text-slate-900 shadow-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
            />
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredResources.map((res) => (
                <motion.div
                  layout
                  key={res.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl shadow-inner border border-slate-100 group-hover:scale-110 transition-transform">
                      {res.thumbnail}
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-black">
                      <Star className="w-3 h-3 fill-amber-600" /> {res.rating}
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">{res.title}</h3>
                  <p className="text-slate-500 text-sm font-medium mb-6 flex items-center gap-2">
                    بواسطة <span className="text-slate-900 font-bold">{res.author}</span>
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {res.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="bg-slate-50 text-slate-500 border-slate-100 font-bold text-[10px] px-3">#{tag}</Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-2 text-slate-400 font-bold text-xs">
                      <Download className="w-4 h-4" /> {res.downloads.toLocaleString()} تحميل
                    </div>
                    <Button 
                      onClick={() => handleDownload(res)}
                      className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs gap-2 px-6 h-10 shadow-lg shadow-blue-900/10"
                    >
                      استيراد <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

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
