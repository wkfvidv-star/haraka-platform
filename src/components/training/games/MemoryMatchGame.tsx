import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Heart, Star, Moon, Sun, Cloud, Anchor, Feather, Diamond, Command, Triangle, Hexagon } from 'lucide-react';

const ALL_ICONS = [Zap, Heart, Star, Moon, Sun, Cloud, Anchor, Feather, Diamond, Command, Triangle, Hexagon];

interface Props {
    config: any; // e.g. { gridPairs: 4, previewSeconds: 3 }
    onComplete: (stats: { score: number, accuracy: number, timeSeconds: number }) => void;
}

interface CardData {
    id: number;
    iconIndex: number; // to know which icon
    isMatched: boolean;
}

export const MemoryMatchGame: React.FC<Props> = ({ config, onComplete }) => {
    const pairsCount = config.gridPairs || 4;
    const previewTime = config.previewSeconds || 3;

    const [cards, setCards] = useState<CardData[]>([]);
    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
    const [gameState, setGameState] = useState<'preview' | 'playing' | 'checking'>('preview');
    const [previewCountdown, setPreviewCountdown] = useState(previewTime);
    
    // Stats
    const [startTime, setStartTime] = useState<number>(0);
    const [moves, setMoves] = useState(0);
    const [errors, setErrors] = useState(0);

    // Initialize Game
    useEffect(() => {
        // Pick random subset of icons
        const shuffledIcons = [...ALL_ICONS].sort(() => 0.5 - Math.random()).slice(0, pairsCount);
        
        // Duplicate to make pairs, then shuffle
        const deck: CardData[] = [];
        shuffledIcons.forEach((_, idx) => {
            deck.push({ id: idx * 2, iconIndex: idx, isMatched: false });
            deck.push({ id: idx * 2 + 1, iconIndex: idx, isMatched: false });
        });
        
        setCards(deck.sort(() => 0.5 - Math.random()));
        
        // Start Preview Countdown
        let countdown = previewTime;
        const interval = setInterval(() => {
            countdown -= 1;
            setPreviewCountdown(Math.max(0, countdown));
            if (countdown <= 0) {
                clearInterval(interval);
                setGameState('playing');
                setStartTime(Date.now());
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [pairsCount, previewTime]);

    const handleCardClick = (index: number) => {
        if (gameState !== 'playing') return;
        if (cards[index].isMatched) return;
        if (flippedIndices.includes(index)) return;

        const newFlipped = [...flippedIndices, index];
        setFlippedIndices(newFlipped);

        if (newFlipped.length === 2) {
            setGameState('checking');
            setMoves((m) => m + 1);
            
            const first = cards[newFlipped[0]];
            const second = cards[newFlipped[1]];

            if (first.iconIndex === second.iconIndex) {
                // Match!
                setTimeout(() => {
                    setCards((prev) => {
                        const next = [...prev];
                        next[newFlipped[0]].isMatched = true;
                        next[newFlipped[1]].isMatched = true;
                        return next;
                    });
                    setFlippedIndices([]);
                    setGameState('playing');
                    
                    // Check wjn
                    if (cards.filter(c => c.isMatched).length + 2 === cards.length) {
                        const timeTaken = Math.floor((Date.now() - startTime) / 1000);
                        const accuracy = Math.max(10, 100 - (errors * 10)); // Arbitrary formula
                        setTimeout(() => onComplete({ score: 100 * pairsCount - (errors * 20), accuracy, timeSeconds: timeTaken }), 500);
                    }
                }, 400); // Short delay to show the second card before marking as match
            } else {
                // No Match
                setErrors((e) => e + 1);
                setTimeout(() => {
                    setFlippedIndices([]);
                    setGameState('playing');
                }, 1000); // 1s penalty hide delay
            }
        }
    };

    return (
        <div className="w-full flex flex-col items-center">
            
            {/* Header / HUD */}
            <div className="flex justify-around w-full max-w-2xl mb-8 bg-white/5 py-4 md:py-6 px-4 rounded-[2rem] border border-white/10 shadow-xl">
                <div className="flex flex-col items-center">
                    <span className="text-white/50 text-sm md:text-base font-black uppercase tracking-widest mb-2">المحاولات</span>
                    <span className="text-white text-4xl md:text-5xl font-black drop-shadow-lg">{moves}</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-white/50 text-sm md:text-base font-black uppercase tracking-widest mb-2">الأخطاء</span>
                    <span className="text-red-400 text-4xl md:text-5xl font-black drop-shadow-lg">{errors}</span>
                </div>
            </div>

            {/* Preview Banner */}
            <AnimatePresence>
                {gameState === 'preview' && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute text-center z-20 pointer-events-none"
                    >
                        <p className="text-3xl font-black text-white drop-shadow-md mb-2">ركّز جيداً! 👀</p>
                        <p className="text-xl font-bold text-emerald-400 bg-emerald-500/10 px-6 py-2 rounded-full border border-emerald-500/30">
                            ستختفي الأشكال بعد {previewCountdown} ثوانٍ
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Grid */}
            <div 
                className="grid gap-4 w-full max-w-lg relative z-10" 
                style={{ gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(pairsCount * 2))}, minmax(0, 1fr))` }}
            >
                {cards.map((card, idx) => {
                    const isFlipped = gameState === 'preview' || flippedIndices.includes(idx) || card.isMatched;
                    const IconComp = ALL_ICONS[card.iconIndex];

                    return (
                        <motion.button
                            key={`${card.id}-${idx}`}
                            whileHover={!isFlipped ? { scale: 1.05 } : {}}
                            whileTap={!isFlipped ? { scale: 0.95 } : {}}
                            onClick={() => handleCardClick(idx)}
                            className={`aspect-square rounded-2xl flex items-center justify-center transition-all duration-300 relative preserve-3d cursor-pointer border ${isFlipped ? (card.isMatched ? 'bg-emerald-500/20 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'bg-white/10 border-white/20') : 'bg-slate-800 border-white/5 hover:border-white/20 hover:bg-slate-700'}`}
                        >
                            <motion.div
                                initial={false}
                                animate={{ rotateY: isFlipped ? 0 : 180 }}
                                transition={{ duration: 0.6, type: "spring" }}
                                style={{ backfaceVisibility: 'hidden' }}
                                className="w-full h-full flex items-center justify-center absolute inset-0"
                            >
                                {isFlipped ? <IconComp className={`w-10 h-10 ${card.isMatched ? 'text-emerald-400' : 'text-white'}`} /> : <div className="w-4 h-4 bg-white/10 rounded-full" />}
                            </motion.div>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};
