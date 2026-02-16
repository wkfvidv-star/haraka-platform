import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  School, 
  Users, 
  Trophy, 
  Target,
  MapPin,
  Award,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface ProvinceStats {
  id: number;
  name: string;
  region: string;
  schools: number;
  students: number;
  teachers: number;
  sportsParticipation: number;
  performanceScore: number;
  successRate: number;
  attendanceRate: number;
  facilitiesScore: number;
  ranking: number;
  trend: 'up' | 'down' | 'stable';
}

const provinceStats: ProvinceStats[] = [
  { id: 16, name: 'الجزائر', region: 'وسط', schools: 850, students: 165420, teachers: 7850, sportsParticipation: 88, performanceScore: 94, successRate: 91, attendanceRate: 95, facilitiesScore: 92, ranking: 1, trend: 'up' },
  { id: 31, name: 'وهران', region: 'غرب', schools: 680, students: 132450, teachers: 6280, sportsParticipation: 86, performanceScore: 92, successRate: 89, attendanceRate: 94, facilitiesScore: 90, ranking: 2, trend: 'up' },
  { id: 25, name: 'قسنطينة', region: 'شرق', schools: 580, students: 112340, teachers: 5320, sportsParticipation: 84, performanceScore: 90, successRate: 87, attendanceRate: 93, facilitiesScore: 88, ranking: 3, trend: 'stable' },
  { id: 19, name: 'سطيف', region: 'شرق', schools: 720, students: 138950, teachers: 6580, sportsParticipation: 82, performanceScore: 89, successRate: 86, attendanceRate: 92, facilitiesScore: 87, ranking: 4, trend: 'up' },
  { id: 5, name: 'باتنة', region: 'شرق', schools: 650, students: 125640, teachers: 5980, sportsParticipation: 81, performanceScore: 88, successRate: 85, attendanceRate: 91, facilitiesScore: 86, ranking: 5, trend: 'stable' },
  { id: 15, name: 'تيزي وزو', region: 'شمال', schools: 550, students: 103840, teachers: 4920, sportsParticipation: 85, performanceScore: 87, successRate: 84, attendanceRate: 90, facilitiesScore: 85, ranking: 6, trend: 'up' },
  { id: 6, name: 'بجاية', region: 'شمال', schools: 520, students: 98750, teachers: 4650, sportsParticipation: 83, performanceScore: 86, successRate: 83, attendanceRate: 89, facilitiesScore: 84, ranking: 7, trend: 'stable' },
  { id: 13, name: 'تلمسان', region: 'غرب', schools: 480, students: 89650, teachers: 4280, sportsParticipation: 80, performanceScore: 85, successRate: 82, attendanceRate: 88, facilitiesScore: 83, ranking: 8, trend: 'down' },
  { id: 9, name: 'البليدة', region: 'وسط', schools: 580, students: 112450, teachers: 5320, sportsParticipation: 79, performanceScore: 84, successRate: 81, attendanceRate: 87, facilitiesScore: 82, ranking: 9, trend: 'stable' },
  { id: 17, name: 'الجلفة', region: 'وسط', schools: 520, students: 98450, teachers: 4680, sportsParticipation: 77, performanceScore: 83, successRate: 80, attendanceRate: 86, facilitiesScore: 81, ranking: 10, trend: 'up' }
];

export function ProvinceComparison() {
  const [sortBy, setSortBy] = useState<'ranking' | 'students' | 'sportsParticipation' | 'performanceScore'>('ranking');
  const [selectedRegion, setSelectedRegion] = useState<string>('');

  const regions = ['شمال', 'وسط', 'جنوب', 'شرق', 'غرب'];

  const filteredProvinces = provinceStats.filter(province => 
    selectedRegion === '' || province.region === selectedRegion
  ).sort((a, b) => {
    switch (sortBy) {
      case 'ranking': return a.ranking - b.ranking;
      case 'students': return b.students - a.students;
      case 'sportsParticipation': return b.sportsParticipation - a.sportsParticipation;
      case 'performanceScore': return b.performanceScore - a.performanceScore;
      default: return a.ranking - b.ranking;
    }
  });

  const getRegionColor = (region: string) => {
    const colors = {
      'شمال': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      'وسط': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      'جنوب': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
      'شرق': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
      'غرب': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
    };
    return colors[region as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getRankingBadge = (ranking: number) => {
    if (ranking <= 3) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
    if (ranking <= 10) return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
    if (ranking <= 20) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* إحصائيات المقارنة العامة */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                <Trophy className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">الجزائر</div>
                <div className="text-sm text-gray-600">الولاية الأولى</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">86.2</div>
                <div className="text-sm text-gray-600">متوسط الأداء</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">79%</div>
                <div className="text-sm text-gray-600">مشاركة رياضية</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                <Target className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">87.5%</div>
                <div className="text-sm text-gray-600">معدل النجاح</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* فلاتر وترتيب */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            مقارنة شاملة بين الولايات
          </CardTitle>
          <CardDescription>
            ترتيب ومقارنة أداء جميع الولايات حسب مؤشرات متعددة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex gap-2">
              <Button
                variant={selectedRegion === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedRegion('')}
              >
                جميع المناطق
              </Button>
              {regions.map((region) => (
                <Button
                  key={region}
                  variant={selectedRegion === region ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedRegion(region)}
                >
                  {region}
                </Button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={sortBy === 'ranking' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('ranking')}
              >
                الترتيب العام
              </Button>
              <Button
                variant={sortBy === 'students' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('students')}
              >
                عدد التلاميذ
              </Button>
              <Button
                variant={sortBy === 'sportsParticipation' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('sportsParticipation')}
              >
                المشاركة الرياضية
              </Button>
              <Button
                variant={sortBy === 'performanceScore' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('performanceScore')}
              >
                نقاط الأداء
              </Button>
            </div>
          </div>

          {/* جدول المقارنة */}
          <div className="space-y-3">
            {filteredProvinces.map((province, index) => (
              <div key={province.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge className={`text-sm font-bold ${getRankingBadge(province.ranking)}`}>
                      #{province.ranking}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <h4 className="font-medium text-lg">ولاية {province.name}</h4>
                    </div>
                    <Badge className={`text-xs ${getRegionColor(province.region)}`}>
                      {province.region}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(province.trend)}
                    <span className="text-sm text-gray-500">
                      {province.trend === 'up' ? 'تحسن' : province.trend === 'down' ? 'تراجع' : 'مستقر'}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{province.schools}</div>
                    <div className="text-xs text-gray-500">مدرسة</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{(province.students / 1000).toFixed(0)}K</div>
                    <div className="text-xs text-gray-500">تلميذ</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{(province.teachers / 1000).toFixed(1)}K</div>
                    <div className="text-xs text-gray-500">معلم</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-600">{province.sportsParticipation}%</div>
                    <div className="text-xs text-gray-500">مشاركة رياضية</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">{province.successRate}%</div>
                    <div className="text-xs text-gray-500">معدل النجاح</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-600">{province.performanceScore}</div>
                    <div className="text-xs text-gray-500">نقاط الأداء</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>المشاركة الرياضية</span>
                      <span>{province.sportsParticipation}%</span>
                    </div>
                    <Progress value={province.sportsParticipation} className="h-1.5" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>معدل الحضور</span>
                      <span>{province.attendanceRate}%</span>
                    </div>
                    <Progress value={province.attendanceRate} className="h-1.5" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>جودة المرافق</span>
                      <span>{province.facilitiesScore}%</span>
                    </div>
                    <Progress value={province.facilitiesScore} className="h-1.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}