import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, Edit, Trash2, Eye, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const UserManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Users className="h-5 w-5 text-[#0ea5e9]" />
                إدارة المستخدمين
              </CardTitle>
              <CardDescription>
                إدارة حسابات المستخدمين وصلاحياتهم والتحقق من النشاط
              </CardDescription>
            </div>
            <Button className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white rounded-xl h-11 px-6 shadow-lg shadow-blue-100 transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto">
              <UserPlus className="h-4 w-4 ml-2" />
              إضافة مستخدم جديد
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-blue-50/50 p-2 rounded-2xl border border-blue-100/50">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث عن مستخدم بالاسم أو البريد..."
                  className="pr-10 bg-white/80 border-none rounded-xl h-11 focus-visible:ring-1 focus-visible:ring-blue-400"
                />
              </div>
            </div>

            <div className="grid gap-3">
              {[
                { name: 'أحمد محمد', role: 'طالب', status: 'نشط', email: 'ahmed@example.com' },
                { name: 'فاطمة الزهراء', role: 'معلم', status: 'نشط', email: 'fatima@example.com' },
                { name: 'خالد الرياضي', role: 'مدرب', status: 'نشط', email: 'khaled@example.com' }
              ].map((user, index) => (
                <div key={index} className="group flex items-center justify-between p-4 bg-white/60 hover:bg-white rounded-2xl border border-transparent hover:border-blue-100 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-inner">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{user.name}</h4>
                      <p className="text-xs text-muted-foreground mb-1.5">{user.email}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-none px-2.5 py-0.5 rounded-lg text-[10px] font-bold">
                          {user.role}
                        </Badge>
                        <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-none px-2.5 py-0.5 rounded-lg text-[10px] font-bold">
                          {user.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl hover:bg-blue-50 hover:text-blue-600">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl hover:bg-indigo-50 hover:text-indigo-600">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl hover:bg-red-50 hover:text-red-600">
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
