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
        const { userId } = req.user;
        const { steps, calories, activeMinutes } = activitySchema.parse(req.body);
        const date = new Date();
        date.setHours(0, 0, 0, 0);

        const result = await prisma.$transaction(async (tx) => {
            // 1. Update/Create Daily Activity (Health Tracking Only - No XP)
            const activity = await tx.dailyActivity.upsert({
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

            // Note: XP, PlayCoins, and Level Up are strictly reserved for 
            // Fraud-Verified Training Sessions via /api/session/complete

            return { activity };
        });

        res.json({ success: true, ...result });
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
        let history = [];
        try {
            history = await prisma.dailyActivity.findMany({
                where: { userId },
                orderBy: { date: 'desc' },
                take: 7,
            });
        } catch (dbError) {
            logger.warn('Activity History DB Error (likely missing table):', dbError.message);
            history = []; // Fallback to empty history
        }

        res.json({ success: true, history });
    } catch (error) {
        logger.error('Get activity history error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
