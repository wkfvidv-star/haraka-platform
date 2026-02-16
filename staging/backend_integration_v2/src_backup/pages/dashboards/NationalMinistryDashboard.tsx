import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navigation } from '@/components/layout/Navigation';
import { StatsCard } from '@/components/ui/stats-card';
import { ReportsManager } from '@/components/ministry/ReportsManager';
import { NationalOverview } from '@/components/ministry/NationalOverview';
import { ProvinceComparison } from '@/components/ministry/ProvinceComparison';
import { ReportGenerator } from '@/components/ministry/ReportGenerator';
import { NotificationCenter } from '@/components/ministry/NotificationCenter';
import { useTranslation } from '@/contexts/ThemeContext';
import { 
  MapPin, 
  School, 
  Users, 
  Trophy, 
  FileText,
  TrendingUp,
  BarChart3,
  Bell,
  Calendar,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Award,
  BookOpen,
  MessageSquare,
  Download,
  Upload
} from 'lucide-react';

export default function NationalMinistryDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { t, language } = useTranslation();
  const isRTL = language === 'ar';

  const urgentNotifications = [
    {
      id: 1,
      title: 'تقرير متأخر من ولاية أدرار',
      message: 'لم يتم استلام التقرير الشهري للأنشطة الرياضية',
      type: 'warning',
      time: 'منذ 3 ساعات'
    },
    {
      id: 2,
      title: 'طلب موافقة على مسابقة جديدة',
      message: 'مديرية وهران تطلب الموافقة على بطولة كرة السلة الإقليمية',
      type: 'info',
      time: 'منذ 5 ساعات'
    },
    {
      id: 3,
      title: 'تحديث نظام التقارير',
      message: 'تم تحديث نظام إدارة التقارير بميزات جديدة',
      type: 'success',
      time: 'اليوم'
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'اجتماع مديري التعليم',
      date: '2024-11-05',
      time: '10:00',
      type: 'اجتماع'
    },
    {
      id: 2,
      title: 'موعد تسليم التقارير الفصلية',
      date: '2024-11-10',
      time: '23:59',
      type: 'موعد نهائي'
    },
    {
      id: 3,
      title: 'بطولة الجزائر للرياضة المدرسية',
      date: '2024-11-15',
      time: '09:00',
      type: 'فعالية'
    }
  ];

  const renderDashboard = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-green-700 to-blue-800 text-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl sm:text-2xl">وزارة التربية الوطنية - الجمهورية الجزائرية</CardTitle>
          <CardDescription className="text-green-100">
            لوحة التحكم الرئيسية لإدارة التعليم والأنشطة الرياضية على المستوى الوطني
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold">58</div>
              <div className="text-xs sm:text-sm text-green-100">ولاية</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold">16.7K</div>
              <div className="text-xs sm:text-sm text-green-100">مدرسة</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold">3.2M</div>
              <div className="text-xs sm:text-sm text-green-100">تلميذ</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold">154K</div>
              <div className="text-xs sm:text-sm text-green-100">معلم</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatsCard
          title="التقارير المستلمة"
          value="156"
          description="هذا الشهر"
          icon={FileText}
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="المسابقات النشطة"
          value="24"
          description="على مستوى الوطن"
          icon={Trophy}
          color="green"
          trend={{ value: 3, isPositive: true }}
        />
        <StatsCard
          title="معدل المشاركة"
          value="79%"
          description="في الأنشطة الرياضية"
          icon={Target}
          color="orange"
          trend={{ value: 5.2, isPositive: true }}
        />
        <StatsCard
          title="مؤشر الأداء"
          value="86.2"
          description="المتوسط الوطني"
          icon={TrendingUp}
          color="purple"
          trend={{ value: 2.1, isPositive: true }}
        />
      </div>

      {/* الإشعارات العاجلة */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="h-5 w-5 text-red-500" />
            الإشعارات العاجلة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {urgentNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg border-l-4 ${
                  notification.type === 'warning' 
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400'
                    : notification.type === 'info'
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-400'
                    : 'bg-green-50 dark:bg-green-900/20 border-green-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-sm">{notification.title}</h4>
                  <span className="text-xs text-gray-500">{notification.time}</span>
                </div>
                <p className="text-sm text-gray-600">{notification.message}</p>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" variant="outline">
                    عرض التفاصيل
                  </Button>
                  <Button size="sm" variant="outline">
                    اتخاذ إجراء
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* الأحداث القادمة */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-blue-500" />
            الأحداث والمواعيد القادمة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    event.type === 'اجتماع' ? 'bg-blue-500' :
                    event.type === 'موعد نهائي' ? 'bg-red-500' : 'bg-green-500'
                  }`}>
                    {event.type === 'اجتماع' ? <Users className="h-5 w-5 text-white" /> :
                     event.type === 'موعد نهائي' ? <Clock className="h-5 w-5 text-white" /> :
                     <Trophy className="h-5 w-5 text-white" />}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{event.title}</h4>
                    <p className="text-xs text-gray-500">
                      {new Date(event.date).toLocaleDateString('ar-DZ')} - {event.time}
                    </p>
                  </div>
                </div>
                <Badge variant={
                  event.type === 'اجتماع' ? 'default' :
                  event.type === 'موعد نهائي' ? 'destructive' : 'secondary'
                }>
                  {event.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSchools = () => (
    <div className="space-y-4 sm:space-y-6">
      <NationalOverview />
    </div>
  );

  const renderRegions = () => (
    <div className="space-y-4 sm:space-y-6">
      <ProvinceComparison />
    </div>
  );

  const renderReports = () => (
    <div className="space-y-4 sm:space-y-6">
      <ReportsManager />
      <ReportGenerator />
    </div>
  );

  const renderCompetitions = () => (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Trophy className="h-5 w-5 text-yellow-500" />
            إدارة المسابقات والبطولات الوطنية
          </CardTitle>
          <CardDescription>
            تنظيم ومتابعة جميع المسابقات الرياضية على مستوى الجمهورية
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 mb-1">24</div>
              <div className="text-sm text-gray-600">مسابقات نشطة</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">8,500</div>
              <div className="text-sm text-gray-600">مشارك مسجل</div>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">58</div>
              <div className="text-sm text-gray-600">ولاية مشاركة</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">بطولة الجزائر للرياضة المدرسية 2024</h4>
                <Badge className="bg-green-100 text-green-800">نشطة</Badge>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                <div>المشاركون: 2,840</div>
                <div>الولايات: 58</div>
                <div>الرياضات: 12</div>
                <div>المدة: 15 نوفمبر - 20 ديسمبر</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm">إدارة المسابقة</Button>
                <Button size="sm" variant="outline">عرض النتائج</Button>
                <Button size="sm" variant="outline">تقرير مفصل</Button>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">مسابقة اللياقة البدنية الوطنية</h4>
                <Badge variant="secondary">قريباً</Badge>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                <div>المشاركون: 5,200</div>
                <div>الولايات: 58</div>
                <div>الفئات: 6</div>
                <div>المدة: 20 ديسمبر - 25 يناير</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm">بدء التسجيل</Button>
                <Button size="sm" variant="outline">إعداد المسابقة</Button>
                <Button size="sm" variant="outline">إرسال دعوات</Button>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">أولمبياد الشباب الجزائري 2025</h4>
                <Badge variant="outline">التخطيط</Badge>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                <div>المشاركون المتوقعون: 8,500</div>
                <div>الولايات: 58</div>
                <div>الرياضات: 20</div>
                <div>المدة: 10 مارس - 25 أبريل</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">وضع الخطة</Button>
                <Button size="sm" variant="outline">تحديد المواقع</Button>
                <Button size="sm" variant="outline">إعداد الميزانية</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-4 sm:space-y-6">
      <NotificationCenter />
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Settings className="h-5 w-5 text-gray-500" />
            إعدادات النظام
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">إدارة المستخدمين</h4>
              <div className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  إدارة مديري التعليم
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <School className="h-4 w-4 mr-2" />
                  إدارة مديري المدارس
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Trophy className="h-4 w-4 mr-2" />
                  إدارة منظمي المسابقات
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">إعدادات النظام</h4>
              <div className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  قوالب التقارير
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Bell className="h-4 w-4 mr-2" />
                  إعدادات الإشعارات
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  معايير التقييم
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'schools': return renderSchools();
      case 'regions': return renderRegions();
      case 'competitions': return renderCompetitions();
      case 'reports': return renderReports();
      case 'notifications': return renderNotifications();
      case 'settings': return renderSettings();
      default: return renderDashboard();
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isRTL ? 'rtl' : 'ltr'}`}>
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className={`lg:ml-64 ${isRTL ? 'lg:mr-64 lg:ml-0' : ''}`}>
        <div className="pt-16 lg:pt-0 p-4 sm:p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}