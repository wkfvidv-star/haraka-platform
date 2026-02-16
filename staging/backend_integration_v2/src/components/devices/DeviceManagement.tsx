import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Watch,
  Bluetooth,
  Battery,
  Heart,
  Activity,
  Moon,
  Zap,
  Wifi,
  WifiOff,
  Search,
  Plus,
  Settings,
  Trash2,
  RefreshCw,
  Eye,
  Users,
  Shield,
  Clock,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Link,
  Unlink,
  User,
  Baby,
  GraduationCap,
  UserCheck
} from 'lucide-react';

interface Device {
  id: string;
  name: string;
  type: 'fitness_band' | 'smartwatch' | 'heart_monitor';
  model: string;
  macAddress: string;
  batteryLevel: number;
  isConnected: boolean;
  lastSync: string;
  assignedTo?: string;
  assignedToName?: string;
  capabilities: DeviceCapability[];
  status: 'active' | 'inactive' | 'error' | 'low_battery';
  firmwareVersion: string;
  syncErrors: number;
  totalSyncs: number;
}

interface DeviceCapability {
  type: 'steps' | 'heart_rate' | 'sleep' | 'spo2' | 'bia' | 'calories' | 'distance';
  name: string;
  enabled: boolean;
}

interface SyncLog {
  id: string;
  deviceId: string;
  deviceName: string;
  userId: string;
  userName: string;
  timestamp: string;
  status: 'success' | 'failed' | 'partial';
  dataSize: number;
  errorMessage?: string;
  syncDuration: number;
}

interface BluetoothDevice {
  id: string;
  name: string;
  rssi: number;
  isConnectable: boolean;
  deviceType: string;
}

export function DeviceManagement({ userRole = 'admin' }: { userRole?: 'student' | 'parent' | 'coach' | 'teacher' | 'admin' }) {
  const [devices, setDevices] = useState<Device[]>([
    {
      id: 'dev_1',
      name: 'Mi Band 7',
      type: 'fitness_band',
      model: 'XMSH15HM',
      macAddress: 'A4:C1:38:12:34:56',
      batteryLevel: 78,
      isConnected: true,
      lastSync: '2024-10-02T14:30:00Z',
      assignedTo: 'user_1',
      assignedToName: 'أحمد محمد',
      capabilities: [
        { type: 'steps', name: 'عداد الخطوات', enabled: true },
        { type: 'heart_rate', name: 'معدل ضربات القلب', enabled: true },
        { type: 'sleep', name: 'مراقبة النوم', enabled: true },
        { type: 'spo2', name: 'مستوى الأكسجين', enabled: false },
        { type: 'calories', name: 'السعرات الحرارية', enabled: true }
      ],
      status: 'active',
      firmwareVersion: '2.1.4',
      syncErrors: 2,
      totalSyncs: 145
    },
    {
      id: 'dev_2',
      name: 'Fitbit Charge 5',
      type: 'fitness_band',
      model: 'FB421',
      macAddress: 'B8:27:EB:45:67:89',
      batteryLevel: 23,
      isConnected: false,
      lastSync: '2024-10-01T09:15:00Z',
      assignedTo: 'user_2',
      assignedToName: 'فاطمة أحمد',
      capabilities: [
        { type: 'steps', name: 'عداد الخطوات', enabled: true },
        { type: 'heart_rate', name: 'معدل ضربات القلب', enabled: true },
        { type: 'sleep', name: 'مراقبة النوم', enabled: true },
        { type: 'spo2', name: 'مستوى الأكسجين', enabled: true },
        { type: 'bia', name: 'تحليل الجسم', enabled: true }
      ],
      status: 'low_battery',
      firmwareVersion: '1.8.2',
      syncErrors: 0,
      totalSyncs: 89
    },
    {
      id: 'dev_3',
      name: 'Apple Watch SE',
      type: 'smartwatch',
      model: 'A2775',
      macAddress: 'DC:A6:32:78:90:12',
      batteryLevel: 92,
      isConnected: true,
      lastSync: '2024-10-02T15:45:00Z',
      capabilities: [
        { type: 'steps', name: 'عداد الخطوات', enabled: true },
        { type: 'heart_rate', name: 'معدل ضربات القلب', enabled: true },
        { type: 'sleep', name: 'مراقبة النوم', enabled: true },
        { type: 'spo2', name: 'مستوى الأكسجين', enabled: true },
        { type: 'calories', name: 'السعرات الحرارية', enabled: true },
        { type: 'distance', name: 'المسافة', enabled: true }
      ],
      status: 'active',
      firmwareVersion: '10.1.1',
      syncErrors: 1,
      totalSyncs: 234
    }
  ]);

  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([
    {
      id: 'sync_1',
      deviceId: 'dev_1',
      deviceName: 'Mi Band 7',
      userId: 'user_1',
      userName: 'أحمد محمد',
      timestamp: '2024-10-02T14:30:00Z',
      status: 'success',
      dataSize: 2.4,
      syncDuration: 12
    },
    {
      id: 'sync_2',
      deviceId: 'dev_2',
      deviceName: 'Fitbit Charge 5',
      userId: 'user_2',
      userName: 'فاطمة أحمد',
      timestamp: '2024-10-01T09:15:00Z',
      status: 'failed',
      dataSize: 0,
      errorMessage: 'فشل في الاتصال - بطارية منخفضة',
      syncDuration: 0
    },
    {
      id: 'sync_3',
      deviceId: 'dev_3',
      deviceName: 'Apple Watch SE',
      userId: 'user_3',
      userName: 'محمد علي',
      timestamp: '2024-10-02T15:45:00Z',
      status: 'success',
      dataSize: 5.7,
      syncDuration: 8
    }
  ]);

  const [discoveredDevices, setDiscoveredDevices] = useState<BluetoothDevice[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [showPairingDialog, setShowPairingDialog] = useState(false);
  const [showDeviceDetails, setShowDeviceDetails] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // BLE Scanning Simulation
  const startDeviceDiscovery = async () => {
    setIsScanning(true);
    setDiscoveredDevices([]);
    
    // Simulate BLE scanning
    setTimeout(() => {
      setDiscoveredDevices([
        { id: 'ble_1', name: 'Mi Band 7 Pro', rssi: -45, isConnectable: true, deviceType: 'fitness_band' },
        { id: 'ble_2', name: 'Fitbit Versa 4', rssi: -62, isConnectable: true, deviceType: 'smartwatch' },
        { id: 'ble_3', name: 'Samsung Galaxy Watch', rssi: -78, isConnectable: false, deviceType: 'smartwatch' },
        { id: 'ble_4', name: 'Huawei Band 8', rssi: -55, isConnectable: true, deviceType: 'fitness_band' }
      ]);
      setIsScanning(false);
    }, 3000);
  };

  const pairDevice = (bleDevice: BluetoothDevice) => {
    const newDevice: Device = {
      id: `dev_${Date.now()}`,
      name: bleDevice.name,
      type: bleDevice.deviceType as 'fitness_band' | 'smartwatch',
      model: 'Unknown',
      macAddress: `XX:XX:XX:${Math.random().toString(16).substr(2, 6).toUpperCase()}`,
      batteryLevel: Math.floor(Math.random() * 100),
      isConnected: true,
      lastSync: new Date().toISOString(),
      capabilities: [
        { type: 'steps', name: 'عداد الخطوات', enabled: true },
        { type: 'heart_rate', name: 'معدل ضربات القلب', enabled: true }
      ],
      status: 'active',
      firmwareVersion: '1.0.0',
      syncErrors: 0,
      totalSyncs: 0
    };

    setDevices(prev => [...prev, newDevice]);
    setShowPairingDialog(false);
  };

  const unpairDevice = (deviceId: string) => {
    setDevices(prev => prev.filter(d => d.id !== deviceId));
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'fitness_band': return <Watch className="h-5 w-5" />;
      case 'smartwatch': return <Watch className="h-5 w-5" />;
      case 'heart_monitor': return <Heart className="h-5 w-5" />;
      default: return <Watch className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'low_battery': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBatteryColor = (level: number) => {
    if (level > 50) return 'text-green-600';
    if (level > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student': return <GraduationCap className="h-4 w-4" />;
      case 'parent': return <Users className="h-4 w-4" />;
      case 'coach': return <UserCheck className="h-4 w-4" />;
      case 'teacher': return <User className="h-4 w-4" />;
      case 'admin': return <Shield className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const connectedDevices = devices.filter(d => d.isConnected).length;
  const lowBatteryDevices = devices.filter(d => d.batteryLevel < 25).length;
  const errorDevices = devices.filter(d => d.status === 'error').length;

  // Role-specific rendering
  const renderStudentView = () => (
    <div className="space-y-6">
      {/* Quick Status Card */}
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
              {devices.length > 0 ? (
                <div className="flex items-center gap-2">
                  {devices[0].isConnected ? (
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
              ) : (
                <span>لا يوجد سوار مقترن</span>
              )}
            </div>
            <Button variant="secondary" onClick={() => setShowPairingDialog(true)}>
              إدارة السوار
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Device Details */}
      {devices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>تفاصيل السوار</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {devices.map(device => (
              <div key={device.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-4">
                  {getDeviceIcon(device.type)}
                  <div>
                    <h4 className="font-medium">{device.name}</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <Battery className={`h-3 w-3 ${getBatteryColor(device.batteryLevel)}`} />
                        <span>البطارية: {device.batteryLevel}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>آخر تزامن: {new Date(device.lastSync).toLocaleString('ar-SA')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => {
                    setSelectedDevice(device);
                    setShowDeviceDetails(true);
                  }}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600">
                    <Unlink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Capabilities */}
      {devices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>قدرات السوار</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {devices[0].capabilities.map(capability => (
                <div key={capability.type} className={`p-3 rounded-lg border ${capability.enabled ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center gap-2">
                    {capability.type === 'steps' && <Activity className="h-4 w-4" />}
                    {capability.type === 'heart_rate' && <Heart className="h-4 w-4" />}
                    {capability.type === 'sleep' && <Moon className="h-4 w-4" />}
                    {capability.type === 'spo2' && <Zap className="h-4 w-4" />}
                    {capability.type === 'bia' && <Activity className="h-4 w-4" />}
                    <span className="text-sm font-medium">{capability.name}</span>
                  </div>
                  {!capability.enabled && (
                    <p className="text-xs text-gray-500 mt-1">غير مدعوم</p>
                  )}
                </div>
              ))}
            </div>
            {devices[0].capabilities.filter(c => c.enabled).length === 1 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  هذا السوار يدعم: {devices[0].capabilities.filter(c => c.enabled).map(c => c.name).join(', ')} فقط
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderParentView = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Baby className="h-6 w-6" />
            أجهزة الأطفال
          </CardTitle>
          <CardDescription>
            إدارة الأجهزة المقترنة بحسابات الأطفال
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['أحمد محمد', 'فاطمة أحمد', 'محمد علي'].map((childName, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{childName}</h4>
                  <Button size="sm" onClick={() => setShowPairingDialog(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    ربط سوار جديد
                  </Button>
                </div>
                {devices.filter(d => d.assignedToName === childName).map(device => (
                  <div key={device.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getDeviceIcon(device.type)}
                      <div>
                        <p className="font-medium">{device.name}</p>
                        <p className="text-sm text-gray-600">
                          آخر تزامن: {new Date(device.lastSync).toLocaleString('ar-SA')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(device.status)}>
                        {device.isConnected ? 'متصل' : 'غير متصل'}
                      </Badge>
                      <Button size="sm" variant="outline" className="text-red-600">
                        <Unlink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {devices.filter(d => d.assignedToName === childName).length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    لا يوجد أجهزة مقترنة
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Parental Controls */}
      <Card>
        <CardHeader>
          <CardTitle>الإعدادات الأبوية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">موافقة أبوية للاقتران</h4>
                <p className="text-sm text-gray-600">يتطلب موافقة قبل اقتران أي جهاز جديد</p>
              </div>
              <Button variant="outline">تفعيل</Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">تقارير المزامنة</h4>
                <p className="text-sm text-gray-600">استلام تقارير يومية عن حالة الأجهزة</p>
              </div>
              <Button variant="outline">إعداد</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAdminView = () => (
    <div className="space-y-6">
      {/* Admin Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Watch className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{devices.length}</p>
                <p className="text-sm text-gray-600">إجمالي الأجهزة</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Wifi className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{connectedDevices}</p>
                <p className="text-sm text-gray-600">متصل</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Battery className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{lowBatteryDevices}</p>
                <p className="text-sm text-gray-600">بطارية منخفضة</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{errorDevices}</p>
                <p className="text-sm text-gray-600">أخطاء</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Device Inventory */}
      <Card>
        <CardHeader>
          <CardTitle>جرد الأجهزة</CardTitle>
          <CardDescription>إدارة شاملة لجميع الأجهزة المقترنة</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {devices.map(device => (
              <div key={device.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  {getDeviceIcon(device.type)}
                  <div>
                    <h4 className="font-medium">{device.name}</h4>
                    <div className="text-sm text-gray-600">
                      <span>MAC: {device.macAddress}</span>
                      {device.assignedToName && (
                        <span className="ml-4">مخصص لـ: {device.assignedToName}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className={getStatusColor(device.status)}>
                    {device.status === 'active' && 'نشط'}
                    {device.status === 'inactive' && 'غير نشط'}
                    {device.status === 'error' && 'خطأ'}
                    {device.status === 'low_battery' && 'بطارية منخفضة'}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Battery className={`h-4 w-4 ${getBatteryColor(device.batteryLevel)}`} />
                    <span className="text-sm">{device.batteryLevel}%</span>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sync Logs */}
      <Card>
        <CardHeader>
          <CardTitle>سجل المزامنة</CardTitle>
          <CardDescription>سجلات المزامنة لجميع الأجهزة</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {syncLogs.map(log => (
              <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    log.status === 'success' ? 'bg-green-500' :
                    log.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                  }`} />
                  <div>
                    <p className="font-medium">{log.deviceName}</p>
                    <p className="text-sm text-gray-600">{log.userName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm">{new Date(log.timestamp).toLocaleString('ar-SA')}</p>
                  <p className="text-xs text-gray-500">
                    {log.status === 'success' ? `${log.dataSize} MB` : log.errorMessage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Main render based on role
  const renderMainContent = () => {
    switch (userRole) {
      case 'student': return renderStudentView();
      case 'parent': return renderParentView();
      case 'admin': return renderAdminView();
      default: return renderStudentView();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Bluetooth className="h-6 w-6" />
            إدارة الأجهزة الذكية
            {getRoleIcon(userRole)}
          </CardTitle>
          <CardDescription className="text-blue-100">
            {userRole === 'student' && 'إدارة السوار الذكي الخاص بك'}
            {userRole === 'parent' && 'إدارة أجهزة الأطفال والموافقات الأبوية'}
            {userRole === 'coach' && 'مراقبة أجهزة العملاء والتقارير'}
            {userRole === 'teacher' && 'مراقبة أجهزة الطلاب في الصف'}
            {userRole === 'admin' && 'إدارة شاملة لجميع الأجهزة والمستخدمين'}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Main Content */}
      {renderMainContent()}

      {/* Device Pairing Dialog */}
      <Dialog open={showPairingDialog} onOpenChange={setShowPairingDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>اقتران جهاز جديد</DialogTitle>
            <DialogDescription>
              ابحث عن الأجهزة القريبة واقترن بها
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={startDeviceDiscovery} disabled={isScanning} className="flex-1">
                {isScanning ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    جاري البحث...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    اكتشاف أجهزة قريبة
                  </>
                )}
              </Button>
            </div>
            
            {discoveredDevices.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">الأجهزة المكتشفة:</h4>
                {discoveredDevices.map(device => (
                  <div key={device.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bluetooth className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">{device.name}</p>
                        <p className="text-sm text-gray-600">قوة الإشارة: {device.rssi} dBm</p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => pairDevice(device)}
                      disabled={!device.isConnectable}
                    >
                      <Link className="h-4 w-4 mr-1" />
                      اقتران
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Device Details Dialog */}
      <Dialog open={showDeviceDetails} onOpenChange={setShowDeviceDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedDevice && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {getDeviceIcon(selectedDevice.type)}
                  {selectedDevice.name}
                </DialogTitle>
                <DialogDescription>
                  تفاصيل شاملة عن الجهاز وحالة المزامنة
                </DialogDescription>
              </DialogHeader>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
                  <TabsTrigger value="capabilities">القدرات</TabsTrigger>
                  <TabsTrigger value="sync">المزامنة</TabsTrigger>
                  <TabsTrigger value="settings">الإعدادات</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">معلومات الجهاز</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">الطراز:</span>
                          <span>{selectedDevice.model}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">عنوان MAC:</span>
                          <span className="font-mono text-sm">{selectedDevice.macAddress}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">إصدار البرنامج:</span>
                          <span>{selectedDevice.firmwareVersion}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">الحالة:</span>
                          <Badge className={getStatusColor(selectedDevice.status)}>
                            {selectedDevice.status === 'active' && 'نشط'}
                            {selectedDevice.status === 'inactive' && 'غير نشط'}
                            {selectedDevice.status === 'error' && 'خطأ'}
                            {selectedDevice.status === 'low_battery' && 'بطارية منخفضة'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">حالة البطارية</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Battery className={`h-5 w-5 ${getBatteryColor(selectedDevice.batteryLevel)}`} />
                          <span className="text-2xl font-bold">{selectedDevice.batteryLevel}%</span>
                        </div>
                        <Progress value={selectedDevice.batteryLevel} className="w-full" />
                        <p className="text-sm text-gray-600">
                          {selectedDevice.batteryLevel > 50 ? 'مستوى جيد' :
                           selectedDevice.batteryLevel > 20 ? 'يحتاج شحن قريباً' : 'يحتاج شحن فوري'}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">إحصائيات المزامنة</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">{selectedDevice.totalSyncs}</p>
                          <p className="text-sm text-gray-600">إجمالي المزامنة</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-red-600">{selectedDevice.syncErrors}</p>
                          <p className="text-sm text-gray-600">أخطاء المزامنة</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">
                            {Math.round(((selectedDevice.totalSyncs - selectedDevice.syncErrors) / selectedDevice.totalSyncs) * 100) || 0}%
                          </p>
                          <p className="text-sm text-gray-600">معدل النجاح</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="capabilities" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">قدرات الجهاز</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedDevice.capabilities.map(capability => (
                          <div key={capability.type} className={`p-4 rounded-lg border ${
                            capability.enabled ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                          }`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {capability.type === 'steps' && <Activity className="h-5 w-5" />}
                                {capability.type === 'heart_rate' && <Heart className="h-5 w-5" />}
                                {capability.type === 'sleep' && <Moon className="h-5 w-5" />}
                                {capability.type === 'spo2' && <Zap className="h-5 w-5" />}
                                {capability.type === 'bia' && <Activity className="h-5 w-5" />}
                                <span className="font-medium">{capability.name}</span>
                              </div>
                              {capability.enabled ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              ) : (
                                <XCircle className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                              {capability.enabled ? 'مدعوم ومفعل' : 'غير مدعوم في هذا الطراز'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="sync" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">سجل المزامنة</CardTitle>
                      <CardDescription>
                        آخر تزامن: {new Date(selectedDevice.lastSync).toLocaleString('ar-SA')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {syncLogs.filter(log => log.deviceId === selectedDevice.id).map(log => (
                          <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${
                                log.status === 'success' ? 'bg-green-500' :
                                log.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                              }`} />
                              <div>
                                <p className="font-medium">
                                  {log.status === 'success' && 'مزامنة ناجحة'}
                                  {log.status === 'failed' && 'فشل في المزامنة'}
                                  {log.status === 'partial' && 'مزامنة جزئية'}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {new Date(log.timestamp).toLocaleString('ar-SA')}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm">
                                {log.status === 'success' ? `${log.dataSize} MB` : 'فشل'}
                              </p>
                              <p className="text-xs text-gray-500">
                                {log.syncDuration}s
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">إعدادات الجهاز</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">المزامنة التلقائية</h4>
                          <p className="text-sm text-gray-600">مزامنة البيانات تلقائياً كل ساعة</p>
                        </div>
                        <Button variant="outline">تفعيل</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">تنبيهات البطارية</h4>
                          <p className="text-sm text-gray-600">تنبيه عند انخفاض البطارية أقل من 20%</p>
                        </div>
                        <Button variant="outline">تفعيل</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">إلغاء الاقتران</h4>
                          <p className="text-sm text-gray-600">فصل الجهاز نهائياً من الحساب</p>
                        </div>
                        <Button variant="outline" className="text-red-600">
                          إلغاء الاقتران
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}