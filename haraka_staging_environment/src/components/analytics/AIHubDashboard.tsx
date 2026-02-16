import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAIAnalytics } from '@/contexts/AIAnalyticsContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Cpu, 
  Database, 
  Network, 
  Server, 
  Activity, 
  Users, 
  Globe,
  Zap,
  BarChart3,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Wifi
} from 'lucide-react';

interface AIHubData {
  timestamp: Date;
  userId?: string;
  environment?: string;
  role?: string;
  sessionId: string;
  type: string;
  data: Record<string, unknown>;
  source: string;
}

interface SystemMetrics {
  totalConnections: number;
  activeUsers: number;
  dataProcessed: number;
  systemLoad: number;
  responseTime: number;
  errorRate: number;
  throughput: number;
}

export const AIHubDashboard: React.FC = () => {
  const { subscribeToAIHub, sendToAIHub } = useAIAnalytics();
  const { user } = useAuth();
  const [hubData, setHubData] = useState<AIHubData[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    totalConnections: 0,
    activeUsers: 0,
    dataProcessed: 0,
    systemLoad: 0,
    responseTime: 0,
    errorRate: 0,
    throughput: 0
  });
  const [isConnected, setIsConnected] = useState(true);
  const [connectionStats, setConnectionStats] = useState({
    school: 0,
    community: 0,
    total: 0
  });

  // Subscribe to AI Hub data
  useEffect(() => {
    const unsubscribe = subscribeToAIHub((data: Record<string, unknown>) => {
      const hubDataEntry = data as AIHubData;
      setHubData(prev => [...prev.slice(-99), hubDataEntry]); // Keep last 100 entries
    });

    // Load existing data from localStorage
    const existingData = JSON.parse(localStorage.getItem('ai_hub_data') || '[]');
    setHubData(existingData.slice(-100));

    return unsubscribe;
  }, [subscribeToAIHub]);

  // Calculate system metrics
  useEffect(() => {
    const calculateMetrics = () => {
      const now = new Date();
      const last5Minutes = new Date(now.getTime() - 5 * 60 * 1000);
      const recentData = hubData.filter(d => new Date(d.timestamp) > last5Minutes);
      
      const uniqueUsers = new Set(recentData.map(d => d.userId).filter(Boolean)).size;
      const uniqueSessions = new Set(recentData.map(d => d.sessionId)).size;
      
      // Environment distribution
      const schoolUsers = recentData.filter(d => d.environment === 'school').length;
      const communityUsers = recentData.filter(d => d.environment === 'community').length;
      
      setConnectionStats({
        school: schoolUsers,
        community: communityUsers,
        total: schoolUsers + communityUsers
      });

      // System metrics simulation
      setSystemMetrics({
        totalConnections: uniqueSessions,
        activeUsers: uniqueUsers,
        dataProcessed: recentData.length,
        systemLoad: Math.min(100, (recentData.length / 50) * 100), // Simulate load based on data volume
        responseTime: 150 + Math.random() * 100, // Simulate response time 150-250ms
        errorRate: Math.random() * 2, // Random error rate 0-2%
        throughput: recentData.length / 5 // Data points per minute
      });
    };

    const interval = setInterval(calculateMetrics, 3000); // Update every 3 seconds
    calculateMetrics();

    return () => clearInterval(interval);
  }, [hubData]);

  // Simulate connection status
  useEffect(() => {
    const interval = setInterval(() => {
      setIsConnected(prev => Math.random() > 0.1 ? true : prev); // 90% uptime
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getDataTypeStats = () => {
    const last10Minutes = new Date(Date.now() - 10 * 60 * 1000);
    const recentData = hubData.filter(d => new Date(d.timestamp) > last10Minutes);
    
    const typeStats = recentData.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(typeStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  };

  const getSourceStats = () => {
    const last10Minutes = new Date(Date.now() - 10 * 60 * 1000);
    const recentData = hubData.filter(d => new Date(d.timestamp) > last10Minutes);
    
    const sourceStats = recentData.reduce((acc, item) => {
      acc[item.source] = (acc[item.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(sourceStats)
      .sort(([,a], [,b]) => b - a);
  };

  const handleTestConnection = () => {
    sendToAIHub({
      type: 'test',
      data: { message: 'اختبار الاتصال', timestamp: new Date() },
      source: 'dashboard_test'
    });
  };

  const dataTypeStats = getDataTypeStats();
  const sourceStats = getSourceStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">المركز الذكي (AI Hub)</h2>
          <p className="text-muted-foreground">مراقبة وإدارة شبكة إنترنت الأشياء التعليمية</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleTestConnection}>
            <Zap className="h-4 w-4 mr-2" />
            اختبار الاتصال
          </Button>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${
            isConnected 
              ? 'text-green-600 bg-green-50 border-green-200' 
              : 'text-red-600 bg-red-50 border-red-200'
          }`}>
            {isConnected ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {isConnected ? 'متصل' : 'منقطع'}
            </span>
          </div>
        </div>
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الاتصالات النشطة</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.totalConnections}</div>
            <p className="text-xs text-muted-foreground">
              {systemMetrics.activeUsers} مستخدم نشط
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معالجة البيانات</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.dataProcessed}</div>
            <p className="text-xs text-muted-foreground">
              {systemMetrics.throughput.toFixed(1)} نقطة/دقيقة
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">حمولة النظام</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.systemLoad.toFixed(0)}%</div>
            <Progress value={systemMetrics.systemLoad} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">زمن الاستجابة</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.responseTime.toFixed(0)}ms</div>
            <p className="text-xs text-muted-foreground">
              معدل الخطأ: {systemMetrics.errorRate.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Environment Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              توزيع البيئات
            </CardTitle>
            <CardDescription>
              نشاط المستخدمين حسب البيئة التعليمية
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">البيئة المدرسية</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">{connectionStats.school}</div>
                  <div className="text-xs text-muted-foreground">
                    {connectionStats.total > 0 ? 
                      ((connectionStats.school / connectionStats.total) * 100).toFixed(0) : 0}%
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">البيئة المجتمعية</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">{connectionStats.community}</div>
                  <div className="text-xs text-muted-foreground">
                    {connectionStats.total > 0 ? 
                      ((connectionStats.community / connectionStats.total) * 100).toFixed(0) : 0}%
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">الإجمالي</span>
                  <span className="font-bold">{connectionStats.total}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              أنواع البيانات
            </CardTitle>
            <CardDescription>
              إحصائيات البيانات المتداولة (آخر 10 دقائق)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dataTypeStats.length > 0 ? (
                dataTypeStats.map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {type}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{count}</div>
                      <div className="text-xs text-muted-foreground">نقطة بيانات</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">لا توجد بيانات حالياً</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Sources & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              مصادر البيانات
            </CardTitle>
            <CardDescription>
              الأنظمة المتصلة بالمركز الذكي
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sourceStats.length > 0 ? (
                sourceStats.map(([source, count]) => (
                  <div key={source} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <Wifi className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">
                        {source === 'user_tracking' ? 'تتبع المستخدمين' :
                         source === 'virtual_sensors' ? 'أجهزة الاستشعار' :
                         source === 'ai_analytics' ? 'التحليلات الذكية' :
                         source === 'dashboard_test' ? 'اختبار اللوحة' : source}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{count}</div>
                      <div className="text-xs text-muted-foreground">رسالة</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <Server className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">لا توجد مصادر نشطة</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              النشاط الحديث
            </CardTitle>
            <CardDescription>
              آخر الأنشطة في المركز الذكي
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {hubData.slice(-10).reverse().map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-2 border rounded text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-xs">
                        {item.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {item.source}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(item.timestamp).toLocaleString('ar-SA')}
                    </div>
                  </div>
                </div>
              ))}
              
              {hubData.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">لا يوجد نشاط حديث</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIHubDashboard;