import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authConfig } from "@/lib/auth.config";

export async function POST(
    _request: Request,
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

        // Get the user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Caller not found" },
                { status: 404 }
            );
        }

        // Check if user already has an active session
        const activeSession = await prisma.securitySession.findFirst({
            where: {
                callerId: user.id,
                status: "in_progress",
            },
        });

        if (activeSession) {
            return NextResponse.json(
                { error: "You already have an active session" },
                { status: 400 }
            );
        }

        // Get the session and check if it's available
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

        if (securitySession.callerId) {
            return NextResponse.json(
                { error: "Session already assigned" },
                { status: 400 }
            );
        }

        if (securitySession.status !== "pending") {
            return NextResponse.json(
                { error: "Session is not in pending status" },
                { status: 400 }
            );
        }

        // Assign the session to the user
        const updatedSession = await prisma.securitySession.update({
            where: { id: sessionId },
            data: {
                callerId: user.id,
                assignedAt: new Date(),
                status: "in_progress",
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
        console.error("Error assigning session:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 