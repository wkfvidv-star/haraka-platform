import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Activity, 
  Target,
  Calendar,
  Award,
  Zap,
  Heart,
  Timer,
  Star,
  Trophy,
  ArrowUp,
  ArrowDown,
  Minus,
  ChevronRight,
  Filter,
  Download
} from 'lucide-react';

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  changeType: 'increase' | 'decrease' | 'stable';
  target: number;
  category: string;
  color: string;
}

interface WeeklyData {
  week: string;
  exercises: number;
  points: number;
  duration: number;
  calories: number;
}

const performanceMetrics: PerformanceMetric[] = [
  {
    id: 'strength',
    name: 'مؤشر القوة العضلية',
    value: 78,
    unit: '%',
    change: 12,
    changeType: 'increase',
    target: 85,
    category: 'القوة',
    color: 'blue'
  },
  {
    id: 'endurance',
    name: 'مؤشر التحمل القلبي',
    value: 82,
    unit: '%',
    change: 8,
    changeType: 'increase',
    target: 90,
    category: 'التحمل',
    color: 'green'
  },
  {
    id: 'flexibility',
    name: 'مؤشر المرونة',
    value: 65,
    unit: '%',
    change: -2,
    changeType: 'decrease',
    target: 75,
    category: 'المرونة',
    color: 'purple'
  },
  {
    id: 'balance',
    name: 'مؤشر التوازن',
    value: 71,
    unit: '%',
    change: 5,
    changeType: 'increase',
    target: 80,
    category: 'التوازن',
    color: 'orange'
  },
  {
    id: 'coordination',
    name: 'مؤشر التناسق الحركي',
    value: 73,
    unit: '%',
    change: 0,
    changeType: 'stable',
    target: 85,
    category: 'التناسق',
    color: 'pink'
  },
  {
    id: 'speed',
    name: 'مؤشر السرعة',
    value: 69,
    unit: '%',
    change: 15,
    changeType: 'increase',
    target: 80,
    category: 'السرعة',
    color: 'red'
  }
];

const weeklyData: WeeklyData[] = [
  { week: 'الأسبوع 1', exercises: 12, points: 180, duration: 240, calories: 1200 },
  { week: 'الأسبوع 2', exercises: 15, points: 225, duration: 300, calories: 1500 },
  { week: 'الأسبوع 3', exercises: 18, points: 270, duration: 360, calories: 1800 },
  { week: 'الأسبوع 4', exercises: 22, points: 330, duration: 440, calories: 2200 },
  { week: 'الأسبوع 5', exercises: 25, points: 375, duration: 500, calories: 2500 },
  { week: 'الأسبوع 6', exercises: 28, points: 420, duration: 560, calories: 2800 }
];

const achievements = [
  { id: 1, name: 'محارب اللياقة', description: 'أكمل 100 تمرين', progress: 85, total: 100, icon: '⚔️' },
  { id: 2, name: 'عداء الماراثون', description: 'اجر مسافة 50 كم', progress: 32, total: 50, icon: '🏃‍♂️' },
  { id: 3, name: 'خبير التوازن', description: 'أتقن 20 تمرين توازن', progress: 15, total: 20, icon: '⚖️' },
  { id: 4, name: 'نجم الأسبوع', description: 'تمرن 7 أيام متتالية', progress: 5, total: 7, icon: '⭐' }
];

export function ProfessionalProgress() {
  const [selectedPeriod, setSelectedPeriod] = useState('شهر');
  const [selectedCategory, setSelectedCategory] = useState('الكل');

  const periods = ['أسبوع', 'شهر', '3 أشهر', '6 أشهر', 'سنة'];
  const categories = ['الكل', 'القوة', 'التحمل', 'المرونة', 'التوازن', 'التناسق', 'السرعة'];

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase': return <ArrowUp className="h-4 w-4 text-green-500" />;
      case 'decrease': return <ArrowDown className="h-4 w-4 text-red-500" />;
      case 'stable': return <Minus className="h-4 w-4 text-gray-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase': return 'text-green-600';
      case 'decrease': return 'text-red-600';
      case 'stable': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getMetricColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      pink: 'bg-pink-500',
      red: 'bg-red-500'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-500';
  };

  const filteredMetrics = selectedCategory === 'الكل' 
    ? performanceMetrics 
    : performanceMetrics.filter(metric => metric.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <BarChart3 className="h-6 w-6" />
                تحليل الأداء المتقدم
              </CardTitle>
              <CardDescription className="text-green-100">
                تتبع شامل ومفصل لتطورك الرياضي مع مؤشرات دقيقة
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                تصدير التقرير
              </Button>
              <Button variant="secondary" size="sm" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                تخصيص العرض
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Period and Category Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">الفترة الزمنية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {periods.map((period) => (
                <Button
                  key={period}
                  variant={selectedPeriod === period ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPeriod(period)}
                >
                  {period}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">فئة المؤشرات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMetrics.map((metric) => (
          <Card key={metric.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{metric.name}</CardTitle>
                <div className="flex items-center gap-1">
                  {getChangeIcon(metric.changeType)}
                  <span className={`text-sm font-medium ${getChangeColor(metric.changeType)}`}>
                    {Math.abs(metric.change)}%
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Value */}
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">
                  {metric.value}{metric.unit}
                </div>
                <div className="text-sm text-gray-500">
                  الهدف: {metric.target}{metric.unit}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>التقدم نحو الهدف</span>
                  <span>{Math.round((metric.value / metric.target) * 100)}%</span>
                </div>
                <Progress 
                  value={(metric.value / metric.target) * 100} 
                  className="h-3"
                />
              </div>

              {/* Category Badge */}
              <div className="flex justify-center">
                <Badge variant="outline" className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${getMetricColor(metric.color)}`}></div>
                  {metric.category}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Weekly Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            التطور الأسبوعي
          </CardTitle>
          <CardDescription>
            تتبع أداءك عبر الأسابيع الماضية
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Chart Simulation */}
            <div className="h-64 bg-gradient-to-t from-blue-50 to-transparent dark:from-blue-900/20 rounded-lg p-4 flex items-end justify-between">
              {weeklyData.map((week, index) => (
                <div key={week.week} className="flex flex-col items-center gap-2">
                  <div 
                    className="bg-blue-500 rounded-t-lg w-8 transition-all duration-500 hover:bg-blue-600"
                    style={{ 
                      height: `${(week.exercises / Math.max(...weeklyData.map(w => w.exercises))) * 200}px`,
                      minHeight: '20px'
                    }}
                  ></div>
                  <div className="text-xs text-center text-gray-500 rotate-45 origin-center">
                    {week.week}
                  </div>
                </div>
              ))}
            </div>

            {/* Weekly Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-right p-2">الأسبوع</th>
                    <th className="text-center p-2">التمارين</th>
                    <th className="text-center p-2">النقاط</th>
                    <th className="text-center p-2">المدة (دقيقة)</th>
                    <th className="text-center p-2">السعرات</th>
                  </tr>
                </thead>
                <tbody>
                  {weeklyData.map((week, index) => (
                    <tr key={week.week} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="p-2 font-medium">{week.week}</td>
                      <td className="text-center p-2">{week.exercises}</td>
                      <td className="text-center p-2">{week.points}</td>
                      <td className="text-center p-2">{week.duration}</td>
                      <td className="text-center p-2">{week.calories}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            تقدم الإنجازات
          </CardTitle>
          <CardDescription>
            تتبع تقدمك نحو إنجازات جديدة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-medium">{achievement.name}</h4>
                    <p className="text-sm text-gray-500">{achievement.description}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>التقدم</span>
                    <span>{achievement.progress}/{achievement.total}</span>
                  </div>
                  <Progress 
                    value={(achievement.progress / achievement.total) * 100} 
                    className="h-2"
                  />
                  <div className="text-xs text-gray-500 text-center">
                    {Math.round((achievement.progress / achievement.total) * 100)}% مكتمل
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Radar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-purple-500" />
              خريطة الأداء الشاملة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-64 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">73%</div>
                <div className="text-sm text-gray-500">متوسط الأداء العام</div>
              </div>
              
              {/* Simulated Radar Points */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div className="text-xs text-center mt-1">القوة</div>
              </div>
              <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="text-xs text-center mt-1">التحمل</div>
              </div>
              <div className="absolute bottom-4 right-8">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <div className="text-xs text-center mt-1">المرونة</div>
              </div>
              <div className="absolute bottom-4 left-8">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <div className="text-xs text-center mt-1">التوازن</div>
              </div>
              <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
                <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                <div className="text-xs text-center mt-1">التناسق</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Goals and Targets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-red-500" />
              الأهداف والتحديات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">هدف الشهر</h4>
                <Badge className="bg-blue-500">نشط</Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                إكمال 30 تمرين متنوع
              </p>
              <Progress value={75} className="h-2 mb-2" />
              <div className="text-xs text-gray-500">22/30 تمرين مكتمل</div>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">تحدي الأسبوع</h4>
                <Badge className="bg-green-500">جاري</Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                حرق 2000 سعرة حرارية
              </p>
              <Progress value={60} className="h-2 mb-2" />
              <div className="text-xs text-gray-500">1200/2000 سعرة</div>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">هدف طويل المدى</h4>
                <Badge variant="outline">مخطط</Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                الوصول لمستوى متقدم في جميع المؤشرات
              </p>
              <Progress value={35} className="h-2 mb-2" />
              <div className="text-xs text-gray-500">35% من الهدف</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}