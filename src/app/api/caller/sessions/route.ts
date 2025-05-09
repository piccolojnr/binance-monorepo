import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authConfig } from "@/lib/auth.config";

export async function GET() {
    try {
        const session = await getServerSession(authConfig);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
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

        const pendingSessions = await prisma.securitySession.findMany({
            where: {
                callerId: null,
                status: "pending",
            },
            include: {
                batch: {
                    select: {
                        name: true,
                        id: true,
                    },
                },
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        const assignedSessions = await prisma.securitySession.findMany({
            where: {
                callerId: caller.id,
            },
            include: {
                batch: {
                    select: {
                        name: true,
                        id: true,
                    },
                },
            },
            orderBy: {
                assignedAt: "desc",
            },
        });



        return NextResponse.json({
            pendingSessions,
            assignedSessions,
        });
    } catch (error) {
        console.error("Error fetching caller sessions:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 