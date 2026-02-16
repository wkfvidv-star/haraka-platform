import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Play,
  Clock,
  Target,
  TrendingUp,
  CheckCircle,
  Star,
  BarChart3,
  Activity,
  Dumbbell,
  Heart,
  Timer,
  Award,
  BookOpen,
  Users,
  Zap,
  Microscope,
  ArrowRight,
  Video
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { scientificDomains } from '@/data/ScientificExerciseData';
import { DomainDetails } from './scientific/DomainDetails';
import { VideoAnalysisUpload } from './scientific/VideoAnalysisUpload';

interface Exercise {
  id: number;
  name: string;
  category: string;
  duration: number;
  difficulty: 'مبتدئ' | 'متوسط' | 'متقدم';
  points: number;
  completed: boolean;
  description: string;
  objectives: string[];
  equipment?: string;
  muscleGroups: string[];
  caloriesBurn: number;
  videoUrl?: string;
}

const professionalExercises: Exercise[] = [
  {
    id: 1,
    name: 'تمرين القوة الوظيفية الأساسية',
    category: 'القوة',
    duration: 15,
    difficulty: 'مبتدئ',
    points: 20,
    completed: false,
    description: 'تمرين شامل لتطوير القوة الأساسية للجسم مع التركيز على الحركات الوظيفية',
    objectives: ['تقوية العضلات الأساسية', 'تحسين التوازن', 'زيادة القدرة على التحمل'],
    equipment: 'وزن الجسم فقط',
    muscleGroups: ['العضلات الأساسية', 'الذراعين', 'الساقين'],
    caloriesBurn: 120
  },
  {
    id: 2,
    name: 'تدريب التحمل القلبي الوعائي',
    category: 'التحمل',
    duration: 20,
    difficulty: 'متوسط',
    points: 30,
    completed: true,
    description: 'برنامج تدريبي متدرج لتحسين كفاءة الجهاز القلبي الوعائي',
    objectives: ['تحسين اللياقة القلبية', 'زيادة القدرة على التحمل', 'حرق السعرات الحرارية'],
    equipment: 'غير مطلوب',
    muscleGroups: ['القلب', 'الرئتين', 'الجسم كاملاً'],
    caloriesBurn: 200
  },
  {
    id: 3,
    name: 'تمارين المرونة والحركية',
    category: 'المرونة',
    duration: 12,
    difficulty: 'مبتدئ',
    points: 15,
    completed: false,
    description: 'سلسلة تمارين لتحسين مرونة المفاصل ونطاق الحركة',
    objectives: ['زيادة المرونة', 'تحسين نطاق الحركة', 'منع الإصابات'],
    equipment: 'سجادة تمرين',
    muscleGroups: ['جميع المفاصل', 'العضلات المساعدة'],
    caloriesBurn: 80
  },
  {
    id: 4,
    name: 'تدريب التوازن والتناسق الحركي',
    category: 'التوازن',
    duration: 18,
    difficulty: 'متوسط',
    points: 25,
    completed: false,
    description: 'تمارين متخصصة لتطوير التوازن والتناسق بين العضلات',
    objectives: ['تحسين التوازن', 'تطوير التناسق الحركي', 'تقوية العضلات المثبتة'],
    equipment: 'كرة توازن (اختيارية)',
    muscleGroups: ['العضلات المثبتة', 'العضلات الأساسية'],
    caloriesBurn: 100
  },
  {
    id: 5,
    name: 'تدريب القوة المتفجرة',
    category: 'القوة',
    duration: 25,
    difficulty: 'متقدم',
    points: 40,
    completed: false,
    description: 'تمارين متقدمة لتطوير القوة المتفجرة والسرعة',
    objectives: ['تطوير القوة المتفجرة', 'تحسين السرعة', 'زيادة الأداء الرياضي'],
    equipment: 'أوزان خفيفة',
    muscleGroups: ['الساقين', 'الذراعين', 'العضلات الأساسية'],
    caloriesBurn: 180
  },
  {
    id: 6,
    name: 'تمارين الاسترخاء والتأمل الحركي',
    category: 'الاسترخاء',
    duration: 10,
    difficulty: 'مبتدئ',
    points: 10,
    completed: false,
    description: 'تمارين للاسترخاء وتهدئة الجهاز العصبي بعد التدريب',
    objectives: ['تهدئة الجهاز العصبي', 'تحسين التركيز', 'تقليل التوتر'],
    equipment: 'سجادة تمرين',
    muscleGroups: ['الجسم كاملاً'],
    caloriesBurn: 40
  }
];

export function ProfessionalExercises({ defaultTab = 'scientific' }: { defaultTab?: 'scientific' | 'general' }) {
  const [activeTab, setActiveTab] = useState<'scientific' | 'general'>(defaultTab);
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null);

  const selectedDomain = scientificDomains.find(d => d.id === selectedDomainId);

  const categories = ['الكل', 'القوة', 'التحمل', 'المرونة', 'التوازن', 'الاسترخاء'];

  const filteredExercises = selectedCategory === 'الكل'
    ? professionalExercises
    : professionalExercises.filter(ex => ex.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'مبتدئ': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
      case 'متوسط': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200';
      case 'متقدم': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'القوة': return <Dumbbell className="h-4 w-4" />;
      case 'التحمل': return <Heart className="h-4 w-4" />;
      case 'المرونة': return <Activity className="h-4 w-4" />;
      case 'التوازن': return <Target className="h-4 w-4" />;
      case 'الاسترخاء': return <Zap className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-card border-blue-500/20 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-blue-600/10 mix-blend-overlay pointer-events-none" />
        <CardHeader className="relative z-10">
          <CardTitle className="text-3xl font-black flex items-center gap-3 text-white">
            <div className="p-2 rounded-xl bg-blue-500/20 ring-1 ring-blue-500/30">
              <Award className="h-7 w-7 text-blue-400" />
            </div>
            <span>منظومة التدريب الشاملة (Training Matrix)</span>
          </CardTitle>
          <CardDescription className="text-blue-200/70 font-bold text-base mt-2">
            اختر بين المسارات العلمية المتخصصة أو التمارين العامة لرفع مستوى أدائك
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="scientific" value={activeTab} onValueChange={(v) => setActiveTab(v as 'scientific' | 'general')} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[440px] bg-white/5 border border-white/10 p-1 rounded-xl h-12">
          <TabsTrigger value="scientific" className="flex items-center gap-2 font-black data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-400 transition-all rounded-lg h-10">
            <Microscope className="w-5 h-5" />
            المسارات العلمية (Scientific)
          </TabsTrigger>
          <TabsTrigger value="general" className="flex items-center gap-2 font-black data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-400 transition-all rounded-lg h-10">
            <Dumbbell className="w-5 h-5" />
            اللياقة العامة (General)
          </TabsTrigger>
        </TabsList>

        {/* SCIENTIFIC TRAINING TAB */}
        <TabsContent value="scientific" className="space-y-6">
          {selectedDomainId === 'ai-analysis' ? (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center gap-4 mb-4">
                <Button variant="ghost" onClick={() => setSelectedDomainId(null)} className="gap-2">
                  <ArrowRight className="w-4 h-4" /> العودة للتصنيفات
                </Button>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Video className="w-6 h-6 text-slate-600" />
                  مختبر التحليل الحركي الذكي
                </h2>
              </div>
              <VideoAnalysisUpload />
            </div>
          ) : selectedDomain ? (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center gap-4 mb-4">
                <Button variant="ghost" onClick={() => setSelectedDomainId(null)} className="gap-2">
                  <ArrowRight className="w-4 h-4" /> العودة للتصنيفات
                </Button>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <selectedDomain.icon className={`w-6 h-6 text-${selectedDomain.color}-600`} />
                  {selectedDomain.title}
                </h2>
              </div>
              <DomainDetails domain={selectedDomain} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in">
              {scientificDomains.map((domain) => (
                <Card
                  key={domain.id}
                  className="glass-card group cursor-pointer hover:scale-[1.03] transition-all duration-300 border-white/10 overflow-hidden relative shadow-2xl"
                  onClick={() => setSelectedDomainId(domain.id)}
                >
                  <div className={`absolute top-0 left-0 w-1 h-full bg-${domain.color}-500 shadow-[0_0_15px_rgba(0,0,0,0.3)] transition-all group-hover:w-2`}></div>
                  <CardHeader className="pb-4 relative z-10">
                    <div className={`w-14 h-14 rounded-2xl bg-white/5 ring-1 ring-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:ring-${domain.color}-500/30`}>
                      <domain.icon className={`w-7 h-7 text-${domain.color}-400 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]`} />
                    </div>
                    <CardTitle className="text-xl font-black leading-tight text-white group-hover:text-blue-300 transition-colors">
                      {domain.title}
                    </CardTitle>
                    <CardDescription className="text-xs font-black text-gray-500 mt-2 uppercase tracking-widest">
                      {domain.titleEn}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <p className="text-sm font-bold text-gray-400 group-hover:text-gray-300 transition-colors mb-6 line-clamp-3 leading-relaxed">
                      {domain.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {domain.benefits.slice(0, 2).map((benefit, idx) => (
                        <Badge key={idx} variant="outline" className="text-[10px] py-0.5 px-3 bg-white/5 border-white/5 text-gray-400 font-black uppercase">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* GENERAL EXERCISES TAB (Existing Content) */}
        <TabsContent value="general" className="space-y-6">
          {/* Category Filter */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">تصنيف التمارين</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="flex items-center gap-2"
                  >
                    {getCategoryIcon(category)}
                    {category}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Exercises Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredExercises.map((exercise) => (
              <Card key={exercise.id} className="glass-card hover:scale-[1.02] transition-all duration-300 border-white/10 shadow-2xl relative overflow-hidden group">
                <CardHeader className="pb-4 relative z-10">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl font-black mb-3 flex items-center gap-3 text-white tracking-tight group-hover:text-blue-300 transition-colors">
                        <div className="p-2 rounded-lg bg-white/5 ring-1 ring-white/10">
                          {getCategoryIcon(exercise.category)}
                        </div>
                        {exercise.name}
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <Badge className={`${getDifficultyColor(exercise.difficulty)} px-3 py-0.5 font-black uppercase text-[10px]`}>
                          {exercise.difficulty}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1.5 bg-white/5 border-white/10 text-blue-200 font-bold px-2">
                          <Timer className="h-3.5 w-3.5" />
                          {exercise.duration} دقيقة
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1.5 bg-white/5 border-white/10 text-yellow-400 font-bold px-2">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          {exercise.points} نقطة
                        </Badge>
                      </div>
                    </div>
                    {exercise.completed && (
                      <div className="bg-green-500/20 p-1.5 rounded-full ring-1 ring-green-500/30">
                        <CheckCircle className="h-6 w-6 text-green-400" />
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 relative z-10">
                  <p className="text-sm font-bold text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">
                    {exercise.description}
                  </p>

                  {/* Exercise Stats */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl ring-1 ring-white/5">
                    <div className="text-center border-r border-white/10">
                      <div className="text-2xl font-black text-orange-500">{exercise.caloriesBurn}</div>
                      <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">سعرة حرارية</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-black text-blue-400">{exercise.muscleGroups.length}</div>
                      <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">مجموعة عضلية</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-2">
                    <Button
                      className={`flex-1 h-12 font-black shadow-lg shadow-black/20 ${exercise.completed ? 'bg-green-600/20 text-green-400 border border-green-500/20 cursor-default' : 'bg-white text-blue-900 hover:bg-blue-50'}`}
                      disabled={exercise.completed}
                    >
                      {exercise.completed ? (
                        <>
                          <CheckCircle className="h-5 w-5 ml-2" />
                          مكتمل (Completed)
                        </>
                      ) : (
                        <>
                          <Play className="h-5 w-5 ml-2 fill-current" />
                          ابدأ التمرين الآن
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      className="border-white/10 bg-white/5 text-white hover:bg-white/10 font-bold h-12 px-6"
                      onClick={() => setSelectedExercise(exercise)}
                    >
                      التفاصيل
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <Card className="fixed inset-4 md:inset-10 lg:inset-20 z-50 overflow-auto bg-app-surface border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] backdrop-blur-3xl rounded-[2.5rem] animate-in zoom-in-95 duration-300">
          <div className="absolute inset-0 bg-blue-600/5 mix-blend-overlay pointer-events-none" />

          <CardHeader className="border-b border-white/5 p-8 relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl font-black flex items-center gap-4 text-white">
                  <div className="p-2 rounded-xl bg-white/5 ring-1 ring-white/10">
                    {getCategoryIcon(selectedExercise.category)}
                  </div>
                  {selectedExercise.name}
                </CardTitle>
                <CardDescription className="mt-4 text-lg font-bold text-gray-400 max-w-2xl leading-relaxed">
                  {selectedExercise.description}
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedExercise(null)}
                className="rounded-full bg-white/5 text-white hover:bg-white/10 h-10 w-10"
              >
                ✕
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-8 space-y-10 relative z-10">
            {/* Detailed Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Timer, label: 'المدة الزمنية', value: selectedExercise.duration, unit: 'دقيقة', color: 'text-blue-400', bg: 'bg-blue-500/10' },
                { icon: Star, label: 'النقاط المستحقة', value: selectedExercise.points, unit: 'نقطة', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
                { icon: Zap, label: 'حرق السعرات', value: selectedExercise.caloriesBurn, unit: 'سعرة', color: 'text-orange-500', bg: 'bg-orange-500/10' },
                { icon: Activity, label: 'العضلات المستهدفة', value: selectedExercise.muscleGroups.length, unit: 'عضلة', color: 'text-purple-400', bg: 'bg-purple-500/10' }
              ].map((stat, i) => (
                <div key={i} className="text-center p-6 bg-white/5 border border-white/5 rounded-3xl shadow-xl hover:bg-white/[0.07] transition-colors">
                  <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-4 drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]`} />
                  <div className="text-3xl font-black text-white">{stat.value}</div>
                  <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2">{stat.label} ({stat.unit})</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* All Objectives */}
              <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
                <h4 className="text-xl font-black mb-6 flex items-center gap-3 text-white">
                  <Target className="h-6 w-6 text-blue-400" />
                  الأهداف التدريبية الكاملة
                </h4>
                <ul className="space-y-4">
                  {selectedExercise.objectives.map((objective, index) => (
                    <li key={index} className="flex items-center gap-4 p-4 bg-black/20 rounded-2xl border border-white/5 text-gray-200 font-bold">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Muscle Groups & Equipment */}
              <div className="space-y-8">
                <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
                  <h4 className="text-xl font-black mb-6 flex items-center gap-3 text-white">
                    <Activity className="h-6 w-6 text-purple-400" />
                    المجموعات العضلية المستهدفة
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedExercise.muscleGroups.map((muscle, index) => (
                      <Badge key={index} variant="outline" className="bg-purple-500/10 text-purple-300 border-purple-500/20 px-4 py-1.5 font-bold">
                        {muscle}
                      </Badge>
                    ))}
                  </div>
                </div>

                {selectedExercise.equipment && (
                  <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
                    <h4 className="text-xl font-black mb-4 flex items-center gap-3 text-white">
                      <BookOpen className="h-6 w-6 text-indigo-400" />
                      المعدات المطلوبة
                    </h4>
                    <p className="text-lg font-bold text-indigo-200">{selectedExercise.equipment}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Final Action Button */}
            <Button
              className={`w-full h-16 text-xl font-black rounded-2xl shadow-2xl transition-all ${selectedExercise.completed ? 'bg-green-600/20 text-green-400 border border-green-500/20' : 'bg-white text-blue-900 hover:bg-blue-50 hover:scale-[1.01]'}`}
              size="lg"
              disabled={selectedExercise.completed}
            >
              {selectedExercise.completed ? (
                <>
                  <CheckCircle className="h-6 w-6 ml-3" />
                  تم إكمال المسار بنجاح
                </>
              ) : (
                <>
                  <Play className="h-6 w-6 ml-3 fill-current" />
                  ابدأ البرنامج التدريبي الآن
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}