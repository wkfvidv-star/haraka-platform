import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  GraduationCap,
  Users,
  BookOpen,
  Trophy,
  Dumbbell,
  Lightbulb,
  School,
  Heart,
  Target,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EnvironmentSelectorProps {
  onSelectEnvironment: (environment: 'school' | 'community') => void;
}

export const EnvironmentSelector: React.FC<EnvironmentSelectorProps> = ({ onSelectEnvironment }) => {
  return (
    <div className="min-h-screen bg-[#060c1d] selection:bg-blue-600 selection:text-white overflow-x-hidden relative">
      {/* Reference-Matched Deep Blue Background Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          {/* Base Image */}
          <img
            src="/background-athletes.png"
            alt="Young athletes and children"
            className="w-full h-full object-cover"
          />

          {/* Deep Blue Tint Overlay (Matching Reference) */}
          <div className="absolute inset-0 bg-[#1e3a8a]/85 mix-blend-multiply" />
          <div className="absolute inset-0 bg-blue-950/40" />

          {/* Vignette for focus */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        </motion.div>
      </div>

      {/* Made the container max-w-5xl to shrink size overall */}
      <div className="container mx-auto px-4 py-8 relative z-10 max-w-5xl">
        {/* Header Section (High Contrast Expert Look) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center mb-6">
            <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              Haraka Platform
            </h1>
          </div>
          <p className="text-xl sm:text-2xl font-black text-blue-100 tracking-tight drop-shadow-md">
            الوصول إلى البوابات الذكية
          </p>
          <div className="mt-6 flex items-center justify-center gap-6">
            <div className="h-px w-20 bg-blue-400/30" />
            <span className="text-xs font-bold text-blue-400 uppercase tracking-[0.4em]">اختر بوابتك للدخول</span>
            <div className="h-px w-20 bg-blue-400/30" />
          </div>
        </motion.div>

        {/* Environment Cards Container - slightly scaled down through utility classes */}
        <div className="grid md:grid-cols-2 gap-8 relative px-4">

          {/* School Environment Card */}
          <motion.button
            whileHover={{ y: -10, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
            onClick={() => onSelectEnvironment('school')}
            className="w-full text-right outline-none group cursor-pointer block h-full flex flex-col"
          >
            <Card className="flex-1 glass-card border-white/10 shadow-2xl relative overflow-hidden group-hover:ring-2 group-hover:ring-blue-500/50 ring-1 ring-white/10 transition-all duration-500">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-blue-500/20 transition-colors" />

              <CardHeader className="text-center pt-8 pb-4 relative z-10 pointer-events-none">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/40"
                >
                  <School className="w-10 h-10 text-white" />
                </motion.div>
                <CardTitle className="text-3xl font-black text-white mb-2">
                  البيئة المدرسية
                </CardTitle>
                <CardDescription className="text-blue-300 font-bold tracking-tight text-lg mb-3 drop-shadow-sm">
                  التعليم الذكي
                </CardDescription>
                <Badge className="bg-blue-600/30 text-white border-blue-400/30 px-5 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest backdrop-blur-md">
                  بيئة تعليمية رسمية متكاملة
                </Badge>
              </CardHeader>

              <CardContent className="px-6 pb-8 space-y-8 relative z-10 text-right rtl pointer-events-none">
                {/* School Stats/Users */}
                <div className="space-y-3">
                  <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400/70">
                    <Users className="w-3.5 h-3.5" />
                    المستخدمون المستهدفون
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {['التلميذ', 'الولي', 'المعلم', 'المدير', 'الوزارة'].map((badge) => (
                      <Badge key={badge} className="bg-white/5 text-gray-200 border-white/10 shadow-sm px-3 py-1.5 rounded-lg hover:bg-blue-500 hover:text-white transition-all text-xs font-bold">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* School Features */}
                <div className="bg-blue-500/5 rounded-[2rem] p-6 border border-blue-500/10 backdrop-blur-md">
                  <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-4">
                    <BookOpen className="w-3.5 h-3.5" />
                    الميزات الرئيسية
                  </h4>
                  <ul className="grid grid-cols-1 gap-4">
                    {[
                      'أنشطة تربوية وتحديات أكاديمية',
                      'مسابقات مدرسية وولائية ووطنية',
                      'مساعد ذكي تربوي (AI_Teacher)',
                      'إشراف رسمي ومتابعة إدارية'
                    ].map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
                        <span className="text-sm font-bold text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="w-full flex items-center justify-center gap-3 bg-blue-600 group-hover:bg-blue-500 h-14 rounded-2xl text-lg font-black shadow-lg shadow-blue-600/30 group-hover:shadow-blue-600/50 transition-all duration-300 text-white premium-shadow">
                    دخول بوابة المدرسة
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </motion.button>

          {/* Community Environment Card */}
          <motion.button
            whileHover={{ y: -10, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.4 }}
            onClick={() => onSelectEnvironment('community')}
            className="w-full text-right outline-none group cursor-pointer block h-full flex flex-col"
          >
            <Card className="flex-1 glass-card border-white/10 shadow-2xl relative overflow-hidden group-hover:ring-2 group-hover:ring-orange-500/50 ring-1 ring-white/10 transition-all duration-500">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-orange-500/20 transition-colors" />

              <CardHeader className="text-center pt-8 pb-4 relative z-10 pointer-events-none">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-20 h-20 bg-gradient-to-br from-orange-500 to-rose-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-orange-500/40"
                >
                  <Dumbbell className="w-10 h-10 text-white" />
                </motion.div>
                <CardTitle className="text-3xl font-black text-white mb-2">
                  بيئة الشباب والمدربين
                </CardTitle>
                <CardDescription className="text-orange-300 font-bold tracking-tight text-lg mb-3 drop-shadow-sm">
                  المجتمع الذكي
                </CardDescription>
                <Badge className="bg-orange-600/30 text-white border-orange-400/30 px-5 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest backdrop-blur-md">
                  استقلالية وحركة وإبداع بدون قيود
                </Badge>
              </CardHeader>

              <CardContent className="px-6 pb-8 space-y-8 relative z-10 text-right rtl pointer-events-none">
                {/* Community Stats/Users */}
                <div className="space-y-3">
                  <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-orange-400/70">
                    <Users className="w-3.5 h-3.5" />
                    المستخدمون المستهدفون
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {['الشاب', 'المدرب', 'النوادي الرياضية', 'الشركاء'].map((badge) => (
                      <Badge key={badge} className="bg-white/5 text-gray-200 border-white/10 shadow-sm px-3 py-1.5 rounded-lg hover:bg-orange-500 hover:text-white transition-all text-xs font-bold">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Community Features */}
                <div className="bg-orange-500/5 rounded-[2rem] p-6 border border-orange-500/10 backdrop-blur-md">
                  <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-orange-400 mb-4">
                    <Target className="w-3.5 h-3.5" />
                    الميزات الرئيسية
                  </h4>
                  <ul className="grid grid-cols-1 gap-4">
                    {[
                      'تحديات رياضية ومشاريع إبداعية',
                      'مختبر الإبداع (Haraka) والواقع المعزز',
                      'مدرب ذكي تحفيزي (AI_Coach)',
                      'مستقل تماماً عن الإشراف الوزاري'
                    ].map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.6)]" />
                        <span className="text-sm font-bold text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-emerald-500 group-hover:from-orange-600 group-hover:to-emerald-600 h-14 rounded-2xl text-lg font-black shadow-lg shadow-orange-600/30 group-hover:shadow-orange-600/50 transition-all duration-300 text-white premium-shadow">
                    دخول بوابة المجتمع
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </motion.button>
        </div>

        {/* Unified Footer (High Contrast) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-10 text-gray-400"
        >
          <div className="flex items-center gap-3 group cursor-default">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-red-500/10 group-hover:border-red-500/30 transition-all duration-300">
              <Heart className="w-5 h-5 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-300 group-hover:text-white transition-colors">مصمم للشباب</span>
          </div>
          <div className="flex items-center gap-3 group cursor-default">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-yellow-500/10 group-hover:border-yellow-500/30 transition-all duration-300">
              <Trophy className="w-5 h-5 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]" />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-300 group-hover:text-white transition-colors">مكافآت ذكية</span>
          </div>
          <div className="flex items-center gap-3 group cursor-default">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-blue-500/10 group-hover:border-blue-500/30 transition-all duration-300">
              <Lightbulb className="w-5 h-5 text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-300 group-hover:text-white transition-colors">ذكاء اصطناعي</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EnvironmentSelector;
