// مكون اختبار واجهات API التجريبية
// Staging API Testing Component

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Play, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock,
  Database,
  Upload,
  Bell,
  FileText,
  Activity
} from 'lucide-react';
import { stagingApi } from '@/services/staging-api-client';
import { useSchoolAnalytics, useStagingNotifications, useStagingVideoUpload } from '@/hooks/useStagingData';
import { isStaging } from '@/config/staging';

const StagingApiTester: React.FC = () => {
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  // استخدام الـ Hooks التجريبية
  const schoolAnalytics = useSchoolAnalytics();
  const notifications = useStagingNotifications();
  const videoUpload = useStagingVideoUpload();

  if (!isStaging()) {
    return (
      <Alert>
        <XCircle className="h-4 w-4" />
        <AlertDescription>
          مكون اختبار API متاح فقط في البيئة التجريبية
        </AlertDescription>
      </Alert>
    );
  }

  // تشغيل اختبار API
  const runApiTest = async (testName: string, apiCall: () => Promise<any>) => {
    setLoading(prev => ({ ...prev, [testName]: true }));
    
    try {
      const startTime = Date.now();
      const result = await apiCall();
      const duration = Date.now() - startTime;
      
      setTestResults(prev => ({
        ...prev,
        [testName]: {
          success: true,
          data: result,
          duration,
          timestamp: new Date().toISOString()
        }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [testName]: {
          success: false,
          error: error instanceof Error ? error.message : 'خطأ غير معروف',
          timestamp: new Date().toISOString()
        }
      }));
    } finally {
      setLoading(prev => ({ ...prev, [testName]: false }));
    }
  };

  // اختبارات API المختلفة
  const apiTests = [
    {
      name: 'school-analytics',
      title: 'التحليلات العامة للمدرسة',
      icon: Database,
      test: () => stagingApi.getSchoolAnalytics()
    },
    {
      name: 'students-at-risk',
      title: 'الطلاب المحتاجين للمتابعة',
      icon: Activity,
      test: () => stagingApi.getStudentsAtRisk(60)
    },
    {
      name: 'class-analytics',
      title: 'تحليلات الصفوف',
      icon: FileText,
      test: () => stagingApi.getClassAnalytics()
    },
    {
      name: 'notifications',
      title: 'الإشعارات',
      icon: Bell,
      test: () => stagingApi.getNotifications()
    },
    {
      name: 'health-check',
      title: 'فحص صحة النظام',
      icon: CheckCircle,
      test: () => stagingApi.healthCheck()
    }
  ];

  // تشغيل جميع الاختبارات
  const runAllTests = async () => {
    for (const test of apiTests) {
      await runApiTest(test.name, test.test);
      // تأخير قصير بين الاختبارات
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  return (
    <div className="space-y-6">
      {/* رأس المكون */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-blue-600" />
            اختبار واجهات API التجريبية
          </CardTitle>
          <CardDescription>
            اختبار شامل لجميع واجهات API في البيئة التجريبية الآمنة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button onClick={runAllTests} className="bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              تشغيل جميع الاختبارات
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setTestResults({})}
            >
              مسح النتائج
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="api-tests" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="api-tests">اختبارات API</TabsTrigger>
          <TabsTrigger value="live-data">البيانات المباشرة</TabsTrigger>
          <TabsTrigger value="video-upload">رفع الفيديو</TabsTrigger>
          <TabsTrigger value="results">النتائج</TabsTrigger>
        </TabsList>

        {/* اختبارات API */}
        <TabsContent value="api-tests">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {apiTests.map((test) => {
              const result = testResults[test.name];
              const isLoading = loading[test.name];
              const Icon = test.icon;

              return (
                <Card key={test.name}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {test.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button
                        size="sm"
                        onClick={() => runApiTest(test.name, test.test)}
                        disabled={isLoading}
                        className="w-full"
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                            جاري الاختبار...
                          </>
                        ) : (
                          <>
                            <Play className="h-3 w-3 mr-2" />
                            تشغيل الاختبار
                          </>
                        )}
                      </Button>

                      {result && (
                        <div className="space-y-2">
                          <Badge 
                            variant={result.success ? "default" : "destructive"}
                            className="w-full justify-center"
                          >
                            {result.success ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                نجح
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3 w-3 mr-1" />
                                فشل
                              </>
                            )}
                          </Badge>
                          
                          {result.duration && (
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {result.duration}ms
                            </div>
                          )}
                          
                          {result.error && (
                            <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                              {result.error}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* البيانات المباشرة */}
        <TabsContent value="live-data">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* التحليلات العامة */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">التحليلات العامة للمدرسة</CardTitle>
              </CardHeader>
              <CardContent>
                {schoolAnalytics.loading ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    جاري التحميل...
                  </div>
                ) : schoolAnalytics.error ? (
                  <Alert>
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>{schoolAnalytics.error}</AlertDescription>
                  </Alert>
                ) : schoolAnalytics.data ? (
                  <div className="space-y-2 text-sm">
                    <div>إجمالي الطلاب: {schoolAnalytics.data.data?.totalAnalyses || 'غير متاح'}</div>
                    <div>متوسط الأداء: {schoolAnalytics.data.data?.averagePerformance || 'غير متاح'}%</div>
                    <div>يحتاجون متابعة: {schoolAnalytics.data.data?.studentsNeedingFollowup || 'غير متاح'}</div>
                  </div>
                ) : (
                  <div className="text-muted-foreground">لا توجد بيانات</div>
                )}
                
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={schoolAnalytics.refetch}
                  className="mt-3 w-full"
                >
                  <RefreshCw className="h-3 w-3 mr-2" />
                  تحديث
                </Button>
              </CardContent>
            </Card>

            {/* الإشعارات */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center justify-between">
                  الإشعارات التجريبية
                  {notifications.unreadCount > 0 && (
                    <Badge variant="destructive">{notifications.unreadCount}</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {notifications.loading ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    جاري التحميل...
                  </div>
                ) : notifications.error ? (
                  <Alert>
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>{notifications.error}</AlertDescription>
                  </Alert>
                ) : notifications.data?.data?.notifications ? (
                  <div className="space-y-2">
                    {notifications.data.data.notifications.slice(0, 3).map((notification: any) => (
                      <div 
                        key={notification.id}
                        className={`p-2 rounded text-xs ${
                          notification.isRead ? 'bg-gray-50' : 'bg-blue-50'
                        }`}
                      >
                        <div className="font-medium">{notification.title}</div>
                        <div className="text-muted-foreground">{notification.message}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted-foreground">لا توجد إشعارات</div>
                )}
                
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={notifications.refetch}
                  className="mt-3 w-full"
                >
                  <RefreshCw className="h-3 w-3 mr-2" />
                  تحديث
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* رفع الفيديو */}
        <TabsContent value="video-upload">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                اختبار رفع الفيديو التجريبي
              </CardTitle>
              <CardDescription>
                اختبار وظيفة رفع الفيديو مع تحليل وهمي
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="اسم الطالب" />
                  <Input placeholder="اسم الصف" />
                </div>
                
                <Input type="file" accept="video/*" />
                
                {videoUpload.uploading && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      جاري الرفع... {videoUpload.progress}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${videoUpload.progress}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {videoUpload.result && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      تم رفع الفيديو وإجراء التحليل بنجاح! 
                      النتيجة: {videoUpload.result.analysis?.overall_score}%
                    </AlertDescription>
                  </Alert>
                )}
                
                {videoUpload.error && (
                  <Alert>
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>{videoUpload.error}</AlertDescription>
                  </Alert>
                )}
                
                <Button className="w-full" disabled={videoUpload.uploading}>
                  <Upload className="h-4 w-4 mr-2" />
                  رفع فيديو تجريبي
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* النتائج */}
        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>نتائج الاختبارات</CardTitle>
              <CardDescription>
                تفاصيل جميع اختبارات API التي تم تشغيلها
              </CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(testResults).length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  لم يتم تشغيل أي اختبارات بعد
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(testResults).map(([testName, result]) => (
                    <Card key={testName}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center justify-between">
                          {testName}
                          <Badge variant={result.success ? "default" : "destructive"}>
                            {result.success ? 'نجح' : 'فشل'}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          value={JSON.stringify(result, null, 2)}
                          readOnly
                          className="font-mono text-xs"
                          rows={6}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StagingApiTester;