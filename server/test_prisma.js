import 'dotenv/config';
import prisma from './prisma/client.js';

async function main() {
    try {
        console.log('Testing Prisma connection...');
        const userCount = await prisma.user.count();
        console.log('User count:', userCount);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
