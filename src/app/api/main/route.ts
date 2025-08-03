// src/app/api/main/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth'; 
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
    const session = await getServerSession(authOptions);
    const currentUserId = (session?.user as any)?.id;
    if (!currentUserId) {
        return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }
    
    try {
        const [currentUser, users, programs, proposals, reviews, settingsResult] = await Promise.all([
            prisma.user.findUnique({ 
                where: { id: currentUserId },
                include: { notifications: true }
            }),
            prisma.user.findMany(),
            prisma.program.findMany(),
            prisma.proposal.findMany({
            include: {
                ketua: true,
                program: true,
                anggotaTim: { include: { user: true } },
                logbookEntries: true,
            },
            orderBy: { id: 'desc' }
            }),
            prisma.review.findMany(),
            prisma.setting.findMany(),
        ]);

        const settings = settingsResult.reduce((acc, setting) => {
            (acc as any)[setting.settingKey] = setting.settingValue;
            return acc;
        }, {});

        return NextResponse.json({ currentUser, users, programs, proposals, reviews, settings });
    } catch (error) {
        console.error("API_FETCH_ERROR", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}