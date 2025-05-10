import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth.config";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authConfig);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const sessionUser = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!sessionUser || !sessionUser.admin) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 404 }
            );
        }


        const { name, email, password, admin } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Check if caller already exists
        const existingCaller = await prisma.user.findUnique({
            where: { email },
        });

        if (existingCaller) {
            return NextResponse.json(
                { error: "Email already registered" },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create new user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                admin: admin || false,
                parentId: sessionUser.id, // Set the parentId to the logged-in user's ID
            },
        });

        // Remove password from response
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...callerWithoutPassword } = user;

        return NextResponse.json(callerWithoutPassword);
    } catch (error) {
        console.error("Error registering user:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 