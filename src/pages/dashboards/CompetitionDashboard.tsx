import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import {
  Trophy,
  Medal,
  Target,
  Users,
  Calendar,
  MapPin,
  Eye,
  Edit,
  Trash2,
  Plus,
  Send,
  Download,
  Upload,
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Award,
  Flag,
  School,
  Building,
  Globe,
  Filter,
  Search,
  BarChart3,
  FileText,
  Settings,
  Home,
  LogOut,
  User,
  CreditCard,
  Repeat,
  PieChart
} from 'lucide-react';

interface Competition {
  id: string;
  title: string;
  description: string;
  level: 'class' | 'school' | 'province' | 'national';
  category: 'fitness' | 'sports' | 'academic' | 'cultural' | 'health';
  status: 'draft' | 'published' | 'active' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  maxParticipants?: number;
  currentParticipants: number;
  rules: string;
  schedule: CompetitionSchedule[];
  participants: Participant[];
  results: CompetitionResult[];
  organizer: string;
  location?: string;
  province?: string;
  school?: string;
  class?: string;
  prizes: Prize[];
  requirements: string[];
  createdDate: string;
  lastUpdated: string;
}

interface CompetitionSchedule {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'registration' | 'preliminary' | 'semifinal' | 'final' | 'ceremony';
}

interface Participant {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'team';
  school?: string;
  class?: string;
  province?: string;
  registrationDate: string;
  status: 'registered' | 'confirmed' | 'disqualified' | 'withdrawn';
  teamMembers?: string[];
}

interface CompetitionResult {
  id: string;
  participantId: string;
  participantName: string;
  score: number;
  rank: number;
  category?: string;
  notes?: string;
  verifiedBy: string;
  verificationDate: string;
}

interface Prize {
  rank: number;
  title: string;
  description: string;
  value?: number;
  type: 'medal' | 'certificate' | 'trophy' | 'cash' | 'gift';
}

export default function CompetitionDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { t, language } = useTranslation();
  const { user, logout } = useAuth();
  const isRTL = language === 'ar';

  const [competitions, setCompetitions] = useState<Competition[]>([
    {
      id: 'comp_1',
      title: 'بطولة اللياقة البدنية المدرسية - المستوى الوطني',
      description: 'مسابقة شاملة لتقييم اللياقة البدنية للطلاب على مستوى جميع ولايات الوطن',
      level: 'national',
      category: 'fitness',
      status: 'active',
      startDate: '2024-11-01',
      endDate: '2024-11-30',
      registrationDeadline: '2024-10-25',
      maxParticipants: 10000,
      currentParticipants: 7845,
      rules: 'يجب على جميع المشاركين اجتياز الفحص الطبي قبل المشاركة. تشمل المسابقة اختبارات الجري، القوة، والمرونة.',
      schedule: [
        {
          id: 'sched_1',
          title: 'افتتاح التسجيل',
          description: 'بداية فترة التسجيل للمسابقة',
          date: '2024-10-01',
          time: '08:00',
          location: 'منصة إلكترونية',
          type: 'registration'
        },
        {
          id: 'sched_2',
          title: 'التصفيات الأولية',
          description: 'اختبارات التصفية على مستوى المدارس',
          date: '2024-11-01',
          time: '09:00',
          location: 'جميع المدارس المشاركة',
          type: 'preliminary'
        },
        {
          id: 'sched_3',
          title: 'النهائيات الوطنية',
          description: 'المسابقة النهائية بين أفضل المتأهلين',
          date: '2024-11-25',
          time: '10:00',
          location: 'المجمع الأولمبي - الجزائر العاصمة',
          type: 'final'
        }
      ],
      participants: [
        {
          id: 'part_1',
          name: 'أحمد محمد علي',
          email: 'ahmed@school.dz',
          role: 'student',
          school: 'ثانوية الأمير عبد القادر',
          class: 'السنة الثالثة ثانوي',
          province: 'الجزائر',
          registrationDate: '2024-10-05',
          status: 'confirmed'
        },
        {
          id: 'part_2',
          name: 'فاطمة الزهراء',
          email: 'fatima@school.dz',
          role: 'student',
          school: 'متوسطة الشهيد بوضياف',
          class: 'السنة الرابعة متوسط',
          province: 'وهران',
          registrationDate: '2024-10-07',
          status: 'confirmed'
        }
      ],
      results: [
        {
          id: 'result_1',
          participantId: 'part_1',
          participantName: 'أحمد محمد علي',
          score: 95.5,
          rank: 1,
          category: 'ذكور 16-18 سنة',
          notes: 'أداء ممتاز في جميع الاختبارات',
          verifiedBy: 'اللجنة التحكيمية',
          verificationDate: '2024-11-26'
        }
      ],
      organizer: 'وزارة التربية الوطنية',
      location: 'على مستوى الوطن',
      prizes: [
        { rank: 1, title: 'الميدالية الذهبية', description: 'للمركز الأول', type: 'medal' },
        { rank: 2, title: 'الميدالية الفضية', description: 'للمركز الثاني', type: 'medal' },
        { rank: 3, title: 'الميدالية البرونزية', description: 'للمركز الثالث', type: 'medal' }
      ],
      requirements: [
        'شهادة طبية سارية المفعول',
        'موافقة ولي الأمر للقصر',
        'التسجيل عبر المنصة الرسمية'
      ],
      createdDate: '2024-09-15',
      lastUpdated: '2024-10-16'
    },
    {
      id: 'comp_2',
      title: 'مسابقة الجري السريع - مستوى الولاية',
      description: 'مسابقة الجري لمسافة 100 متر للطلاب على مستوى ولاية الجزائر',
      level: 'province',
      category: 'sports',
      status: 'published',
      startDate: '2024-10-20',
      endDate: '2024-10-20',
      registrationDeadline: '2024-10-18',
      maxParticipants: 200,
      currentParticipants: 156,
      rules: 'مسابقة جري لمسافة 100 متر. يُسمح بمحاولة واحدة فقط لكل متسابق.',
      schedule: [
        {
          id: 'sched_4',
          title: 'التسجيل والفحص الطبي',
          description: 'تسجيل المتسابقين والفحص الطبي',
          date: '2024-10-20',
          time: '08:00',
          location: 'الملعب الأولمبي - الجزائر',
          type: 'registration'
        },
        {
          id: 'sched_5',
          title: 'المسابقة النهائية',
          description: 'سباق 100 متر نهائي',
          date: '2024-10-20',
          time: '10:00',
          location: 'الملعب الأولمبي - الجزائر',
          type: 'final'
        }
      ],
      participants: [],
      results: [],
      organizer: 'مديرية التربية لولاية الجزائر',
      location: 'الملعب الأولمبي - الجزائر',
      province: 'الجزائر',
      prizes: [
        { rank: 1, title: 'كأس المركز الأول', description: 'كأس ذهبي + شهادة', type: 'trophy' },
        { rank: 2, title: 'كأس المركز الثاني', description: 'كأس فضي + شهادة', type: 'trophy' },
        { rank: 3, title: 'كأس المركز الثالث', description: 'كأس برونزي + شهادة', type: 'trophy' }
      ],
      requirements: [
        'طالب مسجل في إحدى مدارس الولاية',
        'عمر بين 15-18 سنة',
        'شهادة طبية'
      ],
      createdDate: '2024-09-20',
      lastUpdated: '2024-10-15'
    },
    {
      id: 'comp_3',
      title: 'تحدي اللياقة الصفية - الصف الثالث أ',
      description: 'مسابقة أسبوعية لتحفيز الطلاب على ممارسة الرياضة',
      level: 'class',
      category: 'fitness',
      status: 'completed',
      startDate: '2024-10-01',
      endDate: '2024-10-07',
      registrationDeadline: '2024-09-30',
      currentParticipants: 28,
      rules: 'تحدي أسبوعي لجمع أكبر عدد من الخطوات. يتم احتساب المتوسط اليومي.',
      schedule: [],
      participants: [],
      results: [
        {
          id: 'result_2',
          participantId: 'part_3',
          participantName: 'خالد الأحمد',
          score: 12500,
          rank: 1,
          notes: 'متوسط 12,500 خطوة يومياً',
          verifiedBy: 'الأستاذ محمد',
          verificationDate: '2024-10-08'
        }
      ],
      organizer: 'الأستاذ محمد - معلم التربية البدنية',
      location: 'ثانوية الأمير عبد القادر',
      province: 'الجزائر',
      school: 'ثانوية الأمير عبد القادر',
      class: 'الصف الثالث أ',
      prizes: [
        { rank: 1, title: 'شهادة تقدير', description: 'شهادة للطالب الأكثر نشاطاً', type: 'certificate' }
      ],
      requirements: [
        'طالب في الصف الثالث أ',
        'امتلاك جهاز تتبع الخطوات'
      ],
      createdDate: '2024-09-25',
      lastUpdated: '2024-10-08'
    }
  ]);

  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);
  const [showCompetitionDialog, setShowCompetitionDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [detailsActiveTab, setDetailsActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('الكل');
  const [filterStatus, setFilterStatus] = useState('الكل');

  // تبويبات التنقل
  const navigationTabs = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: Home },
    { id: 'users', label: 'المستخدمين', icon: Users },
    { id: 'content', label: 'المحتوى', icon: FileText },
    { id: 'competitions', label: 'المسابقات', icon: Trophy },
    { id: 'payments', label: 'المدفوعات', icon: CreditCard },
    { id: 'subscriptions', label: 'الاشتراكات', icon: Repeat },
    { id: 'kpi', label: 'مؤشرات الأداء', icon: BarChart3 },
    { id: 'analytics', label: 'التقارير التحليلية', icon: PieChart },
    { id: 'settings', label: 'الإعدادات', icon: Settings }
  ];

  const levelOptions = ['الكل', 'صف', 'مدرسة', 'ولاية', 'وطني'];
  const statusOptions = ['الكل', 'مسودة', 'منشور', 'نشط', 'مكتمل', 'ملغي'];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'class': return 'bg-blue-100 text-blue-800';
      case 'school': return 'bg-green-100 text-green-800';
      case 'province': return 'bg-orange-100 text-orange-800';
      case 'national': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'published': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fitness': return <Target className="h-4 w-4" />;
      case 'sports': return <Trophy className="h-4 w-4" />;
      case 'academic': return <BarChart3 className="h-4 w-4" />;
      case 'cultural': return <Award className="h-4 w-4" />;
      case 'health': return <Medal className="h-4 w-4" />;
      default: return <Trophy className="h-4 w-4" />;
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'class': return <Users className="h-4 w-4" />;
      case 'school': return <School className="h-4 w-4" />;
      case 'province': return <Building className="h-4 w-4" />;
      case 'national': return <Globe className="h-4 w-4" />;
      default: return <Trophy className="h-4 w-4" />;
    }
  };

  const filteredCompetitions = competitions.filter(comp => {
    const matchesSearch = comp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLevel = filterLevel === 'الكل' ||
      (filterLevel === 'صف' && comp.level === 'class') ||
      (filterLevel === 'مدرسة' && comp.level === 'school') ||
      (filterLevel === 'ولاية' && comp.level === 'province') ||
      (filterLevel === 'وطني' && comp.level === 'national');

    const matchesStatus = filterStatus === 'الكل' ||
      (filterStatus === 'مسودة' && comp.status === 'draft') ||
      (filterStatus === 'منشور' && comp.status === 'published') ||
      (filterStatus === 'نشط' && comp.status === 'active') ||
      (filterStatus === 'مكتمل' && comp.status === 'completed') ||
      (filterStatus === 'ملغي' && comp.status === 'cancelled');

    return matchesSearch && matchesLevel && matchesStatus;
  });

  const handlePublishResults = (competitionId: string) => {
    setCompetitions(prev => prev.map(comp =>
      comp.id === competitionId
        ? { ...comp, status: 'completed' as const, lastUpdated: new Date().toISOString() }
        : comp
    ));
  };

  const handleCancelCompetition = (competitionId: string) => {
    setCompetitions(prev => prev.map(comp =>
      comp.id === competitionId
        ? { ...comp, status: 'cancelled' as const, lastUpdated: new Date().toISOString() }
        : comp
    ));
  };

  const handleSendNotification = (competitionId: string) => {
    console.log(`Sending notification for competition ${competitionId}`);
  };

  const exportResults = (competition: Competition, format: 'pdf' | 'csv') => {
    console.log(`Exporting ${format.toUpperCase()} for competition ${competition.id}`);
  };

  const totalCompetitions = competitions.length;
  const activeCompetitions = competitions.filter(c => c.status === 'active').length;
  const completedCompetitions = competitions.filter(c => c.status === 'completed').length;
  const totalParticipants = competitions.reduce((acc, c) => acc + c.currentParticipants, 0);

  // Placeholder render functions for new sections
  const renderUserManagement = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Users className="h-6 w-6" />
            إدارة المستخدمين
          </CardTitle>
          <CardDescription className="text-blue-100">
            إدارة حسابات المستخدمين، الصلاحيات، والأدوار
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
          <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="font-bold text-lg mb-2">قائمة المستخدمين</h3>
          <p className="text-sm text-gray-500">عرض وتعديل جميع المستخدمين</p>
        </Card>
        <Card className="p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
          <div className="bg-indigo-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <User className="h-8 w-8 text-indigo-600" />
          </div>
          <h3 className="font-bold text-lg mb-2">إدارة الأدوار</h3>
          <p className="text-sm text-gray-500">تعيين الصلاحيات والأذونات</p>
        </Card>
        <Card className="p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
          <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Settings className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="font-bold text-lg mb-2">طلبات التسجيل</h3>
          <p className="text-sm text-gray-500">مراجعة طلبات الانضمام الجديدة</p>
        </Card>
      </div>
    </div>
  );

  const renderContentManagement = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <FileText className="h-6 w-6" />
            إدارة المحتوى
          </CardTitle>
          <CardDescription className="text-emerald-100">
            إدارة المقالات، الفيديوهات، والموارد التعليمية
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="p-8 text-center border-2 border-dashed border-gray-300 rounded-lg">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">محتوى المكتبة الرقمية</h3>
        <p className="text-gray-500 mt-1">سيتم عرض أدوات إدارة المحتوى هنا</p>
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-violet-600 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <CreditCard className="h-6 w-6" />
            المدفوعات والمحفظة
          </CardTitle>
          <CardDescription className="text-violet-100">
            سجل العمليات المالية والمدفوعات
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="p-8 text-center border-2 border-dashed border-gray-300 rounded-lg">
        <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">نظام المدفوعات</h3>
        <p className="text-gray-500 mt-1">سيتم عرض تقارير المدفوعات هنا</p>
      </div>
    </div>
  );

  const renderSubscriptions = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-orange-600 to-amber-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Repeat className="h-6 w-6" />
            إدارة الاشتراكات
          </CardTitle>
          <CardDescription className="text-orange-100">
            الباقات، التجديد، والمشتركين النشطين
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="p-8 text-center border-2 border-dashed border-gray-300 rounded-lg">
        <Repeat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">خطط الاشتراك</h3>
        <p className="text-gray-500 mt-1">سيتم عرض إدارة الاشتراكات هنا</p>
      </div>
    </div>
  );

  const renderKPIs = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-pink-600 to-rose-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            لوحات مؤشرات الأداء (KPIs)
          </CardTitle>
          <CardDescription className="text-pink-100">
            متابعة الأداء والنمو والإحصائيات الحيوية
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="h-40 flex items-center justify-center bg-gray-50">
            <span className="text-gray-400">Chart Placeholder {i}</span>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <PieChart className="h-6 w-6" />
            التقارير التحليلية
          </CardTitle>
          <CardDescription className="text-cyan-100">
            تحليلات معمقة للبيانات والاتجاهات
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="p-8 text-center border-2 border-dashed border-gray-300 rounded-lg">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">مركز التقارير</h3>
        <p className="text-gray-500 mt-1">سيتم عرض أدوات التحليل المتقدمة هنا</p>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
            <Trophy className="h-6 w-6" />
            نظام إدارة المسابقات والتحديات
          </CardTitle>
          <CardDescription className="text-yellow-100">
            إدارة شاملة للمسابقات على جميع المستويات: صف، مدرسة، ولاية، وطني
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
            <div className="text-center p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-bold">{totalCompetitions}</div>
              <div className="text-xs sm:text-sm text-yellow-50">إجمالي المسابقات</div>
            </div>
            <div className="text-center p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-bold">{activeCompetitions}</div>
              <div className="text-xs sm:text-sm text-yellow-50">مسابقة نشطة</div>
            </div>
            <div className="text-center p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-bold">{completedCompetitions}</div>
              <div className="text-xs sm:text-sm text-yellow-50">مسابقة مكتملة</div>
            </div>
            <div className="text-center p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-bold">{totalParticipants.toLocaleString()}</div>
              <div className="text-xs sm:text-sm text-yellow-50">إجمالي المشاركين</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
        <Card className="shadow-sm border-gray-200/60 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-gray-700">البحث</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="ابحث في المسابقات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200/60 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-gray-700">المستوى</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger className="bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {levelOptions.map(level => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200/60 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-gray-700">الحالة</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="bg-white">
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

        <Card className="shadow-sm border-gray-200/60 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-gray-700">إضافة مسابقة</CardTitle>
          </CardHeader>
          <CardContent>
            <Dialog open={showCompetitionDialog} onOpenChange={setShowCompetitionDialog}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>إنشاء مسابقة جديدة</DialogTitle>
                  <DialogDescription>
                    أدخل تفاصيل المسابقة الجديدة
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="title">عنوان المسابقة</Label>
                    <Input id="title" placeholder="أدخل عنوان المسابقة" />
                  </div>
                  <div>
                    <Label htmlFor="level">المستوى</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المستوى" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="class">صف</SelectItem>
                        <SelectItem value="school">مدرسة</SelectItem>
                        <SelectItem value="province">ولاية</SelectItem>
                        <SelectItem value="national">وطني</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="category">الفئة</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الفئة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fitness">لياقة بدنية</SelectItem>
                        <SelectItem value="sports">رياضة</SelectItem>
                        <SelectItem value="academic">أكاديمية</SelectItem>
                        <SelectItem value="cultural">ثقافية</SelectItem>
                        <SelectItem value="health">صحية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="startDate">تاريخ البداية</Label>
                    <Input id="startDate" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="endDate">تاريخ النهاية</Label>
                    <Input id="endDate" type="date" />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="description">الوصف</Label>
                    <Textarea id="description" placeholder="وصف المسابقة" />
                  </div>
                  <div className="col-span-2 flex gap-2">
                    <Button className="flex-1">إنشاء المسابقة</Button>
                    <Button variant="outline" onClick={() => setShowCompetitionDialog(false)}>
                      إلغاء
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      {/* Competitions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {filteredCompetitions.map((competition) => (
          <Card key={competition.id} className="hover:shadow-lg transition-all duration-300 border-gray-200/60 hover:border-yellow-500/50 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    {getCategoryIcon(competition.category)}
                  </div>
                  <Badge className={getLevelColor(competition.level)} variant="secondary">
                    {competition.level === 'class' && 'صف'}
                    {competition.level === 'school' && 'مدرسة'}
                    {competition.level === 'province' && 'ولاية'}
                    {competition.level === 'national' && 'وطني'}
                  </Badge>
                </div>
                <Badge className={getStatusColor(competition.status)} size="sm">
                  {competition.status === 'draft' && 'مسودة'}
                  {competition.status === 'published' && 'منشور'}
                  {competition.status === 'active' && 'نشط'}
                  {competition.status === 'completed' && 'مكتمل'}
                  {competition.status === 'cancelled' && 'ملغي'}
                </Badge>
              </div>

              <h4 className="font-medium text-sm sm:text-lg mb-2 line-clamp-2">{competition.title}</h4>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">
                {competition.description}
              </p>

              <div className="space-y-2 text-xs sm:text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  <span className="truncate">{competition.startDate} - {competition.endDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-3 w-3" />
                  <span>{competition.currentParticipants} مشارك</span>
                  {competition.maxParticipants && (
                    <span className="text-gray-400">/ {competition.maxParticipants}</span>
                  )}
                </div>
                {competition.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    <span className="line-clamp-1">{competition.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Flag className="h-3 w-3" />
                  <span className="truncate">{competition.organizer}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => {
                    setSelectedCompetition(competition);
                    setShowDetailsDialog(true);
                  }}
                >
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  عرض التفاصيل
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button size="sm" variant="outline" className="text-red-600">
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderCompetitions = () => renderDashboard();
  const renderParticipants = () => renderDashboard();
  const renderResults = () => renderDashboard();
  const renderReports = () => renderDashboard();

  const renderSettings = () => (
    <div className="space-y-4 sm:space-y-6">
      <Card className="bg-gradient-to-r from-gray-600 to-slate-600 text-white">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
            <Settings className="h-6 w-6" />
            إعدادات المسابقات
          </CardTitle>
          <CardDescription className="text-gray-100">
            إدارة إعدادات النظام والمسابقات
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">إعدادات عامة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start" variant="outline">
              <Trophy className="h-4 w-4 mr-2" />
              قوالب المسابقات
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Award className="h-4 w-4 mr-2" />
              إعدادات الجوائز
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="h-4 w-4 mr-2" />
              إدارة المشاركين
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">إعدادات النظام</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start" variant="outline">
              <Bell className="h-4 w-4 mr-2" />
              إعدادات الإشعارات
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              قوالب التقارير
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              إعدادات التصدير
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'users': return renderUserManagement();
      case 'content': return renderContentManagement();
      case 'competitions': return renderCompetitions();
      case 'payments': return renderPayments();
      case 'subscriptions': return renderSubscriptions();
      case 'kpi': return renderKPIs();
      case 'analytics': return renderAnalytics();
      case 'participants': return renderParticipants();
      case 'results': return renderResults();
      case 'reports': return renderReports();
      case 'settings': return renderSettings();
      default: return renderDashboard();
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isRTL ? 'rtl' : 'ltr'} relative overflow-hidden`}>
      {/* Blue Sports Background like other interfaces */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/youth_adults_active_bg.png)' }}
        />
        <div className="absolute inset-0 bg-blue-900/30 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/90 via-blue-50/80 to-blue-100/90 dark:from-blue-950/90 dark:via-blue-950/80 dark:to-blue-950/90" />
      </div>

      {/* Top Header */}
      <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center shadow-lg">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                منصة الحركة - الإدارة المركزية
              </h1>
            </div>

            {/* User Info and Controls */}
            <div className="flex items-center gap-4">
              <LanguageSwitcher />

              {/* User Profile */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center shadow-md">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.name}
                  </div>
                  <div className="text-xs text-gray-500">مدير النظام</div>
                </div>
              </div>

              {/* Logout Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-t border-gray-200 dark:border-gray-700 overflow-x-auto">
          <div className="px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-1 rtl:space-x-reverse min-w-max py-2">
              {navigationTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                      transition-colors duration-200 relative
                      ${isActive
                        ? 'border-yellow-600 text-yellow-600 dark:text-yellow-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          {renderContent()}
        </div>
      </main>

      {/* Competition Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          {selectedCompetition && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {getCategoryIcon(selectedCompetition.category)}
                  {selectedCompetition.title}
                </DialogTitle>
                <DialogDescription>
                  {selectedCompetition.description}
                </DialogDescription>
              </DialogHeader>

              <Tabs value={detailsActiveTab} onValueChange={setDetailsActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
                  <TabsTrigger value="schedule">الجدول الزمني</TabsTrigger>
                  <TabsTrigger value="participants">المتسابقون</TabsTrigger>
                  <TabsTrigger value="results">النتائج</TabsTrigger>
                  <TabsTrigger value="management">الإدارة</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">معلومات المسابقة</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">المستوى:</span>
                          <Badge className={getLevelColor(selectedCompetition.level)}>
                            {selectedCompetition.level === 'class' && 'صف'}
                            {selectedCompetition.level === 'school' && 'مدرسة'}
                            {selectedCompetition.level === 'province' && 'ولاية'}
                            {selectedCompetition.level === 'national' && 'وطني'}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">الحالة:</span>
                          <Badge className={getStatusColor(selectedCompetition.status)}>
                            {selectedCompetition.status === 'draft' && 'مسودة'}
                            {selectedCompetition.status === 'published' && 'منشور'}
                            {selectedCompetition.status === 'active' && 'نشط'}
                            {selectedCompetition.status === 'completed' && 'مكتمل'}
                            {selectedCompetition.status === 'cancelled' && 'ملغي'}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">تاريخ البداية:</span>
                          <span>{selectedCompetition.startDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">تاريخ النهاية:</span>
                          <span>{selectedCompetition.endDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">آخر موعد للتسجيل:</span>
                          <span>{selectedCompetition.registrationDeadline}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">المشاركون:</span>
                          <span>
                            {selectedCompetition.currentParticipants}
                            {selectedCompetition.maxParticipants && ` / ${selectedCompetition.maxParticipants}`}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">القوانين والمتطلبات</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <h5 className="font-medium mb-2">قوانين المسابقة:</h5>
                            <p className="text-sm text-gray-600">{selectedCompetition.rules}</p>
                          </div>
                          <div>
                            <h5 className="font-medium mb-2">المتطلبات:</h5>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {selectedCompetition.requirements.map((req, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                  {req}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">الجوائز</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {selectedCompetition.prizes.map((prize, index) => (
                          <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="flex justify-center mb-2">
                              {prize.rank === 1 && <Trophy className="h-8 w-8 text-yellow-500" />}
                              {prize.rank === 2 && <Medal className="h-8 w-8 text-gray-400" />}
                              {prize.rank === 3 && <Award className="h-8 w-8 text-orange-500" />}
                              {prize.rank > 3 && <Star className="h-8 w-8 text-blue-500" />}
                            </div>
                            <h4 className="font-medium">{prize.title}</h4>
                            <p className="text-sm text-gray-600">{prize.description}</p>
                            {prize.value && (
                              <p className="text-sm font-medium text-green-600 mt-1">
                                {prize.value.toLocaleString()} دج
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="schedule" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">الجدول الزمني للمسابقة</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedCompetition.schedule.map((event, index) => (
                          <div key={event.id} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                              <Calendar className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{event.title}</h4>
                              <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {event.date}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {event.time}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {event.location}
                                </span>
                              </div>
                            </div>
                            <Badge variant="outline">
                              {event.type === 'registration' && 'تسجيل'}
                              {event.type === 'preliminary' && 'تصفيات أولية'}
                              {event.type === 'semifinal' && 'نصف نهائي'}
                              {event.type === 'final' && 'نهائي'}
                              {event.type === 'ceremony' && 'حفل ختام'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="participants" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">قائمة المتسابقين</CardTitle>
                      <CardDescription>
                        {selectedCompetition.currentParticipants} مشارك مسجل
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {selectedCompetition.participants.length > 0 ? (
                        <div className="space-y-3">
                          {selectedCompetition.participants.map((participant) => (
                            <div key={participant.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <div>
                                <h4 className="font-medium">{participant.name}</h4>
                                <div className="text-sm text-gray-600">
                                  {participant.school && <span>{participant.school}</span>}
                                  {participant.class && <span> - {participant.class}</span>}
                                  {participant.province && <span> - {participant.province}</span>}
                                </div>
                                <div className="text-xs text-gray-500">
                                  تاريخ التسجيل: {participant.registrationDate}
                                </div>
                              </div>
                              <Badge className={
                                participant.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                  participant.status === 'registered' ? 'bg-blue-100 text-blue-800' :
                                    participant.status === 'disqualified' ? 'bg-red-100 text-red-800' :
                                      'bg-gray-100 text-gray-800'
                              }>
                                {participant.status === 'confirmed' && 'مؤكد'}
                                {participant.status === 'registered' && 'مسجل'}
                                {participant.status === 'disqualified' && 'مستبعد'}
                                {participant.status === 'withdrawn' && 'منسحب'}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>لا يوجد مشاركون مسجلون حتى الآن</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="results" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="text-lg">نتائج المسابقة</CardTitle>
                          <CardDescription>
                            لوحة تقييم النتائج والترتيب النهائي
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => exportResults(selectedCompetition, 'pdf')}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            PDF
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => exportResults(selectedCompetition, 'csv')}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            CSV
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {selectedCompetition.results.length > 0 ? (
                        <div className="space-y-3">
                          {selectedCompetition.results
                            .sort((a, b) => a.rank - b.rank)
                            .map((result) => (
                              <div key={result.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div className="flex items-center gap-4">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${result.rank === 1 ? 'bg-yellow-500' :
                                    result.rank === 2 ? 'bg-gray-400' :
                                      result.rank === 3 ? 'bg-orange-500' : 'bg-blue-500'
                                    }`}>
                                    {result.rank}
                                  </div>
                                  <div>
                                    <h4 className="font-medium">{result.participantName}</h4>
                                    {result.category && (
                                      <div className="text-sm text-gray-600">{result.category}</div>
                                    )}
                                    {result.notes && (
                                      <div className="text-xs text-gray-500">{result.notes}</div>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-green-600">{result.score}</div>
                                  <div className="text-xs text-gray-500">
                                    تم التحقق بواسطة: {result.verifiedBy}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {result.verificationDate}
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>لم يتم نشر النتائج بعد</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="management" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">أزرار الإدارة</CardTitle>
                      <CardDescription>
                        إدارة المسابقة والتحكم في الإجراءات
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button
                          className="h-20 flex-col gap-2"
                          onClick={() => handlePublishResults(selectedCompetition.id)}
                          disabled={selectedCompetition.status === 'completed'}
                        >
                          <CheckCircle className="h-6 w-6" />
                          نشر النتائج
                        </Button>

                        <Button
                          variant="outline"
                          className="h-20 flex-col gap-2"
                          onClick={() => handleSendNotification(selectedCompetition.id)}
                        >
                          <Bell className="h-6 w-6" />
                          إرسال إشعار
                        </Button>

                        <Button
                          variant="outline"
                          className="h-20 flex-col gap-2"
                        >
                          <Edit className="h-6 w-6" />
                          تعديل المسابقة
                        </Button>

                        <Button
                          variant="outline"
                          className="h-20 flex-col gap-2 text-red-600 hover:text-red-700"
                          onClick={() => handleCancelCompetition(selectedCompetition.id)}
                          disabled={selectedCompetition.status === 'cancelled'}
                        >
                          <XCircle className="h-6 w-6" />
                          إلغاء المسابقة
                        </Button>
                      </div>

                      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                          معلومات إضافية
                        </h4>
                        <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                          <div>تاريخ الإنشاء: {selectedCompetition.createdDate}</div>
                          <div>آخر تحديث: {selectedCompetition.lastUpdated}</div>
                          <div>المنظم: {selectedCompetition.organizer}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}