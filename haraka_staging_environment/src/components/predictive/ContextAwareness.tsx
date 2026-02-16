import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { usePredictiveIntelligence } from '@/contexts/PredictiveIntelligenceContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  MapPin, 
  Clock, 
  Smartphone, 
  Monitor, 
  Tablet,
  Sun,
  Moon,
  CloudSun,
  Sunset,
  Battery,
  Wifi,
  TrendingUp,
  Eye,
  Lightbulb,
  RefreshCw
} from 'lucide-react';

export const ContextAwareness: React.FC = () => {
  const { 
    currentContext, 
    contextualInsights, 
    getContextualRecommendations,
    updateContext 
  } = usePredictiveIntelligence();
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      const recs = getContextualRecommendations(user.id);
      setRecommendations(recs);
    }
  }, [user, currentContext, getContextualRecommendations]);

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      case 'desktop': return <Monitor className="h-4 w-4" />;
      default: return <Smartphone className="h-4 w-4" />;
    }
  };

  const getTimeOfDayIcon = (timeOfDay: string) => {
    switch (timeOfDay) {
      case 'morning': return <Sun className="h-4 w-4 text-yellow-500" />;
      case 'afternoon': return <CloudSun className="h-4 w-4 text-orange-500" />;
      case 'evening': return <Sunset className="h-4 w-4 text-red-500" />;
      case 'night': return <Moon className="h-4 w-4 text-blue-500" />;
      default: return <Sun className="h-4 w-4" />;
    }
  };

  const getEnergyLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getFocusLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'medium': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'low': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTimeOfDayLabel = (timeOfDay: string) => {
    switch (timeOfDay) {
      case 'morning': return 'الصباح';
      case 'afternoon': return 'بعد الظهر';
      case 'evening': return 'المساء';
      case 'night': return 'الليل';
      default: return timeOfDay;
    }
  };

  const getDeviceLabel = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile': return 'هاتف محمول';
      case 'tablet': return 'جهاز لوحي';
      case 'desktop': return 'حاسوب مكتبي';
      default: return deviceType;
    }
  };

  const getEnergyLabel = (level: string) => {
    switch (level) {
      case 'high': return 'عالي';
      case 'medium': return 'متوسط';
      case 'low': return 'منخفض';
      default: return level;
    }
  };

  const handleRefreshContext = () => {
    const now = new Date();
    const hour = now.getHours();
    
    const getTimeOfDay = (hour: number): 'morning' | 'afternoon' | 'evening' | 'night' => {
      if (hour >= 6 && hour < 12) return 'morning';
      if (hour >= 12 && hour < 18) return 'afternoon';
      if (hour >= 18 && hour < 22) return 'evening';
      return 'night';
    };

    updateContext({
      timestamp: now,
      deviceType: window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop',
      timeContext: {
        hour,
        dayOfWeek: now.getDay(),
        isWeekend: now.getDay() === 0 || now.getDay() === 6,
        isHoliday: false,
        timeOfDay: getTimeOfDay(hour)
      },
      userState: {
        sessionDuration: currentContext?.userState.sessionDuration || 0,
        previousActivity: 'refresh',
        energyLevel: hour >= 9 && hour <= 15 ? 'high' : hour >= 16 && hour <= 20 ? 'medium' : 'low',
        focusLevel: hour >= 10 && hour <= 12 || hour >= 14 && hour <= 16 ? 'high' : 'medium'
      }
    });
  };

  if (!currentContext) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="text-center py-8">
            <Eye className="h-12 w-12 mx-auto mb-4 opacity-50 text-gray-500" />
            <p className="text-gray-500">جاري تحليل السياق...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">الوعي السياقي</h2>
          <p className="text-muted-foreground">تحليل السياق الذكي وتخصيص التجربة</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefreshContext}>
          <RefreshCw className="h-4 w-4 mr-2" />
          تحديث السياق
        </Button>
      </div>

      {/* Current Context Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4" />
              السياق الزمني
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {getTimeOfDayIcon(currentContext.timeContext.timeOfDay)}
                <span className="text-sm font-medium">
                  {getTimeOfDayLabel(currentContext.timeContext.timeOfDay)}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                <p>الساعة: {currentContext.timeContext.hour}:00</p>
                <p>
                  {currentContext.timeContext.isWeekend ? 'عطلة نهاية الأسبوع' : 'يوم عمل'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              {getDeviceIcon(currentContext.deviceType)}
              نوع الجهاز
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Badge variant="outline" className="w-full justify-center">
                {getDeviceLabel(currentContext.deviceType)}
              </Badge>
              <div className="text-xs text-muted-foreground">
                <p>محسّن للـ{getDeviceLabel(currentContext.deviceType)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Battery className="h-4 w-4" />
              مستوى الطاقة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Badge className={getEnergyLevelColor(currentContext.userState.energyLevel)}>
                {getEnergyLabel(currentContext.userState.energyLevel)}
              </Badge>
              <div className="text-xs text-muted-foreground">
                <p>التركيز: {getEnergyLabel(currentContext.userState.focusLevel)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              الموقع
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm font-medium">
                {currentContext.location.province}
              </div>
              {currentContext.location.institution && (
                <div className="text-xs text-muted-foreground">
                  {currentContext.location.institution}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contextual Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              الرؤى السياقية
            </CardTitle>
            <CardDescription>
              تحليل ذكي للظروف الحالية
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {contextualInsights.length > 0 ? (
                contextualInsights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-800">{insight}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">لا توجد رؤى سياقية حالياً</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              التوصيات المخصصة
            </CardTitle>
            <CardDescription>
              اقتراحات مبنية على السياق الحالي
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations.length > 0 ? (
                recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <Eye className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-green-800">{recommendation}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">لا توجد توصيات حالياً</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Context Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            الجدول الزمني للسياق
          </CardTitle>
          <CardDescription>
            تطور السياق خلال الجلسة الحالية
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">بداية الجلسة</p>
                  <p className="text-xs text-muted-foreground">
                    {currentContext.timestamp.toLocaleTimeString('ar-SA')}
                  </p>
                </div>
              </div>
              <Badge variant="outline">
                {getDeviceLabel(currentContext.deviceType)}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">تحليل السياق</p>
                  <p className="text-xs text-muted-foreground">
                    مستوى الطاقة: {getEnergyLabel(currentContext.userState.energyLevel)}
                  </p>
                </div>
              </div>
              <Badge className={getEnergyLevelColor(currentContext.userState.energyLevel)}>
                {getEnergyLabel(currentContext.userState.energyLevel)}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">تخصيص التجربة</p>
                  <p className="text-xs text-muted-foreground">
                    تم تحسين المحتوى للسياق الحالي
                  </p>
                </div>
              </div>
              <Badge variant="outline">
                {contextualInsights.length} رؤية
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Environmental Factors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5" />
            العوامل البيئية
          </CardTitle>
          <CardDescription>
            تأثير البيئة على التجربة التعليمية
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-lg font-bold text-blue-600 mb-1">
                {currentContext.environmentalFactors.seasonality === 'spring' ? 'الربيع' :
                 currentContext.environmentalFactors.seasonality === 'summer' ? 'الصيف' :
                 currentContext.environmentalFactors.seasonality === 'autumn' ? 'الخريف' : 'الشتاء'}
              </div>
              <div className="text-sm text-muted-foreground">الموسم الحالي</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-lg font-bold text-green-600 mb-1">
                {currentContext.timeContext.isWeekend ? 'عطلة' : 'يوم دراسي'}
              </div>
              <div className="text-sm text-muted-foreground">نوع اليوم</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-lg font-bold text-purple-600 mb-1">
                {Math.floor(currentContext.userState.sessionDuration / 60000) || 0} دقيقة
              </div>
              <div className="text-sm text-muted-foreground">مدة الجلسة</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContextAwareness;