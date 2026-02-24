import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { logger } from '../utils/logger.js';
import prisma from '../prisma/client.js';

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(['ADMIN', 'STUDENT', 'PARENT', 'TEACHER', 'COACH', 'YOUTH']).optional(),
    firstName: z.string(),
    lastName: z.string(),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const register = async (req, res) => {
    try {
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
                }
            },
            include: {
                profile: true
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
        const { email, password } = loginSchema.parse(req.body);

        const user = await prisma.user.findUnique({
            where: { email },
            include: { profile: true }
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET || 'haraka_platform_2025_secure_key_change_me',
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        res.json({
            success: true,
            token,
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
