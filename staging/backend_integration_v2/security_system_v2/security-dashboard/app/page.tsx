'use client'

import { useState, useEffect } from 'react'
import { SecurityDashboard } from '@/components/security-dashboard'
import { AuditLogsTable } from '@/components/audit-logs-table'
import { ThreatMonitor } from '@/components/threat-monitor'
import { SecurityMetrics } from '@/components/security-metrics'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshCw, Shield, AlertTriangle, Activity, Database } from 'lucide-react'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLastRefresh(new Date())
    setIsLoading(false)
  }

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            لوحة مراقبة الأمان - منصة حركة
          </h1>
          <p className="text-muted-foreground">
            مراقبة الأمان في الوقت الفعلي ونظام كشف التهديدات
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

      {/* Security Status Alert */}
      <Card className="border-green-200 bg-green-50 dark:bg-green-950">
        <CardHeader className="pb-3">
          <CardTitle className="text-green-800 dark:text-green-200 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            حالة النظام: آمن
          </CardTitle>
          <CardDescription className="text-green-700 dark:text-green-300">
            جميع أنظمة الأمان تعمل بشكل طبيعي. لا توجد تهديدات نشطة.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            نظرة عامة
          </TabsTrigger>
          <TabsTrigger value="audit-logs" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            سجلات المراجعة
          </TabsTrigger>
          <TabsTrigger value="threats" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            مراقبة التهديدات
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            مقاييس الأمان
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <SecurityDashboard />
        </TabsContent>

        <TabsContent value="audit-logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>سجلات المراجعة</CardTitle>
              <CardDescription>
                جميع العمليات والأنشطة المسجلة في النظام
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AuditLogsTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="threats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>مراقبة التهديدات</CardTitle>
              <CardDescription>
                كشف ومراقبة الأنشطة المشبوهة ومحاولات الاختراق
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ThreatMonitor />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <SecurityMetrics />
        </TabsContent>
      </Tabs>
    </div>
  )
}