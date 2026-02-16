import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, User, Settings, Shield, AlertTriangle } from 'lucide-react';

const AuditLogs: React.FC = () => {
  const logs = [
    {
      id: 1,
      action: 'تسجيل دخول',
      user: 'أحمد محمد',
      timestamp: '2024-10-16 14:30:00',
      type: 'info',
      details: 'تسجيل دخول ناجح من IP: 192.168.1.100'
    },
    {
      id: 2,
      action: 'تعديل إعدادات',
      user: 'مدير النظام',
      timestamp: '2024-10-16 13:45:00',
      type: 'warning',
      details: 'تم تعديل إعدادات الأمان'
    },
    {
      id: 3,
      action: 'إنشاء مستخدم جديد',
      user: 'فاطمة الزهراء',
      timestamp: '2024-10-16 12:20:00',
      type: 'success',
      details: 'تم إنشاء حساب جديد للطالب سارة أحمد'
    },
    {
      id: 4,
      action: 'محاولة دخول فاشلة',
      user: 'غير معروف',
      timestamp: '2024-10-16 11:15:00',
      type: 'error',
      details: 'محاولة دخول فاشلة من IP: 192.168.1.200'
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'info': return <User className="h-4 w-4 text-blue-500" />;
      case 'warning': return <Settings className="h-4 w-4 text-yellow-500" />;
      case 'success': return <Shield className="h-4 w-4 text-green-500" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getBadgeVariant = (type: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (type) {
      case 'info': return 'default';
      case 'warning': return 'secondary';
      case 'success': return 'default';
      case 'error': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            سجلات النشاط
          </CardTitle>
          <CardDescription>
            سجل شامل لجميع الأنشطة والعمليات في النظام
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="mt-1">
                  {getIcon(log.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{log.action}</h4>
                    <Badge variant={getBadgeVariant(log.type)}>
                      {log.type === 'info' ? 'معلومات' :
                       log.type === 'warning' ? 'تحذير' :
                       log.type === 'success' ? 'نجح' : 'خطأ'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    المستخدم: {log.user}
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">
                    {log.details}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {log.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogs;