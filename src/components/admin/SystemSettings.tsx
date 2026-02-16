import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Shield, Database, Bell, Lock, Server, Mail, ChevronRight, Activity } from 'lucide-react';

const SystemSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Settings className="h-5 w-5 text-[#0ea5e9]" />
            إعدادات النظام
          </CardTitle>
          <CardDescription>
            تخصيص وإدارة المعايير الأساسية وتفضيلات النظام وتكوينات الأمان
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'الأمان والخصوصية',
                icon: Shield,
                items: [
                  { label: 'إدارة الصلاحيات', icon: Lock },
                  { label: 'سياسات الأمان', icon: Shield },
                  { label: 'سجلات الولوج', icon: Settings }
                ]
              },
              {
                title: 'قاعدة البيانات',
                icon: Database,
                items: [
                  { label: 'نسخ احتياطي', icon: Database },
                  { label: 'استعادة البيانات', icon: Server },
                  { label: 'تحسين الأداء', icon: Activity }
                ]
              },
              {
                title: 'الإشعارات والتنبيهات',
                icon: Bell,
                items: [
                  { label: 'إشعارات البريد', icon: Mail },
                  { label: 'إشعارات النظام', icon: Bell },
                  { label: 'تنبيهات الأمان', icon: Lock }
                ]
              }
            ].map((section, idx) => (
              <Card key={idx} className="bg-white/60 border-blue-50 hover:border-blue-100 transition-colors rounded-2xl overflow-hidden group">
                <CardHeader className="pb-4 bg-blue-50/30">
                  <CardTitle className="text-base flex items-center gap-2">
                    <section.icon className="h-4 w-4 text-[#0ea5e9]" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 space-y-1">
                  {section.items.map((item, iIdx) => (
                    <Button
                      key={iIdx}
                      variant="ghost"
                      className="w-full justify-between hover:bg-blue-50 text-slate-700 hover:text-blue-700 h-10 group-hover:px-4 transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <item.icon className="h-4 w-4 opacity-50" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </Button>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemSettings;
