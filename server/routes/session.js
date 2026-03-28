import express from 'express';
import prisma from '../prisma/client.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import redisClient from '../utils/redisClient.js';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import { generateEventHash, signEvent, canonicalize, recordForensicEvent } from '../utils/forensic.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

// --- External Service URLs (from .env or defaults) ---
const VISION_SERVICE_URL = process.env.VISION_SERVICE_URL || 'http://localhost:3002';
const FRAUD_ENGINE_URL = process.env.FRAUD_ENGINE_URL || 'http://localhost:3003';
const VISION_PUBLIC_KEY = process.env.VISION_PUBLIC_KEY || 'MOCK_PUBLIC_KEY';

// mTLS Agent (Dummy for development)
const mtlsAgent = new https.Agent({
    rejectUnauthorized: false
});


router.post('/start', async (req, res) => {
    try {
        const { userId, exerciseId } = req.body;
        const traceId = crypto.randomUUID();
        const nonce = crypto.randomBytes(16).toString('hex');

        const lockKey = `session_start_lock_${userId}`;
        const lockAcquired = await redisClient.set(lockKey, 'locking', 'EX', 10, 'NX');
        if (!lockAcquired) {
            return res.status(400).json({ success: false, error: 'Session start already in progress.' });
        }

        try {
            const result = await prisma.$transaction(async (tx) => {
                const existingSession = await tx.trainingSession.findFirst({
                    where: {
                        userId,
                        status: 'PENDING',
                        expiresAt: { gt: new Date() }
                    }
                });

                if (existingSession) {
                    const err = new Error('Active session already exists. Please complete or wait for expiry.');
                    err.status = 400;
                    throw err;
                }

                // --- Phase 9: Start-time Subscription Validation ---
                const user = await tx.user.findUnique({ where: { id: userId } });
                if (user.subscriptionStatus !== 'ACTIVE' && user.role !== 'ADMIN') {
                    const err = new Error('Active subscription required to start session.');
                    err.status = 403;
                    throw err;
                }

                let exercise = exerciseId;
                if (!exercise) {
                    const exercises = await tx.exercise.findMany({ take: 1 });
                    if (exercises.length > 0) exercise = exercises[0].id;
                    else throw new Error('No exercises available');
                }

                const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

                const session = await tx.trainingSession.create({
                    data: {
                        userId,
                        exerciseId: exercise,
                        durationSeconds: 0,
                        status: 'PENDING',
                        nonce,
                        expiresAt
                    }
                });

                // Record Genesis Event for this specific Trace
                await recordForensicEvent(tx, {
                    traceId,
                    userId,
                    eventType: 'SESSION_START',
                    payload: { sessionId: session.id, exerciseId: exercise, nonce }
                });

                const sessionToken = jwt.sign(
                    { sessionId: session.id, nonce, traceId },
                    process.env.SESSION_SECRET || 'haraka_session_secret_change_me',
                    { expiresIn: '15m' }
                );

                return { sessionId: session.id, sessionToken, nonce, traceId };
            });

            res.status(201).json({ success: true, ...result });
        } finally {
            await redisClient.del(lockKey);
        }
    } catch (error) {
        console.error('Session start error:', error);
        res.status(error.status || 500).json({ success: false, error: error.message });
    }
});

router.post('/complete', async (req, res) => {
    try {
        const { sessionToken, frameCount, durationSeconds } = req.body;
        if (!sessionToken || !frameCount || !durationSeconds) {
            return res.status(400).json({ success: false, error: 'Missing metrics or tokens' });
        }

        const decodedToken = jwt.verify(sessionToken, process.env.SESSION_SECRET || 'haraka_session_secret_change_me');
        const { sessionId, traceId, nonce: originalNonce } = decodedToken;

        // Anti-Replay: Lock this specific Nonce/Session for 20 mins
        const lockAcquired = await redisClient.set(`replay_lock_${originalNonce}`, 'used', 'EX', 1200, 'NX');
        if (!lockAcquired) {
            const err = new Error('Security Breach: Token Replay Detected.');
            err.status = 403;
            throw err;
        }

        const result = await prisma.$transaction(async (tx) => {
            const session = await tx.trainingSession.findUnique({
                where: { id: sessionId },
                include: { user: true }
            });

            if (!session || session.status !== 'PENDING') {
                const err = new Error('Invalid session state');
                err.status = 403;
                throw err;
            }
            if (new Date() > new Date(session.expiresAt)) {
                const err = new Error('Session expired');
                err.status = 403;
                throw err;
            }

            // --- Phase 9: Completion-time Double Validation ---
            // Re-fetch user to get latest subscription status (anti-timing attack)
            if (session.user.subscriptionStatus !== 'ACTIVE' && session.user.role !== 'ADMIN') {
                const err = new Error('Subscription changed or expired mid-session. XP allocation blocked.');
                err.status = 403;
                throw err;
            }

            // --- 1. AUDIT: METRICS RECEIVED ---
            await recordForensicEvent(tx, {
                traceId,
                userId: session.userId,
                eventType: 'METRICS_RECEIVED',
                payload: { frameCount, durationSeconds }
            });

            // --- 1.1 SAFETY BASELINE: Physical Sanity Check ---
            // Max theoretical frames per second for consumer cameras is usually 60-120.
            // If someone sends 1000 frames for a 1 second session, it's a forgery.
            const fps = frameCount / Math.max(durationSeconds, 1);
            if (fps > 240) { // Extremely generous cap
                throw new Error('Fraud Engine Rejection: Physically impossible motion data (FPS too high).');
            }
            if (durationSeconds < 1 && frameCount > 10) {
                throw new Error('Fraud Engine Rejection: Physically impossible motion data (Too many frames in <1s).');
            }

            // --- 2. VISION AUTHENTICATED SENSOR VALIDATION ---
            let visionResponse;
            try {
                visionResponse = await axios.post(`${VISION_SERVICE_URL}/analyze`, {
                    traceId, sessionId, durationSeconds, frameCount, nonce: originalNonce
                }, { httpsAgent: mtlsAgent });
            } catch (err) {
                // Architectural Fallback if vision service is offline (Development Only)
                if (err.code === 'ECONNREFUSED' || err.response?.status === 502) {
                    // Mock signature for demo purposes IF the vision service is not running
                    // In absolute prod, we would throw here.
                    visionResponse = {
                        data: {
                            traceId, sessionId, nonce: originalNonce, frameCount, durationSeconds, motionScore: 85,
                            timestamp: Math.floor(Date.now() / 1000), expiryWindow: 10, signature: 'mock'
                        }
                    };
                } else throw err;
            }

            const visionData = visionResponse.data;
            if (visionData.signature !== 'mock') {
                // RSA-PSS Verification
                const payloadToVerify = canonicalize({
                    traceId, sessionId, nonce: originalNonce, frameCount, durationSeconds,
                    motionScore: visionData.motionScore, timestamp: visionData.timestamp, expiryWindow: visionData.expiryWindow
                });
                const isVerified = crypto.verify(
                    "sha256", Buffer.from(payloadToVerify),
                    { key: VISION_PUBLIC_KEY, padding: crypto.constants.RSA_PKCS1_PSS_PADDING, saltLength: crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN },
                    Buffer.from(visionData.signature, "base64")
                );
                if (!isVerified) throw new Error("Vision Signature Forgery Detected.");

                // Check Expiry Window (10s lock)
                if (Math.abs(Math.floor(Date.now() / 1000) - visionData.timestamp) > visionData.expiryWindow) {
                    throw new Error("Vision Payload Expired (Anti-Delay Check failed).");
                }
            }

            // --- 3. STATELESS FRAUD ENGINE VERIFICATION (Z-Score) ---
            let fraudResponse;
            try {
                fraudResponse = await axios.post(`${FRAUD_ENGINE_URL}/evaluate`, {
                    traceId, userId: session.userId, sessionId, frameCount, durationSeconds, motionScore: visionData.motionScore
                });
            } catch (err) {
                console.warn("Fraud engine unreachable, falling back to basic checks");
                fraudResponse = { data: { verdict: "ACCEPT", reason: "Fallback", zScore: 0 } };
            }

            const fraud = fraudResponse.data;

            // --- 4. AUDIT: FRAUD VERDICT ---
            await recordForensicEvent(tx, {
                traceId,
                userId: session.userId,
                eventType: 'FRAUD_VERDICT',
                payload: { verdict: fraud.verdict, zScore: fraud.zScore, reason: fraud.reason }
            });

            if (fraud.verdict === "REJECT") throw new Error(`Fraud Engine Rejection: ${fraud.reason}`);

            // --- 5. PROGRESSION & XP COMMIT ---
            const baseXP = 50;
            const earnedXp = Math.floor(baseXP * (visionData.motionScore / 100));

            await tx.trainingSession.update({
                where: { id: sessionId },
                data: { status: 'COMPLETED', motionScore: visionData.motionScore }
            });

            const newTotalXp = session.user.xp + earnedXp;
            const newLevel = Math.floor(newTotalXp / 100) + 1;

            await tx.user.update({
                where: { id: session.userId },
                data: { xp: newTotalXp, level: newLevel }
            });

            // Update daily activity
            const todayDate = new Date();
            todayDate.setHours(0, 0, 0, 0);

            await tx.dailyActivity.upsert({
                where: { userId_date: { userId: session.userId, date: todayDate } },
                update: { activeMinutes: { increment: Math.floor(durationSeconds / 60) } },
                create: { userId: session.userId, date: todayDate, activeMinutes: Math.floor(durationSeconds / 60) }
            });

            // AUDIT: XP COMMITTED
            await recordForensicEvent(tx, {
                traceId,
                userId: session.userId,
                eventType: 'XP_COMMITTED',
                payload: { earnedXp, newLevel, newTotalXp }
            });

            return { earnedXp, newLevel, newTotalXp, verdict: fraud.verdict, zScore: fraud.zScore };
        });

        res.status(200).json({ success: true, ...result });
    } catch (error) {
        console.error('Session complete error deep trace:', error);
        res.status(error.status || 500).json({ success: false, error: error.message });
    }
});

// @route   GET /api/session/forensic-log
// @desc    Retrieve the Event-Sourced Audit Ledger for Admin Forensic Dashboard
// @access  Private (Admin Role only in Prod)
router.get('/forensic-log', async (req, res) => {
    try {
        const events = await prisma.eventLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50,
            include: { user: true }
        });
        res.status(200).json({ success: true, events });
    } catch (error) {
        console.error('Forensic log retrieval error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch forensic audit log' });
    }
});

export default router;
