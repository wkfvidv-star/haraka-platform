import prisma from './prisma/client.js';

async function seedPlans() {
    console.log("Seeding plans...");
    try {
        await prisma.plan.upsert({
            where: { id: 'PRO_PLAN' },
            update: {},
            create: {
                id: 'PRO_PLAN',
                name: 'Pro Athlete Plan',
                price: 29.99,
                interval: 'month',
                stripePriceId: 'price_pro_athlon_mock',
                features: ['AI Motion Analysis', 'Advanced Analytics', 'Priority Support']
            }
        });

        await prisma.plan.upsert({
            where: { id: 'BASIC_PLAN' },
            update: {},
            create: {
                id: 'BASIC_PLAN',
                name: 'Basic Starter',
                price: 0,
                interval: 'month',
                stripePriceId: 'price_basic_mock',
                features: ['Basic Training', 'Activity Tracking']
            }
        });

        console.log("✅ Plans seeded.");
    } catch (e) {
        console.error("Plan seeding failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

seedPlans();
