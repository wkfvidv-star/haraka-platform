import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Inbox, Star, AlertCircle, Check, Archive } from 'lucide-react';

interface Message {
    id: string;
    sender: string;
    subject: string;
    preview: string;
    time: string;
    priority: 'high' | 'medium' | 'low';
    type: 'student' | 'system' | 'admin';
    isRead: boolean;
}

const mockMessages: Message[] = [
    {
        id: '1',
        sender: 'أحمد محمد',
        subject: 'إصابة في الركبة',
        preview: 'كوتش، حسيت بألم في ركبتي بعد التمرين...',
        time: '10:30 AM',
        priority: 'high',
        type: 'student',
        isRead: false
    },
    {
        id: '2',
        sender: 'النظام',
        subject: 'تحديث تقرير الأداء',
        preview: 'تم إصدار التقرير الأسبوعي للفريق...',
        time: '09:15 AM',
        priority: 'medium',
        type: 'system',
        isRead: false
    },
    {
        id: '3',
        sender: 'الإدارة',
        subject: 'جدول المباريات',
        preview: 'يرجى مراجعة الجدول المرفق للموسم القادم...',
        time: 'أمس',
        priority: 'low',
        type: 'admin',
        isRead: true
    },
];

export const PriorityInbox = () => {
    const [messages, setMessages] = useState(mockMessages);

    const handleArchive = (id: string) => {
        setMessages(messages.filter(m => m.id !== id));
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'text-red-500 bg-red-50 border-red-200';
            case 'medium': return 'text-yellow-500 bg-yellow-50 border-yellow-200';
            default: return 'text-blue-500 bg-blue-50 border-blue-200';
        }
    };

    return (
        <Card className="border-none shadow-md bg-white/50 backdrop-blur-sm h-full">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <Inbox className="w-5 h-5 text-blue-500" />
                        البريد الهام
                    </CardTitle>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        {messages.filter(m => !m.isRead).length} غير مقروء
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`p-3 rounded-lg border transition-all hover:shadow-md ${!msg.isRead ? 'bg-white border-blue-100' : 'bg-gray-50 border-transparent'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <div className="flex items-center gap-2">
                                    {msg.priority === 'high' && <AlertCircle className="w-4 h-4 text-red-500" />}
                                    <span className={`font-semibold text-sm ${!msg.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                                        {msg.sender}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-400">{msg.time}</span>
                            </div>

                            <h4 className={`text-sm mb-1 ${!msg.isRead ? 'font-medium text-gray-800' : 'text-gray-600'}`}>
                                {msg.subject}
                            </h4>
                            <p className="text-xs text-gray-500 line-clamp-1 mb-2">
                                {msg.preview}
                            </p>

                            <div className="flex items-center justify-between mt-2">
                                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${getPriorityColor(msg.priority)}`}>
                                    {msg.priority === 'high' ? 'عاجل' : msg.priority === 'medium' ? 'مهم' : 'عادي'}
                                </Badge>

                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleArchive(msg.id)}>
                                        <Check className="w-3 h-3 text-green-600" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-6 w-6">
                                        <Archive className="w-3 h-3 text-gray-400" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {messages.length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                            <Inbox className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">لا توجد رسائل جديدة</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
