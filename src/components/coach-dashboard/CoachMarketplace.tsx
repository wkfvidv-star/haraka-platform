import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, Users, Target, Zap, Brain, MessageSquare, 
  ArrowRight, Shield, Award, Star, Filter, Search, 
  ChevronDown, MapPin, DollarSign, Eye, Activity, Send
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { marketplaceService, MarketStats, Lead } from '@/services/marketplaceService';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// ── Lead Card Component ──────────────────────────────────────────
function LeadCard({ lead, onInvite }: { lead: Lead, onInvite: (l: Lead) => void }) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all group"
    >
      <div className="flex items-center gap-4">
        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg", lead.avatarColor)}>
          {lead.avatarInitials}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-black text-slate-900 text-lg">{lead.name}</h4>
            {lead.isNew && <Badge className="bg-emerald-100 text-emerald-600 border-none text-[10px] px-2 py-0">جديد</Badge>}
          </div>
          <div className="flex items-center gap-3 mt-1">
            <div className="flex items-center gap-1 text-slate-400 text-xs font-bold">
              <MapPin className="w-3 h-3" /> {lead.location}
            </div>
            <div className="flex items-center gap-1 text-indigo-500 text-xs font-black">
              <Star className="w-3 h-3 fill-indigo-500" /> {lead.matchScore}% تطابق
            </div>
          </div>
        </div>
        <Button 
          onClick={() => onInvite(lead)}
          className="rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs gap-2 px-4"
        >
          دعوة <Send className="w-3 h-3" />
        </Button>
      </div>
      
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge variant="outline" className="text-[10px] font-bold py-1 border-slate-100 bg-slate-50">الهدف: {lead.goal === 'speed' ? 'سرعة انفجارية' : lead.goal === 'fitness' ? 'لياقة شاملة' : lead.goal === 'rehab' ? 'تأهيل إصابة' : 'تركيز ذهني'}</Badge>
        <Badge variant="outline" className="text-[10px] font-bold py-1 border-slate-100 bg-slate-50">المستوى: {lead.level === 'beginner' ? 'مبتدئ' : lead.level === 'intermediate' ? 'متوسط' : 'متقدم'}</Badge>
      </div>
    </motion.div>
  );
}

// ── Main Dashboard Component ──────────────────────────────────────
export default function CoachMarketplace() {
  const { user } = useAuth();
  const [stats, setStats] = useState<MarketStats | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activeSpecialty, setActiveSpecialty] = useState('speed');
  const [isAvailable, setIsAvailable] = useState(true);
  const [price, setPrice] = useState(120);

  useEffect(() => {
    setStats(marketplaceService.getMarketStats());
    setLeads(marketplaceService.getPotentialLeads(activeSpecialty as any));
  }, [activeSpecialty]);

  const handleUpdateProfile = () => {
    marketplaceService.updateCoachProfile('current', { sessionPrice: price });
    toast.success('تم تحديث ملفك في السوق بنجاح!');
  };

  const handleInvite = (lead: Lead) => {
    const message = `مرحباً ${lead.name}! رأيت أنك تبحث عن تطوير ${lead.goal}، لدي برنامج مخصص لك. هل ترغب في جلسة تجريبية؟`;
    marketplaceService.sendOutreach('current', lead.id, message);
  };

  return (
    <div className="space-y-8 pb-10" dir="rtl">
      
      {/* ── Market Status Header ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'ظهور في البحث', val: stats?.searchAppearances || 0, icon: Search, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'زيارات الملف', val: stats?.profileViews || 0, icon: Eye, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'تحويل الطلبات', val: `${stats?.conversionRate}%`, icon: Zap, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'ترتيب التخصص', val: `#${stats?.rankInSpecialty}`, icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((s, i) => (
          <Card key={i} className="border-none shadow-sm bg-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", s.bg)}>
                  <s.icon className={cn("w-5 h-5", s.color)} />
                </div>
                <Badge className="bg-slate-50 text-slate-400 border-none text-[10px]">+12%</Badge>
              </div>
              <h4 className="text-2xl font-black text-slate-900">{s.val}</h4>
              <p className="text-slate-500 text-xs font-bold mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ── Main Panel: Smart Leads ── */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">الفرص المتاحة (Leads) 🚀</h2>
              <p className="text-slate-500 font-bold text-sm">متدربون يبحثون عن خبراتك في {activeSpecialty === 'speed' ? 'السرعة' : 'اللياقة'}</p>
            </div>
            <div className="flex gap-2">
              <Badge 
                onClick={() => setActiveSpecialty('speed')}
                className={cn("cursor-pointer px-4 py-2 rounded-xl border-none font-bold transition-all", activeSpecialty === 'speed' ? "bg-slate-900 text-white" : "bg-white text-slate-400")}
              >السرعة</Badge>
              <Badge 
                onClick={() => setActiveSpecialty('fitness')}
                className={cn("cursor-pointer px-4 py-2 rounded-xl border-none font-bold transition-all", activeSpecialty === 'fitness' ? "bg-slate-900 text-white" : "bg-white text-slate-400")}
              >اللياقة</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {leads.map(lead => (
              <LeadCard key={lead.id} lead={lead} onInvite={handleInvite} />
            ))}
          </div>

          {/* AI Strategy Tool */}
          <Card className="bg-gradient-to-br from-indigo-900 to-slate-900 border-none text-white overflow-hidden relative rounded-[2rem] shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
            <CardContent className="p-8 relative z-10">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10 shadow-inner">
                  <Brain className="w-8 h-8 text-indigo-300" />
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-2">استراتيجية السوق الذكية 🤖</h3>
                  <p className="text-indigo-100/70 font-medium leading-relaxed mb-6">
                    "بناءً على نشاط السوق الأسبوعي في منطقتك، هناك نقص بنسبة <span className="text-orange-400 font-bold">25%</span> في مدربي 'إعادة التأهيل'. ننصحك بتفعيل هذا التخصص لزيادة نسبة وصولك للمتدربين."
                  </p>
                  <Button className="bg-white text-indigo-900 hover:bg-indigo-50 font-black rounded-xl px-8 h-12">تفعيل التوصية</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Side Panel: My Presence ── */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
            <CardHeader className="p-6 border-b border-slate-50">
              <CardTitle className="text-lg font-black flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600" /> هويتي في السوق
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              {/* Availability Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <h5 className="font-black text-slate-900 text-sm">حالة الظهور</h5>
                  <p className="text-[10px] text-slate-500 font-bold">استقبل طلبات تدريب جديدة</p>
                </div>
                <div 
                  onClick={() => setIsAvailable(!isAvailable)}
                  className={cn("w-12 h-6 rounded-full relative transition-all cursor-pointer", isAvailable ? "bg-emerald-500" : "bg-slate-300")}
                >
                  <motion.div 
                    animate={{ x: isAvailable ? 24 : 4 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">سعر الجلسة (دج)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="number" 
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-10 font-black text-lg text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <Button 
                onClick={handleUpdateProfile}
                className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base shadow-xl shadow-indigo-900/10"
              >
                حفظ التعديلات
              </Button>

              <div className="pt-4 border-t border-slate-50">
                <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">أعلى المهارات طلباً اليوم</h5>
                <div className="space-y-3">
                  {[
                    { label: 'زيادة السرعة', pct: 85 },
                    { label: 'تقوية العضلات', pct: 72 },
                    { label: 'المرونة الحركية', pct: 45 },
                  ].map((skill, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-slate-700">{skill.label}</span>
                        <span className="text-indigo-600">{skill.pct}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.pct}%` }}
                          className="h-full bg-indigo-500" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Earnings card */}
          <Card className="bg-emerald-600 border-none rounded-[2rem] p-6 text-white shadow-xl shadow-emerald-900/10 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mt-16 blur-2xl" />
            <div className="relative z-10">
              <p className="text-emerald-100 text-xs font-black uppercase tracking-widest mb-1">أرباحك المتوقعة هذا الشهر</p>
              <h3 className="text-3xl font-black">{stats?.earningsThisMonth.toLocaleString()} <span className="text-lg">دج</span></h3>
              <div className="mt-4 flex items-center gap-2 bg-white/10 w-fit px-3 py-1 rounded-full text-[10px] font-bold">
                <TrendingUp className="w-3 h-3" /> +15% عن الشهر الماضي
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
