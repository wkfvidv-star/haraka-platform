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
  Zap
} from 'lucide-react';

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

export function ProfessionalExercises() {
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

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
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Award className="h-6 w-6" />
            البرنامج التدريبي المتخصص
          </CardTitle>
          <CardDescription className="text-blue-100">
            تمارين علمية مصممة لتطوير جميع جوانب اللياقة البدنية
          </CardDescription>
        </CardHeader>
      </Card>

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredExercises.map((exercise) => (
          <Card key={exercise.id} className="hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2 flex items-center gap-2">
                    {getCategoryIcon(exercise.category)}
                    {exercise.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getDifficultyColor(exercise.difficulty)}>
                      {exercise.difficulty}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Timer className="h-3 w-3" />
                      {exercise.duration} دقيقة
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {exercise.points} نقطة
                    </Badge>
                  </div>
                </div>
                {exercise.completed && (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {exercise.description}
              </p>
              
              {/* Exercise Stats */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600">{exercise.caloriesBurn}</div>
                  <div className="text-xs text-gray-500">سعرة حرارية</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{exercise.muscleGroups.length}</div>
                  <div className="text-xs text-gray-500">مجموعة عضلية</div>
                </div>
              </div>

              {/* Objectives */}
              <div>
                <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  الأهداف التدريبية:
                </h4>
                <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                  {exercise.objectives.slice(0, 2).map((objective, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Equipment */}
              {exercise.equipment && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <BookOpen className="h-3 w-3" />
                  <span>المعدات: {exercise.equipment}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button 
                  className="flex-1" 
                  disabled={exercise.completed}
                  size="sm"
                >
                  {exercise.completed ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      مكتمل
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      ابدأ التمرين
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedExercise(exercise)}
                >
                  التفاصيل
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <Card className="fixed inset-4 z-50 overflow-auto bg-white dark:bg-gray-900 shadow-2xl">
          <CardHeader className="border-b">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  {getCategoryIcon(selectedExercise.category)}
                  {selectedExercise.name}
                </CardTitle>
                <CardDescription className="mt-2">
                  {selectedExercise.description}
                </CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedExercise(null)}
              >
                ✕
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-6 space-y-6">
            {/* Detailed Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Timer className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="text-lg font-bold">{selectedExercise.duration}</div>
                <div className="text-xs text-gray-500">دقيقة</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Star className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="text-lg font-bold">{selectedExercise.points}</div>
                <div className="text-xs text-gray-500">نقطة</div>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <Zap className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                <div className="text-lg font-bold">{selectedExercise.caloriesBurn}</div>
                <div className="text-xs text-gray-500">سعرة</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Users className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <div className="text-lg font-bold">{selectedExercise.muscleGroups.length}</div>
                <div className="text-xs text-gray-500">عضلة</div>
              </div>
            </div>

            {/* All Objectives */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                الأهداف التدريبية الكاملة
              </h4>
              <ul className="space-y-2">
                {selectedExercise.objectives.map((objective, index) => (
                  <li key={index} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    {objective}
                  </li>
                ))}
              </ul>
            </div>

            {/* Muscle Groups */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-600" />
                المجموعات العضلية المستهدفة
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedExercise.muscleGroups.map((muscle, index) => (
                  <Badge key={index} variant="outline" className="bg-purple-50 dark:bg-purple-900/20">
                    {muscle}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <Button className="w-full" size="lg" disabled={selectedExercise.completed}>
              {selectedExercise.completed ? (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  تم إكمال التمرين
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  ابدأ التمرين الآن
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}