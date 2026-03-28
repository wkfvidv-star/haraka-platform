import prisma from './prisma/client.js';
import bcrypt from 'bcryptjs';

async function seedAdmin() {
    console.log("Seeding initial admin...");
    try {
        const hashedPassword = await bcrypt.hash('Password123!', 10);
        const admin = await prisma.user.upsert({
            where: { email: 'ahmed@haraka.com' },
            update: {
                role: 'ADMIN',
                isActive: true,
                betaCohort: 'PILOT_2024_INTERNAL'
            },
            create: {
                email: 'ahmed@haraka.com',
                password: hashedPassword,
                role: 'ADMIN',
                isActive: true,
                betaCohort: 'PILOT_2024_INTERNAL',
                profile: {
                    create: {
                        firstName: 'Ahmed',
                        lastName: 'Admin'
                    }
                }
            }
        });
        console.log("✅ Admin seeded:", admin.email);
    } catch (e) {
        console.error("Seeding failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

seedAdmin();
