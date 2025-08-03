// src/app/api/proposals/[id]/logbook/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import prisma from "@/lib/prisma";

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    const currentUser = (session?.user as any);
    if (!currentUser?.id) {
        return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    const proposalId = parseInt(params.id, 10);

    try {
        const body = await request.json();
        const { tanggal, kegiatan, bukti } = body;

        if (!tanggal || !kegiatan) {
            return new NextResponse(JSON.stringify({ message: "Tanggal dan kegiatan tidak boleh kosong." }), { status: 400 });
        }

        const proposal = await prisma.proposal.findUnique({
            where: { id: proposalId },
        });

        if (!proposal || proposal.userIdKetua !== currentUser.id) {
            return new NextResponse(JSON.stringify({ message: "Aksi tidak diizinkan" }), { status: 403 });
        }

        const newLogEntry = await prisma.logbookEntry.create({
            data: {
                proposalId,
                tanggal: new Date(tanggal),
                kegiatan,
                bukti: bukti || [],
            }
        });

        return NextResponse.json(newLogEntry);
    } catch (error) {
        console.error("LOGBOOK_CREATE_ERROR", error);
        return new NextResponse(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
}