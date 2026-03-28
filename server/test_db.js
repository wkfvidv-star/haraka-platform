import prisma from './prisma/client.js';

async function test() {
    try {
        const userCount = await prisma.user.count();
        console.log('Database OK. User count:', userCount);
        process.exit(0);
    } catch (e) {
        console.error('Database connection failed:', e.message);
        process.exit(1);
    }
}

test();
