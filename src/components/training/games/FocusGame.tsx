import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TARGET_ICON = '🎯';
const DISTRACTORS = ['🥎', '⚽', '🏀', '🎾', '🏐', '🎱', '🏏', '🥏'];

interface Props {
    config: any; // { targetScore: 10, timeLimitSeconds: 30 }
    onComplete: (stats: { score: number, accuracy: number, timeSeconds: number }) => void;
}

export const FocusGame: React.FC<Props> = ({ config, onComplete }) => {
    const targetScore = config.targetScore || 10;
    const timeLimit = config.timeLimitSeconds || 30;

    const [score, setScore] = useState(0);
    const [errors, setErrors] = useState(0);
    const [timeLeft, setTimeLeft] = useState(timeLimit);
    const [grid, setGrid] = useState<string[]>([]);
    const [shakeCount, setShakeCount] = useState(0);
    const [startTime] = useState(Date.now());

    // Generate 5x5 grid (25 items) with exactly 1 target
    const generateGrid = () => {
        const newGrid = Array(25).fill('');
        const targetIndex = Math.floor(Math.random() * 25);
        
        for (let i = 0; i < 25; i++) {
            if (i === targetIndex) {
                newGrid[i] = TARGET_ICON;
            } else {
                newGrid[i] = DISTRACTORS[Math.floor(Math.random() * DISTRACTORS.length)];
            }
        }
        setGrid(newGrid);
    };

    useEffect(() => {
        generateGrid();
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
        onComplete({ score: score * 15, accuracy, timeSeconds: timeTaken });
    };

    const handleItemClick = (item: string) => {
        if (timeLeft <= 0) return;

        if (item === TARGET_ICON) {
            const newScore = score + 1;
            setScore(newScore);
            if (newScore >= targetScore) {
                finishGame();
            } else {
                generateGrid();
            }
        } else {
            setErrors((e) => e + 1);
            setShakeCount((s) => s + 1);
        }
    };

    return (
        <div className="w-full flex flex-col items-center justify-center p-4">
            {/* Header HUD */}
            <div className="w-full max-w-2xl mb-10 flex justify-between items-center bg-white/5 border border-white/10 p-4 md:p-6 rounded-[2rem] shadow-xl">
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

            <div className="mb-6 text-center">
                <h2 className="text-2xl font-black text-white mb-2">أين الهدف؟</h2>
                <p className="text-white/50 font-bold">ابحث عن <span className="text-3xl mx-2">{TARGET_ICON}</span> وانقر عليه بأسرع وقت!</p>
            </div>

            <motion.div 
                animate={{ x: shakeCount > 0 && shakeCount % 2 !== 0 ? [-10, 10, -10, 10, 0] : 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="grid grid-cols-5 gap-3 bg-black/20 p-6 rounded-[2rem] border border-white/5 shadow-2xl"
            >
                {grid.map((item, idx) => (
                    <motion.button
                        key={`${score}-${idx}`} // Force re-animation on new grid
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.02 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleItemClick(item)}
                        className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center text-4xl md:text-5xl bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 shadow-sm"
                    >
                        {item}
                    </motion.button>
                ))}
            </motion.div>
        </div>
    );
};
