import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trophy, Star, ChevronRight, CheckCircle, Sparkles,
    Zap, Target, Shield, Timer, Dumbbell, Activity, Heart,
    Users, Waves, Award, TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SportMatch {
    id: string;
    name: string;
    nameAr: string;
    icon: string;
    emoji: string;
    matchScore: number; // 0-100
    category: string;
    description: string;
    keyStrengths: string[];
    requiredDimensions: { label: string; importance: 'high' | 'medium' | 'low' }[];
    color: string;
    gradient: string;
    badge?: string;
}

const sportsData: SportMatch[] = [
    {
        id: 'football',
        name: 'Football',
        nameAr: 'كرة القدم',
        icon: '⚽',
        emoji: '⚽',
        matchScore: 91,
        category: 'جماعي',
        description: 'رياضة جماعية تتطلب سرعة وتنسيقاً حركياً عالياً وقوة لا نهائية',
        keyStrengths: ['الرشاقة', 'السرعة', 'التوافق الحركي'],
        requiredDimensions: [
            { label: 'السرعة', importance: 'high' },
            { label: 'الرشاقة', importance: 'high' },
            { label: 'التوافق', importance: 'high' },
            { label: 'التوازن', importance: 'medium' },
        ],
        color: 'emerald',
        gradient: 'from-emerald-500 to-teal-600',
        badge: 'الأنسب لك',
    },
    {
        id: 'athletics',
        name: 'Athletics',
        nameAr: 'ألعاب القوى',
        icon: '🏃',
        emoji: '🏃',
        matchScore: 84,
        category: 'فردي',
        description: 'رياضة تعتمد على القوة الانفجارية والسرعة القصوى والتحمّل',
        keyStrengths: ['السرعة', 'القوة الانفجارية'],
        requiredDimensions: [
            { label: 'السرعة', importance: 'high' },
            { label: 'القوة الانفجارية', importance: 'high' },
            { label: 'الرشاقة', importance: 'medium' },
        ],
        color: 'yellow',
        gradient: 'from-yellow-500 to-orange-600',
    },
    {
        id: 'basketball',
        name: 'Basketball',
        nameAr: 'كرة السلة',
        icon: '🏀',
        emoji: '🏀',
        matchScore: 79,
        category: 'جماعي',
        description: 'مزيج مثالي من السرعة والقوة الانفجارية والتوافق الحركي الدقيق',
        keyStrengths: ['القوة الانفجارية', 'رد الفعل'],
        requiredDimensions: [
            { label: 'القوة الانفجارية', importance: 'high' },
            { label: 'رد الفعل', importance: 'high' },
            { label: 'التوافق', importance: 'medium' },
        ],
        color: 'orange',
        gradient: 'from-orange-500 to-red-600',
    },
    {
        id: 'swimming',
        name: 'Swimming',
        nameAr: 'السباحة',
        icon: '🏊',
        emoji: '🏊',
        matchScore: 72,
        category: 'فردي',
        description: 'رياضة تقوّي العضلات بأكملها وتطوّر التوافق الحركي والمرونة',
        keyStrengths: ['المرونة', 'التوافق الحركي'],
        requiredDimensions: [
            { label: 'المرونة', importance: 'high' },
            { label: 'التوافق', importance: 'high' },
            { label: 'القوة', importance: 'medium' },
        ],
        color: 'blue',
        gradient: 'from-blue-500 to-cyan-600',
    },
    {
        id: 'handball',
        name: 'Handball',
        nameAr: 'كرة اليد',
        icon: '🤾',
        emoji: '🤾',
        matchScore: 68,
        category: 'جماعي',
        description: 'رياضة تعتمد على السرعة وردود الفعل والقوة الانفجارية للذراعين',
        keyStrengths: ['رد الفعل', 'القوة'],
        requiredDimensions: [
            { label: 'رد الفعل', importance: 'high' },
            { label: 'السرعة', importance: 'high' },
            { label: 'التوافق', importance: 'medium' },
        ],
        color: 'purple',
        gradient: 'from-purple-500 to-violet-600',
    },
];

const categoryColors: Record<string, string> = {
    'جماعي': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    'فردي': 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
};

function MatchScoreRing({ score, color }: { score: number; color: string }) {
    const r = 28;
    const circ = 2 * Math.PI * r;
    const offset = circ - (score / 100) * circ;

    const colors: Record<string, string> = {
        emerald: '#10b981', yellow: '#f59e0b', orange: '#f97316',
        blue: '#3b82f6', purple: '#8b5cf6',
    };
    const strokeColor = colors[color] || '#3b82f6';

    return (
        <div className="relative w-16 h-16 flex-shrink-0">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r={r} fill="none" stroke="currentColor" strokeWidth="5" className="text-slate-100 dark:text-slate-700" />
                <motion.circle
                    cx="32" cy="32" r={r}
                    fill="none" stroke={strokeColor} strokeWidth="5"
                    strokeDasharray={circ}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: circ }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-base font-black text-slate-900 dark:text-white">{score}%</span>
            </div>
        </div>
    );
}

export function SportRecommender() {
    const [selectedSport, setSelectedSport] = useState<SportMatch | null>(null);
    const [activeFilter, setActiveFilter] = useState<'all' | 'جماعي' | 'فردي'>('all');

    const filtered = sportsData.filter(s => activeFilter === 'all' || s.category === activeFilter);
    const topSport = sportsData[0];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
                            <Trophy className="w-5 h-5 text-white" />
                        </div>
                        اكتشاف موهبتك الرياضية
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
                        بناءً على بصمتك الحركية، إليك أنسب الرياضات لك
                    </p>
                </div>
                <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-white/5 rounded-2xl">
                    {(['all', 'جماعي', 'فردي'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            className={cn(
                                'px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200',
                                activeFilter === f
                                    ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                            )}
                        >
                            {f === 'all' ? 'الكل' : f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Top Recommendation Banner */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                    'relative rounded-3xl p-6 overflow-hidden bg-gradient-to-br text-white',
                    topSport.gradient
                )}
            >
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 left-4 text-8xl">{topSport.emoji}</div>
                    <div className="absolute bottom-2 right-6 text-6xl opacity-50">{topSport.emoji}</div>
                </div>

                <div className="relative flex items-center gap-5">
                    <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-5xl flex-shrink-0 shadow-xl">
                        {topSport.emoji}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="bg-white/25 backdrop-blur-sm text-white text-xs font-black px-3 py-1 rounded-full flex items-center gap-1">
                                <Sparkles className="w-3 h-3" /> التوصية الأولى
                            </span>
                            <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">{topSport.category}</span>
                        </div>
                        <h3 className="text-2xl font-black">{topSport.nameAr}</h3>
                        <p className="text-white/80 text-sm mt-1 line-clamp-2">{topSport.description}</p>
                        <div className="flex items-center gap-3 mt-3">
                            <div className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1">
                                <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                                <span className="text-sm font-black">{topSport.matchScore}% توافق</span>
                            </div>
                            <div className="flex gap-1">
                                {topSport.keyStrengths.map(s => (
                                    <span key={s} className="text-xs bg-white/15 px-2 py-0.5 rounded-full font-medium">{s}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Sports Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AnimatePresence>
                    {filtered.map((sport, i) => (
                        <motion.button
                            key={sport.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: i * 0.07 }}
                            onClick={() => setSelectedSport(selectedSport?.id === sport.id ? null : sport)}
                            className={cn(
                                'text-right rounded-2xl border p-5 transition-all duration-200 group',
                                selectedSport?.id === sport.id
                                    ? 'border-blue-300/50 dark:border-blue-600/30 bg-blue-50 dark:bg-blue-900/10 shadow-md'
                                    : 'bg-white dark:bg-white/5 border-slate-200/50 dark:border-white/5 hover:border-slate-300 hover:shadow-sm dark:hover:border-white/10'
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <MatchScoreRing score={sport.matchScore} color={sport.color} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p className="font-black text-slate-900 dark:text-slate-100">{sport.nameAr}</p>
                                            <span className={cn('text-[11px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block', categoryColors[sport.category])}>
                                                {sport.category}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {sport.badge && (
                                                <span className="hidden sm:flex items-center gap-1 text-[10px] font-black bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded-full">
                                                    <Award className="w-2.5 h-2.5" />
                                                    {sport.badge}
                                                </span>
                                            )}
                                            <span className="text-lg">{sport.emoji}</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-1">{sport.description}</p>
                                </div>
                            </div>

                            {/* Expanded details */}
                            <AnimatePresence>
                                {selectedSport?.id === sport.id && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="mt-4 pt-4 border-t border-blue-200/50 dark:border-blue-700/30 space-y-3">
                                            <p className="text-sm text-slate-600 dark:text-slate-300">{sport.description}</p>
                                            <div>
                                                <p className="text-xs font-bold text-slate-500 mb-2">متطلبات الرياضة</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {sport.requiredDimensions.map(d => (
                                                        <span
                                                            key={d.label}
                                                            className={cn(
                                                                'text-xs font-semibold px-3 py-1 rounded-full',
                                                                d.importance === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
                                                                    d.importance === 'medium' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' :
                                                                        'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                                                            )}
                                                        >
                                                            {d.importance === 'high' ? '🔴' : d.importance === 'medium' ? '🟡' : '🟢'} {d.label}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <button className={cn(
                                                'w-full py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 bg-gradient-to-r shadow-sm',
                                                sport.gradient
                                            )}>
                                                <ChevronRight className="w-4 h-4" />
                                                ابدأ التدريب المتخصص
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
