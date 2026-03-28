import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

const PATTERNS = [
    { seq: ['2', '4', '6', '8'], answer: '10', options: ['9', '10', '11', '12'], explanation: 'زيادة بمقدار 2' },
    { seq: ['1', '3', '6', '10'], answer: '15', options: ['13', '14', '15', '16'], explanation: 'زيادة متصاعدة (+2, +3, +4...)' },
    { seq: ['أ', 'ب', 'ت', 'ث'], answer: 'ج', options: ['خ', 'ح', 'ج', 'د'], explanation: 'ترتيب الحروف الأبجدية' },
    { seq: ['🔴', '🔵', '🔴', '🔵'], answer: '🔴', options: ['🟢', '🟡', '🔴', '🔵'], explanation: 'نمط تناوبي' },
    { seq: ['10', '9', '7', '4'], answer: '0', options: ['1', '0', '2', '-1'], explanation: 'نقصان متصاعد (-1, -2, -3...)' },
    { seq: ['⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐'], answer: '⭐⭐⭐⭐⭐', options: ['⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐⭐', '⭐⭐⭐⭐⭐⭐'], explanation: 'زيادة نجمة في كل خطوة' },
    { seq: ['🟥', '🟩', '🟦', '🟥', '🟩'], answer: '🟦', options: ['🟥', '🟩', '🟦', '🟨'], explanation: 'تكرار النمط الثلاثي' }
];

interface Props {
    config: any; 
    onComplete: (stats: { score: number, accuracy: number, timeSeconds: number }) => void;
}

export const ProblemSolvingGame: React.FC<Props> = ({ config, onComplete }) => {
    const targetScore = config.targetScore || 5;
    const timeLimit = config.timeLimitSeconds || 60;

    const [score, setScore] = useState(0);
    const [errors, setErrors] = useState(0);
    const [timeLeft, setTimeLeft] = useState(timeLimit);
    const [patternIndex, setPatternIndex] = useState(0);
    const [shakeCount, setShakeCount] = useState(0);
    const [startTime] = useState(Date.now());

    // Randomize pattern order on mount
    const [shuffledPatterns, setShuffledPatterns] = useState([...PATTERNS].sort(() => Math.random() - 0.5));

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
        onComplete({ score: score * 20, accuracy, timeSeconds: timeTaken });
    };

    const handleAnswer = (option: string) => {
        if (timeLeft <= 0) return;
        const currentPattern = shuffledPatterns[patternIndex];

        if (option === currentPattern.answer) {
            const newScore = score + 1;
            setScore(newScore);
            if (newScore >= targetScore || patternIndex + 1 >= shuffledPatterns.length) {
                finishGame();
            } else {
                setPatternIndex((pi) => pi + 1);
            }
        } else {
            setErrors((e) => e + 1);
            setShakeCount((s) => s + 1);
        }
    };

    const activePattern = shuffledPatterns[patternIndex];
    if (!activePattern) return null;

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
                <h2 className="text-3xl font-black text-white mb-3">أكمل النمط</h2>
                <p className="text-white/50 font-bold text-lg">ما هو العنصر التالي في التسلسل المنطقي؟</p>
            </div>

            <motion.div 
                animate={{ x: shakeCount > 0 && shakeCount % 2 !== 0 ? [-10, 10, -10, 10, 0] : 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="flex items-center justify-center gap-4 mb-16 flex-wrap"
            >
                <AnimatePresence mode="popLayout">
                    {activePattern.seq.map((item, idx) => (
                        <motion.div
                            key={`seq-${patternIndex}-${idx}`}
                            initial={{ opacity: 0, scale: 0.5, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="w-20 h-20 bg-white/10 border-2 border-white/20 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-lg"
                        >
                            {item}
                        </motion.div>
                    ))}
                    <motion.div
                        key={`seq-mystery-${patternIndex}`}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: activePattern.seq.length * 0.1 }}
                        className="w-20 h-20 bg-emerald-500/20 border-2 border-emerald-500 border-dashed rounded-2xl flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                    >
                        <HelpCircle className="w-10 h-10 animate-pulse" />
                    </motion.div>
                </AnimatePresence>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-3xl">
                {activePattern.options.map((opt, idx) => (
                    <motion.button
                        key={`opt-${patternIndex}-${idx}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + idx * 0.1 }}
                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAnswer(opt)}
                        className="bg-white/10 border border-white/20 hover:border-white/50 py-6 rounded-2xl text-2xl font-black text-white transition-all shadow-md"
                    >
                        {opt}
                    </motion.button>
                ))}
            </div>
        </div>
    );
};
