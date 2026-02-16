import {
    Activity,
    Zap,
    Move,
    Maximize,
    Wind,
    Flame,
    Thermometer,
    Minimize2,
    Rabbit,
    Dumbbell,
    Brain,
    Heart,
    ShieldCheck,
    Layers,
    Timer,
    Shuffle
} from 'lucide-react';
import { ExerciseCategory } from '../types/ExerciseTypes';

export interface CategoryVisualConfig {
    id: ExerciseCategory;
    label: string;
    labelEn: string;
    color: string; // Tailwind class or hex
    accentColor: string;
    icon: any;
    motion: {
        introAnimation: string; // e.g., 'fade-in', 'slide-up', 'explosive-pop'
        rhythm: string; // e.g., 'fast', 'flow', 'steady'
    };
    description: string;
    productionGuide: {
        performerType: string;
        cameraStyle: string;
        environmentVibe: string;
    };
}

export const trainingCategoryConfig: Record<ExerciseCategory, CategoryVisualConfig> = {
    hiit: {
        id: 'hiit',
        label: 'تدريب متواتر عالي الكثافة',
        labelEn: 'HIIT',
        color: 'from-orange-500 to-red-600',
        accentColor: 'text-red-500',
        icon: Flame,
        motion: {
            introAnimation: 'explosive-pop',
            rhythm: 'fast'
        },
        description: 'تدريبات مكثفة مع فترات راحة قصيرة لرفع معدل ضربات القلب وحرق الدهون.',
        productionGuide: {
            performerType: 'Athletic, High Energy, Sweat visible',
            cameraStyle: 'Dynamic, Handheld feel, Quick cuts',
            environmentVibe: 'Gym, High contrast lighting, energetic',
        }
    },
    hiitch: {
        id: 'hiitch',
        label: 'HIITCH',
        labelEn: 'HIIT Technical',
        color: 'from-red-600 to-purple-700',
        accentColor: 'text-purple-600',
        icon: Zap,
        motion: {
            introAnimation: 'tech-glitch',
            rhythm: 'dynamic'
        },
        description: 'دمج الكثافة العالية مع المهارات التقنية والفنية.',
        productionGuide: {
            performerType: 'Professional Footballer, Sharp movements',
            cameraStyle: 'Mix of Wide and tight technical close-ups',
            environmentVibe: 'Technical Lab, Neon accents, Futuristic',
        }
    },
    plyometric: {
        id: 'plyometric',
        label: 'تدريب بليومتري',
        labelEn: 'Plyometrics',
        color: 'from-cyan-500 to-blue-600',
        accentColor: 'text-cyan-500',
        icon: Layers,
        motion: {
            introAnimation: 'bounce-in',
            rhythm: 'explosive'
        },
        description: 'تمارين انفجارية لتحسين القوة والسرعة والقدرة على القفز.',
        productionGuide: {
            performerType: 'Explosive, Powerful, Athletic build',
            cameraStyle: 'Low angle for jumps, Slow motion replays',
            environmentVibe: 'Track or Open field, Daylight',
        }
    },
    functional: {
        id: 'functional',
        label: 'القوة الوظيفية',
        labelEn: 'Functional Strength',
        color: 'from-slate-700 to-slate-900',
        accentColor: 'text-slate-800',
        icon: Dumbbell,
        motion: {
            introAnimation: 'solid-fade',
            rhythm: 'controlled'
        },
        description: 'تحسين كفاءة سلاسل الحركة والعضلات المستهدفة.',
        productionGuide: {
            performerType: 'Strong, Technically Check, Perfect alignment',
            cameraStyle: 'Multi-angle, Focus on kinetic chain',
            environmentVibe: 'Functional Gym, Equipment visible',
        }
    },
    strength: {
        id: 'strength',
        label: 'القوة العضلية',
        labelEn: 'Strength',
        color: 'from-gray-800 to-black',
        accentColor: 'text-gray-900',
        icon: Dumbbell,
        motion: {
            introAnimation: 'heavy-hit',
            rhythm: 'slow-powerful'
        },
        description: 'بناء الكتلة العضلية والقوة القصوى.',
        productionGuide: {
            performerType: 'Muscular, Controlled power',
            cameraStyle: 'Stable, Zoom in on muscle contraction',
            environmentVibe: 'Weight room, Metallic textures',
        }
    },
    endurance: {
        id: 'endurance',
        label: 'التحمل',
        labelEn: 'Endurance',
        color: 'from-orange-400 to-orange-600',
        accentColor: 'text-orange-500',
        icon: Activity,
        motion: {
            introAnimation: 'fade-in-slow',
            rhythm: 'continuous'
        },
        description: 'زيادة القدرة على مواصلة الجهد لفترة طويلة.',
        productionGuide: {
            performerType: 'Lean, Stamina focused, Determined',
            cameraStyle: 'Tracking shots, Longer takes',
            environmentVibe: 'Outdoor, Trail or Pitch',
        }
    },
    mobility: {
        id: 'mobility',
        label: 'الإطالة والحركة',
        labelEn: 'Mobility',
        color: 'from-teal-400 to-green-500',
        accentColor: 'text-teal-500',
        icon: Move,
        motion: {
            introAnimation: 'stretch',
            rhythm: 'fluid'
        },
        description: 'تحسين مدى حركة المفاصل والمرونة.',
        productionGuide: {
            performerType: 'Flexible, Calm, Controlled breathing',
            cameraStyle: 'Slow pans, Smooth motion',
            environmentVibe: 'Yoga studio, Soft lighting, Nature elements',
        }
    },
    balance: {
        id: 'balance',
        label: 'التوازن',
        labelEn: 'Balance',
        color: 'from-cyan-400 to-blue-500',
        accentColor: 'text-cyan-500',
        icon: Maximize,
        motion: {
            introAnimation: 'stabilize',
            rhythm: 'steady-hold'
        },
        description: 'القدرة على الحفاظ على مركز الثقل.',
        productionGuide: {
            performerType: 'Stable, Focused gaze, Core engaged',
            cameraStyle: 'Fixed tripod, Grid overlay style',
            environmentVibe: 'Minimalist, Balance pads/beams',
        }
    },
    motor: {
        id: 'motor',
        label: 'المهارات الحركية',
        labelEn: 'Motor Skills',
        color: 'from-blue-500 to-indigo-600',
        accentColor: 'text-blue-500',
        icon: Activity,
        motion: {
            introAnimation: 'slide-up',
            rhythm: 'steady'
        },
        description: 'بناء الأسس العصبية العضلية والتحكم الجسدي.',
        productionGuide: {
            performerType: 'Balanced, Focused, Clear execution',
            cameraStyle: 'Stable, Eye-level, Clear visibility',
            environmentVibe: 'Clean studio, Neutral background',
        }
    },
    neuromuscular: {
        id: 'neuromuscular',
        label: 'التدريب العصبي العضلي',
        labelEn: 'Neuromuscular',
        color: 'from-violet-500 to-fuchsia-600',
        accentColor: 'text-violet-500',
        icon: Brain,
        motion: {
            introAnimation: 'pulse',
            rhythm: 'precise'
        },
        description: 'تعزيز التواصل بين الدماغ والعضلات لتحسين الكفاءة.',
        productionGuide: {
            performerType: 'Precise, Sharp cognitive focus',
            cameraStyle: 'Detail-oriented, Timing focused',
            environmentVibe: 'Clean, Distraction-free, Scientific',
        }
    },
    core: {
        id: 'core',
        label: 'ثبات الجذع',
        labelEn: 'Core Stability',
        color: 'from-emerald-500 to-teal-600',
        accentColor: 'text-emerald-500',
        icon: Maximize,
        motion: {
            introAnimation: 'grow-center',
            rhythm: 'slow-flow'
        },
        description: 'تقوية عضلات الجذع لتحسين التوازن ونقل القوة.',
        productionGuide: {
            performerType: 'Ripped core, Stability expert',
            cameraStyle: 'Mid-shot, Focus on torso',
            environmentVibe: 'Mat work, Ground sensing',
        }
    },
    speed: {
        id: 'speed',
        label: 'السرعة',
        labelEn: 'Speed',
        color: 'from-yellow-400 to-orange-500',
        accentColor: 'text-yellow-500',
        icon: Wind,
        motion: {
            introAnimation: 'slide-right-fast',
            rhythm: 'rapid'
        },
        description: 'تطوير السرعة القصوى والتسارع.',
        productionGuide: {
            performerType: 'Sprinter, Explosive start',
            cameraStyle: 'High frame rate, Motion blur effects',
            environmentVibe: 'Track, Motion lines',
        }
    },
    agility: {
        id: 'agility',
        label: 'الرشاقة',
        labelEn: 'Agility',
        color: 'from-lime-400 to-green-500',
        accentColor: 'text-lime-500',
        icon: Rabbit,
        motion: {
            introAnimation: 'zig-zag',
            rhythm: 'sharp'
        },
        description: 'القدرة على تغيير الاتجاه بسرعة وكفاءة.',
        productionGuide: {
            performerType: 'Agile, Quick feet, Low center of gravity',
            cameraStyle: 'Overhead or High angle to show path',
            environmentVibe: 'Cones, Agility ladder, Green turf',
        }
    },
    coordination: {
        id: 'coordination',
        label: 'التوافق الحركي',
        labelEn: 'Coordination',
        color: 'from-pink-400 to-rose-500',
        accentColor: 'text-pink-500',
        icon: Shuffle,
        motion: {
            introAnimation: 'fade-in-sequence',
            rhythm: 'rhythmic'
        },
        description: 'ترتيب الحركات المعقدة بتناغم.',
        productionGuide: {
            performerType: 'Rhythmic, Multi-tasking ability',
            cameraStyle: 'Wide shot to show full body integration',
            environmentVibe: 'Studio with markers/targets',
        }
    },
    recovery: {
        id: 'recovery',
        label: 'الاستشفاء والتجديد',
        labelEn: 'Recovery & Regeneration',
        color: 'from-teal-300 to-teal-500',
        accentColor: 'text-teal-400',
        icon: Heart,
        motion: {
            introAnimation: 'soft-fade',
            rhythm: 'calm'
        },
        description: 'استعادة النشاط وتقليل الإجهاد.',
        productionGuide: {
            performerType: 'Relaxed, Loose muscles, Slow movement',
            cameraStyle: 'Ambient, Soft focus, Warm filters',
            environmentVibe: 'Spa-like, Foam rollers, Dim light',
        }
    },
    corrective: {
        id: 'corrective',
        label: 'تصحيحي / وقائي',
        labelEn: 'Corrective / Preventive',
        color: 'from-stone-400 to-stone-600',
        accentColor: 'text-stone-500',
        icon: ShieldCheck,
        motion: {
            introAnimation: 'focus-in',
            rhythm: 'analytical'
        },
        description: 'معالجة الاختلالات والحماية من الإصابات.',
        productionGuide: {
            performerType: 'Clinical, Perfect posture, Educational',
            cameraStyle: 'Clinical precise, Grid overlays',
            environmentVibe: 'Physio room, Anatomical charts',
        }
    },
    cognitive: {
        id: 'cognitive',
        label: 'إدراكي',
        labelEn: 'Cognitive',
        color: 'from-indigo-500 to-purple-600',
        accentColor: 'text-indigo-500',
        icon: Brain,
        motion: { introAnimation: 'fade', rhythm: 'steady' },
        description: 'تحسين الوظائف العقلية.',
        productionGuide: {
            performerType: 'Focused, Alert eyes',
            cameraStyle: 'Head/Eye tracking focus',
            environmentVibe: 'Dark background, Light stimuli',
        }
    },
    reaction: {
        id: 'reaction',
        label: 'رد الفعل',
        labelEn: 'Reaction',
        color: 'from-yellow-400 to-red-500',
        accentColor: 'text-yellow-500',
        icon: Zap,
        motion: { introAnimation: 'flash', rhythm: 'reactive' },
        description: 'سرعة الاستجابة للمحفزات.',
        productionGuide: {
            performerType: 'Quick twitch, Ready stance',
            cameraStyle: 'High speed camera',
            environmentVibe: 'Reaction walls, Lights',
        }
    },
    teamwork: {
        id: 'teamwork',
        label: 'العمل الجماعي',
        labelEn: 'Teamwork',
        color: 'from-blue-600 to-blue-800',
        accentColor: 'text-blue-600',
        icon: Activity,
        motion: { introAnimation: 'fade', rhythm: 'collaborative' },
        description: 'التعاون والتواصل بين اللاعبين.',
        productionGuide: {
            performerType: 'Group of players, Communicative',
            cameraStyle: 'Wide drone or high angle',
            environmentVibe: 'Full pitch, Tactical setup',
        }
    },
    mental: {
        id: 'mental',
        label: 'ذهني / نفسي',
        labelEn: 'Mental',
        color: 'from-sky-300 to-sky-500',
        accentColor: 'text-sky-400',
        icon: Brain,
        motion: { introAnimation: 'breathe', rhythm: 'flow' },
        description: 'الإعداد النفسي والصلابة الذهنية.',
        productionGuide: {
            performerType: 'Calm, Meditative posture',
            cameraStyle: 'Static, Very slow zoom',
            environmentVibe: 'Quiet room, Nature sounds',
        }
    }
};

export const getCategoryConfig = (id: ExerciseCategory) => {
    return trainingCategoryConfig[id] || trainingCategoryConfig.motor;
};
