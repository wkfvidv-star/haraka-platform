import React from 'react';
import { AssessmentData } from '../OnboardingAssessment';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BrainCircuit, Zap } from 'lucide-react';

interface Props {
  data: AssessmentData;
  updateData: (data: Partial<AssessmentData>) => void;
}

export const CognitiveTestsStep = ({ data, updateData }: Props) => {
  return (
    <div className="space-y-8">
      {/* Reaction Time */}
      <div className="p-5 border rounded-xl bg-card">
        <div className="flex items-center gap-3 mb-4 text-primary">
          <Zap className="h-6 w-6" />
          <h3 className="font-bold text-xl">سرعة الاستجابة (Reaction Time)</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          يتم التقييم بناءً على اختبار إمساك المسطرة الساقطة (Ruler Drop Test) أو اختبار رقمي.
        </p>
        <Select 
          value={data.reactionTime} 
          onValueChange={(val) => updateData({ reactionTime: val })}
        >
          <SelectTrigger dir="rtl">
            <SelectValue placeholder="تقييم سرعة الاستجابة" />
          </SelectTrigger>
          <SelectContent dir="rtl">
            <SelectItem value="excellent">ممتاز (سريع جداً)</SelectItem>
            <SelectItem value="good">جيد (أعلى من المتوسط)</SelectItem>
            <SelectItem value="average">متوسط</SelectItem>
            <SelectItem value="needs_improvement">يحتاج إلى تحسين (بطيء)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Motivation Level */}
      <div className="p-5 border rounded-xl bg-card">
        <div className="flex items-center gap-3 mb-6 text-primary">
          <BrainCircuit className="h-6 w-6" />
          <h3 className="font-bold text-xl">التقييم النفسي (Motivation & Stress)</h3>
        </div>
        
        <div className="space-y-8">
          <div className="space-y-4 text-left" dir="ltr">
            <div className="flex justify-between items-center" dir="rtl">
              <Label className="text-base font-semibold">مستوى الدافعية للنشاط البدني</Label>
              <span className="font-bold bg-primary/20 text-primary px-3 py-1 rounded-full">
                {data.motivationLevel}/10
              </span>
            </div>
            <Slider
              value={[parseInt(data.motivationLevel)]}
              max={10}
              min={1}
              step={1}
              onValueChange={(vals) => updateData({ motivationLevel: vals[0].toString() })}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground px-1" dir="rtl">
              <span>ضعيف جداً</span>
              <span>متحفز جداً</span>
            </div>
          </div>

          <div className="space-y-4 text-left" dir="ltr">
            <div className="flex justify-between items-center" dir="rtl">
              <Label className="text-base font-semibold">مستوى التوتر أو الإرهاق الذهني</Label>
              <span className="font-bold bg-destructive/20 text-destructive px-3 py-1 rounded-full">
                {data.stressLevel}/10
              </span>
            </div>
            <Slider
              value={[parseInt(data.stressLevel)]}
              max={10}
              min={1}
              step={1}
              onValueChange={(vals) => updateData({ stressLevel: vals[0].toString() })}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground px-1" dir="rtl">
              <span>مرتاح تماماً</span>
              <span>مرهق جداً / متوتر</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
