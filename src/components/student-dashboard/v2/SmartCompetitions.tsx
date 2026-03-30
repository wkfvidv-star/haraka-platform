import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Trophy, Clock, Users, ArrowUpRight, Loader2, ShieldCheck, Activity, Watch, CheckCircle2, AlertTriangle } from 'lucide-react';
import { healthService, Competition } from '@/services/healthService';
import { cn } from '@/lib/utils';

export const SmartCompetitions: React.FC = () => {
    const [competitions, setCompetitions] = useState<Competition[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedChallenge, setSelectedChallenge] = useState<any | null>(null);
    const [joinStep, setJoinStep] = useState(1);
    const [agreed, setAgreed] = useState(false);
    const [joinedIds, setJoinedIds] = useState<Set<number>>(new Set());

    useEffect(() => {
        const fetchCompetitions = async () => {
            try {
                setLoading(true);
                const data = await healthService.getHealthProfile();
                if (data.competitions) {
                    setCompetitions(data.competitions);
                }
            } catch (error) {
                console.error("Failed to fetch competitions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCompetitions();
    }, []);

    const challenges = competitions.length > 0 ? competitions.map(c => ({
        id: c.id,
        title: c.title,
        type: c.type === 'Physical' ? 'نشاط بدني' : c.type === 'Mental' ? 'ذهني' : 'مهارة حركية',
        participants: c.participants,
        timeLeft: 'نشط الآن',
        reward: `${c.rewardXp} XP`,
        color: c.type === 'Physical' ? 'bg-blue-100 text-blue-700' : c.type === 'Mental' ? 'bg-purple-100 text-purple-700' : 'bg-yellow-100 text-yellow-700',
        icon: c.type === 'Physical' ? '👣' : c.type === 'Mental' ? '⚡' : '⚖️'
    })) : [
        { id: 1, title: 'ماراثون الربيع (10كم)', type: 'التحمل القلبي', participants: 4200, timeLeft: '13 يوم', reward: 'شارة ماراثون', color: 'bg-emerald-500/10 text-emerald-400', icon: '🏃‍♂️' },
        { id: 2, title: 'الدقة العصبية (رد الفعل)', type: 'رياضة ذهنية', participants: 853, timeLeft: '12 ساعة', reward: '100 XP', color: 'bg-purple-500/10 text-purple-400', icon: '⚡' },
        { id: 3, title: 'التوازن فوق الكروي', type: 'توازن وثبات', participants: 1540, timeLeft: 'يومان', reward: 'شارة توازن', color: 'bg-yellow-500/10 text-yellow-400', icon: '⚖️' },
        { id: 4, title: 'دوري الـ 10,000 خطوة', type: 'نشاط يومي', participants: 8900, timeLeft: 'مستمر', reward: '50 XP', color: 'bg-blue-500/10 text-blue-400', icon: '👣' },
        { id: 5, title: 'بطولة الرشاقة (T-Test)', type: 'سرعة وتوافق', participants: 320, timeLeft: '5 ساعات', reward: '150 XP', color: 'bg-rose-500/10 text-rose-400', icon: '🎯' },
        { id: 6, title: 'تحديات الإطالة العميق', type: 'مرونة', participants: 670, timeLeft: 'أسبوع', reward: 'شارة المرونة', color: 'bg-cyan-500/10 text-cyan-400', icon: '🧘‍♂️' }
    ];

    const handleJoinClick = () => {
        setJoinStep(2);
        setTimeout(() => {
            setJoinStep(3);
            if (selectedChallenge) {
                setJoinedIds(prev => new Set(prev).add(selectedChallenge.id));
            }
        }, 1500);
    };

    return (
        <div className="space-y-6 px-4 md:px-0">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="p-2.5 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.15)] shrink-0">
                        <Trophy className="w-6 h-6 text-yellow-500" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                        المنافسات الاحترافية
                    </h3>
                </div>
                <Button variant="ghost" className="text-sm font-black text-blue-400 hover:bg-blue-500/10 self-start sm:self-auto px-4 border border-transparent hover:border-blue-500/20 rounded-xl transition-all">
                    عرض التصنيف العالمي
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {loading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-64 bg-white/5 animate-pulse rounded-2xl border border-white/5" />)
                ) : (
                    challenges.map((challenge) => {
                        const isJoined = joinedIds.has(challenge.id);
                        return (
                            <Card key={challenge.id} className="bg-[#151928]/80 backdrop-blur-xl group hover:shadow-2xl transition-all duration-300 border-white/5 hover:border-white/10 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] to-indigo-500/[0.02] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                                
                                <CardHeader className="pb-4 relative z-10 p-5 md:p-6">
                                    <div className="flex justify-between items-start mb-5">
                                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-white/10 bg-white/5 group-hover:-translate-y-1 transition-transform">
                                            {challenge.icon}
                                        </div>
                                        <Badge variant="outline" className="bg-white/5 text-slate-300 border-white/10 px-2.5 py-1 font-black text-[10px] uppercase rounded-full tracking-wider">
                                            <Clock className="w-3 h-3 mr-1.5 ml-1.5" />
                                            {challenge.timeLeft}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-2xl font-black text-white leading-tight mt-1 mb-2 tracking-tight line-clamp-1">
                                        {challenge.title}
                                    </CardTitle>
                                    <CardDescription className="text-xs font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 w-fit px-2 py-0.5 rounded-sm border border-blue-500/20">
                                        {challenge.type}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="relative z-10 p-5 md:p-6 pt-0">
                                    <div className="flex items-center justify-between text-xs font-black mb-6">
                                        <span className="flex items-center gap-1.5 text-slate-400">
                                            <Users className="w-4 h-4 text-indigo-400" />
                                            {challenge.participants.toLocaleString()} محترف
                                        </span>
                                        <span className="text-yellow-400 bg-yellow-400/10 px-2.5 py-1 rounded-md border border-yellow-400/20 flex items-center shadow-[0_0_10px_rgba(250,204,21,0.1)]">
                                            +{challenge.reward === 'Badge' ? 'شارة' : challenge.reward}
                                        </span>
                                    </div>
                                    <Button 
                                        className={cn(
                                            "w-full h-12 font-black rounded-xl shadow-lg transition-all border-none relative overflow-hidden z-10 flex items-center justify-center gap-2",
                                            isJoined 
                                                ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30" 
                                                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/20 active:scale-[0.98]"
                                        )}
                                        onClick={() => {
                                            if (!isJoined) {
                                                setSelectedChallenge(challenge);
                                                setJoinStep(1);
                                                setAgreed(false);
                                            }
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 hover:opacity-100 opacity-0 transition-opacity mix-blend-overlay pointer-events-none" />
                                        {isJoined ? (
                                            <>تم تأكيد الانضمام <CheckCircle2 className="w-5 h-5" /></>
                                        ) : (
                                            <>خوض المنافسة <ArrowUpRight className="w-4 h-4" /></>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>

            {/* Application Form Dialog */}
            <Dialog open={!!selectedChallenge} onOpenChange={(open) => !open && setSelectedChallenge(null)}>
                <DialogContent className="sm:max-w-md w-[95vw] max-h-[90vh] overflow-y-auto bg-[#0f121e]/95 backdrop-blur-2xl border-white/10 text-white p-0 shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-3xl [&>button]:right-5 [&>button]:top-5 [&>button]:text-white/50 hover:[&>button]:text-white" dir="rtl">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/5 pointer-events-none" />
                    {selectedChallenge && (
                        <div className="relative z-10 p-6 md:p-8">
                            
                            {/* Step 1: Pre-Join Requisites & Questionnaire */}
                            {joinStep === 1 && (
                                <div className="space-y-6">
                                    <div className="flex flex-col items-center text-center space-y-4 mb-8">
                                        <div className="w-20 h-20 rounded-[2rem] bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(59,130,246,0.15)] shrink-0 relative">
                                            <div className="absolute inset-0 bg-white/5 blur-sm rounded-[2rem]" />
                                            <span className="relative z-10 drop-shadow-md">{selectedChallenge.icon}</span>
                                        </div>
                                        <div className="w-full">
                                            <DialogTitle className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">{selectedChallenge.title}</DialogTitle>
                                            <DialogDescription className="text-sm font-bold mt-2 flex items-center justify-center gap-1.5 text-blue-400 bg-blue-500/5 py-1 px-3 rounded-md w-fit mx-auto border border-blue-500/10">
                                                <ShieldCheck className="w-4 h-4" />
                                                إجراءات ومتطلبات التسجيل الفني
                                            </DialogDescription>
                                        </div>
                                    </div>

                                    <div className="bg-[#151928] p-5 rounded-2xl border border-white/5 space-y-4 shadow-inner">
                                        <h4 className="text-sm font-black text-blue-400 flex items-center gap-2 tracking-wide">
                                            إجراءات التتبع والمزامنة (Operations):
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-4 text-sm text-slate-300 bg-white/[0.03] p-4 rounded-xl border border-white/5 hover:bg-white/[0.05] transition-colors">
                                                <Watch className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                                                <span className="leading-relaxed">يجب ربط وتشغيل السوار الذكي (Smart Tracker) لمعايرة الأداء طوال فترة المنافسة. لن يتم احتساب التقارير اليدوية.</span>
                                            </div>
                                            <div className="flex items-start gap-4 text-sm text-slate-300 bg-white/[0.03] p-4 rounded-xl border border-white/5 hover:bg-white/[0.05] transition-colors">
                                                <Activity className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                                                <span className="leading-relaxed">يتم تسجيل إحصائياتك من خلال نموذج الذكاء الاصطناعي الخاص بالمنصة لضمان العدالة وتجنب أي طفرات غير طبيعية في الأرقام.</span>
                                            </div>
                                            <div className="flex items-start gap-4 text-sm text-slate-300 bg-white/[0.03] p-4 rounded-xl border border-white/5 hover:bg-white/[0.05] transition-colors">
                                                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                                                <span className="leading-relaxed">في الاستبيان، تأكد من إعداد نطاق الوزن والطول والنشاط المرجعي لضمان وجودك في الفئة العادلة للمنافسة.</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                                        <input 
                                            type="checkbox" 
                                            id="agree" 
                                            checked={agreed} 
                                            onChange={(e) => setAgreed(e.target.checked)}
                                            className="w-5 h-5 rounded border-white/20 bg-black/50 text-blue-500 focus:ring-blue-500/50 focus:ring-offset-0 cursor-pointer"
                                        />
                                        <label htmlFor="agree" className="text-sm text-white font-bold select-none cursor-pointer leading-tight">
                                            أقر بأن أجهزتي مزامنة، ومستعد لاتباع معايير المنافسة النزيهة.
                                        </label>
                                    </div>

                                    <DialogFooter className="mt-8 flex sm:justify-between gap-3">
                                        <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/10 font-bold" onClick={() => setSelectedChallenge(null)}>إلغاء</Button>
                                        <Button 
                                            disabled={!agreed} 
                                            className="bg-blue-600 hover:bg-blue-500 text-white font-black min-w-[140px] shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all disabled:opacity-50 disabled:shadow-none"
                                            onClick={handleJoinClick}
                                        >
                                            استكمال الانضمام
                                        </Button>
                                    </DialogFooter>
                                </div>
                            )}

                            {/* Step 2: Processing Operation */}
                            {joinStep === 2 && (
                                <div className="py-16 flex flex-col items-center justify-center text-center space-y-5">
                                    <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20 shadow-inner overflow-hidden relative">
                                        <div className="absolute inset-0 bg-blue-400/20 animate-pulse" />
                                        <Loader2 className="w-10 h-10 text-blue-400 animate-spin relative z-10" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white tracking-tight mb-2">جاري مزامنة الإجراءات وتأكيد الطلب</h3>
                                        <p className="text-sm text-slate-400 font-medium">يتم الآن تسجيل بروتوكولات النشاط وإدراجك في التصنيف...</p>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Success */}
                            {joinStep === 3 && (
                                <div className="py-10 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in duration-300">
                                    <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                                        <CheckCircle2 className="w-14 h-14 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-black text-white tracking-tight mb-2">تم الانضمام بنجاح!</h3>
                                        <p className="text-lg text-slate-300 font-medium">أنت الآن عضو معتمد في {selectedChallenge.title}</p>
                                        <p className="text-sm text-slate-500 mt-2">ابدأ نشاطك الآن وسيتم احتساب التطور تلقائياً.</p>
                                    </div>
                                    <Button 
                                        className="mt-4 bg-white/10 hover:bg-white/20 text-white font-black w-full h-12 border border-white/10 transition-colors text-lg"
                                        onClick={() => setSelectedChallenge(null)}
                                    >
                                        إغلاق
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};
