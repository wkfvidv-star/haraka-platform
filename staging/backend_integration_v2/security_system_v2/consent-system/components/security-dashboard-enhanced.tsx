'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Shield, 
  Activity, 
  Users, 
  AlertTriangle, 
  Eye, 
  Clock, 
  TrendingUp, 
  MapPin,
  Bell,
  RefreshCw,
  Download,
  Filter,
  Search,
  UserX,
  VideoOff,
  Database,
  Globe
} from 'lucide-react'

// Mock data for demonstration
const mockSecurityData = {
  recentSensitiveOperations: [
    {
      id: '1',
      timestamp: '2024-01-20T10:30:00Z',
      user: 'أحمد محمد العلي',
      action: 'رفع فيديو',
      resource: 'تمرين كرة القدم',
      riskLevel: 'low',
      ipAddress: '192.168.1.100',
      location: 'الرياض، السعودية'
    },
    {
      id: '2',
      timestamp: '2024-01-20T10:25:00Z',
      user: 'محمد أحمد السالم',
      action: 'سحب موافقة',
      resource: 'موافقة رفع الفيديو',
      riskLevel: 'medium',
      ipAddress: '192.168.1.101',
      location: 'جدة، السعودية'
    },
    {
      id: '3',
      timestamp: '2024-01-20T10:20:00Z',
      user: 'سارة عبدالله',
      action: 'عرض تقرير طالب',
      resource: 'تقرير أداء رياضي',
      riskLevel: 'low',
      ipAddress: '192.168.1.102',
      location: 'الدمام، السعودية'
    },
    {
      id: '4',
      timestamp: '2024-01-20T10:15:00Z',
      user: 'نظام التشفير',
      action: 'فك تشفير بيانات',
      resource: 'ملف فيديو مشفر',
      riskLevel: 'high',
      ipAddress: '10.0.0.5',
      location: 'خادم داخلي'
    }
  ],
  activeUsers: [
    {
      id: '1',
      name: 'أحمد محمد العلي',
      role: 'طالب',
      lastActivity: '2024-01-20T10:30:00Z',
      sessionsCount: 3,
      location: 'الرياض'
    },
    {
      id: '2',
      name: 'محمد أحمد السالم',
      role: 'ولي أمر',
      lastActivity: '2024-01-20T10:25:00Z',
      sessionsCount: 1,
      location: 'جدة'
    },
    {
      id: '3',
      name: 'سارة عبدالله المطيري',
      role: 'معلمة',
      lastActivity: '2024-01-20T10:20:00Z',
      sessionsCount: 2,
      location: 'الدمام'
    }
  ],
  failedLoginAttempts: [
    {
      id: '1',
      timestamp: '2024-01-20T10:35:00Z',
      username: 'admin_fake',
      ipAddress: '203.0.113.45',
      location: 'غير معروف',
      attempts: 5,
      blocked: true
    },
    {
      id: '2',
      timestamp: '2024-01-20T10:30:00Z',
      username: 'student_123',
      ipAddress: '192.168.1.200',
      location: 'الرياض، السعودية',
      attempts: 3,
      blocked: false
    }
  ],
  consentActivities: [
    {
      id: '1',
      timestamp: '2024-01-20T10:30:00Z',
      guardian: 'محمد العلي',
      student: 'أحمد محمد العلي',
      action: 'منح موافقة',
      scope: 'رفع وتحليل الفيديو'
    },
    {
      id: '2',
      timestamp: '2024-01-20T10:25:00Z',
      guardian: 'أحمد السالم',
      student: 'فاطمة أحمد السالم',
      action: 'سحب موافقة',
      scope: 'رفع وتحليل الفيديو'
    }
  ],
  suspiciousActivities: [
    {
      id: '1',
      timestamp: '2024-01-20T10:35:00Z',
      type: 'محاولات دخول متعددة',
      description: 'محاولات دخول فاشلة متعددة من IP خارجي',
      ipAddress: '203.0.113.45',
      location: 'غير معروف',
      riskScore: 8,
      coordinates: [24.7136, 46.6753] // Riyadh coordinates for map
    },
    {
      id: '2',
      timestamp: '2024-01-20T10:20:00Z',
      type: 'وصول غير عادي',
      description: 'وصول لبيانات طلاب من خارج ساعات العمل',
      ipAddress: '192.168.1.150',
      location: 'جدة، السعودية',
      riskScore: 6,
      coordinates: [21.3891, 39.8579] // Jeddah coordinates
    }
  ],
  statistics: {
    totalOperations: 1247,
    sensitiveOperations: 89,
    failedLogins: 23,
    activeConsents: 142,
    revokedConsents: 14,
    highRiskEvents: 5
  }
}

export function SecurityDashboardEnhanced() {
  const [timeFilter, setTimeFilter] = useState('24h')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRiskLevel, setSelectedRiskLevel] = useState('all')
  const [isLoading, setIsLoading] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'warning',
      message: 'تم اكتشاف 5 محاولات دخول فاشلة من IP خارجي',
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'info',
      message: 'تم سحب موافقة ولي أمر - يتطلب مراجعة',
      timestamp: new Date(Date.now() - 300000) // 5 minutes ago
    }
  ])

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLastRefresh(new Date())
    setIsLoading(false)
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getRiskLevelText = (level: string) => {
    switch (level) {
      case 'high': return 'عالي'
      case 'medium': return 'متوسط'
      case 'low': return 'منخفض'
      default: return 'غير محدد'
    }
  }

  const formatRelativeTime = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'الآن'
    if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`
    if (diffInMinutes < 1440) return `منذ ${Math.floor(diffInMinutes / 60)} ساعة`
    return `منذ ${Math.floor(diffInMinutes / 1440)} يوم`
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">لوحة مراقبة الأمان المتقدمة</h2>
          <p className="text-muted-foreground">
            مراقبة شاملة للأنشطة الأمنية والعمليات الحساسة
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-sm">
            آخر تحديث: {lastRefresh.toLocaleTimeString('ar-SA')}
          </Badge>
          <Button 
            onClick={handleRefresh} 
            disabled={isLoading}
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 ml-2 ${isLoading ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
        </div>
      </div>

      {/* Notifications Bar */}
      {notifications.length > 0 && (
        <div className="space-y-2">
          {notifications.map(notification => (
            <Alert key={notification.id} className={
              notification.type === 'warning' 
                ? 'border-orange-200 bg-orange-50' 
                : 'border-blue-200 bg-blue-50'
            }>
              <Bell className="h-4 w-4" />
              <AlertTitle>تنبيه أمني</AlertTitle>
              <AlertDescription className="flex items-center justify-between">
                <span>{notification.message}</span>
                <span className="text-xs text-muted-foreground">
                  {formatRelativeTime(notification.timestamp.toISOString())}
                </span>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="البحث في الأنشطة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="الفترة الزمنية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">آخر ساعة</SelectItem>
                <SelectItem value="24h">آخر 24 ساعة</SelectItem>
                <SelectItem value="7d">آخر أسبوع</SelectItem>
                <SelectItem value="30d">آخر شهر</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedRiskLevel} onValueChange={setSelectedRiskLevel}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="مستوى المخاطر" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المستويات</SelectItem>
                <SelectItem value="high">عالي</SelectItem>
                <SelectItem value="medium">متوسط</SelectItem>
                <SelectItem value="low">منخفض</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 ml-2" />
              تصدير
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">إجمالي العمليات</p>
                <p className="text-2xl font-bold">{mockSecurityData.statistics.totalOperations}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">عمليات حساسة</p>
                <p className="text-2xl font-bold text-orange-600">{mockSecurityData.statistics.sensitiveOperations}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserX className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">محاولات فاشلة</p>
                <p className="text-2xl font-bold text-red-600">{mockSecurityData.statistics.failedLogins}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">موافقات نشطة</p>
                <p className="text-2xl font-bold text-green-600">{mockSecurityData.statistics.activeConsents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <VideoOff className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">موافقات مسحوبة</p>
                <p className="text-2xl font-bold text-purple-600">{mockSecurityData.statistics.revokedConsents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">أحداث عالية المخاطر</p>
                <p className="text-2xl font-bold text-red-600">{mockSecurityData.statistics.highRiskEvents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="operations" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="operations">العمليات الحساسة</TabsTrigger>
          <TabsTrigger value="users">المستخدمون النشطون</TabsTrigger>
          <TabsTrigger value="failures">محاولات الولوج الفاشلة</TabsTrigger>
          <TabsTrigger value="consents">أنشطة الموافقات</TabsTrigger>
          <TabsTrigger value="map">خريطة الأنشطة</TabsTrigger>
        </TabsList>

        {/* Sensitive Operations Tab */}
        <TabsContent value="operations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                آخر العمليات الحساسة
              </CardTitle>
              <CardDescription>
                مراقبة العمليات الحساسة في الوقت الفعلي
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSecurityData.recentSensitiveOperations.map((operation) => (
                  <div key={operation.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <span className="font-medium">{operation.user}</span>
                        <span className="text-sm text-muted-foreground">{operation.action}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm">{operation.resource}</span>
                        <span className="text-xs text-muted-foreground">
                          {operation.location} • {operation.ipAddress}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getRiskLevelColor(operation.riskLevel)}>
                        {getRiskLevelText(operation.riskLevel)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatRelativeTime(operation.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Active Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                المستخدمون النشطون
              </CardTitle>
              <CardDescription>
                المستخدمون المتصلون حالياً والأنشطة الأخيرة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSecurityData.activeUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex flex-col">
                        <span className="font-medium">{user.name}</span>
                        <span className="text-sm text-muted-foreground">{user.role}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <span className="text-sm font-medium">{user.sessionsCount}</span>
                        <p className="text-xs text-muted-foreground">جلسات</p>
                      </div>
                      <div className="text-center">
                        <span className="text-sm">{user.location}</span>
                        <p className="text-xs text-muted-foreground">
                          {formatRelativeTime(user.lastActivity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Failed Login Attempts Tab */}
        <TabsContent value="failures" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserX className="h-5 w-5" />
                محاولات الولوج الفاشلة
              </CardTitle>
              <CardDescription>
                مراقبة محاولات الدخول المشبوهة والمحجوبة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSecurityData.failedLoginAttempts.map((attempt) => (
                  <div key={attempt.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <AlertTriangle className={`h-5 w-5 ${attempt.blocked ? 'text-red-500' : 'text-orange-500'}`} />
                      <div className="flex flex-col">
                        <span className="font-medium">{attempt.username}</span>
                        <span className="text-sm text-muted-foreground">
                          {attempt.location} • {attempt.ipAddress}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={attempt.blocked ? "destructive" : "secondary"}>
                        {attempt.blocked ? 'محجوب' : 'نشط'}
                      </Badge>
                      <span className="text-sm font-medium">{attempt.attempts} محاولات</span>
                      <span className="text-sm text-muted-foreground">
                        {formatRelativeTime(attempt.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Consent Activities Tab */}
        <TabsContent value="consents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                أنشطة الموافقات
              </CardTitle>
              <CardDescription>
                منح وسحب موافقات أولياء الأمور
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSecurityData.consentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        activity.action === 'منح موافقة' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <div className="flex flex-col">
                        <span className="font-medium">{activity.guardian}</span>
                        <span className="text-sm text-muted-foreground">
                          {activity.action} لـ {activity.student}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{activity.scope}</span>
                      <span className="text-sm text-muted-foreground">
                        {formatRelativeTime(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Suspicious Activities Map Tab */}
        <TabsContent value="map" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                خريطة الأنشطة المشبوهة
              </CardTitle>
              <CardDescription>
                توزيع جغرافي للأنشطة الأمنية والمشبوهة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Map Placeholder */}
                <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">خريطة تفاعلية للأنشطة المشبوهة</p>
                    <p className="text-sm text-muted-foreground">يتم تحميل البيانات الجغرافية...</p>
                  </div>
                </div>

                {/* Suspicious Activities List */}
                <div className="space-y-3">
                  <h4 className="font-medium">الأنشطة المشبوهة الأخيرة</h4>
                  {mockSecurityData.suspiciousActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          activity.riskScore >= 8 ? 'bg-red-500' : 
                          activity.riskScore >= 6 ? 'bg-orange-500' : 'bg-yellow-500'
                        }`}></div>
                        <div className="flex flex-col">
                          <span className="font-medium">{activity.type}</span>
                          <span className="text-sm text-muted-foreground">{activity.description}</span>
                          <span className="text-xs text-muted-foreground">
                            {activity.location} • {activity.ipAddress}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={
                          activity.riskScore >= 8 ? 'bg-red-100 text-red-800 border-red-200' :
                          activity.riskScore >= 6 ? 'bg-orange-100 text-orange-800 border-orange-200' :
                          'bg-yellow-100 text-yellow-800 border-yellow-200'
                        }>
                          خطر {activity.riskScore}/10
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatRelativeTime(activity.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}