import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, Edit, Trash2, Eye } from 'lucide-react';

const UserManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            إدارة المستخدمين
          </CardTitle>
          <CardDescription>
            إدارة حسابات المستخدمين وصلاحياتهم
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">قائمة المستخدمين</h3>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                إضافة مستخدم جديد
              </Button>
            </div>
            
            <div className="space-y-3">
              {[
                { name: 'أحمد محمد', role: 'طالب', status: 'نشط' },
                { name: 'فاطمة الزهراء', role: 'معلم', status: 'نشط' },
                { name: 'خالد الرياضي', role: 'مدرب', status: 'نشط' }
              ].map((user, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-medium">{user.name}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{user.role}</Badge>
                        <Badge variant="outline">{user.status}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;