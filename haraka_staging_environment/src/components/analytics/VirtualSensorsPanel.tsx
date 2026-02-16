import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAIAnalytics } from '@/contexts/AIAnalyticsContext';
import { 
  Thermometer, 
  Activity, 
  Brain, 
  Users, 
  BookOpen, 
  TrendingUp,
  Settings,
  Wifi,
  WifiOff,
  RefreshCw
} from 'lucide-react';

interface SensorConfig {
  type: 'engagement' | 'performance' | 'behavior' | 'learning' | 'social';
  name: string;
  icon: React.ReactNode;
  description: string;
  thresholds: {
    green: number;
    yellow: number;
  };
}

interface SensorData {
  current: number;
  status: 'green' | 'yellow' | 'red';
  trend: number;
  lastUpdate: Date | null;
  count: number;
}

const sensorConfigs: SensorConfig[] = [
  {
    type: 'engagement',
    name: 'مستشعر التفاعل',
    icon: <Activity className="h-4 w-4" />,
    description: 'يقيس مستوى تفاعل المستخدم مع المحتوى',
    thresholds: { green: 70, yellow: 40 }
  },
  {
    type: 'performance',
    name: 'مستشعر الأداء',
    icon: <TrendingUp className="h-4 w-4" />,
    description: 'يراقب أداء المستخدم في التمارين والأنشطة',
    thresholds: { green: 80, yellow: 60 }
  },
  {
    type: 'behavior',
    name: 'مستشعر السلوك',
    icon: <Brain className="h-4 w-4" />,
    description: 'يحلل أنماط سلوك المستخدم وعاداته',
    thresholds: { green: 75, yellow: 50 }
  },
  {
    type: 'learning',
    name: 'مستشعر التعلم',
    icon: <BookOpen className="h-4 w-4" />,
    description: 'يتتبع تقدم المستخدم في التعلم',
    thresholds: { green: 70, yellow: 50 }
  },
  {
    type: 'social',
    name: 'مستشعر التفاعل الاجتماعي',
    icon: <Users className="h-4 w-4" />,
    description: 'يقيس التفاعل الاجتماعي والتعاوني',
    thresholds: { green: 65, yellow: 35 }
  }
];

export const VirtualSensorsPanel: React.FC = () => {
  const { virtualSensors, updateVirtualSensor, isTracking } = useAIAnalytics();
  const [sensorData, setSensorData] = useState<Record<string, SensorData>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Calculate sensor statistics
  useEffect(() => {
    const now = new Date();
    const last30Minutes = new Date(now.getTime() - 30 * 60 * 1000);
    
    const recentSensors = virtualSensors.filter(s => new Date(s.timestamp) > last30Minutes);
    
    const sensorStats = sensorConfigs.reduce((acc, config) => {
      const typeSensors = recentSensors.filter(s => s.type === config.type);
      
      if (typeSensors.length > 0) {
        const avgValue = typeSensors.reduce((sum, s) => sum + s.value, 0) / typeSensors.length;
        const latestSensor = typeSensors[typeSensors.length - 1];
        
        acc[config.type] = {
          current: avgValue,
          status: avgValue > config.thresholds.green ? 'green' : 
                 avgValue > config.thresholds.yellow ? 'yellow' : 'red',
          trend: typeSensors.length > 1 ? 
                (typeSensors[typeSensors.length - 1].value - typeSensors[0].value) : 0,
          lastUpdate: latestSensor.timestamp,
          count: typeSensors.length
        };
      } else {
        acc[config.type] = {
          current: 0,
          status: 'red' as const,
          trend: 0,
          lastUpdate: null,
          count: 0
        };
      }
      
      return acc;
    }, {} as Record<string, SensorData>);
    
    setSensorData(sensorStats);
  }, [virtualSensors]);

  const handleRefreshSensors = async () => {
    setIsRefreshing(true);
    
    // Simulate sensor refresh with random data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    sensorConfigs.forEach(config => {
      const randomValue = Math.random() * 100;
      updateVirtualSensor({
        type: config.type,
        value: randomValue,
        status: randomValue > config.thresholds.green ? 'green' : 
               randomValue > config.thresholds.yellow ? 'yellow' : 'red',
        userId: 'system',
        context: 'manual_refresh'
      });
    });
    
    setIsRefreshing(false);
  };

  const getStatusColor = (status: 'green' | 'yellow' | 'red') => {
    switch (status) {
      case 'green': return 'text-green-600 bg-green-50 border-green-200';
      case 'yellow': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'red': return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 5) return <TrendingUp className="h-3 w-3 text-green-500" />;
    if (trend < -5) return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />;
    return <div className="h-3 w-3 rounded-full bg-gray-300"></div>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">أجهزة الاستشعار الافتراضية</h2>
          <p className="text-muted-foreground">نظام مراقبة السلوك الرقمي المتقدم</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefreshSensors}
            disabled={isRefreshing || !isTracking}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
          <div className="flex items-center gap-2">
            {isTracking ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
            <span className="text-sm text-muted-foreground">
              {isTracking ? 'متصل' : 'غير متصل'}
            </span>
          </div>
        </div>
      </div>

      {/* Sensors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sensorConfigs.map((config) => {
          const data = sensorData[config.type];
          
          return (
            <Card key={config.type} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {config.icon}
                    <CardTitle className="text-sm">{config.name}</CardTitle>
                  </div>
                  {data && (
                    <Badge 
                      variant="outline" 
                      className={getStatusColor(data.status)}
                    >
                      {data.status === 'green' ? 'ممتاز' : 
                       data.status === 'yellow' ? 'جيد' : 'يحتاج تحسين'}
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-xs">
                  {config.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {data ? (
                  <div className="space-y-3">
                    {/* Current Value */}
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">
                        {data.current.toFixed(0)}%
                      </span>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(data.trend)}
                        <span className="text-xs text-muted-foreground">
                          {data.trend > 0 ? '+' : ''}{data.trend.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <Progress 
                      value={data.current} 
                      className={`h-2 ${
                        data.status === 'green' ? '[&>div]:bg-green-500' :
                        data.status === 'yellow' ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'
                      }`}
                    />
                    
                    {/* Thresholds */}
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>أحمر: &lt;{config.thresholds.yellow}</span>
                      <span>أصفر: {config.thresholds.yellow}-{config.thresholds.green}</span>
                      <span>أخضر: &gt;{config.thresholds.green}</span>
                    </div>
                    
                    {/* Last Update */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        آخر تحديث: {data.lastUpdate ? 
                          new Date(data.lastUpdate).toLocaleTimeString('ar-SA') : 
                          'لا يوجد'}
                      </span>
                      <span className="text-muted-foreground">
                        {data.count} قراءة
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Thermometer className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-50" />
                    <p className="text-sm text-muted-foreground">لا توجد بيانات</p>
                  </div>
                )}
              </CardContent>
              
              {/* Status Indicator */}
              <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
                data?.status === 'green' ? 'bg-green-500' :
                data?.status === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
              } ${isTracking ? 'animate-pulse' : ''}`}></div>
            </Card>
          );
        })}
      </div>

      {/* Sensor Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            إعدادات أجهزة الاستشعار
          </CardTitle>
          <CardDescription>
            تكوين عتبات التنبيه وإعدادات المراقبة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">إعدادات التنبيه</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>أخضر: أداء ممتاز - لا حاجة لتدخل</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>أصفر: أداء جيد - مراقبة مستمرة</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>أحمر: يحتاج تحسين - تدخل مطلوب</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">إحصائيات النظام</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div>إجمالي القراءات: {virtualSensors.length}</div>
                <div>أجهزة الاستشعار النشطة: {sensorConfigs.length}</div>
                <div>معدل التحديث: كل 5 ثوانٍ</div>
                <div>حالة النظام: {isTracking ? 'نشط' : 'متوقف'}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VirtualSensorsPanel;