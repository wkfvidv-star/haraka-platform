import prisma from '../prisma/client.js';
import { logger } from '../utils/logger.js';
import { z } from 'zod';

const metricSchema = z.object({
    height: z.number().optional(),
    weight: z.number().optional(),
    bmi: z.number().optional(),
    heartRate: z.number().optional(),
    agilityScore: z.number().optional(),
    balanceScore: z.number().optional(),
    flexibilityScore: z.number().optional(),
    strengthScore: z.number().optional(),
    enduranceScore: z.number().optional(),
});

const goalSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    targetValue: z.number().optional(),
    unit: z.string().optional(),
    deadline: z.string().optional(),
});

export const getHealthProfile = async (req, res) => {
    try {
        const { userId } = req.user;

        // Use safe wrappers to prevent 500 if specific tables are missing (common in multi-tenant/demo environments)
        const safeQuery = async (promise, fallback = null) => {
            try { return await promise; }
            catch (e) {
                logger.warn('Safe query caught error (likely missing table):', e.message);
                return fallback;
            }
        };

        const [latestMetrics, historicalMetrics, activeGoals, competitions, submissions] = await Promise.all([
            safeQuery(prisma.physicalMetric.findFirst({
                where: { userId },
                orderBy: { date: 'desc' }
            })),
            safeQuery(prisma.physicalMetric.findMany({
                where: { userId },
                orderBy: { date: 'desc' },
                take: 7
            }), []),
            safeQuery(prisma.goal.findMany({
                where: { userId, isCompleted: false },
                orderBy: { createdAt: 'desc' }
            }), []),
            safeQuery(prisma.competition.findMany({
                where: { endDate: { gt: new Date() } },
                take: 5
            }), []),
            safeQuery(prisma.exerciseSubmission.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                take: 10
            }), [])
        ]);

        res.json({
            success: true,
            data: {
                metrics: latestMetrics,
                historicalMetrics: historicalMetrics,
                goals: activeGoals,
                competitions: competitions,
                submissions: submissions
            }
        });
    } catch (error) {
        logger.error('Get health profile error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

export const saveMetrics = async (req, res) => {
    try {
        const { userId } = req.user;
        const data = metricSchema.parse(req.body);

        const metric = await prisma.physicalMetric.create({
            data: {
                ...data,
                userId
            }
        });

        // Also update the main profile if height/weight provided
        if (data.height || data.weight) {
            await prisma.profile.update({
                where: { userId },
                data: {
                    height: data.height,
                    weight: data.weight
                }
            });
        }

        res.json({ success: true, data: metric });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ success: false, error: error.errors });
        }
        logger.error('Save metrics error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

export const createGoal = async (req, res) => {
    try {
        const { userId } = req.user;
        const data = goalSchema.parse(req.body);

        const goal = await prisma.goal.create({
            data: {
                ...data,
                userId,
                deadline: data.deadline ? new Date(data.deadline) : undefined
            }
        });

        res.json({ success: true, data: goal });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ success: false, error: error.errors });
        }
        logger.error('Create goal error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

export const updateGoalProgress = async (req, res) => {
    try {
        const { goalId } = req.params;
        const { currentValue } = req.body;

        const goal = await prisma.goal.findUnique({ where: { id: goalId } });
        if (!goal) return res.status(404).json({ success: false, error: 'Goal not found' });

        const isCompleted = goal.targetValue ? currentValue >= goal.targetValue : false;

        const updatedGoal = await prisma.goal.update({
            where: { id: goalId },
            data: {
                currentValue,
                isCompleted: isCompleted || goal.isCompleted
            }
        });

        res.json({ success: true, data: updatedGoal });
    } catch (error) {
        logger.error('Update goal error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
