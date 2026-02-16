import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, Zap, ChevronRight, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

export function DailyMissionCard() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 text-white overflow-hidden relative border-none shadow-2xl group">
                {/* Dynamic Background Elements */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/20 transition-colors duration-700" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/20 rounded-full -ml-20 -mb-20 blur-2xl" />

                {/* Floating Particles Effect (Simplified) */}
                <motion.div
                    className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full"
                    animate={{ y: [0, -20, 0], opacity: [0, 1, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-blue-400 rounded-full"
                    animate={{ y: [0, 20, 0], opacity: [0, 0.8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />

                <CardContent className="p-8 sm:p-10 relative z-10 backdrop-blur-[2px]">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8">

                        {/* Mission Info */}
                        <div className="flex-1 text-center lg:text-right space-y-4">
                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-yellow-300 mb-2 border border-white/20 shadow-lg"
                            >
                                <Trophy className="w-4 h-4" />
                                تحدي النجوم اليومي
                            </motion.div>

                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tighter">
                                تحدي الـ 5000 خطوة 🏃‍♂️
                            </h2>

                            <p className="text-indigo-100 text-lg sm:text-xl max-w-2xl font-medium leading-relaxed">
                                كن أسرع من الريح! أكمل 5000 خطوة قبل الساعة 6 مساءً لتحصل على شارة <span className="text-yellow-300 font-bold">"العداء النشيط"</span> و 500 نقطة XP إضافية!
                            </p>
                        </div>

                        {/* Action & Progress */}
                        <div className="flex flex-col items-center gap-8 min-w-[200px]">
                            <motion.div
                                className="relative w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center p-2 rounded-full bg-white/5 border border-white/10 shadow-2xl"
                                whileHover={{ scale: 1.05 }}
                            >
                                {/* Progress Ring */}
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                    <circle
                                        cx="18" cy="18" r="16"
                                        className="text-white/10"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                    />
                                    <motion.circle
                                        cx="18" cy="18" r="16"
                                        className="text-yellow-400"
                                        strokeDasharray="65, 100"
                                        animate={{ strokeDasharray: ["0, 100", "65, 100"] }}
                                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        style={{ filter: "drop-shadow(0 0 8px rgba(250, 204, 21, 0.6))" }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl sm:text-4xl font-black">65%</span>
                                    <span className="text-xs font-bold text-indigo-200 uppercase tracking-widest">إنجازك</span>
                                </div>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    size="lg"
                                    className="h-14 px-10 bg-white text-indigo-700 hover:bg-indigo-50 font-black text-lg shadow-[0_10px_20px_rgba(0,0,0,0.2)] group/btn"
                                >
                                    <Zap className="w-6 h-6 mr-3 fill-current text-orange-500 group-hover/btn:animate-bounce" />
                                    ابدأ التحدي الآن! 🚀
                                    <ChevronRight className="w-5 h-5 ml-2 transition-transform group-hover/btn:translate-x-1" />
                                </Button>
                            </motion.div>
                        </div>

                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
