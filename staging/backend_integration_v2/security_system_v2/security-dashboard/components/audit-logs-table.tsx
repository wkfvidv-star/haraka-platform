'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Clock,
  User,
  Activity
} from 'lucide-react'
import { formatDate, formatRelativeTime, getRoleDisplayName, getActionDisplayName } from '@/lib/utils'

// Mock audit log data - في التطبيق الحقيقي، ستأتي من قاعدة البيانات
const mockAuditLogs = [
  {
    id: '1',
    timestamp: '2024-01-20T14:30:00Z',
    user_id: 'user_123',
    user_role: 'student',
    action: 'SELECT',
    table_name: 'haraka_student_profiles',
    record_id: 'profile_456',
    ip_address: '192.168.1.100',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    success: true,
    error_message: null,
    risk_score: 1,
    additional_data: { query_type: 'profile_view' }
  },
  {
    id: '2',
    timestamp: '2024-01-20T14:25:00Z',
    user_id: 'user_789',
    user_role: 'teacher',
    action: 'INSERT',
    table_name: 'haraka_exercise_sessions',
    record_id: 'session_789',
    ip_address: '192.168.1.101',
    user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
    success: true,
    error_message: null,
    risk_score: 2,
    additional_data: { session_duration: 45 }
  },
  {
    id: '3',
    timestamp: '2024-01-20T14:20:00Z',
    user_id: 'unknown',
    user_role: 'anonymous',
    action: 'ACCESS_DENIED',
    table_name: 'haraka_student_profiles',
    record_id: null,
    ip_address: '203.0.113.45',
    user_agent: 'curl/7.68.0',
    success: false,
    error_message: 'RLS policy violation: insufficient permissions',
    risk_score: 8,
    additional_data: { attempt_count: 5, blocked_reason: 'suspicious_pattern' }
  },
  {
    id: '4',
    timestamp: '2024-01-20T14:15:00Z',
    user_id: 'user_456',
    user_role: 'guardian',
    action: 'SELECT',
    table_name: 'haraka_student_profiles',
    record_id: 'profile_123',
    ip_address: '192.168.1.102',
    user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    success: true,
    error_message: null,
    risk_score: 1,
    additional_data: { child_id: 'student_123' }
  },
  {
    id: '5',
    timestamp: '2024-01-20T14:10:00Z',
    user_id: 'admin_001',
    user_role: 'admin',
    action: 'UPDATE',
    table_name: 'haraka_system_settings',
    record_id: 'setting_security',
    ip_address: '192.168.1.10',
    user_agent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
    success: true,
    error_message: null,
    risk_score: 3,
    additional_data: { setting_changed: 'max_login_attempts' }
  }
]

interface AuditLog {
  id: string
  timestamp: string
  user_id: string
  user_role: string
  action: string
  table_name: string
  record_id: string | null
  ip_address: string
  user_agent: string
  success: boolean
  error_message: string | null
  risk_score: number
  additional_data: any
}

export function AuditLogsTable() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('all')
  const [selectedAction, setSelectedAction] = useState<string>('all')
  const [selectedRisk, setSelectedRisk] = useState<string>('all')

  useEffect(() => {
    // Simulate API call
    const fetchLogs = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setLogs(mockAuditLogs)
      setFilteredLogs(mockAuditLogs)
      setIsLoading(false)
    }

    fetchLogs()
  }, [])

  useEffect(() => {
    let filtered = logs

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ip_address.includes(searchTerm) ||
        log.table_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.error_message && log.error_message.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Filter by role
    if (selectedRole !== 'all') {
      filtered = filtered.filter(log => log.user_role === selectedRole)
    }

    // Filter by action
    if (selectedAction !== 'all') {
      filtered = filtered.filter(log => log.action === selectedAction)
    }

    // Filter by risk level
    if (selectedRisk !== 'all') {
      if (selectedRisk === 'high') {
        filtered = filtered.filter(log => log.risk_score >= 7)
      } else if (selectedRisk === 'medium') {
        filtered = filtered.filter(log => log.risk_score >= 4 && log.risk_score < 7)
      } else if (selectedRisk === 'low') {
        filtered = filtered.filter(log => log.risk_score < 4)
      }
    }

    setFilteredLogs(filtered)
  }, [logs, searchTerm, selectedRole, selectedAction, selectedRisk])

  const getRiskBadge = (score: number) => {
    if (score >= 7) {
      return <Badge variant="destructive" className="text-xs">عالي ({score})</Badge>
    } else if (score >= 4) {
      return <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-700">متوسط ({score})</Badge>
    } else {
      return <Badge variant="outline" className="text-xs border-green-500 text-green-700">منخفض ({score})</Badge>
    }
  }

  const getStatusIcon = (success: boolean, riskScore: number) => {
    if (!success) {
      return <XCircle className="h-4 w-4 text-red-500" />
    } else if (riskScore >= 7) {
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    } else {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  const exportLogs = () => {
    const csvContent = [
      ['الوقت', 'المستخدم', 'الدور', 'الإجراء', 'الجدول', 'IP', 'النجاح', 'مستوى المخاطر'].join(','),
      ...filteredLogs.map(log => [
        formatDate(log.timestamp),
        log.user_id,
        getRoleDisplayName(log.user_role),
        getActionDisplayName(log.action),
        log.table_name,
        log.ip_address,
        log.success ? 'نجح' : 'فشل',
        log.risk_score
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-muted rounded w-48 animate-pulse"></div>
          <div className="h-8 bg-muted rounded w-24 animate-pulse"></div>
        </div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-muted rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-col md:flex-row gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث في السجلات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-8"
            />
          </div>
          
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="الدور" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأدوار</SelectItem>
              <SelectItem value="student">طالب</SelectItem>
              <SelectItem value="teacher">معلم</SelectItem>
              <SelectItem value="guardian">ولي أمر</SelectItem>
              <SelectItem value="admin">مدير</SelectItem>
              <SelectItem value="anonymous">مجهول</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedAction} onValueChange={setSelectedAction}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="الإجراء" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الإجراءات</SelectItem>
              <SelectItem value="SELECT">قراءة</SelectItem>
              <SelectItem value="INSERT">إضافة</SelectItem>
              <SelectItem value="UPDATE">تحديث</SelectItem>
              <SelectItem value="DELETE">حذف</SelectItem>
              <SelectItem value="ACCESS_DENIED">وصول مرفوض</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedRisk} onValueChange={setSelectedRisk}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="مستوى المخاطر" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع المستويات</SelectItem>
              <SelectItem value="high">عالي (7+)</SelectItem>
              <SelectItem value="medium">متوسط (4-6)</SelectItem>
              <SelectItem value="low">منخفض (1-3)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={exportLogs} variant="outline" size="sm">
          <Download className="h-4 w-4 ml-2" />
          تصدير CSV
        </Button>
      </div>

      {/* Summary */}
      <div className="flex gap-4 text-sm text-muted-foreground">
        <span>إجمالي السجلات: {logs.length}</span>
        <span>المعروضة: {filteredLogs.length}</span>
        <span>المحاولات المرفوضة: {logs.filter(log => !log.success).length}</span>
        <span>عالية المخاطر: {logs.filter(log => log.risk_score >= 7).length}</span>
      </div>

      {/* Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">الحالة</TableHead>
              <TableHead>الوقت</TableHead>
              <TableHead>المستخدم</TableHead>
              <TableHead>الدور</TableHead>
              <TableHead>الإجراء</TableHead>
              <TableHead>الجدول</TableHead>
              <TableHead>عنوان IP</TableHead>
              <TableHead>مستوى المخاطر</TableHead>
              <TableHead className="w-12">تفاصيل</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id} className="audit-log-row">
                <TableCell>
                  {getStatusIcon(log.success, log.risk_score)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm">{formatRelativeTime(log.timestamp)}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(log.timestamp).toLocaleTimeString('ar-SA')}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm font-mono">{log.user_id}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {getRoleDisplayName(log.user_role)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Activity className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{getActionDisplayName(log.action)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">
                    {log.table_name}
                  </code>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-mono">{log.ip_address}</span>
                </TableCell>
                <TableCell>
                  {getRiskBadge(log.risk_score)}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-3 w-3" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredLogs.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>لا توجد سجلات تطابق المعايير المحددة</p>
        </div>
      )}
    </div>
  )
}