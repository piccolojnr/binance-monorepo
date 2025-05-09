import { nanoid } from 'nanoid';
import { PrismaClient } from '../src/generated/prisma';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const domains = ['binance.com', 'coinbase.com', 'sample.com', 'fake.com'];
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
            Array.from({ length: SESSIONS_PER_BATCH }).map(async () => ({
                securityCode: await generateUniqueSecurityCode(uniqueCodes),
                phoneNumber: faker.phone.number({ style: 'international' }),
                ipAddress: faker.internet.ip(),
                userAgent: faker.internet.userAgent(),
                domain: faker.helpers.arrayElement(domains),
                recoveryPhrase: faker.word.words(3),
                status: faker.helpers.arrayElement(['pending', 'waiting_for_phrase', 'completed']),
            }))
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
