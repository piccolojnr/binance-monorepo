import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth.config";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth-utils";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
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

        const { name, email, password } = await req.json();

        if (!name || !email) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Check if the caller belongs to this admin
        const caller = await prisma.user.findFirst({
            where: {
                id: id,
                parentId: admin.id,
            },
        });

        if (!caller) {
            return NextResponse.json(
                { error: "Caller not found" },
                { status: 404 }
            );
        }

        // Check if email is being changed and if it's already taken
        if (email !== caller.email) {
            const existingUser = await prisma.user.findUnique({
                where: { email },
            });

            if (existingUser) {
                return NextResponse.json(
                    { error: "Email already registered" },
                    { status: 400 }
                );
            }
        }

        // Update caller
        const updateData: any = {
            name,
            email,
        };

        if (password) {
            updateData.password = await hashPassword(password);
        }

        const updatedCaller = await prisma.user.update({
            where: { id: id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                balance: true,
                createdAt: true,
            },
        });

        return NextResponse.json(updatedCaller);
    } catch (error) {
        console.error("Error updating caller:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
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

        // Check if the caller belongs to this admin
        const caller = await prisma.user.findFirst({
            where: {
                id: id,
                parentId: admin.id,
            },
        });

        if (!caller) {
            return NextResponse.json(
                { error: "Caller not found" },
                { status: 404 }
            );
        }

        // Delete caller
        await prisma.user.delete({
            where: { id: id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting caller:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 