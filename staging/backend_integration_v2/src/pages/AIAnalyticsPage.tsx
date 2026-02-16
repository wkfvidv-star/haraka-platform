import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import RealTimeAnalytics from '@/components/analytics/RealTimeAnalytics';
import VirtualSensorsPanel from '@/components/analytics/VirtualSensorsPanel';
import AIHubDashboard from '@/components/analytics/AIHubDashboard';
import SmartInsightsPanel from '@/components/analytics/SmartInsightsPanel';
import { useAuth } from '@/contexts/AuthContext';
import { useAIAnalytics } from '@/contexts/AIAnalyticsContext';
import { 
  Brain, 
  Activity, 
  Database, 
  Lightbulb, 
  Settings,
  ArrowLeft,
  Shield,
  Zap
} from 'lucide-react';

interface AIAnalyticsPageProps {
  onBack?: () => void;
}

export const AIAnalyticsPage: React.FC<AIAnalyticsPageProps> = ({ onBack }) => {
  const { user } = useAuth();
  const { isTracking, getEngagementStatus } = useAIAnalytics();
  const [activeTab, setActiveTab] = useState('overview');

  const engagementStatus = getEngagementStatus();

  // Check if user has access to AI Analytics
  const hasAccess = user?.role === 'admin' || 
                   user?.role === 'principal' || 
                   user?.role === 'directorate' || 
                   user?.role === 'ministry' || 
                   user?.role === 'competition';

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <CardTitle>غير مصرح بالوصول</CardTitle>
              <CardDescription>
                هذه الصفحة مخصصة للمديرين والإداريين فقط
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                العودة
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onBack && (
                <Button variant="ghost" size="sm" onClick={onBack}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Brain className="h-6 w-6 text-blue-600" />
                  نظام التحليلات الذكية - منصة حركة
                </h1>
                <p className="text-muted-foreground text-sm">
                  المرحلة الأولى: بنية الذكاء الاصطناعي التحليلية المتقدمة
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={
                engagementStatus === 'green' ? 'default' :
                engagementStatus === 'yellow' ? 'secondary' : 'destructive'
              }>
                {engagementStatus === 'green' ? 'نظام صحي' :
                 engagementStatus === 'yellow' ? 'يحتاج مراقبة' : 'يحتاج تدخل'}
              </Badge>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${
                isTracking 
                  ? 'text-green-600 bg-green-50 border-green-200' 
                  : 'text-red-600 bg-red-50 border-red-200'
              }`}>
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {isTracking ? 'نشط' : 'متوقف'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              نظرة عامة
            </TabsTrigger>
            <TabsTrigger value="sensors" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              أجهزة الاستشعار
            </TabsTrigger>
            <TabsTrigger value="hub" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              المركز الذكي
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              الرؤى الذكية
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <RealTimeAnalytics />
          </TabsContent>

          <TabsContent value="sensors" className="space-y-6">
            <VirtualSensorsPanel />
          </TabsContent>

          <TabsContent value="hub" className="space-y-6">
            <AIHubDashboard />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <SmartInsightsPanel />
          </TabsContent>
        </Tabs>
      </div>

      {/* System Info Footer */}
      <div className="border-t bg-muted/30 mt-12">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>المرحلة الأولى من تطوير منصة حركة</span>
              <span>•</span>
              <span>نظام الذكاء الاصطناعي التحليلي</span>
            </div>
            <div className="flex items-center gap-4">
              <span>المستخدم: {user?.name}</span>
              <span>•</span>
              <span>الدور: {user?.role}</span>
              <span>•</span>
              <span>البيئة: {user?.environment === 'school' ? 'مدرسية' : 'مجتمعية'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalyticsPage;