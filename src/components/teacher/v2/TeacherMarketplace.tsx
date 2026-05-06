import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Target, Zap, Brain, MessageSquare, 
  ArrowRight, Award, Star, Search, 
  MapPin, Eye, Activity, Send, GraduationCap,
  Briefcase, TrendingUp, BookOpen
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { marketplaceService, MarketStats, Lead } from '@/services/marketplaceService';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// ── Opportunity Card (Teacher's version of Lead) ──────────────────
function OpportunityCard({ lead, onInvite }: { lead: Lead, onInvite: (l: Lead) => void }) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg", lead.avatarColor)}>
          {lead.avatarInitials}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-black text-slate-900 text-xl">{lead.name}</h4>
            <Badge className="bg-blue-100 text-blue-600 border-none text-[10px] px-2 py-0">طالب مستهدف</Badge>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1 text-slate-400 text-xs font-bold">
              <MapPin className="w-3 h-3" /> {lead.location}
            </div>
            <div className="flex items-center gap-1 text-blue-500 text-xs font-black">
              <Brain className="w-3 h-3" /> {lead.matchScore}% توافق بيداغوجي
            </div>
          </div>
          <p className="text-slate-500 text-xs mt-3 font-medium leading-relaxed">
            هذا الطالب يظهر اهتماماً بـ {lead.goal === 'speed' ? 'تطوير السرعة' : 'اللياقة البدنية'} ويحتاج لتوجيه تربوي متخصص.
          </p>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          <Button 
            onClick={() => onInvite(lead)}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm gap-2 px-6 h-12 shadow-lg shadow-blue-900/10"
          >
            دعوة للبرنامج <Send className="w-4 h-4" />
          </Button>
          <Button variant="ghost" className="text-slate-400 font-bold text-xs hover:bg-slate-50">عرض الملف التربوي</Button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Teacher Marketplace ──────────────────────────────────────
export default function TeacherMarketplace() {
  const { user } = useAuth();
  const [stats, setStats] = useState<MarketStats | null>(null);
  const [opportunities, setOpportunities] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAvailableForExtra, setIsAvailableForExtra] = useState(true);

  useEffect(() => {
    setStats(marketplaceService.getMarketStats());
    if (searchQuery.trim()) {
      setOpportunities(marketplaceService.searchLeads(searchQuery));
    } else {
      setOpportunities(marketplaceService.getPotentialLeads('fitness')); // Default pedagogy
    }
  }, [searchQuery]);

  const handleInvite = (lead: Lead) => {
    toast.success(`تم إرسال دعوة تربوية لـ ${lead.name} بنجاح!`);
  };

  return (
    <div className="space-y-8 pb-10" dir="rtl">
      
      {/* ── Teacher Market Stats ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'ظهور في شبكة المدارس', val: '1,240', icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'زيارات الملف التربوي', val: '452', icon: Eye, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'طلبات الإشراف', val: '12', icon: Briefcase, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'التقييم العام', val: '4.9/5', icon: Star, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((s, i) => (
          <Card key={i} className="border-none shadow-sm bg-white overflow-hidden rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", s.bg)}>
                  <s.icon className={cn("w-6 h-6", s.color)} />
                </div>
                <Badge className="bg-slate-50 text-slate-400 border-none text-[10px] font-black">مباشر</Badge>
              </div>
              <h4 className="text-2xl font-black text-slate-900">{s.val}</h4>
              <p className="text-slate-500 text-xs font-bold mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ── Main Panel: Student Opportunities ── */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">فرص الإشراف التربوي 🚀</h2>
              <p className="text-slate-500 font-bold text-sm">طلاب يحتاجون لخبراتك البيداغوجية في المنصة</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative group">
            <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text" 
              placeholder="ابحث عن طلاب، فصول، أو احتياجات تربوية..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-16 bg-white border border-slate-100 rounded-3xl pr-14 pl-6 font-bold text-slate-900 shadow-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            {opportunities.map(opp => (
              <OpportunityCard key={opp.id} lead={opp} onInvite={handleInvite} />
            ))}
          </div>
        </div>

        {/* ── Side Panel: Teacher Presence ── */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="p-8 border-b border-slate-50">
              <CardTitle className="text-xl font-black flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-600" /> هويتي كأستاذ خبير
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              
              {/* Extra-curricular Toggle */}
              <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <h5 className="font-black text-slate-900 text-sm">نشاط خارج الدوام</h5>
                  <p className="text-[10px] text-slate-500 font-bold">استقبال دعوات للإشراف الخاص</p>
                </div>
                <div 
                  onClick={() => setIsAvailableForExtra(!isAvailableForExtra)}
                  className={cn("w-14 h-7 rounded-full relative transition-all cursor-pointer", isAvailableForExtra ? "bg-blue-600" : "bg-slate-300")}
                >
                  <motion.div 
                    animate={{ x: isAvailableForExtra ? 28 : 4 }}
                    className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
                  />
                </div>
              </div>

              {/* Specializations */}
              <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">تخصصاتي البيداغوجية</label>
                <div className="flex flex-wrap gap-2">
                   <Badge className="bg-blue-50 text-blue-700 border-none font-bold px-4 py-2">تحليل حركي</Badge>
                   <Badge className="bg-emerald-50 text-emerald-700 border-none font-bold px-4 py-2">علم النفس الرياضي</Badge>
                   <Badge className="bg-purple-50 text-purple-700 border-none font-bold px-4 py-2">إعادة تأهيل مدرسية</Badge>
                </div>
              </div>

              <Button className="w-full h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg shadow-xl shadow-blue-900/20">تحديث الملف المهني</Button>

              <div className="pt-6 border-t border-slate-100">
                <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">نمو شبكتك المهنية</h5>
                <div className="h-32 w-full bg-slate-50 rounded-2xl flex items-end justify-between p-4 gap-2">
                   {[40, 70, 45, 90, 65, 80, 95].map((h, i) => (
                     <motion.div 
                       key={i}
                       initial={{ height: 0 }}
                       animate={{ height: `${h}%` }}
                       className="w-full bg-blue-600/20 rounded-t-lg relative group"
                     >
                        <div className="absolute inset-0 bg-blue-600 rounded-t-lg scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom" />
                     </motion.div>
                   ))}
                </div>
                <div className="flex items-center justify-between mt-4 text-[10px] font-bold text-slate-400">
                   <span>السبت</span>
                   <span>الجمعة</span>
                </div>
              </div>

            </CardContent>
          </Card>

          {/* AI Guidance for Teachers */}
          <Card className="bg-gradient-to-br from-indigo-900 to-blue-900 border-none rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                   <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-yellow-400" />
                   </div>
                   <h4 className="font-black text-sm">نصيحة المنصة للأستاذ</h4>
                </div>
                <p className="text-blue-100/70 text-xs font-medium leading-relaxed mb-6">
                   "هناك طلب متزايد من الأولياء على 'حصص التركيز الذهني' في الفترة المسائية. تفعيل هذا التخصص سيزيد من فرصك بنسبة 40%."
                </p>
                <Button className="w-full bg-white text-indigo-900 hover:bg-blue-50 font-black rounded-xl">تحسين استهداف الطلاب</Button>
             </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
