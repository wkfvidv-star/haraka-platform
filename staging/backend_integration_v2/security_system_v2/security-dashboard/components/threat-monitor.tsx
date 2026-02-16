'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  AlertTriangle, 
  Shield, 
  Eye, 
  Clock, 
  MapPin, 
  Activity,
  TrendingUp,
  Ban,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { formatRelativeTime, getThreatLevel, getThreatLevelText } from '@/lib/utils'

// Mock threat data
const threatData = [
  { time: '00:00', attempts: 2, blocked: 2, suspicious: 1 },
  { time: '04:00', attempts: 1, blocked: 1, suspicious: 0 },
  { time: '08:00', attempts: 5, blocked: 4, suspicious: 2 },
  { time: '12:00', attempts: 8, blocked: 6, suspicious: 3 },
  { time: '16:00', attempts: 12, blocked: 10, suspicious: 5 },
  { time: '20:00', attempts: 7, blocked: 5, suspicious: 2 },
]

const suspiciousActivities = [
  {
    id: '1',
    timestamp: '2024-01-20T14:35:00Z',
    type: 'multiple_failed_logins',
    severity: 'high',
    ip_address: '203.0.113.45',
    user_agent: 'curl/7.68.0',
    attempts: 15,
    description: 'محاولات تسجيل دخول متكررة فاشلة من نفس العنوان',
    status: 'active',
    location: 'غير محدد'
  },
  {
    id: '2',
    timestamp: '2024-01-20T14:20:00Z',
    type: 'suspicious_query_pattern',
    severity: 'medium',
    ip_address: '192.168.1.200',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    attempts: 8,
    description: 'استعلامات غير طبيعية على جداول حساسة',
    status: 'investigating',
    location: 'الرياض، السعودية'
  },
  {
    id: '3',
    timestamp: '2024-01-20T13:45:00Z',
    type: 'privilege_escalation_attempt',
    severity: 'high',
    ip_address: '198.51.100.23',
    user_agent: 'python-requests/2.28.1',
    attempts: 3,
    description: 'محاولة الوصول لبيانات خارج الصلاحيات',
    status: 'blocked',
    location: 'غير محدد'
  },
  {
    id: '4',
    timestamp: '2024-01-20T13:30:00Z',
    type: 'unusual_access_time',
    severity: 'low',
    ip_address: '192.168.1.150',
    user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)',
    attempts: 1,
    description: 'وصول في وقت غير معتاد (خارج ساعات العمل)',
    status: 'resolved',
    location: 'جدة، السعودية'
  }
]

const ipBlacklist = [
  { ip: '203.0.113.45', reason: 'محاولات اختراق متكررة', blocked_at: '2024-01-20T14:35:00Z', attempts: 25 },
  { ip: '198.51.100.23', reason: 'محاولة رفع الصلاحيات', blocked_at: '2024-01-20T13:45:00Z', attempts: 8 },
  { ip: '192.0.2.100', reason: 'نشاط مشبوه متكرر', blocked_at: '2024-01-20T12:15:00Z', attempts: 12 }
]

export function ThreatMonitor() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeThreats, setActiveThreats] = useState(0)
  const [totalBlocked, setTotalBlocked] = useState(0)
  const [threatLevel, setThreatLevel] = useState<'low' | 'medium' | 'high'>('low')

  useEffect(() => {
    // Simulate loading and calculate metrics
    const timer = setTimeout(() => {
      const active = suspiciousActivities.filter(a => a.status === 'active').length
      const blocked = suspiciousActivities.filter(a => a.status === 'blocked').length
      const highSeverity = suspiciousActivities.filter(a => a.severity === 'high').length
      
      setActiveThreats(active)
      setTotalBlocked(blocked + ipBlacklist.length)
      setThreatLevel(highSeverity > 0 ? 'high' : active > 0 ? 'medium' : 'low')
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">عالي</Badge>
      case 'medium':
        return <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-700">متوسط</Badge>
      case 'low':
        return <Badge variant="outline" className="text-xs border-green-500 text-green-700">منخفض</Badge>
      default:
        return <Badge variant="outline" className="text-xs">غير محدد</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'blocked':
        return <Ban className="h-4 w-4 text-red-600" />
      case 'investigating':
        return <Eye className="h-4 w-4 text-yellow-500" />
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <XCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'active': 'نشط',
      'blocked': 'محجوب',
      'investigating': 'قيد التحقيق',
      'resolved': 'تم الحل'
    }
    return statusMap[status] || status
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-48"></div>
              <div className="h-4 bg-muted rounded w-64"></div>
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Threat Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className={`metric-card ${threatLevel === 'high' ? 'security-alert' : threatLevel === 'medium' ? 'security-warning' : 'security-success'}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مستوى التهديد الحالي</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className={`threat-indicator threat-${threatLevel}`}></div>
              <span className="text-2xl font-bold">{getThreatLevelText(threatLevel)}</span>
            </div>
            <Progress 
              value={threatLevel === 'high' ? 90 : threatLevel === 'medium' ? 60 : 30} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">التهديدات النشطة</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{activeThreats}</div>
            <p className="text-xs text-muted-foreground">
              تتطلب اهتماماً فورياً
            </p>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">العناوين المحجوبة</CardTitle>
            <Ban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBlocked}</div>
            <p className="text-xs text-muted-foreground">
              آخر 24 ساعة
            </p>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل الحجب</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">
              من المحاولات المشبوهة
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Threat Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle>نشاط التهديدات (آخر 24 ساعة)</CardTitle>
          <CardDescription>
            محاولات الوصول المشبوهة والمحجوبة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={threatData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip 
                labelFormatter={(label) => `الساعة ${label}`}
                formatter={(value, name) => [
                  value, 
                  name === 'attempts' ? 'محاولات' : name === 'blocked' ? 'محجوب' : 'مشبوه'
                ]}
              />
              <Area type="monotone" dataKey="attempts" stackId="1" stroke="#ff7300" fill="#ff7300" fillOpacity={0.3} />
              <Area type="monotone" dataKey="blocked" stackId="1" stroke="#ff0000" fill="#ff0000" fillOpacity={0.6} />
              <Area type="monotone" dataKey="suspicious" stackId="1" stroke="#ffbb00" fill="#ffbb00" fillOpacity={0.4} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Suspicious Activities */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>الأنشطة المشبوهة</CardTitle>
              <CardDescription>
                التهديدات المكتشفة حديثاً
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 ml-2" />
              تحديث
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {suspiciousActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="flex-shrink-0 mt-0.5">
                  {getStatusIcon(activity.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {getSeverityBadge(activity.severity)}
                    <Badge variant="outline" className="text-xs">
                      {getStatusText(activity.status)}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium mb-1">{activity.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatRelativeTime(activity.timestamp)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {activity.location}
                    </span>
                    <span>{activity.attempts} محاولة</span>
                  </div>
                  <div className="mt-2 text-xs font-mono bg-muted px-2 py-1 rounded">
                    IP: {activity.ip_address}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* IP Blacklist */}
        <Card>
          <CardHeader>
            <CardTitle>العناوين المحجوبة</CardTitle>
            <CardDescription>
              قائمة العناوين المحجوبة تلقائياً
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {ipBlacklist.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Ban className="h-4 w-4 text-red-500" />
                    <code className="text-sm font-mono bg-muted px-2 py-0.5 rounded">
                      {item.ip}
                    </code>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{item.reason}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{item.attempts} محاولة</span>
                    <span>{formatRelativeTime(item.blocked_at)}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  إلغاء الحجب
                </Button>
              </div>
            ))}
            
            {ipBlacklist.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>لا توجد عناوين محجوبة حالياً</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}