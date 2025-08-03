// src/lib/auth.ts

import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma"; // Pastikan path prisma ini benar

// TAMBAHKAN 'export' DI SINI
export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
        // ...isi provider Anda...
        name: "Credentials",
        credentials: {
            nidnNim: { label: "NIDN/NIM", type: "text" },
            password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
            if (!credentials?.nidnNim || !credentials.password) {
                return null;
            }
            const user = await prisma.user.findUnique({
                where: { nidnNim: credentials.nidnNim },
            });
            if (!user) {
                return null;
            }
            const isPasswordValid = await bcrypt.compare(
                credentials.password,
                user.password
            );
            if (isPasswordValid) {
                return {
                    id: user.id,
                    name: user.namaLengkap,
                    peran: user.peran,
                };
            }
            return null;
        },
        }),
    ],
    // ...sisa konfigurasi Anda: pages, session, callbacks, secret...
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.peran = (user as any).peran;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).peran = token.peran;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};