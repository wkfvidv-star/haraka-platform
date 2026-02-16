'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Shield, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Download,
  Search,
  AlertTriangle,
  BarChart3,
  TrendingUp,
  FileText
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { formatRelativeTime } from '@/lib/utils'

// Mock data for consent management
const mockConsents = [
  {
    consent_id: 'consent_001',
    child_name: 'أحمد محمد',
    guardian_name: 'محمد أحمد',
    status: 'active',
    granted_at: '2024-01-20T10:30:00Z',
    revoked_at: null,
    scope: 'video_upload_analysis',
    version: 'v1.0',
    ip_address: '192.168.1.100'
  },
  {
    consent_id: 'consent_002',
    child_name: 'فاطمة علي',
    guardian_name: 'علي حسن',
    status: 'active',
    granted_at: '2024-01-19T14:15:00Z',
    revoked_at: null,
    scope: 'video_upload_analysis',
    version: 'v1.0',
    ip_address: '192.168.1.101'
  },
  {
    consent_id: 'consent_003',
    child_name: 'سارة خالد',
    guardian_name: 'خالد سعد',
    status: 'revoked',
    granted_at: '2024-01-18T09:20:00Z',
    revoked_at: '2024-01-20T16:45:00Z',
    scope: 'video_upload_analysis',
    version: 'v1.0',
    ip_address: '192.168.1.102'
  },
  {
    consent_id: 'consent_004',
    child_name: 'يوسف عبدالله',
    guardian_name: 'عبدالله يوسف',
    status: 'active',
    granted_at: '2024-01-17T11:00:00Z',
    revoked_at: null,
    scope: 'video_upload_analysis',
    version: 'v1.0',
    ip_address: '192.168.1.103'
  }
]

const mockAuditLogs = [
  {
    log_id: 'log_001',
    consent_id: 'consent_001',
    action: 'granted',
    performed_by: 'محمد أحمد',
    performed_at: '2024-01-20T10:30:00Z',
    ip_address: '192.168.1.100',
    risk_score: 2
  },
  {
    log_id: 'log_002',
    consent_id: 'consent_003',
    action: 'revoked',
    performed_by: 'خالد سعد',
    performed_at: '2024-01-20T16:45:00Z',
    ip_address: '192.168.1.102',
    risk_score: 5
  },
  {
    log_id: 'log_003',
    consent_id: 'consent_002',
    action: 'granted',
    performed_by: 'علي حسن',
    performed_at: '2024-01-19T14:15:00Z',
    ip_address: '192.168.1.101',
    risk_score: 2
  }
]

const consentStats = {
  total: 156,
  active: 142,
  revoked: 14,
  pending: 0,
  consentRate: 91.0
}

const chartData = [
  { name: 'مُفعّلة', value: 142, color: '#10b981' },
  { name: 'مسحوبة', value: 14, color: '#ef4444' }
]

const weeklyTrends = [
  { day: 'الأحد', granted: 12, revoked: 1 },
  { day: 'الاثنين', granted: 18, revoked: 2 },
  { day: 'الثلاثاء', granted: 15, revoked: 0 },
  { day: 'الأربعاء', granted: 22, revoked: 3 },
  { day: 'الخميس', granted: 19, revoked: 1 },
  { day: 'الجمعة', granted: 8, revoked: 0 },
  { day: 'السبت', granted: 5, revoked: 1 }
]

export function ConsentDashboard() {
  const [consents, setConsents] = useState(mockConsents)
  const [auditLogs, setAuditLogs] = useState(mockAuditLogs)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(false)

  const filteredConsents = consents.filter(consent => {
    const matchesSearch = consent.child_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consent.guardian_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || consent.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">مُفعّلة</Badge>
      case 'revoked':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">مسحوبة</Badge>
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">معلقة</Badge>
      default:
        return <Badge variant="outline">غير معروف</Badge>
    }
  }

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'granted':
        return <Badge variant="outline" className="bg-green-50 text-green-700">منحت</Badge>
      case 'revoked':
        return <Badge variant="outline" className="bg-red-50 text-red-700">سُحبت</Badge>
      case 'viewed':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">عُرضت</Badge>
      default:
        return <Badge variant="outline">{action}</Badge>
    }
  }

  const exportConsents = () => {
    const csvContent = [
      ['الطالب', 'ولي الأمر', 'الحالة', 'تاريخ المنح', 'تاريخ السحب'].join(','),
      ...filteredConsents.map(consent => [
        consent.child_name,
        consent.guardian_name,
        consent.status === 'active' ? 'مُفعّلة' : 'مسحوبة',
        new Date(consent.granted_at).toLocaleDateString('ar-SA'),
        consent.revoked_at ? new Date(consent.revoked_at).toLocaleDateString('ar-SA') : ''
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `consents-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            لوحة إدارة الموافقات
          </h1>
          <p className="text-muted-foreground">
            إدارة ومراقبة موافقات أولياء الأمور لرفع وتحليل الفيديوهات
          </p>
        </div>
        <Button onClick={exportConsents} variant="outline">
          <Download className="h-4 w-4 ml-2" />
          تصدير البيانات
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الموافقات</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{consentStats.total}</div>
            <p className="text-xs text-muted-foreground">
              منذ بداية النظام
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الموافقات النشطة</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{consentStats.active}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((consentStats.active / consentStats.total) * 100)}% من الإجمالي
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الموافقات المسحوبة</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{consentStats.revoked}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((consentStats.revoked / consentStats.total) * 100)}% من الإجمالي
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل الموافقة</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{consentStats.consentRate}%</div>
            <p className="text-xs text-muted-foreground">
              معدل إيجابي ممتاز
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard */}
      <Tabs defaultValue="consents" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="consents">الموافقات</TabsTrigger>
          <TabsTrigger value="audit">سجل التدقيق</TabsTrigger>
          <TabsTrigger value="analytics">التحليلات</TabsTrigger>
        </TabsList>

        <TabsContent value="consents" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="البحث بالاسم..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="active">مُفعّلة</SelectItem>
                <SelectItem value="revoked">مسحوبة</SelectItem>
                <SelectItem value="pending">معلقة</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Consents Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الطالب</TableHead>
                    <TableHead>ولي الأمر</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>تاريخ المنح</TableHead>
                    <TableHead>تاريخ السحب</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredConsents.map((consent) => (
                    <TableRow key={consent.consent_id}>
                      <TableCell className="font-medium">
                        {consent.child_name}
                      </TableCell>
                      <TableCell>{consent.guardian_name}</TableCell>
                      <TableCell>
                        {getStatusBadge(consent.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">
                            {formatRelativeTime(consent.granted_at)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(consent.granted_at).toLocaleDateString('ar-SA')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {consent.revoked_at ? (
                          <div className="flex flex-col">
                            <span className="text-sm">
                              {formatRelativeTime(consent.revoked_at)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(consent.revoked_at).toLocaleDateString('ar-SA')}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>سجل عمليات الموافقات</CardTitle>
              <CardDescription>
                جميع العمليات المتعلقة بالموافقات مُسجّلة للمراجعة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الوقت</TableHead>
                    <TableHead>العملية</TableHead>
                    <TableHead>المنفذ</TableHead>
                    <TableHead>عنوان IP</TableHead>
                    <TableHead>مستوى المخاطر</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.log_id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">
                            {formatRelativeTime(log.performed_at)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(log.performed_at).toLocaleTimeString('ar-SA')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getActionBadge(log.action)}
                      </TableCell>
                      <TableCell>{log.performed_by}</TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">{log.ip_address}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={log.risk_score >= 5 ? 'destructive' : 'outline'}>
                          {log.risk_score >= 5 ? 'عالي' : 'منخفض'} ({log.risk_score})
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Consent Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>توزيع الموافقات</CardTitle>
                <CardDescription>
                  النسبة المئوية للموافقات النشطة والمسحوبة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Weekly Trends */}
            <Card>
              <CardHeader>
                <CardTitle>الاتجاهات الأسبوعية</CardTitle>
                <CardDescription>
                  الموافقات الممنوحة والمسحوبة خلال الأسبوع
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="granted" fill="#10b981" name="ممنوحة" />
                    <Bar dataKey="revoked" fill="#ef4444" name="مسحوبة" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}