import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    Utensils, Flame, Droplets, TrendingUp, Calendar,
    CheckCircle2, Clock, ChevronLeft, BarChart3, Star,
    Apple, Coffee, Zap, Download, Share2, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Meal {
    name: string;
    time: string;
    emoji: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    foods: { name: string; qty: string; cal: number }[];
}

const report = {
    issuedBy: 'م. يوسف بن علي',
    issuedDate: 'الأربعاء 26 مارس 2026',
    validFor: '7 أيام',
    athleteName: 'رضا بن منصور',
    goal: 'بناء الكتلة العضلية',
    targetCalories: 2400,
    targetProtein: 160,
    targetCarbs: 280,
    targetFat: 75,
    dailyWater: 3.5,
    notes: 'التزم بمواعيد الوجبات لتحسين الميتابوليزم. تجنب الكربوهيدرات البسيطة مساءً. الوجبة قبل التمرين بساعة هي الأساس.',
    meals: [
        {
            name: 'الإفطار', time: '07:30 ص', emoji: '🌅',
            calories: 560, protein: 38, carbs: 65, fat: 14,
            foods: [
                { name: 'بيض مسلوق', qty: '3 بيضات', cal: 213 },
                { name: 'خبز أسمر', qty: 'شريحتان', cal: 180 },
                { name: 'لبن خالي الدسم', qty: '250 مل', cal: 90 },
                { name: 'موزة', qty: '1 حبة', cal: 77 },
            ]
        },
        {
            name: 'وجبة منتصف الضحى', time: '10:30 ص', emoji: '🍎',
            calories: 220, protein: 12, carbs: 28, fat: 7,
            foods: [
                { name: 'مكسرات مشكلة', qty: '30 غ', cal: 180 },
                { name: 'تفاحة', qty: '1 حبة', cal: 52 },
            ]
        },
        {
            name: 'الغداء', time: '01:00 م', emoji: '🍗',
            calories: 720, protein: 58, carbs: 75, fat: 18,
            foods: [
                { name: 'صدر دجاج مشوي', qty: '200 غ', cal: 330 },
                { name: 'أرز أبيض', qty: '200 غ مطبوخ', cal: 260 },
                { name: 'سلطة خضراء', qty: 'طبق كبير', cal: 45 },
                { name: 'زيت زيتون', qty: 'ملعقة كبيرة', cal: 85 },
            ]
        },
        {
            name: 'وجبة ما قبل التمرين', time: '04:30 م', emoji: '💪',
            calories: 380, protein: 32, carbs: 42, fat: 8,
            foods: [
                { name: 'مشروب بروتين', qty: '1 حصة (30 غ)', cal: 180 },
                { name: 'موزة', qty: '1 كبيرة', cal: 110 },
                { name: 'شوفان', qty: '30 غ جاف', cal: 90 },
            ]
        },
        {
            name: 'العشاء', time: '08:00 م', emoji: '🌙',
            calories: 520, protein: 40, carbs: 55, fat: 14,
            foods: [
                { name: 'سمك مشوي', qty: '200 غ', cal: 220 },
                { name: 'بطاطس مشوية', qty: '150 غ', cal: 135 },
                { name: 'خضار مطهية بخار', qty: '200 غ', cal: 80 },
                { name: 'زبادي', qty: '150 غ', cal: 85 },
            ]
        },
    ] as Meal[],
    weeklyBreakdown: [
        { day: 'الأحد', cal: 2350 },
        { day: 'الاثنين', cal: 2400 },
        { day: 'الثلاثاء', cal: 2280 },
        { day: 'الأربعاء', cal: 2400 },
        { day: 'الخميس', cal: 2450 },
        { day: 'الجمعة', cal: 2100 },
        { day: 'السبت', cal: 2300 },
    ],
    supplements: [
        { name: 'مسحوق البروتين', dose: '1 حصة', timing: 'بعد التمرين' },
        { name: 'الكرياتين', dose: '5 غرامات', timing: 'قبل أو بعد التمرين' },
        { name: 'فيتامين D3', dose: '2000 IU', timing: 'مع الإفطار' },
        { name: 'أوميغا 3', dose: '2 كبسولة', timing: 'مع الوجبات' },
    ]
};

export function CoachNutritionReport({ onBack }: { onBack?: () => void }) {
    const [expandedMeal, setExpandedMeal] = useState<number | null>(null);
    const totalCal = report.meals.reduce((s, m) => s + m.calories, 0);

    return (
        <div className="space-y-5 pb-20 animate-in fade-in duration-300 font-arabic max-w-3xl mx-auto" dir="rtl">
            {/* Report Header */}
            <div className="bg-slate-900 rounded-[2rem] p-6 relative overflow-hidden shadow-xl border border-slate-800">
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                                <Utensils className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-emerald-400 text-xs font-black uppercase tracking-widest">تقرير رسمي</p>
                                <h2 className="text-white font-black text-lg leading-tight">البرنامج الغذائي الأسبوعي</h2>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="w-9 h-9 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-white border border-slate-700 transition-colors">
                                <Share2 className="w-4 h-4" />
                            </button>
                            <button className="w-9 h-9 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-white border border-slate-700 transition-colors">
                                <Download className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            { label: 'الهدف', val: report.goal, icon: Star, color: 'text-yellow-400' },
                            { label: 'السعرات', val: `${report.targetCalories} ك.ح`, icon: Flame, color: 'text-orange-400' },
                            { label: 'البروتين', val: `${report.targetProtein}g`, icon: Zap, color: 'text-blue-400' },
                            { label: 'الماء', val: `${report.dailyWater}L`, icon: Droplets, color: 'text-cyan-400' },
                        ].map((s, i) => (
                            <div key={i} className="bg-slate-800/70 rounded-2xl p-3 border border-slate-700/50">
                                <s.icon className={`w-4 h-4 ${s.color} mb-1`} />
                                <p className="text-white font-black text-sm leading-tight">{s.val}</p>
                                <p className="text-slate-500 text-[11px] font-bold">{s.label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between mt-4 bg-slate-800/60 rounded-2xl px-4 py-3 border border-slate-700/40">
                        <div className="text-slate-400 text-xs font-bold">المدرب: <span className="text-white">{report.issuedBy}</span></div>
                        <div className="text-slate-400 text-xs font-bold">صادر: <span className="text-white">{report.issuedDate}</span></div>
                        <div className="text-slate-400 text-xs font-bold">صالح لـ: <span className="text-emerald-400">{report.validFor}</span></div>
                    </div>
                </div>
            </div>

            {/* Macro Distribution */}
            <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-5">
                <h3 className="font-black text-slate-900 text-base mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-indigo-500" /> توزيع المغذيات الكبرى
                </h3>
                <div className="space-y-3">
                    {[
                        { label: 'بروتين', val: report.targetProtein, max: 200, unit: 'g', color: 'bg-blue-500', pct: Math.round(report.targetProtein / 200 * 100) },
                        { label: 'كربوهيدرات', val: report.targetCarbs, max: 400, unit: 'g', color: 'bg-orange-500', pct: Math.round(report.targetCarbs / 400 * 100) },
                        { label: 'دهون', val: report.targetFat, max: 120, unit: 'g', color: 'bg-yellow-500', pct: Math.round(report.targetFat / 120 * 100) },
                    ].map((m, i) => (
                        <div key={i}>
                            <div className="flex justify-between text-sm font-bold mb-1">
                                <span className="text-slate-700">{m.label}</span>
                                <span className="text-slate-500">{m.val}{m.unit}</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${m.pct}%` }}
                                    transition={{ duration: 0.8, delay: i * 0.1 }}
                                    className={`h-full rounded-full ${m.color}`}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Weekly Calories Chart (visual bars) */}
            <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-5">
                <h3 className="font-black text-slate-900 text-base mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-orange-500" /> توزيع السعرات الأسبوعي
                </h3>
                <div className="flex items-end justify-between gap-1 h-24">
                    {report.weeklyBreakdown.map((d, i) => {
                        const pct = Math.round((d.cal / 2600) * 100);
                        const isToday = i === 3;
                        return (
                            <div key={i} className="flex flex-col items-center flex-1 gap-1">
                                <span className="text-[9px] font-black text-slate-400">{d.cal}</span>
                                <div className="w-full bg-slate-100 rounded-lg overflow-hidden flex flex-col-reverse" style={{ height: '60px' }}>
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${pct}%` }}
                                        transition={{ duration: 0.5, delay: i * 0.05 }}
                                        className={cn('rounded-lg', isToday ? 'bg-emerald-500' : 'bg-slate-300')}
                                    />
                                </div>
                                <span className={cn('text-[10px] font-black', isToday ? 'text-emerald-600' : 'text-slate-400')}>{d.day.slice(0, 3)}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Daily Meals */}
            <div>
                <h3 className="font-black text-slate-900 text-lg mb-3 flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-emerald-500" /> الوجبات اليومية التفصيلية
                    <Badge className="bg-emerald-50 text-emerald-700 border-0 font-bold">{totalCal} سعرة إجمالاً</Badge>
                </h3>
                <div className="space-y-2.5">
                    {report.meals.map((meal, idx) => (
                        <div key={idx} className="bg-white rounded-[1.25rem] border border-slate-100 shadow-sm overflow-hidden">
                            <button
                                className="w-full flex items-center gap-3 p-4 text-right"
                                onClick={() => setExpandedMeal(expandedMeal === idx ? null : idx)}
                            >
                                <span className="text-2xl">{meal.emoji}</span>
                                <div className="flex-1">
                                    <p className="font-black text-slate-900">{meal.name}</p>
                                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                        <span className="text-xs font-bold text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {meal.time}</span>
                                        <span className="text-xs font-bold text-orange-500 flex items-center gap-1"><Flame className="w-3 h-3" /> {meal.calories} ك.ح</span>
                                        <span className="text-xs font-bold text-blue-600">{meal.protein}g بروتين</span>
                                    </div>
                                </div>
                                <ChevronLeft className={cn('w-4 h-4 text-slate-300 transition-transform', expandedMeal === idx && '-rotate-90')} />
                            </button>

                            {expandedMeal === idx && (
                                <div className="px-5 pb-4 pt-1 border-t border-slate-50">
                                    {/* Macros */}
                                    <div className="grid grid-cols-3 gap-2 mb-3">
                                        {[
                                            { label: 'كربوهيدرات', val: `${meal.carbs}g`, bg: 'bg-orange-50 text-orange-700' },
                                            { label: 'بروتين', val: `${meal.protein}g`, bg: 'bg-blue-50 text-blue-700' },
                                            { label: 'دهون', val: `${meal.fat}g`, bg: 'bg-yellow-50 text-yellow-700' },
                                        ].map((m, i) => (
                                            <div key={i} className={`rounded-xl p-2.5 text-center ${m.bg.split(' ')[0]}`}>
                                                <p className={`font-black ${m.bg.split(' ')[1]} text-sm`}>{m.val}</p>
                                                <p className="text-slate-500 text-[10px] font-bold">{m.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Foods */}
                                    <div className="space-y-1.5">
                                        {meal.foods.map((f, i) => (
                                            <div key={i} className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0">
                                                <span className="text-slate-700 font-medium text-sm">{f.name}</span>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-slate-400 text-xs font-bold">{f.qty}</span>
                                                    <span className="text-orange-500 text-xs font-black">{f.cal} ك</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Supplements */}
            <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-5">
                <h3 className="font-black text-slate-900 text-base mb-4 flex items-center gap-2">
                    🧪 المكملات الغذائية الموصى بها
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {report.supplements.map((s, i) => (
                        <div key={i} className="flex items-center gap-3 bg-slate-50 rounded-2xl p-3 border border-slate-100">
                            <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                                <Zap className="w-4 h-4 text-indigo-600" />
                            </div>
                            <div>
                                <p className="font-black text-slate-900 text-sm">{s.name}</p>
                                <p className="text-slate-500 text-xs font-bold">{s.dose} · {s.timing}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Coach Notes */}
            <div className="bg-emerald-900/10 border border-emerald-200 rounded-[1.5rem] p-5">
                <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-black text-emerald-900 text-base">ملاحظات المدرب</h3>
                </div>
                <p className="text-emerald-800 font-medium leading-relaxed text-sm">{report.notes}</p>
                <div className="mt-4 pt-4 border-t border-emerald-200 flex items-center justify-between">
                    <div>
                        <p className="text-emerald-700 font-black text-sm">{report.issuedBy}</p>
                        <p className="text-emerald-500 text-xs font-bold">مدرب معتمد · منصة حَرَكة</p>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 border-0 font-bold">✓ موقّع رقمياً</Badge>
                </div>
            </div>
        </div>
    );
}
