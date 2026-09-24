import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth.config";
import prisma from "@/lib/prisma";

export async function POST() {
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

        // Reset admin's balance
        await prisma.user.update({
            where: { id: admin.id },
            data: { balance: 0 },
        });

        // Reset all callers' balances
        await prisma.user.updateMany({
            where: { parentId: admin.id },
            data: { balance: 0 },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error resetting balance:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 