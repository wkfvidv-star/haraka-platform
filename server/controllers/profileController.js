import prisma from '../prisma/client.js';
import { logger } from '../utils/logger.js';

export const getProfile = async (req, res) => {
    try {
        const { userId } = req.params;

        // Use a transaction for JIT consistency, but wrap in try-catch to avoid 500ing if tables are missing
        let result;
        try {
            result = await prisma.$transaction(async (tx) => {
                // 1. Ensure User exists (Gamification shell)
                let user = await tx.user.findUnique({ where: { id: userId } });
                if (!user) {
                    logger.info('Creating JIT User shell', { userId });
                    user = await tx.user.create({
                        data: {
                            id: userId,
                            email: `${userId}@placeholder.haraka`, // Placeholder
                            password: '',
                            role: 'STUDENT'
                        }
                    });
                }

                // 2. Ensure Profile exists
                let profile = await tx.profile.findUnique({
                    where: { userId },
                    include: { user: true }
                });

                if (!profile) {
                    logger.info('Creating JIT Profile shell', { userId });
                    profile = await tx.profile.create({
                        data: {
                            userId,
                            firstName: 'تلميذ',
                            lastName: 'حركا',
                        },
                        include: { user: true }
                    });
                }

                return { profile, user: profile.user || user };
            });
        } catch (txError) {
            logger.warn('Profile JIT Transaction failed (likely missing schema):', txError.message);
            // Return fallback data instead of 500ing
            return res.json({
                success: true,
                data: {
                    userId,
                    firstName: 'تلميذ',
                    lastName: 'حركا',
                    xp: 0,
                    level: 1,
                    playCoins: 0
                }
            });
        }

        const { profile, user } = result;

        // Flatten the response
        const { user: _, ...profileData } = profile;
        res.json({
            success: true,
            data: {
                ...profileData,
                xp: user.xp || 0,
                level: user.level || 1,
                playCoins: user.playCoins || 0,
                digitalId: user.digitalId,
                qrToken: user.qrToken
            }
        });
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

export const updateXP = async (req, res) => {
    try {
        const { userId } = req.params;
        const { xp, level } = req.body;

        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                xp: xp !== undefined ? parseInt(xp) : undefined,
                level: level !== undefined ? parseInt(level) : undefined
            }
        });

        res.json({ success: true, xp: user.xp, level: user.level });
    } catch (error) {
        logger.error('Update XP error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
