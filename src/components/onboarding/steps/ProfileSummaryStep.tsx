import React from 'react';
import { AssessmentData } from '../OnboardingAssessment';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, Target, Activity, Zap, BrainCircuit, ActivitySquare } from 'lucide-react';

interface Props {
  data: AssessmentData;
}

export const ProfileSummaryStep = ({ data }: Props) => {
  // Mock calculations for scores (0-100) based on inputs.
  // In a real app, these would use standardized fitness norms (e.g., Eurofit).
  
  const calculateScore = (value: string, isInverse: boolean = false): number => {
    if (!value) return 0;
    const num = parseFloat(value);
    if (isNaN(num)) return 0;
    
    // Just a placeholder calculation that returns a nice looking percentage
    if (isInverse) {
      return Math.max(10, Math.min(100, 100 - (num * 3))); // E.g., speed (lower is better)
    }
    return Math.max(10, Math.min(100, num * 3)); // E.g., pushups (higher is better)
  };

  const scores = {
    speed: calculateScore(data.speed50m, true),
    strength: calculateScore(data.pushups),
    flexibility: calculateScore(data.flexibility),
    agility: calculateScore(data.agility, true),
    
    // Cognitive mappings
    reaction: data.reactionTime === 'excellent' ? 95 : data.reactionTime === 'good' ? 80 : data.reactionTime === 'average' ? 60 : 40,
    motivation: (parseFloat(data.motivationLevel) || 5) * 10,
    stress: 100 - ((parseFloat(data.stressLevel) || 5) * 10), // Inverse: higher stress = lower wellness score
  };

  const calculateOverall = () => {
    const total = Object.values(scores).reduce((acc, curr) => acc + curr, 0);
    return Math.round(total / Object.keys(scores).length);
  };

  const overallScore = calculateOverall();

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="text-center mb-6">
        <div className="inline-flex justify-center items-center w-24 h-24 rounded-full bg-primary/10 border-4 border-primary/20 mb-4">
          <span className="text-4xl font-bold text-primary">{overallScore}%</span>
        </div>
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
          تم إنشاء البصمة الحركية بنجاح
        </h2>
        <p className="text-muted-foreground mt-2">
          بناءً على نتائجك، صممنا لك مساراً تدريبياً مخصصاً يراعي مبدأي التدرج والفروق الفردية.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Physical Profile */}
        <Card className="border-primary/20">
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-bold border-b pb-2 mb-4 flex gap-2 items-center text-primary">
              <ActivitySquare className="h-5 w-5" />الجانب البدني والحركي
            </h3>
            
            <ScoreBar label="السرعة" score={scores.speed} icon={<Zap className="h-4 w-4 text-yellow-500" />} />
            <ScoreBar label="القوة العضلية" score={scores.strength} icon={<ShieldCheck className="h-4 w-4 text-red-500" />} />
            <ScoreBar label="المرونة" score={scores.flexibility} icon={<Activity className="h-4 w-4 text-blue-500" />} />
            <ScoreBar label="الرشاقة" score={scores.agility} icon={<Target className="h-4 w-4 text-green-500" />} />
          </CardContent>
        </Card>

        {/* Cognitive & Psychological */}
        <Card className="border-primary/20">
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-bold border-b pb-2 mb-4 flex gap-2 items-center text-primary">
              <BrainCircuit className="h-5 w-5" />الجانب المعرفي والنفسي
            </h3>
            
            <ScoreBar label="سرعة الاستجابة" score={scores.reaction} color="bg-indigo-500" />
            <ScoreBar label="مستوى الدافعية" score={scores.motivation} color="bg-orange-500" />
            <ScoreBar label="الراحة النفسية (مقاومة التوتر)" score={scores.stress} color="bg-teal-500" />
            
            <div className="mt-6 pt-4 border-t text-sm font-medium">
              مؤشر الكتلة (BMI): <span dir="ltr" className="font-bold text-primary px-2">{data.bmi || 'N/A'}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-muted p-4 rounded-lg text-sm leading-relaxed border-r-4 border-primary">
        <strong>التوصية التدريبية (الذكاء الاصطناعي): </strong> 
        نلاحظ {scores.flexibility < 50 ? 'نقصاً في المرونة' : 'مستوى ممتاز في المرونة'} 
        {scores.strength < 50 ? ' وضعفاً في القوة العضلية' : ' وقوة عضلية جيدة'}.
        سيتم تفعيل "برنامج التدريب المتكيف" في حسابك للتركيز على هذه الجوانب بمعدل 3 حصص أسبوعياً.
      </div>
    </div>
  );
};

const ScoreBar = ({ label, score, icon, color = "bg-primary" }: { label: string, score: number, icon?: React.ReactNode, color?: string }) => (
  <div className="space-y-1">
    <div className="flex justify-between items-center text-sm">
      <span className="flex items-center gap-2 font-medium">{icon} {label}</span>
      <span className="font-bold" dir="ltr">{score}%</span>
    </div>
    <Progress value={score} className="h-2" />
  </div>
);
