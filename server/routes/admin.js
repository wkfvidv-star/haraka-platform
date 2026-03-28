import express from 'express';
import os from 'os';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';
import prisma from '../prisma/client.js';
import { authenticate, authorizeScope, requireMfa } from '../middleware/auth.js';
import { recordForensicEvent } from '../utils/forensic.js';
import { broadcastAlert } from '../utils/alertService.js';

const router = express.Router();

// Rate Limiters
const adminMetricsLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { success: false, error: 'Too many requests for metrics, please try again later.' }
});

const adminOverrideLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Strict limit: 5 requests per 15 mins for overrides
    message: { success: false, error: 'Override rate limit exceeded. Please try again later.' }
});

// Middleware to verify scopes & MFA
const verifyMetricsAccess = [authenticate, requireMfa, authorizeScope('admin:metrics')];
const verifySystemLogs = [authenticate, requireMfa, authorizeScope('admin:logs')];
const verifyAdminOverride = [authenticate, requireMfa, authorizeScope('admin:override'), adminOverrideLimiter];

// @route   GET /api/admin/metrics
// @desc    Get system health, active users, DB stats
// @access  Admin Private (requires admin:metrics)
router.get('/metrics', adminMetricsLimiter, verifyMetricsAccess, async (req, res) => {
    try {
        // Gathering Real DB Metrics
        const totalUsers = await prisma.user.count();
        const totalSessions = await prisma.trainingSession.count();
        const activeSubscriptions = await prisma.subscription.count({ where: { status: 'ACTIVE' } });
        const aiCalls = await prisma.aiUsageLog.count();

        // Simulated real-time connected users (for MVP)
        const activeUsersRightNow = Math.floor(Math.random() * 50) + 10;

        // System Health (CPU/RAM)
        const totalMem = os.totalmem() / (1024 * 1024 * 1024);
        const freeMem = os.freemem() / (1024 * 1024 * 1024);
        const usedMem = totalMem - freeMem;
        const memoryUsagePercent = (usedMem / totalMem) * 100;

        const cpus = os.cpus();
        const cpuSpeed = cpus[0].speed; // rough estimate

        res.status(200).json({
            success: true,
            data: {
                users: {
                    total: totalUsers,
                    activeNow: activeUsersRightNow,
                    growth: "+15%" // mocked trend
                },
                financials: {
                    activeSubscriptions,
                    revenueEst: activeSubscriptions * 29.99 // basic plan
                },
                activity: {
                    totalSessions,
                    totalAiCalls: aiCalls
                },
                health: {
                    memoryUsagePercent: Math.round(memoryUsagePercent),
                    usedMemGb: usedMem.toFixed(1),
                    totalMemGb: totalMem.toFixed(1),
                    cpuSpeed: cpuSpeed,
                    uptime: Math.round(process.uptime() / 60) // minutes
                }
            }
        });
    } catch (error) {
        console.error('Admin metrics error', error);
        res.status(500).json({ success: false, error: 'Failed to fetch admin metrics' });
    }
});

// @route   GET /api/admin/logs
// @desc    Get brief audit/system logs
// @access  Admin (requires admin:logs)
router.get('/logs', verifySystemLogs, async (req, res) => {
    try {
        const logs = await prisma.eventLog.findMany({
            take: 50,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { email: true } } }
        });
        res.status(200).json({ success: true, data: logs });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch forensic logs' });
    }
});

// @route   POST /api/admin/override
// @desc    Manual state correction for Phase 9 Pilot
// @access  Admin (requires admin:override & MFA)
router.post('/override', verifyAdminOverride, async (req, res) => {
    const { type, userId, value, reason_code, reason_text, override_risk_level, traceId: originalTraceId } = req.body;

    const validReasonCodes = ['SYSTEM_ERROR', 'BILLING_DISPUTE', 'FRAUD_FALSE_POSITIVE', 'PILOT_ADJUSTMENT'];
    const validRiskLevels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

    if (!type || !userId || !reason_code || !reason_text || !override_risk_level) {
        return res.status(400).json({ success: false, error: 'Missing mandatory override fields' });
    }

    if (!validReasonCodes.includes(reason_code)) {
        return res.status(400).json({ success: false, error: 'Invalid reason_code' });
    }

    if (reason_text.length < 10) {
        return res.status(400).json({ success: false, error: 'reason_text must be at least 10 characters long' });
    }

    if (!validRiskLevels.includes(override_risk_level)) {
        return res.status(400).json({ success: false, error: 'Invalid override_risk_level' });
    }

    const adminId = req.user.id;
    const traceId = crypto.randomUUID();

    // Hash IP for privacy before logging
    const ipHash = crypto.createHash('sha256').update(req.ip || '0.0.0.0').digest('hex');

    try {
        const result = await prisma.$transaction(async (tx) => {
            let adminMessage = '';

            if (type === 'RESTORE_XP') {
                const xpAmount = parseInt(value);
                const user = await tx.user.findUnique({ where: { id: userId } });
                const newXp = (user.xp || 0) + xpAmount;
                const newLevel = Math.floor(newXp / 100) + 1;

                await tx.user.update({
                    where: { id: userId },
                    data: { xp: newXp, level: newLevel }
                });
                adminMessage = `Manually restored ${xpAmount} XP to user ${userId}`;

            } else if (type === 'ADJUST_SUBSCRIPTION') {
                await tx.user.update({
                    where: { id: userId },
                    data: { subscriptionStatus: value } // ACTIVE, INACTIVE, PAST_DUE
                });
                adminMessage = `Manually adjusted subscription for user ${userId} to ${value}`;

            } else if (type === 'GRANT_BETA_ACCESS') {
                await tx.user.update({
                    where: { id: userId },
                    data: { betaCohort: value || 'PILOT_2024_01' }
                });
                adminMessage = `Granted Beta access (Cohort: ${value || 'PILOT_2024_01'}) to user ${userId}`;

            } else if (type === 'RESOLVE_DISPUTE_MANUAL') {
                adminMessage = `Manual dispute resolution logged for user ${userId}. Result: ${value}`;
            } else {
                throw new Error('Invalid override type');
            }

            // Append corrective event to chain
            await recordForensicEvent(tx, {
                traceId,
                userId,
                eventType: 'ADMIN_OVERRIDE',
                payload: {
                    adminId,
                    type,
                    value,
                    reason_code,
                    reason_text,
                    override_risk_level,
                    ipHash,
                    reference_id: originalTraceId, // Strongly link original trace
                    message: adminMessage
                }
            });

            broadcastAlert('warn', `ADMIN OVERRIDE: ${adminMessage}`, { adminId, reason, type });
            return { message: adminMessage };
        });

        res.status(200).json({ success: true, ...result });
    } catch (error) {
        console.error('Admin override error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
