// src/app/api/proposals/[id]/assign-reviewers/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!(session?.user as any)?.peran?.includes('admin_p3m')) {
        return new NextResponse(JSON.stringify({ message: "Akses ditolak" }), { status: 403 });
    }

    const proposalId = parseInt(params.id, 10);
    const { reviewerIds, type } = await request.json();

    try {
        if (!Array.isArray(reviewerIds) || reviewerIds.length === 0 || !type) {
            return new NextResponse(JSON.stringify({ message: "Data tidak lengkap." }), { status: 400 });
        }
        if (new Set(reviewerIds).size !== reviewerIds.length) {
            return new NextResponse(JSON.stringify({ message: "Reviewer tidak boleh orang yang sama." }), { status: 400 });
        }

        if (type === 'SUBSTANCE') { await prisma.proposal.update({ where: { id: proposalId }, data: { status: 'Direview' },
            });
        } else if (type === 'OUTPUT_KEMAJUAN') { await prisma.proposal.update({ where: { id: proposalId }, data: { progressReportStatus: 'IN_REVIEW' },
            });
        } else if (type === 'OUTPUT_AKHIR') { await prisma.proposal.update({ where: { id: proposalId }, data: { finalReportStatus: 'IN_REVIEW' },
            });
        } else {
            return new NextResponse(JSON.stringify({ message: "Tipe review tidak valid." }), { status: 400 });
        }
        
        const proposal = await prisma.proposal.findUnique({ where: { id: proposalId } });
        if (!proposal) {
            throw new Error("Proposal tidak ditemukan setelah pembaruan.");
        }

        const reviewData: Prisma.ReviewCreateManyInput[] = reviewerIds.map((reviewerId: string) => ({
            proposalId, 
            reviewerId, 
            type, 
            skor: {},
        }));
        await prisma.review.createMany({ data: reviewData });

        const notifications = reviewerIds.map((reviewerId: string) => ({
            userId: reviewerId,
            pesan: `Anda ditugaskan untuk mereview proposal "${proposal.judul}".`,
            link: '/review_tasks'
        }));
        await prisma.notification.createMany({ data: notifications });

        return NextResponse.json({ message: "Reviewer berhasil ditugaskan." });
    } catch (error) {
        console.error("ASSIGN_REVIEWER_ERROR", error);
        return new NextResponse(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
}