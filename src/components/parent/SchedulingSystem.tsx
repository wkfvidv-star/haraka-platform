import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Calendar as CalendarIcon,
  Clock,
  Users,
  User,
  MapPin,
  Plus,
  Filter,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Star,
  Target,
  Dumbbell,
  Heart,
  Activity,
  Zap
} from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface Session {
  id: string;
  title: string;
  type: 'فردي' | 'جماعي';
  category: string;
  instructor: string;
  date: Date;
  time: string;
  duration: number;
  location: string;
  maxParticipants?: number;
  currentParticipants: number;
  price: number;
  description: string;
  difficulty: 'مبتدئ' | 'متوسط' | 'متقدم';
  status: 'متاح' | 'ممتلئ' | 'ملغي' | 'مكتمل';
  bookedBy?: string[];
  requirements: string[];
  equipment: string[];
}

const mockSessions: Session[] = [
  {
    id: 'session_1',
    title: 'تدريب القوة الوظيفية',
    type: 'فردي',
    category: 'القوة',
    instructor: 'المدرب أحمد الصالح',
    date: new Date(2024, 9, 15, 16, 0),
    time: '16:00',
    duration: 60,
    location: 'صالة الألعاب الرياضية - الطابق الأول',
    price: 1500,
    description: 'تدريب شخصي مخصص لتطوير القوة الوظيفية والتوازن',
    difficulty: 'متوسط',
    status: 'متاح',
    currentParticipants: 0,
    requirements: ['فحص طبي', 'ملابس رياضية'],
    equipment: ['أوزان حرة', 'كرة توازن', 'حبال مقاومة']
  },
  {
    id: 'session_2',
    title: 'حصة السباحة الجماعية',
    type: 'جماعي',
    category: 'السباحة',
    instructor: 'المدربة فاطمة بن علي',
    date: new Date(2024, 9, 16, 15, 30),
    time: '15:30',
    duration: 45,
    location: 'المسبح الأولمبي',
    maxParticipants: 12,
    currentParticipants: 8,
    price: 800,
    description: 'تعلم تقنيات السباحة الأساسية في بيئة جماعية ممتعة',
    difficulty: 'مبتدئ',
    status: 'متاح',
    bookedBy: ['student_1', 'student_2'],
    requirements: ['إجادة السباحة الأساسية', 'شهادة صحية'],
    equipment: ['لوح سباحة', 'نظارات سباحة', 'طوق نجاة']
  },
  {
    id: 'session_3',
    title: 'تدريب التحمل القلبي',
    type: 'جماعي',
    category: 'التحمل',
    instructor: 'المدرب محمد الأمين',
    date: new Date(2024, 9, 17, 17, 0),
    time: '17:00',
    duration: 50,
    location: 'الملعب الخارجي',
    maxParticipants: 15,
    currentParticipants: 15,
    price: 600,
    description: 'تمارين متنوعة لتحسين اللياقة القلبية الوعائية',
    difficulty: 'متوسط',
    status: 'ممتلئ',
    requirements: ['لياقة أساسية', 'حذاء رياضي'],
    equipment: ['حبال قفز', 'أقماع تدريب', 'ساعة توقيت']
  },
  {
    id: 'session_4',
    title: 'يوغا الأطفال والمراهقين',
    type: 'جماعي',
    category: 'المرونة',
    instructor: 'المدربة عائشة الزهراء',
    date: new Date(2024, 9, 18, 14, 0),
    time: '14:00',
    duration: 40,
    location: 'استوديو اليوغا',
    maxParticipants: 10,
    currentParticipants: 6,
    price: 700,
    description: 'جلسة يوغا مصممة خصيصاً للأطفال والمراهقين',
    difficulty: 'مبتدئ',
    status: 'متاح',
    requirements: ['ملابس مريحة', 'سجادة يوغا'],
    equipment: ['سجادات يوغا', 'وسائد دعم', 'موسيقى هادئة']
  },
  {
    id: 'session_5',
    title: 'تدريب الدفاع عن النفس',
    type: 'جماعي',
    category: 'فنون قتالية',
    instructor: 'الأستاذ كريم بوعلام',
    date: new Date(2024, 9, 19, 16, 30),
    time: '16:30',
    duration: 75,
    location: 'دوجو الفنون القتالية',
    maxParticipants: 8,
    currentParticipants: 5,
    price: 1200,
    description: 'تعلم أساسيات الدفاع عن النفس والانضباط الذاتي',
    difficulty: 'متقدم',
    status: 'متاح',
    requirements: ['موافقة ولي الأمر', 'فحص طبي شامل'],
    equipment: ['واقيات', 'حصائر تدريب', 'معدات حماية']
  },
  {
    id: 'session_6',
    title: 'تدريب كرة السلة',
    type: 'جماعي',
    category: 'الألعاب الجماعية',
    instructor: 'المدرب يوسف الهادي',
    date: new Date(2024, 9, 20, 15, 0),
    time: '15:00',
    duration: 90,
    location: 'ملعب كرة السلة المغطى',
    maxParticipants: 12,
    currentParticipants: 9,
    price: 900,
    description: 'تطوير مهارات كرة السلة الأساسية والتكتيكات الجماعية',
    difficulty: 'متوسط',
    status: 'متاح',
    requirements: ['حذاء رياضي مناسب', 'ملابس رياضية'],
    equipment: ['كرات سلة', 'أقماع تدريب', 'سلال متنقلة']
  }
];

export function SchedulingSystem() {
  const [sessions, setSessions] = useState<Session[]>(mockSessions);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [selectedType, setSelectedType] = useState<string>('الكل');
  const [searchTerm, setSearchTerm] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const categories = ['الكل', 'القوة', 'التحمل', 'المرونة', 'السباحة', 'فنون قتالية', 'الألعاب الجماعية'];
  const types = ['الكل', 'فردي', 'جماعي'];

  const filteredSessions = sessions.filter(session => {
    const matchesDate = selectedDate ? 
      session.date.toDateString() === selectedDate.toDateString() : true;
    const matchesCategory = selectedCategory === 'الكل' || session.category === selectedCategory;
    const matchesType = selectedType === 'الكل' || session.type === selectedType;
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesDate && matchesCategory && matchesType && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'متاح': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
      case 'ممتلئ': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200';
      case 'ملغي': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
      case 'مكتمل': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'مبتدئ': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
      case 'متوسط': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200';
      case 'متقدم': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'القوة': return <Dumbbell className="h-4 w-4" />;
      case 'التحمل': return <Heart className="h-4 w-4" />;
      case 'المرونة': return <Activity className="h-4 w-4" />;
      case 'السباحة': return <Activity className="h-4 w-4" />;
      case 'فنون قتالية': return <Target className="h-4 w-4" />;
      case 'الألعاب الجماعية': return <Users className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const handleBookSession = (session: Session) => {
    setSelectedSession(session);
    setShowBookingForm(true);
  };

  const confirmBooking = () => {
    if (selectedSession) {
      setSessions(prev => prev.map(session => 
        session.id === selectedSession.id 
          ? { 
              ...session, 
              currentParticipants: session.currentParticipants + 1,
              status: session.currentParticipants + 1 >= (session.maxParticipants || 1) ? 'ممتلئ' : 'متاح'
            }
          : session
      ));
      setShowBookingForm(false);
      setSelectedSession(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <CalendarIcon className="h-6 w-6" />
            نظام جدولة الحصص الرياضية
          </CardTitle>
          <CardDescription className="text-green-100">
            احجز حصص رياضية متنوعة لأطفالك مع أفضل المدربين
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">البحث</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="ابحث عن حصة أو مدرب..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">التاريخ</CardTitle>
          </CardHeader>
          <CardContent>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, 'PPP', { locale: ar }) : 'اختر التاريخ'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => setSelectedDate(date || new Date())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">الفئة</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="اختر الفئة" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">النوع</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="اختر النوع" />
              </SelectTrigger>
              <SelectContent>
                {types.map(type => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSessions.map((session) => (
          <Card key={session.id} className="hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2 flex items-center gap-2">
                    {getCategoryIcon(session.category)}
                    {session.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getStatusColor(session.status)}>
                      {session.status}
                    </Badge>
                    <Badge className={getDifficultyColor(session.difficulty)}>
                      {session.difficulty}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      {session.type === 'فردي' ? <User className="h-3 w-3" /> : <Users className="h-3 w-3" />}
                      {session.type}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">{session.price} دج</div>
                  <div className="text-sm text-gray-500">{session.duration} دقيقة</div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {session.description}
              </p>
              
              {/* Session Details */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-500" />
                  <span>{session.instructor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-500" />
                  <span>{session.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-purple-500" />
                  <span className="truncate">{session.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-orange-500" />
                  <span>{format(session.date, 'dd/MM/yyyy')}</span>
                </div>
              </div>

              {/* Participants */}
              {session.type === 'جماعي' && session.maxParticipants && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>المشاركون</span>
                    <span>{session.currentParticipants}/{session.maxParticipants}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(session.currentParticipants / session.maxParticipants) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Requirements */}
              <div>
                <h4 className="font-medium text-sm mb-2">المتطلبات:</h4>
                <div className="flex flex-wrap gap-1">
                  {session.requirements.slice(0, 3).map((req, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {req}
                    </Badge>
                  ))}
                  {session.requirements.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{session.requirements.length - 3} أخرى
                    </Badge>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button 
                  className="flex-1" 
                  disabled={session.status === 'ممتلئ' || session.status === 'ملغي'}
                  onClick={() => handleBookSession(session)}
                >
                  {session.status === 'ممتلئ' ? (
                    <>
                      <AlertCircle className="h-4 w-4 mr-2" />
                      ممتلئ
                    </>
                  ) : session.status === 'ملغي' ? (
                    <>
                      <AlertCircle className="h-4 w-4 mr-2" />
                      ملغي
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      احجز الآن
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm">
                  التفاصيل
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredSessions.length === 0 && (
        <Card>
          <CardContent className="text-center p-8">
            <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">لا توجد حصص متاحة</h3>
            <p className="text-gray-500">جرب تغيير المرشحات أو اختيار تاريخ آخر</p>
          </CardContent>
        </Card>
      )}

      {/* Booking Confirmation Modal */}
      {showBookingForm && selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>تأكيد الحجز</CardTitle>
              <CardDescription>
                هل تريد حجز هذه الحصة؟
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium mb-2">{selectedSession.title}</h4>
                <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <div>المدرب: {selectedSession.instructor}</div>
                  <div>التاريخ: {format(selectedSession.date, 'PPP', { locale: ar })}</div>
                  <div>الوقت: {selectedSession.time}</div>
                  <div>المدة: {selectedSession.duration} دقيقة</div>
                  <div>السعر: {selectedSession.price} دج</div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="child-select">اختر الطفل</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الطفل" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student_1">أحمد محمد علي</SelectItem>
                    <SelectItem value="student_2">فاطمة الزهراء</SelectItem>
                    <SelectItem value="student_3">يوسف أحمد</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">ملاحظات إضافية</Label>
                <Textarea 
                  id="notes"
                  placeholder="أي ملاحظات أو متطلبات خاصة..."
                  className="mt-1"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={confirmBooking} className="flex-1">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  تأكيد الحجز
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowBookingForm(false)}
                  className="flex-1"
                >
                  إلغاء
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}