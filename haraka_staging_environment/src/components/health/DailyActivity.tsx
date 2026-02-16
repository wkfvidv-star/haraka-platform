import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { StatsCard } from '@/components/ui/stats-card';
import { 
  Footprints, 
  MapPin, 
  Flame, 
  Heart, 
  Clock,
  Target,
  TrendingUp,
  Award
} from 'lucide-react';

interface ActivityData {
  steps: number;
  stepsGoal: number;
  distance: number; // بالكيلومتر
  calories: number;
  heartRate: {
    current: number;
    min: number;
    max: number;
    avg: number;
  };
  activeTime: number; // بالدقائق
  sedentaryTime: number; // بالدقائق
}

interface DailyActivityProps {
  data: ActivityData;
}

export function DailyActivity({ data }: DailyActivityProps) {
  const stepsProgress = (data.steps / data.stepsGoal) * 100;
  const totalTime = data.activeTime + data.sedentaryTime;
  const activePercentage = totalTime > 0 ? (data.activeTime / totalTime) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* بطاقات الإحصائيات السريعة */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatsCard
          title="الخطوات"
          value={data.steps.toLocaleString()}
          description={`من ${data.stepsGoal.toLocaleString()} هدف`}
          icon={Footprints}
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="المسافة"
          value={`${data.distance.toFixed(1)} كم`}
          description="المسافة المقطوعة"
          icon={MapPin}
          color="green"
        />
        <StatsCard
          title="السعرات"
          value={data.calories}
          description="سعرة محروقة"
          icon={Flame}
          color="orange"
        />
        <StatsCard
          title="معدل النبض"
          value={data.heartRate.current}
          description="نبضة/دقيقة"
          icon={Heart}
          color="red"
        />
      </div>

      {/* تفاصيل النشاط */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* تقدم الخطوات */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-blue-500" />
              هدف الخطوات اليومي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {data.steps.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">
                  من {data.stepsGoal.toLocaleString()} خطوة
                </div>
              </div>
              
              <Progress value={stepsProgress} className="h-3" />
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">التقدم</span>
                <span className="font-medium">{stepsProgress.toFixed(1)}%</span>
              </div>
              
              {stepsProgress >= 100 ? (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-900/20 p-2 rounded">
                  <Award className="h-4 w-4" />
                  <span className="text-sm font-medium">تم تحقيق الهدف! أحسنت!</span>
                </div>
              ) : (
                <div className="text-sm text-gray-600">
                  تحتاج {(data.stepsGoal - data.steps).toLocaleString()} خطوة إضافية
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* معدل ضربات القلب */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Heart className="h-5 w-5 text-red-500" />
              معدل ضربات القلب
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-1">
                  {data.heartRate.current}
                </div>
                <div className="text-sm text-gray-500">نبضة/دقيقة</div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-blue-600">
                    {data.heartRate.min}
                  </div>
                  <div className="text-xs text-gray-500">الأدنى</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-green-600">
                    {data.heartRate.avg}
                  </div>
                  <div className="text-xs text-gray-500">المتوسط</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-red-600">
                    {data.heartRate.max}
                  </div>
                  <div className="text-xs text-gray-500">الأعلى</div>
                </div>
              </div>
              
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">الحالة الحالية</span>
                </div>
                <div className="text-sm text-gray-600">
                  {data.heartRate.current < 60 ? 'معدل منخفض - راحة' :
                   data.heartRate.current < 100 ? 'معدل طبيعي - راحة' :
                   data.heartRate.current < 140 ? 'نشاط خفيف' :
                   data.heartRate.current < 180 ? 'نشاط متوسط' : 'نشاط مكثف'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* وقت النشاط والجلوس */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-purple-500" />
            توزيع الوقت اليومي
          </CardTitle>
          <CardDescription>
            توزيع وقتك بين النشاط والراحة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">وقت النشاط</span>
                <span className="text-sm text-green-600 font-medium">
                  {Math.floor(data.activeTime / 60)}س {data.activeTime % 60}د
                </span>
              </div>
              <Progress value={activePercentage} className="h-2 mb-1" />
              <div className="text-xs text-gray-500">
                {activePercentage.toFixed(1)}% من اليوم
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">وقت الجلوس</span>
                <span className="text-sm text-orange-600 font-medium">
                  {Math.floor(data.sedentaryTime / 60)}س {data.sedentaryTime % 60}د
                </span>
              </div>
              <Progress value={100 - activePercentage} className="h-2 mb-1" />
              <div className="text-xs text-gray-500">
                {(100 - activePercentage).toFixed(1)}% من اليوم
              </div>
            </div>
          </div>
          
          {data.sedentaryTime > 480 && ( // أكثر من 8 ساعات جلوس
            <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">تنبيه</span>
              </div>
              <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                لقد جلست لفترة طويلة اليوم. حاول أخذ فترات راحة للحركة كل ساعة.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}