export type ExerciseCategory =
    | 'cognitive'
    | 'motor'
    | 'reaction'
    | 'teamwork'
    | 'agility'
    | 'mental'
    | 'hiit'
    | 'hiitch'
    | 'plyometric'
    | 'functional'
    | 'neuromuscular'
    | 'core'
    | 'speed'
    | 'coordination'
    | 'recovery'
    | 'corrective'
    | 'strength'
    | 'endurance'
    | 'mobility'
    | 'balance';

export interface BaseExercise {
    id: string;
    title: string;
    description: string;
    category: ExerciseCategory | ExerciseCategory[];
    level: 'beginner' | 'intermediate' | 'advanced';
    durationSeconds: number;
    thumbnailUrl?: string; // or icon component name
    completed: boolean;
    score?: number;
    // Pedagogical & Scientific Fields
    rationale?: string; // Why this exercise?
    developmentGoal?: string; // What does it develop?
    targetAudience?: string[]; // Who is it for?
    targetedMuscles?: string[];
    commonMistakes?: string[];

    // Video Production Standards
    videoContext?: VideoProductionContext;
}

export interface VideoProductionContext {
    performerProfile: string; // e.g., "Explosive Athlete", "Calm Yogi"
    cameraAngle: string; // e.g., "Wide dynamic", "Close-up Technical"
    lighting: string; // e.g., "Bright High Contrast", "Soft Warm"
    pacing: string; // e.g., "Fast cuts", "Continuous flow"
    audioAtmosphere?: string;
}

export interface CognitiveExercise extends BaseExercise {
    category: 'cognitive';
    type: 'memory' | 'focus' | 'pattern';
    targetMetric: string; // e.g., "Reaction Time (ms)", "Accuracy (%)"
}

export interface MotorExercise extends BaseExercise {
    category: 'motor';
    type: 'balance' | 'coordination' | 'strength';
    repetitions?: number;
}

export interface ReactionExercise extends BaseExercise {
    category: 'reaction';
    stimulusType: 'visual' | 'auditory';
    averageResponseTimeMs?: number;
}

export interface TeamworkExercise extends BaseExercise {
    category: 'teamwork';
    minParticipants: number;
    role?: string;
}

export interface MentalExercise extends BaseExercise {
    category: 'mental';
    type: 'meditation' | 'journaling' | 'breathing';
}

export interface UserProgress {
    userId: string;
    completedExercises: string[]; // array of exercise IDs
    totalTimeSpentSeconds: number;
    streakDays: number;
    points: number;
    level: number;
    achievements: string[];
}
