import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MapPin,
  BarChart3,
  TrendingUp,
  Users,
  School,
  Trophy,
  Target,
  Download,
  Filter,
  Eye,
  Layers,
  Activity
} from 'lucide-react';

interface ProvinceData {
  id: string;
  name: string;
  arabicName: string;
  region: 'الشمال' | 'الوسط' | 'الجنوب' | 'الشرق' | 'الغرب';
  coordinates: { x: number; y: number };
  schools: number;
  students: number;
  teachers: number;
  performance: number;
  attendance: number;
  healthStatus: 'ممتاز' | 'جيد' | 'متوسط' | 'يحتاج تحسين';
  activeCompetitions: number;
  completedActivities: number;
  totalActivities: number;
}

export function NationalMaps() {
  const [selectedMetric, setSelectedMetric] = useState('performance');
  const [selectedProvince, setSelectedProvince] = useState<ProvinceData | null>(null);

  const provinces: ProvinceData[] = [
    {
      id: '01',
      name: 'Adrar',
      arabicName: 'أدرار',
      region: 'الجنوب',
      coordinates: { x: 15, y: 75 },
      schools: 245,
      students: 45670,
      teachers: 2340,
      performance: 78.5,
      attendance: 89.2,
      healthStatus: 'جيد',
      activeCompetitions: 3,
      completedActivities: 85,
      totalActivities: 120
    },
    {
      id: '02',
      name: 'Chlef',
      arabicName: 'الشلف',
      region: 'الغرب',
      coordinates: { x: 25, y: 35 },
      schools: 380,
      students: 78340,
      teachers: 3890,
      performance: 85.2,
      attendance: 91.8,
      healthStatus: 'جيد',
      activeCompetitions: 5,
      completedActivities: 142,
      totalActivities: 165
    },
    {
      id: '03',
      name: 'Laghouat',
      arabicName: 'الأغواط',
      region: 'الجنوب',
      coordinates: { x: 35, y: 65 },
      schools: 290,
      students: 56780,
      teachers: 2890,
      performance: 81.4,
      attendance: 88.5,
      healthStatus: 'متوسط',
      activeCompetitions: 4,
      completedActivities: 95,
      totalActivities: 135
    },
    {
      id: '16',
      name: 'Alger',
      arabicName: 'الجزائر',
      region: 'الوسط',
      coordinates: { x: 45, y: 35 },
      schools: 680,
      students: 156780,
      teachers: 7250,
      performance: 92.4,
      attendance: 94.8,
      healthStatus: 'ممتاز',
      activeCompetitions: 8,
      completedActivities: 185,
      totalActivities: 200
    },
    {
      id: '25',
      name: 'Constantine',
      arabicName: 'قسنطينة',
      region: 'الشرق',
      coordinates: { x: 75, y: 35 },
      schools: 480,
      students: 105670,
      teachers: 4890,
      performance: 89.6,
      attendance: 92.5,
      healthStatus: 'ممتاز',
      activeCompetitions: 6,
      completedActivities: 165,
      totalActivities: 180
    },
    {
      id: '31',
      name: 'Oran',
      arabicName: 'وهران',
      region: 'الغرب',
      coordinates: { x: 15, y: 35 },
      schools: 580,
      students: 128340,
      teachers: 5940,
      performance: 90.8,
      attendance: 93.2,
      healthStatus: 'ممتاز',
      activeCompetitions: 7,
      completedActivities: 175,
      totalActivities: 190
    }
  ];

  const getMetricValue = (province: ProvinceData, metric: string) => {
    switch (metric) {
      case 'performance': return province.performance;
      case 'attendance': return province.attendance;
      case 'schools': return province.schools / 10; // Scale for visualization
      case 'students': return province.students / 2000; // Scale for visualization
      case 'activities': return (province.completedActivities / province.totalActivities) * 100;
      default: return province.performance;
    }
  };

  const getMetricColor = (value: number, metric: string) => {
    if (metric === 'performance' || metric === 'attendance' || metric === 'activities') {
      if (value >= 90) return '#10b981'; // green-500
      if (value >= 80) return '#f59e0b'; // amber-500
      if (value >= 70) return '#f97316'; // orange-500
      return '#ef4444'; // red-500
    } else {
      if (value >= 80) return '#10b981';
      if (value >= 60) return '#f59e0b';
      if (value >= 40) return '#f97316';
      return '#ef4444';
    }
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'ممتاز': return 'bg-green-100 text-green-800';
      case 'جيد': return 'bg-blue-100 text-blue-800';
      case 'متوسط': return 'bg-yellow-100 text-yellow-800';
      case 'يحتاج تحسين': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const metricOptions = [
    { value: 'performance', label: 'الأداء العام', unit: '%' },
    { value: 'attendance', label: 'معدل الحضور', unit: '%' },
    { value: 'schools', label: 'عدد المدارس', unit: '' },
    { value: 'students', label: 'عدد الطلاب', unit: '' },
    { value: 'activities', label: 'إنجاز الأنشطة', unit: '%' }
  ];

  const selectedMetricInfo = metricOptions.find(m => m.value === selectedMetric);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <MapPin className="h-6 w-6" />
            الخريطة الوطنية للأداء التعليمي
          </CardTitle>
          <CardDescription className="text-green-100">
            تصور تفاعلي لمؤشرات الأداء عبر جميع ولايات الوطن
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              <span>المؤشر المعروض:</span>
            </div>
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {metricOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Visualization */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                خريطة الجزائر - {selectedMetricInfo?.label}
              </CardTitle>
              <CardDescription>
                انقر على أي ولاية لعرض التفاصيل
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-96 bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
                {/* Simplified Algeria Map */}
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Map outline (simplified) */}
                  <path
                    d="M10,30 L90,30 L90,80 L10,80 Z"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="0.5"
                  />
                  
                  {/* Province circles */}
                  {provinces.map((province) => {
                    const value = getMetricValue(province, selectedMetric);
                    const color = getMetricColor(value, selectedMetric);
                    const radius = Math.max(2, Math.min(8, value / 10));
                    
                    return (
                      <g key={province.id}>
                        <circle
                          cx={province.coordinates.x}
                          cy={province.coordinates.y}
                          r={radius}
                          fill={color}
                          stroke="white"
                          strokeWidth="1"
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => setSelectedProvince(province)}
                        />
                        <text
                          x={province.coordinates.x}
                          y={province.coordinates.y - radius - 2}
                          textAnchor="middle"
                          className="text-xs fill-gray-600 dark:fill-gray-300"
                          style={{ fontSize: '3px' }}
                        >
                          {province.arabicName}
                        </text>
                      </g>
                    );
                  })}
                </svg>
                
                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg">
                  <h4 className="text-sm font-medium mb-2">{selectedMetricInfo?.label}</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span>ممتاز (90%+)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <span>جيد (80-89%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                      <span>متوسط (70-79%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span>يحتاج تحسين (&lt;70%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Province Details */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                تفاصيل الولاية
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedProvince ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold">{selectedProvince.arabicName}</h3>
                    <p className={`text-sm ${getRegionColor(selectedProvince.region)}`}>
                      المنطقة {selectedProvince.region}
                    </p>
                    <Badge className={getHealthStatusColor(selectedProvince.healthStatus)} size="sm">
                      {selectedProvince.healthStatus}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <School className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">المدارس</span>
                      </div>
                      <span className="font-medium">{selectedProvince.schools}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-500" />
                        <span className="text-sm">الطلاب</span>
                      </div>
                      <span className="font-medium">{selectedProvince.students.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-purple-500" />
                        <span className="text-sm">الأداء</span>
                      </div>
                      <span className="font-medium">{selectedProvince.performance}%</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-orange-500" />
                        <span className="text-sm">الحضور</span>
                      </div>
                      <span className="font-medium">{selectedProvince.attendance}%</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">المسابقات النشطة</span>
                      </div>
                      <span className="font-medium">{selectedProvince.activeCompetitions}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>إنجاز الأنشطة</span>
                      <span>{selectedProvince.completedActivities}/{selectedProvince.totalActivities}</span>
                    </div>
                    <Progress 
                      value={(selectedProvince.completedActivities / selectedProvince.totalActivities) * 100} 
                      className="h-2"
                    />
                  </div>

                  <Button className="w-full" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    عرض التفاصيل الكاملة
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>انقر على أي ولاية في الخريطة لعرض التفاصيل</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Regional Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            ملخص المناطق الجغرافية
          </CardTitle>
          <CardDescription>
            مقارنة الأداء بين المناطق الخمس للوطن
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {['الوسط', 'الشرق', 'الغرب', 'الشمال', 'الجنوب'].map((region, index) => {
              const regionProvinces = provinces.filter(p => p.region === region);
              const avgPerformance = regionProvinces.length > 0 
                ? regionProvinces.reduce((acc, p) => acc + p.performance, 0) / regionProvinces.length 
                : 0;
              const totalSchools = regionProvinces.reduce((acc, p) => acc + p.schools, 0);
              const totalStudents = regionProvinces.reduce((acc, p) => acc + p.students, 0);

              return (
                <Card key={region} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 text-center">
                    <div className={`text-lg font-bold ${getRegionColor(region)}`}>
                      {region}
                    </div>
                    <div className="text-2xl font-bold mt-2">{avgPerformance.toFixed(1)}%</div>
                    <div className="text-sm text-gray-500 mb-3">متوسط الأداء</div>
                    <div className="space-y-1 text-xs text-gray-600">
                      <div>{regionProvinces.length} ولاية</div>
                      <div>{totalSchools} مدرسة</div>
                      <div>{(totalStudents / 1000).toFixed(0)}ك طالب</div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>تصدير البيانات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Download className="h-6 w-6" />
              تصدير خريطة PDF
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Download className="h-6 w-6" />
              تصدير بيانات CSV
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Download className="h-6 w-6" />
              تقرير شامل
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}