import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import {
  Trophy,
  Users,
  Calendar,
  Target,
  Award,
  Star,
  Clock,
  MapPin,
  Flame,
  Medal,
  Crown,
  Zap,
  School,
  Dumbbell,
  BookOpen,
  Gamepad2,
  Video
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Competition {
  id: string;
  title: string;
  description: string;
  type: 'academic' | 'sports' | 'innovation' | 'cultural';
  level: 'school' | 'state' | 'national';
  environment: 'school' | 'community';
  participants: number;
  maxParticipants: number;
  startDate: Date;
  endDate: Date;
  prize: string;
  status: 'upcoming' | 'active' | 'ended';
  organizer: string;
  requirements: string[];
  rewards: {
    coins: number;
    badges: string[];
  };
  isVideoRequired?: boolean;
}

export const CompetitionHub: React.FC = () => {
  const { user, environment } = useAuth();
  const [activeTab, setActiveTab] = useState('active');

  // Mock competitions data
  const competitions: Competition[] = [
    // School Environment Competitions
    {
      id: '1',
      title: 'مسابقة الرياضيات الوطنية',
      description: 'مسابقة رياضيات شاملة لجميع المستويات التعليمية',
      type: 'academic',
      level: 'national',
      environment: 'school',
      participants: 1250,
      maxParticipants: 2000,
      startDate: new Date('2024-11-01'),
      endDate: new Date('2024-11-30'),
      prize: 'شهادات تقدير وجوائز نقدية',
      status: 'active',
      organizer: 'وزارة التربية الوطنية',
      requirements: ['تلميذ مسجل', 'مستوى متوسط أو ثانوي'],
      rewards: { xp: 500, coins: 200, badges: ['🏆', '🧮'] },
      isVideoRequired: false
    },
    {
      id: '2',
      title: 'تحدي القراءة المدرسي',
      description: 'مسابقة قراءة تهدف لتشجيع حب المطالعة',
      type: 'cultural',
      level: 'school',
      environment: 'school',
      participants: 89,
      maxParticipants: 150,
      startDate: new Date('2024-10-15'),
      endDate: new Date('2024-12-15'),
      prize: 'مكتبة شخصية وشهادات',
      status: 'active',
      organizer: 'مدرسة الأمل الابتدائية',
      requirements: ['تلميذ في المدرسة'],
      rewards: { xp: 300, coins: 100, badges: ['📚', '⭐'] }
    },
    // Community Environment Competitions
    {
      id: '3',
      title: 'بطولة اللياقة البدنية الشبابية',
      description: 'مسابقة شاملة للياقة البدنية والقوة والتحمل',
      type: 'sports',
      level: 'national',
      environment: 'community',
      participants: 456,
      maxParticipants: 1000,
      startDate: new Date('2024-10-20'),
      endDate: new Date('2024-11-20'),
      prize: 'معدات رياضية وجوائز نقدية',
      status: 'active',
      organizer: 'اتحاد الشباب الرياضي',
      requirements: ['عمر 16-25 سنة', 'فحص طبي'],
      rewards: { xp: 800, coins: 400, badges: ['💪', '🏃‍♂️', '🏆'] },
      isVideoRequired: true
    },
    {
      id: '4',
      title: 'هاكاثون الذكاء الاصطناعي',
      description: 'مسابقة برمجة وابتكار في مجال الذكاء الاصطناعي',
      type: 'innovation',
      level: 'national',
      environment: 'community',
      participants: 234,
      maxParticipants: 500,
      startDate: new Date('2024-11-10'),
      endDate: new Date('2024-11-12'),
      prize: 'منح دراسية ومعدات تقنية',
      status: 'upcoming',
      organizer: 'نادي المبرمجين الشباب',
      requirements: ['خبرة في البرمجة', 'فريق 2-4 أشخاص'],
      rewards: { xp: 1000, coins: 600, badges: ['🤖', '💻', '🧠'] }
    }
  ];

  const getCompetitionsByEnvironment = () => {
    return competitions.filter(comp => comp.environment === environment);
  };

  const getCompetitionsByStatus = (status: string) => {
    const envCompetitions = getCompetitionsByEnvironment();
    if (status === 'active') return envCompetitions.filter(c => c.status === 'active');
    if (status === 'upcoming') return envCompetitions.filter(c => c.status === 'upcoming');
    if (status === 'ended') return envCompetitions.filter(c => c.status === 'ended');
    return envCompetitions;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'academic': return <BookOpen className="w-4 h-4" />;
      case 'sports': return <Dumbbell className="w-4 h-4" />;
      case 'innovation': return <Zap className="w-4 h-4" />;
      case 'cultural': return <Star className="w-4 h-4" />;
      default: return <Trophy className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'academic': return 'bg-blue-100 text-blue-800';
      case 'sports': return 'bg-green-100 text-green-800';
      case 'innovation': return 'bg-purple-100 text-purple-800';
      case 'cultural': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'school': return 'bg-yellow-100 text-yellow-800';
      case 'state': return 'bg-orange-100 text-orange-800';
      case 'national': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'school': return 'مدرسي';
      case 'state': return 'ولائي';
      case 'national': return 'وطني';
      default: return level;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ended': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'upcoming': return 'قريباً';
      case 'ended': return 'انتهى';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${environment === 'school'
            ? 'bg-blue-500'
            : 'bg-gradient-to-r from-orange-500 to-green-500'
            }`}>
            {environment === 'school' ? (
              <School className="w-6 h-6 text-white" />
            ) : (
              <Trophy className="w-6 h-6 text-white" />
            )}
          </div>
          <h2 className="text-3xl font-bold">
            {environment === 'school' ? '🏫 مركز المسابقات المدرسية' : '🏆 مركز مسابقات المجتمع'}
          </h2>
        </div>
        <p className="text-muted-foreground">
          {environment === 'school'
            ? 'مسابقات أكاديمية وثقافية تحت إشراف الوزارة'
            : 'مسابقات رياضية وإبداعية للشباب والمدربين'
          }
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${environment === 'school' ? 'bg-blue-100' : 'bg-orange-100'
              }`}>
              <Trophy className={`w-6 h-6 ${environment === 'school' ? 'text-blue-600' : 'text-orange-600'
                }`} />
            </div>
            <div className="text-2xl font-bold">{getCompetitionsByStatus('active').length}</div>
            <div className="text-sm text-muted-foreground">مسابقات نشطة</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${environment === 'school' ? 'bg-green-100' : 'bg-green-100'
              }`}>
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold">
              {getCompetitionsByEnvironment().reduce((sum, comp) => sum + comp.participants, 0)}
            </div>
            <div className="text-sm text-muted-foreground">إجمالي المشاركين</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 bg-purple-100">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold">{getCompetitionsByStatus('upcoming').length}</div>
            <div className="text-sm text-muted-foreground">مسابقات قادمة</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 bg-yellow-100">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold">
              {user?.badges?.length || 0}
            </div>
            <div className="text-sm text-muted-foreground">شاراتي</div>
          </CardContent>
        </Card>
      </div>

      {/* Competition Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">المسابقات النشطة</TabsTrigger>
          <TabsTrigger value="upcoming">المسابقات القادمة</TabsTrigger>
          <TabsTrigger value="ended">المسابقات المنتهية</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {getCompetitionsByStatus('active').map((competition) => (
              <CompetitionCard key={competition.id} competition={competition} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {getCompetitionsByStatus('upcoming').map((competition) => (
              <CompetitionCard key={competition.id} competition={competition} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ended" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {getCompetitionsByStatus('ended').map((competition) => (
              <CompetitionCard key={competition.id} competition={competition} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface CompetitionCardProps {
  competition: Competition;
}

const CompetitionCard: React.FC<CompetitionCardProps> = ({ competition }) => {
  const participationPercentage = (competition.participants / competition.maxParticipants) * 100;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{competition.title}</CardTitle>
            <CardDescription className="mb-3">{competition.description}</CardDescription>

            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className={getTypeColor(competition.type)}>
                {getTypeIcon(competition.type)}
                <span className="mr-1">
                  {competition.type === 'academic' ? 'أكاديمي' :
                    competition.type === 'sports' ? 'رياضي' :
                      competition.type === 'innovation' ? 'إبداع' : 'ثقافي'}
                </span>
              </Badge>
              <Badge className={getLevelColor(competition.level)}>
                {getLevelText(competition.level)}
              </Badge>
              <Badge className={getStatusColor(competition.status)}>
                {getStatusText(competition.status)}
              </Badge>
            </div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-2">
              <Trophy className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Participation Progress */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>المشاركون</span>
              <span>{competition.participants} / {competition.maxParticipants}</span>
            </div>
            <Progress value={participationPercentage} className="h-2" />
          </div>

          {/* Competition Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>{competition.startDate.toLocaleDateString('ar-SA')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>{competition.endDate.toLocaleDateString('ar-SA')}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>{competition.organizer}</span>
            </div>
            <div className="flex items-center gap-2">
              <Medal className="w-4 h-4 text-muted-foreground" />
              <span>{competition.prize}</span>
            </div>
          </div>

          {/* Rewards */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-3 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              المكافآت
            </h4>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-blue-500" />
                {competition.rewards.xp} XP
              </span>
              <span className="flex items-center gap-1">
                <Crown className="w-3 h-3 text-yellow-500" />
                {competition.rewards.coins} عملة
              </span>
              <div className="flex gap-1">
                {competition.rewards.badges.map((badge, index) => (
                  <span key={index}>{badge}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Button
            className="w-full"
            disabled={competition.status === 'ended'}
          >
            {competition.status === 'active' ? 'انضم للمسابقة' :
              competition.status === 'upcoming' ? 'سجل اهتمامك' : 'انتهت المسابقة'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompetitionHub;