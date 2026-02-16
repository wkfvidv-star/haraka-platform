import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  User, 
  Activity, 
  Target, 
  TrendingUp,
  Clock,
  Calendar,
  CheckCircle,
  AlertCircle,
  Star,
  Award,
  BarChart3,
  Eye,
  Edit,
  Plus,
  Filter,
  Search,
  Download,
  FileText,
  Heart,
  Dumbbell,
  Zap
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  age: number;
  grade: string;
  avatar?: string;
  recentActivities: {
    id: string;
    activity: string;
    category: string;
    duration: number;
    points: number;
    completed: boolean;
    date: string;
    performance: number;
  }[];
  stats: {
    weeklyProgress: number;
    totalPoints: number;
    activeDays: number;
    averagePerformance: number;
  };
  healthStatus: 'ممتاز' | 'جيد' | 'متوسط' | 'يحتاج تحسين';
}

interface ClassData {
  id: string;
  name: string;
  grade: string;
  totalStudents: number;
  activeStudents: number;
  averageProgress: number;
  students: Student[];
}

interface ActivityWithStudent {
  studentName: string;
  activity: {
    id: string;
    activity: string;
    category: string;
    duration: number;
    points: number;
    completed: boolean;
    date: string;
    performance: number;
  };
}

const mockClassData: ClassData = {
  id: 'class_1',
  name: 'السنة الثالثة متوسط - أ',
  grade: 'الثالثة متوسط',
  totalStudents: 28,
  activeStudents: 25,
  averageProgress: 78,
  students: [
    {
      id: 'student_1',
      name: 'أحمد محمد علي',
      age: 14,
      grade: 'الثالثة متوسط',
      recentActivities: [
        {
          id: '1',
          activity: 'تدريب القوة الوظيفية',
          category: 'القوة',
          duration: 15,
          points: 25,
          completed: true,
          date: '2024-10-15',
          performance: 85
        },
        {
          id: '2',
          activity: 'تمارين التحمل القلبي',
          category: 'التحمل',
          duration: 20,
          points: 30,
          completed: true,
          date: '2024-10-14',
          performance: 78
        },
        {
          id: '3',
          activity: 'تمارين المرونة والحركية',
          category: 'المرونة',
          duration: 12,
          points: 15,
          completed: false,
          date: '2024-10-13',
          performance: 0
        }
      ],
      stats: {
        weeklyProgress: 85,
        totalPoints: 340,
        activeDays: 5,
        averagePerformance: 82
      },
      healthStatus: 'ممتاز'
    },
    {
      id: 'student_2',
      name: 'فاطمة الزهراء بن علي',
      age: 14,
      grade: 'الثالثة متوسط',
      recentActivities: [
        {
          id: '1',
          activity: 'تدريب التوازن المتقدم',
          category: 'التوازن',
          duration: 18,
          points: 28,
          completed: true,
          date: '2024-10-15',
          performance: 92
        },
        {
          id: '2',
          activity: 'تمارين التناسق الحركي',
          category: 'التناسق',
          duration: 16,
          points: 22,
          completed: true,
          date: '2024-10-14',
          performance: 88
        }
      ],
      stats: {
        weeklyProgress: 92,
        totalPoints: 420,
        activeDays: 6,
        averagePerformance: 90
      },
      healthStatus: 'ممتاز'
    },
    {
      id: 'student_3',
      name: 'محمد الأمين خالد',
      age: 13,
      grade: 'الثالثة متوسط',
      recentActivities: [
        {
          id: '1',
          activity: 'تمارين الاسترخاء والتأمل',
          category: 'الاسترخاء',
          duration: 10,
          points: 12,
          completed: true,
          date: '2024-10-12',
          performance: 65
        }
      ],
      stats: {
        weeklyProgress: 45,
        totalPoints: 180,
        activeDays: 2,
        averagePerformance: 65
      },
      healthStatus: 'يحتاج تحسين'
    }
  ]
};

export function ClassManagement() {
  const [classData] = useState<ClassData>(mockClassData);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [filterCategory, setFilterCategory] = useState('الكل');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['الكل', 'القوة', 'التحمل', 'المرونة', 'التوازن', 'التناسق', 'السرعة', 'الاسترخاء'];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'القوة': return <Dumbbell className="h-4 w-4" />;
      case 'التحمل': return <Heart className="h-4 w-4" />;
      case 'المرونة': return <Activity className="h-4 w-4" />;
      case 'التوازن': return <Target className="h-4 w-4" />;
      case 'التناسق': return <Star className="h-4 w-4" />;
      case 'السرعة': return <Zap className="h-4 w-4" />;
      case 'الاسترخاء': return <Heart className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'ممتاز': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
      case 'جيد': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200';
      case 'متوسط': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200';
      case 'يحتاج تحسين': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
    }
  };

  const filteredStudents = classData.students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'الكل' || 
      student.recentActivities.some(activity => activity.category === filterCategory);
    return matchesSearch && matchesCategory;
  });

  const getAllRecentActivities = (): ActivityWithStudent[] => {
    const allActivities: ActivityWithStudent[] = [];
    
    classData.students.forEach(student => {
      student.recentActivities.forEach(activity => {
        allActivities.push({
          studentName: student.name,
          activity
        });
      });
    });
    
    return allActivities.sort((a, b) => 
      new Date(b.activity.date).getTime() - new Date(a.activity.date).getTime()
    );
  };

  return (
    <div className="space-y-6">
      {/* Class Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Users className="h-6 w-6" />
            {classData.name}
          </CardTitle>
          <CardDescription className="text-blue-100">
            إدارة ومتابعة تقدم الطلاب في الأنشطة الرياضية
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{classData.totalStudents}</div>
              <div className="text-sm text-blue-100">إجمالي الطلاب</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{classData.activeStudents}</div>
              <div className="text-sm text-blue-100">طلاب نشطون</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{classData.averageProgress}%</div>
              <div className="text-sm text-blue-100">متوسط التقدم</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{Math.round((classData.activeStudents / classData.totalStudents) * 100)}%</div>
              <div className="text-sm text-blue-100">نسبة المشاركة</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">البحث عن طالب</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="ابحث عن طالب..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">تصفية حسب النشاط</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="اختر الفئة" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">إجراءات سريعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-1" />
                تصدير
              </Button>
              <Button size="sm" variant="outline">
                <FileText className="h-4 w-4 mr-1" />
                تقرير
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Students List */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                قائمة الطلاب ({filteredStudents.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                      selectedStudent?.id === student.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                    onClick={() => setSelectedStudent(student)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium">{student.name}</h4>
                          <p className="text-sm text-gray-500">{student.age} سنة</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getHealthStatusColor(student.healthStatus)}>
                          {student.healthStatus}
                        </Badge>
                        <div className="text-sm text-gray-500 mt-1">
                          {student.stats.weeklyProgress}% تقدم
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <Progress value={student.stats.weeklyProgress} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Student Details or Recent Activities */}
        <div className="space-y-4">
          {selectedStudent ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  تفاصيل {selectedStudent.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Student Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">{selectedStudent.stats.totalPoints}</div>
                    <div className="text-xs text-gray-500">نقاط إجمالية</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-lg font-bold text-green-600">{selectedStudent.stats.activeDays}</div>
                    <div className="text-xs text-gray-500">أيام نشطة</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">{selectedStudent.stats.averagePerformance}%</div>
                    <div className="text-xs text-gray-500">متوسط الأداء</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="text-lg font-bold text-orange-600">{selectedStudent.recentActivities.length}</div>
                    <div className="text-xs text-gray-500">أنشطة حديثة</div>
                  </div>
                </div>

                {/* Recent Activities */}
                <div>
                  <h4 className="font-medium mb-3">الأنشطة الحديثة</h4>
                  <div className="space-y-2">
                    {selectedStudent.recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getCategoryIcon(activity.category)}
                          <div>
                            <h5 className="font-medium text-sm">{activity.activity}</h5>
                            <p className="text-xs text-gray-500">
                              {activity.duration} دقيقة • {activity.points} نقطة
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {activity.completed ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-orange-500" />
                          )}
                          <div className="text-xs text-gray-500 mt-1">
                            {activity.performance}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    عرض التفاصيل
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4 mr-1" />
                    تعديل
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  الأنشطة الحديثة للصف
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getAllRecentActivities().slice(0, 8).map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getCategoryIcon(item.activity.category)}
                        <div>
                          <h5 className="font-medium text-sm">{item.studentName}</h5>
                          <p className="text-xs text-gray-500">{item.activity.activity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-xs">
                          {item.activity.category}
                        </Badge>
                        <div className="text-xs text-gray-500 mt-1">
                          {item.activity.date}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}