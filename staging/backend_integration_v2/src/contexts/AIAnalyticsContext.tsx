import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

// Types for AI Analytics System
export interface UserActivity {
  id: string;
  userId: string;
  sessionId: string;
  timestamp: Date;
  activityType: 'click' | 'view' | 'interaction' | 'exercise' | 'completion' | 'navigation';
  component: string;
  duration?: number;
  metadata?: Record<string, unknown>;
}

export interface VirtualSensor {
  id: string;
  type: 'engagement' | 'performance' | 'behavior' | 'learning' | 'social';
  value: number;
  status: 'green' | 'yellow' | 'red';
  timestamp: Date;
  userId: string;
  context: string;
}

export interface AIInsight {
  id: string;
  type: 'recommendation' | 'alert' | 'pattern' | 'prediction';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  timestamp: Date;
  userId?: string;
  actionable: boolean;
  metadata?: Record<string, unknown>;
}

export interface AnalyticsMetrics {
  totalUsers: number;
  activeUsers: number;
  engagementRate: number;
  averageSessionDuration: number;
  completionRate: number;
  performanceScore: number;
  learningProgress: number;
  socialInteraction: number;
}

interface AIAnalyticsContextType {
  // Core Analytics
  activities: UserActivity[];
  virtualSensors: VirtualSensor[];
  insights: AIInsight[];
  metrics: AnalyticsMetrics;
  
  // Real-time tracking
  isTracking: boolean;
  currentSession: string;
  
  // Methods
  trackActivity: (activity: Omit<UserActivity, 'id' | 'timestamp' | 'sessionId'>) => void;
  updateVirtualSensor: (sensor: Omit<VirtualSensor, 'id' | 'timestamp'>) => void;
  generateInsight: (insight: Omit<AIInsight, 'id' | 'timestamp'>) => void;
  getAnalytics: (timeRange?: string) => AnalyticsMetrics;
  getEngagementStatus: () => 'green' | 'yellow' | 'red';
  startTracking: () => void;
  stopTracking: () => void;
  
  // IoT Layer
  sendToAIHub: (data: Record<string, unknown>) => void;
  subscribeToAIHub: (callback: (data: Record<string, unknown>) => void) => void;
}

const AIAnalyticsContext = createContext<AIAnalyticsContextType | undefined>(undefined);

export const useAIAnalytics = () => {
  const context = useContext(AIAnalyticsContext);
  if (context === undefined) {
    throw new Error('useAIAnalytics must be used within an AIAnalyticsProvider');
  }
  return context;
};

interface AIAnalyticsProviderProps {
  children: ReactNode;
}

export const AIAnalyticsProvider: React.FC<AIAnalyticsProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [virtualSensors, setVirtualSensors] = useState<VirtualSensor[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [metrics, setMetrics] = useState<AnalyticsMetrics>({
    totalUsers: 0,
    activeUsers: 0,
    engagementRate: 0,
    averageSessionDuration: 0,
    completionRate: 0,
    performanceScore: 0,
    learningProgress: 0,
    socialInteraction: 0
  });
  const [isTracking, setIsTracking] = useState(false);
  const [currentSession] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [aiHubSubscribers, setAiHubSubscribers] = useState<((data: Record<string, unknown>) => void)[]>([]);

  // Initialize tracking when user logs in
  useEffect(() => {
    if (user && !isTracking) {
      startTracking();
    }
  }, [user]);

  // Real-time analytics calculation
  useEffect(() => {
    const calculateMetrics = () => {
      const now = new Date();
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      
      const recentActivities = activities.filter(a => new Date(a.timestamp) > last24Hours);
      const recentSensors = virtualSensors.filter(s => new Date(s.timestamp) > last24Hours);
      
      const uniqueUsers = new Set(recentActivities.map(a => a.userId)).size;
      const totalSessions = new Set(recentActivities.map(a => a.sessionId)).size;
      
      const engagementSensors = recentSensors.filter(s => s.type === 'engagement');
      const performanceSensors = recentSensors.filter(s => s.type === 'performance');
      const learningSensors = recentSensors.filter(s => s.type === 'learning');
      const socialSensors = recentSensors.filter(s => s.type === 'social');
      
      const avgEngagement = engagementSensors.length > 0 
        ? engagementSensors.reduce((sum, s) => sum + s.value, 0) / engagementSensors.length 
        : 0;
      
      const avgPerformance = performanceSensors.length > 0
        ? performanceSensors.reduce((sum, s) => sum + s.value, 0) / performanceSensors.length
        : 0;
      
      const avgLearning = learningSensors.length > 0
        ? learningSensors.reduce((sum, s) => sum + s.value, 0) / learningSensors.length
        : 0;
      
      const avgSocial = socialSensors.length > 0
        ? socialSensors.reduce((sum, s) => sum + s.value, 0) / socialSensors.length
        : 0;

      const sessionDurations = recentActivities
        .filter(a => a.duration)
        .map(a => a.duration || 0);
      
      const avgSessionDuration = sessionDurations.length > 0
        ? sessionDurations.reduce((sum, d) => sum + d, 0) / sessionDurations.length
        : 0;

      const completionActivities = recentActivities.filter(a => a.activityType === 'completion');
      const completionRate = recentActivities.length > 0 
        ? (completionActivities.length / recentActivities.length) * 100 
        : 0;

      setMetrics({
        totalUsers: uniqueUsers,
        activeUsers: totalSessions,
        engagementRate: avgEngagement,
        averageSessionDuration: avgSessionDuration,
        completionRate: completionRate,
        performanceScore: avgPerformance,
        learningProgress: avgLearning,
        socialInteraction: avgSocial
      });
    };

    const interval = setInterval(calculateMetrics, 5000); // Update every 5 seconds
    calculateMetrics(); // Initial calculation

    return () => clearInterval(interval);
  }, [activities, virtualSensors]);

  const trackActivity = (activity: Omit<UserActivity, 'id' | 'timestamp' | 'sessionId'>) => {
    if (!isTracking || !user) return;

    const newActivity: UserActivity = {
      ...activity,
      id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      sessionId: currentSession,
      userId: activity.userId || user.id
    };

    setActivities(prev => [...prev.slice(-999), newActivity]); // Keep last 1000 activities

    // Auto-generate virtual sensors based on activity
    generateVirtualSensorsFromActivity(newActivity);

    // Send to AI Hub
    sendToAIHub({
      type: 'activity',
      data: newActivity,
      source: 'user_tracking'
    });
  };

  const generateVirtualSensorsFromActivity = (activity: UserActivity) => {
    const sensors: Omit<VirtualSensor, 'id' | 'timestamp'>[] = [];

    // Engagement sensor
    let engagementValue = 50;
    if (activity.activityType === 'interaction') engagementValue = 80;
    if (activity.activityType === 'completion') engagementValue = 90;
    if (activity.duration && activity.duration > 300000) engagementValue += 20; // 5+ minutes

    sensors.push({
      type: 'engagement',
      value: Math.min(100, engagementValue),
      status: engagementValue > 70 ? 'green' : engagementValue > 40 ? 'yellow' : 'red',
      userId: activity.userId,
      context: activity.component
    });

    // Performance sensor for exercise activities
    if (activity.activityType === 'exercise' || activity.activityType === 'completion') {
      const performanceValue = 60 + Math.random() * 40; // Random performance 60-100
      sensors.push({
        type: 'performance',
        value: performanceValue,
        status: performanceValue > 80 ? 'green' : performanceValue > 60 ? 'yellow' : 'red',
        userId: activity.userId,
        context: activity.component
      });
    }

    // Learning sensor
    if (activity.activityType === 'view' || activity.activityType === 'completion') {
      const learningValue = 40 + (activity.duration ? Math.min(60, activity.duration / 10000) : 20);
      sensors.push({
        type: 'learning',
        value: learningValue,
        status: learningValue > 70 ? 'green' : learningValue > 50 ? 'yellow' : 'red',
        userId: activity.userId,
        context: activity.component
      });
    }

    sensors.forEach(sensor => updateVirtualSensor(sensor));
  };

  const updateVirtualSensor = (sensor: Omit<VirtualSensor, 'id' | 'timestamp'>) => {
    const newSensor: VirtualSensor = {
      ...sensor,
      id: `sensor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };

    setVirtualSensors(prev => [...prev.slice(-499), newSensor]); // Keep last 500 sensors

    // Auto-generate insights based on sensor patterns
    generateInsightsFromSensor(newSensor);

    // Send to AI Hub
    sendToAIHub({
      type: 'sensor',
      data: newSensor,
      source: 'virtual_sensors'
    });
  };

  const generateInsightsFromSensor = (sensor: VirtualSensor) => {
    // Generate insights based on sensor status and patterns
    if (sensor.status === 'red' && sensor.value < 30) {
      generateInsight({
        type: 'alert',
        title: 'انخفاض في مستوى التفاعل',
        description: `تم رصد انخفاض في ${sensor.type} للمستخدم في ${sensor.context}`,
        priority: 'high',
        confidence: 0.85,
        userId: sensor.userId,
        actionable: true,
        metadata: { sensorId: sensor.id, sensorType: sensor.type }
      });
    }

    if (sensor.status === 'green' && sensor.value > 90) {
      generateInsight({
        type: 'recommendation',
        title: 'أداء ممتاز!',
        description: `المستخدم يظهر أداءً ممتازاً في ${sensor.context}`,
        priority: 'low',
        confidence: 0.92,
        userId: sensor.userId,
        actionable: false,
        metadata: { sensorId: sensor.id, sensorType: sensor.type }
      });
    }
  };

  const generateInsight = (insight: Omit<AIInsight, 'id' | 'timestamp'>) => {
    const newInsight: AIInsight = {
      ...insight,
      id: `insight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };

    setInsights(prev => [...prev.slice(-99), newInsight]); // Keep last 100 insights

    // Send to AI Hub
    sendToAIHub({
      type: 'insight',
      data: newInsight,
      source: 'ai_analytics'
    });
  };

  const getAnalytics = (timeRange: string = '24h'): AnalyticsMetrics => {
    return metrics;
  };

  const getEngagementStatus = (): 'green' | 'yellow' | 'red' => {
    const { engagementRate } = metrics;
    if (engagementRate > 70) return 'green';
    if (engagementRate > 40) return 'yellow';
    return 'red';
  };

  const startTracking = () => {
    setIsTracking(true);
    console.log('🧠 AI Analytics: بدء تتبع النشاط');
  };

  const stopTracking = () => {
    setIsTracking(false);
    console.log('🧠 AI Analytics: إيقاف تتبع النشاط');
  };

  // AI Hub Communication Layer
  const sendToAIHub = (data: Record<string, unknown>) => {
    // Central AI Hub communication
    const hubData = {
      timestamp: new Date(),
      userId: user?.id,
      environment: user?.environment,
      role: user?.role,
      sessionId: currentSession,
      ...data
    };

    // Store in central analytics database (localStorage for demo)
    const existingData = JSON.parse(localStorage.getItem('ai_hub_data') || '[]');
    existingData.push(hubData);
    
    // Keep only last 1000 entries
    if (existingData.length > 1000) {
      existingData.splice(0, existingData.length - 1000);
    }
    
    localStorage.setItem('ai_hub_data', JSON.stringify(existingData));

    // Notify subscribers
    aiHubSubscribers.forEach(callback => callback(hubData));

    console.log('📡 AI Hub: تم إرسال البيانات', hubData);
  };

  const subscribeToAIHub = (callback: (data: Record<string, unknown>) => void) => {
    setAiHubSubscribers(prev => [...prev, callback]);
    
    return () => {
      setAiHubSubscribers(prev => prev.filter(cb => cb !== callback));
    };
  };

  const value: AIAnalyticsContextType = {
    activities,
    virtualSensors,
    insights,
    metrics,
    isTracking,
    currentSession,
    trackActivity,
    updateVirtualSensor,
    generateInsight,
    getAnalytics,
    getEngagementStatus,
    startTracking,
    stopTracking,
    sendToAIHub,
    subscribeToAIHub
  };

  return (
    <AIAnalyticsContext.Provider value={value}>
      {children}
    </AIAnalyticsContext.Provider>
  );
};