import axios from 'axios';

const API_URL = 'http://localhost:3001/api';
// We need a userId. I'll try to find one from the database or just use a dummy one to see if it 500s
const DUMMY_USER_ID = 'bc885743-3058-450f-90e9-b5f7e7f6032d'; // Just a guess, or I'll try to fetch one

async function diagnose() {
    console.log('--- Starting API Diagnosis ---');

    // 1. Health Profile
    try {
        console.log('Testing /health/profile...');
        // Note: This needs authentication. Without it, it should 401. 
        // If it 500s even without auth (due to middleware/controller bug), we found it.
        const res = await axios.get(`${API_URL}/health/profile`);
        console.log('Health Profile Success:', res.data);
    } catch (err) {
        console.log('Health Profile Error:', err.response?.status, err.response?.data || err.message);
    }

    // 2. HCE Insights
    try {
        console.log(`Testing /hce/insights/${DUMMY_USER_ID}...`);
        const res = await axios.get(`${API_URL}/hce/insights/${DUMMY_USER_ID}`);
        console.log('HCE Success:', res.data);
    } catch (err) {
        console.log('HCE Error:', err.response?.status, err.response?.data || err.message);
    }

    // 3. Profile
    try {
        console.log(`Testing /profile/${DUMMY_USER_ID}...`);
        const res = await axios.get(`${API_URL}/profile/${DUMMY_USER_ID}`);
        console.log('Profile Success:', res.data);
    } catch (err) {
        console.log('Profile Error:', err.response?.status, err.response?.data || err.message);
    }
}

diagnose();
