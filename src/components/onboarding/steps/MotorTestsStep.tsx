import React from 'react';
import { AssessmentData } from '../OnboardingAssessment';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InfoIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Props {
  data: AssessmentData;
  updateData: (data: Partial<AssessmentData>) => void;
}

export const MotorTestsStep = ({ data, updateData }: Props) => {
  return (
    <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
      <div className="bg-primary/10 p-4 rounded-lg flex gap-3 text-sm text-primary mb-6">
        <InfoIcon className="h-5 w-5 shrink-0" />
        <p>
          هذه الاختبارات الميدانية ضرورية لتشكيل "البصمة الحركية". يقوم أستاذ التربية البدنية أو المدرب بالإشراف عليها.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* السرعة */}
        <div className="space-y-2 p-4 border rounded-lg bg-card hover:border-primary/50 transition-colors">
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="speed50m" className="font-bold text-lg">السرعة (50 متر)</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger><InfoIcon className="h-4 w-4 text-muted-foreground" /></TooltipTrigger>
                <TooltipContent><p>يقيس سرعة الانطلاق والجري، يسجل بالثواني.</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            id="speed50m"
            type="number"
            step="0.1"
            placeholder="مثال: 7.5 ثانية"
            value={data.speed50m}
            onChange={(e) => updateData({ speed50m: e.target.value })}
            dir="ltr"
            className="text-right"
          />
        </div>

        {/* القوة */}
        <div className="space-y-2 p-4 border rounded-lg bg-card hover:border-primary/50 transition-colors">
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="pushups" className="font-bold text-lg">القوة (تمديد الذراعين)</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger><InfoIcon className="h-4 w-4 text-muted-foreground" /></TooltipTrigger>
                <TooltipContent><p>أقصى عدد من التكرارات في دقيقة واحدة.</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            id="pushups"
            type="number"
            placeholder="مثال: 25 تكرار"
            value={data.pushups}
            onChange={(e) => updateData({ pushups: e.target.value })}
            dir="ltr"
            className="text-right"
          />
        </div>

        {/* المرونة */}
        <div className="space-y-2 p-4 border rounded-lg bg-card hover:border-primary/50 transition-colors">
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="flexibility" className="font-bold text-lg">المرونة (ثني الجذع)</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger><InfoIcon className="h-4 w-4 text-muted-foreground" /></TooltipTrigger>
                <TooltipContent><p>قياس المسافة بالسنتيمتر مقارنة بمستوى القدمين.</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            id="flexibility"
            type="number"
            placeholder="مثال: +5 سم"
            value={data.flexibility}
            onChange={(e) => updateData({ flexibility: e.target.value })}
            dir="ltr"
            className="text-right"
          />
        </div>

        {/* الرشاقة */}
        <div className="space-y-2 p-4 border rounded-lg bg-card hover:border-primary/50 transition-colors">
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="agility" className="font-bold text-lg">الرشاقة (جري مكوك 4x9م)</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger><InfoIcon className="h-4 w-4 text-muted-foreground" /></TooltipTrigger>
                <TooltipContent><p>نقل المكعبات الخشبية بأسرع وقت ممكن.</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            id="agility"
            type="number"
            step="0.1"
            placeholder="مثال: 12.3 ثانية"
            value={data.agility}
            onChange={(e) => updateData({ agility: e.target.value })}
            dir="ltr"
            className="text-right"
          />
        </div>
      </div>
    </div>
  );
};
