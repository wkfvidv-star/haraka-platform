import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAIAnalytics } from '@/contexts/AIAnalyticsContext';
import { 
  Activity, 
  Brain, 
  Eye, 
  TrendingUp, 
  Users, 
  Clock, 
  Target, 
  Zap,
  AlertTriangle,
  CheckCircle,
  Lightbulb
} from 'lucide-react';

export const RealTimeAnalytics: React.FC = () => {
  const { 
    metrics, 
    virtualSensors, 
    insights, 
    getEngagementStatus, 
    isTracking 
  } = useAIAnalytics();
  
  const [realtimeData, setRealtimeData] = useState({
    currentUsers: 0,
    activeConnections: 0,
    dataPoints: 0
  });

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setRealtimeData(prev => ({
        currentUsers: Math.max(1, prev.currentUsers + Math.floor(Math.random() * 3) - 1),
        activeConnections: Math.max(1, prev.activeConnections + Math.floor(Math.random() * 2) - 1),
        dataPoints: prev.dataPoints + Math.floor(Math.random() * 5) + 1
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const engagementStatus = getEngagementStatus();
  
  const getStatusColor = (status: 'green' | 'yellow' | 'red') => {
    switch (status) {
      case 'green': return 'text-green-500 bg-green-50 border-green-200';
      case 'yellow': return 'text-yellow-500 bg-yellow-50 border-yellow-200';
      case 'red': return 'text-red-500 bg-red-50 border-red-200';
    }
  };

  const getStatusIcon = (status: 'green' | 'yellow' | 'red') => {
    switch (status) {
      case 'green': return <CheckCircle className="w-4 h-4" />;
      case 'yellow': return <AlertTriangle className="w-4 h-4" />;
      case 'red': return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const recentSensors = virtualSensors.slice(-10).reverse();
  const recentInsights = insights.slice(-5).reverse();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">التحليلات الذكية بالوقت الحقيقي</h2>
          <p className="text-muted-foreground">نظام مراقبة وتحليل النشاط المتقدم</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(engagementStatus)}`}>
            {getStatusIcon(engagementStatus)}
            <span className="text-sm font-medium">
              {isTracking ? 'نشط' : 'متوقف'}
            </span>
          </div>
          {isTracking && (
            <div className="flex items-center gap-1 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm">مباشر</span>
            </div>
          )}
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المستخدمون النشطون</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              +{realtimeData.currentUsers} في الجلسة الحالية
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل التفاعل</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.engagementRate.toFixed(1)}%</div>
            <Progress value={metrics.engagementRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">متوسط مدة الجلسة</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(metrics.averageSessionDuration / 60000)}د {Math.floor((metrics.averageSessionDuration % 60000) / 1000)}ث
            </div>
            <p className="text-xs text-muted-foreground">
              آخر 24 ساعة
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل الإنجاز</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.completionRate.toFixed(1)}%</div>
            <Progress value={metrics.completionRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Virtual Sensors Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              أجهزة الاستشعار الافتراضية
            </CardTitle>
            <CardDescription>
              مراقبة سلوك المستخدمين في الوقت الفعلي
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSensors.length > 0 ? (
                recentSensors.map((sensor) => (
                  <div key={sensor.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        sensor.status === 'green' ? 'bg-green-500' :
                        sensor.status === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <p className="font-medium text-sm">{sensor.type}</p>
                        <p className="text-xs text-muted-foreground">{sensor.context}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{sensor.value.toFixed(0)}%</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(sensor.timestamp).toLocaleTimeString('ar-SA')}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>لا توجد بيانات استشعار حالياً</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              الرؤى الذكية
            </CardTitle>
            <CardDescription>
              تحليلات وتوصيات مدعومة بالذكاء الاصطناعي
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInsights.length > 0 ? (
                recentInsights.map((insight) => (
                  <div key={insight.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant={
                        insight.priority === 'critical' ? 'destructive' :
                        insight.priority === 'high' ? 'destructive' :
                        insight.priority === 'medium' ? 'default' : 'secondary'
                      }>
                        {insight.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {Math.round(insight.confidence * 100)}% ثقة
                      </span>
                    </div>
                    <h4 className="font-medium text-sm mb-1">{insight.title}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{insight.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {new Date(insight.timestamp).toLocaleTimeString('ar-SA')}
                      </span>
                      {insight.actionable && (
                        <Badge variant="outline" className="text-xs">
                          قابل للتنفيذ
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>لا توجد رؤى ذكية حالياً</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Hub Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            حالة المركز الذكي (AI Hub)
          </CardTitle>
          <CardDescription>
            مراقبة الاتصالات وتدفق البيانات
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{realtimeData.activeConnections}</div>
              <p className="text-sm text-muted-foreground">اتصالات نشطة</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{realtimeData.dataPoints}</div>
              <p className="text-sm text-muted-foreground">نقاط البيانات</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {virtualSensors.length + insights.length}
              </div>
              <p className="text-sm text-muted-foreground">إجمالي التحليلات</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeAnalytics;