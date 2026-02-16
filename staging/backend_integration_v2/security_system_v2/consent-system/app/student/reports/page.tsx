'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Search,
  Filter,
  Download,
  Eye,
  Award,
  Target,
  Clock
} from 'lucide-react'

interface Report {
  reportId: string
  sessionId: string
  exerciseType: string
  overallScore: number
  createdAt: string
  status: 'completed' | 'processing' | 'failed'
  insights: {
    strengths: string[]
    improvements: string[]
  }
}

export default function StudentReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [filteredReports, setFilteredReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [exerciseFilter, setExerciseFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  // Mock data - in real app, fetch from API
  useEffect(() => {
    const mockReports: Report[] = [
      {
        reportId: 'report-001',
        sessionId: 'session-001',
        exerciseType: 'كرة القدم',
        overallScore: 88,
        createdAt: '2025-01-08T10:30:00Z',
        status: 'completed',
        insights: {
          strengths: ['دقة التصويب', 'السرعة'],
          improvements: ['التوازن', 'التحكم بالكرة']
        }
      },
      {
        reportId: 'report-002',
        sessionId: 'session-002',
        exerciseType: 'الجري',
        overallScore: 82,
        createdAt: '2025-01-07T14:15:00Z',
        status: 'completed',
        insights: {
          strengths: ['التحمل', 'الإيقاع'],
          improvements: ['وضعية الجسم', 'التنفس']
        }
      },
      {
        reportId: 'report-003',
        sessionId: 'session-003',
        exerciseType: 'كرة السلة',
        overallScore: 75,
        createdAt: '2025-01-06T16:45:00Z',
        status: 'completed',
        insights: {
          strengths: ['القفز', 'التناسق'],
          improvements: ['دقة الرمي', 'الحركة الجانبية']
        }
      }
    ]

    setTimeout(() => {
      setReports(mockReports)
      setFilteredReports(mockReports)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter and search logic
  useEffect(() => {
    let filtered = reports

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(report => 
        report.exerciseType.includes(searchTerm) ||
        report.reportId.includes(searchTerm)
      )
    }

    // Apply exercise type filter
    if (exerciseFilter !== 'all') {
      filtered = filtered.filter(report => report.exerciseType === exerciseFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'highest_score':
          return b.overallScore - a.overallScore
        case 'lowest_score':
          return a.overallScore - b.overallScore
        default:
          return 0
      }
    })

    setFilteredReports(filtered)
  }, [reports, searchTerm, exerciseFilter, sortBy])

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-100'
    if (score >= 70) return 'text-blue-600 bg-blue-100'
    if (score >= 60) return 'text-orange-600 bg-orange-100'
    return 'text-red-600 bg-red-100'
  }

  const getScoreGrade = (score: number) => {
    if (score >= 90) return 'A+'
    if (score >= 85) return 'A'
    if (score >= 80) return 'B+'
    if (score >= 75) return 'B'
    if (score >= 70) return 'C+'
    if (score >= 65) return 'C'
    return 'D'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل التقارير...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">تقاريري الرياضية</h1>
          <p className="text-gray-600">عرض وتحليل جميع تقارير الأداء الرياضي</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">إجمالي التقارير</p>
                  <p className="text-2xl font-bold">{reports.length}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">متوسط النتيجة</p>
                  <p className="text-2xl font-bold">
                    {reports.length > 0 ? Math.round(reports.reduce((sum, r) => sum + r.overallScore, 0) / reports.length) : 0}%
                  </p>
                </div>
                <Target className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">أعلى نتيجة</p>
                  <p className="text-2xl font-bold">
                    {reports.length > 0 ? Math.max(...reports.map(r => r.overallScore)) : 0}%
                  </p>
                </div>
                <Award className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">آخر تقرير</p>
                  <p className="text-2xl font-bold">
                    {reports.length > 0 ? 'منذ يوم' : 'لا يوجد'}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="البحث في التقارير..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
              </div>
              
              <Select value={exerciseFilter} onValueChange={setExerciseFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="نوع التمرين" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع التمارين</SelectItem>
                  <SelectItem value="كرة القدم">كرة القدم</SelectItem>
                  <SelectItem value="كرة السلة">كرة السلة</SelectItem>
                  <SelectItem value="الجري">الجري</SelectItem>
                  <SelectItem value="القفز">القفز</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="ترتيب حسب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">الأحدث</SelectItem>
                  <SelectItem value="oldest">الأقدم</SelectItem>
                  <SelectItem value="highest_score">أعلى نتيجة</SelectItem>
                  <SelectItem value="lowest_score">أقل نتيجة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد تقارير</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || exerciseFilter !== 'all' 
                    ? 'لم يتم العثور على تقارير تطابق البحث' 
                    : 'لم تقم برفع أي فيديوهات بعد'}
                </p>
                <Button onClick={() => window.location.href = '/student/upload'}>
                  رفع فيديو جديد
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredReports.map((report) => (
              <Card key={report.reportId} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-lg font-semibold">{report.exerciseType}</h3>
                        <Badge variant="outline">{report.status === 'completed' ? 'مكتمل' : 'قيد المعالجة'}</Badge>
                        <Badge className={`${getScoreColor(report.overallScore)} border-0`}>
                          {getScoreGrade(report.overallScore)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(report.createdAt)}
                        </span>
                        <span>معرف التقرير: {report.reportId}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-green-800 mb-1">نقاط القوة:</p>
                          <div className="flex flex-wrap gap-1">
                            {report.insights.strengths.map((strength, index) => (
                              <Badge key={index} variant="secondary" className="text-xs bg-green-100 text-green-800">
                                {strength}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-orange-800 mb-1">للتحسين:</p>
                          <div className="flex flex-wrap gap-1">
                            {report.insights.improvements.map((improvement, index) => (
                              <Badge key={index} variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                                {improvement}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-4 ml-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-1">
                          {report.overallScore}%
                        </div>
                        <div className="text-sm text-gray-600">النتيجة الإجمالية</div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          onClick={() => window.location.href = `/student/reports/${report.reportId}`}
                        >
                          <Eye className="h-4 w-4 ml-1" />
                          عرض
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 ml-1" />
                          تحميل
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Load More Button */}
        {filteredReports.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline">
              تحميل المزيد من التقارير
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}