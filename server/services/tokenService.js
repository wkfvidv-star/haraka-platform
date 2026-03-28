import crypto from 'crypto';
import prisma from '../prisma/client.js';
import fs from 'fs';

const logDebug = (msg) => {
    fs.appendFileSync('/tmp/haraka_debug.log', `${new Date().toISOString()} ${msg}\n`);
};

export const generateRefreshToken = async (userId, familyId, deviceId) => {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiration

    const refreshToken = await prisma.refreshToken.create({
        data: {
            token: tokenHash,
            userId,
            familyId,
            deviceId,
            expiresAt,
            version: 1
        }
    });

    return { rawToken, refreshToken };
};

export const verifyAndRotateRefreshToken = async (rawOldToken, ipAddress) => {
    const oldTokenHash = crypto.createHash('sha256').update(rawOldToken).digest('hex');

    const result = await prisma.$transaction(async (tx) => {
        const oldToken = await tx.refreshToken.findUnique({
            where: { token: oldTokenHash },
            include: { user: true }
        });

        if (oldToken) {
            logDebug(`Found token ${oldTokenHash.substring(0, 10)}... isUsed: ${oldToken.isUsed}`);
        }

        if (!oldToken) {
            return { error: 'Invalid refresh token', status: 401 };
        }

        if (oldToken.expiresAt < new Date()) {
            return { error: 'Refresh token expired', status: 401 };
        }

        if (oldToken.isUsed) {
            // REUSE DETECTED: Family-wide Invalidation
            logDebug(`SECURITY: Token reuse detected for family: ${oldToken.familyId}. Revoking all...`);

            const updateResult = await tx.refreshToken.updateMany({
                where: { familyId: oldToken.familyId },
                data: { isUsed: true }
            });

            logDebug(`SECURITY: Revoked ${updateResult.count} tokens for family ${oldToken.familyId}`);

            await tx.user.update({
                where: { id: oldToken.userId },
                data: { tokenVersion: { increment: 1 } }
            });

            await tx.eventLog.create({
                data: {
                    traceId: crypto.randomUUID(),
                    userId: oldToken.userId,
                    eventType: 'TOKEN_REUSE_DETECTED',
                    payload: { familyId: oldToken.familyId, ipAddress },
                    currentHash: crypto.randomBytes(16).toString('hex'),
                    serverSignature: 'TBD'
                }
            });

            return { error: 'Token reuse detected. All sessions revoked.', status: 403 };
        }

        // Mark old token as used
        await tx.refreshToken.update({
            where: { id: oldToken.id },
            data: { isUsed: true }
        });

        // Generate new token in the same family
        const rawNewToken = crypto.randomBytes(32).toString('hex');
        const newTokenHash = crypto.createHash('sha256').update(rawNewToken).digest('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        const newRefreshToken = await tx.refreshToken.create({
            data: {
                token: newTokenHash,
                userId: oldToken.userId,
                familyId: oldToken.familyId,
                deviceId: oldToken.deviceId,
                expiresAt,
                version: oldToken.version + 1
            }
        });

        return { rawNewToken, user: oldToken.user, deviceId: oldToken.deviceId };
    }, {
        isolationLevel: 'Serializable' // Prevent race conditions
    });

    if (result.error) {
        const err = new Error(result.error);
        err.status = result.status;
        throw err;
    }

    return result;
};
