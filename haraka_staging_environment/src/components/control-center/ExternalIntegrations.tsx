import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAIControlCenter } from '@/contexts/AIControlCenterContext';
import { 
  Globe, 
  Database, 
  Zap, 
  Webhook,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Plus,
  Settings,
  TestTube,
  RefreshCw,
  ExternalLink,
  Shield,
  Activity
} from 'lucide-react';

export const ExternalIntegrations: React.FC = () => {
  const { 
    integrations, 
    addIntegration, 
    updateIntegration, 
    testIntegration,
    isLoading 
  } = useAIControlCenter();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [testingIntegration, setTestingIntegration] = useState<string | null>(null);
  const [newIntegration, setNewIntegration] = useState({
    name: '',
    type: 'api' as const,
    endpoint: '',
    description: ''
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'disconnected': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <XCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-50 border-green-200';
      case 'disconnected': return 'text-red-600 bg-red-50 border-red-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'connected': return 'متصل';
      case 'disconnected': return 'منقطع';
      case 'error': return 'خطأ';
      case 'pending': return 'في الانتظار';
      default: return 'غير معروف';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'api': return <Globe className="h-4 w-4" />;
      case 'webhook': return <Webhook className="h-4 w-4" />;
      case 'database': return <Database className="h-4 w-4" />;
      case 'ai_service': return <Zap className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'api': return 'واجهة برمجية';
      case 'webhook': return 'ويب هوك';
      case 'database': return 'قاعدة بيانات';
      case 'ai_service': return 'خدمة ذكية';
      default: return type;
    }
  };

  const handleTest = async (integrationId: string) => {
    setTestingIntegration(integrationId);
    try {
      const success = await testIntegration(integrationId);
      // Test result is handled in the context
    } finally {
      setTestingIntegration(null);
    }
  };

  const handleAddIntegration = () => {
    if (newIntegration.name && newIntegration.endpoint) {
      addIntegration({
        name: newIntegration.name,
        type: newIntegration.type,
        status: 'pending',
        endpoint: newIntegration.endpoint,
        config: { description: newIntegration.description },
        metrics: { requestCount: 0, successRate: 0, avgResponseTime: 0 }
      });
      
      setNewIntegration({ name: '', type: 'api', endpoint: '', description: '' });
      setShowAddForm(false);
    }
  };

  const connectedCount = integrations.filter(i => i.status === 'connected').length;
  const errorCount = integrations.filter(i => i.status === 'error').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">التكاملات الخارجية</h2>
          <p className="text-muted-foreground">ربط المنصة مع الأنظمة والخدمات الخارجية</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline">
            {connectedCount}/{integrations.length} متصل
          </Badge>
          {errorCount > 0 && (
            <Badge variant="destructive">
              {errorCount} خطأ
            </Badge>
          )}
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            إضافة تكامل
          </Button>
        </div>
      </div>

      {/* Integration Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              التكاملات النشطة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{connectedCount}</div>
            <p className="text-xs text-muted-foreground">تعمل بشكل طبيعي</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              إجمالي الطلبات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {integrations.reduce((sum, i) => sum + i.metrics.requestCount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">طلب API</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-500" />
              معدل النجاح
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {integrations.length > 0 
                ? (integrations.reduce((sum, i) => sum + i.metrics.successRate, 0) / integrations.length).toFixed(1)
                : '0'
              }%
            </div>
            <p className="text-xs text-muted-foreground">متوسط النجاح</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              زمن الاستجابة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {integrations.length > 0 
                ? Math.round(integrations.reduce((sum, i) => sum + i.metrics.avgResponseTime, 0) / integrations.length)
                : '0'
              }ms
            </div>
            <p className="text-xs text-muted-foreground">متوسط الوقت</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Integration Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>إضافة تكامل جديد</CardTitle>
            <CardDescription>
              ربط خدمة أو نظام خارجي مع المنصة
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">اسم التكامل</Label>
                <Input
                  id="name"
                  placeholder="مثال: واجهة وزارة التربية"
                  value={newIntegration.name}
                  onChange={(e) => setNewIntegration(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">نوع التكامل</Label>
                <select
                  id="type"
                  value={newIntegration.type}
                  onChange={(e) => setNewIntegration(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="api">واجهة برمجية (API)</option>
                  <option value="webhook">ويب هوك (Webhook)</option>
                  <option value="database">قاعدة بيانات</option>
                  <option value="ai_service">خدمة ذكية</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endpoint">نقطة النهاية (Endpoint)</Label>
              <Input
                id="endpoint"
                placeholder="https://api.example.com/v1"
                value={newIntegration.endpoint}
                onChange={(e) => setNewIntegration(prev => ({ ...prev, endpoint: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">الوصف (اختياري)</Label>
              <Textarea
                id="description"
                placeholder="وصف مختصر للتكامل وغرضه"
                value={newIntegration.description}
                onChange={(e) => setNewIntegration(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleAddIntegration}>
                <Plus className="h-4 w-4 mr-2" />
                إضافة التكامل
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                إلغاء
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Integrations List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {integrations.map((integration) => (
          <Card key={integration.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    {getTypeIcon(integration.type)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Badge variant="outline">
                        {getTypeLabel(integration.type)}
                      </Badge>
                      <Badge className={getStatusColor(integration.status)}>
                        {getStatusIcon(integration.status)}
                        {getStatusLabel(integration.status)}
                      </Badge>
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTest(integration.id)}
                    disabled={testingIntegration === integration.id}
                  >
                    {testingIntegration === integration.id ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <TestTube className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {integration.endpoint && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ExternalLink className="h-4 w-4" />
                    <span className="truncate">{integration.endpoint}</span>
                  </div>
                )}
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">
                      {integration.metrics.requestCount.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">طلبات</div>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                      {integration.metrics.successRate.toFixed(1)}%
                    </div>
                    <div className="text-xs text-muted-foreground">نجاح</div>
                  </div>
                  
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <div className="text-lg font-bold text-orange-600">
                      {integration.metrics.avgResponseTime}ms
                    </div>
                    <div className="text-xs text-muted-foreground">استجابة</div>
                  </div>
                </div>
                
                {integration.lastSync && (
                  <div className="text-xs text-muted-foreground">
                    آخر مزامنة: {integration.lastSync.toLocaleString('ar-SA')}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {integrations.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Globe className="h-16 w-16 mx-auto mb-4 opacity-50 text-gray-500" />
            <h3 className="text-lg font-medium mb-2">لا توجد تكاملات خارجية</h3>
            <p className="text-muted-foreground mb-4">
              ابدأ بإضافة تكامل مع الأنظمة والخدمات الخارجية
            </p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              إضافة أول تكامل
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Integration Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            دليل التكاملات الخارجية
          </CardTitle>
          <CardDescription>
            معلومات مهمة حول ربط الأنظمة الخارجية
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">أنواع التكاملات المدعومة:</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-blue-500" />
                  <span><strong>واجهة برمجية:</strong> ربط مع APIs خارجية</span>
                </div>
                <div className="flex items-center gap-2">
                  <Webhook className="h-4 w-4 text-green-500" />
                  <span><strong>ويب هوك:</strong> استقبال البيانات تلقائياً</span>
                </div>
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-orange-500" />
                  <span><strong>قاعدة بيانات:</strong> ربط مع قواعد بيانات خارجية</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-purple-500" />
                  <span><strong>خدمة ذكية:</strong> تكامل مع خدمات AI</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-sm">نصائح الأمان:</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>استخدم HTTPS دائماً للاتصالات الآمنة</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>احرص على تشفير مفاتيح API</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>راقب معدلات الاستخدام لتجنب التجاوزات</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>اختبر التكاملات بانتظام</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExternalIntegrations;