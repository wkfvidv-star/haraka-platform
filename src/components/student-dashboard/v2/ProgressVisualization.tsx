import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, ArrowUp, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

export const ProgressVisualization: React.FC = () => {

    const data = [
        { name: 'أسبوع 1', score: 65, avg: 60 },
        { name: 'أسبوع 2', score: 72, avg: 62 },
        { name: 'أسبوع 3', score: 68, avg: 63 },
        { name: 'أسبوع 4', score: 85, avg: 65 },
        { name: 'أسبوع 5', score: 82, avg: 66 },
        { name: 'أسبوع 6', score: 90, avg: 68 },
    ];

    return (
        <Card className="col-span-1 lg:col-span-2 glass-card border-white/10 shadow-2xl relative overflow-hidden group">
            {/* Contextual brand accent */}
            <div className="absolute inset-0 bg-blue-600/5 mix-blend-overlay pointer-events-none" />

            <CardHeader className="pb-6 relative z-10">
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xl font-black text-white">
                        <div className="p-2 rounded-lg bg-green-500/10 ring-1 ring-green-500/20">
                            <TrendingUp className="w-5 h-5 text-green-400" />
                        </div>
                        <span>تطوري الشخصي</span>
                    </div>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-3 py-1 font-black">
                        <ArrowUp className="w-4 h-4 mr-1 ml-1" />
                        +12% هذا الشهر
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
                <div className="h-[320px] w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 700 }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 700 }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#0b0f1a',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                                    color: '#fff'
                                }}
                                itemStyle={{ fontSize: '13px', fontWeight: 'bold' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="score"
                                stroke="#38bdf8"
                                strokeWidth={4}
                                fillOpacity={1}
                                fill="url(#colorScore)"
                                name="أدائي"
                            />
                            <Line
                                type="monotone"
                                dataKey="avg"
                                stroke="rgba(255,255,255,0.3)"
                                strokeWidth={2}
                                strokeDasharray="8 8"
                                dot={false}
                                name="المعدل"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};
