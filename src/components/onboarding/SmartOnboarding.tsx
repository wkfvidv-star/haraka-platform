import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, 
  Heart, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Shield,
  Activity
} from 'lucide-react';

interface OnboardingData {
  personalInfo: {
    age: number;
    weight?: number;
    height?: number;
    gender: 'male' | 'female';
  };
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  injuries: string[];
  preferences: string[];
  availability: {
    daysPerWeek: number;
    timePerSession: number;
    preferredTime: 'morning' | 'afternoon' | 'evening';
  };
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const SmartOnboarding: React.FC<{ onComplete: (data: OnboardingData) => void }> = ({ onComplete }) => {
  const { user, environment } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    personalInfo: {
      age: 18,
      gender: 'male'
    },
    fitnessLevel: 'beginner',
    goals: [],
    injuries: [],
    preferences: [],
    availability: {
      daysPerWeek: 3,
      timePerSession: 30,
      preferredTime: 'afternoon'
    }
  });

  const steps: OnboardingStep[] = [
    {
      id: 'personal',
      title: 'المعلومات الشخصية',
      description: 'معلومات أساسية لتخصيص تجربتك',
      icon: User
    },
    {
      id: 'fitness',
      title: 'مستوى اللياقة',
      description: 'حدد مستواك الحالي في الرياضة',
      icon: Activity
    },
    {
      id: 'health',
      title: 'الحالة الصحية',
      description: 'معلومات مهمة لسلامتك أثناء التمرين',
      icon: Heart
    },
    {
      id: 'goals',
      title: 'الأهداف والتفضيلات',
      description: 'ما الذي تريد تحقيقه؟',
      icon: Target
    }
  ];

  const commonInjuries = [
    { id: 'knee', label: 'مشاكل في الركبة', warning: 'سنتجنب تمارين القفز والجري المكثف' },
    { id: 'back', label: 'مشاكل في الظهر', warning: 'سنتجنب تمارين رفع الأثقال الثقيلة' },
    { id: 'shoulder', label: 'مشاكل في الكتف', warning: 'سنتجنب تمارين الضغط العلوي' },
    { id: 'ankle', label: 'مشاكل في الكاحل', warning: 'سنركز على تمارين التوازن والتقوية' },
    { id: 'wrist', label: 'مشاكل في المعصم', warning: 'سنقلل من تمارين الدعم على اليدين' }
  ];

  const fitnessGoals = [
    { id: 'weight_loss', label: 'إنقاص الوزن', icon: '🏃‍♂️' },
    { id: 'muscle_gain', label: 'بناء العضلات', icon: '💪' },
    { id: 'endurance', label: 'تحسين التحمل', icon: '🫁' },
    { id: 'flexibility', label: 'زيادة المرونة', icon: '🤸‍♂️' },
    { id: 'strength', label: 'زيادة القوة', icon: '🏋️‍♂️' },
    { id: 'balance', label: 'تحسين التوازن', icon: '⚖️' },
    { id: 'health', label: 'الصحة العامة', icon: '❤️' },
    { id: 'sport_specific', label: 'تحسين رياضة معينة', icon: '⚽' }
  ];

  const workoutPreferences = [
    { id: 'bodyweight', label: 'تمارين وزن الجسم', icon: '🤸‍♂️' },
    { id: 'weights', label: 'تمارين الأوزان', icon: '🏋️‍♂️' },
    { id: 'cardio', label: 'تمارين الكارديو', icon: '🏃‍♂️' },
    { id: 'yoga', label: 'اليوغا والتأمل', icon: '🧘‍♂️' },
    { id: 'hiit', label: 'تمارين عالية الكثافة', icon: '⚡' },
    { id: 'dance', label: 'الرقص الرياضي', icon: '💃' },
    { id: 'martial_arts', label: 'الفنون القتالية', icon: '🥋' },
    { id: 'swimming', label: 'السباحة', icon: '🏊‍♂️' }
  ];

  const updateData = (section: keyof OnboardingData, data: Partial<OnboardingData[keyof OnboardingData]>) => {
    setOnboardingData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  const toggleArrayItem = (array: string[], item: string, setter: (items: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // إكمال الإعداد الأولي
      const completeData = {
        ...onboardingData,
        personalInfo: {
          ...onboardingData.personalInfo,
          age: Math.max(13, Math.min(100, onboardingData.personalInfo.age)) // التأكد من العمر المناسب
        }
      };
      
      // حفظ البيانات في التخزين المحلي
      localStorage.setItem(`userProfile_${user?.id}`, JSON.stringify({
        id: user?.id,
        name: user?.name,
        ...completeData.personalInfo,
        fitnessLevel: completeData.fitnessLevel,
        injuries: completeData.injuries,
        preferences: completeData.preferences,
        goals: completeData.goals,
        availability: completeData.availability,
        completedSessions: 0,
        weeklyGoal: completeData.availability.daysPerWeek,
        createdAt: new Date(),
        lastActivity: null
      }));
      
      onComplete(completeData);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getEnvironmentTheme = () => {
    return environment === 'school' 
      ? 'from-blue-500 to-indigo-600' 
      : 'from-orange-500 to-green-500';
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="age">العمر</Label>
          <Input
            id="age"
            type="number"
            min="13"
            max="100"
            value={onboardingData.personalInfo.age}
            onChange={(e) => updateData('personalInfo', { age: parseInt(e.target.value) || 18 })}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label>الجنس</Label>
          <RadioGroup
            value={onboardingData.personalInfo.gender}
            onValueChange={(value: 'male' | 'female') => updateData('personalInfo', { gender: value })}
            className="mt-2"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male">ذكر</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female">أنثى</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="weight">الوزن (كغ) - اختياري</Label>
          <Input
            id="weight"
            type="number"
            min="30"
            max="200"
            value={onboardingData.personalInfo.weight || ''}
            onChange={(e) => updateData('personalInfo', { weight: e.target.value ? parseInt(e.target.value) : undefined })}
            className="mt-1"
            placeholder="مثال: 70"
          />
        </div>
        
        <div>
          <Label htmlFor="height">الطول (سم) - اختياري</Label>
          <Input
            id="height"
            type="number"
            min="120"
            max="220"
            value={onboardingData.personalInfo.height || ''}
            onChange={(e) => updateData('personalInfo', { height: e.target.value ? parseInt(e.target.value) : undefined })}
            className="mt-1"
            placeholder="مثال: 175"
          />
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <h4 className="font-medium text-blue-900 dark:text-blue-100">خصوصية البيانات</h4>
        </div>
        <p className="text-sm text-blue-800 dark:text-blue-200">
          معلوماتك الشخصية محمية ومشفرة. نستخدمها فقط لتخصيص تجربتك التدريبية وضمان سلامتك.
        </p>
      </div>
    </div>
  );

  const renderFitnessLevel = () => (
    <div className="space-y-6">
      <RadioGroup
        value={onboardingData.fitnessLevel}
        onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => updateData('fitnessLevel', value)}
        className="space-y-4"
      >
        <Card className={`cursor-pointer transition-all ${onboardingData.fitnessLevel === 'beginner' ? 'ring-2 ring-primary' : ''}`}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <RadioGroupItem value="beginner" id="beginner" />
              <div className="flex-1">
                <Label htmlFor="beginner" className="text-base font-medium cursor-pointer">
                  مبتدئ 🌱
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  جديد في الرياضة أو لم أتمرن منذ فترة طويلة
                </p>
                <div className="mt-2">
                  <Badge variant="outline">0-6 أشهر خبرة</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`cursor-pointer transition-all ${onboardingData.fitnessLevel === 'intermediate' ? 'ring-2 ring-primary' : ''}`}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <RadioGroupItem value="intermediate" id="intermediate" />
              <div className="flex-1">
                <Label htmlFor="intermediate" className="text-base font-medium cursor-pointer">
                  متوسط 💪
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  أتمرن بانتظام وأعرف التمارين الأساسية
                </p>
                <div className="mt-2">
                  <Badge variant="outline">6 أشهر - 2 سنة خبرة</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`cursor-pointer transition-all ${onboardingData.fitnessLevel === 'advanced' ? 'ring-2 ring-primary' : ''}`}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <RadioGroupItem value="advanced" id="advanced" />
              <div className="flex-1">
                <Label htmlFor="advanced" className="text-base font-medium cursor-pointer">
                  متقدم 🏆
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  خبرة واسعة في التمارين والتدريب المتقدم
                </p>
                <div className="mt-2">
                  <Badge variant="outline">أكثر من 2 سنة خبرة</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </RadioGroup>
    </div>
  );

  const renderHealthInfo = () => (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium mb-3 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          هل لديك أي إصابات أو مشاكل صحية؟
        </h4>
        <p className="text-sm text-muted-foreground mb-4">
          هذه المعلومات مهمة لضمان سلامتك. سنتجنب التمارين التي قد تضر بحالتك.
        </p>
        
        <div className="space-y-3">
          {commonInjuries.map((injury) => (
            <Card 
              key={injury.id}
              className={`cursor-pointer transition-all ${
                onboardingData.injuries.includes(injury.id) ? 'ring-2 ring-orange-500 bg-orange-50 dark:bg-orange-900/20' : ''
              }`}
              onClick={() => toggleArrayItem(
                onboardingData.injuries, 
                injury.id, 
                (items) => updateData('injuries', items)
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3 rtl:space-x-reverse">
                  <Checkbox 
                    checked={onboardingData.injuries.includes(injury.id)}
                    onChange={() => {}}
                  />
                  <div className="flex-1">
                    <Label className="text-base font-medium cursor-pointer">
                      {injury.label}
                    </Label>
                    {onboardingData.injuries.includes(injury.id) && (
                      <div className="mt-2 p-2 bg-orange-100 dark:bg-orange-800/30 rounded text-sm text-orange-800 dark:text-orange-200">
                        <div className="flex items-center gap-1">
                          <Shield className="w-4 h-4" />
                          {injury.warning}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Card 
            className={`cursor-pointer transition-all ${
              onboardingData.injuries.length === 0 ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20' : ''
            }`}
            onClick={() => updateData('injuries', [])}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Checkbox checked={onboardingData.injuries.length === 0} onChange={() => {}} />
                <div className="flex-1">
                  <Label className="text-base font-medium cursor-pointer flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    لا يوجد لدي أي إصابات أو مشاكل صحية
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderGoalsAndPreferences = () => (
    <div className="space-y-6">
      {/* الأهداف */}
      <div>
        <h4 className="font-medium mb-3 flex items-center gap-2">
          <Target className="w-5 w-5 text-blue-500" />
          ما هي أهدافك من التمرين؟
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {fitnessGoals.map((goal) => (
            <Card
              key={goal.id}
              className={`cursor-pointer transition-all ${
                onboardingData.goals.includes(goal.id) ? 'ring-2 ring-primary bg-primary/5' : ''
              }`}
              onClick={() => toggleArrayItem(
                onboardingData.goals,
                goal.id,
                (items) => updateData('goals', items)
              )}
            >
              <CardContent className="p-3 text-center">
                <div className="text-2xl mb-2">{goal.icon}</div>
                <div className="text-sm font-medium">{goal.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* التفضيلات */}
      <div>
        <h4 className="font-medium mb-3">ما نوع التمارين التي تفضلها؟</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {workoutPreferences.map((pref) => (
            <Card
              key={pref.id}
              className={`cursor-pointer transition-all ${
                onboardingData.preferences.includes(pref.id) ? 'ring-2 ring-secondary bg-secondary/5' : ''
              }`}
              onClick={() => toggleArrayItem(
                onboardingData.preferences,
                pref.id,
                (items) => updateData('preferences', items)
              )}
            >
              <CardContent className="p-3 text-center">
                <div className="text-2xl mb-2">{pref.icon}</div>
                <div className="text-sm font-medium">{pref.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* الجدولة */}
      <div>
        <h4 className="font-medium mb-3">كم مرة تريد التمرن في الأسبوع؟</h4>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map((days) => (
            <Button
              key={days}
              variant={onboardingData.availability.daysPerWeek === days ? "default" : "outline"}
              onClick={() => updateData('availability', { daysPerWeek: days })}
              className="h-12"
            >
              {days}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-3">كم دقيقة لكل جلسة تدريب؟</h4>
        <div className="grid grid-cols-3 gap-3">
          {[15, 30, 45, 60].map((minutes) => (
            <Button
              key={minutes}
              variant={onboardingData.availability.timePerSession === minutes ? "default" : "outline"}
              onClick={() => updateData('availability', { timePerSession: minutes })}
            >
              {minutes} دقيقة
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: return renderPersonalInfo();
      case 1: return renderFitnessLevel();
      case 2: return renderHealthInfo();
      case 3: return renderGoalsAndPreferences();
      default: return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0: 
        return onboardingData.personalInfo.age >= 13 && onboardingData.personalInfo.age <= 100;
      case 1: 
        return onboardingData.fitnessLevel !== '';
      case 2: 
        return true; // الحالة الصحية اختيارية
      case 3: 
        return onboardingData.goals.length > 0;
      default: 
        return true;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <Card className={`bg-gradient-to-r ${getEnvironmentTheme()} text-white`}>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">مرحباً {user?.name}! 👋</h1>
              <p className="opacity-90">دعنا نخصص تجربتك التدريبية</p>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>الخطوة {currentStep + 1} من {steps.length}</span>
              <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
            </div>
            <Progress value={((currentStep + 1) / steps.length) * 100} className="h-2 bg-white/20" />
          </div>
        </CardContent>
      </Card>

      {/* Current Step */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            {React.createElement(steps[currentStep].icon, { className: "w-6 h-6 text-primary" })}
            <div>
              <CardTitle>{steps[currentStep].title}</CardTitle>
              <CardDescription>{steps[currentStep].description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderCurrentStep()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          السابق
        </Button>
        
        <Button
          onClick={nextStep}
          disabled={!isStepValid()}
          className={currentStep === steps.length - 1 ? `bg-gradient-to-r ${getEnvironmentTheme()} text-white` : ''}
        >
          {currentStep === steps.length - 1 ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              إنهاء الإعداد
            </>
          ) : (
            <>
              التالي
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SmartOnboarding;