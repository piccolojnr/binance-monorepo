import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth.config";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth-utils";

export async function GET() {
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

        // Get all callers (children) of the current admin
        const callers = await prisma.user.findMany({
            where: {
                parentId: admin.id,
            },
            select: {
                id: true,
                name: true,
                email: true,
                balance: true,
                createdAt: true,
            },
        });

        return NextResponse.json(callers);
    } catch (error) {
        console.error("Error fetching callers:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

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

        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "Email already registered" },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create new caller
        const caller = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                parentId: admin.id,
            },
            select: {
                id: true,
                name: true,
                email: true,
                balance: true,
                createdAt: true,
            },
        });

        return NextResponse.json(caller);
    } catch (error) {
        console.error("Error creating caller:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 