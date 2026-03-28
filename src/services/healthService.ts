import api from './api';

export interface PhysicalMetric {
    height?: number;
    weight?: number;
    bmi?: number;
    heartRate?: number;
    agilityScore?: number;
    balanceScore?: number;
    flexibilityScore?: number;
    strengthScore?: number;
    enduranceScore?: number;
    date: string;
}

export interface Goal {
    id: string;
    title: string;
    description?: string;
    targetValue?: number;
    currentValue: number;
    unit?: string;
    isCompleted: boolean;
}

export interface Competition {
    id: string;
    title: string;
    description?: string;
    type: string;
    rewardXp: number;
    rewardCoins: number;
    participants: number;
    endDate: string;
}

export const healthService = {
    async getHealthProfile() {
        const response = await api.get('/health/profile');
        return response.data.data;
    },

    async saveMetrics(metrics: Partial<PhysicalMetric>) {
        const response = await api.post('/health/metrics', metrics);
        return response.data.data;
    },

    async createGoal(goal: Partial<Goal>) {
        const response = await api.post('/health/goals', goal);
        return response.data.data;
    },

    async updateGoalProgress(goalId: string, currentValue: number) {
        const response = await api.patch(`/health/goals/${goalId}`, { currentValue });
        return response.data.data;
    }
};
