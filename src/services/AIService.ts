import { BaseExercise, UserProgress } from '@/types/ExerciseTypes';

// Mock data for recommendations
const MOCK_RECOMMENDATIONS: BaseExercise[] = [
    {
        id: 'cog-1',
        title: 'Focus Master',
        description: 'Track the moving object to improve visual attention.',
        category: 'cognitive',
        level: 'intermediate',
        durationSeconds: 120,
        completed: false
    },
    {
        id: 'rea-1',
        title: 'Light Speed',
        description: 'Tap as soon as the screen turns green.',
        category: 'reaction',
        level: 'beginner',
        durationSeconds: 60,
        completed: false
    },
    {
        id: 'men-1',
        title: 'Daily Calm',
        description: '2-minute breathing exercise.',
        category: 'mental',
        level: 'beginner',
        durationSeconds: 120,
        completed: false
    }
];

export const AIService = {
    /**
     * Analyzes user progress and returns a list of recommended exercises.
     * In a real app, this would call a backend AI model.
     */
    getRecommendations: async (userProgress: UserProgress): Promise<BaseExercise[]> => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Simple logic: if user looks "advanced", maybe give harder tasks (mocked)
        if (userProgress.level > 10) {
            return MOCK_RECOMMENDATIONS.map(ex => ({ ...ex, level: 'advanced' }));
        }

        return MOCK_RECOMMENDATIONS;
    },

    /**
     * Simulates analyzing a video submission for motion/performance.
     * Returns a score (0-100) and feedback.
     */
    analyzeVideoSubmission: async (videoFile: File): Promise<{ score: number, feedback: string[] }> => {
        console.log('Analyzing video:', videoFile.name);
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Random mock score
        const score = Math.floor(Math.random() * 30) + 70; // 70-100

        return {
            score,
            feedback: [
                'Good posture maintained throughout.',
                'Reaction time could be slightly faster in the second half.',
                'Excellent focus!'
            ]
        };
    }
};
