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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'url(/images/admin_bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(3px)'
        }}
      />

      {/* Main Content Container */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {onBack && (
                  <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-blue-50">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                )}
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                  <Cpu className="h-8 w-8 text-[#0ea5e9]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">مركز التحكم الذكي</h1>
                  <p className="text-sm text-muted-foreground">
                    المرحلة الثالثة: المركز العصبي للتحكم الشامل — منصة حركة
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={systemHealth.overall >= 95 ? 'default' : systemHealth.overall >= 85 ? 'secondary' : 'destructive'} className="rounded-full px-4 h-8 flex items-center font-bold">
                  صحة النظام: {systemHealth.overall.toFixed(1)}%
                </Badge>
                <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border shadow-sm ${connectionStatus === 'online'
                    ? 'text-emerald-600 bg-emerald-50 border-emerald-100'
                    : 'text-rose-600 bg-rose-50 border-rose-100'
                  }`}>
                  <div className={`w-2 h-2 rounded-full ${connectionStatus === 'online' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <span className="text-sm font-bold">
                    {connectionStatus === 'online' ? 'متصل' : 'منقطع'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <div className="flex items-center justify-between bg-white/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/60 shadow-sm">
              <TabsList className="bg-transparent border-none w-full grid grid-cols-4 h-12">
                <TabsTrigger
                  value="control-center"
                  className="rounded-xl data-[state=active]:bg-[#0ea5e9] data-[state=active]:text-white data-[state=active]:shadow-md transition-all gap-2 font-bold"
                >
                  <Cpu className="h-4 w-4" />
                  مركز التحكم
                </TabsTrigger>
                <TabsTrigger
                  value="visualization"
                  className="rounded-xl data-[state=active]:bg-[#0ea5e9] data-[state=active]:text-white data-[state=active]:shadow-md transition-all gap-2 font-bold"
                >
                  <BarChart3 className="h-4 w-4" />
                  التمثيل البصري
                </TabsTrigger>
                <TabsTrigger
                  value="integrations"
                  className="rounded-xl data-[state=active]:bg-[#0ea5e9] data-[state=active]:text-white data-[state=active]:shadow-md transition-all gap-2 font-bold"
                >
                  <Globe className="h-4 w-4" />
                  التكاملات
                </TabsTrigger>
                <TabsTrigger
                  value="assistant"
                  className="rounded-xl data-[state=active]:bg-[#0ea5e9] data-[state=active]:text-white data-[state=active]:shadow-md transition-all gap-2 font-bold"
                >
                  <Bot className="h-4 w-4" />
                  المساعد
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
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
            </div>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default AIControlCenterPage;