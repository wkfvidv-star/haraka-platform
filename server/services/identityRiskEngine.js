import { adjustDeviceTrustScore } from './deviceService.js';
import prisma from '../prisma/client.js';

export const evaluateIdentityRisk = async (userId, ipAddress, deviceId, eventContext, traceId) => {
    let riskLevel = 'LOW';
    let reasons = [];
    let scoreReduction = 0;

    // 1. Check IP Change
    // In a real system, we'd check previous access logs. For now, assuming eventContext contains lastIp
    if (eventContext.lastIp && eventContext.lastIp !== ipAddress) {
        riskLevel = 'MEDIUM';
        reasons.push('IP address change detected');
        scoreReduction -= 20;
    }

    // 2. Excessive Refresh Attempts
    if (eventContext.isExcessiveRefresh) {
        riskLevel = 'MEDIUM';
        reasons.push('Excessive refresh attempts');
        scoreReduction -= 30;
    }

    // 3. Token Reuse is HIGH risk (Handled in TokenService, but we can evaluate it here before throwing)
    if (eventContext.isTokenReuse) {
        riskLevel = 'HIGH';
        reasons.push('Token reuse detected');
        scoreReduction -= 100; // Drop to 0
    }

    if (scoreReduction < 0 && deviceId) {
        await adjustDeviceTrustScore(deviceId, userId, scoreReduction, reasons.join(', '), traceId);
    }

    // Log the risk evaluation
    if (riskLevel !== 'LOW') {
        await prisma.eventLog.create({
            data: {
                traceId,
                userId,
                eventType: 'RISK_EVALUATION',
                payload: { riskLevel, reasons, ipAddress, deviceId },
                currentHash: 'PLACEHOLDER_HASH', // Assuming handled by an event log service normally
                serverSignature: 'TBD'
            }
        });
    }

    return { riskLevel, reasons };
};
