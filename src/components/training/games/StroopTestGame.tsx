import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COLORS = [
    { id: 'red', name: 'أحمر', hex: '#ef4444' },     // text-red-500
    { id: 'blue', name: 'أزرق', hex: '#3b82f6' },    // text-blue-500
    { id: 'green', name: 'أخضر', hex: '#10b981' },   // text-emerald-500
    { id: 'yellow', name: 'أصفر', hex: '#eab308' },  // text-yellow-500
];

interface Props {
    config: any; // { targetScore: 10, timeLimitSeconds: 30 }
    onComplete: (stats: { score: number, accuracy: number, timeSeconds: number }) => void;
}

export const StroopTestGame: React.FC<Props> = ({ config, onComplete }) => {
    const targetScore = config.targetScore || 10;
    const timeLimit = config.timeLimitSeconds || 30;

    const [words, setWords] = useState({ wordIndex: 0, colorIndex: 0 });
    const [score, setScore] = useState(0);
    const [errors, setErrors] = useState(0);
    const [timeLeft, setTimeLeft] = useState(timeLimit);
    const [shakeCount, setShakeCount] = useState(0); // for error animation
    const [startTime] = useState(Date.now());

    // Generate next challenge
    const generateNext = () => {
        const wordIdx = Math.floor(Math.random() * COLORS.length);
        let colorIdx = Math.floor(Math.random() * COLORS.length);
        // Force them to be different to create the Stroop interference
        while (colorIdx === wordIdx) {
            colorIdx = Math.floor(Math.random() * COLORS.length);
        }
        setWords({ wordIndex: wordIdx, colorIndex: colorIdx });
    };

    // Init
    useEffect(() => {
        generateNext();
    }, []);

    // Timer
    useEffect(() => {
        if (timeLeft <= 0) {
            finishGame();
            return;
        }
        const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
        return () => clearTimeout(timer);
    }, [timeLeft]);

    const finishGame = () => {
        const timeTaken = Math.min(timeLimit, Math.floor((Date.now() - startTime) / 1000));
        const accuracy = score + errors > 0 ? Math.round((score / (score + errors)) * 100) : 0;
        onComplete({ score: score * 10, accuracy, timeSeconds: timeTaken });
    };

    const handleAnswer = (colorId: string) => {
        if (timeLeft <= 0) return;

        if (colorId === COLORS[words.colorIndex].id) {
            // Correct
            const newScore = score + 1;
            setScore(newScore);
            if (newScore >= targetScore) {
                finishGame();
            } else {
                generateNext();
            }
        } else {
            // Incorrect
            setErrors((e) => e + 1);
            setShakeCount((s) => s + 1); // Trigger shake
        }
    };

    const activeWord = COLORS[words.wordIndex];
    const activeColor = COLORS[words.colorIndex];

    if (!activeWord || !activeColor) return null;

    return (
        <div className="w-full flex flex-col items-center justify-center p-4">
            
            {/* Header HUD */}
            <div className="w-full max-w-2xl mb-12 flex justify-between items-center bg-white/5 border border-white/10 p-4 md:p-6 rounded-[2rem] shadow-xl">
                <div className="text-center flex-1">
                    <p className="text-white/50 text-sm md:text-base font-black uppercase tracking-wider mb-2">الهدف</p>
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

            {/* Main Word Display */}
            <div className="mb-16 relative h-40 flex items-center justify-center">
                <AnimatePresence mode="popLayout">
                    <motion.h1
                        key={score + shakeCount}
                        initial={{ opacity: 0, scale: 0.5, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: shakeCount > 0 && shakeCount % 2 !== 0 ? [-10, 10, -10, 10, 0] : 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                        className="text-8xl md:text-9xl font-black drop-shadow-[0_0_40px_rgba(0,0,0,0.8)]"
                        style={{ color: activeColor.hex }}
                    >
                        {activeWord.name}
                    </motion.h1>
                </AnimatePresence>
                <p className="absolute -bottom-8 text-white/40 font-bold text-lg animate-pulse">
                    اختر <span className="text-white">لون الحبر</span> وليس الكلمة!
                </p>
            </div>

            {/* Answer Buttons */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
                {COLORS.map((color) => (
                    <motion.button
                        key={color.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAnswer(color.id)}
                        className="h-20 md:h-24 rounded-2xl bg-white/10 border border-white/20 hover:bg-white/20 text-2xl font-black text-white shadow-lg transition-colors flex items-center justify-center"
                    >
                        {color.name}
                    </motion.button>
                ))}
            </div>
            
        </div>
    );
};
