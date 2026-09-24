export { default } from "next-auth/middleware";

import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Secret for JWT verification
const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret });

    const isAdminRoute = req.nextUrl.pathname.startsWith("/callers") || req.nextUrl.pathname.startsWith("/monitoring") || req.nextUrl.pathname.startsWith("/auth/register");

    // If not logged in at all, redirect to sign-in
    if (!token) {
        return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    // If user is not admin and trying to access an admin-only page, block access
    if (isAdminRoute && !token.admin) {
        return NextResponse.redirect(new URL("/not-authorized", req.url)); // You should create this page
    }

    return NextResponse.next();
}


export const config = {
    matcher: [
        "/",
        "/caller/:path*",
        "/callers/:path*",
        "/monitoring/:path*",
        "/auth/register/:path*",
    ],

};
