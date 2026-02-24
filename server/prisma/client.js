import 'dotenv/config';
import { PrismaClient } from './generated/index.js';

console.log('Centralized Prisma Initializing...');
console.log('DATABASE_URL length:', process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 'NULL');

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

console.log('Prisma instance created successfully');

export default prisma;
