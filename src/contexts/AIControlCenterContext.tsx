import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useAIAnalytics } from './AIAnalyticsContext';
import { usePredictiveIntelligence } from './PredictiveIntelligenceContext';

// Types for AI Control Center
export interface SystemHealth {
  overall: number;
  analytics: number;
  predictive: number;
  database: number;
  network: number;
  security: number;
}

export interface RealTimeMetrics {
  activeUsers: number;
  totalSessions: number;
  systemLoad: number;
  responseTime: number;
  errorRate: number;
  throughput: number;
  dataProcessed: number;
  alertsActive: number;
  predictionsActive: number;
  lastUpdate: Date;
}

export interface HeatmapData {
  id: string;
  x: number;
  y: number;
  value: number;
  type: 'engagement' | 'performance' | 'activity' | 'interaction';
  timestamp: Date;
  metadata: Record<string, unknown>;
}

export interface VisualizationConfig {
  theme: 'light' | 'dark' | 'auto';
  refreshRate: number; // milliseconds
  animationSpeed: 'slow' | 'normal' | 'fast';
  colorScheme: 'default' | 'colorblind' | 'high-contrast';
  showAnimations: boolean;
  autoRefresh: boolean;
}

export interface AIAssistant {
  id: string;
  name: string;
  personality: 'helpful' | 'professional' | 'friendly' | 'formal';
  language: 'ar' | 'en' | 'fr';
  capabilities: string[];
  isActive: boolean;
  conversationHistory: {
    id: string;
    message: string;
    sender: 'user' | 'assistant';
    timestamp: Date;
    context?: Record<string, unknown>;
  }[];
}

export interface ExternalIntegration {
  id: string;
  name: string;
  type: 'api' | 'webhook' | 'database' | 'ai_service';
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  endpoint?: string;
  lastSync?: Date;
  config: Record<string, unknown>;
  metrics: {
    requestCount: number;
    successRate: number;
    avgResponseTime: number;
  };
}

interface AIControlCenterContextType {
  // System Health & Metrics
  systemHealth: SystemHealth;
  realTimeMetrics: RealTimeMetrics;
  heatmapData: HeatmapData[];

  // Visualization
  visualizationConfig: VisualizationConfig;
  updateVisualizationConfig: (config: Partial<VisualizationConfig>) => void;

  // AI Assistant
  aiAssistant: AIAssistant;
  sendMessageToAssistant: (message: string) => Promise<string>;
  updateAssistantConfig: (config: Partial<AIAssistant>) => void;

  // External Integrations
  integrations: ExternalIntegration[];
  addIntegration: (integration: Omit<ExternalIntegration, 'id'>) => void;
  updateIntegration: (id: string, updates: Partial<ExternalIntegration>) => void;
  testIntegration: (id: string) => Promise<boolean>;

  // Control Center Methods
  refreshAllData: () => Promise<void>;
  exportSystemReport: () => Promise<string>;
  getSystemInsights: () => string[];

  // Status
  isLoading: boolean;
  lastRefresh: Date | null;
  connectionStatus: 'online' | 'offline' | 'unstable';
}

const AIControlCenterContext = createContext<AIControlCenterContextType | undefined>(undefined);

export const useAIControlCenter = () => {
  const context = useContext(AIControlCenterContext);
  if (context === undefined) {
    throw new Error('useAIControlCenter must be used within an AIControlCenterProvider');
  }
  return context;
};

interface AIControlCenterProviderProps {
  children: ReactNode;
}

export const AIControlCenterProvider: React.FC<AIControlCenterProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { metrics: analyticsMetrics, activities, virtualSensors } = useAIAnalytics();
  const { predictions, smartAlerts, currentContext } = usePredictiveIntelligence();

  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    overall: 95,
    analytics: 98,
    predictive: 92,
    database: 96,
    network: 94,
    security: 99
  });

  const [realTimeMetrics, setRealTimeMetrics] = useState<RealTimeMetrics>({
    activeUsers: 0,
    totalSessions: 0,
    systemLoad: 0,
    responseTime: 0,
    errorRate: 0,
    throughput: 0,
    dataProcessed: 0,
    alertsActive: 0,
    predictionsActive: 0,
    lastUpdate: new Date()
  });

  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);

  const [visualizationConfig, setVisualizationConfig] = useState<VisualizationConfig>({
    theme: 'auto',
    refreshRate: 5000,
    animationSpeed: 'normal',
    colorScheme: 'default',
    showAnimations: true,
    autoRefresh: true
  });

  const [aiAssistant, setAiAssistant] = useState<AIAssistant>({
    id: 'haraka_assistant',
    name: 'مساعد حركة الذكي',
    personality: 'helpful',
    language: 'ar',
    capabilities: [
      'تحليل البيانات',
      'تقديم التوصيات',
      'الإجابة على الأسئلة',
      'مساعدة في التنقل',
      'تفسير الإحصائيات'
    ],
    isActive: true,
    conversationHistory: []
  });

  const [integrations, setIntegrations] = useState<ExternalIntegration[]>([
    {
      id: 'ministry_api',
      name: 'واجهة وزارة التربية',
      type: 'api',
      status: 'connected',
      endpoint: 'http://localhost:3001/api/ministry',
      lastSync: new Date(),
      config: { apiKey: 'demo_key', version: 'v2' },
      metrics: { requestCount: 1247, successRate: 98.5, avgResponseTime: 245 }
    },
    {
      id: 'openai_service',
      name: 'خدمة الذكاء الاصطناعي',
      type: 'ai_service',
      status: 'connected',
      endpoint: 'http://localhost:3002/v1',
      lastSync: new Date(),
      config: { model: 'gpt-4', temperature: 0.7 },
      metrics: { requestCount: 892, successRate: 99.2, avgResponseTime: 1200 }
    },
    {
      id: 'analytics_db',
      name: 'قاعدة بيانات التحليلات',
      type: 'database',
      status: 'connected',
      lastSync: new Date(),
      config: { host: 'localhost', port: 5432 },
      metrics: { requestCount: 5647, successRate: 99.8, avgResponseTime: 45 }
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline' | 'unstable'>('online');

  // Update real-time metrics based on other contexts
  useEffect(() => {
    const updateMetrics = () => {
      const activeAlerts = smartAlerts.filter(a => a.status === 'active').length;
      const activePredictions = predictions.filter(p => p.status === 'active').length;

      setRealTimeMetrics(prev => ({
        ...prev,
        activeUsers: analyticsMetrics.activeUsers,
        totalSessions: Math.floor(analyticsMetrics.totalUsers * 1.2),
        systemLoad: Math.min(100, (activities.length / 100) * 100),
        responseTime: 150 + Math.random() * 100,
        errorRate: Math.random() * 2,
        throughput: activities.length / 60, // per minute
        dataProcessed: activities.length + virtualSensors.length + predictions.length,
        alertsActive: activeAlerts,
        predictionsActive: activePredictions,
        lastUpdate: new Date()
      }));
    };

    const interval = setInterval(updateMetrics, visualizationConfig.refreshRate);
    updateMetrics(); // Initial update

    return () => clearInterval(interval);
  }, [analyticsMetrics, activities, virtualSensors, predictions, smartAlerts, visualizationConfig.refreshRate]);

  // Generate heatmap data from activities
  useEffect(() => {
    const generateHeatmapData = () => {
      const recentActivities = activities.slice(-50);
      const heatmapPoints: HeatmapData[] = [];

      recentActivities.forEach((activity, index) => {
        // Generate pseudo-coordinates based on activity data
        const x = (index % 10) * 10 + Math.random() * 10;
        const y = Math.floor(index / 10) * 10 + Math.random() * 10;

        let value = 50;
        if (activity.activityType === 'interaction') value = 80;
        if (activity.activityType === 'completion') value = 90;
        if (activity.duration && activity.duration > 300000) value += 20;

        heatmapPoints.push({
          id: `heatmap_${activity.id}`,
          x,
          y,
          value: Math.min(100, value),
          type: activity.activityType === 'interaction' ? 'interaction' :
            activity.activityType === 'completion' ? 'performance' : 'activity',
          timestamp: new Date(activity.timestamp),
          metadata: {
            userId: activity.userId,
            component: activity.component,
            duration: activity.duration
          }
        });
      });

      setHeatmapData(heatmapPoints);
    };

    generateHeatmapData();
  }, [activities]);

  // Update system health based on metrics
  useEffect(() => {
    const calculateSystemHealth = () => {
      const baseHealth = 95;
      const errorPenalty = realTimeMetrics.errorRate * 5;
      const loadPenalty = realTimeMetrics.systemLoad > 80 ? (realTimeMetrics.systemLoad - 80) * 0.5 : 0;

      const overall = Math.max(0, baseHealth - errorPenalty - loadPenalty);

      setSystemHealth(prev => ({
        ...prev,
        overall,
        analytics: Math.max(0, 98 - errorPenalty),
        predictive: Math.max(0, 92 - loadPenalty),
        database: Math.max(0, 96 - (errorPenalty * 0.5)),
        network: Math.max(0, 94 - (realTimeMetrics.responseTime > 500 ? 10 : 0)),
        security: 99 // Assume security is always high
      }));
    };

    calculateSystemHealth();
  }, [realTimeMetrics]);

  const updateVisualizationConfig = (config: Partial<VisualizationConfig>) => {
    setVisualizationConfig(prev => ({ ...prev, ...config }));
  };

  const sendMessageToAssistant = async (message: string): Promise<string> => {
    // Add user message to history
    const userMessage = {
      id: `msg_${Date.now()}_user`,
      message,
      sender: 'user' as const,
      timestamp: new Date(),
      context: { userId: user?.id, currentPage: window.location.pathname }
    };

    setAiAssistant(prev => ({
      ...prev,
      conversationHistory: [...prev.conversationHistory.slice(-19), userMessage]
    }));

    // Simulate AI response based on message content
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    let response = '';
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('إحصائيات') || lowerMessage.includes('بيانات')) {
      response = `بناءً على البيانات الحالية، لديك ${realTimeMetrics.activeUsers} مستخدم نشط و ${realTimeMetrics.alertsActive} تنبيه نشط. معدل الأداء العام ${systemHealth.overall.toFixed(1)}%.`;
    } else if (lowerMessage.includes('تنبيه') || lowerMessage.includes('مشكلة')) {
      response = `يوجد حالياً ${realTimeMetrics.alertsActive} تنبيه نشط. هل تريد مني عرض التفاصيل أم اقتراح حلول؟`;
    } else if (lowerMessage.includes('أداء') || lowerMessage.includes('نظام')) {
      response = `صحة النظام ممتازة بنسبة ${systemHealth.overall.toFixed(1)}%. زمن الاستجابة ${realTimeMetrics.responseTime.toFixed(0)}ms ومعدل الخطأ ${realTimeMetrics.errorRate.toFixed(1)}%.`;
    } else if (lowerMessage.includes('مساعدة') || lowerMessage.includes('كيف')) {
      response = 'يمكنني مساعدتك في: تحليل البيانات، فهم الإحصائيات، تفسير التنبيهات، التنقل في المنصة، أو الإجابة على أسئلتك حول النظام. ماذا تحتاج؟';
    } else {
      response = 'شكراً لك على رسالتك. يمكنني مساعدتك في تحليل البيانات وفهم إحصائيات المنصة. هل لديك سؤال محدد؟';
    }

    const assistantMessage = {
      id: `msg_${Date.now()}_assistant`,
      message: response,
      sender: 'assistant' as const,
      timestamp: new Date(),
      context: {
        systemHealth: systemHealth.overall,
        activeAlerts: realTimeMetrics.alertsActive,
        responseGenerated: true
      }
    };

    setAiAssistant(prev => ({
      ...prev,
      conversationHistory: [...prev.conversationHistory, assistantMessage]
    }));

    return response;
  };

  const updateAssistantConfig = (config: Partial<AIAssistant>) => {
    setAiAssistant(prev => ({ ...prev, ...config }));
  };

  const addIntegration = (integration: Omit<ExternalIntegration, 'id'>) => {
    const newIntegration: ExternalIntegration = {
      ...integration,
      id: `integration_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    setIntegrations(prev => [...prev, newIntegration]);
  };

  const updateIntegration = (id: string, updates: Partial<ExternalIntegration>) => {
    setIntegrations(prev =>
      prev.map(integration =>
        integration.id === id ? { ...integration, ...updates } : integration
      )
    );
  };

  const testIntegration = async (id: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Simulate integration test
      await new Promise(resolve => setTimeout(resolve, 2000));

      const success = Math.random() > 0.1; // 90% success rate

      updateIntegration(id, {
        status: success ? 'connected' : 'error',
        lastSync: success ? new Date() : undefined
      });

      return success;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAllData = async (): Promise<void> => {
    setIsLoading(true);

    try {
      // Simulate data refresh
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update metrics
      setRealTimeMetrics(prev => ({
        ...prev,
        lastUpdate: new Date()
      }));

      setLastRefresh(new Date());
    } finally {
      setIsLoading(false);
    }
  };

  const exportSystemReport = async (): Promise<string> => {
    const report = {
      timestamp: new Date().toISOString(),
      systemHealth,
      realTimeMetrics,
      integrationStatus: integrations.map(i => ({
        name: i.name,
        status: i.status,
        successRate: i.metrics.successRate
      })),
      summary: {
        totalUsers: realTimeMetrics.activeUsers,
        systemLoad: realTimeMetrics.systemLoad,
        overallHealth: systemHealth.overall
      }
    };

    return JSON.stringify(report, null, 2);
  };

  const getSystemInsights = (): string[] => {
    const insights: string[] = [];

    if (systemHealth.overall > 95) {
      insights.push('النظام يعمل بكفاءة عالية جداً');
    } else if (systemHealth.overall > 85) {
      insights.push('أداء النظام جيد مع وجود مجال للتحسين');
    } else {
      insights.push('النظام يحتاج إلى صيانة وتحسين');
    }

    if (realTimeMetrics.errorRate < 1) {
      insights.push('معدل الأخطاء منخفض جداً');
    } else if (realTimeMetrics.errorRate > 5) {
      insights.push('معدل الأخطاء مرتفع - يحتاج متابعة');
    }

    if (realTimeMetrics.responseTime < 200) {
      insights.push('زمن الاستجابة ممتاز');
    } else if (realTimeMetrics.responseTime > 1000) {
      insights.push('زمن الاستجابة بطيء - يحتاج تحسين');
    }

    const connectedIntegrations = integrations.filter(i => i.status === 'connected').length;
    if (connectedIntegrations === integrations.length) {
      insights.push('جميع التكاملات الخارجية تعمل بنجاح');
    } else {
      insights.push(`${connectedIntegrations}/${integrations.length} من التكاملات متصلة`);
    }

    return insights;
  };

  // Monitor connection status
  useEffect(() => {
    const checkConnection = () => {
      if (realTimeMetrics.errorRate > 10) {
        setConnectionStatus('unstable');
      } else if (realTimeMetrics.responseTime > 2000) {
        setConnectionStatus('unstable');
      } else {
        setConnectionStatus('online');
      }
    };

    const interval = setInterval(checkConnection, 10000);
    checkConnection();

    return () => clearInterval(interval);
  }, [realTimeMetrics]);

  const value: AIControlCenterContextType = {
    systemHealth,
    realTimeMetrics,
    heatmapData,
    visualizationConfig,
    updateVisualizationConfig,
    aiAssistant,
    sendMessageToAssistant,
    updateAssistantConfig,
    integrations,
    addIntegration,
    updateIntegration,
    testIntegration,
    refreshAllData,
    exportSystemReport,
    getSystemInsights,
    isLoading,
    lastRefresh,
    connectionStatus
  };

  return (
    <AIControlCenterContext.Provider value={value}>
      {children}
    </AIControlCenterContext.Provider>
  );
};