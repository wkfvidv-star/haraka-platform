import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Moon, 
  Droplets, 
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface HealthData {
  heartRate: {
    min: number;
    max: number;
    avg: number;
    restingHR: number;
  };
  sleep: {
    totalSleep: number; // بالدقائق
    deepSleep: number;
    lightSleep: number;
    remSleep: number;
    sleepQuality: number; // نسبة مئوية
  };
  oxygenSaturation?: number; // SpO2
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
}

interface HealthMetricsProps {
  data: HealthData;
}

export function HealthMetrics({ data }: HealthMetricsProps) {
  const totalSleepHours = data.sleep.totalSleep / 60;
  const deepSleepPercentage = (data.sleep.deepSleep / data.sleep.totalSleep) * 100;
  const lightSleepPercentage = (data.sleep.lightSleep / data.sleep.totalSleep) * 100;
  const remSleepPercentage = (data.sleep.remSleep / data.sleep.totalSleep) * 100;

  const getHeartRateStatus = (hr: number) => {
    if (hr < 60) return { status: 'منخفض', color: 'blue', icon: TrendingDown };
    if (hr <= 100) return { status: 'طبيعي', color: 'green', icon: CheckCircle };
    return { status: 'مرتفع', color: 'red', icon: TrendingUp };
  };

  const getSleepQualityStatus = (quality: number) => {
    if (quality >= 80) return { status: 'ممتاز', color: 'green' };
    if (quality >= 60) return { status: 'جيد', color: 'blue' };
    if (quality >= 40) return { status: 'متوسط', color: 'yellow' };
    return { status: 'ضعيف', color: 'red' };
  };

  const getBloodPressureStatus = (systolic: number, diastolic: number) => {
    if (systolic < 120 && diastolic < 80) return { status: 'طبيعي', color: 'green' };
    if (systolic < 140 && diastolic < 90) return { status: 'مرتفع قليلاً', color: 'yellow' };
    return { status: 'مرتفع', color: 'red' };
  };

  const hrStatus = getHeartRateStatus(data.heartRate.avg);
  const sleepStatus = getSleepQualityStatus(data.sleep.sleepQuality);
  const bpStatus = data.bloodPressure ? getBloodPressureStatus(data.bloodPressure.systolic, data.bloodPressure.diastolic) : null;

  return (
    <div className="space-y-4">
      {/* معدل ضربات القلب التفصيلي */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Heart className="h-5 w-5 text-red-500" />
            تحليل معدل ضربات القلب
          </CardTitle>
          <CardDescription>
            تحليل مفصل لمعدل ضربات القلب على مدار اليوم
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-2xl font-bold text-red-600 mb-1">
                {data.heartRate.min}
              </div>
              <div className="text-sm text-gray-600">الأدنى</div>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {data.heartRate.avg}
              </div>
              <div className="text-sm text-gray-600">المتوسط</div>
            </div>
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {data.heartRate.max}
              </div>
              <div className="text-sm text-gray-600">الأعلى</div>
            </div>
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {data.heartRate.restingHR}
              </div>
              <div className="text-sm text-gray-600">أثناء الراحة</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <hrStatus.icon className={`h-4 w-4 text-${hrStatus.color}-500`} />
            <span className="text-sm">الحالة:</span>
            <Badge variant={hrStatus.color === 'green' ? 'default' : 'secondary'}>
              {hrStatus.status}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* تحليل النوم */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Moon className="h-5 w-5 text-indigo-500" />
            تحليل النوم
          </CardTitle>
          <CardDescription>
            تفاصيل جودة ومراحل النوم الليلة الماضية
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* إجمالي النوم وجودته */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <div className="text-3xl font-bold text-indigo-600 mb-1">
                  {totalSleepHours.toFixed(1)}س
                </div>
                <div className="text-sm text-gray-600">إجمالي النوم</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {data.sleep.sleepQuality}%
                </div>
                <div className="text-sm text-gray-600">جودة النوم</div>
                <Badge 
                  variant={sleepStatus.color === 'green' ? 'default' : 'secondary'}
                  className="mt-1"
                >
                  {sleepStatus.status}
                </Badge>
              </div>
            </div>

            {/* مراحل النوم */}
            <div>
              <h4 className="font-medium mb-3">مراحل النوم:</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>النوم العميق</span>
                    <span>{Math.round(data.sleep.deepSleep / 60)}س {data.sleep.deepSleep % 60}د</span>
                  </div>
                  <Progress value={deepSleepPercentage} className="h-2" />
                  <div className="text-xs text-gray-500 mt-1">
                    {deepSleepPercentage.toFixed(1)}% من إجمالي النوم
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>النوم الخفيف</span>
                    <span>{Math.round(data.sleep.lightSleep / 60)}س {data.sleep.lightSleep % 60}د</span>
                  </div>
                  <Progress value={lightSleepPercentage} className="h-2" />
                  <div className="text-xs text-gray-500 mt-1">
                    {lightSleepPercentage.toFixed(1)}% من إجمالي النوم
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>نوم الأحلام (REM)</span>
                    <span>{Math.round(data.sleep.remSleep / 60)}س {data.sleep.remSleep % 60}د</span>
                  </div>
                  <Progress value={remSleepPercentage} className="h-2" />
                  <div className="text-xs text-gray-500 mt-1">
                    {remSleepPercentage.toFixed(1)}% من إجمالي النوم
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* المؤشرات الإضافية */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* مستوى الأكسجين */}
        {data.oxygenSaturation && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Droplets className="h-5 w-5 text-blue-500" />
                مستوى الأكسجين
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {data.oxygenSaturation}%
                </div>
                <div className="text-sm text-gray-600 mb-3">SpO2</div>
                {data.oxygenSaturation >= 95 ? (
                  <Badge className="bg-green-500">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    طبيعي
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    منخفض
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ضغط الدم */}
        {data.bloodPressure && bpStatus && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="h-5 w-5 text-red-500" />
                ضغط الدم
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 mb-2">
                  {data.bloodPressure.systolic}/{data.bloodPressure.diastolic}
                </div>
                <div className="text-sm text-gray-600 mb-3">mmHg</div>
                <Badge 
                  variant={bpStatus.color === 'green' ? 'default' : 
                          bpStatus.color === 'yellow' ? 'secondary' : 'destructive'}
                >
                  {bpStatus.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}