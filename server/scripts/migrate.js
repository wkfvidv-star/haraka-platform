import { execSync } from 'child_process';
import dotenv from 'dotenv';
dotenv.config();

const migrationUrl = process.env.DATABASE_URL_MIGRATION;
if (!migrationUrl) {
    console.error('DATABASE_URL_MIGRATION is not defined in .env');
    process.exit(1);
}

try {
    console.log('Running schema push...');
    execSync('npx prisma db push', {
        env: { ...process.env, DATABASE_URL: migrationUrl },
        stdio: 'inherit',
    });
    console.log('Schema push complete.');
} catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
}
