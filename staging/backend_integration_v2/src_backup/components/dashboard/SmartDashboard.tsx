import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Sparkles, 
  Clock, 
  Target, 
  TrendingUp, 
  Calendar,
  User,
  Activity,
  Award,
  AlertTriangle,
  CheckCircle,
  Zap,
  Heart,
  Brain
} from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  age: number;
  weight?: number;
  height?: number;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  injuries: string[];
  preferences: string[];
  lastActivity?: Date;
  weeklyGoal: number;
  completedSessions: number;
}

interface SmartRecommendation {
  id: string;
  type: 'workout' | 'rest' | 'assessment' | 'challenge';
  title: string;
  description: string;
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  reason: string;
  exercises?: string[];
  avoidedExercises?: string[];
  priority: number;
}

interface TodayInsight {
  greeting: string;
  motivation: string;
  recommendation: SmartRecommendation;
  healthTip: string;
  progressUpdate: string;
}

export const SmartDashboard: React.FC = () => {
  const { user, environment } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [todayInsight, setTodayInsight] = useState<TodayInsight | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // تحميل ملف المستخدم من التخزين المحلي
  useEffect(() => {
    const loadUserProfile = () => {
      const savedProfile = localStorage.getItem(`userProfile_${user?.id}`);
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        setUserProfile(profile);
        generateTodayInsight(profile);
      } else {
        // إنشاء ملف افتراضي للمستخدم
        const defaultProfile: UserProfile = {
          id: user?.id || 'demo',
          name: user?.name || 'المستخدم',
          age: 20,
          fitnessLevel: 'beginner',
          injuries: [],
          preferences: [],
          weeklyGoal: 3,
          completedSessions: 0
        };
        setUserProfile(defaultProfile);
        generateTodayInsight(defaultProfile);
      }
      setIsLoading(false);
    };

    if (user) {
      loadUserProfile();
    }
  }, [user]);

  // توليد التوصية الذكية لليوم
  const generateTodayInsight = (profile: UserProfile) => {
    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.getDay();
    
    // تحديد التحية حسب الوقت
    let greeting = '';
    if (hour < 12) {
      greeting = `صباح الخير يا ${profile.name}! 🌅`;
    } else if (hour < 17) {
      greeting = `مساء الخير يا ${profile.name}! ☀️`;
    } else {
      greeting = `مساء الخير يا ${profile.name}! 🌙`;
    }

    // تحليل النشاط السابق
    const lastActivity = profile.lastActivity ? new Date(profile.lastActivity) : null;
    const daysSinceLastActivity = lastActivity ? 
      Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)) : 7;

    // توليد التوصية الذكية
    const recommendation = generateSmartRecommendation(profile, daysSinceLastActivity, hour, dayOfWeek);
    
    // رسالة تحفيزية
    const motivations = [
      'راك مستعد اليوم؟ 💪',
      'خلينا نكمل الطريق! 🚀',
      'اليوم يوم جديد للتطور! ⭐',
      'قدامك فرصة تحسن مستواك! 🎯',
      'كل تمرين خطوة للأمام! 📈'
    ];
    const motivation = motivations[Math.floor(Math.random() * motivations.length)];

    // نصيحة صحية
    const healthTips = [
      'اشرب كاس ماء قبل التمرين بـ 30 دقيقة 💧',
      'الإحماء مهم باش تتجنب الإصابات 🔥',
      'خذ راحة كافية بين التمارين ⏰',
      'ركز على التنفس الصحيح أثناء التمرين 🫁',
      'النوم الكافي ضروري للتعافي العضلي 😴'
    ];
    const healthTip = healthTips[Math.floor(Math.random() * healthTips.length)];

    // تحديث التقدم
    const progressUpdate = `أنجزت ${profile.completedSessions} جلسة من أصل ${profile.weeklyGoal} هذا الأسبوع`;

    const insight: TodayInsight = {
      greeting,
      motivation,
      recommendation,
      healthTip,
      progressUpdate
    };

    setTodayInsight(insight);
  };

  // توليد التوصية الذكية حسب حالة المستخدم
  const generateSmartRecommendation = (
    profile: UserProfile, 
    daysSinceLastActivity: number, 
    hour: number, 
    dayOfWeek: number
  ): SmartRecommendation => {
    
    // إذا كان المستخدم لديه إصابات، تجنب التمارين الضارة
    const avoidedExercises: string[] = [];
    if (profile.injuries.includes('knee')) {
      avoidedExercises.push('jumping', 'running', 'squats');
    }
    if (profile.injuries.includes('back')) {
      avoidedExercises.push('deadlifts', 'heavy_lifting');
    }
    if (profile.injuries.includes('shoulder')) {
      avoidedExercises.push('overhead_press', 'pull_ups');
    }

    // تحديد نوع التوصية حسب الظروف
    if (daysSinceLastActivity >= 3) {
      // عودة تدريجية بعد فترة انقطاع
      return {
        id: 'comeback',
        type: 'workout',
        title: 'عودة تدريجية',
        description: `بما أنك ما درتش تمارين من ${daysSinceLastActivity} أيام، نبداو بتمارين خفيفة للعودة التدريجية`,
        duration: 15,
        difficulty: 'easy',
        reason: 'عودة آمنة بعد فترة راحة',
        exercises: ['stretching', 'light_cardio', 'bodyweight'],
        avoidedExercises,
        priority: 1
      };
    }

    if (hour >= 21) {
      // تمارين مساء هادئة
      return {
        id: 'evening_calm',
        type: 'workout',
        title: 'تمارين مساء هادئة',
        description: 'وقت متأخر، نقترح تمارين استرخاء ومرونة باش تنام مليح',
        duration: 20,
        difficulty: 'easy',
        reason: 'تمارين مناسبة للمساء',
        exercises: ['yoga', 'stretching', 'breathing'],
        avoidedExercises: [...avoidedExercises, 'high_intensity'],
        priority: 2
      };
    }

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      // تمارين نهاية الأسبوع
      return {
        id: 'weekend_special',
        type: 'workout',
        title: 'تحدي نهاية الأسبوع',
        description: 'نهاية الأسبوع، وقت مناسب لتمرين أطول وأكثر تنوع!',
        duration: 30,
        difficulty: profile.fitnessLevel === 'beginner' ? 'medium' : 'hard',
        reason: 'وقت إضافي في نهاية الأسبوع',
        exercises: ['full_body', 'strength', 'cardio'],
        avoidedExercises,
        priority: 3
      };
    }

    // توصية عادية حسب المستوى
    const recommendations = {
      beginner: {
        title: 'تمارين للمبتدئين',
        description: 'تمارين أساسية لبناء القوة والتحمل تدريجياً',
        duration: 20,
        exercises: ['basic_strength', 'light_cardio', 'flexibility']
      },
      intermediate: {
        title: 'تمارين متوسطة',
        description: 'تمارين متنوعة لتطوير مستواك وتحسين الأداء',
        duration: 25,
        exercises: ['strength_training', 'cardio', 'functional']
      },
      advanced: {
        title: 'تمارين متقدمة',
        description: 'تحدي قوي لدفع حدودك وتحقيق أهداف جديدة',
        duration: 35,
        exercises: ['advanced_strength', 'hiit', 'plyometrics']
      }
    };

    const levelRec = recommendations[profile.fitnessLevel];
    
    return {
      id: 'daily_workout',
      type: 'workout',
      title: levelRec.title,
      description: levelRec.description,
      duration: levelRec.duration,
      difficulty: profile.fitnessLevel === 'beginner' ? 'easy' : 
                  profile.fitnessLevel === 'intermediate' ? 'medium' : 'hard',
      reason: 'تمرين يومي مناسب لمستواك',
      exercises: levelRec.exercises,
      avoidedExercises,
      priority: 4
    };
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800'
    };
    return colors[difficulty as keyof typeof colors] || colors.easy;
  };

  const getDifficultyText = (difficulty: string) => {
    const texts = {
      easy: 'سهل',
      medium: 'متوسط',
      hard: 'صعب'
    };
    return texts[difficulty as keyof typeof texts] || 'سهل';
  };

  const getEnvironmentTheme = () => {
    return environment === 'school' 
      ? 'from-blue-500 to-indigo-600' 
      : 'from-orange-500 to-green-500';
  };

  if (isLoading || !todayInsight) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="mr-3">جاري تحضير توصياتك الذكية...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* البطاقة الذكية الرئيسية */}
      <Card className={`bg-gradient-to-r ${getEnvironmentTheme()} text-white overflow-hidden`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                {todayInsight.greeting}
              </h2>
              <p className="text-lg opacity-90 mb-3">{todayInsight.motivation}</p>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-75">
                {environment === 'school' ? 'البيئة المدرسية' : 'بيئة المجتمع'}
              </div>
              <div className="text-xs opacity-60">
                {new Date().toLocaleDateString('ar-SA')}
              </div>
            </div>
          </div>

          {/* التوصية الذكية */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{todayInsight.recommendation.title}</h3>
                <p className="text-sm opacity-90">{todayInsight.recommendation.description}</p>
              </div>
              <Badge className={`${getDifficultyColor(todayInsight.recommendation.difficulty)} text-gray-800`}>
                {getDifficultyText(todayInsight.recommendation.difficulty)}
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-sm mb-3">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{todayInsight.recommendation.duration} دقيقة</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                <span>{todayInsight.recommendation.reason}</span>
              </div>
            </div>

            {/* التمارين المقترحة والمتجنبة */}
            {todayInsight.recommendation.exercises && todayInsight.recommendation.exercises.length > 0 && (
              <div className="mb-3">
                <div className="text-xs font-medium mb-1">التمارين المقترحة:</div>
                <div className="flex flex-wrap gap-1">
                  {todayInsight.recommendation.exercises.map((exercise, index) => (
                    <Badge key={index} variant="outline" className="text-xs bg-white/20 text-white border-white/30">
                      {exercise}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {todayInsight.recommendation.avoidedExercises && todayInsight.recommendation.avoidedExercises.length > 0 && (
              <div className="mb-3">
                <div className="text-xs font-medium mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  تمارين متجنبة (حسب حالتك الصحية):
                </div>
                <div className="flex flex-wrap gap-1">
                  {todayInsight.recommendation.avoidedExercises.map((exercise, index) => (
                    <Badge key={index} variant="outline" className="text-xs bg-red-500/20 text-red-100 border-red-300/30">
                      {exercise}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Button 
              className="w-full bg-white text-gray-800 hover:bg-gray-100 font-medium"
              size="lg"
            >
              <Zap className="w-4 h-4 mr-2" />
              ابدأ التمرين الآن
            </Button>
          </div>

          {/* معلومات إضافية */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Heart className="w-4 h-4" />
                <span className="font-medium">نصيحة صحية</span>
              </div>
              <p className="opacity-90">{todayInsight.healthTip}</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">تقدمك الأسبوعي</span>
              </div>
              <p className="opacity-90">{todayInsight.progressUpdate}</p>
              {userProfile && (
                <Progress 
                  value={(userProfile.completedSessions / userProfile.weeklyGoal) * 100} 
                  className="h-2 mt-2 bg-white/20"
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* إحصائيات سريعة */}
      {userProfile && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {userProfile.completedSessions}
              </div>
              <div className="text-sm text-muted-foreground">جلسات مكتملة</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {Math.round((userProfile.completedSessions / userProfile.weeklyGoal) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">الهدف الأسبوعي</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {userProfile.fitnessLevel === 'beginner' ? 'مبتدئ' : 
                 userProfile.fitnessLevel === 'intermediate' ? 'متوسط' : 'متقدم'}
              </div>
              <div className="text-sm text-muted-foreground">مستواك الحالي</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {userProfile.injuries.length === 0 ? (
                  <CheckCircle className="w-8 h-8 mx-auto text-green-500" />
                ) : (
                  <AlertTriangle className="w-8 h-8 mx-auto text-orange-500" />
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                {userProfile.injuries.length === 0 ? 'بدون إصابات' : `${userProfile.injuries.length} إصابة`}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SmartDashboard;