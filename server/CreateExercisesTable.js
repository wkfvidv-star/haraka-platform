import pg from 'pg';
import * as dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const { Client } = pg;
const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

const schemaSql = `
-- Create exercises table
CREATE TABLE IF NOT EXISTS exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('motor', 'cognitive', 'psychological', 'rehabilitation')),
    sub_category TEXT,
    difficulty TEXT CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    duration TEXT,
    instructions TEXT[],
    video_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
`;

async function run() {
    try {
        await client.connect();
        console.log('Connected to database');
        await client.query(schemaSql);
        console.log('Successfully created exercises table');
    } catch (err) {
        console.error('Error creating table:', err);
    } finally {
        await client.end();
    }
}

run();
