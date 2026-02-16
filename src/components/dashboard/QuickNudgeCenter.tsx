import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Send, MessageSquare } from 'lucide-react';

const quickMessages = [
    { id: '1', text: 'أحسنت! استمر في العمل الرائع 🌟', label: 'تشجيع' },
    { id: '2', text: 'لا تنس شرب الماء 💧', label: 'تذكير' },
    { id: '3', text: 'ركز على التنفس العميق 🧘‍♂️', label: 'نصيحة' },
    { id: '4', text: 'هل أنت مستعد للتحدي القادم؟ 🚀', label: 'حماس' },
];

const students = [
    { id: '1', name: 'أحمد' },
    { id: '2', name: 'سارة' },
    { id: '3', name: 'عمر' },
    { id: '4', name: 'الكل' },
];

export const QuickNudgeCenter = () => {
    const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
    const [sentMessage, setSentMessage] = useState<string | null>(null);

    const handleSend = (messageId: string) => {
        if (!selectedStudent) return;

        setSentMessage(messageId);
        setTimeout(() => setSentMessage(null), 2000);
    };

    return (
        <Card className="border-none shadow-md bg-white/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    مركز التحفيز السريع
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Student Selector */}
                    <div>
                        <p className="text-xs text-gray-500 mb-2">اختر الطالب:</p>
                        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                            {students.map((student) => (
                                <button
                                    key={student.id}
                                    onClick={() => setSelectedStudent(student.id)}
                                    className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${selectedStudent === student.id
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {student.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quick Messages */}
                    <div className="grid grid-cols-1 gap-2">
                        {quickMessages.map((msg) => (
                            <Button
                                key={msg.id}
                                variant="outline"
                                className={`justify-between h-auto py-3 ${sentMessage === msg.id ? 'border-green-500 bg-green-50' : 'hover:border-blue-300'
                                    }`}
                                onClick={() => handleSend(msg.id)}
                                disabled={!selectedStudent}
                            >
                                <span className="text-sm truncate">{msg.text}</span>
                                {sentMessage === msg.id ? (
                                    <Send className="w-4 h-4 text-green-600" />
                                ) : (
                                    <Badge variant="secondary" className="text-xs">
                                        {msg.label}
                                    </Badge>
                                )}
                            </Button>
                        ))}
                    </div>

                    {!selectedStudent && (
                        <p className="text-xs text-center text-gray-400">
                            اختر طالباً لإرسال رسالة تحفيزية
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
