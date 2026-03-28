import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const EMOJI_SETS = [
    { base: '😀', outlier: '😃' },
    { base: '🏢', outlier: '🏨' },
    { base: '🏃‍♂️', outlier: '🏃‍♀️' },
    { base: '🍎', outlier: '🍅' },
    { base: 'O', outlier: '0' },
    { base: 'b', outlier: 'd' },
    { base: 'p', outlier: 'q' },
    { base: '😎', outlier: '🤓' },
    { base: '🌟', outlier: '✨' },
];

interface Props {
    config: any;
    onComplete: (stats: { score: number, accuracy: number, timeSeconds: number }) => void;
}

export const AttentionGame: React.FC<Props> = ({ config, onComplete }) => {
    const targetScore = config.targetScore || 10;
    const timeLimit = config.timeLimitSeconds || 30;

    const [score, setScore] = useState(0);
    const [errors, setErrors] = useState(0);
    const [timeLeft, setTimeLeft] = useState(timeLimit);
    const [grid, setGrid] = useState<{ id: number, char: string, isOutlier: boolean }[]>([]);
    const [shakeCount, setShakeCount] = useState(0);
    const [startTime] = useState(Date.now());

    // Generate 6x6 grid (36 items)
    const generateGrid = () => {
        const set = EMOJI_SETS[Math.floor(Math.random() * EMOJI_SETS.length)];
        const newGrid = Array(36).fill(null).map((_, i) => ({
            id: i,
            char: set.base,
            isOutlier: false
        }));
        
        const outlierIndex = Math.floor(Math.random() * 36);
        newGrid[outlierIndex].char = set.outlier;
        newGrid[outlierIndex].isOutlier = true;
        
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

    const handleItemClick = (isOutlier: boolean) => {
        if (timeLeft <= 0) return;

        if (isOutlier) {
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
            <div className="w-full max-w-2xl mb-8 flex justify-between items-center bg-white/5 border border-white/10 p-4 md:p-6 rounded-[2rem] shadow-xl">
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

            <div className="mb-6 text-center">
                <h2 className="text-3xl font-black text-white mb-2">استخرج الدخيل</h2>
                <p className="text-white/50 font-bold text-sm">عنصر واحد فقط يختلف عن البقية. ابحث عنه بسرعة!</p>
            </div>

            <motion.div 
                animate={{ x: shakeCount > 0 && shakeCount % 2 !== 0 ? [-10, 10, -10, 10, 0] : 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="grid grid-cols-6 gap-2 md:gap-3 bg-white/5 p-4 rounded-[2rem] border border-white/10 shadow-2xl"
            >
                {grid.map((item) => (
                    <motion.button
                        key={`${score}-${item.id}`} // Force re-render per level
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: (item.id % 6) * 0.02 }}
                        whileHover={{ scale: 1.15, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.2)' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleItemClick(item.isOutlier)}
                        className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center text-3xl md:text-4xl bg-black/20 hover:bg-white/20 rounded-xl transition-colors font-sans"
                    >
                        {item.char}
                    </motion.button>
                ))}
            </motion.div>
        </div>
    );
};
