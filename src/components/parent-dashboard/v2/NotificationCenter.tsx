import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, CheckCircle, AlertCircle, Info, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Notification {
    id: string;
    type: 'success' | 'warning' | 'info';
    title: string;
    message: string;
    time: string;
    childName?: string;
    isRead: boolean;
}

interface NotificationCenterProps {
    targetChildName?: string;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ targetChildName }) => {
    // Mock Data + Dynamic State
    const [notifications, setNotifications] = React.useState<Notification[]>([
        {
            id: '1',
            type: 'success',
            title: 'إنجاز جديد',
            message: 'أكمل أحمد تمرين القوة بنجاح وتحسن أداؤه بنسبة 5%',
            time: 'منذ ساعتين',
            childName: 'أحمد',
            isRead: false
        },
        {
            id: '2',
            type: 'warning',
            title: 'تذكير موعد',
            message: 'موعد الفحص الطبي السنوي ليوسف غداً',
            time: 'منذ يوم',
            childName: 'يوسف',
            isRead: true
        },
        {
            id: '3',
            type: 'info',
            title: 'تقرير أسبوعي',
            message: 'تقرير الأداء الأسبوعي لفاطمة متاح الآن',
            time: 'منذ يومين',
            childName: 'فاطمة',
            isRead: true
        }
    ]);

    // Read synced reports from localStorage
    React.useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem('haraka_sent_reports') || '[]');
            const parentReports = saved.filter((r: any) => r.recipient === 'parent');
            
            if (parentReports.length > 0) {
                const dynamicNotifs: Notification[] = parentReports.map((r: any) => ({
                    id: r.id,
                    type: 'info',
                    title: `تقرير أستاذ جديد: ${r.type}`,
                    message: `تم استلام تقرير (${r.period}) من الأستاذ. معدل الإنجاز: ${r.progress}%`,
                    time: 'جديد (مُزامن الآن)',
                    childName: r.studentName.split(' ')[0],
                    isRead: false
                })).reverse(); // Show latest first
                
                // Merge without duplicates (using id)
                setNotifications(prev => {
                    const existingIds = prev.map(p => p.id);
                    const newNotifs = dynamicNotifs.filter(n => !existingIds.includes(n.id));
                    return [...newNotifs, ...prev];
                });
            }
        } catch(e) {}
    }, []);

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'warning': return <AlertCircle className="h-5 w-5 text-orange-500" />;
            case 'info': return <Info className="h-5 w-5 text-blue-500" />;
            default: return <Bell className="h-5 w-5 text-gray-500" />;
        }
    };

    const getBgColor = (type: string) => {
        switch (type) {
            case 'success': return 'bg-green-50 dark:bg-green-900/20';
            case 'warning': return 'bg-orange-50 dark:bg-orange-900/20';
            case 'info': return 'bg-blue-50 dark:bg-blue-900/20';
            default: return 'bg-gray-50 dark:bg-gray-800';
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <Card className="glass-card border-white/10 shadow-2xl h-full flex flex-col relative overflow-hidden group">
            <CardHeader className="pb-4 border-b border-white/5 relative z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CardTitle className="text-xl font-black text-white tracking-tight flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-orange-500/10 ring-1 ring-orange-500/20">
                                <Bell className="h-5 w-5 text-orange-400" />
                            </div>
                            مركز الإشعارات (Alerts)
                            {unreadCount > 0 && (
                                <Badge className="bg-red-600 text-white h-5 px-2 font-black text-[10px] rounded-full shadow-lg shadow-red-500/20">
                                    {unreadCount} متبقي
                                </Badge>
                            )}
                        </CardTitle>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 pt-6 relative z-10">
                <ScrollArea className="h-[320px] pr-4 -mr-4">
                    <div className="space-y-4">
                        {(targetChildName 
                            ? notifications.filter(n => !n.childName || n.childName.includes(targetChildName)) 
                            : notifications
                        ).map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-4 rounded-2xl border transition-all duration-300 group/notif relative overflow-hidden
                                    ${notification.type === 'success' ? 'border-green-500/20 bg-green-500/5 hover:bg-green-500/10' :
                                        notification.type === 'warning' ? 'border-orange-500/20 bg-orange-500/5 hover:bg-orange-500/10' :
                                            'border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10'}
                                    ${!notification.isRead ? 'ring-1 ring-white/10' : 'opacity-70'}
                                `}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-2 rounded-xl bg-white/5 border border-white/10 shadow-inner group-hover/notif:scale-110 transition-transform">
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex justify-between items-start">
                                            <h4 className={`text-base font-black tracking-tight ${!notification.isRead ? 'text-white' : 'text-gray-400'}`}>
                                                {notification.title}
                                            </h4>
                                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{notification.time}</span>
                                        </div>
                                        <p className="text-sm font-bold text-gray-400 line-clamp-2 leading-relaxed group-hover/notif:text-gray-300 transition-colors">
                                            {notification.message}
                                        </p>
                                        {notification.childName && (
                                            <Badge variant="outline" className="bg-white/5 text-blue-300 border-white/5 font-black text-[10px] px-2 py-0.5 uppercase tracking-widest">
                                                {notification.childName}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                {!notification.isRead && (
                                    <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                )}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                <div className="mt-6 pt-4 border-t border-white/5">
                    <Button variant="ghost" className="w-full h-10 text-xs font-black text-gray-400 hover:text-white hover:bg-white/5 rounded-xl uppercase tracking-widest">
                        إدارة جميع الإشعارات <ChevronLeft className="w-4 h-4 mr-2" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
