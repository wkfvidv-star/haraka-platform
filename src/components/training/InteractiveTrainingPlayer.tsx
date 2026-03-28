import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X, Heart, Maximize2, Minimize2, Award, Activity, Flame, Zap, CheckCircle2, Share2, CornerUpLeft, Target } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export interface ExerciseStage {
  id: string;
  name: string; // The enormous text command shown on screen
  durationSeconds: number;
  imageUrl: string;
  description?: string[]; // Array of strings for "كيفية الأداء"
  motivation?: string;    // "💡 تحفيز"
}

export interface ExerciseSessionData {
  id: string;
  title: string;
  category: 'motor' | 'cognitive' | 'psychological' | 'rehabilitation';
  durationSeconds: number;
  xpReward: number;
  videoUrl?: string; // Optional: can be a dummy placeholder if not provided
  stages?: ExerciseStage[];
}

interface InteractiveTrainingPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: ExerciseSessionData;
  onRequestVideoSubmission?: (exerciseName: string) => void;
}

// Category-specific AI Coaching Messages
const AI_COACH_SCENARIOS = {
  motor: [
    { text: "سرعة ممتازة، بطل! ⚡", type: 'positive' },
    { text: "حافظ على توازنك عند الهبوط.", type: 'warning' },
    { text: "ارفع ركبتيك أكثر لتحقيق أقصى استفادة.", type: 'info' },
    { text: "أنت في قمة لياقتك اليوم 🔥", type: 'positive' }
  ],
  cognitive: [
    { text: "تركيز عالي جداً! 🧠", type: 'positive' },
    { text: "خذ وقتك للتعرف على النمط الصحيح.", type: 'info' },
    { text: "رد فعلك أسرع من المتوسط اليوم ⏱️", type: 'positive' },
    { text: "انتبه للتفاصيل الصغيرة في الشاشة.", type: 'warning' }
  ],
  psychological: [
    { text: "تنفس بعمق.. شهيق.. زفير 🌬️", type: 'info' },
    { text: "استرخي تماماً، أنت في أمان.", type: 'positive' },
    { text: "تخلص من كل التوتر مع كل حركة.", type: 'info' },
    { text: "معدل نبضاتك مستقر ومثالي للهدوء 🌿", type: 'positive' }
  ],
  rehabilitation: [
    { text: "حركة ممتازة وآمنة لمفاصلك 🛡️", type: 'positive' },
    { text: "توقف فوراً إذا شعرت بأي ألم حاد.", type: 'warning' },
    { text: "الاستمرارية أهم من السرعة هنا.", type: 'info' },
    { text: "نطاق حركتك يتحسن تدريجياً، واصل!", type: 'positive' }
  ]
};

// Premium background image arrays for dynamic slideshows
const CATEGORY_BGS: Record<string, string[]> = {
  motor: [
      'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop'
  ],
  cognitive: [
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070&auto=format&fit=crop'
  ],
  psychological: [
      'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508138221679-760a23a2285b?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518241353312-28b502b64ee1?q=80&w=2070&auto=format&fit=crop'
  ],
  rehabilitation: [
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2020&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop'
  ]
};


export const InteractiveTrainingPlayer: React.FC<InteractiveTrainingPlayerProps> = ({
  isOpen,
  onClose,
  exercise
}) => {
  const { updateUserStats } = useAuth();
  
  const [status, setStatus] = useState<'ready' | 'countdown' | 'playing' | 'paused' | 'level_transition' | 'completed'>('ready');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [countdown, setCountdown] = useState(4);
  const [timeLeft, setTimeLeft] = useState(exercise.durationSeconds);
  const [xpEarned, setXpEarned] = useState(0);
  const [heartRate, setHeartRate] = useState(70);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeMessage, setActiveMessage] = useState<{ text: string, type: string } | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [spokenStageId, setSpokenStageId] = useState<string | null>(null);
  const [showDescription, setShowDescription] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const ttsAudioRef = useRef<HTMLAudioElement | null>(null);
  const currentTTSStageRef = useRef<string | null>(null);
  const ttsPlayCountRef = useRef<number>(0);

  // Colors based on category
  const categoryColors = {
    motor: 'from-orange-500/20 to-rose-600/20 shadow-orange-500/40 text-orange-400 border-orange-500/30',
    cognitive: 'from-blue-500/20 to-indigo-600/20 shadow-blue-500/40 text-blue-400 border-blue-500/30',
    psychological: 'from-purple-500/20 to-fuchsia-600/20 shadow-purple-500/40 text-purple-400 border-purple-500/30',
    rehabilitation: 'from-emerald-500/20 to-teal-600/20 shadow-emerald-500/40 text-emerald-400 border-emerald-500/30'
  };
  
  const activeColor = categoryColors[exercise.category] || categoryColors.motor;

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setStatus('ready'); // NEW: Start in 'ready' state to mandate a user interaction click!
      setCurrentLevel(1);
      setCountdown(4);

      // Compute initial level 1 duration
      const initialScaledStages = exercise.stages?.map(stage => ({
          ...stage,
          durationSeconds: stage.durationSeconds
      })) || [];
      const initialTotal = initialScaledStages.length > 0 
          ? initialScaledStages.reduce((acc, curr) => acc + curr.durationSeconds, 0)
          : exercise.durationSeconds;

      setTimeLeft(initialTotal);
      setXpEarned(0);
      setHeartRate(75);
      setActiveMessage(null);
      setShowExitConfirm(false);
      setCurrentSlideIndex(0);
      setSpokenStageId(null);
      
      if (currentTTSStageRef) currentTTSStageRef.current = null;
      if (ttsAudioRef && ttsAudioRef.current) {
          ttsAudioRef.current.pause();
          ttsAudioRef.current = null;
      }
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      if (window.responsiveVoice) window.responsiveVoice.cancel();
      
      if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
        setIsFullscreen(true);
      }
    } else {
       if (document.fullscreenElement) {
           document.exitFullscreen().catch(() => {});
       }
       setIsFullscreen(false);
    }
  }, [isOpen, exercise]);

  // Master Audio Unlocking Function (MUST run on user click)
  const unlockAudioEngineAndStart = () => {
      // 1. Silent HTML5 Audio Context Unlock
      try {
          const silentMp3 = "data:audio/mp3;base64,//OExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq/zEwQQAAADIAAAAAAQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ";
          const dummy = new Audio(silentMp3);
          dummy.volume = 0.01;
          dummy.play().catch(() => {});
      } catch(e) {}

      // 2. Silent Web Speech API Unlock
      try {
          if ('speechSynthesis' in window) {
              const u = new SpeechSynthesisUtterance('');
              u.volume = 0;
              window.speechSynthesis.speak(u);
          }
      } catch(e) {}

      setStatus('countdown');
  };

  // Handle countdown
  useEffect(() => {
    if (status === 'countdown' && isOpen) {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setStatus('playing');
      }
    }
  }, [countdown, status, isOpen]);

  // Handle Pause/Resume TTS
  useEffect(() => {
      if (!isOpen) {
          window.speechSynthesis.cancel();
          return;
      }
      if (status === 'paused') {
          window.speechSynthesis.pause();
          if (ttsAudioRef.current) ttsAudioRef.current.pause();
      } else if (status === 'playing') {
          window.speechSynthesis.resume();
          if (ttsAudioRef.current) ttsAudioRef.current.play().catch(()=>{});
      }
  }, [status, isOpen]);

  // Define scalable metrics globally for the render and internal loops
  const scaledStages = exercise.stages?.map(stage => ({
      ...stage,
      durationSeconds: stage.durationSeconds + ((currentLevel - 1) * 15) // +15s per stage per level
  })) || [];
  
  const totalScaledDuration = scaledStages.length > 0
      ? scaledStages.reduce((acc, curr) => acc + curr.durationSeconds, 0)
      : exercise.durationSeconds + ((currentLevel - 1) * 30);

  // Handle main workout timer & Live Telemetry
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'playing' && isOpen) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) return 0; // stop counting down, handled by next effect
          return prev - 1;
        });

        // Telemetry Simulation
        setXpEarned((prev) => Math.min(exercise.xpReward, prev + Math.floor(exercise.xpReward / totalScaledDuration)));
        
        // 2. Heart rate fluctuates depending on effort
        setHeartRate((prev) => {
            const timeElapsed = totalScaledDuration - timeLeft;
            const progress = timeElapsed / Math.max(1, totalScaledDuration);
            
            // Adjust baseline based on category
            const isCardio = exercise.category === 'motor';
            const baseHR = isCardio ? 140 : (exercise.category === 'psychological' ? 70 : 100);
            
            if (progress < 0.2) return prev + Math.floor(Math.random() * (isCardio ? 5 : 2)); // Warmup
            if (progress < 0.8) {
                 const variance = Math.floor(Math.random() * 9) - 4; // -4 to +4
                 const target = baseHR + (isCardio ? 20 + (currentLevel*5) : 5); // scales with level
                 return prev < target ? prev + Math.floor(Math.random() * 3) : prev + variance;
            }
            return Math.max(75, prev - Math.floor(Math.random() * 5)); // Cool down
        });

        // 3. AI Popup logic
        if (Math.random() > 0.88 && !activeMessage) {
            const messages = AI_COACH_SCENARIOS[exercise.category] || AI_COACH_SCENARIOS.motor;
            const msg = messages[Math.floor(Math.random() * messages.length)];
            setActiveMessage(msg);
            setTimeout(() => setActiveMessage(null), 5000);
        }

      }, 1000);

      const slideshowInterval = setInterval(() => {
          const bgArray = CATEGORY_BGS[exercise.category] || CATEGORY_BGS.motor;
          setCurrentSlideIndex((prev) => (prev + 1) % bgArray.length);
      }, 6000);

      return () => {
          clearInterval(interval);
          clearInterval(slideshowInterval);
      };
    }
  }, [status, isOpen, timeLeft, exercise, xpEarned, activeMessage, totalScaledDuration, currentLevel]);

  // Handle Level Completion Edge
  useEffect(() => {
    if (status === 'playing' && isOpen && timeLeft === 0) {
        setStatus('completed');
        if (updateUserStats) updateUserStats({ xp: exercise.xpReward });
    }
  }, [timeLeft, status, isOpen, exercise, updateUserStats]);

  // Handle Level Transition State
  useEffect(() => {
      if (status === 'level_transition' && isOpen) {
          try {
              const chime = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
              chime.volume = 0.5;
              chime.play().catch(() => {});
              
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              const victoryPhrases = [
                  `مذهل! أتممت المستوى ${currentLevel}. لنرفع التحدي قليلاً.`,
                  `عمل رائع في المستوى ${currentLevel}، استعد للقادم!`,
                  `تطور ممتاز يا بطل في التجاوز للمستوى ${currentLevel}. القادم أفضل.`,
                  `انتهى المستوى ${currentLevel} بنجاح. خذ نفساً عميقاً للمستوى التالي.`
              ];
              const randomVictory = victoryPhrases[Math.floor(Math.random() * victoryPhrases.length)];
              // Strip emojis
              const cleanVictory = randomVictory.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '');
              const utterance = new SpeechSynthesisUtterance(cleanVictory);
              
              const voices = window.speechSynthesis.getVoices();
              const premiumArVoice = voices.find(v => v.name.includes('Tarika') || v.name.includes('Naayf') || v.name.includes('Laila') || v.name.includes('Hamed') || v.name.includes('Google Arabic')) || voices.find(v => v.lang.includes('ar'));
              
              if (premiumArVoice) {
                  utterance.voice = premiumArVoice;
                  utterance.lang = premiumArVoice.lang;
                  utterance.rate = 0.90;
                  utterance.pitch = 1.05;
              }
              window.speechSynthesis.speak(utterance);
          } catch(e) {}

          const tm = setTimeout(() => {
              const nextLevel = currentLevel + 1;
              setCurrentLevel(nextLevel);
              
              const nextScaledStages = exercise.stages?.map(stage => ({
                  ...stage,
                  durationSeconds: stage.durationSeconds + ((nextLevel - 1) * 15)
              })) || [];
              const nextTotal = nextScaledStages.length > 0 
                  ? nextScaledStages.reduce((acc, curr) => acc + curr.durationSeconds, 0)
                  : exercise.durationSeconds + ((nextLevel - 1) * 30);

              setTimeLeft(nextTotal);
              setStatus('playing');
              currentTTSStageRef.current = null;
              ttsPlayCountRef.current = 0;
          }, 6000);

          return () => clearTimeout(tm);
      }
  }, [status, isOpen, currentLevel, exercise]);

  // Automated Voice Coach (TTS) & Stage Transition Audio
  useEffect(() => {
      if (status === 'playing' && isOpen && scaledStages && scaledStages.length > 0) {
          const timeElapsed = totalScaledDuration - timeLeft;
          let currentStage: ExerciseStage | null = null;
          let accumulatedTime = 0;
          
          for (const stage of scaledStages) {
              if (timeElapsed < accumulatedTime + stage.durationSeconds) {
                  currentStage = stage;
                  break;
              }
              accumulatedTime += stage.durationSeconds;
          }
          if (!currentStage && timeElapsed >= totalScaledDuration) {
              currentStage = scaledStages[scaledStages.length - 1];
          }

          if (currentStage) {
              const stageElapsedSeconds = timeElapsed - accumulatedTime;

              // Hide description text from UI after 12 seconds per stage iteration
              if (stageElapsedSeconds === 1) {
                  setShowDescription(true);
              } else if (stageElapsedSeconds === 13) {
                  setShowDescription(false);
              }

              // 1. Play soft transition chime ONCE per stage change
              if (currentStage.id !== currentTTSStageRef.current) {
                  currentTTSStageRef.current = currentStage.id;
                  ttsPlayCountRef.current = 0; // Reset repetition counter to 0

                  try {
                      const chime = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
                      chime.volume = 0.4;
                      chime.play().catch(() => {});
                  } catch(e) {}
              }

              // 2. Play the Text-To-Speech description EXACTLY ONCE at the start of the exercise stage (at second 1)
              const targetPlaymarks = [1];

              // Check if we hit the single activation frame
              targetPlaymarks.forEach((mark, index) => {
                  if (stageElapsedSeconds >= mark && stageElapsedSeconds < mark + 2 && ttsPlayCountRef.current === index) {
                      ttsPlayCountRef.current = index + 1; // Mark this repetition as triggered
                      
                      try {
                          if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                          if (ttsAudioRef.current) {
                              ttsAudioRef.current.pause();
                              ttsAudioRef.current = null;
                          }
                          
                          const sentencesToSpeak: string[] = [];
                          sentencesToSpeak.push(currentStage!.name);
                          
                          if (currentStage!.description && currentStage!.description.length > 0) {
                              sentencesToSpeak.push("كيفية الأداء:");
                              currentStage!.description.forEach(desc => sentencesToSpeak.push(desc));
                          }

                          if (currentStage!.motivation) {
                              sentencesToSpeak.push("نصيحة إضافية:");
                              sentencesToSpeak.push(currentStage!.motivation);
                          }

                          // HD Google Cloud TTS Engine
                          const playCloudTTS = (i: number) => {
                              if (i >= sentencesToSpeak.length) return; // finished
                              if (currentTTSStageRef.current !== currentStage!.id) return;
                              
                              const textChunk = sentencesToSpeak[i].substring(0, 190);
                              const url = `https://translate.googleapis.com/translate_tts?client=gtx&ie=UTF-8&tl=ar&q=${encodeURIComponent(textChunk)}`;
                              
                              const audio = new Audio(url);
                              ttsAudioRef.current = audio;

                              audio.onended = () => {
                                  setTimeout(() => playCloudTTS(i + 1), 600);
                              };

                              const executeFallback = () => {
                                  const voices = window.speechSynthesis.getVoices();
                                  const arVoice = voices.find(v => v.name.includes('Tarika') || v.name.includes('Naayf') || v.name.includes('Laila') || v.name.includes('Hamed') || v.name.includes('Google Arabic')) || voices.find(v => v.lang.toLowerCase().includes('ar') || v.name.toLowerCase().includes('arabic') || v.name.includes('عربي'));
                                  
                                  if (arVoice) {
                                      const utterance = new SpeechSynthesisUtterance(textChunk);
                                      utterance.lang = arVoice.lang;
                                      utterance.voice = arVoice;
                                      utterance.rate = 0.92;
                                      utterance.pitch = 1.05;
                                      utterance.onend = () => setTimeout(() => playCloudTTS(i + 1), 600);
                                      utterance.onerror = () => playCloudTTS(i + 1);
                                      window.speechSynthesis.speak(utterance);
                                  } else {
                                      setTimeout(() => playCloudTTS(i + 1), 600);
                                  }
                              };

                              let fallbackTriggered = false;
                              audio.onerror = () => {
                                  if (fallbackTriggered) return;
                                  fallbackTriggered = true;

                                  if (window.speechSynthesis.getVoices().length > 0) {
                                      executeFallback();
                                  } else {
                                      const handleVoicesChanged = () => {
                                          window.speechSynthesis.onvoiceschanged = null;
                                          if (!fallbackTriggered) return;
                                          executeFallback();
                                          fallbackTriggered = false; 
                                      };
                                      window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
                                      setTimeout(() => {
                                          if (fallbackTriggered) {
                                              window.speechSynthesis.onvoiceschanged = null;
                                              executeFallback();
                                          }
                                      }, 1000);
                                  }
                              };

                              audio.play().catch((err) => {
                                  audio.onerror?.(new Event('error'));
                              });
                          };

                          // Start HD Cloud sequence
                          setTimeout(() => playCloudTTS(0), 100);

                      } catch (e) {
                          console.error('Audio/TTS failed:', e);
                      }
                  }
              });
          }
      }
  }, [timeLeft, status, isOpen, scaledStages, totalScaledDuration, currentLevel]);

  // Global Intro Voice for simple exercises without stages
  useEffect(() => {
      if (status === 'playing' && isOpen && (!exercise.stages || exercise.stages.length === 0)) {
          if (currentTTSStageRef.current !== 'intro_played') {
              currentTTSStageRef.current = 'intro_played';
              try {
                  if ('speechSynthesis' in window) {
                      window.speechSynthesis.cancel();
                      const utterance = new SpeechSynthesisUtterance(`بدأ تمرين ${exercise.title}. استعد وانطلق.`);
                      utterance.lang = 'ar-SA';
                      utterance.rate = 0.95;
                      window.speechSynthesis.speak(utterance);
                  }
              } catch(e) {}
          }
      }
  }, [status, isOpen, exercise]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
       document.exitFullscreen().catch(() => {});
       setIsFullscreen(false);
    }
  };

  const handlePause = () => {
      setStatus('paused');
      if (ttsAudioRef.current) ttsAudioRef.current.pause();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  };

  const handleResume = () => {
      setStatus('playing');
  };

  const handleExitSafe = () => {
      if (status === 'completed') {
          handleClose();
      } else {
          handlePause();
          setShowExitConfirm(true);
      }
  };

  const handleClose = () => {
      if (document.fullscreenElement) {
           document.exitFullscreen().catch(() => {});
      }
      if (ttsAudioRef.current) {
          ttsAudioRef.current.pause();
          ttsAudioRef.current = null;
      }
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      currentTTSStageRef.current = null;
      onClose();
  };

  if (!isOpen) return null;

  const progressPercent = ((totalScaledDuration - timeLeft) / totalScaledDuration) * 100;
  const timeElapsed = totalScaledDuration - timeLeft;

  // Dynamic Stage Derivation
  let activeStage: ExerciseStage | null = null;
  let stageTimeLeft = 0;
  let stageProgressPercent = 0;

  if (scaledStages.length > 0) {
      let accumulatedTime = 0;
      for (const stage of scaledStages) {
          if (timeElapsed < accumulatedTime + stage.durationSeconds) {
              activeStage = stage;
              const stageEndTime = accumulatedTime + stage.durationSeconds;
              stageTimeLeft = Math.max(0, stageEndTime - timeElapsed);
              stageProgressPercent = ((stage.durationSeconds - stageTimeLeft) / Math.max(stage.durationSeconds, 1)) * 100;
              break;
          }
          accumulatedTime += stage.durationSeconds;
      }
      if (!activeStage && scaledStages.length > 0 && timeElapsed >= totalScaledDuration) {
          activeStage = scaledStages[scaledStages.length - 1]; // lock to last stage on finish
          stageTimeLeft = 0;
          stageProgressPercent = 100;
      }
  }

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  return (
    <div 
      className={`relative w-full h-[calc(100vh-10rem)] min-h-[600px] rounded-[2rem] bg-black text-white overflow-hidden flex items-center justify-center font-tajawal ltr shadow-2xl ${isFullscreen ? 'fixed inset-0 z-[100] h-screen rounded-none' : ''}`} 
      ref={containerRef}
    >
      
      {/* ── BACKGROUND IMAGE SLIDESHOW & VISUALIZER ── */}
      <div className="absolute inset-0 pointer-events-none">
          <AnimatePresence mode="wait">
              {/* Dynamic Image Slideshow or Active Stage Image */}
              <motion.div 
                  key={activeStage ? activeStage.id : currentSlideIndex}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 0.4, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat mix-blend-luminosity"
                  style={{ backgroundImage: `url(${activeStage ? activeStage.imageUrl : (CATEGORY_BGS[exercise.category] || CATEGORY_BGS.motor)[currentSlideIndex]})` }}
              />
          </AnimatePresence>
          {/* Cinematic Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d] via-[#0a0f1d]/60 to-[#0a0f1d]/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f1d]/80 via-transparent to-[#0a0f1d]/80" />
          
          {/* Category Color Tint */}
          <div className={`absolute inset-0 bg-gradient-to-br ${activeColor.split(' ')[0]} ${activeColor.split(' ')[1]} opacity-20 mix-blend-overlay`} />
          
          {/* Subtly Rotating Radar Details */}
          <motion.div animate={{ rotate: 360, scale: [1, 1.1, 1] }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-[20%] -right-[10%] w-[120%] h-[120%] bg-[radial-gradient(circle,rgba(255,255,255,0.04)_0%,transparent_50%)]" />
      </div>

      {/* ── VIDEO PLAYER PLACEHOLDER ── */}
      <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none opacity-50">
          <div className="w-full max-w-5xl aspect-video rounded-3xl border border-white/5 bg-black/40 shadow-2xl backdrop-blur-sm flex items-center justify-center overflow-hidden relative">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
              {status === 'playing' ? (
                  <motion.div animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 4, repeat: Infinity }} className="w-48 h-48 rounded-full border-2 border-white/10 flex items-center justify-center">
                       <Play className="w-16 h-16 text-white/20 translate-x-1" />
                  </motion.div>
              ) : (
                  <Activity className="w-24 h-24 text-white/5" />
              )}
          </div>
      </div>
      
      {/* ── MAIN CONTENT LAYER ── */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between p-6 md:p-10">
        
        {/* ── HEADER (Top Bar HUD) ── */}
        <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
               <button onClick={handleExitSafe} className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-colors">
                   <CornerUpLeft className="w-6 h-6" />
               </button>
               <div>
                   <h2 className="text-2xl md:text-3xl font-black tracking-tight drop-shadow-lg">{exercise.title}</h2>
                   <p className="text-slate-400 font-bold uppercase tracking-wider text-sm mt-1">{exercise.category.toUpperCase()} SESSION</p>
               </div>
            </div>

            <div className="flex items-center gap-3">
               <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/5 flex items-center gap-2">
                   <Zap className={`w-5 h-5 ${activeColor.split(' ')[3]}`} />
                   <span className="text-xl font-black">{xpEarned} <span className="text-xs text-slate-400">XP</span></span>
               </div>
            </div>
        </div>

        {/* ── CENTER AREA (Ready / Countdown / Pause Menu / Completion) ── */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <AnimatePresence mode="wait">
                
                {/* 0. READY SCREEN (Crucial for Audio Unlocking) */}
                {status === 'ready' && (
                    <motion.div key="ready" 
                        initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 1.1, y: -30 }}
                        className="pointer-events-auto bg-black/50 backdrop-blur-2xl p-10 md:p-14 rounded-[3rem] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)] flex flex-col items-center gap-8 max-w-lg w-full text-center mx-4 relative overflow-hidden">
                        
                        <div className={`absolute inset-0 bg-gradient-to-br ${activeColor.split(' ')[0]} ${activeColor.split(' ')[1]} opacity-10 mix-blend-overlay`} />
                        
                        <div className="w-32 h-32 rounded-full border-4 border-white/10 flex items-center justify-center bg-white/5 relative mb-2">
                             <div className={`absolute inset-0 rounded-full bg-gradient-to-tr ${activeColor.split(' ')[0]} ${activeColor.split(' ')[1]} opacity-20 animate-pulse`} />
                             <Activity className="w-16 h-16 text-white drop-shadow-lg" />
                        </div>
                        
                        <div>
                            <h3 className="text-4xl md:text-5xl font-black mb-3 drop-shadow-md">هل أنت جاهز؟</h3>
                            <p className="text-slate-300 font-bold text-lg md:text-xl leading-relaxed">تأكد من تنشيط مستوى الصوت 🔊 للاستماع إلى المدرب الذكي.</p>
                        </div>

                        <button onClick={unlockAudioEngineAndStart} className={`w-full py-5 rounded-2xl font-black text-2xl hover:scale-[1.03] transition-all bg-gradient-to-r ${activeColor.split(' ')[0]} ${activeColor.split(' ')[1]} text-white shadow-xl flex items-center justify-center gap-4`}>
                            <Play className="w-8 h-8 fill-white translate-x-1" /> ابدأ التمرين بصوت
                        </button>
                    </motion.div>
                )}

                {/* 1. COUNTDOWN */}
                {status === 'countdown' && (
                    <motion.div key="countdown" 
                        initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.5, opacity: 0 }}
                        className="text-[12rem] font-black italic tracking-tighter text-white drop-shadow-[0_0_50px_rgba(255,255,255,0.3)]">
                        {countdown > 0 ? countdown : 'GO!'}
                    </motion.div>
                )}

                {/* 2. PAUSE MENU */}
                {status === 'paused' && !showExitConfirm && (
                    <motion.div key="paused" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        className="pointer-events-auto bg-black/60 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10 shadow-2xl flex flex-col items-center gap-8 max-w-sm w-full mx-4">
                        <h3 className="text-4xl font-black mb-2">إيقاف مؤقت</h3>
                        <div className="flex gap-4 w-full">
                           <button onClick={handleResume} className={`flex-1 py-4 rounded-2xl font-black text-xl hover:scale-105 transition-all bg-gradient-to-br ${activeColor.split(' ')[0]} ${activeColor.split(' ')[1]}`}>
                               متابعة
                           </button>
                        </div>
                    </motion.div>
                )}

                {/* 3. EXIT CONFIRMATION */}
                {showExitConfirm && (
                    <motion.div key="exitConfirm" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="pointer-events-auto bg-[#0a0f1d]/90 backdrop-blur-xl p-8 rounded-[2rem] border border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.15)] flex flex-col items-center text-center max-w-md mx-4">
                        <Flame className="w-16 h-16 text-red-500 mb-4 opacity-80" />
                        <h3 className="text-3xl font-black mb-2">هل أنت متأكد؟</h3>
                        <p className="text-slate-400 mb-8 font-bold text-lg">إذا انسحبت الآن ستخسر الـ XP الذي جمعته في هذه الجولة.</p>
                        <div className="flex gap-4 w-full">
                           <button onClick={handleClose} className="flex-1 py-4 rounded-2xl font-black text-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10 text-slate-300">
                               نعم، انسحاب
                           </button>
                           <button onClick={() => { setShowExitConfirm(false); handleResume(); }} className="flex-1 py-4 rounded-2xl font-black text-lg bg-red-600 hover:bg-red-500 transition-all text-white shadow-lg shadow-red-600/20">
                               لا، أريد الإكمال
                           </button>
                        </div>
                    </motion.div>
                )}

                {/* 3.5. LEVEL TRANSITION */}
                {status === 'level_transition' && (
                    <motion.div 
                        key="transition"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="pointer-events-auto bg-[#0a0f1d]/95 backdrop-blur-2xl p-8 md:p-14 rounded-[4rem] border border-blue-500/30 shadow-[0_0_100px_rgba(59,130,246,0.2)] flex flex-col items-center justify-center text-center max-w-2xl w-full mx-4"
                    >
                        <div className="w-40 h-40 rounded-full bg-blue-500/20 border-4 border-blue-400 flex items-center justify-center mb-8 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] shadow-[0_0_80px_rgba(59,130,246,0.5)]">
                            <Zap className="w-20 h-20 text-blue-300" />
                        </div>
                        <h2 className="text-6xl md:text-8xl font-black text-white mb-6 drop-shadow-2xl tracking-tighter">أداء بطولي! ⚡</h2>
                        <p className="text-4xl font-black text-blue-200">أنهيت المستوى {currentLevel} بامتياز</p>
                        <div className="mt-12 flex items-center gap-3">
                            <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <p className="text-2xl font-bold text-white/50 mt-6 animate-pulse">يتم تجهيز المستوى التالي بطاقة أكبر...</p>
                    </motion.div>
                )}

                {/* 4. WORKOUT COMPLETED */}
                {status === 'completed' && (
                    <motion.div key="completed" initial={{ opacity: 0, scale: 0.8, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: 'spring', bounce: 0.5 }}
                        className="pointer-events-auto bg-[#0a0f1d]/95 backdrop-blur-2xl p-8 md:p-12 rounded-[3rem] border border-emerald-500/30 shadow-[0_0_100px_rgba(16,185,129,0.2)] flex flex-col items-center text-center max-w-lg w-full mx-4">
                        <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6 border-4 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                        </div>
                        <h3 className="text-4xl md:text-5xl font-black mb-2 text-white">ممتاز جداً!</h3>
                        <p className="text-emerald-400/80 mb-8 font-bold text-xl uppercase tracking-widest">تمرين مكتمل</p>
                        
                        <div className="grid grid-cols-2 gap-4 w-full mb-8">
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col items-center">
                                <span className="text-slate-400 text-sm font-bold mb-1">وقت الأداء</span>
                                <span className="text-3xl font-black text-white">{formatTime(exercise.durationSeconds)}</span>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col items-center">
                                <span className="text-slate-400 text-sm font-bold mb-1">مكافأة XP</span>
                                <span className="text-3xl font-black text-yellow-400">+{exercise.xpReward}</span>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 w-full">
                           <button onClick={() => { if (onRequestVideoSubmission) { handleClose(); onRequestVideoSubmission(exercise.title); } }} className="flex-[2] py-4 rounded-2xl font-black text-lg md:text-xl hover:scale-[1.03] transition-all bg-gradient-to-l from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 shadow-[0_0_30px_rgba(99,102,241,0.3)] flex items-center justify-center gap-3 border border-indigo-400/50 relative overflow-hidden group">
                               <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                               <span className="relative z-10 flex items-center gap-2">📸 توثيق وإرسال التقييم (+500 XP)</span>
                           </button>
                           <button onClick={handleClose} className="flex-1 py-4 rounded-2xl font-black text-xl hover:scale-[1.03] transition-all bg-slate-800 hover:bg-slate-700 shadow-lg border border-slate-700">
                               تخطي
                           </button>
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>

        {/* ── MASSIVE CENTERED AI COACH TEXT / STAGE COMMAND ── */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 px-8">
            <AnimatePresence mode="wait">
                {activeMessage && status === 'playing' ? (
                    <motion.div
                        key="ai-coach"
                        initial={{ opacity: 0, scale: 0.8, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                        transition={{ duration: 0.5, type: 'spring' }}
                        className="text-center"
                    >
                        <p className={`text-4xl md:text-6xl lg:text-[4.5rem] font-black leading-tight drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] px-10 py-6 rounded-[3rem] backdrop-blur-sm bg-black/40 border border-white/10 ${
                            activeMessage.type === 'warning' ? 'text-amber-400' : 
                            activeMessage.type === 'positive' ? 'text-emerald-400' : 
                            'text-white'
                        }`}>
                            {activeMessage.text}
                        </p>
                    </motion.div>
                ) : activeStage && status === 'playing' && showDescription ? (
                     <motion.div
                        key={`stage-${activeStage.id}`}
                        initial={{ opacity: 0, scale: 0.9, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.05, filter: "blur(5px)" }}
                        transition={{ duration: 0.8 }}
                        className="text-center flex flex-col items-center gap-6 w-full px-4 lg:px-12 absolute z-50 pointer-events-none drop-shadow-2xl"
                        dir="rtl"
                    >
                        <p className="text-5xl md:text-7xl lg:text-[7rem] font-black leading-tight drop-shadow-[0_20px_50px_rgba(0,0,0,1)] px-12 py-8 rounded-[4rem] text-white">
                            {activeStage.name}
                        </p>
                        
                        {activeStage.description && activeStage.description.length > 0 && (
                            <div className="bg-black/70 backdrop-blur-2xl border border-white/20 rounded-[3rem] p-10 text-right w-full shadow-[0_30px_60px_rgba(0,0,0,0.8)] transform transition-all drop-shadow-lg">
                                <h4 className="text-indigo-400 font-black text-3xl md:text-5xl mb-6 flex items-center gap-4 drop-shadow-md">
                                    <Target className="w-8 h-8 md:w-12 md:h-12" /> كيفية الأداء:
                                </h4>
                                <ul className="space-y-4 pr-4">
                                    {activeStage.description.map((desc, i) => (
                                        <li key={i} className="text-slate-100 text-2xl md:text-4xl font-bold leading-relaxed tracking-wide drop-shadow-sm flex items-start gap-3">
                                            <span className="text-emerald-400 text-4xl leading-none mt-1">•</span> {desc}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {activeStage.motivation && (
                            <div className="mt-2 inline-block bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 font-black text-2xl md:text-3xl px-10 py-5 rounded-full border border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.25)]">
                                💡 {activeStage.motivation}
                            </div>
                        )}
                    </motion.div>
                ) : null}
             </AnimatePresence>
        </div>

        {/* ── BOTTOM BAR (Controls & HUD) ── */}
        <div className="w-full">
             {/* Progress Bar (Dual: Stage Progress / Total Progress) */}
             <div className="w-full mb-8 shrink-0 relative">
                 {/* Total Workout Progress Background */}
                 <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden absolute top-0">
                    <motion.div className="h-full bg-white/20" initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 1, ease: 'linear' }} />
                 </div>
                 {/* Active Stage Progress Foreground */}
                 {activeStage && (
                     <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden relative mt-1 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                        <motion.div className={`h-full bg-gradient-to-r ${activeColor.split(' ')[0]} ${activeColor.split(' ')[1]}`} initial={{ width: 0 }} animate={{ width: `${stageProgressPercent}%` }} transition={{ duration: 1, ease: 'linear' }} />
                     </div>
                 )}
             </div>

             <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
                 {/* Left: Time & Rate */}
                 <div className="flex items-center gap-6 w-full md:w-1/3">
                     <div className="flex flex-col">
                         <span className="text-6xl md:text-[5rem] leading-none font-black tabular-nums tracking-tighter drop-shadow-md">
                             {formatTime(activeStage ? stageTimeLeft : timeLeft)}
                         </span>
                         {activeStage && (
                             <span className="text-sm font-black text-slate-400/80 uppercase tracking-widest mt-1 pl-1">الوقت الكلي: {formatTime(timeLeft)}</span>
                         )}
                     </div>
                     
                     {/* Heart Rate HUD */}
                     <div className="hidden lg:flex flex-col items-center ml-4 mt-2">
                         <div className="flex items-center gap-2">
                             <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 60/heartRate, repeat: Infinity }} className="text-rose-500">
                                 <Heart className="w-5 h-5 fill-rose-500" />
                             </motion.div>
                             <span className="text-2xl font-black text-rose-100">{heartRate} <span className="text-[10px] uppercase text-rose-500/70">BPM</span></span>
                         </div>
                     </div>
                 </div>

                 {/* Center: Playback Controls */}
                 <div className="flex items-center gap-4">
                     <button
                        onClick={() => status === 'playing' ? handlePause() : (status === 'paused' ? handleResume() : null)}
                        disabled={status === 'countdown' || status === 'completed'}
                        className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-all focus:outline-none focus:ring-4 focus:ring-white/20"
                     >
                         {status === 'playing' ? <Pause className="w-8 h-8 fill-white" /> : <Play className="w-8 h-8 fill-white translate-x-1" />}
                     </button>
                 </div>

                 {/* Right: Fullscreen etc. */}
                 <div className="flex items-center gap-3">
                     <button onClick={toggleFullscreen} className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md flex items-center justify-center transition-colors">
                         {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                     </button>
                 </div>
             </div>
        </div>

      </div>

    </div>
  );
};
