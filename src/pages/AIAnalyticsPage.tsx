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
                  <Brain className="h-8 w-8 text-[#0ea5e9]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">نظام التحليلات الذكية</h1>
                  <p className="text-sm text-muted-foreground">
                    المرحلة الأولى: بنية الذكاء الاصطناعي التحليلية — منصة حركة
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={
                  engagementStatus === 'green' ? 'default' :
                    engagementStatus === 'yellow' ? 'secondary' : 'destructive'
                } className="rounded-full px-4 h-8 flex items-center font-bold">
                  {engagementStatus === 'green' ? 'نظام صحي' :
                    engagementStatus === 'yellow' ? 'يحتاج مراقبة' : 'يحتاج تدخل'}
                </Badge>
                <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border shadow-sm ${isTracking
                  ? 'text-emerald-600 bg-emerald-50 border-emerald-100'
                  : 'text-red-600 bg-red-50 border-red-100'
                  }`}>
                  <div className={`w-2 h-2 rounded-full ${isTracking ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                  <span className="text-sm font-bold">
                    {isTracking ? 'نشط' : 'متوقف'}
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
                  value="overview"
                  className="rounded-xl data-[state=active]:bg-[#0ea5e9] data-[state=active]:text-white data-[state=active]:shadow-md transition-all gap-2 font-bold"
                >
                  <Activity className="h-4 w-4" />
                  نظرة عامة
                </TabsTrigger>
                <TabsTrigger
                  value="sensors"
                  className="rounded-xl data-[state=active]:bg-[#0ea5e9] data-[state=active]:text-white data-[state=active]:shadow-md transition-all gap-2 font-bold"
                >
                  <Settings className="h-4 w-4" />
                  أجهزة الاستشعار
                </TabsTrigger>
                <TabsTrigger
                  value="hub"
                  className="rounded-xl data-[state=active]:bg-[#0ea5e9] data-[state=active]:text-white data-[state=active]:shadow-md transition-all gap-2 font-bold"
                >
                  <Database className="h-4 w-4" />
                  المركز الذكي
                </TabsTrigger>
                <TabsTrigger
                  value="insights"
                  className="rounded-xl data-[state=active]:bg-[#0ea5e9] data-[state=active]:text-white data-[state=active]:shadow-md transition-all gap-2 font-bold"
                >
                  <Lightbulb className="h-4 w-4" />
                  الرؤى الذكية
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
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
            </div>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default AIAnalyticsPage;