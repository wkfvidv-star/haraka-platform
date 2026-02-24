import React, { useState, useEffect } from 'react';
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
import { coachService, StudentStats } from '@/services/coachService';
import { useAuth } from '@/contexts/AuthContext';

export function ClientManagement() {
  const { user } = useAuth();
  const [students, setStudents] = useState<StudentStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentStats | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showClientProfile, setShowClientProfile] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      if (user?.id) {
        setLoading(true);
        try {
          const groups = await coachService.getGroups(user.id);
          if (groups.length > 0) {
            const members = await coachService.getGroupMembers(groups[0].id);
            setStudents(members);
          }
        } catch (error) {
          console.error("Failed to fetch students", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchStudents();
  }, [user]);

  const filteredClients = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
  };

  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return { status: 'نقص وزن', color: 'text-blue-600' };
    if (bmi < 25) return { status: 'وزن طبيعي', color: 'text-green-600' };
    if (bmi < 30) return { status: 'زيادة وزن', color: 'text-yellow-600' };
    return { status: 'سمنة', color: 'text-red-600' };
  };

  const renderClientProfile = () => {
    if (!selectedStudent) return null;

    const bmi = 22; // Mock for now
    const bmiStatus = getBMIStatus(bmi);

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">{selectedStudent.name}</CardTitle>
                  <CardDescription>
                    المستوى: {selectedStudent.level} • {selectedStudent.xp} XP
                  </CardDescription>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getStatusColor('نشط')}>
                      نشط
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setShowClientProfile(false)}>
                  ← العودة
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="progress">التقدم</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  المقاييس والأداء
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{selectedStudent.performanceScore}</div>
                    <div className="text-sm text-gray-500">مؤشر الأداء</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{selectedStudent.xp}</div>
                    <div className="text-sm text-gray-500">XP كلي</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  if (showClientProfile && selectedStudent) {
    return renderClientProfile();
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Users className="h-6 w-6" />
            إدارة الطلاب
          </CardTitle>
          <CardDescription className="text-blue-100">
            إدارة شاملة لملفات الطلاب وتتبع تقدمهم
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-2xl font-bold">{students.length}</div>
              <div className="text-sm text-blue-100">إجمالي الطلاب</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">البحث عن طالب</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="ابحث عن طالب..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredClients.map((student) => (
            <Card key={student.userId} className="hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {student.name}
                      </CardTitle>
                      <CardDescription>المستوى {student.level} • {student.xp} XP</CardDescription>
                    </div>
                  </div>
                  <Badge className={getStatusColor('نشط')}>
                    نشط
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <div className="text-lg font-bold text-blue-600">{student.level}</div>
                    <div className="text-xs text-gray-500">المستوى</div>
                  </div>
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <div className="text-lg font-bold text-green-600">{student.performanceScore}</div>
                    <div className="text-xs text-gray-500">الأداء</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setSelectedStudent(student);
                      setShowClientProfile(true);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    عرض الملف
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
