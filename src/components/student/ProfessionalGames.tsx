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
    rewards: ['شهادة إنجاز', 'شارة اللياقة الذهبية', '500 نقطة إإضافية'],
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
      <Card className="glass-card border-purple-500/20 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-purple-600/10 mix-blend-overlay pointer-events-none" />
        <CardHeader className="relative z-10">
          <CardTitle className="text-3xl font-black flex items-center gap-3 text-white">
            <div className="p-2 rounded-xl bg-purple-500/20 ring-1 ring-purple-500/30">
              <Trophy className="h-7 w-7 text-purple-400" />
            </div>
            <span>التحديات والمسابقات (Pro Challenges)</span>
          </CardTitle>
          <CardDescription className="text-purple-200/70 font-bold text-base mt-2">
            تحديات متنوعة لتطوير مهاراتك وتحفيز روح المنافسة الإيجابية مع أقرانك
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Statistics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'تحديات متاحة', value: 6, color: 'text-blue-400', border: 'border-blue-500/20' },
          { label: 'مشارك نشط', value: 758, color: 'text-green-400', border: 'border-green-500/20' },
          { label: 'نقاط متاحة', value: '1,950', color: 'text-purple-400', border: 'border-purple-500/20' },
          { label: 'جائزة مختلفة', value: 15, color: 'text-orange-400', border: 'border-orange-500/20' }
        ].map((stat, i) => (
          <Card key={i} className={`glass-card ${stat.border} shadow-xl hover:scale-[1.05] transition-all`}>
            <CardContent className="p-6 text-center">
              <div className={`text-3xl font-black ${stat.color} mb-1 tracking-tighter`}>{stat.value}</div>
              <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Type Filter */}
      <Card className="glass-card border-white/5 bg-white/[0.02]">
        <CardHeader>
          <CardTitle className="text-xl font-black text-white">نوع التحدي (Filter)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {types.map((type) => (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                onClick={() => setSelectedType(type)}
                className={`flex items-center gap-3 h-11 px-6 font-black rounded-xl transition-all ${selectedType === type ? 'bg-purple-600 text-white shadow-lg' : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'}`}
              >
                {type !== 'الكل' && getTypeIcon(type)}
                {type}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredChallenges.map((challenge) => (
          <Card key={challenge.id} className="glass-card hover:scale-[1.02] transition-all duration-300 border-white/10 shadow-2xl relative overflow-hidden group">
            <CardHeader className="pb-4 relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/5 ring-1 ring-white/10">
                    {getTypeIcon(challenge.type)}
                  </div>
                  <Badge variant="outline" className="bg-white/5 text-blue-300 border-white/5 font-black uppercase text-[10px] px-3">
                    {challenge.type}
                  </Badge>
                  <Badge className={`${getStatusColor(challenge.status)} px-3 py-0.5 font-black uppercase text-[10px]`}>
                    {challenge.status}
                  </Badge>
                </div>
                <Badge className={`${getDifficultyColor(challenge.difficulty)} px-3 py-0.5 font-black uppercase text-[10px]`}>
                  {challenge.difficulty}
                </Badge>
              </div>

              <CardTitle className="text-2xl font-black mb-3 text-white tracking-tight group-hover:text-purple-300 transition-colors">
                {challenge.name}
              </CardTitle>

              <div className="flex flex-wrap items-center gap-4 text-xs font-black uppercase tracking-wider text-gray-500">
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-400" />
                  {challenge.duration} أيام
                </span>
                <span className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  {challenge.points} نقطة
                </span>
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-400" />
                  {challenge.participants.toLocaleString()} مشارك
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 relative z-10">
              <p className="text-sm font-bold text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">
                {challenge.description}
              </p>

              {/* Progress Bar for Group Challenges */}
              {challenge.maxParticipants && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <span>نسبة الاكتمال للمقاعد</span>
                    <span className="text-white">{challenge.participants}/{challenge.maxParticipants}</span>
                  </div>
                  <Progress
                    value={(challenge.participants / challenge.maxParticipants) * 100}
                    className="h-2.5 bg-white/5 [&>div]:bg-purple-500 border border-white/5"
                  />
                </div>
              )}

              {/* Date Range */}
              {challenge.startDate && challenge.endDate && (
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-blue-300 bg-white/5 p-3 rounded-xl border border-white/5 ring-1 ring-white/5">
                  <Calendar className="h-4 w-4" />
                  <span>الصلاحية: من {challenge.startDate} إلى {challenge.endDate}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-2">
                <Button
                  className={`flex-1 h-12 font-black shadow-lg shadow-black/20 ${challenge.status === 'مكتمل' ? 'bg-green-600/20 text-green-400 border border-green-500/20 cursor-default' : 'bg-white text-purple-900 hover:bg-purple-50'}`}
                  disabled={challenge.status === 'مكتمل'}
                >
                  {challenge.status === 'مكتمل' ? (
                    <>
                      <CheckCircle className="h-5 w-5 ml-2" />
                      مكتمل
                    </>
                  ) : challenge.status === 'جاري' ? (
                    <>
                      <Activity className="h-5 w-5 ml-2" />
                      متابعة التحدي
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 ml-2 fill-current" />
                      انضم الآن
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="border-white/10 bg-white/5 text-white hover:bg-white/10 font-bold h-12 px-6"
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
        <Card className="fixed inset-4 md:inset-10 lg:inset-20 z-50 overflow-auto bg-app-surface border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] backdrop-blur-3xl rounded-[2.5rem] animate-in zoom-in-95 duration-300">
          <div className="absolute inset-0 bg-purple-600/5 mix-blend-overlay pointer-events-none" />

          <CardHeader className="border-b border-white/5 p-8 relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-white/5 ring-1 ring-white/10">
                    {getTypeIcon(selectedChallenge.type)}
                  </div>
                  <Badge variant="outline" className="bg-white/5 text-blue-300 border-white/5 font-black uppercase text-[10px] px-3">
                    {selectedChallenge.type}
                  </Badge>
                  <Badge className={`${getStatusColor(selectedChallenge.status)} px-3 py-0.5 font-black uppercase text-[10px]`}>
                    {selectedChallenge.status}
                  </Badge>
                  <Badge className={`${getDifficultyColor(selectedChallenge.difficulty)} px-3 py-0.5 font-black uppercase text-[10px]`}>
                    {selectedChallenge.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-3xl font-black text-white tracking-tight">
                  {selectedChallenge.name}
                </CardTitle>
                <CardDescription className="mt-4 text-lg font-bold text-gray-400 max-w-2xl leading-relaxed">
                  {selectedChallenge.description}
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedChallenge(null)}
                className="rounded-full bg-white/5 text-white hover:bg-white/10 h-10 w-10"
              >
                ✕
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-8 space-y-10 relative z-10">
            {/* Challenge Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Clock, label: 'المدة الزمنية', value: selectedChallenge.duration, unit: 'أيام', color: 'text-blue-400' },
                { icon: Star, label: 'النقاط المستحقة', value: selectedChallenge.points, unit: 'نقطة', color: 'text-yellow-400' },
                { icon: Users, label: 'المشاركون الآن', value: selectedChallenge.participants, unit: 'مشارك', color: 'text-green-400' },
                { icon: Award, label: 'الجوائز المتاحة', value: selectedChallenge.rewards.length, unit: 'جائزة', color: 'text-orange-500' }
              ].map((stat, i) => (
                <div key={i} className="text-center p-6 bg-white/5 border border-white/5 rounded-3xl shadow-xl hover:bg-white/[0.07] transition-colors">
                  <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-4 drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]`} />
                  <div className="text-3xl font-black text-white">{stat.value}</div>
                  <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2">{stat.label} ({stat.unit})</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Objectives & Requirements */}
              <div className="space-y-8">
                <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
                  <h4 className="text-xl font-black mb-6 flex items-center gap-3 text-white">
                    <Target className="h-6 w-6 text-blue-400" />
                    أهداف التحدي الرئيسية
                  </h4>
                  <ul className="space-y-4">
                    {selectedChallenge.objectives.map((objective, index) => (
                      <li key={index} className="flex items-center gap-4 p-4 bg-black/20 rounded-2xl border border-white/5 text-gray-200 font-bold">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        {objective}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
                  <h4 className="text-xl font-black mb-6 flex items-center gap-3 text-white">
                    <Activity className="h-6 w-6 text-red-500" />
                    متطلبات المشاركة
                  </h4>
                  <ul className="space-y-4">
                    {selectedChallenge.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-center gap-4 p-4 bg-black/20 rounded-2xl border border-white/5 text-gray-200 font-bold">
                        <div className="w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                        {requirement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Rewards */}
              <div className="bg-white/5 p-8 rounded-3xl border border-white/5 h-full">
                <h4 className="text-xl font-black mb-6 flex items-center gap-3 text-white">
                  <Medal className="h-6 w-6 text-yellow-500" />
                  المكافآت والجوائز
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  {selectedChallenge.rewards.map((reward, index) => (
                    <div key={index} className="flex items-center gap-6 p-6 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl group/reward hover:bg-yellow-500/10 transition-colors">
                      <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-500 group-hover/reward:scale-110 transition-transform">
                        <Trophy className="h-7 w-7" />
                      </div>
                      <div className="text-lg font-black text-yellow-400">{reward}</div>
                    </div>
                  ))}
                </div>
                {/* Decorative element */}
                <div className="mt-8 p-6 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
                  <p className="text-sm font-bold text-gray-500 italic">يتم تسليم الجوائز تلقائياً عند إكمال جميع متطلبات التحدي</p>
                </div>
              </div>
            </div>

            {/* Final Action Button */}
            <Button
              className={`w-full h-16 text-xl font-black rounded-2xl shadow-2xl transition-all ${selectedChallenge.status === 'مكتمل' ? 'bg-green-600/20 text-green-400 border border-green-500/20' : 'bg-white text-purple-900 hover:bg-purple-50 hover:scale-[1.01]'}`}
              size="lg"
              disabled={selectedChallenge.status === 'مكتمل'}
            >
              {selectedChallenge.status === 'مكتمل' ? (
                <>
                  <CheckCircle className="h-6 w-6 ml-3" />
                  تم إنهاء التحدي بنجاح
                </>
              ) : selectedChallenge.status === 'جاري' ? (
                <>
                  <Activity className="h-6 w-6 ml-3" />
                  متابعة التقدم في التحدي
                </>
              ) : (
                <>
                  <Play className="h-6 w-6 ml-3 fill-current" />
                  بدء التحدي الآن (Join Now)
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}