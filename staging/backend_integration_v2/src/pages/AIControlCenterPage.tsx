import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AIControlCenter from '@/components/control-center/AIControlCenter';
import VisualizationSystem from '@/components/control-center/VisualizationSystem';
import ExternalIntegrations from '@/components/control-center/ExternalIntegrations';
import AIAssistant from '@/components/control-center/AIAssistant';
import { useAuth } from '@/contexts/AuthContext';
import { useAIControlCenter } from '@/contexts/AIControlCenterContext';
import { 
  Cpu, 
  BarChart3, 
  Globe, 
  Bot,
  ArrowLeft,
  Shield,
  Zap,
  Activity,
  Brain
} from 'lucide-react';

interface AIControlCenterPageProps {
  onBack?: () => void;
}

export const AIControlCenterPage: React.FC<AIControlCenterPageProps> = ({ onBack }) => {
  const { user } = useAuth();
  const { systemHealth, realTimeMetrics, connectionStatus } = useAIControlCenter();
  const [activeTab, setActiveTab] = useState('control-center');

  // Check if user has access to AI Control Center
  const hasAccess = user?.role === 'admin' || 
                   user?.role === 'principal' || 
                   user?.role === 'directorate' || 
                   user?.role === 'ministry';

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <CardTitle>غير مصرح بالوصول</CardTitle>
              <CardDescription>
                مركز التحكم الذكي مخصص للمديرين والإداريين فقط
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
                  <Cpu className="h-6 w-6 text-blue-600" />
                  مركز التحكم الذكي - منصة حركة
                </h1>
                <p className="text-muted-foreground text-sm">
                  المرحلة الثالثة: المركز العصبي للذكاء الاصطناعي والتحكم الشامل
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={systemHealth.overall >= 95 ? 'default' : systemHealth.overall >= 85 ? 'secondary' : 'destructive'}>
                صحة النظام: {systemHealth.overall.toFixed(1)}%
              </Badge>
              <Badge variant={connectionStatus === 'online' ? 'default' : connectionStatus === 'unstable' ? 'secondary' : 'destructive'}>
                {connectionStatus === 'online' ? 'متصل' : 
                 connectionStatus === 'unstable' ? 'غير مستقر' : 'منقطع'}
              </Badge>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${
                realTimeMetrics.activeUsers > 0
                  ? 'text-green-600 bg-green-50 border-green-200' 
                  : 'text-gray-600 bg-gray-50 border-gray-200'
              }`}>
                <Activity className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {realTimeMetrics.activeUsers} مستخدم نشط
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
            <TabsTrigger value="control-center" className="flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              مركز التحكم
            </TabsTrigger>
            <TabsTrigger value="visualization" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              التمثيل البصري
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              التكاملات الخارجية
            </TabsTrigger>
            <TabsTrigger value="assistant" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              المساعد الذكي
            </TabsTrigger>
          </TabsList>

          <TabsContent value="control-center" className="space-y-6">
            <AIControlCenter />
          </TabsContent>

          <TabsContent value="visualization" className="space-y-6">
            <VisualizationSystem />
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <ExternalIntegrations />
          </TabsContent>

          <TabsContent value="assistant" className="space-y-6">
            <AIAssistant />
          </TabsContent>
        </Tabs>
      </div>

      {/* System Status Footer */}
      <div className="border-t bg-muted/30 mt-12">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>المرحلة الثالثة من تطوير منصة حركة</span>
              <span>•</span>
              <span>مركز التحكم الذكي والتكامل الشامل</span>
            </div>
            <div className="flex items-center gap-4">
              <span>المستخدم: {user?.name}</span>
              <span>•</span>
              <span>الدور: {user?.role}</span>
              <span>•</span>
              <span>البيئة: {user?.environment === 'school' ? 'مدرسية' : 'مجتمعية'}</span>
              <span>•</span>
              <span>آخر تحديث: {realTimeMetrics.lastUpdate.toLocaleTimeString('ar-SA')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIControlCenterPage;