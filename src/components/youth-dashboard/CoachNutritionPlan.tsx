import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Utensils, Flame, Droplets, Apple, ChevronLeft, 
  CheckCircle2, Clock, Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface Meal {
  id: string;
  name: string;
  time: string;
  emoji: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  foods: { name: string; qty: string; cal: number }[];
  completed: boolean;
}

const mockPlan = {
  targetCalories: 2400,
  targetProtein: 160,
  date: 'الثلاثاء، 26 مارس',
  coach: 'م. يوسف بن علي',
  meals: [
    {
      id: 'm1', name: 'الإفطار', time: '07:30 ص', emoji: '🌅',
      calories: 560, protein: 38, carbs: 65, fat: 14, completed: true,
      foods: [
        { name: 'بيض مسلوق', qty: '3 حبات', cal: 213 },
        { name: 'خبز أسمر', qty: '2 شريحة', cal: 180 },
        { name: 'لبن خالي الدسم', qty: '250 مل', cal: 90 },
        { name: 'موزة', qty: '1 حبة', cal: 77 }
      ]
    },
    {
      id: 'm2', name: 'وجبة منتصف الضحى', time: '10:30 ص', emoji: '🍎',
      calories: 220, protein: 12, carbs: 28, fat: 7, completed: true,
      foods: [
        { name: 'مكسرات مشكل', qty: '30 غرام', cal: 180 },
        { name: 'تفاحة', qty: '1 حبة', cal: 50 }
      ]
    },
    {
      id: 'm3', name: 'الغداء', time: '01:00 م', emoji: '🍗',
      calories: 720, protein: 58, carbs: 75, fat: 18, completed: false,
      foods: [
        { name: 'صدر دجاج مشوي', qty: '200 غرام', cal: 330 },
        { name: 'أرز أبيض', qty: '150 غرام مطبوخ', cal: 195 },
        { name: 'سلطة خضار', qty: '1 وعاء', cal: 80 },
        { name: 'زيت زيتون', qty: '1 م.ك', cal: 115 }
      ]
    },
    {
      id: 'm4', name: 'الوجبة البينية', time: '04:30 م', emoji: '💪',
      calories: 380, protein: 32, carbs: 42, fat: 8, completed: false,
      foods: [
        { name: 'مشروب بروتين', qty: '1 حصة', cal: 180 },
        { name: 'موز', qty: '1 حبة كبيرة', cal: 110 },
        { name: 'شوفان', qty: '30 غرام', cal: 90 }
      ]
    },
    {
      id: 'm5', name: 'العشاء', time: '08:00 م', emoji: '🌙',
      calories: 520, protein: 40, carbs: 55, fat: 14, completed: false,
      foods: [
        { name: 'سمك مشوي', qty: '200 غرام', cal: 220 },
        { name: 'بطاطس مشوية', qty: '150 غرام', cal: 135 },
        { name: 'خضار مطهوة بالبخار', qty: '200 غرام', cal: 80 },
        { name: 'زبادي', qty: '150 غرام', cal: 85 }
      ]
    }
  ] as Meal[]
};

export function CoachNutritionPlan() {
  const [completedMeals, setCompletedMeals] = useState<string[]>(['m1', 'm2']);
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleMeal = (id: string) => {
    setCompletedMeals(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const consumedCal = mockPlan.meals
    .filter(m => completedMeals.includes(m.id))
    .reduce((sum, m) => sum + m.calories, 0);
  const consumedProtein = mockPlan.meals
    .filter(m => completedMeals.includes(m.id))
    .reduce((sum, m) => sum + m.protein, 0);

  const calProgress = Math.round((consumedCal / mockPlan.targetCalories) * 100);
  const proteinProgress = Math.round((consumedProtein / mockPlan.targetProtein) * 100);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
          <Utensils className="w-5 h-5 text-emerald-500" />
          البرنامج الغذائي اليومي
        </h3>
        <div className="text-xs font-bold text-slate-400">{mockPlan.date}</div>
      </div>

      {/* Daily Progress Card */}
      <div className="bg-slate-900 rounded-[1.5rem] p-5 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">إجمالي اليوم</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{consumedCal}</span>
              <span className="text-slate-400 font-bold text-sm">/ {mockPlan.targetCalories} سعر</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-xs font-bold mb-1">البروتين</p>
            <p className="text-xl font-black text-emerald-400">{consumedProtein}g <span className="text-slate-500 text-sm font-bold">/ {mockPlan.targetProtein}g</span></p>
          </div>
        </div>
        <div className="space-y-2 relative z-10">
          <div>
            <div className="flex justify-between text-xs text-slate-400 font-bold mb-1">
              <span>السعرات الحرارية</span><span>{calProgress}%</span>
            </div>
            <Progress value={calProgress} className="h-2 bg-slate-800" />
          </div>
          <div>
            <div className="flex justify-between text-xs text-slate-400 font-bold mb-1">
              <span>البروتين</span><span>{proteinProgress}%</span>
            </div>
            <Progress value={proteinProgress} className="h-2 bg-slate-800" />
          </div>
        </div>
        <p className="text-slate-500 text-xs font-medium mt-3 relative z-10">
          خطة غذائية من: {mockPlan.coach}
        </p>
      </div>

      {/* Meals */}
      <div className="space-y-2">
        {mockPlan.meals.map((meal) => {
          const isCompleted = completedMeals.includes(meal.id);
          const isOpen = expanded === meal.id;
          
          return (
            <div key={meal.id} className={cn(
              'bg-white rounded-[1.25rem] border shadow-sm overflow-hidden transition-all',
              isCompleted ? 'border-emerald-100' : 'border-slate-100'
            )}>
              <button
                className="w-full flex items-center gap-3 p-4 text-right"
                onClick={() => setExpanded(isOpen ? null : meal.id)}
              >
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0',
                  isCompleted ? 'bg-emerald-50' : 'bg-slate-50'
                )}>
                  {meal.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900">{meal.name}</span>
                    {isCompleted && (
                      <Badge className="bg-emerald-50 text-emerald-600 border-0 text-xs font-bold">✓ مكتمل</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span className="text-xs font-bold text-slate-400">{meal.time}</span>
                    <span className="text-slate-300">·</span>
                    <Flame className="w-3 h-3 text-orange-400" />
                    <span className="text-xs font-bold text-slate-500">{meal.calories} سعر</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs font-bold text-emerald-600">{meal.protein}g بروتين</span>
                  </div>
                </div>
                <ChevronLeft className={cn('w-5 h-5 text-slate-300 transition-transform', isOpen && '-rotate-90')} />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 space-y-3 border-t border-slate-50 pt-3">
                  {/* Macro row */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'كربوهيدرات', val: meal.carbs, unit: 'g', color: 'text-blue-600 bg-blue-50' },
                      { label: 'بروتين', val: meal.protein, unit: 'g', color: 'text-green-600 bg-green-50' },
                      { label: 'دهون', val: meal.fat, unit: 'g', color: 'text-yellow-600 bg-yellow-50' },
                    ].map(m => (
                      <div key={m.label} className={cn('rounded-xl p-2 text-center', m.color.split(' ')[1])}>
                        <p className={cn('font-black text-lg', m.color.split(' ')[0])}>{m.val}{m.unit}</p>
                        <p className="text-xs font-bold text-slate-500">{m.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Foods */}
                  <div className="space-y-1">
                    {meal.foods.map((food, i) => (
                      <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                        <span className="font-medium text-slate-700 text-sm">{food.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400 text-xs font-bold">{food.qty}</span>
                          <span className="text-orange-500 text-xs font-black">{food.cal} ك</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => toggleMeal(meal.id)}
                    className={cn(
                      'w-full h-10 rounded-xl font-bold text-sm',
                      isCompleted
                        ? 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    )}
                  >
                    {isCompleted ? '↩ تراجع عن التأكيد' : <><CheckCircle2 className="w-4 h-4 ml-1" /> تأكيد تناول الوجبة</>}
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
