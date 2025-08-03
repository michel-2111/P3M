// src/app/api/notifications/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import prisma from "@/lib/prisma";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any)?.id) {
        return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }
    
    const resolvedParams = await params;
    const notificationId = parseInt(resolvedParams.id, 10);

    try {
        await prisma.notification.update({
            where: {
                id: notificationId,
                userId: (session.user as any).id, 
            },
            data: {
                sudahDibaca: true,
            },
        });

        return NextResponse.json({ message: "Notifikasi diperbarui." });
    } catch (error) {
        console.error("NOTIFICATION_UPDATE_ERROR", error);
        return new NextResponse(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
}