import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dumbbell, Heart, Coffee, Utensils, Zap, Flame, 
  CheckCircle2, Clock, Info, ChevronRight, Apple, 
  Wind, TrendingUp, Shield, BarChart2, Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { youthDataService, YouthMeal } from '@/services/youthDataService';
import { useToast } from '@/hooks/use-toast';

export function NutritionExercisePlans() {
  const { toast } = useToast();
  const [meals, setMeals] = useState<YouthMeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'nutrition' | 'exercise'>('nutrition');

  useEffect(() => {
    const loadData = () => {
      let m = youthDataService.getNutritionPlan();
      if (m.length === 0) {
        // Populate with mock if empty
        const initialMeals: YouthMeal[] = [
          { id: 'm1', name: 'إفطار متوازن', time: '07:00 ص', emoji: '🍳', calories: 450, protein: 25, carbs: 45, fat: 12, foods: [{name:'بيض مسلوق', qty:'2', cal:140}, {name:'شوفان بالحليب', qty:'1 كوب', cal:220}, {name:'موز', qty:'1', cal:90}], completed: true },
          { id: 'm2', name: 'سناك ما بعد التمرين', time: '11:00 ص', emoji: '🍎', calories: 150, protein: 5, carbs: 30, fat: 1, foods: [{name:'تفاحة', qty:'1', cal:95}, {name:'لوز ناضج', qty:'10 حبات', cal:55}], completed: false },
          { id: 'm3', name: 'غداء غني بالبروتين', time: '02:00 م', emoji: '🍗', calories: 650, protein: 45, carbs: 60, fat: 15, foods: [{name:'صدر دجاج مشوي', qty:'150جم', cal:250}, {name:'أرز بني', qty:'1 كوب', cal:215}, {name:'سلطة خضراء', qty:'وعاء كبير', cal:185}], completed: false },
        ];
        youthDataService.saveNutritionPlan(initialMeals);
        m = initialMeals;
      }
      setMeals(m);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleToggleMeal = (id: string) => {
    youthDataService.toggleMealCompletion(id);
    setMeals(youthDataService.getNutritionPlan());
    const isCompleted = meals.find(m => m.id === id)?.completed;
    if (!isCompleted) {
      toast({
        title: 'أحسنت!',
        description: 'تم تسجيل الوجبة بنجاح. استمر في الالتزام!',
        className: 'bg-emerald-600 text-white'
      });
    }
  };

  const exercisePlans = [
    { id: 'e1', title: 'خطة القوة (أسبوع 1)', category: 'بدني', duration: '45 دقيقة', intensity: 'عالي', status: 'active', exercises: ['سكوات الجدار', 'لانجز أمامي', 'بلانك'] },
    { id: 'e2', title: 'تحسين الرشاقة', category: 'بدني', duration: '30 دقيقة', intensity: 'متوسط', status: 'pending', exercises: ['T-Test', '10x4 الجري المكوكي'] },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Tab Switcher */}
      <div className="flex bg-white dark:bg-white/5 p-2 rounded-[1.5rem] border border-slate-200 dark:border-white/5 w-full max-w-md mx-auto shadow-sm">
        <button 
          onClick={() => setActiveTab('nutrition')}
          className={cn("flex-1 py-3.5 rounded-2xl font-black text-base md:text-lg flex items-center justify-center gap-2 transition-all", activeTab === 'nutrition' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 dark:text-slate-400')}
        >
          <Utensils className="w-5 h-5" /> النظام الغذائي
        </button>
        <button 
          onClick={() => setActiveTab('exercise')}
          className={cn("flex-1 py-3.5 rounded-2xl font-black text-base md:text-lg flex items-center justify-center gap-2 transition-all", activeTab === 'exercise' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-500 dark:text-slate-400')}
        >
          <Dumbbell className="w-5 h-5" /> خطط التمرين
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'nutrition' ? (
          <motion.div key="nutrition" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
            
            {/* Macro Summary Card */}
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]" />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <h3 className="text-3xl font-black mb-3">أهدافك اليومية 🔋</h3>
                  <p className="text-indigo-200/80 font-bold text-lg mb-6">لقد وصلت لـ 45% من احتياجك اليومي اليوم.</p>
                  <div className="flex items-center gap-8">
                    <div className="flex flex-col">
                      <span className="text-2xl font-black text-white">1,250 / 2,400</span>
                      <span className="text-sm text-indigo-300 font-bold uppercase tracking-widest">السعرات (kcal)</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-2xl font-black text-white">75جم / 160جم</span>
                      <span className="text-sm text-indigo-300 font-bold uppercase tracking-widest">البروتين (g)</span>
                    </div>
                  </div>
                </div>
                <div className="relative w-32 h-32 flex-shrink-0">
                   <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                     <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/10" />
                     <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="141 283" className="text-indigo-400" />
                   </svg>
                   <div className="absolute inset-0 flex items-center justify-center font-black text-2xl">45%</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {meals.map((meal) => (
                <motion.div
                  key={meal.id}
                  className={cn(
                    "rounded-[2rem] border p-6 flex items-center justify-between transition-all",
                    meal.completed 
                      ? "bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-500/20" 
                      : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 shadow-sm"
                  )}
                >
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-white dark:bg-black/20 flex items-center justify-center text-3xl shadow-sm border border-slate-100 dark:border-white/5">
                      {meal.emoji}
                    </div>
                    <div>
                      <h4 className={cn("text-xl font-black mb-1", meal.completed ? "text-emerald-700 dark:text-emerald-300 line-through opacity-70" : "text-slate-900 dark:text-white")}>
                        {meal.name}
                      </h4>
                      <p className="text-sm font-bold text-slate-500 flex items-center gap-2">
                        <Clock className="w-4 h-4" /> {meal.time} · {meal.calories} kcal
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleToggleMeal(meal.id)}
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-md",
                      meal.completed 
                        ? "bg-emerald-500 text-white" 
                        : "bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-400 hover:border-emerald-500/50"
                    )}
                  >
                    <CheckCircle2 className="w-6 h-6" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="exercise" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            {exercisePlans.map((plan) => (
              <div key={plan.id} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg",
                      plan.status === 'active' ? "bg-orange-500 text-white" : "bg-slate-200 dark:bg-white/10 text-slate-400"
                    )}>
                      <Dumbbell className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white">{plan.title}</h3>
                      <p className="text-sm font-bold text-slate-500">{plan.category} · {plan.duration} · شدة: {plan.intensity}</p>
                    </div>
                  </div>
                  <button className="bg-orange-600 hover:bg-orange-500 text-white font-black px-8 py-3.5 rounded-2xl shadow-xl shadow-orange-500/20 transition-all flex items-center gap-3">
                     تحميل الخطة <ChevronRight className="w-5 h-5 mx-rtl-mirror" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {plan.exercises.map((ex, i) => (
                    <div key={i} className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 p-5 rounded-2xl flex items-center gap-4 group hover:bg-white dark:hover:bg-white/10 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-orange-500/10 text-orange-600 flex items-center justify-center font-black text-sm">
                        {i + 1}
                      </div>
                      <span className="font-black text-slate-700 dark:text-slate-200">{ex}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
