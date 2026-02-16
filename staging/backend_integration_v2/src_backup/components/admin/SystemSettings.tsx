import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Shield, Database, Bell } from 'lucide-react';

const SystemSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            إعدادات النظام
          </CardTitle>
          <CardDescription>
            إدارة إعدادات النظام والأمان
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  إعدادات الأمان
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  إدارة الصلاحيات
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  سياسات الأمان
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  سجلات الأمان
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  إعدادات قاعدة البيانات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  نسخ احتياطي
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  استعادة البيانات
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  تحسين الأداء
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  إعدادات الإشعارات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  إشعارات البريد الإلكتروني
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  إشعارات النظام
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  تنبيهات الأمان
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemSettings;