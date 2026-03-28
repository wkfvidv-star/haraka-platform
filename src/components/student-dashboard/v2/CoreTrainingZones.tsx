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
    Loader2,
    Crosshair
} from 'lucide-react';
import { ExercisePack, SmartExerciseService } from '@/services/SmartExerciseService';
import { ExercisePackCard } from '@/components/smart-exercises/ExercisePackCard';
import { RecoveryTimeline } from './RecoveryTimeline';
import { SessionEngine } from './SessionEngine';
import { ExercisePackDetailsModal } from './ExercisePackDetailsModal';
import { BaseExercise } from '@/types/ExerciseTypes';

export const CoreTrainingZones: React.FC = () => {
    const [packs, setPacks] = useState<ExercisePack[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeExercise, setActiveExercise] = useState<BaseExercise | null>(null);
    const [selectedPack, setSelectedPack] = useState<ExercisePack | null>(null);
    const [openZone, setOpenZone] = useState<string | null>(null);
    const [motorFilter, setMotorFilter] = useState<string>('الكل');

    const handlePackSelect = (pack: ExercisePack) => {
        setSelectedPack(pack);
    };

    const startSession = (pack: ExercisePack) => {
        setSelectedPack(null); // Close details modal
        setActiveExercise({
            id: pack.id,
            title: pack.title,
            description: pack.description,
            category: pack.category.toLowerCase() as any,
            level: pack.difficulty.toLowerCase() as any,
            durationSeconds: pack.exercises.length * 60,
            completed: false
        });
    };

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
    const filteredMotorPacks = motorFilter === 'الكل' ? motorPacks : motorPacks.filter(p => p.subCategory === motorFilter);
    
    const cognitivePacks = packs.filter(p => p.category === 'Cognitive');
    const perceptualPacks = packs.filter(p => p.category === 'Perceptual');
    const mentalPacks = packs.filter(p => p.category === 'Mental');
    const rehabPacks = packs.filter(p => p.category === 'Rehabilitation');

    return (
        <div className="space-y-16">

            {/* Motor Performance Zone */}
            <section className={`bg-white/[0.02] border border-white/[0.05] p-8 rounded-[2.5rem] backdrop-blur-sm relative overflow-hidden group transition-all duration-500 ${openZone === 'motor' ? 'ring-2 ring-blue-500/50 bg-white/[0.04]' : 'hover:bg-white/[0.04]'}`}>
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-blue-500/20 transition-all duration-700" />
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6 relative z-10">
                    <div className="flex items-center gap-5">
                        <div className="w-2.5 h-14 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full shadow-[0_0_25px_rgba(37,99,235,0.5)]"></div>
                        <div>
                            <h3 className="text-3xl font-black text-white tracking-tight mb-1">منطقة الأداء الحركي</h3>
                            <p className="text-base font-bold text-blue-200/70">التوازن، الرشاقة، السرعة، والتوافق العضلي</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 self-start md:self-auto">
                        <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-5 py-1.5 rounded-full font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-500/10 hidden sm:flex">الأداء الحركي</Badge>
                        <Button 
                            onClick={() => setOpenZone(openZone === 'motor' ? null : 'motor')}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl px-6"
                        >
                            {openZone === 'motor' ? 'إغلاق المركز' : 'دخول المركز'}
                            <Play className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0" />
                        </Button>
                    </div>
                </div>

                {openZone === 'motor' && (
                    <div className="animate-in slide-in-from-top-4 fade-in duration-500 pt-6 border-t border-white/5 space-y-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <h4 className="text-lg font-bold text-white flex items-center gap-2">
                                <Activity className="w-5 h-5 text-blue-400" />
                                البرامج التدريبية المتاحة ({motorPacks.length})
                            </h4>
                            <div className="flex flex-wrap items-center gap-2">
                                {['الكل', 'Agility', 'Speed', 'Balance', 'Strength', 'Coordination', 'Endurance'].map(category => (
                                    <button
                                        key={category}
                                        onClick={() => setMotorFilter(category)}
                                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                                            motorFilter === category 
                                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                                            : 'bg-white/5 text-blue-200/70 hover:bg-white/10'
                                        }`}
                                    >
                                        {category === 'الكل' ? 'الكل' : 
                                         category === 'Agility' ? 'الرشاقة التفاعلية' :
                                         category === 'Speed' ? 'السرعة الانفجارية' :
                                         category === 'Balance' ? 'التوازن الثابت' :
                                         category === 'Strength' ? 'القوة الوظيفية' :
                                         category === 'Coordination' ? 'التوافق الحركي' :
                                         'التحمل الأساسي'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                            {filteredMotorPacks.map(pack => (
                                <ExercisePackCard key={pack.id} pack={pack} onStart={() => handlePackSelect(pack)} />
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {/* Cognitive Performance Zone */}
            <section className="bg-white/[0.02] border border-white/[0.05] p-8 rounded-[2.5rem] backdrop-blur-sm relative overflow-hidden group hover:bg-white/[0.04] transition-all duration-500">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-500/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-green-500/20 transition-all duration-700" />
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6 relative z-10">
                    <div className="flex items-center gap-5">
                        <div className="w-2.5 h-14 bg-gradient-to-b from-green-400 to-green-600 rounded-full shadow-[0_0_25px_rgba(34,197,94,0.5)]"></div>
                        <div>
                            <h3 className="text-3xl font-black text-white tracking-tight mb-1">منطقة الأداء الذهني</h3>
                            <p className="text-base font-bold text-green-200/70">التركيز، الذاكرة، سرعة المعالجة، واتخاذ القرار</p>
                        </div>
                    </div>
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20 px-5 py-1.5 rounded-full font-black text-xs uppercase tracking-wider self-start md:self-auto shadow-lg shadow-green-500/10">المصفوفة المعرفية</Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                    {cognitivePacks.map(pack => (
                        <ExercisePackCard key={pack.id} pack={pack} onStart={() => handlePackSelect(pack)} />
                    ))}
                </div>
            </section>

            {/* Perceptual Performance Zone */}
            <section className="bg-white/[0.02] border border-white/[0.05] p-8 rounded-[2.5rem] backdrop-blur-sm relative overflow-hidden group hover:bg-white/[0.04] transition-all duration-500">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-700" />
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6 relative z-10">
                    <div className="flex items-center gap-5">
                        <div className="w-2.5 h-14 bg-gradient-to-b from-indigo-400 to-indigo-600 rounded-full shadow-[0_0_25px_rgba(99,102,241,0.5)]"></div>
                        <div>
                            <h3 className="text-3xl font-black text-white tracking-tight mb-1">منطقة الأداء الإدراكي</h3>
                            <p className="text-base font-bold text-indigo-200/70">التوقع، التفاعل البصري، والوعي المحيطي</p>
                        </div>
                    </div>
                    <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 px-5 py-1.5 rounded-full font-black text-xs uppercase tracking-wider self-start md:self-auto shadow-lg shadow-indigo-500/10">التطور الإدراكي</Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                    {perceptualPacks.length > 0 ? (
                        perceptualPacks.map(pack => (
                            <ExercisePackCard key={pack.id} pack={pack} onStart={() => handlePackSelect(pack)} />
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                            <Crosshair className="w-12 h-12 text-orange-500/30 mx-auto mb-4" />
                            <p className="text-gray-500 font-bold">قريباً: تمارين الإدراك البصري التفاعلية</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Psychological Wellbeing Zone (Mental) */}
            <section className="bg-white/[0.02] border border-white/[0.05] p-8 rounded-[2.5rem] backdrop-blur-sm relative overflow-hidden group hover:bg-white/[0.04] transition-all duration-500">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-purple-500/20 transition-all duration-700" />
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6 relative z-10">
                    <div className="flex items-center gap-5">
                        <div className="w-2.5 h-14 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full shadow-[0_0_25px_rgba(147,51,234,0.5)]"></div>
                        <div>
                            <h3 className="text-3xl font-black text-white tracking-tight mb-1">منطقة الرفاه النفسي</h3>
                            <p className="text-base font-bold text-purple-200/70">تنظيم المشاعر، الثقة بالنفس، وإدارة التوتر</p>
                        </div>
                    </div>
                    <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 px-5 py-1.5 rounded-full font-black text-xs uppercase tracking-wider self-start md:self-auto shadow-lg shadow-purple-500/10">منطقة الرفاه</Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                    {mentalPacks.map(pack => (
                        <ExercisePackCard key={pack.id} pack={pack} onStart={() => handlePackSelect(pack)} />
                    ))}
                </div>
            </section>

            {/* Rehabilitation Zone */}
            <section className="bg-white/[0.02] border border-white/[0.05] p-8 rounded-[2.5rem] backdrop-blur-sm relative overflow-hidden group hover:bg-white/[0.04] transition-all duration-500">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-orange-500/20 transition-all duration-700" />
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6 relative z-10">
                    <div className="flex items-center gap-5">
                        <div className="w-2.5 h-14 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full shadow-[0_0_25px_rgba(249,115,22,0.5)]"></div>
                        <div>
                            <h3 className="text-3xl font-black text-white tracking-tight mb-1">منطقة التأهيل الحركي</h3>
                            <p className="text-base font-bold text-orange-200/70">المرونة، التوازن العلاجي، والتحكم الدقيق</p>
                        </div>
                    </div>
                    <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20 px-5 py-1.5 rounded-full font-black text-xs uppercase tracking-wider self-start md:self-auto shadow-lg shadow-orange-500/10">إعادة التأهيل</Badge>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {rehabPacks.map(pack => (
                            <ExercisePackCard key={pack.id} pack={pack} onStart={() => handlePackSelect(pack)} />
                        ))}
                    </div>
                    <div className="lg:col-span-1">
                        <RecoveryTimeline />
                    </div>
                </div>
            </section>

            {/* Modals */}
            {selectedPack && (
                <ExercisePackDetailsModal
                    pack={selectedPack}
                    onClose={() => setSelectedPack(null)}
                    onStartSession={startSession}
                />
            )}

            {activeExercise && (
                <SessionEngine exercise={activeExercise} onClose={() => setActiveExercise(null)} />
            )}
        </div>
    );
};
