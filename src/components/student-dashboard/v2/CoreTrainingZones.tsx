import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
    Activity,
    Brain,
    Heart,
    Play,
    Zap,
    Wind,
    Smile,
    User as UserIcon,
    Loader2
} from 'lucide-react';
import { ExercisePack, SmartExerciseService } from '@/services/SmartExerciseService';
import { ExercisePackCard } from '@/components/smart-exercises/ExercisePackCard';

export const CoreTrainingZones: React.FC = () => {
    const [packs, setPacks] = useState<ExercisePack[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPacks = async () => {
            try {
                const data = await SmartExerciseService.getAllPacks();
                setPacks(data);
            } catch (error) {
                console.error("Failed to load packs", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPacks();
    }, []);

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;
    }

    const motorPacks = packs.filter(p => p.category === 'Motor');
    const cognitivePacks = packs.filter(p => p.category === 'Cognitive');
    const mentalPacks = packs.filter(p => p.category === 'Mental');
    const rehabPacks = packs.filter(p => p.category === 'Rehabilitation');

    return (
        <div className="space-y-16">

            {/* Motor Performance Zone */}
            <section className="bg-white/[0.02] border border-white/[0.05] p-8 rounded-[2.5rem] backdrop-blur-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-2 h-12 bg-blue-600 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)]"></div>
                        <div>
                            <h3 className="text-3xl font-black text-white tracking-tight mb-1">منطقة الأداء الحركي</h3>
                            <p className="text-base font-bold text-blue-200/70">التوازن، الرشاقة، السرعة، والتوافق العضلي</p>
                        </div>
                    </div>
                    <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-4 py-1 self-start md:self-auto">الأداء الحركي</Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {motorPacks.map(pack => (
                        <ExercisePackCard key={pack.id} pack={pack} />
                    ))}
                </div>
            </section>

            {/* Cognitive Performance Zone */}
            <section className="bg-white/[0.02] border border-white/[0.05] p-8 rounded-[2.5rem] backdrop-blur-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-2 h-12 bg-green-600 rounded-full shadow-[0_0_20px_rgba(22,163,74,0.4)]"></div>
                        <div>
                            <h3 className="text-3xl font-black text-white tracking-tight mb-1">منطقة الأداء الذهني</h3>
                            <p className="text-base font-bold text-green-200/70">التركيز، الذاكرة، سرعة المعالجة، واتخاذ القرار</p>
                        </div>
                    </div>
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20 px-4 py-1 self-start md:self-auto">المصفوفة المعرفية</Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cognitivePacks.map(pack => (
                        <ExercisePackCard key={pack.id} pack={pack} />
                    ))}
                </div>
            </section>

            {/* Psychological Wellbeing Zone (Mental) */}
            <section className="bg-white/[0.02] border border-white/[0.05] p-8 rounded-[2.5rem] backdrop-blur-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-2 h-12 bg-purple-600 rounded-full shadow-[0_0_20px_rgba(147,51,234,0.4)]"></div>
                        <div>
                            <h3 className="text-3xl font-black text-white tracking-tight mb-1">منطقة الرفاه النفسي</h3>
                            <p className="text-base font-bold text-purple-200/70">تنظيم المشاعر، الثقة بالنفس، وإدارة التوتر</p>
                        </div>
                    </div>
                    <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 px-4 py-1 self-start md:self-auto">منطقة الرفاه</Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {mentalPacks.map(pack => (
                        <ExercisePackCard key={pack.id} pack={pack} />
                    ))}
                </div>
            </section>

            {/* Rehabilitation Zone */}
            <section className="bg-white/[0.02] border border-white/[0.05] p-8 rounded-[2.5rem] backdrop-blur-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-2 h-12 bg-orange-500 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.4)]"></div>
                        <div>
                            <h3 className="text-3xl font-black text-white tracking-tight mb-1">منطقة التأهيل الحركي</h3>
                            <p className="text-base font-bold text-orange-200/70">المرونة، التوازن العلاجي، والتحكم الدقيق</p>
                        </div>
                    </div>
                    <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20 px-4 py-1 self-start md:self-auto">إعادة التأهيل</Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {rehabPacks.map(pack => (
                        <ExercisePackCard key={pack.id} pack={pack} />
                    ))}
                </div>
            </section>
        </div>
    );
};
