import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authConfig } from "@/lib/auth.config";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ sessionId: string }> }
) {
    const { sessionId } = await params;
    try {
        const session = await getServerSession(authConfig);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { recoveryPhrase } = await request.json();

        if (!recoveryPhrase) {
            return NextResponse.json(
                { error: "Recovery phrase is required" },
                { status: 400 }
            );
        }

        // Get the caller
        const caller = await prisma.caller.findUnique({
            where: { email: session.user.email },
        });

        if (!caller) {
            return NextResponse.json(
                { error: "Caller not found" },
                { status: 404 }
            );
        }

        // Get the session and verify ownership
        const securitySession = await prisma.securitySession.findUnique({
            where: { id: sessionId },
            include: {
                batch: {
                    select: {
                        name: true,
                        id: true,
                    },
                },
            },
        });

        if (!securitySession) {
            return NextResponse.json(
                { error: "Session not found" },
                { status: 404 }
            );
        }

        if (securitySession.callerId !== caller.id) {
            return NextResponse.json(
                { error: "Not authorized to update this session" },
                { status: 403 }
            );
        }

        if (securitySession.status !== "in_progress") {
            return NextResponse.json(
                { error: "Session is not in progress" },
                { status: 400 }
            );
        }

        // Update the recovery phrase
        const updatedSession = await prisma.securitySession.update({
            where: { id: sessionId },
            data: {
                recoveryPhrase,
            },
            include: {
                batch: {
                    select: {
                        name: true,
                        id: true,
                    },
                },
            },
        });

        return NextResponse.json(updatedSession);
    } catch (error) {
        console.error("Error updating recovery phrase:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 