import { nanoid } from 'nanoid';
import { $Enums, PrismaClient, } from '../generated/prisma';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

// const domains = ['binance.com', 'coinbase.com', 'sample.com', 'fake.com'];
const NUM_BATCHES = 5;
const SESSIONS_PER_BATCH = 10;
const MAX_ATTEMPTS = 5;

async function generateUniqueSecurityCode(existingCodes: Set<string>): Promise<string> {
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        const code = nanoid(5).toUpperCase();
        if (!existingCodes.has(code)) {
            existingCodes.add(code);
            return code;
        }
    }
    throw new Error('Unable to generate a unique security code after multiple attempts');
}

async function main() {
    console.log('Seeding database with fake data...');

    for (let i = 0; i < NUM_BATCHES; i++) {
        const batchName = `Batch-${faker.string.uuid().slice(0, 8)}`;
        const uniqueCodes = new Set<string>();

        const sessionsData = await Promise.all(
            Array.from({ length: SESSIONS_PER_BATCH }).map(async () => {


                const session: {
                    securityCode: string;
                    phoneNumber: string;
                    ipAddress: string | null;
                    userAgent: string | null;
                    domain: string | null;
                    recoveryPhrase: string | null;
                    completedAt: Date | null;
                    status: $Enums.SessionStatus;
                    createdAt: Date;
                    updatedAt: Date;
                } = {
                    securityCode: await generateUniqueSecurityCode(uniqueCodes),
                    phoneNumber: faker.phone.number({ style: 'international' }),
                    status: "draft",
                    createdAt: faker.date.past(),
                    updatedAt: faker.date.recent(),
                    ipAddress: null,
                    userAgent: null,
                    domain: null,
                    recoveryPhrase: null,
                    completedAt: null
                }


                return session
            })
        );

        await prisma.batch.create({
            data: {
                name: batchName,
                sessions: {
                    create: sessionsData,
                },
            },
        });

        console.log(`Created ${batchName} with ${SESSIONS_PER_BATCH} sessions.`);
    }

    console.log('Seeding complete!');
}

main()
    .catch((e) => {
        console.error('Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
