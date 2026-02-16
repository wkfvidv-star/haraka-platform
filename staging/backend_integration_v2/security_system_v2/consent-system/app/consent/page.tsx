'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Shield, 
  Users, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle,
  Eye
} from 'lucide-react'

type UserRole = 'teacher' | 'guardian' | 'admin'

export default function ConsentPage() {
  const [userRole, setUserRole] = useState<UserRole>('teacher')

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">نظام إدارة الموافقات</h1>
          <p className="text-gray-600">عرض توضيحي لنظام الموافقات متعدد الأدوار</p>
        </div>

        {/* Role Selector */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              اختيار الدور
            </CardTitle>
            <CardDescription>
              اختر دوراً لعرض واجهة الموافقات المناسبة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button 
                variant={userRole === 'teacher' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setUserRole('teacher')}
              >
                المدرس
              </Button>
              <Button 
                variant={userRole === 'guardian' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setUserRole('guardian')}
              >
                ولي الأمر
              </Button>
              <Button 
                variant={userRole === 'admin' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setUserRole('admin')}
              >
                المشرف
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Teacher View */}
        {userRole === 'teacher' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  طلبات الموافقة - عرض المدرس
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    المدرسون يمكنهم فقط عرض حالة الموافقات، لا يمكنهم الموافقة أو الرفض
                  </AlertDescription>
                </Alert>
                <div className="mt-4 space-y-3">
                  <div className="p-3 bg-yellow-50 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">أحمد محمد - تحليل فيديو كرة القدم</h3>
                        <p className="text-sm text-gray-600">في انتظار موافقة ولي الأمر</p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">في الانتظار</Badge>
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">فاطمة علي - تحليل فيديو كرة السلة</h3>
                        <p className="text-sm text-gray-600">تمت الموافقة</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">موافق عليه</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Guardian View */}
        {userRole === 'guardian' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  طلبات الموافقة - عرض ولي الأمر
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">طلب تحليل فيديو - أحمد محمد</h3>
                      <Badge className="bg-yellow-100 text-yellow-800">في الانتظار</Badge>
                    </div>
                    <p className="text-gray-600 mb-3">
                      يطلب المدرس خالد موافقة على تحليل فيديو تمرين كرة القدم باستخدام الذكاء الاصطناعي
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-4 w-4 ml-1" />
                        موافق
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 border-red-600">
                        <XCircle className="h-4 w-4 ml-1" />
                        رفض
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Admin View */}
        {userRole === 'admin' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  إدارة الموافقات - عرض المشرف
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="pending" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="pending">في الانتظار</TabsTrigger>
                    <TabsTrigger value="approved">موافق عليها</TabsTrigger>
                    <TabsTrigger value="rejected">مرفوضة</TabsTrigger>
                  </TabsList>
                  <TabsContent value="pending" className="space-y-3">
                    <div className="p-3 bg-yellow-50 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">أحمد محمد - تحليل فيديو</h3>
                          <p className="text-sm text-gray-600">مطلوب من: المدرس خالد</p>
                          <p className="text-xs text-gray-500">منذ يومين</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 ml-1" />
                            عرض التفاصيل
                          </Button>
                          <Badge className="bg-yellow-100 text-yellow-800">في الانتظار</Badge>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="approved" className="space-y-3">
                    <div className="p-3 bg-green-50 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">فاطمة علي - تحليل فيديو</h3>
                          <p className="text-sm text-gray-600">موافق من: والدة فاطمة</p>
                          <p className="text-xs text-gray-500">منذ 3 ساعات</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">موافق عليه</Badge>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="rejected" className="space-y-3">
                    <p className="text-center text-gray-500 py-8">لا توجد طلبات مرفوضة</p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}