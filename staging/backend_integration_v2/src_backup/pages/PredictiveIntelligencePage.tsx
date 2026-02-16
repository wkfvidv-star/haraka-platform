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
                  <Brain className="h-6 w-6 text-purple-600" />
                  الذكاء التنبؤي - منصة حركة
                </h1>
                <p className="text-muted-foreground text-sm">
                  المرحلة الثانية: نظام التنبؤ والوعي السياقي المتقدم
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {activePredictions.length > 0 && (
                <Badge variant="destructive">
                  {activePredictions.length} تنبؤ نشط
                </Badge>
              )}
              {activeAlerts.length > 0 && (
                <Badge variant="secondary">
                  {activeAlerts.length} تنبيه
                </Badge>
              )}
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${
                isProcessing 
                  ? 'text-blue-600 bg-blue-50 border-blue-200' 
                  : 'text-green-600 bg-green-50 border-green-200'
              }`}>
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {isProcessing ? 'معالجة...' : 'جاهز'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="predictions" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              التنبؤ الذكي
            </TabsTrigger>
            <TabsTrigger value="context" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              الوعي السياقي
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              الإنذارات الذكية
            </TabsTrigger>
          </TabsList>

          <TabsContent value="predictions" className="space-y-6">
            <PredictiveAnalytics />
          </TabsContent>

          <TabsContent value="context" className="space-y-6">
            <ContextAwareness />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <SmartAlerts />
          </TabsContent>
        </Tabs>
      </div>

      {/* System Status Footer */}
      <div className="border-t bg-muted/30 mt-12">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>المرحلة الثانية من تطوير منصة حركة</span>
              <span>•</span>
              <span>نظام الذكاء التنبؤي والوعي السياقي</span>
            </div>
            <div className="flex items-center gap-4">
              <span>المستخدم: {user?.name}</span>
              <span>•</span>
              <span>الدور: {user?.role}</span>
              <span>•</span>
              <span>البيئة: {user?.environment === 'school' ? 'مدرسية' : 'مجتمعية'}</span>
              {currentContext && (
                <>
                  <span>•</span>
                  <span>السياق: {
                    currentContext.timeContext.timeOfDay === 'morning' ? 'صباح' :
                    currentContext.timeContext.timeOfDay === 'afternoon' ? 'ظهيرة' :
                    currentContext.timeContext.timeOfDay === 'evening' ? 'مساء' : 'ليل'
                  }</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictiveIntelligencePage;