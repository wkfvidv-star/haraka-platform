import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  Activity,
  AlertTriangle,
  Send,
  Video,
  FileText,
  BrainCircuit,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

import { useTeacherClassData } from '@/hooks/useTeacherClassData';

interface TeacherOverviewPanelProps {
  onNavigate?: (tab: string) => void;
}

export function TeacherOverviewPanel({ onNavigate }: TeacherOverviewPanelProps) {
  const { students, stats, settings } = useTeacherClassData();
  
  // Get active alerts based on student status/progress
  const alerts = useMemo(() => {
    return students
      .filter(s => s.weaknesses.length > 0 || s.status !== 'نشط' || s.progress > 90)
      .slice(0, 4);
  }, [students]);

  return (
    <div className="max-w-7xl mx-auto p-10 space-y-10 bg-white min-h-full">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">مرحباً أستاذ 👋</h1>
          <p className="text-lg text-slate-500 mt-2">إليك ملخص أداء فصولك المستمد من البيانات الحية لـ <span className="font-bold text-slate-700">{settings?.schoolName || 'مؤسستك'}</span>.</p>
        </div>
        
        {/* QUICK ACTIONS */}
        <div className="flex flex-wrap gap-4">
          <Button onClick={() => onNavigate?.('exercises')} variant="outline" size="lg" className="gap-2 text-base font-semibold text-slate-700 border-slate-200 hover:bg-slate-50">
            <Send className="w-5 h-5" />
            إرسال تمرين
          </Button>
          <Button onClick={() => onNavigate?.('video-review')} variant="outline" size="lg" className="gap-2 text-base font-semibold text-slate-700 border-slate-200 hover:bg-slate-50">
            <Video className="w-5 h-5" />
            مراجعة الفيديوهات
          </Button>
          <Button onClick={() => onNavigate?.('reports')} size="lg" className="gap-2 bg-slate-900 text-white hover:bg-slate-800 text-base font-semibold">
            <FileText className="w-5 h-5" />
            تصدير تقرير
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        
        {/* MAIN METRICS */}
        <div className="xl:col-span-2 space-y-10">
          
          {/* OVERVIEW CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-lg text-slate-600 font-semibold">عدد التلاميذ</span>
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                </div>
                <div className="text-5xl font-extrabold text-slate-900">{stats.totalStudents}</div>
                <div className="text-base text-green-600 mt-4 flex items-center gap-2 font-semibold">
                  <TrendingUp className="w-4 h-4" />
                  <span>{stats.activeStudents} نشطين حالياً</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-lg text-slate-600 font-semibold">متوسط التقدم</span>
                  <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                    <Activity className="w-6 h-6" />
                  </div>
                </div>
                <div className="text-5xl font-extrabold text-slate-900">{stats.averageProgress}%</div>
                <div className="text-base text-slate-500 mt-4 font-medium">معدل نقاط القسم العام</div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-lg text-slate-600 font-semibold">تأخر في الإنجاز</span>
                  <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                </div>
                <div className="text-5xl font-extrabold text-slate-900">{stats.inactiveStudents}</div>
                <div className="text-base text-red-600 mt-4 flex items-center gap-2 font-semibold">
                  <AlertCircle className="w-4 h-4" />
                  <span>تلاميذ بحاجة لمتابعة</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ALERTS SECTION (Realistic Data) */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">تنبيهات الحالات الفردية</h2>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="divide-y divide-slate-200">
                {alerts.map((student, idx) => (
                  <div key={idx} className="p-6 flex items-center justify-between hover:bg-white transition-colors">
                    <div className="flex items-center gap-5">
                      <div className={`w-3 h-3 rounded-full ${student.progress > 90 ? 'bg-green-500' : student.status === 'متأخر' ? 'bg-orange-500' : 'bg-red-500'}`}></div>
                      <div>
                        <p className="text-lg font-bold text-slate-900">{student.name}</p>
                        <p className="text-base text-slate-600 mt-1">
                          {student.progress > 90 
                            ? `أداء استثنائي - التقدم: ${student.progress}%` 
                            : student.weaknesses.length > 0 
                              ? `نقطة ضعف مسجلة: ${student.weaknesses.join('، ')}`
                              : `الحالة الحالية: ${student.status}`}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" className="text-slate-600 font-semibold text-base">
                      {student.progress > 90 ? 'منح مكافأة' : 'مراسلة'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SIDE BAR (AI ASSISTANT) */}
        <div className="xl:col-span-1">
          <Card className="border-slate-200 shadow-sm bg-slate-50/50 sticky top-10">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl font-bold flex items-center gap-3 text-slate-900">
                <BrainCircuit className="w-7 h-7 text-indigo-600" />
                المساعد الذكي (AI)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Dynamic Warning generated from data */}
              {alerts.filter(a => a.weaknesses.includes('توازن')).map(student => (
                <div key={`ai-${student.id}`} className="bg-white p-6 border border-indigo-100 rounded-xl shadow-sm">
                  <p className="text-base text-slate-700 leading-relaxed mb-4">
                    <span className="font-extrabold text-slate-900 block mb-2 text-lg">تنبيه مُخصص:</span>
                    التلميذ <span className="font-bold">{student.name}</span> يعاني من ضعف واضح في اختبار التوازن. يُنصح بإسناد مجموعة "تمارين التنسيق المستوى الأول" له.
                  </p>
                  <Button className="w-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 shadow-none text-base font-bold h-12">
                    إسناد التمرين الفردي
                  </Button>
                </div>
              ))}

              <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                <p className="text-base text-slate-700 leading-relaxed mb-4">
                  <span className="font-extrabold text-slate-900 block mb-2 text-lg">نظرة عامة على الأقسام:</span>
                  بناءً على التقييمات الأخيرة، متوسط تقدم قسم الابتدائي ارتفع إلى 70%، بينما تأخر 3 طلاب عن التسليم.
                </p>
                <Button variant="outline" className="w-full border-slate-300 text-slate-700 font-semibold h-12 text-base">
                  عرض التقرير المفصل
                </Button>
              </div>

            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
