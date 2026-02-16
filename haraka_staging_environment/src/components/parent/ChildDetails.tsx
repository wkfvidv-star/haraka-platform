import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DailyActivity } from '@/components/health/DailyActivity';
import { HealthMetrics } from '@/components/health/HealthMetrics';
import { BodyAnalysis } from '@/components/health/BodyAnalysis';
import { ProfessionalProgress } from '@/components/student/ProfessionalProgress';
import { 
  ArrowLeft,
  Activity, 
  Heart, 
  BarChart3, 
  Target,
  TrendingUp,
  Lightbulb,
  ShoppingBag,
  User,
  Calendar,
  AlertCircle,
  CheckCircle,
  Settings,
  Download,
  Share2,
  Bell
} from 'lucide-react';

interface ChildDetailsProps {
  childId: string;
  onBack: () => void;
}

// Mock data - in real app, this would come from props or API
const getChildData = (childId: string) => {
  const childrenData = {
    'student_1': {
      id: 'student_1',
      name: 'أحمد محمد علي',
      age: 14,
      grade: 'السنة الثالثة متوسط',
      school: 'متوسطة الشهيد محمد بوضياف',
      deviceCapabilities: {
        hasWearable: true,
        hasBIA: true,
        hasHeartRate: true,
        hasGPS: true,
        hasAdvancedMetrics: true
      },
      activityData: {
        steps: 8543,
        stepsGoal: 10000,
        distance: 6.2,
        calories: 320,
        heartRate: {
          current: 78,
          min: 65,
          max: 145,
          avg: 85
        },
        activeTime: 180,
        sedentaryTime: 420
      },
      healthData: {
        heartRate: {
          min: 65,
          max: 145,
          avg: 85,
          restingHR: 72
        },
        sleep: {
          totalSleep: 480,
          deepSleep: 120,
          lightSleep: 240,
          remSleep: 120,
          sleepQuality: 85
        },
        oxygenSaturation: 98,
        bloodPressure: {
          systolic: 110,
          diastolic: 70
        }
      },
      bodyData: {
        bodyFatPercentage: 15.2,
        muscleMass: 28.5,
        waterPercentage: 62.3,
        bmi: 19.8,
        weight: 45,
        height: 150,
        visceralFat: 3,
        boneMass: 2.1,
        metabolicAge: 12
      }
    },
    'student_2': {
      id: 'student_2',
      name: 'فاطمة الزهراء',
      age: 16,
      grade: 'السنة الثانية ثانوي',
      school: 'ثانوية عبد الحميد بن باديس',
      deviceCapabilities: {
        hasWearable: true,
        hasBIA: false,
        hasHeartRate: true,
        hasGPS: false,
        hasAdvancedMetrics: false
      },
      activityData: {
        steps: 9200,
        stepsGoal: 10000,
        distance: 7.1,
        calories: 380,
        heartRate: {
          current: 72,
          min: 62,
          max: 140,
          avg: 80
        },
        activeTime: 210,
        sedentaryTime: 390
      },
      healthData: {
        heartRate: {
          min: 62,
          max: 140,
          avg: 80,
          restingHR: 68
        },
        sleep: {
          totalSleep: 420,
          deepSleep: 100,
          lightSleep: 220,
          remSleep: 100,
          sleepQuality: 78
        },
        oxygenSaturation: 97,
        bloodPressure: {
          systolic: 105,
          diastolic: 68
        }
      },
      bodyData: null // No BIA capability
    },
    'student_3': {
      id: 'student_3',
      name: 'يوسف أحمد',
      age: 12,
      grade: 'السنة الأولى متوسط',
      school: 'متوسطة الإمام مالك',
      deviceCapabilities: {
        hasWearable: false,
        hasBIA: false,
        hasHeartRate: false,
        hasGPS: false,
        hasAdvancedMetrics: false
      },
      activityData: null,
      healthData: null,
      bodyData: null
    }
  };

  return childrenData[childId as keyof typeof childrenData] || null;
};

export function ChildDetails({ childId, onBack }: ChildDetailsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const childData = getChildData(childId);

  if (!childData) {
    return (
      <div className="text-center p-8">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">لم يتم العثور على بيانات الطفل</h3>
        <Button onClick={onBack}>العودة للقائمة</Button>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Child Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">{childData.name}</CardTitle>
                <CardDescription>
                  {childData.age} سنة - {childData.grade}
                </CardDescription>
                <Badge variant="outline" className="mt-1">
                  {childData.school}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Settings className="h-4 w-4 mr-1" />
                إعدادات
              </Button>
              <Button size="sm" variant="outline">
                <Share2 className="h-4 w-4 mr-1" />
                مشاركة
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Device Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            حالة الأجهزة المتصلة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`p-4 rounded-lg text-center ${
              childData.deviceCapabilities.hasWearable 
                ? 'bg-green-50 dark:bg-green-900/20' 
                : 'bg-red-50 dark:bg-red-900/20'
            }`}>
              {childData.deviceCapabilities.hasWearable ? (
                <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
              ) : (
                <AlertCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
              )}
              <div className="font-medium">السوار الذكي</div>
              <div className="text-xs text-gray-500">
                {childData.deviceCapabilities.hasWearable ? 'متصل' : 'غير متصل'}
              </div>
            </div>

            <div className={`p-4 rounded-lg text-center ${
              childData.deviceCapabilities.hasBIA 
                ? 'bg-green-50 dark:bg-green-900/20' 
                : 'bg-gray-50 dark:bg-gray-800'
            }`}>
              {childData.deviceCapabilities.hasBIA ? (
                <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
              ) : (
                <AlertCircle className="h-6 w-6 text-gray-400 mx-auto mb-2" />
              )}
              <div className="font-medium">تحليل الجسم</div>
              <div className="text-xs text-gray-500">
                {childData.deviceCapabilities.hasBIA ? 'متاح' : 'غير متاح'}
              </div>
            </div>

            <div className={`p-4 rounded-lg text-center ${
              childData.deviceCapabilities.hasHeartRate 
                ? 'bg-green-50 dark:bg-green-900/20' 
                : 'bg-gray-50 dark:bg-gray-800'
            }`}>
              {childData.deviceCapabilities.hasHeartRate ? (
                <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
              ) : (
                <AlertCircle className="h-6 w-6 text-gray-400 mx-auto mb-2" />
              )}
              <div className="font-medium">معدل النبض</div>
              <div className="text-xs text-gray-500">
                {childData.deviceCapabilities.hasHeartRate ? 'متاح' : 'غير متاح'}
              </div>
            </div>

            <div className={`p-4 rounded-lg text-center ${
              childData.deviceCapabilities.hasGPS 
                ? 'bg-green-50 dark:bg-green-900/20' 
                : 'bg-gray-50 dark:bg-gray-800'
            }`}>
              {childData.deviceCapabilities.hasGPS ? (
                <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
              ) : (
                <AlertCircle className="h-6 w-6 text-gray-400 mx-auto mb-2" />
              )}
              <div className="font-medium">تتبع الموقع</div>
              <div className="text-xs text-gray-500">
                {childData.deviceCapabilities.hasGPS ? 'متاح' : 'غير متاح'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button 
          variant="outline" 
          className="h-20 flex-col gap-2"
          onClick={() => setActiveTab('activity')}
          disabled={!childData.activityData}
        >
          <Activity className="h-6 w-6" />
          النشاط اليومي
        </Button>
        <Button 
          variant="outline" 
          className="h-20 flex-col gap-2"
          onClick={() => setActiveTab('health')}
          disabled={!childData.healthData}
        >
          <Heart className="h-6 w-6" />
          الصحة
        </Button>
        <Button 
          variant="outline" 
          className="h-20 flex-col gap-2"
          onClick={() => setActiveTab('body')}
          disabled={!childData.bodyData}
        >
          <BarChart3 className="h-6 w-6" />
          تحليل الجسم
        </Button>
        <Button 
          variant="outline" 
          className="h-20 flex-col gap-2"
          onClick={() => setActiveTab('progress')}
        >
          <TrendingUp className="h-6 w-6" />
          التقدم
        </Button>
      </div>

      {/* Recent Activity Summary */}
      {childData.activityData && (
        <Card>
          <CardHeader>
            <CardTitle>ملخص النشاط اليوم</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {childData.activityData.steps.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">خطوات</div>
                <Progress 
                  value={(childData.activityData.steps / childData.activityData.stepsGoal) * 100} 
                  className="h-2 mt-2"
                />
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {childData.activityData.calories}
                </div>
                <div className="text-sm text-gray-500">سعرة حرارية</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {childData.activityData.distance} كم
                </div>
                <div className="text-sm text-gray-500">مسافة</div>
              </div>
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {childData.activityData.heartRate?.current || '--'}
                </div>
                <div className="text-sm text-gray-500">نبضة/دقيقة</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderRecommendations = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            التوصيات الشخصية لـ {childData.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-medium text-green-800 dark:text-green-200 mb-3">
                🥗 التوصيات الغذائية
              </h4>
              <ul className="text-sm text-green-700 dark:text-green-300 space-y-2">
                <li>• زيادة شرب الماء إلى 8 أكواب يومياً</li>
                <li>• تناول 5 حصص من الخضار والفواكه</li>
                <li>• تقليل السكريات والمشروبات الغازية</li>
                <li>• إضافة البروتين لكل وجبة</li>
              </ul>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-3">
                🏃‍♂️ التوصيات الرياضية
              </h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
                <li>• ممارسة الرياضة 45 دقيقة يومياً</li>
                <li>• المشي 10000 خطوة على الأقل</li>
                <li>• تمارين القوة 3 مرات أسبوعياً</li>
                <li>• أخذ فترات راحة كل ساعة</li>
              </ul>
            </div>
            
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-3">
                😴 توصيات النوم
              </h4>
              <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-2">
                <li>• النوم 8-9 ساعات يومياً</li>
                <li>• تجنب الشاشات قبل النوم بساعة</li>
                <li>• الحفاظ على مواعيد نوم ثابتة</li>
                <li>• غرفة نوم هادئة ومظلمة</li>
              </ul>
            </div>
            
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-3">
                📚 توصيات الدراسة
              </h4>
              <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-2">
                <li>• فترات دراسة قصيرة ومتكررة</li>
                <li>• ممارسة الرياضة قبل الدراسة</li>
                <li>• تنظيم الوقت بين الدراسة والراحة</li>
                <li>• بيئة دراسة هادئة ومنظمة</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStore = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-purple-500" />
            متجر الأجهزة والإكسسوارات
          </CardTitle>
          <CardDescription>
            أجهزة ومعدات مناسبة لعمر {childData.name} ({childData.age} سنة)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4 text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Activity className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="font-medium mb-2">Mi Band 7 للأطفال</h4>
                <p className="text-sm text-gray-500 mb-3">سوار ذكي مصمم خصيصاً للأطفال</p>
                <div className="text-lg font-bold text-blue-600 mb-3">2,200 دج</div>
                <div className="flex flex-col gap-2">
                  <Button size="sm" className="w-full">
                    شراء الآن
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    إضافة للسلة
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4 text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="font-medium mb-2">جهاز قياس الضغط</h4>
                <p className="text-sm text-gray-500 mb-3">مناسب للاستخدام المنزلي</p>
                <div className="text-lg font-bold text-green-600 mb-3">1,800 دج</div>
                <div className="flex flex-col gap-2">
                  <Button size="sm" className="w-full">
                    شراء الآن
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    إضافة للسلة
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4 text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="font-medium mb-2">ميزان ذكي للجسم</h4>
                <p className="text-sm text-gray-500 mb-3">تحليل شامل لتركيبة الجسم</p>
                <div className="text-lg font-bold text-purple-600 mb-3">3,500 دج</div>
                <div className="flex flex-col gap-2">
                  <Button size="sm" className="w-full">
                    شراء الآن
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    إضافة للسلة
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              العودة للقائمة
            </Button>
            <div className="flex-1">
              <CardTitle className="text-xl">تفاصيل {childData.name}</CardTitle>
              <CardDescription>
                متابعة شاملة للنشاط الرياضي والصحي
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-1" />
                تصدير التقرير
              </Button>
              <Button size="sm" variant="outline">
                <Bell className="h-4 w-4 mr-1" />
                الإشعارات
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="activity" disabled={!childData.activityData}>
            النشاط اليومي
          </TabsTrigger>
          <TabsTrigger value="health" disabled={!childData.healthData}>
            الصحة
          </TabsTrigger>
          <TabsTrigger value="body" disabled={!childData.bodyData}>
            تحليل الجسم
          </TabsTrigger>
          <TabsTrigger value="progress">التقدم</TabsTrigger>
          <TabsTrigger value="recommendations">التوصيات</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {renderOverview()}
        </TabsContent>

        <TabsContent value="activity">
          {childData.activityData ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  النشاط اليومي لـ {childData.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DailyActivity data={childData.activityData} />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center p-8">
                <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">لا توجد بيانات نشاط</h3>
                <p className="text-gray-500">يحتاج الطفل لجهاز متصل لعرض بيانات النشاط</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="health">
          {childData.healthData ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  المؤشرات الصحية لـ {childData.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <HealthMetrics data={childData.healthData} />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center p-8">
                <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">لا توجد بيانات صحية</h3>
                <p className="text-gray-500">يحتاج الطفل لجهاز متصل لعرض البيانات الصحية</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="body">
          {childData.bodyData ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-500" />
                  تحليل الجسم لـ {childData.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BodyAnalysis 
                  data={childData.bodyData} 
                  userAge={childData.age} 
                  userGender="male" 
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center p-8">
                <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">تحليل الجسم غير متاح</h3>
                <p className="text-gray-500">يحتاج الطفل لميزان ذكي مع تقنية BIA</p>
                <Button className="mt-4" onClick={() => setActiveTab('store')}>
                  تسوق الأجهزة المناسبة
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="progress">
          <ProfessionalProgress />
        </TabsContent>

        <TabsContent value="recommendations">
          {renderRecommendations()}
        </TabsContent>

        <TabsContent value="store">
          {renderStore()}
        </TabsContent>
      </Tabs>
    </div>
  );
}