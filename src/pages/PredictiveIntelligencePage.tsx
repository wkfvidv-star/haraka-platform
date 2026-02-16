import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PredictiveAnalytics from '@/components/predictive/PredictiveAnalytics';
import ContextAwareness from '@/components/predictive/ContextAwareness';
import SmartAlerts from '@/components/predictive/SmartAlerts';
import { useAuth } from '@/contexts/AuthContext';
import { usePredictiveIntelligence } from '@/contexts/PredictiveIntelligenceContext';
import {
  Brain,
  Eye,
  Bell,
  Target,
  ArrowLeft,
  Shield,
  Zap,
  TrendingUp
} from 'lucide-react';

interface PredictiveIntelligencePageProps {
  onBack?: () => void;
}

export const PredictiveIntelligencePage: React.FC<PredictiveIntelligencePageProps> = ({ onBack }) => {
  const { user } = useAuth();
  const { predictions, smartAlerts, isProcessing, currentContext } = usePredictiveIntelligence();
  const [activeTab, setActiveTab] = useState('predictions');

  // Check if user has access to Predictive Intelligence
  const hasAccess = user?.role === 'admin' ||
    user?.role === 'principal' ||
    user?.role === 'directorate' ||
    user?.role === 'ministry' ||
    user?.role === 'competition' ||
    user?.role === 'teacher';

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <CardTitle>غير مصرح بالوصول</CardTitle>
              <CardDescription>
                هذه الصفحة مخصصة للمعلمين والمديرين والإداريين
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

  const activePredictions = predictions.filter(p => p.status === 'active');
  const activeAlerts = smartAlerts.filter(a => a.status === 'active');

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
                  <Target className="h-8 w-8 text-[#0ea5e9]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">نظام الذكاء التنبؤي</h1>
                  <p className="text-sm text-muted-foreground">
                    المرحلة الثانية: نظام التنبؤ والوعي السياقي المتقدم — منصة حركة
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {activePredictions.length > 0 && (
                  <Badge variant="destructive" className="rounded-full px-4 h-8 flex items-center font-bold">
                    {activePredictions.length} تنبؤ نشط
                  </Badge>
                )}
                <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border shadow-sm ${isProcessing
                    ? 'text-[#0ea5e9] bg-blue-50 border-blue-100'
                    : 'text-emerald-600 bg-emerald-50 border-emerald-100'
                  }`}>
                  <Zap className={`w-4 h-4 ${isProcessing ? 'animate-pulse' : ''}`} />
                  <span className="text-sm font-bold">
                    {isProcessing ? 'معالجة...' : 'جاهز'}
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
              <TabsList className="bg-transparent border-none w-full grid grid-cols-3 h-12">
                <TabsTrigger
                  value="predictions"
                  className="rounded-xl data-[state=active]:bg-[#0ea5e9] data-[state=active]:text-white data-[state=active]:shadow-md transition-all gap-2 font-bold"
                >
                  <Target className="h-4 w-4" />
                  التنبؤ الذكي
                </TabsTrigger>
                <TabsTrigger
                  value="context"
                  className="rounded-xl data-[state=active]:bg-[#0ea5e9] data-[state=active]:text-white data-[state=active]:shadow-md transition-all gap-2 font-bold"
                >
                  <Eye className="h-4 w-4" />
                  الوعي السياقي
                </TabsTrigger>
                <TabsTrigger
                  value="alerts"
                  className="rounded-xl data-[state=active]:bg-[#0ea5e9] data-[state=active]:text-white data-[state=active]:shadow-md transition-all gap-2 font-bold"
                >
                  <Bell className="h-4 w-4" />
                  الإنذارات الذكية
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <TabsContent value="predictions" className="space-y-6">
                <PredictiveAnalytics />
              </TabsContent>

              <TabsContent value="context" className="space-y-6">
                <ContextAwareness />
              </TabsContent>

              <TabsContent value="alerts" className="space-y-6">
                <SmartAlerts />
              </TabsContent>
            </div>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default PredictiveIntelligencePage;