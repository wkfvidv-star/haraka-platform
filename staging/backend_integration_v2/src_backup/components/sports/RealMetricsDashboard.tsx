import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Target,
  Activity,
  Users,
  Filter,
  Download,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Trophy,
  Zap
} from 'lucide-react';

interface WorkoutSession {
  id: string;
  userId: string;
  userType: 'student' | 'youth' | 'coach';
  exercise: string;
  exerciseAr: string;
  date: Date;
  duration: number; // بالدقائق
  correctReps: number;
  totalAttempts: number;
  accuracy: number;
  errors: string[];
  environment: 'school' | 'community';
}

interface UserMetrics {
  userId: string;
  userName: string;
  userType: 'student' | 'youth' | 'coach';
  environment: 'school' | 'community';
  totalSessions: number;
  totalDuration: number; // بالدقائق
  averageAccuracy: number;
  improvementRate: number;
  lastSessionDate: Date;
  consistencyScore: number;
  favoriteExercises: string[];
  commonErrors: string[];
}

interface SystemMetrics {
  totalUsers: number;
  totalSessions: number;
  averageSessionDuration: number;
  overallAccuracy: number;
  mostPopularExercises: { name: string; count: number }[];
  commonErrors: { error: string; count: number }[];
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
}

export const RealMetricsDashboard: React.FC = () => {
  const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>([]);
  const [userMetrics, setUserMetrics] = useState<UserMetrics[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month' | 'all'>('week');
  const [selectedUserType, setSelectedUserType] = useState<'all' | 'student' | 'youth' | 'coach'>('all');
  const [selectedEnvironment, setSelectedEnvironment] = useState<'all' | 'school' | 'community'>('all');
  const [isLoading, setIsLoading] = useState(false);

  // تحميل البيانات الحقيقية من التخزين المحلي
  useEffect(() => {
    loadRealData();
  }, [selectedPeriod, selectedUserType, selectedEnvironment]);

  const loadRealData = () => {
    setIsLoading(true);
    
    // تحميل جلسات التدريب الحقيقية
    const savedSessions = localStorage.getItem('exerciseSessions');
    const sessions: WorkoutSession[] = savedSessions ? JSON.parse(savedSessions) : [];
    
    // تصفية البيانات حسب المعايير المحددة
    const filteredSessions = sessions.filter(session => {
      const sessionDate = new Date(session.date);
      const now = new Date();
      
      // تصفية حسب الفترة الزمنية
      let periodMatch = true;
      if (selectedPeriod === 'day') {
        periodMatch = sessionDate.toDateString() === now.toDateString();
      } else if (selectedPeriod === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        periodMatch = sessionDate >= weekAgo;
      } else if (selectedPeriod === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        periodMatch = sessionDate >= monthAgo;
      }
      
      // تصفية حسب نوع المستخدم
      const userTypeMatch = selectedUserType === 'all' || session.userType === selectedUserType;
      
      // تصفية حسب البيئة
      const environmentMatch = selectedEnvironment === 'all' || session.environment === selectedEnvironment;
      
      return periodMatch && userTypeMatch && environmentMatch;
    });
    
    setWorkoutSessions(filteredSessions);
    
    // حساب مقاييس المستخدمين
    const userMetricsMap = new Map<string, UserMetrics>();
    
    filteredSessions.forEach(session => {
      if (!userMetricsMap.has(session.userId)) {
        userMetricsMap.set(session.userId, {
          userId: session.userId,
          userName: `مستخدم ${session.userId}`,
          userType: session.userType,
          environment: session.environment,
          totalSessions: 0,
          totalDuration: 0,
          averageAccuracy: 0,
          improvementRate: 0,
          lastSessionDate: session.date,
          consistencyScore: 0,
          favoriteExercises: [],
          commonErrors: []
        });
      }
      
      const metrics = userMetricsMap.get(session.userId)!;
      metrics.totalSessions += 1;
      metrics.totalDuration += session.duration;
      metrics.averageAccuracy = (metrics.averageAccuracy + session.accuracy) / 2;
      
      if (new Date(session.date) > new Date(metrics.lastSessionDate)) {
        metrics.lastSessionDate = session.date;
      }
      
      // تحديث التمارين المفضلة
      if (!metrics.favoriteExercises.includes(session.exerciseAr)) {
        metrics.favoriteExercises.push(session.exerciseAr);
      }
      
      // تحديث الأخطاء الشائعة
      session.errors.forEach(error => {
        if (!metrics.commonErrors.includes(error)) {
          metrics.commonErrors.push(error);
        }
      });
    });
    
    setUserMetrics(Array.from(userMetricsMap.values()));
    
    // حساب مقاييس النظام
    const systemMetrics: SystemMetrics = {
      totalUsers: userMetricsMap.size,
      totalSessions: filteredSessions.length,
      averageSessionDuration: filteredSessions.length > 0 ? 
        filteredSessions.reduce((sum, s) => sum + s.duration, 0) / filteredSessions.length : 0,
      overallAccuracy: filteredSessions.length > 0 ? 
        filteredSessions.reduce((sum, s) => sum + s.accuracy, 0) / filteredSessions.length : 0,
      mostPopularExercises: getTopExercises(filteredSessions),
      commonErrors: getCommonErrors(filteredSessions),
      dailyActiveUsers: getUsersInPeriod(sessions, 1),
      weeklyActiveUsers: getUsersInPeriod(sessions, 7),
      monthlyActiveUsers: getUsersInPeriod(sessions, 30)
    };
    
    setSystemMetrics(systemMetrics);
    setIsLoading(false);
  };

  const getTopExercises = (sessions: WorkoutSession[]) => {
    const exerciseCount = new Map<string, number>();
    sessions.forEach(session => {
      exerciseCount.set(session.exerciseAr, (exerciseCount.get(session.exerciseAr) || 0) + 1);
    });
    
    return Array.from(exerciseCount.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const getCommonErrors = (sessions: WorkoutSession[]) => {
    const errorCount = new Map<string, number>();
    sessions.forEach(session => {
      session.errors.forEach(error => {
        errorCount.set(error, (errorCount.get(error) || 0) + 1);
      });
    });
    
    return Array.from(errorCount.entries())
      .map(([error, count]) => ({ error, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const getUsersInPeriod = (sessions: WorkoutSession[], days: number) => {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const activeUsers = new Set<string>();
    
    sessions.forEach(session => {
      if (new Date(session.date) >= cutoffDate) {
        activeUsers.add(session.userId);
      }
    });
    
    return activeUsers.size;
  };

  const exportData = () => {
    const data = {
      sessions: workoutSessions,
      userMetrics,
      systemMetrics,
      exportDate: new Date(),
      filters: {
        period: selectedPeriod,
        userType: selectedUserType,
        environment: selectedEnvironment
      }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `metrics-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getUserTypeText = (type: string) => {
    const types = {
      student: 'تلميذ',
      youth: 'شاب',
      coach: 'مدرب'
    };
    return types[type as keyof typeof types] || type;
  };

  const getEnvironmentText = (env: string) => {
    const environments = {
      school: 'مدرسية',
      community: 'مجتمعية'
    };
    return environments[env as keyof typeof environments] || env;
  };

  const getPeriodText = (period: string) => {
    const periods = {
      day: 'اليوم',
      week: 'الأسبوع',
      month: 'الشهر',
      all: 'الكل'
    };
    return periods[period as keyof typeof periods] || period;
  };

  return (
    <div className="space-y-6">
      {/* عنوان الوحدة */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-2">📊 لوحة المقاييس الواقعية</h2>
        <p className="text-muted-foreground">تتبع وتحليل البيانات الحقيقية للأداء والنشاط</p>
      </div>

      {/* أدوات التصفية */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            تصفية البيانات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">الفترة الزمنية</label>
              <div className="flex gap-1">
                {(['day', 'week', 'month', 'all'] as const).map(period => (
                  <Button
                    key={period}
                    size="sm"
                    variant={selectedPeriod === period ? "default" : "outline"}
                    onClick={() => setSelectedPeriod(period)}
                  >
                    {getPeriodText(period)}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">نوع المستخدم</label>
              <div className="flex gap-1">
                {(['all', 'student', 'youth', 'coach'] as const).map(type => (
                  <Button
                    key={type}
                    size="sm"
                    variant={selectedUserType === type ? "default" : "outline"}
                    onClick={() => setSelectedUserType(type)}
                  >
                    {type === 'all' ? 'الكل' : getUserTypeText(type)}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">البيئة</label>
              <div className="flex gap-1">
                {(['all', 'school', 'community'] as const).map(env => (
                  <Button
                    key={env}
                    size="sm"
                    variant={selectedEnvironment === env ? "default" : "outline"}
                    onClick={() => setSelectedEnvironment(env)}
                  >
                    {env === 'all' ? 'الكل' : getEnvironmentText(env)}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex items-end gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={loadRealData}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                تحديث
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={exportData}
              >
                <Download className="w-4 h-4 mr-2" />
                تصدير
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* مقاييس النظام العامة */}
      {systemMetrics && (
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">إجمالي المستخدمين</p>
                  <p className="text-2xl font-bold">{systemMetrics.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">إجمالي الجلسات</p>
                  <p className="text-2xl font-bold">{systemMetrics.totalSessions}</p>
                </div>
                <Activity className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">متوسط مدة الجلسة</p>
                  <p className="text-2xl font-bold">{Math.round(systemMetrics.averageSessionDuration)} د</p>
                </div>
                <Clock className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">الدقة الإجمالية</p>
                  <p className="text-2xl font-bold">{Math.round(systemMetrics.overallAccuracy)}%</p>
                </div>
                <Target className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* المستخدمون النشطون */}
      {systemMetrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-secondary" />
              المستخدمون النشطون
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{systemMetrics.dailyActiveUsers}</div>
                <div className="text-sm text-blue-700">نشطون اليوم</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{systemMetrics.weeklyActiveUsers}</div>
                <div className="text-sm text-green-700">نشطون هذا الأسبوع</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{systemMetrics.monthlyActiveUsers}</div>
                <div className="text-sm text-purple-700">نشطون هذا الشهر</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* التمارين الأكثر شعبية */}
      {systemMetrics && systemMetrics.mostPopularExercises.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-accent-orange" />
              التمارين الأكثر شعبية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {systemMetrics.mostPopularExercises.map((exercise, index) => (
                <div key={exercise.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">#{index + 1}</Badge>
                    <span className="font-medium">{exercise.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{exercise.count} جلسة</span>
                    <Progress 
                      value={(exercise.count / systemMetrics.mostPopularExercises[0].count) * 100} 
                      className="w-20 h-2" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* الأخطاء الشائعة */}
      {systemMetrics && systemMetrics.commonErrors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              الأخطاء الأكثر شيوعاً
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {systemMetrics.commonErrors.map((error, index) => (
                <div key={error.error} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-red-50 text-red-700">#{index + 1}</Badge>
                    <span className="font-medium">{error.error}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{error.count} مرة</span>
                    <Progress 
                      value={(error.count / systemMetrics.commonErrors[0].count) * 100} 
                      className="w-20 h-2" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* أفضل المستخدمين */}
      {userMetrics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              أفضل المستخدمين أداءً
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userMetrics
                .sort((a, b) => b.averageAccuracy - a.averageAccuracy)
                .slice(0, 10)
                .map((user, index) => (
                <div key={user.userId} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">#{index + 1}</Badge>
                    <div>
                      <div className="font-medium">{user.userName}</div>
                      <div className="text-sm text-muted-foreground">
                        {getUserTypeText(user.userType)} - {getEnvironmentText(user.environment)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      {Math.round(user.averageAccuracy)}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {user.totalSessions} جلسة
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* رسالة عند عدم وجود بيانات */}
      {workoutSessions.length === 0 && !isLoading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BarChart3 className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">لا توجد بيانات</h3>
            <p className="text-muted-foreground text-center">
              لا توجد جلسات تدريب مسجلة للفترة والمعايير المحددة.
              <br />
              ابدأ بتسجيل جلسات تدريب لرؤية الإحصائيات هنا.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RealMetricsDashboard;