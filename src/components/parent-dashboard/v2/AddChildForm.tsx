import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, User, Calendar, ChevronRight, ChevronLeft, 
  Check, School, Target, Dumbbell, Brain, Heart, Trophy,
  Baby, GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { parentDataService, Child } from '@/services/parentDataService';

interface AddChildFormProps {
  onClose: () => void;
  onSuccess: (child: Child) => void;
}

export const AddChildForm: React.FC<AddChildFormProps> = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Child>>({
    name: '',
    birthDate: '',
    gender: 'ذكر',
    grade: '',
    school: '',
    targetGoal: 'تحسين اللياقة'
  });

  const goals = [
    { id: 'تحسين اللياقة', icon: Dumbbell, label: 'تحسين اللياقة', desc: 'زيادة النشاط البدني والقوة' },
    { id: 'تحسين التركيز', icon: Brain, label: 'تحسين التركيز', desc: 'تعزيز القدرات الذهنية والانتباه' },
    { id: 'الرفاه النفسي', icon: Heart, label: 'الرفاه النفسي', desc: 'توازن عاطفي ونفسي أفضل' },
    { id: 'رياضة تنافسية', icon: Trophy, label: 'رياضة تنافسية', desc: 'التحضير للمسابقات والبطولات' },
  ];

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = () => {
    const newChild = parentDataService.addChild(formData);
    onSuccess(newChild);
  };

  const isStepValid = () => {
    if (step === 1) return formData.name && formData.birthDate;
    if (step === 2) return formData.grade;
    return true;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-slate-900 border border-white/10 rounded-[32px] w-full max-w-xl overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-blue-600/10 to-indigo-600/10">
          <div>
            <h2 className="text-2xl font-black text-white">إضافة طفل جديد</h2>
            <p className="text-slate-400 text-sm mt-1">أدخل بيانات طفلك للبدء في تتبع تقدمه</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-slate-400 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-white/5 w-full">
          <motion.div 
            className="h-full bg-blue-500"
            initial={{ width: '0%' }}
            animate={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Form Content */}
        <div className="p-8">
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
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-slate-300">الاسم الكامل</Label>
                    <div className="relative">
                      <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <Input 
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="bg-white/5 border-white/10 pr-11 h-12 rounded-xl focus:ring-blue-500"
                        placeholder="أدخل اسم الطفل"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="dob" className="text-slate-300">تاريخ الميلاد</Label>
                      <div className="relative">
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <Input 
                          id="dob"
                          type="date"
                          value={formData.birthDate}
                          onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                          className="bg-white/5 border-white/10 pr-11 h-12 rounded-xl focus:ring-blue-500 text-white"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                        <Label className="text-slate-300">الجنس</Label>
                        <Select 
                          value={formData.gender} 
                          onValueChange={(v: any) => setFormData({...formData, gender: v})}
                        >
                          <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl text-white">
                            <SelectValue placeholder="اختر الجنس" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-white/10 text-white">
                            <SelectItem value="ذكر">ذكر</SelectItem>
                            <SelectItem value="أنثى">أنثى</SelectItem>
                          </SelectContent>
                        </Select>
                    </div>
                  </div>
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
                  <div className="grid gap-2">
                    <Label htmlFor="grade" className="text-slate-300">المستوى الدراسي</Label>
                    <div className="relative">
                      <GraduationCap className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <Select 
                        value={formData.grade} 
                        onValueChange={(v) => setFormData({...formData, grade: v})}
                      >
                        <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl text-white pr-11">
                          <SelectValue placeholder="اختر المستوى الدراسي" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-white/10 text-white">
                          <SelectItem value="ابتدائي">ابتدائي</SelectItem>
                          <SelectItem value="متوسط">متوسط</SelectItem>
                          <SelectItem value="ثانوي">ثانوي</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="school" className="text-slate-300">المدرسة (اختياري)</Label>
                    <div className="relative">
                      <School className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <Input 
                        id="school"
                        value={formData.school}
                        onChange={(e) => setFormData({...formData, school: e.target.value})}
                        className="bg-white/5 border-white/10 pr-11 h-12 rounded-xl focus:ring-blue-500"
                        placeholder="اسم المؤسسة التعليمية"
                      />
                    </div>
                  </div>
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
                <Label className="text-slate-300 block mb-4">ما هو الهدف الأساسي من الانضمام؟</Label>
                <div className="grid grid-cols-1 gap-3">
                  {goals.map((goal) => {
                    const isActive = formData.targetGoal === goal.id;
                    return (
                      <button
                        key={goal.id}
                        onClick={() => setFormData({...formData, targetGoal: goal.id as any})}
                        className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-right
                          ${isActive 
                            ? 'bg-blue-500/20 border-blue-500 shadow-lg shadow-blue-500/10' 
                            : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                      >
                        <div className={`p-3 rounded-xl ${isActive ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-400'}`}>
                          <goal.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-white">{goal.label}</h4>
                          <p className="text-xs text-slate-400 mt-0.5">{goal.desc}</p>
                        </div>
                        {isActive && <Check className="w-5 h-5 text-blue-400" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 bg-white/5 flex items-center justify-between">
          {step > 1 ? (
            <Button variant="ghost" onClick={handleBack} className="text-slate-400 hover:text-white">
              <ChevronRight className="ml-2 w-5 h-5" />
              السابق
            </Button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <Button 
              onClick={handleNext} 
              disabled={!isStepValid()}
              className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-8 h-12 font-bold"
            >
              التالي
              <ChevronLeft className="mr-2 w-5 h-5" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl px-8 h-12 font-black shadow-xl shadow-blue-500/20"
            >
              حفظ وإضافة الطفل
              <Check className="mr-2 w-5 h-5" />
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
