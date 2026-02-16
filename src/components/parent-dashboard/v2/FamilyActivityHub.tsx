import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, User, ChevronLeft } from 'lucide-react';

interface ActivitySession {
    id: string;
    title: string;
    childName: string;
    date: string;
    time: string;
    location: string;
    instructor: string;
    type: 'group' | 'individual';
    isToday?: boolean;
}

export const FamilyActivityHub: React.FC = () => {
    // Mock Data
    const sessions: ActivitySession[] = [
        {
            id: '1',
            title: 'تدريب كرة القدم',
            childName: 'أحمد',
            date: 'اليوم',
            time: '16:00',
            location: 'الملعب الرئيسي',
            instructor: 'المدرب أحمد',
            type: 'group',
            isToday: true
        },
        {
            id: '2',
            title: 'حصة السباحة',
            childName: 'فاطمة',
            date: 'اليوم',
            time: '17:30',
            location: 'المسبح الأولمبي',
            instructor: 'المدربة سارة',
            type: 'group',
            isToday: true
        },
        {
            id: '3',
            title: 'تمرين القوة',
            childName: 'أحمد',
            date: 'غداً',
            time: '18:30',
            location: 'الجيم',
            instructor: 'المدرب كريم',
            type: 'individual',
            isToday: false
        }
    ];

    return (
        <Card className="glass-card border-white/10 shadow-2xl h-full relative overflow-hidden group">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-white/5 relative z-10">
                <div>
                    <CardTitle className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-400" />
                        الجدول العائلي (Family Schedule)
                    </CardTitle>
                    <CardDescription className="text-gray-400 font-bold">الأنشطة الرياضية والتعليمية القادمة</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10 font-bold h-9 px-4 rounded-xl">
                    فتح التقويم
                </Button>
            </CardHeader>
            <CardContent className="pt-6 relative z-10">
                <div className="relative border-r-2 border-white/5 mr-3 space-y-6">
                    {sessions.map((session) => (
                        <div key={session.id} className="relative pr-8">
                            {/* Timeline Dot with Glow */}
                            <div className={`absolute -right-[7px] top-2 h-3.5 w-3.5 rounded-full border-2 border-gray-950 shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-transform group-hover:scale-110 ${session.isToday ? 'bg-blue-500 ring-2 ring-blue-500/20' : 'bg-gray-700'}`} />

                            <div className={`rounded-[2rem] p-5 border transition-all duration-300 group/item hover:translate-x-[-4px] ${session.isToday ? 'bg-blue-600/10 border-blue-500/20 shadow-lg shadow-blue-500/5' : 'bg-white/5 border-white/5 hover:bg-white/[0.07]'}`}>
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h4 className="font-black text-white group-hover/item:text-blue-300 transition-colors">{session.title}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_5px_rgba(96,165,250,0.5)]" />
                                            <p className="text-xs font-black text-blue-300 uppercase tracking-wider">{session.childName}</p>
                                        </div>
                                    </div>
                                    <Badge className="bg-white/5 text-gray-400 border-white/10 font-black text-[10px] px-2 py-0.5 uppercase">
                                        {session.type === 'individual' ? 'فردي' : 'جماعي'}
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-2.5 text-xs text-gray-400 font-bold">
                                        <div className="p-1.5 rounded-lg bg-white/5">
                                            <Clock className="w-3.5 h-3.5 text-orange-400" />
                                        </div>
                                        <span>{session.time} {session.isToday ? '- اليوم' : ` - ${session.date}`}</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 text-xs text-gray-400 font-bold">
                                        <div className="p-1.5 rounded-lg bg-white/5">
                                            <User className="w-3.5 h-3.5 text-green-400" />
                                        </div>
                                        <span className="truncate">{session.instructor}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <Button variant="ghost" className="w-full mt-8 h-12 text-sm font-black text-gray-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all border border-dashed border-white/5">
                    استكشاف الجدول الكامل <ChevronLeft className="w-4 h-4 mr-2" />
                </Button>
            </CardContent>
        </Card>
    );
};
