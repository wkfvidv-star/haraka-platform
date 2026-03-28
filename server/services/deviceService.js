import crypto from 'crypto';
import prisma from '../prisma/client.js';

const MAX_TRUST_SCORE = 100;
const MIN_TRUST_SCORE = 0;

export const registerOrGetDevice = async (userId, userAgent, ipAddress) => {
    // Determine a unique identifier for the device (in a real app, from a client-side fingerprint)
    // Here we use a hash of the user agent as a basic example
    const rawDeviceId = crypto.createHash('sha256').update(`${userId}-${userAgent}`).digest('hex');

    let device = await prisma.userDevice.findFirst({
        where: { userId, deviceHash: rawDeviceId }
    });

    if (!device) {
        device = await prisma.userDevice.create({
            data: {
                userId,
                deviceHash: rawDeviceId,
                deviceName: userAgent,
                trustScore: 30, // Initial trust score
            }
        });

        // Log device registration
        await prisma.eventLog.create({
            data: {
                traceId: crypto.randomUUID(),
                userId,
                eventType: 'DEVICE_REGISTERED',
                payload: { deviceId: device.id, userAgent, ipAddress },
                currentHash: crypto.randomBytes(16).toString('hex'), // Placeholder
                serverSignature: 'TBD'
            }
        });
    } else {
        // Update last login
        device = await prisma.userDevice.update({
            where: { id: device.id },
            data: { lastLogin: new Date() }
        });
    }

    return device;
};

export const adjustDeviceTrustScore = async (deviceId, userId, delta, reason, traceId) => {
    const device = await prisma.userDevice.findUnique({ where: { id: deviceId } });
    if (!device) return;

    let newScore = device.trustScore + delta;
    newScore = Math.max(MIN_TRUST_SCORE, Math.min(newScore, MAX_TRUST_SCORE));

    await prisma.userDevice.update({
        where: { id: deviceId },
        data: { trustScore: newScore }
    });

    if (delta < 0) {
        await prisma.eventLog.create({
            data: {
                traceId: traceId || crypto.randomUUID(),
                userId,
                eventType: 'DEVICE_TRUST_DECREASED',
                payload: { deviceId, reason, oldScore: device.trustScore, newScore },
                currentHash: crypto.randomBytes(16).toString('hex'),
                serverSignature: 'TBD'
            }
        });
    }
};
