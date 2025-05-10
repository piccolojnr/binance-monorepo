import { NextResponse } from 'next/server';
import prisma, { createUniqueSecuritySession } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { phoneNumbers, name } = await request.json();

        // Validate input
        if (!name || typeof name !== 'string' || name.length < 3) {
            return NextResponse.json({ error: 'Batch name must be at least 3 characters long' }, { status: 400 });
        }

        if (!Array.isArray(phoneNumbers) || phoneNumbers.length === 0) {
            return NextResponse.json({ error: 'Phone numbers array is required' }, { status: 400 });
        }

        // Create a new batch
        const batch = await prisma.batch.create({
            data: {
                name,
            }
        });

        // Create sessions for each phone number
        const sessions = await Promise.all(
            phoneNumbers.map(async (phoneNumber) => createUniqueSecuritySession(phoneNumber, batch.id))
        );

        return NextResponse.json({
            batchId: batch.id,
            sessions
        });
    } catch (error) {
        console.error('Error creating batch:', error);
        return NextResponse.json({ error: 'Failed to create batch' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const batchId = searchParams.get('batchId');

        if (!batchId) {
            return NextResponse.json({ error: 'Batch ID is required' }, { status: 400 });
        }

        // Delete all sessions in the batch
        await prisma.securitySession.deleteMany({
            where: { batchId }
        });

        // Delete the batch
        await prisma.batch.delete({
            where: { id: batchId }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting batch:', error);
        return NextResponse.json({ error: 'Failed to delete batch' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const batches = await prisma.batch.findMany({
            include: {
                sessions: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(batches);
    } catch (error) {
        console.error('Error fetching batches:', error);
        return NextResponse.json({ error: 'Failed to fetch batches' }, { status: 500 });
    }
} 