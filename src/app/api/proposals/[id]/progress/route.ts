// src/app/api/proposals/[id]/progress/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import prisma from "@/lib/prisma";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
    ) {
    const session = await getServerSession(authOptions);
    const currentUser = (session?.user as any);
    if (!currentUser?.id) {
        return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    const resolvedParams = await params;
    const proposalId = parseInt(resolvedParams.id, 10);

    try {
        const body = await request.json();
        const { luaranWajibProgress, luaranTambahanProgress } = body;

        const proposal = await prisma.proposal.findUnique({
        where: { id: proposalId },
        });

        if (!proposal || proposal.userIdKetua !== currentUser.id) {
            return new NextResponse(JSON.stringify({ message: "Aksi tidak diizinkan" }), { status: 403 });
        }

        const updatedProposal = await prisma.proposal.update({
        where: { id: proposalId },
        data: {
            detailProposal: {
                ...(proposal.detailProposal as any),
                luaranWajibProgress,
                luaranTambahanProgress,
            },
        },
        });

        return NextResponse.json(updatedProposal);
    } catch (error) {
        console.error("PROGRESS_UPDATE_ERROR", error);
        return new NextResponse(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
}
