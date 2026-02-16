import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  User,
  Search,
  Filter,
  Eye,
  Edit,
  Plus,
  Calendar,
  Target,
  Activity,
  Heart,
  Smartphone,
  Watch,
  TrendingUp,
  Award,
  Clock,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  BarChart3,
  FileText,
  Download
} from 'lucide-react';

interface Client {
  id: string;
  name: string;
  age: number;
  gender: 'ذكر' | 'أنثى';
  phone: string;
  email: string;
  joinDate: string;
  membershipType: 'شهري' | 'ربع سنوي' | 'سنوي';
  status: 'نشط' | 'غير نشط' | 'معلق';
  goals: string[];
  currentWeight: number;
  targetWeight: number;
  height: number;
  bmi: number;
  bodyFat?: number;
  connectedDevices: {
    type: 'fitness_tracker' | 'smart_watch' | 'heart_monitor';
    name: string;
    connected: boolean;
    lastSync: string;
  }[];
  recentSessions: {
    id: string;
    date: string;
    type: string;
    duration: number;
    caloriesBurned: number;
    performance: number;
    notes: string;
  }[];
  progressData: {
    weight: { date: string; value: number }[];
    bodyFat: { date: string; value: number }[];
    muscle: { date: string; value: number }[];
  };
  achievements: {
    id: string;
    title: string;
    description: string;
    date: string;
    icon: string;
  }[];
  lastBookingDate?: string;
}

const mockClients: Client[] = [
  {
    id: 'client_1',
    name: 'أحمد محمد الصالح',
    age: 28,
    gender: 'ذكر',
    phone: '+966501234567',
    email: 'ahmed@example.com',
    joinDate: '2024-01-15',
    membershipType: 'شهري',
    status: 'نشط',
    goals: ['فقدان الوزن', 'بناء العضلات', 'تحسين اللياقة'],
    currentWeight: 85,
    targetWeight: 78,
    height: 175,
    bmi: 27.8,
    bodyFat: 18,
    connectedDevices: [
      {
        type: 'smart_watch',
        name: 'Apple Watch Series 9',
        connected: true,
        lastSync: '2024-10-16 08:30'
      },
      {
        type: 'heart_monitor',
        name: 'Polar H10',
        connected: true,
        lastSync: '2024-10-16 07:45'
      }
    ],
    recentSessions: [
      {
        id: '1',
        date: '2024-10-15',
        type: 'تدريب قوة',
        duration: 60,
        caloriesBurned: 450,
        performance: 85,
        notes: 'أداء ممتاز، زيادة الأوزان بنسبة 10%'
      },
      {
        id: '2',
        date: '2024-10-13',
        type: 'كارديو',
        duration: 45,
        caloriesBurned: 380,
        performance: 78,
        notes: 'تحسن في التحمل، يحتاج راحة إضافية'
      }
    ],
    progressData: {
      weight: [
        { date: '2024-09-01', value: 88 },
        { date: '2024-09-15', value: 87 },
        { date: '2024-10-01', value: 86 },
        { date: '2024-10-15', value: 85 }
      ],
      bodyFat: [
        { date: '2024-09-01', value: 22 },
        { date: '2024-09-15', value: 21 },
        { date: '2024-10-01', value: 19 },
        { date: '2024-10-15', value: 18 }
      ],
      muscle: [
        { date: '2024-09-01', value: 35 },
        { date: '2024-09-15', value: 36 },
        { date: '2024-10-01', value: 37 },
        { date: '2024-10-15', value: 38 }
      ]
    },
    achievements: [
      {
        id: '1',
        title: 'هدف الوزن الشهري',
        description: 'فقد 3 كيلو في شهر واحد',
        date: '2024-10-01',
        icon: '🎯'
      },
      {
        id: '2',
        title: 'محارب التحمل',
        description: 'أكمل 10 جلسات كارديو متتالية',
        date: '2024-09-20',
        icon: '💪'
      }
    ]
  },
  {
    id: 'client_2',
    name: 'سارة أحمد الفهد',
    age: 25,
    gender: 'أنثى',
    phone: '+966507654321',
    email: 'sara@example.com',
    joinDate: '2024-02-20',
    membershipType: 'ربع سنوي',
    status: 'نشط',
    goals: ['تحسين اللياقة', 'تقوية العضلات', 'المرونة'],
    currentWeight: 62,
    targetWeight: 58,
    height: 165,
    bmi: 22.8,
    bodyFat: 22,
    connectedDevices: [
      {
        type: 'fitness_tracker',
        name: 'Fitbit Charge 5',
        connected: true,
        lastSync: '2024-10-16 09:15'
      }
    ],
    recentSessions: [
      {
        id: '1',
        date: '2024-10-14',
        type: 'يوغا',
        duration: 60,
        caloriesBurned: 250,
        performance: 92,
        notes: 'تحسن كبير في المرونة والتوازن'
      }
    ],
    progressData: {
      weight: [
        { date: '2024-09-01', value: 64 },
        { date: '2024-09-15', value: 63 },
        { date: '2024-10-01', value: 62.5 },
        { date: '2024-10-15', value: 62 }
      ],
      bodyFat: [
        { date: '2024-09-01', value: 25 },
        { date: '2024-09-15', value: 24 },
        { date: '2024-10-01', value: 23 },
        { date: '2024-10-15', value: 22 }
      ],
      muscle: [
        { date: '2024-09-01', value: 28 },
        { date: '2024-09-15', value: 29 },
        { date: '2024-10-01', value: 30 },
        { date: '2024-10-15', value: 31 }
      ]
    },
    achievements: [
      {
        id: '1',
        title: 'ملكة المرونة',
        description: 'حققت مرونة 95% في تقييم اليوغا',
        date: '2024-10-10',
        icon: '🧘‍♀️'
      }
    ],
    lastBookingDate: '2024-10-01'
  }
];

export function ClientManagement() {
  const [clients] = useState<Client[]>(mockClients);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('الكل');
  const [showClientProfile, setShowClientProfile] = useState(false);

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'الكل' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'نشط': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
      case 'غير نشط': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200';
      case 'معلق': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
    }
  };

  const getMembershipColor = (type: string) => {
    switch (type) {
      case 'سنوي': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200';
      case 'ربع سنوي': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200';
      case 'شهري': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
    }
  };

  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return { status: 'نقص وزن', color: 'text-blue-600' };
    if (bmi < 25) return { status: 'وزن طبيعي', color: 'text-green-600' };
    if (bmi < 30) return { status: 'زيادة وزن', color: 'text-yellow-600' };
    return { status: 'سمنة', color: 'text-red-600' };
  };

  const renderClientProfile = () => {
    if (!selectedClient) return null;

    const bmiStatus = getBMIStatus(selectedClient.bmi);

    return (
      <div className="space-y-6">
        {/* Client Header */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">{selectedClient.name}</CardTitle>
                  <CardDescription>
                    {selectedClient.age} سنة • {selectedClient.gender} • عضو منذ {selectedClient.joinDate}
                  </CardDescription>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getStatusColor(selectedClient.status)}>
                      {selectedClient.status}
                    </Badge>
                    <Badge className={getMembershipColor(selectedClient.membershipType)}>
                      {selectedClient.membershipType}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4 mr-1" />
                  تعديل
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowClientProfile(false)}>
                  ← العودة
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="progress">التقدم</TabsTrigger>
            <TabsTrigger value="sessions">الجلسات</TabsTrigger>
            <TabsTrigger value="devices">الأجهزة</TabsTrigger>
            <TabsTrigger value="achievements">الإنجازات</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  معلومات الاتصال
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{selectedClient.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{selectedClient.email}</span>
                </div>
              </CardContent>
            </Card>

            {/* Body Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  المقاييس الجسمية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{selectedClient.currentWeight}</div>
                    <div className="text-sm text-gray-500">الوزن الحالي (كغ)</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{selectedClient.targetWeight}</div>
                    <div className="text-sm text-gray-500">الوزن المستهدف (كغ)</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{selectedClient.height}</div>
                    <div className="text-sm text-gray-500">الطول (سم)</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className={`text-2xl font-bold ${bmiStatus.color}`}>{selectedClient.bmi}</div>
                    <div className="text-sm text-gray-500">مؤشر كتلة الجسم</div>
                    <div className={`text-xs ${bmiStatus.color} font-medium`}>{bmiStatus.status}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  الأهداف التدريبية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {selectedClient.goals.map((goal, index) => (
                    <Badge key={index} variant="outline" className="px-3 py-1">
                      {goal}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  تقرير التقدم
                </CardTitle>
                <CardDescription>
                  تطور المقاييس الجسمية عبر الزمن
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Weight Progress */}
                <div>
                  <h4 className="font-medium mb-3">تطور الوزن</h4>
                  <div className="space-y-2">
                    {selectedClient.progressData.weight.map((entry, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <span className="text-sm">{entry.date}</span>
                        <span className="font-medium">{entry.value} كغ</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Body Fat Progress */}
                <div>
                  <h4 className="font-medium mb-3">نسبة الدهون</h4>
                  <div className="space-y-2">
                    {selectedClient.progressData.bodyFat.map((entry, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <span className="text-sm">{entry.date}</span>
                        <span className="font-medium">{entry.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    تحميل تقرير PDF
                  </Button>
                  <Button variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    عرض الرسوم البيانية
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  الجلسات السابقة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedClient.recentSessions.map((session) => (
                    <div key={session.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{session.type}</h4>
                          <p className="text-sm text-gray-500">{session.date}</p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">
                          {session.performance}% أداء
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">المدة: </span>
                          <span>{session.duration} دقيقة</span>
                        </div>
                        <div>
                          <span className="text-gray-500">السعرات: </span>
                          <span>{session.caloriesBurned} سعرة</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">{session.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="devices" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  الأجهزة المربوطة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedClient.connectedDevices.map((device, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {device.type === 'smart_watch' && <Watch className="h-5 w-5 text-blue-500" />}
                        {device.type === 'fitness_tracker' && <Activity className="h-5 w-5 text-green-500" />}
                        {device.type === 'heart_monitor' && <Heart className="h-5 w-5 text-red-500" />}
                        <div>
                          <h4 className="font-medium">{device.name}</h4>
                          <p className="text-sm text-gray-500">آخر مزامنة: {device.lastSync}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {device.connected ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            متصل
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            غير متصل
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  الإنجازات والجوائز
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedClient.achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-medium">{achievement.title}</h4>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{achievement.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  if (showClientProfile && selectedClient) {
    return renderClientProfile();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Users className="h-6 w-6" />
            إدارة العملاء
          </CardTitle>
          <CardDescription className="text-blue-100">
            إدارة شاملة لملفات العملاء وتتبع تقدمهم
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{clients.length}</div>
              <div className="text-sm text-blue-100">إجمالي العملاء</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{clients.filter(c => c.status === 'نشط').length}</div>
              <div className="text-sm text-blue-100">عملاء نشطون</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">
                {Math.round(clients.reduce((acc, c) => acc + c.recentSessions.length, 0) / clients.length)}
              </div>
              <div className="text-sm text-blue-100">متوسط الجلسات</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">
                {clients.filter(c => c.connectedDevices.some(d => d.connected)).length}
              </div>
              <div className="text-sm text-blue-100">أجهزة متصلة</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">البحث عن عميل</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="ابحث عن عميل..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">تصفية حسب الحالة</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="اختر الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="الكل">الكل</SelectItem>
                <SelectItem value="نشط">نشط</SelectItem>
                <SelectItem value="غير نشط">غير نشط</SelectItem>
                <SelectItem value="معلق">معلق</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">إجراءات سريعة</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              إضافة عميل جديد
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <Card key={client.id} className="hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {client.name}
                      {client.lastBookingDate && (() => {
                        const lastDate = new Date(client.lastBookingDate);
                        const today = new Date();
                        const diffTime = Math.abs(today.getTime() - lastDate.getTime());
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        return diffDays > 10;
                      })() && (
                          <Badge variant="destructive" className="text-xs px-1 h-5">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            خطر التسرب
                          </Badge>
                        )}
                    </CardTitle>
                    <CardDescription>{client.age} سنة • {client.gender}</CardDescription>
                  </div>
                </div>
                <Badge className={getStatusColor(client.status)}>
                  {client.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <div className="text-lg font-bold text-blue-600">{client.currentWeight}</div>
                  <div className="text-xs text-gray-500">الوزن الحالي</div>
                </div>
                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <div className="text-lg font-bold text-green-600">{client.targetWeight}</div>
                  <div className="text-xs text-gray-500">الهدف</div>
                </div>
              </div>

              {/* Progress */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>التقدم نحو الهدف</span>
                  <span>
                    {Math.round(((client.currentWeight - client.targetWeight) / (client.currentWeight - client.targetWeight)) * 100)}%
                  </span>
                </div>
                <Progress
                  value={Math.abs(((client.currentWeight - client.targetWeight) / client.currentWeight) * 100)}
                  className="h-2"
                />
              </div>

              {/* Connected Devices */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">الأجهزة:</span>
                {client.connectedDevices.filter(d => d.connected).map((device, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {device.type === 'smart_watch' && <Watch className="h-3 w-3 mr-1" />}
                    {device.type === 'fitness_tracker' && <Activity className="h-3 w-3 mr-1" />}
                    {device.type === 'heart_monitor' && <Heart className="h-3 w-3 mr-1" />}
                    متصل
                  </Badge>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setSelectedClient(client);
                    setShowClientProfile(true);
                  }}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  عرض الملف
                </Button>
                <Button size="sm" variant="outline">
                  <Calendar className="h-4 w-4 mr-1" />
                  جدولة
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}