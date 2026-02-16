import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy,
  Plus,
  Users,
  User,
  Calendar as CalendarIcon,
  Target,
  Award,
  Clock,
  TrendingUp,
  Edit,
  Trash2,
  Eye,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  Filter,
  Search,
  BarChart3,
  Star,
  Medal
} from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface Challenge {
  id: string;
  name: string;
  type: 'فردي' | 'جماعي' | 'تنافسي';
  scope: 'صفي' | 'مدرسي' | 'بين المدارس';
  category: string;
  description: string;
  duration: number;
  difficulty: 'مبتدئ' | 'متوسط' | 'متقدم';
  points: number;
  maxParticipants?: number;
  currentParticipants: number;
  status: 'مسودة' | 'نشط' | 'مكتمل' | 'ملغي';
  startDate: Date;
  endDate: Date;
  objectives: string[];
  rewards: string[];
  requirements: string[];
  createdBy: string;
  assignedClasses: string[];
  participants: {
    studentId: string;
    studentName: string;
    progress: number;
    completed: boolean;
    score: number;
  }[];
  leaderboard: {
    rank: number;
    studentName: string;
    score: number;
    progress: number;
  }[];
}

const mockChallenges: Challenge[] = [
  {
    id: 'challenge_1',
    name: 'تحدي اللياقة البدنية الشامل',
    type: 'فردي',
    scope: 'صفي',
    category: 'لياقة عامة',
    description: 'تحدي مدته أسبوعان لتحسين جميع عناصر اللياقة البدنية',
    duration: 14,
    difficulty: 'متوسط',
    points: 500,
    currentParticipants: 24,
    status: 'نشط',
    startDate: new Date(2024, 9, 10),
    endDate: new Date(2024, 9, 24),
    objectives: [
      'تحسين القوة العضلية بنسبة 15%',
      'زيادة التحمل القلبي الوعائي',
      'تطوير المرونة والحركية',
      'بناء عادات رياضية يومية'
    ],
    rewards: ['شهادة إنجاز', 'شارة اللياقة الذهبية', '100 نقطة إضافية'],
    requirements: ['الالتزام بالتمرين اليومي', 'تسجيل النتائج', 'إكمال التقييمات'],
    createdBy: 'الأستاذ محمد الصالح',
    assignedClasses: ['class_1'],
    participants: [
      { studentId: 'student_1', studentName: 'أحمد محمد علي', progress: 85, completed: false, score: 425 },
      { studentId: 'student_2', studentName: 'فاطمة الزهراء', progress: 92, completed: false, score: 460 },
      { studentId: 'student_3', studentName: 'محمد الأمين', progress: 45, completed: false, score: 225 }
    ],
    leaderboard: [
      { rank: 1, studentName: 'فاطمة الزهراء', score: 460, progress: 92 },
      { rank: 2, studentName: 'أحمد محمد علي', score: 425, progress: 85 },
      { rank: 3, studentName: 'محمد الأمين', score: 225, progress: 45 }
    ]
  },
  {
    id: 'challenge_2',
    name: 'مسابقة الفريق الأسبوعية',
    type: 'جماعي',
    scope: 'مدرسي',
    category: 'عمل جماعي',
    description: 'مسابقة بين الصفوف تتطلب التعاون والعمل الجماعي',
    duration: 7,
    difficulty: 'مبتدئ',
    points: 300,
    maxParticipants: 120,
    currentParticipants: 89,
    status: 'نشط',
    startDate: new Date(2024, 9, 15),
    endDate: new Date(2024, 9, 22),
    objectives: [
      'تعزيز روح الفريق',
      'تطوير مهارات التواصل',
      'تحقيق أهداف جماعية',
      'بناء الثقة المتبادلة'
    ],
    rewards: ['كأس الفريق المتميز', 'شهادات جماعية', 'رحلة ترفيهية'],
    requirements: ['تكوين فريق من 4-6 أعضاء', 'تحديد قائد الفريق', 'المشاركة اليومية'],
    createdBy: 'الأستاذ محمد الصالح',
    assignedClasses: ['class_1', 'class_2', 'class_3'],
    participants: [],
    leaderboard: []
  }
];

export function ChallengeCreation() {
  const [challenges, setChallenges] = useState<Challenge[]>(mockChallenges);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [filterStatus, setFilterStatus] = useState('الكل');
  const [filterScope, setFilterScope] = useState('الكل');
  const [searchTerm, setSearchTerm] = useState('');

  const statuses = ['الكل', 'مسودة', 'نشط', 'مكتمل', 'ملغي'];
  const scopes = ['الكل', 'صفي', 'مدرسي', 'بين المدارس'];

  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'الكل' || challenge.status === filterStatus;
    const matchesScope = filterScope === 'الكل' || challenge.scope === filterScope;
    return matchesSearch && matchesStatus && matchesScope;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'نشط': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
      case 'مكتمل': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200';
      case 'مسودة': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200';
      case 'ملغي': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
    }
  };

  const getScopeColor = (scope: string) => {
    switch (scope) {
      case 'صفي': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200';
      case 'مدرسي': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200';
      case 'بين المدارس': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'فردي': return <User className="h-4 w-4" />;
      case 'جماعي': return <Users className="h-4 w-4" />;
      case 'تنافسي': return <Trophy className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const renderCreateForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            إنشاء تحدي جديد
          </CardTitle>
          <CardDescription>
            قم بإنشاء تحدي مخصص لطلابك
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="challenge-name">اسم التحدي</Label>
              <Input id="challenge-name" placeholder="اسم التحدي..." />
            </div>
            <div>
              <Label htmlFor="challenge-category">الفئة</Label>
              <Input id="challenge-category" placeholder="لياقة عامة، قوة، تحمل..." />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="challenge-type">النوع</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر النوع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="فردي">فردي</SelectItem>
                  <SelectItem value="جماعي">جماعي</SelectItem>
                  <SelectItem value="تنافسي">تنافسي</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="challenge-scope">النطاق</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر النطاق" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="صفي">صفي</SelectItem>
                  <SelectItem value="مدرسي">مدرسي</SelectItem>
                  <SelectItem value="بين المدارس">بين المدارس</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="challenge-difficulty">الصعوبة</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الصعوبة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="مبتدئ">مبتدئ</SelectItem>
                  <SelectItem value="متوسط">متوسط</SelectItem>
                  <SelectItem value="متقدم">متقدم</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="challenge-description">الوصف</Label>
            <Textarea 
              id="challenge-description" 
              placeholder="وصف مفصل للتحدي..."
              className="min-h-[100px]"
            />
          </div>

          {/* Duration and Points */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="challenge-duration">المدة (أيام)</Label>
              <Input id="challenge-duration" type="number" placeholder="7" />
            </div>
            <div>
              <Label htmlFor="challenge-points">النقاط</Label>
              <Input id="challenge-points" type="number" placeholder="300" />
            </div>
            <div>
              <Label htmlFor="max-participants">الحد الأقصى للمشاركين</Label>
              <Input id="max-participants" type="number" placeholder="50" />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>تاريخ البداية</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    اختر تاريخ البداية
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>تاريخ النهاية</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    اختر تاريخ النهاية
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Objectives */}
          <div>
            <Label htmlFor="challenge-objectives">الأهداف</Label>
            <Textarea 
              id="challenge-objectives" 
              placeholder="اكتب كل هدف في سطر منفصل..."
              className="min-h-[100px]"
            />
          </div>

          {/* Rewards */}
          <div>
            <Label htmlFor="challenge-rewards">الجوائز والمكافآت</Label>
            <Textarea 
              id="challenge-rewards" 
              placeholder="اكتب كل جائزة في سطر منفصل..."
              className="min-h-[80px]"
            />
          </div>

          {/* Requirements */}
          <div>
            <Label htmlFor="challenge-requirements">متطلبات المشاركة</Label>
            <Textarea 
              id="challenge-requirements" 
              placeholder="اكتب كل متطلب في سطر منفصل..."
              className="min-h-[80px]"
            />
          </div>

          {/* Assign to Classes */}
          <div>
            <Label htmlFor="assign-classes">تعيين للصفوف</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="اختر الصفوف..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="class_1">السنة الثالثة متوسط - أ</SelectItem>
                <SelectItem value="class_2">السنة الثالثة متوسط - ب</SelectItem>
                <SelectItem value="class_3">السنة الثانية متوسط - أ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button className="flex-1">
              <Trophy className="h-4 w-4 mr-2" />
              إنشاء التحدي
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowCreateForm(false)}
              className="flex-1"
            >
              إلغاء
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderChallengeDetails = () => {
    if (!selectedChallenge) return null;

    return (
      <div className="space-y-6">
        {/* Challenge Header */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  {getTypeIcon(selectedChallenge.type)}
                  {selectedChallenge.name}
                </CardTitle>
                <CardDescription className="mt-2">
                  {selectedChallenge.description}
                </CardDescription>
                <div className="flex items-center gap-2 mt-3">
                  <Badge className={getStatusColor(selectedChallenge.status)}>
                    {selectedChallenge.status}
                  </Badge>
                  <Badge className={getScopeColor(selectedChallenge.scope)}>
                    {selectedChallenge.scope}
                  </Badge>
                  <Badge variant="outline">
                    {selectedChallenge.category}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4 mr-1" />
                  تعديل
                </Button>
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-1" />
                  معاينة
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Challenge Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{selectedChallenge.currentParticipants}</div>
              <div className="text-sm text-gray-500">مشارك</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{selectedChallenge.duration}</div>
              <div className="text-sm text-gray-500">يوم</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{selectedChallenge.points}</div>
              <div className="text-sm text-gray-500">نقطة</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {selectedChallenge.participants.length > 0 
                  ? Math.round(selectedChallenge.participants.reduce((acc, p) => acc + p.progress, 0) / selectedChallenge.participants.length)
                  : 0}%
              </div>
              <div className="text-sm text-gray-500">متوسط التقدم</div>
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard */}
        {selectedChallenge.leaderboard.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Medal className="h-5 w-5 text-yellow-500" />
                لوحة المتصدرين
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedChallenge.leaderboard.map((entry) => (
                  <div key={entry.rank} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        entry.rank === 1 ? 'bg-yellow-500 text-white' :
                        entry.rank === 2 ? 'bg-gray-400 text-white' :
                        entry.rank === 3 ? 'bg-orange-500 text-white' :
                        'bg-gray-200 text-gray-700'
                      }`}>
                        {entry.rank}
                      </div>
                      <div>
                        <h4 className="font-medium">{entry.studentName}</h4>
                        <p className="text-sm text-gray-500">{entry.progress}% مكتمل</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{entry.score}</div>
                      <div className="text-sm text-gray-500">نقطة</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Participants Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              تقدم المشاركين
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedChallenge.participants.map((participant) => (
                <div key={participant.studentId} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{participant.studentName}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{participant.progress}%</span>
                      {participant.completed && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </div>
                  <Progress value={participant.progress} className="h-2" />
                  <div className="text-sm text-gray-500">
                    النقاط: {participant.score}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Trophy className="h-6 w-6" />
            إدارة التحديات والمسابقات
          </CardTitle>
          <CardDescription className="text-purple-100">
            إنشاء وإدارة تحديات تفاعلية لتحفيز الطلاب
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{challenges.length}</div>
                <div className="text-sm text-purple-100">إجمالي التحديات</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {challenges.filter(c => c.status === 'نشط').length}
                </div>
                <div className="text-sm text-purple-100">تحديات نشطة</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {challenges.reduce((acc, c) => acc + c.currentParticipants, 0)}
                </div>
                <div className="text-sm text-purple-100">إجمالي المشاركين</div>
              </div>
            </div>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-white text-purple-600 hover:bg-gray-100"
            >
              <Plus className="h-4 w-4 mr-2" />
              إنشاء تحدي جديد
            </Button>
          </div>
        </CardContent>
      </Card>

      {selectedChallenge ? (
        <div className="space-y-4">
          <Button 
            variant="outline" 
            onClick={() => setSelectedChallenge(null)}
            className="mb-4"
          >
            ← العودة للقائمة
          </Button>
          {renderChallengeDetails()}
        </div>
      ) : (
        <>
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
                    placeholder="ابحث عن تحدي..."
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
                    {statuses.map(status => (
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
                <CardTitle className="text-sm">النطاق</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={filterScope} onValueChange={setFilterScope}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {scopes.map(scope => (
                      <SelectItem key={scope} value={scope}>
                        {scope}
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
                <Button size="sm" variant="outline" className="w-full">
                  <Filter className="h-4 w-4 mr-1" />
                  مرشحات متقدمة
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Challenges Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredChallenges.map((challenge) => (
              <Card key={challenge.id} className="hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(challenge.type)}
                      <Badge className={getStatusColor(challenge.status)}>
                        {challenge.status}
                      </Badge>
                      <Badge className={getScopeColor(challenge.scope)}>
                        {challenge.scope}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-purple-600">{challenge.points}</div>
                      <div className="text-xs text-gray-500">نقطة</div>
                    </div>
                  </div>
                  
                  <CardTitle className="text-lg">{challenge.name}</CardTitle>
                  <CardDescription>{challenge.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Challenge Stats */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                      <Users className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                      <div className="text-sm font-bold">{challenge.currentParticipants}</div>
                      <div className="text-xs text-gray-500">مشارك</div>
                    </div>
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      <Clock className="h-4 w-4 text-green-600 mx-auto mb-1" />
                      <div className="text-sm font-bold">{challenge.duration}</div>
                      <div className="text-xs text-gray-500">يوم</div>
                    </div>
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                      <Award className="h-4 w-4 text-purple-600 mx-auto mb-1" />
                      <div className="text-sm font-bold">{challenge.rewards.length}</div>
                      <div className="text-xs text-gray-500">جائزة</div>
                    </div>
                  </div>

                  {/* Progress for Active Challenges */}
                  {challenge.status === 'نشط' && challenge.participants.length > 0 && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>متوسط التقدم</span>
                        <span>
                          {Math.round(challenge.participants.reduce((acc, p) => acc + p.progress, 0) / challenge.participants.length)}%
                        </span>
                      </div>
                      <Progress 
                        value={challenge.participants.reduce((acc, p) => acc + p.progress, 0) / challenge.participants.length} 
                        className="h-2"
                      />
                    </div>
                  )}

                  {/* Dates */}
                  <div className="text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      <span>
                        {format(challenge.startDate, 'dd/MM/yyyy')} - {format(challenge.endDate, 'dd/MM/yyyy')}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setSelectedChallenge(challenge)}
                    >
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
            ))}
          </div>
        </>
      )}

      {/* Create Form Modal */}
      {showCreateForm && renderCreateForm()}
    </div>
  );
}