'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Shield,
  Users,
  Key,
  AlertTriangle,
  Database,
  Lock,
  Unlock,
  RotateCw,
  UserX,
  Eye,
  Search,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  FileText,
  Settings,
  Trash2
} from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'suspended' | 'revoked'
  lastLogin: string
  createdAt: string
  consentStatus: string
  failedAttempts: number
}

interface AuditLog {
  id: string
  timestamp: string
  userId: string
  userName: string
  action: string
  resource: string
  outcome: 'success' | 'failure' | 'blocked'
  ipAddress: string
  userAgent: string
  details: string
}

interface KeyRotationEvent {
  id: string
  timestamp: string
  keyId: string
  oldKeyFingerprint: string
  newKeyFingerprint: string
  status: 'initiated' | 'completed' | 'failed'
  affectedFiles: number
  triggeredBy: string
  reason: string
}

interface SecurityMetrics {
  totalUsers: number
  activeUsers: number
  suspendedUsers: number
  revokedUsers: number
  failedLogins24h: number
  successfulLogins24h: number
  keyRotationsThisMonth: number
  criticalAlerts: number
}

export default function AdminSecurityDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [keyRotationEvents, setKeyRotationEvents] = useState<KeyRotationEvent[]>([])
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [apiLogs, setApiLogs] = useState<string[]>([])
  const [keyRotationInProgress, setKeyRotationInProgress] = useState(false)
  const [decryptTestResults, setDecryptTestResults] = useState<string[]>([])

  useEffect(() => {
    fetchSecurityData()
  }, [])

  const logSecurityAction = (message: string) => {
    const timestamp = new Date().toISOString()
    const logEntry = `[${timestamp}] SECURITY: ${message}`
    setApiLogs(prev => [logEntry, ...prev.slice(0, 19)])
    console.log(logEntry)
  }

  const fetchSecurityData = async () => {
    try {
      setIsLoading(true)
      logSecurityAction('GET /api/admin/security/dashboard - Fetching security overview')
      
      // Mock users data
      const mockUsers: User[] = [
        {
          id: 'user-001',
          name: 'أحمد محمد العلي',
          email: 'ahmed@example.com',
          role: 'student',
          status: 'active',
          lastLogin: '2025-01-08T10:30:00Z',
          createdAt: '2024-12-01T08:00:00Z',
          consentStatus: 'active',
          failedAttempts: 0
        },
        {
          id: 'user-002',
          name: 'فاطمة عبدالله السعد',
          email: 'fatima@example.com',
          role: 'teacher',
          status: 'active',
          lastLogin: '2025-01-07T14:20:00Z',
          createdAt: '2024-11-15T09:30:00Z',
          consentStatus: 'active',
          failedAttempts: 1
        },
        {
          id: 'user-003',
          name: 'يوسف خالد المطيري',
          email: 'youssef@example.com',
          role: 'student',
          status: 'suspended',
          lastLogin: '2025-01-05T16:45:00Z',
          createdAt: '2024-10-20T11:15:00Z',
          consentStatus: 'revoked',
          failedAttempts: 5
        }
      ]

      // Mock audit logs
      const mockAuditLogs: AuditLog[] = [
        {
          id: 'audit-001',
          timestamp: '2025-01-08T10:30:00Z',
          userId: 'user-001',
          userName: 'أحمد محمد العلي',
          action: 'LOGIN',
          resource: '/api/auth/login',
          outcome: 'success',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          details: 'Successful login with valid credentials'
        },
        {
          id: 'audit-002',
          timestamp: '2025-01-08T09:45:00Z',
          userId: 'user-003',
          userName: 'يوسف خالد المطيري',
          action: 'ACCESS_DENIED',
          resource: '/api/student/profile',
          outcome: 'blocked',
          ipAddress: '192.168.1.150',
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0)',
          details: 'RLS policy blocked access - user consent revoked'
        },
        {
          id: 'audit-003',
          timestamp: '2025-01-08T08:20:00Z',
          userId: 'unknown',
          userName: 'Unknown User',
          action: 'LOGIN_FAILED',
          resource: '/api/auth/login',
          outcome: 'failure',
          ipAddress: '203.0.113.42',
          userAgent: 'curl/7.68.0',
          details: 'Invalid credentials - potential brute force attempt'
        }
      ]

      // Mock key rotation events
      const mockKeyRotationEvents: KeyRotationEvent[] = [
        {
          id: 'rotation-001',
          timestamp: '2025-01-07T02:00:00Z',
          keyId: 'key-2025-001',
          oldKeyFingerprint: 'sha256:a1b2c3d4e5f6...',
          newKeyFingerprint: 'sha256:f6e5d4c3b2a1...',
          status: 'completed',
          affectedFiles: 1247,
          triggeredBy: 'admin-001',
          reason: 'Scheduled monthly rotation'
        },
        {
          id: 'rotation-002',
          timestamp: '2025-01-08T10:15:00Z',
          keyId: 'key-2025-002',
          oldKeyFingerprint: 'sha256:f6e5d4c3b2a1...',
          newKeyFingerprint: 'sha256:9z8y7x6w5v4u...',
          status: 'initiated',
          affectedFiles: 0,
          triggeredBy: 'system',
          reason: 'Emergency rotation - security incident'
        }
      ]

      const mockMetrics: SecurityMetrics = {
        totalUsers: mockUsers.length,
        activeUsers: mockUsers.filter(u => u.status === 'active').length,
        suspendedUsers: mockUsers.filter(u => u.status === 'suspended').length,
        revokedUsers: mockUsers.filter(u => u.status === 'revoked').length,
        failedLogins24h: 15,
        successfulLogins24h: 342,
        keyRotationsThisMonth: 2,
        criticalAlerts: 3
      }

      logSecurityAction(`SQL: SELECT u.*, COUNT(al.id) as failed_attempts FROM users u LEFT JOIN audit_logs al ON u.id = al.user_id WHERE al.action = 'LOGIN_FAILED' AND al.timestamp > NOW() - INTERVAL 24 HOUR GROUP BY u.id`)
      logSecurityAction(`Response: Found ${mockUsers.length} users, ${mockAuditLogs.length} audit logs`)

      setUsers(mockUsers)
      setAuditLogs(mockAuditLogs)
      setKeyRotationEvents(mockKeyRotationEvents)
      setSecurityMetrics(mockMetrics)
      setIsLoading(false)
    } catch (error) {
      logSecurityAction(`ERROR: Failed to fetch security data - ${error}`)
      setIsLoading(false)
    }
  }

  const triggerKeyRotation = async () => {
    try {
      setKeyRotationInProgress(true)
      logSecurityAction('POST /api/admin/security/key-rotation - Initiating emergency key rotation')
      
      // Simulate key rotation process
      logSecurityAction('CRYPTO: Generating new encryption key pair')
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      logSecurityAction('CRYPTO: New key fingerprint: sha256:9z8y7x6w5v4u3t2s1r0q...')
      await new Promise(resolve => setTimeout(resolve, 500))
      
      logSecurityAction('DB: Updating key_rotation_events table')
      logSecurityAction(`SQL: INSERT INTO key_rotation_events (key_id, old_fingerprint, new_fingerprint, status, triggered_by, reason) VALUES ('key-2025-003', 'sha256:f6e5d4c3b2a1...', 'sha256:9z8y7x6w5v4u...', 'initiated', 'admin-001', 'Manual emergency rotation')`)
      
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      logSecurityAction('WORKER: Starting background re-encryption of 1,247 files')
      logSecurityAction('WORKER: Processing batch 1/25 (50 files)')
      await new Promise(resolve => setTimeout(resolve, 800))
      
      logSecurityAction('WORKER: Processing batch 5/25 (250 files)')
      await new Promise(resolve => setTimeout(resolve, 600))
      
      logSecurityAction('WORKER: Processing batch 15/25 (750 files)')
      await new Promise(resolve => setTimeout(resolve, 400))
      
      logSecurityAction('WORKER: Processing batch 25/25 (1,247 files) - COMPLETED')
      logSecurityAction('CRYPTO: Key rotation completed successfully')
      
      // Add new rotation event
      const newRotationEvent: KeyRotationEvent = {
        id: `rotation-${Date.now()}`,
        timestamp: new Date().toISOString(),
        keyId: 'key-2025-003',
        oldKeyFingerprint: 'sha256:f6e5d4c3b2a1...',
        newKeyFingerprint: 'sha256:9z8y7x6w5v4u...',
        status: 'completed',
        affectedFiles: 1247,
        triggeredBy: 'admin-001',
        reason: 'Manual emergency rotation'
      }
      
      setKeyRotationEvents(prev => [newRotationEvent, ...prev])
      
      // Test decryption with new key
      await testDecryption()
      
      setKeyRotationInProgress(false)
      alert('تم تدوير المفاتيح بنجاح! جميع الملفات تم إعادة تشفيرها.')
      
    } catch (error) {
      logSecurityAction(`ERROR: Key rotation failed - ${error}`)
      setKeyRotationInProgress(false)
      alert('فشل في تدوير المفاتيح')
    }
  }

  const testDecryption = async () => {
    try {
      logSecurityAction('DECRYPT_TEST: Testing decryption with new key')
      
      const testFiles = [
        '/encrypted/videos/demo_video_001.enc',
        '/encrypted/reports/student_report_123.enc',
        '/encrypted/profiles/user_profile_456.enc'
      ]
      
      const results: string[] = []
      
      for (const file of testFiles) {
        logSecurityAction(`DECRYPT_TEST: Attempting to decrypt ${file}`)
        await new Promise(resolve => setTimeout(resolve, 300))
        
        // Simulate successful decryption
        const success = Math.random() > 0.1 // 90% success rate
        if (success) {
          logSecurityAction(`DECRYPT_TEST: ✅ Successfully decrypted ${file}`)
          results.push(`✅ ${file} - Decryption successful`)
        } else {
          logSecurityAction(`DECRYPT_TEST: ❌ Failed to decrypt ${file}`)
          results.push(`❌ ${file} - Decryption failed`)
        }
      }
      
      setDecryptTestResults(results)
      logSecurityAction(`DECRYPT_TEST: Completed - ${results.filter(r => r.includes('✅')).length}/${testFiles.length} files successfully decrypted`)
      
    } catch (error) {
      logSecurityAction(`ERROR: Decryption test failed - ${error}`)
    }
  }

  const emergencyRevokeUser = async (userId: string) => {
    try {
      logSecurityAction(`POST /api/admin/security/emergency-revoke - Revoking access for user ${userId}`)
      
      // Update user status
      logSecurityAction(`SQL: UPDATE users SET status = 'revoked', consent_status = 'emergency_revoked', revoked_at = NOW(), revoked_by = 'admin-001' WHERE id = '${userId}'`)
      
      // Create audit log entry
      logSecurityAction(`SQL: INSERT INTO audit_logs (user_id, action, resource, outcome, details, ip_address, timestamp) VALUES ('${userId}', 'EMERGENCY_REVOKE', 'user_access', 'success', 'Emergency access revocation by admin', '192.168.1.10', NOW())`)
      
      // Update RLS policies
      logSecurityAction('RLS: Refreshing Row Level Security policies')
      logSecurityAction(`SQL: SELECT set_config('app.current_user_id', '${userId}', true)`)
      logSecurityAction('SQL: REFRESH MATERIALIZED VIEW user_access_permissions')
      
      // Test RLS blocking
      logSecurityAction('RLS_TEST: Testing access block for revoked user')
      logSecurityAction(`SQL: SELECT * FROM student_profiles WHERE user_id = '${userId}' -- Should return 0 rows`)
      logSecurityAction('RLS_TEST: ✅ Access successfully blocked by RLS policies')
      
      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, status: 'revoked' as const, consentStatus: 'emergency_revoked' }
          : user
      ))
      
      // Add audit log
      const newAuditLog: AuditLog = {
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        userId: userId,
        userName: users.find(u => u.id === userId)?.name || 'Unknown',
        action: 'EMERGENCY_REVOKE',
        resource: 'user_access',
        outcome: 'success',
        ipAddress: '192.168.1.10',
        userAgent: 'Admin Dashboard',
        details: 'Emergency access revocation by admin'
      }
      
      setAuditLogs(prev => [newAuditLog, ...prev])
      
      logSecurityAction(`SUCCESS: User ${userId} access revoked and RLS policies updated`)
      alert('تم إلغاء صلاحيات المستخدم بنجاح وتحديث سياسات الأمان')
      
    } catch (error) {
      logSecurityAction(`ERROR: Failed to revoke user access - ${error}`)
      alert('فشل في إلغاء صلاحيات المستخدم')
    }
  }

  const exportAuditLogs = async () => {
    try {
      logSecurityAction('GET /api/admin/security/audit-logs/export - Exporting audit logs')
      
      const csvData = [
        ['Timestamp', 'User ID', 'User Name', 'Action', 'Resource', 'Outcome', 'IP Address', 'Details'],
        ...auditLogs.map(log => [
          new Date(log.timestamp).toLocaleString('ar-SA'),
          log.userId,
          log.userName,
          log.action,
          log.resource,
          log.outcome,
          log.ipAddress,
          log.details
        ])
      ]

      const csvContent = csvData.map(row => row.join(',')).join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
      link.click()

      logSecurityAction(`SUCCESS: Exported ${auditLogs.length} audit log entries`)
    } catch (error) {
      logSecurityAction(`ERROR: Failed to export audit logs - ${error}`)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'suspended': return 'bg-yellow-100 text-yellow-800'
      case 'revoked': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'success': return 'bg-green-100 text-green-800'
      case 'failure': return 'bg-red-100 text-red-800'
      case 'blocked': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل لوحة الأمان...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة الأمان الإدارية</h1>
              <p className="text-gray-600">إدارة المستخدمين والأمان وتدوير المفاتيح</p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={triggerKeyRotation}
                disabled={keyRotationInProgress}
                className="bg-red-600 hover:bg-red-700"
              >
                {keyRotationInProgress ? (
                  <RefreshCw className="h-4 w-4 ml-1 animate-spin" />
                ) : (
                  <RotateCw className="h-4 w-4 ml-1" />
                )}
                تدوير المفاتيح الطارئ
              </Button>
            </div>
          </div>
        </div>

        {/* Security Metrics */}
        {securityMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{securityMetrics.totalUsers}</div>
                <div className="text-sm text-gray-600">إجمالي المستخدمين</div>
                <div className="text-xs text-green-600 mt-1">
                  {securityMetrics.activeUsers} نشط
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{securityMetrics.successfulLogins24h}</div>
                <div className="text-sm text-gray-600">تسجيل دخول ناجح</div>
                <div className="text-xs text-gray-500 mt-1">آخر 24 ساعة</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{securityMetrics.failedLogins24h}</div>
                <div className="text-sm text-gray-600">محاولات فاشلة</div>
                <div className="text-xs text-red-600 mt-1">آخر 24 ساعة</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Key className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{securityMetrics.keyRotationsThisMonth}</div>
                <div className="text-sm text-gray-600">تدوير المفاتيح</div>
                <div className="text-xs text-gray-500 mt-1">هذا الشهر</div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="users">إدارة المستخدمين</TabsTrigger>
            <TabsTrigger value="audit">سجل التدقيق</TabsTrigger>
            <TabsTrigger value="keys">تدوير المفاتيح</TabsTrigger>
            <TabsTrigger value="decrypt">اختبار فك التشفير</TabsTrigger>
            <TabsTrigger value="logs">سجل النظام</TabsTrigger>
          </TabsList>

          {/* Users Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    إدارة المستخدمين
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="البحث عن مستخدم..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{user.name}</h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-sm text-gray-500">{user.role}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(user.status)}>
                            {user.status === 'active' ? 'نشط' :
                             user.status === 'suspended' ? 'معلق' : 'ملغي'}
                          </Badge>
                          <Badge variant="outline">
                            {user.consentStatus === 'active' ? 'موافق' : 'ملغي الموافقة'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-gray-600">آخر تسجيل دخول:</span>
                          <p className="font-medium">{new Date(user.lastLogin).toLocaleDateString('ar-SA')}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">تاريخ الإنشاء:</span>
                          <p className="font-medium">{new Date(user.createdAt).toLocaleDateString('ar-SA')}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">المحاولات الفاشلة:</span>
                          <p className={`font-medium ${user.failedAttempts > 3 ? 'text-red-600' : 'text-green-600'}`}>
                            {user.failedAttempts}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">حالة الموافقة:</span>
                          <p className="font-medium">{user.consentStatus}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedUser(user)}
                        >
                          <Eye className="h-4 w-4 ml-1" />
                          عرض التفاصيل
                        </Button>
                        {user.status === 'active' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => emergencyRevokeUser(user.id)}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            <UserX className="h-4 w-4 ml-1" />
                            إلغاء طارئ
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Logs Tab */}
          <TabsContent value="audit" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    سجل التدقيق الأمني
                  </CardTitle>
                  <Button onClick={exportAuditLogs} variant="outline">
                    <Download className="h-4 w-4 ml-1" />
                    تصدير CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{log.action}</h3>
                            <Badge className={getOutcomeColor(log.outcome)}>
                              {log.outcome === 'success' ? 'نجح' :
                               log.outcome === 'failure' ? 'فشل' : 'محظور'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{log.userName} - {log.resource}</p>
                          <p className="text-sm text-gray-500">{log.details}</p>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <p>{new Date(log.timestamp).toLocaleString('ar-SA')}</p>
                          <p>{log.ipAddress}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Key Rotation Tab */}
          <TabsContent value="keys" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-purple-600" />
                  أحداث تدوير المفاتيح
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {keyRotationEvents.map((event) => (
                    <div key={event.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">Key ID: {event.keyId}</h3>
                            <Badge className={
                              event.status === 'completed' ? 'bg-green-100 text-green-800' :
                              event.status === 'initiated' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {event.status === 'completed' ? 'مكتمل' :
                               event.status === 'initiated' ? 'جاري' : 'فشل'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">السبب: {event.reason}</p>
                          <p className="text-sm text-gray-500">بواسطة: {event.triggeredBy}</p>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <p>{new Date(event.timestamp).toLocaleString('ar-SA')}</p>
                          <p>الملفات المتأثرة: {event.affectedFiles.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-gray-600">البصمة القديمة:</span>
                          <p className="font-mono bg-gray-100 p-1 rounded">{event.oldKeyFingerprint}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">البصمة الجديدة:</span>
                          <p className="font-mono bg-gray-100 p-1 rounded">{event.newKeyFingerprint}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Decrypt Test Tab */}
          <TabsContent value="decrypt" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-orange-600" />
                  اختبار فك التشفير
                </CardTitle>
                <CardDescription>
                  اختبار قدرة النظام على فك تشفير الملفات بعد تدوير المفاتيح
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button onClick={testDecryption} variant="outline">
                    <Unlock className="h-4 w-4 ml-1" />
                    تشغيل اختبار فك التشفير
                  </Button>
                  
                  {decryptTestResults.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-3">نتائج اختبار فك التشفير:</h3>
                      <div className="space-y-2">
                        {decryptTestResults.map((result, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            {result.includes('✅') ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                            <span className="font-mono">{result}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Logs Tab */}
          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-gray-600" />
                  سجل النظام والأمان
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
                  {apiLogs.length > 0 ? (
                    apiLogs.map((log, index) => (
                      <div key={index} className="mb-1">{log}</div>
                    ))
                  ) : (
                    <div className="text-gray-500">لا توجد سجلات نظام حتى الآن</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}