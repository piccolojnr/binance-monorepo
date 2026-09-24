import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const securityCode = searchParams.get('security_code');

    if (!securityCode) {
        return NextResponse.json({ error: 'Security code is required' }, { status: 400 });
    }

    const session = await prisma.securitySession.findUnique({
        where: { securityCode },
    });

    if (!session) {
        return NextResponse.json({ error: 'Invalid security code' }, { status: 404 });
    }

    return NextResponse.json(session);
}






export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const securityCode = searchParams.get('security_code');

    if (!securityCode) {
        return NextResponse.json({ error: 'Security code is required' }, { status: 400 });
    }

    const session = await prisma.securitySession.findUnique({
        where: { securityCode },
    });

    if (!session) {
        return NextResponse.json({ error: 'Invalid security code' }, { status: 404 });
    }

    return NextResponse.json(session);
}