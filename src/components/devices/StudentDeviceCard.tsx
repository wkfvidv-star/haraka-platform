import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Watch,
  Wifi,
  WifiOff,
  Battery,
  Settings,
  Activity,
  Heart,
  Moon,
  Zap
} from 'lucide-react';

interface Device {
  id: string;
  name: string;
  isConnected: boolean;
  batteryLevel: number;
  lastSync: string;
  capabilities: string[];
}

interface StudentDeviceCardProps {
  device?: Device;
  onManageDevice: () => void;
}

export function StudentDeviceCard({ device, onManageDevice }: StudentDeviceCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const getBatteryColor = (level: number) => {
    if (level > 50) return 'text-green-600';
    if (level > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCapabilityIcon = (capability: string) => {
    switch (capability) {
      case 'steps': return <Activity className="h-4 w-4" />;
      case 'heart_rate': return <Heart className="h-4 w-4" />;
      case 'sleep': return <Moon className="h-4 w-4" />;
      case 'spo2': return <Zap className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getCapabilityName = (capability: string) => {
    switch (capability) {
      case 'steps': return 'عداد الخطوات';
      case 'heart_rate': return 'معدل ضربات القلب';
      case 'sleep': return 'مراقبة النوم';
      case 'spo2': return 'مستوى الأكسجين';
      default: return capability;
    }
  };

  return (
    <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Watch className="h-6 w-6" />
          حالة السوار الذكي
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            {device ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {device.isConnected ? (
                    <>
                      <Wifi className="h-5 w-5" />
                      <span>السوار: متصل</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="h-5 w-5" />
                      <span>السوار: غير متصل</span>
                    </>
                  )}
                </div>
                <div className="text-sm opacity-90">
                  <div className="flex items-center gap-2">
                    <Battery className={`h-4 w-4 ${getBatteryColor(device.batteryLevel)}`} />
                    <span>البطارية: {device.batteryLevel}%</span>
                  </div>
                </div>
              </div>
            ) : (
              <span>لا يوجد سوار مقترن</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onManageDevice}>
              إدارة السوار
            </Button>
            {device && (
              <Dialog open={showDetails} onOpenChange={setShowDetails}>
                <DialogTrigger asChild>
                  <Button variant="secondary" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>تفاصيل السوار</DialogTitle>
                    <DialogDescription>
                      معلومات شاملة عن السوار المقترن
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>اسم الجهاز:</span>
                      <span className="font-medium">{device.name}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>حالة الاتصال:</span>
                      <Badge variant={device.isConnected ? "default" : "secondary"}>
                        {device.isConnected ? 'متصل' : 'غير متصل'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>مستوى البطارية:</span>
                      <div className="flex items-center gap-2">
                        <Battery className={`h-4 w-4 ${getBatteryColor(device.batteryLevel)}`} />
                        <span>{device.batteryLevel}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>آخر تزامن:</span>
                      <span className="text-sm">{new Date(device.lastSync).toLocaleString('ar-SA')}</span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">القدرات المدعومة:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {device.capabilities.map(capability => (
                          <div key={capability} className="flex items-center gap-2 p-2 bg-white rounded">
                            {getCapabilityIcon(capability)}
                            <span className="text-sm">{getCapabilityName(capability)}</span>
                          </div>
                        ))}
                      </div>
                      {device.capabilities.length === 1 && (
                        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                          <p className="text-xs text-blue-800">
                            هذا السوار يدعم: {getCapabilityName(device.capabilities[0])} فقط
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}