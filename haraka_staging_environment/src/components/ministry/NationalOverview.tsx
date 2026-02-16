import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { StatsCard } from '@/components/ui/stats-card';
import { 
  Building2,
  Users, 
  GraduationCap,
  Trophy,
  TrendingUp,
  MapPin,
  BarChart3,
  Target,
  Award,
  Activity,
  CheckCircle,
  AlertTriangle,
  Eye,
  Download,
  FileText,
  School,
  Flag
} from 'lucide-react';

interface NationalStats {
  totalProvinces: number;
  totalDirectorates: number;
  totalSchools: number;
  totalStudents: number;
  totalTeachers: number;
  activeCompetitions: number;
  averagePerformance: number;
  nationalAttendance: number;
  monthlyProgress: number;
  pendingReports: number;
}

interface ProvincePerformance {
  id: string;
  name: string;
  arabicName: string;
  region: 'الشمال' | 'الوسط' | 'الجنوب' | 'الشرق' | 'الغرب';
  schools: number;
  students: number;
  teachers: number;
  performance: number;
  attendance: number;
  completedActivities: number;
  totalActivities: number;
  healthStatus: 'ممتاز' | 'جيد' | 'متوسط' | 'يحتاج تحسين';
  lastReportDate: string;
  activeCompetitions: number;
}

interface NationalOverviewProps {
  onProvinceSelect: (province: ProvincePerformance) => void;
}

export function NationalOverview({ onProvinceSelect }: NationalOverviewProps) {
  const [nationalStats] = useState<NationalStats>({
    totalProvinces: 58,
    totalDirectorates: 58,
    totalSchools: 28450,
    totalStudents: 9847562,
    totalTeachers: 387420,
    activeCompetitions: 142,
    averagePerformance: 84.7,
    nationalAttendance: 91.3,
    monthlyProgress: 6.8,
    pendingReports: 23
  });

  const [topPerformingProvinces] = useState<ProvincePerformance[]>([
    {
      id: '16',
      name: 'Alger',
      arabicName: 'الجزائر',
      region: 'الوسط',
      schools: 680,
      students: 156780,
      teachers: 7250,
      performance: 92.4,
      attendance: 94.8,
      completedActivities: 145,
      totalActivities: 160,
      healthStatus: 'ممتاز',
      lastReportDate: '2024-10-16',
      activeCompetitions: 8
    },
    {
      id: '31',
      name: 'Oran',
      arabicName: 'وهران',
      region: 'الغرب',
      schools: 580,
      students: 128340,
      teachers: 5940,
      performance: 90.8,
      attendance: 93.2,
      completedActivities: 138,
      totalActivities: 155,
      healthStatus: 'ممتاز',
      lastReportDate: '2024-10-15',
      activeCompetitions: 7
    },
    {
      id: '25',
      name: 'Constantine',
      arabicName: 'قسنطينة',
      region: 'الشرق',
      schools: 480,
      students: 105670,
      teachers: 4890,
      performance: 89.6,
      attendance: 92.5,
      completedActivities: 132,
      totalActivities: 150,
      healthStatus: 'ممتاز',
      lastReportDate: '2024-10-14',
      activeCompetitions: 6
    },
    {
      id: '19',
      name: 'Sétif',
      arabicName: 'سطيف',
      region: 'الشرق',
      schools: 520,
      students: 112340,
      teachers: 5180,
      performance: 88.9,
      attendance: 91.8,
      completedActivities: 128,
      totalActivities: 148,
      healthStatus: 'جيد',
      lastReportDate: '2024-10-13',
      activeCompetitions: 5
    },
    {
      id: '06',
      name: 'Béjaïa',
      arabicName: 'بجاية',
      region: 'الشمال',
      schools: 380,
      students: 85670,
      teachers: 3890,
      performance: 87.3,
      attendance: 90.4,
      completedActivities: 125,
      totalActivities: 145,
      healthStatus: 'جيد',
      lastReportDate: '2024-10-12',
      activeCompetitions: 4
    }
  ]);

  const [regionalStats] = useState([
    { region: 'الوسط', provinces: 12, performance: 88.5, schools: 5420, students: 1234567 },
    { region: 'الشرق', provinces: 15, performance: 86.2, schools: 6890, students: 1567890 },
    { region: 'الغرب', provinces: 14, performance: 85.8, schools: 6120, students: 1345678 },
    { region: 'الشمال', provinces: 9, performance: 87.1, schools: 4890, students: 987654 },
    { region: 'الجنوب', provinces: 8, performance: 82.4, schools: 5130, students: 1711773 }
  ]);

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'ممتاز': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
      case 'جيد': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200';
      case 'متوسط': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200';
      case 'يحتاج تحسين': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
    }
  };

  const getRegionColor = (region: string) => {
    switch (region) {
      case 'الوسط': return 'text-blue-600';
      case 'الشرق': return 'text-green-600';
      case 'الغرب': return 'text-orange-600';
      case 'الشمال': return 'text-purple-600';
      case 'الجنوب': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* National Header */}
      <Card className="bg-gradient-to-r from-red-600 to-green-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Flag className="h-6 w-6" />
            وزارة التربية الوطنية - الجمهورية الجزائرية الديمقراطية الشعبية
          </CardTitle>
          <CardDescription className="text-red-100">
            النظرة العامة الوطنية لقطاع التربية والتعليم في جميع أنحاء الوطن
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{nationalStats.totalProvinces}</div>
              <div className="text-sm text-red-100">ولاية</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{nationalStats.totalSchools.toLocaleString()}</div>
              <div className="text-sm text-red-100">مدرسة</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{(nationalStats.totalStudents / 1000000).toFixed(1)}م</div>
              <div className="text-sm text-red-100">طالب</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{nationalStats.totalTeachers.toLocaleString()}</div>
              <div className="text-sm text-red-100">معلم</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{nationalStats.averagePerformance}%</div>
              <div className="text-sm text-red-100">الأداء الوطني</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key National Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="معدل الحضور الوطني"
          value={`${nationalStats.nationalAttendance}%`}
          description="متوسط حضور الطلاب"
          icon={CheckCircle}
          color="green"
          trend={{ value: 2.3, isPositive: true }}
        />
        <StatsCard
          title="المسابقات النشطة"
          value={nationalStats.activeCompetitions.toString()}
          description="على المستوى الوطني"
          icon={Trophy}
          color="yellow"
        />
        <StatsCard
          title="التقدم الشهري"
          value={`+${nationalStats.monthlyProgress}%`}
          description="تحسن هذا الشهر"
          icon={TrendingUp}
          color="blue"
          trend={{ value: nationalStats.monthlyProgress, isPositive: true }}
        />
        <StatsCard
          title="التقارير المعلقة"
          value={nationalStats.pendingReports.toString()}
          description="من المديريات"
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Regional Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            الأداء حسب المناطق الجغرافية
          </CardTitle>
          <CardDescription>
            توزيع الأداء والإحصائيات عبر المناطق الخمس للوطن
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {regionalStats.map((region, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 text-center">
                  <div className={`text-lg font-bold ${getRegionColor(region.region)}`}>
                    {region.region}
                  </div>
                  <div className="text-2xl font-bold mt-2">{region.performance}%</div>
                  <div className="text-sm text-gray-500 mb-3">متوسط الأداء</div>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div>{region.provinces} ولاية</div>
                    <div>{region.schools.toLocaleString()} مدرسة</div>
                    <div>{(region.students / 1000000).toFixed(1)}م طالب</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Provinces */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                الولايات الأعلى أداءً على المستوى الوطني
              </CardTitle>
              <CardDescription>
                أفضل 5 ولايات من حيث الأداء العام والإنجازات
              </CardDescription>
            </div>
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              عرض جميع الولايات
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPerformingProvinces.map((province, index) => (
              <Card key={province.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => onProvinceSelect(province)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-400' :
                        index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium text-lg">{province.arabicName}</h4>
                        <p className="text-sm text-gray-500">
                          المنطقة {province.region} • {province.schools} مدرسة • {province.students.toLocaleString()} طالب
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getHealthStatusColor(province.healthStatus)} size="sm">
                            {province.healthStatus}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            آخر تقرير: {province.lastReportDate}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="grid grid-cols-3 gap-4 text-center mb-3">
                        <div>
                          <div className="text-lg font-bold text-green-600">
                            {province.performance}%
                          </div>
                          <div className="text-xs text-gray-500">الأداء</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-blue-600">
                            {province.attendance}%
                          </div>
                          <div className="text-xs text-gray-500">الحضور</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-purple-600">
                            {Math.round((province.completedActivities / province.totalActivities) * 100)}%
                          </div>
                          <div className="text-xs text-gray-500">الإنجاز</div>
                        </div>
                      </div>
                      
                      <Button size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        عرض التفاصيل
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>تقدم الأنشطة</span>
                      <span>{province.completedActivities}/{province.totalActivities}</span>
                    </div>
                    <Progress 
                      value={(province.completedActivities / province.totalActivities) * 100} 
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick National Actions */}
      <Card>
        <CardHeader>
          <CardTitle>الإجراءات الوطنية السريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <FileText className="h-6 w-6" />
              التقارير الوطنية
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Trophy className="h-6 w-6" />
              المسابقات الوطنية
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <BarChart3 className="h-6 w-6" />
              الإحصائيات الشاملة
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Download className="h-6 w-6" />
              تصدير البيانات
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}