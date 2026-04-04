import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Star, MapPin, Phone, Award, 
  ChevronRight, Brain, Zap, Target, Shield,
  CheckCircle2, Info, ShoppingBag, ArrowRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { parentDataService, Coach, Child } from '@/services/parentDataService';

interface MarketplaceProps {
  selectedChild?: Child;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ selectedChild }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);

  useEffect(() => {
    setCoaches(parentDataService.getCoaches());
  }, []);

  const filteredCoaches = coaches.filter(c => {
    const matchesSearch = c.name.includes(searchQuery) || c.specialty.includes(searchQuery);
    const matchesFilter = activeFilter === 'all' || c.specialty.includes(activeFilter);
    return matchesSearch && matchesFilter;
  });

  const getMatchReport = (coach: Coach) => {
    if (!selectedChild) return "اختر طفلاً لرؤية تقرير التوافق الذكي";
    
    if (coach.specialty.includes('كرة قدم') && selectedChild.targetGoal === 'تحسين اللياقة') {
      return "هذا المدرب مثالي لتحسين اللياقة البدنية والعمل الجماعي، كما أن برنامجه يتوافق مع أوقات فراغ أحمد.";
    }
    if (coach.specialty.includes('يوغا') && selectedChild.performance.psychological < 85) {
      return "تم اقتراح هذا المدرب بناءً على حاجة الطفل لزيادة الهدوء النفسي والتركيز، وهو ما يتوافق مع تقييماته الأخيرة.";
    }
    if (coach.aiMatchScore > 90) {
      return `توافق عالي جداً بنسبة ${coach.aiMatchScore}% بناءً على نمط نشاط الطفل وأهدافه الميدانية.`;
    }
    return `توافق جيد بنسبة ${coach.aiMatchScore}% مع احتياجات الطفل الحالية.`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700" dir="rtl">
      {/* 🚀 Header Section */}
      <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-blue-600 to-indigo-800 p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full blur-[120px]" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-blue-400 rounded-full blur-[100px]" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-right space-y-4">
            <Badge className="bg-white/20 text-white border-white/10 px-4 py-1.5 backdrop-blur-md font-bold text-xs uppercase tracking-widest">
              الذكاء الاصطناعي في خدمتك
            </Badge>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
              ابحث عن المدرب <br />الأمثل لأطفالك
            </h1>
            <p className="text-blue-100 max-w-md font-medium text-lg leading-relaxed opacity-90">
              نظامنا يحلل أداء أطفالك ليقترح عليك أفضل المدربين المتوافقين مع احتياجاتهم البدنية والنفسية.
            </p>
          </div>
          
          <div className="w-full md:w-auto flex flex-col gap-4">
            <div className="relative group">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
              <Input 
                placeholder="ابحث بالاسم أو التخصص..." 
                className="w-full md:w-80 h-14 pr-12 pl-4 rounded-2xl bg-white/95 border-none shadow-xl text-slate-900 font-bold placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-blue-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" className="flex-1 h-12 rounded-xl bg-white/10 hover:bg-white/20 text-white border-white/10 backdrop-blur-md font-black">
                <Filter className="w-4 h-4 ml-2" />
                تصفية متقدمة
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 🧩 Filter Categories */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2">
        {['all', 'كرة قدم', 'جمباز', 'يوغا', 'تنس', 'سباحة'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-6 py-3 rounded-full font-black text-sm transition-all whitespace-nowrap
              ${activeFilter === cat 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'}`}
          >
            {cat === 'all' ? 'الكل' : cat}
          </button>
        ))}
      </div>

      {/* 🏆 Coaches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredCoaches.map((coach) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={coach.id}
            >
              <Card className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden group hover:border-blue-500/30 transition-all duration-500 shadow-xl hover:shadow-blue-500/10">
                <CardContent className="p-0">
                  {/* Card Top: AI Match Score */}
                  <div className="relative h-48 bg-gradient-to-br from-slate-800 to-slate-950 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000')] bg-cover bg-center opacity-20 transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                    
                    <div className="absolute top-6 right-6">
                      <div className="relative w-16 h-16 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="32" cy="32" r="28" className="stroke-white/10 fill-none" strokeWidth="4" />
                          <circle 
                            cx="32" cy="32" r="28" 
                            className="stroke-blue-500 fill-none" 
                            strokeWidth="4" 
                            strokeDasharray={`${(coach.aiMatchScore / 100) * 176} 176`}
                            strokeLinecap="round" 
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-xs font-black text-white">{coach.aiMatchScore}%</span>
                          <span className="text-[6px] font-bold text-blue-400 uppercase tracking-widest">تطابق</span>
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-6 right-6">
                      <h3 className="text-xl font-black text-white">{coach.name}</h3>
                      <p className="text-blue-400 font-bold text-sm">{coach.specialty}</p>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-6">
                    {/* AI Feedback Report (New Feature) */}
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex items-start gap-4">
                      <div className="p-2 bg-blue-500/20 rounded-xl text-blue-400 shrink-0">
                        <Brain className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-1">لماذا اخترنا هذا المدرب؟</p>
                        <p className="text-xs text-white leading-relaxed font-medium">
                          {getMatchReport(coach)}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="text-white">{coach.rating}</span>
                        <span>({coach.sessions} جلسة)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{coach.location.split('—')[1] || coach.location}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <div className="text-right">
                        <p className="text-[10px] text-slate-500 font-bold uppercase">السعر لكل حصة</p>
                        <p className="text-lg font-black text-white">{coach.price.toLocaleString()} دج</p>
                      </div>
                      <Button 
                        onClick={() => setSelectedCoach(coach)}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black flex items-center gap-2 group/btn"
                      >
                        حجز الحصة
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 📅 Booking Modal Placeholder */}
      <AnimatePresence>
        {selectedCoach && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
               onClick={() => setSelectedCoach(null)}
             />
             <motion.div
               initial={{ scale: 0.9, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 20 }}
               className="bg-slate-900 border border-white/10 rounded-[40px] w-full max-w-lg p-8 relative z-10 overflow-hidden"
             >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl" />
                
                <h3 className="text-2xl font-black text-white mb-2">تأكيد الموعد</h3>
                <p className="text-slate-400 font-medium mb-8">اختر الموعد المتاح للمدرب {selectedCoach.name}</p>
                
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {selectedCoach.available.map(slot => (
                    <button 
                      key={slot}
                      className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-blue-600 hover:border-blue-600 hover:text-white text-slate-300 font-bold transition-all"
                    >
                      {slot}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-3">
                   <Button className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg">
                      تأكيد الحجز
                   </Button>
                   <Button 
                    variant="ghost" 
                    onClick={() => setSelectedCoach(null)}
                    className="w-full h-12 rounded-2xl text-slate-500 hover:text-white font-bold"
                   >
                    إلغاء
                   </Button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
