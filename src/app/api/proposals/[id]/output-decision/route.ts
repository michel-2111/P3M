// src/app/api/proposals/[id]/output-decision/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import prisma from "@/lib/prisma";

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!(session?.user as any)?.peran?.includes('admin_p3m')) {
        return new NextResponse("Unauthorized", { status: 403 });
    }

    const proposalId = parseInt(params.id, 10);
    const { decision, type }: { decision: 'Lengkap' | 'Tidak Lengkap', type: 'OUTPUT_KEMAJUAN' | 'OUTPUT_AKHIR' } = await request.json();

    try {
        let updateData = {};
        if (type === 'OUTPUT_KEMAJUAN') {
            updateData = { progressReportStatus: decision };
        } else if (type === 'OUTPUT_AKHIR') {
            updateData = { 
                finalReportStatus: decision,
                status: decision === 'Lengkap' ? 'Selesai' : undefined 
            };
        }

        const proposal = await prisma.proposal.update({
            where: { id: proposalId },
            data: updateData
        });

        await prisma.notification.create({
            data: {
                userId: proposal.userIdKetua,
                pesan: `Hasil review untuk ${type === 'OUTPUT_KEMAJUAN' ? 'Laporan Kemajuan' : 'Laporan Akhir'} proposal "${proposal.judul}" adalah: ${decision}.`,
                link: '/my_proposals'
            }
        });

        return NextResponse.json({ message: "Keputusan berhasil disimpan." });
    } catch (error) {
        console.error("OUTPUT_DECISION_ERROR", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}