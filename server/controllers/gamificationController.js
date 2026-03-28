import prisma from '../prisma/client.js';
import { logger } from '../utils/logger.js';

export const getLeaderboard = async (req, res) => {
    try {
        const { role } = req.query;

        const whereClause = role && role !== 'الكل' ? {
            role: role.toUpperCase() // Assuming Prisma enum is uppercase
        } : {};

        const topPlayers = await prisma.user.findMany({
            where: whereClause,
            select: {
                id: true,
                email: true,
                role: true,
                xp: true,
                level: true,
                playCoins: true,
                profile: {
                    select: {
                        firstName: true,
                        lastName: true,
                        avatarUrl: true
                    }
                }
            },
            orderBy: {
                xp: 'desc'
            },
            take: 20
        });

        // Map to a more friendly format for the frontend
        const leaderboard = topPlayers.map((player, index) => ({
            id: player.id,
            rank: index + 1,
            name: player.profile ? `${player.profile.firstName} ${player.profile.lastName}` : player.email.split('@')[0],
            role: player.role,
            points: player.xp,
            level: player.level,
            avatar: player.profile?.avatarUrl
        }));

        res.json({ success: true, leaderboard });
    } catch (error) {
        logger.error('Get leaderboard error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

export const getBadges = async (req, res) => {
    try {
        const { userId } = req.user;

        // This is a mock for now, but ready for real DB relation
        const badges = [
            { id: 'b1', name: 'بطل التوازن', icon: '⚖️', unlocked: true },
            { id: 'b2', name: 'السرعة القصوى', icon: '⚡', unlocked: false },
            { id: 'b3', name: 'المواظبة الذهبية', icon: '🏆', unlocked: true }
        ];

        res.json({ success: true, badges });
    } catch (error) {
        logger.error('Get badges error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
