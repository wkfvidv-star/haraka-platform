import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Filter, Star, ChevronRight, User, Target, Zap, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { marketplaceService, Coach } from '@/services/marketplaceService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectCoach: (coach: Coach) => void;
  onStartTraining: (coachId: string, coachName: string) => void;
  requestedIds: Set<string>;
  initialGoal?: string;
  initialLevel?: string;
}

export function CoachSearchModal({ 
  isOpen, onClose, onSelectCoach, onStartTraining, requestedIds, initialGoal, initialLevel 
}: Props) {
  const [query, setQuery] = useState('');
  const [goal, setGoal] = useState(initialGoal || 'fitness');
  const [level, setLevel] = useState(initialLevel || 'beginner');
  const [results, setResults] = useState<(Coach & { matchPct: number })[]>([]);

  useEffect(() => {
    if (isOpen) {
      const searchResults = marketplaceService.searchCoaches(query, { goal, level });
      setResults(searchResults);
    }
  }, [isOpen, query, goal, level]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
      />
      
      <motion.div 
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white">ابحث عن مدربك 🔍</h2>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث بالاسم أو التخصص..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-white font-bold focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'fitness', label: 'لياقة', icon: Target },
              { id: 'speed', label: 'سرعة', icon: Zap },
              { id: 'focus', label: 'تركيز', icon: Shield },
            ].map(f => (
              <button 
                key={f.id} onClick={() => setGoal(f.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black whitespace-nowrap transition-all border",
                  goal === f.id ? "bg-blue-600 border-blue-500 text-white" : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10"
                )}
              >
                <f.icon className="w-4 h-4" />
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {results.length > 0 ? (
            results.map(coach => (
              <motion.div 
                key={coach.id} 
                layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between group hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-inner", coach.avatarColor)}>
                    {coach.avatarInitials}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-white text-base">{coach.name}</h4>
                      <span className="bg-blue-500/20 text-blue-400 text-[10px] font-black px-2 py-0.5 rounded-full border border-blue-500/20">
                        {coach.matchPct}% تطابق
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-bold mt-1">{coach.specialtyLabel}</p>
                    <div className="flex items-center gap-1 text-[10px] text-yellow-500 mt-1">
                      <Star className="w-3 h-3 fill-yellow-500" />
                      <span className="font-bold">{coach.rating} ({coach.reviewCount} مراجعة)</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button 
                    size="sm" variant="ghost" 
                    onClick={() => onSelectCoach(coach)}
                    className="text-[10px] h-8 font-black text-slate-300 hover:text-white"
                  >
                    عرض الملف
                  </Button>
                  <Button 
                    size="sm" 
                    disabled={requestedIds.has(coach.id)}
                    onClick={() => onStartTraining(coach.id, coach.name)}
                    className={cn(
                      "rounded-xl font-black text-[10px] h-8 px-4",
                      requestedIds.has(coach.id) ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-white text-slate-900 hover:bg-blue-50"
                    )}
                  >
                    {requestedIds.has(coach.id) ? 'تم الطلب ✓' : 'ابدأ تدريب'}
                  </Button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <Search className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-bold">لم نجد نتائج مطابقة لبحثك</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-white/[0.02] border-t border-white/5">
          <p className="text-center text-[10px] text-slate-500 font-bold">
            💡 النتائج تظهر بناءً على توافق تخصص المدرب مع أهدافك المسجلة
          </p>
        </div>
      </motion.div>
    </div>
  );
}
