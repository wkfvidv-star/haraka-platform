import prisma from './prisma/client.js';

async function testDefaults() {
    try {
        const email = `test_defaults_${Date.now()}@example.com`;
        const user = await prisma.user.create({
            data: {
                email,
                password: 'password123',
                profile: {
                    create: {
                        firstName: 'Test',
                        lastName: 'Defaults'
                    }
                }
            }
        });
        console.log('Created user with subscriptionStatus:', user.subscriptionStatus);

        // Clean up
        await prisma.user.delete({ where: { id: user.id } });
        process.exit(0);
    } catch (e) {
        console.error('Test failed:', e.message);
        process.exit(1);
    }
}

testDefaults();
