import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Bell,
  BellRing,
  Calendar,
  Watch,
  FileText,
  Trophy,
  Clock,
  Info,
  CheckCircle,
  AlertTriangle,
  X,
  Eye,
  Archive,
  Trash2,
  Settings
} from 'lucide-react';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'booking' | 'device_pairing' | 'progress_report' | 'competition_result' | 'system' | 'reminder';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isRead: boolean;
  timestamp: string;
  actionUrl?: string;
  data?: Record<string, unknown>;
}

export function NotificationCenter({ isOpen, onClose, userRole = 'student' }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'notif_1',
      title: 'تم تأكيد حجز الجلسة التدريبية',
      message: 'تم تأكيد حجزك لجلسة التدريب يوم الأحد 6 أكتوبر في تمام الساعة 4:00 مساءً مع المدرب سامي علي',
      type: 'booking',
      priority: 'medium',
      isRead: false,
      timestamp: '2024-10-02T15:30:00Z',
      actionUrl: '/bookings/session_123',
      data: { sessionId: 'session_123', date: '2024-10-06', time: '16:00', coach: 'سامي علي' }
    },
    {
      id: 'notif_2',
      title: 'اقتران جهاز جديد',
      message: 'تم اقتران Mi Band 7 بنجاح مع حسابك. يمكنك الآن مزامنة بياناتك الصحية',
      type: 'device_pairing',
      priority: 'low',
      isRead: false,
      timestamp: '2024-10-02T12:15:00Z',
      actionUrl: '/devices/dev_123',
      data: { deviceId: 'dev_123', deviceName: 'Mi Band 7', batteryLevel: 85 }
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'unread' | 'important'>('all');

  const getNotificationIcon = (type: string, priority: string) => {
    const iconClass = priority === 'high' || priority === 'urgent' ? 'text-red-600' : 
                     priority === 'medium' ? 'text-yellow-600' : 'text-green-600';
    
    switch (type) {
      case 'booking': return <Calendar className={`h-5 w-5 ${iconClass}`} />;
      case 'device_pairing': return <Watch className={`h-5 w-5 ${iconClass}`} />;
      case 'progress_report': return <FileText className={`h-5 w-5 ${iconClass}`} />;
      case 'competition_result': return <Trophy className={`h-5 w-5 ${iconClass}`} />;
      case 'system': return <Settings className={`h-5 w-5 ${iconClass}`} />;
      case 'reminder': return <Clock className={`h-5 w-5 ${iconClass}`} />;
      default: return <Info className={`h-5 w-5 ${iconClass}`} />;
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, isRead: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      console.log('Navigate to:', notification.actionUrl);
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    switch (filter) {
      case 'unread': return !notif.isRead;
      case 'important': return notif.priority === 'high' || notif.priority === 'urgent';
      default: return true;
    }
  });

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DialogTitle className="flex items-center gap-2">
                <BellRing className="h-5 w-5" />
                مركز الإشعارات
                {unreadCount > 0 && (
                  <Badge variant="secondary">{unreadCount} جديد</Badge>
                )}
              </DialogTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            جميع الإشعارات والتنبيهات الخاصة بك
          </DialogDescription>
        </DialogHeader>

        {/* Filter Buttons */}
        <div className="flex gap-2 border-b pb-3">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            الكل ({notifications.length})
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('unread')}
          >
            غير مقروء ({unreadCount})
          </Button>
          <Button
            variant={filter === 'important' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('important')}
          >
            مهم ({notifications.filter(n => n.priority === 'high' || n.priority === 'urgent').length})
          </Button>
          <div className="flex-1" />
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            تحديد الكل كمقروء
          </Button>
        </div>

        {/* Notifications List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredNotifications.map(notification => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50 ${
                !notification.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type, notification.priority)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm mb-1 line-clamp-1">
                    {notification.title}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {notification.message}
                  </p>
                  <span className="text-xs text-gray-500">
                    {new Date(notification.timestamp).toLocaleString('ar-SA')}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredNotifications.length === 0 && (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                لا توجد إشعارات
              </h3>
              <p className="text-gray-500">
                {filter === 'unread' ? 'جميع الإشعارات مقروءة' : 
                 filter === 'important' ? 'لا توجد إشعارات مهمة' : 
                 'لا توجد إشعارات حالياً'}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}