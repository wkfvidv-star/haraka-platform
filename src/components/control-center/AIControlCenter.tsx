import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAIControlCenter } from '@/contexts/AIControlCenterContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Cpu, 
  Activity, 
  Database, 
  Network, 
  Shield, 
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Download,
  Settings,
  Eye,
  Brain,
  Globe,
  Server
} from 'lucide-react';

export const AIControlCenter: React.FC = () => {
  const { 
    systemHealth, 
    realTimeMetrics, 
    refreshAllData, 
    exportSystemReport,
    getSystemInsights,
    isLoading,
    lastRefresh,
    connectionStatus
  } = useAIControlCenter();
  const { user } = useAuth();
  const [insights, setInsights] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const systemInsights = getSystemInsights();
    setInsights(systemInsights);
  }, [systemHealth, realTimeMetrics, getSystemInsights]);

  const handleRefresh = async () => {
    await refreshAllData();
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const report = await exportSystemReport();
      const blob = new Blob([report], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `haraka-system-report-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  const getHealthColor = (value: number) => {
    if (value >= 95) return 'text-green-600 bg-green-50 border-green-200';
    if (value >= 85) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getConnectionStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-50 border-green-200';
      case 'unstable': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'offline': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">مركز التحكم الذكي</h2>
          <p className="text-muted-foreground">المركز العصبي لمنصة حركة - مراقبة شاملة في الوقت الحقيقي</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={getConnectionStatusColor(connectionStatus)}>
            <Zap className="w-3 h-3 mr-1" />
            {connectionStatus === 'online' ? 'متصل' : 
             connectionStatus === 'unstable' ? 'غير مستقر' : 'منقطع'}
          </Badge>
          <Button variant="outline" size="sm" onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            تصدير التقرير
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            {isLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            تحديث
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              الصحة العامة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemHealth.overall.toFixed(1)}%</div>
            <Progress value={systemHealth.overall} className="mt-2 h-2" />
            <Badge className={`mt-2 ${getHealthColor(systemHealth.overall)}`}>
              {systemHealth.overall >= 95 ? 'ممتاز' :
               systemHealth.overall >= 85 ? 'جيد' : 'يحتاج صيانة'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-500" />
              التحليلات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemHealth.analytics.toFixed(1)}%</div>
            <Progress value={systemHealth.analytics} className="mt-2 h-2" />
            <div className="text-xs text-muted-foreground mt-2">نظام AI</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              التنبؤات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemHealth.predictive.toFixed(1)}%</div>
            <Progress value={systemHealth.predictive} className="mt-2 h-2" />
            <div className="text-xs text-muted-foreground mt-2">تعلم الآلة</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Database className="h-4 w-4 text-orange-500" />
              قاعدة البيانات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemHealth.database.toFixed(1)}%</div>
            <Progress value={systemHealth.database} className="mt-2 h-2" />
            <div className="text-xs text-muted-foreground mt-2">تخزين</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Network className="h-4 w-4 text-cyan-500" />
              الشبكة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemHealth.network.toFixed(1)}%</div>
            <Progress value={systemHealth.network} className="mt-2 h-2" />
            <div className="text-xs text-muted-foreground mt-2">اتصال</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Shield className="h-4 w-4 text-red-500" />
              الأمان
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemHealth.security.toFixed(1)}%</div>
            <Progress value={systemHealth.security} className="mt-2 h-2" />
            <div className="text-xs text-muted-foreground mt-2">حماية</div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">المستخدمون النشطون</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{realTimeMetrics.activeUsers}</div>
            <div className="text-xs text-muted-foreground">
              {realTimeMetrics.totalSessions} جلسة إجمالية
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">حمولة النظام</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {realTimeMetrics.systemLoad.toFixed(1)}%
            </div>
            <Progress value={realTimeMetrics.systemLoad} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">زمن الاستجابة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {realTimeMetrics.responseTime.toFixed(0)}ms
            </div>
            <div className="text-xs text-muted-foreground">
              معدل الخطأ: {realTimeMetrics.errorRate.toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">البيانات المعالجة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {realTimeMetrics.dataProcessed.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">
              {realTimeMetrics.throughput.toFixed(1)} نقطة/دقيقة
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts & Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              التنبيهات النشطة
            </CardTitle>
            <CardDescription>
              التنبيهات التي تحتاج إلى انتباه فوري
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {realTimeMetrics.alertsActive}
                </div>
                <div className="text-sm text-muted-foreground">تنبيه نشط</div>
                {realTimeMetrics.alertsActive > 0 && (
                  <Button variant="outline" size="sm" className="mt-3">
                    <Eye className="h-4 w-4 mr-2" />
                    عرض التفاصيل
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              التنبؤات النشطة
            </CardTitle>
            <CardDescription>
              التنبؤات التي تتطلب متابعة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {realTimeMetrics.predictionsActive}
                </div>
                <div className="text-sm text-muted-foreground">تنبؤ نشط</div>
                {realTimeMetrics.predictionsActive > 0 && (
                  <Button variant="outline" size="sm" className="mt-3">
                    <Brain className="h-4 w-4 mr-2" />
                    عرض التنبؤات
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            رؤى النظام الذكية
          </CardTitle>
          <CardDescription>
            تحليل تلقائي لحالة النظام والتوصيات
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.length > 0 ? (
              insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-800">{insight}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">جاري تحليل النظام...</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* System Status Footer */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>آخر تحديث: {lastRefresh ? lastRefresh.toLocaleTimeString('ar-SA') : 'لا يوجد'}</span>
              <span>•</span>
              <span>المستخدم: {user?.name}</span>
              <span>•</span>
              <span>البيئة: {user?.environment === 'school' ? 'مدرسية' : 'مجتمعية'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>مركز التحكم الذكي - منصة حركة</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIControlCenter;