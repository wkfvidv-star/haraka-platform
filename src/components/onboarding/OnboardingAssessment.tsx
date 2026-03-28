import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { BiometricsStep } from './steps/BiometricsStep';
import { MotorTestsStep } from './steps/MotorTestsStep';
import { CognitiveTestsStep } from './steps/CognitiveTestsStep';
import { ProfileSummaryStep } from './steps/ProfileSummaryStep';
import { useNavigate } from 'react-router-dom';

export interface AssessmentData {
  height: string;
  weight: string;
  bmi: string;
  speed50m: string;
  pushups: string;
  flexibility: string;
  agility: string;
  reactionTime: string;
  motivationLevel: string;
  stressLevel: string;
}

const initialData: AssessmentData = {
  height: '',
  weight: '',
  bmi: '',
  speed50m: '',
  pushups: '',
  flexibility: '',
  agility: '',
  reactionTime: '',
  motivationLevel: '5',
  stressLevel: '5',
};

const steps = [
  { id: 'biometrics', title: 'القياسات الحيوية', description: 'البيانات الأساسية للجسم' },
  { id: 'motor', title: 'البصمة الحركية', description: 'الاختبارات البدنية والميدانية' },
  { id: 'cognitive', title: 'الجانب المعرفي والنفسي', description: 'التقييم النفسي وسرعة الاستجابة' },
  { id: 'summary', title: 'الملف الشامل (Motor Profile)', description: 'النتائج النهائية والتوصيات' },
];

export const OnboardingAssessment = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<AssessmentData>(initialData);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Finish onboarding and go to dashboard
      // TODO: Save data to backend
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const updateData = (fields: Partial<AssessmentData>) => {
    setData((prev) => ({ ...prev, ...fields }));
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto p-4" dir="rtl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2 text-primary">تقييم البصمة الحركية الشامل</h1>
        <p className="text-muted-foreground text-center">أهلاً بك في منصة Haraka. لتخصيص جدولك التدريبي، يرجى إكمال هذه الاختبارات المعيارية.</p>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2 text-muted-foreground">
          <span>{steps[currentStep].title}</span>
          <span>الخطوة {currentStep + 1} من {steps.length}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="shadow-lg border-t-4 border-t-primary relative overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
          <CardDescription className="text-base">{steps[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 0 && <BiometricsStep data={data} updateData={updateData} />}
              {currentStep === 1 && <MotorTestsStep data={data} updateData={updateData} />}
              {currentStep === 2 && <CognitiveTestsStep data={data} updateData={updateData} />}
              {currentStep === 3 && <ProfileSummaryStep data={data} />}
            </motion.div>
          </AnimatePresence>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-6 bg-muted/20">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="w-32"
          >
            السابق
          </Button>
          <Button onClick={handleNext} className="w-32">
            {currentStep === steps.length - 1 ? 'إنهاء وحفظ' : 'التالي'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
