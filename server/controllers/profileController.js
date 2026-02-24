import prisma from '../prisma/client.js';
import { logger } from '../utils/logger.js';

export const getProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const profile = await prisma.profile.findUnique({
            where: { userId }
        });

        if (!profile) {
            return res.status(404).json({ success: false, error: 'Profile not found' });
        }

        res.json({ success: true, data: profile });
    } catch (error) {
        logger.error('Get profile error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const { firstName, lastName, height, weight, bloodType, athleticGoal, bio } = req.body;

        const profile = await prisma.profile.upsert({
            where: { userId },
            update: {
                firstName,
                lastName,
                height: height ? parseFloat(height) : undefined,
                weight: weight ? parseFloat(weight) : undefined,
                bloodType,
                athleticGoal,
                bio
            },
            create: {
                userId,
                firstName: firstName || '',
                lastName: lastName || '',
                height: height ? parseFloat(height) : undefined,
                weight: weight ? parseFloat(weight) : undefined,
                bloodType,
                athleticGoal,
                bio
            }
        });

        logger.info('Profile updated', { userId });
        res.json({ success: true, data: profile });
    } catch (error) {
        logger.error('Update profile error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
