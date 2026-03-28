import 'dotenv/config';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function testConnection() {
    console.log('Testing connection to Supabase...');
    console.log('URL:', process.env.DATABASE_URL.replace(/:[^:]+@/, ':****@'));

    try {
        const res = await pool.query('SELECT NOW()');
        console.log('✅ Connection Successful!');
        console.log('Server Time:', res.rows[0].now);
    } catch (err) {
        console.error('❌ Connection Failed!');
        console.error('Error Code:', err.code);
        console.error('Message:', err.message);
    } finally {
        await pool.end();
    }
}

testConnection();
