import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Wifi, WifiOff, Unlock, Lock, Activity, Users, Clock, AlertTriangle, 
    MapPin, RefreshCcw, Search, ChevronLeft, ShieldCheck, Zap
} from 'lucide-react';

export default function SmartAccessControl() {
    const [logs, setLogs] = useState([
        { id: '1', user: 'أحمد محمد', role: 'طالب', time: '10:45:22', location: 'البوابة الرئيسية', status: 'مسموح' },
        { id: '2', user: 'سارة علي', role: 'طالبة', time: '10:43:10', location: 'الصالة الذكية', status: 'مسموح' },
        { id: '3', user: 'خالد الرياضي', role: 'معلم', time: '10:41:05', location: 'بوابة الإدارة', status: 'مسموح' },
        { id: '4', user: 'مجهول', role: 'غير معرف', time: '10:38:45', location: 'البوابة الخلفية', status: 'مرفوض', reason: 'بطاقة غير صالحة' },
        { id: '5', user: 'يوسف عبدالله', role: 'طالب', time: '10:35:12', location: 'المختبر', status: 'مسموح' },
    ]);

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [activeGates, setActiveGates] = useState({
        'البوابة الرئيسية': true,
        'البوابة الخلفية': true,
        'بوابة الإدارة': true,
        'الصالة الذكية': true
    });

    const refreshLogs = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 800);
    };

    const toggleGate = (gate: string) => {
        setActiveGates(prev => ({ ...prev, [gate as keyof typeof prev]: !prev[gate as keyof typeof prev] }));
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 font-cairo" dir="rtl">
            
            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                    { label: 'إجمالي الدخول (اليوم)', value: '428', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    { label: 'البوابات النشطة', value: '4/4', icon: Wifi, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    { label: 'تنبيهات أمنية', value: '3', icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                    { label: 'متوسط وقت العبور', value: '1.2 ثانية', icon: Clock, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                ].map((stat, i) => (
                    <Card key={i} className="bg-slate-900/60 border-slate-800/60 shadow-xl backdrop-blur-md">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl ${stat.bg}`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <Badge variant="outline" className="border-emerald-500/20 text-emerald-400 bg-emerald-500/10 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1.5 animate-pulse">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    مباشر
                                </Badge>
                            </div>
                            <div className="text-3xl font-black text-white">{stat.value}</div>
                            <div className="text-sm font-bold text-slate-400 mt-1">{stat.label}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* سجل الدخول المباشر */}
                <Card className="lg:col-span-2 bg-slate-900/60 border-slate-800/60 shadow-2xl backdrop-blur-md flex flex-col h-[550px]">
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-5 gap-4">
                        <div>
                            <CardTitle className="text-xl font-black text-white flex items-center gap-2">
                                <Activity className="w-5 h-5 text-blue-500" />
                                سجل الوصول المباشر
                            </CardTitle>
                            <CardDescription className="text-slate-400 mt-1 font-medium text-sm">متابعة حية وعرض فوري لعمليات الدخول والخروج من المرافق</CardDescription>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <div className="relative flex-1 sm:flex-none">
                                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <Input
                                    placeholder="بحث عن مستخدم..."
                                    className="bg-slate-950 border-slate-800 text-sm w-full sm:w-64 pr-9 rounded-xl h-10 text-white placeholder:text-slate-500 focus:border-blue-500"
                                    dir="rtl"
                                />
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                className={`rounded-xl bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 shrink-0 h-10 w-10 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`}
                                onClick={refreshLogs}
                            >
                                <RefreshCcw className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 overflow-y-auto flex-1 custom-scrollbar">
                        <div className="divide-y divide-slate-800/50">
                            {logs.map((log) => (
                                <div
                                    key={log.id}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-slate-800/30 transition-colors cursor-pointer group gap-4"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${log.status === 'مسموح' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'}`}>
                                            {log.status === 'مسموح' ? <ShieldCheck className="w-6 h-6 text-emerald-400" /> : <AlertTriangle className="w-6 h-6 text-rose-400" />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-black text-white text-base group-hover:text-blue-400 transition-colors">{log.user}</span>
                                                <Badge className="bg-slate-800 text-[10px] text-slate-300 border-slate-700 pointer-events-none">{log.role}</Badge>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
                                                <span className="text-xs items-center flex gap-1.5 text-slate-400 font-medium">
                                                    <MapPin className="w-3.5 h-3.5" /> {log.location}
                                                </span>
                                                <span className="text-xs items-center flex gap-1.5 text-slate-400 font-medium font-mono" dir="ltr">
                                                    <Clock className="w-3.5 h-3.5" /> <span dir="rtl">{log.time}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-2 sm:mt-0 pl-14 sm:pl-0">
                                        <div className="text-right flex flex-col items-end">
                                            <Badge className={`pointer-events-none px-3 py-1 font-bold ${log.status === 'مسموح' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                                                {log.status}
                                            </Badge>
                                            {log.reason && <span className="text-[10px] text-rose-400 font-bold mt-1.5 block">{log.reason}</span>}
                                        </div>
                                        <Button variant="ghost" size="icon" className="text-slate-500 group-hover:text-blue-400 rounded-full h-8 w-8 bg-slate-900/50">
                                            <ChevronLeft className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <div className="p-4 bg-slate-950/40 border-t border-slate-800 text-center rounded-b-xl">
                        <Button variant="link" className="text-blue-400 hover:text-blue-300 text-sm font-bold gap-2">
                            عرض كامل السجلات الأمنية <ChevronLeft className="w-4 h-4" />
                        </Button>
                    </div>
                </Card>

                {/* لوحة التحكم عن بعد للحركات الميدانية */}
                <div className="space-y-8 h-[550px] flex flex-col">
                    
                    {/* التحكم في البوابات */}
                    <Card className="bg-slate-900/60 border-slate-800/60 shadow-2xl backdrop-blur-md overflow-hidden relative group flex-1">
                        <div className="absolute top-0 left-0 p-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-700 pointer-events-none">
                            <Zap className="w-40 h-40 text-blue-500" />
                        </div>
                        <CardHeader className="pb-4 relative z-10 border-b border-slate-800/50">
                            <CardTitle className="text-xl font-black text-white flex items-center gap-2">
                                <Wifi className="w-5 h-5 text-emerald-500" />
                                تحكم البوابات عن بُعد
                            </CardTitle>
                            <CardDescription className="text-slate-400 font-medium mt-1">إغلاق/فتح مسارات الدخول بشكل يدوي</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-4 relative z-10 overflow-y-auto custom-scrollbar">
                            {Object.entries(activeGates).map(([gate, isOpen]) => (
                                <div key={gate} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${isOpen ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
                                            {isOpen ? <Wifi className="w-5 h-5 text-emerald-400" /> : <WifiOff className="w-5 h-5 text-amber-400" />}
                                        </div>
                                        <span className="text-sm font-bold text-white tracking-wide">{gate}</span>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant={isOpen ? "outline" : "default"}
                                        className={`rounded-xl px-4 h-9 font-bold tracking-wider transition-all duration-300 ${isOpen ? "border-rose-500/30 text-rose-400 bg-rose-500/5 hover:bg-rose-500/10" : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"}`}
                                        onClick={() => toggleGate(gate)}
                                    >
                                        {isOpen ? <Lock className="w-4 h-4 ml-2" /> : <Unlock className="w-4 h-4 ml-2" />}
                                        {isOpen ? 'إغلاق' : 'فتح'}
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* تنبيه البروتوكول الأمني */}
                    <Card className="bg-slate-900/60 border-slate-800/60 shadow-2xl backdrop-blur-md shrink-0">
                        <CardHeader className="py-4 border-b border-slate-800/50">
                            <CardTitle className="text-base font-black text-white flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-blue-500" />
                                بروتوكول الأمان الآلي
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-black text-blue-300 mb-1">الذكاء الاصطناعي نشط</p>
                                        <p className="text-xs text-blue-200/70 leading-relaxed font-medium">
                                            نظام كشف الشذوذ يعمل. سيتم حظر الممسوحات المتتالية الخاطئة تلقائياً لمنع الاختراق.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold rounded-xl h-11 transition-all">
                                إنشاء تقرير حوادث أمنية
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
