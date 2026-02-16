import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TestTube,
  Play,
  Pause,
  Square,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  Target,
  BarChart3,
  Download,
  Upload,
  Wifi,
  WifiOff,
  Save,
  Trash2,
  Eye,
  Settings,
  MapPin
} from 'lucide-react';

interface PosePoint {
  x: number;
  y: number;
  confidence: number;
}

interface SessionData {
  id: string;
  participantId: string;
  sessionDate: Date;
  aiAccuracy: number;
  humanCoachRating: number;
  responseTime: number;
  correctMovements: number;
  totalMovements: number;
  errors: string[];
  participantFeedback: string;
  coachNotes: string;
  isStable: boolean;
  testId?: string;
}

interface PilotTest {
  id: string;
  name: string;
  description: string;
  location: string;
  environment: 'school' | 'community';
  exercise: string;
  exerciseAr: string;
  startDate: Date;
  endDate?: Date;
  status: 'planning' | 'active' | 'completed' | 'paused';
  participants: PilotParticipant[];
  results: PilotResult[];
  settings: PilotSettings;
  adminNotes: string[];
}

interface PilotParticipant {
  id: string;
  name: string;
  age: number;
  userType: 'student' | 'youth';
  experience: 'beginner' | 'intermediate' | 'advanced';
  joinedAt: Date;
  completedSessions: number;
  averageAccuracy: number;
  feedback: string[];
}

interface PilotResult {
  id: string;
  participantId: string;
  sessionDate: Date;
  aiAccuracy: number;
  humanCoachRating: number;
  responseTime: number; // بالثواني
  correctMovements: number;
  totalMovements: number;
  errors: string[];
  participantFeedback: string;
  coachNotes: string;
  isStable: boolean;
}

interface PilotSettings {
  targetAccuracy: number; // النسبة المطلوبة للنجاح
  maxResponseTime: number; // الحد الأقصى لزمن الاستجابة
  minParticipants: number;
  maxParticipants: number;
  sessionDuration: number; // بالدقائق
  offlineMode: boolean;
  autoSync: boolean;
}

export const PilotTestMode: React.FC = () => {
  const [currentTest, setCurrentTest] = useState<PilotTest | null>(null);
  const [pilotTests, setPilotTests] = useState<PilotTest[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingData, setPendingData] = useState<SessionData[]>([]);
  const [showCreateTest, setShowCreateTest] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentSession, setCurrentSession] = useState<SessionData | null>(null);

  // مراقبة حالة الاتصال
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // تحميل البيانات المحفوظة
  useEffect(() => {
    const savedTests = localStorage.getItem('pilotTests');
    if (savedTests) {
      setPilotTests(JSON.parse(savedTests));
    }
    
    const savedPendingData = localStorage.getItem('pendingPilotData');
    if (savedPendingData) {
      setPendingData(JSON.parse(savedPendingData));
    }
  }, []);

  // مزامنة البيانات عند الاتصال
  useEffect(() => {
    if (isOnline && pendingData.length > 0) {
      syncPendingData();
    }
  }, [isOnline, pendingData]);

  // إنشاء اختبار تجريبي جديد
  const createPilotTest = (testData: Partial<PilotTest>) => {
    const newTest: PilotTest = {
      id: Date.now().toString(),
      name: testData.name || 'اختبار تجريبي جديد',
      description: testData.description || '',
      location: testData.location || '',
      environment: testData.environment || 'school',
      exercise: 'squat',
      exerciseAr: 'القرفصاء',
      startDate: new Date(),
      status: 'planning',
      participants: [],
      results: [],
      settings: {
        targetAccuracy: 85,
        maxResponseTime: 1.5,
        minParticipants: 5,
        maxParticipants: 20,
        sessionDuration: 15,
        offlineMode: true,
        autoSync: true
      },
      adminNotes: []
    };
    
    const updatedTests = [...pilotTests, newTest];
    setPilotTests(updatedTests);
    localStorage.setItem('pilotTests', JSON.stringify(updatedTests));
    setCurrentTest(newTest);
    setShowCreateTest(false);
  };

  // بدء الاختبار التجريبي
  const startPilotTest = (testId: string) => {
    const updatedTests = pilotTests.map(test => 
      test.id === testId 
        ? { ...test, status: 'active' as const, startDate: new Date() }
        : test
    );
    
    setPilotTests(updatedTests);
    localStorage.setItem('pilotTests', JSON.stringify(updatedTests));
    
    const test = updatedTests.find(t => t.id === testId);
    if (test) {
      setCurrentTest(test);
    }
  };

  // إيقاف الاختبار مؤقتاً
  const pausePilotTest = (testId: string) => {
    const updatedTests = pilotTests.map(test => 
      test.id === testId 
        ? { ...test, status: 'paused' as const }
        : test
    );
    
    setPilotTests(updatedTests);
    localStorage.setItem('pilotTests', JSON.stringify(updatedTests));
  };

  // إنهاء الاختبار
  const completePilotTest = (testId: string) => {
    const updatedTests = pilotTests.map(test => 
      test.id === testId 
        ? { ...test, status: 'completed' as const, endDate: new Date() }
        : test
    );
    
    setPilotTests(updatedTests);
    localStorage.setItem('pilotTests', JSON.stringify(updatedTests));
    
    // تحليل النتائج
    const test = updatedTests.find(t => t.id === testId);
    if (test) {
      analyzeTestResults(test);
    }
  };

  // تحليل نتائج الاختبار
  const analyzeTestResults = (test: PilotTest) => {
    const results = test.results;
    if (results.length === 0) return;
    
    const averageAIAccuracy = results.reduce((sum, r) => sum + r.aiAccuracy, 0) / results.length;
    const averageHumanRating = results.reduce((sum, r) => sum + r.humanCoachRating, 0) / results.length;
    const averageResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;
    const stabilityRate = results.filter(r => r.isStable).length / results.length * 100;
    
    const isSuccessful = 
      averageAIAccuracy >= test.settings.targetAccuracy &&
      averageResponseTime <= test.settings.maxResponseTime &&
      stabilityRate >= 90;
    
    const analysisNote = `
تحليل نتائج الاختبار التجريبي:
- دقة الذكاء الاصطناعي: ${averageAIAccuracy.toFixed(1)}%
- تقييم المدرب البشري: ${averageHumanRating.toFixed(1)}%
- متوسط زمن الاستجابة: ${averageResponseTime.toFixed(2)} ثانية
- معدل الاستقرار: ${stabilityRate.toFixed(1)}%
- النتيجة: ${isSuccessful ? 'نجح الاختبار ✅' : 'يحتاج تحسين ⚠️'}
    `;
    
    const updatedTest = {
      ...test,
      adminNotes: [...test.adminNotes, analysisNote]
    };
    
    const updatedTests = pilotTests.map(t => t.id === test.id ? updatedTest : t);
    setPilotTests(updatedTests);
    localStorage.setItem('pilotTests', JSON.stringify(updatedTests));
  };

  // إضافة مشارك جديد
  const addParticipant = (testId: string, participantData: Partial<PilotParticipant>) => {
    const participant: PilotParticipant = {
      id: Date.now().toString(),
      name: participantData.name || 'مشارك جديد',
      age: participantData.age || 18,
      userType: participantData.userType || 'student',
      experience: participantData.experience || 'beginner',
      joinedAt: new Date(),
      completedSessions: 0,
      averageAccuracy: 0,
      feedback: []
    };
    
    const updatedTests = pilotTests.map(test => 
      test.id === testId 
        ? { ...test, participants: [...test.participants, participant] }
        : test
    );
    
    setPilotTests(updatedTests);
    localStorage.setItem('pilotTests', JSON.stringify(updatedTests));
  };

  // تسجيل نتيجة جلسة
  const recordSessionResult = (testId: string, participantId: string, resultData: Partial<PilotResult>) => {
    const result: PilotResult = {
      id: Date.now().toString(),
      participantId,
      sessionDate: new Date(),
      aiAccuracy: resultData.aiAccuracy || 0,
      humanCoachRating: resultData.humanCoachRating || 0,
      responseTime: resultData.responseTime || 0,
      correctMovements: resultData.correctMovements || 0,
      totalMovements: resultData.totalMovements || 0,
      errors: resultData.errors || [],
      participantFeedback: resultData.participantFeedback || '',
      coachNotes: resultData.coachNotes || '',
      isStable: resultData.isStable || false
    };
    
    if (isOnline) {
      // حفظ مباشر إذا كان متصلاً
      saveResultToTest(testId, result);
    } else {
      // حفظ في البيانات المعلقة إذا كان غير متصل
      const sessionData: SessionData = { ...result, testId };
      const newPendingData = [...pendingData, sessionData];
      setPendingData(newPendingData);
      localStorage.setItem('pendingPilotData', JSON.stringify(newPendingData));
    }
  };

  // حفظ النتيجة في الاختبار
  const saveResultToTest = (testId: string, result: PilotResult) => {
    const updatedTests = pilotTests.map(test => 
      test.id === testId 
        ? { ...test, results: [...test.results, result] }
        : test
    );
    
    setPilotTests(updatedTests);
    localStorage.setItem('pilotTests', JSON.stringify(updatedTests));
  };

  // مزامنة البيانات المعلقة
  const syncPendingData = async () => {
    try {
      // محاكاة رفع البيانات للخادم
      for (const data of pendingData) {
        const { testId, ...result } = data;
        if (testId) {
          saveResultToTest(testId, result);
        }
      }
      
      // مسح البيانات المعلقة بعد المزامنة
      setPendingData([]);
      localStorage.removeItem('pendingPilotData');
      
      console.log('تم مزامنة البيانات بنجاح');
    } catch (error) {
      console.error('فشل في مزامنة البيانات:', error);
    }
  };

  // محاكاة جلسة تدريب
  const simulateSession = (testId: string, participantId: string) => {
    setIsRecording(true);
    
    // محاكاة جلسة تدريب لمدة 5 ثوان
    setTimeout(() => {
      const mockResult = {
        aiAccuracy: 70 + Math.random() * 30, // 70-100%
        humanCoachRating: 60 + Math.random() * 40, // 60-100%
        responseTime: 0.5 + Math.random() * 2, // 0.5-2.5 ثانية
        correctMovements: Math.floor(8 + Math.random() * 5), // 8-12
        totalMovements: 12,
        errors: ['حافظ على استقامة الظهر', 'انزل أكثر'].slice(0, Math.floor(Math.random() * 3)),
        participantFeedback: 'تجربة جيدة، النظام يعمل بشكل مناسب',
        coachNotes: 'أداء مقبول، يحتاج تحسين في الدقة',
        isStable: Math.random() > 0.2 // 80% احتمال الاستقرار
      };
      
      recordSessionResult(testId, participantId, mockResult);
      setIsRecording(false);
    }, 5000);
  };

  // تصدير نتائج الاختبار
  const exportTestResults = (test: PilotTest) => {
    const exportData = {
      test,
      analysis: {
        totalParticipants: test.participants.length,
        totalSessions: test.results.length,
        averageAccuracy: test.results.length > 0 ? 
          test.results.reduce((sum, r) => sum + r.aiAccuracy, 0) / test.results.length : 0,
        successRate: test.results.filter(r => r.aiAccuracy >= test.settings.targetAccuracy).length / test.results.length * 100
      },
      exportDate: new Date()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pilot-test-${test.id}-results.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      planning: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || colors.planning;
  };

  const getStatusText = (status: string) => {
    const texts = {
      planning: 'في التخطيط',
      active: 'نشط',
      paused: 'متوقف مؤقتاً',
      completed: 'مكتمل'
    };
    return texts[status as keyof typeof texts] || status;
  };

  return (
    <div className="space-y-6">
      {/* عنوان الوحدة */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-2">🧪 وضع الاختبار الميداني</h2>
        <p className="text-muted-foreground">اختبار وتقييم نظام التصحيح الحركي في بيئة حقيقية</p>
      </div>

      {/* حالة الاتصال والبيانات المعلقة */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isOnline ? (
                <div className="flex items-center gap-2 text-green-600">
                  <Wifi className="w-5 h-5" />
                  <span>متصل</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <WifiOff className="w-5 h-5" />
                  <span>غير متصل - الوضع المحلي نشط</span>
                </div>
              )}
              
              {pendingData.length > 0 && (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-800">
                  {pendingData.length} نتيجة في انتظار المزامنة
                </Badge>
              )}
            </div>
            
            {pendingData.length > 0 && isOnline && (
              <Button size="sm" onClick={syncPendingData}>
                <Upload className="w-4 h-4 mr-2" />
                مزامنة البيانات
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* قائمة الاختبارات التجريبية */}
      {!currentTest && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <TestTube className="w-5 h-5 text-primary" />
                الاختبارات التجريبية
              </CardTitle>
              <Button onClick={() => setShowCreateTest(true)}>
                <TestTube className="w-4 h-4 mr-2" />
                إنشاء اختبار جديد
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {pilotTests.length === 0 ? (
              <div className="text-center py-8">
                <TestTube className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">لا توجد اختبارات تجريبية</h3>
                <p className="text-muted-foreground">أنشئ اختباراً تجريبياً لبدء تقييم النظام</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pilotTests.map(test => (
                  <div key={test.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{test.name}</h4>
                        <Badge className={getStatusColor(test.status)}>
                          {getStatusText(test.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {test.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {test.participants.length} مشارك
                        </span>
                        <span className="flex items-center gap-1">
                          <BarChart3 className="w-3 h-3" />
                          {test.results.length} نتيجة
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCurrentTest(test)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {test.status === 'planning' && (
                        <Button
                          size="sm"
                          onClick={() => startPilotTest(test.id)}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                      )}
                      {test.status === 'active' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => pausePilotTest(test.id)}
                          >
                            <Pause className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => completePilotTest(test.id)}
                          >
                            <Square className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      {test.status === 'completed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => exportTestResults(test)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* إنشاء اختبار جديد */}
      {showCreateTest && (
        <Card>
          <CardHeader>
            <CardTitle>إنشاء اختبار تجريبي جديد</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">اسم الاختبار</label>
              <Input placeholder="مثال: اختبار القرفصاء - المدرسة الابتدائية الأولى" />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">الموقع</label>
              <Input placeholder="مثال: المدرسة الابتدائية الأولى - الجزائر العاصمة" />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">الوصف</label>
              <Textarea placeholder="وصف مختصر عن الاختبار وأهدافه..." rows={3} />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">البيئة</label>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">مدرسية</Button>
                  <Button size="sm" variant="default">مجتمعية</Button>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">التمرين</label>
                <div className="flex gap-2">
                  <Button size="sm" variant="default">القرفصاء</Button>
                  <Button size="sm" variant="outline">الضغط</Button>
                  <Button size="sm" variant="outline">القفز</Button>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={() => createPilotTest({
                name: 'اختبار القرفصاء التجريبي',
                location: 'المدرسة الابتدائية الأولى',
                description: 'اختبار دقة نظام التصحيح الحركي',
                environment: 'school'
              })}>
                <Save className="w-4 h-4 mr-2" />
                إنشاء الاختبار
              </Button>
              <Button variant="outline" onClick={() => setShowCreateTest(false)}>
                إلغاء
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* تفاصيل الاختبار الحالي */}
      {currentTest && (
        <div className="space-y-6">
          {/* معلومات الاختبار */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <TestTube className="w-5 h-5 text-primary" />
                    {currentTest.name}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {currentTest.description}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(currentTest.status)}>
                    {getStatusText(currentTest.status)}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCurrentTest(null)}
                  >
                    العودة للقائمة
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{currentTest.participants.length}</div>
                  <div className="text-sm text-blue-700">المشاركون</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{currentTest.results.length}</div>
                  <div className="text-sm text-green-700">الجلسات المكتملة</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {currentTest.results.length > 0 ? 
                      Math.round(currentTest.results.reduce((sum, r) => sum + r.aiAccuracy, 0) / currentTest.results.length) : 0}%
                  </div>
                  <div className="text-sm text-purple-700">متوسط الدقة</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {currentTest.results.length > 0 ? 
                      (currentTest.results.reduce((sum, r) => sum + r.responseTime, 0) / currentTest.results.length).toFixed(1) : 0}ث
                  </div>
                  <div className="text-sm text-orange-700">متوسط زمن الاستجابة</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* المشاركون */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-secondary" />
                المشاركون في الاختبار
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentTest.participants.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">لا يوجد مشاركون بعد</p>
                  <Button 
                    className="mt-4"
                    onClick={() => addParticipant(currentTest.id, {
                      name: `مشارك ${currentTest.participants.length + 1}`,
                      age: 16 + Math.floor(Math.random() * 10),
                      userType: currentTest.environment === 'school' ? 'student' : 'youth',
                      experience: 'beginner'
                    })}
                  >
                    إضافة مشارك تجريبي
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentTest.participants.map(participant => (
                    <div key={participant.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{participant.name}</h4>
                          <Badge variant="outline">
                            {participant.userType === 'student' ? 'تلميذ' : 'شاب'}
                          </Badge>
                          <Badge variant="outline">{participant.age} سنة</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {participant.completedSessions} جلسة مكتملة - 
                          دقة متوسطة: {Math.round(participant.averageAccuracy)}%
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => simulateSession(currentTest.id, participant.id)}
                          disabled={isRecording || currentTest.status !== 'active'}
                        >
                          {isRecording ? (
                            <>
                              <Clock className="w-4 h-4 mr-2 animate-pulse" />
                              جاري التسجيل...
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              بدء جلسة
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    variant="outline"
                    onClick={() => addParticipant(currentTest.id, {
                      name: `مشارك ${currentTest.participants.length + 1}`,
                      age: 16 + Math.floor(Math.random() * 10),
                      userType: currentTest.environment === 'school' ? 'student' : 'youth',
                      experience: 'beginner'
                    })}
                  >
                    إضافة مشارك جديد
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* النتائج والتحليل */}
          {currentTest.results.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-accent-orange" />
                  نتائج الاختبار
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentTest.results.slice(-5).map(result => (
                    <div key={result.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium">
                            {currentTest.participants.find(p => p.id === result.participantId)?.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {result.sessionDate.toLocaleString('ar-SA')}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {result.isStable ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              مستقر
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              غير مستقر
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">دقة الذكاء الاصطناعي:</span>
                          <div className="font-semibold text-blue-600">{Math.round(result.aiAccuracy)}%</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">تقييم المدرب:</span>
                          <div className="font-semibold text-green-600">{Math.round(result.humanCoachRating)}%</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">زمن الاستجابة:</span>
                          <div className="font-semibold text-purple-600">{result.responseTime.toFixed(2)}ث</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">الحركات الصحيحة:</span>
                          <div className="font-semibold text-orange-600">
                            {result.correctMovements}/{result.totalMovements}
                          </div>
                        </div>
                      </div>
                      
                      {result.errors.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <div className="text-sm font-medium mb-1">الأخطاء المكتشفة:</div>
                          <div className="text-sm text-red-600">
                            {result.errors.join(', ')}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* ملاحظات المشرف */}
          {currentTest.adminNotes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-muted-foreground" />
                  ملاحظات المشرف
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentTest.adminNotes.map((note, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <pre className="text-sm whitespace-pre-wrap">{note}</pre>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default PilotTestMode;