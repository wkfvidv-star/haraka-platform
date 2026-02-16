import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy,
  School,
  Users,
  Target,
  BarChart3,
  MapPin,
  Calendar,
  Award,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Eye,
  Plus,
  Download,
  Upload
} from 'lucide-react';

interface Province {
  id: string;
  name: string;
  arabicName: string;
  schools: number;
  students: number;
  teachers: number;
}

interface ProvinceCompetition {
  id: string;
  title: string;
  description: string;
  category: 'fitness' | 'sports' | 'academic' | 'cultural';
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  participatingSchools: number;
  totalSchools: number;
  participatingStudents: number;
  regions: string[];
  coordinator: string;
  results?: {
    schoolId: string;
    schoolName: string;
    region: string;
    score: number;
    rank: number;
    studentsCount: number;
  }[];
  progress: {
    registrationComplete: boolean;
    materialsDistributed: boolean;
    competitionStarted: boolean;
    resultsSubmitted: boolean;
    certificatesIssued: boolean;
  };
  statistics: {
    maleParticipants: number;
    femaleParticipants: number;
    averageScore: number;
    completionRate: number;
  };
}

interface DirectorateCompetitionsProps {
  selectedProvince: Province;
}

export function DirectorateCompetitions({ selectedProvince }: DirectorateCompetitionsProps) {
  const [competitions, setCompetitions] = useState<ProvinceCompetition[]>([
    {
      id: 'comp_1',
      title: `مسابقة اللياقة البدنية الشاملة - ولاية ${selectedProvince.arabicName}`,
      description: 'مسابقة شاملة لتقييم اللياقة البدنية للطلاب على مستوى الولاية',
      category: 'fitness',
      status: 'active',
      startDate: '2024-10-01',
      endDate: '2024-10-31',
      participatingSchools: Math.floor(selectedProvince.schools * 0.85),
      totalSchools: selectedProvince.schools,
      participatingStudents: Math.floor(selectedProvince.students * 0.6),
      regions: ['المنطقة الشرقية', 'المنطقة الوسطى', 'المنطقة الغربية', 'المنطقة الجنوبية'],
      coordinator: 'الأستاذ محمد بن عبد الله',
      progress: {
        registrationComplete: true,
        materialsDistributed: true,
        competitionStarted: true,
        resultsSubmitted: false,
        certificatesIssued: false
      },
      statistics: {
        maleParticipants: Math.floor(selectedProvince.students * 0.32),
        femaleParticipants: Math.floor(selectedProvince.students * 0.28),
        averageScore: 78.5,
        completionRate: 92.3
      },
      results: [
        {
          schoolId: 'school_1',
          schoolName: `متوسطة الشهيد محمد بوضياف - ${selectedProvince.arabicName}`,
          region: 'المنطقة الشرقية',
          score: 94.2,
          rank: 1,
          studentsCount: 156
        },
        {
          schoolId: 'school_2',
          schoolName: `ثانوية الأمير عبد القادر - ${selectedProvince.arabicName}`,
          region: 'المنطقة الوسطى',
          score: 91.8,
          rank: 2,
          studentsCount: 198
        },
        {
          schoolId: 'school_3',
          schoolName: `ابتدائية الشهيد العربي بن مهيدي - ${selectedProvince.arabicName}`,
          region: 'المنطقة الغربية',
          score: 89.5,
          rank: 3,
          studentsCount: 142
        }
      ]
    },
    {
      id: 'comp_2',
      title: `بطولة كرة القدم المدرسية - ولاية ${selectedProvince.arabicName}`,
      description: 'بطولة كرة قدم بين جميع المدارس في الولاية',
      category: 'sports',
      status: 'completed',
      startDate: '2024-09-15',
      endDate: '2024-09-30',
      participatingSchools: Math.floor(selectedProvince.schools * 0.7),
      totalSchools: selectedProvince.schools,
      participatingStudents: Math.floor(selectedProvince.students * 0.4),
      regions: ['المنطقة الشرقية', 'المنطقة الوسطى', 'المنطقة الغربية'],
      coordinator: 'الأستاذة فاطمة الزهراء',
      progress: {
        registrationComplete: true,
        materialsDistributed: true,
        competitionStarted: true,
        resultsSubmitted: true,
        certificatesIssued: true
      },
      statistics: {
        maleParticipants: Math.floor(selectedProvince.students * 0.25),
        femaleParticipants: Math.floor(selectedProvince.students * 0.15),
        averageScore: 85.2,
        completionRate: 98.7
      }
    },
    {
      id: 'comp_3',
      title: `مسابقة الثقافة العامة - ولاية ${selectedProvince.arabicName}`,
      description: 'مسابقة ثقافية شاملة للطلاب المتفوقين',
      category: 'cultural',
      status: 'planning',
      startDate: '2024-11-01',
      endDate: '2024-11-15',
      participatingSchools: 0,
      totalSchools: selectedProvince.schools,
      participatingStudents: 0,
      regions: ['المنطقة الشرقية', 'المنطقة الوسطى', 'المنطقة الغربية', 'المنطقة الجنوبية'],
      coordinator: 'الأستاذ أحمد الصالح',
      progress: {
        registrationComplete: false,
        materialsDistributed: false,
        competitionStarted: false,
        resultsSubmitted: false,
        certificatesIssued: false
      },
      statistics: {
        maleParticipants: 0,
        femaleParticipants: 0,
        averageScore: 0,
        completionRate: 0
      }
    }
  ]);

  const [selectedCompetition, setSelectedCompetition] = useState<ProvinceCompetition | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
      case 'planning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fitness': return <Target className="h-4 w-4" />;
      case 'sports': return <Trophy className="h-4 w-4" />;
      case 'academic': return <School className="h-4 w-4" />;
      case 'cultural': return <Award className="h-4 w-4" />;
      default: return <Trophy className="h-4 w-4" />;
    }
  };

  const getProgressPercentage = (progress: ProvinceCompetition['progress']) => {
    const completed = Object.values(progress).filter(Boolean).length;
    return (completed / Object.keys(progress).length) * 100;
  };

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
                    {selectedCompetition.status === 'planning' && 'قيد التخطيط'}
                    {selectedCompetition.status === 'active' && 'نشطة'}
                    {selectedCompetition.status === 'completed' && 'مكتملة'}
                    {selectedCompetition.status === 'cancelled' && 'ملغية'}
                  </Badge>
                  <Badge variant="outline">
                    {selectedCompetition.category === 'fitness' && 'لياقة بدنية'}
                    {selectedCompetition.category === 'sports' && 'رياضية'}
                    {selectedCompetition.category === 'academic' && 'أكاديمية'}
                    {selectedCompetition.category === 'cultural' && 'ثقافية'}
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
            <TabsTrigger value="schools">المدارس المشاركة</TabsTrigger>
            <TabsTrigger value="progress">التقدم</TabsTrigger>
            <TabsTrigger value="results">النتائج</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Competition Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <School className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{selectedCompetition.participatingSchools}</div>
                  <div className="text-sm text-gray-500">مدرسة مشاركة</div>
                  <div className="text-xs text-blue-600">
                    من أصل {selectedCompetition.totalSchools}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{selectedCompetition.participatingStudents.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">طالب مشارك</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <MapPin className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{selectedCompetition.regions.length}</div>
                  <div className="text-sm text-gray-500">مناطق</div>
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

            {/* Regions Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  توزيع المناطق
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedCompetition.regions.map((region, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      <span>{region}</span>
                      <Badge variant="outline" className="ml-auto">
                        {Math.floor(selectedCompetition.participatingSchools / selectedCompetition.regions.length)} مدرسة
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  إحصائيات المشاركة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">توزيع المشاركين حسب الجنس</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>طلاب</span>
                          <span>{selectedCompetition.statistics.maleParticipants.toLocaleString()}</span>
                        </div>
                        <Progress 
                          value={(selectedCompetition.statistics.maleParticipants / selectedCompetition.participatingStudents) * 100} 
                          className="h-2"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>طالبات</span>
                          <span>{selectedCompetition.statistics.femaleParticipants.toLocaleString()}</span>
                        </div>
                        <Progress 
                          value={(selectedCompetition.statistics.femaleParticipants / selectedCompetition.participatingStudents) * 100} 
                          className="h-2"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">معدل الإنجاز</h4>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">
                        {selectedCompetition.statistics.completionRate}%
                      </div>
                      <div className="text-sm text-gray-500">معدل إكمال المسابقة</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schools" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>المدارس المشاركة</CardTitle>
                <CardDescription>
                  {selectedCompetition.participatingSchools} مدرسة من أصل {selectedCompetition.totalSchools}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <School className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>سيتم عرض قائمة المدارس المشاركة هنا</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  تقدم المسابقة
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
                          <AlertCircle className="h-5 w-5 text-gray-400" />
                        )}
                        <span className={completed ? 'text-green-700 dark:text-green-300' : 'text-gray-600'}>
                          {key === 'registrationComplete' && 'اكتمال التسجيل'}
                          {key === 'materialsDistributed' && 'توزيع المواد'}
                          {key === 'competitionStarted' && 'بدء المسابقة'}
                          {key === 'resultsSubmitted' && 'تسليم النتائج'}
                          {key === 'certificatesIssued' && 'إصدار الشهادات'}
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
                    نتائج المسابقة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedCompetition.results.map((result, index) => (
                      <div key={result.schoolId} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                            result.rank === 1 ? 'bg-yellow-500' :
                            result.rank === 2 ? 'bg-gray-400' :
                            result.rank === 3 ? 'bg-orange-500' : 'bg-blue-500'
                          }`}>
                            {result.rank}
                          </div>
                          <div>
                            <h4 className="font-medium">{result.schoolName}</h4>
                            <p className="text-sm text-gray-500">
                              {result.region} • {result.studentsCount} طالب مشارك
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{result.score}%</div>
                          <div className="text-sm text-gray-500">النتيجة</div>
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
            إدارة المسابقات - ولاية {selectedProvince.arabicName}
          </CardTitle>
          <CardDescription className="text-yellow-100">
            متابعة وإدارة المسابقات على مستوى الولاية مع تتبع شامل عبر جميع المدارس
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
                {competitions.filter(c => c.status === 'active').length}
              </div>
              <div className="text-sm text-yellow-100">مسابقات نشطة</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">
                {competitions.reduce((acc, c) => acc + c.participatingSchools, 0)}
              </div>
              <div className="text-sm text-yellow-100">مدارس مشاركة</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">
                {competitions.reduce((acc, c) => acc + c.participatingStudents, 0).toLocaleString()}
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
                    {competition.status === 'active' && 'نشطة'}
                    {competition.status === 'completed' && 'مكتملة'}
                    {competition.status === 'cancelled' && 'ملغية'}
                  </Badge>
                </div>
                <Badge variant="outline">
                  {competition.category === 'fitness' && 'لياقة بدنية'}
                  {competition.category === 'sports' && 'رياضية'}
                  {competition.category === 'academic' && 'أكاديمية'}
                  {competition.category === 'cultural' && 'ثقافية'}
                </Badge>
              </div>
              
              <CardTitle className="text-lg">{competition.title}</CardTitle>
              <CardDescription>{competition.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Competition Stats */}
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <div className="text-lg font-bold text-blue-600">{competition.participatingSchools}</div>
                  <div className="text-xs text-gray-500">مدرسة</div>
                </div>
                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <div className="text-lg font-bold text-green-600">
                    {competition.participatingStudents.toLocaleString()}
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

              {/* Dates and Coordinator */}
              <div className="text-sm text-gray-500 space-y-1">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  <span>{competition.startDate} - {competition.endDate}</span>
                </div>
                <div>المنسق: {competition.coordinator}</div>
                <div>{competition.regions.length} مناطق مشاركة</div>
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
              إنشاء مسابقة جديدة
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