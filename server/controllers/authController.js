import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import crypto from 'crypto';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { logger } from '../utils/logger.js';
import prisma from '../prisma/client.js';
import { generateRefreshToken, verifyAndRotateRefreshToken } from '../services/tokenService.js';
import { registerOrGetDevice } from '../services/deviceService.js';
import { evaluateIdentityRisk } from '../services/identityRiskEngine.js';

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(['ADMIN', 'STUDENT', 'PARENT', 'TEACHER', 'COACH', 'YOUTH', 'PRINCIPAL', 'DIRECTORATE', 'MINISTRY']).optional(),
    firstName: z.string(),
    lastName: z.string(),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
    mfaToken: z.string().optional(),
});

export const register = async (req, res) => {
    try {
        // Normalize role to uppercase to match schema enum
        if (req.body.role) {
            req.body.role = req.body.role.toUpperCase();
        }

        const { email, password, role, firstName, lastName } = registerSchema.parse(req.body);

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ success: false, error: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        // Create User, Profile and Student/Parent/Coach record in a transaction
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: role || 'STUDENT',
                profile: {
                    create: {
                        firstName,
                        lastName,
                    }
                },
                // Create role-specific record
                ...(role === 'STUDENT' ? { student: { create: { gradeLevel: 'N/A' } } } : {}),
                ...(role === 'COACH' ? { coach: { create: { specialization: 'General' } } } : {}),
                ...(role === 'PARENT' ? { parent: { create: {} } } : {}),
            },
            include: {
                profile: true,
                student: true,
                coach: true,
                parent: true
            }
        });

        logger.info('User registered', { userId: user.id });
        res.status(201).json({ success: true, userId: user.id });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ success: false, error: error.errors });
        }
        logger.error('Registration error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password, mfaToken } = loginSchema.parse(req.body);

        const user = await prisma.user.findUnique({
            where: { email },
            include: { profile: true }
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // Phase 9: Admin MFA Enforcement
        if (user.role === 'ADMIN') {
            if (!user.mfaEnabled) {
                // Return a special token that only allows access to MFA setup
                const tempToken = jwt.sign(
                    { userId: user.id, role: user.role, mfaSetupPending: true },
                    process.env.JWT_SECRET || 'haraka_platform_2025_secure_key_change_me',
                    { expiresIn: '15m' }
                );
                return res.status(403).json({
                    success: false,
                    error: 'MFA Setup Required.',
                    requiresMfaSetup: true,
                    tempToken
                });
            }

            if (!mfaToken) {
                return res.status(401).json({ success: false, error: 'MFA token required' });
            }

            const isValidMfa = authenticator.verify({ token: mfaToken, secret: user.mfaSecret });
            if (!isValidMfa) {
                return res.status(401).json({ success: false, error: 'Invalid MFA token' });
            }
        }

        const userAgent = req.headers['user-agent'] || 'Unknown Device';
        const ipAddress = req.ip || req.connection.remoteAddress;

        const device = await registerOrGetDevice(user.id, userAgent, ipAddress);
        const familyId = crypto.randomUUID();
        const { rawToken: refreshToken } = await generateRefreshToken(user.id, familyId, device.id);

        const token = jwt.sign(
            {
                userId: user.id,
                role: user.role,
                tokenVersion: user.tokenVersion // Included for middleware check
            },
            process.env.JWT_SECRET || 'haraka_platform_2025_secure_key_change_me',
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        res.json({
            success: true,
            token,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                digitalId: user.digitalId,
                xp: user.xp,
                level: user.level,
                playCoins: user.playCoins,
                firstName: user.profile?.firstName,
                lastName: user.profile?.lastName,
            }
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ success: false, error: error.errors });
        }
        logger.error('Login error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

export const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ success: false, error: 'Refresh token required' });
        }

        const ipAddress = req.ip || req.connection.remoteAddress;

        let rotatedData;
        try {
            rotatedData = await verifyAndRotateRefreshToken(refreshToken, ipAddress);
        } catch (error) {
            // TokenService throws an error if reuse is detected or token is invalid
            logger.warn('Refresh Token Error:', { message: error.message, ip: ipAddress });

            // Log highly suspicious reuse error
            if (error.message.includes('Token reuse detected')) {
                // Here we might optionally trigger further alerts to security team
            }

            return res.status(401).json({ success: false, error: error.message });
        }

        const { rawNewToken, user, deviceId } = rotatedData;

        // Evaluate risk for the refresh
        const { riskLevel, reasons } = await evaluateIdentityRisk(
            user.id,
            ipAddress,
            deviceId,
            {}, // Empty context for now, could include past IPs
            crypto.randomUUID()
        );

        if (riskLevel === 'HIGH') {
            logger.warn('High risk refresh attempt', { userId: user.id, reasons });
            // For now, depending on strictness, we might deny it. Let's allow but log, as Soft Trust dictates
            // To be strictly secure, we could block it if we wanted.
        }

        // Generate new Access JWT
        const newAccessToken = jwt.sign(
            {
                userId: user.id,
                role: user.role,
                tokenVersion: user.tokenVersion // MUST use the latest version!
            },
            process.env.JWT_SECRET || 'haraka_platform_2025_secure_key_change_me',
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        res.json({
            success: true,
            token: newAccessToken,
            refreshToken: rawNewToken
        });

    } catch (error) {
        logger.error('Refresh token error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

export const setupMfa = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.userId } });

        if (user.mfaEnabled) {
            return res.status(400).json({ success: false, error: 'MFA is already enabled' });
        }

        const secret = authenticator.generateSecret();
        const otpauthContent = authenticator.keyuri(user.email, 'Haraka Platform', secret);

        // Store secret temporarily
        await prisma.user.update({
            where: { id: user.id },
            data: { mfaSecret: secret }
        });

        const qrCodeDataUrl = await QRCode.toDataURL(otpauthContent);

        res.status(200).json({
            success: true,
            secret,
            qrCode: qrCodeDataUrl
        });
    } catch (error) {
        logger.error('MFA setup error:', error);
        res.status(500).json({ success: false, error: 'Failed to setup MFA' });
    }
};

export const verifyMfaSetup = async (req, res) => {
    try {
        const { token } = req.body;
        const user = await prisma.user.findUnique({ where: { id: req.user.userId } });

        if (!user.mfaSecret) {
            return res.status(400).json({ success: false, error: 'No MFA setup initiated' });
        }

        const isValid = authenticator.verify({ token, secret: user.mfaSecret });

        if (!isValid) {
            return res.status(400).json({ success: false, error: 'Invalid token' });
        }

        await prisma.user.update({
            where: { id: user.id },
            data: { mfaEnabled: true }
        });

        // Now issue a real login token
        const userAgent = req.headers['user-agent'] || 'Unknown Device';
        const ipAddress = req.ip || req.connection.remoteAddress;

        const device = await registerOrGetDevice(user.id, userAgent, ipAddress);
        const familyId = crypto.randomUUID();
        const { rawToken: refreshToken } = await generateRefreshToken(user.id, familyId, device.id);

        const accessToken = jwt.sign(
            {
                userId: user.id,
                role: user.role,
                tokenVersion: user.tokenVersion
            },
            process.env.JWT_SECRET || 'haraka_platform_2025_secure_key_change_me',
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        res.status(200).json({
            success: true,
            message: 'MFA enabled successfully',
            token: accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            }
        });
    } catch (error) {
        logger.error('MFA verify error:', error);
        res.status(500).json({ success: false, error: 'Failed to verify MFA token' });
    }
};
