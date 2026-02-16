import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Scale, 
  Zap, 
  Droplets, 
  TrendingUp,
  Target,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';

interface BodyComposition {
  bodyFatPercentage: number;
  muscleMass: number; // بالكيلوغرام
  waterPercentage: number;
  bmi: number;
  weight: number; // بالكيلوغرام
  height: number; // بالسنتيمتر
  visceralFat: number; // مستوى الدهون الحشوية
  boneMass: number; // بالكيلوغرام
  metabolicAge: number; // العمر الأيضي
}

interface BodyAnalysisProps {
  data: BodyComposition;
  userAge: number;
  userGender: 'male' | 'female';
}

export function BodyAnalysis({ data, userAge, userGender }: BodyAnalysisProps) {
  // حساب الحالات والتقييمات
  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return { status: 'نقص في الوزن', color: 'blue', recommendation: 'يُنصح بزيادة الوزن تدريجياً' };
    if (bmi < 25) return { status: 'وزن طبيعي', color: 'green', recommendation: 'حافظ على وزنك الحالي' };
    if (bmi < 30) return { status: 'زيادة في الوزن', color: 'yellow', recommendation: 'يُنصح بتقليل الوزن' };
    return { status: 'سمنة', color: 'red', recommendation: 'يُنصح بمراجعة طبيب مختص' };
  };

  const getBodyFatStatus = (fatPercentage: number, gender: string) => {
    const ranges = gender === 'male' 
      ? { low: 10, normal: 20, high: 25 }
      : { low: 16, normal: 25, high: 32 };
    
    if (fatPercentage < ranges.low) return { status: 'منخفض', color: 'blue' };
    if (fatPercentage < ranges.normal) return { status: 'طبيعي', color: 'green' };
    if (fatPercentage < ranges.high) return { status: 'مرتفع قليلاً', color: 'yellow' };
    return { status: 'مرتفع', color: 'red' };
  };

  const getWaterStatus = (waterPercentage: number, gender: string) => {
    const normalRange = gender === 'male' ? [60, 65] : [50, 55];
    if (waterPercentage < normalRange[0]) return { status: 'منخفض', color: 'red' };
    if (waterPercentage <= normalRange[1]) return { status: 'طبيعي', color: 'green' };
    return { status: 'مرتفع', color: 'blue' };
  };

  const getVisceralFatStatus = (level: number) => {
    if (level < 10) return { status: 'طبيعي', color: 'green' };
    if (level < 15) return { status: 'مرتفع قليلاً', color: 'yellow' };
    return { status: 'مرتفع', color: 'red' };
  };

  const bmiStatus = getBMIStatus(data.bmi);
  const fatStatus = getBodyFatStatus(data.bodyFatPercentage, userGender);
  const waterStatus = getWaterStatus(data.waterPercentage, userGender);
  const visceralStatus = getVisceralFatStatus(data.visceralFat);

  return (
    <div className="space-y-4">
      {/* نظرة عامة */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Scale className="h-5 w-5 text-purple-500" />
            تحليل تركيبة الجسم
          </CardTitle>
          <CardDescription>
            تحليل مفصل لتركيبة جسمك باستخدام تقنية BIA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {data.weight}
              </div>
              <div className="text-sm text-gray-600">الوزن (كغ)</div>
            </div>
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {data.height}
              </div>
              <div className="text-sm text-gray-600">الطول (سم)</div>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {data.bmi.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">مؤشر كتلة الجسم</div>
            </div>
            <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {data.metabolicAge}
              </div>
              <div className="text-sm text-gray-600">العمر الأيضي</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* مؤشر كتلة الجسم */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5 text-green-500" />
            مؤشر كتلة الجسم (BMI)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {data.bmi.toFixed(1)}
              </div>
              <Badge 
                variant={bmiStatus.color === 'green' ? 'default' : 
                        bmiStatus.color === 'yellow' ? 'secondary' : 'destructive'}
              >
                {bmiStatus.status}
              </Badge>
            </div>
            
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Info className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">التوصية</span>
              </div>
              <p className="text-sm text-gray-600">{bmiStatus.recommendation}</p>
            </div>

            {/* مقياس BMI */}
            <div className="space-y-2">
              <div className="text-sm font-medium">مقياس مؤشر كتلة الجسم:</div>
              <div className="grid grid-cols-4 gap-1 h-3 rounded-full overflow-hidden">
                <div className="bg-blue-400"></div>
                <div className="bg-green-400"></div>
                <div className="bg-yellow-400"></div>
                <div className="bg-red-400"></div>
              </div>
              <div className="grid grid-cols-4 gap-1 text-xs text-center">
                <span>نقص</span>
                <span>طبيعي</span>
                <span>زيادة</span>
                <span>سمنة</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* تركيبة الجسم التفصيلية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* نسبة الدهون */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5 text-yellow-500" />
              نسبة الدهون
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-1">
                  {data.bodyFatPercentage.toFixed(1)}%
                </div>
                <Badge 
                  variant={fatStatus.color === 'green' ? 'default' : 'secondary'}
                >
                  {fatStatus.status}
                </Badge>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>نسبة الدهون</span>
                  <span>{data.bodyFatPercentage.toFixed(1)}%</span>
                </div>
                <Progress value={data.bodyFatPercentage} className="h-2" />
              </div>

              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="text-sm">
                  <strong>كتلة العضلات:</strong> {data.muscleMass.toFixed(1)} كغ
                </div>
                <div className="text-sm mt-1">
                  <strong>كتلة العظام:</strong> {data.boneMass.toFixed(1)} كغ
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* نسبة الماء */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Droplets className="h-5 w-5 text-blue-500" />
              نسبة الماء
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {data.waterPercentage.toFixed(1)}%
                </div>
                <Badge 
                  variant={waterStatus.color === 'green' ? 'default' : 'secondary'}
                >
                  {waterStatus.status}
                </Badge>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>نسبة الماء في الجسم</span>
                  <span>{data.waterPercentage.toFixed(1)}%</span>
                </div>
                <Progress value={data.waterPercentage} className="h-2" />
              </div>

              {waterStatus.color === 'red' && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">تحذير</span>
                  </div>
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    نسبة الماء منخفضة. يُنصح بشرب المزيد من الماء.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* الدهون الحشوية */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-red-500" />
            مستوى الدهون الحشوية
          </CardTitle>
          <CardDescription>
            الدهون المحيطة بالأعضاء الداخلية
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-1">
                {data.visceralFat}
              </div>
              <div className="text-sm text-gray-600 mb-2">مستوى الدهون الحشوية</div>
              <Badge 
                variant={visceralStatus.color === 'green' ? 'default' : 
                        visceralStatus.color === 'yellow' ? 'secondary' : 'destructive'}
              >
                {visceralStatus.status}
              </Badge>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>المستوى الحالي</span>
                <span>{data.visceralFat}/30</span>
              </div>
              <Progress value={(data.visceralFat / 30) * 100} className="h-2" />
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs text-center">
              <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                <div className="font-medium text-green-600">1-9</div>
                <div>طبيعي</div>
              </div>
              <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                <div className="font-medium text-yellow-600">10-14</div>
                <div>مرتفع قليلاً</div>
              </div>
              <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                <div className="font-medium text-red-600">15+</div>
                <div>مرتفع</div>
              </div>
            </div>

            {data.visceralFat >= 10 && (
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">توصية</span>
                </div>
                <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                  يُنصح بممارسة الرياضة بانتظام واتباع نظام غذائي صحي لتقليل الدهون الحشوية.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* مقارنة العمر الأيضي */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-purple-500" />
            العمر الأيضي
          </CardTitle>
          <CardDescription>
            مقارنة عمرك الأيضي مع عمرك الفعلي
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {data.metabolicAge}
              </div>
              <div className="text-sm text-gray-600">العمر الأيضي</div>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {userAge}
              </div>
              <div className="text-sm text-gray-600">العمر الفعلي</div>
            </div>
          </div>
          
          <div className="mt-4">
            {data.metabolicAge < userAge ? (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">ممتاز!</span>
                </div>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  عمرك الأيضي أصغر من عمرك الفعلي بـ {userAge - data.metabolicAge} سنة. 
                  هذا يدل على لياقة بدنية جيدة!
                </p>
              </div>
            ) : data.metabolicAge > userAge ? (
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">يحتاج تحسين</span>
                </div>
                <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                  عمرك الأيضي أكبر من عمرك الفعلي بـ {data.metabolicAge - userAge} سنة. 
                  يُنصح بزيادة النشاط البدني وتحسين النظام الغذائي.
                </p>
              </div>
            ) : (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <Info className="h-4 w-4" />
                  <span className="text-sm font-medium">متوازن</span>
                </div>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                  عمرك الأيضي يتطابق مع عمرك الفعلي. حافظ على نمط حياتك الصحي!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}