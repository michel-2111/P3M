// src/app/api/proposals/[id]/complete/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import prisma from "@/lib/prisma";

export async function PATCH(
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
        const { detailProposal, dokumenDiunggah } = body;

        const proposal = await prisma.proposal.findUnique({
        where: { id: proposalId },
        });

        if (!proposal) {
            return new NextResponse(JSON.stringify({ message: "Proposal tidak ditemukan" }), { status: 404 });
        }

        if (proposal.userIdKetua !== currentUser.id) {
            return new NextResponse(JSON.stringify({ message: "Aksi tidak diizinkan" }), { status: 403 });
        }

        const updatedProposal = await prisma.proposal.update({
        where: { id: proposalId },
        data: {
            detailProposal,
            dokumenDiunggah,
            status: "Diajukan",
        },
        });

        const admins = await prisma.user.findMany({ where: { peran: { array_contains: ['admin_p3m'] } } });
        const notifications = admins.map(admin => ({
            userId: admin.id,
            pesan: `Proposal "${updatedProposal.judul}" telah dilengkapi dan siap untuk direview.`,
            link: '/dashboard'
        }));

        if (notifications.length > 0) {
            await prisma.notification.createMany({ data: notifications });
        }

        return NextResponse.json(updatedProposal);
    } catch (error) {
        console.error("PROPOSAL_COMPLETE_ERROR", error);
        return new NextResponse(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
}
