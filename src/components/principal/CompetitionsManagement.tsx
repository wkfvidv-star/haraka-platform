import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy,
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  Calendar,
  Target,
  Award,
  Play,
  Pause,
  CheckCircle,
  Clock,
  BarChart3,
  Medal,
  Star,
  Activity,
  Download,
  Upload,
  Filter,
  Search
} from 'lucide-react';

interface Competition {
  id: string;
  title: string;
  description: string;
  category: 'fitness' | 'sports' | 'endurance' | 'strength' | 'flexibility';
  type: 'individual' | 'team' | 'class';
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  participants: number;
  maxParticipants?: number;
  prizes: {
    first: string;
    second: string;
    third: string;
  };
  rules: string[];
  criteria: {
    name: string;
    weight: number;
    description: string;
  }[];
  results?: {
    participantId: string;
    participantName: string;
    score: number;
    rank: number;
    class: string;
  }[];
  createdBy: string;
  createdDate: string;
}

interface CompetitionTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  defaultRules: string[];
  defaultCriteria: {
    name: string;
    weight: number;
    description: string;
  }[];
}

const mockCompetitions: Competition[] = [
  {
    id: 'comp_1',
    title: 'مسابقة اللياقة البدنية الشاملة',
    description: 'مسابقة شاملة لتقييم اللياقة البدنية العامة للطلاب',
    category: 'fitness',
    type: 'individual',
    status: 'active',
    startDate: '2024-10-01',
    endDate: '2024-10-31',
    participants: 156,
    maxParticipants: 200,
    prizes: {
      first: 'ميدالية ذهبية + شهادة تقدير',
      second: 'ميدالية فضية + شهادة تقدير',
      third: 'ميدالية برونزية + شهادة تقدير'
    },
    rules: [
      'يجب على جميع المشاركين إحضار الملابس الرياضية',
      'يتم التقييم على أساس الأداء والتحسن',
      'يُمنع استخدام أي مواد محظورة',
      'يجب الالتزام بالوقت المحدد لكل تمرين'
    ],
    criteria: [
      { name: 'القوة العضلية', weight: 30, description: 'تقييم قوة العضلات الأساسية' },
      { name: 'التحمل القلبي', weight: 25, description: 'قياس قدرة التحمل القلبي الوعائي' },
      { name: 'المرونة', weight: 20, description: 'تقييم مرونة المفاصل والعضلات' },
      { name: 'التوازن', weight: 15, description: 'قياس القدرة على التوازن' },
      { name: 'التناسق', weight: 10, description: 'تقييم التناسق الحركي' }
    ],
    results: [
      { participantId: '1', participantName: 'أحمد محمد', score: 95.5, rank: 1, class: 'الثالثة متوسط - أ' },
      { participantId: '2', participantName: 'سارة أحمد', score: 92.3, rank: 2, class: 'الثانية متوسط - ب' },
      { participantId: '3', participantName: 'محمد علي', score: 89.7, rank: 3, class: 'الأولى متوسط - أ' }
    ],
    createdBy: 'المدير',
    createdDate: '2024-09-25'
  },
  {
    id: 'comp_2',
    title: 'بطولة كرة القدم المدرسية',
    description: 'بطولة كرة قدم بين صفوف المدرسة',
    category: 'sports',
    type: 'team',
    status: 'completed',
    startDate: '2024-09-15',
    endDate: '2024-09-30',
    participants: 84,
    maxParticipants: 96,
    prizes: {
      first: 'كأس البطولة + ميداليات للفريق',
      second: 'كأس الوصيف + شهادات تقدير',
      third: 'شهادات تقدير للمركز الثالث'
    },
    rules: [
      'كل فريق يتكون من 11 لاعب + 5 احتياط',
      'مدة المباراة 60 دقيقة (30 دقيقة لكل شوط)',
      'يُسمح بـ 3 تبديلات لكل فريق',
      'تطبق قوانين الفيفا المبسطة'
    ],
    criteria: [
      { name: 'الأداء الفني', weight: 40, description: 'مستوى الأداء الفني للفريق' },
      { name: 'الروح الرياضية', weight: 30, description: 'السلوك الرياضي والأخلاق' },
      { name: 'التعاون', weight: 20, description: 'مستوى التعاون بين أعضاء الفريق' },
      { name: 'الانضباط', weight: 10, description: 'الالتزام بالقوانين والتعليمات' }
    ],
    results: [
      { participantId: 'team_1', participantName: 'فريق الثالثة متوسط - أ', score: 18, rank: 1, class: 'الثالثة متوسط - أ' },
      { participantId: 'team_2', participantName: 'فريق الثانية متوسط - ب', score: 15, rank: 2, class: 'الثانية متوسط - ب' },
      { participantId: 'team_3', participantName: 'فريق الأولى متوسط - أ', score: 12, rank: 3, class: 'الأولى متوسط - أ' }
    ],
    createdBy: 'أستاذ محمد الأحمد',
    createdDate: '2024-09-01'
  },
  {
    id: 'comp_3',
    title: 'تحدي القوة والتحمل',
    description: 'مسابقة لاختبار قوة وتحمل الطلاب',
    category: 'strength',
    type: 'individual',
    status: 'draft',
    startDate: '2024-11-01',
    endDate: '2024-11-15',
    participants: 0,
    maxParticipants: 150,
    prizes: {
      first: 'جائزة نقدية 500 ريال + شهادة',
      second: 'جائزة نقدية 300 ريال + شهادة',
      third: 'جائزة نقدية 200 ريال + شهادة'
    },
    rules: [
      'يجب اجتياز الفحص الطبي قبل المشاركة',
      'الالتزام بتعليمات المدرب',
      'عدم تجاوز الحد الأقصى للمحاولات',
      'الإحماء الجيد قبل البدء'
    ],
    criteria: [
      { name: 'قوة الذراعين', weight: 35, description: 'اختبار قوة عضلات الذراعين' },
      { name: 'قوة الساقين', weight: 35, description: 'اختبار قوة عضلات الساقين' },
      { name: 'قوة الجذع', weight: 30, description: 'اختبار قوة عضلات الجذع' }
    ],
    createdBy: 'المدير',
    createdDate: '2024-10-10'
  }
];

const competitionTemplates: CompetitionTemplate[] = [
  {
    id: 'template_1',
    name: 'مسابقة اللياقة البدنية',
    description: 'قالب لمسابقات اللياقة البدنية العامة',
    category: 'fitness',
    defaultRules: [
      'إحضار الملابس الرياضية المناسبة',
      'الالتزام بتعليمات المشرف',
      'عدم استخدام مواد محظورة',
      'الإحماء قبل البدء'
    ],
    defaultCriteria: [
      { name: 'القوة', weight: 30, description: 'قوة العضلات' },
      { name: 'التحمل', weight: 25, description: 'التحمل القلبي' },
      { name: 'المرونة', weight: 25, description: 'مرونة المفاصل' },
      { name: 'التوازن', weight: 20, description: 'القدرة على التوازن' }
    ]
  },
  {
    id: 'template_2',
    name: 'مسابقة رياضية جماعية',
    description: 'قالب للمسابقات الرياضية الجماعية',
    category: 'sports',
    defaultRules: [
      'تشكيل فرق متوازنة',
      'احترام الحكم والقوانين',
      'الروح الرياضية العالية',
      'عدم العنف أو السلوك غير اللائق'
    ],
    defaultCriteria: [
      { name: 'الأداء الفني', weight: 40, description: 'مستوى الأداء الفني' },
      { name: 'الروح الرياضية', weight: 30, description: 'السلوك الرياضي' },
      { name: 'التعاون', weight: 20, description: 'العمل الجماعي' },
      { name: 'الانضباط', weight: 10, description: 'الالتزام بالقوانين' }
    ]
  }
];

export function CompetitionsManagement() {
  const [competitions, setCompetitions] = useState<Competition[]>(mockCompetitions);
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('الكل');
  const [filterCategory, setFilterCategory] = useState('الكل');
  const [searchTerm, setSearchTerm] = useState('');

  const statusOptions = ['الكل', 'مسودة', 'نشطة', 'مكتملة', 'ملغية'];
  const categoryOptions = ['الكل', 'لياقة بدنية', 'رياضات', 'تحمل', 'قوة', 'مرونة'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fitness': return <Activity className="h-4 w-4" />;
      case 'sports': return <Trophy className="h-4 w-4" />;
      case 'endurance': return <Target className="h-4 w-4" />;
      case 'strength': return <Award className="h-4 w-4" />;
      case 'flexibility': return <Star className="h-4 w-4" />;
      default: return <Trophy className="h-4 w-4" />;
    }
  };

  const filteredCompetitions = competitions.filter(comp => {
    const matchesSearch = comp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comp.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'الكل' || 
                         (filterStatus === 'مسودة' && comp.status === 'draft') ||
                         (filterStatus === 'نشطة' && comp.status === 'active') ||
                         (filterStatus === 'مكتملة' && comp.status === 'completed') ||
                         (filterStatus === 'ملغية' && comp.status === 'cancelled');
    const matchesCategory = filterCategory === 'الكل' ||
                           (filterCategory === 'لياقة بدنية' && comp.category === 'fitness') ||
                           (filterCategory === 'رياضات' && comp.category === 'sports') ||
                           (filterCategory === 'تحمل' && comp.category === 'endurance') ||
                           (filterCategory === 'قوة' && comp.category === 'strength') ||
                           (filterCategory === 'مرونة' && comp.category === 'flexibility');
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleStatusChange = (competitionId: string, newStatus: Competition['status']) => {
    setCompetitions(prev => prev.map(comp => 
      comp.id === competitionId ? { ...comp, status: newStatus } : comp
    ));
  };

  const handleDeleteCompetition = (competitionId: string) => {
    if (confirm('هل أنت متأكد من حذف هذه المسابقة؟')) {
      setCompetitions(prev => prev.filter(comp => comp.id !== competitionId));
    }
  };

  const renderCreateForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            إنشاء مسابقة جديدة
          </CardTitle>
          <CardDescription>
            قم بإنشاء مسابقة جديدة أو استخدم أحد القوالب الجاهزة
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="comp-title">عنوان المسابقة</Label>
              <Input id="comp-title" placeholder="عنوان المسابقة..." />
            </div>
            <div>
              <Label htmlFor="comp-category">الفئة</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الفئة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fitness">لياقة بدنية</SelectItem>
                  <SelectItem value="sports">رياضات</SelectItem>
                  <SelectItem value="endurance">تحمل</SelectItem>
                  <SelectItem value="strength">قوة</SelectItem>
                  <SelectItem value="flexibility">مرونة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="comp-description">وصف المسابقة</Label>
            <Textarea 
              id="comp-description" 
              placeholder="وصف مفصل للمسابقة..."
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="comp-type">نوع المسابقة</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر النوع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">فردية</SelectItem>
                  <SelectItem value="team">جماعية</SelectItem>
                  <SelectItem value="class">بين الصفوف</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="start-date">تاريخ البداية</Label>
              <Input id="start-date" type="date" />
            </div>
            <div>
              <Label htmlFor="end-date">تاريخ النهاية</Label>
              <Input id="end-date" type="date" />
            </div>
          </div>

          {/* Template Selection */}
          <div>
            <Label>اختيار القالب (اختياري)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {competitionTemplates.map((template) => (
                <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">{template.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {template.defaultCriteria.slice(0, 3).map((criteria, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {criteria.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button className="flex-1">
              <Trophy className="h-4 w-4 mr-2" />
              إنشاء المسابقة
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

  const renderCompetitionDetails = () => {
    if (!selectedCompetition) return null;

    return (
      <div className="space-y-6">
        {/* Competition Header */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  {getCategoryIcon(selectedCompetition.category)}
                  {selectedCompetition.title}
                </CardTitle>
                <CardDescription className="mt-2">
                  {selectedCompetition.description}
                </CardDescription>
                <div className="flex items-center gap-2 mt-3">
                  <Badge className={getStatusColor(selectedCompetition.status)}>
                    {selectedCompetition.status === 'draft' && 'مسودة'}
                    {selectedCompetition.status === 'active' && 'نشطة'}
                    {selectedCompetition.status === 'completed' && 'مكتملة'}
                    {selectedCompetition.status === 'cancelled' && 'ملغية'}
                  </Badge>
                  <Badge variant="outline">
                    {selectedCompetition.type === 'individual' && 'فردية'}
                    {selectedCompetition.type === 'team' && 'جماعية'}
                    {selectedCompetition.type === 'class' && 'بين الصفوف'}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4 mr-1" />
                  تعديل
                </Button>
                <Button size="sm" variant="outline" onClick={() => setSelectedCompetition(null)}>
                  ← العودة
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="participants">المشاركون</TabsTrigger>
            <TabsTrigger value="rules">القوانين</TabsTrigger>
            <TabsTrigger value="results">النتائج</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Competition Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{selectedCompetition.participants}</div>
                  <div className="text-sm text-gray-500">مشارك</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-lg font-bold">{selectedCompetition.startDate}</div>
                  <div className="text-sm text-gray-500">تاريخ البداية</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-lg font-bold">{selectedCompetition.endDate}</div>
                  <div className="text-sm text-gray-500">تاريخ النهاية</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Trophy className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <div className="text-lg font-bold">{selectedCompetition.results?.length || 0}</div>
                  <div className="text-sm text-gray-500">نتائج</div>
                </CardContent>
              </Card>
            </div>

            {/* Prizes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Medal className="h-5 w-5" />
                  الجوائز
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <Medal className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <h4 className="font-medium">المركز الأول</h4>
                    <p className="text-sm text-gray-600">{selectedCompetition.prizes.first}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Medal className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                    <h4 className="font-medium">المركز الثاني</h4>
                    <p className="text-sm text-gray-600">{selectedCompetition.prizes.second}</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <Medal className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <h4 className="font-medium">المركز الثالث</h4>
                    <p className="text-sm text-gray-600">{selectedCompetition.prizes.third}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Competition Actions */}
            <Card>
              <CardHeader>
                <CardTitle>إدارة المسابقة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {selectedCompetition.status === 'draft' && (
                    <Button 
                      className="h-16 flex-col gap-2"
                      onClick={() => handleStatusChange(selectedCompetition.id, 'active')}
                    >
                      <Play className="h-6 w-6" />
                      بدء المسابقة
                    </Button>
                  )}
                  {selectedCompetition.status === 'active' && (
                    <Button 
                      variant="outline" 
                      className="h-16 flex-col gap-2"
                      onClick={() => handleStatusChange(selectedCompetition.id, 'completed')}
                    >
                      <CheckCircle className="h-6 w-6" />
                      إنهاء المسابقة
                    </Button>
                  )}
                  <Button variant="outline" className="h-16 flex-col gap-2">
                    <Download className="h-6 w-6" />
                    تصدير النتائج
                  </Button>
                  <Button variant="outline" className="h-16 flex-col gap-2">
                    <Upload className="h-6 w-6" />
                    رفع النتائج
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="h-16 flex-col gap-2"
                    onClick={() => handleDeleteCompetition(selectedCompetition.id)}
                  >
                    <Trash2 className="h-6 w-6" />
                    حذف المسابقة
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="participants" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>قائمة المشاركين</CardTitle>
                <CardDescription>
                  {selectedCompetition.participants} مشارك من أصل {selectedCompetition.maxParticipants || 'غير محدود'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>سيتم عرض قائمة المشاركين هنا</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rules" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>قوانين المسابقة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedCompetition.rules.map((rule, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <p className="text-sm">{rule}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>معايير التقييم</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedCompetition.criteria.map((criteria, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{criteria.name}</h4>
                        <Badge variant="outline">{criteria.weight}%</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{criteria.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            {selectedCompetition.results && selectedCompetition.results.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    نتائج المسابقة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedCompetition.results.map((result, index) => (
                      <div key={result.participantId} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                            result.rank === 1 ? 'bg-yellow-500' :
                            result.rank === 2 ? 'bg-gray-400' :
                            result.rank === 3 ? 'bg-orange-500' : 'bg-blue-500'
                          }`}>
                            {result.rank}
                          </div>
                          <div>
                            <h4 className="font-medium">{result.participantName}</h4>
                            <p className="text-sm text-gray-500">{result.class}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{result.score}</div>
                          <div className="text-sm text-gray-500">نقطة</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50 text-gray-500" />
                  <p className="text-gray-500">لا توجد نتائج متاحة حتى الآن</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  if (selectedCompetition) {
    return renderCompetitionDetails();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Trophy className="h-6 w-6" />
            إدارة المسابقات
          </CardTitle>
          <CardDescription className="text-yellow-100">
            إدارة كاملة للمسابقات الرياضية والأنشطة التنافسية
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{competitions.length}</div>
                <div className="text-sm text-yellow-100">إجمالي المسابقات</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {competitions.filter(c => c.status === 'active').length}
                </div>
                <div className="text-sm text-yellow-100">مسابقات نشطة</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {competitions.reduce((acc, c) => acc + c.participants, 0)}
                </div>
                <div className="text-sm text-yellow-100">إجمالي المشاركين</div>
              </div>
            </div>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-white text-yellow-600 hover:bg-gray-100"
            >
              <Plus className="h-4 w-4 mr-2" />
              إنشاء مسابقة جديدة
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">البحث</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="ابحث في المسابقات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">الحالة</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(status => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">الفئة</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map(category => (
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
            <CardTitle className="text-sm">إجراءات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-1" />
                تصدير
              </Button>
              <Button size="sm" variant="outline">
                <BarChart3 className="h-4 w-4 mr-1" />
                إحصائيات
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Competitions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCompetitions.map((competition) => (
          <Card key={competition.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(competition.category)}
                  <Badge className={getStatusColor(competition.status)}>
                    {competition.status === 'draft' && 'مسودة'}
                    {competition.status === 'active' && 'نشطة'}
                    {competition.status === 'completed' && 'مكتملة'}
                    {competition.status === 'cancelled' && 'ملغية'}
                  </Badge>
                </div>
                <Badge variant="outline">
                  {competition.type === 'individual' && 'فردية'}
                  {competition.type === 'team' && 'جماعية'}
                  {competition.type === 'class' && 'بين الصفوف'}
                </Badge>
              </div>
              
              <CardTitle className="text-lg">{competition.title}</CardTitle>
              <CardDescription>{competition.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Competition Stats */}
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <div className="text-lg font-bold text-blue-600">{competition.participants}</div>
                  <div className="text-xs text-gray-500">مشارك</div>
                </div>
                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <div className="text-lg font-bold text-green-600">
                    {competition.results?.length || 0}
                  </div>
                  <div className="text-xs text-gray-500">نتائج</div>
                </div>
              </div>

              {/* Dates */}
              <div className="text-sm text-gray-500 space-y-1">
                <div>البداية: {competition.startDate}</div>
                <div>النهاية: {competition.endDate}</div>
                <div>المنشئ: {competition.createdBy}</div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setSelectedCompetition(competition)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  إدارة المسابقة
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => handleDeleteCompetition(competition.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Form Modal */}
      {showCreateForm && renderCreateForm()}
    </div>
  );
}