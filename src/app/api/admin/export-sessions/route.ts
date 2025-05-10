import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth.config";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authConfig);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const admin = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!admin || !admin.admin) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { batchIds } = await req.json();

        if (!Array.isArray(batchIds) || batchIds.length === 0) {
            return NextResponse.json(
                { error: "Invalid batch IDs" },
                { status: 400 }
            );
        }

        // Get sessions for selected batches
        const sessions = await prisma.securitySession.findMany({
            where: {
                batchId: {
                    in: batchIds,
                },
            },
            select: {
                securityCode: true,
                phoneNumber: true,
            },
        });

        // Format sessions as text
        const textContent = sessions
            .map((session) => `${session.securityCode},${session.phoneNumber}`)
            .join("\n");

        // Create response with text file
        return new NextResponse(textContent, {
            headers: {
                "Content-Type": "text/plain",
                "Content-Disposition": `attachment; filename="sessions-export-${new Date()
                    .toISOString()
                    .split("T")[0]}.txt"`,
            },
        });
    } catch (error) {
        console.error("Error exporting sessions:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 