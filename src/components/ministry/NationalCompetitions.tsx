import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy,
  Users,
  MapPin,
  Calendar,
  Target,
  Award,
  BarChart3,
  TrendingUp,
  CheckCircle,
  Clock,
  Eye,
  Plus,
  Download,
  Upload,
  Flag
} from 'lucide-react';

interface NationalCompetition {
  id: string;
  title: string;
  description: string;
  category: 'fitness' | 'sports' | 'academic' | 'cultural';
  level: 'national' | 'regional' | 'inter_regional';
  status: 'planning' | 'registration' | 'active' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  participatingProvinces: number;
  totalProvinces: number;
  participatingSchools: number;
  participatingStudents: number;
  coordinator: string;
  budget: number;
  regions: string[];
  results?: {
    provinceId: string;
    provinceName: string;
    provinceArabicName: string;
    region: string;
    score: number;
    rank: number;
    studentsCount: number;
    schoolsCount: number;
  }[];
  progress: {
    registrationComplete: boolean;
    materialsDistributed: boolean;
    competitionStarted: boolean;
    resultsCollected: boolean;
    certificatesIssued: boolean;
  };
  statistics: {
    maleParticipants: number;
    femaleParticipants: number;
    averageScore: number;
    completionRate: number;
  };
}

export function NationalCompetitions() {
  const [competitions, setCompetitions] = useState<NationalCompetition[]>([
    {
      id: 'nat_comp_1',
      title: 'البطولة الوطنية للياقة البدنية المدرسية 2024',
      description: 'مسابقة شاملة لتقييم اللياقة البدنية للطلاب على مستوى جميع ولايات الوطن',
      category: 'fitness',
      level: 'national',
      status: 'active',
      startDate: '2024-10-01',
      endDate: '2024-11-30',
      participatingProvinces: 52,
      totalProvinces: 58,
      participatingSchools: 24580,
      participatingStudents: 5847562,
      coordinator: 'الأستاذ محمد بن عبد الله - المفتش العام',
      budget: 125000000,
      regions: ['الوسط', 'الشرق', 'الغرب', 'الشمال', 'الجنوب'],
      progress: {
        registrationComplete: true,
        materialsDistributed: true,
        competitionStarted: true,
        resultsCollected: false,
        certificatesIssued: false
      },
      statistics: {
        maleParticipants: 3124780,
        femaleParticipants: 2722782,
        averageScore: 82.4,
        completionRate: 89.7
      },
      results: [
        {
          provinceId: '16',
          provinceName: 'Alger',
          provinceArabicName: 'الجزائر',
          region: 'الوسط',
          score: 94.2,
          rank: 1,
          studentsCount: 156780,
          schoolsCount: 680
        },
        {
          provinceId: '31',
          provinceName: 'Oran',
          provinceArabicName: 'وهران',
          region: 'الغرب',
          score: 92.8,
          rank: 2,
          studentsCount: 128340,
          schoolsCount: 580
        },
        {
          provinceId: '25',
          provinceName: 'Constantine',
          provinceArabicName: 'قسنطينة',
          region: 'الشرق',
          score: 91.5,
          rank: 3,
          studentsCount: 105670,
          schoolsCount: 480
        }
      ]
    },
    {
      id: 'nat_comp_2',
      title: 'أولمبياد الرياضة المدرسية الجزائرية 2024',
      description: 'البطولة الأكبر للرياضة المدرسية في الجزائر تشمل جميع الألعاب الرياضية',
      category: 'sports',
      level: 'national',
      status: 'registration',
      startDate: '2024-12-01',
      endDate: '2025-03-31',
      participatingProvinces: 0,
      totalProvinces: 58,
      participatingSchools: 0,
      participatingStudents: 0,
      coordinator: 'الأستاذة فاطمة الزهراء - مديرة الرياضة المدرسية',
      budget: 200000000,
      regions: ['الوسط', 'الشرق', 'الغرب', 'الشمال', 'الجنوب'],
      progress: {
        registrationComplete: false,
        materialsDistributed: false,
        competitionStarted: false,
        resultsCollected: false,
        certificatesIssued: false
      },
      statistics: {
        maleParticipants: 0,
        femaleParticipants: 0,
        averageScore: 0,
        completionRate: 0
      }
    },
    {
      id: 'nat_comp_3',
      title: 'مسابقة الثقافة الرياضية الوطنية 2024',
      description: 'مسابقة ثقافية حول تاريخ الرياضة الجزائرية والعالمية',
      category: 'cultural',
      level: 'national',
      status: 'completed',
      startDate: '2024-09-01',
      endDate: '2024-09-30',
      participatingProvinces: 58,
      totalProvinces: 58,
      participatingSchools: 15420,
      participatingStudents: 847562,
      coordinator: 'الأستاذ أحمد الصالح - مفتش التربية البدنية',
      budget: 45000000,
      regions: ['الوسط', 'الشرق', 'الغرب', 'الشمال', 'الجنوب'],
      progress: {
        registrationComplete: true,
        materialsDistributed: true,
        competitionStarted: true,
        resultsCollected: true,
        certificatesIssued: true
      },
      statistics: {
        maleParticipants: 456780,
        femaleParticipants: 390782,
        averageScore: 87.8,
        completionRate: 96.4
      }
    }
  ]);

  const [selectedCompetition, setSelectedCompetition] = useState<NationalCompetition | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
      case 'registration': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200';
      case 'planning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200';
      case 'completed': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fitness': return <Target className="h-4 w-4" />;
      case 'sports': return <Trophy className="h-4 w-4" />;
      case 'academic': return <BarChart3 className="h-4 w-4" />;
      case 'cultural': return <Award className="h-4 w-4" />;
      default: return <Trophy className="h-4 w-4" />;
    }
  };

  const getProgressPercentage = (progress: NationalCompetition['progress']) => {
    const completed = Object.values(progress).filter(Boolean).length;
    return (completed / Object.keys(progress).length) * 100;
  };

  if (selectedCompetition) {
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
                    {selectedCompetition.status === 'planning' && 'قيد التخطيط'}
                    {selectedCompetition.status === 'registration' && 'فترة التسجيل'}
                    {selectedCompetition.status === 'active' && 'نشطة'}
                    {selectedCompetition.status === 'completed' && 'مكتملة'}
                    {selectedCompetition.status === 'cancelled' && 'ملغية'}
                  </Badge>
                  <Badge variant="outline">
                    {selectedCompetition.level === 'national' && 'وطنية'}
                    {selectedCompetition.level === 'regional' && 'إقليمية'}
                    {selectedCompetition.level === 'inter_regional' && 'بين الأقاليم'}
                  </Badge>
                </div>
              </div>
              <Button variant="outline" onClick={() => setSelectedCompetition(null)}>
                ← العودة للنظرة العامة
              </Button>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="provinces">الولايات المشاركة</TabsTrigger>
            <TabsTrigger value="progress">التقدم</TabsTrigger>
            <TabsTrigger value="results">النتائج</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Competition Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{selectedCompetition.participatingProvinces}</div>
                  <div className="text-sm text-gray-500">ولاية مشاركة</div>
                  <div className="text-xs text-blue-600">
                    من أصل {selectedCompetition.totalProvinces}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Trophy className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{selectedCompetition.participatingSchools.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">مدرسة مشاركة</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{(selectedCompetition.participatingStudents / 1000000).toFixed(1)}م</div>
                  <div className="text-sm text-gray-500">طالب مشارك</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{selectedCompetition.statistics.averageScore}%</div>
                  <div className="text-sm text-gray-500">متوسط النتائج</div>
                </CardContent>
              </Card>
            </div>

            {/* Budget and Coordinator */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">معلومات الميزانية</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-4">
                    <div className="text-3xl font-bold text-green-600">
                      {(selectedCompetition.budget / 1000000).toFixed(0)} مليون دج
                    </div>
                    <div className="text-sm text-gray-500">إجمالي الميزانية المخصصة</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">المنسق العام</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-4">
                    <div className="text-lg font-medium">{selectedCompetition.coordinator}</div>
                    <div className="text-sm text-gray-500">المسؤول عن تنسيق المسابقة</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="provinces" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>الولايات المشاركة</CardTitle>
                <CardDescription>
                  {selectedCompetition.participatingProvinces} ولاية من أصل {selectedCompetition.totalProvinces}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>سيتم عرض قائمة الولايات المشاركة هنا</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  تقدم المسابقة الوطنية
                </CardTitle>
                <CardDescription>
                  {Math.round(getProgressPercentage(selectedCompetition.progress))}% مكتمل
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="mb-4">
                    <Progress value={getProgressPercentage(selectedCompetition.progress)} className="h-3" />
                  </div>
                  
                  <div className="space-y-3">
                    {Object.entries(selectedCompetition.progress).map(([key, completed]) => (
                      <div key={key} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        {completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Clock className="h-5 w-5 text-gray-400" />
                        )}
                        <span className={completed ? 'text-green-700 dark:text-green-300' : 'text-gray-600'}>
                          {key === 'registrationComplete' && 'اكتمال التسجيل من جميع الولايات'}
                          {key === 'materialsDistributed' && 'توزيع المواد والأدوات'}
                          {key === 'competitionStarted' && 'بدء المسابقة رسمياً'}
                          {key === 'resultsCollected' && 'جمع النتائج من الولايات'}
                          {key === 'certificatesIssued' && 'إصدار الشهادات والجوائز'}
                        </span>
                        <Badge 
                          className={`ml-auto ${completed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
                        >
                          {completed ? 'مكتمل' : 'معلق'}
                        </Badge>
                      </div>
                    ))}
                  </div>
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
                    ترتيب الولايات - النتائج النهائية
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedCompetition.results.map((result, index) => (
                      <div key={result.provinceId} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                            result.rank === 1 ? 'bg-yellow-500' :
                            result.rank === 2 ? 'bg-gray-400' :
                            result.rank === 3 ? 'bg-orange-500' : 'bg-blue-500'
                          }`}>
                            {result.rank}
                          </div>
                          <div>
                            <h4 className="font-medium text-lg">{result.provinceArabicName}</h4>
                            <p className="text-sm text-gray-500">
                              المنطقة {result.region} • {result.schoolsCount} مدرسة • {result.studentsCount.toLocaleString()} طالب
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">{result.score}%</div>
                          <div className="text-sm text-gray-500">النتيجة النهائية</div>
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
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-yellow-600 to-red-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Flag className="h-6 w-6" />
            المسابقات الوطنية - وزارة التربية الوطنية
          </CardTitle>
          <CardDescription className="text-yellow-100">
            إدارة ومتابعة جميع المسابقات والبطولات على المستوى الوطني
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{competitions.length}</div>
              <div className="text-sm text-yellow-100">إجمالي المسابقات</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">
                {competitions.filter(c => c.status === 'active' || c.status === 'registration').length}
              </div>
              <div className="text-sm text-yellow-100">مسابقات نشطة</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">
                {competitions.reduce((acc, c) => acc + c.participatingProvinces, 0)}
              </div>
              <div className="text-sm text-yellow-100">ولايات مشاركة</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">
                {(competitions.reduce((acc, c) => acc + c.participatingStudents, 0) / 1000000).toFixed(1)}م
              </div>
              <div className="text-sm text-yellow-100">طلاب مشاركون</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Competitions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {competitions.map((competition) => (
          <Card key={competition.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(competition.category)}
                  <Badge className={getStatusColor(competition.status)}>
                    {competition.status === 'planning' && 'قيد التخطيط'}
                    {competition.status === 'registration' && 'فترة التسجيل'}
                    {competition.status === 'active' && 'نشطة'}
                    {competition.status === 'completed' && 'مكتملة'}
                    {competition.status === 'cancelled' && 'ملغية'}
                  </Badge>
                </div>
                <Badge variant="outline">
                  {competition.level === 'national' && 'وطنية'}
                  {competition.level === 'regional' && 'إقليمية'}
                  {competition.level === 'inter_regional' && 'بين الأقاليم'}
                </Badge>
              </div>
              
              <CardTitle className="text-lg">{competition.title}</CardTitle>
              <CardDescription>{competition.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Competition Stats */}
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <div className="text-lg font-bold text-blue-600">{competition.participatingProvinces}</div>
                  <div className="text-xs text-gray-500">ولاية</div>
                </div>
                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <div className="text-lg font-bold text-green-600">
                    {competition.participatingStudents > 0 ? 
                      `${(competition.participatingStudents / 1000000).toFixed(1)}م` : 
                      '0'
                    }
                  </div>
                  <div className="text-xs text-gray-500">طالب</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>التقدم</span>
                  <span>{Math.round(getProgressPercentage(competition.progress))}%</span>
                </div>
                <Progress value={getProgressPercentage(competition.progress)} className="h-2" />
              </div>

              {/* Dates and Budget */}
              <div className="text-sm text-gray-500 space-y-1">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  <span>{competition.startDate} - {competition.endDate}</span>
                </div>
                <div>الميزانية: {(competition.budget / 1000000).toFixed(0)} مليون دج</div>
                <div>المنسق: {competition.coordinator}</div>
              </div>

              {/* Action Button */}
              <Button 
                className="w-full"
                onClick={() => setSelectedCompetition(competition)}
              >
                <Eye className="h-4 w-4 mr-2" />
                إدارة المسابقة
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>إجراءات سريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Plus className="h-6 w-6" />
              إنشاء مسابقة وطنية
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Download className="h-6 w-6" />
              تصدير النتائج
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Upload className="h-6 w-6" />
              رفع البيانات
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <BarChart3 className="h-6 w-6" />
              إحصائيات شاملة
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}