import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAIAnalytics } from '@/contexts/AIAnalyticsContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Lightbulb, 
  AlertTriangle, 
  TrendingUp, 
  Target, 
  Brain,
  Star,
  Clock,
  Users,
  BookOpen,
  Trophy,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

interface SmartRecommendation {
  id: string;
  title: string;
  description: string;
  category: 'learning' | 'engagement' | 'performance' | 'social' | 'system';
  priority: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  actionable: boolean;
  estimatedImpact: 'low' | 'medium' | 'high';
  timeToImplement: string;
  resources: string[];
}

export const SmartInsightsPanel: React.FC = () => {
  const { insights, metrics, generateInsight } = useAIAnalytics();
  const { user } = useAuth();
  const [smartRecommendations, setSmartRecommendations] = useState<SmartRecommendation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate smart recommendations based on current metrics
  useEffect(() => {
    const generateSmartRecommendations = () => {
      const recommendations: SmartRecommendation[] = [];

      // Engagement recommendations
      if (metrics.engagementRate < 50) {
        recommendations.push({
          id: 'eng_low_1',
          title: 'تحسين معدل التفاعل',
          description: 'معدل التفاعل منخفض. يُنصح بإضافة عناصر تفاعلية أكثر مثل الألعاب والأنشطة التفاعلية.',
          category: 'engagement',
          priority: 'high',
          confidence: 0.85,
          actionable: true,
          estimatedImpact: 'high',
          timeToImplement: '1-2 أسابيع',
          resources: ['فريق التطوير', 'مصمم UX', 'محتوى تفاعلي']
        });
      }

      // Performance recommendations
      if (metrics.completionRate < 60) {
        recommendations.push({
          id: 'perf_low_1',
          title: 'تحسين معدل الإنجاز',
          description: 'معدل إنجاز المهام منخفض. يُنصح بتبسيط المهام وإضافة نظام مكافآت تحفيزي.',
          category: 'performance',
          priority: 'medium',
          confidence: 0.78,
          actionable: true,
          estimatedImpact: 'medium',
          timeToImplement: '2-3 أسابيع',
          resources: ['فريق المحتوى', 'خبير تعليمي', 'نظام المكافآت']
        });
      }

      // Learning recommendations
      if (metrics.learningProgress < 70) {
        recommendations.push({
          id: 'learn_1',
          title: 'تخصيص المسارات التعليمية',
          description: 'تقدم التعلم يمكن تحسينه من خلال تخصيص المحتوى حسب مستوى كل متعلم.',
          category: 'learning',
          priority: 'medium',
          confidence: 0.82,
          actionable: true,
          estimatedImpact: 'high',
          timeToImplement: '3-4 أسابيع',
          resources: ['خوارزمية AI', 'محتوى متدرج', 'نظام تقييم']
        });
      }

      // Social recommendations
      if (metrics.socialInteraction < 40) {
        recommendations.push({
          id: 'social_1',
          title: 'تعزيز التفاعل الاجتماعي',
          description: 'التفاعل الاجتماعي منخفض. يُنصح بإضافة منتديات نقاش ومشاريع جماعية.',
          category: 'social',
          priority: 'low',
          confidence: 0.75,
          actionable: true,
          estimatedImpact: 'medium',
          timeToImplement: '2-3 أسابيع',
          resources: ['منصة تواصل', 'مشرف مجتمع', 'أنشطة جماعية']
        });
      }

      // High performance recommendations
      if (metrics.engagementRate > 80 && metrics.completionRate > 80) {
        recommendations.push({
          id: 'excel_1',
          title: 'توسيع النجاح',
          description: 'الأداء ممتاز! يُنصح بتوسيع هذا النموذج لمناطق أخرى وإضافة تحديات متقدمة.',
          category: 'system',
          priority: 'low',
          confidence: 0.90,
          actionable: true,
          estimatedImpact: 'high',
          timeToImplement: '4-6 أسابيع',
          resources: ['فريق التوسع', 'تحليل البيانات', 'محتوى متقدم']
        });
      }

      setSmartRecommendations(recommendations);
    };

    generateSmartRecommendations();
  }, [metrics]);

  const handleGenerateInsights = async () => {
    setIsGenerating(true);
    
    // Simulate AI insight generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newInsights = [
      {
        type: 'pattern' as const,
        title: 'نمط تعلم جديد مكتشف',
        description: 'تم اكتشاف أن المتعلمين أكثر نشاطاً في فترة ما بعد الظهر',
        priority: 'medium' as const,
        confidence: 0.87,
        actionable: true,
        metadata: { pattern: 'afternoon_peak', timeRange: '14:00-16:00' }
      },
      {
        type: 'recommendation' as const,
        title: 'تحسين توقيت المحتوى',
        description: 'يُنصح بجدولة المحتوى المهم في أوقات الذروة',
        priority: 'low' as const,
        confidence: 0.73,
        actionable: true,
        metadata: { optimization: 'content_scheduling' }
      }
    ];

    newInsights.forEach(insight => generateInsight(insight));
    setIsGenerating(false);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'learning': return <BookOpen className="h-4 w-4" />;
      case 'engagement': return <Users className="h-4 w-4" />;
      case 'performance': return <TrendingUp className="h-4 w-4" />;
      case 'social': return <Users className="h-4 w-4" />;
      case 'system': return <Brain className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const recentInsights = insights.slice(-8).reverse();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">الرؤى الذكية والتوصيات</h2>
          <p className="text-muted-foreground">تحليلات وتوصيات مدعومة بالذكاء الاصطناعي</p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleGenerateInsights}
          disabled={isGenerating}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
          توليد رؤى جديدة
        </Button>
      </div>

      {/* Smart Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              التوصيات الذكية
            </CardTitle>
            <CardDescription>
              توصيات مخصصة بناءً على تحليل الأداء الحالي
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {smartRecommendations.length > 0 ? (
                smartRecommendations.map((rec) => (
                  <div key={rec.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(rec.category)}
                        <h4 className="font-medium text-sm">{rec.title}</h4>
                      </div>
                      <Badge variant={getPriorityColor(rec.priority) as 'destructive' | 'default' | 'secondary'}>
                        {rec.priority === 'critical' ? 'حرج' :
                         rec.priority === 'high' ? 'عالي' :
                         rec.priority === 'medium' ? 'متوسط' : 'منخفض'}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-muted-foreground">التأثير المتوقع:</span>
                        <span className={`ml-1 font-medium ${getImpactColor(rec.estimatedImpact)}`}>
                          {rec.estimatedImpact === 'high' ? 'عالي' :
                           rec.estimatedImpact === 'medium' ? 'متوسط' : 'منخفض'}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">وقت التنفيذ:</span>
                        <span className="ml-1 font-medium">{rec.timeToImplement}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span className="text-xs text-muted-foreground">
                          {Math.round(rec.confidence * 100)}% ثقة
                        </span>
                      </div>
                      {rec.actionable && (
                        <Button size="sm" variant="outline" className="text-xs">
                          تطبيق
                          <ArrowRight className="h-3 w-3 mr-1" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="text-xs">
                      <span className="text-muted-foreground">الموارد المطلوبة:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {rec.resources.map((resource, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {resource}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>لا توجد توصيات حالياً</p>
                  <p className="text-xs">سيتم توليد التوصيات بناءً على البيانات المتاحة</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              الرؤى الحديثة
            </CardTitle>
            <CardDescription>
              آخر الاكتشافات والأنماط المرصودة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {recentInsights.length > 0 ? (
                recentInsights.map((insight) => (
                  <div key={insight.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {insight.type === 'alert' && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                        {insight.type === 'recommendation' && <Lightbulb className="h-4 w-4 text-blue-500" />}
                        {insight.type === 'pattern' && <TrendingUp className="h-4 w-4 text-green-500" />}
                        {insight.type === 'prediction' && <Brain className="h-4 w-4 text-purple-500" />}
                        <Badge variant="outline" className="text-xs">
                          {insight.type === 'alert' ? 'تنبيه' :
                           insight.type === 'recommendation' ? 'توصية' :
                           insight.type === 'pattern' ? 'نمط' : 'توقع'}
                        </Badge>
                      </div>
                      <Badge variant={getPriorityColor(insight.priority) as 'destructive' | 'default' | 'secondary'}>
                        {insight.priority === 'critical' ? 'حرج' :
                         insight.priority === 'high' ? 'عالي' :
                         insight.priority === 'medium' ? 'متوسط' : 'منخفض'}
                      </Badge>
                    </div>
                    
                    <h4 className="font-medium text-sm mb-1">{insight.title}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{insight.description}</p>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span className="text-muted-foreground">
                          {new Date(insight.timestamp).toLocaleString('ar-SA')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span className="text-muted-foreground">
                          {Math.round(insight.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                    
                    {insight.actionable && (
                      <div className="mt-2 pt-2 border-t">
                        <Badge variant="outline" className="text-xs">
                          <Trophy className="h-3 w-3 mr-1" />
                          قابل للتنفيذ
                        </Badge>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>لا توجد رؤى حديثة</p>
                  <p className="text-xs">ستظهر الرؤى بناءً على تحليل النشاط</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights Summary */}
      <Card>
        <CardHeader>
          <CardTitle>ملخص الرؤى</CardTitle>
          <CardDescription>
            إحصائيات شاملة للرؤى والتوصيات المولدة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{insights.length}</div>
              <p className="text-sm text-muted-foreground">إجمالي الرؤى</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {insights.filter(i => i.actionable).length}
              </div>
              <p className="text-sm text-muted-foreground">قابلة للتنفيذ</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {insights.filter(i => i.priority === 'high' || i.priority === 'critical').length}
              </div>
              <p className="text-sm text-muted-foreground">أولوية عالية</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {smartRecommendations.length}
              </div>
              <p className="text-sm text-muted-foreground">توصيات ذكية</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartInsightsPanel;