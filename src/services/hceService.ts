import api from './api';

export interface HCEInsights {
    cognitive: {
        status: string;
        observation: string;
        recommendation: string;
    };
    physical: {
        status: string;
        observation: string;
        recommendation: string;
    };
    psychological: {
        status: string;
        observation: string;
        recommendation: string;
    };
    vision_forecast: string;
}

export const hceService = {
    async getPersonalInsights(userId: string): Promise<HCEInsights> {
        const response = await api.get(`/hce/insights/${userId}`);
        if (!response.data.success) throw new Error(response.data.error);
        return response.data.data;
    },

    async recordActivity(userId: string, activityType: string, performanceData: any) {
        const response = await api.post(`/hce/activity`, { userId, activityType, performanceData });
        return response.data;
    }
};
