import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp,
  BarChart3,
  Download,
  Eye,
  User,
  Target,
  Activity,
  Calendar,
  Award,
  FileText,
  Printer,
  Share2
} from 'lucide-react';

interface ProgressData {
  clientId: string;
  clientName: string;
  startDate: string;
  currentDate: string;
  metrics: {
    weight: { start: number; current: number; target: number; trend: number };
    bodyFat: { start: number; current: number; target: number; trend: number };
    muscle: { start: number; current: number; target: number; trend: number };
    strength: { start: number; current: number; target: number; trend: number };
    endurance: { start: number; current: number; target: number; trend: number };
  };
  achievements: {
    id: string;
    title: string;
    date: string;
    description: string;
  }[];
  sessions: {
    total: number;
    completed: number;
    attendance: number;
  };
  goals: {
    achieved: number;
    total: number;
    upcoming: string[];
  };
}

type ReportType = 'comprehensive' | 'monthly' | 'quarterly';

const mockProgressData: ProgressData[] = [
  {
    clientId: '1',
    clientName: 'أحمد محمد الصالح',
    startDate: '2024-01-15',
    currentDate: '2024-10-16',
    metrics: {
      weight: { start: 88, current: 85, target: 78, trend: -3.4 },
      bodyFat: { start: 22, current: 18, target: 15, trend: -18.2 },
      muscle: { start: 35, current: 38, target: 42, trend: 8.6 },
      strength: { start: 70, current: 92, target: 100, trend: 31.4 },
      endurance: { start: 60, current: 85, target: 90, trend: 41.7 }
    },
    achievements: [
      {
        id: '1',
        title: 'هدف الوزن الشهري',
        date: '2024-10-01',
        description: 'فقد 3 كيلو في شهر واحد'
      },
      {
        id: '2',
        title: 'محارب القوة',
        date: '2024-09-15',
        description: 'زيادة الأوزان بنسبة 30%'
      }
    ],
    sessions: {
      total: 48,
      completed: 45,
      attendance: 93.8
    },
    goals: {
      achieved: 7,
      total: 10,
      upcoming: ['الوصول للوزن المستهدف', 'زيادة كتلة العضلات', 'تحسين التحمل']
    }
  },
  {
    clientId: '2',
    clientName: 'سارة أحمد الفهد',
    startDate: '2024-02-20',
    currentDate: '2024-10-16',
    metrics: {
      weight: { start: 64, current: 62, target: 58, trend: -3.1 },
      bodyFat: { start: 25, current: 22, target: 18, trend: -12.0 },
      muscle: { start: 28, current: 31, target: 35, trend: 10.7 },
      strength: { start: 50, current: 75, target: 85, trend: 50.0 },
      endurance: { start: 65, current: 88, target: 95, trend: 35.4 }
    },
    achievements: [
      {
        id: '1',
        title: 'ملكة المرونة',
        date: '2024-10-10',
        description: 'حققت مرونة 95% في تقييم اليوغا'
      }
    ],
    sessions: {
      total: 32,
      completed: 30,
      attendance: 93.8
    },
    goals: {
      achieved: 5,
      total: 8,
      upcoming: ['تحسين القوة العضلية', 'فقدان دهون إضافية']
    }
  }
];

export function ProgressReports() {
  const [selectedClient, setSelectedClient] = useState<string>('1');
  const [reportType, setReportType] = useState<ReportType>('comprehensive');
  const [selectedData, setSelectedData] = useState<ProgressData | null>(
    mockProgressData.find(d => d.clientId === selectedClient) || null
  );

  React.useEffect(() => {
    setSelectedData(mockProgressData.find(d => d.clientId === selectedClient) || null);
  }, [selectedClient]);

  const getMetricColor = (trend: number) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getMetricIcon = (trend: number) => {
    if (trend > 0) return '↗️';
    if (trend < 0) return '↘️';
    return '➡️';
  };

  const calculateProgress = (current: number, start: number, target: number) => {
    const totalChange = target - start;
    const currentChange = current - start;
    return Math.round((currentChange / totalChange) * 100);
  };

  const generatePDFReport = () => {
    // Simulate PDF generation
    alert('تم إنشاء تقرير PDF بنجاح! سيتم تحميله قريباً...');
  };

  if (!selectedData) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            تقارير التقدم
          </CardTitle>
          <CardDescription className="text-purple-100">
            تحليل شامل لتطور العملاء مع رسوم بيانية تفاعلية
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{mockProgressData.length}</div>
              <div className="text-sm text-purple-100">عملاء نشطون</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">
                {Math.round(mockProgressData.reduce((acc, d) => acc + d.sessions.attendance, 0) / mockProgressData.length)}%
              </div>
              <div className="text-sm text-purple-100">متوسط الحضور</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">
                {mockProgressData.reduce((acc, d) => acc + d.goals.achieved, 0)}
              </div>
              <div className="text-sm text-purple-100">أهداف محققة</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">
                {mockProgressData.reduce((acc, d) => acc + d.achievements.length, 0)}
              </div>
              <div className="text-sm text-purple-100">إنجازات</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">اختيار العميل</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger>
                <SelectValue placeholder="اختر العميل" />
              </SelectTrigger>
              <SelectContent>
                {mockProgressData.map(data => (
                  <SelectItem key={data.clientId} value={data.clientId}>
                    {data.clientName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">نوع التقرير</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={reportType} onValueChange={(value: ReportType) => setReportType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="اختر نوع التقرير" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comprehensive">تقرير شامل</SelectItem>
                <SelectItem value="monthly">تقرير شهري</SelectItem>
                <SelectItem value="quarterly">تقرير ربع سنوي</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">إجراءات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button size="sm" onClick={generatePDFReport}>
                <Download className="h-4 w-4 mr-1" />
                PDF
              </Button>
              <Button size="sm" variant="outline">
                <Share2 className="h-4 w-4 mr-1" />
                مشاركة
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="metrics">المقاييس</TabsTrigger>
          <TabsTrigger value="achievements">الإنجازات</TabsTrigger>
          <TabsTrigger value="goals">الأهداف</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Client Summary */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {selectedData.clientName}
                  </CardTitle>
                  <CardDescription>
                    بدء التدريب: {selectedData.startDate} • التقرير حتى: {selectedData.currentDate}
                  </CardDescription>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  {Math.round(((new Date(selectedData.currentDate).getTime() - new Date(selectedData.startDate).getTime()) / (1000 * 60 * 60 * 24)) / 30)} شهر
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sessions Summary */}
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedData.sessions.completed}/{selectedData.sessions.total}
                  </div>
                  <div className="text-sm text-gray-500">جلسات مكتملة</div>
                  <div className="text-xs text-blue-600 font-medium mt-1">
                    {selectedData.sessions.attendance}% حضور
                  </div>
                </div>

                {/* Goals Summary */}
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {selectedData.goals.achieved}/{selectedData.goals.total}
                  </div>
                  <div className="text-sm text-gray-500">أهداف محققة</div>
                  <div className="text-xs text-green-600 font-medium mt-1">
                    {Math.round((selectedData.goals.achieved / selectedData.goals.total) * 100)}% إنجاز
                  </div>
                </div>

                {/* Achievements Summary */}
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {selectedData.achievements.length}
                  </div>
                  <div className="text-sm text-gray-500">إنجازات</div>
                  <div className="text-xs text-purple-600 font-medium mt-1">
                    جوائز ومعالم
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                المؤشرات الرئيسية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {Object.entries(selectedData.metrics).map(([key, metric]) => {
                  const progress = calculateProgress(metric.current, metric.start, metric.target);
                  return (
                    <div key={key} className="text-center p-4 border rounded-lg">
                      <div className="text-lg font-bold">
                        {key === 'weight' && `${metric.current} كغ`}
                        {key === 'bodyFat' && `${metric.current}%`}
                        {key === 'muscle' && `${metric.current} كغ`}
                        {key === 'strength' && `${metric.current}%`}
                        {key === 'endurance' && `${metric.current}%`}
                      </div>
                      <div className="text-sm text-gray-500 mb-2">
                        {key === 'weight' && 'الوزن'}
                        {key === 'bodyFat' && 'دهون الجسم'}
                        {key === 'muscle' && 'كتلة العضلات'}
                        {key === 'strength' && 'القوة'}
                        {key === 'endurance' && 'التحمل'}
                      </div>
                      <div className={`text-sm font-medium ${getMetricColor(metric.trend)}`}>
                        {getMetricIcon(metric.trend)} {Math.abs(metric.trend)}%
                      </div>
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {progress}% من الهدف
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>تفاصيل المقاييس الجسمية</CardTitle>
              <CardDescription>
                تطور مفصل لجميع المقاييس عبر فترة التدريب
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(selectedData.metrics).map(([key, metric]) => (
                  <div key={key} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">
                        {key === 'weight' && 'الوزن (كغ)'}
                        {key === 'bodyFat' && 'نسبة الدهون (%)'}
                        {key === 'muscle' && 'كتلة العضلات (كغ)'}
                        {key === 'strength' && 'مستوى القوة (%)'}
                        {key === 'endurance' && 'مستوى التحمل (%)'}
                      </h4>
                      <Badge className={getMetricColor(metric.trend).includes('green') ? 'bg-green-100 text-green-800' : 
                                      getMetricColor(metric.trend).includes('red') ? 'bg-red-100 text-red-800' : 
                                      'bg-gray-100 text-gray-800'}>
                        {metric.trend > 0 ? '+' : ''}{metric.trend}%
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                        <div className="text-lg font-bold">{metric.start}</div>
                        <div className="text-sm text-gray-500">البداية</div>
                      </div>
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                        <div className="text-lg font-bold text-blue-600">{metric.current}</div>
                        <div className="text-sm text-gray-500">الحالي</div>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded">
                        <div className="text-lg font-bold text-green-600">{metric.target}</div>
                        <div className="text-sm text-gray-500">الهدف</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                الإنجازات والجوائز
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedData.achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border">
                    <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{achievement.title}</h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{achievement.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                الأهداف والخطط المستقبلية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Goals Progress */}
              <div>
                <h4 className="font-medium mb-3">تقدم الأهداف</h4>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span>الأهداف المحققة</span>
                      <span>{selectedData.goals.achieved}/{selectedData.goals.total}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-green-600 h-3 rounded-full" 
                        style={{ width: `${(selectedData.goals.achieved / selectedData.goals.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round((selectedData.goals.achieved / selectedData.goals.total) * 100)}%
                  </div>
                </div>
              </div>

              {/* Upcoming Goals */}
              <div>
                <h4 className="font-medium mb-3">الأهداف القادمة</h4>
                <div className="space-y-2">
                  {selectedData.goals.upcoming.map((goal, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Target className="h-4 w-4 text-blue-500" />
                      <span>{goal}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            خيارات التصدير
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={generatePDFReport} className="h-20 flex-col gap-2">
              <Download className="h-6 w-6" />
              تحميل تقرير PDF
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Printer className="h-6 w-6" />
              طباعة التقرير
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Share2 className="h-6 w-6" />
              مشاركة مع العميل
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}