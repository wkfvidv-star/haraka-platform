import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, ChevronRight, PlayCircle, CheckCircle2, Timer, Volume2, VolumeX, Maximize2, Activity, Zap, Brain, Target, Video, Info } from 'lucide-react';
import { SmartExerciseService, ExercisePack, Exercise } from '@/services/SmartExerciseService';
import { activityService } from '@/services/activityService';
import { useTranslation } from '@/contexts/ThemeContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles } from 'lucide-react';

export const ExerciseSessionPage: React.FC = () => {
    const { packId } = useParams<{ packId: string }>();
    const navigate = useNavigate();
    const { isRTL } = useTheme();
    const { user, refreshProfiles } = useAuth();
    const [pack, setPack] = useState<ExercisePack | null>(null);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);

    // Safety check for loading
    useEffect(() => {
        const loadPack = async () => {
            if (!packId) return;
            const data = await SmartExerciseService.getPackById(packId);
            if (data) {
                setPack(data);
            } else {
                // If not found, go back
                navigate(-1);
            }
        };
        loadPack();
    }, [packId, navigate]);

    if (!pack) return <div className="flex items-center justify-center min-h-screen">Loading Session...</div>;

    const currentExercise = pack.exercises[currentExerciseIndex];
    const progress = ((currentExerciseIndex) / pack.exercises.length) * 100;

    const handleNext = async () => {
        if (currentExerciseIndex < pack.exercises.length - 1) {
            setCurrentExerciseIndex(prev => prev + 1);
        } else {
            // Pack complete!
            setIsSaving(true);
            try {
                if (user?.id && packId) {
                    await activityService.completeSession(
                        user.id,
                        packId,
                        5, // Hardcoded for now
                        100 // Hardcoded XP
                    );
                    // Refresh profile data to see updated XP/Level
                    if (refreshProfiles) await refreshProfiles();
                }
                setIsComplete(true);
            } catch (error) {
                console.error("Failed to save session", error);
                setIsComplete(true);
            } finally {
                setIsSaving(false);
            }
        }
    };

    const handleBack = () => {
        // Return to Main Menu (Dashboard)
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-background p-4 md:p-8 space-y-6">
            {/* Top Navigation Bar with Back Button */}
            <header className="flex items-center gap-4 border-b pb-4 mb-6">
                <Button variant="outline" size="sm" onClick={handleBack} className="gap-2 hover:bg-muted border-primary/20 text-primary">
                    {isRTL ? <ArrowRight className="w-5 h-5" /> : <ChevronRight className="w-5 h-5 rotate-180" />}
                    <span className="text-lg font-bold">القائمة الرئيسية (Main Menu)</span>
                </Button>
                <div>
                    <h1 className="text-xl font-bold">{pack.title}</h1>
                    <p className="text-sm text-muted-foreground">{pack.category} • {pack.difficulty}</p>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto space-y-8">

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{currentExerciseIndex + 1} / {pack.exercises.length}</span>
                    </div>
                    <Progress value={isComplete ? 100 : progress} className="h-2" />
                </div>

                {!isComplete ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Professional Video UI */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="relative flex flex-col gap-4"
                        >
                            <Card className="aspect-video bg-[#030712] overflow-hidden group border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)] ring-1 ring-white/10 relative rounded-3xl">
                                {currentExercise.videoUrl ? (
                                    <video
                                        src={currentExercise.videoUrl}
                                        className="w-full h-full object-cover"
                                        autoPlay={isPlaying}
                                        muted={isMuted}
                                        loop
                                        playsInline
                                        onPlay={() => setIsPlaying(true)}
                                        onPause={() => setIsPlaying(false)}
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center">
                                        <div className="text-center space-y-4">
                                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto ring-1 ring-white/10">
                                                <Video className="w-10 h-10 text-indigo-400/50" />
                                            </div>
                                            <p className="text-gray-500 font-bold text-sm">جاري تحميل العرض التوضيحي البصري...</p>
                                        </div>
                                    </div>
                                )}

                                {/* Cinematic Overlays */}
                                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
                                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

                                {/* Pro Overlays: Stats & AI Feedback */}
                                <div className="absolute top-6 left-6 flex flex-col gap-3">
                                    <Badge className="bg-indigo-600/90 text-white border-none px-4 py-1.5 font-bold shadow-lg backdrop-blur-md flex gap-2 items-center">
                                        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                        <span>نظام التوجيه الذكي (AI Active)</span>
                                    </Badge>
                                    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex gap-4 items-center">
                                        <div className="p-2 bg-blue-500/20 rounded-lg">
                                            <Activity className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">دقة الحركة</div>
                                            <div className="text-xl font-black text-white leading-none">94%</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Top Right: Category Icon */}
                                <div className="absolute top-6 right-6">
                                    <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white">
                                        {pack.category === 'Motor' && <Zap className="w-6 h-6" />}
                                        {pack.category === 'Cognitive' && <Brain className="w-6 h-6" />}
                                        {pack.category === 'Perceptual' && <Target className="w-6 h-6" />}
                                        {(pack.category === 'Mental' || pack.category === 'Rehabilitation') && <Activity className="w-6 h-6" />}
                                    </div>
                                </div>

                                {/* Bottom Controls Overlay */}
                                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-auto">
                                    <div className="flex gap-3">
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            className="h-10 w-10 p-0 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 border-white/10 text-white"
                                            onClick={() => setIsPlaying(!isPlaying)}
                                        >
                                            <PlayCircle className={`w-5 h-5 ${isPlaying ? 'fill-current' : ''}`} />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            className="h-10 w-10 p-0 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 border-white/10 text-white"
                                            onClick={() => setIsMuted(!isMuted)}
                                        >
                                            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                        </Button>
                                    </div>
                                    <div className="flex gap-2">
                                        <Badge className="bg-white/10 backdrop-blur-md border-white/10 text-white font-bold h-8 flex items-center px-3">
                                            1080p Crystal Clear
                                        </Badge>
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            className="h-10 w-10 p-0 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 border-white/10 text-white"
                                        >
                                            <Maximize2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>

                            <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-4 flex items-start gap-4">
                                <div className="p-2 bg-indigo-500/20 rounded-lg shrink-0">
                                    <Info className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-indigo-300 mb-1">توجيه من المدرب الذكي:</h4>
                                    <p className="text-xs font-bold text-gray-400 leading-relaxed">ركز على استقامة الظهر والحفاظ على وتيرة ثابتة. النظام يقوم الآن بتحليل التوازن بين الجانبين.</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Instructions */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <Card className="shadow-xl border-none bg-white dark:bg-slate-900/50 backdrop-blur-xl">
                                <CardHeader>
                                    <div className="flex justify-between items-center mb-2">
                                        <CardTitle className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">{currentExercise.title}</CardTitle>
                                        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
                                            <Timer className="w-3 h-3" />
                                            {currentExercise.duration}
                                        </div>
                                    </div>
                                    <CardDescription className="text-base font-medium leading-relaxed">{currentExercise.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-8">
                                    <div className="space-y-4">
                                        <h3 className="font-black text-xs uppercase tracking-[2px] text-slate-400">طريقة الأداء (Execution Steps):</h3>
                                        <ul className="space-y-4">
                                            {currentExercise.instructions.map((step, idx) => (
                                                <motion.li
                                                    key={idx}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    className="flex gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-blue-100 dark:hover:border-blue-900"
                                                >
                                                    <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-blue-500/30">
                                                        {idx + 1}
                                                    </span>
                                                    <span className="font-bold text-slate-700 dark:text-slate-300">{step}</span>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </div>

                                    <Button
                                        size="lg"
                                        className="w-full h-14 text-xl font-black rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all active:scale-95 gap-3"
                                        onClick={handleNext}
                                    >
                                        {currentExerciseIndex === pack.exercises.length - 1 ? (
                                            <>إنهاء الحزمة <CheckCircle2 className="w-6 h-6" /></>
                                        ) : (
                                            <>التمرين التالي <ArrowRight className="w-6 h-6" /></>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-2xl mx-auto"
                    >
                        <Card className="text-center py-16 px-8 relative overflow-hidden border-none shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] bg-[#030712] rounded-[3rem] ring-1 ring-white/10">
                            {/* Pro Decorative Background Accents */}
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600" />
                            <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
                            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="relative z-10"
                            >
                                <div className="relative inline-block mb-10">
                                    <div className="w-32 h-32 bg-gradient-to-tr from-indigo-600 to-blue-500 text-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-[0_20px_40px_rgba(37,99,235,0.4)] rotate-3">
                                        <Trophy className="w-16 h-16" />
                                    </div>
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg"
                                    >
                                        <Sparkles className="w-6 h-6 text-white" />
                                    </motion.div>
                                </div>

                                <h2 className="text-5xl font-black text-white mb-4 tracking-tighter">إنجاز استثنائي!</h2>
                                <p className="text-xl font-bold text-gray-400 mb-12">لقد أتممت <span className="text-blue-400 font-black">{pack.title}</span> بكفاءة عالية</p>

                                <div className="grid grid-cols-3 gap-6 mb-12">
                                    {[
                                        { label: 'نقاط الخبرة XP', value: '+100', color: 'text-blue-400', bg: 'bg-blue-500/10' },
                                        { label: 'العملات PlayCoins', value: '+20', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
                                        { label: 'سرعة الإنجاز', value: 'أداء ممتاز', color: 'text-green-400', bg: 'bg-green-500/10' }
                                    ].map((stat, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 + (idx * 0.1) }}
                                            className={`${stat.bg} p-6 rounded-[2rem] border border-white/5 backdrop-blur-md shadow-inner`}
                                        >
                                            <div className={`text-2xl font-black ${stat.color} mb-1`}>{stat.value}</div>
                                            <div className="text-[10px] font-black uppercase tracking-[2px] text-gray-500">{stat.label}</div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-5 justify-center">
                                    <Button
                                        size="lg"
                                        onClick={() => navigate('/')}
                                        className="h-16 px-12 text-xl font-black rounded-3xl bg-white text-black hover:bg-white/90 hover:scale-[1.05] transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] active:scale-95"
                                    >
                                        العودة للرئيسية
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="h-16 px-12 text-xl font-black rounded-3xl border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all flex gap-3 shadow-2xl active:scale-95"
                                    >
                                        <Sparkles className="w-6 h-6 text-yellow-500" />
                                        مشاركة التفوق
                                    </Button>
                                </div>
                            </motion.div>
                        </Card>
                    </motion.div>
                )}
            </main>
        </div>
    );
};
