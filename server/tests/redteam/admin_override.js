import axios from 'axios';
import crypto from 'crypto';

const API_BASE = 'http://localhost:3001/api';

async function runAdminOverrideTest() {
    console.log("🛠️ STARTING ADMIN OVERRIDE PROTOCOL TEST 🛠️\n");

    try {
        // 1. Setup Target User
        const targetEmail = `victim_${Date.now()}@haraka.com`;
        const regRes = await axios.post(`${API_BASE}/auth/register`, {
            email: targetEmail,
            password: 'Password123!',
            firstName: 'Victim',
            lastName: 'User'
        });
        const userId = regRes.data.userId;

        const loginRes = await axios.post(`${API_BASE}/auth/login`, {
            email: targetEmail,
            password: 'Password123!'
        });
        const studentToken = loginRes.data.token;

        // 2. UNAUTHORIZED OVERRIDE (Student trying to override self)
        console.log("--- Testing Unauthorized Access ---");
        try {
            await axios.post(`${API_BASE}/admin/override`, {
                type: 'RESTORE_XP',
                userId,
                value: 1000,
                reason: 'I want free XP'
            }, { headers: { Authorization: `Bearer ${studentToken}` } });
            console.log("❌ Error: Student should NOT be able to override state!");
        } catch (e) {
            console.log(`✅ Access correctly blocked: ${e.response?.status || e.message}`);
        }

        // 3. VALID ADMIN OVERRIDE (RESTORE_XP)
        console.log("\n--- Testing Valid Admin Override (RESTORE_XP) ---");
        const adminRes = await axios.post(`${API_BASE}/auth/login`, {
            email: 'ahmed@haraka.com',
            password: 'Password123!'
        });
        const adminToken = adminRes.data.token;

        const uBefore = await axios.get(`${API_BASE}/profile/${userId}`, { headers: { Authorization: `Bearer ${studentToken}` } });
        console.log(`XP Before Override: ${uBefore.data.user.xp}`);

        const overrideRes = await axios.post(`${API_BASE}/admin/override`, {
            type: 'RESTORE_XP',
            userId,
            value: 750,
            reason: 'Correction for false fraud rejection'
        }, { headers: { Authorization: `Bearer ${adminToken}` } });

        console.log(`Override Response: ${overrideRes.data.message}`);

        const uAfter = await axios.get(`${API_BASE}/profile/${userId}`, { headers: { Authorization: `Bearer ${studentToken}` } });
        console.log(`XP After Override: ${uAfter.data.user.xp}`);

        if (uAfter.data.user.xp >= 750) {
            console.log("✅ XP Restoration Verified.");
        } else {
            console.log("❌ XP Restoration FAILED.");
        }

        // 4. AUDIT LOG VERIFICATION (EventLog based)
        console.log("\n--- Verifying Audit Log (Append-Only) ---");
        const logsRes = await axios.get(`${API_BASE}/admin/logs`, { headers: { Authorization: `Bearer ${adminToken}` } });

        // Find the override event in the EventLog
        const overrideEvent = logsRes.data.data.find(e =>
            e.eventType === 'ADMIN_OVERRIDE' &&
            e.userId === userId &&
            e.payload.type === 'RESTORE_XP'
        );

        if (overrideEvent) {
            console.log("✅ Admin Override Event Found in Immutable EventLog.");
            console.log(`Reason Stored: ${overrideEvent.payload.reason}`);
            console.log(`Admin ID: ${overrideEvent.payload.adminId}`);
            console.log(`Corrective Message: ${overrideEvent.payload.message}`);
        } else {
            console.log("❌ Audit Log entry MISSING.");
        }

    } catch (error) {
        console.error("Test Error:", error.response?.data || error.message);
    }
}

runAdminOverrideTest();
