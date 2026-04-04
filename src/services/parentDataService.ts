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
  // Gamification & Performance
  streak: number;
  xp: number;
  level: number;
  mood?: 'سعيد' | 'متعب' | 'متحمس' | 'قلق' | 'هادئ';
  dailyTasks: {
    id: string;
    title: string;
    completed: boolean;
    category: 'بدني' | 'معرفي' | 'نفسي';
  }[];
  performance: {
    physical: number;
    cognitive: number;
    psychological: number;
  };
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
  aiMatchScore: number;
  avatar?: string;
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
    age: 12,
    grade: 'السنة الثانية متوسط',
    school: 'متوسطة الشهيد محمد بوضياف',
    deviceCapabilities: { hasWearable: true, hasBIA: true, hasHeartRate: true, hasGPS: true, hasAdvancedMetrics: true },
    currentStats: { steps: 8543, stepsGoal: 10000, distance: 6.2, calories: 320, heartRate: 78, activeTime: 180, sedentaryTime: 420 },
    healthStatus: 'ممتاز',
    lastActivity: 'منذ ساعتين',
    upcomingSchedule: [{ activity: 'تدريب كرة القدم', time: '16:00', type: 'جماعي' }, { activity: 'تمرين القوة', time: '18:30', type: 'فردي' }],
    streak: 5,
    xp: 1250,
    level: 4,
    mood: 'سعيد',
    dailyTasks: [
      { id: 't1', title: 'تمرين الضغط (20)', completed: true, category: 'بدني' },
      { id: 't2', title: 'حل لغز منطقي', completed: false, category: 'معرفي' },
      { id: 't3', title: 'تأمل لمدة 5 دقائق', completed: false, category: 'نفسي' }
    ],
    performance: { physical: 85, cognitive: 72, psychological: 90 }
  },
  {
    id: 'student_2',
    name: 'سارة ياسمين',
    age: 10,
    grade: 'السنة الخامسة ابتدائي',
    school: 'ابتدائية الفارابي',
    deviceCapabilities: { hasWearable: true, hasBIA: false, hasHeartRate: true, hasGPS: false, hasAdvancedMetrics: false },
    currentStats: { steps: 4200, stepsGoal: 8000, distance: 3.1, calories: 150, heartRate: 82, activeTime: 90, sedentaryTime: 360 },
    healthStatus: 'جيد',
    lastActivity: 'منذ ساعة',
    upcomingSchedule: [{ activity: 'السباحة', time: '17:00', type: 'جماعي' }],
    streak: 3,
    xp: 850,
    level: 2,
    mood: 'متحمس',
    dailyTasks: [
      { id: 't4', title: 'سباحة حرة (30 دقيقة)', completed: false, category: 'بدني' },
      { id: 't5', title: 'قراءة قصة قصيرة', completed: true, category: 'معرفي' }
    ],
    performance: { physical: 78, cognitive: 88, psychological: 82 }
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
  { id: 'c1', name: 'المدرب كريم بوعلام', specialty: 'كرة قدم ⚽', rating: 4.8, sessions: 120, available: ['السبت 10:00', 'الأحد 14:00', 'الثلاثاء 16:00'], location: 'ملعب الشهيد — الشلف', phone: '0555 123 456', price: 1500, aiMatchScore: 95 },
  { id: 'c2', name: 'المدربة آمال سعيد', specialty: 'جمباز 🤸', rating: 4.9, sessions: 85, available: ['الجمعة 09:00', 'السبت 11:00'], location: 'قاعة الشهداء — قسنطينة', phone: '0661 789 012', price: 1800, aiMatchScore: 88 },
  { id: 'c3', name: 'المدرب وليد جاسم', specialty: 'تنس طاولة 🏓', rating: 4.5, sessions: 210, available: ['الإثنين 17:00'], location: 'نادي النصر — الجزائر', phone: '0770 112 233', price: 1200, aiMatchScore: 92 },
  { id: 'c4', name: 'المدربة مريم بن يحيى', specialty: 'يوغا وسكينة 🧘', rating: 4.7, sessions: 150, available: ['الثلاثاء 10:00'], location: 'مركز الراحة — تيبازة', phone: '0552 445 566', price: 2000, aiMatchScore: 85 }
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
    return this.get('children', INITIAL_CHILDREN);
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
      upcomingSchedule: [],
      streak: 0,
      xp: 0,
      level: 1,
      mood: 'هادئ',
      dailyTasks: [],
      performance: { physical: 50, cognitive: 50, psychological: 50 }
    };
    children.push(newChild);
    this.set('children', children);
    auditService.log('إضافة طفل', `تمت إضافة طفل جديد: ${newChild.name}`);
    return newChild;
  }

  public updateMood(childId: string, mood: Child['mood']) {
    const children = this.getChildren();
    const child = children.find(c => c.id === childId);
    if (child) {
      child.mood = mood;
      this.set('children', children);
      auditService.log('تحديث الحالة المزاجية', `تم تحديث مزاج ${child.name} إلى ${mood}`);
    }
  }

  public toggleTask(childId: string, taskId: string) {
    const children = this.getChildren();
    const child = children.find(c => c.id === childId);
    if (child) {
      const task = child.dailyTasks.find(t => t.id === taskId);
      if (task) {
        task.completed = !task.completed;
        if (task.completed) {
          child.xp += 50;
          if (child.xp >= child.level * 500) {
            child.level += 1;
          }
        }
        this.set('children', children);
        auditService.log('تحديث مهمة', `تم ${task.completed ? 'إتمام' : 'إلغاء'} مهمة "${task.title}" لـ ${child.name}`);
      }
    }
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
