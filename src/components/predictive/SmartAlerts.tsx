import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePredictiveIntelligence } from '@/contexts/PredictiveIntelligenceContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  Users,
  TrendingDown,
  UserX,
  BookOpen,
  Target,
  Zap,
  Eye,
  MessageSquare,
  Calendar,
  ArrowRight
} from 'lucide-react';

export const SmartAlerts: React.FC = () => {
  const { 
    smartAlerts, 
    acknowledgeAlert, 
    resolveAlert, 
    getAlertsForRole,
    createSmartAlert 
  } = usePredictiveIntelligence();
  const { user } = useAuth();
  const [roleAlerts, setRoleAlerts] = useState<typeof smartAlerts>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'acknowledged' | 'resolved'>('active');

  useEffect(() => {
    if (user) {
      const alerts = getAlertsForRole(user.role);
      setRoleAlerts(alerts);
    }
  }, [user, smartAlerts, getAlertsForRole]);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'prediction_warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'pattern_detected': return <TrendingDown className="h-4 w-4 text-blue-500" />;
      case 'intervention_needed': return <UserX className="h-4 w-4 text-red-500" />;
      case 'success_opportunity': return <Target className="h-4 w-4 text-green-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'acknowledged': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'resolved': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'expired': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case 'prediction_warning': return 'تحذير تنبؤي';
      case 'pattern_detected': return 'نمط مكتشف';
      case 'intervention_needed': return 'تدخل مطلوب';
      case 'success_opportunity': return 'فرصة نجاح';
      default: return type;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'critical': return 'حرج';
      case 'high': return 'عالي';
      case 'medium': return 'متوسط';
      case 'low': return 'منخفض';
      default: return priority;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'acknowledged': return 'مُقر';
      case 'resolved': return 'محلول';
      case 'expired': return 'منتهي الصلاحية';
      default: return status;
    }
  };

  const handleCreateTestAlert = () => {
    if (!user) return;

    const testAlerts = [
      {
        type: 'prediction_warning' as const,
        priority: 'medium' as const,
        title: 'توقع انخفاض في التفاعل',
        message: 'تم رصد انخفاض تدريجي في مستوى تفاعل الطلاب خلال الأسبوع الماضي',
        targetUsers: [user.id],
        targetRoles: [user.role],
        actionable: true,
        actions: [
          {
            id: 'review_content',
            label: 'مراجعة المحتوى',
            type: 'navigate' as const,
            data: { path: '/content-review' }
          },
          {
            id: 'send_motivation',
            label: 'إرسال تحفيز',
            type: 'notify' as const,
            data: { type: 'motivation' }
          }
        ],
        status: 'active' as const,
        metadata: { source: 'engagement_model', confidence: 0.82 }
      },
      {
        type: 'intervention_needed' as const,
        priority: 'high' as const,
        title: 'طالب يحتاج متابعة عاجلة',
        message: 'الطالب أحمد محمد لم يسجل أي نشاط منذ 3 أيام',
        targetUsers: [user.id],
        targetRoles: [user.role],
        actionable: true,
        actions: [
          {
            id: 'contact_student',
            label: 'التواصل مع الطالب',
            type: 'notify' as const,
            data: { studentId: 'student_123' }
          },
          {
            id: 'contact_parent',
            label: 'التواصل مع ولي الأمر',
            type: 'notify' as const,
            data: { parentId: 'parent_123' }
          }
        ],
        status: 'active' as const,
        metadata: { studentId: 'student_123', absenceDays: 3 }
      }
    ];

    testAlerts.forEach(alert => createSmartAlert(alert));
  };

  const filteredAlerts = smartAlerts.filter(alert => {
    if (filter === 'all') return true;
    return alert.status === filter;
  });

  const activeAlertsCount = smartAlerts.filter(a => a.status === 'active').length;
  const acknowledgedAlertsCount = smartAlerts.filter(a => a.status === 'acknowledged').length;
  const resolvedAlertsCount = smartAlerts.filter(a => a.status === 'resolved').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">الإنذارات الذكية</h2>
          <p className="text-muted-foreground">تنبيهات مدعومة بالذكاء الاصطناعي للتدخل الاستباقي</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCreateTestAlert}>
            <Zap className="h-4 w-4 mr-2" />
            إنشاء تنبيه تجريبي
          </Button>
          {activeAlertsCount > 0 && (
            <Badge variant="destructive">
              {activeAlertsCount} تنبيه نشط
            </Badge>
          )}
        </div>
      </div>

      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Bell className="h-4 w-4 text-red-500" />
              التنبيهات النشطة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{activeAlertsCount}</div>
            <p className="text-xs text-muted-foreground">تحتاج إجراء فوري</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Eye className="h-4 w-4 text-yellow-500" />
              مُقرة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{acknowledgedAlertsCount}</div>
            <p className="text-xs text-muted-foreground">تم الاطلاع عليها</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              محلولة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{resolvedAlertsCount}</div>
            <p className="text-xs text-muted-foreground">تم حلها بنجاح</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-500" />
              معدل الحل
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {smartAlerts.length > 0 ? Math.round((resolvedAlertsCount / smartAlerts.length) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">كفاءة الاستجابة</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[
          { key: 'active', label: 'النشطة', count: activeAlertsCount },
          { key: 'acknowledged', label: 'المُقرة', count: acknowledgedAlertsCount },
          { key: 'resolved', label: 'المحلولة', count: resolvedAlertsCount },
          { key: 'all', label: 'الكل', count: smartAlerts.length }
        ].map(({ key, label, count }) => (
          <Button
            key={key}
            variant={filter === key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(key as typeof filter)}
          >
            {label} ({count})
          </Button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <Card key={alert.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getAlertIcon(alert.type)}
                    <div>
                      <CardTitle className="text-lg">{alert.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">
                          {getAlertTypeLabel(alert.type)}
                        </Badge>
                        <Badge className={getPriorityColor(alert.priority)}>
                          {getPriorityLabel(alert.priority)}
                        </Badge>
                        <Badge className={getStatusColor(alert.status)}>
                          {getStatusLabel(alert.status)}
                        </Badge>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {alert.timestamp.toLocaleString('ar-SA')}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                  
                  {alert.actionable && alert.actions && alert.actions.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">الإجراءات المقترحة:</h4>
                      <div className="flex flex-wrap gap-2">
                        {alert.actions.map((action) => (
                          <Button
                            key={action.id}
                            size="sm"
                            variant="outline"
                            className="text-xs"
                          >
                            {action.label}
                            <ArrowRight className="h-3 w-3 mr-1" />
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {alert.status === 'active' && (
                    <div className="flex gap-2 pt-2 border-t">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => acknowledgeAlert(alert.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        إقرار
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => resolveAlert(alert.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        حل
                      </Button>
                    </div>
                  )}
                  
                  {alert.status === 'acknowledged' && (
                    <div className="flex gap-2 pt-2 border-t">
                      <Button
                        size="sm"
                        onClick={() => resolveAlert(alert.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        حل
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
              
              {/* Priority Indicator */}
              <div className={`absolute top-0 right-0 w-1 h-full ${
                alert.priority === 'critical' ? 'bg-red-500' :
                alert.priority === 'high' ? 'bg-orange-500' :
                alert.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
              }`}></div>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50 text-gray-500" />
              <p className="text-gray-500">
                {filter === 'active' ? 'لا توجد تنبيهات نشطة' :
                 filter === 'acknowledged' ? 'لا توجد تنبيهات مُقرة' :
                 filter === 'resolved' ? 'لا توجد تنبيهات محلولة' :
                 'لا توجد تنبيهات'}
              </p>
              {filter === 'active' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={handleCreateTestAlert}
                >
                  إنشاء تنبيه تجريبي
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Alert Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            دليل التنبيهات الذكية
          </CardTitle>
          <CardDescription>
            كيفية التعامل مع أنواع التنبيهات المختلفة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">أنواع التنبيهات:</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span><strong>تحذير تنبؤي:</strong> توقع مشكلة محتملة</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-blue-500" />
                  <span><strong>نمط مكتشف:</strong> اكتشاف سلوك أو نمط جديد</span>
                </div>
                <div className="flex items-center gap-2">
                  <UserX className="h-4 w-4 text-red-500" />
                  <span><strong>تدخل مطلوب:</strong> حاجة لإجراء فوري</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-500" />
                  <span><strong>فرصة نجاح:</strong> فرصة لتحسين الأداء</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-sm">مستويات الأولوية:</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span><strong>حرج:</strong> يتطلب إجراءً فورياً</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span><strong>عالي:</strong> يحتاج متابعة خلال ساعات</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span><strong>متوسط:</strong> يمكن معالجته خلال يوم</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span><strong>منخفض:</strong> للمتابعة والمراقبة</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartAlerts;