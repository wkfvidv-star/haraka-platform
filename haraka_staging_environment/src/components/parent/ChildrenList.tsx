import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Activity, 
  Heart, 
  Target, 
  TrendingUp,
  ChevronRight,
  Eye,
  Settings,
  Calendar,
  BookOpen,
  Award,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  MapPin
} from 'lucide-react';

interface Child {
  id: string;
  name: string;
  age: number;
  grade: string;
  school: string;
  avatar?: string;
  deviceCapabilities: {
    hasWearable: boolean;
    hasBIA: boolean;
    hasHeartRate: boolean;
    hasGPS: boolean;
    hasAdvancedMetrics: boolean;
  };
  currentStats: {
    steps: number;
    stepsGoal: number;
    distance: number;
    calories: number;
    heartRate?: number;
    activeTime: number;
    sedentaryTime: number;
  };
  healthStatus: 'ممتاز' | 'جيد' | 'متوسط' | 'يحتاج تحسين';
  lastActivity: string;
  upcomingSchedule: {
    activity: string;
    time: string;
    type: 'فردي' | 'جماعي';
  }[];
}

const mockChildren: Child[] = [
  {
    id: 'student_1',
    name: 'أحمد محمد علي',
    age: 14,
    grade: 'السنة الثالثة متوسط',
    school: 'متوسطة الشهيد محمد بوضياف',
    deviceCapabilities: {
      hasWearable: true,
      hasBIA: true,
      hasHeartRate: true,
      hasGPS: true,
      hasAdvancedMetrics: true
    },
    currentStats: {
      steps: 8543,
      stepsGoal: 10000,
      distance: 6.2,
      calories: 320,
      heartRate: 78,
      activeTime: 180,
      sedentaryTime: 420
    },
    healthStatus: 'ممتاز',
    lastActivity: 'منذ ساعتين',
    upcomingSchedule: [
      { activity: 'تدريب كرة القدم', time: '16:00', type: 'جماعي' },
      { activity: 'تمرين القوة', time: '18:30', type: 'فردي' }
    ]
  },
  {
    id: 'student_2',
    name: 'فاطمة الزهراء',
    age: 16,
    grade: 'السنة الثانية ثانوي',
    school: 'ثانوية عبد الحميد بن باديس',
    deviceCapabilities: {
      hasWearable: true,
      hasBIA: false,
      hasHeartRate: true,
      hasGPS: false,
      hasAdvancedMetrics: false
    },
    currentStats: {
      steps: 9200,
      stepsGoal: 10000,
      distance: 7.1,
      calories: 380,
      heartRate: 72,
      activeTime: 210,
      sedentaryTime: 390
    },
    healthStatus: 'جيد',
    lastActivity: 'منذ 30 دقيقة',
    upcomingSchedule: [
      { activity: 'سباحة', time: '15:30', type: 'جماعي' },
      { activity: 'يوغا', time: '19:00', type: 'فردي' }
    ]
  },
  {
    id: 'student_3',
    name: 'يوسف أحمد',
    age: 12,
    grade: 'السنة الأولى متوسط',
    school: 'متوسطة الإمام مالك',
    deviceCapabilities: {
      hasWearable: false,
      hasBIA: false,
      hasHeartRate: false,
      hasGPS: false,
      hasAdvancedMetrics: false
    },
    currentStats: {
      steps: 0,
      stepsGoal: 8000,
      distance: 0,
      calories: 0,
      activeTime: 0,
      sedentaryTime: 0
    },
    healthStatus: 'متوسط',
    lastActivity: 'لا توجد بيانات',
    upcomingSchedule: [
      { activity: 'تمارين أساسية', time: '14:00', type: 'جماعي' }
    ]
  }
];

interface ChildrenListProps {
  onSelectChild: (childId: string) => void;
  selectedChildId?: string;
}

export function ChildrenList({ onSelectChild, selectedChildId }: ChildrenListProps) {
  const [children] = useState<Child[]>(mockChildren);

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'ممتاز': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
      case 'جيد': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200';
      case 'متوسط': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200';
      case 'يحتاج تحسين': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
    }
  };

  const getDeviceStatusIcon = (child: Child) => {
    if (child.deviceCapabilities.hasWearable) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <AlertCircle className="h-4 w-4 text-orange-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Users className="h-6 w-6" />
            أطفالي
          </CardTitle>
          <CardDescription className="text-purple-100">
            تابع تقدم أطفالك الرياضي والصحي بسهولة
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Children Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {children.map((child) => (
          <Card 
            key={child.id} 
            className={`hover:shadow-lg transition-all duration-200 cursor-pointer ${
              selectedChildId === child.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => onSelectChild(child.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{child.name}</CardTitle>
                    <CardDescription>{child.age} سنة - {child.grade}</CardDescription>
                  </div>
                </div>
                {getDeviceStatusIcon(child)}
              </div>
              
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getHealthStatusColor(child.healthStatus)}>
                  {child.healthStatus}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <MapPin className="h-3 w-3 mr-1" />
                  {child.school}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Device Status */}
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">حالة الجهاز</span>
                  <span className="text-xs text-gray-500">{child.lastActivity}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {child.deviceCapabilities.hasWearable && (
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                      سوار ذكي
                    </Badge>
                  )}
                  {child.deviceCapabilities.hasBIA && (
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                      تحليل الجسم
                    </Badge>
                  )}
                  {child.deviceCapabilities.hasHeartRate && (
                    <Badge variant="outline" className="text-xs bg-red-50 text-red-700">
                      معدل النبض
                    </Badge>
                  )}
                  {!child.deviceCapabilities.hasWearable && (
                    <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700">
                      بدون جهاز
                    </Badge>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              {child.deviceCapabilities.hasWearable ? (
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <div className="text-lg font-bold text-blue-600">
                      {child.currentStats.steps.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">خطوات</div>
                  </div>
                  <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <div className="text-lg font-bold text-green-600">
                      {child.currentStats.calories}
                    </div>
                    <div className="text-xs text-gray-500">سعرة</div>
                  </div>
                  <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                    <div className="text-lg font-bold text-purple-600">
                      {child.currentStats.distance} كم
                    </div>
                    <div className="text-xs text-gray-500">مسافة</div>
                  </div>
                  <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded">
                    <div className="text-lg font-bold text-red-600">
                      {child.currentStats.heartRate || '--'}
                    </div>
                    <div className="text-xs text-gray-500">نبضة/د</div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <AlertCircle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    لا يوجد جهاز متصل
                  </p>
                  <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                    يمكن إضافة البيانات يدوياً
                  </p>
                </div>
              )}

              {/* Steps Progress */}
              {child.deviceCapabilities.hasWearable && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>هدف الخطوات اليومي</span>
                    <span>{Math.round((child.currentStats.steps / child.currentStats.stepsGoal) * 100)}%</span>
                  </div>
                  <Progress 
                    value={(child.currentStats.steps / child.currentStats.stepsGoal) * 100} 
                    className="h-2"
                  />
                </div>
              )}

              {/* Upcoming Schedule */}
              <div>
                <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  الجدول القادم
                </h4>
                {child.upcomingSchedule.length > 0 ? (
                  <div className="space-y-1">
                    {child.upcomingSchedule.slice(0, 2).map((schedule, index) => (
                      <div key={index} className="flex items-center justify-between text-xs p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {schedule.time}
                        </span>
                        <span className="flex-1 mx-2 truncate">{schedule.activity}</span>
                        <Badge variant="outline" className="text-xs">
                          {schedule.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">لا توجد أنشطة مجدولة</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectChild(child.id);
                  }}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  التفاصيل
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Child Button */}
      <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <User className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">إضافة طفل جديد</h3>
          <p className="text-sm text-gray-500 mb-4">
            أضف حساب طفل جديد لمتابعة تقدمه الرياضي
          </p>
          <Button variant="outline">
            إضافة طفل
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}