import React from 'react';
import { ExercisePack } from '@/services/SmartExerciseService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, Play, X, Clock, Dumbbell, ShieldCheck, ListOrdered } from 'lucide-react';
import { motion } from 'framer-motion';

interface ExercisePackDetailsModalProps {
    pack: ExercisePack;
    onClose: () => void;
    onStartSession: (pack: ExercisePack) => void;
}

export const ExercisePackDetailsModal: React.FC<ExercisePackDetailsModalProps> = ({ pack, onClose, onStartSession }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 text-right" dir="rtl">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-2xl max-h-[90vh] flex flex-col"
            >
                <Card className="bg-slate-900 border-white/10 shadow-2xl overflow-hidden flex flex-col h-full">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-white/10 bg-black/40 shrink-0">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${pack.colorTheme}-500/20 border border-${pack.colorTheme}-500/30`}>
                                <Activity className={`w-6 h-6 text-${pack.colorTheme}-400`} />
                            </div>
                            <div className="flex flex-col">
                                <CardTitle className="text-white text-2xl">{pack.title}</CardTitle>
                                <span className="text-sm text-gray-400 mt-1">{pack.subCategory} • {pack.difficulty}</span>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-white/10">
                            <X className="w-5 h-5 text-gray-400 hover:text-white" />
                        </Button>
                    </CardHeader>

                    <CardContent className="p-0 overflow-y-auto flex-1">
                        <div className="p-6 space-y-8">
                            {/* Description */}
                            <div className="space-y-2">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <ListOrdered className="w-5 h-5 text-blue-400" /> وصف البرنامج
                                </h3>
                                <p className="text-gray-300 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5 text-sm md:text-base">
                                    {pack.description}
                                </p>
                            </div>

                            {/* Exercises List */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Dumbbell className="w-5 h-5 text-blue-400" /> التمارين المشمولة ({pack.exercises.length})
                                </h3>
                                <div className="space-y-3">
                                    {pack.exercises.map((exercise, index) => (
                                        <div key={exercise.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/[0.07] transition-colors group">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-3">
                                                    <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center border border-blue-500/30">
                                                        {index + 1}
                                                    </span>
                                                    <h4 className="text-white font-bold">{exercise.title}</h4>
                                                </div>
                                                <Badge className="bg-black/40 text-gray-300 border-white/10 font-mono text-xs hidden sm:flex items-center gap-1">
                                                    <Clock className="w-3 h-3" /> {exercise.duration}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-gray-400 mr-9">{exercise.description}</p>
                                            
                                            {exercise.instructions && exercise.instructions.length > 0 && (
                                                <div className="mr-9 mt-3 space-y-1">
                                                    <p className="text-xs font-bold text-gray-500 mb-2">تعليمات الأداء:</p>
                                                    <ul className="list-disc list-inside text-xs text-blue-200/70 space-y-1">
                                                        {exercise.instructions.map((inst, idx) => (
                                                            <li key={idx}>{inst}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>

                    <div className="p-6 border-t border-white/10 bg-black/40 shrink-0">
                        <Button 
                            className="w-full h-14 text-lg font-black bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] rounded-xl gap-2"
                            onClick={() => onStartSession(pack)}
                        >
                            <Play className="w-6 h-6 fill-current" /> بدء التدريب المباشر الآن
                        </Button>
                        <p className="text-center text-xs text-gray-500 mt-3 flex items-center justify-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> التتبع الذكي بواسطة Vision AI سيتم تفعيله
                        </p>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};
