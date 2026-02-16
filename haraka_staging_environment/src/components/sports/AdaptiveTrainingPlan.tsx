import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar,
  Clock,
  Target,
  TrendingUp,
  Edit3,
  Save,
  Plus,
  Trash2,
  Bell,
  CheckCircle,
  AlertCircle,
  BarChart3,
  User,
  Settings
} from 'lucide-react';

interface WorkoutExercise {
  id: string;
  name: string;
  nameAr: string;
  sets: number;
  reps: number;
  restTime: number; // بالثواني
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  actualReps?: number[];
  notes?: string;
}

interface WorkoutDay {
  id: string;
  day: string;
  dayAr: string;
  exercises: WorkoutExercise[];
  completed: boolean;
  completedAt?: Date;
  totalDuration?: number; // بالدقائق
}

interface TrainingPlan {
  id: string;
  name: string;
  description: string;
  duration: number; // بالأسابيع
  level: 'beginner' | 'intermediate' | 'advanced';
  goal: string;
  createdAt: Date;
  createdBy: string; // 'ai' | 'teacher' | 'coach'
  weeks: WorkoutDay[][];
  isActive: boolean;
  progress: {
    completedWorkouts: number;
    totalWorkouts: number;
    currentWeek: number;
    adherenceRate: number;
  };
}

interface UserPerformanceData {
  userId: string;
  totalWorkouts: number;
  averageIntensity: number;
  preferredExercises: string[];
  weakAreas: string[];
  improvementAreas: string[];
  lastWorkoutDate: Date;
  consistencyScore: number;
}

export const AdaptiveTrainingPlan: React.FC = () => {
  const [currentPlan, setCurrentPlan] = useState<TrainingPlan | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [userPerformance, setUserPerformance] = useState<UserPerformanceData | null>(null);
  const [notifications, setNotifications] = useState<boolean>(true);
  const [selectedWeek, setSelectedWeek] = useState(1);

  // تحميل البيانات من التخزين المحلي
  useEffect(() => {
    const savedPlan = localStorage.getItem('activeTrainingPlan');
    if (savedPlan) {
      setCurrentPlan(JSON.parse(savedPlan));
    }

    const savedPerformance = localStorage.getItem('userPerformanceData');
    if (savedPerformance) {
      setUserPerformance(JSON.parse(savedPerformance));
    }
  }, []);

  // حفظ الخطة في التخزين المحلي
  const savePlan = (plan: TrainingPlan) => {
    localStorage.setItem('activeTrainingPlan', JSON.stringify(plan));
    setCurrentPlan(plan);
  };

  // إنشاء خطة تدريبية ذكية بناءً على الأداء
  const generateAdaptivePlan = (): TrainingPlan => {
    const baseExercises: WorkoutExercise[] = [
      {
        id: 'squat',
        name: 'Squat',
        nameAr: 'القرفصاء',
        sets: 3,
        reps: 12,
        restTime: 60,
        difficulty: 'easy',
        completed: false
      },
      {
        id: 'pushup',
        name: 'Push-up',
        nameAr: 'الضغط',
        sets: 3,
        reps: 10,
        restTime: 45,
        difficulty: 'easy',
        completed: false
      },
      {
        id: 'plank',
        name: 'Plank',
        nameAr: 'البلانك',
        sets: 3,
        reps: 30,
        restTime: 30,
        difficulty: 'medium',
        completed: false
      },
      {
        id: 'jumping_jacks',
        name: 'Jumping Jacks',
        nameAr: 'القفز المفتوح',
        sets: 3,
        reps: 20,
        restTime: 30,
        difficulty: 'easy',
        completed: false
      }
    ];

    // تكييف التمارين بناءً على الأداء السابق
    if (userPerformance) {
      baseExercises.forEach(exercise => {
        if (userPerformance.averageIntensity > 0.8) {
          exercise.sets += 1;
          exercise.reps = Math.ceil(exercise.reps * 1.2);
        } else if (userPerformance.averageIntensity < 0.5) {
          exercise.reps = Math.ceil(exercise.reps * 0.8);
        }
      });
    }

    const workoutDays: WorkoutDay[] = [
      {
        id: 'monday',
        day: 'Monday',
        dayAr: 'الاثنين',
        exercises: [...baseExercises],
        completed: false
      },
      {
        id: 'wednesday',
        day: 'Wednesday',
        dayAr: 'الأربعاء',
        exercises: [...baseExercises],
        completed: false
      },
      {
        id: 'friday',
        day: 'Friday',
        dayAr: 'الجمعة',
        exercises: [...baseExercises],
        completed: false
      }
    ];

    const plan: TrainingPlan = {
      id: Date.now().toString(),
      name: 'خطة التدريب الذكية المخصصة',
      description: 'خطة تدريبية مُولدة بالذكاء الاصطناعي بناءً على أدائك السابق',
      duration: 4,
      level: userPerformance?.averageIntensity > 0.7 ? 'intermediate' : 'beginner',
      goal: 'تحسين اللياقة البدنية العامة',
      createdAt: new Date(),
      createdBy: 'ai',
      weeks: Array(4).fill(null).map(() => [...workoutDays]),
      isActive: true,
      progress: {
        completedWorkouts: 0,
        totalWorkouts: 12, // 3 أيام × 4 أسابيع
        currentWeek: 1,
        adherenceRate: 0
      }
    };

    return plan;
  };

  // تعديل تمرين
  const updateExercise = (weekIndex: number, dayIndex: number, exerciseIndex: number, updates: Partial<WorkoutExercise>) => {
    if (!currentPlan) return;

    const updatedPlan = { ...currentPlan };
    updatedPlan.weeks[weekIndex][dayIndex].exercises[exerciseIndex] = {
      ...updatedPlan.weeks[weekIndex][dayIndex].exercises[exerciseIndex],
      ...updates
    };

    savePlan(updatedPlan);
  };

  // إكمال تمرين
  const completeExercise = (weekIndex: number, dayIndex: number, exerciseIndex: number, actualReps: number[]) => {
    if (!currentPlan) return;

    updateExercise(weekIndex, dayIndex, exerciseIndex, {
      completed: true,
      actualReps
    });

    // تحديث إحصائيات الأداء
    updateUserPerformance(actualReps);
  };

  // تحديث بيانات الأداء
  const updateUserPerformance = (actualReps: number[]) => {
    const performance: UserPerformanceData = userPerformance || {
      userId: 'current_user',
      totalWorkouts: 0,
      averageIntensity: 0,
      preferredExercises: [],
      weakAreas: [],
      improvementAreas: [],
      lastWorkoutDate: new Date(),
      consistencyScore: 0
    };

    performance.totalWorkouts += 1;
    performance.lastWorkoutDate = new Date();
    
    // حساب متوسط الشدة بناءً على الأداء الفعلي
    const intensity = actualReps.reduce((sum, reps, index) => {
      const targetReps = currentPlan?.weeks[selectedWeek - 1][0].exercises[index]?.reps || 10;
      return sum + (reps / targetReps);
    }, 0) / actualReps.length;

    performance.averageIntensity = (performance.averageIntensity + intensity) / 2;

    setUserPerformance(performance);
    localStorage.setItem('userPerformanceData', JSON.stringify(performance));
  };

  // إكمال يوم تدريبي
  const completeWorkoutDay = (weekIndex: number, dayIndex: number) => {
    if (!currentPlan) return;

    const updatedPlan = { ...currentPlan };
    updatedPlan.weeks[weekIndex][dayIndex].completed = true;
    updatedPlan.weeks[weekIndex][dayIndex].completedAt = new Date();
    updatedPlan.progress.completedWorkouts += 1;
    updatedPlan.progress.adherenceRate = (updatedPlan.progress.completedWorkouts / updatedPlan.progress.totalWorkouts) * 100;

    savePlan(updatedPlan);

    // إرسال إشعار
    if (notifications) {
      showNotification('تم إكمال التدريب بنجاح! 🎉');
    }
  };

  // إضافة تمرين جديد
  const addExercise = (weekIndex: number, dayIndex: number) => {
    if (!currentPlan) return;

    const newExercise: WorkoutExercise = {
      id: Date.now().toString(),
      name: 'New Exercise',
      nameAr: 'تمرين جديد',
      sets: 3,
      reps: 10,
      restTime: 60,
      difficulty: 'medium',
      completed: false
    };

    const updatedPlan = { ...currentPlan };
    updatedPlan.weeks[weekIndex][dayIndex].exercises.push(newExercise);
    savePlan(updatedPlan);
  };

  // حذف تمرين
  const removeExercise = (weekIndex: number, dayIndex: number, exerciseIndex: number) => {
    if (!currentPlan) return;

    const updatedPlan = { ...currentPlan };
    updatedPlan.weeks[weekIndex][dayIndex].exercises.splice(exerciseIndex, 1);
    savePlan(updatedPlan);
  };

  // إظهار إشعار
  const showNotification = (message: string) => {
    // في التطبيق الحقيقي، سيتم استخدام Notification API
    alert(message);
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800'
    };
    return colors[difficulty as keyof typeof colors] || colors.easy;
  };

  const getLevelColor = (level: string) => {
    const colors = {
      beginner: 'bg-blue-100 text-blue-800',
      intermediate: 'bg-purple-100 text-purple-800',
      advanced: 'bg-red-100 text-red-800'
    };
    return colors[level as keyof typeof colors] || colors.beginner;
  };

  if (!currentPlan && !showCreatePlan) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary mb-2">📋 مولّد الخطة التدريبية الذكية</h2>
          <p className="text-muted-foreground">إنشاء خطط تدريبية مخصصة بناءً على أدائك الفعلي</p>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">لا توجد خطة تدريبية نشطة</h3>
            <p className="text-muted-foreground text-center mb-6">
              أنشئ خطة تدريبية ذكية مخصصة بناءً على أدائك وأهدافك
            </p>
            <div className="flex gap-3">
              <Button onClick={() => savePlan(generateAdaptivePlan())}>
                <TrendingUp className="w-4 h-4 mr-2" />
                إنشاء خطة ذكية
              </Button>
              <Button variant="outline" onClick={() => setShowCreatePlan(true)}>
                <Plus className="w-4 h-4 mr-2" />
                إنشاء خطة مخصصة
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* إحصائيات الأداء السابق */}
        {userPerformance && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-secondary" />
                إحصائيات الأداء السابق
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{userPerformance.totalWorkouts}</div>
                  <div className="text-sm text-blue-700">إجمالي التدريبات</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(userPerformance.averageIntensity * 100)}%
                  </div>
                  <div className="text-sm text-green-700">متوسط الشدة</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(userPerformance.consistencyScore * 100)}%
                  </div>
                  <div className="text-sm text-purple-700">معدل الانتظام</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {Math.ceil((Date.now() - userPerformance.lastWorkoutDate.getTime()) / (1000 * 60 * 60 * 24))}
                  </div>
                  <div className="text-sm text-orange-700">أيام منذ آخر تدريب</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* عنوان الوحدة */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-2">📋 مولّد الخطة التدريبية الذكية</h2>
        <p className="text-muted-foreground">خطة تدريبية مخصصة تتكيف مع أدائك وتطورك</p>
      </div>

      {currentPlan && (
        <>
          {/* معلومات الخطة */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    {currentPlan.name}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {currentPlan.description}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge className={getLevelColor(currentPlan.level)}>
                    {currentPlan.level === 'beginner' ? 'مبتدئ' : 
                     currentPlan.level === 'intermediate' ? 'متوسط' : 'متقدم'}
                  </Badge>
                  <Badge variant="outline">
                    {currentPlan.duration} أسابيع
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {currentPlan.progress.completedWorkouts}/{currentPlan.progress.totalWorkouts}
                  </div>
                  <div className="text-sm text-blue-700">التدريبات المكتملة</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(currentPlan.progress.adherenceRate)}%
                  </div>
                  <div className="text-sm text-green-700">معدل الالتزام</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {currentPlan.progress.currentWeek}/{currentPlan.duration}
                  </div>
                  <div className="text-sm text-purple-700">الأسبوع الحالي</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">تقدم الخطة</span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round((currentPlan.progress.completedWorkouts / currentPlan.progress.totalWorkouts) * 100)}%
                  </span>
                </div>
                <Progress 
                  value={(currentPlan.progress.completedWorkouts / currentPlan.progress.totalWorkouts) * 100} 
                  className="h-2" 
                />
              </div>

              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    {isEditing ? 'إنهاء التعديل' : 'تعديل الخطة'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setNotifications(!notifications)}
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    {notifications ? 'إيقاف الإشعارات' : 'تفعيل الإشعارات'}
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  أُنشئت بواسطة: {currentPlan.createdBy === 'ai' ? 'الذكاء الاصطناعي' : 'المدرب'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* اختيار الأسبوع */}
          <Card>
            <CardHeader>
              <CardTitle>اختيار الأسبوع</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 overflow-x-auto">
                {Array.from({ length: currentPlan.duration }, (_, i) => (
                  <Button
                    key={i}
                    variant={selectedWeek === i + 1 ? "default" : "outline"}
                    onClick={() => setSelectedWeek(i + 1)}
                    className="min-w-fit"
                  >
                    الأسبوع {i + 1}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* أيام التدريب */}
          <div className="grid gap-4">
            {currentPlan.weeks[selectedWeek - 1]?.map((day, dayIndex) => (
              <Card key={day.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      {day.dayAr}
                      {day.completed && <CheckCircle className="w-5 h-5 text-green-500" />}
                    </CardTitle>
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addExercise(selectedWeek - 1, dayIndex)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        إضافة تمرين
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {day.exercises.map((exercise, exerciseIndex) => (
                      <div key={exercise.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{exercise.nameAr}</h4>
                            <Badge className={getDifficultyColor(exercise.difficulty)}>
                              {exercise.difficulty === 'easy' ? 'سهل' : 
                               exercise.difficulty === 'medium' ? 'متوسط' : 'صعب'}
                            </Badge>
                            {exercise.completed && <CheckCircle className="w-4 h-4 text-green-500" />}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{exercise.sets} مجموعات</span>
                            <span>{exercise.reps} تكرار</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {exercise.restTime}ث راحة
                            </span>
                          </div>
                          {exercise.actualReps && (
                            <div className="mt-2 text-sm text-green-600">
                              الأداء الفعلي: {exercise.actualReps.join(', ')} تكرار
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          {!exercise.completed && (
                            <Button
                              size="sm"
                              onClick={() => {
                                // محاكاة إكمال التمرين
                                const actualReps = Array.from({ length: exercise.sets }, () => 
                                  Math.floor(exercise.reps * (0.8 + Math.random() * 0.4))
                                );
                                completeExercise(selectedWeek - 1, dayIndex, exerciseIndex, actualReps);
                              }}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          {isEditing && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeExercise(selectedWeek - 1, dayIndex, exerciseIndex)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {!day.completed && day.exercises.every(ex => ex.completed) && (
                    <div className="mt-4 pt-4 border-t">
                      <Button
                        onClick={() => completeWorkoutDay(selectedWeek - 1, dayIndex)}
                        className="w-full"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        إكمال تدريب اليوم
                      </Button>
                    </div>
                  )}
                  
                  {day.completed && day.completedAt && (
                    <div className="mt-4 pt-4 border-t text-center text-sm text-green-600">
                      تم إكمال التدريب في: {day.completedAt.toLocaleString('ar-SA')}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdaptiveTrainingPlan;