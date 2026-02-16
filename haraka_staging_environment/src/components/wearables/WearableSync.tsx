
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  Heart, 
  Bluetooth, 
  Wifi, 
  Battery, 
  Smartphone,
  Watch,
  CheckCircle,
  AlertCircle,
  Loader2,
  Zap,
  Moon,
  Footprints
} from 'lucide-react';

interface WearableDevice {
  id: string;
  name: string;
  type: 'smartwatch' | 'fitness_band' | 'heart_monitor';
  brand: string;
  model: string;
  batteryLevel: number;
  isConnected: boolean;
  lastSync: Date;
  features: string[];
}

interface HealthData {
  steps: number;
  heartRate: number;
  calories: number;
  distance: number;
  sleepHours: number;
  activeMinutes: number;
}

export const WearableSync: React.FC = () => {
  const [devices, setDevices] = useState<WearableDevice[]>([
    {
      id: '1',
      name: 'Mi Band 7',
      type: 'fitness_band',
      brand: 'Xiaomi',
      model: 'Mi Band 7',
      batteryLevel: 85,
      isConnected: true,
      lastSync: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      features: ['heart_rate', 'steps', 'sleep', 'calories', 'distance']
    }
  ]);

  const [isScanning, setIsScanning] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [healthData, setHealthData] = useState<HealthData>({
    steps: 8543,
    heartRate: 78,
    calories: 320,
    distance: 6.2,
    sleepHours: 7.5,
    activeMinutes: 45
  });

  const [syncProgress, setSyncProgress] = useState(0);

  const scanForDevices = async () => {
    setIsScanning(true);
    // محاكاة البحث عن الأجهزة
    setTimeout(() => {
      setIsScanning(false);
      // يمكن إضافة أجهزة جديدة هنا
    }, 3000);
  };

  const syncDevice = async (deviceId: string) => {
    setIsSyncing(true);
    setSyncProgress(0);
    
    // محاكاة عملية المزامنة
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSyncing(false);
          // تحديث وقت آخر مزامنة
          setDevices(prevDevices => 
            prevDevices.map(device => 
              device.id === deviceId 
                ? { ...device, lastSync: new Date() }
                : device
            )
          );
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'smartwatch': return Watch;
      case 'fitness_band': return Activity;
      case 'heart_monitor': return Heart;
      default: return Activity;
    }
  };

  const getBatteryColor = (level: number) => {
    if (level > 50) return 'text-green-600';
    if (level > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConnectionStatus = (device: WearableDevice) => {
    if (device.isConnected) {
      const timeSinceSync = Date.now() - device.lastSync.getTime();
      const minutesAgo = Math.floor(timeSinceSync / (1000 * 60));
      
      if (minutesAgo < 5) {
        return { status: 'excellent', text: 'متصل - مزامنة حديثة', color: 'text-green-600' };
      } else if (minutesAgo < 30) {
        return { status: 'good', text: `متصل - آخر مزامنة منذ ${minutesAgo} دقيقة`, color: 'text-blue-600' };
      } else {
        return { status: 'warning', text: 'متصل - يحتاج مزامنة', color: 'text-yellow-600' };
      }
    }
    return { status: 'disconnected', text: 'غير متصل', color: 'text-red-600' };
  };

  return (
    <div className="space-y-6">
      {/* عنوان الوحدة */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-2">⌚ تكامل الأساور الذكية</h2>
        <p className="text-muted-foreground">اربط أجهزتك الذكية وتتبع بياناتك الصحية في الوقت الفعلي</p>
      </div>

      {/* الأجهزة المتصلة */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bluetooth className="w-5 h-5 text-primary" />
                الأجهزة المتصلة
              </CardTitle>
              <CardDescription>إدارة ومزامنة أجهزتك الذكية</CardDescription>
            </div>
            <Button 
              variant="outline" 
              onClick={scanForDevices}
              disabled={isScanning}
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  جاري البحث...
                </>
              ) : (
                <>
                  <Bluetooth className="w-4 h-4 mr-2" />
                  البحث عن أجهزة
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {devices.map((device) => {
              const DeviceIcon = getDeviceIcon(device.type);
              const connectionStatus = getConnectionStatus(device);
              
              return (
                <div key={device.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <DeviceIcon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{device.name}</h4>
                        <p className="text-sm text-muted-foreground">{device.brand} {device.model}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className={`text-xs ${connectionStatus.color}`}>
                            {connectionStatus.text}
                          </span>
                          <div className="flex items-center gap-1">
                            <Battery className={`w-3 h-3 ${getBatteryColor(device.batteryLevel)}`} />
                            <span className="text-xs">{device.batteryLevel}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {device.isConnected && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => syncDevice(device.id)}
                          disabled={isSyncing}
                        >
                          {isSyncing ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                              مزامنة...
                            </>
                          ) : (
                            <>
                              <Zap className="w-4 h-4 mr-1" />
                              مزامنة
                            </>
                          )}
                        </Button>
                      )}
                      <div className={`w-3 h-3 rounded-full ${device.isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    </div>
                  </div>
                  
                  {/* شريط تقدم المزامنة */}
                  {isSyncing && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">جاري المزامنة...</span>
                        <span className="text-sm font-medium">{syncProgress}%</span>
                      </div>
                      <Progress value={syncProgress} className="h-2" />
                    </div>
                  )}
                  
                  {/* ميزات الجهاز */}
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-2">
                      {device.features.map((feature) => {
                        const featureLabels = {
                          heart_rate: 'معدل النبض',
                          steps: 'الخطوات',
                          sleep: 'النوم',
                          calories: 'السعرات',
                          distance: 'المسافة'
                        };
                        return (
                          <Badge key={feature} variant="outline" className="text-xs">
                            {featureLabels[feature as keyof typeof featureLabels] || feature}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* البيانات المزامنة */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-secondary" />
            البيانات المزامنة اليوم
          </CardTitle>
          <CardDescription>آخر البيانات المستلمة من أجهزتك</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <Footprints className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">{healthData.steps.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">خطوة</div>
            </div>
            
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <Heart className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">{healthData.heartRate}</div>
              <div className="text-sm text-muted-foreground">نبضة/دقيقة</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <Zap className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">{healthData.calories}</div>
              <div className="text-sm text-muted-foreground">سعرة حرارية</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{healthData.distance}</div>
              <div className="text-sm text-muted-foreground">كم</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Moon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{healthData.sleepHours}</div>
              <div className="text-sm text-muted-foreground">ساعات نوم</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{healthData.activeMinutes}</div>
              <div className="text-sm text-muted-foreground">دقيقة نشاط</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* تنبيهات وإرشادات */}
      <div className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            تأكد من أن جهازك يدعم تقنية Bluetooth 4.0 أو أحدث للحصول على أفضل تجربة مزامنة.
          </AlertDescription>
        </Alert>
        
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            يتم حفظ جميع بياناتك بشكل آمن ومشفر. يمكنك الوصول إلى سجل البيانات الكامل في أي وقت.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default WearableSync;