import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, Video, CheckCircle2, ArrowRight, X, Eye, Volume2, Target, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VideoSubmissionModal } from '@/components/student-dashboard/v2/VideoSubmissionModal';

export interface TeacherAssignment {
    id: string;
    title: string;
    descriptionLines: string[];
    teacherName: string;
    dueDate: string;
}

interface Props {
    assignment: TeacherAssignment;
    isOpen: boolean;
    onClose: () => void;
}

type Phase = 'preview' | 'instruction_playing' | 'ready_for_submission' | 'submitting';

export function AssignmentPlayer({ assignment, isOpen, onClose }: Props) {
    const [phase, setPhase] = useState<Phase>('preview');
    const [currentLineIndex, setCurrentLineIndex] = useState(-1);
    const audioSeqRef = useRef<boolean>(false);
    
    // Reset state when opened
    useEffect(() => {
        if (isOpen) {
            setPhase('preview');
            setCurrentLineIndex(-1);
            audioSeqRef.current = false;
        } else {
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        }
    }, [isOpen]);

    // Handle TTS sequence syncing with Text
    const startInstruction = () => {
        setPhase('instruction_playing');
        setCurrentLineIndex(0);
        
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();

        const lines = assignment.descriptionLines;
        
        const playLine = (index: number) => {
            if (index >= lines.length || !isOpen) {
                // Done
                setTimeout(() => setPhase('ready_for_submission'), 1000);
                return;
            }
            setCurrentLineIndex(index);
            
            const utterance = new SpeechSynthesisUtterance(lines[index]);
            utterance.lang = 'ar-SA';
            utterance.rate = 0.9;
            utterance.pitch = 1.05;
            
            utterance.onend = () => {
                setTimeout(() => playLine(index + 1), 600);
            };
            
            utterance.onerror = () => {
                // Fallback loop if speech engine fails
                setTimeout(() => playLine(index + 1), 2000);
            };

            window.speechSynthesis.speak(utterance);
        };

        // Announce title first
        const initAudio = new SpeechSynthesisUtterance(`تمرين من ${assignment.teacherName}: ${assignment.title}`);
        initAudio.lang = 'ar-SA';
        initAudio.onend = () => setTimeout(() => playLine(0), 800);
        window.speechSynthesis.speak(initAudio);
    };

    if (!isOpen) return null;

    return (
        <>
            <AnimatePresence>
                {isOpen && phase !== 'submitting' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 50 }}
                        className="fixed inset-0 z-50 bg-slate-900 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 bg-slate-800/50 border-b border-white/5 backdrop-blur-md z-10">
                            <div>
                                <h2 className="text-2xl font-black text-white">{assignment.title}</h2>
                                <p className="text-indigo-400 font-bold mt-1 text-sm bg-indigo-900/30 px-3 py-1 rounded-full inline-block">
                                    مهمة مرسلة من: {assignment.teacherName}
                                </p>
                            </div>
                            <button 
                                onClick={onClose}
                                className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-red-500 hover:text-white transition-all"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Visual Animation / Content Area */}
                        <div className="flex-1 relative flex flex-col items-center justify-center p-6 lg:p-12 overflow-hidden">
                            {/* Cinematic Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950/20 to-slate-900" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

                            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10 items-center">
                                
                                {/* 3D Abstract Representation (Mock Animation) */}
                                <div className="aspect-square bg-slate-800/80 rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden relative flex flex-col items-center justify-center p-8 group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent" />
                                    
                                    {phase === 'preview' && (
                                        <motion.button 
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={startInstruction}
                                            className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(79,70,229,0.5)] cursor-pointer z-20 group-hover:bg-indigo-500 transition-colors"
                                        >
                                            <PlayCircle className="w-12 h-12 fill-white text-indigo-600 group-hover:text-indigo-500 transition-colors" />
                                        </motion.button>
                                    )}

                                    {phase === 'instruction_playing' && (
                                        <div className="relative w-full h-full flex items-center justify-center">
                                            {/* Pulsing Abstract Rings */}
                                            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute w-48 h-48 border-4 border-indigo-500/30 rounded-full" />
                                            <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }} transition={{ repeat: Infinity, duration: 2, delay: 0.2 }} className="absolute w-64 h-64 border-2 border-indigo-400/20 rounded-full" />
                                            
                                            <Volume2 className="w-20 h-20 text-indigo-400 animate-pulse" />
                                            <div className="absolute bottom-8 text-indigo-300 font-bold bg-indigo-950/80 px-4 py-2 rounded-full border border-indigo-500/30 flex items-center gap-2">
                                                <Volume2 className="w-4 h-4" /> جاري الشرح الصوتي
                                            </div>
                                        </div>
                                    )}

                                    {phase === 'ready_for_submission' && (
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center text-emerald-400">
                                            <CheckCircle2 className="w-24 h-24 mb-4" />
                                            <h3 className="text-2xl font-black text-white">الشرح مكتمل</h3>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Synced Text Instructions */}
                                <div className="space-y-6">
                                    {phase === 'preview' && (
                                        <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem]">
                                            <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-indigo-400" /> نظرة عامة</h3>
                                            <p className="text-slate-300 font-bold text-lg leading-relaxed">{assignment.descriptionLines.join(" ")}</p>
                                        </div>
                                    )}

                                    {phase === 'instruction_playing' && (
                                        <div className="space-y-4">
                                            {assignment.descriptionLines.map((line, idx) => (
                                                <motion.div 
                                                    key={idx}
                                                    initial={{ opacity: 0.3, x: 20 }}
                                                    animate={{ 
                                                        opacity: currentLineIndex === idx ? 1 : 0.3,
                                                        x: currentLineIndex === idx ? 0 : 20,
                                                        scale: currentLineIndex === idx ? 1.05 : 1
                                                    }}
                                                    className={cn(
                                                        "p-6 rounded-2xl border transition-all duration-500",
                                                        currentLineIndex === idx 
                                                        ? "bg-indigo-600/20 border-indigo-500 shadow-[0_0_30px_rgba(79,70,229,0.3)] shadow-inner" 
                                                        : "bg-white/5 border-white/5"
                                                    )}
                                                >
                                                    <p className={cn(
                                                        "font-black text-2xl leading-tight transition-colors duration-500",
                                                        currentLineIndex === idx ? "text-white" : "text-slate-500"
                                                    )}>
                                                        {line}
                                                    </p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}

                                    {phase === 'ready_for_submission' && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 20 }} 
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-emerald-900/20 border border-emerald-500/30 p-8 rounded-[2rem] text-center space-y-6"
                                        >
                                            <Brain className="w-12 h-12 text-emerald-400 mx-auto" />
                                            <h3 className="text-2xl font-black text-white">أنت جاهز الآن!</h3>
                                            <p className="text-emerald-100 font-bold">قم بتصوير أدائك للتمرين وأرسله مباشرة للمدرب للحصول على التقييم.</p>
                                            
                                            <motion.button 
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setPhase('submitting')}
                                                className="w-full bg-gradient-to-l from-emerald-500 to-teal-500 text-white font-black text-xl py-5 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center justify-center gap-3 border-2 border-emerald-400"
                                            >
                                                <Video className="w-6 h-6 fill-white" /> توثيق وإرسال الأداء
                                            </motion.button>
                                        </motion.div>
                                    )}
                                </div>

                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Launch Submission Modal Overlay */}
            {phase === 'submitting' && (
                <VideoSubmissionModal 
                    isOpen={true} 
                    onClose={() => {
                        setPhase('ready_for_submission'); // if cancelled
                        onClose(); // Ideally if succeeded, we close the entire Assignment Player. It's handled inside the layout flow.
                    }} 
                    exerciseName={assignment.title}
                    isAssignment={true}
                />
            )}
        </>
    );
}
