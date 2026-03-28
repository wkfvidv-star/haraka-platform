import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Info, Activity, Zap, CheckCircle2, Scan, Clock, Volume2, VolumeX, ChevronLeft, ChevronRight, Pause, RotateCcw, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export interface ExerciseData {
  id: string;
  title: string;
  category: 'حركي' | 'نفسي' | 'معرفي' | 'تأهيل' | 'تأهيلي';
  duration: string;
  difficulty: 'مبتدئ' | 'متوسط' | 'متقدم';
  isAR: boolean;
  muscleGroups: string[];
  steps: string[];
  description: string;
}

interface ExerciseDetailsModalProps {
  isOpen: boolean;
  exercise: ExerciseData | null;
  onClose: () => void;
}

// Themed images per category
const categoryImages: Record<string, string[]> = {
  'حركي': [
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
  ],
  'معرفي': [
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
  ],
  'نفسي': [
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80',
    'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&q=80',
  ],
  'تأهيل': [
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
    'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80',
  ],
  'تأهيلي': [
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
    'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80',
  ],
};

const difficultyColors = {
  'مبتدئ': 'bg-emerald-500',
  'متوسط': 'bg-orange-500',
  'متقدم': 'bg-red-500',
};

export function ExerciseDetailsModal({ isOpen, exercise, onClose }: ExerciseDetailsModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const timerRef = useRef<number | null>(null);

  const images = exercise ? (categoryImages[exercise.category] || categoryImages['حركي']) : [];

  useEffect(() => {
    if (!isOpen) {
      stopSpeech();
      setCurrentStep(0);
      setCurrentImage(0);
      setCompletedSteps([]);
      setSeconds(0);
      setIsRunning(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => setSeconds(s => s + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRunning]);

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const stopSpeech = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const readStep = (stepText: string) => {
    if (!('speechSynthesis' in window)) return;
    stopSpeech();
    const utterance = new SpeechSynthesisUtterance(stepText);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const readAllSteps = () => {
    if (!exercise || !('speechSynthesis' in window)) return;
    stopSpeech();
    const fullText = `تمرين ${exercise.title}. ${exercise.steps.join('. ')}`;
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.85;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const markStepDone = (idx: number) => {
    setCompletedSteps(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
    if (!completedSteps.includes(idx) && idx < (exercise?.steps.length || 0) - 1) {
      setCurrentStep(idx + 1);
    }
  };

  if (!isOpen || !exercise) return null;

  const progress = exercise.steps.length > 0
    ? Math.round((completedSteps.length / exercise.steps.length) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/80 backdrop-blur-md" dir="rtl">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="bg-white w-full sm:max-w-3xl sm:rounded-[2.5rem] rounded-t-[2.5rem] shadow-2xl overflow-hidden h-[92vh] sm:h-[88vh] flex flex-col relative"
        >
          {/* Close Button */}
          <Button
            variant="ghost" size="icon" onClick={onClose}
            className="absolute top-4 left-4 z-20 bg-black/20 text-white hover:bg-black/40 rounded-full backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </Button>

          {/* ===== IMAGE CAROUSEL ===== */}
          <div className="h-56 sm:h-72 w-full relative shrink-0 bg-slate-900 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImage}
                src={images[currentImage]}
                alt={exercise.title}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 0.7, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              />
            </AnimatePresence>

            {/* Gradient overlay */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-900 to-transparent" />

            {/* Image navigation */}
            {images.length > 1 && (
              <div className="absolute inset-y-0 inset-x-0 flex items-center justify-between px-4 pointer-events-none">
                <button
                  onClick={() => setCurrentImage(i => (i - 1 + images.length) % images.length)}
                  className="w-9 h-9 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/50 pointer-events-auto transition-all border border-white/20"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentImage(i => (i + 1) % images.length)}
                  className="w-9 h-9 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/50 pointer-events-auto transition-all border border-white/20"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Image dots */}
            <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={cn('w-1.5 h-1.5 rounded-full transition-all', currentImage === i ? 'w-4 bg-white' : 'bg-white/40')}
                />
              ))}
            </div>

            {/* Title at bottom of image */}
            <div className="absolute bottom-3 right-6 left-12">
              <h2 className="text-xl font-black text-white">{exercise.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={cn('border-0 text-white font-bold text-xs', difficultyColors[exercise.difficulty])}>
                  {exercise.difficulty}
                </Badge>
                <span className="text-white/70 text-xs font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {exercise.duration}
                </span>
                {exercise.isAR && (
                  <Badge className="bg-violet-500/80 backdrop-blur-md text-white font-bold text-xs border border-violet-400 gap-1">
                    <Scan className="w-3 h-3" /> AR
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* ===== BODY ===== */}
          <div className="flex-1 overflow-y-auto bg-slate-50 p-5 sm:p-8 pb-28 space-y-6">
            {/* Progress bar */}
            {exercise.steps.length > 0 && (
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                <div className="flex justify-between text-sm font-bold text-slate-600 mb-2">
                  <span>التقدم في التمرين</span>
                  <span className="text-orange-600">{completedSteps.length}/{exercise.steps.length} خطوات</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {/* Muscle groups */}
            <div className="flex flex-wrap gap-2">
              {exercise.muscleGroups.map((m, i) => (
                <Badge key={i} variant="secondary" className="bg-slate-100 text-slate-700 font-bold text-sm px-3 py-1">
                  💪 {m}
                </Badge>
              ))}
            </div>

            {/* Description */}
            <p className="text-slate-600 font-medium leading-relaxed">{exercise.description}</p>

            {/* === Voice Controls === */}
            <div className="bg-slate-900 rounded-2xl p-4 flex items-center justify-between shadow-lg">
              <div>
                <p className="text-white font-black text-sm">🎤 المرشد الصوتي الذكي</p>
                <p className="text-slate-400 text-xs font-medium mt-0.5">استمع لشرح التمرين بالعربية</p>
              </div>
              <div className="flex items-center gap-2">
                {isSpeaking ? (
                  <Button
                    size="sm"
                    onClick={stopSpeech}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl gap-1.5"
                  >
                    <VolumeX className="w-4 h-4" /> إيقاف
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={readAllSteps}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl gap-1.5"
                  >
                    <Volume2 className="w-4 h-4" /> استمع
                  </Button>
                )}
              </div>
            </div>

            {/* === Timer === */}
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">مؤقت التمرين</p>
                <p className="text-3xl font-black text-slate-900 mt-1 font-mono">{formatTime(seconds)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsRunning(r => !r)}
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all',
                    isRunning ? 'bg-orange-500 text-white' : 'bg-slate-900 text-white'
                  )}
                >
                  {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 translate-x-0.5" />}
                </button>
                <button onClick={() => { setSeconds(0); setIsRunning(false); }} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all">
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* === Steps === */}
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-500" />
                خطوات الأداء
              </h3>
              <div className="space-y-3">
                {exercise.steps.map((step, idx) => {
                  const isDone = completedSteps.includes(idx);
                  const isCurrent = currentStep === idx;
                  return (
                    <motion.div
                      key={idx}
                      layout
                      onClick={() => { setCurrentStep(idx); readStep(step); }}
                      className={cn(
                        'flex gap-4 items-start p-4 rounded-2xl border-2 cursor-pointer transition-all',
                        isDone ? 'bg-emerald-50 border-emerald-200' :
                        isCurrent ? 'bg-orange-50 border-orange-300 shadow-sm' :
                        'bg-white border-slate-100 hover:border-slate-200'
                      )}
                    >
                      <button
                        onClick={(e) => { e.stopPropagation(); markStepDone(idx); }}
                        className={cn(
                          'w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all',
                          isDone ? 'bg-emerald-500 border-emerald-500 text-white' :
                          isCurrent ? 'border-orange-500 text-orange-500' :
                          'border-slate-300 text-slate-400'
                        )}
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs font-black">{idx + 1}</span>}
                      </button>
                      <div className="flex-1">
                        <p className={cn(
                          'font-semibold leading-relaxed',
                          isDone ? 'text-emerald-700 line-through' : 
                          isCurrent ? 'text-orange-800 font-bold' : 'text-slate-700'
                        )}>
                          {step}
                        </p>
                        {isCurrent && !isDone && (
                          <button
                            onClick={(e) => { e.stopPropagation(); readStep(step); }}
                            className="mt-2 flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700"
                          >
                            <Volume2 className="w-3.5 h-3.5" /> استمع لهذه الخطوة
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sticky Bottom */}
          <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 bg-white border-t border-slate-100 flex items-center gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.07)] z-30">
            <Button
              variant="outline"
              className="h-13 px-5 rounded-2xl font-bold text-slate-600 border-slate-200 hover:bg-slate-50 shrink-0"
            >
              + برنامجي
            </Button>
            {exercise.isAR ? (
              <Button className="flex-1 h-13 rounded-2xl font-black text-white bg-violet-600 hover:bg-violet-700 shadow-lg shadow-violet-500/30">
                <Scan className="w-5 h-5 ml-2" /> بدء الواقع المعزز (AR)
              </Button>
            ) : (
              <Button
                onClick={() => { setIsRunning(true); setCurrentStep(0); }}
                className="flex-1 h-13 rounded-2xl font-black text-white bg-slate-900 hover:bg-slate-800 shadow-lg"
              >
                <Play className="w-5 h-5 ml-2 translate-x-0.5" /> ابدأ التمرين الآن
              </Button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
