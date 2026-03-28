import 'dotenv/config';
import prisma from './prisma/client.js';

async function main() {
    try {
        console.log('Fetching Forensic Audit Logs...');
        const logs = await prisma.eventLog.findMany({
            take: 20,
            orderBy: { createdAt: 'desc' }
        });
        console.log(JSON.stringify(logs, null, 2));
    } catch (error) {
        console.error('Audit Verification Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
