import React from 'react';
import { Award, Star, Flame, Trophy, Shield, Zap, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';

export function GamificationBadges() {
    const { fullProfile } = useAuth();
    const currentXP = fullProfile?.xp || 0;
    const currentLevel = Math.floor(currentXP / 500) + 1;
    const nextLevelXP = currentLevel * 500; // XP needed to reach the start of the next level
    const xpProgress = ((currentXP - ((currentLevel - 1) * 500)) / 500) * 100;
    
    const badges = [
        { id: 1, name: 'بطل البدايات', desc: 'أكملت التقييم المبدئي', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-500/10', unlocked: true },
        { id: 2, name: 'شعلة الالتزام', desc: '3 أيام تدليك متتالية', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10', unlocked: true },
        { id: 3, name: 'السرعة الخاطفة', desc: 'كسر رقمك في 50م', icon: Zap, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10', unlocked: false },
        { id: 4, name: 'الجدار الواقي', desc: 'إتمام برنامج التوافق', icon: Shield, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10', unlocked: false },
        { id: 5, name: 'نخبة حركة', desc: 'الوصول للمستوى 20', icon: Trophy, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10', unlocked: false },
        { id: 6, name: 'الملتزم', desc: 'رفعت أول فيديو للتقييم', icon: Video, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10', unlocked: true },
    ];

    return (
        <div className="bg-white dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800 dark:text-slate-100">
                    <Award className="w-5 h-5 text-yellow-500" />
                    مسار التقدم والشارات
                </h3>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-white/10 px-2 py-1 rounded-md">
                    مستوى {currentLevel}
                </span>
            </div>

            {/* Level Progress */}
            <div className="mb-8">
                <div className="flex justify-between text-sm mb-2 font-bold">
                    <span className="text-slate-700 dark:text-slate-300">{currentXP} XP</span>
                    <span className="text-slate-500">{nextLevelXP} XP للوصول للمستوى القادم</span>
                </div>
                <Progress value={xpProgress} className="h-3" />
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {badges.map((badge) => (
                    <div 
                        key={badge.id} 
                        className={cn(
                            'flex flex-col items-center p-4 rounded-2xl text-center transition-all',
                            badge.unlocked ? badge.bg : 'bg-slate-50 dark:bg-white/5 grayscale opacity-50'
                        )}
                    >
                        <div className="mb-3">
                            <badge.icon className={cn('w-8 h-8', badge.color)} />
                        </div>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">{badge.name}</p>
                        <p className="text-[10px] text-slate-500 leading-tight">{badge.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
