import React from 'react';
import { AssessmentData } from '../OnboardingAssessment';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
  data: AssessmentData;
  updateData: (data: Partial<AssessmentData>) => void;
}

export const BiometricsStep = ({ data, updateData }: Props) => {
  const calculateBmi = (heightCm: string, weightKg: string) => {
    const h = parseFloat(heightCm) / 100;
    const w = parseFloat(weightKg);
    if (h > 0 && w > 0) {
      const bmi = (w / (h * h)).toFixed(1);
      updateData({ bmi, height: heightCm, weight: weightKg });
    } else {
      updateData({ height: heightCm, weight: weightKg });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="height">الطول (سم)</Label>
          <Input
            id="height"
            type="number"
            placeholder="مثال: 170"
            value={data.height}
            onChange={(e) => calculateBmi(e.target.value, data.weight)}
            className="text-right"
            dir="ltr"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="weight">الوزن (كغ)</Label>
          <Input
            id="weight"
            type="number"
            placeholder="مثال: 65"
            value={data.weight}
            onChange={(e) => calculateBmi(data.height, e.target.value)}
            className="text-right"
            dir="ltr"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>مؤشر كتلة الجسم (BMI)</Label>
        <div className="h-12 bg-muted rounded-md flex items-center justify-center font-bold text-lg">
          {data.bmi ? (
            <span className={parseFloat(data.bmi) > 25 || parseFloat(data.bmi) < 18.5 ? 'text-amber-500' : 'text-green-500'}>
              {data.bmi}
            </span>
          ) : (
            <span className="text-muted-foreground text-sm">أدخل الطول والوزن الحساب</span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1 text-center">
          يستخدم هذا المؤشر لتحديد الفئة الوزنية وتوجيه نوعية التمارين.
        </p>
      </div>

      <div className="space-y-2 pt-4 border-t">
        <Label>التاريخ الصحي والإصابات (اختياري)</Label>
        <Select defaultValue="none">
          <SelectTrigger dir="rtl">
            <SelectValue placeholder="اختر حالة صحية" />
          </SelectTrigger>
          <SelectContent dir="rtl">
            <SelectItem value="none">لا توجد إصابات أو أمراض</SelectItem>
            <SelectItem value="asthma">ربو / مشاكل تنفسية</SelectItem>
            <SelectItem value="joint">إصابة سابقة في المفاصل</SelectItem>
            <SelectItem value="heart">أمراض قلبية (يرجى تقديم شهادة طبية)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
