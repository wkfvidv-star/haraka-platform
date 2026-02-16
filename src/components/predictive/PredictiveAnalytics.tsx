import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { usePredictiveIntelligence } from '@/contexts/PredictiveIntelligenceContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Clock,
  Zap,
  Eye,
  CheckCircle,
  XCircle,
  RefreshCw,
  Lightbulb,
  BarChart3
} from 'lucide-react';

export const PredictiveAnalytics: React.FC = () => {
  const { 
    models, 
    predictions, 
    generatePrediction, 
    updatePredictionStatus,
    trainModel,
    isProcessing,
    lastUpdate 
  } = usePredictiveIntelligence();
  const { user } = useAuth();
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [trainingModel, setTrainingModel] = useState<string | null>(null);

  const activePredictions = predictions.filter(p => p.status === 'active');
  const userPredictions = user ? predictions.filter(p => p.userId === user.id) : [];

  const handleTrainModel = async (modelId: string) => {
    setTrainingModel(modelId);
    await trainModel(modelId);
    setTrainingModel(null);
  };

  const handleGeneratePrediction = async (type: 'performance_drop' | 'engagement_decline') => {
    if (user) {
      await generatePrediction(user.id, type);
    }
  };

  const getPredictionTypeLabel = (type: string) => {
    switch (type) {
      case 'performance_drop': return 'انخفاض الأداء';
      case 'engagement_decline': return 'تراجع التفاعل';
      case 'absence_risk': return 'خطر الغياب';
      case 'completion_failure': return 'فشل الإنجاز';
      case 'behavioral_change': return 'تغيير سلوكي';
      default: return type;
    }
  };

  const getTimeframeLabel = (timeframe: string) => {
    switch (timeframe) {
      case '1day': return 'خلال يوم';
      case '3days': return 'خلال 3 أيام';
      case '1week': return 'خلال أسبوع';
      case '2weeks': return 'خلال أسبوعين';
      case '1month': return 'خلال شهر';
      default: return timeframe;
    }
  };

  const getPriorityColor = (probability: number) => {
    if (probability > 0.8) return 'text-red-600 bg-red-50 border-red-200';
    if (probability > 0.6) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-blue-600 bg-blue-50 border-blue-200';
  };

  const getModelStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'training': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'inactive': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">نظام التنبؤ الذكي</h2>
          <p className="text-muted-foreground">خوارزميات تعلم الآلة للتنبؤ بالأداء والسلوك</p>
        </div>
        <div className="flex items-center gap-2">
          {isProcessing && (
            <div className="flex items-center gap-2 text-blue-600">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span className="text-sm">معالجة...</span>
            </div>
          )}
          {lastUpdate && (
            <span className="text-xs text-muted-foreground">
              آخر تحديث: {lastUpdate.toLocaleTimeString('ar-SA')}
            </span>
          )}
        </div>
      </div>

      {/* ML Models Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {models.map((model) => (
          <Card key={model.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{model.name}</CardTitle>
                <Badge className={getModelStatusColor(model.status)}>
                  {model.status === 'active' ? 'نشط' :
                   model.status === 'training' ? 'تدريب' : 'غير نشط'}
                </Badge>
              </div>
              <CardDescription>
                نموذج {model.type} - دقة {(model.accuracy * 100).toFixed(1)}%
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>دقة النموذج</span>
                    <span>{(model.accuracy * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={model.accuracy * 100} className="h-2" />
                </div>
                
                <div className="text-xs text-muted-foreground">
                  <p>آخر تدريب: {model.lastTrained.toLocaleDateString('ar-SA')}</p>
                  <p>الخوارزمية: {model.parameters.algorithm as string}</p>
                </div>
                
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleTrainModel(model.id)}
                  disabled={trainingModel === model.id || model.status === 'training'}
                >
                  {trainingModel === model.id ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      جاري التدريب...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      إعادة تدريب
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Current Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              التنبؤات النشطة
            </CardTitle>
            <CardDescription>
              التنبؤات الحالية للمستخدمين ({activePredictions.length})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activePredictions.length > 0 ? (
                activePredictions.slice(0, 5).map((prediction) => (
                  <div key={prediction.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-sm">
                          {getPredictionTypeLabel(prediction.predictionType)}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {getTimeframeLabel(prediction.timeframe)}
                        </p>
                      </div>
                      <Badge className={getPriorityColor(prediction.probability)}>
                        {(prediction.probability * 100).toFixed(0)}% احتمال
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>مستوى الثقة</span>
                          <span>{(prediction.confidence * 100).toFixed(0)}%</span>
                        </div>
                        <Progress value={prediction.confidence * 100} className="h-1" />
                      </div>
                    </div>
                    
                    <div className="text-xs">
                      <p className="font-medium mb-1">العوامل المؤثرة:</p>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {prediction.factors.slice(0, 2).map((factor, idx) => (
                          <li key={idx}>{factor}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updatePredictionStatus(prediction.id, 'resolved')}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        حُل
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updatePredictionStatus(prediction.id, 'dismissed')}
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        تجاهل
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>لا توجد تنبؤات نشطة حالياً</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              توليد تنبؤات جديدة
            </CardTitle>
            <CardDescription>
              إنشاء تنبؤات مخصصة باستخدام نماذج التعلم الآلي
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <Button 
                  variant="outline" 
                  className="h-16 flex-col gap-2"
                  onClick={() => handleGeneratePrediction('performance_drop')}
                  disabled={isProcessing}
                >
                  <TrendingUp className="h-5 w-5 text-red-500" />
                  <span className="text-sm">توقع انخفاض الأداء</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-16 flex-col gap-2"
                  onClick={() => handleGeneratePrediction('engagement_decline')}
                  disabled={isProcessing}
                >
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm">توقع تراجع التفاعل</span>
                </Button>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium text-sm mb-3">إحصائيات التنبؤ</h4>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">{predictions.length}</div>
                    <div className="text-xs text-muted-foreground">إجمالي التنبؤات</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                      {predictions.filter(p => p.status === 'resolved').length}
                    </div>
                    <div className="text-xs text-muted-foreground">تنبؤات محلولة</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Personal Predictions (if user) */}
      {user && userPredictions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              تنبؤاتك الشخصية
            </CardTitle>
            <CardDescription>
              التنبؤات المتعلقة بأدائك وتفاعلك
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userPredictions.map((prediction) => (
                <div key={prediction.id} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">
                      {getPredictionTypeLabel(prediction.predictionType)}
                    </h4>
                    <Badge variant="outline">
                      {getTimeframeLabel(prediction.timeframe)}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span>احتمال الحدوث</span>
                      <span>{(prediction.probability * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={prediction.probability * 100} className="h-2" />
                  </div>
                  
                  <div className="text-sm">
                    <p className="font-medium mb-2">التوصيات:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {prediction.recommendations.map((rec, idx) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Model Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            أداء النماذج
          </CardTitle>
          <CardDescription>
            مقاييس دقة وأداء نماذج التعلم الآلي
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {models.map((model) => (
              <div key={model.id} className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {(model.accuracy * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  {model.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  آخر تدريب: {model.lastTrained.toLocaleDateString('ar-SA')}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictiveAnalytics;