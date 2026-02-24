import prisma from '../prisma/client.js';
import { z } from 'zod';
import { logger } from '../utils/logger.js';

const activitySchema = z.object({
    steps: z.number().min(0).optional(),
    calories: z.number().min(0).optional(),
    activeMinutes: z.number().min(0).optional(),
});

export const saveActivity = async (req, res) => {
    try {
        const { userId } = req.user; // Assuming auth middleware adds user to req
        const { steps, calories, activeMinutes } = activitySchema.parse(req.body);
        const date = new Date();
        date.setHours(0, 0, 0, 0);

        const activity = await prisma.dailyActivity.upsert({
            where: {
                userId_date: {
                    userId,
                    date,
                },
            },
            update: {
                steps: { increment: steps || 0 },
                calories: { increment: calories || 0 },
                activeMinutes: { increment: activeMinutes || 0 },
            },
            create: {
                userId,
                date,
                steps: steps || 0,
                calories: calories || 0,
                activeMinutes: activeMinutes || 0,
            },
        });

        res.json({ success: true, activity });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ success: false, error: error.errors });
        }
        logger.error('Save activity error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

export const getActivityHistory = async (req, res) => {
    try {
        const { userId } = req.user;
        const history = await prisma.dailyActivity.findMany({
            where: { userId },
            orderBy: { date: 'desc' },
            take: 7,
        });

        res.json({ success: true, history });
    } catch (error) {
        logger.error('Get activity history error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
