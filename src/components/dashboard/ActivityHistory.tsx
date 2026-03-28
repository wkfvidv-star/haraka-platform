import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

interface ActivityHistoryProps {
    history: any[];
    loading?: boolean;
}

export const ActivityHistory: React.FC<ActivityHistoryProps> = ({ history, loading }) => {
    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full rounded-2xl bg-white/5" />
                ))}
            </div>
        );
    }

    if (!history || history.length === 0) {
        return (
            <Card className="bg-white/5 border-white/10 backdrop-blur-md rounded-3xl p-8 text-center">
                <Activity className="w-12 h-12 text-blue-400 mx-auto mb-4 opacity-50" />
                <h4 className="text-white font-bold mb-2">لا يوجد سجل نشاط حتى الآن</h4>
                <p className="text-white/50 text-sm">ابدأ يومك بتمرين جديد لتظهر نشاطاتك هنا!</p>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <h4 className="text-sm font-black text-white/40 uppercase tracking-[0.2em] mb-4">النشاطات الأخيرة</h4>
            {history.map((item, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                >
                    <Card className="bg-white/5 border-white/5 hover:bg-white/10 hover:border-blue-500/30 transition-all duration-300 rounded-2xl overflow-hidden cursor-pointer">
                        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors shrink-0">
                                    <Activity className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <h5 className="text-white font-bold">{item.type || 'تمرين رياضي'}</h5>
                                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
                                        <span className="flex items-center gap-1 text-[10px] text-white/40 font-bold uppercase shrink-0">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(item.timestamp || Date.now()).toLocaleDateString('ar-DZ')}
                                        </span>
                                        <span className="flex items-center gap-1 text-[10px] text-white/40 font-bold uppercase shrink-0">
                                            <Clock className="w-3 h-3" />
                                            {item.duration || '20 دقيقة'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-3 py-1 font-black text-[10px] uppercase self-start sm:self-auto">
                                {item.intensity || 'متوسط'}
                            </Badge>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
};
