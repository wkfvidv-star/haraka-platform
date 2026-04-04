import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, DollarSign, Briefcase, Heart, CheckCircle2, MessageSquare, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { marketplaceService, Coach } from '@/services/marketplaceService';

interface Props {
  coach: Coach | null;
  isOpen: boolean;
  onClose: () => void;
  onStartTraining: (coachId: string, coachName: string) => void;
  requestedIds: Set<string>;
}

export function CoachProfileModal({ 
  coach, isOpen, onClose, onStartTraining, requestedIds 
}: Props) {
  if (!isOpen || !coach) return null;

  const isRequested = requestedIds.has(coach.id);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" 
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
      >
        <button 
          onClick={onClose} 
          className="absolute top-6 left-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 flex flex-col items-center text-center">
          {/* Profile Header */}
          <div className={cn("w-24 h-24 rounded-3xl flex items-center justify-center text-white font-black text-3xl shadow-2xl mb-6", coach.avatarColor)}>
            {coach.avatarInitials}
          </div>
          
          <h2 className="text-2xl font-black text-white mb-2">{coach.name}</h2>
          <div className="flex items-center gap-2 mb-6">
            <span className="bg-indigo-500/20 text-indigo-400 text-xs font-black px-3 py-1 rounded-full border border-indigo-500/20">
              {coach.specialtyLabel}
            </span>
            <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
              <Star className="w-4 h-4 fill-yellow-500" />
              <span>{coach.rating}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full mb-8">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <DollarSign className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
              <span className="text-[10px] text-slate-500 font-bold uppercase block">سعر الجلسة</span>
              <span className="text-lg font-black text-white">{coach.sessionPrice} <span className="text-xs font-bold text-slate-400">SAR</span></span>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <Briefcase className="w-5 h-5 text-blue-400 mx-auto mb-2" />
              <span className="text-[10px] text-slate-500 font-bold uppercase block">المراجعات</span>
              <span className="text-lg font-black text-white">{coach.reviewCount} <span className="text-xs font-bold text-slate-400">رأي</span></span>
            </div>
          </div>

          {/* About */}
          <div className="w-full text-right space-y-4 mb-8">
            <h3 className="font-black text-white text-lg flex items-center gap-2 justify-end">
              نبذة عن المدرب
              <User className="w-5 h-5 text-indigo-400" />
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed font-bold">
              {coach.bio}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="w-full space-y-3">
            <Button 
              size="lg"
              disabled={isRequested}
              onClick={() => onStartTraining(coach.id, coach.name)}
              className={cn(
                "w-full py-7 rounded-2xl font-black text-xl shadow-xl transition-all",
                isRequested ? "bg-slate-700 text-emerald-400 scale-[0.98]" : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-[1.02]"
              )}
            >
              {isRequested ? 'تم إرسال الطلب بنجاح ✓' : 'اربدء تدريبك الآن 🚀'}
            </Button>
            <p className="text-[10px] text-slate-500 font-bold">
              * سيصلك رد من المدرب خلال 24 ساعة عبر صندوق الرسائل
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
