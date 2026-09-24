import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const sessions = await prisma.securitySession.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(sessions);
    } catch (error) {
        console.error('Error fetching sessions:', error);
        return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
    }
}


export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get('sessionId');

        if (!sessionId) {
            return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
        }

        const session = await prisma.securitySession.findUnique({
            where: { id: sessionId }
        });

        if (!session) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        await prisma.securitySession.delete({
            where: { id: sessionId }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting session:', error);
        return NextResponse.json({ error: 'Failed to delete session' }, { status: 500 });
    }
}