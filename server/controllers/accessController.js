import prisma from '../prisma/client.js';
import { logger } from '../utils/logger.js';

export const verifyQR = async (req, res) => {
    const { qrToken, location } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { qrToken },
            include: {
                profile: true,
                student: true,
            },
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'Invalid QR Token',
                status: 'DENIED',
                reason: 'Token not found',
            });
        }

        if (user.subscriptionStatus !== 'ACTIVE') {
            await prisma.accessLog.create({
                data: {
                    userId: user.id,
                    type: 'ENTRY',
                    location,
                    status: 'DENIED',
                    reason: `Subscription ${user.subscriptionStatus}`,
                },
            });

            return res.status(403).json({
                success: false,
                error: 'Subscription not active',
                status: 'DENIED',
                user: {
                    name: `${user.profile?.firstName} ${user.profile?.lastName}`,
                    role: user.role,
                },
            });
        }

        // Success - Record Access
        const log = await prisma.accessLog.create({
            data: {
                userId: user.id,
                type: 'ENTRY',
                location,
                status: 'GRANTED',
            },
        });

        // Record Attendance if student
        if (user.role === 'STUDENT' && user.student) {
            await prisma.attendance.create({
                data: {
                    studentId: user.student.id,
                    date: new Date(),
                    status: 'PRESENT',
                },
            });
        }

        logger.info(`Access GRANTED for user ${user.id} at ${location}`);

        return res.json({
            success: true,
            status: 'GRANTED',
            user: {
                id: user.id,
                name: `${user.profile?.firstName} ${user.profile?.lastName}`,
                role: user.role,
                digitalId: user.digitalId,
            },
            log,
        });
    } catch (error) {
        logger.error('Error verifying QR:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

export const remoteApproval = async (req, res) => {
    const { userId, location, adminId } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true },
        });

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const log = await prisma.accessLog.create({
            data: {
                userId: user.id,
                type: 'ENTRY',
                location,
                status: 'GRANTED',
                reason: `Remote approval by admin ${adminId}`,
            },
        });

        logger.info(`Remote Access GRANTED for user ${user.id} by admin ${adminId}`);

        return res.json({
            success: true,
            status: 'GRANTED',
            user: {
                name: `${user.profile?.firstName} ${user.profile?.lastName}`,
            },
            log,
        });
    } catch (error) {
        logger.error('Error in remote approval:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

export const getAccessLogs = async (req, res) => {
    try {
        const logs = await prisma.accessLog.findMany({
            take: 50,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    include: {
                        profile: true,
                    },
                },
            },
        });

        return res.json({
            success: true,
            logs: logs.map(log => ({
                id: log.id,
                userName: `${log.user.profile?.firstName} ${log.user.profile?.lastName}`,
                userRole: log.user.role,
                type: log.type,
                location: log.location,
                status: log.status,
                reason: log.reason,
                createdAt: log.createdAt,
            })),
        });
    } catch (error) {
        logger.error('Error fetching access logs:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
