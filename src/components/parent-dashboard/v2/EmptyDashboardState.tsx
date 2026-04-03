import React from 'react';
import { motion } from 'framer-motion';
import { Plus, UserPlus, Shield, Activity, TrendingUp, Sparkles, LayoutDashboard, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyDashboardStateProps {
  onAddChild: () => void;
}

export const EmptyDashboardState: React.FC<EmptyDashboardStateProps> = ({ onAddChild }) => {
  return (
    <div className="space-y-12 max-w-5xl mx-auto py-10 px-4">
      
      {/* 1. Main Welcome Section */}
      <section className="text-center space-y-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex p-4 rounded-[24px] bg-blue-600/10 text-blue-500 border border-blue-500/20 shadow-xl shadow-blue-500/5"
        >
          <Sparkles className="w-10 h-10" />
        </motion.div>
        
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">ابدأ رحلة طفلك معنا</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            منصة تتبع أداء متكاملة تساعدك على مراقبة تقدم طفلك الأكاديمي والبدني في مكان واحد
          </p>
        </div>

        <motion.div
           whileHover={{ scale: 1.05 }}
           whileTap={{ scale: 0.95 }}
           className="inline-block"
        >
          <Button 
            onClick={onAddChild}
            className="h-16 px-10 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xl shadow-2xl shadow-blue-600/30 transition-all border border-white/20"
          >
            <Plus className="ml-3 w-6 h-6" />
            إضافة طفلي الأول
          </Button>
        </motion.div>
      </section>

      {/* 2. Interactive Placeholders (Smart UX) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Family Hub Placeholder */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900/40 border-2 border-dashed border-white/10 rounded-[32px] p-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-blue-600/[0.02] pointer-events-none" />
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3 text-blue-500">
               <div className="p-2 rounded-xl bg-blue-500/10"><Activity className="w-6 h-6" /></div>
               <h3 className="font-black text-xl">لوحة نشاط العائلة</h3>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              هنا ستظهر جميع الأنشطة الرياضية والفعاليات القادمة لأبنائك. 
              <span className="text-blue-400 group cursor-pointer ml-1 inline-flex items-center" onClick={onAddChild}>
                 أضف طفلاً لتفعيلها <TrendingUp className="w-3 h-3 mr-1" />
              </span>
            </p>
            {/* Visual Skeleton */}
            <div className="space-y-3 pt-2">
               <div className="h-12 bg-white/5 rounded-xl w-full border border-white/[0.05]" />
               <div className="h-12 bg-white/5 rounded-xl w-3/4 border border-white/[0.05]" />
            </div>
          </div>
        </motion.div>

        {/* Reports Placeholder */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-900/40 border-2 border-dashed border-white/10 rounded-[32px] p-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-indigo-600/[0.02] pointer-events-none" />
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3 text-indigo-500">
               <div className="p-2 rounded-xl bg-indigo-500/10"><Shield className="w-6 h-6" /></div>
               <h3 className="font-black text-xl">التنبيهات الذكية</h3>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              نظام رصد مبكر لتنبيهك في حالات الغياب أو تراجع الأداء أو الإنجازات المتميزة.
            </p>
            {/* Visual Skeleton */}
            <div className="flex gap-3 pt-2">
               <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/[0.05]" />
               <div className="w-full h-12 rounded-xl bg-white/5 border border-white/[0.05]" />
            </div>
          </div>
        </motion.div>

      </div>

      {/* 3. Value Proposition Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10">
        {[
          { icon: LayoutDashboard, label: 'واجهة مخصصة', desc: 'لكل طفل ملفه الخاص' },
          { icon: Calendar, label: 'جدول ذكي', desc: 'تنسيق الحصص والتمارين' },
          { icon: Shield, label: 'أمان تام', desc: 'بيانات طفلك في أمان' },
          { icon: TrendingUp, label: 'تتبع لحظي', desc: 'بيانات الأجهزة القابلة للارتداء' },
        ].map((item, idx) => (
          <div key={idx} className="text-center space-y-3 p-4">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors border border-white/10">
              <item.icon className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">{item.label}</h4>
              <p className="text-[10px] text-slate-500 mt-1">{item.desc}</p>
            </div>
          </div>
        ))}
      </section>

    </div>
  );
};
