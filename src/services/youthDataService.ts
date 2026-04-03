import { auditService } from './auditService';

export interface YouthSession {
  id: string;
  title: string;
  coach: string;
  time: string;
  date: string;
  type: 'in-person' | 'online' | 'group';
  category: 'physical' | 'cognitive' | 'psychological';
  location?: string;
  status: 'upcoming' | 'confirmed' | 'completed' | 'cancelled' | 'postponed';
  duration: string;
}

export interface YouthReport {
  id: string;
  title: string;
  coach: string;
  date: string;
  type: 'training' | 'diet' | 'video';
  category: 'physical' | 'cognitive' | 'psychological';
  status: 'new' | 'read';
  details: string;
}

export interface YouthMeal {
  id: string;
  name: string;
  time: string;
  emoji: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  foods: { name: string; qty: string; cal: number }[];
  completed: boolean;
}

export interface YouthMessage {
  id: string;
  sender: 'coach' | 'youth';
  text: string;
  timestamp: string;
  status: 'seen' | 'unseen';
}

export interface YouthTask {
  id: string;
  title: string;
  coach: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'late';
  details: string;
}

class YouthDataService {
  private getUserId(): string {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return 'default_youth';
      const user = JSON.parse(userStr);
      return user?.id || 'default_youth';
    } catch (e) {
      console.warn("YouthDataService: Failed to parse user data", e);
      return 'default_youth';
    }
  }

  private storageKey(suffix: string): string {
    return `haraka_youth_${this.getUserId()}_${suffix}`;
  }

  // --- Tasks ---
  public getTasks(): YouthTask[] {
    const data = localStorage.getItem(this.storageKey('tasks'));
    if (!data) {
      const mocks: YouthTask[] = [
        { id: 't1', title: 'تسجيل فيديو لتقييم الـ Squat', coach: 'الكابتن أحمد', dueDate: '2024-03-30', status: 'pending', details: 'يرجى تصوير تمرين السكوات من زاوية جانبية وإرفاقه هنا للتقييم.' },
        { id: 't2', title: 'قراءة مقال القوة الذهنية', coach: 'د. ليلى', dueDate: '2024-03-25', status: 'late', details: 'مقال القوة الذهنية المرفق الأسبوع الماضي، برجاء قراءته.' },
        { id: 't3', title: 'اختبار المرونة القياسي', coach: 'الكابتن محمود', dueDate: '2024-03-20', status: 'completed', details: 'تم تنفيذ الاختبار بنجاح.' }
      ];
      this.saveTasks(mocks);
      return mocks;
    }
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("YouthDataService: Failed to parse tasks", e);
      return [];
    }
  }

  public saveTasks(tasks: YouthTask[]) {
    localStorage.setItem(this.storageKey('tasks'), JSON.stringify(tasks));
  }

  public submitTask(id: string) {
    const tasks = this.getTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1 && tasks[index].status !== 'completed') {
      tasks[index].status = 'completed';
      this.saveTasks(tasks);
      auditService.log('تسليم مهمة', `تم تسليم المهمة: ${tasks[index].title}`, 'youth');
    }
  }

  // --- Sessions ---
  public getSessions(): YouthSession[] {
    const data = localStorage.getItem(this.storageKey('sessions'));
    if (!data) {
      const mocks: YouthSession[] = [
        {
          id: 's1', title: 'حصة القوة والتحمل (بدني)', coach: 'الكابتن أحمد',
          time: '10:00 ص', date: '2024-03-26', type: 'in-person', category: 'physical',
          location: 'القاعة A', status: 'confirmed', duration: '60 دقيقة'
        },
        {
          id: 's2', title: 'تدريب الإدراك الحركي (معرفي)', coach: 'د. ليلى',
          time: '06:00 م', date: '2024-03-27', type: 'online', category: 'cognitive',
          status: 'upcoming', duration: '45 دقيقة'
        }
      ];
      this.saveSessions(mocks);
      return mocks;
    }
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("YouthDataService: Failed to parse sessions", e);
      return [];
    }
  }

  public saveSessions(sessions: YouthSession[]) {
    localStorage.setItem(this.storageKey('sessions'), JSON.stringify(sessions));
  }

  public addSession(session: Omit<YouthSession, 'id'>) {
    const sessions = this.getSessions();
    const newSession = { ...session, id: Math.random().toString(36).substr(2, 9) };
    sessions.unshift(newSession);
    this.saveSessions(sessions);
    auditService.log('حجز حصة', `تم حجز حصة: ${session.title} مع ${session.coach}`, 'youth');
    return newSession;
  }

  public updateSessionStatus(id: string, status: YouthSession['status']) {
    const sessions = this.getSessions();
    const index = sessions.findIndex(s => s.id === id);
    if (index !== -1) {
      sessions[index].status = status;
      this.saveSessions(sessions);
      auditService.log('تحديث حصة', `تغيير حالة حصة ${sessions[index].title} إلى ${status}`, 'youth');
    }
  }

  // --- Reports ---
  public getReports(): YouthReport[] {
    const data = localStorage.getItem(this.storageKey('reports'));
    if (!data) {
      const mocks: YouthReport[] = [
        { id: 'r1', title: 'تقرير الأداء البدني الأسبوعي', coach: 'الكابتن أحمد', date: 'أمس', type: 'training', category: 'physical', status: 'new', details: 'تحسن ملحوظ في قوة التحمل...' },
        { id: 'd1', title: 'خطة التغذية للرياضيين', coach: 'أخصائية التغذية', date: 'اليوم', type: 'diet', category: 'physical', status: 'new', details: 'نظام عجز السعرات المخصص...' },
        { id: 'v1', title: 'تحليل تكنيك السكوات', coach: 'الكابتن أحمد', date: 'منذ ساعتين', type: 'video', category: 'physical', status: 'read', details: 'ملاحظات على زاوية الركبة...' }
      ];
      this.saveReports(mocks);
      return mocks;
    }
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("YouthDataService: Failed to parse reports", e);
      return [];
    }
  }

  public saveReports(reports: YouthReport[]) {
    localStorage.setItem(this.storageKey('reports'), JSON.stringify(reports));
  }

  public markReportAsRead(id: string) {
    const reports = this.getReports();
    const index = reports.findIndex(r => r.id === id);
    if (index !== -1 && reports[index].status === 'new') {
      reports[index].status = 'read';
      this.saveReports(reports);
      auditService.log('قراءة تقرير', `تم الاطلاع على تقرير: ${reports[index].title}`, 'youth');
    }
  }

  // --- Nutrition Plan ---
  public getNutritionPlan(): YouthMeal[] {
    const data = localStorage.getItem(this.storageKey('nutrition'));
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("YouthDataService: Failed to parse nutrition plan", e);
      return [];
    }
  }

  public saveNutritionPlan(meals: YouthMeal[]) {
    localStorage.setItem(this.storageKey('nutrition'), JSON.stringify(meals));
  }

  public toggleMealCompletion(id: string) {
    const meals = this.getNutritionPlan();
    const index = meals.findIndex(m => m.id === id);
    if (index !== -1) {
      meals[index].completed = !meals[index].completed;
      this.saveNutritionPlan(meals);
      const action = meals[index].completed ? 'إتمام وجبة' : 'تراجع عن وجبة';
      auditService.log(action, `${action}: ${meals[index].name}`, 'youth');
    }
  }

  // --- Messaging ---
  public getMessages(): YouthMessage[] {
    const data = localStorage.getItem(this.storageKey('messages'));
    if (!data) {
      const mocks: YouthMessage[] = [
        { id: 'm1', sender: 'coach', text: 'أهلاً بك! كيف كان تدريب اليوم؟', timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'seen' },
        { id: 'm2', sender: 'youth', text: 'كان ممتازاً، بدأت أشعر بتحسن في الرشاقة.', timestamp: new Date(Date.now() - 3000000).toISOString(), status: 'seen' }
      ];
      this.saveMessages(mocks);
      return mocks;
    }
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("YouthDataService: Failed to parse messages", e);
      return [];
    }
  }

  public saveMessages(messages: YouthMessage[]) {
    localStorage.setItem(this.storageKey('messages'), JSON.stringify(messages));
  }

  public sendMessage(text: string) {
    const messages = this.getMessages();
    const newMessage: YouthMessage = {
      id: Math.random().toString(36).substr(2, 9),
      sender: 'youth',
      text,
      timestamp: new Date().toISOString(),
      status: 'unseen'
    };
    messages.push(newMessage);
    this.saveMessages(messages);
    auditService.log('إرسال رسالة', `تم إرسال رسالة للمدرب: ${text.substring(0, 20)}...`, 'youth');
    
    // Simulate auto-reply from coach for demo
    setTimeout(() => {
      this.receiveMessage(`رسالة تلقائية من المدرب: شكراً لتواصلك! سأقوم بالرد عليك قريباً.`);
    }, 2000);

    return newMessage;
  }

  public receiveMessage(text: string) {
    const messages = this.getMessages();
    const newMessage: YouthMessage = {
      id: Math.random().toString(36).substr(2, 9),
      sender: 'coach',
      text,
      timestamp: new Date().toISOString(),
      status: 'unseen'
    };
    messages.push(newMessage);
    this.saveMessages(messages);
    window.dispatchEvent(new CustomEvent('haraka_new_coach_message', { detail: newMessage }));
  }

  public markMessagesAsSeen() {
    const messages = this.getMessages();
    let updated = false;
    messages.forEach(m => {
      if (m.sender === 'coach' && m.status === 'unseen') {
        m.status = 'seen';
        updated = true;
      }
    });
    if (updated) this.saveMessages(messages);
  }
}

export const youthDataService = new YouthDataService();
