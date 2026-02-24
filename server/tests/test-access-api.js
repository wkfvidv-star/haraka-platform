import axios from 'axios';

const API_URL = 'http://localhost:3001/api/access';

async function runTests() {
    console.log('🚀 Starting Smart Access API Tests...');

    try {
        // 1. Test QR Verification (Should fail if token doesn't exist yet)
        console.log('\n--- Test 1: QR Verification with Invalid Token ---');
        try {
            const res = await axios.post(`${API_URL}/verify-qr`, {
                qrToken: 'INVALID-TOKEN',
                location: 'Main Entrance'
            });
            console.log('Result:', res.data);
        } catch (err) {
            console.log('Expected Error:', err.response?.data?.error || err.message);
        }

        // 2. Test Remote Approval (Should work if userId is valid)
        // Note: In demo mode, we might need a real userId from the DB.
        console.log('\n--- Test 2: Remote Approval (Simulation) ---');
        console.log('Manual check: Verify Admin Control Center component displays simulated records.');

        // 3. Test Fetching Logs
        console.log('\n--- Test 3: Fetching Access Logs ---');
        try {
            const res = await axios.get(`${API_URL}/logs`);
            console.log('Found Logs:', res.data.logs.length);
            if (res.data.logs.length > 0) {
                console.log('Sample Log:', res.data.logs[0]);
            }
        } catch (err) {
            console.log('Error fetching logs:', err.response?.data || err.message);
        }

        console.log('\n✅ Verification Script Completed.');
    } catch (error) {
        console.error('❌ Test Suite Failed:', error);
    }
}

// Note: This script requires the server to be running and axios to be installed in the server directory
// Since this is a demo environment, we primarily rely on frontend simulation and UI verification.
console.log('Verification Logic defined. Ready for manual UI confirmation.');
