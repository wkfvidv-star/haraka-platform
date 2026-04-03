import { auditService } from './auditService';

// --- Types ---
export interface Child {
  id: string;
  name: string;
  age: number;
  birthDate?: string;
  gender?: 'ذكر' | 'أنثى';
  grade: string;
  school: string;
  avatar?: string;
  targetGoal?: 'تحسين اللياقة' | 'تحسين التركيز' | 'الرفاه النفسي' | 'رياضة تنافسية';
  deviceCapabilities: {
    hasWearable: boolean;
    hasBIA: boolean;
    hasHeartRate: boolean;
    hasGPS: boolean;
    hasAdvancedMetrics: boolean;
  };
  currentStats: {
    steps: number;
    stepsGoal: number;
    distance: number;
    calories: number;
    heartRate?: number;
    activeTime: number;
    sedentaryTime: number;
  };
  healthStatus: 'ممتاز' | 'جيد' | 'متوسط' | 'يحتاج تحسين';
  lastActivity: string;
  upcomingSchedule: {
    activity: string;
    time: string;
    type: 'فردي' | 'جماعي';
  }[];
}

export interface Message {
  id: string;
  from: {
    id: string;
    name: string;
    role: 'teacher' | 'principal' | 'coach' | 'ministry';
    avatar?: string;
  };
  to: string[];
  subject: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  priority: 'عادي' | 'مهم' | 'عاجل';
  category: 'أكاديمي' | 'رياضي' | 'صحي' | 'إداري' | 'عام';
  attachments?: {
    name: string;
    size: string;
    type: string;
  }[];
  relatedChild?: string;
}

export interface Coach {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  sessions: number;
  available: string[];
  location: string;
  phone: string;
  price: number;
}

export interface Report {
  id: string;
  from: string;
  fromRole: 'أستاذ' | 'مدرب';
  date: string;
  subject: string;
  content: string;
  score?: number;
  read: boolean;
}

export interface NutritionPlan {
  id: string;
  name: string;
  goal: string;
  meals: { time: string; items: string[] }[];
}

export interface Booking {
  id: string;
  coachId: string;
  coachName: string;
  slot: string;
  timestamp: string;
  status: 'مؤكد' | 'مؤجل' | 'ملغي';
}

// --- Initial Mock Data ---
const INITIAL_CHILDREN: Child[] = [
  {
    id: 'student_1',
    name: 'أحمد محمد علي',
    age: 14,
    grade: 'السنة الثالثة متوسط',
    school: 'متوسطة الشهيد محمد بوضياف',
    deviceCapabilities: { hasWearable: true, hasBIA: true, hasHeartRate: true, hasGPS: true, hasAdvancedMetrics: true },
    currentStats: { steps: 8543, stepsGoal: 10000, distance: 6.2, calories: 320, heartRate: 78, activeTime: 180, sedentaryTime: 420 },
    healthStatus: 'ممتاز',
    lastActivity: 'منذ ساعتين',
    upcomingSchedule: [{ activity: 'تدريب كرة القدم', time: '16:00', type: 'جماعي' }, { activity: 'تمرين القوة', time: '18:30', type: 'فردي' }]
  },
  {
    id: 'student_2',
    name: 'فاطمة الزهراء',
    age: 16,
    grade: 'السنة الثانية ثانوي',
    school: 'ثانوية عبد الحميد بن باديس',
    deviceCapabilities: { hasWearable: true, hasBIA: false, hasHeartRate: true, hasGPS: false, hasAdvancedMetrics: false },
    currentStats: { steps: 9200, stepsGoal: 10000, distance: 7.1, calories: 380, heartRate: 72, activeTime: 210, sedentaryTime: 390 },
    healthStatus: 'جيد',
    lastActivity: 'منذ 30 دقيقة',
    upcomingSchedule: [{ activity: 'سباحة', time: '15:30', type: 'جماعي' }, { activity: 'يوغا', time: '19:00', type: 'فردي' }]
  }
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg_1',
    from: { id: 'teacher_1', name: 'الأستاذ محمد الصالح', role: 'teacher' },
    to: ['parent_1'],
    subject: 'تقرير الأداء الرياضي الأسبوعي لأحمد',
    content: 'السلام عليكم ورحمة الله وبركاته،\n\nأتشرف بإرسال تقرير الأداء الرياضي...',
    timestamp: new Date(2024, 9, 15, 14, 30).toISOString(),
    isRead: false,
    isStarred: true,
    priority: 'مهم',
    category: 'رياضي',
    relatedChild: 'student_1'
  }
];

const INITIAL_COACHES: Coach[] = [
  { id: 'c1', name: 'المدرب كريم بوعلام', specialty: 'كرة قدم ⚽', rating: 4.8, sessions: 120, available: ['السبت 10:00', 'الأحد 14:00', 'الثلاثاء 16:00'], location: 'ملعب الشهيد — الشلف', phone: '0555 123 456', price: 1500 },
  { id: 'c2', name: 'المدربة آمال سعيد', specialty: 'جمباز 🤸', rating: 4.9, sessions: 85, available: ['الجمعة 09:00', 'السبت 11:00'], location: 'قاعة الشهداء — قسنطينة', phone: '0661 789 012', price: 1800 }
];

const INITIAL_REPORTS: Report[] = [
  { id: 'r1', from: 'أستاذ أحمد لعماري', fromRole: 'أستاذ', date: '2026-03-25', subject: 'تقرير الأداء الأسبوعي', content: 'يُبدي ياسين تحسناً ملحوظاً...', score: 16, read: false },
  { id: 'r2', from: 'المدرب كريم بوعلام', fromRole: 'مدرب', date: '2026-03-22', subject: 'تقييم جلسة التدريب', content: 'ياسين مجتهد ومتحمس...', score: 18, read: false }
];

const INITIAL_PLANS: NutritionPlan[] = [
  {
    id: 'n1', name: 'خطة بناء العضلات', goal: 'كتلة عضلية + قوة',
    meals: [{ time: 'الفطور 07:30', items: ['بيض مسلوق × 3', 'خبز أسمر × 2'] }]
  }
];

class ParentDataService {
  private get<T>(key: string, initialData: T): T {
    try {
      const data = localStorage.getItem(`parent_data_${key}`);
      if (data) return JSON.parse(data);
      this.set(key, initialData);
      return initialData;
    } catch {
      return initialData;
    }
  }

  private set<T>(key: string, data: T) {
    localStorage.setItem(`parent_data_${key}`, JSON.stringify(data));
  }

  // Children
  public getChildren(): Child[] {
    return this.get('children', []); // Changing default to empty for fresh experience
  }

  public addChild(data: Partial<Child>) {
    const children = this.getChildren();
    const newChild: Child = {
      id: `student_${Date.now()}`,
      name: data.name || 'طفل جديد',
      age: data.age || 10,
      birthDate: data.birthDate,
      gender: data.gender,
      grade: data.grade || 'غير محدد',
      school: data.school || 'غير محدد',
      targetGoal: data.targetGoal,
      avatar: data.avatar,
      deviceCapabilities: { hasWearable: false, hasBIA: false, hasHeartRate: false, hasGPS: false, hasAdvancedMetrics: false },
      currentStats: { steps: 0, stepsGoal: 10000, distance: 0, calories: 0, activeTime: 0, sedentaryTime: 0 },
      healthStatus: 'متوسط',
      lastActivity: 'تمت الإضافة مؤخراً',
      upcomingSchedule: []
    };
    children.push(newChild);
    this.set('children', children);
    auditService.log('إضافة طفل', `تمت إضافة طفل جديد: ${newChild.name}`);
    return newChild;
  }

  // Coaches & Bookings
  public getCoaches(): Coach[] {
    return INITIAL_COACHES; // Static for now
  }

  public getBookings(): Booking[] {
    return this.get('bookings', []);
  }

  public addBooking(coachId: string, coachName: string, slot: string) {
    const bookings = this.getBookings();
    const newBooking: Booking = {
      id: `b_${Date.now()}`,
      coachId,
      coachName,
      slot,
      timestamp: new Date().toISOString(),
      status: 'مؤكد'
    };
    bookings.push(newBooking);
    this.set('bookings', bookings);
    auditService.log('حجز حصة', `تم حجز حصة مع ${coachName} في موعد ${slot}`);
  }

  // Reports
  public getReports(): Report[] {
    return this.get('reports', INITIAL_REPORTS);
  }

  public markReportAsRead(reportId: string) {
    const reports = this.getReports();
    const report = reports.find(r => r.id === reportId);
    if (report && !report.read) {
      report.read = true;
      this.set('reports', reports);
      auditService.log('قراءة تقرير', `تمت قراءة التقرير: ${report.subject}`);
    }
  }

  // Messages
  public getMessages(): Message[] {
    return this.get('messages', INITIAL_MESSAGES);
  }

  public markMessageAsRead(messageId: string) {
    const messages = this.getMessages();
    const msg = messages.find(m => m.id === messageId);
    if (msg && !msg.isRead) {
      msg.isRead = true;
      this.set('messages', messages);
      auditService.log('قراءة رسالة', `تمت قراءة الرسالة: ${msg.subject}`);
    }
  }

  public toggleMessageStar(messageId: string) {
    const messages = this.getMessages();
    const msg = messages.find(m => m.id === messageId);
    if (msg) {
      msg.isStarred = !msg.isStarred;
      this.set('messages', messages);
    }
  }

  public sendMessage(to: string, subject: string, content: string) {
    const messages = this.getMessages();
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      from: { id: 'parent_current', name: 'ولي الأمر', role: 'teacher' }, // using teacher icon visually or generalized
      to: [to],
      subject,
      content,
      timestamp: new Date().toISOString(),
      isRead: true, // we sent it
      isStarred: false,
      priority: 'عادي',
      category: 'عام'
    };
    messages.unshift(newMsg);
    this.set('messages', messages);
    auditService.log('إرسال رسالة', `تم إرسال رسالة بعنوان: ${subject}`);
  }

  // Nutrition
  public getNutritionPlans(): NutritionPlan[] {
    return INITIAL_PLANS;
  }
}

export const parentDataService = new ParentDataService();
