import api from './api';

export interface UserProfile {
    firstName: string;
    lastName: string;
    height?: number;
    weight?: number;
    bloodType?: string;
    athleticGoal?: string;
    bio?: string;
}

export const profileService = {
    async updateProfile(userId: string, profileData: Partial<UserProfile>) {
        const response = await api.put(`/profile/${userId}`, profileData);
        return response.data;
    },

    async getProfile(userId: string): Promise<UserProfile> {
        const response = await api.get(`/profile/${userId}`);
        return response.data.data;
    }
};
