import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Ruler, Scale, Heart, Target, ChevronRight, ChevronLeft, Check,
    UserCircle, CalendarDays, Activity, Moon, Shield, Zap, Flame, Move
} from 'lucide-react';
import { profileService } from '@/services/profileService';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface HealthSurveyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
}

export const HealthSurveyModal: React.FC<HealthSurveyModalProps> = ({ isOpen, onClose, onComplete }) => {
    const { user, updateUserStats } = useAuth();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        // Standard fields
        height: '',
        weight: '',
        bloodType: '',
        athleticGoal: '',
        // New extended fields (to be saved in bio)
        gender: '',
        age: '',
        activityLevel: '',
        sleepHours: '',
    });

    const handleInput = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const nextStep = () => {
        // Validation per step could be added here
        setStep(prev => prev + 1);
    };
    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            if (user?.id) {
                // Serialize extra metadata into the bio field as JSON
                const bioData = JSON.stringify({
                    gender: formData.gender,
                    age: formData.age,
                    activityLevel: formData.activityLevel,
                    sleepHours: formData.sleepHours
                });

                await profileService.updateProfile(user.id, {
                    height: parseFloat(formData.height) || 0,
                    weight: parseFloat(formData.weight) || 0,
                    bloodType: formData.bloodType,
                    athleticGoal: formData.athleticGoal,
                    bio: bioData, // Save extended data here
                });

                // Reward XP for completing profile
                if (updateUserStats) {
                    updateUserStats({ xp: (user.xp || 0) + 100 });
                }
            }
        } catch (error) {
            console.error("Error saving profile:", error);
        } finally {
            onComplete();
            setIsLoading(false);
        }
    };

    // Calculate progress
    const totalSteps = 4;
    const progress = ((step - 1) / totalSteps) * 100;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !isLoading && !open && onClose()}>
            <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] glass-card border-white/10 text-white overflow-hidden p-0 flex flex-col shadow-2xl rounded-[2rem] sm:rounded-[3rem] !translate-x-[-50%] !translate-y-[-50%] !top-1/2 !left-1/2" style={{ background: '#0a0f1d' }}>
                {/* Massive Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-[#0a0f1d] to-purple-900/20 pointer-events-none" />
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 150, repeat: Infinity, ease: 'linear' }}
                    className="absolute -top-[50%] -right-[20%] w-[100%] h-[150%] bg-[radial-gradient(circle,rgba(99,102,241,0.08)_0%,transparent_60%)] pointer-events-none" />

                <div className="relative z-10 flex flex-col h-full overflow-hidden">
                    {/* Header */}
                    <div className="p-4 md:p-8 pb-3 border-b border-white/5 flex-shrink-0">
                        <div className="flex items-center justify-between gap-4 mb-4 md:mb-6">
                            <div className="flex items-center gap-3 md:gap-6">
                                <div className="w-12 h-12 md:w-16 md:h-16 rounded-[1rem] md:rounded-[1.5rem] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)] shrink-0">
                                    <Heart className="w-6 h-6 md:w-8 md:h-8 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl md:text-4xl font-black tracking-tight text-white mb-1">تأسيس الملف الصحي</h2>
                                    <p className="text-indigo-200/70 text-xs md:text-lg font-bold leading-tight">بناء قاعدة صلبة لخوارزميات التدريب الذكي</p>
                                </div>
                            </div>
                            <div className="hidden md:flex flex-col items-center gap-1 shrink-0">
                                <span className="text-2xl font-black text-indigo-400 leading-none">{Math.round(progress)}%</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">اكتمال</span>
                            </div>
                        </div>

                        {/* Progress Line */}
                        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden shrink-0">
                            <motion.div
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_15px_rgba(99,102,241,0.6)]"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                            />
                        </div>
                    </div>

                    {/* Content Area - Scrollable */}
                    <div className="flex-1 overflow-y-auto px-4 py-4 md:px-12 md:py-8 custom-scrollbar">
                        <div className="max-w-3xl mx-auto w-full flex flex-col justify-center min-h-full">
                            <AnimatePresence mode="wait">
                                {/* STEP 1: Basic Bio */}
                                {step === 1 && (
                                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                                        className="space-y-6 md:space-y-10 py-2">
                                        <div className="text-center mb-4 md:mb-8">
                                            <h3 className="text-2xl md:text-4xl font-black text-white mb-2 drop-shadow-md">من أنت؟</h3>
                                            <p className="text-sm md:text-lg text-slate-400 font-bold">معلوماتك الأساسية تساعد النظام على مقارنة أدائك.</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                            <div className="space-y-4 md:space-y-6">
                                                <label className="text-base md:text-xl font-black text-indigo-300 flex items-center gap-2">
                                                    <UserCircle className="w-5 h-5 md:w-7 md:h-7" /> الجنس
                                                </label>
                                                <div className="grid grid-cols-2 gap-3 md:gap-4">
                                                    {['ذكر', 'أنثى'].map(g => (
                                                        <button key={g} onClick={() => handleInput('gender', g)}
                                                            className={`h-14 md:h-20 rounded-2xl text-lg md:text-2xl font-black transition-all border-2 md:border-4 ${formData.gender === g ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10 hover:text-white'}`}>
                                                            {g}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-4 md:space-y-6">
                                                <label className="text-base md:text-xl font-black text-indigo-300 flex items-center gap-2">
                                                    <CalendarDays className="w-5 h-5 md:w-7 md:h-7" /> العمر (سنوات)
                                                </label>
                                                <Input
                                                    type="number" placeholder="مثال: 22"
                                                    value={formData.age} onChange={e => handleInput('age', e.target.value)}
                                                    className="h-14 md:h-20 text-2xl md:text-4xl font-black text-center bg-white/5 border-2 md:border-4 border-transparent focus:border-indigo-500 rounded-2xl"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* STEP 2: Body Metrics */}
                                {step === 2 && (
                                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                                        className="space-y-6 md:space-y-10">
                                        <div className="text-center mb-4 md:mb-8">
                                            <h3 className="text-2xl md:text-4xl font-black text-white mb-2 drop-shadow-md">القياسات البدنية</h3>
                                            <p className="text-sm md:text-lg text-slate-400 font-bold">تحديد كتلة الجسم ضروري لحساب حرق السعرات.</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                                            <div className="space-y-4 md:space-y-6">
                                                <label className="text-lg md:text-2xl font-black text-blue-400 flex justify-center items-center gap-2 text-center">
                                                    <Ruler className="w-6 h-6 md:w-8 md:h-8" /> الطول (سم)
                                                </label>
                                                <div className="relative">
                                                    <Input
                                                        type="number" placeholder="175"
                                                        value={formData.height} onChange={e => handleInput('height', e.target.value)}
                                                        className="h-16 md:h-24 text-3xl md:text-5xl font-black text-center bg-blue-500/10 border-2 md:border-4 border-blue-500/30 focus:border-blue-500 rounded-2xl text-blue-100"
                                                    />
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm md:text-xl font-bold text-blue-400/50 uppercase tracking-widest hidden md:block">CM</span>
                                                </div>
                                            </div>

                                            <div className="space-y-4 md:space-y-6">
                                                <label className="text-lg md:text-2xl font-black text-teal-400 flex justify-center items-center gap-2 text-center">
                                                    <Scale className="w-6 h-6 md:w-8 md:h-8" /> الوزن (كجم)
                                                </label>
                                                <div className="relative">
                                                    <Input
                                                        type="number" placeholder="70"
                                                        value={formData.weight} onChange={e => handleInput('weight', e.target.value)}
                                                        className="h-16 md:h-24 text-3xl md:text-5xl font-black text-center bg-teal-500/10 border-2 md:border-4 border-teal-500/30 focus:border-teal-500 rounded-2xl text-teal-100"
                                                    />
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm md:text-xl font-bold text-teal-400/50 uppercase tracking-widest hidden md:block">KG</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* STEP 3: Lifestyle */}
                                {step === 3 && (
                                    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                                        className="space-y-6 md:space-y-10">
                                        <div className="text-center mb-4 md:mb-8">
                                            <h3 className="text-2xl md:text-4xl font-black text-white mb-2 drop-shadow-md">نمط حياتك</h3>
                                            <p className="text-sm md:text-lg text-slate-400 font-bold">لضبط كثافة التمارين وقوة الاستشفاء.</p>
                                        </div>

                                        <div className="space-y-6 md:space-y-8">
                                            {/* Activity */}
                                            <div className="space-y-4">
                                                <label className="text-base md:text-xl font-black text-emerald-400 flex items-center gap-2">
                                                    <Activity className="w-5 h-5 md:w-7 md:h-7" /> مستوى النشاط اليومي العام
                                                </label>
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                    {[
                                                        { id: 'low', label: 'خفيف', desc: 'مكتبي، قليل الحركة' },
                                                        { id: 'mid', label: 'متوسط', desc: 'أتحرك باستمرار' },
                                                        { id: 'high', label: 'عالي', desc: 'نشط جداً، رياضي' }
                                                    ].map(lvl => (
                                                        <div key={lvl.id} onClick={() => handleInput('activityLevel', lvl.id)}
                                                            className={`p-4 md:p-5 rounded-2xl border-2 cursor-pointer transition-all ${formData.activityLevel === lvl.id ? 'bg-emerald-600/20 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-white/5 border-transparent hover:bg-white/10'}`}>
                                                            <p className={`text-lg md:text-xl font-black mb-1 ${formData.activityLevel === lvl.id ? 'text-white' : 'text-slate-300'}`}>{lvl.label}</p>
                                                            <p className="text-slate-400 text-xs md:text-sm font-bold leading-snug">{lvl.desc}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Sleep */}
                                            <div className="space-y-4">
                                                <label className="text-base md:text-xl font-black text-indigo-300 flex items-center gap-2">
                                                    <Moon className="w-5 h-5 md:w-7 md:h-7" /> متوسط ساعات النوم
                                                </label>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                    {['أقل من 5', '5 - 7', '7 - 9', 'أكثر من 9'].map(hrs => (
                                                        <button key={hrs} onClick={() => handleInput('sleepHours', hrs)}
                                                            className={`h-12 md:h-16 rounded-xl text-sm md:text-lg font-black transition-all border-2 ${formData.sleepHours === hrs ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'}`}>
                                                            {hrs}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* STEP 4: Advanced & Goal */}
                                {step === 4 && (
                                    <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                                        className="space-y-6 md:space-y-10">
                                        <div className="text-center mb-4 md:mb-8">
                                            <h3 className="text-2xl md:text-4xl font-black text-white mb-2 drop-shadow-md">اللمسات الأخيرة!</h3>
                                            <p className="text-sm md:text-lg text-slate-400 font-bold">لماذا أنت هنا؟ وما هو طموحك الرياضي؟</p>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                                            {/* Blood Type */}
                                            <div className="space-y-4 lg:col-span-1">
                                                <label className="text-base md:text-xl font-black text-rose-400 flex items-center gap-2">
                                                    <Heart className="w-5 h-5 md:w-7 md:h-7" /> فصيلة الدم (إن عرفت)
                                                </label>
                                                <div className="grid grid-cols-4 md:grid-cols-2 gap-2 md:gap-3">
                                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(b => (
                                                        <button key={b} onClick={() => handleInput('bloodType', b)}
                                                            className={`h-10 md:h-14 rounded-xl text-sm md:text-lg font-black transition-all border-2 ${formData.bloodType === b ? 'bg-rose-500/20 border-rose-500 text-white shadow-[0_0_10px_rgba(244,63,94,0.3)]' : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'}`}>
                                                            {b}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Goal */}
                                            <div className="space-y-4 lg:col-span-2">
                                                <label className="text-base md:text-xl font-black text-orange-400 flex items-center gap-2">
                                                    <Target className="w-5 h-5 md:w-7 md:h-7" /> الهدف الأساسي
                                                </label>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {[
                                                        { id: 'fitness', title: 'لياقة عامة', icon: Heart, color: 'text-rose-400' },
                                                        { id: 'muscle', title: 'بناء عضلات', icon: Move, color: 'text-indigo-400' },
                                                        { id: 'weight-loss', title: 'خسارة وزن', icon: Flame, color: 'text-orange-400' },
                                                        { id: 'professional', title: 'أداء احترافي', icon: Zap, color: 'text-yellow-400' },
                                                        { id: 'rehab', title: 'تأهيل علاجي', icon: Shield, color: 'text-emerald-400' }
                                                    ].map(goal => {
                                                        const Icon = goal.icon;
                                                        return (
                                                            <div key={goal.id} onClick={() => handleInput('athleticGoal', goal.id)}
                                                                className={`p-3 md:p-4 rounded-2xl border-2 cursor-pointer flex items-center gap-3 transition-all ${formData.athleticGoal === goal.id ? 'bg-orange-500/10 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.2)]' : 'bg-white/5 border-transparent hover:bg-white/10'}`}>
                                                                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-black/30 flex items-center justify-center flex-shrink-0 border border-white/5`}>
                                                                    <Icon className={`w-5 h-5 md:w-6 md:h-6 ${formData.athleticGoal === goal.id ? goal.color : 'text-slate-400'}`} />
                                                                </div>
                                                                <span className={`text-base md:text-lg font-black ${formData.athleticGoal === goal.id ? 'text-white' : 'text-slate-300'}`}>{goal.title}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Footer / Controls */}
                    <div className="p-4 md:p-6 pt-3 border-t border-white/5 flex gap-3 mt-auto sm:flex-row flex-col-reverse shrink-0 bg-[#0a0f1d]/80 backdrop-blur-md relative z-20">
                        <Button
                            variant="outline"
                            onClick={step > 1 ? prevStep : onClose}
                            className="bg-transparent border-2 border-white/10 text-white hover:bg-white/5 text-base md:text-xl font-black h-12 md:h-16 rounded-xl md:rounded-2xl flex-1 transition-all"
                        >
                            <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 ml-1 md:ml-2" />
                            {step === 1 ? 'تخطي الآن' : 'السابق'}
                        </Button>
                        <Button
                            onClick={step === totalSteps ? handleSubmit : nextStep}
                            disabled={isLoading}
                            className="bg-gradient-to-l from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-base md:text-xl font-black h-12 md:h-16 rounded-xl md:rounded-2xl flex-[2] shadow-[0_10px_30px_rgba(99,102,241,0.3)] transition-all"
                        >
                            {isLoading ? (
                                "جاري التحليل..."
                            ) : step === totalSteps ? (
                                <>إنشاء الملف <Check className="w-4 h-4 md:w-6 md:h-6 mr-1 md:mr-2" /></>
                            ) : (
                                <>التالي <ChevronRight className="w-4 h-4 md:w-6 md:h-6 mr-1 md:mr-2" /></>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
