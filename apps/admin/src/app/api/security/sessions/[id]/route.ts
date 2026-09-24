import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/security/sessions/[id] — fetch a single session by its id
export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    if (!id) {
        return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const session = await prisma.securitySession.findUnique({
        where: { id },
    });

    if (!session) {
        return NextResponse.json({ error: 'Security session not found' }, { status: 404 });
    }

    return NextResponse.json(session);
}

// DELETE /api/security/sessions/[id] — delete a single session by its id
export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    if (!id) {
        return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    try {
        const session = await prisma.securitySession.findUnique({
            where: { id },
        });

        if (!session) {
            return NextResponse.json({ error: 'Security session not found' }, { status: 404 });
        }

        await prisma.securitySession.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting session:', error);
        return NextResponse.json({ error: 'Failed to delete session' }, { status: 500 });
    }
}