import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Brain, Target, TrendingUp, Award, Volume2, BookOpen, Zap } from 'lucide-react';

interface UserProgress {
  level: number;
  xp: number;
  nextLevelXp: number;
  strengths: string[];
  weaknesses: string[];
  completedActivities: number;
  totalActivities: number;
}

interface Recommendation {
  id: string;
  type: 'exercise' | 'lesson' | 'challenge';
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number;
  xpReward: number;
  category: string;
}

export const AdaptiveTutor: React.FC = () => {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    level: 5,
    xp: 1250,
    nextLevelXp: 1500,
    strengths: ['تمارين القوة', 'التحمل', 'المرونة'],
    weaknesses: ['التوازن', 'السرعة'],
    completedActivities: 23,
    totalActivities: 30
  });

  const [dailyRecommendations, setDailyRecommendations] = useState<Recommendation[]>([
    {
      id: '1',
      type: 'exercise',
      title: 'تمارين التوازن المتقدمة',
      description: 'تمارين مخصصة لتحسين التوازن والثبات',
      difficulty: 'medium',
      estimatedTime: 15,
      xpReward: 50,
      category: 'التوازن'
    },
    {
      id: '2',
      type: 'lesson',
      title: 'أساسيات تمارين السرعة',
      description: 'تعلم تقنيات تحسين السرعة والرشاقة',
      difficulty: 'easy',
      estimatedTime: 10,
      xpReward: 30,
      category: 'السرعة'
    },
    {
      id: '3',
      type: 'challenge',
      title: 'تحدي الأسبوع: القفز العالي',
      description: 'تحدي مثير لتحسين قوة الساقين',
      difficulty: 'hard',
      estimatedTime: 20,
      xpReward: 100,
      category: 'القوة'
    }
  ]);

  const [isSpeaking, setIsSpeaking] = useState(false);

  const progressPercentage = (userProgress.xp / userProgress.nextLevelXp) * 100;
  const completionPercentage = (userProgress.completedActivities / userProgress.totalActivities) * 100;

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: 'bg-green-500',
      medium: 'bg-yellow-500',
      hard: 'bg-red-500'
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-500';
  };

  const getDifficultyText = (difficulty: string) => {
    const texts = {
      easy: 'سهل',
      medium: 'متوسط',
      hard: 'صعب'
    };
    return texts[difficulty as keyof typeof texts] || difficulty;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      exercise: Target,
      lesson: BookOpen,
      challenge: Zap
    };
    return icons[type as keyof typeof icons] || Target;
  };

  const speakWelcomeMessage = () => {
    setIsSpeaking(true);
    // محاكاة تشغيل الصوت باستخدام ElevenLabs API
    setTimeout(() => {
      setIsSpeaking(false);
    }, 3000);
  };

  const startRecommendation = (recommendation: Recommendation) => {
    // منطق بدء النشاط الموصى به
    console.log('Starting recommendation:', recommendation);
  };

  return (
    <div className="space-y-6">
      {/* رأس المدرّس الافتراضي */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src="/api/placeholder/64/64" alt="المدرّس الافتراضي" />
              <AvatarFallback className="bg-primary text-white">
                <Brain className="w-8 h-8" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                مدرّسك الافتراضي الذكي
              </CardTitle>
              <CardDescription>
                مرحباً! أنا هنا لمساعدتك في رحلة التعلم والتطوير الشخصي
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={speakWelcomeMessage}
              disabled={isSpeaking}
            >
              <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-pulse' : ''}`} />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* تقرير التقدم */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              مستوى التقدم
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">المستوى {userProgress.level}</span>
              <Badge variant="outline">{userProgress.xp} XP</Badge>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <p className="text-sm text-muted-foreground">
              {userProgress.nextLevelXp - userProgress.xp} نقطة للمستوى التالي
            </p>
            
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">إكمال الأنشطة</span>
                <span className="text-sm text-muted-foreground">
                  {userProgress.completedActivities}/{userProgress.totalActivities}
                </span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-secondary" />
              نقاط القوة والضعف
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-green-600 mb-2">نقاط القوة</h4>
              <div className="flex flex-wrap gap-2">
                {userProgress.strengths.map((strength, index) => (
                  <Badge key={index} variant="outline" className="bg-green-50 text-green-700">
                    {strength}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-orange-600 mb-2">مجالات التحسين</h4>
              <div className="flex flex-wrap gap-2">
                {userProgress.weaknesses.map((weakness, index) => (
                  <Badge key={index} variant="outline" className="bg-orange-50 text-orange-700">
                    {weakness}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* التوصيات اليومية */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-accent-orange" />
            توصياتك اليومية المخصصة
          </CardTitle>
          <CardDescription>
            أنشطة مختارة خصيصاً لك بناءً على مستواك وأهدافك
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dailyRecommendations.map((recommendation) => {
              const TypeIcon = getTypeIcon(recommendation.type);
              return (
                <div key={recommendation.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <TypeIcon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{recommendation.title}</h4>
                          <div className={`w-2 h-2 rounded-full ${getDifficultyColor(recommendation.difficulty)}`}></div>
                          <span className="text-xs text-muted-foreground">
                            {getDifficultyText(recommendation.difficulty)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {recommendation.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>⏱️ {recommendation.estimatedTime} دقيقة</span>
                          <span>🏆 {recommendation.xpReward} XP</span>
                          <Badge variant="outline" className="text-xs">
                            {recommendation.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => startRecommendation(recommendation)}
                    >
                      ابدأ الآن
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdaptiveTutor;