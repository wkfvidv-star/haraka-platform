import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Bluetooth, 
  Watch, 
  Smartphone, 
  Wifi, 
  Battery,
  CheckCircle,
  AlertCircle,
  Search,
  RefreshCw
} from 'lucide-react';

interface Device {
  id: string;
  name: string;
  type: 'smartwatch' | 'fitness_band' | 'smartphone';
  batteryLevel: number;
  isConnected: boolean;
  signalStrength: number;
}

export function WearableConnection() {
  const [isScanning, setIsScanning] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [availableDevices, setAvailableDevices] = useState<Device[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');

  // محاكاة البحث عن الأجهزة
  const scanForDevices = () => {
    setIsScanning(true);
    setTimeout(() => {
      const mockDevices: Device[] = [
        {
          id: '1',
          name: 'Mi Band 7',
          type: 'fitness_band',
          batteryLevel: 85,
          isConnected: false,
          signalStrength: 90
        },
        {
          id: '2',
          name: 'Galaxy Watch 5',
          type: 'smartwatch',
          batteryLevel: 65,
          isConnected: false,
          signalStrength: 75
        },
        {
          id: '3',
          name: 'Apple Watch Series 8',
          type: 'smartwatch',
          batteryLevel: 92,
          isConnected: false,
          signalStrength: 95
        }
      ];
      setAvailableDevices(mockDevices);
      setIsScanning(false);
    }, 3000);
  };

  // محاكاة الاتصال بالجهاز
  const connectToDevice = (device: Device) => {
    setConnectionStatus('connecting');
    setTimeout(() => {
      setConnectedDevice({ ...device, isConnected: true });
      setConnectionStatus('connected');
      setAvailableDevices([]);
    }, 2000);
  };

  // قطع الاتصال
  const disconnectDevice = () => {
    setConnectedDevice(null);
    setConnectionStatus('disconnected');
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'smartwatch':
        return Watch;
      case 'fitness_band':
        return Watch;
      case 'smartphone':
        return Smartphone;
      default:
        return Watch;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bluetooth className="h-5 w-5 text-blue-500" />
          ربط السوار الذكي
        </CardTitle>
        <CardDescription>
          اربط سوارك الذكي لتتبع نشاطك اليومي وصحتك
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* حالة الاتصال */}
        {connectedDevice ? (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {React.createElement(getDeviceIcon(connectedDevice.type), {
                  className: "h-6 w-6 text-green-600"
                })}
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-200">
                    {connectedDevice.name}
                  </h4>
                  <p className="text-sm text-green-600 dark:text-green-400">متصل</p>
                </div>
              </div>
              <Badge className="bg-green-500">
                <CheckCircle className="h-3 w-3 mr-1" />
                متصل
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Battery className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">البطارية</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={connectedDevice.batteryLevel} className="flex-1 h-2" />
                  <span className="text-sm font-medium">{connectedDevice.batteryLevel}%</span>
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Wifi className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">قوة الإشارة</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={connectedDevice.signalStrength} className="flex-1 h-2" />
                  <span className="text-sm font-medium">{connectedDevice.signalStrength}%</span>
                </div>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={disconnectDevice}
              className="w-full"
            >
              قطع الاتصال
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* حالة عدم الاتصال */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
              <Bluetooth className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <h4 className="font-medium mb-1">لا يوجد جهاز متصل</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ابحث عن الأجهزة القريبة للاتصال
              </p>
            </div>

            {/* زر البحث */}
            <Button 
              onClick={scanForDevices} 
              disabled={isScanning}
              className="w-full"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  جاري البحث...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  البحث عن الأجهزة
                </>
              )}
            </Button>

            {/* قائمة الأجهزة المتاحة */}
            {availableDevices.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">الأجهزة المتاحة:</h4>
                {availableDevices.map((device) => {
                  const DeviceIcon = getDeviceIcon(device.type);
                  return (
                    <div 
                      key={device.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <DeviceIcon className="h-5 w-5 text-blue-500" />
                        <div>
                          <h5 className="font-medium text-sm">{device.name}</h5>
                          <p className="text-xs text-gray-500">
                            البطارية: {device.batteryLevel}%
                          </p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => connectToDevice(device)}
                        disabled={connectionStatus === 'connecting'}
                      >
                        {connectionStatus === 'connecting' ? 'جاري الاتصال...' : 'اتصال'}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* حالة الاتصال */}
        {connectionStatus === 'connecting' && (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin text-yellow-600" />
              <span className="text-sm text-yellow-800 dark:text-yellow-200">
                جاري الاتصال بالجهاز...
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}