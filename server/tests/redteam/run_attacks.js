// server/tests/redteam/run_attacks.js
// Framework for the Haraka Full Trust Stress Test
import axios from 'axios';
import crypto from 'crypto';

// Target the local running instance
const API_BASE = 'http://localhost:3001/api';

// State to carry between tests
let state = {
    studentJwt: null,
    studentRefreshToken: null,
    studentId: null,
    studentEmail: null,
    studentPassword: null,
    deviceId: 'redteam-device-test',

    // Coach state (if needed for later privilege escalation tests)
    coachJwt: null,
};

// --- Test Utilities ---

// Generates a mock fingerprint for device testing
const generateFingerprint = () => {
    return crypto.randomBytes(32).toString('hex');
};

const delay = ms => new Promise(res => setTimeout(res, ms));

const logSuccess = (msg) => console.log(`✅ [PASS] ${msg}`);
const logFail = (msg) => console.log(`❌ [FAIL] ${msg}`);
const logInfo = (msg) => console.log(`ℹ️ [INFO] ${msg}`);

// --- Setup: Registration & Login ---
async function setupBaseAccounts() {
    logInfo("Setting up test accounts...");
    state.studentEmail = `student_hacker_${Date.now()}@test.com`;
    state.studentPassword = "HackerPassword123!";

    // 1. Register
    try {
        const regRes = await axios.post(`${API_BASE}/auth/register`, {
            email: state.studentEmail,
            password: state.studentPassword,
            firstName: "Hacker",
            lastName: "User",
            role: "STUDENT",
            dob: "2010-01-01",
            deviceFingerprint: state.deviceId
        });

        // In Haraka, registration doesn't return tokens. We must login.
        logInfo("Logging in to obtain tokens...");
        const loginRes = await axios.post(`${API_BASE}/auth/login`, {
            email: state.studentEmail,
            password: state.studentPassword
        });

        state.studentJwt = loginRes.data.token;
        state.studentRefreshToken = loginRes.data.refreshToken;
        state.studentId = loginRes.data.user.id;

        logSuccess("Setup complete: Registered and Logged in.");
    } catch (e) {
        logFail("Failed to setup base account: " + JSON.stringify(e.response?.data || e.message));
        process.exit(1);
    }
}

// --- Vector 1: Identity Attacks ---
async function runIdentityAttacks() {
    logInfo("--- Starting Vector 1: Identity Attacks ---");

    // Attack 1.1: Stolen Refresh Token Replay (Family Invalidation)
    // We will refresh the token normally (which consumes it and marks isUsed = true)
    // Then we try to use the *old* refresh token again to simulate a replay attack.
    logInfo("Executing 1.1: Refresh Token Replay...");
    let newRefreshToken = null;
    let oldRefreshToken = state.studentRefreshToken;

    // 1. Normal Refresh
    try {
        const refreshRes = await axios.post(`${API_BASE}/auth/refresh`, {
            refreshToken: oldRefreshToken,
            deviceFingerprint: state.deviceId
        });
        newRefreshToken = refreshRes.data.refreshToken;
        state.studentJwt = refreshRes.data.token; // update active JWT
        state.studentRefreshToken = newRefreshToken;
        logInfo("Normal refresh succeeded.");
    } catch (e) {
        logFail("Normal refresh failed before we could attack: " + e.message);
    }

    // 2. The Attack (Reusing the old token)
    try {
        await axios.post(`${API_BASE}/auth/refresh`, {
            refreshToken: oldRefreshToken, // Stolen token
            deviceFingerprint: "stolen-device-fingerprint" // Hacker's device
        });

        // If this succeeds, the system is BROKEN.
        logFail("VULNERABILITY DETECTED: System accepted a reused refresh token!");
    } catch (e) {
        if (e.response && (e.response.status === 401 || e.response.status === 403)) {
            logSuccess(`System correctly blocked reused refresh token (Message: ${e.response.data.error})`);
        } else {
            logFail(`System blocked reuse, but with unexpected error: ${e.response?.data?.error || e.message}`);
        }
    }

    // 3. Verify Family Invalidation
    // Because a token was reused, the ENTIRE family should be invalid. 
    // Meaning the newly issued valid token (newRefreshToken) should ALSO be blocked now.
    logInfo("Verifying Family Invalidation (New token should be dead)...");
    try {
        await axios.post(`${API_BASE}/auth/refresh`, {
            refreshToken: newRefreshToken,
            deviceFingerprint: state.deviceId
        });
        logFail("VULNERABILITY DETECTED: Family Invalidation failed. New tokens survive reuse of old tokens.");
    } catch (e) {
        if (e.response && (e.response.status === 401 || e.response.status === 403)) {
            logSuccess(`Family Invalidation SUCCESS: Entire token tree revoked (Message: ${e.response.data.error})`);
        } else {
            logFail(`Family Invalidation returned unexpected error: ${e.response?.data?.error || e.message}`);
        }
    }

    // Attack 1.2: Delayed Replay / JWT Tampering
    logInfo("Executing 1.2: JWT Tampering (Role Claim Hijack)...");

    // Re-login to get fresh tokens after the family was invalidated
    try {
        const loginRes = await axios.post(`${API_BASE}/auth/login`, {
            email: state.studentEmail,
            password: state.studentPassword
        });
        state.studentJwt = loginRes.data.token;
        logInfo("Successfully logged back in for tamper test.");
    } catch (e) {
        logFail("Failed to re-login: " + e.message);
        return;
    }

    const parts = state.studentJwt.split('.');
    if (parts.length === 3) {
        let payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
        payload.role = 'ADMIN'; // Tamper!

        const tamperedPayloadStr = Buffer.from(JSON.stringify(payload)).toString('base64').replace(/=/g, '');
        const forgedJwt = `${parts[0]}.${tamperedPayloadStr}.${parts[2]}`; // Signature does not match new payload

        try {
            await axios.get(`${API_BASE}/profile/${state.studentId}`, {
                headers: { Authorization: `Bearer ${forgedJwt}` }
            });
            logFail("VULNERABILITY DETECTED: API accepted tampered JWT signature!");
        } catch (e) {
            if (e.response && (e.response.status === 401 || e.response.status === 403)) {
                logSuccess("Signature Validation SUCCESS: Tampered JWT rejected.");
            } else {
                logFail("API rejected tampered JWT, but unexpectedly: " + e.message);
            }
        }
    } else {
        logInfo("Skipping tamper test, no valid JWT structure found.");
    }
}


// --- Main Runner ---
async function runAll() {
    console.log("=========================================");
    console.log("🔥 HARAKA FULL TRUST STRESS TEST 🔥");
    console.log("=========================================\n");

    logInfo("Vector 1: Identity Attacks");
    await setupBaseAccounts();
    await runIdentityAttacks();

    logInfo("\nVector 2: Motion Forgery");
    await setupBaseAccounts();
    await runMotionForgeryAttacks();

    logInfo("\nVector 3: Concurrency & Race Conditions");
    await setupBaseAccounts();
    await runConcurrencyAttacks();

    logInfo("\nVector 4: Privilege Escalation");
    await setupBaseAccounts();
    await runPrivilegeEscalationAttacks();

    logInfo("\nVector 5: Economic Abuse");
    await setupBaseAccounts();
    await runEconomicAbuseAttacks();

    logInfo("\nVector 6: Billing & Subscription Abuse");
    await setupBaseAccounts();
    await runBillingAttacks();

    console.log("\n=========================================");
    console.log("Test Suite Completed.");
}

async function runBillingAttacks() {
    logInfo("--- Starting Vector 6: Billing & Subscription Abuse ---");

    // Attack 6.1: Accessing Premium Feature without Subscription
    logInfo("Executing 6.1: Accessing AI Motion Analysis without Subscription...");
    try {
        const res = await axios.post(`${API_BASE}/analysis/motion`, {}, {
            headers: { Authorization: `Bearer ${state.studentJwt}` }
        });
        logFail("VULNERABILITY DETECTED: Student accessed premium feature without active subscription!");
    } catch (e) {
        if (e.response && e.response.data.code === 'SUBSCRIPTION_REQUIRED') {
            logSuccess("Billing Guard SUCCESS: Premium feature correctly blocked.");
        } else {
            logFail("Billing block failed or returned unexpected error: " + (e.response?.data?.error || e.message));
        }
    }

    // Attack 6.2: Webhook Spoofing (No Signature)
    logInfo("Executing 6.2: Attempting to spoof Stripe Webhook (No Signature)...");
    try {
        const res = await axios.post(`${API_BASE}/payments/webhook`, {
            type: 'checkout.session.completed',
            data: { object: { metadata: { userId: state.studentId, planId: 'premium' } } }
        }, {
            headers: { 'Content-Type': 'application/json' }
        });
        logFail("VULNERABILITY DETECTED: System accepted unsigned Stripe Webhook!");
    } catch (e) {
        if (e.response && e.response.status === 400) {
            logSuccess("Webhook Security SUCCESS: Unsigned webhook rejected.");
        } else {
            logFail("Webhook rejection failed with status: " + (e.response?.status || e.message));
        }
    }
}

async function runEconomicAbuseAttacks() {
    logInfo("--- Starting Vector 5: Economic Abuse Simulation ---");

    // Attack 5.1: Session Farming
    logInfo("Executing 5.1: Session Farming (Spamming /start)...");
    try {
        logInfo("Attempting to start 10 sessions rapidly...");
        const requests = Array(10).fill(null).map(() =>
            axios.post(`${API_BASE}/session/start`, {
                userId: state.studentId
            }, {
                headers: { Authorization: `Bearer ${state.studentJwt}` },
                validateStatus: null
            })
        );

        const results = await Promise.all(requests);
        const successes = results.filter(r => r.status === 201).length;

        logInfo(`Farming Results: ${successes} sessions started.`);

        if (successes > 3) { // Threshold for "Farming"
            logFail(`VULNERABILITY DETECTED: System allowed farming ${successes} concurrent sessions!`);
        } else {
            logSuccess("Economic Abuse Check SUCCESS: Session farming blocked/limited.");
        }
    } catch (e) {
        logFail("Economic abuse test failed: " + e.message);
    }
}

async function runPrivilegeEscalationAttacks() {
    logInfo("--- Starting Vector 4: Privilege Escalation ---");

    // Attack 4.1: Accessing Admin Metrics as Student
    logInfo("Executing 4.1: Student attempting to access Admin Metrics...");
    try {
        const res = await axios.get(`${API_BASE}/admin/metrics`, {
            headers: { Authorization: `Bearer ${state.studentJwt}` }
        });
        logFail("VULNERABILITY DETECTED: Student successfully accessed Admin Metrics!");
    } catch (e) {
        if (e.response && (e.response.status === 401 || e.response.status === 403)) {
            logSuccess("Privilege Escalation Blocked: Admin Metrics rejected student.");
        } else {
            logFail("Admin access blocked, but with unexpected error: " + (e.response?.data?.error || e.message));
        }
    }

    // Attack 4.2: Accessing Coach Video Reports as Student
    logInfo("Executing 4.2: Student attempting to access Coach Reports...");
    try {
        const res = await axios.get(`${API_BASE}/coach/video-reports`, {
            headers: { Authorization: `Bearer ${state.studentJwt}` }
        });
        logFail("VULNERABILITY DETECTED: Student successfully accessed Coach Video Reports!");
    } catch (e) {
        if (e.response && (e.response.status === 401 || e.response.status === 403)) {
            logSuccess("Privilege Escalation Blocked: Coach Reports rejected student.");
        } else {
            logFail("Coach access blocked, but with unexpected error: " + (e.response?.data?.error || e.message));
        }
    }
}

async function runConcurrencyAttacks() {
    logInfo("--- Starting Vector 3: Concurrency & Race Conditions ---");

    // Attack 3.1: Parallel Session Completion
    // We start a session and fire multiple completion requests simultaneously.
    logInfo("Executing 3.1: Parallel Session Completion (Race Condition Test)...");

    try {
        const startRes = await axios.post(`${API_BASE}/session/start`, {
            userId: state.studentId
        }, {
            headers: { Authorization: `Bearer ${state.studentJwt}` },
            validateStatus: (status) => status === 201 || status === 200 || status === 400
        });

        let sessionToken;
        if (startRes.status === 400 && startRes.data.error.includes("already exists")) {
            // In theory we should find a way to get the token, 
            // but here we just want to make sure we have ONE session to complete.
            // We'll trust that the previous vector's token is what we want, but we don't have it in state.
            // Let's just fail this run and rely on the DB Reset I just did.
            logFail("Concurrency test blocked by stale session. DB Reset required.");
            return;
        } else {
            sessionToken = startRes.data.sessionToken;
        }

        logInfo("Firing 5 completion requests simultaneously...");
        const requests = Array(5).fill(null).map(() =>
            axios.post(`${API_BASE}/session/complete`, {
                sessionToken,
                frameCount: 300,
                durationSeconds: 60
            }, {
                headers: { Authorization: `Bearer ${state.studentJwt}` },
                validateStatus: null // Don't throw on error
            })
        );

        const results = await Promise.all(requests);
        const successes = results.filter(r => r.status === 200).length;
        const rejections = results.filter(r => r.status === 403 || r.status === 401).length;

        logInfo(`Results: ${successes} Successes, ${rejections} Rejections.`);

        if (successes > 1) {
            logFail(`VULNERABILITY DETECTED: Race condition allowed ${successes} completions for one session!`);
        } else if (successes === 1) {
            logSuccess("Concurrency Check SUCCESS: Only 1 request processed, others blocked.");
        } else {
            logFail("Unexpected result: All requests failed or were blocked incorrectly.");
        }
    } catch (e) {
        logFail("Concurrency test failed due to script error: " + e.message);
    }
}

async function runMotionForgeryAttacks() {
    logInfo("--- Starting Vector 2: Motion Forgery ---");

    // 1. Session Setup
    let sessionToken, traceId;
    try {
        const startRes = await axios.post(`${API_BASE}/session/start`, {
            userId: state.studentId
        }, {
            headers: { Authorization: `Bearer ${state.studentJwt}` }
        });
        sessionToken = startRes.data.sessionToken;
        traceId = startRes.data.traceId;
        logInfo(`Session started. Token: ${sessionToken.substring(0, 10)}...`);
    } catch (e) {
        logFail("Failed to start session: " + e.message);
        return;
    }

    // Attack 2.1: Session Replay Attack
    logInfo("Executing 2.1: Session Replay...");
    try {
        // First completion (Normal)
        await axios.post(`${API_BASE}/session/complete`, {
            sessionToken,
            frameCount: 300,
            durationSeconds: 60
        }, {
            headers: { Authorization: `Bearer ${state.studentJwt}` }
        });
        logInfo("First completion succeeded.");

        // Second completion (Replay)
        await axios.post(`${API_BASE}/session/complete`, {
            sessionToken,
            frameCount: 300,
            durationSeconds: 60
        }, {
            headers: { Authorization: `Bearer ${state.studentJwt}` }
        });
        logFail("VULNERABILITY DETECTED: System accepted a replayed session completion!");
    } catch (e) {
        if (e.response && e.response.data.error.includes("Replay Detected")) {
            logSuccess("Anti-Replay SUCCESS: Replayed session rejected.");
        } else {
            logFail("System blocked replay, but with unexpected error: " + (e.response?.data?.error || e.message));
        }
    }

    // Attack 2.2: Fraud Engine Rejection (Simulating Impossible Data)
    // We start a NEW session for this
    logInfo("Executing 2.2: Impossible Metrics (Fraud Engine Check)...");
    try {
        const startRes = await axios.post(`${API_BASE}/session/start`, {
            userId: state.studentId
        }, {
            headers: { Authorization: `Bearer ${state.studentJwt}` }
        });
        const newSessionToken = startRes.data.sessionToken;

        // Fire impossible metrics: 5000 frames in 1 second.
        // This should trigger a "REJECT" verdict from the Fraud Engine if active,
        // or at least be logged as an anomaly.
        const res = await axios.post(`${API_BASE}/session/complete`, {
            sessionToken: newSessionToken,
            frameCount: 5000,
            durationSeconds: 1
        }, {
            headers: { Authorization: `Bearer ${state.studentJwt}` }
        });

        if (res.data.verdict === "REJECT") {
            logSuccess("Fraud Engine SUCCESS: Impossible metrics rejected.");
        } else {
            // If it accepted it, it's a fail (assuming fraud engine is meant to catch this)
            logFail(`VULNERABILITY DETECTED: Fraud Engine accepted impossible metrics! (Verdict: ${res.data.verdict})`);
        }
    } catch (e) {
        if (e.response && e.response.data.error.includes("Fraud Engine Rejection")) {
            logSuccess("Fraud Engine SUCCESS: Impossible metrics rejected.");
        } else {
            logFail("Fraud Engine check gated by unexpected error: " + (e.response?.data?.error || e.message));
        }
    }
}

runAll();
