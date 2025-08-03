// src/app/api/proposals/[id]/resubmit/route.ts
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
        const { judul, abstrak, detailProposal, dokumenDiunggah } = body;

        const proposal = await prisma.proposal.findUnique({
        where: { id: proposalId },
        });

        if (!proposal || proposal.userIdKetua !== currentUser.id) {
            return new NextResponse(JSON.stringify({ message: "Aksi tidak diizinkan" }), { status: 403 });
        }

        const updatedProposal = await prisma.proposal.update({
        where: { id: proposalId },
        data: {
            judul,
            abstrak,
            dokumenDiunggah,
            detailProposal,
            status: "Direvisi",
        },
        });

        const admins = await prisma.user.findMany({ where: { peran: { array_contains: ['admin_p3m'] } } });
        const notifications = admins.map(admin => ({
            userId: admin.id,
            pesan: `Proposal "${updatedProposal.judul}" telah direvisi dan menunggu keputusan akhir.`,
            link: '/dashboard'
        }));

        if (notifications.length > 0) {
            await prisma.notification.createMany({ data: notifications });
        }

        return NextResponse.json(updatedProposal);
    } catch (error) {
        console.error("PROPOSAL_RESUBMIT_ERROR", error);
        return new NextResponse(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
}
