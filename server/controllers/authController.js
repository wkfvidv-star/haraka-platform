import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { logger } from '../utils/logger.js';

// In-memory user store for Demo mode
const MOCK_USERS = [
    {
        id: '1',
        email: 'student@demo.com',
        // password: demo123 (hashed)
        password: await bcrypt.hash('demo123', 12),
        role: 'STUDENT'
    },
    {
        id: '2',
        email: 'coach@demo.com',
        password: await bcrypt.hash('demo123', 12),
        role: 'COACH'
    }
];

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(['ADMIN', 'STUDENT', 'PARENT', 'TEACHER', 'COACH']).optional(),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const register = async (req, res) => {
    try {
        const { email, password, role } = registerSchema.parse(req.body);

        const existingUser = MOCK_USERS.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({ success: false, error: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = {
            id: Math.random().toString(36).substr(2, 9),
            email,
            password: hashedPassword,
            role: role || 'STUDENT'
        };

        MOCK_USERS.push(newUser);

        logger.info('User registered (Demo)', { userId: newUser.id });
        res.status(201).json({ success: true, userId: newUser.id });
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

        const user = MOCK_USERS.find(u => u.email === email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET || 'demo-secret-key',
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );

        const refreshToken = jwt.sign(
            { userId: user.id },
            process.env.JWT_REFRESH_SECRET || 'demo-refresh-secret',
            { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
        );

        res.json({ success: true, token, refreshToken });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ success: false, error: error.errors });
        }
        logger.error('Login error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
