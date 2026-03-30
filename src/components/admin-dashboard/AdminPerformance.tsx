import React from 'react';
import { Activity, Brain, HeartPulse, Filter, TrendingUp, Download, BarChart3, Target, TrendingDown, Users, Clock, AlertTriangle, Cpu } from 'lucide-react';

// ==========================================
// 100% NATIVE, CRASH-FREE IMPLEMENTATION
// Removed ALL external heavy dependencies (Recharts, Radix Select, Framer Motion)
// Built exclusively with React + Tailwind CSS
// ==========================================

export const AdminPerformance: React.FC = () => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-cairo" dir="rtl">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/40 p-6 rounded-2xl border border-slate-800/50 backdrop-blur-md">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                        <BarChart3 className="w-8 h-8 text-blue-500" />
                        تحليل الأداء العام للطلاب
                    </h2>
                    <p className="text-slate-400 font-medium mt-2 text-sm md:text-base">
                        نظرة شاملة ومستقرة لمؤشرات التقدم عبر المدرسة بالكامل (بدون مكتبات خارجية).
                    </p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white rounded-xl font-bold transition-colors">
                        <Filter className="w-4 h-4" />
                        تصفية
                    </button>
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 rounded-xl font-bold transition-all">
                        <Download className="w-4 h-4" />
                        تصدير التقرير
                    </button>
                </div>
            </div>

            {/* Native Styled Filters (Zero JS looping risks) */}
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 backdrop-blur-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'مرحلة التعليم', opts: ['كل المراحل', 'الابتدائية', 'المتوسطة'] },
                    { label: 'الصف الدراسي', opts: ['جميع الصفوف', 'الرابع', 'الخامس', 'السادس'] },
                    { label: 'الفترة الزمنية', opts: ['هذا الشهر', 'هذا الأسبوع', 'الفصل الأول'] },
                    { label: 'المعلم المتابع', opts: ['تحليل شامل', 'أ. محمود (بدنية)', 'أ. فاطمة (نفسي)'] }
                ].map((filter, i) => (
                    <div key={i} className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 px-1">{filter.label}</label>
                        <div className="relative">
                            <select className="appearance-none w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm font-bold rounded-xl px-4 py-3 pr-10 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer">
                                {filter.opts.map((opt, j) => <option key={j} value={opt}>{opt}</option>)}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Native KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: 'النشاط الحركي العام', value: '88%', trend: '+4.5%', isUp: true, icon: Activity, color: 'text-blue-500', barCol: 'bg-blue-500', desc: 'متوسط الأداء الرياضي' },
                    { title: 'الأداء المعرفي', value: '76%', trend: '+2.1%', isUp: true, icon: Brain, color: 'text-emerald-500', barCol: 'bg-emerald-500', desc: 'استيعاب الخطط والوعي' },
                    { title: 'الرفاه النفسي', value: '92%', trend: '-1.2%', isUp: false, icon: HeartPulse, color: 'text-rose-500', barCol: 'bg-rose-500', desc: 'قياسات التوتر والمزاج' },
                ].map((kpi, idx) => (
                    <div key={idx} className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-700/50 overflow-hidden relative group hover:-translate-y-1 transition-transform duration-300">
                        {/* Native Progress Line */}
                        <div className={`absolute bottom-0 right-0 left-0 h-1.5 ${kpi.barCol} opacity-50 group-hover:opacity-100 transition-opacity`} />
                        <div className="p-6 relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 shadow-inner">
                                    <kpi.icon className={`h-7 w-7 ${kpi.color}`} />
                                </div>
                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold ${kpi.isUp ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'}`}>
                                    {kpi.isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                    <span dir="ltr">{kpi.trend}</span>
                                </div>
                            </div>
                            <h3 className="text-5xl font-black text-white mb-2">{kpi.value}</h3>
                            <p className="text-slate-200 font-bold mb-1.5 text-lg">{kpi.title}</p>
                            <p className="text-slate-500 text-sm font-medium">{kpi.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Dual Native CSS Charts - 100% crash proof */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-0">
                
                {/* 1. Bar Chart native implementation */}
                <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 flex flex-col">
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
                            <Target className="w-5 h-5 text-purple-500" />
                            توزيع مستويات الأداء الطلابي
                        </h3>
                        <p className="text-slate-400 text-sm">التصنيف التفصيلي لمستويات التطور العام (رسوم أصلية)</p>
                    </div>
                    {/* CSS Bar Chart Canvas */}
                    <div className="flex-1 min-h-[250px] relative flex items-end justify-between px-2 pt-10 pb-8 border-b border-t border-slate-800 border-dashed">
                        {[
                            { label: 'مبتدئ', value: 15, h: '30%', col: 'bg-slate-600' },
                            { label: 'تأسيسي', value: 25, h: '45%', col: 'bg-amber-500' },
                            { label: 'متوسط', value: 40, h: '80%', col: 'bg-blue-500' },
                            { label: 'متقدم', value: 20, h: '40%', col: 'bg-emerald-500' },
                        ].map((bar, i) => (
                            <div key={i} className="flex flex-col items-center group w-1/5 relative">
                                {/* Tooltip */}
                                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs font-bold py-1 px-3 rounded shadow-xl pointer-events-none transform -translate-y-2 group-hover:translate-y-0 duration-200">
                                    {bar.value}%
                                </div>
                                {/* Bar Body */}
                                <div 
                                    className={`w-full max-w-[4rem] rounded-t-lg mx-auto transition-all duration-700 ease-out ${bar.col} group-hover:brightness-110 shadow-[0_0_15px_rgba(0,0,0,0.2)]`}
                                    style={{ height: bar.h }}
                                />
                                {/* Label */}
                                <span className="absolute -bottom-7 text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest">{bar.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Progress Rows native implementation */}
                <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 flex flex-col">
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
                            <Activity className="w-5 h-5 text-pink-500" />
                            معدل تطور المهارات
                        </h3>
                        <p className="text-slate-400 text-sm">مقارنة اكتساب المهارات المختلفة للفصل الجاري</p>
                    </div>
                    <div className="flex-1 space-y-6 pt-2">
                        {[
                            { name: 'اللياقة القلبية (Cardio)', pct: 85, color: 'from-pink-500 to-rose-400' },
                            { name: 'الوعي المكاني والتكتيكي', pct: 72, color: 'from-blue-600 to-cyan-400' },
                            { name: 'التوازن العصبي العضلي', pct: 64, color: 'from-emerald-500 to-teal-400' },
                            { name: 'الصحة النفسية والإيجابية', pct: 91, color: 'from-purple-500 to-indigo-400' },
                        ].map((skill, i) => (
                            <div key={i} className="space-y-2.5">
                                <div className="flex justify-between items-end text-sm">
                                    <span className="text-slate-200 font-bold">{skill.name}</span>
                                    <span className="text-white font-black bg-slate-800 px-2 py-0.5 rounded-md">{skill.pct}%</span>
                                </div>
                                <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full bg-gradient-to-r ${skill.color} rounded-full relative`}
                                        style={{ width: `${skill.pct}%` }}
                                    >
                                        <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Quick Micro-Stats (List layout) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'إجمالي الجلسات', val: '1,240', align: 'left', icon: Users, c: 'text-indigo-400' },
                    { label: 'ساعات التفاعل', val: '450+', align: 'left', icon: Clock, c: 'text-blue-400' },
                    { label: 'تنبيهات انخفاض', val: '12', align: 'left', icon: AlertTriangle, c: 'text-amber-400' },
                    { label: 'دقة الـ AI', val: '99%', align: 'left', icon: Cpu, c: 'text-emerald-400' }
                ].map((stat, i) => (
                    <div key={i} className="bg-slate-900/30 border border-slate-800/60 rounded-xl p-4 flex items-center gap-4 hover:bg-slate-800/50 transition-colors">
                        <div className={`p-2.5 bg-slate-900 rounded-lg border border-slate-700 ${stat.c}`}>
                            <stat.icon className="w-5 h-5"/>
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs font-bold mb-0.5">{stat.label}</p>
                            <h4 className="text-xl font-black text-white">{stat.val}</h4>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default AdminPerformance;
