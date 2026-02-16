import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Shield,
  Lock,
  Key,
  Eye,
  EyeOff,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  UserCheck,
  Database,
  Network,
  Fingerprint,
  ShieldCheck,
  UserX,
  History,
  Download,
  Upload,
  Trash2,
  Edit,
  Plus,
  Search,
  Filter
} from 'lucide-react';

interface SecurityMetric {
  id: string;
  title: string;
  value: string;
  status: 'secure' | 'warning' | 'critical';
  description: string;
  icon: React.ReactNode;
}

interface RolePermission {
  id: string;
  role: string;
  permissions: {
    viewStudentData: boolean;
    editStudentData: boolean;
    sendOfficialReports: boolean;
    accessMedicalData: boolean;
    manageDevices: boolean;
    viewAuditLogs: boolean;
    manageUsers: boolean;
    exportData: boolean;
  };
  description: string;
  userCount: number;
}

interface ParentalConsent {
  id: string;
  studentName: string;
  parentName: string;
  parentEmail: string;
  consentDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  dataTypes: string[];
  expiryDate: string;
}

interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failed' | 'warning';
}

export function SecurityDashboard({ userRole = 'admin' }: { userRole?: string }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RolePermission | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [securityMetrics] = useState<SecurityMetric[]>([
    {
      id: 'encryption',
      title: 'تشفير البيانات',
      value: 'AES-256 + TLS 1.3',
      status: 'secure',
      description: 'جميع البيانات مشفرة أثناء النقل والتخزين',
      icon: <Lock className="h-5 w-5" />
    },
    {
      id: 'authentication',
      title: 'المصادقة',
      value: 'MFA مفعل',
      status: 'secure',
      description: 'مصادقة ثنائية العامل لجميع المستخدمين',
      icon: <Key className="h-5 w-5" />
    },
    {
      id: 'access_control',
      title: 'التحكم في الوصول',
      value: 'RBAC نشط',
      status: 'secure',
      description: 'صلاحيات دورية دقيقة حسب الدور',
      icon: <Shield className="h-5 w-5" />
    },
    {
      id: 'consent',
      title: 'الموافقة الأبوية',
      value: '95% مكتملة',
      status: 'warning',
      description: '5% من الطلاب بحاجة لموافقة أبوية',
      icon: <UserCheck className="h-5 w-5" />
    },
    {
      id: 'audit',
      title: 'سجلات التدقيق',
      value: '100% مراقبة',
      status: 'secure',
      description: 'تسجيل جميع العمليات الحساسة',
      icon: <History className="h-5 w-5" />
    },
    {
      id: 'compliance',
      title: 'الامتثال',
      value: 'GDPR متوافق',
      status: 'secure',
      description: 'متوافق مع معايير الخصوصية الدولية',
      icon: <ShieldCheck className="h-5 w-5" />
    }
  ]);

  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([
    {
      id: 'student',
      role: 'طالب',
      permissions: {
        viewStudentData: true,
        editStudentData: false,
        sendOfficialReports: false,
        accessMedicalData: false,
        manageDevices: true,
        viewAuditLogs: false,
        manageUsers: false,
        exportData: false
      },
      description: 'يمكن للطلاب عرض بياناتهم الشخصية وإدارة أجهزتهم فقط',
      userCount: 1247
    },
    {
      id: 'parent',
      role: 'ولي أمر',
      permissions: {
        viewStudentData: true,
        editStudentData: false,
        sendOfficialReports: false,
        accessMedicalData: true,
        manageDevices: false,
        viewAuditLogs: false,
        manageUsers: false,
        exportData: true
      },
      description: 'يمكن لأولياء الأمور عرض بيانات أطفالهم والبيانات الطبية',
      userCount: 856
    },
    {
      id: 'teacher',
      role: 'معلم',
      permissions: {
        viewStudentData: true,
        editStudentData: true,
        sendOfficialReports: false,
        accessMedicalData: false,
        manageDevices: false,
        viewAuditLogs: false,
        manageUsers: false,
        exportData: true
      },
      description: 'يمكن للمعلمين عرض وتعديل بيانات طلابهم',
      userCount: 89
    },
    {
      id: 'coach',
      role: 'مدرب',
      permissions: {
        viewStudentData: true,
        editStudentData: true,
        sendOfficialReports: false,
        accessMedicalData: true,
        manageDevices: true,
        viewAuditLogs: false,
        manageUsers: false,
        exportData: true
      },
      description: 'يمكن للمدربين الوصول للبيانات الطبية وإدارة الأجهزة',
      userCount: 34
    },
    {
      id: 'principal',
      role: 'مدير مدرسة',
      permissions: {
        viewStudentData: true,
        editStudentData: true,
        sendOfficialReports: true,
        accessMedicalData: true,
        manageDevices: true,
        viewAuditLogs: true,
        manageUsers: true,
        exportData: true
      },
      description: 'صلاحيات كاملة على مستوى المدرسة',
      userCount: 23
    },
    {
      id: 'directorate',
      role: 'مديرية التعليم',
      permissions: {
        viewStudentData: true,
        editStudentData: false,
        sendOfficialReports: true,
        accessMedicalData: false,
        manageDevices: false,
        viewAuditLogs: true,
        manageUsers: true,
        exportData: true
      },
      description: 'صلاحيات إدارية على مستوى المديرية',
      userCount: 12
    },
    {
      id: 'ministry',
      role: 'وزارة التربية',
      permissions: {
        viewStudentData: true,
        editStudentData: false,
        sendOfficialReports: true,
        accessMedicalData: false,
        manageDevices: false,
        viewAuditLogs: true,
        manageUsers: true,
        exportData: true
      },
      description: 'صلاحيات إشرافية على المستوى الوطني',
      userCount: 8
    }
  ]);

  const [parentalConsents] = useState<ParentalConsent[]>([
    {
      id: 'consent_1',
      studentName: 'أحمد محمد علي',
      parentName: 'محمد علي أحمد',
      parentEmail: 'parent1@example.com',
      consentDate: '2024-09-15',
      status: 'approved',
      dataTypes: ['بيانات النشاط البدني', 'معدل ضربات القلب', 'أنماط النوم'],
      expiryDate: '2025-09-15'
    },
    {
      id: 'consent_2',
      studentName: 'فاطمة خالد',
      parentName: 'خالد محمود',
      parentEmail: 'parent2@example.com',
      consentDate: '2024-09-20',
      status: 'pending',
      dataTypes: ['بيانات النشاط البدني', 'الوزن والطول'],
      expiryDate: '2025-09-20'
    },
    {
      id: 'consent_3',
      studentName: 'محمد سامي',
      parentName: 'سامي أحمد',
      parentEmail: 'parent3@example.com',
      consentDate: '2024-08-10',
      status: 'expired',
      dataTypes: ['بيانات النشاط البدني'],
      expiryDate: '2024-08-10'
    }
  ]);

  const [auditLogs] = useState<AuditLog[]>([
    {
      id: 'log_1',
      timestamp: '2024-10-02T14:30:00Z',
      userId: 'teacher_123',
      userName: 'أ. محمد أحمد',
      action: 'تعديل بيانات طالب',
      resource: 'student_data',
      details: 'تم تحديث درجات اللياقة البدنية للطالب أحمد محمد',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      status: 'success'
    },
    {
      id: 'log_2',
      timestamp: '2024-10-02T13:15:00Z',
      userId: 'principal_456',
      userName: 'مدير المدرسة',
      action: 'إرسال تقرير رسمي',
      resource: 'official_report',
      details: 'تم إرسال تقرير شهري إلى مديرية التعليم',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      status: 'success'
    },
    {
      id: 'log_3',
      timestamp: '2024-10-02T12:45:00Z',
      userId: 'coach_789',
      userName: 'المدرب خالد',
      action: 'حذف جهاز',
      resource: 'device_management',
      details: 'تم حذف جهاز Mi Band معطل من النظام',
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (Android 10; Mobile)',
      status: 'success'
    },
    {
      id: 'log_4',
      timestamp: '2024-10-02T11:30:00Z',
      userId: 'unknown',
      userName: 'مستخدم غير معروف',
      action: 'محاولة وصول غير مصرح',
      resource: 'student_medical_data',
      details: 'محاولة فاشلة للوصول إلى البيانات الطبية',
      ipAddress: '203.0.113.1',
      userAgent: 'curl/7.68.0',
      status: 'failed'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'secure': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      case 'success': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const updateRolePermissions = (roleId: string, permissions: Partial<RolePermission['permissions']>) => {
    setRolePermissions(prev => prev.map(role => 
      role.id === roleId 
        ? { ...role, permissions: { ...role.permissions, ...permissions } }
        : role
    ));
  };

  const filteredAuditLogs = auditLogs.filter(log => {
    const matchesSearch = log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-red-600 to-pink-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Shield className="h-6 w-6" />
            الأمان والخصوصية
          </CardTitle>
          <CardDescription className="text-red-100">
            حماية شاملة للبيانات مع تشفير متقدم وصلاحيات دقيقة ومراقبة مستمرة
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {securityMetrics.map(metric => (
          <Card key={metric.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${
                  metric.status === 'secure' ? 'bg-green-100 text-green-600' :
                  metric.status === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  {metric.icon}
                </div>
                <Badge className={getStatusColor(metric.status)}>
                  {metric.status === 'secure' && 'آمن'}
                  {metric.status === 'warning' && 'تحذير'}
                  {metric.status === 'critical' && 'حرج'}
                </Badge>
              </div>
              <h3 className="font-medium text-lg mb-1">{metric.title}</h3>
              <p className="text-2xl font-bold mb-2">{metric.value}</p>
              <p className="text-sm text-gray-600">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="permissions">الصلاحيات</TabsTrigger>
          <TabsTrigger value="consent">الموافقة الأبوية</TabsTrigger>
          <TabsTrigger value="audit">سجلات التدقيق</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  تشفير البيانات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Lock className="h-5 w-5 text-green-600" />
                      <div>
                        <h4 className="font-medium">التشفير أثناء النقل</h4>
                        <p className="text-sm text-gray-600">TLS 1.3 مع Perfect Forward Secrecy</p>
                      </div>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Database className="h-5 w-5 text-green-600" />
                      <div>
                        <h4 className="font-medium">التشفير أثناء التخزين</h4>
                        <p className="text-sm text-gray-600">AES-256 مع إدارة مفاتيح آمنة</p>
                      </div>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Key className="h-5 w-5 text-green-600" />
                      <div>
                        <h4 className="font-medium">إدارة المفاتيح</h4>
                        <p className="text-sm text-gray-600">HSM مع دوران تلقائي للمفاتيح</p>
                      </div>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  الامتثال للمعايير
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="h-5 w-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium">GDPR</h4>
                        <p className="text-sm text-gray-600">اللائحة العامة لحماية البيانات</p>
                      </div>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <UserCheck className="h-5 w-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium">COPPA</h4>
                        <p className="text-sm text-gray-600">حماية خصوصية الأطفال على الإنترنت</p>
                      </div>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium">ISO 27001</h4>
                        <p className="text-sm text-gray-600">معيار أمن المعلومات</p>
                      </div>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  إدارة الصلاحيات (RBAC)
                </CardTitle>
                <Button onClick={() => setShowRoleDialog(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  دور جديد
                </Button>
              </div>
              <CardDescription>
                تحكم دقيق في صلاحيات الوصول حسب الأدوار المختلفة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rolePermissions.map(role => (
                  <div key={role.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-lg">{role.role}</h4>
                        <p className="text-sm text-gray-600">{role.description}</p>
                        <Badge variant="outline" className="mt-1">
                          {role.userCount} مستخدم
                        </Badge>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedRole(role);
                          setShowRoleDialog(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span>عرض بيانات الطلاب</span>
                        {role.permissions.viewStudentData ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <UserX className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span>تعديل البيانات</span>
                        {role.permissions.editStudentData ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <UserX className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span>إرسال تقارير رسمية</span>
                        {role.permissions.sendOfficialReports ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <UserX className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span>البيانات الطبية</span>
                        {role.permissions.accessMedicalData ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <UserX className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span>إدارة الأجهزة</span>
                        {role.permissions.manageDevices ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <UserX className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span>سجلات التدقيق</span>
                        {role.permissions.viewAuditLogs ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <UserX className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span>إدارة المستخدمين</span>
                        {role.permissions.manageUsers ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <UserX className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span>تصدير البيانات</span>
                        {role.permissions.exportData ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <UserX className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                إدارة الموافقة الأبوية
              </CardTitle>
              <CardDescription>
                موافقة صريحة من أولياء الأمور لتتبع البيانات الصحية للأطفال
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {parentalConsents.map(consent => (
                  <div key={consent.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{consent.studentName}</h4>
                        <p className="text-sm text-gray-600">ولي الأمر: {consent.parentName}</p>
                        <p className="text-sm text-gray-600">{consent.parentEmail}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(consent.status)}>
                          {consent.status === 'approved' && 'موافق'}
                          {consent.status === 'pending' && 'في الانتظار'}
                          {consent.status === 'rejected' && 'مرفوض'}
                          {consent.status === 'expired' && 'منتهي الصلاحية'}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          تاريخ الموافقة: {new Date(consent.consentDate).toLocaleDateString('ar-SA')}
                        </p>
                        <p className="text-xs text-gray-500">
                          تنتهي في: {new Date(consent.expiryDate).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <h5 className="font-medium text-sm mb-2">أنواع البيانات المسموحة:</h5>
                      <div className="flex flex-wrap gap-2">
                        {consent.dataTypes.map(dataType => (
                          <Badge key={dataType} variant="outline" className="text-xs">
                            {dataType}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {consent.status === 'pending' && (
                        <>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            موافقة
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600">
                            <UserX className="h-4 w-4 mr-1" />
                            رفض
                          </Button>
                        </>
                      )}
                      {consent.status === 'expired' && (
                        <Button size="sm" variant="outline">
                          <Clock className="h-4 w-4 mr-1" />
                          تجديد الموافقة
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        عرض التفاصيل
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  سجلات التدقيق
                </CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-1" />
                    تصدير
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="h-4 w-4 mr-1" />
                    إعدادات
                  </Button>
                </div>
              </div>
              <CardDescription>
                مراقبة شاملة لجميع العمليات الحساسة في النظام
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="البحث في السجلات..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="حالة العملية" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع العمليات</SelectItem>
                    <SelectItem value="success">نجحت</SelectItem>
                    <SelectItem value="failed">فشلت</SelectItem>
                    <SelectItem value="warning">تحذير</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Audit Logs */}
              <div className="space-y-3">
                {filteredAuditLogs.map(log => (
                  <div key={log.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(log.status)}>
                          {log.status === 'success' && 'نجح'}
                          {log.status === 'failed' && 'فشل'}
                          {log.status === 'warning' && 'تحذير'}
                        </Badge>
                        <h4 className="font-medium">{log.action}</h4>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(log.timestamp).toLocaleString('ar-SA')}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">المستخدم: </span>
                        <span className="font-medium">{log.userName}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">المورد: </span>
                        <span className="font-medium">{log.resource}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">عنوان IP: </span>
                        <span className="font-medium">{log.ipAddress}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">المتصفح: </span>
                        <span className="font-medium text-xs">{log.userAgent.substring(0, 50)}...</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                      <span className="text-gray-600">التفاصيل: </span>
                      <span>{log.details}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Role Permissions Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedRole ? `تعديل صلاحيات ${selectedRole.role}` : 'إنشاء دور جديد'}
            </DialogTitle>
            <DialogDescription>
              تحديد الصلاحيات المسموحة لهذا الدور
            </DialogDescription>
          </DialogHeader>
          
          {selectedRole && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {Object.entries(selectedRole.permissions).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">
                        {key === 'viewStudentData' && 'عرض بيانات الطلاب'}
                        {key === 'editStudentData' && 'تعديل بيانات الطلاب'}
                        {key === 'sendOfficialReports' && 'إرسال تقارير رسمية'}
                        {key === 'accessMedicalData' && 'الوصول للبيانات الطبية'}
                        {key === 'manageDevices' && 'إدارة الأجهزة'}
                        {key === 'viewAuditLogs' && 'عرض سجلات التدقيق'}
                        {key === 'manageUsers' && 'إدارة المستخدمين'}
                        {key === 'exportData' && 'تصدير البيانات'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {key === 'viewStudentData' && 'السماح بعرض البيانات الشخصية للطلاب'}
                        {key === 'editStudentData' && 'السماح بتعديل وتحديث بيانات الطلاب'}
                        {key === 'sendOfficialReports' && 'السماح بإرسال التقارير الرسمية للجهات العليا'}
                        {key === 'accessMedicalData' && 'السماح بالوصول للبيانات الصحية والطبية'}
                        {key === 'manageDevices' && 'السماح بإضافة وحذف وإدارة الأجهزة'}
                        {key === 'viewAuditLogs' && 'السماح بعرض سجلات التدقيق والمراقبة'}
                        {key === 'manageUsers' && 'السماح بإدارة حسابات المستخدمين'}
                        {key === 'exportData' && 'السماح بتصدير البيانات والتقارير'}
                      </p>
                    </div>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) => 
                        updateRolePermissions(selectedRole.id, { [key]: checked })
                      }
                    />
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2 pt-4 border-t">
                <Button className="flex-1">
                  حفظ التغييرات
                </Button>
                <Button variant="outline" onClick={() => {
                  setShowRoleDialog(false);
                  setSelectedRole(null);
                }}>
                  إلغاء
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}