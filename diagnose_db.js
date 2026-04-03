import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    try {
        const profiles = await prisma.profile.findMany({ take: 5 });
        console.log('Profiles found:', JSON.stringify(profiles, null, 2));

        const users = await prisma.user.findMany({ take: 5 });
        console.log('Users found:', JSON.stringify(users, null, 2));
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
