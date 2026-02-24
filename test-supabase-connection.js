
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('Testing Supabase Connection...');
console.log('URL:', supabaseUrl);
console.log('Key (prefix):', supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'undefined');

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Supabase URL or Key missing in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    try {
        console.log('Attempting to fetch profiles count...');
        const { count, error } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.error('Connection failed:', error.message);
            console.error('Error code:', error.code);
            console.error('Full error:', JSON.stringify(error, null, 2));
        } else {
            console.log('Connection successful!');
            console.log('Profiles count:', count);
        }

        console.log('\nTesting Auth (SignUp trial with invalid email)...');
        const { data, error: authError } = await supabase.auth.signUp({
            email: 'invalid-test-email-' + Date.now() + '@test.com',
            password: 'password123',
        });

        if (authError) {
            console.log('Auth test (expected/result):', authError.message);
        } else {
            console.log('Auth test: User created successfully (ID:', data.user?.id, ')');
        }

    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

testConnection();
