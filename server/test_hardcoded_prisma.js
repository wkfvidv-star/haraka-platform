import { PrismaClient } from '@prisma/client';

const DATABASE_URL = "postgresql://postgres:password@localhost:5432/student_dashboard?schema=public";

console.log('Testing with default constructor...');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Connecting...');
        const userCount = await prisma.user.count();
        console.log('User count:', userCount);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
