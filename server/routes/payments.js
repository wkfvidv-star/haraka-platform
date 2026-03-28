import express from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../prisma/client.js';
import { authenticate } from '../middleware/auth.js';
import { recordForensicEvent } from '../utils/forensic.js';
import { createCheckoutSession, constructWebhookEvent } from '../services/stripeService.js';
import crypto from 'crypto';
import { broadcastAlert, checkAnomaly } from '../utils/alertService.js';

const router = express.Router();

// @route   POST /api/payments/checkout
// @desc    Create a real Stripe checkout session
// @access  Private
router.post(
    '/checkout',
    authenticate,
    [
        body('planId').isString().notEmpty()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, errors: errors.array() });
            }

            const { planId } = req.body;
            const userId = req.user.id;
            const email = req.user.email;
            const traceId = crypto.randomUUID();

            // Verify plan exists
            const plan = await prisma.plan.findUnique({ where: { id: planId } });
            if (!plan) {
                return res.status(404).json({ success: false, error: 'Plan not found' });
            }

            if (!plan.stripePriceId) {
                return res.status(400).json({ success: false, error: 'Plan is not configured for Stripe' });
            }

            // Record Intent in Forensic Log
            await prisma.$transaction(async (tx) => {
                await recordForensicEvent(tx, {
                    traceId,
                    userId,
                    eventType: 'PAYMENT_INTENT_CREATED',
                    payload: { planId, priceId: plan.stripePriceId }
                });
            });

            const session = await createCheckoutSession({
                userId,
                userEmail: email,
                planId,
                priceId: plan.stripePriceId,
                successUrl: process.env.STRIPE_SUCCESS_URL,
                cancelUrl: process.env.STRIPE_CANCEL_URL
            });

            res.status(200).json({
                success: true,
                sessionId: session.id,
                url: session.url
            });
        } catch (error) {
            console.error('Checkout error:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    }
);

// @route   POST /api/payments/webhook
// @desc    Stripe Webhook receptor with forensic signing
// @access  Public (Signature Verified)
router.post('/webhook', async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = await constructWebhookEvent(req.rawBody, sig);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const stripeEventId = event.id;
    const traceId = crypto.randomUUID();

    try {
        // --- 1. IDEMPOTENCY CHECK ---
        const existingEvent = await prisma.eventLog.findFirst({
            where: {
                payload: {
                    path: ['stripeEventId'],
                    equals: stripeEventId
                }
            }
        });

        if (existingEvent) {
            console.log(`[PAYMENT] Duplicate webhook received: ${stripeEventId}. Skipping.`);
            return res.status(200).json({ received: true, duplicate: true });
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const { userId, planId } = session.metadata;

            await prisma.$transaction(async (tx) => {
                // Update User Subscription
                await tx.user.update({
                    where: { id: userId },
                    data: { subscriptionStatus: 'ACTIVE' }
                });

                // Upsert Subscription Record
                await tx.subscription.upsert({
                    where: { id: userId + '_' + planId },
                    update: {
                        status: 'ACTIVE',
                        stripeSubId: session.subscription,
                        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    },
                    create: {
                        userId,
                        planId,
                        status: 'ACTIVE',
                        stripeSubId: session.subscription
                    }
                });

                // Record Forensic Evidence
                await recordForensicEvent(tx, {
                    traceId,
                    userId,
                    eventType: 'PAYMENT_COMPLETED',
                    payload: {
                        stripeEventId,
                        checkoutSessionId: session.id,
                        subscriptionId: session.subscription,
                        planId
                    }
                });
            });
            console.log(`[PAYMENT] Subscription activated for user ${userId}`);

        } else if (event.type === 'charge.refunded' || event.type === 'charge.dispute.created') {
            const charge = event.data.object;
            const stripeSessionId = charge.payment_intent; // Often linked or stored in metadata in real scenarios

            await prisma.$transaction(async (tx) => {
                // Find the user linked to this charge (this assumes we stored it or can find it)
                // For the pilot, we'll try to find the event that created this payment
                const originalEvent = await tx.eventLog.findFirst({
                    where: {
                        eventType: 'PAYMENT_COMPLETED',
                        payload: {
                            path: ['checkoutSessionId'],
                            equals: charge.payment_intent // Simplified for pilot
                        }
                    }
                });

                if (originalEvent) {
                    const userId = originalEvent.userId;

                    // 1. Freeze Features
                    await tx.user.update({
                        where: { id: userId },
                        data: { subscriptionStatus: event.type === 'charge.refunded' ? 'INACTIVE' : 'PAST_DUE' }
                    });

                    // 2. XP ROLLBACK (Transactional & Traceable)
                    // Find XP awarded since the payment
                    const xpEvents = await tx.eventLog.findMany({
                        where: {
                            userId,
                            eventType: 'XP_COMMITTED',
                            createdAt: { gte: originalEvent.createdAt }
                        }
                    });

                    let totalXpToRollback = 0;
                    xpEvents.forEach(e => {
                        totalXpToRollback += (e.payload.earnedXp || 0);
                    });

                    if (totalXpToRollback > 0) {
                        const user = await tx.user.findUnique({ where: { id: userId } });
                        const newXp = Math.max(0, user.xp - totalXpToRollback);
                        const newLevel = Math.floor(newXp / 100) + 1;

                        await tx.user.update({
                            where: { id: userId },
                            data: { xp: newXp, level: newLevel }
                        });

                        broadcastAlert('warn', `XP ROLLBACK: User ${userId} refunded. Reverting ${totalXpToRollback} XP.`, { userId, totalXpToRollback });
                    }

                    // 3. Record Corrective Event (Append-Only)
                    await recordForensicEvent(tx, {
                        traceId,
                        userId,
                        eventType: event.type === 'charge.refunded' ? 'PAYMENT_REFUNDED' : 'PAYMENT_DISPUTED',
                        payload: {
                            stripeEventId,
                            originalTraceId: originalEvent.traceId,
                            xpReverted: totalXpToRollback,
                            reason: 'Automated Integrity Enforcement'
                        }
                    });
                }
            });
        } else if (event.type === 'customer.subscription.deleted' || event.type === 'customer.subscription.updated') {
            // Handle cancellation/past_due states
            const subscription = event.data.object;
            const userId = subscription.metadata.userId;
            if (userId) {
                const newStatus = subscription.status === 'active' ? 'ACTIVE' : 'INACTIVE';
                await prisma.user.update({
                    where: { id: userId },
                    data: { subscriptionStatus: newStatus }
                });

                await recordForensicEvent(prisma, {
                    traceId, userId,
                    eventType: 'SUBSCRIPTION_STATE_CHANGED',
                    payload: { stripeEventId, status: subscription.status }
                });
            }
        }

        res.status(200).json({ received: true });
    } catch (error) {
        broadcastAlert('error', `Webhook processing failure: ${error.message}`, { stripeEventId, traceId });
        console.error('Webhook processing error:', error);
        res.status(500).json({ success: false, error: 'Internal processing error' });
    }
});

// @route   GET /api/payments/plans
// @desc    Get all available plans
// @access  Public
router.get('/plans', async (req, res) => {
    try {
        const plans = await prisma.plan.findMany();
        res.status(200).json({ success: true, data: plans });
    } catch (error) {
        console.error('Fetch plans error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

export default router;
