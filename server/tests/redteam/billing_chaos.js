import axios from 'axios';
import crypto from 'crypto';

const API_BASE = 'http://localhost:3001/api';

async function runBillingChaos() {
    console.log("🔥 STARTING BILLING CHAOS SIMULATION 🔥\n");

    try {
        // 1. Setup Pilot User
        const studentEmail = `pilot_${Date.now()}@haraka.com`;
        const regRes = await axios.post(`${API_BASE}/auth/register`, {
            email: studentEmail,
            password: 'Password123!',
            firstName: 'Pilot',
            lastName: 'User'
        });
        const userId = regRes.data.userId;

        // LOGIN AS THE PILOT USER
        const loginRes = await axios.post(`${API_BASE}/auth/login`, {
            email: studentEmail,
            password: 'Password123!'
        });
        const studentTokenActual = loginRes.data.token;

        // AUTH AS ADMIN (for setup)
        const adminRes = await axios.post(`${API_BASE}/auth/login`, {
            email: 'ahmed@haraka.com',
            password: 'Password123!'
        });
        const adminToken = adminRes.data.token;

        // Assign to Pilot Cohort & Grant Subscription
        await axios.post(`${API_BASE}/admin/override`, {
            type: 'GRANT_BETA_ACCESS',
            userId,
            value: 'PILOT_CHAOS_TEST',
            reason: 'Enabling Pilot Access for testing',
        }, { headers: { Authorization: `Bearer ${adminToken}` } });

        await axios.post(`${API_BASE}/admin/override`, {
            type: 'ADJUST_SUBSCRIPTION',
            userId,
            value: 'ACTIVE',
            reason: 'Pre-verifying subscription for test session',
        }, { headers: { Authorization: `Bearer ${adminToken}` } });

        console.log("✅ Pilot user setup complete (Active + Beta Cohort).");

        // 2. IDEMPOTENCY TEST
        console.log("\n--- Testing Webhook Idempotency ---");
        const eventId = `evt_${crypto.randomBytes(8).toString('hex')}`;
        const webhookPayload = {
            id: eventId,
            type: 'checkout.session.completed',
            data: {
                object: {
                    id: 'cs_test_chaos_123',
                    metadata: { userId, planId: 'PRO_PLAN' },
                    subscription: 'sub_chaos_123'
                }
            }
        };

        const w1 = await axios.post(`${API_BASE}/payments/webhook`, webhookPayload, {
            headers: { 'stripe-signature': 'mock' }
        });
        console.log(`First delivery: ${w1.status} - duplicate: ${w1.data.duplicate}`);

        const w2 = await axios.post(`${API_BASE}/payments/webhook`, webhookPayload, {
            headers: { 'stripe-signature': 'mock' }
        });
        console.log(`Second delivery: ${w2.status} - duplicate: ${w2.data.duplicate}`);

        if (w2.data.duplicate) console.log("✅ Idempotency Verified.");
        else console.log("❌ Idempotency FAILED.");

        // 3. XP ROLLBACK TEST
        console.log("\n--- Testing XP Rollback (Refund) ---");
        // Start and complete a session to earn XP
        const sStart = await axios.post(`${API_BASE}/session/start`, { userId }, { headers: { Authorization: `Bearer ${studentTokenActual}` } });
        const sessionToken = sStart.data.sessionToken;

        await axios.post(`${API_BASE}/session/complete`, {
            sessionToken, frameCount: 100, durationSeconds: 20
        }, { headers: { Authorization: `Bearer ${studentTokenActual}` } });

        const uBefore = await axios.get(`${API_BASE}/profile/${userId}`, { headers: { Authorization: `Bearer ${studentTokenActual}` } });
        console.log(`XP Before Refund: ${uBefore.data.user.xp}`);

        // Simulate Refund Webhook
        await axios.post(`${API_BASE}/payments/webhook`, {
            id: `evt_refund_${Date.now()}`,
            type: 'charge.refunded',
            data: {
                object: {
                    payment_intent: 'cs_test_chaos_123'
                }
            }
        }, { headers: { 'stripe-signature': 'mock' } });

        const uAfter = await axios.get(`${API_BASE}/profile`, { headers: { Authorization: `Bearer ${studentTokenActual}` } });
        console.log(`XP After Refund: ${uAfter.data.user.xp}`);
        console.log(`Status After Refund: ${uAfter.data.user.subscriptionStatus}`);

        if (uAfter.data.user.xp < uBefore.data.user.xp && uAfter.data.user.subscriptionStatus === 'INACTIVE') {
            console.log("✅ XP Rollback & Transition Verified.");
        } else {
            console.log("❌ Rollback FAILED.");
        }

        // 4. MID-SESSION CANCELLATION (Double Validation Test)
        console.log("\n--- Testing Mid-Session Cancellation ---");
        // Re-activate user
        await axios.post(`${API_BASE}/admin/override`, {
            type: 'ADJUST_SUBSCRIPTION', userId, value: 'ACTIVE', reason: 'Re-activating for test'
        }, { headers: { Authorization: `Bearer ${adminToken}` } });

        // Start session
        const sStart2 = await axios.post(`${API_BASE}/session/start`, { userId }, { headers: { Authorization: `Bearer ${studentTokenActual}` } });
        const sessionToken2 = sStart2.data.sessionToken;

        // Cancel subscription while session is active
        await axios.post(`${API_BASE}/payments/webhook`, {
            id: `evt_cancel_${Date.now()}`,
            type: 'customer.subscription.deleted',
            data: {
                object: {
                    status: 'canceled',
                    metadata: { userId }
                }
            }
        }, { headers: { 'stripe-signature': 'mock' } });

        // Try to complete session
        try {
            await axios.post(`${API_BASE}/session/complete`, {
                sessionToken: sessionToken2, frameCount: 100, durationSeconds: 20
            }, { headers: { Authorization: `Bearer ${studentTokenActual}` } });
            console.log("❌ Error: Session completion should have been blocked!");
        } catch (e) {
            console.log(`✅ Session completion correctly blocked: ${e.response?.data?.error || e.message}`);
        }

    } catch (error) {
        console.error("Simulation Error:", error.response?.data || error.message);
    }
}

runBillingChaos();
