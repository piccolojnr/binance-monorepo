import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import prisma from "./prisma";

export const authConfig: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }

                const caller = await prisma.caller.findUnique({
                    where: {
                        email: credentials.email
                    }
                });

                if (!caller) {
                    throw new Error("Invalid credentials");
                }

                const isPasswordValid = await compare(credentials.password, caller.password);

                if (!isPasswordValid) {
                    throw new Error("Invalid credentials");
                }

                return {
                    id: caller.id,
                    email: caller.email,
                    name: caller.name
                };

            }
        })
    ],
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: "/auth/signin"
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id as string;
            }
            return session;
        }
    }
}; 