import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Trophy, 
  Medal, 
  Crown, 
  Users, 
  Calendar, 
  MapPin,
  Star,
  Award,
  Target,
  Zap,
  Plus,
  Eye,
  UserPlus,
  Clock,
  CheckCircle,
  AlertCircle,
  Gift
} from 'lucide-react';

interface Competition {
  id: string;
  title: string;
  description: string;
  type: 'national' | 'regional' | 'local' | 'community';
  category: 'individual' | 'team' | 'school';
  environment: 'school' | 'community' | 'both';
  startDate: Date;
  endDate: Date;
  registrationDeadline: Date;
  maxParticipants?: number;
  currentParticipants: number;
  status: 'upcoming' | 'registration' | 'active' | 'completed';
  prizes: Prize[];
  requirements: string[];
  organizer: string;
  location?: string;
  isOfficial: boolean;
  participants: Participant[];
  leaderboard: LeaderboardEntry[];
}

interface Prize {
  position: number;
  title: string;
  description: string;
  value?: string;
  icon: string;
}

interface Participant {
  id: string;
  name: string;
  userType: string;
  school?: string;
  registeredAt: Date;
  status: 'registered' | 'active' | 'completed' | 'disqualified';
}

interface LeaderboardEntry {
  participantId: string;
  participantName: string;
  score: number;
  rank: number;
  completedChallenges: number;
  lastActivity: Date;
}

export const CompetitionSystem: React.FC = () => {
  const { user, environment } = useAuth();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [activeTab, setActiveTab] = useState<'browse' | 'my-competitions' | 'create'>('browse');
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // تحميل المسابقات
  useEffect(() => {
    loadCompetitions();
  }, [environment]);

  const loadCompetitions = () => {
    // محاكاة تحميل المسابقات
    const mockCompetitions: Competition[] = [
      // مسابقات رسمية للمدارس
      {
        id: 'national-fitness-2024',
        title: 'بطولة اللياقة البدنية الوطنية 2024',
        description: 'مسابقة وطنية للتلاميذ في اللياقة البدنية والرياضة المدرسية',
        type: 'national',
        category: 'individual',
        environment: 'school',
        startDate: new Date(2024, 11, 1),
        endDate: new Date(2024, 11, 15),
        registrationDeadline: new Date(2024, 10, 25),
        maxParticipants: 1000,
        currentParticipants: 347,
        status: 'registration',
        organizer: 'وزارة التربية الوطنية',
        location: 'جميع الولايات',
        isOfficial: true,
        prizes: [
          { position: 1, title: 'الميدالية الذهبية', description: 'شهادة تقدير + جائزة مالية', value: '50,000 دج', icon: '🥇' },
          { position: 2, title: 'الميدالية الفضية', description: 'شهادة تقدير + جائزة مالية', value: '30,000 دج', icon: '🥈' },
          { position: 3, title: 'الميدالية البرونزية', description: 'شهادة تقدير + جائزة مالية', value: '20,000 دج', icon: '🥉' }
        ],
        requirements: [
          'تلميذ مسجل في مؤسسة تعليمية',
          'العمر بين 12-18 سنة',
          'موافقة ولي الأمر',
          'شهادة طبية'
        ],
        participants: [],
        leaderboard: []
      },
      
      // مسابقات مجتمعية
      {
        id: 'community-challenge-winter',
        title: 'تحدي الشتاء المجتمعي',
        description: 'مسابقة مفتوحة للشباب والمدربين في تحديات اللياقة الشتوية',
        type: 'community',
        category: 'individual',
        environment: 'community',
        startDate: new Date(2024, 11, 10),
        endDate: new Date(2025, 0, 10),
        registrationDeadline: new Date(2024, 11, 5),
        currentParticipants: 89,
        status: 'registration',
        organizer: 'مجتمع المنصة الذكية',
        isOfficial: false,
        prizes: [
          { position: 1, title: 'بطل التحدي', description: 'شارة خاصة + نقاط إضافية', icon: '👑' },
          { position: 2, title: 'وصيف البطل', description: 'شارة فضية + نقاط', icon: '⭐' },
          { position: 3, title: 'المركز الثالث', description: 'شارة برونزية + نقاط', icon: '🏆' }
        ],
        requirements: [
          'عضوية في المنصة',
          'العمر فوق 16 سنة',
          'إكمال 5 تمارين على الأقل'
        ],
        participants: [],
        leaderboard: []
      },

      // مسابقة مدرسية محلية
      {
        id: 'school-team-challenge',
        title: 'تحدي الفرق المدرسية',
        description: 'مسابقة بين المدارس في تحديات جماعية',
        type: 'regional',
        category: 'team',
        environment: 'school',
        startDate: new Date(2024, 10, 20),
        endDate: new Date(2024, 10, 30),
        registrationDeadline: new Date(2024, 10, 15),
        maxParticipants: 200,
        currentParticipants: 156,
        status: 'active',
        organizer: 'مديرية التربية - الجزائر',
        location: 'ولاية الجزائر',
        isOfficial: true,
        prizes: [
          { position: 1, title: 'المدرسة الأولى', description: 'كأس + شهادات للفريق', icon: '🏆' },
          { position: 2, title: 'المدرسة الثانية', description: 'ميدالية + شهادات', icon: '🥈' },
          { position: 3, title: 'المدرسة الثالثة', description: 'شهادات تقدير', icon: '🥉' }
        ],
        requirements: [
          'فريق من 5-8 تلاميذ',
          'من نفس المؤسسة التعليمية',
          'مشرف من المدرسة'
        ],
        participants: [],
        leaderboard: []
      }
    ];

    // تصفية المسابقات حسب البيئة
    const filteredCompetitions = mockCompetitions.filter(comp => 
      comp.environment === environment || comp.environment === 'both'
    );

    setCompetitions(filteredCompetitions);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      upcoming: 'bg-blue-100 text-blue-800',
      registration: 'bg-green-100 text-green-800',
      active: 'bg-orange-100 text-orange-800',
      completed: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || colors.upcoming;
  };

  const getStatusText = (status: string) => {
    const texts = {
      upcoming: 'قريباً',
      registration: 'التسجيل مفتوح',
      active: 'جارية',
      completed: 'انتهت'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      national: 'bg-red-100 text-red-800',
      regional: 'bg-blue-100 text-blue-800',
      local: 'bg-green-100 text-green-800',
      community: 'bg-purple-100 text-purple-800'
    };
    return colors[type as keyof typeof colors] || colors.local;
  };

  const getTypeText = (type: string) => {
    const texts = {
      national: 'وطنية',
      regional: 'جهوية',
      local: 'محلية',
      community: 'مجتمعية'
    };
    return texts[type as keyof typeof texts] || type;
  };

  const joinCompetition = (competitionId: string) => {
    // محاكاة الانضمام للمسابقة
    setCompetitions(prev => prev.map(comp => 
      comp.id === competitionId 
        ? { ...comp, currentParticipants: comp.currentParticipants + 1 }
        : comp
    ));
  };

  const createCompetition = (data: Partial<Competition>) => {
    // إنشاء مسابقة جديدة (للمجتمع فقط)
    if (environment !== 'community') return;

    const newCompetition: Competition = {
      id: `user-${Date.now()}`,
      title: data.title || 'مسابقة جديدة',
      description: data.description || '',
      type: 'community',
      category: data.category || 'individual',
      environment: 'community',
      startDate: data.startDate || new Date(),
      endDate: data.endDate || new Date(),
      registrationDeadline: data.registrationDeadline || new Date(),
      currentParticipants: 0,
      status: 'upcoming',
      organizer: user?.name || 'منظم',
      isOfficial: false,
      prizes: data.prizes || [],
      requirements: data.requirements || [],
      participants: [],
      leaderboard: []
    };

    setCompetitions(prev => [...prev, newCompetition]);
    setShowCreateForm(false);
  };

  const renderCompetitionCard = (competition: Competition) => (
    <Card key={competition.id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg">{competition.title}</CardTitle>
              {competition.isOfficial && (
                <Badge className="bg-blue-100 text-blue-800">
                  <Crown className="w-3 h-3 mr-1" />
                  رسمية
                </Badge>
              )}
            </div>
            <CardDescription className="text-sm">
              {competition.description}
            </CardDescription>
          </div>
          <Trophy className="w-6 h-6 text-yellow-500 flex-shrink-0" />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* المعلومات الأساسية */}
          <div className="flex flex-wrap gap-2">
            <Badge className={getStatusColor(competition.status)}>
              {getStatusText(competition.status)}
            </Badge>
            <Badge className={getTypeColor(competition.type)}>
              {getTypeText(competition.type)}
            </Badge>
            <Badge variant="outline">
              {competition.category === 'individual' ? 'فردي' : 
               competition.category === 'team' ? 'جماعي' : 'مدرسي'}
            </Badge>
          </div>

          {/* التواريخ */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="font-medium">بداية المسابقة</div>
                <div className="text-muted-foreground">
                  {competition.startDate.toLocaleDateString('ar-SA')}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="font-medium">آخر موعد للتسجيل</div>
                <div className="text-muted-foreground">
                  {competition.registrationDeadline.toLocaleDateString('ar-SA')}
                </div>
              </div>
            </div>
          </div>

          {/* المشاركون */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>المشاركون</span>
              <span>
                {competition.currentParticipants}
                {competition.maxParticipants && ` / ${competition.maxParticipants}`}
              </span>
            </div>
            {competition.maxParticipants && (
              <Progress 
                value={(competition.currentParticipants / competition.maxParticipants) * 100} 
                className="h-2"
              />
            )}
          </div>

          {/* الجوائز */}
          {competition.prizes.length > 0 && (
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Gift className="w-4 h-4" />
                الجوائز
              </h4>
              <div className="space-y-1">
                {competition.prizes.slice(0, 3).map((prize, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span className="text-lg">{prize.icon}</span>
                    <span className="font-medium">{prize.title}</span>
                    {prize.value && (
                      <Badge variant="outline" className="text-xs">
                        {prize.value}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* المنظم والموقع */}
          <div className="text-sm text-muted-foreground space-y-1">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>المنظم: {competition.organizer}</span>
            </div>
            {competition.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{competition.location}</span>
              </div>
            )}
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedCompetition(competition)}
            >
              <Eye className="w-4 h-4 mr-2" />
              التفاصيل
            </Button>
            
            {competition.status === 'registration' && (
              <Button
                size="sm"
                onClick={() => joinCompetition(competition.id)}
                className="bg-green-600 hover:bg-green-700"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                انضمام
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderCreateForm = () => (
    <Card>
      <CardHeader>
        <CardTitle>إنشاء مسابقة جديدة</CardTitle>
        <CardDescription>
          أنشئ مسابقة مخصصة للمجتمع
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">عنوان المسابقة</label>
          <Input placeholder="مثال: تحدي اللياقة الشهري" />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">الوصف</label>
          <Textarea 
            placeholder="وصف مفصل عن المسابقة وقوانينها..."
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">نوع المسابقة</label>
            <div className="flex gap-2">
              <Button size="sm" variant="default">فردي</Button>
              <Button size="sm" variant="outline">جماعي</Button>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">مدة المسابقة</label>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">أسبوع</Button>
              <Button size="sm" variant="default">شهر</Button>
              <Button size="sm" variant="outline">3 أشهر</Button>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={() => createCompetition({
            title: 'تحدي اللياقة الشهري',
            description: 'مسابقة شهرية في تحديات اللياقة البدنية',
            category: 'individual',
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            registrationDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          })}>
            <Plus className="w-4 h-4 mr-2" />
            إنشاء المسابقة
          </Button>
          <Button variant="outline" onClick={() => setShowCreateForm(false)}>
            إلغاء
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* العنوان والتبويبات */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            نظام المسابقات
          </h2>
          <p className="text-muted-foreground">
            {environment === 'school' 
              ? 'مسابقات رسمية وتربوية معتمدة من الوزارة'
              : 'مسابقات مجتمعية مفتوحة للجميع'
            }
          </p>
        </div>
        
        {environment === 'community' && (
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            إنشاء مسابقة
          </Button>
        )}
      </div>

      {/* التبويبات */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === 'browse' ? 'default' : 'outline'}
          onClick={() => setActiveTab('browse')}
        >
          تصفح المسابقات
        </Button>
        <Button
          variant={activeTab === 'my-competitions' ? 'default' : 'outline'}
          onClick={() => setActiveTab('my-competitions')}
        >
          مسابقاتي
        </Button>
        {environment === 'community' && (
          <Button
            variant={activeTab === 'create' ? 'default' : 'outline'}
            onClick={() => setActiveTab('create')}
          >
            إنشاء مسابقة
          </Button>
        )}
      </div>

      {/* المحتوى */}
      {activeTab === 'browse' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {competitions.map(renderCompetitionCard)}
        </div>
      )}

      {activeTab === 'my-competitions' && (
        <Card>
          <CardContent className="p-8 text-center">
            <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">لم تنضم لأي مسابقة بعد</h3>
            <p className="text-muted-foreground mb-4">
              ابدأ رحلتك في المسابقات وحقق إنجازات رائعة
            </p>
            <Button onClick={() => setActiveTab('browse')}>
              تصفح المسابقات المتاحة
            </Button>
          </CardContent>
        </Card>
      )}

      {activeTab === 'create' && showCreateForm && renderCreateForm()}

      {/* تفاصيل المسابقة المحددة */}
      {selectedCompetition && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{selectedCompetition.title}</CardTitle>
                <CardDescription className="mt-2">
                  {selectedCompetition.description}
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedCompetition(null)}
              >
                إغلاق
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-6">
              {/* المتطلبات */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  متطلبات المشاركة
                </h4>
                <ul className="space-y-2">
                  {selectedCompetition.requirements.map((req, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              {/* الجوائز التفصيلية */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  الجوائز والتكريم
                </h4>
                <div className="grid gap-3">
                  {selectedCompetition.prizes.map((prize, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="text-2xl">{prize.icon}</div>
                      <div className="flex-1">
                        <div className="font-medium">{prize.title}</div>
                        <div className="text-sm text-muted-foreground">{prize.description}</div>
                      </div>
                      {prize.value && (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          {prize.value}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CompetitionSystem;