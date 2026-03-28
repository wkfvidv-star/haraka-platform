import api from './api';

export interface PerformanceMetric {
    id: string;
    name: string;
    value: number;
    unit: string;
    change: number;
    changeType: 'increase' | 'decrease' | 'stable';
    target: number;
    category: string;
    color: string;
}

export interface WeeklyData {
    week: string;
    exercises: number;
    points: number;
    duration: number;
    calories: number;
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    progress: number;
    total: number;
    icon: string;
}

export const analyticsService = {
    getStudentPerformance: async (userId: string): Promise<PerformanceMetric[]> => {
        try {
            const { data } = await api.get('/analytics/performance');
            if (data.success) {
                return data.metrics;
            }
            throw new Error(data.error || 'Failed to fetch performance');
        } catch (error) {
            console.error('getStudentPerformance error:', error);
            // Fallback for safety during transition
            return [
                { id: 'placeholder', name: 'بيانات غير متاحة', value: 0, unit: '%', change: 0, changeType: 'stable', target: 100, category: 'عام', color: 'gray' }
            ];
        }
    },

    getWeeklyData: async (userId: string): Promise<WeeklyData[]> => {
        try {
            const { data } = await api.get('/analytics/weekly');
            if (data.success) {
                return data.weeklyData;
            }
            throw new Error(data.error || 'Failed to fetch weekly data');
        } catch (error) {
            console.error('getWeeklyData error:', error);
            return [];
        }
    },

    getAchievements: async (userId: string): Promise<Achievement[]> => {
        try {
            const { data } = await api.get('/analytics/achievements');
            if (data.success) {
                return data.achievements;
            }
            throw new Error(data.error || 'Failed to fetch achievements');
        } catch (error) {
            console.error('getAchievements error:', error);
            return [];
        }
    }
};
