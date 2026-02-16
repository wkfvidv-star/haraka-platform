import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Users,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  BarChart3,
  Flag,
  Award,
  Activity,
  FileText,
  Send
} from 'lucide-react';

interface Province {
  id: string;
  name: string;
  arabicName: string;
  schools: number;
  students: number;
  teachers: number;
}

interface StrategicGoal {
  id: string;
  title: string;
  description: string;
  category: 'education_quality' | 'infrastructure' | 'teacher_development' | 'student_welfare' | 'technology';
  priority: 'high' | 'medium' | 'low';
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold';
  startDate: string;
  targetDate: string;
  progress: number;
  budget: number;
  allocatedBudget: number;
  responsiblePerson: string;
  department: string;
  tasks: Task[];
  kpis: KPI[];
  risks: Risk[];
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  assignee: string;
  dueDate: string;
  progress: number;
  dependencies: string[];
}

interface KPI {
  id: string;
  name: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

interface Risk {
  id: string;
  description: string;
  probability: 'high' | 'medium' | 'low';
  impact: 'high' | 'medium' | 'low';
  mitigation: string;
  status: 'identified' | 'mitigated' | 'resolved';
}

interface DirectorateStrategyProps {
  selectedProvince: Province;
}

export function DirectorateStrategy({ selectedProvince }: DirectorateStrategyProps) {
  const [strategicGoals, setStrategicGoals] = useState<StrategicGoal[]>([
    {
      id: 'goal_1',
      title: `تحسين جودة التعليم في ولاية ${selectedProvince.arabicName}`,
      description: 'رفع مستوى جودة التعليم من خلال تطوير المناهج وتدريب المعلمين وتحسين البيئة التعليمية',
      category: 'education_quality',
      priority: 'high',
      status: 'in_progress',
      startDate: '2024-01-01',
      targetDate: '2024-12-31',
      progress: 65,
      budget: 5000000,
      allocatedBudget: 3250000,
      responsiblePerson: 'الأستاذ محمد بن عبد الله',
      department: 'قسم التطوير التربوي',
      tasks: [
        {
          id: 'task_1',
          title: 'تدريب المعلمين على المناهج الجديدة',
          description: 'برنامج تدريبي شامل لجميع المعلمين',
          status: 'in_progress',
          assignee: 'الأستاذة فاطمة الزهراء',
          dueDate: '2024-11-30',
          progress: 70,
          dependencies: []
        },
        {
          id: 'task_2',
          title: 'تحديث المكتبات المدرسية',
          description: 'تزويد المكتبات بالكتب والمراجع الحديثة',
          status: 'completed',
          assignee: 'الأستاذ أحمد الصالح',
          dueDate: '2024-10-15',
          progress: 100,
          dependencies: []
        }
      ],
      kpis: [
        {
          id: 'kpi_1',
          name: 'معدل نجاح الطلاب',
          currentValue: 87.5,
          targetValue: 92,
          unit: '%',
          trend: 'up'
        },
        {
          id: 'kpi_2',
          name: 'رضا أولياء الأمور',
          currentValue: 78,
          targetValue: 85,
          unit: '%',
          trend: 'up'
        }
      ],
      risks: [
        {
          id: 'risk_1',
          description: 'نقص في الميزانية المخصصة',
          probability: 'medium',
          impact: 'high',
          mitigation: 'البحث عن مصادر تمويل إضافية',
          status: 'identified'
        }
      ]
    },
    {
      id: 'goal_2',
      title: `تطوير البنية التحتية التعليمية في ولاية ${selectedProvince.arabicName}`,
      description: 'تحسين وتطوير المباني المدرسية والمرافق التعليمية',
      category: 'infrastructure',
      priority: 'high',
      status: 'planning',
      startDate: '2024-03-01',
      targetDate: '2025-02-28',
      progress: 25,
      budget: 8000000,
      allocatedBudget: 2000000,
      responsiblePerson: 'المهندس علي بن محمد',
      department: 'قسم البنية التحتية',
      tasks: [
        {
          id: 'task_3',
          title: 'مسح شامل للمباني المدرسية',
          description: 'تقييم حالة جميع المباني المدرسية في الولاية',
          status: 'completed',
          assignee: 'فريق المسح الهندسي',
          dueDate: '2024-10-30',
          progress: 100,
          dependencies: []
        },
        {
          id: 'task_4',
          title: 'تصميم خطة التطوير',
          description: 'وضع خطة شاملة لتطوير البنية التحتية',
          status: 'in_progress',
          assignee: 'المهندس علي بن محمد',
          dueDate: '2024-12-15',
          progress: 60,
          dependencies: ['task_3']
        }
      ],
      kpis: [
        {
          id: 'kpi_3',
          name: 'نسبة المباني المطورة',
          currentValue: 15,
          targetValue: 80,
          unit: '%',
          trend: 'up'
        }
      ],
      risks: [
        {
          id: 'risk_2',
          description: 'تأخير في الحصول على التراخيص',
          probability: 'high',
          impact: 'medium',
          mitigation: 'التنسيق المبكر مع الجهات المختصة',
          status: 'mitigated'
        }
      ]
    },
    {
      id: 'goal_3',
      title: `رقمنة التعليم في ولاية ${selectedProvince.arabicName}`,
      description: 'تطبيق التكنولوجيا الحديثة في العملية التعليمية',
      category: 'technology',
      priority: 'medium',
      status: 'planning',
      startDate: '2024-06-01',
      targetDate: '2025-05-31',
      progress: 10,
      budget: 3000000,
      allocatedBudget: 300000,
      responsiblePerson: 'الأستاذ خالد التقني',
      department: 'قسم تكنولوجيا التعليم',
      tasks: [
        {
          id: 'task_5',
          title: 'تقييم البنية التحتية التقنية',
          description: 'مسح شامل للإمكانيات التقنية الحالية',
          status: 'pending',
          assignee: 'فريق التقنية',
          dueDate: '2024-12-01',
          progress: 0,
          dependencies: []
        }
      ],
      kpis: [
        {
          id: 'kpi_4',
          name: 'نسبة المدارس المرقمنة',
          currentValue: 5,
          targetValue: 70,
          unit: '%',
          trend: 'stable'
        }
      ],
      risks: [
        {
          id: 'risk_3',
          description: 'مقاومة التغيير من المعلمين',
          probability: 'medium',
          impact: 'medium',
          mitigation: 'برامج تدريب وتوعية مكثفة',
          status: 'identified'
        }
      ]
    }
  ]);

  const [selectedGoal, setSelectedGoal] = useState<StrategicGoal | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200';
      case 'planning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200';
      case 'on_hold': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'education_quality': return <Award className="h-4 w-4" />;
      case 'infrastructure': return <Activity className="h-4 w-4" />;
      case 'teacher_development': return <Users className="h-4 w-4" />;
      case 'student_welfare': return <Users className="h-4 w-4" />;
      case 'technology': return <BarChart3 className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const renderCreateForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            إنشاء هدف استراتيجي جديد - ولاية {selectedProvince.arabicName}
          </CardTitle>
          <CardDescription>
            قم بتحديد هدف استراتيجي جديد مع الخطط والمهام المطلوبة
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="goal-title">عنوان الهدف</Label>
              <Input id="goal-title" placeholder="عنوان الهدف الاستراتيجي..." />
            </div>
            <div>
              <Label htmlFor="goal-category">الفئة</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الفئة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="education_quality">جودة التعليم</SelectItem>
                  <SelectItem value="infrastructure">البنية التحتية</SelectItem>
                  <SelectItem value="teacher_development">تطوير المعلمين</SelectItem>
                  <SelectItem value="student_welfare">رعاية الطلاب</SelectItem>
                  <SelectItem value="technology">التكنولوجيا</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="goal-description">وصف الهدف</Label>
            <Textarea 
              id="goal-description" 
              placeholder="وصف مفصل للهدف الاستراتيجي..."
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="goal-priority">الأولوية</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الأولوية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">عالية</SelectItem>
                  <SelectItem value="medium">متوسطة</SelectItem>
                  <SelectItem value="low">منخفضة</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="start-date">تاريخ البداية</Label>
              <Input id="start-date" type="date" />
            </div>
            <div>
              <Label htmlFor="target-date">التاريخ المستهدف</Label>
              <Input id="target-date" type="date" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="responsible-person">المسؤول</Label>
              <Input id="responsible-person" placeholder="اسم المسؤول..." />
            </div>
            <div>
              <Label htmlFor="department">القسم</Label>
              <Input id="department" placeholder="القسم المسؤول..." />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button className="flex-1">
              <Target className="h-4 w-4 mr-2" />
              إنشاء الهدف
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowCreateForm(false)}
            >
              إلغاء
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderGoalDetails = () => {
    if (!selectedGoal) return null;

    return (
      <div className="space-y-6">
        {/* Goal Header */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  {getCategoryIcon(selectedGoal.category)}
                  {selectedGoal.title}
                </CardTitle>
                <CardDescription className="mt-2">
                  {selectedGoal.description}
                </CardDescription>
                <div className="flex items-center gap-2 mt-3">
                  <Badge className={getStatusColor(selectedGoal.status)}>
                    {selectedGoal.status === 'planning' && 'قيد التخطيط'}
                    {selectedGoal.status === 'in_progress' && 'قيد التنفيذ'}
                    {selectedGoal.status === 'completed' && 'مكتمل'}
                    {selectedGoal.status === 'on_hold' && 'معلق'}
                  </Badge>
                  <Badge className={getPriorityColor(selectedGoal.priority)}>
                    {selectedGoal.priority === 'high' && 'أولوية عالية'}
                    {selectedGoal.priority === 'medium' && 'أولوية متوسطة'}
                    {selectedGoal.priority === 'low' && 'أولوية منخفضة'}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4 mr-1" />
                  تعديل
                </Button>
                <Button size="sm" variant="outline" onClick={() => setSelectedGoal(null)}>
                  ← العودة
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="tasks">المهام</TabsTrigger>
            <TabsTrigger value="kpis">المؤشرات</TabsTrigger>
            <TabsTrigger value="risks">المخاطر</TabsTrigger>
            <TabsTrigger value="budget">الميزانية</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Progress Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  التقدم العام
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>نسبة الإنجاز</span>
                      <span>{selectedGoal.progress}%</span>
                    </div>
                    <Progress value={selectedGoal.progress} className="h-3" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                      <div className="font-medium">تاريخ البداية</div>
                      <div className="text-sm text-gray-500">{selectedGoal.startDate}</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <Flag className="h-6 w-6 text-green-600 mx-auto mb-2" />
                      <div className="font-medium">التاريخ المستهدف</div>
                      <div className="text-sm text-gray-500">{selectedGoal.targetDate}</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <Users className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                      <div className="font-medium">المسؤول</div>
                      <div className="text-sm text-gray-500">{selectedGoal.responsiblePerson}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Information */}
            <Card>
              <CardHeader>
                <CardTitle>معلومات أساسية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">القسم المسؤول: </span>
                    <span className="font-medium">{selectedGoal.department}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">الميزانية المخصصة: </span>
                    <span className="font-medium">{selectedGoal.allocatedBudget.toLocaleString()} دج</span>
                  </div>
                  <div>
                    <span className="text-gray-500">إجمالي الميزانية: </span>
                    <span className="font-medium">{selectedGoal.budget.toLocaleString()} دج</span>
                  </div>
                  <div>
                    <span className="text-gray-500">عدد المهام: </span>
                    <span className="font-medium">{selectedGoal.tasks.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>قائمة المهام</CardTitle>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    إضافة مهمة
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedGoal.tasks.map((task) => (
                    <div key={task.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{task.title}</h4>
                        <Badge className={getTaskStatusColor(task.status)}>
                          {task.status === 'completed' && 'مكتملة'}
                          {task.status === 'in_progress' && 'قيد التنفيذ'}
                          {task.status === 'pending' && 'معلقة'}
                          {task.status === 'overdue' && 'متأخرة'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                      <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                        <span>المسؤول: {task.assignee}</span>
                        <span>موعد التسليم: {task.dueDate}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">التقدم: {task.progress}%</span>
                      </div>
                      <Progress value={task.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="kpis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>مؤشرات الأداء الرئيسية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedGoal.kpis.map((kpi) => (
                    <div key={kpi.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{kpi.name}</h4>
                        <div className={`flex items-center gap-1 ${
                          kpi.trend === 'up' ? 'text-green-600' : 
                          kpi.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          <TrendingUp className={`h-4 w-4 ${kpi.trend === 'down' ? 'rotate-180' : ''}`} />
                          <span className="text-sm">{kpi.trend === 'up' ? 'تحسن' : kpi.trend === 'down' ? 'تراجع' : 'ثابت'}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-blue-600">{kpi.currentValue}{kpi.unit}</div>
                          <div className="text-sm text-gray-500">القيمة الحالية</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-600">{kpi.targetValue}{kpi.unit}</div>
                          <div className="text-sm text-gray-500">القيمة المستهدفة</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-purple-600">
                            {Math.round((kpi.currentValue / kpi.targetValue) * 100)}%
                          </div>
                          <div className="text-sm text-gray-500">نسبة الإنجاز</div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <Progress value={(kpi.currentValue / kpi.targetValue) * 100} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>إدارة المخاطر</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedGoal.risks.map((risk) => (
                    <div key={risk.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{risk.description}</h4>
                        <Badge className={
                          risk.status === 'resolved' ? 'bg-green-100 text-green-800' :
                          risk.status === 'mitigated' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {risk.status === 'identified' && 'محدد'}
                          {risk.status === 'mitigated' && 'تم التخفيف'}
                          {risk.status === 'resolved' && 'تم الحل'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <span className="text-sm text-gray-500">الاحتمالية: </span>
                          <span className={`font-medium ${getRiskColor(risk.probability)}`}>
                            {risk.probability === 'high' && 'عالية'}
                            {risk.probability === 'medium' && 'متوسطة'}
                            {risk.probability === 'low' && 'منخفضة'}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">التأثير: </span>
                          <span className={`font-medium ${getRiskColor(risk.impact)}`}>
                            {risk.impact === 'high' && 'عالي'}
                            {risk.impact === 'medium' && 'متوسط'}
                            {risk.impact === 'low' && 'منخفض'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">خطة التخفيف: </span>
                        <p className="text-sm mt-1">{risk.mitigation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="budget" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>تفاصيل الميزانية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>الميزانية المستخدمة</span>
                      <span>{selectedGoal.allocatedBudget.toLocaleString()} دج من {selectedGoal.budget.toLocaleString()} دج</span>
                    </div>
                    <Progress value={(selectedGoal.allocatedBudget / selectedGoal.budget) * 100} className="h-3" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedGoal.budget.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">إجمالي الميزانية (دج)</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {selectedGoal.allocatedBudget.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">المخصص (دج)</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {(selectedGoal.budget - selectedGoal.allocatedBudget).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">المتبقي (دج)</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  if (selectedGoal) {
    return renderGoalDetails();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Target className="h-6 w-6" />
            الاستراتيجية والتخطيط - ولاية {selectedProvince.arabicName}
          </CardTitle>
          <CardDescription className="text-purple-100">
            لوحة تحكم فعالة لوضع الخطط والأهداف الاستراتيجية ومتابعة تنفيذها
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{strategicGoals.length}</div>
                <div className="text-sm text-purple-100">أهداف استراتيجية</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {strategicGoals.filter(g => g.status === 'in_progress').length}
                </div>
                <div className="text-sm text-purple-100">قيد التنفيذ</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {Math.round(strategicGoals.reduce((acc, g) => acc + g.progress, 0) / strategicGoals.length)}%
                </div>
                <div className="text-sm text-purple-100">متوسط التقدم</div>
              </div>
            </div>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-white text-purple-600 hover:bg-gray-100"
            >
              <Plus className="h-4 w-4 mr-2" />
              هدف استراتيجي جديد
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Strategic Goals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {strategicGoals.map((goal) => (
          <Card key={goal.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(goal.category)}
                  <Badge className={getStatusColor(goal.status)}>
                    {goal.status === 'planning' && 'قيد التخطيط'}
                    {goal.status === 'in_progress' && 'قيد التنفيذ'}
                    {goal.status === 'completed' && 'مكتمل'}
                    {goal.status === 'on_hold' && 'معلق'}
                  </Badge>
                </div>
                <Badge className={getPriorityColor(goal.priority)}>
                  {goal.priority === 'high' && 'عالية'}
                  {goal.priority === 'medium' && 'متوسطة'}
                  {goal.priority === 'low' && 'منخفضة'}
                </Badge>
              </div>
              
              <CardTitle className="text-lg">{goal.title}</CardTitle>
              <CardDescription>{goal.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Progress */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>التقدم</span>
                  <span>{goal.progress}%</span>
                </div>
                <Progress value={goal.progress} className="h-2" />
              </div>

              {/* Key Info */}
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <div className="text-lg font-bold text-blue-600">{goal.tasks.length}</div>
                  <div className="text-xs text-gray-500">مهام</div>
                </div>
                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <div className="text-lg font-bold text-green-600">{goal.kpis.length}</div>
                  <div className="text-xs text-gray-500">مؤشرات</div>
                </div>
              </div>

              {/* Details */}
              <div className="text-sm text-gray-500 space-y-1">
                <div>المسؤول: {goal.responsiblePerson}</div>
                <div>القسم: {goal.department}</div>
                <div>الموعد المستهدف: {goal.targetDate}</div>
                <div>الميزانية: {goal.allocatedBudget.toLocaleString()} دج</div>
              </div>

              {/* Action Button */}
              <Button 
                className="w-full"
                onClick={() => setSelectedGoal(goal)}
              >
                <Eye className="h-4 w-4 mr-2" />
                عرض التفاصيل
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Form Modal */}
      {showCreateForm && renderCreateForm()}
    </div>
  );
}