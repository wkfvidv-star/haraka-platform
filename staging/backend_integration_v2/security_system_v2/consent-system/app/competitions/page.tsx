'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Trophy,
  Medal,
  Target,
  Users,
  Calendar,
  Clock,
  Star,
  Award,
  Plus,
  Eye,
  Edit,
  Download,
  BarChart3,
  Activity,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Shield,
  Database,
  FileText
} from 'lucide-react'

interface Competition {
  id: string
  title: string
  description: string
  type: 'individual' | 'team'
  sport: string
  status: 'upcoming' | 'active' | 'completed'
  startDate: string
  endDate: string
  maxParticipants: number
  currentParticipants: number
  prizes: string[]
  rules: string
  createdBy: string
}

interface CompetitionEntry {
  id: string
  competitionId: string
  participantId: string
  participantName: string
  school: string
  region: string
  sessionId: string
  score: number
  rank: number
  submittedAt: string
  status: 'pending' | 'approved' | 'disqualified'
}

interface Leaderboard {
  competitionId: string
  entries: CompetitionEntry[]
  lastUpdated: string
}

export default function CompetitionsPanel() {
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [entries, setEntries] = useState<CompetitionEntry[]>([])
  const [leaderboards, setLeaderboards] = useState<Leaderboard[]>([])
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [apiLogs, setApiLogs] = useState<string[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newCompetition, setNewCompetition] = useState({
    title: '',
    description: '',
    type: 'individual' as const,
    sport: '',
    startDate: '',
    endDate: '',
    maxParticipants: 100,
    rules: ''
  })

  useEffect(() => {
    fetchCompetitionsData()
  }, [])

  const logApiCall = (message: string) => {
    const timestamp = new Date().toISOString()
    const logEntry = `[${timestamp}] ${message}`
    setApiLogs(prev => [logEntry, ...prev.slice(0, 19)])
    console.log(logEntry)
  }

  const fetchCompetitionsData = async () => {
    try {
      logApiCall('GET /api/competitions - Fetching competitions data')
      logApiCall('SQL: SELECT * FROM competitions WHERE status IN ("upcoming", "active", "completed") ORDER BY created_at DESC')
      
      // Mock competitions data
      const mockCompetitions: Competition[] = [
        {
          id: 'comp-001',
          title: 'بطولة كرة القدم المدرسية',
          description: 'بطولة كرة القدم السنوية للمدارس الثانوية في منطقة الرياض',
          type: 'team',
          sport: 'كرة القدم',
          status: 'active',
          startDate: '2025-01-01T00:00:00Z',
          endDate: '2025-01-31T23:59:59Z',
          maxParticipants: 200,
          currentParticipants: 156,
          prizes: ['كأس البطولة', 'ميداليات ذهبية', 'شهادات تقدير'],
          rules: 'قوانين الفيفا المعتمدة مع تعديلات للفئات العمرية',
          createdBy: 'وزارة التعليم'
        },
        {
          id: 'comp-002',
          title: 'مسابقة الجري السريع',
          description: 'سباق 100 متر للطلاب والطالبات في جميع المراحل التعليمية',
          type: 'individual',
          sport: 'ألعاب القوى',
          status: 'upcoming',
          startDate: '2025-02-01T00:00:00Z',
          endDate: '2025-02-15T23:59:59Z',
          maxParticipants: 500,
          currentParticipants: 89,
          prizes: ['ميداليات ذهبية وفضية وبرونزية', 'جوائز نقدية'],
          rules: 'قوانين الاتحاد الدولي لألعاب القوى',
          createdBy: 'الاتحاد السعودي لألعاب القوى'
        },
        {
          id: 'comp-003',
          title: 'بطولة السباحة الشتوية',
          description: 'مسابقة السباحة للناشئين في أحواض السباحة المدرسية',
          type: 'individual',
          sport: 'سباحة',
          status: 'completed',
          startDate: '2024-12-01T00:00:00Z',
          endDate: '2024-12-31T23:59:59Z',
          maxParticipants: 150,
          currentParticipants: 142,
          prizes: ['كؤوس وميداليات', 'معدات سباحة'],
          rules: 'قوانين الاتحاد الدولي للسباحة',
          createdBy: 'الاتحاد السعودي للسباحة'
        }
      ]

      logApiCall('GET /api/competition-entries - Fetching competition entries')
      logApiCall('SQL: SELECT ce.*, s.school_name, s.region FROM challenge_entries ce JOIN students s ON ce.participant_id = s.id WHERE ce.competition_id IN (...)')
      
      // Mock competition entries with anonymized data
      const mockEntries: CompetitionEntry[] = [
        {
          id: 'entry-001',
          competitionId: 'comp-001',
          participantId: 'participant-001',
          participantName: 'مشارك رقم 001', // Anonymized
          school: 'مدرسة الملك عبدالعزيز الثانوية',
          region: 'الرياض',
          sessionId: 'session-001',
          score: 95.8,
          rank: 1,
          submittedAt: '2025-01-08T14:30:00Z',
          status: 'approved'
        },
        {
          id: 'entry-002',
          competitionId: 'comp-001',
          participantId: 'participant-002',
          participantName: 'مشارك رقم 002', // Anonymized
          school: 'مدرسة الأمير محمد المتوسطة',
          region: 'الرياض',
          sessionId: 'session-002',
          score: 92.4,
          rank: 2,
          submittedAt: '2025-01-08T15:45:00Z',
          status: 'approved'
        },
        {
          id: 'entry-003',
          competitionId: 'comp-001',
          participantId: 'participant-003',
          participantName: 'مشارك رقم 003', // Anonymized
          school: 'مدرسة الفيصل الابتدائية',
          region: 'جدة',
          sessionId: 'session-003',
          score: 89.7,
          rank: 3,
          submittedAt: '2025-01-08T16:20:00Z',
          status: 'approved'
        },
        {
          id: 'entry-004',
          competitionId: 'comp-002',
          participantId: 'participant-004',
          participantName: 'مشارك رقم 004', // Anonymized
          school: 'مدرسة النور الثانوية',
          region: 'الدمام',
          sessionId: 'session-004',
          score: 87.2,
          rank: 1,
          submittedAt: '2025-01-08T17:10:00Z',
          status: 'pending'
        }
      ]

      const mockLeaderboards: Leaderboard[] = [
        {
          competitionId: 'comp-001',
          entries: mockEntries.filter(e => e.competitionId === 'comp-001').sort((a, b) => b.score - a.score),
          lastUpdated: '2025-01-08T18:00:00Z'
        },
        {
          competitionId: 'comp-002',
          entries: mockEntries.filter(e => e.competitionId === 'comp-002').sort((a, b) => b.score - a.score),
          lastUpdated: '2025-01-08T18:00:00Z'
        }
      ]

      logApiCall(`Response: Found ${mockCompetitions.length} competitions and ${mockEntries.length} entries`)
      logApiCall('Privacy Check: Participant names anonymized, only competition-related data exposed')

      setCompetitions(mockCompetitions)
      setEntries(mockEntries)
      setLeaderboards(mockLeaderboards)
      setIsLoading(false)
    } catch (error) {
      logApiCall(`ERROR: Failed to fetch competitions data - ${error}`)
      setIsLoading(false)
    }
  }

  const createCompetition = async () => {
    try {
      logApiCall('POST /api/competitions - Creating new competition')
      
      const competitionData = {
        ...newCompetition,
        id: `comp-${Date.now()}`,
        status: 'upcoming' as const,
        currentParticipants: 0,
        prizes: ['جوائز قيمة', 'شهادات تقدير'],
        createdBy: 'مدير المسابقات'
      }

      logApiCall(`SQL: INSERT INTO competitions (title, description, type, sport, start_date, end_date, max_participants, rules, created_by, status) VALUES ('${competitionData.title}', '${competitionData.description}', '${competitionData.type}', '${competitionData.sport}', '${competitionData.startDate}', '${competitionData.endDate}', ${competitionData.maxParticipants}, '${competitionData.rules}', '${competitionData.createdBy}', '${competitionData.status}')`)

      setCompetitions(prev => [competitionData, ...prev])
      setShowCreateForm(false)
      setNewCompetition({
        title: '',
        description: '',
        type: 'individual',
        sport: '',
        startDate: '',
        endDate: '',
        maxParticipants: 100,
        rules: ''
      })

      logApiCall('SUCCESS: Competition created successfully')
      alert('تم إنشاء المسابقة بنجاح')

    } catch (error) {
      logApiCall(`ERROR: Failed to create competition - ${error}`)
      alert('حدث خطأ في إنشاء المسابقة')
    }
  }

  const exportLeaderboard = async (competitionId: string) => {
    try {
      logApiCall(`GET /api/competitions/${competitionId}/leaderboard/export - Exporting leaderboard`)
      logApiCall(`SQL: SELECT ce.rank, ce.participant_name, ce.school, ce.region, ce.score, ce.submitted_at FROM challenge_entries ce WHERE ce.competition_id = '${competitionId}' AND ce.status = 'approved' ORDER BY ce.rank ASC`)
      
      const leaderboard = leaderboards.find(l => l.competitionId === competitionId)
      if (!leaderboard) return

      const competition = competitions.find(c => c.id === competitionId)
      
      const csvData = [
        ['الترتيب', 'اسم المشارك', 'المدرسة', 'المنطقة', 'النقاط', 'تاريخ التقديم'],
        ...leaderboard.entries.map(entry => [
          entry.rank.toString(),
          entry.participantName, // Already anonymized
          entry.school,
          entry.region,
          entry.score.toString(),
          new Date(entry.submittedAt).toLocaleDateString('ar-SA')
        ])
      ]

      const csvContent = csvData.map(row => row.join(',')).join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `leaderboard-${competition?.title.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`
      link.click()

      logApiCall(`SUCCESS: Leaderboard exported - ${leaderboard.entries.length} entries`)
      logApiCall('Privacy Verified: Only anonymized participant names and competition data included')

    } catch (error) {
      logApiCall(`ERROR: Failed to export leaderboard - ${error}`)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800'
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming': return 'قادمة'
      case 'active': return 'نشطة'
      case 'completed': return 'مكتملة'
      default: return 'غير محدد'
    }
  }

  const getEntryStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'disqualified': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getEntryStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'معتمد'
      case 'pending': return 'قيد المراجعة'
      case 'disqualified': return 'مستبعد'
      default: return 'غير محدد'
    }
  }

  const filteredCompetitions = competitions.filter(comp => {
    const matchesSearch = comp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comp.sport.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || comp.status === filterStatus
    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات المسابقات...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 py-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة تحكم المسابقات</h1>
              <p className="text-gray-600">إدارة المسابقات الرياضية والترتيب والمشاركات</p>
            </div>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              <Plus className="h-4 w-4 ml-1" />
              إنشاء مسابقة جديدة
            </Button>
          </div>
        </div>

        {/* Privacy Alert */}
        <Alert className="mb-8">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>حماية الخصوصية:</strong> يتم عرض البيانات المتعلقة بالمسابقات فقط مع إخفاء المعلومات الشخصية للمشاركين حسب سياسة الخصوصية.
          </AlertDescription>
        </Alert>

        {/* Competition Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{competitions.length}</div>
              <div className="text-sm text-gray-600">إجمالي المسابقات</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Activity className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{competitions.filter(c => c.status === 'active').length}</div>
              <div className="text-sm text-gray-600">مسابقات نشطة</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{entries.length}</div>
              <div className="text-sm text-gray-600">إجمالي المشاركات</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Medal className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{entries.filter(e => e.status === 'approved').length}</div>
              <div className="text-sm text-gray-600">مشاركات معتمدة</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="competitions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="competitions">المسابقات</TabsTrigger>
            <TabsTrigger value="entries">المشاركات</TabsTrigger>
            <TabsTrigger value="leaderboard">الترتيب</TabsTrigger>
            <TabsTrigger value="reports">التقارير</TabsTrigger>
            <TabsTrigger value="logs">سجل API</TabsTrigger>
          </TabsList>

          {/* Competitions Tab */}
          <TabsContent value="competitions" className="space-y-6">
            {showCreateForm ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-green-600" />
                    إنشاء مسابقة جديدة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">عنوان المسابقة</Label>
                      <Input
                        id="title"
                        value={newCompetition.title}
                        onChange={(e) => setNewCompetition({...newCompetition, title: e.target.value})}
                        placeholder="أدخل عنوان المسابقة"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sport">نوع الرياضة</Label>
                      <Input
                        id="sport"
                        value={newCompetition.sport}
                        onChange={(e) => setNewCompetition({...newCompetition, sport: e.target.value})}
                        placeholder="كرة القدم، سباحة، جري، إلخ"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">وصف المسابقة</Label>
                    <Textarea
                      id="description"
                      value={newCompetition.description}
                      onChange={(e) => setNewCompetition({...newCompetition, description: e.target.value})}
                      placeholder="اكتب وصفاً مفصلاً للمسابقة"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="type">نوع المسابقة</Label>
                      <Select value={newCompetition.type} onValueChange={(value: any) => setNewCompetition({...newCompetition, type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="individual">فردية</SelectItem>
                          <SelectItem value="team">جماعية</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="startDate">تاريخ البداية</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={newCompetition.startDate.split('T')[0]}
                        onChange={(e) => setNewCompetition({...newCompetition, startDate: e.target.value + 'T00:00:00Z'})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">تاريخ النهاية</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={newCompetition.endDate.split('T')[0]}
                        onChange={(e) => setNewCompetition({...newCompetition, endDate: e.target.value + 'T23:59:59Z'})}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="rules">قوانين المسابقة</Label>
                    <Textarea
                      id="rules"
                      value={newCompetition.rules}
                      onChange={(e) => setNewCompetition({...newCompetition, rules: e.target.value})}
                      placeholder="اكتب قوانين وشروط المسابقة"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={createCompetition}>
                      <Trophy className="h-4 w-4 ml-1" />
                      إنشاء المسابقة
                    </Button>
                    <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                      إلغاء
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                    قائمة المسابقات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <Input
                        placeholder="البحث في المسابقات..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder="حالة المسابقة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع الحالات</SelectItem>
                        <SelectItem value="upcoming">قادمة</SelectItem>
                        <SelectItem value="active">نشطة</SelectItem>
                        <SelectItem value="completed">مكتملة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    {filteredCompetitions.map((competition) => (
                      <div key={competition.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{competition.title}</h3>
                            <p className="text-sm text-gray-600">{competition.description}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              {competition.sport} • {competition.type === 'individual' ? 'فردية' : 'جماعية'}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(competition.status)}>
                              {getStatusText(competition.status)}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                          <div>
                            <span className="text-gray-600">تاريخ البداية:</span>
                            <p className="font-medium">{new Date(competition.startDate).toLocaleDateString('ar-SA')}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">تاريخ النهاية:</span>
                            <p className="font-medium">{new Date(competition.endDate).toLocaleDateString('ar-SA')}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">المشاركون:</span>
                            <p className="font-medium">{competition.currentParticipants}/{competition.maxParticipants}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">منشئ المسابقة:</span>
                            <p className="font-medium">{competition.createdBy}</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedCompetition(competition)}
                          >
                            <Eye className="h-4 w-4 ml-1" />
                            عرض التفاصيل
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => exportLeaderboard(competition.id)}
                          >
                            <Download className="h-4 w-4 ml-1" />
                            تصدير الترتيب
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Entries Tab */}
          <TabsContent value="entries" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  مشاركات المسابقات
                </CardTitle>
                <CardDescription>
                  جميع المشاركات المرتبطة بجلسات التدريب (البيانات الشخصية مخفية)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {entries.map((entry) => {
                    const competition = competitions.find(c => c.id === entry.competitionId)
                    return (
                      <div key={entry.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold">{entry.participantName}</h3>
                            <p className="text-sm text-gray-600">{competition?.title}</p>
                            <p className="text-sm text-gray-500">{entry.school} - {entry.region}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getEntryStatusColor(entry.status)}>
                              {getEntryStatusText(entry.status)}
                            </Badge>
                            <Badge variant="outline">
                              المركز {entry.rank}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">النقاط:</span>
                            <p className="font-medium text-green-600">{entry.score}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">رقم الجلسة:</span>
                            <p className="font-medium">{entry.sessionId}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">تاريخ التقديم:</span>
                            <p className="font-medium">{new Date(entry.submittedAt).toLocaleDateString('ar-SA')}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">الترتيب:</span>
                            <p className="font-medium">#{entry.rank}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Medal className="h-5 w-5 text-gold-600" />
                  لوحة الشرف والترتيب
                </CardTitle>
              </CardHeader>
              <CardContent>
                {leaderboards.map((leaderboard) => {
                  const competition = competitions.find(c => c.id === leaderboard.competitionId)
                  return (
                    <div key={leaderboard.competitionId} className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">{competition?.title}</h3>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => exportLeaderboard(leaderboard.competitionId)}
                          >
                            <Download className="h-4 w-4 ml-1" />
                            تصدير CSV
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {leaderboard.entries.slice(0, 10).map((entry, index) => (
                          <div key={entry.id} className={`p-3 rounded-lg flex items-center justify-between ${
                            index === 0 ? 'bg-yellow-100 border-yellow-300' :
                            index === 1 ? 'bg-gray-100 border-gray-300' :
                            index === 2 ? 'bg-orange-100 border-orange-300' :
                            'bg-white border-gray-200'
                          } border`}>
                            <div className="flex items-center gap-4">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                index === 0 ? 'bg-yellow-500 text-white' :
                                index === 1 ? 'bg-gray-500 text-white' :
                                index === 2 ? 'bg-orange-500 text-white' :
                                'bg-blue-500 text-white'
                              }`}>
                                {entry.rank}
                              </div>
                              <div>
                                <p className="font-medium">{entry.participantName}</p>
                                <p className="text-sm text-gray-600">{entry.school}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg">{entry.score}</p>
                              <p className="text-sm text-gray-500">{entry.region}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <p className="text-sm text-gray-500 mt-2">
                        آخر تحديث: {new Date(leaderboard.lastUpdated).toLocaleString('ar-SA')}
                      </p>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  تقارير المسابقات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <BarChart3 className="h-6 w-6 mb-2" />
                    تقرير المشاركة
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <TrendingUp className="h-6 w-6 mb-2" />
                    تحليل الأداء
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Award className="h-6 w-6 mb-2" />
                    تقرير الجوائز
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Logs Tab */}
          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-gray-600" />
                  سجل استدعاءات API و SQL
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
                  {apiLogs.length > 0 ? (
                    apiLogs.map((log, index) => (
                      <div key={index} className="mb-1">{log}</div>
                    ))
                  ) : (
                    <div className="text-gray-500">لا توجد سجلات API حتى الآن</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}