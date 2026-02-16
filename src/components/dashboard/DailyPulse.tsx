import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Smile, Frown, Meh, Battery, BatteryMedium, BatteryLow, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DailyPulseProps {
    onPulseUpdate?: (energy: string, mood: string) => void;
}

export const DailyPulse: React.FC<DailyPulseProps> = ({ onPulseUpdate }) => {
    const [energy, setEnergy] = useState<string | null>(null);
    const [mood, setMood] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
        if (energy && mood) {
            setSubmitted(true);
            if (onPulseUpdate) {
                onPulseUpdate(energy, mood);
            }
        }
    };

    if (submitted) {
        return (
            <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-200/50 backdrop-blur-sm">
                <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                            <Activity className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">تم تسجيل حالتك بنجاح! 🚀</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">تم تحديث توصياتك بناءً على طاقتك اليوم.</p>
                        </div>
                    </div>
                    <Button variant="outline" onClick={() => setSubmitted(false)} size="sm">
                        تحديث الحالة
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-none shadow-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-md">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Activity className="h-5 w-5 text-blue-500" />
                    كيف تشعر اليوم؟
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {/* Energy Selection */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">مستوى الطاقة</label>
                        <div className="flex gap-3">
                            {[
                                { id: 'high', label: 'عالية', icon: Battery, color: 'text-green-500', bg: 'bg-green-50 hover:bg-green-100' },
                                { id: 'medium', label: 'متوسطة', icon: BatteryMedium, color: 'text-yellow-500', bg: 'bg-yellow-50 hover:bg-yellow-100' },
                                { id: 'low', label: 'منخفضة', icon: BatteryLow, color: 'text-red-500', bg: 'bg-red-50 hover:bg-red-100' },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setEnergy(item.id)}
                                    className={cn(
                                        "flex-1 p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2",
                                        energy === item.id
                                            ? `border-${item.color.split('-')[1]}-500 ${item.bg} ring-2 ring-offset-1 ring-${item.color.split('-')[1]}-500`
                                            : "border-transparent bg-gray-50 dark:bg-gray-800 hover:bg-gray-100"
                                    )}
                                >
                                    <item.icon className={cn("h-6 w-6", item.color)} />
                                    <span className="text-xs font-medium">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Mood Selection */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">المزاج</label>
                        <div className="flex gap-3">
                            {[
                                { id: 'happy', label: 'سعيد', icon: Smile, color: 'text-yellow-500', bg: 'bg-yellow-50 hover:bg-yellow-100' },
                                { id: 'neutral', label: 'عادي', icon: Meh, color: 'text-blue-500', bg: 'bg-blue-50 hover:bg-blue-100' },
                                { id: 'sad', label: 'مرهق', icon: Frown, color: 'text-gray-500', bg: 'bg-gray-50 hover:bg-gray-100' },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setMood(item.id)}
                                    className={cn(
                                        "flex-1 p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2",
                                        mood === item.id
                                            ? `border-${item.color.split('-')[1]}-500 ${item.bg} ring-2 ring-offset-1 ring-${item.color.split('-')[1]}-500`
                                            : "border-transparent bg-gray-50 dark:bg-gray-800 hover:bg-gray-100"
                                    )}
                                >
                                    <item.icon className={cn("h-6 w-6", item.color)} />
                                    <span className="text-xs font-medium">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <Button
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md transition-all hover:shadow-lg"
                        disabled={!energy || !mood}
                        onClick={handleSubmit}
                    >
                        تحديث حالتي
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
