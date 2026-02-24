import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Ruler, Scale, Heart, Target, ChevronRight, ChevronLeft, Check } from 'lucide-react';
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
        height: '',
        weight: '',
        bloodType: '',
        athleticGoal: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async () => {
        if (!user?.id) return;
        setIsLoading(true);
        try {
            await profileService.updateProfile(user.id, {
                height: parseFloat(formData.height),
                weight: parseFloat(formData.weight),
                bloodType: formData.bloodType,
                athleticGoal: formData.athleticGoal,
            });

            // Add initial reward XP
            updateUserStats({ xp: (user.xp || 0) + 100 });

            onComplete();
        } catch (error) {
            console.error("Error saving profile:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !isLoading && !open && onClose()}>
            <DialogContent className="sm:max-w-[500px] glass-card border-white/10 text-white overflow-hidden p-0">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-transparent to-transparent pointer-events-none" />

                <div className="p-8 relative z-10">
                    <DialogHeader className="mb-8">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-900/40">
                                <Heart className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-black tracking-tight text-white">إكمال الملف الصحي</DialogTitle>
                                <DialogDescription className="text-indigo-300/70 font-bold">خطوة واحدة لنبدأ رحلتك الرياضية الاحترافية</DialogDescription>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-1 bg-white/5 rounded-full mt-6 overflow-hidden">
                            <motion.div
                                className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                                initial={{ width: "33.33%" }}
                                animate={{ width: `${(step / 3) * 100}%` }}
                            />
                        </div>
                    </DialogHeader>

                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="space-y-4">
                                    <Label className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <Ruler className="w-4 h-4 text-blue-400" /> الطول (سم)
                                    </Label>
                                    <Input
                                        name="height"
                                        type="number"
                                        placeholder="مثال: 175"
                                        value={formData.height}
                                        onChange={handleInputChange}
                                        className="bg-white/5 border-white/10 text-white font-bold h-12 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <Label className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <Scale className="w-4 h-4 text-teal-400" /> الوزن (كجم)
                                    </Label>
                                    <Input
                                        name="weight"
                                        type="number"
                                        placeholder="مثال: 70"
                                        value={formData.weight}
                                        onChange={handleInputChange}
                                        className="bg-white/5 border-white/10 text-white font-bold h-12 focus:ring-indigo-500"
                                    />
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="space-y-4">
                                    <Label className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <Heart className="w-4 h-4 text-red-400" /> فصيلة الدم
                                    </Label>
                                    <Select
                                        value={formData.bloodType}
                                        onValueChange={(v) => handleSelectChange('bloodType', v)}
                                    >
                                        <SelectTrigger className="bg-white/5 border-white/10 text-white font-bold h-12">
                                            <SelectValue placeholder="اختر فصيلة الدم" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#0b0f1a] border-white/10 text-white">
                                            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                                                <SelectItem key={type} value={type} className="hover:bg-indigo-500/20">{type}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="space-y-4">
                                    <Label className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <Target className="w-4 h-4 text-orange-400" /> هدفك الرياضي الرئيسي
                                    </Label>
                                    <Select
                                        value={formData.athleticGoal}
                                        onValueChange={(v) => handleSelectChange('athleticGoal', v)}
                                    >
                                        <SelectTrigger className="bg-white/5 border-white/10 text-white font-bold h-12">
                                            <SelectValue placeholder="ماذا تريد أن تحقق؟" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#0b0f1a] border-white/10 text-white">
                                            <SelectItem value="fitness" className="hover:bg-indigo-500/20">اللياقة البدنية العامة</SelectItem>
                                            <SelectItem value="muscle" className="hover:bg-indigo-500/20">بناء العضلات</SelectItem>
                                            <SelectItem value="weight-loss" className="hover:bg-indigo-500/20">خسارة الوزن</SelectItem>
                                            <SelectItem value="flexibility" className="hover:bg-indigo-500/20">المرونة والرشاقة</SelectItem>
                                            <SelectItem value="professional" className="hover:bg-indigo-500/20">الأداء الرياضي المحترف</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <DialogFooter className="mt-10 flex flex-row gap-4">
                        {step > 1 && (
                            <Button
                                variant="outline"
                                onClick={prevStep}
                                className="border-white/10 bg-white/5 text-white hover:bg-white/10 font-bold h-12 flex-1"
                            >
                                <ChevronLeft className="w-5 h-5 ml-2" /> السابق
                            </Button>
                        )}
                        <Button
                            onClick={step === 3 ? handleSubmit : nextStep}
                            disabled={isLoading}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-black h-12 flex-[2] shadow-xl"
                        >
                            {isLoading ? (
                                "جاري الحفظ..."
                            ) : step === 3 ? (
                                <>إتمام <Check className="w-5 h-5 mr-2" /></>
                            ) : (
                                <>التالي <ChevronRight className="w-5 h-5 mr-2" /></>
                            )}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
};
