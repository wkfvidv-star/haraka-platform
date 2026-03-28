import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

console.log('Centralized Prisma Initializing (Prisma 7 + Adapter Mode)...');
console.log('DATABASE_URL length:', process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 'NULL');

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const basePrisma = new PrismaClient({
    adapter,
    log: ['query', 'info', 'warn', 'error'],
});

const prisma = basePrisma.$extends({
    query: {
        eventLog: {
            async update() { throw new Error("CRITICAL: EventLog is IMMUTABLE. Update denied."); },
            async updateMany() { throw new Error("CRITICAL: EventLog is IMMUTABLE. Update denied."); },
            async delete() { throw new Error("CRITICAL: EventLog is IMMUTABLE. Delete denied."); },
            async deleteMany() { throw new Error("CRITICAL: EventLog is IMMUTABLE. Delete denied."); },
            async upsert() { throw new Error("CRITICAL: EventLog is IMMUTABLE. Upsert denied."); }
        }
    }
});

console.log('Prisma instance created with Layered Immutability Extensions.');

export default prisma;
