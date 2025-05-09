import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Check if caller already exists
        const existingCaller = await prisma.caller.findUnique({
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

        // Create new caller
        const caller = await prisma.caller.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        // Remove password from response
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...callerWithoutPassword } = caller;

        return NextResponse.json(callerWithoutPassword);
    } catch (error) {
        console.error("Error registering caller:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 