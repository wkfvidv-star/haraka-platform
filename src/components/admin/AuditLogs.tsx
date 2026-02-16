import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, User, Settings, Shield, AlertTriangle, Clock, MapPin, CheckCircle2, AlertCircle, Info, ChevronRight } from 'lucide-react';

const AuditLogs: React.FC = () => {
  const logs = [
    {
      id: 1,
      action: 'تسجيل دخول',
      user: 'أحمد محمد',
      timestamp: '2024-10-16 14:30:00',
      type: 'info',
      details: 'تسجيل دخول ناجح من IP: 192.168.1.100',
      location: 'الرياض، السعودية'
    },
    {
      id: 2,
      action: 'تعديل إعدادات',
      user: 'مدير النظام',
      timestamp: '2024-10-16 13:45:00',
      type: 'warning',
      details: 'تم تعديل إعدادات الأمان الأساسية للنظام',
      location: 'جدة، السعودية'
    },
    {
      id: 3,
      action: 'إنشاء مستخدم جديد',
      user: 'فاطمة الزهراء',
      timestamp: '2024-10-16 12:20:00',
      type: 'success',
      details: 'تم إنشاء حساب جديد للطالب سارة أحمد بنجاح',
      location: 'الدمام، السعودية'
    },
    {
      id: 4,
      action: 'محاولة دخول فاشلة',
      user: 'غير معروف',
      timestamp: '2024-10-16 11:15:00',
      type: 'error',
      details: 'محاولة دخول فاشلة متكررة من عنوان IP مجهول',
      location: 'دبي، الإمارات'
    }
  ];

  const getLogStyle = (type: string) => {
    switch (type) {
      case 'info': return { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' };
      case 'warning': return { icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' };
      case 'success': return { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' };
      case 'error': return { icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-100' };
      default: return { icon: FileText, color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-100' };
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <FileText className="h-5 w-5 text-[#0ea5e9]" />
                سجلات النشاط
              </CardTitle>
              <CardDescription>
                سجل شامل لجميع الأنشطة والعمليات التي تمت على النظام للتدقيق والأمان
              </CardDescription>
            </div>
            <Badge variant="outline" className="border-blue-100 text-blue-600 bg-white/50 px-3 py-1">
              تحديث تلقائي مفعّل
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {logs.map((log) => {
              const style = getLogStyle(log.type);
              const LogIcon = style.icon;
              return (
                <div key={log.id} className={`group flex items-start gap-4 p-4 bg-white/60 hover:bg-white border ${style.border} rounded-2xl transition-all duration-200`}>
                  <div className={`mt-1 p-2.5 ${style.bg} ${style.color} rounded-xl shadow-sm`}>
                    <LogIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-3">
                        <h4 className="font-bold text-slate-800 text-base">{log.action}</h4>
                        <Badge className={`${style.bg} ${style.color} border-none font-bold text-[10px] px-2 py-0.5 rounded-lg uppercase tracking-wider`}>
                          {log.type === 'info' ? 'معلومات' :
                            log.type === 'warning' ? 'تنبيه' :
                              log.type === 'success' ? 'نجاح' : 'جذري'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground/80 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {log.timestamp}
                        </div>
                        <div className="flex items-center gap-1.5 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                          <MapPin className="h-3.5 w-3.5 text-rose-500" />
                          {log.location}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-2 bg-slate-100/50 px-2 py-1 rounded-lg">
                        <User className="h-3.5 w-3.5 text-slate-500" />
                        <span className="text-xs font-bold text-slate-600">{log.user}</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/30 p-2.5 rounded-xl border border-slate-100/50">
                      {log.details}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 text-center">
            <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-bold gap-2">
              عرض جميع السجلات
              <ChevronRight className="h-4 w-4 rotate-180" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogs;
