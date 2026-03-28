import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, TrendingUp, Clock, Activity } from 'lucide-react';
import { ExercisePack } from '@/services/SmartExerciseService';
import { useNavigate } from 'react-router-dom';

interface ExercisePackCardProps {
    pack: ExercisePack;
    onStart?: () => void;
}

export const ExercisePackCard: React.FC<ExercisePackCardProps> = ({ pack, onStart }) => {
    const navigate = useNavigate();

    const handleStart = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (onStart) {
            onStart();
        } else {
            navigate(`/student/exercise/${pack.id}`);
        }
    };

    const difficultyStyles = {
        Beginner: 'bg-green-500/20 text-green-300 border-green-500/30',
        Intermediate: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        Advanced: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    }[pack.difficulty];

    return (
        <Card className="glass-card h-full flex flex-col transition-all duration-300 hover:scale-[1.03] border-white/10 relative overflow-hidden group hover:ring-1 hover:ring-white/20 shadow-2xl">
            {/* Contextual Color Glow */}
            <div className={`absolute -top-12 -right-12 w-24 h-24 bg-${pack.colorTheme}-500/10 rounded-full blur-2xl group-hover:bg-${pack.colorTheme}-500/20 transition-colors`} />

            <CardHeader className="pb-4 relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <Badge variant="outline" className={`${difficultyStyles} px-3 py-0.5 rounded-full font-black text-[10px] uppercase tracking-wider`}>
                        {pack.difficulty}
                    </Badge>
                    <div className={`p-2 rounded-xl bg-white/5 ring-1 ring-white/10 group-hover:ring-${pack.colorTheme}-500/30 transition-all`}>
                        <Activity className={`w-4 h-4 text-white group-hover:text-${pack.colorTheme}-400 transition-colors`} />
                    </div>
                </div>
                <CardTitle className="text-xl font-black text-white leading-tight mb-2 tracking-tight group-hover:text-blue-200 transition-colors">
                    {pack.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-sm font-bold text-gray-400 group-hover:text-gray-300 transition-colors">
                    {pack.description}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-6 relative z-20">
                <div className="flex flex-wrap gap-3 text-[11px] font-black uppercase tracking-wider text-blue-300">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{pack.exercises.length * 5} min</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>{pack.subCategory}</span>
                    </div>
                </div>

                {/* Mock KPI Preview - Higher contrast */}
                {pack.kpis.length > 0 && (
                    <div className="bg-white/5 border border-white/5 p-3 rounded-xl space-y-2">
                        {pack.kpis.map((kpi, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-gray-500 uppercase">{kpi.name}</span>
                                <span className="text-sm font-black text-white">{kpi.value}{kpi.unit}</span>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
            <CardFooter className="relative z-20 pb-6">
                <Button
                    className="w-full h-12 gap-3 group/btn bg-white text-blue-900 hover:bg-blue-50 font-black rounded-xl shadow-lg transition-all"
                    onClick={handleStart}
                >
                    <Play className="w-5 h-5 fill-current group-hover/btn:scale-110 transition-transform" />
                    <span>عرض الباقة والبدء</span>
                </Button>
            </CardFooter>
        </Card>
    );
};
