'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Shield, 
  Users, 
  Database, 
  Lock, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  Clock,
  Eye,
  FileText,
  BarChart3
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'

// Mock security metrics data
const securityScoreData = [
  { category: 'المصادقة', score: 95, maxScore: 100 },
  { category: 'التشفير', score: 88, maxScore: 100 },
  { category: 'التحكم بالوصول', score: 92, maxScore: 100 },
  { category: 'مراقبة الأنشطة', score: 97, maxScore: 100 },
  { category: 'حماية البيانات', score: 90, maxScore: 100 },
  { category: 'الاستجابة للحوادث', score: 85, maxScore: 100 }
]

const complianceData = [
  { standard: 'GDPR', status: 'compliant', score: 94, lastAudit: '2024-01-15' },
  { standard: 'ISO 27001', status: 'compliant', score: 91, lastAudit: '2024-01-10' },
  { standard: 'NIST', status: 'partial', score: 78, lastAudit: '2024-01-05' },
  { standard: 'SOC 2', status: 'compliant', score: 89, lastAudit: '2024-01-12' }
]

const monthlyTrends = [
  { month: 'أكتوبر', incidents: 2, resolved: 2, avgResponseTime: 15 },
  { month: 'نوفمبر', incidents: 1, resolved: 1, avgResponseTime: 12 },
  { month: 'ديسمبر', incidents: 3, resolved: 3, avgResponseTime: 18 },
  { month: 'يناير', incidents: 1, resolved: 1, avgResponseTime: 10 }
]

const rlsPolicyMetrics = [
  { table: 'haraka_student_profiles', policies: 6, coverage: 100, lastUpdate: '2024-01-20' },
  { table: 'haraka_exercise_sessions', policies: 4, coverage: 100, lastUpdate: '2024-01-20' },
  { table: 'haraka_performance_data', policies: 5, coverage: 100, lastUpdate: '2024-01-20' },
  { table: 'haraka_user_accounts', policies: 3, coverage: 100, lastUpdate: '2024-01-20' },
  { table: 'haraka_audit_logs', policies: 2, coverage: 100, lastUpdate: '2024-01-20' }
]

const auditMetrics = {
  totalLogs: 15847,
  todayLogs: 342,
  avgDailyLogs: 425,
  retentionDays: 365,
  storageUsed: 2.4, // GB
  compressionRatio: 65
}

export function SecurityMetrics() {
  const [isLoading, setIsLoading] = useState(true)
  const [overallScore, setOverallScore] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      // Calculate overall security score
      const avgScore = securityScoreData.reduce((sum, item) => sum + item.score, 0) / securityScoreData.length
      setOverallScore(Math.round(avgScore))
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const getComplianceStatusBadge = (status: string) => {
    switch (status) {
      case 'compliant':
        return <Badge variant="outline" className="text-green-700 border-green-500">متوافق</Badge>
      case 'partial':
        return <Badge variant="outline" className="text-yellow-700 border-yellow-500">جزئي</Badge>
      case 'non-compliant':
        return <Badge variant="destructive">غير متوافق</Badge>
      default:
        return <Badge variant="outline">غير محدد</Badge>
    }
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-48"></div>
              <div className="h-4 bg-muted rounded w-64"></div>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overall Security Score */}
      <Card className="security-success">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-green-800 dark:text-green-200">
            النقاط الإجمالية للأمان
          </CardTitle>
          <CardDescription className="text-green-700 dark:text-green-300">
            تقييم شامل لحالة الأمان في النظام
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-muted"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - overallScore / 100)}`}
                className="text-green-600 transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute text-3xl font-bold text-green-800 dark:text-green-200">
              {overallScore}%
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-medium text-green-800 dark:text-green-200">ممتاز</div>
              <div className="text-green-700 dark:text-green-300">90-100%</div>
            </div>
            <div>
              <div className="font-medium">جيد</div>
              <div className="text-muted-foreground">70-89%</div>
            </div>
            <div>
              <div className="font-medium">يحتاج تحسين</div>
              <div className="text-muted-foreground">&lt;70%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="scores" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="scores">نقاط الأمان</TabsTrigger>
          <TabsTrigger value="compliance">الامتثال</TabsTrigger>
          <TabsTrigger value="rls">سياسات RLS</TabsTrigger>
          <TabsTrigger value="audit">مقاييس المراجعة</TabsTrigger>
        </TabsList>

        <TabsContent value="scores" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Security Score Radar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>تقييم مجالات الأمان</CardTitle>
                <CardDescription>
                  النقاط التفصيلية لكل مجال أمني
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={securityScoreData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" className="text-xs" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} className="text-xs" />
                    <Radar
                      name="النقاط"
                      dataKey="score"
                      stroke="#0088FE"
                      fill="#0088FE"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Monthly Trends */}
            <Card>
              <CardHeader>
                <CardTitle>الاتجاهات الشهرية</CardTitle>
                <CardDescription>
                  الحوادث الأمنية وأوقات الاستجابة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        value, 
                        name === 'incidents' ? 'حوادث' : name === 'resolved' ? 'محلولة' : 'وقت الاستجابة (دقيقة)'
                      ]}
                    />
                    <Line type="monotone" dataKey="incidents" stroke="#FF8042" strokeWidth={2} />
                    <Line type="monotone" dataKey="resolved" stroke="#00C49F" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Scores */}
          <Card>
            <CardHeader>
              <CardTitle>تفاصيل النقاط</CardTitle>
              <CardDescription>
                النقاط التفصيلية لكل مجال مع التوصيات
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {securityScoreData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{item.score}/{item.maxScore}</span>
                      {item.score >= 90 ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                  </div>
                  <Progress value={(item.score / item.maxScore) * 100} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {complianceData.map((item, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base">{item.standard}</CardTitle>
                  {getComplianceStatusBadge(item.status)}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">نقاط الامتثال</span>
                      <span className="font-medium">{item.score}%</span>
                    </div>
                    <Progress value={item.score} className="h-2" />
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      آخر مراجعة: {new Date(item.lastAudit).toLocaleDateString('ar-SA')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rls" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>تغطية سياسات RLS</CardTitle>
                <CardDescription>
                  حالة سياسات Row Level Security لكل جدول
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {rlsPolicyMetrics.map((table, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {table.table}
                      </code>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {table.policies} سياسة
                        </Badge>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>التغطية: {table.coverage}%</span>
                      <span>آخر تحديث: {new Date(table.lastUpdate).toLocaleDateString('ar-SA')}</span>
                    </div>
                    <Progress value={table.coverage} className="h-1" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>إحصائيات السياسات</CardTitle>
                <CardDescription>
                  ملخص سياسات الأمان النشطة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">إجمالي السياسات</span>
                    </div>
                    <span className="text-2xl font-bold">25</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-green-500" />
                      <span className="font-medium">الجداول المحمية</span>
                    </div>
                    <span className="text-2xl font-bold">5</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-500" />
                      <span className="font-medium">الأدوار المدعومة</span>
                    </div>
                    <span className="text-2xl font-bold">9</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="font-medium">معدل النجاح</span>
                    </div>
                    <span className="text-2xl font-bold">100%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي السجلات</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{auditMetrics.totalLogs.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  منذ بداية النظام
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">سجلات اليوم</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{auditMetrics.todayLogs}</div>
                <p className="text-xs text-muted-foreground">
                  المتوسط: {auditMetrics.avgDailyLogs}/يوم
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">مساحة التخزين</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{auditMetrics.storageUsed} GB</div>
                <p className="text-xs text-muted-foreground">
                  ضغط: {auditMetrics.compressionRatio}%
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>إعدادات المراجعة</CardTitle>
              <CardDescription>
                إعدادات نظام تسجيل العمليات
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">فترة الاحتفاظ</div>
                    <div className="text-sm text-muted-foreground">
                      مدة الاحتفاظ بسجلات المراجعة
                    </div>
                  </div>
                  <Badge variant="outline">{auditMetrics.retentionDays} يوم</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">التسجيل التلقائي</div>
                    <div className="text-sm text-muted-foreground">
                      تسجيل جميع العمليات تلقائياً
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                    مفعل
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">كشف التهديدات</div>
                    <div className="text-sm text-muted-foreground">
                      تحليل الأنماط المشبوهة
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                    مفعل
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}