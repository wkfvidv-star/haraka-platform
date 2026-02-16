import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Target, 
  Clock, 
  Users, 
  Star, 
  Play,
  BarChart3,
  Award,
  Zap,
  Activity,
  Timer,
  TrendingUp,
  CheckCircle,
  Calendar,
  MapPin,
  Medal
} from 'lucide-react';

interface Challenge {
  id: number;
  name: string;
  type: 'فردي' | 'جماعي' | 'تنافسي';
  category: string;
  description: string;
  duration: number;
  difficulty: 'مبتدئ' | 'متوسط' | 'متقدم';
  points: number;
  participants: number;
  maxParticipants?: number;
  status: 'متاح' | 'جاري' | 'مكتمل';
  startDate?: string;
  endDate?: string;
  objectives: string[];
  rewards: string[];
  requirements: string[];
}

const professionalChallenges: Challenge[] = [
  {
    id: 1,
    name: 'تحدي اللياقة البدنية الشامل',
    type: 'فردي',
    category: 'لياقة عامة',
    description: 'برنامج تدريبي متكامل لمدة 30 يوماً يهدف إلى تحسين جميع عناصر اللياقة البدنية',
    duration: 30,
    difficulty: 'متوسط',
    points: 500,
    participants: 245,
    status: 'متاح',
    startDate: '2024-01-15',
    endDate: '2024-02-14',
    objectives: [
      'تحسين القوة العضلية بنسبة 20%',
      'زيادة التحمل القلبي الوعائي',
      'تطوير المرونة والحركية',
      'بناء عادات رياضية يومية'
    ],
    rewards: ['شهادة إنجاز', 'شارة اللياقة الذهبية', '500 نقطة إضافية'],
    requirements: ['الالتزام بالتمرين اليومي', 'تسجيل النتائج يومياً', 'إكمال التقييمات الأسبوعية']
  },
  {
    id: 2,
    name: 'بطولة المدرسة للجري',
    type: 'تنافسي',
    category: 'جري',
    description: 'مسابقة جري بين طلاب المدرسة بمسافات مختلفة حسب الفئة العمرية',
    duration: 1,
    difficulty: 'متقدم',
    points: 300,
    participants: 89,
    maxParticipants: 100,
    status: 'جاري',
    startDate: '2024-01-20',
    endDate: '2024-01-20',
    objectives: [
      'تحقيق أفضل وقت شخصي',
      'التنافس الشريف مع الزملاء',
      'تطوير روح الفريق',
      'تحسين الأداء الرياضي'
    ],
    rewards: ['كؤوس للمراكز الثلاثة الأولى', 'شهادات مشاركة', 'نقاط تنافسية'],
    requirements: ['اجتياز الفحص الطبي', 'التسجيل المسبق', 'حضور التدريبات التحضيرية']
  },
  {
    id: 3,
    name: 'تحدي الفريق الأسبوعي',
    type: 'جماعي',
    category: 'عمل جماعي',
    description: 'تحديات أسبوعية تتطلب التعاون بين أعضاء الفريق لتحقيق أهداف مشتركة',
    duration: 7,
    difficulty: 'مبتدئ',
    points: 200,
    participants: 156,
    maxParticipants: 200,
    status: 'متاح',
    startDate: '2024-01-22',
    endDate: '2024-01-28',
    objectives: [
      'تعزيز روح الفريق',
      'تطوير مهارات التواصل',
      'تحقيق أهداف جماعية',
      'بناء الثقة المتبادلة'
    ],
    rewards: ['شارة الفريق المتميز', 'نقاط جماعية', 'شهادة تقدير للفريق'],
    requirements: ['تكوين فريق من 4-6 أعضاء', 'تحديد قائد الفريق', 'الالتزام بالمشاركة اليومية']
  },
  {
    id: 4,
    name: 'ماراثون القراءة الرياضية',
    type: 'فردي',
    category: 'تعليمي',
    description: 'تحدي لقراءة وفهم المواد التعليمية المتعلقة بالرياضة والصحة',
    duration: 14,
    difficulty: 'مبتدئ',
    points: 150,
    participants: 78,
    status: 'متاح',
    startDate: '2024-01-25',
    endDate: '2024-02-07',
    objectives: [
      'زيادة المعرفة الرياضية',
      'فهم أسس التغذية الصحية',
      'تعلم تقنيات التدريب',
      'تطوير الوعي الصحي'
    ],
    rewards: ['شهادة المعرفة الرياضية', 'كتب رياضية مجانية', 'نقاط معرفية'],
    requirements: ['قراءة المواد المحددة', 'اجتياز الاختبارات الأسبوعية', 'كتابة تقرير ختامي']
  },
  {
    id: 5,
    name: 'تحدي التوازن والتناسق',
    type: 'فردي',
    category: 'مهارات حركية',
    description: 'سلسلة من التمارين المتخصصة لتطوير التوازن والتناسق الحركي',
    duration: 21,
    difficulty: 'متوسط',
    points: 350,
    participants: 123,
    status: 'متاح',
    startDate: '2024-02-01',
    endDate: '2024-02-21',
    objectives: [
      'تحسين التوازن الثابت والديناميكي',
      'تطوير التناسق بين العين واليد',
      'زيادة الوعي الجسدي',
      'تقوية العضلات المثبتة'
    ],
    rewards: ['شارة التوازن الماسية', 'معدات تدريب شخصية', 'جلسات تدريب إضافية'],
    requirements: ['أداء التمارين اليومية', 'تسجيل فيديوهات التقدم', 'حضور جلسات التقييم']
  },
  {
    id: 6,
    name: 'بطولة الألعاب الذهنية الرياضية',
    type: 'تنافسي',
    category: 'ذكاء رياضي',
    description: 'مسابقة تجمع بين النشاط البدني والتحديات الذهنية',
    duration: 3,
    difficulty: 'متقدم',
    points: 400,
    participants: 67,
    maxParticipants: 80,
    status: 'مكتمل',
    startDate: '2024-01-10',
    endDate: '2024-01-12',
    objectives: [
      'دمج النشاط البدني مع التفكير الاستراتيجي',
      'تطوير سرعة اتخاذ القرار',
      'تحسين التركيز تحت الضغط',
      'بناء الذكاء الحركي'
    ],
    rewards: ['كأس البطولة', 'شهادة الذكاء الرياضي', 'منحة تدريبية متقدمة'],
    requirements: ['اجتياز اختبار القبول', 'خبرة رياضية سابقة', 'مهارات حل المشكلات']
  }
];

export function ProfessionalGames() {
  const [selectedType, setSelectedType] = useState<string>('الكل');
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  const types = ['الكل', 'فردي', 'جماعي', 'تنافسي'];
  
  const filteredChallenges = selectedType === 'الكل' 
    ? professionalChallenges 
    : professionalChallenges.filter(challenge => challenge.type === selectedType);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'متاح': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
      case 'جاري': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200';
      case 'مكتمل': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'مبتدئ': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
      case 'متوسط': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200';
      case 'متقدم': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'فردي': return <Target className="h-4 w-4" />;
      case 'جماعي': return <Users className="h-4 w-4" />;
      case 'تنافسي': return <Trophy className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Trophy className="h-6 w-6" />
            التحديات والمسابقات الرياضية
          </CardTitle>
          <CardDescription className="text-purple-100">
            تحديات متنوعة لتطوير مهاراتك وتحفيز روح المنافسة الإيجابية
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">6</div>
            <div className="text-sm text-gray-500">تحديات متاحة</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">758</div>
            <div className="text-sm text-gray-500">مشارك نشط</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">1,950</div>
            <div className="text-sm text-gray-500">نقاط متاحة</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">15</div>
            <div className="text-sm text-gray-500">جائزة مختلفة</div>
          </CardContent>
        </Card>
      </div>

      {/* Type Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">نوع التحدي</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {types.map((type) => (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type)}
                className="flex items-center gap-2"
              >
                {type !== 'الكل' && getTypeIcon(type)}
                {type}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredChallenges.map((challenge) => (
          <Card key={challenge.id} className="hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  {getTypeIcon(challenge.type)}
                  <Badge variant="outline">{challenge.type}</Badge>
                  <Badge className={getStatusColor(challenge.status)}>
                    {challenge.status}
                  </Badge>
                </div>
                <Badge className={getDifficultyColor(challenge.difficulty)}>
                  {challenge.difficulty}
                </Badge>
              </div>
              
              <CardTitle className="text-lg mb-2">
                {challenge.name}
              </CardTitle>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {challenge.duration} {challenge.duration === 1 ? 'يوم' : 'يوم'}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  {challenge.points} نقطة
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {challenge.participants} مشارك
                </span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {challenge.description}
              </p>

              {/* Progress Bar for Group Challenges */}
              {challenge.maxParticipants && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>المشاركون</span>
                    <span>{challenge.participants}/{challenge.maxParticipants}</span>
                  </div>
                  <Progress 
                    value={(challenge.participants / challenge.maxParticipants) * 100} 
                    className="h-2"
                  />
                </div>
              )}

              {/* Date Range */}
              {challenge.startDate && challenge.endDate && (
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                  <Calendar className="h-3 w-3" />
                  <span>من {challenge.startDate} إلى {challenge.endDate}</span>
                </div>
              )}

              {/* Key Objectives Preview */}
              <div>
                <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  الأهداف الرئيسية:
                </h4>
                <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                  {challenge.objectives.slice(0, 2).map((objective, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                      {objective}
                    </li>
                  ))}
                  {challenge.objectives.length > 2 && (
                    <li className="text-purple-600 cursor-pointer">
                      +{challenge.objectives.length - 2} أهداف أخرى...
                    </li>
                  )}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button 
                  className="flex-1" 
                  disabled={challenge.status === 'مكتمل'}
                  size="sm"
                >
                  {challenge.status === 'مكتمل' ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      مكتمل
                    </>
                  ) : challenge.status === 'جاري' ? (
                    <>
                      <Activity className="h-4 w-4 mr-2" />
                      متابعة
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      انضم الآن
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedChallenge(challenge)}
                >
                  التفاصيل
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Challenge Detail Modal */}
      {selectedChallenge && (
        <Card className="fixed inset-4 z-50 overflow-auto bg-white dark:bg-gray-900 shadow-2xl">
          <CardHeader className="border-b">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {getTypeIcon(selectedChallenge.type)}
                  <Badge variant="outline">{selectedChallenge.type}</Badge>
                  <Badge className={getStatusColor(selectedChallenge.status)}>
                    {selectedChallenge.status}
                  </Badge>
                  <Badge className={getDifficultyColor(selectedChallenge.difficulty)}>
                    {selectedChallenge.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-xl">
                  {selectedChallenge.name}
                </CardTitle>
                <CardDescription className="mt-2">
                  {selectedChallenge.description}
                </CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedChallenge(null)}
              >
                ✕
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-6 space-y-6">
            {/* Challenge Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="text-lg font-bold">{selectedChallenge.duration}</div>
                <div className="text-xs text-gray-500">يوم</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Star className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="text-lg font-bold">{selectedChallenge.points}</div>
                <div className="text-xs text-gray-500">نقطة</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Users className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <div className="text-lg font-bold">{selectedChallenge.participants}</div>
                <div className="text-xs text-gray-500">مشارك</div>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <Award className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                <div className="text-lg font-bold">{selectedChallenge.rewards.length}</div>
                <div className="text-xs text-gray-500">جائزة</div>
              </div>
            </div>

            {/* All Objectives */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                جميع الأهداف التدريبية
              </h4>
              <ul className="space-y-2">
                {selectedChallenge.objectives.map((objective, index) => (
                  <li key={index} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    {objective}
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Activity className="h-5 w-5 text-red-600" />
                متطلبات المشاركة
              </h4>
              <ul className="space-y-2">
                {selectedChallenge.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-center gap-3 p-2 bg-red-50 dark:bg-red-900/20 rounded">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    {requirement}
                  </li>
                ))}
              </ul>
            </div>

            {/* Rewards */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Medal className="h-5 w-5 text-yellow-600" />
                الجوائز والمكافآت
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {selectedChallenge.rewards.map((reward, index) => (
                  <div key={index} className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <Trophy className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                    <div className="text-sm font-medium">{reward}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <Button 
              className="w-full" 
              size="lg" 
              disabled={selectedChallenge.status === 'مكتمل'}
            >
              {selectedChallenge.status === 'مكتمل' ? (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  تم إكمال التحدي
                </>
              ) : selectedChallenge.status === 'جاري' ? (
                <>
                  <Activity className="h-5 w-5 mr-2" />
                  متابعة التحدي
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  الانضمام للتحدي
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}