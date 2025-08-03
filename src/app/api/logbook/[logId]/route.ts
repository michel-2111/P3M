// src/app/api/logbook/[logId]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import prisma from "@/lib/prisma";

export async function PATCH(
    request: Request,
    { params }: { params: { logId: string } }
    ) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const logId = parseInt(params.logId, 10);
        const body = await request.json();
        const { tanggal, kegiatan, bukti } = body;

        const updatedEntry = await prisma.logbookEntry.update({
        where: { id: logId },
        data: {
            tanggal: new Date(tanggal),
            kegiatan,
            bukti,
        },
        });
        return NextResponse.json(updatedEntry);
    } catch (error) {
        console.error("LOGBOOK_UPDATE_ERROR", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
    }

    export async function DELETE(
    request: Request,
    { params }: { params: { logId: string } }
        ) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const logId = parseInt(params.logId, 10);
        await prisma.logbookEntry.delete({
            where: { id: logId },
        });
        return NextResponse.json({ message: "Entri berhasil dihapus." });
    } catch (error) {
        console.error("LOGBOOK_DELETE_ERROR", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
