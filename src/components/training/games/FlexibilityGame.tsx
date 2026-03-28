import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SHAPES = [
    { type: 'square', icon: '⬛' },
    { type: 'circle', icon: '⏺' },
    { type: 'triangle', icon: '🔺' },
    { type: 'star', icon: '⭐' }
];

const COLORS = [
    { name: 'أحمر', hex: '#ef4444' }, // text-red-500
    { name: 'أزرق', hex: '#3b82f6' }, // text-blue-500
    { name: 'أخضر', hex: '#10b981' }  // text-emerald-500
];

interface Props {
    config: any;
    onComplete: (stats: { score: number, accuracy: number, timeSeconds: number }) => void;
}

export const FlexibilityGame: React.FC<Props> = ({ config, onComplete }) => {
    const targetScore = config.targetScore || 10;
    const timeLimit = config.timeLimitSeconds || 45;

    const [score, setScore] = useState(0);
    const [errors, setErrors] = useState(0);
    const [timeLeft, setTimeLeft] = useState(timeLimit);
    const [shakeCount, setShakeCount] = useState(0);
    const [startTime] = useState(Date.now());

    // Current State
    const [currentRule, setCurrentRule] = useState<'shape' | 'color'>('color');
    const [targetFeature, setTargetFeature] = useState({ shape: SHAPES[0], color: COLORS[0] });
    const [options, setOptions] = useState<any[]>([]);

    const generateChallenge = () => {
        // Decide rule
        const rule = Math.random() > 0.5 ? 'shape' : 'color';
        setCurrentRule(rule);

        // Generate Target
        const tShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        const tColor = COLORS[Math.floor(Math.random() * COLORS.length)];
        setTargetFeature({ shape: tShape, color: tColor });

        // Generate Options (2 for now)
        // Correct option must match the Target on the RULE, but mismatch on the OFF-RULE to test flexibility
        const correctOffShape = SHAPES.find(s => s.type !== tShape.type) || SHAPES[1];
        const correctOffColor = COLORS.find(c => c.name !== tColor.name) || COLORS[1];

        const correctOption = rule === 'shape' 
            ? { shape: tShape, color: correctOffColor, isCorrect: true }
            : { shape: correctOffShape, color: tColor, isCorrect: true };

        // Wrong option must match the OFF-RULE but mismatch the RULE
        const wrongOption = rule === 'shape'
            ? { shape: correctOffShape, color: tColor, isCorrect: false }
            : { shape: tShape, color: correctOffColor, isCorrect: false };

        setOptions([correctOption, wrongOption].sort(() => Math.random() - 0.5));
    };

    useEffect(() => {
        generateChallenge();
    }, []);

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

    const handleAnswer = (isCorrect: boolean) => {
        if (timeLeft <= 0) return;

        if (isCorrect) {
            const newScore = score + 1;
            setScore(newScore);
            if (newScore >= targetScore) {
                finishGame();
            } else {
                generateChallenge();
            }
        } else {
            setErrors((e) => e + 1);
            setShakeCount((s) => s + 1);
        }
    };

    return (
        <div className="w-full flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl mb-10 flex justify-between items-center bg-white/5 border border-white/10 p-4 md:p-6 rounded-[2rem] shadow-xl">
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

            <div className="text-center h-20 mb-6 flex flex-col items-center justify-center">
                <AnimatePresence mode="popLayout">
                    <motion.h2
                        key={currentRule}
                        initial={{ opacity: 0, scale: 1.5, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className={`text-5xl md:text-6xl font-black drop-shadow-[0_0_30px_rgba(255,255,255,0.4)] ${currentRule === 'shape' ? 'text-indigo-400' : 'text-orange-400'}`}
                    >
                        طابق الـ {currentRule === 'shape' ? 'شكل' : 'لون'}
                    </motion.h2>
                </AnimatePresence>
            </div>

            <motion.div 
                animate={{ x: shakeCount > 0 && shakeCount % 2 !== 0 ? [-10, 10, -10, 10, 0] : 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="mb-12"
            >
                <p className="text-center text-white/50 font-bold mb-4 uppercase tracking-widest text-xs">الهدف</p>
                <div className="w-32 h-32 md:w-40 md:h-40 bg-white/10 rounded-3xl border-2 border-dashed border-white/20 flex items-center justify-center text-7xl md:text-8xl drop-shadow-2xl">
                    <span style={{ color: targetFeature.color.hex, WebkitTextStroke: '2px rgba(255,255,255,0.2)' }}>
                        {targetFeature.shape.icon}
                    </span>
                </div>
            </motion.div>

            <div className="flex gap-6 md:gap-12">
                {options.map((opt, idx) => (
                    <motion.button
                        key={`${score}-${idx}`}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ scale: 1.1, y: -5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleAnswer(opt.isCorrect)}
                        className="w-28 h-28 md:w-36 md:h-36 bg-white/5 hover:bg-white/10 border-2 border-white/10 rounded-[2rem] flex items-center justify-center text-6xl md:text-7xl shadow-xl transition-colors"
                    >
                        <span style={{ color: opt.color.hex, WebkitTextStroke: '2px rgba(255,255,255,0.2)' }}>
                            {opt.shape.icon}
                        </span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};
