import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Calendar as CalendarIcon,
  Clock,
  User,
  MapPin,
  Plus,
  Edit,
  Trash2,
  Eye,
  Bell,
  CheckCircle,
  AlertCircle,
  Users,
  Target,
  Activity,
  Send,
  RefreshCw
} from 'lucide-react';
import { format, addDays, startOfWeek } from 'date-fns';
import { ar } from 'date-fns/locale';

interface SessionType {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
}

interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
}

interface Session {
  id: string;
  clientId: string;
  clientName: string;
  type: string;
  date: Date;
  startTime: string;
  duration: number;
  location: string;
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  price: number;
  notificationSent: boolean;
  syncedWithClient: boolean;
}

interface TimeSlot {
  time: string;
  available: boolean;
  sessionId?: string;
}

interface SessionFormData {
  clientId: string;
  type: string;
  date: Date;
  startTime: string;
  duration: number;
  location: string;
  price: number;
  notes: string;
}

const sessionTypes: SessionType[] = [
  {
    id: 'strength',
    name: 'تدريب قوة',
    duration: 60,
    price: 150,
    description: 'تدريب مقاومة وبناء عضلات'
  },
  {
    id: 'cardio',
    name: 'كارديو',
    duration: 45,
    price: 120,
    description: 'تدريب قلبي وحرق دهون'
  },
  {
    id: 'yoga',
    name: 'يوغا',
    duration: 60,
    price: 100,
    description: 'مرونة واسترخاء'
  },
  {
    id: 'functional',
    name: 'تدريب وظيفي',
    duration: 90,
    price: 200,
    description: 'تدريب شامل ووظيفي'
  }
];

const mockClients: Client[] = [
  { id: '1', name: 'أحمد محمد', phone: '+966501234567', email: 'ahmed@example.com' },
  { id: '2', name: 'سارة أحمد', phone: '+966507654321', email: 'sara@example.com' },
  { id: '3', name: 'محمد علي', phone: '+966509876543', email: 'mohammed@example.com' },
  { id: '4', name: 'فاطمة الزهراء', phone: '+966502468135', email: 'fatima@example.com' }
];

const locations = [
  'الصالة الرئيسية',
  'صالة الأثقال',
  'صالة الكارديو',
  'استوديو اليوغا',
  'الصالة الخارجية',
  'صالة الملاكمة'
];

export function SessionScheduling() {
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: '1',
      clientId: '1',
      clientName: 'أحمد محمد',
      type: 'تدريب قوة',
      date: new Date(),
      startTime: '09:00',
      duration: 60,
      location: 'صالة الأثقال',
      status: 'confirmed',
      price: 150,
      notificationSent: true,
      syncedWithClient: true
    },
    {
      id: '2',
      clientId: '2',
      clientName: 'سارة أحمد',
      type: 'يوغا',
      date: addDays(new Date(), 1),
      startTime: '16:00',
      duration: 60,
      location: 'استوديو اليوغا',
      status: 'scheduled',
      price: 100,
      notificationSent: false,
      syncedWithClient: false
    }
  ]);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  // Generate time slots for a day
  const generateTimeSlots = (date: Date): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const dayStart = 6; // 6 AM
    const dayEnd = 22; // 10 PM
    const slotDuration = 30; // 30 minutes

    for (let hour = dayStart; hour < dayEnd; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const sessionAtThisTime = sessions.find(s => 
          s.date.toDateString() === date.toDateString() && 
          s.startTime === timeString
        );

        slots.push({
          time: timeString,
          available: !sessionAtThisTime,
          sessionId: sessionAtThisTime?.id
        });
      }
    }

    return slots;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200';
      case 'in-progress': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200';
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
    }
  };

  const handleScheduleSession = (formData: SessionFormData) => {
    const newSession: Session = {
      id: Date.now().toString(),
      clientId: formData.clientId,
      clientName: mockClients.find(c => c.id === formData.clientId)?.name || '',
      type: formData.type,
      date: formData.date,
      startTime: formData.startTime,
      duration: formData.duration,
      location: formData.location,
      status: 'scheduled',
      notes: formData.notes,
      price: formData.price,
      notificationSent: false,
      syncedWithClient: false
    };

    setSessions([...sessions, newSession]);
    setShowScheduleForm(false);
    
    // Simulate sync with client interface
    setTimeout(() => {
      setSessions(prev => prev.map(s => 
        s.id === newSession.id 
          ? { ...s, syncedWithClient: true, notificationSent: true }
          : s
      ));
    }, 2000);
  };

  const renderScheduleForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            جدولة جلسة جديدة
          </CardTitle>
          <CardDescription>
            إنشاء جلسة تدريبية جديدة مع مزامنة تلقائية
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="client">العميل</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر العميل" />
                </SelectTrigger>
                <SelectContent>
                  {mockClients.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="type">نوع الجلسة</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع الجلسة" />
                </SelectTrigger>
                <SelectContent>
                  {sessionTypes.map(type => (
                    <SelectItem key={type.id} value={type.name}>
                      {type.name} - {type.duration} دقيقة - {type.price} ر.س
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>التاريخ</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    اختر التاريخ
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="time">الوقت</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الوقت" />
                </SelectTrigger>
                <SelectContent>
                  {generateTimeSlots(selectedDate).filter(slot => slot.available).map(slot => (
                    <SelectItem key={slot.time} value={slot.time}>
                      {slot.time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="location">المكان</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر المكان" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">ملاحظات</Label>
            <Textarea 
              id="notes" 
              placeholder="ملاحظات إضافية للجلسة..."
              className="min-h-[80px]"
            />
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              المزامنة التلقائية
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              سيتم إرسال إشعار فوري للعميل مع تفاصيل الجلسة ومزامنة الموعد مع تطبيقه الشخصي
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              className="flex-1"
              onClick={() => {
                // Simulate form submission
                handleScheduleSession({
                  clientId: '1',
                  type: 'تدريب قوة',
                  date: selectedDate,
                  startTime: '10:00',
                  duration: 60,
                  location: 'صالة الأثقال',
                  price: 150,
                  notes: 'جلسة تدريبية جديدة'
                });
              }}
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              جدولة الجلسة
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowScheduleForm(false)}
            >
              إلغاء
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCalendarView = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>التقويم الأسبوعي</CardTitle>
              <CardDescription>
                {format(selectedDate, 'MMMM yyyy', { locale: ar })}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setSelectedDate(addDays(selectedDate, -7))}
              >
                الأسبوع السابق
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedDate(addDays(selectedDate, 7))}
              >
                الأسبوع التالي
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {/* Week days headers */}
            {Array.from({ length: 7 }, (_, i) => {
              const date = addDays(startOfWeek(selectedDate), i);
              return (
                <div key={i} className="text-center p-2 font-medium">
                  <div>{format(date, 'EEE', { locale: ar })}</div>
                  <div className="text-sm text-gray-500">{format(date, 'd')}</div>
                </div>
              );
            })}

            {/* Time slots */}
            {Array.from({ length: 7 }, (_, dayIndex) => {
              const date = addDays(startOfWeek(selectedDate), dayIndex);
              const daySlots = generateTimeSlots(date);
              
              return (
                <div key={dayIndex} className="space-y-1">
                  {daySlots.map((slot, slotIndex) => {
                    const session = slot.sessionId ? sessions.find(s => s.id === slot.sessionId) : null;
                    
                    if (session) {
                      return (
                        <div
                          key={slotIndex}
                          className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded text-xs cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-900/40"
                          onClick={() => setSelectedSession(session)}
                        >
                          <div className="font-medium">{slot.time}</div>
                          <div className="truncate">{session.clientName}</div>
                          <div className="truncate text-gray-600">{session.type}</div>
                        </div>
                      );
                    }
                    
                    return (
                      <div
                        key={slotIndex}
                        className="p-1 text-xs text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded cursor-pointer"
                        onClick={() => {
                          setSelectedDate(date);
                          setShowScheduleForm(true);
                        }}
                      >
                        {slotIndex % 2 === 0 ? slot.time : ''}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderListView = () => (
    <div className="space-y-4">
      {sessions.map((session) => (
        <Card key={session.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {format(session.date, 'dd')}
                  </div>
                  <div className="text-sm text-gray-500">
                    {format(session.date, 'MMM', { locale: ar })}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">{session.clientName}</h4>
                    <Badge className={getStatusColor(session.status)}>
                      {session.status === 'scheduled' && 'مجدولة'}
                      {session.status === 'confirmed' && 'مؤكدة'}
                      {session.status === 'in-progress' && 'جارية'}
                      {session.status === 'completed' && 'مكتملة'}
                      {session.status === 'cancelled' && 'ملغية'}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{session.startTime} - {session.duration} دقيقة</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      <span>{session.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{session.location}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="text-lg font-bold text-green-600">
                  {session.price} ر.س
                </div>
                <div className="flex items-center gap-2">
                  {session.syncedWithClient ? (
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      <RefreshCw className="h-3 w-3 mr-1" />
                      مزامن
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      في الانتظار
                    </Badge>
                  )}
                  {session.notificationSent && (
                    <Badge className="bg-blue-100 text-blue-800 text-xs">
                      <Bell className="h-3 w-3 mr-1" />
                      تم الإشعار
                    </Badge>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  {!session.syncedWithClient && (
                    <Button size="sm" variant="outline">
                      <Send className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <CalendarIcon className="h-6 w-6" />
            جدولة الجلسات
          </CardTitle>
          <CardDescription className="text-green-100">
            إدارة المواعيد مع مزامنة تلقائية مع تطبيقات العملاء
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{sessions.length}</div>
                <div className="text-sm text-green-100">إجمالي الجلسات</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {sessions.filter(s => s.syncedWithClient).length}
                </div>
                <div className="text-sm text-green-100">مزامنة</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {sessions.reduce((acc, s) => acc + s.price, 0)} ر.س
                </div>
                <div className="text-sm text-green-100">إجمالي الإيرادات</div>
              </div>
            </div>
            <Button 
              onClick={() => setShowScheduleForm(true)}
              className="bg-white text-green-600 hover:bg-gray-100"
            >
              <Plus className="h-4 w-4 mr-2" />
              جدولة جلسة جديدة
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* View Toggle */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'calendar' ? 'default' : 'outline'}
            onClick={() => setViewMode('calendar')}
          >
            <CalendarIcon className="h-4 w-4 mr-2" />
            عرض التقويم
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            onClick={() => setViewMode('list')}
          >
            <Users className="h-4 w-4 mr-2" />
            عرض القائمة
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-100 text-green-800">
            <RefreshCw className="h-3 w-3 mr-1" />
            مزامنة تلقائية نشطة
          </Badge>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'calendar' ? renderCalendarView() : renderListView()}

      {/* Schedule Form Modal */}
      {showScheduleForm && renderScheduleForm()}
    </div>
  );
}