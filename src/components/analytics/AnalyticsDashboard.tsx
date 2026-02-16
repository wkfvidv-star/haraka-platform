import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  Activity,
  Moon,
  Flame,
  Users,
  Calendar,
  MapPin,
  School,
  Trophy,
  Download,
  Image as ImageIcon,
  FileText,
  Filter,
  RefreshCw,
  Eye,
  Settings,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface AnalyticsData {
  daily: {
    steps: number[];
    calories: number[];
    sleep: number[];
    dates: string[];
  };
  weekly: {
    steps: number[];
    calories: number[];
    sleep: number[];
    weeks: string[];
  };
  monthly: {
    steps: number[];
    calories: number[];
    sleep: number[];
    months: string[];
  };
}

interface KPIMetric {
  id: string;
  title: string;
  value: number;
  unit: string;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: React.ReactNode;
  color: string;
}

export function AnalyticsDashboard({ userRole = 'admin' }: { userRole?: string }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line');
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [selectedDate, setSelectedDate] = useState('2024-10-02');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedProvince, setSelectedProvince] = useState('all');
  const [selectedSport, setSelectedSport] = useState('all');

  const [analyticsData] = useState<AnalyticsData>({
    daily: {
      steps: [8500, 9200, 7800, 10500, 9800, 11200, 8900],
      calories: [2100, 2300, 1950, 2650, 2450, 2800, 2200],
      sleep: [7.5, 8.2, 6.8, 7.9, 8.1, 7.3, 8.0],
      dates: ['1 أكتوبر', '2 أكتوبر', '3 أكتوبر', '4 أكتوبر', '5 أكتوبر', '6 أكتوبر', '7 أكتوبر']
    },
    weekly: {
      steps: [65000, 68000, 72000, 69500],
      calories: [16800, 17500, 18200, 17800],
      sleep: [52.5, 54.2, 55.8, 53.9],
      weeks: ['الأسبوع 1', 'الأسبوع 2', 'الأسبوع 3', 'الأسبوع 4']
    },
    monthly: {
      steps: [280000, 295000, 310000],
      calories: [72000, 75500, 78200],
      sleep: [217, 225, 232],
      months: ['أغسطس', 'سبتمبر', 'أكتوبر']
    }
  });

  const [kpiMetrics] = useState<KPIMetric[]>([
    {
      id: 'steps',
      title: 'متوسط الخطوات اليومية',
      value: 9443,
      unit: 'خطوة',
      change: 12.5,
      changeType: 'increase',
      icon: <Activity className="h-5 w-5" />,
      color: 'text-blue-600'
    },
    {
      id: 'calories',
      title: 'متوسط السعرات المحروقة',
      value: 2343,
      unit: 'سعرة',
      change: 8.3,
      changeType: 'increase',
      icon: <Flame className="h-5 w-5" />,
      color: 'text-orange-600'
    },
    {
      id: 'sleep',
      title: 'متوسط ساعات النوم',
      value: 7.7,
      unit: 'ساعة',
      change: -2.1,
      changeType: 'decrease',
      icon: <Moon className="h-5 w-5" />,
      color: 'text-purple-600'
    },
    {
      id: 'active_users',
      title: 'المستخدمون النشطون',
      value: 1247,
      unit: 'مستخدم',
      change: 15.7,
      changeType: 'increase',
      icon: <Users className="h-5 w-5" />,
      color: 'text-green-600'
    }
  ]);

  const getCurrentData = () => {
    return analyticsData[timeRange];
  };

  const exportChart = (format: 'png' | 'pdf') => {
    // Simulate chart export
    const filename = `analytics_${timeRange}_${Date.now()}.${format}`;
    console.log(`Exporting chart as ${format}: ${filename}`);
    
    // In a real implementation, this would capture the chart and download it
    const link = document.createElement('a');
    link.download = filename;
    // link.href = chartImageData; // Would contain actual chart data
    link.click();
  };

  const ChartComponent = ({ data, type }: { data: AnalyticsData[keyof AnalyticsData], type: 'line' | 'bar' | 'area' }) => {
    const maxSteps = Math.max(...data.steps);
    const maxCalories = Math.max(...data.calories);
    const maxSleep = Math.max(...data.sleep);

    return (
      <div className="space-y-6">
        {/* Steps Chart */}
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-600" />
            الخطوات اليومية
          </h4>
          <div className="h-48 flex items-end justify-between gap-2">
            {data.steps.map((steps, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className={`w-full bg-blue-500 rounded-t transition-all duration-500 ${
                    type === 'bar' ? 'opacity-80' : 'opacity-60'
                  }`}
                  style={{ 
                    height: `${(steps / maxSteps) * 160}px`,
                    borderRadius: type === 'area' ? '4px 4px 0 0' : '2px 2px 0 0'
                  }}
                />
                <span className="text-xs text-gray-600 mt-2 text-center">
                  {timeRange === 'daily' ? data.dates[index] : 
                   timeRange === 'weekly' ? data.weeks[index] : 
                   data.months[index]}
                </span>
                <span className="text-xs font-medium text-blue-600">
                  {steps.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Calories Chart */}
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-4 flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-600" />
            السعرات المحروقة
          </h4>
          <div className="h-48 flex items-end justify-between gap-2">
            {data.calories.map((calories, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className={`w-full bg-orange-500 rounded-t transition-all duration-500 ${
                    type === 'bar' ? 'opacity-80' : 'opacity-60'
                  }`}
                  style={{ 
                    height: `${(calories / maxCalories) * 160}px`,
                    borderRadius: type === 'area' ? '4px 4px 0 0' : '2px 2px 0 0'
                  }}
                />
                <span className="text-xs text-gray-600 mt-2 text-center">
                  {timeRange === 'daily' ? data.dates[index] : 
                   timeRange === 'weekly' ? data.weeks[index] : 
                   data.months[index]}
                </span>
                <span className="text-xs font-medium text-orange-600">
                  {calories.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sleep Chart */}
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-4 flex items-center gap-2">
            <Moon className="h-4 w-4 text-purple-600" />
            ساعات النوم
          </h4>
          <div className="h-48 flex items-end justify-between gap-2">
            {data.sleep.map((sleep, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className={`w-full bg-purple-500 rounded-t transition-all duration-500 ${
                    type === 'bar' ? 'opacity-80' : 'opacity-60'
                  }`}
                  style={{ 
                    height: `${(sleep / maxSleep) * 160}px`,
                    borderRadius: type === 'area' ? '4px 4px 0 0' : '2px 2px 0 0'
                  }}
                />
                <span className="text-xs text-gray-600 mt-2 text-center">
                  {timeRange === 'daily' ? data.dates[index] : 
                   timeRange === 'weekly' ? data.weeks[index] : 
                   data.months[index]}
                </span>
                <span className="text-xs font-medium text-purple-600">
                  {sleep.toFixed(1)}h
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            البيانات والتحليلات
          </CardTitle>
          <CardDescription className="text-blue-100">
            لوحات مؤشرات تفاعلية مع رسوم بيانية قابلة للتخصيص والتصدير
          </CardDescription>
        </CardHeader>
      </Card>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiMetrics.map(metric => (
          <Card key={metric.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className={metric.color}>
                  {metric.icon}
                </div>
                <div className="flex items-center gap-1">
                  {metric.changeType === 'increase' ? (
                    <ChevronUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${
                    metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {Math.abs(metric.change)}%
                  </span>
                </div>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">
                  {metric.value.toLocaleString()} {metric.unit}
                </div>
                <p className="text-sm text-gray-600">{metric.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            المرشحات والإعدادات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div>
              <Label htmlFor="timeRange">الفترة الزمنية</Label>
              <Select value={timeRange} onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setTimeRange(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">يومي</SelectItem>
                  <SelectItem value="weekly">أسبوعي</SelectItem>
                  <SelectItem value="monthly">شهري</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="chartType">نوع الرسم البياني</Label>
              <Select value={chartType} onValueChange={(value: 'line' | 'bar' | 'area') => setChartType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">خطي</SelectItem>
                  <SelectItem value="bar">عمودي</SelectItem>
                  <SelectItem value="area">منطقة</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="date">التاريخ</Label>
              <Input 
                id="date" 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="class">الصف</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الصف" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الصفوف</SelectItem>
                  <SelectItem value="grade1">الصف الأول متوسط</SelectItem>
                  <SelectItem value="grade2">الصف الثاني متوسط</SelectItem>
                  <SelectItem value="grade3">الصف الثالث متوسط</SelectItem>
                  <SelectItem value="grade4">الصف الرابع متوسط</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="province">الولاية</Label>
              <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الولاية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الولايات</SelectItem>
                  <SelectItem value="algiers">الجزائر</SelectItem>
                  <SelectItem value="oran">وهران</SelectItem>
                  <SelectItem value="constantine">قسنطينة</SelectItem>
                  <SelectItem value="annaba">عنابة</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sport">الرياضة</Label>
              <Select value={selectedSport} onValueChange={setSelectedSport}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الرياضة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الرياضات</SelectItem>
                  <SelectItem value="running">الجري</SelectItem>
                  <SelectItem value="football">كرة القدم</SelectItem>
                  <SelectItem value="basketball">كرة السلة</SelectItem>
                  <SelectItem value="volleyball">الكرة الطائرة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {chartType === 'line' && <LineChart className="h-5 w-5" />}
              {chartType === 'bar' && <BarChart3 className="h-5 w-5" />}
              {chartType === 'area' && <PieChart className="h-5 w-5" />}
              الرسوم البيانية التفاعلية
            </CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => exportChart('png')}>
                <ImageIcon className="h-4 w-4 mr-1" />
                تصدير صورة
              </Button>
              <Button size="sm" variant="outline" onClick={() => exportChart('pdf')}>
                <FileText className="h-4 w-4 mr-1" />
                تصدير PDF
              </Button>
              <Button size="sm" variant="outline">
                <RefreshCw className="h-4 w-4 mr-1" />
                تحديث
              </Button>
            </div>
          </div>
          <CardDescription>
            عرض البيانات حسب {timeRange === 'daily' ? 'اليوم' : timeRange === 'weekly' ? 'الأسبوع' : 'الشهر'} 
            {selectedClass !== 'all' && ` - ${selectedClass}`}
            {selectedProvince !== 'all' && ` - ${selectedProvince}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartComponent data={getCurrentData()} type={chartType} />
        </CardContent>
      </Card>

      {/* Detailed Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="students">الطلاب</TabsTrigger>
          <TabsTrigger value="schools">المدارس</TabsTrigger>
          <TabsTrigger value="competitions">المسابقات</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">توزيع النشاط حسب الولاية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'الجزائر', value: 35, color: 'bg-blue-500' },
                    { name: 'وهران', value: 28, color: 'bg-green-500' },
                    { name: 'قسنطينة', value: 22, color: 'bg-yellow-500' },
                    { name: 'عنابة', value: 15, color: 'bg-purple-500' }
                  ].map(province => (
                    <div key={province.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded ${province.color}`} />
                        <span className="font-medium">{province.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${province.color}`}
                            style={{ width: `${province.value}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{province.value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">الأهداف المحققة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { title: 'هدف الخطوات اليومية', current: 9443, target: 10000, unit: 'خطوة' },
                    { title: 'هدف السعرات المحروقة', current: 2343, target: 2500, unit: 'سعرة' },
                    { title: 'هدف ساعات النوم', current: 7.7, target: 8, unit: 'ساعة' }
                  ].map(goal => {
                    const percentage = Math.min((goal.current / goal.target) * 100, 100);
                    return (
                      <div key={goal.title} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">{goal.title}</span>
                          <span className="text-sm text-gray-600">
                            {goal.current.toLocaleString()} / {goal.target.toLocaleString()} {goal.unit}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              percentage >= 100 ? 'bg-green-500' : 
                              percentage >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="text-right">
                          <span className={`text-sm font-medium ${
                            percentage >= 100 ? 'text-green-600' : 
                            percentage >= 75 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">أداء الطلاب</CardTitle>
              <CardDescription>تحليل مفصل لأداء الطلاب حسب الصف والنشاط</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { grade: 'الصف الأول متوسط', students: 245, avgSteps: 8750, avgCalories: 2100, avgSleep: 8.2 },
                  { grade: 'الصف الثاني متوسط', students: 238, avgSteps: 9200, avgCalories: 2250, avgSleep: 7.9 },
                  { grade: 'الصف الثالث متوسط', students: 251, avgSteps: 9800, avgCalories: 2400, avgSleep: 7.6 },
                  { grade: 'الصف الرابع متوسط', students: 267, avgSteps: 10200, avgCalories: 2550, avgSleep: 7.4 }
                ].map(grade => (
                  <div key={grade.grade} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{grade.grade}</h4>
                      <Badge variant="outline">{grade.students} طالب</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <div className="font-medium text-blue-600">{grade.avgSteps.toLocaleString()}</div>
                        <div className="text-gray-600">متوسط الخطوات</div>
                      </div>
                      <div className="text-center p-2 bg-orange-50 rounded">
                        <div className="font-medium text-orange-600">{grade.avgCalories.toLocaleString()}</div>
                        <div className="text-gray-600">متوسط السعرات</div>
                      </div>
                      <div className="text-center p-2 bg-purple-50 rounded">
                        <div className="font-medium text-purple-600">{grade.avgSleep}h</div>
                        <div className="text-gray-600">متوسط النوم</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schools" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">ترتيب المدارس</CardTitle>
              <CardDescription>أفضل المدارس حسب مؤشرات النشاط</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { rank: 1, name: 'ثانوية الأمير عبد القادر', province: 'الجزائر', score: 95.8, students: 450 },
                  { rank: 2, name: 'متوسطة الشهيد بوضياف', province: 'وهران', score: 92.3, students: 380 },
                  { rank: 3, name: 'ثانوية ابن باديس', province: 'قسنطينة', score: 89.7, students: 420 },
                  { rank: 4, name: 'متوسطة الإخوة منتوري', province: 'عنابة', score: 87.2, students: 360 },
                  { rank: 5, name: 'ثانوية محمد بوضياف', province: 'الجزائر', score: 85.9, students: 390 }
                ].map(school => (
                  <div key={school.rank} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        school.rank === 1 ? 'bg-yellow-500' :
                        school.rank === 2 ? 'bg-gray-400' :
                        school.rank === 3 ? 'bg-orange-500' : 'bg-blue-500'
                      }`}>
                        {school.rank}
                      </div>
                      <div>
                        <h4 className="font-medium">{school.name}</h4>
                        <div className="text-sm text-gray-600 flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {school.province}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {school.students} طالب
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{school.score}</div>
                      <div className="text-xs text-gray-500">نقطة</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competitions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">إحصائيات المسابقات</CardTitle>
              <CardDescription>نتائج وتحليلات المسابقات الرياضية</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">المسابقات النشطة</h4>
                  {[
                    { name: 'مسابقة اللياقة البدنية الوطنية', participants: 1247, status: 'جارية' },
                    { name: 'بطولة الجري السريع', participants: 856, status: 'مكتملة' },
                    { name: 'مسابقة كرة القدم المدرسية', participants: 2134, status: 'قادمة' }
                  ].map(competition => (
                    <div key={competition.name} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-sm">{competition.name}</h5>
                        <Badge className={
                          competition.status === 'جارية' ? 'bg-blue-100 text-blue-800' :
                          competition.status === 'مكتملة' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }>
                          {competition.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        {competition.participants.toLocaleString()} مشارك
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">أفضل النتائج</h4>
                  {[
                    { student: 'أحمد محمد', school: 'ثانوية الأمير عبد القادر', score: 98.5, sport: 'جري' },
                    { student: 'فاطمة علي', school: 'متوسطة الشهيد بوضياف', score: 96.2, sport: 'سباحة' },
                    { student: 'محمد خالد', school: 'ثانوية ابن باديس', score: 94.8, sport: 'كرة قدم' }
                  ].map((result, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-sm">{result.student}</h5>
                        <div className="text-lg font-bold text-green-600">{result.score}</div>
                      </div>
                      <div className="text-xs text-gray-600">
                        <div>{result.school}</div>
                        <div>{result.sport}</div>
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
  );
}