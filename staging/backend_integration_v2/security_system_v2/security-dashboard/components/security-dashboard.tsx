'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Shield, 
  Users, 
  Activity, 
  AlertTriangle, 
  Eye, 
  Lock, 
  Database,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

// Mock data - في التطبيق الحقيقي، ستأتي من API
const securityMetrics = {
  totalUsers: 1247,
  activeUsers: 892,
  blockedAttempts: 23,
  successfulLogins: 1156,
  systemHealth: 98.5,
  threatLevel: 'low' as const,
  lastIncident: '2024-01-15T10:30:00Z'
}

const activityData = [
  { name: 'الاثنين', logins: 145, blocked: 2 },
  { name: 'الثلاثاء', logins: 167, blocked: 1 },
  { name: 'الأربعاء', logins: 189, blocked: 3 },
  { name: 'الخميس', logins: 201, blocked: 0 },
  { name: 'الجمعة', logins: 134, blocked: 1 },
  { name: 'السبت', logins: 98, blocked: 0 },
  { name: 'الأحد', logins: 123, blocked: 2 }
]

const userRoleData = [
  { name: 'طلاب', value: 456, color: '#0088FE' },
  { name: 'معلمون', value: 234, color: '#00C49F' },
  { name: 'أولياء أمور', value: 345, color: '#FFBB28' },
  { name: 'إداريون', value: 123, color: '#FF8042' },
  { name: 'أخرى', value: 89, color: '#8884D8' }
]

export function SecurityDashboard() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-muted rounded w-24"></div>
              <div className="h-4 w-4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16 mb-2"></div>
              <div className="h-3 bg-muted rounded w-32"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="metric-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityMetrics.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 ml-1" />
              +12% من الشهر الماضي
            </p>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المستخدمون النشطون</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityMetrics.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((securityMetrics.activeUsers / securityMetrics.totalUsers) * 100)}% من الإجمالي
            </p>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">محاولات الوصول المحجوبة</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{securityMetrics.blockedAttempts}</div>
            <p className="text-xs text-muted-foreground">
              آخر 24 ساعة
            </p>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">صحة النظام</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{securityMetrics.systemHealth}%</div>
            <Progress value={securityMetrics.systemHealth} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>نشاط المستخدمين الأسبوعي</CardTitle>
            <CardDescription>
              تسجيلات الدخول والمحاولات المحجوبة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  labelFormatter={(label) => `يوم ${label}`}
                  formatter={(value, name) => [
                    value, 
                    name === 'logins' ? 'تسجيلات دخول' : 'محاولات محجوبة'
                  ]}
                />
                <Bar dataKey="logins" fill="#0088FE" name="logins" />
                <Bar dataKey="blocked" fill="#FF8042" name="blocked" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Roles Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>توزيع أدوار المستخدمين</CardTitle>
            <CardDescription>
              النسبة المئوية لكل دور في النظام
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userRoleData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userRoleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Security Status Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="security-success">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800 dark:text-green-200">
              مستوى التهديد
            </CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                منخفض
              </Badge>
              <div className="threat-indicator threat-low"></div>
            </div>
            <p className="text-xs text-green-700 dark:text-green-300 mt-2">
              لا توجد تهديدات نشطة
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">آخر حادثة أمنية</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">15 يناير 2024</div>
            <p className="text-xs text-muted-foreground mt-1">
              محاولة وصول غير مصرح من IP مشبوه
            </p>
            <Badge variant="outline" className="mt-2 text-xs">
              تم الحل
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">سياسات الأمان النشطة</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25</div>
            <p className="text-xs text-muted-foreground">
              سياسة RLS نشطة
            </p>
            <div className="flex gap-1 mt-2">
              <Badge variant="outline" className="text-xs">RLS</Badge>
              <Badge variant="outline" className="text-xs">Audit</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}