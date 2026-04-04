import React, { createContext, useContext, useState, ReactNode } from 'react';
import { coachClients } from '@/data/mockCoachData';
import { toast } from 'sonner';

export type CoachSession = {
  id: string | number;
  time: string;
  type: string;
  client: string;
  location: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  color: string;
  date?: string;
};

export type DiscoveredYouth = {
  id: string | number;
  name: string;
  age: number;
  goal: string;
  level: string;
  matchPercentage: number;
  matchReason: string;
  tags: string[];
};

export type TrainingRequest = {
  id: string | number;
  senderName: string;
  senderType: 'parent' | 'youth';
  goal: string;
  details: string;
  status: 'pending' | 'accepted' | 'rejected' | 'offered';
  tags: string[];
};

export type BookingRequest = {
  id: string | number;
  client: string;
  details: string;
  status: 'pending' | 'approved' | 'rejected';
};

export type NotificationType = {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  isRead: boolean;
  type: 'video' | 'calendar' | 'report' | 'system';
};

export type AuditLogEntry = {
  id: string;
  timestamp: string;
  action: string;
  details: string;
};

interface CoachDashboardContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  // State
  sessions: CoachSession[];
  bookingRequests: BookingRequest[];
  trainingRequests: TrainingRequest[];
  discoveredYouths: DiscoveredYouth[];
  trainees: any[];
  setTrainees: React.Dispatch<React.SetStateAction<any[]>>;
  notifications: NotificationType[];
  auditLogs: AuditLogEntry[];
  // Actions
  addAuditLog: (action: string, details: string) => void;
  approveBooking: (id: string | number) => void;
  rejectBooking: (id: string | number) => void;
  createSession: (session: Partial<CoachSession>) => void;
  cancelSession: (id: string | number) => void;
  sendPerformanceReport: (traineeId: string, details: any) => void;
  markNotificationsAsRead: () => void;
  requestToTrain: (youthId: string | number) => void;
  ignoreYouth: (youthId: string | number) => void;
  acceptTrainingRequest: (id: string | number) => void;
  rejectTrainingRequest: (id: string | number) => void;
  sendOffer: (id: string | number, offerDetails?: any) => void;
}

export const CoachDashboardContext = createContext<CoachDashboardContextType>({
  activeTab: 'overview',
  setActiveTab: () => {},
  sessions: [],
  bookingRequests: [],
  trainingRequests: [],
  discoveredYouths: [],
  trainees: [],
  setTrainees: () => {},
  notifications: [],
  auditLogs: [],
  addAuditLog: () => {},
  approveBooking: () => {},
  rejectBooking: () => {},
  createSession: () => {},
  cancelSession: () => {},
  sendPerformanceReport: () => {},
  markNotificationsAsRead: () => {},
  requestToTrain: () => {},
  ignoreYouth: () => {},
  acceptTrainingRequest: () => {},
  rejectTrainingRequest: () => {},
  sendOffer: () => {},
});

export const useCoachDashboard = () => useContext(CoachDashboardContext);

export const CoachDashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Initial Mock State
  const [sessions, setSessions] = useState<CoachSession[]>([
    { id: 1, time: '09:00 ص', type: 'تدريب شخصي', client: 'محمد', location: 'الصالة الرئيسية', status: 'upcoming', color: 'bg-blue-500' },
    { id: 2, time: '11:30 ص', type: 'متابعة عن بُعد', client: 'رحيم', location: 'مكالمة فيديو', status: 'completed', color: 'bg-emerald-500' },
    { id: 3, time: '02:00 م', type: 'تدريب شخصي', client: 'رامي', location: 'منطقة الأوزان الحرة', status: 'upcoming', color: 'bg-orange-500' },
    { id: 4, time: '05:00 م', type: 'تدريب شخصي', client: 'عبد الله', location: 'الصالة الرئيسية', status: 'upcoming', color: 'bg-blue-500' },
  ]);

  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([
    { id: 1, client: 'محمد', details: 'اليوم, 08:00 م - تدريب أوزان حرة', status: 'pending' },
    { id: 2, client: 'عبد الله', details: 'غداً, 05:00 م - لياقة بدنية', status: 'pending' },
  ]);

  const [trainingRequests, setTrainingRequests] = useState<TrainingRequest[]>([
    { id: 1, senderName: 'ولي أمر أحمد', senderType: 'parent', goal: 'تأهيل بدني وبناء ثقة', details: 'ابني عمره ١٤ سنة يحتاج لبرنامج تقوية وتأهيل من إصابة خفيفة مسبقة.', status: 'pending', tags: ['Urgent', 'Rehab'] },
    { id: 2, senderName: 'ياسين محمود', senderType: 'youth', goal: 'احتراف كرة القدم', details: 'أبحث عن مدرب لرفع سرعتي ولياقتي في الجري، أتدرب ٣ أيام أسبوعياً حالياً.', status: 'pending', tags: ['High Potential'] },
  ]);

  const [discoveredYouths, setDiscoveredYouths] = useState<DiscoveredYouth[]>([
    { id: 'dy1', name: 'عمر خالد', age: 16, goal: 'تضخيم عضلي وزيادة قوة', level: 'متوسط', matchPercentage: 96, matchReason: 'تطابق كامل في التخصص الجسدي وطلب القوة', tags: ['Recommended', 'Match'] },
    { id: 'dy2', name: 'سيف الدين', age: 15, goal: 'إنقاص وزن ولياقة عامة', level: 'مبتدئ', matchPercentage: 88, matchReason: 'محتاج لتأسيس بدني يتوافق مع أسلوبك', tags: ['Beginner'] },
    { id: 'dy3', name: 'طارق زياد', age: 17, goal: 'تحضير لبطولة ألعاب قوى', level: 'متقدم', matchPercentage: 75, matchReason: 'نفس الاهتمامات السابقة في التدريب', tags: ['High Potential', 'Pro'] },
    { id: 'dy4', name: 'ريان أحمد', age: 14, goal: 'لياقة وتأسيس سليم', level: 'مبتدئ', matchPercentage: 62, matchReason: 'قريب جغرافياً في التدريب', tags: [] },
  ]);

  const [trainees, setTrainees] = useState<any[]>(coachClients);

  const [notifications, setNotifications] = useState<NotificationType[]>([
    { id: '1', title: 'رحيم قد رفع فيديو جديد', message: 'تمرين الرفعة الميتة (Deadlift)', type: 'video', timeAgo: 'منذ 10 دقائق', isRead: false },
    { id: '2', title: 'طلب موعد جديد', message: 'عبدالله طلب موعداً لجلسة تقييم غداً', type: 'calendar', timeAgo: 'منذ ساعتين', isRead: false }
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  // Function to add Audit Log
  const addAuditLog = (action: string, details: string) => {
    const newLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      action,
      details,
    };
    setAuditLogs(prev => [newLog, ...prev]);
    // In background, this doesn't show to user currently unless we create a UI for it.
    console.log('[Audit Log]:', newLog); 
  };

  const approveBooking = (id: string | number) => {
    const request = bookingRequests.find(r => r.id === id);
    if (!request) return;

    setBookingRequests(prev => prev.filter(r => r.id !== id));
    
    // Add to sessions based on request detail mock parsing
    const newSession: CoachSession = {
      id: Math.random().toString(36).substring(7),
      client: request.client,
      type: request.details.split('-')[1]?.trim() || 'غير محدد',
      time: request.details.split('-')[0]?.split(',')[1]?.trim() || '12:00 م',
      location: 'محدد لاحقاً',
      color: 'bg-emerald-500',
      status: 'upcoming'
    };
    
    setSessions(prev => [newSession, ...prev]);
    addAuditLog('قبول حجز', `تم قبول حجز الشاب ${request.client}`);
    handlePushNotification(`تم قبول حجز ${request.client}`, 'calendar');
    toast.success('تمت الموافقة على الحجز بنجاح وإضافته للجدول');
  };

  const rejectBooking = (id: string | number) => {
    const request = bookingRequests.find(r => r.id === id);
    if (!request) return;

    setBookingRequests(prev => prev.filter(r => r.id !== id));
    addAuditLog('رفض حجز', `تم رفض حجز الشاب ${request.client}`);
    toast.error('تم رفض الحجز وإشعار الشاب');
  };

  const requestToTrain = (youthId: string | number) => {
    setDiscoveredYouths(prev => prev.filter(y => y.id !== youthId));
    toast.success('تم إرسال طلب التدريب للشاب بنجاح');
  };

  const ignoreYouth = (youthId: string | number) => {
    setDiscoveredYouths(prev => prev.filter(y => y.id !== youthId));
  };

  const acceptTrainingRequest = (id: string | number) => {
    const req = trainingRequests.find(r => r.id === id);
    if (!req) return;

    setTrainingRequests(prev => prev.filter(r => r.id !== id));
    toast.success(`تم قبول طلب ${req.senderName} وهو الآن بانتظار إتمام الدفع أو التأكيد`);
  };

  const rejectTrainingRequest = (id: string | number) => {
    setTrainingRequests(prev => prev.filter(r => r.id !== id));
    toast.error('تم رفض الطلب');
  };

  const sendOffer = (id: string | number, offerDetails?: any) => {
    setTrainingRequests(prev => prev.filter(r => r.id !== id));
    console.log('Sent offer details: ', offerDetails);
    toast.success('تم إرسال العرض المخصص بنجاح');
  };

  const createSession = (session: Partial<CoachSession>) => {
    const newSession = {
      id: Math.random().toString(36).substring(7),
      time: session.time || '10:00 ص',
      type: session.type || 'تدريب عام',
      client: session.client || 'مجموعة متدربين',
      location: session.location || 'المنصة',
      color: session.color || 'bg-blue-500',
      status: 'upcoming' as const
    };
    setSessions(prev => [...prev, newSession]);
    addAuditLog('إنشاء حصة', `تم إنشاء حصة جديدة: ${newSession.type}`);
    handlePushNotification(`حصة جديدة: ${newSession.type}`, 'calendar');
    toast.success('تم إنشاء الحصة الجديدة بنجاح');
  };

  const cancelSession = (id: string | number) => {
    const session = sessions.find(s => s.id === id);
    if (!session) return;
    setSessions(prev => prev.map(s => s.id === id ? { ...s, status: 'cancelled', color: 'bg-red-500' } : s));
    addAuditLog('إلغاء حصة', `تم إلغاء حصة ${session.client}`);
    handlePushNotification(`تم إلغاء حصة ${session.client}`, 'system');
    toast.error('تم إلغاء الحصة التدريبية');
  };

  const sendPerformanceReport = (traineeId: string, details: any) => {
    const trainee = trainees.find(t => t.id === traineeId);
    if (!trainee) return;
    
    addAuditLog('إرسال تقرير تقييم', `تم إرسال تقرير أداء إلى المتدرب ${trainee.name}`);
    handlePushNotification(`أرسلت تقرير أداء جديد إلى ${trainee.name}`, 'report');
    toast.success('تم إرسال التقرير للشاب بنجاح');
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handlePushNotification = (message: string, type: NotificationType['type']) => {
    const newNotification: NotificationType = {
      id: Math.random().toString(36).substring(7),
      title: 'إشعار نظام',
      message: message,
      type: type,
      timeAgo: 'الآن',
      isRead: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  return (
    <CoachDashboardContext.Provider value={{
      activeTab, setActiveTab,
      sessions, bookingRequests, trainingRequests, discoveredYouths, trainees, setTrainees, notifications, auditLogs,
      addAuditLog, approveBooking, rejectBooking, createSession, cancelSession,
      sendPerformanceReport, markNotificationsAsRead,
      requestToTrain, ignoreYouth, acceptTrainingRequest, rejectTrainingRequest, sendOffer
    }}>
      {children}
    </CoachDashboardContext.Provider>
  );
};

