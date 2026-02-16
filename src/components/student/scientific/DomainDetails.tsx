import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScientificDomain, sampleScientificExercises, ScientificExercise } from '@/data/ScientificExerciseData';
import { Play, Clock, Box, Target, Info } from 'lucide-react';
import { ContextAwareVideoPlayer } from '../../video/ContextAwareVideoPlayer';
import { useState } from 'react';

interface DomainDetailsProps {
    domain: ScientificDomain;
}

export function DomainDetails({ domain }: DomainDetailsProps) {
    const exercises = sampleScientificExercises.filter(ex => ex.domainId === domain.id);
    const [selectedExercise, setSelectedExercise] = useState<ScientificExercise | null>(null);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar Info */}
            <div className="lg:col-span-1 space-y-6">
                <Card className={`border-t-4 border-${domain.color}-500`}>
                    <CardHeader>
                        <CardTitle>عن هذا المجال</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                            {domain.description}
                        </p>

                        <div>
                            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                <Target className="w-4 h-4 text-blue-500" />
                                الفوائد الرئيسية
                            </h4>
                            <ul className="space-y-2">
                                {domain.benefits.map((benefit, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                        <div className={`w-1.5 h-1.5 rounded-full bg-${domain.color}-500`}></div>
                                        {benefit}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="pt-4 border-t">
                            <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                                <div className="text-xs text-gray-500 mb-1">مؤشر الأداء الرئيسي (KPI)</div>
                                <div className="font-bold text-slate-700 dark:text-slate-200">{domain.kpi}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Exercises List */}
            <div className="lg:col-span-2 space-y-4">
                <h3 className="font-bold text-xl mb-4">التمارين المتاحة</h3>
                {exercises.length > 0 ? (
                    exercises.map((exercise) => (
                        <Card key={exercise.id} className="hover:border-blue-300 transition-colors cursor-pointer group">
                            <CardContent className="p-5">
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge variant={exercise.difficulty === 'مبتدئ' ? 'secondary' : 'default'} className="text-xs">
                                                {exercise.difficulty}
                                            </Badge>
                                            <span className="text-xs text-slate-400">|</span>
                                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {exercise.duration}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-lg mb-1 group-hover:text-blue-600 transition-colors">
                                            {exercise.title}
                                        </h4>
                                        <p className="text-sm text-gray-500 mb-3">
                                            {exercise.instructions[0]}...
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {exercise.objectives.map((obj, i) => (
                                                <Badge key={i} variant="outline" className="bg-slate-50 text-[10px] text-slate-600">
                                                    {obj}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        <Button
                                            className="w-full sm:w-auto gap-2"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedExercise(exercise);
                                            }}
                                        >
                                            <Play className="w-4 h-4" /> ابدأ
                                        </Button>
                                        <div className="text-xs text-slate-400 flex items-center gap-1">
                                            <Box className="w-3 h-3" /> {exercise.equipment}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="text-center p-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                        <Info className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 font-medium">لا توجد تمارين متاحة حالياً في هذا التصنيف</p>
                        <p className="text-xs text-slate-400">سيتم إضافة تمارين جديدة قريباً</p>
                    </div>
                )}
            </div>

            {selectedExercise && (
                <ContextAwareVideoPlayer
                    exercise={selectedExercise}
                    mode="athlete" // Default to athlete for student dashboard
                    onClose={() => setSelectedExercise(null)}
                />
            )}
        </div>
    );
}
