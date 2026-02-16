import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScientificExercise } from '../../data/ScientificExerciseData';
import { Info, Target, AlertTriangle, Lightbulb, Brain, Activity } from 'lucide-react';

interface PedagogicalOverlayProps {
    exercise: ScientificExercise;
    mode: 'coach' | 'athlete';
    isVisible: boolean;
    currentTime?: number;
}

export const PedagogicalOverlay: React.FC<PedagogicalOverlayProps> = ({ exercise, mode, isVisible }) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="absolute top-4 right-4 max-w-xs bg-black/80 backdrop-blur-md p-4 rounded-xl border border-white/10 text-white shadow-2xl z-20"
                >
                    {mode === 'coach' ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-blue-400 border-b border-white/10 pb-2">
                                <Brain className="w-5 h-5" />
                                <h3 className="font-bold text-sm">Rationale (Why)</h3>
                            </div>
                            <p className="text-sm text-gray-300 leading-relaxed">
                                {exercise.rationale || "No rationale provided."}
                            </p>

                            <div className="flex items-center gap-2 text-green-400 border-b border-white/10 pb-2 pt-2">
                                <Target className="w-5 h-5" />
                                <h3 className="font-bold text-sm">Target & Intensity</h3>
                            </div>
                            <div className="text-sm space-y-1">
                                <p><span className="text-gray-400">Target:</span> {exercise.developmentGoal}</p>
                                <p><span className="text-gray-400">Intensity:</span> <span className={`font-bold ${exercise.intensityZone === 'High' ? 'text-red-500' :
                                        exercise.intensityZone === 'Moderate' ? 'text-yellow-500' : 'text-blue-500'
                                    }`}>{exercise.intensityZone}</span></p>
                            </div>

                            {exercise.coachNotes && (
                                <div className="pt-2">
                                    <h4 className="flex items-center gap-2 text-xs font-semibold text-yellow-400 mb-1">
                                        <Lightbulb className="w-3 h-3" /> Coach Notes
                                    </h4>
                                    <ul className="list-disc list-inside text-xs text-gray-400 pl-1">
                                        {exercise.coachNotes.map((note, idx) => (
                                            <li key={idx}>{note}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Athlete View
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-emerald-400 border-b border-white/10 pb-2">
                                <Activity className="w-5 h-5" />
                                <h3 className="font-bold text-sm">Focus Points</h3>
                            </div>

                            {exercise.athleteCues && (
                                <ul className="space-y-2">
                                    {exercise.athleteCues.map((cue, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-200">
                                            <span className="text-emerald-500 mt-1">•</span>
                                            {cue}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {exercise.commonMistakes && (
                                <div className="mt-4 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                                    <h4 className="flex items-center gap-2 text-xs font-bold text-red-400 mb-2">
                                        <AlertTriangle className="w-3 h-3" /> Avoid
                                    </h4>
                                    <ul className="space-y-1">
                                        {exercise.commonMistakes.map((mistake, idx) => (
                                            <li key={idx} className="text-xs text-gray-300 pl-4 relative">
                                                <span className="absolute right-0 top-1 w-1 h-1 bg-red-500 rounded-full"></span>
                                                {mistake}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};
