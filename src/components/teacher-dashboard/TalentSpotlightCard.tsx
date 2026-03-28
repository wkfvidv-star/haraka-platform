import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Trophy, Star, ArrowUpRight, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Talent {
    id: string;
    name: string;
    class: string;
    sport: string;
    matchScore: number;
    avatar: string;
    topSkill: string;
}

const mockTalents: Talent[] = [
    { id: '1', name: 'أحمد بن علي', class: 'القسم 3 م 1', sport: 'كرة القدم', matchScore: 94, avatar: 'أ', topSkill: 'الرشاقة' },
    { id: '2', name: 'سارة محمد', class: 'القسم 3 م 4', sport: 'ألعاب القوى', matchScore: 91, avatar: 'س', topSkill: 'السرعة القصوى' },
    { id: '3', name: 'ياسين كريم', class: 'القسم 3 م 2', sport: 'كرة السلة', matchScore: 88, avatar: 'ي', topSkill: 'القوة الانفجارية' },
];

export function TalentSpotlightCard() {
    return (
        <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl p-6 text-white overflow-hidden relative shadow-xl">
            {/* Background Decor */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-fuchsia-500/20 rounded-full blur-3xl"></div>

            <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-yellow-300" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black">مواهب مكتشفة حديثاً</h3>
                        <p className="text-indigo-200 text-sm">تم التعرف عليهم عبر الذكاء الاصطناعي</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {mockTalents.map((talent, i) => (
                        <motion.div
                            key={talent.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex items-center justify-between hover:bg-white/15 transition-colors cursor-pointer group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-fuchsia-500 to-purple-500 flex items-center justify-center font-bold text-lg shadow-md">
                                    {talent.avatar}
                                </div>
                                <div>
                                    <h4 className="font-bold">{talent.name}</h4>
                                    <div className="flex items-center gap-2 text-xs text-indigo-200">
                                        <span>{talent.class}</span>
                                        <span className="w-1 h-1 rounded-full bg-indigo-400"></span>
                                        <span className="text-yellow-300 font-bold">{talent.sport}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-left flex items-center gap-3">
                                <div className="hidden sm:block text-right">
                                    <p className="text-xs text-indigo-200">أقوى مهارة</p>
                                    <p className="text-sm font-bold text-fuchsia-300">{talent.topSkill}</p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-white/10 flex flex-col items-center justify-center border border-white/5">
                                    <p className="text-[10px] text-indigo-200 uppercase tracking-widest leading-none mb-0.5">توافق</p>
                                    <p className="text-sm font-black text-yellow-300 leading-none">{talent.matchScore}%</p>
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity -ml-6 group-hover:ml-0 delay-75" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                <button className="w-full mt-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-colors border border-white/10 flex items-center justify-center gap-2">
                    عرض قائمة المواهب الكاملة <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
