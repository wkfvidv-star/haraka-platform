'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { 
  ArrowLeft,
  Trophy,
  Calendar,
  MapPin,
  Users,
  Clock,
  Flag,
  Award,
  Medal,
  Target,
  Star,
  Download,
  Edit,
  UserPlus,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react'

interface CompetitionDetail {
  id: string
  name: string
  sport: string
  type: 'individual' | 'team'
  status: 'upcoming' | 'active' | 'completed' | 'cancelled'
  startDate: string
  endDate: string
  location: string
  participants: number
  maxParticipants: number
  registrationDeadline: string
  description: string
  prizes: string[]
  organizer: string
  rules: string[]
  categories: string[]
}

interface CompetitionParticipant {
  id: string
  name: string
  school: string
  region: string
  category: string
  registrationDate: string
  status: 'registered' | 'confirmed' | 'disqualified'
  score?: number
  rank?: number
  teamMembers?: string[]
}

interface CompetitionSchedule {
  id: string
  date: string
  time: string
  event: string
  location: string
  participants: string[]
  status: 'scheduled' | 'ongoing' | 'completed'
}

export default function CompetitionDetailPage() {
  const params = useParams()
  const competitionId = params.id as string
  
  const [competition, setCompetition] = useState<CompetitionDetail | null>(null)
  const [participants, setParticipants] = useState<CompetitionParticipant[]>([])
  const [schedule, setSchedule] = useState<CompetitionSchedule[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockCompetition: CompetitionDetail = {
      id: competitionId,
      name: 'بطولة المملكة لكرة القدم للمدارس',
      sport: 'كرة القدم',
      type: 'team',
      status: 'active',
      startDate: '2025-01-15T09:00:00Z',
      endDate: '2025-02-15T18:00:00Z',
      location: 'الرياض - ملعب الملك فهد الدولي',
      participants: 240,
      maxParticipants: 320,
      registrationDeadline: '2025-01-10T23:59:59Z',
      description: 'بطولة وطنية لكرة القدم للمدارس الثانوية على مستوى المملكة العربية السعودية. تهدف البطولة إلى تطوير المواهب الرياضية وتعزيز روح المنافسة الشريفة بين الطلاب.',
      prizes: ['كأس ذهبي للفريق الفائز', 'ميداليات ذهبية وفضية وبرونزية', 'شهادات تقدير لجميع المشاركين', 'جوائز مالية للفرق الثلاثة الأولى'],
      organizer: 'وزارة التعليم بالتعاون مع الاتحاد السعودي لكرة القدم',
      rules: [
        'يجب أن يكون جميع اللاعبين مسجلين في المدارس الثانوية',
        'عمر اللاعبين يجب أن يكون بين 15-18 سنة',
        'كل فريق يتكون من 11 لاعب أساسي و7 احتياط',
        'مدة المباراة 90 دقيقة مقسمة على شوطين',
        'يتم اللعب وفقاً لقوانين الفيفا الدولية'
      ],
      categories: ['تحت 16 سنة - بنين', 'تحت 18 سنة - بنين', 'تحت 16 سنة - بنات', 'تحت 18 سنة - بنات']
    }

    const mockParticipants: CompetitionParticipant[] = [
      {
        id: 'part-001',
        name: 'فريق مدرسة الملك فهد الثانوية',
        school: 'مدرسة الملك فهد الثانوية',
        region: 'الرياض',
        category: 'تحت 18 سنة - بنين',
        registrationDate: '2025-01-05T10:30:00Z',
        status: 'confirmed',
        score: 85,
        rank: 3,
        teamMembers: ['أحمد محمد', 'سالم علي', 'فهد عبدالله', 'محمد سعد']
      },
      {
        id: 'part-002',
        name: 'فريق مدرسة الأميرة نورا',
        school: 'مدرسة الأميرة نورا',
        region: 'مكة المكرمة',
        category: 'تحت 16 سنة - بنات',
        registrationDate: '2025-01-03T14:20:00Z',
        status: 'confirmed',
        score: 92,
        rank: 1,
        teamMembers: ['سارة أحمد', 'نورا محمد', 'فاطمة علي', 'مريم سالم']
      },
      {
        id: 'part-003',
        name: 'فريق مدرسة الدمام النموذجية',
        school: 'مدرسة الدمام النموذجية',
        region: 'المنطقة الشرقية',
        category: 'تحت 18 سنة - بنين',
        registrationDate: '2025-01-02T09:15:00Z',
        status: 'registered',
        teamMembers: ['محمد سالم', 'عبدالله أحمد', 'سعد محمد', 'علي فهد']
      }
    ]

    const mockSchedule: CompetitionSchedule[] = [
      {
        id: 'sched-001',
        date: '2025-01-15',
        time: '09:00',
        event: 'مراسم الافتتاح',
        location: 'ملعب الملك فهد الدولي - الرياض',
        participants: ['جميع الفرق'],
        status: 'completed'
      },
      {
        id: 'sched-002',
        date: '2025-01-16',
        time: '14:00',
        event: 'الدور الأول - المجموعة أ',
        location: 'ملعب الملك فهد الدولي - الرياض',
        participants: ['فريق الملك فهد', 'فريق الأميرة نورا'],
        status: 'ongoing'
      },
      {
        id: 'sched-003',
        date: '2025-01-18',
        time: '16:00',
        event: 'الدور الأول - المجموعة ب',
        location: 'ملعب الأمير فيصل - جدة',
        participants: ['فريق الدمام النموذجية', 'فريق الرياض الحديثة'],
        status: 'scheduled'
      }
    ]

    setTimeout(() => {
      setCompetition(mockCompetition)
      setParticipants(mockParticipants)
      setSchedule(mockSchedule)
      setIsLoading(false)
    }, 1000)
  }, [competitionId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800'
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming': return 'قادمة'
      case 'active': return 'جارية'
      case 'completed': return 'مكتملة'
      case 'cancelled': return 'ملغية'
      default: return 'غير محدد'
    }
  }

  const getParticipantStatusColor = (status: string) => {
    switch (status) {
      case 'registered': return 'bg-blue-100 text-blue-800'
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'disqualified': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getParticipantStatusText = (status: string) => {
    switch (status) {
      case 'registered': return 'مسجل'
      case 'confirmed': return 'مؤكد'
      case 'disqualified': return 'مستبعد'
      default: return 'غير محدد'
    }
  }

  const getScheduleStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'ongoing': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getScheduleStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'مجدول'
      case 'ongoing': return 'جاري'
      case 'completed': return 'مكتمل'
      default: return 'غير محدد'
    }
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-yellow-100 text-yellow-800'
    if (rank <= 3) return 'bg-gray-100 text-gray-800'
    if (rank <= 10) return 'bg-blue-100 text-blue-800'
    return 'bg-gray-50 text-gray-600'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات المسابقة...</p>
        </div>
      </div>
    )
  }

  if (!competition) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center" dir="rtl">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">المسابقة غير موجودة</h3>
            <p className="text-red-600 mb-4">لم يتم العثور على بيانات المسابقة المطلوبة</p>
            <Button onClick={() => window.history.back()} variant="outline">
              العودة
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 py-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            العودة للمسابقات
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{competition.name}</h1>
              <p className="text-gray-600 mb-4">{competition.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {competition.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(competition.startDate)} - {formatDate(competition.endDate)}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {competition.participants}/{competition.maxParticipants} مشارك
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(competition.status)}>
                {getStatusText(competition.status)}
              </Badge>
              <Badge variant="outline">
                {competition.sport}
              </Badge>
            </div>
          </div>
        </div>

        {/* Competition Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{competition.participants}</div>
              <div className="text-sm text-gray-600">مشارك</div>
              <Progress value={(competition.participants / competition.maxParticipants) * 100} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{competition.categories.length}</div>
              <div className="text-sm text-gray-600">فئة</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{competition.prizes.length}</div>
              <div className="text-sm text-gray-600">جائزة</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {Math.ceil((new Date(competition.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
              </div>
              <div className="text-sm text-gray-600">يوم متبقي</div>
            </CardContent>
          </Card>
        </div>

        {/* Registration Alert */}
        {competition.status === 'upcoming' && (
          <Alert className="mb-8 border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">التسجيل مفتوح</AlertTitle>
            <AlertDescription className="text-blue-700">
              آخر موعد للتسجيل: {formatDateTime(competition.registrationDeadline)}
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="details" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="details">التفاصيل</TabsTrigger>
            <TabsTrigger value="participants">المشاركون</TabsTrigger>
            <TabsTrigger value="schedule">الجدول</TabsTrigger>
            <TabsTrigger value="results">النتائج</TabsTrigger>
            <TabsTrigger value="management">الإدارة</TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-600" />
                    معلومات المسابقة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">المنظم</label>
                    <p className="text-gray-900">{competition.organizer}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">نوع المسابقة</label>
                    <p className="text-gray-900">{competition.type === 'team' ? 'جماعية' : 'فردية'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">الفئات</label>
                    <div className="space-y-1">
                      {competition.categories.map((category, index) => (
                        <Badge key={index} variant="outline" className="mr-2 mb-1">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-purple-600" />
                    الجوائز
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {competition.prizes.map((prize, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Medal className="h-4 w-4 text-yellow-600" />
                        <span>{prize}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  قوانين المسابقة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {competition.rules.map((rule, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Participants Tab */}
          <TabsContent value="participants" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    المشاركون ({participants.length})
                  </div>
                  <Button className="bg-yellow-600 hover:bg-yellow-700">
                    <UserPlus className="h-4 w-4 ml-2" />
                    إضافة مشارك
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {participants.map((participant) => (
                    <div key={participant.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{participant.name}</h3>
                          <p className="text-sm text-gray-600">
                            {participant.school} • {participant.region}
                          </p>
                          <p className="text-sm text-gray-500">{participant.category}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {participant.rank && (
                            <Badge className={getRankBadge(participant.rank)}>
                              #{participant.rank}
                            </Badge>
                          )}
                          <Badge className={getParticipantStatusColor(participant.status)}>
                            {getParticipantStatusText(participant.status)}
                          </Badge>
                        </div>
                      </div>

                      {participant.teamMembers && (
                        <div className="mb-3">
                          <label className="text-sm font-medium text-gray-700 mb-1 block">أعضاء الفريق</label>
                          <div className="flex flex-wrap gap-1">
                            {participant.teamMembers.map((member, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {member}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          تاريخ التسجيل: {formatDateTime(participant.registrationDate)}
                        </div>
                        {participant.score && (
                          <div className="text-sm">
                            <span className="text-gray-500">النتيجة: </span>
                            <span className="font-medium text-blue-600">{participant.score}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  جدول المسابقة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {schedule.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-sm font-medium">{event.date}</div>
                          <div className="text-xs text-gray-500">{event.time}</div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{event.event}</h3>
                          <p className="text-sm text-gray-600">{event.location}</p>
                          <p className="text-xs text-gray-500">
                            المشاركون: {event.participants.join(', ')}
                          </p>
                        </div>
                      </div>
                      <Badge className={getScheduleStatusColor(event.status)}>
                        {getScheduleStatusText(event.status)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Medal className="h-5 w-5 text-yellow-600" />
                  النتائج والترتيب
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">النتائج النهائية</h3>
                  <p className="text-gray-600">
                    {competition.status === 'completed' 
                      ? 'عرض النتائج النهائية والترتيبات' 
                      : 'النتائج ستكون متاحة بعد انتهاء المسابقة'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Management Tab */}
          <TabsContent value="management" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flag className="h-5 w-5 text-red-600" />
                  إدارة المسابقة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-16 flex-col">
                    <Edit className="h-6 w-6 mb-2" />
                    تعديل المسابقة
                  </Button>
                  <Button variant="outline" className="h-16 flex-col">
                    <UserPlus className="h-6 w-6 mb-2" />
                    إدارة المشاركين
                  </Button>
                  <Button variant="outline" className="h-16 flex-col">
                    <Calendar className="h-6 w-6 mb-2" />
                    تعديل الجدول
                  </Button>
                  <Button variant="outline" className="h-16 flex-col">
                    <Download className="h-6 w-6 mb-2" />
                    تصدير البيانات
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}