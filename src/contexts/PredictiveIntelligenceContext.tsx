import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useAIAnalytics } from './AIAnalyticsContext';

// Types for Predictive Intelligence System
export interface PredictionModel {
  id: string;
  name: string;
  type: 'performance' | 'engagement' | 'attendance' | 'completion' | 'behavior';
  accuracy: number;
  lastTrained: Date;
  status: 'active' | 'training' | 'inactive';
  parameters: Record<string, unknown>;
}

export interface UserPrediction {
  id: string;
  userId: string;
  predictionType: 'performance_drop' | 'engagement_decline' | 'absence_risk' | 'completion_failure' | 'behavioral_change';
  probability: number;
  confidence: number;
  timeframe: '1day' | '3days' | '1week' | '2weeks' | '1month';
  factors: string[];
  recommendations: string[];
  timestamp: Date;
  status: 'active' | 'resolved' | 'dismissed';
}

export interface ContextualData {
  userId: string;
  timestamp: Date;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  location: {
    province: string;
    institution?: string;
    coordinates?: { lat: number; lng: number };
  };
  timeContext: {
    hour: number;
    dayOfWeek: number;
    isWeekend: boolean;
    isHoliday: boolean;
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  };
  environmentalFactors: {
    weather?: string;
    temperature?: number;
    seasonality: 'spring' | 'summer' | 'autumn' | 'winter';
  };
  userState: {
    sessionDuration: number;
    previousActivity: string;
    energyLevel: 'high' | 'medium' | 'low';
    focusLevel: 'high' | 'medium' | 'low';
  };
}

export interface SmartAlert {
  id: string;
  type: 'prediction_warning' | 'pattern_detected' | 'intervention_needed' | 'success_opportunity';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  targetUsers: string[];
  targetRoles: string[];
  relatedPrediction?: string;
  actionable: boolean;
  actions?: {
    id: string;
    label: string;
    type: 'navigate' | 'notify' | 'schedule' | 'escalate';
    data: Record<string, unknown>;
  }[];
  timestamp: Date;
  expiresAt?: Date;
  status: 'active' | 'acknowledged' | 'resolved' | 'expired';
  metadata: Record<string, unknown>;
}

interface PredictiveIntelligenceContextType {
  // Prediction Models
  models: PredictionModel[];
  predictions: UserPrediction[];
  contextualData: ContextualData[];
  smartAlerts: SmartAlert[];
  
  // Context Awareness
  currentContext: ContextualData | null;
  contextualInsights: string[];
  
  // Prediction Methods
  generatePrediction: (userId: string, type: UserPrediction['predictionType']) => Promise<UserPrediction | null>;
  updatePredictionStatus: (predictionId: string, status: UserPrediction['status']) => void;
  getPredictionsForUser: (userId: string) => UserPrediction[];
  
  // Context Methods
  updateContext: (contextData: Partial<ContextualData>) => void;
  getContextualRecommendations: (userId: string) => string[];
  
  // Alert Methods
  createSmartAlert: (alert: Omit<SmartAlert, 'id' | 'timestamp'>) => void;
  acknowledgeAlert: (alertId: string) => void;
  resolveAlert: (alertId: string) => void;
  getAlertsForRole: (role: string) => SmartAlert[];
  
  // ML Training
  trainModel: (modelId: string) => Promise<void>;
  getModelAccuracy: (modelId: string) => number;
  
  // System Status
  isProcessing: boolean;
  lastUpdate: Date | null;
}

const PredictiveIntelligenceContext = createContext<PredictiveIntelligenceContextType | undefined>(undefined);

export const usePredictiveIntelligence = () => {
  const context = useContext(PredictiveIntelligenceContext);
  if (context === undefined) {
    throw new Error('usePredictiveIntelligence must be used within a PredictiveIntelligenceProvider');
  }
  return context;
};

interface PredictiveIntelligenceProviderProps {
  children: ReactNode;
}

export const PredictiveIntelligenceProvider: React.FC<PredictiveIntelligenceProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { activities, virtualSensors, metrics } = useAIAnalytics();
  
  const [models, setModels] = useState<PredictionModel[]>([
    {
      id: 'performance_model',
      name: 'نموذج توقع الأداء',
      type: 'performance',
      accuracy: 0.87,
      lastTrained: new Date(),
      status: 'active',
      parameters: { features: ['engagement', 'completion_rate', 'session_duration'], algorithm: 'random_forest' }
    },
    {
      id: 'engagement_model',
      name: 'نموذج توقع التفاعل',
      type: 'engagement',
      accuracy: 0.82,
      lastTrained: new Date(),
      status: 'active',
      parameters: { features: ['click_rate', 'time_spent', 'interaction_depth'], algorithm: 'neural_network' }
    },
    {
      id: 'attendance_model',
      name: 'نموذج توقع الحضور',
      type: 'attendance',
      accuracy: 0.91,
      lastTrained: new Date(),
      status: 'active',
      parameters: { features: ['historical_attendance', 'day_of_week', 'weather'], algorithm: 'gradient_boosting' }
    }
  ]);
  
  const [predictions, setPredictions] = useState<UserPrediction[]>([]);
  const [contextualData, setContextualData] = useState<ContextualData[]>([]);
  const [smartAlerts, setSmartAlerts] = useState<SmartAlert[]>([]);
  const [currentContext, setCurrentContext] = useState<ContextualData | null>(null);
  const [contextualInsights, setContextualInsights] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Initialize context awareness
  useEffect(() => {
    if (user) {
      const initializeContext = () => {
        const now = new Date();
        const hour = now.getHours();
        const dayOfWeek = now.getDay();
        
        const getTimeOfDay = (hour: number): 'morning' | 'afternoon' | 'evening' | 'night' => {
          if (hour >= 6 && hour < 12) return 'morning';
          if (hour >= 12 && hour < 18) return 'afternoon';
          if (hour >= 18 && hour < 22) return 'evening';
          return 'night';
        };

        const getSeason = (month: number): 'spring' | 'summer' | 'autumn' | 'winter' => {
          if (month >= 3 && month <= 5) return 'spring';
          if (month >= 6 && month <= 8) return 'summer';
          if (month >= 9 && month <= 11) return 'autumn';
          return 'winter';
        };

        const context: ContextualData = {
          userId: user.id,
          timestamp: now,
          deviceType: window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop',
          location: {
            province: user.province || 'الجزائر',
            institution: user.school || user.institution
          },
          timeContext: {
            hour,
            dayOfWeek,
            isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
            isHoliday: false, // TODO: Implement holiday detection
            timeOfDay: getTimeOfDay(hour)
          },
          environmentalFactors: {
            seasonality: getSeason(now.getMonth())
          },
          userState: {
            sessionDuration: 0,
            previousActivity: 'login',
            energyLevel: hour >= 9 && hour <= 15 ? 'high' : hour >= 16 && hour <= 20 ? 'medium' : 'low',
            focusLevel: hour >= 10 && hour <= 12 || hour >= 14 && hour <= 16 ? 'high' : 'medium'
          }
        };

        setCurrentContext(context);
        setContextualData(prev => [...prev.slice(-99), context]);
      };

      initializeContext();
    }
  }, [user]);

  // Generate contextual insights
  useEffect(() => {
    if (currentContext && activities.length > 0) {
      const insights: string[] = [];
      
      // Time-based insights
      if (currentContext.timeContext.timeOfDay === 'morning') {
        insights.push('الصباح هو أفضل وقت للأنشطة التي تتطلب تركيزاً عالياً');
      } else if (currentContext.timeContext.timeOfDay === 'afternoon') {
        insights.push('فترة بعد الظهر مناسبة للأنشطة التفاعلية والجماعية');
      } else if (currentContext.timeContext.timeOfDay === 'evening') {
        insights.push('المساء مناسب لمراجعة الإنجازات والتخطيط');
      }

      // Device-based insights
      if (currentContext.deviceType === 'mobile') {
        insights.push('الأنشطة القصيرة والتفاعلية أكثر مناسبة للهاتف المحمول');
      } else if (currentContext.deviceType === 'desktop') {
        insights.push('يمكن الاستفادة من الشاشة الكبيرة للأنشطة المعقدة');
      }

      // Energy level insights
      if (currentContext.userState.energyLevel === 'high') {
        insights.push('مستوى الطاقة عالي - وقت مثالي للتحديات الصعبة');
      } else if (currentContext.userState.energyLevel === 'low') {
        insights.push('مستوى الطاقة منخفض - يُنصح بالأنشطة الخفيفة');
      }

      setContextualInsights(insights);
    }
  }, [currentContext, activities]);

  // Auto-generate predictions based on patterns
  useEffect(() => {
    const generateAutoPredictions = async () => {
      if (!user || activities.length < 10) return; // Need minimum data

      setIsProcessing(true);

      try {
        // Analyze recent activity patterns
        const recentActivities = activities.slice(-50);
        const recentSensors = virtualSensors.slice(-30);

        // Check for engagement decline pattern
        const engagementTrend = recentSensors
          .filter(s => s.type === 'engagement')
          .slice(-5)
          .map(s => s.value);

        if (engagementTrend.length >= 3) {
          const isDecreasing = engagementTrend.every((val, i) => 
            i === 0 || val <= engagementTrend[i - 1]
          );
          
          if (isDecreasing && engagementTrend[engagementTrend.length - 1] < 50) {
            const prediction: UserPrediction = {
              id: `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              userId: user.id,
              predictionType: 'engagement_decline',
              probability: 0.75,
              confidence: 0.82,
              timeframe: '3days',
              factors: ['انخفاض مستمر في التفاعل', 'قلة النشاط', 'انخفاض مدة الجلسات'],
              recommendations: [
                'اقتراح أنشطة تفاعلية جديدة',
                'إرسال تحفيز شخصي',
                'تنويع المحتوى المقدم'
              ],
              timestamp: new Date(),
              status: 'active'
            };

            setPredictions(prev => [...prev.slice(-49), prediction]);

            // Create smart alert
            createSmartAlert({
              type: 'prediction_warning',
              priority: 'medium',
              title: 'توقع انخفاض في التفاعل',
              message: `المستخدم ${user.name} قد يواجه انخفاضاً في التفاعل خلال الأيام القادمة`,
              targetUsers: [user.id],
              targetRoles: user.role === 'student' ? ['teacher', 'parent'] : ['admin'],
              relatedPrediction: prediction.id,
              actionable: true,
              actions: [
                {
                  id: 'send_motivation',
                  label: 'إرسال رسالة تحفيزية',
                  type: 'notify',
                  data: { userId: user.id, type: 'motivation' }
                }
              ],
              status: 'active',
              metadata: { predictionId: prediction.id }
            });
          }
        }

        // Check for performance drop pattern
        const performanceTrend = recentSensors
          .filter(s => s.type === 'performance')
          .slice(-5)
          .map(s => s.value);

        if (performanceTrend.length >= 3) {
          const avgPerformance = performanceTrend.reduce((sum, val) => sum + val, 0) / performanceTrend.length;
          
          if (avgPerformance < 60) {
            const prediction: UserPrediction = {
              id: `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              userId: user.id,
              predictionType: 'performance_drop',
              probability: 0.68,
              confidence: 0.79,
              timeframe: '1week',
              factors: ['انخفاض الأداء العام', 'صعوبة في إكمال المهام', 'قلة التركيز'],
              recommendations: [
                'مراجعة المحتوى التعليمي',
                'تقديم دعم إضافي',
                'تبسيط المهام المطلوبة'
              ],
              timestamp: new Date(),
              status: 'active'
            };

            setPredictions(prev => [...prev.slice(-49), prediction]);
          }
        }

      } catch (error) {
        console.error('Error generating predictions:', error);
      } finally {
        setIsProcessing(false);
        setLastUpdate(new Date());
      }
    };

    const interval = setInterval(generateAutoPredictions, 30000); // Every 30 seconds
    generateAutoPredictions(); // Initial run

    return () => clearInterval(interval);
  }, [activities, virtualSensors, user]);

  const generatePrediction = async (userId: string, type: UserPrediction['predictionType']): Promise<UserPrediction | null> => {
    setIsProcessing(true);

    try {
      // Simulate ML model prediction
      await new Promise(resolve => setTimeout(resolve, 1000));

      const prediction: UserPrediction = {
        id: `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        predictionType: type,
        probability: 0.6 + Math.random() * 0.4, // 60-100%
        confidence: 0.7 + Math.random() * 0.3, // 70-100%
        timeframe: ['1day', '3days', '1week', '2weeks', '1month'][Math.floor(Math.random() * 5)] as UserPrediction['timeframe'],
        factors: ['عامل 1', 'عامل 2', 'عامل 3'],
        recommendations: ['توصية 1', 'توصية 2', 'توصية 3'],
        timestamp: new Date(),
        status: 'active'
      };

      setPredictions(prev => [...prev.slice(-49), prediction]);
      return prediction;
    } catch (error) {
      console.error('Error generating prediction:', error);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const updatePredictionStatus = (predictionId: string, status: UserPrediction['status']) => {
    setPredictions(prev => 
      prev.map(p => p.id === predictionId ? { ...p, status } : p)
    );
  };

  const getPredictionsForUser = (userId: string): UserPrediction[] => {
    return predictions.filter(p => p.userId === userId && p.status === 'active');
  };

  const updateContext = (contextData: Partial<ContextualData>) => {
    if (currentContext) {
      const updatedContext = { ...currentContext, ...contextData, timestamp: new Date() };
      setCurrentContext(updatedContext);
      setContextualData(prev => [...prev.slice(-99), updatedContext]);
    }
  };

  const getContextualRecommendations = (userId: string): string[] => {
    if (!currentContext) return [];

    const recommendations: string[] = [];

    // Time-based recommendations
    if (currentContext.timeContext.timeOfDay === 'morning') {
      recommendations.push('ابدأ بالأنشطة التي تتطلب تركيزاً عالياً');
    } else if (currentContext.timeContext.timeOfDay === 'evening') {
      recommendations.push('راجع إنجازاتك اليومية');
    }

    // Device-based recommendations
    if (currentContext.deviceType === 'mobile') {
      recommendations.push('جرب الأنشطة التفاعلية السريعة');
    }

    return recommendations;
  };

  const createSmartAlert = (alert: Omit<SmartAlert, 'id' | 'timestamp'>) => {
    const newAlert: SmartAlert = {
      ...alert,
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };

    setSmartAlerts(prev => [...prev.slice(-99), newAlert]);
    console.log('🔔 Smart Alert Created:', newAlert);
  };

  const acknowledgeAlert = (alertId: string) => {
    setSmartAlerts(prev =>
      prev.map(alert => 
        alert.id === alertId ? { ...alert, status: 'acknowledged' } : alert
      )
    );
  };

  const resolveAlert = (alertId: string) => {
    setSmartAlerts(prev =>
      prev.map(alert => 
        alert.id === alertId ? { ...alert, status: 'resolved' } : alert
      )
    );
  };

  const getAlertsForRole = (role: string): SmartAlert[] => {
    return smartAlerts.filter(alert => 
      alert.targetRoles.includes(role) && alert.status === 'active'
    );
  };

  const trainModel = async (modelId: string): Promise<void> => {
    setIsProcessing(true);
    
    try {
      // Simulate model training
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setModels(prev =>
        prev.map(model =>
          model.id === modelId
            ? {
                ...model,
                status: 'active',
                accuracy: Math.min(0.95, model.accuracy + 0.02 + Math.random() * 0.03),
                lastTrained: new Date()
              }
            : model
        )
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const getModelAccuracy = (modelId: string): number => {
    const model = models.find(m => m.id === modelId);
    return model?.accuracy || 0;
  };

  const value: PredictiveIntelligenceContextType = {
    models,
    predictions,
    contextualData,
    smartAlerts,
    currentContext,
    contextualInsights,
    generatePrediction,
    updatePredictionStatus,
    getPredictionsForUser,
    updateContext,
    getContextualRecommendations,
    createSmartAlert,
    acknowledgeAlert,
    resolveAlert,
    getAlertsForRole,
    trainModel,
    getModelAccuracy,
    isProcessing,
    lastUpdate
  };

  return (
    <PredictiveIntelligenceContext.Provider value={value}>
      {children}
    </PredictiveIntelligenceContext.Provider>
  );
};