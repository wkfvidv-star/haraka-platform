import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, ChevronRight, MoreHorizontal } from 'lucide-react';

interface TimelineEvent {
    id: string;
    time: string;
    title: string;
    type: 'training' | 'meeting' | 'assessment' | 'break';
    status: 'upcoming' | 'in-progress' | 'completed';
    duration: string;
}

const mockSchedule: TimelineEvent[] = [
    { id: '1', time: '08:00', title: 'تدريب صباحي - فريق أ', type: 'training', status: 'completed', duration: '90 د' },
    { id: '2', time: '10:00', title: 'اجتماع تقييم الأداء', type: 'meeting', status: 'in-progress', duration: '45 د' },
    { id: '3', time: '11:30', title: 'اختبارات لياقة - فريق ب', type: 'assessment', status: 'upcoming', duration: '60 د' },
    { id: '4', time: '14:00', title: 'تدريب تكتيكي', type: 'training', status: 'upcoming', duration: '120 د' },
];

export const InteractiveTimeline = () => {
    const getTypeColor = (type: string) => {
        switch (type) {
            case 'training': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'meeting': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'assessment': return 'bg-orange-100 text-orange-700 border-orange-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <Card className="border-none shadow-md bg-white/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-purple-500" />
                        الجدول الزمني
                    </CardTitle>
                    <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>10:15 AM</span>
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="relative border-r-2 border-gray-200 dark:border-gray-700 mr-3 space-y-6 py-2">
                    {mockSchedule.map((event) => (
                        <div key={event.id} className="relative flex items-start gap-4 mr-[-5px]">
                            {/* Timeline Dot */}
                            <div className={`w-2.5 h-2.5 rounded-full mt-1.5 border-2 bg-white ${event.status === 'completed' ? 'border-green-500 bg-green-500' :
                                    event.status === 'in-progress' ? 'border-blue-500 animate-pulse' :
                                        'border-gray-300'
                                }`} />

                            {/* Content */}
                            <div className={`flex-1 p-3 rounded-lg border transition-all ${event.status === 'in-progress' ? 'bg-white shadow-md border-blue-200 scale-[1.02]' :
                                    'bg-white/50 border-transparent hover:bg-white hover:shadow-sm'
                                }`}>
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                        {event.time}
                                    </span>
                                    <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${getTypeColor(event.type)}`}>
                                        {event.duration}
                                    </Badge>
                                </div>
                                <h4 className="text-sm font-medium mb-1">{event.title}</h4>
                                {event.status === 'in-progress' && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors">
                                            انضمام
                                        </button>
                                        <button className="p-1 hover:bg-gray-100 rounded-full">
                                            <MoreHorizontal className="w-4 h-4 text-gray-500" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
