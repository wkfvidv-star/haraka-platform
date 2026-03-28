import axios from 'axios';
import crypto from 'crypto';
import prisma from '../prisma/client.js';

const API_URL = 'http://localhost:3001/api';
const VISION_SECRET = 'vision_shared_secret';

async function runPhase1Tests() {
    console.log('--- Phase 1: Session Authority & Security Tests ---');
    try {
        // Find or create a test user
        let user = await prisma.user.findFirst();
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: `test_${Date.now()}@example.com`,
                    password: 'hashedpassword',
                    role: 'STUDENT'
                }
            });
        }

        console.log(`[TEST 1] Initiating session for User: ${user.id}`);
        const startRes = await axios.post(`${API_URL}/session/start`, {
            userId: user.id
        });

        if (!startRes.data.success) throw new Error('Failed to start session');

        const { sessionToken, nonce, sessionId } = startRes.data;
        console.log(`✅ Session started successfully. Nonce generated: ${nonce}`);

        // TEST 2: Invalid Behavioral Anomaly (Impossible FPS)
        console.log('[TEST 2] Attempting to complete with ANOMALOUS PHYSICAL METRICS (FPS > 60)');
        try {
            await axios.post(`${API_URL}/session/complete`, {
                sessionToken,
                frameCount: 9000, // Impossible in 120s
                durationSeconds: 120
            });
            console.error('❌ Failed! API allowed biologically impossible physically metrics.');
            process.exit(1);
        } catch (err) {
            if (err.response && err.response.data.error && err.response.data.error.includes('ANOMALY REJECTION')) {
                console.log('✅ Correctly rejected IMPOSSIBLE physical metrics (Behavioral Sandbox Guardrail Active)');
            } else {
                console.log('❌ Unexpected error on anomaly test:', err?.response?.data || err.message);
                process.exit(1);
            }
        }

        // ------------------------------
        // [TEST 3] Valid Completion
        // ------------------------------
        console.log('[TEST 3] Generating sterile session for valid completion test...');
        const startRes3 = await axios.post(`${API_URL}/session/start`, { userId: user.id });
        const sessionToken3 = startRes3.data.sessionToken;

        console.log('Attempting VALID completion (Internal Node <-> Vision mTLS pipeline will process this)');
        const completeRes = await axios.post(`${API_URL}/session/complete`, {
            sessionToken: sessionToken3,
            frameCount: 1500, // 1500 / 120 = 12.5 fps (valid)
            durationSeconds: 120
        });

        if (completeRes.data.success) {
            console.log(`✅ Session completed via Zero-Trust Pipeline. Sever dictacted XP: ${completeRes.data.earnedXp}`);
        } else {
            console.error('❌ Valid completion failed:', completeRes.data);
            process.exit(1);
        }

        // ------------------------------
        // [TEST 4] Anti-Replay Attack
        // ------------------------------
        console.log('[TEST 4] Attempting ANTI-REPLAY attack (resending the exact same valid token)');
        try {
            await axios.post(`${API_URL}/session/complete`, {
                sessionToken: sessionToken3,
                frameCount: 1500,
                durationSeconds: 120
            });
            console.error('❌ Failed! Server allowed session replay.');
            process.exit(1);
        } catch (err) {
            if (err.response && (err.response.status === 400 || err.response.status === 429 || err.response.data.error.includes('already completed'))) {
                console.log(`✅ Correctly blocked replay attempt. Reason: ${err.response.data.error}`);
            } else {
                console.error('❌ Unexpected error on replay:', err.message);
            }
        }

        console.log('\n🌟 Phase 2 Zero-Trust Test Suite: 100% PASSED 🌟');
        process.exit(0);

    } catch (err) {
        console.error('❌ Unhandled Test Failure:', err?.response?.data || err.message);
        process.exit(1);
    }
}

runPhase1Tests();
