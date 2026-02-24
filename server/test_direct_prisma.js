import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly import from the local node_modules
const prismaPath = path.join(__dirname, 'node_modules', '.prisma', 'client', 'index.js');
const { PrismaClient } = await import('file://' + prismaPath);

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Testing direct Prisma connection...');
        const userCount = await prisma.user.count();
        console.log('User count:', userCount);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
