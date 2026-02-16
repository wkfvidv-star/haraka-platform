import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Heart, AlertCircle, CheckCircle, Battery } from 'lucide-react';

interface AthleteStatus {
    id: string;
    name: string;
    status: 'ready' | 'tired' | 'injured' | 'recovering';
    mood: 'high' | 'neutral' | 'low';
    lastCheckIn: string;
}

const mockAthletes: AthleteStatus[] = [
    { id: '1', name: 'أحمد محمد', status: 'ready', mood: 'high', lastCheckIn: 'منذ 10 د' },
    { id: '2', name: 'سارة علي', status: 'tired', mood: 'neutral', lastCheckIn: 'منذ 30 د' },
    { id: '3', name: 'عمر خالد', status: 'injured', mood: 'low', lastCheckIn: 'منذ 2 س' },
    { id: '4', name: 'ليلى حسن', status: 'ready', mood: 'high', lastCheckIn: 'منذ 5 د' },
];

export const TeamPulseWidget = () => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ready': return 'text-green-500 bg-green-50 border-green-200';
            case 'tired': return 'text-yellow-500 bg-yellow-50 border-yellow-200';
            case 'injured': return 'text-red-500 bg-red-50 border-red-200';
            default: return 'text-gray-500 bg-gray-50 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'ready': return <CheckCircle className="w-4 h-4" />;
            case 'tired': return <Battery className="w-4 h-4" />;
            case 'injured': return <AlertCircle className="w-4 h-4" />;
            default: return <Activity className="w-4 h-4" />;
        }
    };

    return (
        <Card className="border-none shadow-md bg-white/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-500 animate-pulse" />
                        نبض الفريق
                    </CardTitle>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        90% جاهزية
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {mockAthletes.map((athlete) => (
                        <div key={athlete.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${athlete.mood === 'high' ? 'bg-green-500' : athlete.mood === 'neutral' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                                <div>
                                    <p className="text-sm font-medium">{athlete.name}</p>
                                    <p className="text-xs text-gray-500">{athlete.lastCheckIn}</p>
                                </div>
                            </div>
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium ${getStatusColor(athlete.status)}`}>
                                {getStatusIcon(athlete.status)}
                                <span>
                                    {athlete.status === 'ready' ? 'جاهز' :
                                        athlete.status === 'tired' ? 'مرهق' :
                                            athlete.status === 'injured' ? 'مصاب' : 'متعافي'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
