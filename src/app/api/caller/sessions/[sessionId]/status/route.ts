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

        const { status, amountWithdrawn } = await request.json();

        if (!status || !["completed", "failed"].includes(status)) {
            return NextResponse.json(
                { error: "Invalid status" },
                { status: 400 }
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

        if (securitySession.callerId !== user.id) {
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

        // Update the session status
        const updatedSession = await prisma.securitySession.update({
            where: { id: sessionId },
            data: {
                status,
                completedAt: new Date(),
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

        await prisma.user.update({
            where: { id: user.id },
            data: {
                balance: {
                    increment: amountWithdrawn,
                },
            },
        });

        if (user.parentId) {
            await prisma.user.update({
                where: { id: user.parentId },
                data: {
                    balance: {
                        increment: amountWithdrawn,
                    },
                },
            });
        }

        return NextResponse.json(updatedSession);
    } catch (error) {
        console.error("Error updating session status:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 