import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Smile, Zap, Brain, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

interface WellBeingIndicatorProps {
    icon: React.ElementType;
    label: string;
    value: string;
    description: string;
    color: string;
}

const WellBeingIndicator: React.FC<WellBeingIndicatorProps> = ({ icon: Icon, label, value, description, color }) => (
    <motion.div
        whileHover={{ scale: 1.05 }}
        className="flex flex-col items-center p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md"
    >
        <div className={`p-3 rounded-2xl ${color} mb-3 shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">{label}</span>
        <span className="text-xl font-black text-white mb-1">{value}</span>
        <span className="text-[10px] font-bold text-white/70 text-center">{description}</span>
    </motion.div>
);

export const StudentWellBeingIndicators: React.FC = () => {
    return (
        <Card className="glass-card border-white/10 overflow-hidden relative shadow-2xl">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-3 text-lg font-black text-white">
                    <div className="p-2 rounded-lg bg-orange-500/20 ring-1 ring-orange-500/30">
                        <Smile className="w-5 h-5 text-orange-400" />
                    </div>
                    <span>كيف حالك اليوم؟ (My Daily Vibe)</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <WellBeingIndicator
                        icon={Smile}
                        label="المزاج"
                        value="سعيد جداً"
                        description="أنت في قمة السعادة!"
                        color="bg-pink-500"
                    />
                    <WellBeingIndicator
                        icon={Brain}
                        label="التركيز"
                        value="بطل"
                        description="عقلك نشيط ومركز"
                        color="bg-blue-500"
                    />
                    <WellBeingIndicator
                        icon={Zap}
                        label="الطاقة"
                        value="100%"
                        description="مستعد للانطلاق"
                        color="bg-yellow-500"
                    />
                    <WellBeingIndicator
                        icon={Sun}
                        label="النشاط"
                        value="ممتاز"
                        description="يوم مشمس وجميل"
                        color="bg-orange-500"
                    />
                </div>
            </CardContent>
        </Card>
    );
};
