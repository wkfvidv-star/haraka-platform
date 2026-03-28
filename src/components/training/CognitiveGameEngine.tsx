import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ArrowRight, Activity, Zap, Eye, Target } from 'lucide-react';
import { COGNITIVE_GAMES_DB } from '@/data/cognitiveGamesDb';
import { MemoryMatchGame } from '@/components/training/games/MemoryMatchGame';
import { StroopTestGame } from '@/components/training/games/StroopTestGame';
import { FocusGame } from '@/components/training/games/FocusGame';
import { ProblemSolvingGame } from '@/components/training/games/ProblemSolvingGame';
import { FlexibilityGame } from '@/components/training/games/FlexibilityGame';
import { DecisionMakingGame } from '@/components/training/games/DecisionMakingGame';
import { AttentionGame } from '@/components/training/games/AttentionGame';
import { activityService } from '@/services/activityService';

interface Props {
  gameId: string;
  onClose: () => void;
}

export const CognitiveGameEngine: React.FC<Props> = ({ gameId, onClose }) => {
  const gameData = COGNITIVE_GAMES_DB[gameId];
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'level_transition' | 'completed'>('intro');
  const [activeLevelIndex, setActiveLevelIndex] = useState<number>(0);
  const [finalStats, setFinalStats] = useState<{ score: number, accuracy: number, timeSeconds: number } | null>(null);
  
  const getUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user?.id || 'default';
    } catch {
      return 'default';
    }
  };
  const uid = getUserId();
  const studentLevel = (localStorage.getItem(`haraka_student_level_${uid}`) as 'primary' | 'middle' | 'high') || 'middle';

  // Intro Voice TTS
  useEffect(() => {
      if (gameState === 'intro' && gameData) {
          try {
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              const text = `أهلاً بك يا بطل في تحدي ${gameData.title}. ${gameData.description} استعد، وركز جيداً لتحقيق أعلى مستوى وأفضل أداء معرفي.`;
              const utterance = new SpeechSynthesisUtterance(text);
              const voices = window.speechSynthesis.getVoices();
              const arVoice = voices.find(v => v.lang.includes('ar') || v.name.includes('Arabic') || v.name.includes('عربي'));
              if (arVoice) {
                  utterance.voice = arVoice;
                  utterance.lang = arVoice.lang;
              }
              window.speechSynthesis.speak(utterance);
          } catch(e) {}
      }
  }, [gameState, gameData]);

  if (!gameData) {
      return (
          <div className="p-10 text-center text-white bg-red-500/10 rounded-3xl border border-red-500/20">
              <h2 className="text-2xl font-black mb-2">اللعبة غير متوفرة بعد</h2>
              <button onClick={onClose} className="bg-white/10 px-6 py-2 rounded-full mt-4 hover:bg-white/20">العودة</button>
          </div>
      );
  }

  const handleStart = () => {
      setGameState('playing');
  };

  const playVictorySound = () => {
      try {
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
          audio.volume = 0.6;
          audio.play().catch(e => console.log('Audio play blocked:', e));
      } catch (err) {}
  };

  const handleComplete = async (stats?: { score: number, accuracy: number, timeSeconds: number }) => {
      if (stats) {
          try {
              const userId = localStorage.getItem('haraka_user_id') || 'dev-student-123';
              const durationMins = Math.max(1, Math.round(stats.timeSeconds / 60));
              await activityService.completeSession(userId, gameId, durationMins, stats.score);
              console.log(`[Cognitive Engine] Level ${activeLevelIndex + 1} complete. Banked ${stats.score} XP.`);
          } catch (error) {
              console.error("[Cognitive Engine] Failed to save XP:", error);
          }
      }
      
      if (activeLevelIndex < gameData.levels.length - 1) {
          setGameState('level_transition');
          playVictorySound();
          
          setTimeout(() => {
              setActiveLevelIndex(prev => prev + 1);
              setGameState('playing');
          }, 4000);
      } else {
          if (stats) setFinalStats(stats);
          setGameState('completed');
          playVictorySound();
      }
  };

  return (
      <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: -20 }}
          className="w-full relative rounded-[2rem] overflow-hidden min-h-[600px] bg-slate-900 border border-white/10 shadow-2xl flex flex-col"
      >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50 bg-gradient-to-b from-slate-900/80 to-transparent">
              <div className="flex items-center gap-3">
                  <button 
                      onClick={onClose} 
                      className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-500/10 hover:bg-red-500/20 transition-all text-red-400 border border-red-500/20 shadow-lg group backdrop-blur-md"
                  >
                      <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      <span className="font-bold text-sm leading-none">إنهاء الجلسة</span>
                  </button>
                  <div>
                      <h2 className="text-xl font-black tracking-tight text-white drop-shadow-lg">{gameData.title}</h2>
                      <div className="flex items-center gap-2 mt-1">
                          <p className="text-emerald-400 font-bold uppercase tracking-wider text-xs">{gameData.category}</p>
                          {(gameState === 'playing' || gameState === 'level_transition') && (
                              <span className="text-white/40 text-xs font-bold">&bull; المستوى {activeLevelIndex + 1} من {gameData.levels.length}</span>
                          )}
                      </div>
                  </div>
              </div>
          </div>

          {/* Engine Surface */}
          <div className="flex-1 flex items-center justify-center p-6 mt-16 relative z-10">
              <AnimatePresence mode="wait">
                  
                  {gameState === 'intro' && (
                      <motion.div 
                          key="intro"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 1.05 }}
                          className="max-w-2xl w-full bg-black/60 border border-white/20 p-10 rounded-[3rem] backdrop-blur-xl text-center shadow-2xl drop-shadow-[0_0_40px_rgba(16,185,129,0.2)]"
                      >
                          <div className="w-24 h-24 rounded-3xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mx-auto mb-8 shadow-inner">
                              <Brain className="w-12 h-12 text-emerald-400" />
                          </div>
                          <h3 className="text-5xl font-black text-white mb-6 tracking-tight drop-shadow-md">{gameData.title}</h3>
                          <p className="text-2xl text-emerald-200/90 mb-10 leading-relaxed font-bold drop-shadow-sm">{gameData.description}</p>
                          
                          <div className="bg-white/10 border border-white/10 rounded-3xl p-6 text-right mb-8 shadow-inner backdrop-blur-md">
                              <h4 className="text-indigo-400 font-black text-2xl mb-4 flex items-center gap-3 drop-shadow-md">
                                  <Target className="w-8 h-8" /> كيفية الأداء والتّحكم:
                              </h4>
                              <ul className="space-y-3 pr-2">
                                  {gameData.controls ? gameData.controls.map((ctrl, i) => (
                                      <li key={i} className="text-white font-bold text-xl md:text-2xl flex items-start gap-3 drop-shadow-sm leading-relaxed">
                                          <span className="text-emerald-400 mt-1">•</span> {ctrl}
                                      </li>
                                  )) : (
                                      <li className="text-white font-bold text-xl md:text-2xl flex items-start gap-3 drop-shadow-sm leading-relaxed">
                                          <span className="text-emerald-400 mt-1">•</span> اتبع التعليمات التي تظهر على الشاشة لكل مستوى.
                                      </li>
                                  )}
                              </ul>
                          </div>
                          
                          <div className="flex flex-col gap-3 w-full mt-2">
                              <button 
                                  onClick={handleStart}
                                  className="w-full py-5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-black text-2xl shadow-[0_0_40px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-3 group"
                              >
                                  ابدأ التحدي ({gameData.levels.length} مستويات)
                                  <ArrowRight className="w-6 h-6 group-hover:-translate-x-2 transition-transform" />
                              </button>
                          </div>
                      </motion.div>
                  )}

                  {gameState === 'level_transition' && (
                      <motion.div 
                          key="level_transition"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 1.05 }}
                          className="max-w-md w-full bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-[2rem] backdrop-blur-xl text-center"
                      >
                          <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-4 border-emerald-500/50 flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(16,185,129,0.5)]">
                              <Zap className="w-12 h-12 text-emerald-400" />
                          </div>
                          <h3 className="text-3xl font-black text-white mb-2">أداء رائع!</h3>
                          <p className="text-emerald-400/80 font-bold mb-8">جارٍ تجهيز المستوى {activeLevelIndex + 2}...</p>
                          
                          <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/10">
                              <motion.div 
                                  initial={{ width: "0%" }}
                                  animate={{ width: "100%" }}
                                  transition={{ duration: 4, ease: "linear" }}
                                  className="bg-emerald-400 h-full shadow-[0_0_15px_rgba(16,185,129,0.8)]"
                              />
                          </div>
                      </motion.div>
                  )}

                  {gameState === 'playing' && (
                      <motion.div 
                          key="playing"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 1.05 }}
                          className="w-full h-full flex items-center justify-center flex-col"
                      >
                          {(() => {
                              const activeLvl = gameData.levels[activeLevelIndex];
                              let adaptedTime = activeLvl.timeLimitSeconds;
                              if (adaptedTime) {
                                  if (studentLevel === 'primary') adaptedTime = Math.round(adaptedTime * 1.5);
                                  if (studentLevel === 'high') adaptedTime = Math.round(adaptedTime * 0.7);
                              }
                              
                              return activeLvl.gameType === 'match_pairs' ? (
                                  <MemoryMatchGame 
                                      config={{ ...activeLvl.config, previewSeconds: studentLevel === 'primary' ? 6 : studentLevel === 'high' ? 2 : 3, timeLimitSeconds: adaptedTime }} 
                                      onComplete={(stats) => handleComplete(stats)} 
                                  />
                              ) : activeLvl.gameType === 'stroop_test' ? (
                                  <StroopTestGame 
                                      config={{ ...activeLvl.config, timeLimitSeconds: adaptedTime }} 
                                      onComplete={(stats) => handleComplete(stats)} 
                                  />
                              ) : activeLvl.gameType === 'focus_target' ? (
                                  <FocusGame 
                                      config={{ ...activeLvl.config, timeLimitSeconds: adaptedTime }} 
                                      onComplete={(stats) => handleComplete(stats)} 
                                  />
                              ) : activeLvl.gameType === 'problem_solving' ? (
                                  <ProblemSolvingGame 
                                      config={{ ...activeLvl.config, timeLimitSeconds: adaptedTime }} 
                                      onComplete={(stats) => handleComplete(stats)} 
                                  />
                              ) : activeLvl.gameType === 'flexibility' ? (
                                  <FlexibilityGame 
                                      config={{ ...activeLvl.config, timeLimitSeconds: adaptedTime }} 
                                      onComplete={(stats) => handleComplete(stats)} 
                                  />
                              ) : activeLvl.gameType === 'decision_making' ? (
                                  <DecisionMakingGame 
                                      config={{ ...activeLvl.config, timeLimitSeconds: adaptedTime }} 
                                      onComplete={(stats) => handleComplete(stats)} 
                                  />
                              ) : activeLvl.gameType === 'attention' ? (
                                  <AttentionGame 
                                      config={{ ...activeLvl.config, timeLimitSeconds: adaptedTime }} 
                                      onComplete={(stats) => handleComplete(stats)} 
                                  />
                              ) : (
                                  <div className="text-center">
                                      <h2 className="text-4xl font-black text-white/20 mb-10">(جاري بناء المحرك التفاعلي)</h2>
                                      <div className="w-full h-64 border-2 border-dashed border-white/10 rounded-3xl flex items-center justify-center bg-white/5">
                                          <p className="text-white/40 font-bold">Game Render Surface: {activeLvl.gameType}</p>
                                      </div>
                                      <button onClick={() => handleComplete()} className="mt-8 px-6 py-3 bg-white/10 rounded-full text-white hover:bg-white/20 font-bold">تسريع: إنهاء اللعبة</button>
                                  </div>
                              );
                          })()}
                      </motion.div>
                  )}

                  {gameState === 'completed' && (
                      <motion.div 
                          key="completed"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="max-w-md w-full bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl text-center"
                      >
                          <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-4 border-emerald-500/30 flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                              <Target className="w-12 h-12 text-emerald-400" />
                          </div>
                          <h3 className="text-3xl font-black text-white mb-2">أداء متميز!</h3>
                          
                          {finalStats ? (
                              <div className="bg-black/20 rounded-2xl p-4 my-6 flex justify-around border border-white/5">
                                  <div>
                                      <p className="text-white/40 text-xs font-bold mb-1">النقاط</p>
                                      <p className="text-2xl font-black text-emerald-400">+{finalStats.score} XP</p>
                                  </div>
                                  <div>
                                      <p className="text-white/40 text-xs font-bold mb-1">الدقة</p>
                                      <p className="text-2xl font-black text-blue-400">{finalStats.accuracy}%</p>
                                  </div>
                                  <div>
                                      <p className="text-white/40 text-xs font-bold mb-1">الوقت</p>
                                      <p className="text-2xl font-black text-white">{finalStats.timeSeconds}s</p>
                                  </div>
                              </div>
                          ) : (
                              <p className="text-emerald-300 font-bold mb-8">تم تطوير قدراتك المعرفية بنجاح.</p>
                          )}
                          
                          <button 
                              onClick={onClose}
                              className="w-full py-4 mt-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black text-lg transition-all"
                          >
                              إنهاء والعودة للأنشطة
                          </button>
                      </motion.div>
                  )}

              </AnimatePresence>
          </div>
      </motion.div>
  );
};
