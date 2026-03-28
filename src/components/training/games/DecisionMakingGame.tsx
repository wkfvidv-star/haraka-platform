import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const FLANKER_SETS = [
    { display: '← ← ← ← ←', answer: 'left', isCongruent: true },
    { display: '→ → → → →', answer: 'right', isCongruent: true },
    { display: '→ → ← → →', answer: 'left', isCongruent: false },
    { display: '← ← → ← ←', answer: 'right', isCongruent: false },
    { display: '↑ ↑ ↑ ↑ ↑', answer: 'up', isCongruent: true },
    { display: '↓ ↓ ↓ ↓ ↓', answer: 'down', isCongruent: true },
    { display: '↓ ↓ ↑ ↓ ↓', answer: 'up', isCongruent: false },
    { display: '↑ ↑ ↓ ↑ ↑', answer: 'down', isCongruent: false },
];

interface Props {
    config: any;
    onComplete: (stats: { score: number, accuracy: number, timeSeconds: number }) => void;
}

export const DecisionMakingGame: React.FC<Props> = ({ config, onComplete }) => {
    const targetScore = config.targetScore || 15;
    const timeLimit = config.timeLimitSeconds || 45;

    const [score, setScore] = useState(0);
    const [errors, setErrors] = useState(0);
    const [timeLeft, setTimeLeft] = useState(timeLimit);
    const [shakeCount, setShakeCount] = useState(0);
    const [startTime] = useState(Date.now());
    const [currentSet, setCurrentSet] = useState(FLANKER_SETS[0]);

    useEffect(() => {
        generateNext();
    }, []);

    useEffect(() => {
        if (timeLeft <= 0) {
            finishGame();
            return;
        }
        const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
        return () => clearTimeout(timer);
    }, [timeLeft]);

    const generateNext = () => {
        const next = FLANKER_SETS[Math.floor(Math.random() * FLANKER_SETS.length)];
        setCurrentSet(next);
    };

    const finishGame = () => {
        const timeTaken = Math.min(timeLimit, Math.floor((Date.now() - startTime) / 1000));
        const accuracy = score + errors > 0 ? Math.round((score / (score + errors)) * 100) : 0;
        onComplete({ score: score * 12, accuracy, timeSeconds: timeTaken });
    };

    const handleAnswer = (direction: string) => {
        if (timeLeft <= 0) return;

        if (direction === currentSet.answer) {
            const newScore = score + 1;
            setScore(newScore);
            if (newScore >= targetScore) {
                finishGame();
            } else {
                generateNext();
            }
        } else {
            setErrors((e) => e + 1);
            setShakeCount((s) => s + 1);
        }
    };

    const isHorizontal = ['left', 'right'].includes(currentSet.answer);

    return (
        <div className="w-full flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl mb-12 flex justify-between items-center bg-white/5 border border-white/10 p-4 md:p-6 rounded-[2rem] shadow-xl">
                <div className="text-center flex-1">
                    <p className="text-white/50 text-sm md:text-base font-black uppercase tracking-wider mb-2">التقدم</p>
                    <p className="text-4xl md:text-5xl font-black text-emerald-400 drop-shadow-md">{score} <span className="text-xl md:text-2xl text-emerald-400/50">/ {targetScore}</span></p>
                </div>
                <div className="text-center flex-1 border-x border-white/10">
                    <p className="text-white/50 text-sm md:text-base font-black uppercase tracking-wider mb-2">الوقت</p>
                    <p className="text-4xl md:text-5xl font-black text-white drop-shadow-md">{timeLeft}ث</p>
                </div>
                <div className="text-center flex-1">
                    <p className="text-white/50 text-sm md:text-base font-black uppercase tracking-wider mb-2">أخطاء</p>
                    <p className="text-4xl md:text-5xl font-black text-red-400 drop-shadow-md">{errors}</p>
                </div>
            </div>

            <div className="mb-12 text-center">
                <h2 className="text-3xl font-black text-white mb-3">حدد اتجاه السهم الأوسط</h2>
                <p className="text-white/50 font-bold text-lg">لا تدع الأسهم الجانبية تشتت انتباهك!</p>
            </div>

            <div className="h-32 flex items-center justify-center mb-16">
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={score + shakeCount}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ 
                            opacity: 1, 
                            scale: 1,
                            x: shakeCount > 0 && shakeCount % 2 !== 0 ? [-10, 10, -10, 10, 0] : 0,
                            color: currentSet.isCongruent ? '#3b82f6' : '#ef4444' // Blue for congruent, Red for incongruent
                        }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        className="text-7xl md:text-8xl font-black tracking-[0.2em] drop-shadow-2xl"
                        style={{ fontFamily: 'monospace' }}
                    >
                        {currentSet.display}
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="flex gap-4 md:gap-8 w-full max-w-lg justify-center">
                {isHorizontal ? (
                    <>
                        {/* Note: RTL layout makes visual right = logical left. We map logically. */}
                        <motion.button onClick={() => handleAnswer('right')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1 max-w-[160px] py-8 bg-white/10 hover:bg-white/20 border-2 border-white/20 rounded-3xl flex items-center justify-center">
                            <ArrowRight className="w-16 h-16 text-white" />
                        </motion.button>
                        <motion.button onClick={() => handleAnswer('left')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1 max-w-[160px] py-8 bg-white/10 hover:bg-white/20 border-2 border-white/20 rounded-3xl flex items-center justify-center">
                            <ArrowLeft className="w-16 h-16 text-white" />
                        </motion.button>
                    </>
                ) : (
                    <div className="flex flex-col gap-4 w-full items-center">
                        <motion.button onClick={() => handleAnswer('up')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full max-w-[160px] py-6 bg-white/10 hover:bg-white/20 border-2 border-white/20 rounded-3xl flex items-center justify-center">
                            <ArrowRight className="w-12 h-12 text-white -rotate-90" />
                        </motion.button>
                        <motion.button onClick={() => handleAnswer('down')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full max-w-[160px] py-6 bg-white/10 hover:bg-white/20 border-2 border-white/20 rounded-3xl flex items-center justify-center">
                            <ArrowRight className="w-12 h-12 text-white rotate-90" />
                        </motion.button>
                    </div>
                )}
            </div>
        </div>
    );
};
