import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger.js';
import prisma from '../prisma/client.js';

export const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'haraka_platform_2025_secure_key_change_me');

        // Strict Integrity Layer Constraint: Check DB tokenVersion
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { tokenVersion: true, role: true, id: true, isActive: true, subscriptionStatus: true, email: true, betaCohort: true }
        });

        if (!user || !user.isActive) {
            return res.status(401).json({ success: false, error: 'User not found or inactive' });
        }

        if (user.tokenVersion !== decoded.tokenVersion) {
            logger.warn('Token version mismatch (Revoked)', { userId: user.id, ip: req.ip });
            return res.status(401).json({ success: false, error: 'Session revoked (token version mismatch)' });
        }

        req.user = user;
        // logger.debug('User authenticated', { userId: user.id, subscriptionStatus: user.subscriptionStatus });
        next();
    } catch (error) {
        logger.warn('Invalid token', { ip: req.ip, error: error.message });
        return res.status(403).json({ success: false, error: 'Invalid or expired token' });
    }
};

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, error: 'Forbidden' });
        }
        next();
    };
};

/**
 * Middleware to check specific permission scopes for granular access.
 */
export const authorizeScope = (requiredScope) => {
    return (req, res, next) => {
        if (req.user.role === 'ADMIN' && req.user.permissions?.includes(requiredScope)) {
            return next();
        }
        logger.warn('Scope authorization failed', { userId: req.user.id, requiredScope, ip: req.ip });
        return res.status(403).json({ success: false, error: 'Forbidden: Missing required scope' });
    };
};

/**
 * Middleware to require MFA for sensitive endpoints.
 */
export const requireMfa = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    if (req.user.role === 'ADMIN' && !req.user.mfaEnabled) {
        logger.warn('MFA required but not enabled', { userId: req.user.id, ip: req.ip });
        return res.status(403).json({
            success: false,
            error: 'MFA setup is mandatory for this action.',
            code: 'MFA_REQUIRED'
        });
    }
    next();
};

/**
 * Middleware to restrict access based on subscription status.
 */
export const billingGuard = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    logger.info('Billing Guard Check', {
        userId: req.user.id,
        status: req.user.subscriptionStatus,
        role: req.user.role
    });

    if (req.user.subscriptionStatus !== 'ACTIVE' && req.user.role !== 'ADMIN') {
        return res.status(403).json({
            success: false,
            error: 'Premium subscription required',
            code: 'SUBSCRIPTION_REQUIRED'
        });
    }

    next();
};

/**
 * Phase 9: Restricted access to pilot users.
 */
export const closedBetaGuard = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    // Admins and users with a valid cohort tag are allowed
    if (req.user.role !== 'ADMIN' && !req.user.betaCohort) {
        return res.status(403).json({
            success: false,
            error: 'Access restricted to Closed Beta Pilot users only.',
            code: 'PILOT_ACCESS_RESTRICTED'
        });
    }

    next();
};
