import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ScientificExercise } from '../../data/ScientificExerciseData';
import { getCategoryConfig } from '../../config/TrainingCategoryConfig';
import { PedagogicalOverlay } from './PedagogicalOverlay';
import { Play, Pause, Maximize2, X, Timer, Activity, Heart } from 'lucide-react';

interface ContextAwareVideoPlayerProps {
    exercise: ScientificExercise;
    mode: 'coach' | 'athlete';
    onClose: () => void;
}

export const ContextAwareVideoPlayer: React.FC<ContextAwareVideoPlayerProps> = ({ exercise, mode, onClose }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [showOverlay, setShowOverlay] = useState(true);
    const [progress, setProgress] = useState(0);

    // Determine primary category for styling
    const mainCategory = exercise.categories && exercise.categories.length > 0
        ? exercise.categories[0]
        : 'motor'; // fallback

    const config = getCategoryConfig(mainCategory);

    // Derived styles
    const gradientName = config.color;
    const isHighIntensity = ['hiit', 'hiitch', 'speed', 'plyometric'].includes(mainCategory);
    const isRelaxed = ['recovery', 'mobility', 'mental', 'core'].includes(mainCategory);

    useEffect(() => {
        let interval: any;
        if (isPlaying) {
            interval = setInterval(() => {
                setProgress(prev => (prev >= 100 ? 0 : prev + 0.5));
            }, 50);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`relative w-full max-w-6xl aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border-2 border-transparent bg-gradient-to-br ${gradientName} p-[1px]`}
            >
                <div className="relative w-full h-full bg-black rounded-2xl overflow-hidden">

                    {/* Header / Context Bar */}
                    <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-30 bg-gradient-to-b from-black/80 to-transparent">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${gradientName} shadow-lg shadow-${config.accentColor.split('-')[1]}-500/20`}>
                                <config.icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white tracking-wide">{exercise.title}</h2>
                                <div className="flex items-center gap-2">
                                    <span className={`text-sm font-medium ${config.accentColor} uppercase tracking-wider`}>
                                        {config.labelEn.toUpperCase()}
                                    </span>
                                    <span className="text-gray-500 text-sm">•</span>
                                    <span className="text-gray-400 text-sm">{exercise.difficulty}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            {/* Category Specific Indicators */}
                            {isHighIntensity && (
                                <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 px-3 py-1.5 rounded-full">
                                    <Activity className="w-4 h-4 text-red-500 animate-pulse" />
                                    <span className="text-xs font-bold text-red-400">HIGH INTENSITY</span>
                                </div>
                            )}
                            {isRelaxed && (
                                <div className="flex items-center gap-2 bg-teal-500/20 border border-teal-500/30 px-3 py-1.5 rounded-full">
                                    <Heart className="w-4 h-4 text-teal-500" />
                                    <span className="text-xs font-bold text-teal-400">CONTROL & BREATHE</span>
                                </div>
                            )}

                            <button
                                onClick={onClose}
                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 overflow-hidden">

                        {/* Dynamic Background Image (Ken Burns Effect) */}
                        {isPlaying && exercise.thumbnailUrl ? (
                            <div className="absolute inset-0 z-0">
                                <motion.img
                                    key={exercise.id}
                                    src={exercise.thumbnailUrl}
                                    alt={exercise.title}
                                    initial={{ scale: 1 }}
                                    animate={{ scale: 1.1 }}
                                    transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
                                    className="w-full h-full object-cover opacity-80"
                                />
                                {/* Overlay gradient to ensure text readability */}
                                <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 mix-blend-multiply`} />
                            </div>
                        ) : (
                            // Fallback abstract background
                            <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${gradientName} mix-blend-overlay`} />
                        )}

                        {!isPlaying && (
                            <>
                                {/* Thumbnail Background for Pause State too, but static */}
                                {exercise.thumbnailUrl && (
                                    <div className="absolute inset-0 z-0 ">
                                        <img
                                            src={exercise.thumbnailUrl}
                                            alt={exercise.title}
                                            className="w-full h-full object-cover opacity-40 blur-sm scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/60" />
                                    </div>
                                )}

                                <button
                                    onClick={() => setIsPlaying(true)}
                                    className={`relative z-10 group p-6 rounded-full bg-gradient-to-br ${gradientName} text-white shadow-2xl transition-transform hover:scale-110 active:scale-95`}
                                >
                                    <Play className="w-12 h-12 fill-current" />
                                    <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-white" />
                                </button>
                            </>
                        )}

                        {/* Category Specific Overlay UI (High Intensity GO text) */}
                        {isHighIntensity && isPlaying && (
                            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-center pointer-events-none z-10">
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-6xl font-black italic text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 tracking-tighter"
                                >
                                    GO!
                                </motion.div>
                            </div>
                        )}
                    </div>

                    {/* Pedagogical Overlay */}
                    <PedagogicalOverlay
                        exercise={exercise}
                        mode={mode}
                        isVisible={showOverlay && isPlaying}
                    />

                    {/* Production Context Overlay (Video Style Guide) */}
                    {mode === 'coach' && !isPlaying && exercise.videoContext && (
                        <div className="absolute top-24 left-6 max-w-sm bg-black/80 backdrop-blur-md p-4 rounded-xl border border-yellow-500/30 text-white z-20">
                            <h3 className="text-yellow-500 font-bold mb-2 flex items-center gap-2">
                                <Activity className="w-4 h-4" /> Production Guidelines
                            </h3>
                            <div className="space-y-3 text-xs text-gray-300">
                                <div>
                                    <span className="block text-gray-500 uppercase text-[10px]">Performer Profile</span>
                                    {exercise.videoContext.performerProfile}
                                </div>
                                <div>
                                    <span className="block text-gray-500 uppercase text-[10px]">Camera & Angle</span>
                                    {exercise.videoContext.cameraAngle}
                                </div>
                                <div>
                                    <span className="block text-gray-500 uppercase text-[10px]">Lighting & Vibe</span>
                                    {exercise.videoContext.lighting}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Athlete Context Badge */}
                    {mode === 'athlete' && exercise.videoContext && (
                        <div className="absolute top-24 left-6 z-20">
                            <div className="bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full bg-${config.accentColor.split('-')[1]}-500 animate-pulse`}></div>
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase">Performer Style</p>
                                    <p className="text-xs font-medium text-white">{exercise.videoContext.performerProfile}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Controls Bar */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent z-30">

                        {/* Progress Bar */}
                        <div className="relative w-full h-1.5 bg-gray-800 rounded-full mb-4 overflow-hidden group hover:h-2 transition-all cursor-pointer">
                            <div
                                className={`absolute left-0 top-0 bottom-0 bg-gradient-to-r ${gradientName}`}
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <button
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className="text-white hover:text-gray-200 transition-colors"
                                >
                                    {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current" />}
                                </button>

                                <div className="text-white/80 font-mono text-sm">
                                    00:{Math.floor(progress / 100 * 60).toString().padStart(2, '0')} / {exercise.duration}
                                </div>

                                <button
                                    onClick={() => setShowOverlay(!showOverlay)}
                                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${showOverlay
                                        ? 'bg-white text-black border-white'
                                        : 'bg-transparent text-white border-white/30 hover:bg-white/10'
                                        }`}
                                >
                                    {showOverlay ? 'Hide Info' : 'Show Info'}
                                </button>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className={`text-xs font-bold px-2 py-1 rounded bg-white/10 text-white border border-white/10`}>
                                    {mode === 'coach' ? 'COACH VIEW' : 'ATHLETE VIEW'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
